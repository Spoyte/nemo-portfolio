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
exports.RetentionManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class RetentionManager {
    async applyRetention(config, backupDir) {
        if (!config.retention) {
            return {
                deleted: 0,
                kept: 0,
                errors: [],
                deletedFiles: [],
            };
        }
        const result = {
            deleted: 0,
            kept: 0,
            errors: [],
            deletedFiles: [],
        };
        try {
            const backups = await this.listBackups(backupDir);
            if (backups.length === 0) {
                return result;
            }
            // Sort by modified time (newest first)
            backups.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime());
            const now = new Date();
            const cutoffDate = new Date(now.getTime() - config.retention.days * 24 * 60 * 60 * 1000);
            const filesToDelete = [];
            const filesToKeep = [];
            // First, identify files to keep based on keepLast policy
            let keepCount = 0;
            for (const backup of backups) {
                if (config.retention.keepLast && keepCount < config.retention.keepLast) {
                    filesToKeep.push(backup);
                    keepCount++;
                }
                else if (backup.modifiedTime >= cutoffDate) {
                    filesToKeep.push(backup);
                }
                else {
                    filesToDelete.push(backup);
                }
            }
            // Delete old files
            for (const file of filesToDelete) {
                try {
                    await fs.promises.unlink(file.path);
                    result.deleted++;
                    result.deletedFiles.push(file.path);
                }
                catch (error) {
                    result.errors.push(`Failed to delete ${file.path}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            result.kept = filesToKeep.length;
            return result;
        }
        catch (error) {
            result.errors.push(`Retention policy error: ${error instanceof Error ? error.message : String(error)}`);
            return result;
        }
    }
    async listBackups(backupDir) {
        const stats = await fs.promises.stat(backupDir);
        if (!stats.isDirectory()) {
            // Single file backup
            return [{
                    path: backupDir,
                    name: path.basename(backupDir),
                    size: stats.size,
                    modifiedTime: stats.mtime,
                }];
        }
        const entries = await fs.promises.readdir(backupDir, { withFileTypes: true });
        const backups = [];
        for (const entry of entries) {
            if (entry.isFile()) {
                const filePath = path.join(backupDir, entry.name);
                const stats = await fs.promises.stat(filePath);
                backups.push({
                    path: filePath,
                    name: entry.name,
                    size: stats.size,
                    modifiedTime: stats.mtime,
                });
            }
        }
        return backups;
    }
    async getBackupStats(backupDir) {
        const backups = await this.listBackups(backupDir);
        if (backups.length === 0) {
            return {
                totalFiles: 0,
                totalSize: 0,
            };
        }
        const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
        const sorted = [...backups].sort((a, b) => a.modifiedTime.getTime() - b.modifiedTime.getTime());
        return {
            totalFiles: backups.length,
            totalSize,
            oldestBackup: sorted[0].modifiedTime,
            newestBackup: sorted[sorted.length - 1].modifiedTime,
        };
    }
    async cleanupEmptyDirs(dir) {
        let cleaned = 0;
        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subDir = path.join(dir, entry.name);
                    cleaned += await this.cleanupEmptyDirs(subDir);
                }
            }
            // Check if directory is now empty
            const remaining = await fs.promises.readdir(dir);
            if (remaining.length === 0) {
                await fs.promises.rmdir(dir);
                cleaned++;
            }
        }
        catch {
            // Ignore errors (e.g., permission denied)
        }
        return cleaned;
    }
}
exports.RetentionManager = RetentionManager;
//# sourceMappingURL=retention.js.map