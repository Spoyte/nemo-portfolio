import { ArtGenerator, PixelRenderer, SeededRandom } from "./core";

// --- Types ---

interface AttractorParams {
  sigma: number;
  rho: number;
  beta: number;
  a: number;
  b: number;
  c: number;
}

type AttractorType = "lorenz" | "rossler" | "aizawa" | "thomas";
type ColorScheme = "fire" | "ocean" | "neon" | "gold";

interface StrangeAttractorConfig {
  attractorType: AttractorType;
  particleCount: number;
  trailLength: number;
  speed: number;
  colorScheme: ColorScheme;
  zoom: number;
  rotationSpeed: number;
  seed: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  trail: Float32Array;
  trailIndex: number;
  trailCount: number;
}

// --- Constants ---

const DEFAULT_CONFIG: StrangeAttractorConfig = {
  attractorType: "lorenz",
  particleCount: 2000,
  trailLength: 80,
  speed: 0.005,
  colorScheme: "fire",
  zoom: 12,
  rotationSpeed: 0.3,
  seed: 1,
};

const ATTRACTOR_PARAMS: Record<AttractorType, Partial<AttractorParams>> = {
  lorenz: { sigma: 10, rho: 28, beta: 8 / 3 },
  rossler: { a: 0.2, b: 0.2, c: 5.7 },
  aizawa: { a: 0.95, b: 0.7, c: 0.6 },
  thomas: { a: 0.1, b: 0.1, c: 0.1 },
};

// Pre-computed color palettes (RGB triplets)
const COLOR_PALETTES: Record<ColorScheme, Uint8Array> = {
  fire: new Uint8Array([
    0, 0, 0, 40, 0, 0, 80, 0, 0, 120, 20, 0, 180, 40, 0, 220, 80, 0, 255, 120, 0,
    255, 160, 20, 255, 200, 40, 255, 240, 80, 255, 255, 120,
  ]),
  ocean: new Uint8Array([
    0, 0, 20, 0, 20, 40, 0, 40, 60, 0, 60, 100, 0, 80, 140, 20, 100, 160, 40, 140,
    180, 60, 160, 200, 100, 180, 220, 140, 200, 240, 180, 220, 255,
  ]),
  neon: new Uint8Array([
    10, 0, 20, 30, 0, 60, 60, 0, 100, 100, 0, 140, 140, 20, 180, 180, 40, 200, 200,
    60, 220, 220, 100, 240, 240, 140, 255, 255, 180, 255, 255, 220, 255,
  ]),
  gold: new Uint8Array([
    10, 5, 0, 30, 15, 0, 60, 30, 0, 100, 60, 0, 140, 90, 10, 180, 120, 20, 200, 150,
    30, 220, 180, 40, 240, 200, 60, 250, 220, 80, 255, 240, 100,
  ]),
};

const PALETTE_SIZE = 11;

// --- Physics ---

function computeAttractor(
  x: number,
  y: number,
  z: number,
  type: AttractorType,
  params: Partial<AttractorParams>
): [number, number, number] {
  const dt = 0.01;
  let dx = 0,
    dy = 0,
    dz = 0;

  switch (type) {
    case "lorenz": {
      const { sigma = 10, rho = 28, beta = 8 / 3 } = params;
      dx = sigma * (y - x);
      dy = x * (rho - z) - y;
      dz = x * y - beta * z;
      break;
    }
    case "rossler": {
      const { a = 0.2, b = 0.2, c = 5.7 } = params;
      dx = -y - z;
      dy = x + a * y;
      dz = b + z * (x - c);
      break;
    }
    case "aizawa": {
      const { a = 0.95, b = 0.7, c = 0.6 } = params;
      const d = 3.5,
        e = 0.25,
        f = 0.1;
      dx = (z - b) * x - d * y;
      dy = d * x + (z - b) * y;
      dz =
        c +
        a * z -
        (z * z * z) / 3 -
        (x * x + y * y) * (1 + e * z) +
        f * z * (x * x * x);
      break;
    }
    case "thomas": {
      const { a = 0.1 } = params;
      dx = Math.sin(y) - a * x;
      dy = Math.sin(z) - a * y;
      dz = Math.sin(x) - a * z;
      break;
    }
  }

  return [x + dx * dt, y + dy * dt, z + dz * dt];
}

function initializeParticles(
  count: number,
  seed: number,
  attractorType: AttractorType,
  trailLength: number
): Particle[] {
  const rng = new SeededRandom(seed);
  const particles: Particle[] = [];
  const seedOffset = attractorType === "lorenz" ? 10 : 1;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = rng.random() * seedOffset;
    particles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: rng.random() * seedOffset * 2 - seedOffset,
      trail: new Float32Array(trailLength * 3),
      trailIndex: 0,
      trailCount: 0,
    });
  }

  return particles;
}

function warmUpParticles(
  particles: Particle[],
  attractorType: AttractorType,
  params: Partial<AttractorParams>,
  steps: number
): void {
  for (let step = 0; step < steps; step++) {
    for (const p of particles) {
      const [nx, ny, nz] = computeAttractor(p.x, p.y, p.z, attractorType, params);
      p.x = nx;
      p.y = ny;
      p.z = nz;
    }
  }
}

