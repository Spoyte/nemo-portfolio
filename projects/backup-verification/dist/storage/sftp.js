"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SFTPStorageBackend = void 0;
const base_1 = require("./base");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
const promises_1 = __importDefault(require("fs/promises"));
class SFTPStorageBackend extends base_1.BaseStorageBackend {
    sftpConfig;
    constructor(config) {
        super(config);
        this.sftpConfig = config;
    }
    async getClient() {
        const client = new ssh2_sftp_client_1.default();
        const connectOptions = {
            host: this.sftpConfig.host,
            port: this.sftpConfig.port,
            username: this.sftpConfig.username,
        };
        if (this.sftpConfig.privateKeyPath) {
            const privateKey = await promises_1.default.readFile(this.sftpConfig.privateKeyPath);
            connectOptions.privateKey = privateKey;
        }
        else if (this.sftpConfig.password) {
            connectOptions.password = this.sftpConfig.password;
        }
        await client.connect(connectOptions);
        return client;
    }
    async listFiles(remotePath) {
        const client = await this.getClient();
        const files = [];
        try {
            const fullPath = path_1.default.posix.join(this.sftpConfig.path, remotePath);
            const list = await client.list(fullPath);
            for (const item of list) {
                const itemPath = path_1.default.posix.join(remotePath, item.name);
                if (item.type === 'd') {
                    const subFiles = await this.listFiles(itemPath);
                    files.push(...subFiles);
                }
                else {
                    files.push({
                        name: item.name,
                        path: this.normalizePath(itemPath),
                        size: item.size,
                        modifiedAt: new Date(item.modifyTime),
                    });
                }
            }
        }
        catch (error) {
            logger_1.logger.error(`Failed to list files in SFTP path ${remotePath}:`, error);
            throw error;
        }
        finally {
            await client.end();
        }
        return files;
    }
    async downloadFile(remotePath, localPath) {
        const client = await this.getClient();
        try {
            await promises_1.default.mkdir(path_1.default.dirname(localPath), { recursive: true });
            const fullRemotePath = path_1.default.posix.join(this.sftpConfig.path, remotePath);
            await client.get(fullRemotePath, localPath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to download file ${remotePath} from SFTP:`, error);
            throw error;
        }
        finally {
            await client.end();
        }
    }
    async downloadStream(remotePath) {
        const client = await this.getClient();
        try {
            const fullRemotePath = path_1.default.posix.join(this.sftpConfig.path, remotePath);
            const stream = await client.get(fullRemotePath);
            return stream;
        }
        catch (error) {
            logger_1.logger.error(`Failed to create download stream for ${remotePath} from SFTP:`, error);
            throw error;
        }
        finally {
            // Note: We can't close the client here as the stream is still being read
            // The caller is responsible for handling the stream end
        }
    }
    async uploadFile(localPath, remotePath) {
        const client = await this.getClient();
        try {
            const fullRemotePath = path_1.default.posix.join(this.sftpConfig.path, remotePath);
            const remoteDir = path_1.default.posix.dirname(fullRemotePath);
            try {
                await client.mkdir(remoteDir, true);
            }
            catch {
                // Directory might already exist
            }
            await client.put(localPath, fullRemotePath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to upload file ${localPath} to SFTP:`, error);
            throw error;
        }
        finally {
            await client.end();
        }
    }
    async deleteFile(filePath) {
        const client = await this.getClient();
        try {
            const fullPath = path_1.default.posix.join(this.sftpConfig.path, filePath);
            await client.delete(fullPath);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete file ${filePath} from SFTP:`, error);
            throw error;
        }
        finally {
            await client.end();
        }
    }
    async fileExists(filePath) {
        const client = await this.getClient();
        try {
            const fullPath = path_1.default.posix.join(this.sftpConfig.path, filePath);
            await client.stat(fullPath);
            return true;
        }
        catch {
            return false;
        }
        finally {
            await client.end();
        }
    }
    async getFileMetadata(filePath) {
        const client = await this.getClient();
        try {
            const fullPath = path_1.default.posix.join(this.sftpConfig.path, filePath);
            const stats = await client.stat(fullPath);
            return {
                name: path_1.default.basename(filePath),
                path: this.normalizePath(filePath),
                size: stats.size,
                modifiedAt: new Date(stats.modifyTime),
            };
        }
        catch (error) {
            logger_1.logger.error(`Failed to get metadata for ${filePath} from SFTP:`, error);
            throw error;
        }
        finally {
            await client.end();
        }
    }
    async testConnection() {
        const client = await this.getClient();
        try {
            await client.list(this.sftpConfig.path);
            return true;
        }
        catch {
            return false;
        }
        finally {
            await client.end();
        }
    }
}
exports.SFTPStorageBackend = SFTPStorageBackend;
//# sourceMappingURL=sftp.js.map