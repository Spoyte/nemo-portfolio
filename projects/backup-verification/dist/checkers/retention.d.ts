import { VerificationConfig } from '../types';
export interface RetentionResult {
    deleted: number;
    kept: number;
    errors: string[];
    deletedFiles: string[];
}
export interface BackupFile {
    path: string;
    name: string;
    size: number;
    modifiedTime: Date;
}
export declare class RetentionManager {
    applyRetention(config: VerificationConfig, backupDir: string): Promise<RetentionResult>;
    listBackups(backupDir: string): Promise<BackupFile[]>;
    getBackupStats(backupDir: string): Promise<{
        totalFiles: number;
        totalSize: number;
        oldestBackup?: Date;
        newestBackup?: Date;
    }>;
    cleanupEmptyDirs(dir: string): Promise<number>;
}
//# sourceMappingURL=retention.d.ts.map