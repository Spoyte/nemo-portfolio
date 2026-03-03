import { ArtGenerator } from "./core";
import { renderMoebiusStrip, moebiusStripDefaultParams } from "./moebius-strip";

export function renderMoebiusStripThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderMoebiusStrip(ctx, { 
    ...moebiusStripDefaultParams, 
    animated: false,
    density: 30,  // Reduced for performance
    complexity: "simple"
  }, time);
}

// ArtGenerator interface for thumbnail
export const moebiusStripThumb: ArtGenerator = {
  id: "moebius-strip-thumb",
  name: "Moebius Strip (Thumbnail)",
  category: "3d",
  render: (ctx, _params, time) => renderMoebiusStripThumb(ctx, time),
  defaultParams: moebiusStripDefaultParams,
};

export default moebiusStripThumb;
