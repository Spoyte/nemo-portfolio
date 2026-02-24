export interface AppConfig {
    nodeEnv: string;
    port: number;
    logLevel: string;
    logDir: string;
    databaseUrl: string;
    localStoragePath: string;
    aws: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
    s3: {
        bucketName: string;
    };
    sftp: {
        host: string;
        port: number;
        username: string;
        password: string;
        privateKeyPath: string;
    };
    webhook: {
        url: string;
        secret: string;
    };
    retention: {
        defaultDays: number;
        maxDays: number;
    };
    security: {
        apiKey: string;
        jwtSecret: string;
    };
    metrics: {
        enabled: boolean;
        port: number;
    };
}
export declare const appConfig: AppConfig;
export default appConfig;
//# sourceMappingURL=index.d.ts.map