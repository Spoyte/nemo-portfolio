"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsGauge = exports.retentionCounter = exports.restoreCounter = exports.verificationDuration = exports.verificationCounter = exports.register = exports.healthRouter = void 0;
const express_1 = require("express");
const errors_1 = require("../utils/errors");
const config_1 = require("../config");
const prom_client_1 = __importDefault(require("prom-client"));
const router = (0, express_1.Router)();
exports.healthRouter = router;
// Create a Registry to register the metrics
const register = new prom_client_1.default.Registry();
exports.register = register;
// Add default metrics
prom_client_1.default.collectDefaultMetrics({ register });
// Custom metrics
const verificationCounter = new prom_client_1.default.Counter({
    name: 'backup_verification_total',
    help: 'Total number of backup verifications',
    labelNames: ['status', 'source_type'],
    registers: [register],
});
exports.verificationCounter = verificationCounter;
const verificationDuration = new prom_client_1.default.Histogram({
    name: 'backup_verification_duration_seconds',
    help: 'Duration of backup verifications in seconds',
    labelNames: ['source_type'],
    buckets: [1, 5, 10, 30, 60, 120, 300],
    registers: [register],
});
exports.verificationDuration = verificationDuration;
const restoreCounter = new prom_client_1.default.Counter({
    name: 'backup_restore_test_total',
    help: 'Total number of backup restore tests',
    labelNames: ['status', 'source_type'],
    registers: [register],
});
exports.restoreCounter = restoreCounter;
const retentionCounter = new prom_client_1.default.Counter({
    name: 'backup_retention_cleanup_total',
    help: 'Total number of retention cleanup operations',
    labelNames: ['status'],
    registers: [register],
});
exports.retentionCounter = retentionCounter;
const jobsGauge = new prom_client_1.default.Gauge({
    name: 'backup_verification_jobs',
    help: 'Number of configured backup verification jobs',
    labelNames: ['status'],
    registers: [register],
});
exports.jobsGauge = jobsGauge;
// Health check endpoint
router.get('/health', (0, errors_1.asyncHandler)(async (_req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: config_1.appConfig.nodeEnv,
    };
    res.json({
        success: true,
        data: health,
    });
}));
// Readiness probe
router.get('/ready', (0, errors_1.asyncHandler)(async (_req, res) => {
    // Add any readiness checks here
    res.json({
        success: true,
        status: 'ready',
    });
}));
// Liveness probe
router.get('/live', (0, errors_1.asyncHandler)(async (_req, res) => {
    res.json({
        success: true,
        status: 'alive',
    });
}));
// Metrics endpoint (Prometheus format)
router.get('/metrics', (0, errors_1.asyncHandler)(async (_req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
}));
//# sourceMappingURL=health.js.map