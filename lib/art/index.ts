import { ArtGenerator } from "./core";
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
import { phyllotaxis } from "./phyllotaxis";
import { chladniFigures } from "./chladni-figures";
import { harmonograph } from "./harmonograph";
import { metaballs } from "./metaballs";
import { voxelTerrain } from "./voxel-terrain";
import { polarRose } from "./polar-rose";
import { particleConstellation } from "./particle-constellation";
import { wireframeTerrainGenerator } from "./wireframe-terrain-generator";
import { raymarchedSceneGenerator } from "./raymarched-scene-generator";
import { mandelbulbGenerator } from "./mandelbulb-generator";
import { epicycles } from "./epicycles";
import { mobiusStrip } from "./mobius-strip";
import { shaderBloom } from "./shader-bloom";
import { cymaticsFlow } from "./cymatics-flow";
import { kineticTypography } from "./kinetic-typography";
import { asciiArt } from "./ascii-art";
import { crossHatching } from "./cross-hatching";
import { moire } from "./moire";
import { stainedGlass } from "./stained-glass";
import { fractalFlame } from "./fractal-flame";
import { impossibleGeometry } from "./impossible-geometry";

export const artGenerators: Record<string, ArtGenerator> = {
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
  "phyllotaxis": phyllotaxis,
  "chladni-figures": chladniFigures,
  "harmonograph": harmonograph,
  "metaballs": metaballs,
  "voxel-terrain": voxelTerrain,
  "polar-rose": polarRose,
  "particle-constellation": particleConstellation,
  "wireframe-terrain": wireframeTerrainGenerator,
  "raymarched-scene": raymarchedSceneGenerator,
  "mandelbulb": mandelbulbGenerator,
  "fourier-epicycles": epicycles,
  "mobius-strip": mobiusStrip,
  "shader-bloom": shaderBloom,
  "cymatics-flow": cymaticsFlow,
  "kinetic-typography": kineticTypography,
  "ascii-art": asciiArt,
  "cross-hatching": crossHatching,
  "moire": moire,
  "stained-glass": stainedGlass,
  "fractal-flame": fractalFlame,
  "impossible-geometry": impossibleGeometry,
};

export * from "./core";

// Orbital Mechanics
export { renderOrbitalMechanics, orbitalMechanicsDefaultParams } from './orbital-mechanics';
export type { OrbitalMechanicsParams } from './orbital-mechanics';

// Light Caverns
export { renderLightCaverns, lightCavernsDefaultParams } from './light-caverns';
export type { LightCavernsParams } from './light-caverns';

// Fluid Smoke
export { renderFluidSmoke, fluidSmokeDefaultParams } from './fluid-smoke';
export type { FluidSmokeParams } from './fluid-smoke';

// Particle Swarm
export { renderParticleSwarm, particleSwarmDefaultParams } from './particle-swarm';
export type { ParticleSwarmParams } from './particle-swarm';

// Mandelbrot
export { renderMandelbrot, mandelbrotDefaultParams, MANDELBROT_LOCATIONS } from './mandelbrot';
export type { MandelbrotParams } from './mandelbrot';

// Perlin Terrain
export { renderTerrain } from './perlin-terrain';

// Neural Dreams
export { renderNeuralDreams, neuralDreamsDefaultParams } from './neural-dreams';
export type { NeuralDreamsParams } from './neural-dreams';

// L-System Fractal Flora
export { renderLsystemFractals, lsystemFractalsDefaultParams } from './lsystem-fractals';
export type { LsystemFractalsParams } from './lsystem-fractals';

// Quantum Field
export { renderQuantumField, quantumFieldDefaultParams } from './quantum-field';
export type { QuantumFieldParams } from './quantum-field';

// Boid Flocking
export { boidFlocking } from './boid-flocking';

// Frequency Visualizer
export { frequencyVisualizer } from './frequency-visualizer';

