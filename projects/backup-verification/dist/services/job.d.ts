import { JobConfig, JobExecution, VerificationResult } from '../types';
export declare class JobService {
    private jobs;
    private executions;
    private results;
    private scheduledTasks;
    private verificationService;
    constructor();
    createJob(config: JobConfig): Promise<JobConfig>;
    getJob(id: string): Promise<JobConfig | undefined>;
    listJobs(page?: number, limit?: number, status?: 'active' | 'inactive'): Promise<{
        jobs: JobConfig[];
        total: number;
    }>;
    updateJob(id: string, updates: Partial<JobConfig>): Promise<JobConfig | undefined>;
    deleteJob(id: string): Promise<boolean>;
    triggerJob(id: string): Promise<JobExecution>;
    getJobResults(jobId: string, page?: number, limit?: number): Promise<{
        results: VerificationResult[];
        total: number;
    }>;
    getLatestResult(jobId: string): Promise<VerificationResult | undefined>;
    getExecution(executionId: string): Promise<JobExecution | undefined>;
    private scheduleJob;
    private unscheduleJob;
    private executeJob;
    cleanupOldResults(maxResultsPerJob?: number): void;
}
export default JobService;
//# sourceMappingURL=job.d.ts.map