import { ArtGenerator, ArtParams } from "./core";
import { renderParticleSwarm, ParticleSwarmParams } from "./particle-swarm";

export const particleSwarm: ArtGenerator = {
  name: "Particle Swarm",
  description: "Interactive flocking simulation with mouse attraction/repulsion",
  params: {
    particleCount: {
      name: "Particles",
      type: "range",
      min: 50,
      max: 500,
      step: 10,
      default: 200,
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 10,
      max: 150,
      step: 5,
      default: 50,
    },
    attraction: {
      name: "Mouse Behavior",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 50,
    },
    cohesion: {
      name: "Cohesion",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 30,
    },
    trail: {
      name: "Trail",
      type: "range",
      min: 0,
      max: 95,
      step: 1,
      default: 70,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["fire", "ocean", "neon", "monochrome"],
      default: "ocean",
    },
  },
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const swarmParams: ParticleSwarmParams = {
      particleCount: params.particleCount as number,
      speed: params.speed as number,
      attraction: params.attraction as number,
      cohesion: params.cohesion as number,
      trail: params.trail as number,
      colorScheme: params.colorScheme as 'fire' | 'ocean' | 'neon' | 'monochrome',
    };
    
    // For the gallery view, we don't have mouse interaction, so pass null
    renderParticleSwarm(ctx, 800, 600, (time || 0) / 1000, swarmParams, null, null);
  },
};
