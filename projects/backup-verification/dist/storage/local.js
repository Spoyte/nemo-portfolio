"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageBackend = void 0;
const base_1 = require("./base");
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
class LocalStorageBackend extends base_1.BaseStorageBackend {
    localConfig;
    constructor(config) {
        super(config);
        this.localConfig = config;
    }
    async listFiles(dirPath) {
        const fullPath = this.getFullPath(dirPath);
        const files = [];
        try {
            const entries = await promises_1.default.readdir(fullPath, { withFileTypes: true });
            for (const entry of entries) {
                const entryPath = path_1.default.join(fullPath, entry.name);
                const relativePath = path_1.default.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    const subFiles = await this.listFiles(relativePath);
                    files.push(...subFiles);
                }
                else {
                    const stats = await promises_1.default.stat(entryPath);
                    files.push({
                        name: entry.name,
                        path: this.normalizePath(relativePath),
                        size: stats.size,
                        modifiedAt: stats.mtime,
                    });
                }
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to list files in ${fullPath}:`, error);
            throw error;
        }
        return files;
    }
    async downloadFile(remotePath, localPath) {
        const sourcePath = this.getFullPath(remotePath);
        try {
            await promises_1.default.mkdir(path_1.default.dirname(localPath), { recursive: true });
            return new Promise((resolve, reject) => {
                const readStream = (0, fs_1.createReadStream)(sourcePath);
                const writeStream = (0, fs_1.createWriteStream)(localPath);
                readStream.on('error', reject);
                writeStream.on('error', reject);
                writeStream.on('finish', resolve);
                readStream.pipe(writeStream);
            });
        }
        catch (error) {
            logger_1.logger.error(`Failed to download file from ${sourcePath}:`, error);
            throw error;
        }
    }
    async downloadStream(remotePath) {
        const sourcePath = this.getFullPath(remotePath);
        try {
            return (0, fs_1.createReadStream)(sourcePath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to create read stream for ${sourcePath}:`, error);
            throw error;
        }
    }
    async uploadFile(localPath, remotePath) {
        const destPath = this.getFullPath(remotePath);
        try {
            await promises_1.default.mkdir(path_1.default.dirname(destPath), { recursive: true });
            return new Promise((resolve, reject) => {
                const readStream = (0, fs_1.createReadStream)(localPath);
                const writeStream = (0, fs_1.createWriteStream)(destPath);
                readStream.on('error', reject);
                writeStream.on('error', reject);
                writeStream.on('finish', resolve);
                readStream.pipe(writeStream);
            });
        }
        catch (error) {
            logger_1.logger.error(`Failed to upload file to ${destPath}:`, error);
            throw error;
        }
    }
    async deleteFile(filePath) {
        const fullPath = this.getFullPath(filePath);
        try {
            await promises_1.default.unlink(fullPath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete file ${fullPath}:`, error);
            throw error;
        }
    }
    async fileExists(filePath) {
        const fullPath = this.getFullPath(filePath);
        try {
            await promises_1.default.access(fullPath);
            return true;
        }
        catch {
            return false;
        }
    }
    async getFileMetadata(filePath) {
        const fullPath = this.getFullPath(filePath);
        try {
            const stats = await promises_1.default.stat(fullPath);
            return {
                name: path_1.default.basename(filePath),
                path: this.normalizePath(filePath),
                size: stats.size,
                modifiedAt: stats.mtime,
            };
        }
        catch (error) {
            logger_1.logger.error(`Failed to get metadata for ${fullPath}:`, error);
            throw error;
        }
    }
    async testConnection() {
        try {
            await promises_1.default.access(this.localConfig.path);
            return true;
        }
        catch {
            return false;
        }
    }
    getFullPath(relativePath) {
        return path_1.default.join(this.localConfig.path, relativePath);
    }
}
exports.LocalStorageBackend = LocalStorageBackend;
//# sourceMappingURL=local.js.map