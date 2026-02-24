"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const job_1 = require("../services/job");
const backup_1 = require("../services/backup");
const verification_1 = require("../services/verification");
const errors_1 = require("../utils/errors");
const router = (0, express_1.Router)();
const jobService = new job_1.JobService();
const backupService = new backup_1.BackupService();
const verificationService = new verification_1.VerificationService();
// Validation middleware
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new errors_1.ValidationError(errors.array().map((e) => e.msg).join(', '));
    }
    next();
};
// Jobs Routes
// Create job
router.post('/jobs', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('source').isObject().withMessage('Source is required'),
    (0, express_validator_1.body)('source.type').isIn(['local', 's3', 'sftp']).withMessage('Invalid source type'),
    (0, express_validator_1.body)('schedule').notEmpty().withMessage('Schedule is required'),
    (0, express_validator_1.body)('retentionDays').isInt({ min: 1 }).withMessage('Retention days must be a positive integer'),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const job = await jobService.createJob(req.body);
    res.status(201).json({
        success: true,
        data: job,
    });
}));
// List jobs
router.get('/jobs', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['active', 'inactive']),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const { jobs, total } = await jobService.listJobs(page, limit, status);
    res.json({
        success: true,
        data: jobs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}));
// Get job by ID
router.get('/jobs/:id', [(0, express_validator_1.param)('id').notEmpty(), validate], (0, errors_1.asyncHandler)(async (req, res) => {
    const job = await jobService.getJob(req.params.id);
    if (!job) {
        throw new errors_1.NotFoundError('Job not found');
    }
    res.json({
        success: true,
        data: job,
    });
}));
// Update job
router.put('/jobs/:id', [(0, express_validator_1.param)('id').notEmpty(), validate], (0, errors_1.asyncHandler)(async (req, res) => {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) {
        throw new errors_1.NotFoundError('Job not found');
    }
    res.json({
        success: true,
        data: job,
    });
}));
// Delete job
router.delete('/jobs/:id', [(0, express_validator_1.param)('id').notEmpty(), validate], (0, errors_1.asyncHandler)(async (req, res) => {
    const deleted = await jobService.deleteJob(req.params.id);
    if (!deleted) {
        throw new errors_1.NotFoundError('Job not found');
    }
    res.json({
        success: true,
        message: 'Job deleted successfully',
    });
}));
// Trigger job manually
router.post('/jobs/:id/trigger', [(0, express_validator_1.param)('id').notEmpty(), validate], (0, errors_1.asyncHandler)(async (req, res) => {
    const execution = await jobService.triggerJob(req.params.id);
    res.json({
        success: true,
        data: execution,
    });
}));
// Get job results
router.get('/jobs/:id/results', [
    (0, express_validator_1.param)('id').notEmpty(),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { results, total } = await jobService.getJobResults(req.params.id, page, limit);
    res.json({
        success: true,
        data: results,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}));
// Get latest result
router.get('/jobs/:id/results/latest', [(0, express_validator_1.param)('id').notEmpty(), validate], (0, errors_1.asyncHandler)(async (req, res) => {
    const result = await jobService.getLatestResult(req.params.id);
    if (!result) {
        throw new errors_1.NotFoundError('No results found');
    }
    res.json({
        success: true,
        data: result,
    });
}));
// Backups Routes
// List backups
router.get('/backups', [
    (0, express_validator_1.query)('type').isIn(['local', 's3', 'sftp']).withMessage('Invalid type'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const { type, bucket, path, host, port, username, page, limit } = req.query;
    let source;
    switch (type) {
        case 'local':
            source = { type: 'local', path: path || '' };
            break;
        case 's3':
            source = {
                type: 's3',
                bucket: bucket,
                path: path || '',
            };
            break;
        case 'sftp':
            source = {
                type: 'sftp',
                host: host,
                port: parseInt(port) || 22,
                username: username,
                path: path || '',
            };
            break;
        default:
            throw new errors_1.ValidationError('Invalid storage type');
    }
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const { backups, total } = await backupService.listBackups(source, pageNum, limitNum);
    res.json({
        success: true,
        data: backups,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        },
    });
}));
// Verify backup
router.post('/backups/verify', [
    (0, express_validator_1.body)('source').isObject().withMessage('Source is required'),
    (0, express_validator_1.body)('source.type').isIn(['local', 's3', 'sftp']).withMessage('Invalid source type'),
    (0, express_validator_1.body)('expectedChecksum').optional().isString(),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const { source, expectedChecksum } = req.body;
    const backup = await backupService.getBackupMetadata(source, source.path);
    // Create a temporary job config for verification
    const tempJob = {
        name: 'Manual Verification',
        source,
        schedule: '',
        retentionDays: 30,
        enabled: false,
    };
    const result = await verificationService.verifyBackup(tempJob, backup, expectedChecksum);
    res.json({
        success: true,
        data: result,
    });
}));
// Test restore
router.post('/backups/test-restore', [
    (0, express_validator_1.body)('source').isObject().withMessage('Source is required'),
    (0, express_validator_1.body)('source.type').isIn(['local', 's3', 'sftp']).withMessage('Invalid source type'),
    (0, express_validator_1.body)('restorePath').notEmpty().withMessage('Restore path is required'),
    (0, express_validator_1.body)('dryRun').optional().isBoolean(),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const { source, restorePath, dryRun = false } = req.body;
    const backup = await backupService.getBackupMetadata(source, source.path);
    // Create a temporary job config with test restore enabled
    const tempJob = {
        name: 'Manual Restore Test',
        source,
        schedule: '',
        retentionDays: 30,
        enabled: false,
        testRestore: {
            enabled: true,
            dryRun,
            restorePath,
        },
    };
    const result = await verificationService.verifyBackup(tempJob, backup);
    res.json({
        success: true,
        data: {
            restoreSuccess: result.restoreSuccess,
            restorePath: result.restorePath,
            dryRun,
            errors: result.errors,
            warnings: result.warnings,
        },
    });
}));
// Retention Routes
// Apply retention policy
router.post('/retention/apply', [
    (0, express_validator_1.body)('source').isObject().withMessage('Source is required'),
    (0, express_validator_1.body)('source.type').isIn(['local', 's3', 'sftp']).withMessage('Invalid source type'),
    (0, express_validator_1.body)('retentionDays').isInt({ min: 1 }).withMessage('Retention days must be positive'),
    (0, express_validator_1.body)('dryRun').optional().isBoolean(),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const { source, retentionDays, dryRun = false } = req.body;
    const result = await verificationService.applyRetentionPolicy(source, retentionDays, dryRun);
    res.json({
        success: true,
        data: result,
    });
}));
// Get retention preview
router.post('/retention/preview', [
    (0, express_validator_1.body)('source').isObject().withMessage('Source is required'),
    (0, express_validator_1.body)('source.type').isIn(['local', 's3', 'sftp']).withMessage('Invalid source type'),
    (0, express_validator_1.body)('retentionDays').isInt({ min: 1 }).withMessage('Retention days must be positive'),
    validate,
], (0, errors_1.asyncHandler)(async (req, res) => {
    const { source, retentionDays } = req.body;
    const result = await verificationService.applyRetentionPolicy(source, retentionDays, true // dry run
    );
    res.json({
        success: true,
        data: result,
    });
}));
exports.default = router;
//# sourceMappingURL=routes.js.map