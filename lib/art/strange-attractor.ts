import { ArtGenerator, PixelRenderer } from "./core";

// Strange Attractor - Mathematical chaos as flowing particle trails
// Implements multiple attractor systems: Lorenz, Rössler, Aizawa, Thomas

interface AttractorParams {
  sigma: number;    // Lorenz: Prandtl number
  rho: number;      // Lorenz: Rayleigh number
  beta: number;     // Lorenz: geometric factor
  a: number;        // Rössler: growth rate
  b: number;        // Rössler: contraction
  c: number;        // Rössler: folding
}

type AttractorType = "lorenz" | "rossler" | "aizawa" | "thomas";

interface StrangeAttractorConfig {
  attractorType: AttractorType;
  particleCount: number;
  trailLength: number;
  speed: number;
  colorScheme: "fire" | "ocean" | "neon" | "gold";
  zoom: number;
  rotationSpeed: number;
}

const defaultConfig: StrangeAttractorConfig = {
  attractorType: "lorenz",
  particleCount: 2000,
  trailLength: 80,
  speed: 0.005,
  colorScheme: "fire",
  zoom: 12,
  rotationSpeed: 0.3,
};

function getAttractorParams(type: AttractorType): Partial<AttractorParams> {
  switch (type) {
    case "lorenz":
      return { sigma: 10, rho: 28, beta: 8 / 3 };
    case "rossler":
      return { a: 0.2, b: 0.2, c: 5.7 };
    case "aizawa":
      return { a: 0.95, b: 0.7, c: 0.6 };
    case "thomas":
      return { a: 0.1, b: 0.1, c: 0.1 };
    default:
      return {};
  }
}

function computeAttractor(
  x: number,
  y: number,
  z: number,
  type: AttractorType,
  params: Partial<AttractorParams>
): [number, number, number] {
  const dt = 0.01;
  let dx = 0, dy = 0, dz = 0;

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
      const d = 3.5, e = 0.25, f = 0.1;
      dx = (z - b) * x - d * y;
      dy = d * x + (z - b) * y;
      dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x);
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

function getColorScheme(scheme: string): Array<[number, number, number]> {
  const schemes: Record<string, Array<[number, number, number]>> = {
    fire: [
      [0, 0, 0],
      [40, 0, 0],
      [80, 0, 0],
      [120, 20, 0],
      [180, 40, 0],
      [220, 80, 0],
      [255, 120, 0],
      [255, 160, 20],
      [255, 200, 40],
      [255, 240, 80],
      [255, 255, 120],
    ],
    ocean: [
      [0, 0, 20],
      [0, 20, 40],
      [0, 40, 60],
      [0, 60, 100],
      [0, 80, 140],
      [20, 100, 160],
      [40, 140, 180],
      [60, 160, 200],
      [100, 180, 220],
      [140, 200, 240],
      [180, 220, 255],
    ],
    neon: [
      [10, 0, 20],
      [30, 0, 60],
      [60, 0, 100],
      [100, 0, 140],
      [140, 20, 180],
      [180, 40, 200],
      [200, 60, 220],
      [220, 100, 240],
      [240, 140, 255],
      [255, 180, 255],
      [255, 220, 255],
    ],
    gold: [
      [10, 5, 0],
      [30, 15, 0],
      [60, 30, 0],
      [100, 60, 0],
      [140, 90, 10],
      [180, 120, 20],
      [200, 150, 30],
      [220, 180, 40],
      [240, 200, 60],
      [250, 220, 80],
      [255, 240, 100],
    ],
  };
  return schemes[scheme] || schemes.fire;
}

