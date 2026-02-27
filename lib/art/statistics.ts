/**
 * Gallery Statistics Module
 *
 * Provides analytics and insights about the generative art portfolio:
 * - Category distribution
 * - Complexity breakdown
 * - Tag frequency analysis
 * - Creation timeline
 * - Animated vs static ratio
 * - Color palette distribution
 */

import { ARTWORK_METADATA, ArtworkMetadata } from "./metadata";
import { ArtCategory, ArtComplexity, ArtTag } from "./core";

// ============================================================================
// TYPES
// ============================================================================

export interface CategoryStats {
  category: ArtCategory;
  count: number;
  percentage: number;
  pieces: string[];
}

export interface ComplexityStats {
  complexity: ArtComplexity;
  count: number;
  percentage: number;
}

export interface TagStats {
  tag: ArtTag;
  count: number;
  percentage: number;
  pieces: string[];
}

export interface TimelineEntry {
  date: string;
  pieces: string[];
  count: number;
}

export interface GalleryStatistics {
  totalPieces: number;
  categories: CategoryStats[];
  complexity: ComplexityStats[];
  tags: TagStats[];
  timeline: TimelineEntry[];
  animatedRatio: { animated: number; static: number; percentage: number };
  colorDistribution: { colorful: number; monochrome: number; percentage: number };
}

// ============================================================================
// COMPUTED STATISTICS
// ============================================================================

/**
 * Get all artwork IDs from metadata
 */
function getAllArtworkIds(): string[] {
  return Object.keys(ARTWORK_METADATA);
}

/**
 * Calculate category distribution
 */
