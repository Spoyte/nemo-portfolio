"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const verification_1 = require("./verification");
const storage_1 = require("../storage");
const logger_1 = require("../utils/logger");
const helpers_1 = require("../utils/helpers");
const node_cron_1 = __importDefault(require("node-cron"));
class JobService {
    jobs = new Map();
    executions = new Map();
    results = new Map();
    scheduledTasks = new Map();
    verificationService;
    constructor() {
        this.verificationService = new verification_1.VerificationService();
    }
    async createJob(config) {
        const id = (0, helpers_1.generateId)();
        const now = new Date();
        const job = {
            ...config,
            id,
            createdAt: now,
            updatedAt: now,
            enabled: config.enabled ?? true,
        };
        // Validate storage connection
        const storage = storage_1.StorageFactory.createBackend(job.source);
        const isConnected = await storage.testConnection();
        if (!isConnected) {
            throw new Error(`Failed to connect to storage backend: ${job.source.type}`);
        }
        this.jobs.set(id, job);
        this.results.set(id, []);
        // Schedule the job if enabled
        if (job.enabled) {
            this.scheduleJob(job);
        }
        logger_1.logger.info(`Created job: ${job.name} (${id})`);
        return job;
    }
    async getJob(id) {
        return this.jobs.get(id);
    }
    async listJobs(page = 1, limit = 20, status) {
        let jobs = Array.from(this.jobs.values());
        if (status === 'active') {
            jobs = jobs.filter((j) => j.enabled);
        }
        else if (status === 'inactive') {
            jobs = jobs.filter((j) => !j.enabled);
        }
        const total = jobs.length;
        const start = (page - 1) * limit;
        const paginatedJobs = jobs.slice(start, start + limit);
        return { jobs: paginatedJobs, total };
    }
    async updateJob(id, updates) {
        const job = this.jobs.get(id);
        if (!job) {
            return undefined;
        }
        const updatedJob = {
            ...job,
            ...updates,
            id: job.id,
            createdAt: job.createdAt,
            updatedAt: new Date(),
        };
        this.jobs.set(id, updatedJob);
        // Reschedule if schedule changed
        if (updates.schedule || updates.enabled !== undefined) {
            this.unscheduleJob(id);
            if (updatedJob.enabled) {
                this.scheduleJob(updatedJob);
            }
        }
        logger_1.logger.info(`Updated job: ${updatedJob.name} (${id})`);
        return updatedJob;
    }
    async deleteJob(id) {
        const job = this.jobs.get(id);
        if (!job) {
            return false;
        }
        // Unschedule the job
        this.unscheduleJob(id);
        this.jobs.delete(id);
        this.results.delete(id);
        logger_1.logger.info(`Deleted job: ${job.name} (${id})`);
        return true;
    }
    async triggerJob(id) {
        const job = this.jobs.get(id);
        if (!job) {
            throw new Error(`Job not found: ${id}`);
        }
        return this.executeJob(job);
    }
    async getJobResults(jobId, page = 1, limit = 20) {
        const results = this.results.get(jobId) || [];
        const total = results.length;
        const start = (page - 1) * limit;
        const paginatedResults = results.slice(start, start + limit);
        return { results: paginatedResults, total };
    }
    async getLatestResult(jobId) {
        const results = this.results.get(jobId) || [];
        return results[results.length - 1];
    }
    async getExecution(executionId) {
        return this.executions.get(executionId);
    }
    scheduleJob(job) {
        if (!job.schedule) {
            return;
        }
        try {
            const task = node_cron_1.default.schedule(job.schedule, async () => {
                logger_1.logger.info(`Running scheduled job: ${job.name}`);
                try {
                    await this.executeJob(job);
                }
                catch (error) {
                    logger_1.logger.error(`Scheduled job failed: ${job.name}`, error);
                }
            }, {
                scheduled: true,
                timezone: 'UTC',
            });
            this.scheduledTasks.set(job.id, task);
            logger_1.logger.info(`Scheduled job: ${job.name} with cron: ${job.schedule}`);
        }
        catch (error) {
            logger_1.logger.error(`Failed to schedule job ${job.name}:`, error);
        }
    }
    unscheduleJob(jobId) {
        const task = this.scheduledTasks.get(jobId);
        if (task) {
            task.stop();
            this.scheduledTasks.delete(jobId);
            logger_1.logger.info(`Unscheduled job: ${jobId}`);
        }
    }
    async executeJob(job) {
        const executionId = (0, helpers_1.generateId)();
        const execution = {
            id: executionId,
            jobId: job.id,
            status: 'running',
            startedAt: new Date(),
        };
        this.executions.set(executionId, execution);
        logger_1.logger.info(`Starting job execution: ${executionId} for job ${job.name}`);
        try {
            const storage = storage_1.StorageFactory.createBackend(job.source);
            const files = await storage.listFiles(job.source.path || '');
            if (files.length === 0) {
                logger_1.logger.warn(`No backup files found for job: ${job.name}`);
            }
            // Process each backup file
            for (const file of files) {
                const result = await this.verificationService.verifyBackup(job, file);
                const jobResults = this.results.get(job.id) || [];
                jobResults.push(result);
                this.results.set(job.id, jobResults);
            }
            execution.status = 'completed';
            execution.completedAt = new Date();
            logger_1.logger.info(`Job execution completed: ${executionId}`);
        }
        catch (error) {
            execution.status = 'failed';
            execution.completedAt = new Date();
            execution.error = error instanceof Error ? error.message : String(error);
            logger_1.logger.error(`Job execution failed: ${executionId}`, error);
        }
        this.executions.set(executionId, execution);
        return execution;
    }
    // Cleanup old results to prevent memory bloat
    cleanupOldResults(maxResultsPerJob = 100) {
        for (const [jobId, results] of this.results.entries()) {
            if (results.length > maxResultsPerJob) {
                const trimmed = results.slice(-maxResultsPerJob);
                this.results.set(jobId, trimmed);
                logger_1.logger.debug(`Cleaned up old results for job ${jobId}`);
            }
        }
    }
}
exports.JobService = JobService;
exports.default = JobService;
//# sourceMappingURL=job.js.map