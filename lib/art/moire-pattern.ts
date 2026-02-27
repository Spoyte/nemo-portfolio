import { ArtGenerator, ArtPiece } from "./core";
import { SeededRandom } from "./seeded-random";

// Control type enum for UI controls
enum ControlType {
  SLIDER = "slider",
  SELECT = "select",
}

export interface MoirePatternParams {
  basePattern: "lines" | "circles" | "grid" | "radial" | "spiral";
  overlayPattern: "lines" | "circles" | "grid" | "radial" | "spiral";
  baseDensity: number; // 10-100
  overlayDensity: number; // 10-100
  baseAngle: number; // 0-180
  overlayAngle: number; // 0-180
  animationSpeed: number; // 0-5
  colorScheme: "monochrome" | "rainbow" | "ocean" | "sunset" | "matrix";
  lineWidth: number; // 0.5-5
  opacity: number; // 0.1-1.0
  blendMode: "normal" | "multiply" | "screen" | "overlay" | "difference";
}

const defaultParams: MoirePatternParams = {
  basePattern: "lines",
  overlayPattern: "lines",
  baseDensity: 40,
  overlayDensity: 42,
  baseAngle: 0,
  overlayAngle: 5,
  animationSpeed: 0.5,
  colorScheme: "monochrome",
  lineWidth: 1,
  opacity: 0.8,
  blendMode: "normal",
};

const COLOR_SCHEMES: Record<string, string[]> = {
  monochrome: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
  rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
  ocean: ["#001F3F", "#0074D9", "#7FDBFF", "#39CCCC", "#2ECC40"],
  sunset: ["#FF4136", "#FF851B", "#FFDC00", "#F012BE", "#B10DC9"],
  matrix: ["#00FF00", "#003300", "#006600", "#009900", "#00CC00"],
};