// --- Generator ---

export const strangeAttractor: ArtGenerator = {
  name: "Strange Attractor",
  description:
    "Chaotic particle trails from mathematical attractors (Lorenz, Rössler, Aizawa, Thomas) (seeded)",

  config: {
    attractorType: {
      type: "select",
      default: "lorenz",
      options: ["lorenz", "rossler", "aizawa", "thomas"],
    },
    particleCount: {
      type: "range",
      default: 2000,
      min: 500,
      max: 5000,
      step: 100,
    },
    trailLength: {
      type: "range",
      default: 80,
      min: 20,
      max: 150,
      step: 10,
    },
    speed: {
      type: "range",
      default: 0.005,
      min: 0.001,
      max: 0.02,
      step: 0.001,
    },
    colorScheme: {
      type: "select",
      default: "fire",
      options: ["fire", "ocean", "neon", "gold"],
    },
    zoom: {
      type: "range",
      default: 12,
      min: 5,
      max: 25,
      step: 1,
    },
    rotationSpeed: {
      type: "range",
      default: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
    },
    seed: {
      type: "range",
      default: 1,
      min: 1,
      max: 10000,
      step: 1,
    },
  },

  generate: (
    width: number,
    height: number,
    time: number,
    config: Partial<StrangeAttractorConfig> = {}
  ) => {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const params = ATTRACTOR_PARAMS[cfg.attractorType];
    const palette = COLOR_PALETTES[cfg.colorScheme];

    // Initialize particles
    const particles = initializeParticles(
      cfg.particleCount,
      cfg.seed,
      cfg.attractorType,
      cfg.trailLength
    );

    // Warm up to get on the attractor
    warmUpParticles(particles, cfg.attractorType, params, cfg.trailLength * 2);

    // Precompute constants
    const cx = width / 2;
    const cy = height / 2;
    const zoom = cfg.zoom;
    const trailLength = cfg.trailLength;
    const perspectiveDistance = 200;

    return (renderer: PixelRenderer) => {
      // Fade background
      const pixels = renderer.pixels;
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = Math.max(0, pixels[i] - 3);
        pixels[i + 1] = Math.max(0, pixels[i + 1] - 3);
        pixels[i + 2] = Math.max(0, pixels[i + 2] - 3);
      }

      // Rotation
      const rotAngle = time * cfg.rotationSpeed * 0.001;
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);

      // Draw particles
      for (const p of particles) {
        // Evolve particle
        const [nx, ny, nz] = computeAttractor(p.x, p.y, p.z, cfg.attractorType, params);
        p.x = nx;
        p.y = ny;
        p.z = nz;

        // Store in circular trail buffer
        const idx = p.trailIndex * 3;
        p.trail[idx] = p.x;
        p.trail[idx + 1] = p.y;
        p.trail[idx + 2] = p.z;
        p.trailIndex = (p.trailIndex + 1) % trailLength;
        if (p.trailCount < trailLength) p.trailCount++;

        // Draw trail segments
        const count = p.trailCount;
        if (count < 2) continue;

        for (let i = 0; i < count - 1; i++) {
          // Get trail points (handle circular buffer)
          const idx1 = ((p.trailIndex - count + i + trailLength) % trailLength) * 3;
          const idx2 = ((p.trailIndex - count + i + 1 + trailLength) % trailLength) * 3;

          const x1 = p.trail[idx1];
          const y1 = p.trail[idx1 + 1];
          const z1 = p.trail[idx1 + 2];
          const x2 = p.trail[idx2];
          const y2 = p.trail[idx2 + 1];
          const z2 = p.trail[idx2 + 2];

          // 3D rotation around Y axis
          const rx1 = x1 * cosR - z1 * sinR;
          const rz1 = x1 * sinR + z1 * cosR;
          const rx2 = x2 * cosR - z2 * sinR;
          const rz2 = x2 * sinR + z2 * cosR;

          // Perspective projection
          const persp1 = perspectiveDistance / (perspectiveDistance + rz1);
          const persp2 = perspectiveDistance / (perspectiveDistance + rz2);

          const px1 = Math.floor(cx + rx1 * zoom * persp1);
          const py1 = Math.floor(cy + y1 * zoom * persp1);
          const px2 = Math.floor(cx + rx2 * zoom * persp2);
          const py2 = Math.floor(cy + y2 * zoom * persp2);

          // Color from palette based on trail position and depth
          const trailProgress = i / (count - 1);
          const depthFactor = Math.max(0, Math.min(1, (rz1 + 30) / 60));
          const colorIdx = Math.floor(
            (trailProgress * 0.7 + depthFactor * 0.3) * (PALETTE_SIZE - 1)
          );
          const safeIdx = Math.max(0, Math.min(PALETTE_SIZE - 1, colorIdx));
          const r = palette[safeIdx * 3];
          const g = palette[safeIdx * 3 + 1];
          const b = palette[safeIdx * 3 + 2];

          // Alpha based on trail position
          const alpha = Math.floor(trailProgress * 200 + 55);

          renderer.drawLine(px1, py1, px2, py2, r, g, b, alpha);
        }
      }
    };
  },
};
