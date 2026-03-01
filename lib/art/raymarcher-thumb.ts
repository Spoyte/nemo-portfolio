import { ArtGenerator, ArtParams } from "./core";
import { generate } from "./raymarcher";

// Thumbnail version - static, lower quality for performance
function generateThumb(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
): void {
  generate(ctx, {
    density: 30,
    speed: 0,
    colorScheme: "neon",
    shape: "torus",
    shadows: false,
    animated: false,
  }, 0);
}

// Parameter definitions (simplified for thumbnail)
const params = {
  density: {
    name: "Density",
    type: "range",
    min: 30,
    max: 30,
    step: 1,
    default: 30,
  },
};

export const raymarcherThumb: ArtGenerator = {
  name: "Raymarcher (Thumbnail)",
  description: "SDF-based raymarching - thumbnail version",
  params,
  generate: generateThumb,
  meta: {
    category: "3d",
    complexity: "expert",
    tags: ["static", "futuristic"],
    created: "2026-03-02",
  },
};

export default raymarcherThumb;
