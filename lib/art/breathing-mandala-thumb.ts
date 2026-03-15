import { ArtGenerator } from "./core";
import { breathingMandala } from "./breathing-mandala";

export function renderBreathingMandalaThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  // Thumbnail-optimized: static snapshot, reduced complexity
  breathingMandala.generate(ctx, { 
    palette: "ocean",
    breathSpeed: 0,
    layers: 4,
    particles: 15,
    showSacredGeometry: 1,
    seed: 42,
  }, 0);
}

export const breathingMandalaThumb: ArtGenerator = {
  id: "breathing-mandala-thumb",
  name: "Breathing Mandala (Thumbnail)",
  category: "geometric",
  params: {},
  render: (ctx, _params, time) => renderBreathingMandalaThumb(ctx, time),
  defaultParams: {},
};

export default breathingMandalaThumb;
