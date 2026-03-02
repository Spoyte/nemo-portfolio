import { ARTWORK_METADATA } from "./metadata";

// ============================================================================
// ART INSIGHTS ANALYZER
// ============================================================================
// Self-analysis tool for the generative art portfolio
// Identifies gaps, patterns, and opportunities for growth

export interface CategoryAnalysis {
  name: string;
  count: number;
  target: number;
  percentage: number;
  status: "healthy" | "underrepresented" | "gap" | "overrepresented";
  pieces: string[];
}

export interface TagAnalysis {
  name: string;
  count: number;
  percentage: number;
  pieces: string[];
}

export interface ComplexityDistribution {
  simple: number;
  moderate: number;
  complex: number;
}

export interface GapRecommendation {
  priority: "high" | "medium" | "low";
  category: string;
  reason: string;
  suggestion: string;
}

export interface ArtInsights {
  totalPieces: number;
  categories: CategoryAnalysis[];
  tags: TagAnalysis[];
  complexity: ComplexityDistribution;
  diversityScore: number;
  recommendations: GapRecommendation[];
  underrepresentedTags: string[];
  missingCombinations: string[];
}

// Target distribution for a balanced portfolio
const CATEGORY_TARGETS: Record<string, number> = {
  mathematical: 12,
  natural: 10,
  physics: 12,
  geometric: 10,
  abstract: 10,
  traditional: 8,
  text: 6,
  "3d": 6,
  interactive: 8,
};

const TAG_CATEGORIES = [
  "animated",
  "static",
  "interactive",
  "colorful",
  "monochrome",
  "geometric",
  "organic",
  "chaotic",
  "ordered",
  "detailed",
  "minimal",
  "nature",
  "abstract",
];

/**
 * Analyze the complete artwork collection and generate insights
 */
export function analyzePortfolio(): ArtInsights {
  const entries = Object.entries(ARTWORK_METADATA);
  const totalPieces = entries.length;

  // Category analysis
  const categoryMap = new Map<string, string[]>();
  entries.forEach(([id, meta]) => {
    const list = categoryMap.get(meta.category) || [];
    list.push(id);
    categoryMap.set(meta.category, list);
  });

  const categories: CategoryAnalysis[] = Object.entries(CATEGORY_TARGETS).map(
    ([name, target]) => {
      const pieces = categoryMap.get(name) || [];
      const count = pieces.length;
      const percentage = Math.round((count / totalPieces) * 100);

      let status: CategoryAnalysis["status"];
      if (count === 0) status = "gap";
      else if (count < target * 0.5) status = "underrepresented";
      else if (count > target * 1.5) status = "overrepresented";
      else status = "healthy";

      return { name, count, target, percentage, status, pieces };
    }
  );

  // Tag analysis
  const tagMap = new Map<string, string[]>();
  entries.forEach(([id, meta]) => {
    meta.tags.forEach((tag) => {
      const list = tagMap.get(tag) || [];
      list.push(id);
      tagMap.set(tag, list);
    });
  });

  const tags: TagAnalysis[] = TAG_CATEGORIES.map((name) => {
    const pieces = tagMap.get(name) || [];
    return {
      name,
      count: pieces.length,
      percentage: Math.round((pieces.length / totalPieces) * 100),
      pieces,
    };
  }).sort((a, b) => b.count - a.count);

  // Complexity distribution
  const complexity: ComplexityDistribution = {
    simple: entries.filter(([, m]) => m.complexity === "simple").length,
    moderate: entries.filter(([, m]) => m.complexity === "moderate").length,
    complex: entries.filter(([, m]) => m.complexity === "complex").length,
  };

  // Calculate diversity score (0-100)
  // Based on: category balance, tag variety, complexity spread
  const categoryBalance =
    categories.reduce((acc, cat) => {
      const ratio = cat.count / (cat.target || 1);
      // Penalize both under and over representation
      const score = ratio > 1 ? 1 / ratio : ratio;
      return acc + Math.min(score, 1);
    }, 0) / categories.length;

  const tagCoverage =
    tags.filter((t) => t.count > 0).length / TAG_CATEGORIES.length;

  const complexitySpread =
    1 -
    Math.abs(complexity.simple - complexity.complex) / totalPieces;

  const diversityScore = Math.round(
    (categoryBalance * 0.4 + tagCoverage * 0.4 + complexitySpread * 0.2) * 100
  );

  // Generate recommendations
  const recommendations: GapRecommendation[] = [];

  // Find category gaps
  categories
    .filter((c) => c.status === "gap" || c.status === "underrepresented")
    .forEach((cat) => {
      recommendations.push({
        priority: cat.status === "gap" ? "high" : "medium",
        category: cat.name,
        reason: `${cat.name} has only ${cat.count} pieces (target: ${cat.target})`,
        suggestion: getCategorySuggestion(cat.name),
      });
    });

  // Find underrepresented tags
  const underrepresentedTags = tags
    .filter((t) => t.count < totalPieces * 0.1 && t.count > 0)
    .map((t) => t.name);

  // Find missing combinations
  const missingCombinations = findMissingCombinations(entries);

  return {
    totalPieces,
    categories,
    tags,
    complexity,
    diversityScore,
    recommendations: recommendations.slice(0, 5),
    underrepresentedTags,
    missingCombinations,
  };
}

