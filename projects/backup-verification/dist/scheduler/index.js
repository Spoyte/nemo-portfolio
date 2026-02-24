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
exports.VerificationScheduler = void 0;
const cron = __importStar(require("node-cron"));
const verifier_1 = require("./verifier");
const notifiers_1 = require("../notifiers");
const logger_1 = require("../utils/logger");
class VerificationScheduler {
    tasks = new Map();
    verifier;
    notificationManager;
    logger;
    constructor(config) {
        this.logger = (0, logger_1.createLogger)(config.logLevel);
        this.verifier = new verifier_1.BackupVerifier(config);
        this.notificationManager = new notifiers_1.NotificationManager(config.globalNotifications);
    }
    start() {
        this.logger.info('Starting verification scheduler');
        for (const verification of this.verifier.getEnabledVerifications()) {
            if (verification.schedule) {
                this.scheduleVerification(verification);
            }
        }
    }
    stop() {
        this.logger.info('Stopping verification scheduler');
        for (const [name, task] of this.tasks) {
            task.stop();
            this.logger.debug(`Stopped scheduled task: ${name}`);
        }
        this.tasks.clear();
    }
    scheduleVerification(config) {
        if (!cron.validate(config.schedule)) {
            this.logger.error(`Invalid cron expression for ${config.name}: ${config.schedule}`);
            return;
        }
        const task = cron.schedule(config.schedule, async () => {
            this.logger.info(`Running scheduled verification: ${config.name}`);
            try {
                const result = await this.verifier.verify(config);
                if (!result.success) {
                    this.logger.warn(`Verification failed: ${config.name}`);
                    await this.notificationManager.notify(result);
                }
                else {
                    this.logger.info(`Verification passed: ${config.name}`);
                }
            }
            catch (error) {
                this.logger.error(`Verification error for ${config.name}:`, error);
            }
        }, {
            scheduled: true,
            timezone: process.env.TZ,
        });
        this.tasks.set(config.name, task);
        this.logger.info(`Scheduled verification: ${config.name} (${config.schedule})`);
    }
    runNow(name) {
        if (name) {
            const verification = this.verifier.getVerification(name);
            if (!verification) {
                throw new Error(`Verification not found: ${name}`);
            }
            return this.runVerification(verification);
        }
        // Run all verifications
        return this.runAll();
    }
    async runVerification(config) {
        this.logger.info(`Running verification: ${config.name}`);
        const result = await this.verifier.verify(config);
        if (!result.success) {
            await this.notificationManager.notify(result);
        }
    }
    async runAll() {
        const report = await this.verifier.verifyAll();
        if (report.failed > 0) {
            await this.notificationManager.notifyReport(report);
        }
    }
    getScheduledTasks() {
        return Array.from(this.tasks.keys());
    }
    isScheduled(name) {
        return this.tasks.has(name);
    }
}
exports.VerificationScheduler = VerificationScheduler;
//# sourceMappingURL=index.js.map