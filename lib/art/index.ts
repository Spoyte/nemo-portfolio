import { ArtGenerator } from "./core";
import { ARTWORK_METADATA } from "./metadata";

// Import all generators
import { auroraBorealis } from "./aurora-borealis";
import { flowField } from "./flow-field";
import { geometricMandala } from "./geometric-mandala";
import { particleNetwork } from "./particle-network";
import { recursiveTrees } from "./recursive-trees";
import { waveInterference } from "./wave-interference";
import { cellularAutomata } from "./cellular-automata";
import { voronoiOrganic } from "./voronoi-organic";
import { topographicFlow } from "./topographic-flow";
import { strangeAttractor } from "./strange-attractor";
import { reactionDiffusion } from "./reaction-diffusion";
import { dla } from "./dla";
import { lsystemBotany } from "./lsystem-botany";
import { orbitalMechanics } from "./orbital-mechanics-generator";
import { lightCaverns } from "./light-caverns-generator";
import { fluidSmoke } from "./fluid-smoke-generator";
import { particleSwarm } from "./particle-swarm-generator";
import { mandelbrotExplorer } from "./mandelbrot-explorer";
import { perlinTerrainGenerator } from "./perlin-terrain";
import { kaleidoscopeSymmetry } from "./kaleidoscope-symmetry";
import { neuralDreams } from "./neural-dreams";
import { lsystemFractals } from "./lsystem-fractals-generator";
import { quantumField } from "./quantum-field";
import { boidFlocking } from "./boid-flocking";
import { frequencyVisualizer } from "./frequency-visualizer";
import { lissajousCurves } from "./lissajous-curves-generator";
import { spirograph } from "./spirograph";
import { digitalWeave } from "./digital-weave";
import { stringArt } from "./string-art";
import { stainedGlass } from "./stained-glass";
import { fractalFlame } from "./fractal-flame";
import { polyhedralSculptures } from "./polyhedral-sculptures";
import { islamicPatterns } from "./islamic-patterns";
import { impossibleGeometry } from "./impossible-geometry";
import { metaballs } from "./metaballs";
import { phyllotaxis } from "./phyllotaxis";
import { harmonograph } from "./harmonograph";
import { watercolorDreams } from "./watercolor-dreams";
import { asciiArtGenerator } from "./ascii-art";
import { crossHatchingSketch } from "./cross-hatching";
import { moirePattern } from "./moire-pattern";
import { chladniFigures } from "./chladni-figures";
import { spaceFillingCurves } from "./space-filling-curves";
import { origamiTessellation } from "./origami-tessellation";
import { cymatics } from "./cymatics";
import { prismDispersion } from "./prism-dispersion";
import { kineticTypography } from "./kinetic-typography";
import { magneticField } from "./magnetic-field";
import { plasmaArc } from "./plasma-arc";
import { slimeMold } from "./slime-mold";
import { waveTank } from "./wave-tank";
import { solarFlare } from "./solar-flare";
import { crystalLattice } from "./crystal-lattice";
import { kaleidoscopeChamber } from "./kaleidoscope-chamber";
import { doublePendulum } from "./double-pendulum";
import { fourierSynthesis } from "./fourier-synthesis";
import { juliaSet } from "./julia-set";
import { barnsleyFern } from "./barnsley-fern";
import { chaosGame } from "./chaos-game";
import { penroseTiling } from "./penrose-tiling";
import { lenia } from "./lenia";
import { bioluminescentPlanktonGenerator } from "./bioluminescent-plankton-generator";

