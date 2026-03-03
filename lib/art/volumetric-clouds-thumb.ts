import { renderVolumetricClouds, VolumetricCloudsParams } from "./volumetric-clouds";

// Thumbnail version with reduced quality for performance
export function renderVolumetricCloudsThumb(
  ctx: CanvasRenderingContext2D,
  params: Partial<VolumetricCloudsParams> = {},
  time: number = 0
): void {
  // Force lower density and no animation for thumbnails
  const thumbParams = {
    ...params,
    density: 40,
    animated: false,
    coverage: 0.5,
  };
  
  renderVolumetricClouds(ctx, thumbParams, 0);
}

export default renderVolumetricCloudsThumb;
