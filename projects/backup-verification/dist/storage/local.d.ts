import { BaseStorageBackend } from './base';
import { LocalStorageConfig, BackupFile } from '../types';
import { Readable } from 'stream';
export declare class LocalStorageBackend extends BaseStorageBackend {
    private localConfig;
    constructor(config: LocalStorageConfig);
    listFiles(dirPath: string): Promise<BackupFile[]>;
    downloadFile(remotePath: string, localPath: string): Promise<void>;
    downloadStream(remotePath: string): Promise<Readable>;
    uploadFile(localPath: string, remotePath: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    fileExists(filePath: string): Promise<boolean>;
    getFileMetadata(filePath: string): Promise<Partial<BackupFile>>;
    testConnection(): Promise<boolean>;
    private getFullPath;
}
//# sourceMappingURL=local.d.ts.map