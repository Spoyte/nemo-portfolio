import { ArtGenerator } from "./core";
import { renderVolumetricText, VolumetricTextParams } from "./volumetric-text";

export const volumetricTextThumbDefaultParams: VolumetricTextParams = {
  text: "LIGHT",
  fontSize: 60,
  depth: 30,
  spread: 120,
  turbulence: 20,
  lightIntensity: 1.0,
  fogDensity: 30,
  colorScheme: "neon",
  animated: false,
};

export function renderVolumetricTextThumb(
  ctx: CanvasRenderingContext2D,
  params: Partial<VolumetricTextParams> = {},
  time: number = 0
): void {
  // Use the main renderer with static params for thumbnail
  renderVolumetricText(ctx, { ...volumetricTextThumbDefaultParams, ...params, animated: false }, 0);
}

export const volumetricTextThumb: ArtGenerator = {
  id: "volumetric-text-thumb",
  name: "Volumetric Text Thumbnail",
  category: "geometric",
  render: (ctx, params, time) => renderVolumetricTextThumb(ctx, params as VolumetricTextParams, time),
  defaultParams: volumetricTextThumbDefaultParams,
};

export default volumetricTextThumb;
