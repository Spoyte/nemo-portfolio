import { ArtGenerator } from "./core";
import { renderMobiusStrip, mobiusStripDefaultParams } from "./mobius-strip";

export function renderMobiusStripThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderMobiusStrip(ctx, { 
    ...mobiusStripDefaultParams, 
    animated: false,
    segments: 40,  // Reduced for performance
    showWireframe: false,
    showSurface: true,
    colorScheme: "rainbow",
  }, time);
}

// ArtGenerator interface for thumbnail
export const mobiusStripThumb: ArtGenerator = {
  id: "mobius-strip-thumb",
  name: "Möbius Strip (Thumbnail)",
  category: "3d",
  render: (ctx, _params, time) => renderMobiusStripThumb(ctx, time),
  defaultParams: mobiusStripDefaultParams,
};

export default mobiusStripThumb;
