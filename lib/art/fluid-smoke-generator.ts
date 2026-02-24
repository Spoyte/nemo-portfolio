import { ArtGenerator, ArtParams } from '@/lib/art/core';
import { renderFluidSmoke, fluidSmokeDefaultParams, FluidSmokeParams } from '@/lib/art/fluid-smoke';

export const fluidSmoke: ArtGenerator = {
  name: 'Fluid Smoke',
  description: 'Real-time fluid dynamics simulation with Navier-Stokes solver. Watch smoke, fire, or ink flow and swirl.',
  params: {
    viscosity: {
      name: 'Viscosity',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      default: 30,
    },
    diffusion: {
      name: 'Diffusion',
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      default: 20,
    },
    densitySource: {
      name: 'Source Strength',
      type: 'range',
      min: 10,
      max: 200,
      step: 5,
      default: 80,
    },
    colorScheme: {
      name: 'Color Scheme',
      type: 'select',
      options: ['fire', 'ink', 'neon', 'steam'],
      default: 'fire',
    },
  },
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const fluidParams: FluidSmokeParams = {
      viscosity: params.viscosity as number,
      diffusion: params.diffusion as number,
      densitySource: params.densitySource as number,
      colorScheme: params.colorScheme as FluidSmokeParams['colorScheme'],
    };
    renderFluidSmoke(ctx, width, height, (time || 0) / 1000, fluidParams);
  },
};

export function getStaticParams(): FluidSmokeParams {
  return {
    viscosity: 30,
    diffusion: 20,
    densitySource: 80,
    colorScheme: 'fire',
  };
}

export { renderFluidSmoke, fluidSmokeDefaultParams };
export type { FluidSmokeParams };
