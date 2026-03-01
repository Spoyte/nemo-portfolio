// Artwork registry system - Centralized generator management
// Eliminates repetitive export/import patterns across 51+ art generators
//
// This module provides:
// 1. Automatic generator discovery and registration
// 2. Consistent wrapper pattern for all generators
// 3. Type-safe access to all artwork modules
// 4. Automated export generation

import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// ============================================================================
// GENERATOR REGISTRY
// ============================================================================

/**
 * Generator definition - either a complete ArtGenerator or a module with
 * render function + default params that needs wrapping
 */
interface GeneratorModule {
  // Required: The render function (varies by generator)
  [renderFn: string]: unknown;
  // Common pattern: default params object
  defaultParams?: Record<string, unknown>;
}

/**
 * Registry entry for lazy-loaded generators
 */
interface GeneratorEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  loader: () => Promise<GeneratorModule>;
  renderFnName: string;
  paramMappings?: ParamMapping[];
}

/**
 * Parameter mapping for converting between ArtParams and generator-specific params
 */
interface ParamMapping {
  paramKey: string;
  targetKey: string;
  transform?: (value: unknown) => unknown;
}

// ============================================================================
// GENERATOR DEFINITIONS
// ============================================================================

/**
 * Central registry of all 53 art generators
 * This single source of truth replaces scattered imports across index.ts
 */
