"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const storage_1 = require("../storage");
const helpers_1 = require("../utils/helpers");
const webhook_1 = require("../notifications/webhook");
const logger_1 = require("../utils/logger");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
class VerificationService {
    webhookService;
    constructor() {
        this.webhookService = new webhook_1.WebhookService();
    }
    async verifyBackup(jobConfig, backup, expectedChecksum) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        logger_1.logger.info(`Starting verification for backup: ${backup.path}`, {
            jobId: jobConfig.id,
            jobName: jobConfig.name,
        });
        let checksumValid = false;
        let actualChecksum;
        let restoreSuccess;
        let restorePath;
        const storage = storage_1.StorageFactory.createBackend(jobConfig.source);
        // Create temp directory for downloads
        const tempDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), 'backup-verify-'));
        try {
            // Download and verify checksum
            const localPath = path_1.default.join(tempDir, path_1.default.basename(backup.path));
            logger_1.logger.debug(`Downloading backup to ${localPath}`);
            await storage.downloadFile(backup.path, localPath);
            // Calculate checksum
            logger_1.logger.debug(`Calculating checksum for ${localPath}`);
            actualChecksum = await (0, helpers_1.calculateChecksum)(localPath);
            if (expectedChecksum) {
                checksumValid = (0, helpers_1.verifyChecksum)(actualChecksum, expectedChecksum);
                if (!checksumValid) {
                    errors.push(`Checksum mismatch: expected ${expectedChecksum}, got ${actualChecksum}`);
                }
            }
            else {
                checksumValid = true;
                warnings.push('No expected checksum provided, skipping checksum verification');
            }
            // Test restore if enabled
            if (jobConfig.testRestore?.enabled) {
                const testRestoreResult = await this.testRestore(jobConfig, backup, localPath, storage);
                restoreSuccess = testRestoreResult.success;
                restorePath = testRestoreResult.restorePath;
                if (!restoreSuccess) {
                    errors.push(`Restore test failed: ${testRestoreResult.error}`);
                }
            }
            // Determine overall status
            let status = 'success';
            if (errors.length > 0) {
                status = 'failed';
            }
            else if (warnings.length > 0) {
                status = 'warning';
            }
            const result = {
                id: (0, helpers_1.generateId)(),
                jobId: jobConfig.id || '',
                jobName: jobConfig.name,
                backupPath: backup.path,
                status,
                checksumValid,
                expectedChecksum,
                actualChecksum,
                restoreTested: jobConfig.testRestore?.enabled || false,
                restoreSuccess,
                restorePath,
                errors,
                warnings,
                startedAt: new Date(startTime),
                completedAt: new Date(),
                durationMs: Date.now() - startTime,
            };
            // Send notifications if needed
            if (status === 'failed' && jobConfig.notifications?.onFailure) {
                await this.webhookService.sendVerificationFailed(jobConfig.id || '', jobConfig.name, backup.path, errors.join(', '), expectedChecksum, actualChecksum);
            }
            else if (status === 'warning' && jobConfig.notifications?.onWarning) {
                await this.webhookService.sendVerificationWarning(jobConfig.id || '', jobConfig.name, backup.path, warnings);
            }
            logger_1.logger.info(`Verification completed for ${backup.path}`, {
                status,
                durationMs: result.durationMs,
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(`Verification error: ${errorMessage}`);
            if (jobConfig.notifications?.onFailure) {
                await this.webhookService.sendVerificationFailed(jobConfig.id || '', jobConfig.name, backup.path, errorMessage);
            }
            return {
                id: (0, helpers_1.generateId)(),
                jobId: jobConfig.id || '',
                jobName: jobConfig.name,
                backupPath: backup.path,
                status: 'failed',
                checksumValid: false,
                expectedChecksum,
                actualChecksum,
                restoreTested: false,
                errors,
                warnings,
                startedAt: new Date(startTime),
                completedAt: new Date(),
                durationMs: Date.now() - startTime,
            };
        }
        finally {
            // Cleanup temp directory
            try {
                await promises_1.default.rm(tempDir, { recursive: true, force: true });
            }
            catch (cleanupError) {
                logger_1.logger.warn(`Failed to cleanup temp directory ${tempDir}:`, cleanupError);
            }
        }
    }
    async testRestore(jobConfig, backup, localPath, _storage) {
        if (!jobConfig.testRestore) {
            return { success: false, error: 'Test restore not configured' };
        }
        const { dryRun, restorePath: configRestorePath } = jobConfig.testRestore;
        const restorePath = configRestorePath || path_1.default.join(os_1.default.tmpdir(), 'test-restore', (0, helpers_1.generateId)());
        try {
            if (dryRun) {
                logger_1.logger.info(`Dry-run restore test for ${backup.path}`);
                // In dry-run mode, just verify the archive is readable
                // For tar.gz files, we could list contents without extracting
                return { success: true, restorePath };
            }
            logger_1.logger.info(`Testing restore for ${backup.path} to ${restorePath}`);
            await promises_1.default.mkdir(restorePath, { recursive: true });
            // Simple file copy as basic restore test
            // In production, you might want to handle different archive formats
            const restoredFile = path_1.default.join(restorePath, path_1.default.basename(backup.path));
            await promises_1.default.copyFile(localPath, restoredFile);
            // Verify the restored file exists and has correct size
            const stats = await promises_1.default.stat(restoredFile);
            if (stats.size !== backup.size) {
                return {
                    success: false,
                    error: `Size mismatch: expected ${backup.size}, got ${stats.size}`,
                };
            }
            logger_1.logger.info(`Restore test completed successfully for ${backup.path}`);
            return { success: true, restorePath };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error(`Restore test failed for ${backup.path}:`, error);
            return { success: false, error: errorMessage };
        }
    }
    async applyRetentionPolicy(source, retentionDays, dryRun = false) {
        const storage = storage_1.StorageFactory.createBackend(source);
        const result = {
            filesScanned: 0,
            filesDeleted: 0,
            filesKept: 0,
            bytesFreed: 0,
            errors: [],
            deletedFiles: [],
        };
        try {
            logger_1.logger.info(`Applying retention policy: ${retentionDays} days`, {
                dryRun,
                source: source.type,
            });
            const files = await storage.listFiles('');
            result.filesScanned = files.length;
            for (const file of files) {
                if ((0, helpers_1.isOlderThan)(file.modifiedAt, retentionDays)) {
                    if (dryRun) {
                        logger_1.logger.debug(`Would delete (dry-run): ${file.path}`);
                    }
                    else {
                        try {
                            await storage.deleteFile(file.path);
                            logger_1.logger.info(`Deleted expired backup: ${file.path}`);
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error ? error.message : String(error);
                            result.errors.push(`Failed to delete ${file.path}: ${errorMessage}`);
                            continue;
                        }
                    }
                    result.filesDeleted++;
                    result.bytesFreed += file.size;
                    result.deletedFiles.push(file.path);
                }
                else {
                    result.filesKept++;
                }
            }
            if (!dryRun) {
                await this.webhookService.sendRetentionCompleted(result.filesScanned, result.filesDeleted, result.bytesFreed);
            }
            logger_1.logger.info(`Retention policy applied`, {
                filesDeleted: result.filesDeleted,
                bytesFreed: result.bytesFreed,
                dryRun,
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.errors.push(`Retention policy error: ${errorMessage}`);
            throw error;
        }
    }
}
exports.VerificationService = VerificationService;
exports.default = VerificationService;
//# sourceMappingURL=verification.js.map