import { ArtGenerator } from "./core";
import { renderHypercube, hypercubeDefaultParams } from "./hypercube";

export function renderHypercubeThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderHypercube(ctx, { 
    ...hypercubeDefaultParams, 
    animated: true,
    rotationSpeedX: 0.3,
    rotationSpeedY: 0.5,
    rotationSpeedZ: 0.2,
    lineWidth: 1.5,
    colorScheme: "neon",
  }, time);
}

// ArtGenerator interface for thumbnail
export const hypercubeThumb: ArtGenerator = {
  id: "hypercube-thumb",
  name: "Hypercube (Thumbnail)",
  category: "3d",
  render: (ctx, _params, time) => renderHypercubeThumb(ctx, time),
  defaultParams: hypercubeDefaultParams,
};

export default hypercubeThumb;
