import { Config, VerificationConfig, VerificationResult, IntegrityReport } from '../types';
export declare class BackupVerifier {
    private config;
    private restoreTester;
    private retentionManager;
    private reportGenerator;
    private logger;
    constructor(config: Config);
    verify(verificationConfig: VerificationConfig): Promise<VerificationResult>;
    verifyAll(): Promise<IntegrityReport>;
    private getBackupPath;
    private verifyChecksum;
    private verifyDirectoryChecksum;
    private applyRetention;
    getEnabledVerifications(): VerificationConfig[];
    getVerification(name: string): VerificationConfig | undefined;
}
//# sourceMappingURL=verifier.d.ts.map