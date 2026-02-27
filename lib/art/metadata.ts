// Metadata registry for all art generators
// This centralizes artwork metadata for the gallery organization system

import { ArtCategory, ArtComplexity, ArtTag } from "./core";

export interface ArtworkMetadata {
  category: ArtCategory;
  complexity: ArtComplexity;
  tags: ArtTag[];
  created: string; // ISO date
  dependsOn?: string[];
}

// Metadata for artworks in the collection (only existing modules)
export const ARTWORK_METADATA: Record<string, ArtworkMetadata> = {
  // === MATHEMATICAL ===
  "mandelbrot-explorer": {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "colorful", "detailed", "geometric"],
    created: "2024-02-22",
  },
  "strange-attractor": {
    category: "mathematical",
    complexity: "moderate",
    tags: ["animated", "chaotic", "monochrome", "abstract"],
    created: "2024-02-21",
  },
  "lissajous-curves": {
    category: "mathematical",
    complexity: "simple",
    tags: ["animated", "geometric", "ordered", "colorful"],
    created: "2024-02-25",
  },
  "spirograph": {
    category: "mathematical",
    complexity: "moderate",
    tags: ["geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-25",
  },

  // === NATURAL ===
  "aurora-borealis": {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "organic", "nature", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "recursive-trees": {
    category: "natural",
    complexity: "moderate",
    tags: ["static", "organic", "nature", "colorful"],
    created: "2024-02-20",
  },
  "lsystem-botany": {
    category: "natural",
    complexity: "complex",
    tags: ["static", "organic", "nature", "detailed"],
    created: "2024-02-21",
  },
  "lsystem-fractals": {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "geometric", "nature", "detailed"],
    created: "2024-02-23",
  },
  "perlin-terrain": {
    category: "natural",
    complexity: "moderate",
    tags: ["static", "organic", "nature", "colorful"],
    created: "2024-02-22",
  },
  "dla": {
    category: "natural",
    complexity: "moderate",
    tags: ["animated", "organic", "nature", "monochrome"],
    created: "2024-02-21",
  },

  // === PHYSICS ===
  "wave-interference": {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "organic", "colorful", "ordered"],
    created: "2024-02-20",
  },
  "orbital-mechanics": {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "colorful"],
    created: "2024-02-21",
  },
  "fluid-smoke": {
    category: "physics",
    complexity: "expert",
    tags: ["animated", "organic", "chaotic", "monochrome"],
    created: "2024-02-21",
  },
  "particle-swarm": {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "organic", "chaotic", "colorful"],
    created: "2024-02-21",
  },
  "boid-flocking": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "organic", "chaotic", "colorful"],
    created: "2024-02-23",
  },

  // === GEOMETRIC ===
  "geometric-mandala": {
    category: "geometric",
    complexity: "moderate",
    tags: ["static", "geometric", "ordered", "colorful"],
    created: "2024-02-20",
  },
  "kaleidoscope": {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "colorful"],
    created: "2024-02-22",
  },
  "islamic-patterns": {
    category: "geometric",
    complexity: "complex",
    tags: ["static", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-26",
  },
  "voronoi-organic": {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "organic", "geometric", "colorful"],
    created: "2024-02-20",
  },
  "string-art": {
    category: "geometric",
    complexity: "moderate",
    tags: ["static", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-25",
  },
  "phyllotaxis": {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "geometric", "organic", "nature", "colorful"],
    created: "2024-02-25",
  },
  "harmonograph": {
    category: "mathematical",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-26",
  },

  // === ABSTRACT ===
  "impossible-geometry": {
    category: "abstract",
    complexity: "moderate",
    tags: ["animated", "geometric", "monochrome", "abstract"],
    created: "2024-02-26",
  },
  "metaballs": {
    category: "abstract",
    complexity: "moderate",
    tags: ["animated", "organic", "colorful", "abstract"],
    created: "2024-02-25",
  },
  "flow-field": {
    category: "abstract",
    complexity: "moderate",
    tags: ["animated", "organic", "colorful", "abstract"],
    created: "2024-02-20",
  },
  "reaction-diffusion": {
    category: "abstract",
    complexity: "complex",
    tags: ["animated", "organic", "chaotic", "colorful"],
    created: "2024-02-21",
  },
  "cellular-automata": {
    category: "abstract",
    complexity: "moderate",
    tags: ["animated", "ordered", "chaotic", "monochrome"],
    created: "2024-02-20",
  },
  "quantum-field": {
    category: "abstract",
    complexity: "complex",
    tags: ["animated", "chaotic", "colorful", "futuristic"],
    created: "2024-02-23",
  },
  "fractal-flame": {
    category: "abstract",
    complexity: "expert",
    tags: ["animated", "chaotic", "colorful", "detailed"],
    created: "2024-02-24",
  },
  "neural-dreams": {
    category: "abstract",
    complexity: "complex",
    tags: ["animated", "organic", "colorful", "futuristic"],
    created: "2024-02-22",
  },

  // === TRADITIONAL ===
  "digital-weave": {
    category: "traditional",
    complexity: "moderate",
    tags: ["static", "ordered", "colorful", "detailed"],
    created: "2024-02-25",
  },
  "stained-glass": {
    category: "traditional",
    complexity: "complex",
    tags: ["static", "geometric", "colorful", "detailed"],
    created: "2024-02-24",
  },
  "watercolor-dreams": {
    category: "traditional",
    complexity: "complex",
    tags: ["animated", "organic", "colorful", "detailed"],
    created: "2024-02-26",
  },
  "ascii-art": {
    category: "traditional",
    complexity: "moderate",
    tags: ["animated", "geometric", "monochrome", "abstract"],
    created: "2024-02-26",
  },
  "cross-hatching": {
    category: "traditional",
    complexity: "moderate",
    tags: ["animated", "monochrome", "detailed"],
    created: "2024-02-26",
  },
  "moire-pattern": {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "minimal", "abstract"],
    created: "2024-02-26",
  },
  "chladni-figures": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed", "futuristic"],
    created: "2024-02-26",
  },
  "space-filling-curves": {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed"],
    created: "2024-02-26",
  },
  "origami-tessellation": {
    category: "geometric",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed"],
    created: "2024-02-26",
  },
  "cymatics": {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "organic", "colorful", "chaotic"],
    created: "2024-02-26",
  },
  "prism-dispersion": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "colorful", "ordered", "detailed", "futuristic"],
    created: "2024-02-27",
  },
  "kinetic-typography": {
    category: "text",
    complexity: "complex",
    tags: ["animated", "colorful", "futuristic", "abstract"],
    created: "2024-02-27",
  },
  "magnetic-field": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "slime-mold": {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "organic", "nature", "chaotic", "detailed"],
    created: "2024-02-27",
  },
  "wave-tank": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "organic", "nature", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "solar-flare": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "chaotic", "colorful", "detailed", "futuristic"],
    created: "2024-02-27",
  },
  "plasma-arc": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "colorful", "chaotic", "futuristic"],
    created: "2024-02-27",
    dependsOn: ["magnetic-field"],
  },
  "crystal-lattice": {
    category: "3d",
    complexity: "expert",
    tags: ["animated", "3d", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "kaleidoscope-chamber": {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-27",
  },
  "double-pendulum": {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "chaotic", "colorful", "detailed", "futuristic"],
    created: "2024-02-27",
  },
  "fourier-synthesis": {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed", "futuristic"],
    created: "2024-02-27",
  },
  "julia-set": {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "geometric", "colorful", "detailed", "chaotic"],
    created: "2024-02-27",
  },

  // === 3D ===
  "light-caverns": {
    category: "3d",
    complexity: "complex",
    tags: ["animated", "3d", "nature", "monochrome"],
    created: "2024-02-21",
  },
  "polyhedral-sculptures": {
    category: "3d",
    complexity: "expert",
    tags: ["animated", "3d", "geometric", "ordered", "colorful"],
    created: "2024-02-26",
  },

  // === INTERACTIVE ===
  "particle-network": {
    category: "interactive",
    complexity: "moderate",
    tags: ["animated", "geometric", "futuristic", "colorful"],
    created: "2024-02-20",
  },
  "frequency-visualizer": {
    category: "interactive",
    complexity: "complex",
    tags: ["animated", "geometric", "colorful", "futuristic"],
    created: "2024-02-23",
  },
  "topographic-flow": {
    category: "interactive",
    complexity: "moderate",
    tags: ["animated", "organic", "nature", "colorful"],
    created: "2024-02-20",
  },
};

