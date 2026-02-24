import { ArtGenerator } from "./core";
import { renderLightCaverns, LightCavernsParams, lightCavernsDefaultParams } from "./light-caverns";

export const lightCaverns: ArtGenerator = {
  name: "Light Caverns",
  description: "Volumetric light rays through crystalline cave structures",
  params: {
    rayCount: {
      name: "Light Rays",
      type: "range",
      min: 4,
      max: 24,
      step: 1,
      default: 12,
    },
    cavernDepth: {
      name: "Cavern Depth",
      type: "range",
      min: 10,
      max: 90,
      step: 5,
      default: 50,
    },
    crystalDensity: {
      name: "Crystal Density",
      type: "range",
      min: 10,
      max: 80,
      step: 5,
      default: 40,
    },
    colorScheme: {
      name: "Crystal Type",
      type: "select",
      options: ["emerald", "amethyst", "sapphire", "amber"],
      default: "emerald",
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    renderLightCaverns(ctx, canvas.width, canvas.height, time, {
      rayCount: params.rayCount as number,
      cavernDepth: params.cavernDepth as number,
      crystalDensity: params.crystalDensity as number,
      colorScheme: params.colorScheme as LightCavernsParams["colorScheme"],
    });
  },
};

export { renderLightCaverns, lightCavernsDefaultParams } from "./light-caverns";
export type { LightCavernsParams } from "./light-caverns";