// Lissajous Curves
export { renderLissajousCurves, lissajousCurvesDefaultParams } from './lissajous-curves';
export type { LissajousCurvesParams } from './lissajous-curves';

// Spirograph
export { renderSpirograph, spirographDefaultParams } from './spirograph';
export type { SpirographParams } from './spirograph';

// Digital Weave
export { renderDigitalWeave, digitalWeaveDefaultParams } from './digital-weave';
export type { DigitalWeaveParams } from './digital-weave';

// String Art
export { renderStringArt, stringArtDefaultParams } from './string-art';
export type { StringArtParams } from './string-art';

// Phyllotaxis
export { renderPhyllotaxis, phyllotaxisDefaultParams } from './phyllotaxis';
export type { PhyllotaxisParams } from './phyllotaxis';

// Chladni Figures
export { renderChladniFigures, chladniDefaultParams } from './chladni-figures';
export type { ChladniParams } from './chladni-figures';

// Harmonograph
export { renderHarmonograph, harmonographDefaultParams } from './harmonograph';
export type { HarmonographParams } from './harmonograph';

// Metaballs
export { renderMetaballs, metaballsDefaultParams } from './metaballs';
export type { MetaballsParams } from './metaballs';

// Voxel Terrain
export { renderVoxelTerrain, voxelDefaultParams } from './voxel-terrain';
export type { VoxelParams } from './voxel-terrain';

// Polar Rose Garden
export { renderPolarRose, polarRoseDefaultParams } from './polar-rose';
export type { PolarRoseParams } from './polar-rose';

// Particle Constellation
export { particleConstellation } from './particle-constellation';

// 3D Wireframe Terrain
export { renderWireframeTerrain, wireframeTerrainDefaultParams } from './wireframe-terrain';
export type { WireframeTerrainParams } from './wireframe-terrain';

// Ray-Marched Scene
export { raymarchedScene } from './raymarched-scene';
export type { RaymarchedSceneParams } from './raymarched-scene';

// Mandelbulb
export { mandelbulbGenerator } from './mandelbulb-generator';
export type { MandelbulbParams } from './mandelbulb';

// Fourier Epicycles
export { renderEpicycles, epicycleDefaultParams } from './epicycles';
export type { EpicycleParams } from './epicycles';

// Möbius Strip
export { renderMobiusStrip, mobiusStripDefaultParams } from './mobius-strip';
export type { MobiusStripParams } from './mobius-strip';

// Shader Bloom
export { renderShaderBloom, shaderBloomDefaultParams } from './shader-bloom';
export type { ShaderBloomParams } from './shader-bloom';

// Cymatics Flow
export { renderCymaticsFlow, cymaticsDefaultParams } from './cymatics-flow';
export type { CymaticsParams } from './cymatics-flow';

// Kinetic Typography
export { renderKineticTypography, kineticTypographyDefaultParams } from './kinetic-typography';
export type { KineticTypographyParams } from './kinetic-typography';

// ASCII Art
export { renderAsciiArt, asciiArtDefaultParams } from './ascii-art';
export type { AsciiArtParams } from './ascii-art';

// Cross-Hatching
export { renderCrossHatching, crossHatchingDefaultParams } from './cross-hatching';
export type { CrossHatchingParams } from './cross-hatching';

// Moiré Patterns
export { renderMoire, moireDefaultParams } from './moire';
export type { MoireParams } from './moire';

// Stained Glass
export { renderStainedGlass, stainedGlassDefaultParams } from './stained-glass';
export type { StainedGlassParams } from './stained-glass';

// Fractal Flame
export { renderFractalFlame, fractalFlameDefaultParams } from './fractal-flame';
export type { FractalFlameParams } from './fractal-flame';

// Impossible Geometry
export { renderImpossibleGeometry, impossibleGeometryDefaultParams } from './impossible-geometry';
export type { ImpossibleGeometryParams } from './impossible-geometry';
