import { ArtGenerator } from "./core";
import { renderSonicBloom, sonicBloomDefaultParams } from "./sonic-bloom";

export function renderSonicBloomThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Simplified version for thumbnails - static, faster rendering
  renderSonicBloom(ctx, { 
    ...sonicBloomDefaultParams, 
    simulatedAudio: true,
    numFlowers: 3,
    petalCount: 6,
    bloomSize: 80,
    growthSpeed: 0.5,
    colorScheme: "sunset",
    petalStyle: "smooth",
    showStems: false,
    glowIntensity: 0.4,
    beatTempo: 100,
  }, time);
}

// ArtGenerator interface for thumbnail
export const sonicBloomThumb: ArtGenerator = {
  id: "sonic-bloom-thumb",
  name: "Sonic Bloom (Thumbnail)",
  category: "interactive",
  render: (ctx, _params, time) => renderSonicBloomThumb(ctx, time),
  defaultParams: sonicBloomDefaultParams,
};

export default sonicBloomThumb;
