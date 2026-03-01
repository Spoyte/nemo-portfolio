#!/usr/bin/env node
/**
 * Art Registry Code Generator
 * 
 * Synchronizes unified-registry.ts with index.ts
 * Eliminates manual duplication of generator imports and mappings
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
// PARSER: Extract registry entries from unified-registry.ts
// ============================================================================

interface GeneratorEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  importName: string;
}

function parseRegistry(content: string): GeneratorEntry[] {
  const entries: GeneratorEntry[] = [];
  
  // Match each generator entry object in the registry array
  const entryRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?importName:\s*"([^"]+)"[\s\S]*?\}/g;
  
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    entries.push({
      id: match[1],
      name: match[2],
      description: match[3],
      category: match[4],
      importName: match[5],
    });
  }
  
  return entries;
}

function groupByCategory(entries: GeneratorEntry[]): Map<string, GeneratorEntry[]> {
  const groups = new Map<string, GeneratorEntry[]>();
  
  for (const entry of entries) {
    const existing = groups.get(entry.category) || [];
    existing.push(entry);
    groups.set(entry.category, existing);
  }
  
  // Sort categories in preferred order
  const categoryOrder = [
    'mathematical', 'natural', 'physics', 'geometric', 
    'abstract', 'traditional', 'text', '3d', 'interactive'
  ];
  
  const sortedGroups = new Map<string, GeneratorEntry[]>();
  for (const cat of categoryOrder) {
    if (groups.has(cat)) {
      sortedGroups.set(cat, groups.get(cat)!);
    }
  }
  
  // Add any remaining categories not in the preferred order
  for (const [cat, items] of groups) {
    if (!sortedGroups.has(cat)) {
      sortedGroups.set(cat, items);
    }
  }
  
  return sortedGroups;
}

// ============================================================================
// GENERATOR: Create index.ts content
// ============================================================================

function generateIndexContent(entries: GeneratorEntry[]): string {
  const groups = groupByCategory(entries);
  
  const lines: string[] = [
    '// Auto-generated from unified-registry.ts',
    '// Do not edit manually - run: node scripts/generate-art-index.ts',
    '',
    'import { ArtGenerator } from "./core";',
    'import { ARTWORK_METADATA } from "./metadata";',
    'import {',
    '  GENERATOR_REGISTRY,',
    '  GeneratorId,',
    '  getGeneratorEntry,',
    '  getGeneratorIdsByCategory,',
    '  getCategoryStats,',
    '  loadGenerator,',
    '  validateRegistry,',
    '} from "./unified-registry";',
    '',
    '// Re-export core types',
    'export * from "./core";',
    'export * from "./metadata";',
    'export * from "./statistics";',
    '',
    '// Re-export registry system',
    'export {',
    '  GENERATOR_REGISTRY,',
    '  type GeneratorId,',
    '  type GeneratorEntry,',
    '  type LoadedGenerator,',
    '  getGeneratorEntry,',
    '  getGeneratorIdsByCategory,',
    '  getGeneratorsByCategory,',
    '  getCategoryStats,',
    '  getGeneratorMetadata,',
    '  loadGenerator,',
    '  validateRegistry,',
    '  isValidGeneratorId,',
    '  TOTAL_GENERATORS,',
    '  GENERATOR_IDS,',
    '  CATEGORIES,',
    '} from "./unified-registry";',
    '',
    '// ============================================================================',
    '// STATIC IMPORTS - Eagerly loaded generators',
    '// Auto-generated from unified-registry.ts',
    '// ============================================================================',
    '',
  ];
  
  // Generate imports grouped by category
  for (const [category, items] of groups) {
    lines.push(`// === ${category.toUpperCase()} (${items.length}) ===`);
    for (const entry of items) {
      lines.push(`import { ${entry.importName} } from "./${entry.id}";`);
    }
    lines.push('');
  }
  
  lines.push('// ============================================================================');
  lines.push('// GENERATORS MAP - Connects IDs to implementations');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('const rawGenerators: Record<string, ArtGenerator> = {');
  lines.push('');
  
  // Generate the map
  for (const [category, items] of groups) {
    lines.push(`  // === ${category.toUpperCase()} ===`);
    for (const entry of items) {
      lines.push(`  "${entry.id}": ${entry.importName},`);
    }
    lines.push('');
  }
  
  lines.push('};');
  lines.push('');
  lines.push('// Apply metadata to generators');
  lines.push('export const artGenerators: Record<string, ArtGenerator> = {};');
  lines.push('');
  lines.push('Object.entries(rawGenerators).forEach(([id, generator]) => {');
  lines.push('  artGenerators[id] = {');
  lines.push('    ...generator,');
  lines.push('    meta: ARTWORK_METADATA[id] || {');
  lines.push('      category: "abstract",');
  lines.push('      complexity: "moderate",');
  lines.push('      tags: [],');
  lines.push('      created: "2024-01-01",');
  lines.push('    },');
  lines.push('  };');
  lines.push('});');
  lines.push('');
  lines.push('// ============================================================================');
  lines.push('// CONVENIENCE EXPORTS');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('/** Get a generator by ID */');
  lines.push('export function getGenerator(id: string): ArtGenerator | undefined {');
  lines.push('  return artGenerators[id];');
  lines.push('}');
  lines.push('');
  lines.push('/** Get all generator IDs */');
  lines.push('export function getAllGeneratorIds(): string[] {');
  lines.push('  return Object.keys(artGenerators);');
  lines.push('}');
  lines.push('');
  lines.push('/** Check if a generator exists */');
  lines.push('export function hasGenerator(id: string): boolean {');
  lines.push('  return id in artGenerators;');
  lines.push('}');
  lines.push('');
  lines.push('// ============================================================================');
  lines.push('// VALIDATION (run at module init in development)');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push('if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {');
  lines.push('  const validation = validateRegistry();');
  lines.push('  if (!validation.valid) {');
  lines.push('    console.warn("[art/index] Registry validation issues:", validation);');
  lines.push('  }');
  lines.push('}');
  lines.push('');
  
  return lines.join('\n');
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const checkMode = args.includes('--check');
  
  // Read registry
  const registryContent = fs.readFileSync(REGISTRY_FILE, 'utf-8');
  const entries = parseRegistry(registryContent);
  
  if (entries.length === 0) {
    console.error('❌ No generators found in registry');
    process.exit(1);
  }
  
  console.log(`📊 Found ${entries.length} generators in registry`);
  
  // Generate new content
  const newContent = generateIndexContent(entries);
  
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
  
  // Print summary
  const groups = groupByCategory(entries);
  console.log('\n📁 Categories:');
  for (const [cat, items] of groups) {
    console.log(`   ${cat}: ${items.length}`);
  }
}

main();
