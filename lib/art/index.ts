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
