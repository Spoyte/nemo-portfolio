/**
 * Unified Art System Configuration
 * 
 * Single source of truth for all art-related UI configuration.
 * Extracted from art-gallery/page.tsx to enable reuse across the portfolio.
 * 
 * Design Principles (Dieter Rams):
 * - Less but better: One config file, all UI metadata
 * - Unobtrusive: Pure data, no runtime logic
 * - Thorough: Covers categories, complexity, tags, and theming
 */

import { ArtCategory, ArtComplexity, ArtTag } from "./core";

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

export interface CategoryConfig {
  /** Display label */
  label: string;
  /** Icon color class (for badges/text) */
  color: string;
  /** Background color class (for badges) */
  bgColor: string;
  /** Border color class (for cards) */
  borderColor: string;
  /** Active state background (for tabs) */
  activeBg: string;
  /** Brief description of the category */
  description: string;
  /** Target count for balanced portfolio */
  targetCount: number;
}

export const CATEGORY_CONFIG: Record<ArtCategory, CategoryConfig> = {
  mathematical: {
    label: "Mathematical",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    activeBg: "bg-blue-500",
    description: "Pure mathematics visualized: fractals, curves, and geometric forms",
    targetCount: 15,
  },
  natural: {
    label: "Natural",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    activeBg: "bg-green-500",
    description: "Nature-inspired algorithms: trees, terrain, organic patterns",
    targetCount: 10,
  },
  physics: {
    label: "Physics",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    activeBg: "bg-purple-500",
    description: "Physical simulations: fluids, particles, waves, and forces",
    targetCount: 12,
  },
  geometric: {
    label: "Geometric",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    activeBg: "bg-orange-500",
    description: "Geometric patterns: mandalas, tessellations, and symmetry",
    targetCount: 12,
  },
  abstract: {
    label: "Abstract",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    activeBg: "bg-pink-500",
    description: "Abstract art: fields, reaction-diffusion, and emergent patterns",
    targetCount: 12,
  },
  traditional: {
    label: "Traditional",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    activeBg: "bg-amber-500",
    description: "Traditional media emulation: hatching, watercolor, stained glass",
    targetCount: 10,
  },
  "3d": {
    label: "3D",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    activeBg: "bg-cyan-500",
    description: "Three-dimensional rendering: wireframes, raymarching, sculptures",
    targetCount: 6,
  },
  text: {
    label: "Text",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    activeBg: "bg-red-500",
    description: "Typography and text-based generative art",
    targetCount: 4,
  },
  interactive: {
    label: "Interactive",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    activeBg: "bg-indigo-500",
    description: "Interactive and animated experiences that respond to input",
    targetCount: 6,
  },
};

/** All category IDs as a typed array */
export const CATEGORY_IDS: ArtCategory[] = [
  "mathematical",
  "natural",
  "physics",
  "geometric",
  "abstract",
  "traditional",
  "3d",
  "text",
  "interactive",
];

// ============================================================================
// COMPLEXITY CONFIGURATION
// ============================================================================

export interface ComplexityConfig {
  /** Display label */
  label: string;
  /** Badge color classes */
  color: string;
  /** Description of complexity level */
  description: string;
  /** Numeric order for sorting (0 = simple, 3 = expert) */
  order: number;
}

export const COMPLEXITY_CONFIG: Record<ArtComplexity, ComplexityConfig> = {
  simple: {
    label: "Simple",
    color: "bg-green-500/20 text-green-600",
    description: "Easy to understand, minimal parameters",
    order: 0,
  },
  moderate: {
    label: "Moderate",
    color: "bg-yellow-500/20 text-yellow-600",
    description: "Balanced complexity, some parameters",
    order: 1,
  },
  complex: {
    label: "Complex",
    color: "bg-orange-500/20 text-orange-600",
    description: "Multiple systems interacting",
    order: 2,
  },
  expert: {
    label: "Expert",
    color: "bg-red-500/20 text-red-600",
    description: "Advanced algorithms, many parameters",
    order: 3,
  },
};

/** All complexity levels in order of increasing difficulty */
export const COMPLEXITY_LEVELS: ArtComplexity[] = ["simple", "moderate", "complex", "expert"];

// ============================================================================
// TAG CONFIGURATION
// ============================================================================

export interface TagConfig {
  /** Display label (capitalized) */
  label: string;
  /** Category grouping for organization */
  group: "animation" | "color" | "style" | "theme" | "complexity";
  /** Whether this tag implies animation */
  isAnimated?: boolean;
}