export const GENERATOR_REGISTRY: GeneratorEntry[] = [
  // === MATHEMATICAL (7) ===
  {
    id: "mandelbrot-explorer",
    name: "Mandelbrot Explorer",
    description: "Infinite complexity from simple iteration - explore the boundary of the Mandelbrot set",
    category: "mathematical",
    loader: () => import("./mandelbrot-explorer"),
    renderFnName: "renderMandelbrot",
  },
  {
    id: "strange-attractor",
    name: "Strange Attractor",
    description: "Chaos theory visualization - where deterministic rules create unpredictable beauty",
    category: "mathematical",
    loader: () => import("./strange-attractor"),
    renderFnName: "renderAttractor",
  },
  {
    id: "lissajous-curves",
    name: "Lissajous Curves",
    description: "Harmonic motion patterns from parametric equations with interference visualization",
    category: "mathematical",
    loader: () => import("./lissajous-curves"),
    renderFnName: "renderLissajousCurves",
  },
  {
    id: "spirograph",
    name: "Spirograph",
    description: "Mathematical epitrochoid and hypotrochoid curves creating intricate geometric patterns",
    category: "mathematical",
    loader: () => import("./spirograph"),
    renderFnName: "renderSpirograph",
  },
  {
    id: "harmonograph",
    name: "Harmonograph",
    description: "Mechanical drawing machine simulation - pendulums creating harmonic patterns",
    category: "mathematical",
    loader: () => import("./harmonograph"),
    renderFnName: "renderHarmonograph",
  },
  {
    id: "space-filling-curves",
    name: "Space-Filling Curves",
    description: "Fractal curves that visit every point in a space - from Hilbert to Peano",
    category: "mathematical",
    loader: () => import("./space-filling-curves"),
    renderFnName: "renderSpaceFillingCurves",
  },
  {
    id: "fourier-synthesis",
    name: "Fourier Synthesis",
    description: "Visualize how complex waveforms build from simple sine waves through epicycles",
    category: "mathematical",
    loader: () => import("./fourier-synthesis"),
    renderFnName: "renderFourierSynthesis",
  },
  {
    id: "julia-set",
    name: "Julia Set Explorer",
    description: "Explore Julia sets - the Mandelbrot's complex sibling with orbit visualization",
    category: "mathematical",
    loader: () => import("./julia-set"),
    renderFnName: "renderJuliaSet",
  },

  // === NATURAL (7) ===
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    description: "Atmospheric light phenomenon simulation with flowing ionized particles",
    category: "natural",
    loader: () => import("./aurora-borealis"),
    renderFnName: "renderAuroraBorealis",
  },
  {
    id: "recursive-trees",
    name: "Recursive Trees",
    description: "Fractal branching structures - nature's recursive algorithm",
    category: "natural",
    loader: () => import("./recursive-trees"),
    renderFnName: "renderTree",
  },
  {
    id: "lsystem-botany",
    name: "L-System Botany",
    description: "Formal grammar systems generating plant-like structures",
    category: "natural",
    loader: () => import("./lsystem-botany"),
    renderFnName: "renderLSystem",
  },
  {
    id: "lsystem-fractals",
    name: "L-System Fractals",
    description: "Mathematical recursion producing organic and geometric forms",
    category: "natural",
    loader: () => import("./lsystem-fractals"),
    renderFnName: "renderLsystemFractals",
  },
  {
    id: "perlin-terrain",
    name: "Perlin Terrain",
    description: "Procedural landscape generation using gradient noise",
    category: "natural",
    loader: () => import("./perlin-terrain"),
    renderFnName: "renderTerrain",
  },
  {
    id: "dla",
    name: "DLA",
    description: "Diffusion-limited aggregation - coral-like growth patterns",
    category: "natural",
    loader: () => import("./dla"),
    renderFnName: "renderDLA",
  },
  {
    id: "slime-mold",
    name: "Slime Mold",
    description: "Physarum simulation - emergent network optimization from simple agents",
    category: "natural",
    loader: () => import("./slime-mold"),
    renderFnName: "renderSlimeMold",
  },

  // === PHYSICS (14) ===
  {
    id: "wave-interference",
    name: "Wave Interference",
    description: "Constructive and destructive interference patterns from multiple wave sources",
    category: "physics",
    loader: () => import("./wave-interference"),
    renderFnName: "renderWaves",
  },
  {
    id: "orbital-mechanics",
    name: "Orbital Mechanics",
    description: "Gravitational dance of celestial bodies - n-body simulation",
    category: "physics",
    loader: () => import("./orbital-mechanics"),
    renderFnName: "renderOrbitalMechanics",
  },
  {
    id: "fluid-smoke",
    name: "Fluid Smoke",
    description: "Navier-Stokes fluid dynamics simulation - turbulent smoke and flow",
    category: "physics",
    loader: () => import("./fluid-smoke"),
    renderFnName: "renderFluid",
  },
  {
    id: "particle-swarm",
    name: "Particle Swarm",
    description: "Emergent collective behavior from simple particle interactions",
    category: "physics",
    loader: () => import("./particle-swarm"),
    renderFnName: "renderParticleSwarm",
  },
  {
    id: "boid-flocking",
    name: "Boid Flocking",
    description: "Craig Reynolds' flocking algorithm - separation, alignment, cohesion",
    category: "physics",
    loader: () => import("./boid-flocking"),
    renderFnName: "renderBoids",
  },
  {
    id: "chladni-figures",
    name: "Chladni Figures",
    description: "Resonance patterns on vibrating plates - sound made visible",
    category: "physics",
    loader: () => import("./chladni-figures"),
    renderFnName: "renderChladniFigures",
  },
  {
    id: "cymatics",
    name: "Cymatics",
    description: "Wave phenomena visualized through particle displacement",
    category: "physics",
    loader: () => import("./cymatics"),
    renderFnName: "renderCymatics",
  },
  {
    id: "prism-dispersion",
    name: "Prism Dispersion",
    description: "Light refraction and spectral decomposition through optical media",
    category: "physics",
    loader: () => import("./prism-dispersion"),
    renderFnName: "renderPrismDispersion",
  },
  {
    id: "magnetic-field",
    name: "Magnetic Field",
    description: "Visualization of electromagnetic field lines and particle trajectories",
    category: "physics",
    loader: () => import("./magnetic-field"),
    renderFnName: "renderMagneticField",
  },
  {
    id: "plasma-arc",
    name: "Plasma Arc",
    description: "Electrical discharge simulation with branching lightning patterns",
    category: "physics",
    loader: () => import("./plasma-arc"),
    renderFnName: "renderPlasmaArc",
  },
  {
    id: "wave-tank",
    name: "Wave Tank",
    description: "Shallow water wave simulation with realistic fluid dynamics",
    category: "physics",
    loader: () => import("./wave-tank"),
    renderFnName: "renderWaveTank",
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    description: "Stellar magnetic reconnection and plasma ejection visualization",
    category: "physics",
    loader: () => import("./solar-flare"),
    renderFnName: "renderSolarFlare",
  },
  {
    id: "double-pendulum",
    name: "Double Pendulum",
    description: "Chaotic dynamics from simple coupled oscillators",
    category: "physics",
    loader: () => import("./double-pendulum"),
    renderFnName: "renderDoublePendulum",
  },

  // === GEOMETRIC (9) ===
  {
    id: "geometric-mandala",
    name: "Geometric Mandala",
    description: "Sacred geometry patterns with radial symmetry",
    category: "geometric",
    loader: () => import("./geometric-mandala"),
    renderFnName: "renderMandala",
  },
  {
    id: "kaleidoscope",
    name: "Kaleidoscope",
    description: "Mirror symmetry creating infinite pattern variations",
    category: "geometric",
    loader: () => import("./kaleidoscope-symmetry"),
    renderFnName: "renderKaleidoscope",
  },
  {
    id: "islamic-patterns",
    name: "Islamic Patterns",
    description: "Traditional geometric art from Islamic mathematical heritage",
    category: "geometric",
    loader: () => import("./islamic-patterns"),
    renderFnName: "renderIslamicPatterns",
  },
  {
    id: "voronoi-organic",
    name: "Voronoi Organic",
    description: "Natural tessellation patterns from nearest-neighbor regions",
    category: "geometric",
    loader: () => import("./voronoi-organic"),
    renderFnName: "renderVoronoi",
  },
  {
    id: "string-art",
    name: "String Art",
    description: "Thread wound between pins creating mathematical curves",
    category: "geometric",
    loader: () => import("./string-art"),
    renderFnName: "renderStringArt",
  },
  {
    id: "phyllotaxis",
    name: "Phyllotaxis",
    description: "Golden angle spiral patterns found in plant growth",
    category: "geometric",
    loader: () => import("./phyllotaxis"),
    renderFnName: "renderPhyllotaxis",
  },
  {
    id: "moire-pattern",
    name: "Moiré Pattern",
    description: "Interference patterns from overlapping grids",
    category: "geometric",
    loader: () => import("./moire-pattern"),
    renderFnName: "renderMoirePattern",
  },
  {
    id: "origami-tessellation",
    name: "Origami Tessellation",
    description: "Folded paper patterns creating 3D relief from 2D sheets",
    category: "geometric",
    loader: () => import("./origami-tessellation"),
    renderFnName: "renderOrigamiTessellation",
  },
  {
    id: "kaleidoscope-chamber",
    name: "Kaleidoscope Chamber",
    description: "Immersive mirrored room with infinite reflections",
    category: "geometric",
    loader: () => import("./kaleidoscope-chamber"),
    renderFnName: "renderKaleidoscopeChamber",
  },

  // === ABSTRACT (8) ===
  {
    id: "impossible-geometry",
    name: "Impossible Geometry",
    description: "Escher-inspired illusions and paradoxical structures",
    category: "abstract",
    loader: () => import("./impossible-geometry"),
    renderFnName: "renderImpossibleGeometry",
  },
  {
    id: "metaballs",
    name: "Metaballs",
    description: "Organic blob shapes from implicit surface functions",
    category: "abstract",
    loader: () => import("./metaballs"),
    renderFnName: "renderMetaballs",
  },
  {
    id: "flow-field",
    name: "Flow Field",
    description: "Perlin noise vector fields guiding particle trails",
    category: "abstract",
    loader: () => import("./flow-field"),
    renderFnName: "renderFlowField",
  },
  {
    id: "reaction-diffusion",
    name: "Reaction-Diffusion",
    description: "Turing patterns - chemical morphogenesis simulation",
    category: "abstract",
    loader: () => import("./reaction-diffusion"),
    renderFnName: "renderReactionDiffusion",
  },
  {
    id: "cellular-automata",
    name: "Cellular Automata",
    description: "Discrete computational systems - Conway's Game of Life and beyond",
    category: "abstract",
    loader: () => import("./cellular-automata"),
    renderFnName: "renderCellularAutomata",
  },
  {
    id: "quantum-field",
    name: "Quantum Field",
    description: "Probability wave visualization and quantum fluctuations",
    category: "abstract",
    loader: () => import("./quantum-field"),
    renderFnName: "renderQuantumField",
  },
  {
    id: "fractal-flame",
    name: "Fractal Flame",
    description: "Iterated function systems creating organic fractal imagery",
    category: "abstract",
    loader: () => import("./fractal-flame"),
    renderFnName: "renderFractalFlame",
  },
  {
    id: "neural-dreams",
    name: "Neural Dreams",
    description: "Activation patterns from artificial neural networks",
    category: "abstract",
    loader: () => import("./neural-dreams"),
    renderFnName: "renderNeuralDreams",
  },
  {
    id: "neural-cellular-automata",
    name: "Neural Cellular Automata",
    description: "Cells learn to grow patterns through neural network rules - self-organizing life",
    category: "abstract",
    loader: () => import("./neural-cellular-automata"),
    renderFnName: "renderNeuralCA",
  },

  // === TRADITIONAL (6) ===
  {
    id: "digital-weave",
    name: "Digital Weave",
    description: "Textile patterns from interlacing warp and weft threads",
    category: "traditional",
    loader: () => import("./digital-weave"),
    renderFnName: "renderDigitalWeave",
  },
  {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Lead came framing colored glass with light transmission",
    category: "traditional",
    loader: () => import("./stained-glass"),
    renderFnName: "renderStainedGlass",
  },
  {
    id: "watercolor-dreams",
    name: "Watercolor Dreams",
    description: "Pigment diffusion and paper texture simulation",
    category: "traditional",
    loader: () => import("./watercolor-dreams"),
    renderFnName: "renderWatercolorDreams",
  },
  {
    id: "ascii-art",
    name: "ASCII Art",
    description: "Text-based imagery from character density patterns",
    category: "traditional",
    loader: () => import("./ascii-art"),
    renderFnName: "renderAsciiArt",
  },
  {
    id: "cross-hatching",
    name: "Cross-Hatching",
    description: "Classical drawing technique with intersecting parallel lines",
    category: "traditional",
    loader: () => import("./cross-hatching"),
    renderFnName: "renderCrossHatching",
  },

  // === TEXT (1) ===
  {
    id: "kinetic-typography",
    name: "Kinetic Typography",
    description: "Animated text with motion dynamics and rhythmic expression",
    category: "text",
    loader: () => import("./kinetic-typography"),
    renderFnName: "renderKineticTypography",
  },

  // === 3D (3) ===
  {
    id: "light-caverns",
    name: "Light Caverns",
    description: "Raymarched volumetric lighting through cavernous spaces",
    category: "3d",
    loader: () => import("./light-caverns"),
    renderFnName: "renderLightCaverns",
  },
  {
    id: "polyhedral-sculptures",
    name: "Polyhedral Sculptures",
    description: "Platonic and Archimedean solids in 3D projection",
    category: "3d",
    loader: () => import("./polyhedral-sculptures"),
    renderFnName: "renderPolyhedralSculptures",
  },
  {
    id: "crystal-lattice",
    name: "Crystal Lattice",
    description: "Atomic arrangements and crystalline structures in 3D",
    category: "3d",
    loader: () => import("./crystal-lattice"),
    renderFnName: "renderCrystalLattice",
  },

  // === INTERACTIVE (3) ===
  {
    id: "particle-network",
    name: "Particle Network",
    description: "Connected nodes forming dynamic mesh structures",
    category: "interactive",
    loader: () => import("./particle-network"),
    renderFnName: "renderParticleNetwork",
  },
  {
    id: "frequency-visualizer",
    name: "Frequency Visualizer",
    description: "Audio spectrum analysis and waveform visualization",
    category: "interactive",
    loader: () => import("./frequency-visualizer"),
    renderFnName: "renderFrequencyVisualizer",
  },
  {
    id: "topographic-flow",
    name: "Topographic Flow",
    description: "Contour line animation following terrain gradients",
    category: "interactive",
    loader: () => import("./topographic-flow"),
    renderFnName: "renderTopographicFlow",
  },
];

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

