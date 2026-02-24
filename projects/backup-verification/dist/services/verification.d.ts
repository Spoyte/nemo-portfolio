import { JobConfig, VerificationResult, BackupFile, RetentionResult, StorageBackendConfig } from '../types';
export declare class VerificationService {
    private webhookService;
    constructor();
    verifyBackup(jobConfig: JobConfig, backup: BackupFile, expectedChecksum?: string): Promise<VerificationResult>;
    private testRestore;
    applyRetentionPolicy(source: StorageBackendConfig, retentionDays: number, dryRun?: boolean): Promise<RetentionResult>;
}
export default VerificationService;
//# sourceMappingURL=verification.d.ts.map