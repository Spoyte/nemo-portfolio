"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const storage_1 = require("../storage");
const logger_1 = require("../utils/logger");
class BackupService {
    async listBackups(source, page = 1, limit = 50) {
        const storage = storage_1.StorageFactory.createBackend(source);
        const files = await storage.listFiles(source.path || '');
        const total = files.length;
        const start = (page - 1) * limit;
        const paginatedFiles = files.slice(start, start + limit);
        return { backups: paginatedFiles, total };
    }
    async getBackupMetadata(source, filePath) {
        const storage = storage_1.StorageFactory.createBackend(source);
        const metadata = await storage.getFileMetadata(filePath);
        return {
            name: metadata.name || '',
            path: metadata.path || filePath,
            size: metadata.size || 0,
            modifiedAt: metadata.modifiedAt || new Date(),
            checksum: metadata.checksum,
        };
    }
    async testConnection(source) {
        try {
            const storage = storage_1.StorageFactory.createBackend(source);
            return await storage.testConnection();
        }
        catch (error) {
            logger_1.logger.error('Connection test failed:', error);
            return false;
        }
    }
}
exports.BackupService = BackupService;
exports.default = BackupService;
//# sourceMappingURL=backup.js.map