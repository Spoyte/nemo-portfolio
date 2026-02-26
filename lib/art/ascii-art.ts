import type { P5CanvasInstance } from "@p5-wrapper/react";
import { seededRandom } from "./seeded-random";

export interface AsciiArtParams {
  pattern: "matrix" | "waves" | "spiral" | "noise" | "gradient" | "circles" | "fractal";
  charSet: "standard" | "blocks" | "binary" | "math" | "braille" | "emoji";
  colorMode: "monochrome" | "gradient" | "rainbow" | "heatmap" | "matrix";
  density: number; // 0.1 to 1.0
  symmetry: number; // 1 to 8 (rotational symmetry)
  speed: number; // animation speed
  invert: boolean;
  fontSize: number; // 8 to 24
}

export const asciiArtDefaultParams: AsciiArtParams = {
  pattern: "matrix",
  charSet: "standard",
  colorMode: "matrix",
  density: 0.8,
  symmetry: 1,
  speed: 1,
  invert: false,
  fontSize: 14,
};

// Character sets ordered by density (dark to light)
const CHAR_SETS: Record<string, string[]> = {
  standard: ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "],
  blocks: ["█", "▓", "▒", "░", " "],
  binary: ["1", "1", "0", "0", "0", " "],
  math: ["∑", "∫", "√", "π", "∞", "≈", "≠", "≤", "≥", " "],
  braille: ["⣿", "⣶", "⣤", "⣄", "⡀", " "],
  emoji: ["🌕", "🌖", "🌗", "🌘", "🌑", " "],
};

// Get character based on value (0-1)
function getChar(value: number, chars: string[]): string {
  const index = Math.floor(value * (chars.length - 1));
  return chars[Math.max(0, Math.min(chars.length - 1, index))];
}

// Get color based on mode and value
function getColor(
  p5: P5CanvasInstance,
  mode: string,
  value: number,
  x: number,
  y: number,
  time: number,
  invert: boolean
): [number, number, number] {
  let r: number, g: number, b: number;

  switch (mode) {
    case "matrix":
      r = 0;
      g = Math.floor(100 + value * 155);
      b = Math.floor(value * 50);
      break;
    case "rainbow":
      const hue = (value * 360 + time * 50) % 360;
      p5.colorMode(p5.HSB);
      const c = p5.color(hue, 80, 90);
      p5.colorMode(p5.RGB);
      r = p5.red(c);
      g = p5.green(c);
      b = p5.blue(c);
      break;
    case "heatmap":
      // Blue (cold) to red (hot)
      r = Math.floor(value * 255);
      g = Math.floor((1 - Math.abs(value - 0.5) * 2) * 255);
      b = Math.floor((1 - value) * 255);
      break;
    case "gradient":
      // Purple to cyan gradient
      r = Math.floor(100 + value * 100);
      g = Math.floor(value * 200);
      b = Math.floor(200 - value * 100);
      break;
    default: // monochrome
      const v = Math.floor(value * 255);
      r = g = b = v;
  }

  if (invert) {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
  }

  return [r, g, b];
}

// Pattern functions
function getPatternValue(
  pattern: string,
  x: number,
  y: number,
  time: number,
  p5: P5CanvasInstance
): number {
  const normalizedX = x / 400;
  const normalizedY = y / 400;

  switch (pattern) {
    case "matrix":
      // Falling code effect
      const col = Math.floor(x / 10);
      const row = Math.floor(y / 10);
      const fallSpeed = (col * 137.5 + time * 2) % 50;
      const brightness = Math.sin(row * 0.5 - fallSpeed) > 0 ? 1 : 0.3;
      return brightness * (1 - Math.abs(Math.sin(col * 0.5 + time)) * 0.5);

    case "waves":
      // Interference waves
      const wave1 = Math.sin(x * 0.05 + time);
      const wave2 = Math.sin(y * 0.05 + time * 1.3);
      const wave3 = Math.sin((x + y) * 0.03 + time * 0.7);
      return (wave1 + wave2 + wave3 + 3) / 6;

    case "spiral":
      // Spiral pattern
      const centerX = 200;
      const centerY = 200;
      const dx = x - centerX;
      const dy = y - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spiral = Math.sin(dist * 0.1 - angle * 2 + time);
      return (spiral + 1) / 2;

    case "noise":
      // Perlin noise
      p5.noiseSeed(42);
      return p5.noise(x * 0.01, y * 0.01, time * 0.5);

    case "gradient":
      // Diagonal gradient with animation
      return ((normalizedX + normalizedY) / 2 + Math.sin(time) * 0.2 + 1) % 1;

    case "circles":
      // Concentric circles
      const cx = 200;
      const cy = 200;
      const cdist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      return (Math.sin(cdist * 0.1 - time * 2) + 1) / 2;

    case "fractal":
      // Simple fractal-like pattern
      let fx = normalizedX * 4;
      let fy = normalizedY * 4;
      let iter = 0;
      const maxIter = 20;
      while (iter < maxIter && fx * fx + fy * fy < 4) {
        const xtemp = fx * fx - fy * fy + normalizedX;
        fy = 2 * fx * fy + normalizedY;
        fx = xtemp;
        iter++;
      }
      return iter / maxIter;

    default:
      return 0.5;
  }
}

