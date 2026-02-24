import { BaseStorageBackend } from './base';
import { S3StorageConfig, BackupFile } from '../types';
import { Readable } from 'stream';
export declare class S3StorageBackend extends BaseStorageBackend {
    private s3Config;
    private client;
    constructor(config: S3StorageConfig);
    listFiles(prefix: string): Promise<BackupFile[]>;
    downloadFile(remotePath: string, localPath: string): Promise<void>;
    downloadStream(remotePath: string): Promise<Readable>;
    uploadFile(localPath: string, remotePath: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    fileExists(filePath: string): Promise<boolean>;
    getFileMetadata(filePath: string): Promise<Partial<BackupFile>>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=s3.d.ts.map