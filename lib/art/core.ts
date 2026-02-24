// Core types for generative art system
export interface ArtParams {
  [key: string]: number | string;
}

// Re-export seeded random utilities for convenience
export { SeededRandom, generateSeed, createSeededNoise } from "./seeded-random";

export interface ParamConfig {
  name: string;
  type: "range" | "select";
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: number | string;
}

export interface ArtGenerator {
  name: string;
  description: string;
  params: Record<string, ParamConfig>;
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => void;
}

// Utility: Fill canvas with color
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  height: number
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

// Utility: Parse hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Utility: HSL to RGB conversion
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

// Utility: Simplex-like noise function
export function createNoise() {
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = Math.floor(Math.random() * 256);
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    return lerp(
      v,
      lerp(u, grad(perm[A], x, y), grad(perm[B], x - 1, y)),
      lerp(u, grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1))
    );
  };
}

// Utility: Draw to ImageData with pixel sampling
export function renderPixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelFn: (x: number, y: number) => { r: number; g: number; b: number; a?: number },
  sampleSize: number = 2
): void {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      const { r, g, b, a = 255 } = pixelFn(x, y);

      for (let dy = 0; dy < sampleSize && y + dy < height; dy++) {
        for (let dx = 0; dx < sampleSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = a;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Color palettes
export const COLOR_PALETTES: Record<string, string[]> = {
  ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#b3f0ff", "#004080"],
  sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569", "#2c003e"],
  forest: ["#2d5016", "#3a6b1f", "#4a8b2c", "#7cb342", "#aed581", "#1b3d0d"],
  monochrome: ["#0a0a0a", "#2a2a2a", "#4a4a4a", "#6a6a6a", "#8a8a8a", "#aaaaaa"],
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00", "#8000ff"],
};
