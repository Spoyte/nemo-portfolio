"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = exports.VerificationConfigSchema = exports.NotificationConfigSchema = exports.SlackNotificationSchema = exports.WebhookNotificationSchema = exports.EmailNotificationSchema = exports.BackupSourceSchema = exports.AzureBackupConfigSchema = exports.GCSBackupConfigSchema = exports.S3BackupConfigSchema = exports.DatabaseBackupConfigSchema = exports.FileBackupConfigSchema = exports.RetentionPolicySchema = exports.NotificationTypeSchema = exports.DatabaseTypeSchema = exports.BackupTypeSchema = exports.ChecksumAlgorithmSchema = void 0;
const zod_1 = require("zod");
exports.ChecksumAlgorithmSchema = zod_1.z.enum(['sha256', 'md5']);
exports.BackupTypeSchema = zod_1.z.enum(['file', 'database', 's3', 'gcs', 'azure']);
exports.DatabaseTypeSchema = zod_1.z.enum(['mysql', 'postgresql']);
exports.NotificationTypeSchema = zod_1.z.enum(['email', 'webhook', 'slack']);
exports.RetentionPolicySchema = zod_1.z.object({
    days: zod_1.z.number().min(1),
    keepLast: zod_1.z.number().min(1).optional(),
});
exports.FileBackupConfigSchema = zod_1.z.object({
    type: zod_1.z.literal('file'),
    path: zod_1.z.string(),
    checksumFile: zod_1.z.string().optional(),
    expectedChecksum: zod_1.z.string().optional(),
});
exports.DatabaseBackupConfigSchema = zod_1.z.object({
    type: zod_1.z.literal('database'),
    dbType: exports.DatabaseTypeSchema,
    host: zod_1.z.string(),
    port: zod_1.z.number().default(3306),
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    database: zod_1.z.string(),
    backupPath: zod_1.z.string(),
});
exports.S3BackupConfigSchema = zod_1.z.object({
    type: zod_1.z.literal('s3'),
    bucket: zod_1.z.string(),
    key: zod_1.z.string(),
    region: zod_1.z.string(),
    accessKeyId: zod_1.z.string(),
    secretAccessKey: zod_1.z.string(),
    endpoint: zod_1.z.string().optional(),
});
exports.GCSBackupConfigSchema = zod_1.z.object({
    type: zod_1.z.literal('gcs'),
    bucket: zod_1.z.string(),
    key: zod_1.z.string(),
    projectId: zod_1.z.string(),
    keyFilename: zod_1.z.string().optional(),
    credentials: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.AzureBackupConfigSchema = zod_1.z.object({
    type: zod_1.z.literal('azure'),
    accountName: zod_1.z.string(),
    containerName: zod_1.z.string(),
    blobName: zod_1.z.string(),
    connectionString: zod_1.z.string().optional(),
    accountKey: zod_1.z.string().optional(),
});
exports.BackupSourceSchema = zod_1.z.discriminatedUnion('type', [
    exports.FileBackupConfigSchema,
    exports.DatabaseBackupConfigSchema,
    exports.S3BackupConfigSchema,
    exports.GCSBackupConfigSchema,
    exports.AzureBackupConfigSchema,
]);
exports.EmailNotificationSchema = zod_1.z.object({
    type: zod_1.z.literal('email'),
    smtp: zod_1.z.object({
        host: zod_1.z.string(),
        port: zod_1.z.number(),
        secure: zod_1.z.boolean().default(true),
        auth: zod_1.z.object({
            user: zod_1.z.string(),
            pass: zod_1.z.string(),
        }),
    }),
    from: zod_1.z.string(),
    to: zod_1.z.array(zod_1.z.string()),
});
exports.WebhookNotificationSchema = zod_1.z.object({
    type: zod_1.z.literal('webhook'),
    url: zod_1.z.string().url(),
    headers: zod_1.z.record(zod_1.z.string()).optional(),
    method: zod_1.z.enum(['POST', 'PUT']).default('POST'),
});
exports.SlackNotificationSchema = zod_1.z.object({
    type: zod_1.z.literal('slack'),
    webhookUrl: zod_1.z.string().url(),
    channel: zod_1.z.string().optional(),
    username: zod_1.z.string().optional(),
});
exports.NotificationConfigSchema = zod_1.z.discriminatedUnion('type', [
    exports.EmailNotificationSchema,
    exports.WebhookNotificationSchema,
    exports.SlackNotificationSchema,
]);
exports.VerificationConfigSchema = zod_1.z.object({
    name: zod_1.z.string(),
    enabled: zod_1.z.boolean().default(true),
    source: exports.BackupSourceSchema,
    checksumAlgorithm: exports.ChecksumAlgorithmSchema.default('sha256'),
    verifyChecksum: zod_1.z.boolean().default(true),
    testRestore: zod_1.z.boolean().default(false),
    restorePath: zod_1.z.string().optional(),
    retention: exports.RetentionPolicySchema.optional(),
    schedule: zod_1.z.string().optional(), // cron expression
    notifications: zod_1.z.array(exports.NotificationConfigSchema).default([]),
    timeout: zod_1.z.number().default(3600), // seconds
});
exports.ConfigSchema = zod_1.z.object({
    version: zod_1.z.string().default('1.0'),
    logLevel: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    defaultChecksumAlgorithm: exports.ChecksumAlgorithmSchema.default('sha256'),
    verifications: zod_1.z.array(exports.VerificationConfigSchema),
    globalNotifications: zod_1.z.array(exports.NotificationConfigSchema).default([]),
    tempDir: zod_1.z.string().default('/tmp/backup-verify'),
});
//# sourceMappingURL=index.js.map