export const strangeAttractor: ArtGenerator = {
  name: "Strange Attractor",
  description: "Chaotic particle trails from mathematical attractors (Lorenz, Rössler, Aizawa, Thomas)",
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
  },

  generate: (width: number, height: number, time: number, config: Partial<StrangeAttractorConfig> = {}) => {
    const cfg = { ...defaultConfig, ...config } as StrangeAttractorConfig;
    const params = getAttractorParams(cfg.attractorType);
    const colors = getColorScheme(cfg.colorScheme);
    
    // Initialize particles with slight random offsets
    const particles: Array<{ x: number; y: number; z: number; trail: Array<[number, number, number]> }> = [];
    
    // Seed particles around the attractor's typical region
    const seedOffset = cfg.attractorType === "lorenz" ? 10 : 1;
    for (let i = 0; i < cfg.particleCount; i++) {
      const angle = (i / cfg.particleCount) * Math.PI * 2;
      const radius = Math.random() * seedOffset;
      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * seedOffset * 2 - seedOffset,
        trail: [],
      });
    }

    // Simulate particles forward to build trails
    const simulationSteps = cfg.trailLength * 2;
    for (let step = 0; step < simulationSteps; step++) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const [nx, ny, nz] = computeAttractor(p.x, p.y, p.z, cfg.attractorType, params);
        p.x = nx;
        p.y = ny;
        p.z = nz;
        
        // Store trail point (only keep recent ones)
        if (step % 2 === 0) {
          p.trail.push([p.x, p.y, p.z]);
          if (p.trail.length > cfg.trailLength) {
            p.trail.shift();
          }
        }
      }
    }

    // Rotation angle based on time
    const rotAngle = time * cfg.rotationSpeed * 0.001;
    const cosR = Math.cos(rotAngle);
    const sinR = Math.sin(rotAngle);

    return (renderer: PixelRenderer) => {
      // Fade background slightly for trail effect
      for (let i = 0; i < renderer.pixels.length; i += 4) {
        renderer.pixels[i] = Math.max(0, renderer.pixels[i] - 3);
        renderer.pixels[i + 1] = Math.max(0, renderer.pixels[i + 1] - 3);
        renderer.pixels[i + 2] = Math.max(0, renderer.pixels[i + 2] - 3);
      }

      const cx = width / 2;
      const cy = height / 2;
      const zoom = cfg.zoom;

      // Draw particle trails
      for (const p of particles) {
        // Continue evolving particle
        const [nx, ny, nz] = computeAttractor(p.x, p.y, p.z, cfg.attractorType, params);
        p.x = nx;
        p.y = ny;
        p.z = nz;
        p.trail.push([p.x, p.y, p.z]);
        if (p.trail.length > cfg.trailLength) {
          p.trail.shift();
        }

        // Draw trail
        for (let i = 0; i < p.trail.length - 1; i++) {
          const [x1, y1, z1] = p.trail[i];
          const [x2, y2, z2] = p.trail[i + 1];

          // 3D rotation around Y axis
          const rx1 = x1 * cosR - z1 * sinR;
          const rz1 = x1 * sinR + z1 * cosR;
          const rx2 = x2 * cosR - z2 * sinR;
          const rz2 = x2 * sinR + z2 * cosR;

          // Project to 2D with perspective
          const perspective1 = 200 / (200 + rz1);
          const perspective2 = 200 / (200 + rz2);
          
          const px1 = Math.floor(cx + rx1 * zoom * perspective1);
          const py1 = Math.floor(cy + y1 * zoom * perspective1);
          const px2 = Math.floor(cx + rx2 * zoom * perspective2);
          const py2 = Math.floor(cy + y2 * zoom * perspective2);

          // Color based on position in trail and depth
          const trailProgress = i / p.trail.length;
          const depthFactor = Math.max(0, Math.min(1, (rz1 + 30) / 60));
          const colorIdx = Math.floor((trailProgress * 0.7 + depthFactor * 0.3) * (colors.length - 1));
          const [r, g, b] = colors[Math.max(0, Math.min(colors.length - 1, colorIdx))];
          
          // Alpha based on trail position
          const alpha = Math.floor(trailProgress * 200 + 55);

          // Draw line segment
          renderer.drawLine(px1, py1, px2, py2, r, g, b, alpha);
        }
      }
    };
  },
};
