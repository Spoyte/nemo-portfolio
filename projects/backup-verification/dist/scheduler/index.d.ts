import { Config } from '../types';
export declare class VerificationScheduler {
    private tasks;
    private verifier;
    private notificationManager;
    private logger;
    constructor(config: Config);
    start(): void;
    stop(): void;
    private scheduleVerification;
    runNow(name?: string): Promise<void>;
    private runVerification;
    private runAll;
    getScheduledTasks(): string[];
    isScheduled(name: string): boolean;
}
//# sourceMappingURL=index.d.ts.map