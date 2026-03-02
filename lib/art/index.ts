// Unified art index - Auto-synchronized with unified-registry.ts
// Run `art-sync` to regenerate after adding entries to the registry

import { ArtGenerator } from "./core";
import { ARTWORK_METADATA } from "./metadata";

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
// STATIC IMPORTS - Auto-generated from unified-registry.ts
// Generated: 2026-03-02 17:33:15
// Do not edit manually - run: art-sync
// ============================================================================

// === MATHEMATICAL (13) ===
import { mandelbrotExplorer } from "./mandelbrot-explorer";
import { juliaSet } from "./julia-set";
import { strangeAttractor } from "./strange-attractor";
import { lissajousCurves } from "./lissajous-curves";
import { spirograph } from "./spirograph";
import { harmonograph } from "./harmonograph";
import { spaceFillingCurves } from "./space-filling-curves";
import { fourierSynthesis } from "./fourier-synthesis";
import { barnsleyFern } from "./barnsley-fern";
import { chaosGame } from "./chaos-game";
import { sierpinskiTriangle } from "./sierpinski-triangle";
import { dragonCurve } from "./dragon-curve";
import { cantorSet } from "./cantor-set";

// === NATURAL (8) ===
import { auroraBorealis } from "./aurora-borealis";
import { recursiveTrees } from "./recursive-trees";
import { lsystemBotany } from "./lsystem-botany";
import { lsystemFractals } from "./lsystem-fractals";
import { perlinTerrain } from "./perlin-terrain";
import { dla } from "./dla";
import { slimeMold } from "./slime-mold";
import { bioluminescentPlankton } from "./bioluminescent-plankton";

// === PHYSICS (14) ===
import { waveInterference } from "./wave-interference";
import { orbitalMechanics } from "./orbital-mechanics";
import { fluidSmoke } from "./fluid-smoke";
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
import { nBodyGravity } from "./n-body-gravity";

// === GEOMETRIC (11) ===
import { geometricMandala } from "./geometric-mandala";
import { kaleidoscope } from "./kaleidoscope";
import { islamicPatterns } from "./islamic-patterns";
import { voronoiOrganic } from "./voronoi-organic";
import { stringArt } from "./string-art";
import { phyllotaxis } from "./phyllotaxis";
import { moirePattern } from "./moire-pattern";
import { origamiTessellation } from "./origami-tessellation";
import { kaleidoscopeChamber } from "./kaleidoscope-chamber";
import { penroseTiling } from "./penrose-tiling";
import { sacredGeometry } from "./sacred-geometry";

// === ABSTRACT (13) ===
import { impossibleGeometry } from "./impossible-geometry";
import { metaballs } from "./metaballs";
import { flowField } from "./flow-field";
import { reactionDiffusion } from "./reaction-diffusion";
import { grayScottDiffusion } from "./gray-scott-diffusion";
import { cellularAutomata } from "./cellular-automata";
import { quantumField } from "./quantum-field";
import { fractalFlame } from "./fractal-flame";
import { neuralDreams } from "./neural-dreams";
import { turingPatterns } from "./turing-patterns";
import { lenia } from "./lenia";
import { selfOrganizingMap } from "./self-organizing-map";
import { langtonsAnt } from "./langtons-ant";

// === TRADITIONAL (8) ===
import { digitalWeave } from "./digital-weave";
import { stainedGlass } from "./stained-glass";
import { watercolorDreams } from "./watercolor-dreams";
import { asciiArt } from "./ascii-art";
import { crossHatching } from "./cross-hatching";
import { weavingLoom } from "./weaving-loom";
import { inkDiffusion } from "./ink-diffusion";
import { paperMarbling } from "./paper-marbling";

// === TEXT (5) ===
import { kineticTypography } from "./kinetic-typography";
import { poetryRain } from "./poetry-rain";
import { poetryVisualizer } from "./poetry-visualizer";
import { codeGarden } from "./code-garden";
import { calligraphyBrush } from "./calligraphy-brush";

// === 3D (4) ===
import { lightCaverns } from "./light-caverns";
import { polyhedralSculptures } from "./polyhedral-sculptures";
import { crystalLattice } from "./crystal-lattice";
import { sdfSculptor } from "./sdf-sculptor";

// === INTERACTIVE (8) ===
import { floatingLetters } from "./floating-letters";
import { audioReactiveWaves } from "./audio-reactive-waves";
import { particleNetwork } from "./particle-network";
import { frequencyVisualizer } from "./frequency-visualizer";
import { topographicFlow } from "./topographic-flow";
import { abelianSandpile } from "./abelian-sandpile";
import { magneticPoetry } from "./magnetic-poetry";
import { kineticSculpture } from "./kinetic-sculpture";


// ============================================================================
// GENERATORS MAP - Auto-generated from unified-registry.ts
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
  "sierpinski-triangle": sierpinskiTriangle,
  "dragon-curve": dragonCurve,
  "cantor-set": cantorSet,

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
  "gray-scott-diffusion": grayScottDiffusion,
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
  "ink-diffusion": inkDiffusion,
  "paper-marbling": paperMarbling,

  // === TEXT ===
  "kinetic-typography": kineticTypography,
  "poetry-rain": poetryRain,
  "poetry-visualizer": poetryVisualizer,
  "code-garden": codeGarden,
  "calligraphy-brush": calligraphyBrush,

  // === 3D ===
  "light-caverns": lightCaverns,
  "polyhedral-sculptures": polyhedralSculptures,
  "crystal-lattice": crystalLattice,
  "sdf-sculptor": sdfSculptor,

  // === INTERACTIVE ===
  "floating-letters": floatingLetters,
  "audio-reactive-waves": audioReactiveWaves,
  "particle-network": particleNetwork,
  "frequency-visualizer": frequencyVisualizer,
  "topographic-flow": topographicFlow,
  "abelian-sandpile": abelianSandpile,
  "magnetic-poetry": magneticPoetry,
  "kinetic-sculpture": kineticSculpture,
};

// ============================================================================
// APPLY METADATA - Enrich generators with metadata
// ============================================================================

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

// ============================================================================
// ADDITIONAL EXPORTS - Standalone modules not in registry
// ============================================================================

export { renderFlowingMagnetism, flowingMagnetismDefaultParams } from "./flowing-magnetism";
export type { FlowingMagnetismParams } from "./flowing-magnetism";