// Unified art index - Clean, minimal exports using the registry system
// All generator metadata and loading is centralized in unified-registry.ts

import { ArtGenerator } from "./core";
import { ARTWORK_METADATA } from "./metadata";
import {
  GENERATOR_REGISTRY,
  GeneratorId,
  getGeneratorEntry,
  getGeneratorIdsByCategory,
  getCategoryStats,
  loadGenerator,
  validateRegistry,
} from "./unified-registry";

// Re-export core types
export * from "./core";
export * from "./metadata";
export * from "./statistics";

// Re-export registry system
export {
  GENERATOR_REGISTRY,
  type GeneratorId,
  type GeneratorEntry,
  type LoadedGenerator,
  getGeneratorEntry,
  getGeneratorIdsByCategory,
  getGeneratorsByCategory,
  getCategoryStats,
  getGeneratorMetadata,
  loadGenerator,
  validateRegistry,
  isValidGeneratorId,
  TOTAL_GENERATORS,
  GENERATOR_IDS,
  CATEGORIES,
} from "./unified-registry";

// ============================================================================
// STATIC IMPORTS - Eagerly loaded generators (all 70+)
// These are imported statically to maintain backward compatibility
// and enable tree-shaking for unused generators
// ============================================================================

// === MATHEMATICAL (10) ===
import { mandelbrotExplorer } from "./mandelbrot-explorer";
import { juliaSet } from "./julia-set";
import { strangeAttractor } from "./strange-attractor";
import { lissajousCurves } from "./lissajous-curves-generator";
import { spirograph } from "./spirograph";
import { harmonograph } from "./harmonograph";
import { spaceFillingCurves } from "./space-filling-curves";
import { fourierSynthesis } from "./fourier-synthesis";
import { barnsleyFern } from "./barnsley-fern";
import { chaosGame } from "./chaos-game";

// === NATURAL (8) ===
import { auroraBorealis } from "./aurora-borealis";
import { recursiveTrees } from "./recursive-trees";
import { lsystemBotany } from "./lsystem-botany";
import { lsystemFractals } from "./lsystem-fractals-generator";
import { perlinTerrainGenerator as perlinTerrain } from "./perlin-terrain";
import { dla } from "./dla";
import { slimeMold } from "./slime-mold";
import { bioluminescentPlankton } from "./bioluminescent-plankton";

// === PHYSICS (14) ===
import { waveInterference } from "./wave-interference";
import { orbitalMechanics } from "./orbital-mechanics-generator";
import { fluidSmoke } from "./fluid-smoke-generator";
import { particleSwarm } from "./particle-swarm";
import { boidFlocking } from "./boid-flocking";
import { chladniFigures } from "./chladni-figures";
import { cymatics } from "./cymatics";
import { prismDispersion } from "./prism-dispersion";
import { magneticField } from "./magnetic-field";
import { plasmaArc } from "./plasma-arc";
import { waveTank } from "./wave-tank";
import { solarFlare } from "./solar-flare";
import { doublePendulum } from "./double-pendulum";
import { nBodyGravity } from "./n-body-gravity-generator";

// === GEOMETRIC (11) ===
import { geometricMandala } from "./geometric-mandala";
import { kaleidoscopeSymmetry as kaleidoscope } from "./kaleidoscope-symmetry";
import { islamicPatterns } from "./islamic-patterns";
import { voronoiOrganic } from "./voronoi-organic";
import { stringArt } from "./string-art";
import { phyllotaxis } from "./phyllotaxis";
import { moirePattern } from "./moire-pattern";
import { origamiTessellation } from "./origami-tessellation";
import { kaleidoscopeChamber } from "./kaleidoscope-chamber";
import { penroseTiling } from "./penrose-tiling";
import { sacredGeometry } from "./sacred-geometry";

// === ABSTRACT (11) ===
import { impossibleGeometry } from "./impossible-geometry";
import { metaballs } from "./metaballs";
import { flowField } from "./flow-field";
import { reactionDiffusion } from "./reaction-diffusion";
import { cellularAutomata } from "./cellular-automata";
import { quantumField } from "./quantum-field";
import { fractalFlame } from "./fractal-flame";
import { neuralDreams } from "./neural-dreams";
import { turingPatterns } from "./turing-patterns";
import { lenia } from "./lenia";
import { selfOrganizingMap } from "./self-organizing-map";
import { langtonsAnt } from "./langtons-ant";

// === TRADITIONAL (5) ===
import { digitalWeave } from "./digital-weave";
import { stainedGlass } from "./stained-glass";
import { watercolorDreams } from "./watercolor-dreams";
import { asciiArtGenerator as asciiArt } from "./ascii-art";
import { crossHatchingSketch as crossHatching } from "./cross-hatching";
import { weavingLoom } from "./weaving-loom";

// === TEXT (1) ===
import { kineticTypography } from "./kinetic-typography";