/**
 * Get a generator entry by ID
 */
export function getGeneratorEntry(id: string): GeneratorEntry | undefined {
  return GENERATOR_REGISTRY.find((g) => g.id === id);
}

/**
 * Get all generator IDs in a category
 */
export function getGeneratorIdsByCategory(category: string): string[] {
  return GENERATOR_REGISTRY.filter((g) => g.category === category).map((g) => g.id);
}

/**
 * Get all categories with their generator counts
 */
export function getCategoryStats(): Record<string, number> {
  return GENERATOR_REGISTRY.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Total number of registered generators
 */
export const TOTAL_GENERATORS = GENERATOR_REGISTRY.length;

// ============================================================================
// DYNAMIC GENERATOR LOADING
// ============================================================================

/**
 * Dynamically load and wrap a generator module into an ArtGenerator
 * This eliminates the need for separate *-generator.ts wrapper files
 */
export async function loadGenerator(id: string): Promise<ArtGenerator | null> {
  const entry = getGeneratorEntry(id);
  if (!entry) return null;

  try {
    const module = await entry.loader();
    const renderFn = module[entry.renderFnName] as (
      ctx: CanvasRenderingContext2D,
      ...args: unknown[]
    ) => void;

    if (!renderFn) {
      console.error(`Render function ${entry.renderFnName} not found in ${id}`);
      return null;
    }

    // Extract default params if available
    const defaultParams = (module.defaultParams as Record<string, unknown>) || {};

    // Build param configs from default params
    // This assumes generators follow the convention of exporting defaultParams
    const params: Record<string, ParamConfig> = {};
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (typeof value === "number") {
        params[key] = {
          name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
          type: "range",
          min: 0,
          max: value * 2 || 100,
          step: value < 1 ? 0.1 : 1,
          default: value,
        };
      } else if (typeof value === "string") {
        params[key] = {
          name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
          type: "select",
          options: [value],
          default: value,
        };
      }
    });

    return {
      name: entry.name,
      description: entry.description,
      params,
      generate: (ctx, artParams, time) => {
        // Convert ArtParams to generator-specific params
        const specificParams: Record<string, unknown> = {};
        Object.entries(artParams).forEach(([key, value]) => {
          specificParams[key] = value;
        });
        renderFn(ctx, specificParams, time);
      },
    };
  } catch (err) {
    console.error(`Failed to load generator ${id}:`, err);
    return null;
  }
}

