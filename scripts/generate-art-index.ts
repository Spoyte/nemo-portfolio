#!/usr/bin/env node
/**
 * Art Registry Code Generator
 *
 * Synchronizes unified-registry.ts with index.ts
 * Uses generateIndexContent() from unified-registry.ts as single source of truth
 *
 * Usage: node scripts/generate-art-index.ts [--check]
 *   --check: Verify index.ts is up to date (for CI)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ART_DIR = path.resolve(__dirname, '../lib/art');
const REGISTRY_FILE = path.join(ART_DIR, 'unified-registry.ts');
const INDEX_FILE = path.join(ART_DIR, 'index.ts');

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes('--check');

  // Dynamically import the registry module to use its generation function
  // This ensures the generation logic lives in one place (unified-registry.ts)
  const registryUrl = new URL(`file://${REGISTRY_FILE}`);
  const registry = await import(registryUrl.href);

  const entries = registry.GENERATOR_REGISTRY;

  if (!entries || entries.length === 0) {
    console.error('❌ No generators found in registry');
    process.exit(1);
  }

  console.log(`📊 Found ${entries.length} generators in registry`);

  // Use the registry's own generation function - single source of truth
  const newContent = registry.generateIndexContent();

  if (checkMode) {
    // Check mode: verify index.ts matches
    const currentContent = fs.readFileSync(INDEX_FILE, 'utf-8');
    if (currentContent.trim() !== newContent.trim()) {
      console.error('❌ index.ts is out of sync with unified-registry.ts');
      console.error('   Run: node scripts/generate-art-index.ts');
      process.exit(1);
    }
    console.log('✅ index.ts is up to date');
    process.exit(0);
  }

  // Write mode: update index.ts
  fs.writeFileSync(INDEX_FILE, newContent);
  console.log(`✅ Updated ${INDEX_FILE}`);

  // Print summary using the registry's grouping function
  const groups = registry.getGeneratorsGroupedByCategory();
  console.log('\n📁 Categories:');
  for (const [cat, items] of groups) {
    console.log(`   ${cat}: ${items.length}`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
