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
};

export * from "./core";
