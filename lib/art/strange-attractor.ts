import { ArtGenerator, PixelRenderer, SeededRandom } from "./core";

// --- Types ---

type AttractorType = "lorenz" | "rossler" | "aizawa" | "thomas";
type ColorScheme = "fire" | "ocean" | "neon" | "gold";

interface AttractorConfig {
  name: string;
  params: Record<string, number>;
  dt: number;
  scale: number;
  offsetY: number;
  colorBase: number;
  warmup: number;
  iterations: number;
}

interface StrangeAttractorParams {
  attractorType: AttractorType;
  colorScheme: ColorScheme;
  rotationX: number;
  rotationY: number;
  seed: number;
}

// --- Constants ---

const ATTRACTORS: Record<AttractorType, AttractorConfig> = {
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

const DEFAULT_PARAMS: StrangeAttractorParams = {
  attractorType: "lorenz",
  colorScheme: "fire",
  rotationX: 0.3,
  rotationY: 0.5,
  seed: 42,
};

// --- Physics ---

function stepAttractor(
  x: number,
  y: number,
  z: number,
  type: AttractorType,
  cfg: AttractorConfig
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

// --- Generator ---

export const strangeAttractor: ArtGenerator = {
  name: "Strange Attractor",
  description: "Elegant chaotic trajectories — Lorenz, Rössler, Aizawa, Thomas",

  config: {
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
      type: "range",
      default: 42,
      min: 1,
      max: 10000,
      step: 1,
    },
  },

  generate: (
    width: number,
    height: number,
    _time: number,
    config: Partial<StrangeAttractorParams> = {}
  ) => {
    const cfg = { ...DEFAULT_PARAMS, ...config };
    const attractor = ATTRACTORS[cfg.attractorType];

    // Generate trajectory points
    const points: Array<{ x: number; y: number; z: number }> = [];
    let [x, y, z] = [0.1, 0, 0];

    // Warm up to reach attractor
    for (let i = 0; i < attractor.warmup; i++) {
      [x, y, z] = stepAttractor(x, y, z, cfg.attractorType, attractor);
    }

    // Collect points
    for (let i = 0; i < attractor.iterations; i++) {
      [x, y, z] = stepAttractor(x, y, z, cfg.attractorType, attractor);
      const [rx, ry, rz] = rotate3D(x, y, z, cfg.rotationX, cfg.rotationY);
      points.push({ x: rx, y: ry, z: rz });
    }

    // Find bounds
    let [minX, maxX, minY, maxY, minZ, maxZ] = [
      Infinity,
      -Infinity,
      Infinity,
      -Infinity,
      Infinity,
      -Infinity,
    ];
    for (const p of points) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
      minZ = Math.min(minZ, p.z);
      maxZ = Math.max(maxZ, p.z);
    }

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const rangeZ = maxZ - minZ || 1;

    return (renderer: PixelRenderer) => {
      const { pixels } = renderer;
      const scale = attractor.scale * Math.min(width, height) * 0.001;
      const cx = width / 2;
      const cy = height / 2 + attractor.offsetY * (height / 800);

      // Clear with dark gradient
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 5;
        pixels[i + 1] = 5;
        pixels[i + 2] = 8;
        pixels[i + 3] = 255;
      }

      // Draw trajectory with depth-based coloring
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        // Normalize to canvas space
        const x1 = cx + ((p1.x - minX) / rangeX - 0.5) * scale * width;
        const y1 = cy + ((p1.y - minY) / rangeY - 0.5) * scale * height;
        const x2 = cx + ((p2.x - minX) / rangeX - 0.5) * scale * width;
        const y2 = cy + ((p2.y - minY) / rangeY - 0.5) * scale * height;

        // Depth-based color
        const zNorm = (p2.z - minZ) / rangeZ;
        const progress = i / points.length;
        const hue =
          (attractor.colorBase + COLOR_OFFSETS[cfg.colorScheme] + zNorm * 60 + progress * 30) %
          360;
        const sat = 70 + zNorm * 20;
        const light = 40 + zNorm * 30;
        const alpha = 0.3 + zNorm * 0.5;

        // HSL to RGB
        const c = (1 - Math.abs((2 * light) / 100 - 1)) * (sat / 100);
        const x_ = ((hue / 60) % 2) - 1;
        const m = light / 100 - c / 2;
        const [r1, g1, b1] =
          hue < 60
            ? [c, c * x_, 0]
            : hue < 120
              ? [c * (1 - x_), c, 0]
              : hue < 180
                ? [0, c, c * x_]
                : hue < 240
                  ? [0, c * (1 - x_), c]
                  : hue < 300
                    ? [c * x_, 0, c]
                    : [c, 0, c * (1 - x_)];

        const r = Math.floor((r1 + m) * 255);
        const g = Math.floor((g1 + m) * 255);
        const b = Math.floor((b1 + m) * 255);

        renderer.drawLine(x1, y1, x2, y2, r, g, b, Math.floor(alpha * 255));
      }
    };
  },
};
