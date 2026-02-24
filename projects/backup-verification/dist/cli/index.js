#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const job_1 = require("../services/job");
const backup_1 = require("../services/backup");
const verification_1 = require("../services/verification");
const logger_1 = require("../utils/logger");
const program = new commander_1.Command();
const jobService = new job_1.JobService();
const backupService = new backup_1.BackupService();
const verificationService = new verification_1.VerificationService();
program
    .name('backup-verification')
    .description('CLI for Backup Verification System')
    .version('1.0.0');
// Job commands
const jobCmd = program.command('job').description('Manage verification jobs');
jobCmd
    .command('create')
    .description('Create a new verification job')
    .requiredOption('--name <name>', 'Job name')
    .requiredOption('--type <type>', 'Storage type (local, s3, sftp)')
    .option('--path <path>', 'Storage path')
    .option('--bucket <bucket>', 'S3 bucket name')
    .option('--host <host>', 'SFTP host')
    .option('--port <port>', 'SFTP port', '22')
    .option('--username <username>', 'SFTP username')
    .requiredOption('--schedule <schedule>', 'Cron schedule expression')
    .option('--retention <days>', 'Retention days', '30')
    .option('--restore', 'Enable test restore', false)
    .option('--restore-path <path>', 'Test restore path')
    .action(async (options) => {
    try {
        let source;
        switch (options.type) {
            case 'local':
                source = { type: 'local', path: options.path || '' };
                break;
            case 's3':
                source = { type: 's3', bucket: options.bucket, path: options.path || '' };
                break;
            case 'sftp':
                source = {
                    type: 'sftp',
                    host: options.host,
                    port: parseInt(options.port),
                    username: options.username,
                    path: options.path || '',
                };
                break;
            default:
                console.error(`Invalid storage type: ${options.type}`);
                process.exit(1);
        }
        const job = await jobService.createJob({
            name: options.name,
            source,
            schedule: options.schedule,
            retentionDays: parseInt(options.retention),
            enabled: true,
            testRestore: options.restore
                ? {
                    enabled: true,
                    dryRun: false,
                    restorePath: options.restorePath,
                }
                : undefined,
        });
        console.log('Job created successfully:');
        console.log(JSON.stringify(job, null, 2));
    }
    catch (error) {
        logger_1.logger.error('Failed to create job:', error);
        process.exit(1);
    }
});
jobCmd
    .command('list')
    .description('List all jobs')
    .option('--status <status>', 'Filter by status (active, inactive)')
    .action(async (options) => {
    try {
        const { jobs } = await jobService.listJobs(1, 100, options.status);
        if (jobs.length === 0) {
            console.log('No jobs found');
            return;
        }
        console.log('\nJobs:');
        console.log('-'.repeat(80));
        jobs.forEach((job) => {
            console.log(`ID: ${job.id}`);
            console.log(`Name: ${job.name}`);
            console.log(`Type: ${job.source.type}`);
            console.log(`Schedule: ${job.schedule}`);
            console.log(`Status: ${job.enabled ? 'active' : 'inactive'}`);
            console.log(`Retention: ${job.retentionDays} days`);
            console.log('-'.repeat(80));
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to list jobs:', error);
        process.exit(1);
    }
});
jobCmd
    .command('get')
    .description('Get job details')
    .requiredOption('--id <id>', 'Job ID')
    .action(async (options) => {
    try {
        const job = await jobService.getJob(options.id);
        if (!job) {
            console.error('Job not found');
            process.exit(1);
        }
        console.log(JSON.stringify(job, null, 2));
    }
    catch (error) {
        logger_1.logger.error('Failed to get job:', error);
        process.exit(1);
    }
});
jobCmd
    .command('delete')
    .description('Delete a job')
    .requiredOption('--id <id>', 'Job ID')
    .action(async (options) => {
    try {
        const deleted = await jobService.deleteJob(options.id);
        if (!deleted) {
            console.error('Job not found');
            process.exit(1);
        }
        console.log('Job deleted successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to delete job:', error);
        process.exit(1);
    }
});
jobCmd
    .command('trigger')
    .description('Trigger a job manually')
    .requiredOption('--id <id>', 'Job ID')
    .action(async (options) => {
    try {
        console.log('Triggering job...');
        const execution = await jobService.triggerJob(options.id);
        console.log('Job execution started:');
        console.log(JSON.stringify(execution, null, 2));
    }
    catch (error) {
        logger_1.logger.error('Failed to trigger job:', error);
        process.exit(1);
    }
});
// Verify command
program
    .command('verify')
    .description('Verify a backup file')
    .requiredOption('--type <type>', 'Storage type (local, s3, sftp)')
    .option('--path <path>', 'File path')
    .option('--bucket <bucket>', 'S3 bucket name')
    .option('--host <host>', 'SFTP host')
    .option('--port <port>', 'SFTP port', '22')
    .option('--username <username>', 'SFTP username')
    .option('--checksum <checksum>', 'Expected SHA-256 checksum')
    .action(async (options) => {
    try {
        let source;
        switch (options.type) {
            case 'local':
                source = { type: 'local', path: options.path || '' };
                break;
            case 's3':
                source = { type: 's3', bucket: options.bucket, path: options.path || '' };
                break;
            case 'sftp':
                source = {
                    type: 'sftp',
                    host: options.host,
                    port: parseInt(options.port),
                    username: options.username,
                    path: options.path || '',
                };
                break;
            default:
                console.error(`Invalid storage type: ${options.type}`);
                process.exit(1);
        }
        const backup = await backupService.getBackupMetadata(source, options.path);
        const tempJob = {
            name: 'CLI Verification',
            source,
            schedule: '',
            retentionDays: 30,
            enabled: false,
        };
        console.log('Verifying backup...');
        const result = await verificationService.verifyBackup(tempJob, backup, options.checksum);
        console.log('\nVerification Result:');
        console.log('-'.repeat(40));
        console.log(`Status: ${result.status}`);
        console.log(`Checksum Valid: ${result.checksumValid}`);
        if (result.expectedChecksum) {
            console.log(`Expected Checksum: ${result.expectedChecksum}`);
        }
        if (result.actualChecksum) {
            console.log(`Actual Checksum: ${result.actualChecksum}`);
        }
        if (result.errors.length > 0) {
            console.log(`Errors: ${result.errors.join(', ')}`);
        }
        if (result.warnings.length > 0) {
            console.log(`Warnings: ${result.warnings.join(', ')}`);
        }
        console.log(`Duration: ${result.durationMs}ms`);
    }
    catch (error) {
        logger_1.logger.error('Verification failed:', error);
        process.exit(1);
    }
});
// Restore command
program
    .command('restore')
    .description('Test restore a backup')
    .requiredOption('--type <type>', 'Storage type (local, s3, sftp)')
    .option('--path <path>', 'File path')
    .option('--bucket <bucket>', 'S3 bucket name')
    .option('--host <host>', 'SFTP host')
    .option('--port <port>', 'SFTP port', '22')
    .option('--username <username>', 'SFTP username')
    .requiredOption('--destination <path>', 'Restore destination path')
    .option('--dry-run', 'Perform dry-run only', false)
    .action(async (options) => {
    try {
        let source;
        switch (options.type) {
            case 'local':
                source = { type: 'local', path: options.path || '' };
                break;
            case 's3':
                source = { type: 's3', bucket: options.bucket, path: options.path || '' };
                break;
            case 'sftp':
                source = {
                    type: 'sftp',
                    host: options.host,
                    port: parseInt(options.port),
                    username: options.username,
                    path: options.path || '',
                };
                break;
            default:
                console.error(`Invalid storage type: ${options.type}`);
                process.exit(1);
        }
        const backup = await backupService.getBackupMetadata(source, options.path);
        const tempJob = {
            name: 'CLI Restore Test',
            source,
            schedule: '',
            retentionDays: 30,
            enabled: false,
            testRestore: {
                enabled: true,
                dryRun: options.dryRun,
                restorePath: options.destination,
            },
        };
        console.log('Testing restore...');
        const result = await verificationService.verifyBackup(tempJob, backup);
        console.log('\nRestore Test Result:');
        console.log('-'.repeat(40));
        console.log(`Success: ${result.restoreSuccess}`);
        console.log(`Dry Run: ${options.dryRun}`);
        if (result.restorePath) {
            console.log(`Restore Path: ${result.restorePath}`);
        }
        if (result.errors.length > 0) {
            console.log(`Errors: ${result.errors.join(', ')}`);
        }
    }
    catch (error) {
        logger_1.logger.error('Restore test failed:', error);
        process.exit(1);
    }
});
// Retention command
program
    .command('retention')
    .description('Manage retention policies')
    .requiredOption('--type <type>', 'Storage type (local, s3, sftp)')
    .option('--path <path>', 'Storage path')
    .option('--bucket <bucket>', 'S3 bucket name')
    .option('--host <host>', 'SFTP host')
    .option('--port <port>', 'SFTP port', '22')
    .option('--username <username>', 'SFTP username')
    .requiredOption('--days <days>', 'Retention period in days')
    .option('--dry-run', 'Preview changes without deleting', false)
    .action(async (options) => {
    try {
        let source;
        switch (options.type) {
            case 'local':
                source = { type: 'local', path: options.path || '' };
                break;
            case 's3':
                source = { type: 's3', bucket: options.bucket, path: options.path || '' };
                break;
            case 'sftp':
                source = {
                    type: 'sftp',
                    host: options.host,
                    port: parseInt(options.port),
                    username: options.username,
                    path: options.path || '',
                };
                break;
            default:
                console.error(`Invalid storage type: ${options.type}`);
                process.exit(1);
        }
        console.log(`${options.dryRun ? 'Previewing' : 'Applying'} retention policy...`);
        const result = await verificationService.applyRetentionPolicy(source, parseInt(options.days), options.dryRun);
        console.log('\nRetention Result:');
        console.log('-'.repeat(40));
        console.log(`Files Scanned: ${result.filesScanned}`);
        console.log(`Files to Delete: ${result.filesDeleted}`);
        console.log(`Files to Keep: ${result.filesKept}`);
        console.log(`Bytes Freed: ${result.bytesFreed}`);
        if (result.deletedFiles.length > 0) {
            console.log('\nFiles:');
            result.deletedFiles.forEach((f) => console.log(`  - ${f}`));
        }
        if (result.errors.length > 0) {
            console.log(`\nErrors: ${result.errors.join(', ')}`);
        }
    }
    catch (error) {
        logger_1.logger.error('Retention policy failed:', error);
        process.exit(1);
    }
});
// Results command
program
    .command('results')
    .description('Get job results')
    .requiredOption('--job-id <id>', 'Job ID')
    .option('--latest', 'Get only the latest result')
    .action(async (options) => {
    try {
        if (options.latest) {
            const result = await jobService.getLatestResult(options.jobId);
            if (!result) {
                console.log('No results found');
                return;
            }
            console.log(JSON.stringify(result, null, 2));
        }
        else {
            const { results } = await jobService.getJobResults(options.jobId);
            console.log(JSON.stringify(results, null, 2));
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to get results:', error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map