/**
 * Strange Attractor — Elegant Chaotic Trajectories
 * 
 * Visualizes four classic chaotic systems:
 * - Lorenz: The butterfly effect, atmospheric convection
 * - Rössler: Chemical reactions, continuous chaos
 * - Aizawa: Strange attractor with toroidal structure
 * - Thomas: Cyclic symmetry, ghostly loops
 * 
 * Refactored to use clean, Rams-like interface.
 */

import { ArtGenerator, ArtParams, ParamConfig, hslToRgb, getCenter, getMinDimension } from "./core-refactored";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

type AttractorType = "lorenz" | "rossler" | "aizawa" | "thomas";
type ColorScheme = "fire" | "ocean" | "neon" | "gold";

interface AttractorDefinition {
  name: string;
  params: Record<string, number>;
  dt: number;
  scale: number;
  offsetY: number;
  colorBase: number;
  warmup: number;
  iterations: number;
}

// ============================================================================
// ATTRACTOR DEFINITIONS
// ============================================================================

const ATTRACTORS: Record<AttractorType, AttractorDefinition> = {
  lorenz: {
    name: "Lorenz",
    params: { sigma: 10, rho: 28, beta: 8 / 3 },
    dt: 0.005,
    scale: 12,
    offsetY: -25,
    colorBase: 280,
    warmup: 1000,
    iterations: 15000,
  },
  rossler: {
    name: "Rössler",
    params: { a: 0.2, b: 0.2, c: 5.7 },
    dt: 0.01,
    scale: 25,
    offsetY: 10,
    colorBase: 200,
    warmup: 1000,
    iterations: 12000,
  },
  aizawa: {
    name: "Aizawa",
    params: { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1 },
    dt: 0.01,
    scale: 180,
    offsetY: 0,
    colorBase: 320,
    warmup: 1000,
    iterations: 10000,
  },
  thomas: {
    name: "Thomas",
    params: { b: 0.208186 },
    dt: 0.05,
    scale: 35,
    offsetY: 0,
    colorBase: 160,
    warmup: 1000,
    iterations: 15000,
  },
};

const COLOR_OFFSETS: Record<ColorScheme, number> = {
  fire: 0,
  ocean: -60,
  neon: 40,
  gold: -120,
};

// ============================================================================
// PARAMETER DEFINITIONS
// ============================================================================

const PARAMS: Record<string, ParamConfig> = {
  attractorType: {
    type: "select",
    default: "lorenz",
    options: ["lorenz", "rossler", "aizawa", "thomas"],
  },
  colorScheme: {
    type: "select",
    default: "fire",
    options: ["fire", "ocean", "neon", "gold"],
  },
  rotationX: {
    type: "range",
    default: 0.3,
    min: -1,
    max: 1,
    step: 0.1,
  },
  rotationY: {
    type: "range",
    default: 0.5,
    min: 0,
    max: 6.28,
    step: 0.1,
  },
  seed: {
    type: "seed",
    default: 42,
  },
};

// ============================================================================
// PHYSICS SIMULATION
// ============================================================================