// === 3D (3) ===
import { lightCaverns } from "./light-caverns-generator";
import { polyhedralSculptures } from "./polyhedral-sculptures";
import { crystalLattice } from "./crystal-lattice";

// === INTERACTIVE (4) ===
import { particleNetwork } from "./particle-network";
import { frequencyVisualizer } from "./frequency-visualizer";
import { topographicFlow } from "./topographic-flow";
import { abelianSandpile } from "./abelian-sandpile";

// ============================================================================
// GENERATORS MAP - Connects IDs to implementations
// ============================================================================

const rawGenerators: Record<string, ArtGenerator> = {
  // === MATHEMATICAL ===
  "mandelbrot-explorer": mandelbrotExplorer,
  "julia-set": juliaSet,
  "strange-attractor": strangeAttractor,
  "lissajous-curves": lissajousCurves,
  "spirograph": spirograph,
  "harmonograph": harmonograph,
  "space-filling-curves": spaceFillingCurves,
  "fourier-synthesis": fourierSynthesis,
  "barnsley-fern": barnsleyFern,
  "chaos-game": chaosGame,

  // === NATURAL ===
  "aurora-borealis": auroraBorealis,
  "recursive-trees": recursiveTrees,
  "lsystem-botany": lsystemBotany,
  "lsystem-fractals": lsystemFractals,
  "perlin-terrain": perlinTerrain,
  "dla": dla,
  "slime-mold": slimeMold,
  "bioluminescent-plankton": bioluminescentPlankton,

  // === PHYSICS ===
  "wave-interference": waveInterference,
  "orbital-mechanics": orbitalMechanics,
  "fluid-smoke": fluidSmoke,
  "particle-swarm": particleSwarm,
  "boid-flocking": boidFlocking,
  "chladni-figures": chladniFigures,
  "cymatics": cymatics,
  "prism-dispersion": prismDispersion,
  "magnetic-field": magneticField,
  "plasma-arc": plasmaArc,
  "wave-tank": waveTank,
  "solar-flare": solarFlare,
  "double-pendulum": doublePendulum,
  "n-body-gravity": nBodyGravity,

  // === GEOMETRIC ===
  "geometric-mandala": geometricMandala,
  "kaleidoscope": kaleidoscope,
  "islamic-patterns": islamicPatterns,
  "voronoi-organic": voronoiOrganic,
  "string-art": stringArt,
  "phyllotaxis": phyllotaxis,
  "moire-pattern": moirePattern,
  "origami-tessellation": origamiTessellation,
  "kaleidoscope-chamber": kaleidoscopeChamber,
  "penrose-tiling": penroseTiling,
  "sacred-geometry": sacredGeometry,

  // === ABSTRACT ===
  "impossible-geometry": impossibleGeometry,
  "metaballs": metaballs,
  "flow-field": flowField,
  "reaction-diffusion": reactionDiffusion,
  "cellular-automata": cellularAutomata,
  "quantum-field": quantumField,
  "fractal-flame": fractalFlame,
  "neural-dreams": neuralDreams,
  "turing-patterns": turingPatterns,
  "lenia": lenia,
  "self-organizing-map": selfOrganizingMap,
  "langtons-ant": langtonsAnt,

  // === TRADITIONAL ===
  "digital-weave": digitalWeave,
  "stained-glass": stainedGlass,
  "watercolor-dreams": watercolorDreams,
  "ascii-art": asciiArt,
  "cross-hatching": crossHatching,
  "weaving-loom": weavingLoom,

  // === TEXT ===
  "kinetic-typography": kineticTypography,

  // === 3D ===
  "light-caverns": lightCaverns,
  "polyhedral-sculptures": polyhedralSculptures,
  "crystal-lattice": crystalLattice,

  // === INTERACTIVE ===
  "particle-network": particleNetwork,
  "frequency-visualizer": frequencyVisualizer,
  "topographic-flow": topographicFlow,
  "abelian-sandpile": abelianSandpile,
};

// Apply metadata to generators
export const artGenerators: Record<string, ArtGenerator> = {};

Object.entries(rawGenerators).forEach(([id, generator]) => {
  artGenerators[id] = {
    ...generator,
    meta: ARTWORK_METADATA[id] || {
      category: "abstract",
      complexity: "moderate",
      tags: [],
      created: "2024-01-01",
    },
  };
});

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/** Get a generator by ID */
export function getGenerator(id: string): ArtGenerator | undefined {
  return artGenerators[id];
}

/** Get all generator IDs */
export function getAllGeneratorIds(): string[] {
  return Object.keys(artGenerators);
}

/** Check if a generator exists */
export function hasGenerator(id: string): boolean {
  return id in artGenerators;
}

// ============================================================================
// VALIDATION (run at module init in development)
// ============================================================================

if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
  const validation = validateRegistry();
  if (!validation.valid) {
    console.warn("[art/index] Registry validation issues:", validation);
  }
}