function calculateCategoryStats(): CategoryStats[] {
  const ids = getAllArtworkIds();
  const total = ids.length;
  const categoryMap = new Map<ArtCategory, string[]>();

  // Group by category
  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    if (!categoryMap.has(meta.category)) {
      categoryMap.set(meta.category, []);
    }
    categoryMap.get(meta.category)!.push(id);
  });

  // Convert to stats
  return Array.from(categoryMap.entries())
    .map(([category, pieces]) => ({
      category,
      count: pieces.length,
      percentage: Math.round((pieces.length / total) * 100),
      pieces,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate complexity distribution
 */
function calculateComplexityStats(): ComplexityStats[] {
  const ids = getAllArtworkIds();
  const total = ids.length;
  const complexityMap = new Map<ArtComplexity, number>();

  // Count by complexity
  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    complexityMap.set(meta.complexity, (complexityMap.get(meta.complexity) || 0) + 1);
  });

  // Define complexity order
  const complexityOrder: ArtComplexity[] = ["simple", "moderate", "complex", "expert"];

  return complexityOrder
    .map((complexity) => ({
      complexity,
      count: complexityMap.get(complexity) || 0,
      percentage: Math.round(((complexityMap.get(complexity) || 0) / total) * 100),
    }))
    .filter((s) => s.count > 0);
}

/**
 * Calculate tag frequency
 */
function calculateTagStats(): TagStats[] {
  const ids = getAllArtworkIds();
  const total = ids.length;
  const tagMap = new Map<ArtTag, string[]>();

  // Collect all tags
  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    meta.tags.forEach((tag) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(id);
    });
  });

  // Convert to stats
  return Array.from(tagMap.entries())
    .map(([tag, pieces]) => ({
      tag,
      count: pieces.length,
      percentage: Math.round((pieces.length / total) * 100),
      pieces,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate creation timeline
 */
function calculateTimeline(): TimelineEntry[] {
  const ids = getAllArtworkIds();
  const dateMap = new Map<string, string[]>();

  // Group by date
  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    const date = meta.created;
    if (!dateMap.has(date)) {
      dateMap.set(date, []);
    }
    dateMap.get(date)!.push(id);
  });

  // Convert to sorted array
  return Array.from(dateMap.entries())
    .map(([date, pieces]) => ({
      date,
      pieces,
      count: pieces.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Calculate animated vs static ratio
 */
function calculateAnimatedRatio(): { animated: number; static: number; percentage: number } {
  const ids = getAllArtworkIds();
  let animated = 0;
  let static_ = 0;

  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    if (meta.tags.includes("animated")) {
      animated++;
    } else {
      static_++;
    }
  });

  return {
    animated,
    static: static_,
    percentage: Math.round((animated / ids.length) * 100),
  };
}

/**
 * Calculate color distribution
 */
function calculateColorDistribution(): { colorful: number; monochrome: number; percentage: number } {
  const ids = getAllArtworkIds();
  let colorful = 0;
  let monochrome = 0;

  ids.forEach((id) => {
    const meta = ARTWORK_METADATA[id];
    if (meta.tags.includes("colorful")) {
      colorful++;
    } else if (meta.tags.includes("monochrome")) {
      monochrome++;
    }
  });

  return {
    colorful,
    monochrome,
    percentage: Math.round((colorful / ids.length) * 100),
  };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Get complete gallery statistics
 * Computed on first call and cached
 */
let cachedStats: GalleryStatistics | null = null;

export function getGalleryStatistics(): GalleryStatistics {
  if (cachedStats) {
    return cachedStats;
  }

  const ids = getAllArtworkIds();

  cachedStats = {
    totalPieces: ids.length,
    categories: calculateCategoryStats(),
    complexity: calculateComplexityStats(),
    tags: calculateTagStats(),
    timeline: calculateTimeline(),
    animatedRatio: calculateAnimatedRatio(),
    colorDistribution: calculateColorDistribution(),
  };

  return cachedStats;
}

/**
 * Clear the statistics cache (useful after metadata updates)
 */
export function clearStatsCache(): void {
  cachedStats = null;
}

/**
 * Get pieces by category
 */
export function getPiecesByCategory(category: ArtCategory): string[] {
  return Object.entries(ARTWORK_METADATA)
    .filter(([, meta]) => meta.category === category)
    .map(([id]) => id);
}

/**
 * Get pieces by tag
 */
export function getPiecesByTag(tag: ArtTag): string[] {
  return Object.entries(ARTWORK_METADATA)
    .filter(([, meta]) => meta.tags.includes(tag))
    .map(([id]) => id);
}

/**
 * Get pieces by complexity
 */
export function getPiecesByComplexity(complexity: ArtComplexity): string[] {
  return Object.entries(ARTWORK_METADATA)
    .filter(([, meta]) => meta.complexity === complexity)
    .map(([id]) => id);
}

/**
 * Get recommended pieces based on current selection
 * Uses tag overlap for similarity
 */
export function getRecommendedPieces(
  currentPieceId: string,
  limit: number = 3
): string[] {
  const currentMeta = ARTWORK_METADATA[currentPieceId];
  if (!currentMeta) return [];

  const scores = Object.entries(ARTWORK_METADATA)
    .filter(([id]) => id !== currentPieceId)
    .map(([id, meta]) => {
      let score = 0;

      // Same category bonus
      if (meta.category === currentMeta.category) {
        score += 3;
      }

      // Tag overlap
      const sharedTags = meta.tags.filter((tag) => currentMeta.tags.includes(tag));
      score += sharedTags.length;

      // Same complexity bonus
      if (meta.complexity === currentMeta.complexity) {
        score += 1;
      }

      return { id, score };
    });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.id);
}

// ============================================================================
// FORMATTED OUTPUT
// ============================================================================

/**
 * Get statistics as formatted text for display/logging
 */
export function formatStatistics(stats: GalleryStatistics = getGalleryStatistics()): string {
  const lines: string[] = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║           GENERATIVE ART PORTFOLIO STATISTICS                ║",
    "╠══════════════════════════════════════════════════════════════╣",
    `║  Total Pieces: ${stats.totalPieces.toString().padEnd(47)} ║`,
    "╠══════════════════════════════════════════════════════════════╣",
    "║  BY CATEGORY                                                 ║",
  ];

  stats.categories.forEach((cat) => {
    const bar = "█".repeat(Math.round(cat.percentage / 5)).padEnd(20);
    lines.push(`║  ${cat.category.padEnd(12)} ${cat.count.toString().padStart(2)} (${cat.percentage.toString().padStart(2)}%) ${bar} ║`);
  });

  lines.push("╠══════════════════════════════════════════════════════════════╣");
  lines.push("║  BY COMPLEXITY                                               ║");

  stats.complexity.forEach((comp) => {
    const bar = "█".repeat(Math.round(comp.percentage / 5)).padEnd(20);
    lines.push(`║  ${comp.complexity.padEnd(12)} ${comp.count.toString().padStart(2)} (${comp.percentage.toString().padStart(2)}%) ${bar} ║`);
  });

  lines.push("╠══════════════════════════════════════════════════════════════╣");
  lines.push("║  ANIMATION                                                   ║");
  lines.push(`║  Animated: ${stats.animatedRatio.animated.toString().padStart(2)}  Static: ${stats.animatedRatio.static.toString().padStart(2)}  (${stats.animatedRatio.percentage}% animated)       ║`);
  lines.push("╠══════════════════════════════════════════════════════════════╣");
  lines.push("║  TOP TAGS                                                    ║");

  stats.tags.slice(0, 5).forEach((tag) => {
    lines.push(`║  #${tag.tag.padEnd(15)} ${tag.count.toString().padStart(2)} pieces (${tag.percentage}%)${"".padEnd(17)} ║`);
  });

  lines.push("╚══════════════════════════════════════════════════════════════╝");

  return lines.join("\n");
}

/**
 * Log statistics to console (for debugging/development)
 */
export function logStatistics(): void {
  // eslint-disable-next-line no-console
  console.log(formatStatistics());
}
