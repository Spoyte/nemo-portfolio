"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class WebhookService {
    webhookUrl;
    webhookSecret;
    constructor() {
        this.webhookUrl = config_1.appConfig.webhook.url;
        this.webhookSecret = config_1.appConfig.webhook.secret;
    }
    async sendNotification(event, details, jobId, jobName) {
        if (!this.webhookUrl) {
            logger_1.logger.debug('No webhook URL configured, skipping notification');
            return;
        }
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            jobId,
            jobName,
            details,
        };
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (this.webhookSecret) {
                const signature = this.generateSignature(payload);
                headers['X-Webhook-Signature'] = signature;
            }
            await axios_1.default.post(this.webhookUrl, payload, {
                headers,
                timeout: 30000,
            });
            logger_1.logger.info(`Webhook notification sent for event: ${event}`, {
                jobId,
                jobName,
            });
        }
        catch (error) {
            logger_1.logger.error(`Failed to send webhook notification for event ${event}:`, error);
            // Don't throw - webhook failures shouldn't break the main flow
        }
    }
    async sendVerificationFailed(jobId, jobName, backupPath, error, expectedChecksum, actualChecksum) {
        await this.sendNotification('verification.failed', {
            backupPath,
            error,
            expectedChecksum,
            actualChecksum,
        }, jobId, jobName);
    }
    async sendVerificationWarning(jobId, jobName, backupPath, warnings) {
        await this.sendNotification('verification.warning', {
            backupPath,
            warnings,
        }, jobId, jobName);
    }
    async sendRestoreFailed(jobId, jobName, backupPath, error) {
        await this.sendNotification('restore.failed', {
            backupPath,
            error,
        }, jobId, jobName);
    }
    async sendRestoreCompleted(jobId, jobName, backupPath, restorePath, dryRun) {
        await this.sendNotification('restore.completed', {
            backupPath,
            restorePath,
            dryRun,
        }, jobId, jobName);
    }
    async sendRetentionCompleted(filesScanned, filesDeleted, bytesFreed) {
        await this.sendNotification('retention.completed', {
            filesScanned,
            filesDeleted,
            bytesFreed,
        });
    }
    generateSignature(payload) {
        const hmac = crypto_1.default.createHmac('sha256', this.webhookSecret);
        hmac.update(JSON.stringify(payload));
        return `sha256=${hmac.digest('hex')}`;
    }
}
exports.WebhookService = WebhookService;
exports.default = WebhookService;
//# sourceMappingURL=webhook.js.map