#!/usr/bin/env node
/**
 * Art Pattern Analyzer
 * 
 * Analyzes the generative art collection to identify patterns, gaps, and opportunities.
 * This is a self-improvement tool for the portfolio — it learns from what's been created
 * and suggests what should come next.
 * 
 * Usage: node analyze-art-patterns.js [--format=json|markdown|html]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ART_DIR = path.join(__dirname, '..', 'lib', 'art');
const METADATA_FILE = path.join(ART_DIR, 'metadata.ts');
const OUTPUT_DIR = path.join(__dirname, '..', 'memory');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Tag taxonomy — what we track and their relationships
const TAG_TAXONOMY = {
  // Animation states
  animation: ['animated', 'static'],
  
  // Visual character
  visualStyle: ['colorful', 'monochrome', 'minimal', 'detailed'],
  
  // Structural patterns
  structure: ['geometric', 'organic', 'ordered', 'chaotic'],
  
  // Thematic buckets
  theme: ['nature', 'futuristic', 'abstract'],
  
  // Technical approaches
  technique: ['3d', 'interactive'],
};

// Gap analysis — what combinations are underrepresented
const DESIRED_COMBINATIONS = [
  { category: 'mathematical', tags: ['static', 'minimal'], reason: 'Math beauty often needs no animation' },
  { category: 'natural', tags: ['monochrome', 'detailed'], reason: 'Nature studies in B&W have classic appeal' },
  { category: 'physics', tags: ['static', 'geometric'], reason: 'Physics principles as still diagrams' },
  { category: 'geometric', tags: ['animated', 'chaotic'], reason: 'Ordered chaos — geometric explosions' },
  { category: 'abstract', tags: ['static', 'detailed'], reason: 'Contemplative abstract pieces' },
  { category: 'traditional', tags: ['animated', 'minimal'], reason: 'Minimalist traditional techniques' },
  { category: '3d', tags: ['monochrome', 'detailed'], reason: 'Sculptural studies in grayscale' },
  { category: 'interactive', tags: ['chaotic', 'colorful'], reason: 'Playful interactive chaos' },
];

// Category targets — ideal distribution
const CATEGORY_TARGETS = {
  mathematical: { min: 12, ideal: 15 },
  natural: { min: 10, ideal: 12 },
  physics: { min: 12, ideal: 15 },
  geometric: { min: 12, ideal: 15 },
  abstract: { min: 12, ideal: 15 },
  traditional: { min: 8, ideal: 10 },
  text: { min: 4, ideal: 6 },
  '3d': { min: 6, ideal: 8 },
  interactive: { min: 6, ideal: 8 },
};

function parseMetadata() {
  const content = fs.readFileSync(METADATA_FILE, 'utf-8');
  
  // Extract ARTWORK_METADATA object using regex
  const metadataMatch = content.match(/export const ARTWORK_METADATA: Record<string, ArtworkMetadata> = ({[\s\S]*?});$/m);
  if (!metadataMatch) {
    throw new Error('Could not parse ARTWORK_METADATA');
  }
  
  // Convert TypeScript object to JavaScript (naive but works for this structure)
  const metadataStr = metadataMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
    .replace(/(\w+):/g, '"$1":') // Quote property names
    .replace(/'/g, '"'); // Replace single quotes
  
  try {
    return JSON.parse(metadataStr);
  } catch (e) {
    // Fallback: manual parsing for edge cases
    console.error('JSON parse failed, using manual extraction');
    return extractMetadataManually(content);
  }
}

function extractMetadataManually(content) {
  const metadata = {};
  const regex = /"([\w-]+)":\s*\{[\s\S]*?category:\s*"(\w+)"[\s\S]*?complexity:\s*"(\w+)"[\s\S]*?tags:\s*\[([^\]]*)\][\s\S]*?created:\s*"([^"]+)"/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [_, id, category, complexity, tagsStr, created] = match;
    const tags = tagsStr.split(',').map(t => t.trim().replace(/"/g, '')).filter(Boolean);
    metadata[id] = { category, complexity, tags, created };
  }
  
  return metadata;
}

function analyzeCollection(metadata) {
  const artworks = Object.entries(metadata);
  const total = artworks.length;
  
  // Category distribution
  const categories = {};
  const complexities = {};
  const allTags = new Set();
  const tagCounts = {};
  const categoryTagMatrix = {};
  const animationRatio = { animated: 0, static: 0 };
  const creationTimeline = [];
  
  artworks.forEach(([id, data]) => {
    // Category counts
    categories[data.category] = (categories[data.category] || 0) + 1;
    
    // Complexity counts
    complexities[data.complexity] = (complexities[data.complexity] || 0) + 1;
    
    // Tag analysis
    data.tags.forEach(tag => {
      allTags.add(tag);
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      
      // Animation tracking
      if (tag === 'animated') animationRatio.animated++;
      if (tag === 'static') animationRatio.static++;
    });
    
    // Category-tag matrix
    if (!categoryTagMatrix[data.category]) {
      categoryTagMatrix[data.category] = {};
    }
    data.tags.forEach(tag => {
      categoryTagMatrix[data.category][tag] = (categoryTagMatrix[data.category][tag] || 0) + 1;
    });
    
    // Timeline
    creationTimeline.push({ id, created: data.created, category: data.category });
  });
  
  // Sort timeline
  creationTimeline.sort((a, b) => new Date(a.created) - new Date(b.created));
  
  // Calculate diversity score (0-100)
  const categoryDiversity = Object.keys(categories).length / Object.keys(CATEGORY_TARGETS).length;
  const tagDiversity = allTags.size / 30; // Assume ~30 possible tags is good variety
  const complexityBalance = 1 - Math.abs(0.25 - (complexities.moderate || 0) / total) * 2;
  const diversityScore = Math.round((categoryDiversity * 0.4 + tagDiversity * 0.4 + complexityBalance * 0.2) * 100);
  
  return {
    total,
    categories,
    complexities,
    tagCounts,
    allTags: Array.from(allTags).sort(),
    categoryTagMatrix,
    animationRatio,
    creationTimeline,
    diversityScore,
  };
}

function findGaps(analysis) {
  const gaps = [];
  
  // Category gaps
  Object.entries(CATEGORY_TARGETS).forEach(([category, targets]) => {
    const current = analysis.categories[category] || 0;
    if (current < targets.min) {
      gaps.push({
        type: 'category',
        item: category,
        current,
        target: targets.min,
        priority: 'high',
        suggestion: `Add ${targets.min - current} more ${category} artworks`,
      });
    } else if (current < targets.ideal) {
      gaps.push({
        type: 'category',
        item: category,
        current,
        target: targets.ideal,
        priority: 'medium',
        suggestion: `Consider ${targets.ideal - current} more ${category} artworks`,
      });
    }
  });
  
  // Tag combination gaps
  DESIRED_COMBINATIONS.forEach(({ category, tags, reason }) => {
    const categoryArtworks = Object.entries(analysis.categoryTagMatrix[category] || {});
    const hasCombination = categoryArtworks.some(([tag, count]) => tags.includes(tag) && count > 0);
    
    if (!hasCombination) {
      gaps.push({
        type: 'combination',
        item: `${category} + ${tags.join(' + ')}`,
        current: 0,
        target: 1,
        priority: 'medium',
        suggestion: `Create a ${category} piece with ${tags.join(', ')} qualities — ${reason}`,
      });
    }
  });
  
  // Tag underrepresentation
  const tagThreshold = analysis.total * 0.05; // At least 5% of collection
  Object.entries(analysis.tagCounts).forEach(([tag, count]) => {
    if (count < tagThreshold && !['3d', 'interactive'].includes(tag)) {
      gaps.push({
        type: 'tag',
        item: tag,
        current: count,
        target: Math.ceil(tagThreshold),
        priority: 'low',
        suggestion: `More artworks with "${tag}" tag would add variety`,
      });
    }
  });
  
  return gaps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function generateInsights(analysis, gaps) {
  const insights = [];
  
  // Collection health
  if (analysis.diversityScore >= 80) {
    insights.push({ type: 'strength', message: 'Excellent category diversity — the collection spans multiple artistic domains' });
  } else if (analysis.diversityScore >= 60) {
    insights.push({ type: 'neutral', message: 'Good diversity, but some categories could be expanded' });
  } else {
    insights.push({ type: 'weakness', message: 'Limited diversity — consider exploring new categories' });
  }
  
  // Animation balance
  const totalWithAnimationState = analysis.animationRatio.animated + analysis.animationRatio.static;
  if (totalWithAnimationState > 0) {
    const animatedPercent = (analysis.animationRatio.animated / totalWithAnimationState * 100).toFixed(0);
    if (animatedPercent > 70) {
      insights.push({ type: 'observation', message: `${animatedPercent}% of artworks are animated — consider more static pieces for variety` });
    } else if (animatedPercent < 30) {
      insights.push({ type: 'observation', message: `Only ${animatedPercent}% of artworks are animated — more motion could add energy` });
    } else {
      insights.push({ type: 'strength', message: `Balanced animation ratio (${animatedPercent}% animated)` });
    }
  }
  
  // Recent activity
  const recentWorks = analysis.creationTimeline.slice(-5);
  const recentCategories = new Set(recentWorks.map(w => w.category));
  if (recentCategories.size >= 3) {
    insights.push({ type: 'strength', message: 'Recent work spans multiple categories — good creative exploration' });
  } else {
    insights.push({ type: 'observation', message: 'Recent work concentrated in few categories — consider branching out' });
  }
  
  // Complexity distribution
  const complexityEntries = Object.entries(analysis.complexities);
  const hasRange = complexityEntries.length >= 3;
  if (hasRange) {
    insights.push({ type: 'strength', message: 'Good complexity range — from simple to expert-level pieces' });
  } else {
    insights.push({ type: 'weakness', message: 'Limited complexity range — add more variety in difficulty' });
  }
  
  return insights;
}

function generateRecommendations(analysis, gaps) {
  const recommendations = [];
  
  // Top gaps become recommendations
  const highPriorityGaps = gaps.filter(g => g.priority === 'high').slice(0, 3);
  highPriorityGaps.forEach(gap => {
    recommendations.push({
      priority: 'high',
      action: gap.suggestion,
      impact: `Fills critical gap in ${gap.item}`,
    });
  });
  
  // Tag-based suggestions
  const underusedTags = Object.entries(analysis.tagCounts)
    .filter(([tag, count]) => count <= 2 && !['3d', 'interactive'].includes(tag))
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
  
  underusedTags.forEach(([tag, count]) => {
    recommendations.push({
      priority: 'medium',
      action: `Create artwork featuring "${tag}" aesthetic`,
      impact: `Increases ${tag} representation from ${count} to ${count + 1}`,
    });
  });
  
  // Cross-pollination ideas
  const topCategories = Object.entries(analysis.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([cat]) => cat);
  
  if (topCategories.length >= 2) {
    recommendations.push({
      priority: 'low',
      action: `Combine ${topCategories[0]} and ${topCategories[1]} techniques`,
      impact: 'Creates hybrid style, expands creative vocabulary',
    });
  }
  
  return recommendations;
}

function formatConsoleOutput(report) {
  const { c, analysis, gaps, insights, recommendations } = report;
  let output = '\n';
  
  // Header
  output += `${c.bright}${c.cyan}╔══════════════════════════════════════════════════════════════╗${c.reset}\n`;
  output += `${c.bright}${c.cyan}║           GENERATIVE ART COLLECTION ANALYSIS                 ║${c.reset}\n`;
  output += `${c.bright}${c.cyan}╚══════════════════════════════════════════════════════════════╝${c.reset}\n\n`;
  
  // Summary
  output += `${c.bright}Collection Overview${c.reset}\n`;
  output += `  Total Artworks: ${c.bright}${analysis.total}${c.reset}\n`;
  output += `  Diversity Score: ${getScoreColor(analysis.diversityScore, c)}${analysis.diversityScore}/100${c.reset}\n`;
  output += `  Unique Tags: ${analysis.allTags.length}\n`;
  output += `  Categories: ${Object.keys(analysis.categories).length}/${Object.keys(CATEGORY_TARGETS).length}\n\n`;
  
  // Category breakdown
  output += `${c.bright}Category Distribution${c.reset}\n`;
  Object.entries(CATEGORY_TARGETS).forEach(([cat, targets]) => {
    const current = analysis.categories[cat] || 0;
    const status = current >= targets.min ? c.green : current >= targets.min * 0.7 ? c.yellow : c.red;
    const bar = '█'.repeat(Math.min(current, 15)) + '░'.repeat(Math.max(0, 15 - current));
    output += `  ${cat.padEnd(15)} ${status}${bar}${c.reset} ${current}/${targets.min}\n`;
  });
  output += '\n';
  
  // Top tags
  output += `${c.bright}Most Common Tags${c.reset}\n`;
  const topTags = Object.entries(analysis.tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  topTags.forEach(([tag, count]) => {
    const pct = ((count / analysis.total) * 100).toFixed(0);
    output += `  ${tag.padEnd(15)} ${c.dim}${'▓'.repeat(Math.min(count, 20))}${c.reset} ${count} (${pct}%)\n`;
  });
  output += '\n';
  
  // Gaps
  if (gaps.length > 0) {
    output += `${c.bright}Identified Gaps${c.reset}\n`;
    const highGaps = gaps.filter(g => g.priority === 'high');
    const medGaps = gaps.filter(g => g.priority === 'medium').slice(0, 3);
    
    [...highGaps, ...medGaps].forEach(gap => {
      const color = gap.priority === 'high' ? c.red : c.yellow;
      output += `  ${color}[${gap.priority.toUpperCase()}]${c.reset} ${gap.suggestion}\n`;
    });
    output += '\n';
  }
  
  // Insights
  output += `${c.bright}Key Insights${c.reset}\n`;
  insights.forEach(insight => {
    const icon = insight.type === 'strength' ? '✓' : insight.type === 'weakness' ? '!' : '•';
    const color = insight.type === 'strength' ? c.green : insight.type === 'weakness' ? c.red : c.dim;
    output += `  ${color}${icon}${c.reset} ${insight.message}\n`;
  });
  output += '\n';
  
  // Recommendations
  output += `${c.bright}Recommendations${c.reset}\n`;
  recommendations.slice(0, 5).forEach((rec, i) => {
    const color = rec.priority === 'high' ? c.magenta : rec.priority === 'medium' ? c.cyan : c.dim;
    output += `  ${color}${i + 1}.${c.reset} ${rec.action}\n`;
    output += `     ${c.dim}Impact: ${rec.impact}${c.reset}\n`;
  });
  
  return output;
}

function getScoreColor(score, c) {
  if (score >= 80) return c.green;
  if (score >= 60) return c.yellow;
  return c.red;
}

function formatMarkdownOutput(report) {
  const { analysis, gaps, insights, recommendations } = report;
  
  let md = `# Generative Art Collection Analysis\n\n`;
  md += `*Generated: ${new Date().toISOString().split('T')[0]}*\n\n`;
  
  // Summary
  md += `## Collection Overview\n\n`;
  md += `- **Total Artworks:** ${analysis.total}\n`;
  md += `- **Diversity Score:** ${analysis.diversityScore}/100\n`;
  md += `- **Unique Tags:** ${analysis.allTags.length}\n`;
  md += `- **Categories:** ${Object.keys(analysis.categories).length}/${Object.keys(CATEGORY_TARGETS).length}\n\n`;
  
  // Categories
  md += `## Category Distribution\n\n`;
  md += `| Category | Current | Target | Status |\n`;
  md += `|----------|---------|--------|--------|\n`;
  Object.entries(CATEGORY_TARGETS).forEach(([cat, targets]) => {
    const current = analysis.categories[cat] || 0;
    const status = current >= targets.min ? '✅ Good' : current >= targets.min * 0.7 ? '⚠️ Low' : '❌ Critical';
    md += `| ${cat} | ${current} | ${targets.min} | ${status} |\n`;
  });
  md += '\n';
  
  // Tag distribution
  md += `## Tag Analysis\n\n`;
  md += `### Most Common\n\n`;
  Object.entries(analysis.tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([tag, count]) => {
      md += `- **${tag}:** ${count} artworks\n`;
    });
  md += '\n';
  
  // Gaps
  if (gaps.length > 0) {
    md += `## Identified Gaps\n\n`;
    gaps.slice(0, 10).forEach(gap => {
      md += `### ${gap.type === 'category' ? gap.item : gap.item}\n`;
      md += `- **Priority:** ${gap.priority}\n`;
      md += `- **Current:** ${gap.current} | **Target:** ${gap.target}\n`;
      md += `- **Action:** ${gap.suggestion}\n\n`;
    });
  }
  
  // Insights
  md += `## Insights\n\n`;
  insights.forEach(insight => {
    const emoji = insight.type === 'strength' ? '💪' : insight.type === 'weakness' ? '⚠️' : '💡';
    md += `- ${emoji} ${insight.message}\n`;
  });
  md += '\n';
  
  // Recommendations
  md += `## Recommendations\n\n`;
  recommendations.forEach((rec, i) => {
    const emoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵';
    md += `${i + 1}. ${emoji} **${rec.action}**\n`;
    md += `   - Impact: ${rec.impact}\n\n`;
  });
  
  // Timeline
  md += `## Recent Activity\n\n`;
  md += `Last 5 artworks created:\n\n`;
  analysis.creationTimeline.slice(-5).forEach(work => {
    md += `- **${work.id}** (${work.category}) — ${work.created}\n`;
  });
  
  return md;
}

function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'console';
  
  try {
    // Parse metadata
    const metadata = parseMetadata();
    
    // Run analysis
    const analysis = analyzeCollection(metadata);
    const gaps = findGaps(analysis);
    const insights = generateInsights(analysis, gaps);
    const recommendations = generateRecommendations(analysis, gaps);
    
    const report = {
      c: colors,
      analysis,
      gaps,
      insights,
      recommendations,
    };
    
    // Output
    if (format === 'json') {
      console.log(JSON.stringify({ analysis, gaps, insights, recommendations }, null, 2));
    } else if (format === 'markdown') {
      console.log(formatMarkdownOutput(report));
    } else if (format === 'html') {
      // Could add HTML output for dashboard integration
      console.log('HTML format not yet implemented');
    } else {
      console.log(formatConsoleOutput(report));
    }
    
    // Save to memory if not JSON mode
    if (format !== 'json') {
      const memoryFile = path.join(OUTPUT_DIR, `art-analysis-${new Date().toISOString().split('T')[0]}.md`);
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      fs.writeFileSync(memoryFile, formatMarkdownOutput(report));
      console.log(`\n${colors.dim}Analysis saved to: ${memoryFile}${colors.reset}\n`);
    }
    
    // Exit with code based on health
    const hasCriticalGaps = gaps.some(g => g.priority === 'high');
    process.exit(hasCriticalGaps ? 1 : 0);
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
    process.exit(2);
  }
}

main();
