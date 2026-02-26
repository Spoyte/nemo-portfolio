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