export const TAG_CONFIG: Record<ArtTag, TagConfig> = {
  animated: { label: "Animated", group: "animation", isAnimated: true },
  static: { label: "Static", group: "animation", isAnimated: false },
  monochrome: { label: "Monochrome", group: "color" },
  colorful: { label: "Colorful", group: "color" },
  geometric: { label: "Geometric", group: "style" },
  organic: { label: "Organic", group: "style" },
  chaotic: { label: "Chaotic", group: "style" },
  ordered: { label: "Ordered", group: "style" },
  minimal: { label: "Minimal", group: "complexity" },
  detailed: { label: "Detailed", group: "complexity" },
  retro: { label: "Retro", group: "theme" },
  futuristic: { label: "Futuristic", group: "theme" },
  nature: { label: "Nature", group: "theme" },
  abstract: { label: "Abstract", group: "theme" },
};

/** Tags that indicate an artwork is animated */
export const ANIMATED_TAGS: ArtTag[] = ["animated"];

/** Tags grouped by category for UI organization */
export const TAGS_BY_GROUP: Record<TagConfig["group"], ArtTag[]> = {
  animation: ["animated", "static"],
  color: ["monochrome", "colorful"],
  style: ["geometric", "organic", "chaotic", "ordered"],
  complexity: ["minimal", "detailed"],
  theme: ["retro", "futuristic", "nature", "abstract"],
};

// ============================================================================
// GALLERY UI CONFIGURATION
// ============================================================================

export interface GalleryConfig {
  /** Grid breakpoints */
  grid: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Thumbnail sizes */
  thumbnail: {
    grid: { width: number; height: number };
    list: { width: number; height: number };
    detail: { width: number; height: number };
  };
  /** Animation durations */
  animation: {
    stagger: number;
    hover: number;
    transition: number;
  };
}

export const GALLERY_CONFIG: GalleryConfig = {
  grid: {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  thumbnail: {
    grid: { width: 400, height: 400 },
    list: { width: 200, height: 200 },
    detail: { width: 800, height: 800 },
  },
  animation: {
    stagger: 0.05,
    hover: 0.2,
    transition: 0.3,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get category config safely with fallback
 */
export function getCategoryConfig(category: string): CategoryConfig {
  return CATEGORY_CONFIG[category as ArtCategory] ?? CATEGORY_CONFIG.abstract;
}

/**
 * Get complexity config safely with fallback
 */
export function getComplexityConfig(complexity: string): ComplexityConfig {
  return COMPLEXITY_CONFIG[complexity as ArtComplexity] ?? COMPLEXITY_CONFIG.moderate;
}

/**
 * Check if a tag indicates animation
 */
export function isAnimatedTag(tag: ArtTag): boolean {
  return TAG_CONFIG[tag]?.isAnimated ?? false;
}

/**
 * Get sort order for complexity (for sorting functions)
 */
export function getComplexityOrder(complexity: ArtComplexity): number {
  return COMPLEXITY_CONFIG[complexity]?.order ?? 1;
}

/**
 * Validate that a string is a valid category
 */
export function isValidCategory(category: string): category is ArtCategory {
  return category in CATEGORY_CONFIG;
}

/**
 * Validate that a string is a valid complexity
 */
export function isValidComplexity(complexity: string): complexity is ArtComplexity {
  return complexity in COMPLEXITY_CONFIG;
}

// ============================================================================
// PORTFOLIO BALANCE TARGETS
// ============================================================================

/** Total target artworks for a "complete" portfolio */
export const PORTFOLIO_TARGET_TOTAL = Object.values(CATEGORY_CONFIG).reduce(
  (sum, cat) => sum + cat.targetCount,
  0
);

/** Calculate portfolio diversity score (0-100) */
export function calculateDiversityScore(categoryCounts: Record<ArtCategory, number>): number {
  const categories = CATEGORY_IDS;
  const scores = categories.map((cat) => {
    const current = categoryCounts[cat] ?? 0;
    const target = CATEGORY_CONFIG[cat].targetCount;
    // Score is ratio capped at 1.0 (exceeding target doesn't penalize)
    return Math.min(current / target, 1);
  });
  
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(average * 100);
}

/** Identify underrepresented categories */
export function getUnderrepresentedCategories(
  categoryCounts: Record<ArtCategory, number>,
  threshold = 0.8
): ArtCategory[] {
  return CATEGORY_IDS.filter((cat) => {
    const current = categoryCounts[cat] ?? 0;
    const target = CATEGORY_CONFIG[cat].targetCount;
    return current / target < threshold;
  });
}
