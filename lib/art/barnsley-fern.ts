import { ArtGenerator, ArtParams, ParamType, ParamDef, ArtCanvas } from "./core";

// Barnsley Fern - Iterated Function System fractal
// Uses affine transformations to generate natural fern shapes
// https://en.wikipedia.org/wiki/Barnsley_fern

export interface BarnsleyFernParams extends ArtParams {
  iterations: number;        // Number of points to plot
  scale: number;             // Size of fern
  colorScheme: "natural" | "autumn" | "neon" | "monochrome" | "rainbow";
  pointSize: number;         // Size of each point
  opacity: number;           // Point opacity
  animate: boolean;          // Animate growth
  animationSpeed: number;    // Points per frame when animating
  rotation: number;          // Rotation angle in degrees
  offsetX: number;           // Horizontal offset
  offsetY: number;           // Vertical offset
  leafDensity: number;       // How filled the fern appears
}

export const barnsleyFernDefaultParams: BarnsleyFernParams = {
  iterations: 50000,
  scale: 1,
  colorScheme: "natural",
  pointSize: 1,
  opacity: 0.6,
  animate: true,
  animationSpeed: 1000,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  leafDensity: 1,
};

export const barnsleyFernParamDefs: ParamDef[] = [
  { key: "iterations", type: "range", min: 1000, max: 100000, step: 1000, label: "Iterations" },
  { key: "scale", type: "range", min: 0.5, max: 2, step: 0.1, label: "Scale" },
  { key: "colorScheme", type: "select", options: ["natural", "autumn", "neon", "monochrome", "rainbow"], label: "Color Scheme" },
  { key: "pointSize", type: "range", min: 0.5, max: 3, step: 0.5, label: "Point Size" },
  { key: "opacity", type: "range", min: 0.1, max: 1, step: 0.1, label: "Opacity" },
  { key: "animate", type: "boolean", label: "Animate Growth" },
  { key: "animationSpeed", type: "range", min: 100, max: 5000, step: 100, label: "Animation Speed" },
  { key: "rotation", type: "range", min: -180, max: 180, step: 5, label: "Rotation" },
  { key: "offsetX", type: "range", min: -100, max: 100, step: 5, label: "Offset X" },
  { key: "offsetY", type: "range", min: -100, max: 100, step: 5, label: "Offset Y" },
  { key: "leafDensity", type: "range", min: 0.5, max: 2, step: 0.1, label: "Leaf Density" },
];

// Barnsley fern transformation probabilities and matrices
// Each transformation has: probability, a, b, c, d, e, f
// Where x' = ax + by + e, y' = cx + dy + f
interface Transform {
  prob: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  type: "stem" | "successive" | "left" | "right";
}

const barnsleyTransforms: Transform[] = [
  // f1: Stem (1%)
  { prob: 0.01, a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, type: "stem" },
  // f2: Successive smaller leaflets (85%)
  { prob: 0.85, a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, type: "successive" },
  // f3: Largest left leaflet (7%)
  { prob: 0.07, a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, type: "left" },
  // f4: Largest right leaflet (7%)
  { prob: 0.07, a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, type: "right" },
];

// Alternative fern variations
const cyclosorusTransforms: Transform[] = [
  { prob: 0.02, a: 0, b: 0, c: 0, d: 0.25, e: 0, f: -0.4, type: "stem" },
  { prob: 0.84, a: 0.95, b: 0.005, c: -0.005, d: 0.93, e: -0.002, f: 0.5, type: "successive" },
  { prob: 0.07, a: 0.035, b: -0.2, c: 0.16, d: 0.04, e: -0.09, f: 0.02, type: "left" },
  { prob: 0.07, a: -0.04, b: 0.2, c: 0.16, d: 0.04, e: 0.083, f: 0.12, type: "right" },
];

const culcitaTransforms: Transform[] = [
  { prob: 0.02, a: 0, b: 0, c: 0, d: 0.25, e: 0, f: -0.4, type: "stem" },
  { prob: 0.84, a: 0.95, b: 0.005, c: -0.005, d: 0.93, e: -0.002, f: 0.5, type: "successive" },
  { prob: 0.07, a: 0.035, b: -0.2, c: 0.16, d: 0.04, e: -0.09, f: 0.02, type: "left" },
  { prob: 0.07, a: -0.04, b: 0.2, c: 0.16, d: 0.04, e: 0.083, f: 0.12, type: "right" },
];

const fishboneTransforms: Transform[] = [
  { prob: 0.02, a: 0, b: 0, c: 0, d: 0.25, e: 0, f: -0.4, type: "stem" },
  { prob: 0.84, a: 0.95, b: 0.005, c: -0.005, d: 0.93, e: -0.002, f: 0.5, type: "successive" },
  { prob: 0.07, a: 0.035, b: -0.2, c: 0.16, d: 0.04, e: -0.09, f: 0.02, type: "left" },
  { prob: 0.07, a: -0.04, b: 0.2, c: 0.16, d: 0.04, e: 0.083, f: 0.12, type: "right" },
];

