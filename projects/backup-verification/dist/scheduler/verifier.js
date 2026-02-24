"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupVerifier = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const checksum_1 = require("../validators/checksum");
const restore_1 = require("../checkers/restore");
const retention_1 = require("../checkers/retention");
const cloud_1 = require("../storage/cloud");
const logger_1 = require("../utils/logger");
const report_1 = require("../utils/report");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class BackupVerifier {
    config;
    restoreTester;
    retentionManager;
    reportGenerator;
    logger;
    constructor(config) {
        this.config = config;
        this.logger = (0, logger_1.createLogger)(config.logLevel);
        this.restoreTester = new restore_1.RestoreTester(config.tempDir);
        this.retentionManager = new retention_1.RetentionManager();
        this.reportGenerator = new report_1.ReportGenerator();
    }
    async verify(verificationConfig) {
        const startTime = Date.now();
        const result = {
            name: verificationConfig.name,
            timestamp: new Date(),
            success: false,
            duration: 0,
            checksumValid: false,
            errors: [],
            warnings: [],
        };
        this.logger.info(`Starting verification: ${verificationConfig.name}`);
        try {
            // Step 1: Get backup file/path
            const backupPath = await this.getBackupPath(verificationConfig.source);
            // Step 2: Verify checksum
            if (verificationConfig.verifyChecksum) {
                const checksumResult = await this.verifyChecksum(verificationConfig, backupPath);
                result.checksumValid = checksumResult.valid;
                result.checksumDetails = checksumResult.details;
                if (!result.checksumValid) {
                    result.errors.push(`Checksum verification failed: expected ${checksumResult.details?.expected}, got ${checksumResult.details?.actual}`);
                }
            }
            else {
                result.checksumValid = true; // Skipped
            }
            // Step 3: Test restore if enabled
            if (verificationConfig.testRestore) {
                const restoreResult = await this.restoreTester.testRestore(verificationConfig, backupPath);
                result.restoreTest = {
                    attempted: true,
                    success: restoreResult.success,
                    path: restoreResult.path,
                    error: restoreResult.error,
                };
                if (!restoreResult.success) {
                    result.errors.push(`Restore test failed: ${restoreResult.error}`);
                }
                // Cleanup restore test files
                if (restoreResult.path && !verificationConfig.restorePath) {
                    await this.restoreTester.cleanup(restoreResult.path);
                }
            }
            else {
                result.restoreTest = {
                    attempted: false,
                    success: true,
                };
            }
            // Step 4: Apply retention policy
            if (verificationConfig.retention) {
                const retentionResult = await this.applyRetention(verificationConfig, backupPath);
                result.retention = retentionResult;
            }
            // Determine overall success
            result.success = result.checksumValid &&
                (!result.restoreTest.attempted || result.restoreTest.success) &&
                result.errors.length === 0;
        }
        catch (error) {
            result.success = false;
            result.errors.push(error instanceof Error ? error.message : String(error));
            this.logger.error(`Verification failed for ${verificationConfig.name}:`, error);
        }
        result.duration = Date.now() - startTime;
        this.logger.info(`Verification completed: ${verificationConfig.name} - ${result.success ? 'SUCCESS' : 'FAILED'}`);
        return result;
    }
    async verifyAll() {
        const results = [];
        for (const verification of this.config.verifications) {
            if (!verification.enabled) {
                this.logger.debug(`Skipping disabled verification: ${verification.name}`);
                continue;
            }
            const result = await this.verify(verification);
            results.push(result);
        }
        const failed = results.filter(r => !r.success).length;
        const report = {
            timestamp: new Date(),
            total: results.length,
            passed: results.length - failed,
            failed,
            results,
            summary: failed === 0 ? 'All verifications passed' : `${failed} verification(s) failed`,
        };
        // Generate report files
        this.reportGenerator.generate(report);
        // Print console report
        console.log(this.reportGenerator.generateConsoleReport(report));
        return report;
    }
    async getBackupPath(source) {
        switch (source.type) {
            case 'file':
                if (!fs.existsSync(source.path)) {
                    throw new Error(`Backup file/directory not found: ${source.path}`);
                }
                return source.path;
            case 'database':
                if (!fs.existsSync(source.backupPath)) {
                    throw new Error(`Database backup not found: ${source.backupPath}`);
                }
                return source.backupPath;
            case 's3':
            case 'gcs':
            case 'azure': {
                const provider = cloud_1.StorageProviderFactory.getProvider(source.type);
                const downloadResult = await provider.download(source, this.config.tempDir);
                return downloadResult.localPath;
            }
            default:
                throw new Error(`Unsupported backup source type: ${source.type}`);
        }
    }
    async verifyChecksum(config, backupPath) {
        const stats = await fs.promises.stat(backupPath);
        if (stats.isDirectory()) {
            // For directories, verify all files with checksums
            return this.verifyDirectoryChecksum(config, backupPath);
        }
        // Single file verification
        let expectedChecksum;
        if (config.source.type === 'file') {
            if (config.source.expectedChecksum) {
                expectedChecksum = config.source.expectedChecksum;
            }
            else if (config.source.checksumFile) {
                const verification = await checksum_1.ChecksumValidator.verifyFromChecksumFile(backupPath, config.source.checksumFile, config.checksumAlgorithm);
                return {
                    valid: verification.valid,
                    details: {
                        algorithm: config.checksumAlgorithm,
                        expected: verification.expected,
                        actual: verification.actual,
                        match: verification.valid,
                    },
                };
            }
        }
        const { hash: actual } = await checksum_1.ChecksumValidator.calculate(backupPath, config.checksumAlgorithm);
        if (expectedChecksum) {
            const valid = actual.toLowerCase() === expectedChecksum.toLowerCase();
            return {
                valid,
                details: {
                    algorithm: config.checksumAlgorithm,
                    expected: expectedChecksum,
                    actual,
                    match: valid,
                },
            };
        }
        // No expected checksum, just calculate and report
        return {
            valid: true,
            details: {
                algorithm: config.checksumAlgorithm,
                actual,
                match: true,
            },
        };
    }
    async verifyDirectoryChecksum(config, dirPath) {
        if (config.source.type !== 'file' || !config.source.checksumFile) {
            // No checksum file specified, skip verification
            return { valid: true };
        }
        const checksums = await checksum_1.ChecksumValidator.parseChecksumFile(config.source.checksumFile);
        const errors = [];
        let verifiedCount = 0;
        for (const [filename, expectedHash] of checksums) {
            const filePath = path.join(dirPath, filename);
            if (!fs.existsSync(filePath)) {
                errors.push(`File not found: ${filename}`);
                continue;
            }
            const { valid, actual } = await checksum_1.ChecksumValidator.verify(filePath, expectedHash, config.checksumAlgorithm);
            if (!valid) {
                errors.push(`${filename}: checksum mismatch (expected ${expectedHash}, got ${actual})`);
            }
            else {
                verifiedCount++;
            }
        }
        return {
            valid: errors.length === 0,
            details: {
                algorithm: config.checksumAlgorithm,
                verifiedFiles: verifiedCount,
                failedFiles: errors.length,
                errors,
            },
        };
    }
    async applyRetention(config, backupPath) {
        const stats = await fs.promises.stat(backupPath);
        const backupDir = stats.isDirectory() ? backupPath : path.dirname(backupPath);
        return this.retentionManager.applyRetention(config, backupDir);
    }
    getEnabledVerifications() {
        return this.config.verifications.filter(v => v.enabled);
    }
    getVerification(name) {
        return this.config.verifications.find(v => v.name === name);
    }
}
exports.BackupVerifier = BackupVerifier;
//# sourceMappingURL=verifier.js.map