function getBlendMode(mode: string): GlobalCompositeOperation {
  const modes: Record<string, GlobalCompositeOperation> = {
    normal: "source-over",
    multiply: "multiply",
    screen: "screen",
    overlay: "overlay",
    difference: "difference",
  };
  return modes[mode] || "source-over";
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: string,
  density: number,
  angle: number,
  width: number,
  height: number,
  time: number,
  colors: string[],
  lineWidth: number,
  opacity: number
) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);

  const spacing = Math.max(2, 200 / density);
  const diagonal = Math.sqrt(width * width + height * height);
  const startOffset = -diagonal / 2;
  const endOffset = diagonal / 2;

  ctx.globalAlpha = opacity;
  ctx.lineWidth = lineWidth;

  switch (pattern) {
    case "lines":
      for (let i = startOffset; i < endOffset; i += spacing) {
        const colorIndex = Math.floor(Math.abs(i / spacing)) % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(i + width / 2, 0);
        ctx.lineTo(i + width / 2, height);
        ctx.stroke();
      }
      break;

    case "circles":
      const maxRadius = diagonal;
      for (let r = spacing; r < maxRadius; r += spacing) {
        const colorIndex = Math.floor(r / spacing) % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r + Math.sin(time * 0.001) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;

    case "grid":
      // Vertical lines
      for (let i = startOffset; i < endOffset; i += spacing) {
        const colorIndex = Math.floor(Math.abs(i / spacing)) % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(i + width / 2, 0);
        ctx.lineTo(i + width / 2, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let i = startOffset; i < endOffset; i += spacing) {
        const colorIndex = Math.floor(Math.abs(i / spacing) + 1) % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(0, i + height / 2);
        ctx.lineTo(width, i + height / 2);
        ctx.stroke();
      }
      break;

    case "radial":
      const numRays = Math.floor(density * 0.5);
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + time * 0.0005;
        const colorIndex = i % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(
          width / 2 + Math.cos(angle) * diagonal,
          height / 2 + Math.sin(angle) * diagonal
        );
        ctx.stroke();
      }
      break;

    case "spiral":
      const spirals = 3;
      for (let s = 0; s < spirals; s++) {
        const colorIndex = s % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.beginPath();
        const spiralOffset = (s / spirals) * Math.PI * 2;
        for (let t = 0; t < diagonal * 2; t += 0.5) {
          const angle = t * 0.1 + spiralOffset + time * 0.0003;
          const r = t * 0.3;
          const x = width / 2 + Math.cos(angle) * r;
          const y = height / 2 + Math.sin(angle) * r;
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      break;
  }

  ctx.restore();
}

export const moirePattern: ArtGenerator = {
  name: "Moiré Pattern",
  description:
    "Optical interference patterns created by overlapping geometric patterns. Slight misalignments produce mesmerizing emergent visuals.",
  params: defaultParams,
  paramConfig: {
    basePattern: {
      type: ControlType.SELECT,
      label: "Base Pattern",
      options: [
        { value: "lines", label: "Parallel Lines" },
        { value: "circles", label: "Concentric Circles" },
        { value: "grid", label: "Grid" },
        { value: "radial", label: "Radial Rays" },
        { value: "spiral", label: "Spiral" },
      ],
    },
    overlayPattern: {
      type: ControlType.SELECT,
      label: "Overlay Pattern",
      options: [
        { value: "lines", label: "Parallel Lines" },
        { value: "circles", label: "Concentric Circles" },
        { value: "grid", label: "Grid" },
        { value: "radial", label: "Radial Rays" },
        { value: "spiral", label: "Spiral" },
      ],
    },
    baseDensity: {
      type: ControlType.SLIDER,
      label: "Base Density",
      min: 10,
      max: 100,
      step: 1,
    },
    overlayDensity: {
      type: ControlType.SLIDER,
      label: "Overlay Density",
      min: 10,
      max: 100,
      step: 1,
    },
    baseAngle: {
      type: ControlType.SLIDER,
      label: "Base Angle",
      min: 0,
      max: 180,
      step: 1,
    },
    overlayAngle: {
      type: ControlType.SLIDER,
      label: "Overlay Angle",
      min: 0,
      max: 180,
      step: 1,
    },
    animationSpeed: {
      type: ControlType.SLIDER,
      label: "Animation Speed",
      min: 0,
      max: 5,
      step: 0.1,
    },
    colorScheme: {
      type: ControlType.SELECT,
      label: "Color Scheme",
      options: [
        { value: "monochrome", label: "Monochrome" },
        { value: "rainbow", label: "Rainbow" },
        { value: "ocean", label: "Ocean" },
        { value: "sunset", label: "Sunset" },
        { value: "matrix", label: "Matrix" },
      ],
    },
    lineWidth: {
      type: ControlType.SLIDER,
      label: "Line Width",
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    opacity: {
      type: ControlType.SLIDER,
      label: "Opacity",
      min: 0.1,
      max: 1.0,
      step: 0.05,
    },
    blendMode: {
      type: ControlType.SELECT,
      label: "Blend Mode",
      options: [
        { value: "normal", label: "Normal" },
        { value: "multiply", label: "Multiply" },
        { value: "screen", label: "Screen" },
        { value: "overlay", label: "Overlay" },
        { value: "difference", label: "Difference" },
      ],
    },
  },

  generate: (ctx: CanvasRenderingContext2D, params: MoirePatternParams, seed: number): ArtPiece => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const rng = new SeededRandom(seed);
    const colors = COLOR_SCHEMES[params.colorScheme];

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Draw base pattern
    drawPattern(
      ctx,
      params.basePattern,
      params.baseDensity,
      params.baseAngle,
      width,
      height,
      0,
      colors,
      params.lineWidth,
      params.opacity
    );

    // Draw overlay pattern with blend mode
    ctx.globalCompositeOperation = getBlendMode(params.blendMode);
    drawPattern(
      ctx,
      params.overlayPattern,
      params.overlayDensity,
      params.overlayAngle,
      width,
      height,
      0,
      colors,
      params.lineWidth,
      params.opacity
    );

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";

    return {
      bounds: { x: 0, y: 0, width, height },
    };
  },

  animate: (
    ctx: CanvasRenderingContext2D,
    params: MoirePatternParams,
    seed: number,
    time: number
  ): ArtPiece => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const colors = COLOR_SCHEMES[params.colorScheme];

    // Animated angle offset
    const timeOffset = time * params.animationSpeed * 0.01;
    const animatedBaseAngle = params.baseAngle + timeOffset;
    const animatedOverlayAngle = params.overlayAngle - timeOffset * 0.7;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Draw base pattern
    drawPattern(
      ctx,
      params.basePattern,
      params.baseDensity,
      animatedBaseAngle,
      width,
      height,
      time,
      colors,
      params.lineWidth,
      params.opacity
    );

    // Draw overlay pattern with blend mode
    ctx.globalCompositeOperation = getBlendMode(params.blendMode);
    drawPattern(
      ctx,
      params.overlayPattern,
      params.overlayDensity,
      animatedOverlayAngle,
      width,
      height,
      time,
      colors,
      params.lineWidth,
      params.opacity
    );

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";

    return {
      bounds: { x: 0, y: 0, width, height },
    };
  },
};
