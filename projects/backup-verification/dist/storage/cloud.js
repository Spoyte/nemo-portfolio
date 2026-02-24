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
exports.StorageProviderFactory = exports.AzureStorageProvider = exports.GCSStorageProvider = exports.S3StorageProvider = exports.CloudStorageProvider = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const storage_1 = require("@google-cloud/storage");
const storage_blob_1 = require("@azure/storage-blob");
const checksum_1 = require("../validators/checksum");
class CloudStorageProvider {
}
exports.CloudStorageProvider = CloudStorageProvider;
class S3StorageProvider extends CloudStorageProvider {
    clients = new Map();
    getClient(config) {
        const key = `${config.region}:${config.accessKeyId}`;
        if (!this.clients.has(key)) {
            this.clients.set(key, new client_s3_1.S3Client({
                region: config.region,
                credentials: {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                },
                endpoint: config.endpoint,
            }));
        }
        return this.clients.get(key);
    }
    async download(config, localDir) {
        const client = this.getClient(config);
        const localPath = path.join(localDir, path.basename(config.key));
        // Ensure directory exists
        await fs.promises.mkdir(localDir, { recursive: true });
        const command = new client_s3_1.GetObjectCommand({
            Bucket: config.bucket,
            Key: config.key,
        });
        const response = await client.send(command);
        if (!response.Body) {
            throw new Error('Empty response body from S3');
        }
        // Write to file
        const writeStream = fs.createWriteStream(localPath);
        if (response.Body.transformToWebStream) {
            const webStream = response.Body.transformToWebStream();
            const reader = webStream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                writeStream.write(value);
            }
        }
        else {
            // Fallback for older SDK versions
            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            fs.writeFileSync(localPath, Buffer.concat(chunks));
        }
        writeStream.end();
        // Wait for file to be written
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        const stats = await fs.promises.stat(localPath);
        const checksumInfo = await checksum_1.ChecksumValidator.calculate(localPath, 'sha256');
        return {
            localPath,
            size: stats.size,
            checksum: checksumInfo.hash,
            metadata: {
                etag: response.ETag || '',
                lastModified: response.LastModified?.toISOString() || '',
                contentType: response.ContentType || '',
            },
        };
    }
    async verifyExists(config) {
        try {
            const client = this.getClient(config);
            await client.send(new client_s3_1.HeadObjectCommand({
                Bucket: config.bucket,
                Key: config.key,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
    async getMetadata(config) {
        const client = this.getClient(config);
        const response = await client.send(new client_s3_1.HeadObjectCommand({
            Bucket: config.bucket,
            Key: config.key,
        }));
        return {
            etag: response.ETag || '',
            lastModified: response.LastModified?.toISOString() || '',
            contentType: response.ContentType || '',
            contentLength: String(response.ContentLength || 0),
            ...response.Metadata,
        };
    }
}
exports.S3StorageProvider = S3StorageProvider;
class GCSStorageProvider extends CloudStorageProvider {
    clients = new Map();
    getClient(config) {
        const key = config.projectId;
        if (!this.clients.has(key)) {
            const options = { projectId: config.projectId };
            if (config.keyFilename) {
                options.keyFilename = config.keyFilename;
            }
            else if (config.credentials) {
                options.credentials = config.credentials;
            }
            this.clients.set(key, new storage_1.Storage(options));
        }
        return this.clients.get(key);
    }
    async download(config, localDir) {
        const storage = this.getClient(config);
        const localPath = path.join(localDir, path.basename(config.key));
        await fs.promises.mkdir(localDir, { recursive: true });
        const bucket = storage.bucket(config.bucket);
        const file = bucket.file(config.key);
        await file.download({ destination: localPath });
        const [metadata] = await file.getMetadata();
        const stats = await fs.promises.stat(localPath);
        const checksumInfo = await checksum_1.ChecksumValidator.calculate(localPath, 'sha256');
        return {
            localPath,
            size: stats.size,
            checksum: checksumInfo.hash,
            metadata: {
                etag: metadata.etag || '',
                generation: String(metadata.generation || ''),
                md5Hash: metadata.md5Hash || '',
                crc32c: metadata.crc32c || '',
                updated: metadata.updated || '',
            },
        };
    }
    async verifyExists(config) {
        try {
            const storage = this.getClient(config);
            const bucket = storage.bucket(config.bucket);
            const file = bucket.file(config.key);
            const [exists] = await file.exists();
            return exists;
        }
        catch {
            return false;
        }
    }
    async getMetadata(config) {
        const storage = this.getClient(config);
        const bucket = storage.bucket(config.bucket);
        const file = bucket.file(config.key);
        const [metadata] = await file.getMetadata();
        return {
            etag: metadata.etag || '',
            generation: String(metadata.generation || ''),
            md5Hash: metadata.md5Hash || '',
            crc32c: metadata.crc32c || '',
            updated: metadata.updated || '',
            size: String(metadata.size || ''),
            contentType: metadata.contentType || '',
        };
    }
}
exports.GCSStorageProvider = GCSStorageProvider;
class AzureStorageProvider extends CloudStorageProvider {
    clients = new Map();
    getClient(config) {
        const key = config.accountName;
        if (!this.clients.has(key)) {
            let connectionString;
            if (config.connectionString) {
                connectionString = config.connectionString;
            }
            else if (config.accountKey) {
                connectionString = `DefaultEndpointsProtocol=https;AccountName=${config.accountName};AccountKey=${config.accountKey};EndpointSuffix=core.windows.net`;
            }
            else {
                throw new Error('Azure storage requires connectionString or accountKey');
            }
            this.clients.set(key, storage_blob_1.BlobServiceClient.fromConnectionString(connectionString));
        }
        return this.clients.get(key);
    }
    async download(config, localDir) {
        const client = this.getClient(config);
        const localPath = path.join(localDir, path.basename(config.blobName));
        await fs.promises.mkdir(localDir, { recursive: true });
        const containerClient = client.getContainerClient(config.containerName);
        const blobClient = containerClient.getBlobClient(config.blobName);
        await blobClient.downloadToFile(localPath);
        const properties = await blobClient.getProperties();
        const stats = await fs.promises.stat(localPath);
        const checksumInfo = await checksum_1.ChecksumValidator.calculate(localPath, 'sha256');
        return {
            localPath,
            size: stats.size,
            checksum: checksumInfo.hash,
            metadata: {
                etag: properties.etag || '',
                lastModified: properties.lastModified?.toISOString() || '',
                contentType: properties.contentType || '',
                contentMD5: properties.contentMD5 ? Buffer.from(properties.contentMD5).toString('base64') : '',
                blobType: properties.blobType || '',
            },
        };
    }
    async verifyExists(config) {
        try {
            const client = this.getClient(config);
            const containerClient = client.getContainerClient(config.containerName);
            const blobClient = containerClient.getBlobClient(config.blobName);
            const response = await blobClient.exists();
            return response;
        }
        catch {
            return false;
        }
    }
    async getMetadata(config) {
        const client = this.getClient(config);
        const containerClient = client.getContainerClient(config.containerName);
        const blobClient = containerClient.getBlobClient(config.blobName);
        const properties = await blobClient.getProperties();
        return {
            etag: properties.etag || '',
            lastModified: properties.lastModified?.toISOString() || '',
            contentType: properties.contentType || '',
            contentMD5: properties.contentMD5 ? Buffer.from(properties.contentMD5).toString('base64') : '',
            contentLength: String(properties.contentLength || 0),
            blobType: properties.blobType || '',
            ...properties.metadata,
        };
    }
}
exports.AzureStorageProvider = AzureStorageProvider;
class StorageProviderFactory {
    static providers = new Map();
    static getProvider(type) {
        if (!this.providers.has(type)) {
            switch (type) {
                case 's3':
                    this.providers.set(type, new S3StorageProvider());
                    break;
                case 'gcs':
                    this.providers.set(type, new GCSStorageProvider());
                    break;
                case 'azure':
                    this.providers.set(type, new AzureStorageProvider());
                    break;
                default:
                    throw new Error(`Unknown storage provider: ${type}`);
            }
        }
        return this.providers.get(type);
    }
}
exports.StorageProviderFactory = StorageProviderFactory;
//# sourceMappingURL=cloud.js.map