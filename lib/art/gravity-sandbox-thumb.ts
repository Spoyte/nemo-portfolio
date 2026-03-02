import { ArtGenerator } from "./core";
import { 
  renderGravitySandbox, 
  gravitySandboxDefaultParams,
  resetGravitySandbox 
} from "./gravity-sandbox";

// Thumbnail variant - static, simplified rendering
export function renderGravitySandboxThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Reset to ensure consistent state
  resetGravitySandbox();
  
  // Render with static settings optimized for thumbnail
  renderGravitySandbox(ctx, {
    ...gravitySandboxDefaultParams,
    particleCount: 6,
    showTrails: false,
    showConnections: true,
    animated: false,
    colorScheme: "cosmic",
  }, 0);
}

export const gravitySandboxThumb: ArtGenerator = {
  id: "gravity-sandbox-thumb",
  name: "Gravity Sandbox (Thumbnail)",
  category: "interactive",
  render: (ctx, _params, time) => renderGravitySandboxThumb(ctx, time),
  defaultParams: { ...gravitySandboxDefaultParams, animated: false },
};

export default gravitySandboxThumb;
