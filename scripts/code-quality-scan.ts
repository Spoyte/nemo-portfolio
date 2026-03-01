#!/usr/bin/env node
/**
 * Code Quality Scanner
 * Detects common code smells and anti-patterns automatically
 * 
 * Usage: node scripts/code-quality-scan.ts [path]
 * Default path: ./lib/art
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// TYPES
// ============================================================================

interface CodeIssue {
  file: string;
  line: number;
  type: "error" | "warning" | "info";
  category: IssueCategory;
  message: string;
  code: string;
}

type IssueCategory =
  | "unused-ref"
  | "dry-violation"
  | "missing-cleanup"
  | "debug-code"
  | "unused-import"
  | "inconsistent-naming"
  | "missing-type";

interface ScannerRule {
  name: string;
  category: IssueCategory;
  type: "error" | "warning" | "info";
  pattern: RegExp;
  message: string;
  extractCode?: (match: RegExpExecArray, lines: string[]) => string;
}

// ============================================================================
// SCANNER RULES - Detect common code smells
// ============================================================================

const RULES: ScannerRule[] = [
  // Debug code left in production
  {
    name: "console-log",
    category: "debug-code",
    type: "warning",
    pattern: /console\.(log|debug|warn|error|table)\s*\(/g,
    message: "Console statement found - remove before committing",
    extractCode: (match, lines) => match[0],
  },
  
  // Unused useRef that might indicate broken functionality
  {
    name: "unused-ref-canvas",
    category: "unused-ref",
    type: "error",
    pattern: /const\s+(\w+Ref)\s*=\s*useRef\s*<\s*HTMLCanvasElement\s*>/g,
    message: "Canvas ref created but verify it's actually used for rendering",
    extractCode: (match) => match[0],
  },
  
  // Missing cleanup in useEffect
  {
    name: "event-listener-no-cleanup",
    category: "missing-cleanup",
    type: "warning",
    pattern: /addEventListener\s*\(\s*['"](resize|scroll|keydown|keyup)['"]/g,
    message: "Event listener added - ensure cleanup in useEffect return",
    extractCode: (match) => match[0],
  },
  
  // setInterval without clearInterval
  {
    name: "interval-no-cleanup",
    category: "missing-cleanup",
    type: "error",
    pattern: /setInterval\s*\(/g,
    message: "setInterval found - MUST have corresponding clearInterval in cleanup",
    extractCode: (match) => match[0],
  },
  
  // requestAnimationFrame without cancel (only flag in React components/hooks context)
  {
    name: "raf-no-cleanup",
    category: "missing-cleanup",
    type: "warning", // Downgraded to warning - many legitimate uses
    pattern: /requestAnimationFrame\s*\(/g,
    message: "requestAnimationFrame found - verify cleanup if used in effect/component",
    extractCode: (match) => match[0],
  },
  
  // TODO/FIXME comments (info level - not bad, just tracking)
  {
    name: "todo-comment",
    category: "info",
    type: "info",
    pattern: /\/\/\s*(TODO|FIXME|HACK|XXX|BUG)/gi,
    message: "Pending work item found",
    extractCode: (match) => match[0],
  },
  
  // Duplicate function patterns (simple detection) - skip "generate" in art files as they're expected
  {
    name: "similar-function-names",
    category: "dry-violation",
    type: "info", // Downgraded - many legitimate cases in art generators
    pattern: /function\s+(render\w+)|const\s+(render\w+)\s*=/g,
    message: "Multiple render functions - verify no unnecessary duplication",
    extractCode: (match) => match[1] || match[2],
  },
  
  // Any type usage
  {
    name: "any-type",
    category: "missing-type",
    type: "warning",
    pattern: /:\s*any\s*[;,=)]/g,
    message: "'any' type found - use specific type or 'unknown'",
    extractCode: (match) => match[0],
  },
  
  // @ts-ignore without comment
  {
    name: "ts-ignore",
    category: "missing-type",
    type: "warning",
    pattern: /@ts-ignore(?!\s+\w)/g,
    message: "@ts-ignore without explanation - add reason or fix type",
    extractCode: (match) => match[0],
  },
];

// ============================================================================
// FILE SCANNER
// ============================================================================

function scanFile(filePath: string): CodeIssue[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const issues: CodeIssue[] = [];
  
  for (const rule of RULES) {
    let match: RegExpExecArray | null;
    // Reset regex lastIndex
    rule.pattern.lastIndex = 0;
    
    while ((match = rule.pattern.exec(content)) !== null) {
      // Calculate line number
      const lineNum = content.substring(0, match.index).split("\n").length;
      const line = lines[lineNum - 1] || "";
      
      issues.push({
        file: filePath,
        line: lineNum,
        type: rule.type,
        category: rule.category,
        message: rule.message,
        code: rule.extractCode ? rule.extractCode(match, lines) : line.trim(),
      });
    }
  }
  
  return issues;
}

// ============================================================================
// CROSS-FILE ANALYSIS
// ============================================================================

function analyzeCrossFilePatterns(files: string[]): CodeIssue[] {
  const issues: CodeIssue[] = [];
  const functionNames: Map<string, string[]> = new Map();
  
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    
    // Extract exported function names
    const exportFnPattern = /export\s+(?:async\s+)?function\s+(\w+)|export\s+const\s+(\w+)\s*[=:]/g;
    let match: RegExpExecArray | null;
    
    while ((match = exportFnPattern.exec(content)) !== null) {
      const fnName = match[1] || match[2];
      if (fnName) {
        const existing = functionNames.get(fnName) || [];
        existing.push(file);
        functionNames.set(fnName, existing);
      }
    }
  }
  
  // Check for similar function names across files (potential DRY violation)
  const names = Array.from(functionNames.keys());
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const name1 = names[i];
      const name2 = names[j];
      
      // Check for similar patterns (e.g., generateIndexImports vs generateImports)
      if (areSimilarNames(name1, name2)) {
        const files1 = functionNames.get(name1)!;
        const files2 = functionNames.get(name2)!;
        
        // Only flag if in different files
        const allFiles = new Set([...files1, ...files2]);
        if (allFiles.size > 1) {
          issues.push({
            file: Array.from(allFiles).join(", "),
            line: 0,
            type: "warning",
            category: "dry-violation",
            message: `Similar function names: "${name1}" and "${name2}" - potential DRY violation`,
            code: `${name1} / ${name2}`,
          });
        }
      }
    }
  }
  
  return issues;
}

function areSimilarNames(a: string, b: string): boolean {
  // Remove common prefixes/suffixes and compare
  const normalize = (s: string) => 
    s.replace(/^(get|set|generate|create|make|build|render)/, "")
     .replace(/(Map|List|Array|Fn|Func)$/, "")
     .toLowerCase();
  
  const normA = normalize(a);
  const normB = normalize(b);
  
  // Check if one contains the other or they're very similar
  if (normA === normB && a !== b) return true;
  if (normA.length > 3 && normB.includes(normA)) return true;
  if (normB.length > 3 && normA.includes(normB)) return true;
  
  return false;
}

// ============================================================================
// REPORTING
// ============================================================================

function generateReport(issues: CodeIssue[]): string {
  if (issues.length === 0) {
    return "✅ No code quality issues found!\n";
  }
  
  // Group by category
  const byCategory = new Map<IssueCategory, CodeIssue[]>();
  for (const issue of issues) {
    const existing = byCategory.get(issue.category) || [];
    existing.push(issue);
    byCategory.set(issue.category, existing);
  }
  
  // Group by file for detailed view
  const byFile = new Map<string, CodeIssue[]>();
  for (const issue of issues) {
    const existing = byFile.get(issue.file) || [];
    existing.push(issue);
    byFile.set(issue.file, existing);
  }
  
  const errorCount = issues.filter(i => i.type === "error").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  const infoCount = issues.filter(i => i.type === "info").length;
  
  let report = `
╔══════════════════════════════════════════════════════════════════╗
║                    CODE QUALITY SCAN REPORT                      ║
╠══════════════════════════════════════════════════════════════════╣
║  Files scanned: ${String(byFile.size).padEnd(47)} ║
║  Total issues: ${String(issues.length).padEnd(48)} ║
║  Errors: ${String(errorCount).padEnd(54)} ║
║  Warnings: ${String(warningCount).padEnd(52)} ║
║  Info: ${String(infoCount).padEnd(56)} ║
╚══════════════════════════════════════════════════════════════════╝

`;
  
  // Summary by category
  report += "📊 ISSUES BY CATEGORY\n";
  report += "━".repeat(50) + "\n";
  for (const [category, catIssues] of byCategory) {
    const icon = catIssues[0].type === "error" ? "❌" : catIssues[0].type === "warning" ? "⚠️" : "ℹ️";
    report += `${icon} ${category}: ${catIssues.length}\n`;
  }
  
  // Detailed view
  report += "\n\n📁 DETAILED BREAKDOWN\n";
  report += "━".repeat(50) + "\n";
  
  for (const [file, fileIssues] of byFile) {
    report += `\n${file}\n`;
    report += "─".repeat(file.length) + "\n";
    
    // Sort by line number
    fileIssues.sort((a, b) => a.line - b.line);
    
    for (const issue of fileIssues) {
      const icon = issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "ℹ️";
      const lineStr = issue.line > 0 ? `:${issue.line}` : "";
      report += `  ${icon} ${lineStr} ${issue.message}\n`;
      if (issue.code && issue.code.length < 60) {
        report += `     → ${issue.code}\n`;
      }
    }
  }
  
  return report;
}

// ============================================================================
// MAIN
// ============================================================================

function findTypeScriptFiles(dir: string): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .git
        if (entry.name !== "node_modules" && entry.name !== ".git") {
          walk(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function main() {
  const targetPath = process.argv[2] || "./lib/art";
  const absolutePath = path.resolve(targetPath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Path not found: ${absolutePath}`);
    process.exit(1);
  }
  
  console.log(`🔍 Scanning ${targetPath} for code quality issues...\n`);
  
  let files: string[];
  if (fs.statSync(absolutePath).isDirectory()) {
    files = findTypeScriptFiles(absolutePath);
  } else {
    files = [absolutePath];
  }
  
  console.log(`Found ${files.length} TypeScript files\n`);
  
  const allIssues: CodeIssue[] = [];
  
  // Scan individual files
  for (const file of files) {
    const issues = scanFile(file);
    allIssues.push(...issues);
  }
  
  // Cross-file analysis
  const crossFileIssues = analyzeCrossFilePatterns(files);
  allIssues.push(...crossFileIssues);
  
  // Generate and print report
  const report = generateReport(allIssues);
  console.log(report);
  
  // Exit with error code if errors found
  const errorCount = allIssues.filter(i => i.type === "error").length;
  if (errorCount > 0) {
    console.log(`\n❌ ${errorCount} error(s) found. Please fix before committing.\n`);
    process.exit(1);
  }
  
  console.log("\n✅ No errors found. Code quality check passed!\n");
}

main();
