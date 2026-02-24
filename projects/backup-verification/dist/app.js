"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errors_1 = require("./utils/errors");
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./api/routes"));
const health_1 = require("./api/health");
function createApp() {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    // Body parsing
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Request logging
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger_1.logger.info(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration,
                ip: req.ip,
            });
        });
        next();
    });
    // API routes
    app.use('/api/v1', routes_1.default);
    app.use('/', health_1.healthRouter);
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: 'Not found',
        });
    });
    // Error handler
    app.use(errors_1.errorHandler);
    return app;
}
exports.default = createApp;
//# sourceMappingURL=app.js.map