// Apply rotational symmetry
function applySymmetry(
  x: number,
  y: number,
  symmetry: number,
  centerX: number,
  centerY: number
): [number, number] {
  if (symmetry <= 1) return [x, y];

  const dx = x - centerX;
  const dy = y - centerY;
  const angle = Math.atan2(dy, dx);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Fold into symmetric sector
  const sectorAngle = (Math.PI * 2) / symmetry;
  const foldedAngle = angle % sectorAngle;

  const newX = centerX + Math.cos(foldedAngle) * dist;
  const newY = centerY + Math.sin(foldedAngle) * dist;

  return [newX, newY];
}

export function renderAsciiArt(
  p5: P5CanvasInstance,
  params: AsciiArtParams = asciiArtDefaultParams
): void {
  const time = p5.millis() / 1000 * params.speed;
  const chars = CHAR_SETS[params.charSet];
  const bgColor = params.invert ? 255 : 0;

  p5.background(bgColor);
  p5.textFont("monospace");
  p5.textSize(params.fontSize);
  p5.textAlign(p5.CENTER, p5.CENTER);

  const cols = Math.floor(400 / (params.fontSize * 0.6));
  const rows = Math.floor(400 / params.fontSize);
  const cellWidth = 400 / cols;
  const cellHeight = 400 / rows;

  // Pre-calculate pattern values for symmetry
  const patternCache: number[][] = [];
  for (let row = 0; row < rows; row++) {
    patternCache[row] = [];
    for (let col = 0; col < cols; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      const [sx, sy] = applySymmetry(x, y, params.symmetry, 200, 200);
      patternCache[row][col] = getPatternValue(params.pattern, sx, sy, time, p5);
    }
  }

  // Render characters
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = patternCache[row][col];

      // Apply density threshold
      if (value < 1 - params.density) continue;

      const normalizedValue = (value - (1 - params.density)) / params.density;
      const char = getChar(normalizedValue, chars);
      const [r, g, b] = getColor(p5, params.colorMode, normalizedValue, col, row, time, params.invert);

      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;

      p5.fill(r, g, b);
      p5.noStroke();
      p5.text(char, x, y);
    }
  }
}

// Generator object for the art system
export const asciiArtGenerator = {
  id: "ascii-art",
  name: "ASCII Art",
  description: "Generative text patterns using characters arranged by mathematical algorithms",
  defaultParams: asciiArtDefaultParams,
  render: renderAsciiArt,
  paramConfig: {
    pattern: {
      type: "select",
      options: [
        { value: "matrix", label: "Matrix Rain" },
        { value: "waves", label: "Interference Waves" },
        { value: "spiral", label: "Spiral" },
        { value: "noise", label: "Perlin Noise" },
        { value: "gradient", label: "Gradient" },
        { value: "circles", label: "Concentric Circles" },
        { value: "fractal", label: "Fractal" },
      ],
      label: "Pattern",
    },
    charSet: {
      type: "select",
      options: [
        { value: "standard", label: "Standard (@#%*)" },
        { value: "blocks", label: "Blocks (█▓▒░)" },
        { value: "binary", label: "Binary (10)" },
        { value: "math", label: "Math Symbols" },
        { value: "braille", label: "Braille" },
        { value: "emoji", label: "Moon Phases" },
      ],
      label: "Character Set",
    },
    colorMode: {
      type: "select",
      options: [
        { value: "monochrome", label: "Monochrome" },
        { value: "gradient", label: "Purple-Cyan" },
        { value: "rainbow", label: "Rainbow" },
        { value: "heatmap", label: "Heatmap" },
        { value: "matrix", label: "Matrix Green" },
      ],
      label: "Color Mode",
    },
    density: {
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.1,
      label: "Density",
    },
    symmetry: {
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      label: "Symmetry",
    },
    speed: {
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      label: "Animation Speed",
    },
    fontSize: {
      type: "range",
      min: 8,
      max: 24,
      step: 2,
      label: "Font Size",
    },
    invert: {
      type: "boolean",
      label: "Invert Colors",
    },
  },
};