function stepAttractor(
  x: number,
  y: number,
  z: number,
  type: AttractorType,
  cfg: AttractorDefinition
): [number, number, number] {
  const { params, dt } = cfg;

  switch (type) {
    case "lorenz": {
      const dx = params.sigma * (y - x);
      const dy = x * (params.rho - z) - y;
      const dz = x * y - params.beta * z;
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
    case "rossler": {
      const dx = -y - z;
      const dy = x + params.a * y;
      const dz = params.b + z * (x - params.c);
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
    case "aizawa": {
      const dx = (z - params.b) * x - params.d * y;
      const dy = params.d * x + (z - params.b) * y;
      const dz =
        params.c +
        params.a * z -
        (z * z * z) / 3 -
        (x * x + y * y) * (1 + params.e * z) +
        params.f * z * (x * x * x);
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
    case "thomas": {
      const dx = Math.sin(y) - params.b * x;
      const dy = Math.sin(z) - params.b * y;
      const dz = Math.sin(x) - params.b * z;
      return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
  }
}

function rotate3D(
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number
): [number, number, number] {
  const y1 = y * Math.cos(rx) - z * Math.sin(rx);
  const z1 = y * Math.sin(rx) + z * Math.cos(rx);
  const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
  const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  return [x2, y1, z2];
}

// ============================================================================
// RENDERING
// ============================================================================

function generateTrajectory(
  attractorType: AttractorType,
  rotationX: number,
  rotationY: number
): Array<{ x: number; y: number; z: number }> {
  const attractor = ATTRACTORS[attractorType];
  const points: Array<{ x: number; y: number; z: number }> = [];
  let [x, y, z] = [0.1, 0, 0];

  // Warm up to reach attractor
  for (let i = 0; i < attractor.warmup; i++) {
    [x, y, z] = stepAttractor(x, y, z, attractorType, attractor);
  }

  // Collect points
  for (let i = 0; i < attractor.iterations; i++) {
    [x, y, z] = stepAttractor(x, y, z, attractorType, attractor);
    const [rx, ry, rz] = rotate3D(x, y, z, rotationX, rotationY);
    points.push({ x: rx, y: ry, z: rz });
  }

  return points;
}

function calculateBounds(points: Array<{ x: number; y: number; z: number }>) {
  let [minX, maxX, minY, maxY, minZ, maxZ] = [
    Infinity, -Infinity,
    Infinity, -Infinity,
    Infinity, -Infinity,
  ];

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }

  return {
    minX, maxX, minY, maxY, minZ, maxZ,
    rangeX: maxX - minX || 1,
    rangeY: maxY - minY || 1,
    rangeZ: maxZ - minZ || 1,
  };
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  g: number,
  b: number,
  alpha: number
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  ctx.stroke();
}

function generate(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  _time?: number
): void {
  const attractorType = params.attractorType as AttractorType;
  const colorScheme = params.colorScheme as ColorScheme;
  const rotationX = params.rotationX as number;
  const rotationY = params.rotationY as number;

  const attractor = ATTRACTORS[attractorType];
  const { width, height } = ctx.canvas;
  const center = getCenter(ctx);
  const minDim = getMinDimension(ctx);

  // Generate trajectory
  const points = generateTrajectory(attractorType, rotationX, rotationY);
  const bounds = calculateBounds(points);

  // Calculate scale
  const scale = attractor.scale * minDim * 0.001;
  const cx = center.x;
  const cy = center.y + attractor.offsetY * (height / 800);

  // Clear with dark background
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, width, height);

  // Draw trajectory with depth-based coloring
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];

    // Normalize to canvas space
    const x1 = cx + ((p1.x - bounds.minX) / bounds.rangeX - 0.5) * scale * width;
    const y1 = cy + ((p1.y - bounds.minY) / bounds.rangeY - 0.5) * scale * height;
    const x2 = cx + ((p2.x - bounds.minX) / bounds.rangeX - 0.5) * scale * width;
    const y2 = cy + ((p2.y - bounds.minY) / bounds.rangeY - 0.5) * scale * height;

    // Depth-based color
    const zNorm = (p2.z - bounds.minZ) / bounds.rangeZ;
    const progress = i / points.length;
    const hue = (attractor.colorBase + COLOR_OFFSETS[colorScheme] + zNorm * 60 + progress * 30) % 360;
    const sat = 70 + zNorm * 20;
    const light = 40 + zNorm * 30;
    const alpha = 0.3 + zNorm * 0.5;

    const rgb = hslToRgb(hue, sat, light);
    drawLine(ctx, x1, y1, x2, y2, rgb.r, rgb.g, rgb.b, alpha);
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export const strangeAttractor: ArtGenerator = {
  name: "Strange Attractor",
  description: "Elegant chaotic trajectories — Lorenz, Rössler, Aizawa, Thomas",
  params: PARAMS,
  generate,
  meta: {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "colorful", "chaotic", "geometric"],
    created: "2026-03-12",
  },
};

export default strangeAttractor;
