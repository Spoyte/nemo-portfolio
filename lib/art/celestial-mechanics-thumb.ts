import { ArtGenerator } from "./core";
import { renderCelestialMechanics, celestialMechanicsDefaultParams } from "./celestial-mechanics";

export function renderCelestialMechanicsThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderCelestialMechanics(ctx, { 
    ...celestialMechanicsDefaultParams, 
    animated: false,
    bodyCount: 4,
    trailLength: 40,
    showConnections: false,
  }, time);
}

// ArtGenerator interface for thumbnail
export const celestialMechanicsThumb: ArtGenerator = {
  id: "celestial-mechanics-thumb",
  name: "Celestial Mechanics (Thumbnail)",
  category: "geometric",
  render: (ctx, _params, time) => renderCelestialMechanicsThumb(ctx, time),
  defaultParams: celestialMechanicsDefaultParams,
};

export default celestialMechanicsThumb;
