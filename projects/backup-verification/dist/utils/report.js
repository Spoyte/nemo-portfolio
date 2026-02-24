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
exports.ReportGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ReportGenerator {
    outputDir;
    constructor(outputDir = './reports') {
        this.outputDir = outputDir;
        fs.mkdirSync(outputDir, { recursive: true });
    }
    generate(report) {
        const timestamp = report.timestamp.toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.outputDir, `report-${timestamp}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        // Also generate HTML report
        const htmlPath = path.join(this.outputDir, `report-${timestamp}.html`);
        fs.writeFileSync(htmlPath, this.generateHtml(report));
        return reportPath;
    }
    generateHtml(report) {
        const statusColor = report.failed === 0 ? '#28a745' : '#dc3545';
        const statusText = report.failed === 0 ? '✅ ALL PASSED' : '❌ FAILURES DETECTED';
        return `
<!DOCTYPE html>
<html>
<head>
  <title>Backup Verification Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 15px 25px; border-radius: 6px; text-align: center; }
    .stat.total { background: #e3f2fd; }
    .stat.passed { background: #e8f5e9; }
    .stat.failed { background: #ffebee; }
    .stat-value { font-size: 32px; font-weight: bold; color: #333; }
    .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
    .status { padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; color: white; background: ${statusColor}; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .badge-success { background: #28a745; color: white; }
    .badge-fail { background: #dc3545; color: white; }
    .timestamp { color: #666; font-size: 14px; }
    .error-list { margin: 0; padding-left: 20px; }
    .error-list li { color: #dc3545; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔒 Backup Verification Report</h1>
    <p class="timestamp">Generated: ${report.timestamp.toISOString()}</p>
    
    <div class="status" style="background: ${statusColor}">${statusText}</div>
    
    <div class="summary">
      <div class="stat total">
        <div class="stat-value">${report.total}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat passed">
        <div class="stat-value">${report.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat failed">
        <div class="stat-value">${report.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Checksum</th>
          <th>Restore Test</th>
          <th>Errors</th>
        </tr>
      </thead>
      <tbody>
        ${report.results.map(r => `
        <tr>
          <td>${r.name}</td>
          <td><span class="badge ${r.success ? 'badge-success' : 'badge-fail'}">${r.success ? 'PASS' : 'FAIL'}</span></td>
          <td>${r.duration}ms</td>
          <td>${r.checksumValid ? '✅ Valid' : '❌ Invalid'}</td>
          <td>${r.restoreTest?.attempted ? (r.restoreTest.success ? '✅ Success' : '❌ Failed') : 'N/A'}</td>
          <td>${r.errors.length > 0 ? `<ul class="error-list">${r.errors.map(e => `<li>${e}</li>`).join('')}</ul>` : '-'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
    }
    generateConsoleReport(report) {
        const lines = [];
        lines.push('');
        lines.push('╔════════════════════════════════════════════════════════════╗');
        lines.push('║           BACKUP VERIFICATION REPORT                       ║');
        lines.push('╠════════════════════════════════════════════════════════════╣');
        lines.push(`║  Timestamp: ${report.timestamp.toISOString().padEnd(45)} ║`);
        lines.push(`║  Total:     ${String(report.total).padEnd(45)} ║`);
        lines.push(`║  Passed:    ${String(report.passed).padEnd(45)} ║`);
        lines.push(`║  Failed:    ${String(report.failed).padEnd(45)} ║`);
        lines.push('╚════════════════════════════════════════════════════════════╝');
        lines.push('');
        for (const result of report.results) {
            const status = result.success ? '✅ PASS' : '❌ FAIL';
            lines.push(`${status} | ${result.name} (${result.duration}ms)`);
            if (!result.checksumValid) {
                lines.push(`      Checksum: INVALID`);
                if (result.checksumDetails) {
                    lines.push(`      Expected: ${result.checksumDetails.expected || 'N/A'}`);
                    lines.push(`      Actual:   ${result.checksumDetails.actual}`);
                }
            }
            if (result.restoreTest?.attempted && !result.restoreTest.success) {
                lines.push(`      Restore: FAILED - ${result.restoreTest.error || 'Unknown error'}`);
            }
            for (const error of result.errors) {
                lines.push(`      Error: ${error}`);
            }
        }
        lines.push('');
        lines.push(report.failed === 0 ? '✅ All verifications passed!' : `❌ ${report.failed} verification(s) failed!`);
        lines.push('');
        return lines.join('\n');
    }
}
exports.ReportGenerator = ReportGenerator;
//# sourceMappingURL=report.js.map