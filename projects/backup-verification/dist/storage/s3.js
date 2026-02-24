"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageBackend = void 0;
const base_1 = require("./base");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const promises_1 = require("stream/promises");
const logger_1 = require("../utils/logger");
const promises_2 = __importDefault(require("fs/promises"));
class S3StorageBackend extends base_1.BaseStorageBackend {
    s3Config;
    client;
    constructor(config) {
        super(config);
        this.s3Config = config;
        this.client = new client_s3_1.S3Client({
            region: config.region || process.env.AWS_REGION || 'us-east-1',
        });
    }
    async listFiles(prefix) {
        const files = [];
        let continuationToken;
        try {
            do {
                const command = new client_s3_1.ListObjectsV2Command({
                    Bucket: this.s3Config.bucket,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                });
                const response = await this.client.send(command);
                if (response.Contents) {
                    for (const object of response.Contents) {
                        if (object.Key && !object.Key.endsWith('/')) {
                            files.push({
                                name: path_1.default.basename(object.Key),
                                path: this.normalizePath(object.Key),
                                size: object.Size || 0,
                                modifiedAt: object.LastModified || new Date(),
                                checksum: object.ETag?.replace(/"/g, ''),
                            });
                        }
                    }
                }
                continuationToken = response.NextContinuationToken;
            } while (continuationToken);
            return files;
        }
        catch (error) {
            logger_1.logger.error(`Failed to list files in S3 bucket ${this.s3Config.bucket}:`, error);
            throw error;
        }
    }
    async downloadFile(remotePath, localPath) {
        try {
            await promises_2.default.mkdir(path_1.default.dirname(localPath), { recursive: true });
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.s3Config.bucket,
                Key: remotePath,
            });
            const response = await this.client.send(command);
            if (!response.Body) {
                throw new Error('Empty response body from S3');
            }
            const writeStream = (0, fs_1.createWriteStream)(localPath);
            await (0, promises_1.pipeline)(response.Body, writeStream);
        }
        catch (error) {
            logger_1.logger.error(`Failed to download file ${remotePath} from S3:`, error);
            throw error;
        }
    }
    async downloadStream(remotePath) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.s3Config.bucket,
                Key: remotePath,
            });
            const response = await this.client.send(command);
            if (!response.Body) {
                throw new Error('Empty response body from S3');
            }
            return response.Body;
        }
        catch (error) {
            logger_1.logger.error(`Failed to create download stream for ${remotePath} from S3:`, error);
            throw error;
        }
    }
    async uploadFile(localPath, remotePath) {
        try {
            const fileStream = (0, fs_1.createReadStream)(localPath);
            const upload = new lib_storage_1.Upload({
                client: this.client,
                params: {
                    Bucket: this.s3Config.bucket,
                    Key: remotePath,
                    Body: fileStream,
                },
            });
            await upload.done();
        }
        catch (error) {
            logger_1.logger.error(`Failed to upload file ${localPath} to S3:`, error);
            throw error;
        }
    }
    async deleteFile(filePath) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.s3Config.bucket,
                Key: filePath,
            });
            await this.client.send(command);
        }
        catch (error) {
            logger_1.logger.error(`Failed to delete file ${filePath} from S3:`, error);
            throw error;
        }
    }
    async fileExists(filePath) {
        try {
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: this.s3Config.bucket,
                Key: filePath,
            });
            await this.client.send(command);
            return true;
        }
        catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                return false;
            }
            throw error;
        }
    }
    async getFileMetadata(filePath) {
        try {
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: this.s3Config.bucket,
                Key: filePath,
            });
            const response = await this.client.send(command);
            return {
                name: path_1.default.basename(filePath),
                path: this.normalizePath(filePath),
                size: response.ContentLength || 0,
                modifiedAt: response.LastModified || new Date(),
                checksum: response.ETag?.replace(/"/g, ''),
            };
        }
        catch (error) {
            logger_1.logger.error(`Failed to get metadata for ${filePath} from S3:`, error);
            throw error;
        }
    }
    async testConnection() {
        try {
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: this.s3Config.bucket,
                MaxKeys: 1,
            });
            await this.client.send(command);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.S3StorageBackend = S3StorageBackend;
//# sourceMappingURL=s3.js.map