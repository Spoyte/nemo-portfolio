import { VerificationConfig } from '../types';
export interface RestoreResult {
    success: boolean;
    path?: string;
    error?: string;
    duration: number;
}
export declare class RestoreTester {
    private tempDir;
    constructor(tempDir?: string);
    testRestore(config: VerificationConfig, backupPath: string): Promise<RestoreResult>;
    private restoreFile;
    private restoreDatabase;
    private restoreCloudBackup;
    private copyDirectory;
    private verifyRestoredContent;
    cleanup(restorePath: string): Promise<void>;
}
//# sourceMappingURL=restore.d.ts.map