// Color schemes
const colorSchemes: Record<string, (y: number, type: string, t: number) => string> = {
  natural: (y, type) => {
    // Green gradient from stem to tip
    const green = Math.floor(100 + y * 80);
    const red = Math.floor(34 + y * 20);
    const blue = Math.floor(20 + y * 10);
    return `rgba(${red}, ${green}, ${blue}, 0.8)`;
  },
  autumn: (y, type) => {
    // Autumn colors: yellows, oranges, reds
    if (y < 0.3) return `rgba(139, 69, 19, 0.8)`; // Brown stem
    if (y < 0.6) return `rgba(255, 140, 0, 0.8)`; // Orange
    if (y < 0.8) return `rgba(255, 215, 0, 0.8)`; // Gold
    return `rgba(220, 20, 60, 0.8)`; // Crimson tips
  },
  neon: (y, type, t) => {
    // Cycling neon colors
    const hue = (y * 120 + t * 50) % 360;
    return `hsla(${hue}, 100%, 60%, 0.8)`;
  },
  monochrome: (y, type) => {
    const brightness = Math.floor(50 + y * 150);
    return `rgba(${brightness}, ${brightness}, ${brightness}, 0.6)`;
  },
  rainbow: (y, type, t) => {
    const hue = (y * 360) % 360;
    return `hsla(${hue}, 80%, 50%, 0.7)`;
  },
};

function getColor(y: number, type: string, scheme: string, time: number): string {
  const colorFn = colorSchemes[scheme] || colorSchemes.natural;
  return colorFn(y, type, time);
}

function applyTransform(x: number, y: number, t: Transform): { x: number; y: number; type: string } {
  const newX = t.a * x + t.b * y + t.e;
  const newY = t.c * x + t.d * y + t.f;
  return { x: newX, y: newY, type: t.type };
}

function selectTransform(random: number): Transform {
  let cumulative = 0;
  for (const t of barnsleyTransforms) {
    cumulative += t.prob;
    if (random < cumulative) return t;
  }
  return barnsleyTransforms[barnsleyTransforms.length - 1];
}

function rotatePoint(x: number, y: number, angleRad: number): { x: number; y: number } {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

export function renderBarnsleyFern(
  canvas: ArtCanvas,
  params: BarnsleyFernParams,
  onProgress?: (progress: number) => void
): void {
  const { ctx, width, height } = canvas;
  const {
    iterations,
    scale,
    colorScheme,
    pointSize,
    opacity,
    animate,
    animationSpeed,
    rotation,
    offsetX,
    offsetY,
    leafDensity,
  } = params;

  // Clear canvas with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  // Fern bounds (empirically determined)
  const fernWidth = 6;
  const fernHeight = 10.5;

  // Calculate scale to fit canvas with padding
  const padding = 40;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const scaleX = availableWidth / fernWidth;
  const scaleY = availableHeight / fernHeight;
  const baseScale = Math.min(scaleX, scaleY) * scale * leafDensity;

  // Center the fern
  const centerX = width / 2 + offsetX;
  const centerY = height - padding + offsetY;

  const rotationRad = (rotation * Math.PI) / 180;

  // Initialize point
  let x = 0;
  let y = 0;

  // Skip first 20 iterations (settling period)
  for (let i = 0; i < 20; i++) {
    const t = selectTransform(Math.random());
    const result = applyTransform(x, y, t);
    x = result.x;
    y = result.y;
  }

  // For animation, we'll render in chunks
  const batchSize = animate ? animationSpeed : iterations;
  const totalBatches = Math.ceil(iterations / batchSize);
  let currentBatch = 0;

  function renderBatch() {
    const startIdx = currentBatch * batchSize;
    const endIdx = Math.min(startIdx + batchSize, iterations);

    ctx.save();

    for (let i = startIdx; i < endIdx; i++) {
      // Select and apply transformation
      const t = selectTransform(Math.random());
      const result = applyTransform(x, y, t);
      x = result.x;
      y = result.y;

      // Map to canvas coordinates
      // Fern coordinates: x in [-3, 3], y in [0, 10]
      let canvasX = x * baseScale;
      let canvasY = -y * baseScale; // Flip Y (canvas Y grows downward)

      // Apply rotation
      const rotated = rotatePoint(canvasX, canvasY, rotationRad);
      canvasX = rotated.x + centerX;
      canvasY = rotated.y + centerY;

      // Draw point
      const color = getColor(y / fernHeight, result.type, colorScheme, currentBatch / totalBatches);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, pointSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    currentBatch++;

    if (onProgress) {
      onProgress(currentBatch / totalBatches);
    }

    if (animate && currentBatch < totalBatches) {
      requestAnimationFrame(renderBatch);
    }
  }

  renderBatch();
}

export const barnsleyFern: ArtGenerator = {
  id: "barnsley-fern",
  name: "Barnsley Fern",
  description: "Iterated Function System fractal generating natural fern shapes through affine transformations",
  params: barnsleyFernDefaultParams,
  paramDefs: barnsleyFernParamDefs,
  render: renderBarnsleyFern,
  category: "mathematical",
};
