import { renderKineticPoetry } from "./kinetic-poetry";

export function renderKineticPoetryThumb(
  ctx: CanvasRenderingContext2D,
  params: Record<string, unknown> = {},
  time: number = 0
): void {
  // Thumbnail version with reduced complexity for faster rendering
  const thumbParams = {
    wordCount: 8,
    driftSpeed: 0.5,
    connectionDensity: 30,
    colorScheme: params.colorScheme || "twilight",
    theme: params.theme || "cosmos",
    animated: false,
  };
  
  renderKineticPoetry(ctx, thumbParams, time);
}

export default renderKineticPoetryThumb;
