import { ArtGenerator, ArtParams, SeededRandom, generateSeed } from "./core";
import { particleSwarm } from "./particle-swarm";

// Re-export for compatibility
export { particleSwarm };

// Legacy exports for backward compatibility
export interface ParticleSwarmParams {
  particleCount: number;
  speed: number;
  attraction: number;
  cohesion: number;
  trail: number;
  colorScheme: 'fire' | 'ocean' | 'neon' | 'monochrome';
  seed?: number;
}

export const particleSwarmDefaultParams: ParticleSwarmParams = {
  particleCount: 200,
  speed: 50,
  attraction: 50,
  cohesion: 30,
  trail: 70,
  colorScheme: 'ocean',
  seed: 1,
};

// Legacy render function - delegates to new ArtGenerator
export function renderParticleSwarm(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: ParticleSwarmParams,
  mouseX: number | null,
  mouseY: number | null
): void {
  // Set canvas dimensions if needed
  if (ctx.canvas.width !== width) ctx.canvas.width = width;
  if (ctx.canvas.height !== height) ctx.canvas.height = height;
  
  // Call the ArtGenerator generate method
  particleSwarm.generate(ctx, {
    ...params,
    seed: params.seed ?? generateSeed(),
  }, time * 1000);
}
