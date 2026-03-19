#!/usr/bin/env node
/**
 * Migration script: Standardize art generator interfaces
 * 
 * Converts files using `config:` pattern to standard `params:` pattern.
 * Applies Dieter Rams principles: less but better, thorough, consistent.
 */

const fs = require('fs');
const path = require('path');

const ART_DIR = path.join(__dirname, '../lib/art');

// Files known to use the non-standard `config:` pattern
const FILES_TO_MIGRATE = [
  'audio-reactive-waves.ts',
  'boids-flocking.ts',
  'cantor-set.ts',
  'chromatic-aberration.ts',
  'flowing-silk.ts',
  'kohonen-map.ts',
  'n-body-gravity.ts',
  'stippled-portraits.ts',
  'strange-attractor.ts',
  'textile-weave.ts',
];

interface MigrationResult {
  file: string;
  success: boolean;
  changes: string[];
  error?: string;
}

/**
 * Transform config object to params Record<string, ParamConfig>
 */
function transformConfigToParams(configObj: string): string {
  // Parse the config object and convert to ParamConfig format
  // This is a simplified transformation - real implementation would use AST parsing
  
  const lines = configObj.split('\n');
  const params: string[] = [];
  
  for (const line of lines) {
    const match = line.match(/(\w+):\s*\{[^}]*\}/);
    if (match) {
      // Extract property name and config
      const propMatch = line.match(/(\w+):\s*\{/);
      if (propMatch) {
        const propName = propMatch[1];
        // Transform to ParamConfig format
        params.push(`  ${propName}: {
    type: "range", // TODO: infer from usage
    default: 0,    // TODO: extract from config
  },`);
      }
    }
  }
  
  return `const PARAMS: Record<string, ParamConfig> = {\n${params.join('\n')}\n};`;
}

/**
 * Migrate a single file
 */
function migrateFile(filename: string): MigrationResult {
  const filepath = path.join(ART_DIR, filename);
  const result: MigrationResult = {
    file: filename,
    success: false,
    changes: [],
  };

  try {
    if (!fs.existsSync(filepath)) {
      result.error = 'File not found';
      return result;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    
    // Check if file uses config pattern
    if (!content.includes('config:')) {
      result.error = 'File does not use config pattern';
      return result;
    }

    // Track what we find
    const hasConfig = content.includes('config:');
    const hasRender = /render\s*[:\(]/.test(content);
    const hasGenerate = /generate\s*[:\(]/.test(content);
    const hasMeta = content.includes('meta:');
    
    result.changes.push(`Found: config=${hasConfig}, render=${hasRender}, generate=${hasGenerate}, meta=${hasMeta}`);

    // For now, just report - actual migration needs careful manual review
    // due to the complexity of each generator's unique logic
    result.success = true;
    result.changes.push('Analysis complete - manual migration recommended');

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

/**
 * Run migration analysis
 */
function runMigration(): void {
  console.log('🔧 Art Generator Interface Migration\n');
  console.log('Target: Standardize 11 files using non-standard `config:` pattern\n');

  const results: MigrationResult[] = [];

  for (const file of FILES_TO_MIGRATE) {
    const result = migrateFile(file);
    results.push(result);

    const status = result.success ? '✓' : '✗';
    console.log(`${status} ${file}`);
    
    for (const change of result.changes) {
      console.log(`   ${change}`);
    }
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log();
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  console.log(`\n📊 Summary: ${successful}/${results.length} files analyzed`);
  console.log('\nNext steps:');
  console.log('1. Review each file manually');
  console.log('2. Convert config: → params:');
  console.log('3. Convert render() → generate()');
  console.log('4. Add proper meta: { category, complexity, tags, created }');
  console.log('5. Update imports to use core-refactored.ts');
}

// Run if executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { migrateFile, runMigration };
