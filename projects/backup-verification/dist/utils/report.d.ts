import { IntegrityReport } from '../types';
export declare class ReportGenerator {
    private outputDir;
    constructor(outputDir?: string);
    generate(report: IntegrityReport): string;
    private generateHtml;
    generateConsoleReport(report: IntegrityReport): string;
}
//# sourceMappingURL=report.d.ts.map