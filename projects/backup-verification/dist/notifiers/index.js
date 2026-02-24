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
exports.NotificationManager = exports.NotifierFactory = exports.SlackNotifier = exports.WebhookNotifier = exports.EmailNotifier = exports.Notifier = void 0;
const nodemailer = __importStar(require("nodemailer"));
class Notifier {
}
exports.Notifier = Notifier;
class EmailNotifier extends Notifier {
    transporter;
    config;
    constructor(config) {
        super();
        this.config = config;
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: config.smtp.auth,
        });
    }
    async send(result) {
        if (result.success)
            return; // Only notify on failures
        const subject = `❌ Backup Verification Failed: ${result.name}`;
        const html = this.formatResultHtml(result);
        await this.transporter.sendMail({
            from: this.config.from,
            to: this.config.to,
            subject,
            html,
            text: this.formatResultText(result),
        });
    }
    async sendReport(report) {
        const subject = `Backup Verification Report - ${report.failed > 0 ? '❌ FAILURES' : '✅ All Passed'}`;
        const html = this.formatReportHtml(report);
        await this.transporter.sendMail({
            from: this.config.from,
            to: this.config.to,
            subject,
            html,
            text: this.formatReportText(report),
        });
    }
    formatResultHtml(result) {
        return `
      <h2>Backup Verification Failed: ${result.name}</h2>
      <p><strong>Timestamp:</strong> ${result.timestamp.toISOString()}</p>
      <p><strong>Duration:</strong> ${result.duration}ms</p>
      <p><strong>Checksum Valid:</strong> ${result.checksumValid ? '✅ Yes' : '❌ No'}</p>
      
      ${result.checksumDetails ? `
      <h3>Checksum Details</h3>
      <ul>
        <li>Algorithm: ${result.checksumDetails.algorithm}</li>
        <li>Expected: ${result.checksumDetails.expected || 'N/A'}</li>
        <li>Actual: ${result.checksumDetails.actual}</li>
      </ul>
      ` : ''}
      
      ${result.restoreTest ? `
      <h3>Restore Test</h3>
      <ul>
        <li>Attempted: ${result.restoreTest.attempted ? 'Yes' : 'No'}</li>
        <li>Success: ${result.restoreTest.success ? '✅ Yes' : '❌ No'}</li>
        ${result.restoreTest.error ? `<li>Error: ${result.restoreTest.error}</li>` : ''}
      </ul>
      ` : ''}
      
      ${result.errors.length > 0 ? `
      <h3>Errors</h3>
      <ul>
        ${result.errors.map(e => `<li>${e}</li>`).join('')}
      </ul>
      ` : ''}
    `;
    }
    formatResultText(result) {
        return `
Backup Verification Failed: ${result.name}

Timestamp: ${result.timestamp.toISOString()}
Duration: ${result.duration}ms
Checksum Valid: ${result.checksumValid ? 'Yes' : 'No'}

${result.checksumDetails ? `
Checksum Details:
  Algorithm: ${result.checksumDetails.algorithm}
  Expected: ${result.checksumDetails.expected || 'N/A'}
  Actual: ${result.checksumDetails.actual}
` : ''}

${result.restoreTest ? `
Restore Test:
  Attempted: ${result.restoreTest.attempted ? 'Yes' : 'No'}
  Success: ${result.restoreTest.success ? 'Yes' : 'No'}
  ${result.restoreTest.error ? `Error: ${result.restoreTest.error}` : ''}
` : ''}

${result.errors.length > 0 ? `
Errors:
${result.errors.map(e => `  - ${e}`).join('\n')}
` : ''}
    `.trim();
    }
    formatReportHtml(report) {
        return `
      <h2>Backup Verification Report</h2>
      <p><strong>Timestamp:</strong> ${report.timestamp.toISOString()}</p>
      <p><strong>Total:</strong> ${report.total} | <strong>Passed:</strong> ${report.passed} | <strong>Failed:</strong> ${report.failed}</p>
      
      <h3>Results</h3>
      <table border="1" cellpadding="5">
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Checksum</th>
          <th>Restore</th>
        </tr>
        ${report.results.map(r => `
        <tr>
          <td>${r.name}</td>
          <td>${r.success ? '✅ Pass' : '❌ Fail'}</td>
          <td>${r.duration}ms</td>
          <td>${r.checksumValid ? '✅' : '❌'}</td>
          <td>${r.restoreTest?.attempted ? (r.restoreTest.success ? '✅' : '❌') : 'N/A'}</td>
        </tr>
        `).join('')}
      </table>
    `;
    }
    formatReportText(report) {
        return `
Backup Verification Report

Timestamp: ${report.timestamp.toISOString()}
Total: ${report.total} | Passed: ${report.passed} | Failed: ${report.failed}

Results:
${report.results.map(r => `
- ${r.name}: ${r.success ? 'PASS' : 'FAIL'} (${r.duration}ms)
  Checksum: ${r.checksumValid ? 'Valid' : 'Invalid'}
  Restore: ${r.restoreTest?.attempted ? (r.restoreTest.success ? 'Success' : 'Failed') : 'N/A'}
`).join('')}
    `.trim();
    }
}
exports.EmailNotifier = EmailNotifier;
class WebhookNotifier extends Notifier {
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    async send(result) {
        const payload = {
            type: 'backup_verification',
            status: result.success ? 'success' : 'failure',
            result,
        };
        await this.sendWebhook(payload);
    }
    async sendReport(report) {
        const payload = {
            type: 'backup_verification_report',
            report,
        };
        await this.sendWebhook(payload);
    }
    async sendWebhook(payload) {
        const response = await fetch(this.config.url, {
            method: this.config.method,
            headers: {
                'Content-Type': 'application/json',
                ...this.config.headers,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
        }
    }
}
exports.WebhookNotifier = WebhookNotifier;
class SlackNotifier extends Notifier {
    config;
    constructor(config) {
        super();
        this.config = config;
    }
    async send(result) {
        const color = result.success ? 'good' : 'danger';
        const text = result.success
            ? `✅ Backup verification passed: ${result.name}`
            : `❌ Backup verification failed: ${result.name}`;
        const payload = {
            text,
            channel: this.config.channel,
            username: this.config.username || 'Backup Verification',
            attachments: [
                {
                    color,
                    fields: [
                        { title: 'Name', value: result.name, short: true },
                        { title: 'Status', value: result.success ? 'Success' : 'Failed', short: true },
                        { title: 'Duration', value: `${result.duration}ms`, short: true },
                        { title: 'Checksum', value: result.checksumValid ? 'Valid' : 'Invalid', short: true },
                        ...(result.errors.length > 0 ? [{ title: 'Errors', value: result.errors.join('\n'), short: false }] : []),
                    ],
                },
            ],
        };
        await this.sendToSlack(payload);
    }
    async sendReport(report) {
        const color = report.failed === 0 ? 'good' : 'danger';
        const payload = {
            text: `Backup Verification Report - ${report.failed > 0 ? '❌ FAILURES DETECTED' : '✅ All Passed'}`,
            channel: this.config.channel,
            username: this.config.username || 'Backup Verification',
            attachments: [
                {
                    color,
                    fields: [
                        { title: 'Total', value: String(report.total), short: true },
                        { title: 'Passed', value: String(report.passed), short: true },
                        { title: 'Failed', value: String(report.failed), short: true },
                        { title: 'Timestamp', value: report.timestamp.toISOString(), short: true },
                    ],
                },
                ...report.results.filter(r => !r.success).map(r => ({
                    color: 'danger',
                    title: `Failed: ${r.name}`,
                    text: r.errors.join('\n') || 'No error details',
                })),
            ],
        };
        await this.sendToSlack(payload);
    }
    async sendToSlack(payload) {
        const response = await fetch(this.config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Slack notification failed: ${response.status} ${response.statusText}`);
        }
    }
}
exports.SlackNotifier = SlackNotifier;
class NotifierFactory {
    static create(config) {
        switch (config.type) {
            case 'email':
                return new EmailNotifier(config);
            case 'webhook':
                return new WebhookNotifier(config);
            case 'slack':
                return new SlackNotifier(config);
            default:
                throw new Error(`Unknown notification type: ${config.type}`);
        }
    }
}
exports.NotifierFactory = NotifierFactory;
class NotificationManager {
    notifiers;
    constructor(configs) {
        this.notifiers = configs.map(c => NotifierFactory.create(c));
    }
    async notify(result) {
        // Only notify on failures or if restore test failed
        if (result.success && (!result.restoreTest || result.restoreTest.success)) {
            return;
        }
        const errors = [];
        for (const notifier of this.notifiers) {
            try {
                await notifier.send(result);
            }
            catch (error) {
                errors.push(`Notification failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if (errors.length > 0) {
            console.error('Notification errors:', errors);
        }
    }
    async notifyReport(report) {
        const errors = [];
        for (const notifier of this.notifiers) {
            try {
                await notifier.sendReport(report);
            }
            catch (error) {
                errors.push(`Report notification failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if (errors.length > 0) {
            console.error('Report notification errors:', errors);
        }
    }
}
exports.NotificationManager = NotificationManager;
//# sourceMappingURL=index.js.map