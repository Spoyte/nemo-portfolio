import { z } from 'zod';
export declare const ChecksumAlgorithmSchema: z.ZodEnum<["sha256", "md5"]>;
export type ChecksumAlgorithm = z.infer<typeof ChecksumAlgorithmSchema>;
export declare const BackupTypeSchema: z.ZodEnum<["file", "database", "s3", "gcs", "azure"]>;
export type BackupType = z.infer<typeof BackupTypeSchema>;
export declare const DatabaseTypeSchema: z.ZodEnum<["mysql", "postgresql"]>;
export type DatabaseType = z.infer<typeof DatabaseTypeSchema>;
export declare const NotificationTypeSchema: z.ZodEnum<["email", "webhook", "slack"]>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export declare const RetentionPolicySchema: z.ZodObject<{
    days: z.ZodNumber;
    keepLast: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    days: number;
    keepLast?: number | undefined;
}, {
    days: number;
    keepLast?: number | undefined;
}>;
export declare const FileBackupConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"file">;
    path: z.ZodString;
    checksumFile: z.ZodOptional<z.ZodString>;
    expectedChecksum: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "file";
    checksumFile?: string | undefined;
    expectedChecksum?: string | undefined;
}, {
    path: string;
    type: "file";
    checksumFile?: string | undefined;
    expectedChecksum?: string | undefined;
}>;
export declare const DatabaseBackupConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"database">;
    dbType: z.ZodEnum<["mysql", "postgresql"]>;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    backupPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "database";
    database: string;
    dbType: "mysql" | "postgresql";
    host: string;
    port: number;
    username: string;
    password: string;
    backupPath: string;
}, {
    type: "database";
    database: string;
    dbType: "mysql" | "postgresql";
    host: string;
    username: string;
    password: string;
    backupPath: string;
    port?: number | undefined;
}>;
export declare const S3BackupConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"s3">;
    bucket: z.ZodString;
    key: z.ZodString;
    region: z.ZodString;
    accessKeyId: z.ZodString;
    secretAccessKey: z.ZodString;
    endpoint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "s3";
    bucket: string;
    key: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string | undefined;
}, {
    type: "s3";
    bucket: string;
    key: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string | undefined;
}>;
export declare const GCSBackupConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"gcs">;
    bucket: z.ZodString;
    key: z.ZodString;
    projectId: z.ZodString;
    keyFilename: z.ZodOptional<z.ZodString>;
    credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "gcs";
    bucket: string;
    key: string;
    projectId: string;
    keyFilename?: string | undefined;
    credentials?: Record<string, any> | undefined;
}, {
    type: "gcs";
    bucket: string;
    key: string;
    projectId: string;
    keyFilename?: string | undefined;
    credentials?: Record<string, any> | undefined;
}>;
export declare const AzureBackupConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"azure">;
    accountName: z.ZodString;
    containerName: z.ZodString;
    blobName: z.ZodString;
    connectionString: z.ZodOptional<z.ZodString>;
    accountKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "azure";
    accountName: string;
    containerName: string;
    blobName: string;
    connectionString?: string | undefined;
    accountKey?: string | undefined;
}, {
    type: "azure";
    accountName: string;
    containerName: string;
    blobName: string;
    connectionString?: string | undefined;
    accountKey?: string | undefined;
}>;
export declare const BackupSourceSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"file">;
    path: z.ZodString;
    checksumFile: z.ZodOptional<z.ZodString>;
    expectedChecksum: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "file";
    checksumFile?: string | undefined;
    expectedChecksum?: string | undefined;
}, {
    path: string;
    type: "file";
    checksumFile?: string | undefined;
    expectedChecksum?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"database">;
    dbType: z.ZodEnum<["mysql", "postgresql"]>;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    backupPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "database";
    database: string;
    dbType: "mysql" | "postgresql";
    host: string;
    port: number;
    username: string;
    password: string;
    backupPath: string;
}, {
    type: "database";
    database: string;
    dbType: "mysql" | "postgresql";
    host: string;
    username: string;
    password: string;
    backupPath: string;
    port?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"s3">;
    bucket: z.ZodString;
    key: z.ZodString;
    region: z.ZodString;
    accessKeyId: z.ZodString;
    secretAccessKey: z.ZodString;
    endpoint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "s3";
    bucket: string;
    key: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string | undefined;
}, {
    type: "s3";
    bucket: string;
    key: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"gcs">;
    bucket: z.ZodString;
    key: z.ZodString;
    projectId: z.ZodString;
    keyFilename: z.ZodOptional<z.ZodString>;
    credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "gcs";
    bucket: string;
    key: string;
    projectId: string;
    keyFilename?: string | undefined;
    credentials?: Record<string, any> | undefined;
}, {
    type: "gcs";
    bucket: string;
    key: string;
    projectId: string;
    keyFilename?: string | undefined;
    credentials?: Record<string, any> | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"azure">;
    accountName: z.ZodString;
    containerName: z.ZodString;
    blobName: z.ZodString;
    connectionString: z.ZodOptional<z.ZodString>;
    accountKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "azure";
    accountName: string;
    containerName: string;
    blobName: string;
    connectionString?: string | undefined;
    accountKey?: string | undefined;
}, {
    type: "azure";
    accountName: string;
    containerName: string;
    blobName: string;
    connectionString?: string | undefined;
    accountKey?: string | undefined;
}>]>;
export declare const EmailNotificationSchema: z.ZodObject<{
    type: z.ZodLiteral<"email">;
    smtp: z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodDefault<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            user: string;
            pass: string;
        }, {
            user: string;
            pass: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }, {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    }>;
    from: z.ZodString;
    to: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "email";
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    from: string;
    to: string[];
}, {
    type: "email";
    smtp: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    };
    from: string;
    to: string[];
}>;
export declare const WebhookNotificationSchema: z.ZodObject<{
    type: z.ZodLiteral<"webhook">;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    method: z.ZodDefault<z.ZodEnum<["POST", "PUT"]>>;
}, "strip", z.ZodTypeAny, {
    type: "webhook";
    url: string;
    method: "POST" | "PUT";
    headers?: Record<string, string> | undefined;
}, {
    type: "webhook";
    url: string;
    headers?: Record<string, string> | undefined;
    method?: "POST" | "PUT" | undefined;
}>;
export declare const SlackNotificationSchema: z.ZodObject<{
    type: z.ZodLiteral<"slack">;
    webhookUrl: z.ZodString;
    channel: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "slack";
    webhookUrl: string;
    username?: string | undefined;
    channel?: string | undefined;
}, {
    type: "slack";
    webhookUrl: string;
    username?: string | undefined;
    channel?: string | undefined;
}>;
export declare const NotificationConfigSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"email">;
    smtp: z.ZodObject<{
        host: z.ZodString;
        port: z.ZodNumber;
        secure: z.ZodDefault<z.ZodBoolean>;
        auth: z.ZodObject<{
            user: z.ZodString;
            pass: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            user: string;
            pass: string;
        }, {
            user: string;
            pass: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    }, {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    }>;
    from: z.ZodString;
    to: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "email";
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    from: string;
    to: string[];
}, {
    type: "email";
    smtp: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
        secure?: boolean | undefined;
    };
    from: string;
    to: string[];
}>, z.ZodObject<{
    type: z.ZodLiteral<"webhook">;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    method: z.ZodDefault<z.ZodEnum<["POST", "PUT"]>>;
}, "strip", z.ZodTypeAny, {
    type: "webhook";
    url: string;
    method: "POST" | "PUT";
    headers?: Record<string, string> | undefined;
}, {
    type: "webhook";
    url: string;
    headers?: Record<string, string> | undefined;
    method?: "POST" | "PUT" | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"slack">;
    webhookUrl: z.ZodString;
    channel: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "slack";
    webhookUrl: string;
    username?: string | undefined;
    channel?: string | undefined;
}, {
    type: "slack";
    webhookUrl: string;
    username?: string | undefined;
    channel?: string | undefined;
}>]>;
export declare const VerificationConfigSchema: z.ZodObject<{
    name: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"file">;
        path: z.ZodString;
        checksumFile: z.ZodOptional<z.ZodString>;
        expectedChecksum: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: "file";
        checksumFile?: string | undefined;
        expectedChecksum?: string | undefined;
    }, {
        path: string;
        type: "file";
        checksumFile?: string | undefined;
        expectedChecksum?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"database">;
        dbType: z.ZodEnum<["mysql", "postgresql"]>;
        host: z.ZodString;
        port: z.ZodDefault<z.ZodNumber>;
        username: z.ZodString;
        password: z.ZodString;
        database: z.ZodString;
        backupPath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "database";
        database: string;
        dbType: "mysql" | "postgresql";
        host: string;
        port: number;
        username: string;
        password: string;
        backupPath: string;
    }, {
        type: "database";
        database: string;
        dbType: "mysql" | "postgresql";
        host: string;
        username: string;
        password: string;
        backupPath: string;
        port?: number | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"s3">;
        bucket: z.ZodString;
        key: z.ZodString;
        region: z.ZodString;
        accessKeyId: z.ZodString;
        secretAccessKey: z.ZodString;
        endpoint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "s3";
        bucket: string;
        key: string;
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        endpoint?: string | undefined;
    }, {
        type: "s3";
        bucket: string;
        key: string;
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        endpoint?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gcs">;
        bucket: z.ZodString;
        key: z.ZodString;
        projectId: z.ZodString;
        keyFilename: z.ZodOptional<z.ZodString>;
        credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "gcs";
        bucket: string;
        key: string;
        projectId: string;
        keyFilename?: string | undefined;
        credentials?: Record<string, any> | undefined;
    }, {
        type: "gcs";
        bucket: string;
        key: string;
        projectId: string;
        keyFilename?: string | undefined;
        credentials?: Record<string, any> | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"azure">;
        accountName: z.ZodString;
        containerName: z.ZodString;
        blobName: z.ZodString;
        connectionString: z.ZodOptional<z.ZodString>;
        accountKey: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "azure";
        accountName: string;
        containerName: string;
        blobName: string;
        connectionString?: string | undefined;
        accountKey?: string | undefined;
    }, {
        type: "azure";
        accountName: string;
        containerName: string;
        blobName: string;
        connectionString?: string | undefined;
        accountKey?: string | undefined;
    }>]>;
    checksumAlgorithm: z.ZodDefault<z.ZodEnum<["sha256", "md5"]>>;
    verifyChecksum: z.ZodDefault<z.ZodBoolean>;
    testRestore: z.ZodDefault<z.ZodBoolean>;
    restorePath: z.ZodOptional<z.ZodString>;
    retention: z.ZodOptional<z.ZodObject<{
        days: z.ZodNumber;
        keepLast: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        days: number;
        keepLast?: number | undefined;
    }, {
        days: number;
        keepLast?: number | undefined;
    }>>;
    schedule: z.ZodOptional<z.ZodString>;
    notifications: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"email">;
        smtp: z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            secure: z.ZodDefault<z.ZodBoolean>;
            auth: z.ZodObject<{
                user: z.ZodString;
                pass: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                user: string;
                pass: string;
            }, {
                user: string;
                pass: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        }, {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        }>;
        from: z.ZodString;
        to: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "email";
        smtp: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
        from: string;
        to: string[];
    }, {
        type: "email";
        smtp: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        };
        from: string;
        to: string[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodDefault<z.ZodEnum<["POST", "PUT"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        url: string;
        method: "POST" | "PUT";
        headers?: Record<string, string> | undefined;
    }, {
        type: "webhook";
        url: string;
        headers?: Record<string, string> | undefined;
        method?: "POST" | "PUT" | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"slack">;
        webhookUrl: z.ZodString;
        channel: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    }, {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    }>]>, "many">>;
    timeout: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    enabled: boolean;
    source: {
        path: string;
        type: "file";
        checksumFile?: string | undefined;
        expectedChecksum?: string | undefined;
    } | {
        type: "database";
        database: string;
        dbType: "mysql" | "postgresql";
        host: string;
        port: number;
        username: string;
        password: string;
        backupPath: string;
    } | {
        type: "s3";
        bucket: string;
        key: string;
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        endpoint?: string | undefined;
    } | {
        type: "gcs";
        bucket: string;
        key: string;
        projectId: string;
        keyFilename?: string | undefined;
        credentials?: Record<string, any> | undefined;
    } | {
        type: "azure";
        accountName: string;
        containerName: string;
        blobName: string;
        connectionString?: string | undefined;
        accountKey?: string | undefined;
    };
    checksumAlgorithm: "sha256" | "md5";
    verifyChecksum: boolean;
    testRestore: boolean;
    notifications: ({
        type: "email";
        smtp: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
        from: string;
        to: string[];
    } | {
        type: "webhook";
        url: string;
        method: "POST" | "PUT";
        headers?: Record<string, string> | undefined;
    } | {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    })[];
    timeout: number;
    restorePath?: string | undefined;
    retention?: {
        days: number;
        keepLast?: number | undefined;
    } | undefined;
    schedule?: string | undefined;
}, {
    name: string;
    source: {
        path: string;
        type: "file";
        checksumFile?: string | undefined;
        expectedChecksum?: string | undefined;
    } | {
        type: "database";
        database: string;
        dbType: "mysql" | "postgresql";
        host: string;
        username: string;
        password: string;
        backupPath: string;
        port?: number | undefined;
    } | {
        type: "s3";
        bucket: string;
        key: string;
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        endpoint?: string | undefined;
    } | {
        type: "gcs";
        bucket: string;
        key: string;
        projectId: string;
        keyFilename?: string | undefined;
        credentials?: Record<string, any> | undefined;
    } | {
        type: "azure";
        accountName: string;
        containerName: string;
        blobName: string;
        connectionString?: string | undefined;
        accountKey?: string | undefined;
    };
    enabled?: boolean | undefined;
    checksumAlgorithm?: "sha256" | "md5" | undefined;
    verifyChecksum?: boolean | undefined;
    testRestore?: boolean | undefined;
    restorePath?: string | undefined;
    retention?: {
        days: number;
        keepLast?: number | undefined;
    } | undefined;
    schedule?: string | undefined;
    notifications?: ({
        type: "email";
        smtp: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        };
        from: string;
        to: string[];
    } | {
        type: "webhook";
        url: string;
        headers?: Record<string, string> | undefined;
        method?: "POST" | "PUT" | undefined;
    } | {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    })[] | undefined;
    timeout?: number | undefined;
}>;
export declare const ConfigSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    defaultChecksumAlgorithm: z.ZodDefault<z.ZodEnum<["sha256", "md5"]>>;
    verifications: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"file">;
            path: z.ZodString;
            checksumFile: z.ZodOptional<z.ZodString>;
            expectedChecksum: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        }, {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"database">;
            dbType: z.ZodEnum<["mysql", "postgresql"]>;
            host: z.ZodString;
            port: z.ZodDefault<z.ZodNumber>;
            username: z.ZodString;
            password: z.ZodString;
            database: z.ZodString;
            backupPath: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            port: number;
            username: string;
            password: string;
            backupPath: string;
        }, {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            username: string;
            password: string;
            backupPath: string;
            port?: number | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"s3">;
            bucket: z.ZodString;
            key: z.ZodString;
            region: z.ZodString;
            accessKeyId: z.ZodString;
            secretAccessKey: z.ZodString;
            endpoint: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        }, {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"gcs">;
            bucket: z.ZodString;
            key: z.ZodString;
            projectId: z.ZodString;
            keyFilename: z.ZodOptional<z.ZodString>;
            credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        }, {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"azure">;
            accountName: z.ZodString;
            containerName: z.ZodString;
            blobName: z.ZodString;
            connectionString: z.ZodOptional<z.ZodString>;
            accountKey: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        }, {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        }>]>;
        checksumAlgorithm: z.ZodDefault<z.ZodEnum<["sha256", "md5"]>>;
        verifyChecksum: z.ZodDefault<z.ZodBoolean>;
        testRestore: z.ZodDefault<z.ZodBoolean>;
        restorePath: z.ZodOptional<z.ZodString>;
        retention: z.ZodOptional<z.ZodObject<{
            days: z.ZodNumber;
            keepLast: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            days: number;
            keepLast?: number | undefined;
        }, {
            days: number;
            keepLast?: number | undefined;
        }>>;
        schedule: z.ZodOptional<z.ZodString>;
        notifications: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"email">;
            smtp: z.ZodObject<{
                host: z.ZodString;
                port: z.ZodNumber;
                secure: z.ZodDefault<z.ZodBoolean>;
                auth: z.ZodObject<{
                    user: z.ZodString;
                    pass: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    user: string;
                    pass: string;
                }, {
                    user: string;
                    pass: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                host: string;
                port: number;
                secure: boolean;
                auth: {
                    user: string;
                    pass: string;
                };
            }, {
                host: string;
                port: number;
                auth: {
                    user: string;
                    pass: string;
                };
                secure?: boolean | undefined;
            }>;
            from: z.ZodString;
            to: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            type: "email";
            smtp: {
                host: string;
                port: number;
                secure: boolean;
                auth: {
                    user: string;
                    pass: string;
                };
            };
            from: string;
            to: string[];
        }, {
            type: "email";
            smtp: {
                host: string;
                port: number;
                auth: {
                    user: string;
                    pass: string;
                };
                secure?: boolean | undefined;
            };
            from: string;
            to: string[];
        }>, z.ZodObject<{
            type: z.ZodLiteral<"webhook">;
            url: z.ZodString;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            method: z.ZodDefault<z.ZodEnum<["POST", "PUT"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "webhook";
            url: string;
            method: "POST" | "PUT";
            headers?: Record<string, string> | undefined;
        }, {
            type: "webhook";
            url: string;
            headers?: Record<string, string> | undefined;
            method?: "POST" | "PUT" | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"slack">;
            webhookUrl: z.ZodString;
            channel: z.ZodOptional<z.ZodString>;
            username: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        }, {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        }>]>, "many">>;
        timeout: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        enabled: boolean;
        source: {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        } | {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            port: number;
            username: string;
            password: string;
            backupPath: string;
        } | {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        } | {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        } | {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        };
        checksumAlgorithm: "sha256" | "md5";
        verifyChecksum: boolean;
        testRestore: boolean;
        notifications: ({
            type: "email";
            smtp: {
                host: string;
                port: number;
                secure: boolean;
                auth: {
                    user: string;
                    pass: string;
                };
            };
            from: string;
            to: string[];
        } | {
            type: "webhook";
            url: string;
            method: "POST" | "PUT";
            headers?: Record<string, string> | undefined;
        } | {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        })[];
        timeout: number;
        restorePath?: string | undefined;
        retention?: {
            days: number;
            keepLast?: number | undefined;
        } | undefined;
        schedule?: string | undefined;
    }, {
        name: string;
        source: {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        } | {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            username: string;
            password: string;
            backupPath: string;
            port?: number | undefined;
        } | {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        } | {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        } | {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        };
        enabled?: boolean | undefined;
        checksumAlgorithm?: "sha256" | "md5" | undefined;
        verifyChecksum?: boolean | undefined;
        testRestore?: boolean | undefined;
        restorePath?: string | undefined;
        retention?: {
            days: number;
            keepLast?: number | undefined;
        } | undefined;
        schedule?: string | undefined;
        notifications?: ({
            type: "email";
            smtp: {
                host: string;
                port: number;
                auth: {
                    user: string;
                    pass: string;
                };
                secure?: boolean | undefined;
            };
            from: string;
            to: string[];
        } | {
            type: "webhook";
            url: string;
            headers?: Record<string, string> | undefined;
            method?: "POST" | "PUT" | undefined;
        } | {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        })[] | undefined;
        timeout?: number | undefined;
    }>, "many">;
    globalNotifications: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"email">;
        smtp: z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            secure: z.ZodDefault<z.ZodBoolean>;
            auth: z.ZodObject<{
                user: z.ZodString;
                pass: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                user: string;
                pass: string;
            }, {
                user: string;
                pass: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        }, {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        }>;
        from: z.ZodString;
        to: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "email";
        smtp: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
        from: string;
        to: string[];
    }, {
        type: "email";
        smtp: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        };
        from: string;
        to: string[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"webhook">;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        method: z.ZodDefault<z.ZodEnum<["POST", "PUT"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "webhook";
        url: string;
        method: "POST" | "PUT";
        headers?: Record<string, string> | undefined;
    }, {
        type: "webhook";
        url: string;
        headers?: Record<string, string> | undefined;
        method?: "POST" | "PUT" | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"slack">;
        webhookUrl: z.ZodString;
        channel: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    }, {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    }>]>, "many">>;
    tempDir: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    logLevel: "error" | "warn" | "info" | "debug";
    defaultChecksumAlgorithm: "sha256" | "md5";
    verifications: {
        name: string;
        enabled: boolean;
        source: {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        } | {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            port: number;
            username: string;
            password: string;
            backupPath: string;
        } | {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        } | {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        } | {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        };
        checksumAlgorithm: "sha256" | "md5";
        verifyChecksum: boolean;
        testRestore: boolean;
        notifications: ({
            type: "email";
            smtp: {
                host: string;
                port: number;
                secure: boolean;
                auth: {
                    user: string;
                    pass: string;
                };
            };
            from: string;
            to: string[];
        } | {
            type: "webhook";
            url: string;
            method: "POST" | "PUT";
            headers?: Record<string, string> | undefined;
        } | {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        })[];
        timeout: number;
        restorePath?: string | undefined;
        retention?: {
            days: number;
            keepLast?: number | undefined;
        } | undefined;
        schedule?: string | undefined;
    }[];
    globalNotifications: ({
        type: "email";
        smtp: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
        from: string;
        to: string[];
    } | {
        type: "webhook";
        url: string;
        method: "POST" | "PUT";
        headers?: Record<string, string> | undefined;
    } | {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    })[];
    tempDir: string;
}, {
    verifications: {
        name: string;
        source: {
            path: string;
            type: "file";
            checksumFile?: string | undefined;
            expectedChecksum?: string | undefined;
        } | {
            type: "database";
            database: string;
            dbType: "mysql" | "postgresql";
            host: string;
            username: string;
            password: string;
            backupPath: string;
            port?: number | undefined;
        } | {
            type: "s3";
            bucket: string;
            key: string;
            region: string;
            accessKeyId: string;
            secretAccessKey: string;
            endpoint?: string | undefined;
        } | {
            type: "gcs";
            bucket: string;
            key: string;
            projectId: string;
            keyFilename?: string | undefined;
            credentials?: Record<string, any> | undefined;
        } | {
            type: "azure";
            accountName: string;
            containerName: string;
            blobName: string;
            connectionString?: string | undefined;
            accountKey?: string | undefined;
        };
        enabled?: boolean | undefined;
        checksumAlgorithm?: "sha256" | "md5" | undefined;
        verifyChecksum?: boolean | undefined;
        testRestore?: boolean | undefined;
        restorePath?: string | undefined;
        retention?: {
            days: number;
            keepLast?: number | undefined;
        } | undefined;
        schedule?: string | undefined;
        notifications?: ({
            type: "email";
            smtp: {
                host: string;
                port: number;
                auth: {
                    user: string;
                    pass: string;
                };
                secure?: boolean | undefined;
            };
            from: string;
            to: string[];
        } | {
            type: "webhook";
            url: string;
            headers?: Record<string, string> | undefined;
            method?: "POST" | "PUT" | undefined;
        } | {
            type: "slack";
            webhookUrl: string;
            username?: string | undefined;
            channel?: string | undefined;
        })[] | undefined;
        timeout?: number | undefined;
    }[];
    version?: string | undefined;
    logLevel?: "error" | "warn" | "info" | "debug" | undefined;
    defaultChecksumAlgorithm?: "sha256" | "md5" | undefined;
    globalNotifications?: ({
        type: "email";
        smtp: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
            secure?: boolean | undefined;
        };
        from: string;
        to: string[];
    } | {
        type: "webhook";
        url: string;
        headers?: Record<string, string> | undefined;
        method?: "POST" | "PUT" | undefined;
    } | {
        type: "slack";
        webhookUrl: string;
        username?: string | undefined;
        channel?: string | undefined;
    })[] | undefined;
    tempDir?: string | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export type VerificationConfig = z.infer<typeof VerificationConfigSchema>;
