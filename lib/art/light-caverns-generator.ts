import { ArtGenerator, ArtPiece } from "./core";
import { renderLightCaverns, LightCavernsParams, lightCavernsDefaultParams } from "./light-caverns";

// Control type enum for UI controls
enum ControlType {
  SLIDER = "slider",
  SELECT = "select",
}

export const lightCaverns: ArtGenerator = {
  name: "Light Caverns",
  description: "Volumetric light rays through crystalline cave structures",
  params: lightCavernsDefaultParams,
  paramConfig: {
    rayCount: {
      type: ControlType.SLIDER,
      label: "Light Rays",
      min: 4,
      max: 24,
      step: 1,
    },
    cavernDepth: {
      type: ControlType.SLIDER,
      label: "Cavern Depth",
      min: 10,
      max: 90,
      step: 5,
    },
    crystalDensity: {
      type: ControlType.SLIDER,
      label: "Crystal Density",
      min: 10,
      max: 80,
      step: 5,
    },
    colorScheme: {
      type: ControlType.SELECT,
      label: "Crystal Type",
      options: [
        { value: "emerald", label: "Emerald" },
        { value: "amethyst", label: "Amethyst" },
        { value: "sapphire", label: "Sapphire" },
        { value: "amber", label: "Amber" },
      ],
    },
  },
  generate: (ctx, params): ArtPiece => {
    const canvas = ctx.canvas;
    renderLightCaverns(ctx, canvas.width, canvas.height, 0, {
      rayCount: params.rayCount as number,
      cavernDepth: params.cavernDepth as number,
      crystalDensity: params.crystalDensity as number,
      colorScheme: params.colorScheme as LightCavernsParams["colorScheme"],
    });
    return { bounds: { x: 0, y: 0, width: canvas.width, height: canvas.height } };
  },
  animate: (ctx, params, _seed, time): ArtPiece => {
    const canvas = ctx.canvas;
    renderLightCaverns(ctx, canvas.width, canvas.height, time, {
      rayCount: params.rayCount as number,
      cavernDepth: params.cavernDepth as number,
      crystalDensity: params.crystalDensity as number,
      colorScheme: params.colorScheme as LightCavernsParams["colorScheme"],
    });
    return { bounds: { x: 0, y: 0, width: canvas.width, height: canvas.height } };
  },
};

export { renderLightCaverns, lightCavernsDefaultParams } from "./light-caverns";
export type { LightCavernsParams } from "./light-caverns";
