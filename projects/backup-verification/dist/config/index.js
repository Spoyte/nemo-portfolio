"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function getEnvVar(key, defaultValue) {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        return '';
    }
    return value;
}
function getEnvVarAsInt(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined) {
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}
function getEnvVarAsBool(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined) {
        return defaultValue;
    }
    return value.toLowerCase() === 'true';
}
exports.appConfig = {
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    port: getEnvVarAsInt('PORT', 3000),
    logLevel: getEnvVar('LOG_LEVEL', 'info'),
    logDir: getEnvVar('LOG_DIR', './data/logs'),
    databaseUrl: getEnvVar('DATABASE_URL', 'sqlite:./data/backup-verification.db'),
    localStoragePath: getEnvVar('LOCAL_STORAGE_PATH', './data/backups'),
    aws: {
        region: getEnvVar('AWS_REGION', 'us-east-1'),
        accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY', ''),
    },
    s3: {
        bucketName: getEnvVar('S3_BUCKET_NAME', ''),
    },
    sftp: {
        host: getEnvVar('SFTP_HOST', ''),
        port: getEnvVarAsInt('SFTP_PORT', 22),
        username: getEnvVar('SFTP_USERNAME', ''),
        password: getEnvVar('SFTP_PASSWORD', ''),
        privateKeyPath: getEnvVar('SFTP_PRIVATE_KEY_PATH', ''),
    },
    webhook: {
        url: getEnvVar('WEBHOOK_URL', ''),
        secret: getEnvVar('WEBHOOK_SECRET', ''),
    },
    retention: {
        defaultDays: getEnvVarAsInt('DEFAULT_RETENTION_DAYS', 30),
        maxDays: getEnvVarAsInt('MAX_RETENTION_DAYS', 365),
    },
    security: {
        apiKey: getEnvVar('API_KEY', ''),
        jwtSecret: getEnvVar('JWT_SECRET', 'change-this-in-production'),
    },
    metrics: {
        enabled: getEnvVarAsBool('METRICS_ENABLED', true),
        port: getEnvVarAsInt('METRICS_PORT', 9090),
    },
};
exports.default = exports.appConfig;
//# sourceMappingURL=index.js.map