export type BackupSource = z.infer<typeof BackupSourceSchema>;
export type NotificationConfig = z.infer<typeof NotificationConfigSchema>;
export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;
export type EmailNotification = z.infer<typeof EmailNotificationSchema>;
export type WebhookNotification = z.infer<typeof WebhookNotificationSchema>;
export type SlackNotification = z.infer<typeof SlackNotificationSchema>;
export type FileBackupConfig = z.infer<typeof FileBackupConfigSchema>;
export type DatabaseBackupConfig = z.infer<typeof DatabaseBackupConfigSchema>;
export type S3BackupConfig = z.infer<typeof S3BackupConfigSchema>;
export type GCSBackupConfig = z.infer<typeof GCSBackupConfigSchema>;
export type AzureBackupConfig = z.infer<typeof AzureBackupConfigSchema>;
export interface VerificationResult {
    name: string;
    timestamp: Date;
    success: boolean;
    duration: number;
    checksumValid: boolean;
    checksumDetails?: {
        algorithm: ChecksumAlgorithm;
        expected?: string;
        actual: string;
        match: boolean;
    };
    restoreTest?: {
        attempted: boolean;
        success: boolean;
        path?: string;
        error?: string;
    };
    retention?: {
        deleted: number;
        kept: number;
        errors: string[];
    };
    errors: string[];
    warnings: string[];
}
export interface IntegrityReport {
    timestamp: Date;
    total: number;
    passed: number;
    failed: number;
    results: VerificationResult[];
    summary: string;
}
export interface ChecksumInfo {
    algorithm: ChecksumAlgorithm;
    hash: string;
}
//# sourceMappingURL=index.d.ts.map