import { ArtGenerator, ArtParams } from "./core";
import { renderLsystemFractals, LsystemFractalsParams } from "./lsystem-fractals";

export const lsystemFractals: ArtGenerator = {
  name: "L-System Fractal Flora",
  description: "Procedural fractal plants with seasonal color palettes and animated growth cycles",
  params: {
    iterations: {
      name: "Iterations",
      type: "range",
      min: 3,
      max: 6,
      step: 1,
      default: 5,
    },
    angle: {
      name: "Branch Angle",
      type: "range",
      min: 15,
      max: 40,
      step: 1,
      default: 25,
    },
    colorScheme: {
      name: "Season",
      type: "select",
      options: ["spring", "autumn", "winter", "neon"],
      default: "spring",
    },
  },
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const fractalParams: LsystemFractalsParams = {
      iterations: params.iterations as number,
      angle: params.angle as number,
      colorScheme: params.colorScheme as 'spring' | 'autumn' | 'winter' | 'neon',
    };
    
    renderLsystemFractals(ctx, width, height, time || 0, fractalParams);
  },
};