// Helper function to get metadata for a generator
export function getArtworkMetadata(id: string): ArtworkMetadata | undefined {
  return ARTWORK_METADATA[id];
}

// Get all artwork IDs by category
export function getArtworkIdsByCategory(category: ArtCategory): string[] {
  return Object.entries(ARTWORK_METADATA)
    .filter(([, meta]) => meta.category === category)
    .map(([id]) => id);
}

// Get statistics
export function getCollectionStats() {
  const categories = {} as Record<ArtCategory, number>;
  const complexities = {} as Record<ArtComplexity, number>;
  const allTags = new Set<ArtTag>();
  let animatedCount = 0;

  Object.values(ARTWORK_METADATA).forEach((meta) => {
    categories[meta.category] = (categories[meta.category] || 0) + 1;
    complexities[meta.complexity] = (complexities[meta.complexity] || 0) + 1;
    meta.tags.forEach((tag) => {
      allTags.add(tag);
      if (tag === "animated") animatedCount++;
    });
  });

  return {
    total: Object.keys(ARTWORK_METADATA).length,
    categories,
    complexities,
    tagCount: allTags.size,
    animatedCount,
  };
}

// List of all valid artwork IDs that have corresponding generator modules
// This is used for validation - generators not in this list are considered "private" utilities
export const VALID_ARTWORK_IDS = new Set([
  // Mathematical
  "mandelbrot-explorer",
  "strange-attractor",
  "lissajous-curves",
  "spirograph",
  "harmonograph",
  "space-filling-curves",
  "fourier-synthesis",
  "julia-set",
  // Natural
  "aurora-borealis",
  "recursive-trees",
  "lsystem-botany",
  "lsystem-fractals",
  "perlin-terrain",
  "dla",
  "slime-mold",
  // Physics
  "wave-interference",
  "orbital-mechanics",
  "fluid-smoke",
  "particle-swarm",
  "boid-flocking",
  "chladni-figures",
  "cymatics",
  "prism-dispersion",
  "magnetic-field",
  "plasma-arc",
  "wave-tank",
  "solar-flare",
  "double-pendulum",
  // Geometric
  "geometric-mandala",
  "kaleidoscope",
  "islamic-patterns",
  "voronoi-organic",
  "string-art",
  "phyllotaxis",
  "moire-pattern",
  "origami-tessellation",
  // Abstract
  "impossible-geometry",
  "metaballs",
  "flow-field",
  "reaction-diffusion",
  "cellular-automata",
  "quantum-field",
  "fractal-flame",
  "neural-dreams",
  // Traditional
  "digital-weave",
  "stained-glass",
  "watercolor-dreams",
  "ascii-art",
  "cross-hatching",
  // Text
  "kinetic-typography",
  // 3D
  "light-caverns",
  "polyhedral-sculptures",
  "crystal-lattice",
  "kaleidoscope-chamber",
  // Interactive
  "particle-network",
  "frequency-visualizer",
  "topographic-flow",
]);

