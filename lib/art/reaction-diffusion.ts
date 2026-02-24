import { ArtGenerator, PixelRenderer, createNoise } from "./core";

// Reaction-Diffusion - Turing patterns simulating natural pattern formation
// Approximates Gray-Scott model behavior using noise-based synthesis

interface ReactionDiffusionConfig {
  pattern: "spots" | "stripes" | "labyrinth" | "coral";
  scale: number;
  speed: number;
  intensity: number;
  colorScheme: "zebra" | "coral" | "leopard" | "microscopic" | "fire" | "neon" | "ocean" | "heatmap";
}

const defaultConfig: ReactionDiffusionConfig = {
  pattern: "coral",
  scale: 1.0,
  speed: 0.5,
  intensity: 0.7,
  colorScheme: "coral",
};

function getPatternParams(pattern: string): { feed: number; kill: number; scale: number } {
  switch (pattern) {
    case "spots":
      return { feed: 0.035, kill: 0.06, scale: 2.5 };
    case "stripes":
      return { feed: 0.03, kill: 0.055, scale: 3.0 };
    case "labyrinth":
      return { feed: 0.029, kill: 0.057, scale: 2.0 };
    case "coral":
      return { feed: 0.054, kill: 0.063, scale: 1.5 };
    default:
      return { feed: 0.04, kill: 0.06, scale: 2.0 };
  }
}

function getColorScheme(scheme: string): Array<[number, number, number]> {
  const schemes: Record<string, Array<[number, number, number]>> = {
    zebra: [
      [10, 10, 10],
      [40, 40, 40],
      [80, 80, 80],
      [140, 140, 140],
      [200, 200, 200],
      [255, 255, 255],
    ],
    coral: [
      [30, 15, 20],
      [80, 40, 50],
      [140, 70, 90],
      [200, 100, 120],
      [255, 160, 140],
      [255, 220, 200],
    ],
    leopard: [
      [40, 30, 20],
      [100, 70, 40],
      [160, 120, 70],
      [200, 160, 100],
      [240, 200, 140],
      [255, 240, 220],
    ],
    microscopic: [
      [15, 30, 50],
      [40, 80, 120],
      [80, 140, 180],
      [120, 180, 220],
      [180, 220, 255],
    ],
    fire: [
      [20, 5, 0],
      [60, 10, 0],
      [120, 30, 0],
      [180, 60, 10],
      [220, 120, 20],
      [255, 200, 60],
    ],
    neon: [
      [20, 0, 40],
      [60, 0, 100],
      [120, 20, 160],
      [180, 40, 200],
      [220, 100, 240],
      [255, 200, 255],
    ],
    ocean: [
      [0, 10, 30],
      [0, 40, 80],
      [0, 80, 140],
      [20, 140, 180],
      [100, 180, 220],
      [200, 230, 255],
    ],
    heatmap: [
      [30, 10, 40],
      [80, 20, 60],
      [140, 40, 40],
      [200, 80, 20],
      [255, 160, 40],
      [255, 255, 120],
    ],
  };
  return schemes[scheme] || schemes.coral;
}

// Pseudo-random hash for deterministic noise
function hash2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43758.5453) * 43758.5453;
  return n - Math.floor(n);
}

// Smooth value noise
function smoothNoise(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xf = x - x0;
  const yf = y - y0;
  
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  
  const n00 = hash2D(x0, y0, seed);
  const n01 = hash2D(x0, y0 + 1, seed);
  const n10 = hash2D(x0 + 1, y0, seed);
  const n11 = hash2D(x0 + 1, y0 + 1, seed);
  
  return (1 - u) * (1 - v) * n00 + u * (1 - v) * n10 + (1 - u) * v * n01 + u * v * n11;
}

// Fractal Brownian Motion
function fbm(x: number, y: number, octaves: number, seed: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency, seed + i * 10);
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value;
}