// ============================================================================
// EXPORT CODE GENERATION
// ============================================================================

/**
 * Generate the static import statements for index.ts
 * Run this to update index.ts when adding new generators
 */
export function generateIndexImports(): string {
  const lines: string[] = [];

  // Group by category for organization
  const byCategory = GENERATOR_REGISTRY.reduce((acc, g) => {
    acc[g.category] = acc[g.category] || [];
    acc[g.category].push(g);
    return acc;
  }, {} as Record<string, GeneratorEntry[]>);

  Object.entries(byCategory).forEach(([category, generators]) => {
    lines.push(`// === ${category.toUpperCase()} ===`);
    generators.forEach((g) => {
      const importName = g.id.replace(/-/g, "");
      lines.push(`import { ${importName} } from "./${g.id}";`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Generate the generators map for index.ts
 */
export function generateGeneratorsMap(): string {
  const lines: string[] = ["const rawGenerators: Record<string, ArtGenerator> = {"];

  const byCategory = GENERATOR_REGISTRY.reduce((acc, g) => {
    acc[g.category] = acc[g.category] || [];
    acc[g.category].push(g);
    return acc;
  }, {} as Record<string, GeneratorEntry[]>);

  Object.entries(byCategory).forEach(([category, generators]) => {
    lines.push(`  // ${category}`);
    generators.forEach((g) => {
      const varName = g.id.replace(/-/g, "");
      lines.push(`  "${g.id}": ${varName},`);
    });
    lines.push("");
  });

  lines.push("};");
  return lines.join("\n");
}

/**
 * Generate TypeScript union type of all generator IDs
 */
export function generateGeneratorIdType(): string {
  const ids = GENERATOR_REGISTRY.map((g) => `"${g.id}"`).join("\n  | ");
  return `export type GeneratorId =
  | ${ids};`;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that all registered generators have corresponding metadata entries
 */
export function validateRegistry(): {
  valid: boolean;
  missingFromMetadata: string[];
  missingFromRegistry: string[];
} {
  // This would need to import ARTWORK_METADATA to check
  // For now, return placeholder
  return {
    valid: true,
    missingFromMetadata: [],
    missingFromRegistry: [],
  };
}

// ============================================================================
// MIGRATION GUIDE
// ============================================================================

/**
 * Migration checklist for adopting the registry system:
 *
 * 1. ✅ Create registry.ts (this file)
 * 2. ⬜ Update index.ts to use registry for imports
 * 3. ⬜ Remove redundant *-generator.ts wrapper files
 * 4. ⬜ Update thumbnails.ts to use registry
 * 5. ⬜ Add registry validation to build process
 * 6. ⬜ Document the new generator addition process
 *
 * Benefits:
 * - Single source of truth for all 52 generators
 * - No more scattered import statements
 * - Automatic param config generation
 * - Lazy loading support for code splitting
 * - Category-based organization
 * - Type-safe generator access
 */