// Raw generators map - only include existing modules
const rawGenerators: Record<string, ArtGenerator> = {
  "aurora-borealis": auroraBorealis,
  "flow-field": flowField,
  "geometric-mandala": geometricMandala,
  "particle-network": particleNetwork,
  "recursive-trees": recursiveTrees,
  "wave-interference": waveInterference,
  "cellular-automata": cellularAutomata,
  "voronoi-organic": voronoiOrganic,
  "topographic-flow": topographicFlow,
  "strange-attractor": strangeAttractor,
  "reaction-diffusion": reactionDiffusion,
  "dla": dla,
  "lsystem-botany": lsystemBotany,
  "orbital-mechanics": orbitalMechanics,
  "light-caverns": lightCaverns,
  "fluid-smoke": fluidSmoke,
  "particle-swarm": particleSwarm,
  "mandelbrot-explorer": mandelbrotExplorer,
  "perlin-terrain": perlinTerrainGenerator,
  "kaleidoscope": kaleidoscopeSymmetry,
  "neural-dreams": neuralDreams,
  "lsystem-fractals": lsystemFractals,
  "quantum-field": quantumField,
  "boid-flocking": boidFlocking,
  "frequency-visualizer": frequencyVisualizer,
  "lissajous-curves": lissajousCurves,
  "spirograph": spirograph,
  "digital-weave": digitalWeave,
  "string-art": stringArt,
  "stained-glass": stainedGlass,
  "fractal-flame": fractalFlame,
  "polyhedral-sculptures": polyhedralSculptures,
  "islamic-patterns": islamicPatterns,
  "impossible-geometry": impossibleGeometry,
  "metaballs": metaballs,
  "phyllotaxis": phyllotaxis,
  "harmonograph": harmonograph,
  "watercolor-dreams": watercolorDreams,
  "ascii-art": asciiArtGenerator,
  "cross-hatching": crossHatchingSketch,
  "moire-pattern": moirePattern,
  "chladni-figures": chladniFigures,
  "space-filling-curves": spaceFillingCurves,
  "origami-tessellation": origamiTessellation,
  "cymatics": cymatics,
  "prism-dispersion": prismDispersion,
  "kinetic-typography": kineticTypography,
  "magnetic-field": magneticField,
  "plasma-arc": plasmaArc,
  "slime-mold": slimeMold,
  "wave-tank": waveTank,
  "solar-flare": solarFlare,
  "crystal-lattice": crystalLattice,
  "kaleidoscope-chamber": kaleidoscopeChamber,
  "double-pendulum": doublePendulum,
  "fourier-synthesis": fourierSynthesis,
  "julia-set": juliaSet,
  "barnsley-fern": barnsleyFern,
  "chaos-game": chaosGame,
  "penrose-tiling": penroseTiling,
  "lenia": lenia,
  "bioluminescent-plankton": bioluminescentPlanktonGenerator,
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

export * from "./core";
export * from "./metadata";
export * from "./statistics";

// Re-export individual functions for backward compatibility
export { renderAuroraBorealis, auroraBorealisDefaultParams } from './aurora-borealis';
export type { AuroraParams } from './aurora-borealis';
export { renderOrbitalMechanics, orbitalMechanicsDefaultParams } from './orbital-mechanics';
export type { OrbitalMechanicsParams } from './orbital-mechanics';
export { renderLightCaverns, lightCavernsDefaultParams } from './light-caverns';
export type { LightCavernsParams } from './light-caverns';
export { renderFluidSmoke, fluidSmokeDefaultParams } from './fluid-smoke';
export type { FluidSmokeParams } from './fluid-smoke';
export { renderParticleSwarm, particleSwarmDefaultParams } from './particle-swarm';
export type { ParticleSwarmParams } from './particle-swarm';
export { renderMandelbrot, mandelbrotDefaultParams, MANDELBROT_LOCATIONS } from './mandelbrot';
export type { MandelbrotParams } from './mandelbrot';
export { renderTerrain } from './perlin-terrain';
export { renderNeuralDreams, neuralDreamsDefaultParams } from './neural-dreams';
export type { NeuralDreamsParams } from './neural-dreams';
export { renderLsystemFractals, lsystemFractalsDefaultParams } from './lsystem-fractals';
export type { LsystemFractalsParams } from './lsystem-fractals';
export { renderQuantumField, quantumFieldDefaultParams } from './quantum-field';
export type { QuantumFieldParams } from './quantum-field';
export { renderLissajousCurves, lissajousCurvesDefaultParams } from './lissajous-curves';
export type { LissajousCurvesParams } from './lissajous-curves';
export { renderSpirograph, spirographDefaultParams } from './spirograph';
export type { SpirographParams } from './spirograph';
export { renderDigitalWeave, digitalWeaveDefaultParams } from './digital-weave';
export type { DigitalWeaveParams } from './digital-weave';
export { renderStringArt, stringArtDefaultParams } from './string-art';
export type { StringArtParams } from './string-art';
export { renderStainedGlass, stainedGlassDefaultParams } from './stained-glass';
export type { StainedGlassParams } from './stained-glass';
export { renderFractalFlame, fractalFlameDefaultParams } from './fractal-flame';
export type { FractalFlameParams } from './fractal-flame';
export { renderPolyhedralSculptures, polyhedralSculpturesDefaultParams } from './polyhedral-sculptures';
export type { PolyhedralSculpturesParams } from './polyhedral-sculptures';
export { renderIslamicPatterns, islamicPatternsDefaultParams } from './islamic-patterns';
export type { IslamicPatternParams } from './islamic-patterns';
export { renderImpossibleGeometry, impossibleGeometryDefaultParams } from './impossible-geometry';
export type { ImpossibleGeometryParams } from './impossible-geometry';

// Metaballs
export { renderMetaballs, metaballsDefaultParams } from './metaballs';
export type { MetaballsParams } from './metaballs';

// Phyllotaxis
export { renderPhyllotaxis, phyllotaxisDefaultParams } from './phyllotaxis';
export type { PhyllotaxisParams } from './phyllotaxis';

// Harmonograph
export { renderHarmonograph, harmonographDefaultParams } from './harmonograph';
export type { HarmonographParams } from './harmonograph';

// Watercolor Dreams
export { renderWatercolorDreams, watercolorDreamsDefaultParams } from './watercolor-dreams';
export type { WatercolorParams } from './watercolor-dreams';

// ASCII Art
export { renderAsciiArt, asciiArtDefaultParams } from './ascii-art';
export type { AsciiArtParams } from './ascii-art';

// Cross-Hatching Sketch
export { renderCrossHatching, crossHatchingDefaultParams } from './cross-hatching';
export type { CrossHatchingParams } from './cross-hatching';

// Moiré Pattern
export { renderMoirePattern, moirePatternDefaultParams } from './moire-pattern';
export type { MoirePatternParams } from './moire-pattern';

// Chladni Figures
export { renderChladniFigures, chladniFiguresDefaultParams } from './chladni-figures';
export type { ChladniFiguresParams } from './chladni-figures';

// Space-Filling Curves
export { renderSpaceFillingCurves, spaceFillingCurvesDefaultParams } from './space-filling-curves';
export type { SpaceFillingCurvesParams } from './space-filling-curves';

// Origami Tessellation
export { renderOrigamiTessellation, origamiTessellationDefaultParams } from './origami-tessellation';
export type { OrigamiTessellationParams } from './origami-tessellation';

// Cymatics
export { renderCymatics, cymaticsDefaultParams } from './cymatics';

// Kinetic Typography
export { renderKineticTypography, kineticTypographyDefaultParams } from './kinetic-typography';
export type { KineticTypographyParams } from './kinetic-typography';
export type { CymaticsParams } from './cymatics';

// Prism Dispersion
export { renderPrismDispersion, prismDispersionDefaultParams } from './prism-dispersion';
export type { PrismDispersionParams } from './prism-dispersion';

// Magnetic Field
export { renderMagneticField, magneticFieldDefaultParams } from './magnetic-field';
export type { MagneticFieldParams } from './magnetic-field';

// Plasma Arc
export { renderPlasmaArc, plasmaArcDefaultParams } from './plasma-arc';
export type { PlasmaArcParams } from './plasma-arc';

// Slime Mold
export { renderSlimeMold, slimeMoldDefaultParams } from './slime-mold';
export type { SlimeMoldParams } from './slime-mold';

// Wave Tank
export { renderWaveTank, waveTankDefaultParams } from './wave-tank';
export type { WaveTankParams } from './wave-tank';

// Solar Flare
export { renderSolarFlare, solarFlareDefaultParams } from './solar-flare';
export type { SolarFlareParams } from './solar-flare';

// Crystal Lattice
export { renderCrystalLattice, crystalLatticeDefaultParams } from './crystal-lattice';
export type { CrystalLatticeParams } from './crystal-lattice';

// Kaleidoscope Chamber
export { renderKaleidoscopeChamber, kaleidoscopeChamberDefaultParams } from './kaleidoscope-chamber';
export type { KaleidoscopeChamberParams } from './kaleidoscope-chamber';

// Double Pendulum
export { renderDoublePendulum, doublePendulumDefaultParams } from './double-pendulum';
export type { DoublePendulumParams } from './double-pendulum';

// Fourier Synthesis
export { renderFourierSynthesis, fourierSynthesisDefaultParams } from './fourier-synthesis';
export type { FourierSynthesisParams } from './fourier-synthesis';

// Julia Set
export { renderJuliaSet, juliaSetDefaultParams, JULIA_SEEDS } from './julia-set';
export type { JuliaSetParams } from './julia-set';

// Barnsley Fern
export { renderBarnsleyFern, barnsleyFernDefaultParams } from './barnsley-fern';
export type { BarnsleyFernParams } from './barnsley-fern';

// Chaos Game
export { renderChaosGame, chaosGameDefaultParams } from './chaos-game';
export type { ChaosGameParams } from './chaos-game';

// Penrose Tiling
export { renderPenroseTiling, penroseTilingDefaultParams } from './penrose-tiling';
export type { PenroseTilingParams } from './penrose-tiling';

// Lenia
export { renderLenia, leniaDefaultParams } from './lenia';
export type { LeniaParams } from './lenia';

// Bioluminescent Plankton
export { renderBioluminescentPlankton, bioluminescentPlanktonDefaultParams } from './bioluminescent-plankton';
export type { PlanktonParams } from './bioluminescent-plankton';
