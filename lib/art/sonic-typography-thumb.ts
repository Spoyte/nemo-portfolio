import { ArtGenerator } from "./core";
import { renderSonicTypography, sonicTypographyDefaultParams } from "./sonic-typography";

export function renderSonicTypographyThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Thumbnail version - optimized for gallery display
  renderSonicTypography(ctx, { 
    ...sonicTypographyDefaultParams, 
    animated: true,
    waveIntensity: 60,
    frequency: 10,
    speed: 1.5,
    particleSize: 20,
    trail: false
  }, time);
}

// ArtGenerator interface for thumbnail
export const sonicTypographyThumb: ArtGenerator = {
  id: "sonic-typography-thumb",
  name: "Sonic Typography (Thumbnail)",
  category: "text",
  render: (ctx, _params, time) => renderSonicTypographyThumb(ctx, time),
  defaultParams: sonicTypographyDefaultParams,
};

export default sonicTypographyThumb;
