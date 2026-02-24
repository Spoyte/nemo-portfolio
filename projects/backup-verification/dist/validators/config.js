"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const types_1 = require("../types");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
class ConfigLoader {
    static load(configPath) {
        if (!fs.existsSync(configPath)) {
            throw new Error(`Configuration file not found: ${configPath}`);
        }
        const content = fs.readFileSync(configPath, 'utf-8');
        const ext = path.extname(configPath).toLowerCase();
        let rawConfig;
        if (ext === '.json') {
            rawConfig = JSON.parse(content);
        }
        else if (ext === '.yaml' || ext === '.yml') {
            rawConfig = yaml.load(content);
        }
        else {
            // Try JSON first, then YAML
            try {
                rawConfig = JSON.parse(content);
            }
            catch {
                rawConfig = yaml.load(content);
            }
        }
        const result = types_1.ConfigSchema.safeParse(rawConfig);
        if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
            throw new Error(`Configuration validation failed:\n${issues}`);
        }
        return result.data;
    }
    static validate(config) {
        const result = types_1.ConfigSchema.safeParse(config);
        if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
            throw new Error(`Configuration validation failed:\n${issues}`);
        }
        return result.data;
    }
    static generateExample() {
        return {
            version: '1.0',
            logLevel: 'info',
            defaultChecksumAlgorithm: 'sha256',
            tempDir: '/tmp/backup-verify',
            verifications: [
                {
                    name: 'daily-files-backup',
                    enabled: true,
                    source: {
                        type: 'file',
                        path: '/backups/daily',
                        checksumFile: '/backups/daily.sha256',
                    },
                    checksumAlgorithm: 'sha256',
                    verifyChecksum: true,
                    testRestore: true,
                    restorePath: '/tmp/restore-test',
                    retention: {
                        days: 30,
                        keepLast: 7,
                    },
                    schedule: '0 2 * * *', // Daily at 2 AM
                    notifications: [
                        {
                            type: 'email',
                            smtp: {
                                host: 'smtp.example.com',
                                port: 587,
                                secure: false,
                                auth: {
                                    user: 'alerts@example.com',
                                    pass: 'password',
                                },
                            },
                            from: 'alerts@example.com',
                            to: ['admin@example.com'],
                        },
                    ],
                    timeout: 3600,
                },
                {
                    name: 's3-database-backup',
                    enabled: true,
                    source: {
                        type: 's3',
                        bucket: 'my-backup-bucket',
                        key: 'database/backup.sql.gz',
                        region: 'us-east-1',
                        accessKeyId: '${AWS_ACCESS_KEY_ID}',
                        secretAccessKey: '${AWS_SECRET_ACCESS_KEY}',
                    },
                    checksumAlgorithm: 'sha256',
                    verifyChecksum: true,
                    testRestore: false,
                    schedule: '0 3 * * *',
                    notifications: [],
                    timeout: 7200,
                },
            ],
            globalNotifications: [],
        };
    }
    static saveExample(configPath) {
        const example = this.generateExample();
        const ext = path.extname(configPath).toLowerCase();
        let content;
        if (ext === '.json') {
            content = JSON.stringify(example, null, 2);
        }
        else {
            content = yaml.dump(example, { indent: 2 });
        }
        fs.writeFileSync(configPath, content, 'utf-8');
    }
}
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=config.js.map