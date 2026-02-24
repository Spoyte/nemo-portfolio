import { S3BackupConfig, GCSBackupConfig, AzureBackupConfig } from '../types';
export interface DownloadResult {
    localPath: string;
    size: number;
    checksum?: string;
    metadata: Record<string, string>;
}
export declare abstract class CloudStorageProvider {
    abstract download(config: any, localDir: string): Promise<DownloadResult>;
    abstract verifyExists(config: any): Promise<boolean>;
    abstract getMetadata(config: any): Promise<Record<string, string>>;
}
export declare class S3StorageProvider extends CloudStorageProvider {
    private clients;
    private getClient;
    download(config: S3BackupConfig, localDir: string): Promise<DownloadResult>;
    verifyExists(config: S3BackupConfig): Promise<boolean>;
    getMetadata(config: S3BackupConfig): Promise<Record<string, string>>;
}
export declare class GCSStorageProvider extends CloudStorageProvider {
    private clients;
    private getClient;
    download(config: GCSBackupConfig, localDir: string): Promise<DownloadResult>;
    verifyExists(config: GCSBackupConfig): Promise<boolean>;
    getMetadata(config: GCSBackupConfig): Promise<Record<string, string>>;
}
export declare class AzureStorageProvider extends CloudStorageProvider {
    private clients;
    private getClient;
    download(config: AzureBackupConfig, localDir: string): Promise<DownloadResult>;
    verifyExists(config: AzureBackupConfig): Promise<boolean>;
    getMetadata(config: AzureBackupConfig): Promise<Record<string, string>>;
}
export declare class StorageProviderFactory {
    private static providers;
    static getProvider(type: string): CloudStorageProvider;
}
//# sourceMappingURL=cloud.d.ts.map