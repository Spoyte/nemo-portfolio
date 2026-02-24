import { NotificationConfig, VerificationResult, IntegrityReport, EmailNotification, WebhookNotification, SlackNotification } from '../types';
export declare abstract class Notifier {
    abstract send(result: VerificationResult): Promise<void>;
    abstract sendReport(report: IntegrityReport): Promise<void>;
}
export declare class EmailNotifier extends Notifier {
    private transporter;
    private config;
    constructor(config: EmailNotification);
    send(result: VerificationResult): Promise<void>;
    sendReport(report: IntegrityReport): Promise<void>;
    private formatResultHtml;
    private formatResultText;
    private formatReportHtml;
    private formatReportText;
}
export declare class WebhookNotifier extends Notifier {
    private config;
    constructor(config: WebhookNotification);
    send(result: VerificationResult): Promise<void>;
    sendReport(report: IntegrityReport): Promise<void>;
    private sendWebhook;
}
export declare class SlackNotifier extends Notifier {
    private config;
    constructor(config: SlackNotification);
    send(result: VerificationResult): Promise<void>;
    sendReport(report: IntegrityReport): Promise<void>;
    private sendToSlack;
}
export declare class NotifierFactory {
    static create(config: NotificationConfig): Notifier;
}
export declare class NotificationManager {
    private notifiers;
    constructor(configs: NotificationConfig[]);
    notify(result: VerificationResult): Promise<void>;
    notifyReport(report: IntegrityReport): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map