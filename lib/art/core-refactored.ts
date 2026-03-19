/**
 * Core types for the generative art system
 * 
 * Principles (Dieter Rams-inspired):
 * - Less but better: Minimal, expressive types
 * - Thorough: Complete type safety throughout
 * - Consistent: One way to define parameters, one way to render
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/** Parameter values passed to generators */
export interface ArtParams {
  [key: string]: number | string | boolean;
}

/** Parameter definition for UI generation and validation */
export interface ParamConfig {
  type: "range" | "select" | "boolean" | "color" | "seed";
  default: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

// ============================================================================
// CATEGORIES & TAGS
// ============================================================================

export type ArtCategory =
  | "mathematical"
  | "natural"
  | "physics"
  | "geometric"
  | "abstract"
  | "traditional"
  | "3d"
  | "text"
  | "interactive";

export type ArtComplexity = "simple" | "moderate" | "complex" | "expert";

export type ArtTag =
  | "animated"
  | "static"
  | "monochrome"
  | "colorful"
  | "geometric"
  | "organic"
  | "chaotic"
  | "ordered"
  | "minimal"
  | "detailed"
  | "retro"
  | "futuristic"
  | "nature"
  | "abstract";

// ============================================================================
// GENERATOR INTERFACE
// ============================================================================

export interface ArtGeneratorMeta {
  category: ArtCategory;
  complexity: ArtComplexity;
  tags: ArtTag[];
  created: string; // ISO date
}

/**
 * The single, unified interface for all art generators.
 * 
 * Design decisions:
 * - `params` uses Record for type-safe parameter access
 * - `generate` receives resolved params (no Partial<> inside)
 * - `time` is optional for static pieces
 * - `meta` separates metadata from functionality
 */
export interface ArtGenerator {
  name: string;
  description: string;
  params: Record<string, ParamConfig>;
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => void;
  meta: ArtGeneratorMeta;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Helper for creating type-safe parameter defaults */
export type ParamDefaults<T extends Record<string, ParamConfig>> = {
  [K in keyof T]: T[K]["default"];
};

/** Canvas dimensions helper */
export interface CanvasSize {
  width: number;
  height: number;
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/** Parse hex color to RGB */
export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

/** Convert HSL to RGB */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
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

/** RGB to CSS string */
export function rgbToCss({ r, g, b }: RgbColor, alpha = 1): string {
  return alpha === 1 
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// MATH UTILITIES
// ============================================================================

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value to range */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Map value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Smooth step interpolation (Hermite) */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// ============================================================================
// CANVAS UTILITIES
// ============================================================================

/** Fill entire canvas with color */
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  height: number
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/** Clear canvas (transparent) */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/** Get canvas center point */
export function getCenter(ctx: CanvasRenderingContext2D): { x: number; y: number } {
  return { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };
}

/** Get minimum dimension (for responsive sizing) */
export function getMinDimension(ctx: CanvasRenderingContext2D): number {
  return Math.min(ctx.canvas.width, ctx.canvas.height);
}

// ============================================================================
// RANDOM UTILITIES
// ============================================================================

/** Seeded random number generator (Mulberry32) */
export function createSeededRandom(seed: number): () => number {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate a random seed */
export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

// ============================================================================
// BACKWARD COMPATIBILITY (Deprecated - migrate away)
// ============================================================================

/** @deprecated Use ParamConfig instead */
export type ParamDef = ParamConfig;

/** @deprecated Use ArtParams instead */
export interface ArtCanvas {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
}

/** @deprecated Use hslToRgb instead */
export const hslToRgb_deprecated = hslToRgb;
