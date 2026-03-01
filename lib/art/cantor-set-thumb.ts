import { ArtGenerator } from "./core";
import { renderCantorSet, cantorSetDefaultParams } from "./cantor-set";

export function renderCantorSetThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderCantorSet(ctx, { 
    ...cantorSetDefaultParams, 
    animated: false,
    iterations: 5,
    barHeight: 15,
    colorScheme: "fire"
  }, time);
}

// ArtGenerator interface for thumbnail
export const cantorSetThumb: ArtGenerator = {
  id: "cantor-set-thumb",
  name: "Cantor Set (Thumbnail)",
  category: "mathematical",
  render: (ctx, _params, time) => renderCantorSetThumb(ctx, time),
  defaultParams: cantorSetDefaultParams,
};

export default cantorSetThumb;
