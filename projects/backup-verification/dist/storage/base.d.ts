import { BackupFile, StorageBackendConfig } from '../types';
import { Readable } from 'stream';
export interface StorageBackend {
    listFiles(path: string): Promise<BackupFile[]>;
    downloadFile(remotePath: string, localPath: string): Promise<void>;
    downloadStream(remotePath: string): Promise<Readable>;
    uploadFile(localPath: string, remotePath: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    fileExists(path: string): Promise<boolean>;
    getFileMetadata(path: string): Promise<Partial<BackupFile>>;
    testConnection(): Promise<boolean>;
}
export declare abstract class BaseStorageBackend implements StorageBackend {
    protected config: StorageBackendConfig;
    constructor(config: StorageBackendConfig);
    abstract listFiles(path: string): Promise<BackupFile[]>;
    abstract downloadFile(remotePath: string, localPath: string): Promise<void>;
    abstract downloadStream(remotePath: string): Promise<Readable>;
    abstract uploadFile(localPath: string, remotePath: string): Promise<void>;
    abstract deleteFile(path: string): Promise<void>;
    abstract fileExists(path: string): Promise<boolean>;
    abstract getFileMetadata(path: string): Promise<Partial<BackupFile>>;
    abstract testConnection(): Promise<boolean>;
    protected normalizePath(path: string): string;
}
export * from './local';
export * from './s3';
export * from './sftp';
//# sourceMappingURL=base.d.ts.map