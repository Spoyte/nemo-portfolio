import { ArtGenerator } from "./core";
import { renderChromaticAberration, chromaticAberrationDefaultParams } from "./chromatic-aberration";

export function renderChromaticAberrationThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderChromaticAberration(ctx, { 
    ...chromaticAberrationDefaultParams, 
    animated: false,
    density: 30,  // Reduced for performance
    complexity: "simple"
  }, time);
}

// ArtGenerator interface for thumbnail
export const chromaticAberrationThumb: ArtGenerator = {
  id: "chromatic-aberration-thumb",
  name: "Chromatic Aberration (Thumbnail)",
  category: "abstract",
  render: (ctx, _params, time) => renderChromaticAberrationThumb(ctx, time),
  defaultParams: chromaticAberrationDefaultParams,
};

export default chromaticAberrationThumb;
