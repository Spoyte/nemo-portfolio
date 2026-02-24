import { BaseStorageBackend } from './base';
import { SFTPStorageConfig, BackupFile } from '../types';
import type { Readable } from 'stream';
export declare class SFTPStorageBackend extends BaseStorageBackend {
    private sftpConfig;
    constructor(config: SFTPStorageConfig);
    private getClient;
    listFiles(remotePath: string): Promise<BackupFile[]>;
    downloadFile(remotePath: string, localPath: string): Promise<void>;
    downloadStream(remotePath: string): Promise<Readable>;
    uploadFile(localPath: string, remotePath: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    fileExists(filePath: string): Promise<boolean>;
    getFileMetadata(filePath: string): Promise<Partial<BackupFile>>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=sftp.d.ts.map