// Reaction-diffusion approximation using layered noise
// Creates patterns similar to Gray-Scott model
function computeRDValue(
  x: number,
  y: number,
  t: number,
  pattern: string,
  scale: number,
  intensity: number
): number {
  const params = getPatternParams(pattern);
  const sx = x * scale * params.scale;
  const sy = y * scale * params.scale;
  
  // Time-based evolution
  const timeOffset = t * 0.05;
  
  // Multiple noise layers create RD-like patterns
  // Large-scale structure
  const n1 = fbm(sx * 0.5 + timeOffset * 0.3, sy * 0.5, 4, 0);
  
  // Medium detail - creates spots/stripes based on pattern type
  const freq = pattern === "stripes" ? 1.5 : 2;
  const n2 = fbm(sx * freq + timeOffset, sy * freq + Math.sin(timeOffset * 0.2) * 0.3, 3, 100);
  
  // Fine detail
  const n3 = fbm(sx * 3 - timeOffset * 0.5, sy * 3, 2, 200);
  
  // Pattern-specific mixing
  let patternMix: number;
  switch (pattern) {
    case "stripes":
      // Elongated patterns
      patternMix = n1 * 0.2 + Math.sin(n2 * Math.PI * 2 + sx * 0.5) * 0.5 + n3 * 0.1;
      break;
    case "spots":
      // Circular spots
      patternMix = n1 * 0.3 + (1 - Math.abs(n2 - 0.5) * 2) * 0.5 + n3 * 0.1;
      break;
    case "labyrinth":
      // Maze-like
      patternMix = n1 * 0.25 + n2 * 0.45 + Math.sin(n3 * Math.PI * 4) * 0.15;
      break;
    case "coral":
    default:
      // Organic branching
      patternMix = n1 * 0.3 + n2 * 0.4 + n3 * 0.2;
      break;
  }
  
  // Apply intensity and create bistable threshold behavior
  const thresholded = Math.pow(Math.abs(Math.sin(patternMix * Math.PI)), 0.5 + (1 - intensity) * 2);
  
  // Subtle pulsing
  const pulse = Math.sin(t * 0.1 + n1 * Math.PI * 2) * 0.05;
  
  return Math.max(0, Math.min(1, thresholded + pulse));
}

export const reactionDiffusion: ArtGenerator = {
  name: "Reaction-Diffusion",
  description: "Turing patterns simulating natural pattern formation like zebra stripes, coral growth, and leopard spots",
  
  config: {
    pattern: {
      type: "select",
      default: "coral",
      options: ["spots", "stripes", "labyrinth", "coral"],
    },
    scale: {
      type: "range",
      default: 1.0,
      min: 0.5,
      max: 2.5,
      step: 0.1,
    },
    speed: {
      type: "range",
      default: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
    },
    intensity: {
      type: "range",
      default: 0.7,
      min: 0.3,
      max: 1.0,
      step: 0.05,
    },
    colorScheme: {
      type: "select",
      default: "coral",
      options: ["zebra", "coral", "leopard", "microscopic", "fire", "neon", "ocean", "heatmap"],
    },
  },

  generate: (width: number, height: number, time: number, config: Partial<ReactionDiffusionConfig> = {}) => {
    const cfg = { ...defaultConfig, ...config } as ReactionDiffusionConfig;
    const colors = getColorScheme(cfg.colorScheme);
    
    return (renderer: PixelRenderer) => {
      const cx = width / 2;
      const cy = height / 2;
      
      // Render pixels
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          // Normalize coordinates
          const nx = (x - cx) / (width * 0.4);
          const ny = (y - cy) / (height * 0.4);
          
          // Compute reaction-diffusion value
          const rdValue = computeRDValue(nx, ny, time * cfg.speed * 0.001, cfg.pattern, cfg.scale, cfg.intensity);
          
          // Map to color
          const colorIdx = Math.floor(rdValue * (colors.length - 1));
          const [r, g, b] = colors[Math.max(0, Math.min(colors.length - 1, colorIdx))];
          
          // Fill 2x2 block
          renderer.setPixel(x, y, r, g, b);
          renderer.setPixel(x + 1, y, r, g, b);
          renderer.setPixel(x, y + 1, r, g, b);
          renderer.setPixel(x + 1, y + 1, r, g, b);
        }
      }
    };
  },
};