/**
 * Validate that all artwork IDs in metadata have corresponding entries in VALID_ARTWORK_IDS
 * and vice versa. Returns validation results for debugging.
 */
export function validateMetadata(): {
  valid: boolean;
  missingFromValidSet: string[];
  missingFromMetadata: string[];
  orphanedMetadata: string[];
} {
  const metadataIds = new Set(Object.keys(ARTWORK_METADATA));
  const missingFromValidSet: string[] = [];
  const missingFromMetadata: string[] = [];

  // Check metadata IDs are in valid set
  for (const id of metadataIds) {
    if (!VALID_ARTWORK_IDS.has(id)) {
      missingFromValidSet.push(id);
    }
  }

  // Check valid IDs have metadata
  for (const id of VALID_ARTWORK_IDS) {
    if (!metadataIds.has(id)) {
      missingFromMetadata.push(id);
    }
  }

  // Find orphaned metadata (IDs in metadata but not exported from index)
  const exportedIds = new Set([
    "aurora-borealis", "flow-field", "geometric-mandala", "particle-network",
    "recursive-trees", "wave-interference", "cellular-automata", "voronoi-organic",
    "topographic-flow", "strange-attractor", "reaction-diffusion", "dla",
    "lsystem-botany", "orbital-mechanics", "light-caverns", "fluid-smoke",
    "particle-swarm", "mandelbrot-explorer", "perlin-terrain", "kaleidoscope",
    "neural-dreams", "lsystem-fractals", "quantum-field", "boid-flocking",
    "frequency-visualizer", "lissajous-curves", "spirograph", "digital-weave",
    "string-art", "stained-glass", "fractal-flame", "polyhedral-sculptures",
    "islamic-patterns", "impossible-geometry", "metaballs", "phyllotaxis",
    "harmonograph", "watercolor-dreams", "ascii-art", "cross-hatching",
    "moire-pattern", "chladni-figures", "space-filling-curves", "origami-tessellation",
    "cymatics", "prism-dispersion", "kinetic-typography", "magnetic-field",
    "plasma-arc", "slime-mold", "wave-tank", "solar-flare", "crystal-lattice",
    "kaleidoscope-chamber", "double-pendulum", "fourier-synthesis", "julia-set",
  ]);
  const orphanedMetadata = Array.from(metadataIds).filter(id => !exportedIds.has(id));

  return {
    valid: missingFromValidSet.length === 0 && missingFromMetadata.length === 0,
    missingFromValidSet,
    missingFromMetadata,
    orphanedMetadata,
  };
}
