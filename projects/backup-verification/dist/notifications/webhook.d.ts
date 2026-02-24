export declare class WebhookService {
    private webhookUrl;
    private webhookSecret;
    constructor();
    sendNotification(event: string, details: Record<string, unknown>, jobId?: string, jobName?: string): Promise<void>;
    sendVerificationFailed(jobId: string, jobName: string, backupPath: string, error: string, expectedChecksum?: string, actualChecksum?: string): Promise<void>;
    sendVerificationWarning(jobId: string, jobName: string, backupPath: string, warnings: string[]): Promise<void>;
    sendRestoreFailed(jobId: string, jobName: string, backupPath: string, error: string): Promise<void>;
    sendRestoreCompleted(jobId: string, jobName: string, backupPath: string, restorePath: string, dryRun: boolean): Promise<void>;
    sendRetentionCompleted(filesScanned: number, filesDeleted: number, bytesFreed: number): Promise<void>;
    private generateSignature;
}
export default WebhookService;
//# sourceMappingURL=webhook.d.ts.map