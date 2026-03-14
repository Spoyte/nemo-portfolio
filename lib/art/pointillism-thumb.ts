import { ArtGenerator } from "./core";
import { renderPointillism, pointillismDefaultParams } from "./pointillism";

export function renderPointillismThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderPointillism(ctx, { 
    ...pointillismDefaultParams, 
    animated: false,
    dotDensity: 30,  // Reduced for performance
    dotSize: 2.5,
  }, time);
}

// ArtGenerator interface for thumbnail
export const pointillismThumb: ArtGenerator = {
  id: "pointillism-thumb",
  name: "Pointillism (Thumbnail)",
  category: "traditional",
  render: (ctx, _params, time) => renderPointillismThumb(ctx, time),
  defaultParams: pointillismDefaultParams,
};

export default pointillismThumb;
