import { StorageBackendConfig, BackupFile } from '../types';
export declare class BackupService {
    listBackups(source: StorageBackendConfig, page?: number, limit?: number): Promise<{
        backups: BackupFile[];
        total: number;
    }>;
    getBackupMetadata(source: StorageBackendConfig, filePath: string): Promise<BackupFile>;
    testConnection(source: StorageBackendConfig): Promise<boolean>;
}
export default BackupService;
//# sourceMappingURL=backup.d.ts.map