/**
 * Get a specific suggestion for filling a category gap
 */
function getCategorySuggestion(category: string): string {
  const suggestions: Record<string, string> = {
    mathematical:
      "Consider: Fibonacci spiral, Golden ratio visualizer, Prime number patterns, or Mathematical constants (e, φ, π)",
    natural:
      "Consider: Lightning bolts, River deltas, Coral growth, or Cloud formations",
    physics:
      "Consider: Quantum tunneling, Relativistic effects, or Thermodynamic flows",
    geometric:
      "Consider: Celtic knots, Islamic stars, or Fractal tiling patterns",
    abstract:
      "Consider: Glitch art, Data moshing, or Pixel sorting algorithms",
    traditional:
      "Consider: Ukiyo-e waves, Pointillism, or Charcoal sketch simulation",
    text:
      "Consider: Word clouds, Typography deconstruction, or Glyph morphing",
    "3d":
      "Consider: Voxel landscapes, Mesh deformation, or Procedural architecture",
    interactive:
      "Consider: Drawing canvas, Physics sandbox, or Evolution simulation",
  };
  return suggestions[category] || "Explore new techniques in this space";
}

/**
 * Find interesting tag combinations that don't exist yet
 */
function findMissingCombinations(
  entries: [string, (typeof ARTWORK_METADATA)[string]][]
): string[] {
  const combinations: string[] = [];

  // Check for static + colorful + detailed (rare combo)
  const hasStaticColorfulDetailed = entries.some(([, m]) =>
    ["static", "colorful", "detailed"].every((t) => m.tags.includes(t as any))
  );
  if (!hasStaticColorfulDetailed) {
    combinations.push("static + colorful + detailed");
  }

  // Check for interactive + nature (rare combo)
  const hasInteractiveNature = entries.some(([, m]) =>
    ["interactive", "nature"].every((t) => m.tags.includes(t as any))
  );
  if (!hasInteractiveNature) {
    combinations.push("interactive + nature");
  }

  // Check for animated + minimal (rare combo)
  const hasAnimatedMinimal = entries.some(([, m]) =>
    ["animated", "minimal"].every((t) => m.tags.includes(t as any))
  );
  if (!hasAnimatedMinimal) {
    combinations.push("animated + minimal");
  }

  return combinations;
}

/**
 * Print a formatted report to console
 */
export function printInsightsReport(insights: ArtInsights): void {
  console.log("\n" + "=".repeat(60));
  console.log("🎨 PORTFOLIO INSIGHTS REPORT");
  console.log("=".repeat(60));

  console.log(`\n📊 OVERVIEW`);
  console.log(`   Total Pieces: ${insights.totalPieces}`);
  console.log(`   Diversity Score: ${insights.diversityScore}/100`);

  console.log(`\n📁 CATEGORIES`);
  insights.categories.forEach((cat) => {
    const icon =
      cat.status === "healthy"
        ? "✓"
        : cat.status === "gap"
        ? "✗"
        : cat.status === "underrepresented"
        ? "~"
        : "!";
    const statusColor =
      cat.status === "healthy" ? "green" : cat.status === "gap" ? "red" : "yellow";
    console.log(
      `   ${icon} ${cat.name.padEnd(15)} ${cat.count}/${cat.target} (${cat.percentage}%)`
    );
  });

  console.log(`\n🏷️ TOP TAGS`);
  insights.tags.slice(0, 8).forEach((tag) => {
    const bar = "█".repeat(Math.round(tag.percentage / 5));
    console.log(`   ${tag.name.padEnd(15)} ${bar} ${tag.percentage}%`);
  });

  console.log(`\n🎯 RECOMMENDATIONS`);
  insights.recommendations.forEach((rec, i) => {
    const icon = rec.priority === "high" ? "🔴" : rec.priority === "medium" ? "🟡" : "🟢";
    console.log(`\n   ${icon} ${rec.category.toUpperCase()}`);
    console.log(`      ${rec.reason}`);
    console.log(`      💡 ${rec.suggestion}`);
  });

  if (insights.missingCombinations.length > 0) {
    console.log(`\n🔗 MISSING COMBINATIONS`);
    insights.missingCombinations.forEach((combo) => {
      console.log(`   • ${combo}`);
    });
  }

  console.log("\n" + "=".repeat(60));
}

/**
 * Get a quick summary for heartbeat checks
 */
export function getPortfolioSummary(): string {
  const insights = analyzePortfolio();
  const gaps = insights.categories.filter((c) => c.status === "gap").length;
  const under = insights.categories.filter(
    (c) => c.status === "underrepresented"
  ).length;

  return `${insights.totalPieces} pieces | Diversity: ${insights.diversityScore}/100 | Gaps: ${gaps} | Under: ${under}`;
}

// Run analysis if executed directly
if (typeof window === "undefined" && typeof process !== "undefined") {
  const insights = analyzePortfolio();
  printInsightsReport(insights);
}
