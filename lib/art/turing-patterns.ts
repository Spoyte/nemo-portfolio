import { ArtGenerator, ArtParams } from "./core";

// Turing Patterns - Activator-Inhibitor Reaction-Diffusion
// Based on Alan Turing's 1952 paper "The Chemical Basis of Morphogenesis"
// Simulates how patterns in nature (zebra stripes, leopard spots, etc.) emerge from
// the interaction of an activator chemical and an inhibitor chemical

interface TuringParams extends ArtParams {
  pattern: string;
  activatorRate: number;
  inhibitorRate: number;
  activatorDiffusion: number;
  inhibitorDiffusion: number;
  colorScheme: string;
  speed: number;
}

// Color schemes
const COLOR_SCHEMES: Record<string, string[]> = {
  "nature": ["#1a3a1a", "#2d5a2d", "#4a7c4a", "#6b9e6b", "#8fc08f", "#b8e0b8"],
  "zebra": ["#0a0a0a", "#1a1a1a", "#333333", "#666666", "#999999", "#f5f5f5"],
  "coral": ["#2d1b2e", "#5c2a3a", "#8b3a4a", "#c45c5c", "#e88c7a", "#ffccaa"],
  "leopard": ["#1a0f0a", "#4a2d1a", "#8b5a2a", "#c48c4a", "#e6b86a", "#f5deb3"],
  "ocean": ["#001a33", "#003366", "#004c99", "#0066cc", "#3399ff", "#80ccff"],
  "sunset": ["#2d1b4e", "#5c2a6b", "#8b3a5c", "#c45c4a", "#e88c3c", "#ffcc5c"],
  "neon": ["#0a001a", "#1a0033", "#330066", "#6600cc", "#9933ff", "#cc80ff"],
  "earth": ["#2d2416", "#5c4a2a", "#8b6b3a", "#b88c4a", "#d4a85c", "#e6c48a"],
};

// Pattern presets with different activator/inhibitor parameters
const PATTERN_PRESETS: Record<string, {
  activatorRate: number;
  inhibitorRate: number;
  activatorDiffusion: number;
  inhibitorDiffusion: number;
  seedScale: number;
}> = {
  "spots": {
    activatorRate: 0.08,
    inhibitorRate: 0.04,
    activatorDiffusion: 0.2,
    inhibitorDiffusion: 0.1,
    seedScale: 0.05,
  },
  "stripes": {
    activatorRate: 0.1,
    inhibitorRate: 0.045,
    activatorDiffusion: 0.25,
    inhibitorDiffusion: 0.08,
    seedScale: 0.03,
  },
  "labyrinth": {
    activatorRate: 0.09,
    inhibitorRate: 0.035,
    activatorDiffusion: 0.3,
    inhibitorDiffusion: 0.12,
    seedScale: 0.04,
  },
  "bubbles": {
    activatorRate: 0.12,
    inhibitorRate: 0.05,
    activatorDiffusion: 0.15,
    inhibitorDiffusion: 0.06,
    seedScale: 0.06,
  },
  "waves": {
    activatorRate: 0.07,
    inhibitorRate: 0.03,
    activatorDiffusion: 0.35,
    inhibitorDiffusion: 0.15,
    seedScale: 0.025,
  },
  "chaos": {
    activatorRate: 0.11,
    inhibitorRate: 0.055,
    activatorDiffusion: 0.22,
    inhibitorDiffusion: 0.09,
    seedScale: 0.045,
  },
};

// Seeded random number generator
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

// Initialize activator and inhibitor grids
function initializeGrids(
  width: number,
  height: number,
  seedScale: number,
  seed: number
): { activator: Float32Array; inhibitor: Float32Array } {
  const size = width * height;
  const activator = new Float32Array(size);
  const inhibitor = new Float32Array(size);
  const random = createSeededRandom(seed);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const nx = x * seedScale;
      const ny = y * seedScale;
      
      // Create initial noise pattern
      const noise = (Math.sin(nx + random() * 2) + Math.cos(ny + random() * 2)) * 0.5;
      activator[idx] = 0.5 + noise * 0.1;
      inhibitor[idx] = 0.5 + noise * 0.1;
    }
  }

  return { activator, inhibitor };
}

// Apply Laplacian for diffusion
function laplacian(grid: Float32Array, x: number, y: number, width: number, height: number): number {
  const idx = y * width + x;
  
  const left = x > 0 ? grid[idx - 1] : grid[idx];
  const right = x < width - 1 ? grid[idx + 1] : grid[idx];
  const up = y > 0 ? grid[idx - width] : grid[idx];
  const down = y < height - 1 ? grid[idx + width] : grid[idx];
  
  return left + right + up + down - 4 * grid[idx];
}

// Simulate one step of the Turing reaction-diffusion
function simulateStep(
  activator: Float32Array,
  inhibitor: Float32Array,
  width: number,
  height: number,
  params: {
    activatorRate: number;
    inhibitorRate: number;
    activatorDiffusion: number;
    inhibitorDiffusion: number;
  }
): void {
  const size = width * height;
  const newActivator = new Float32Array(size);
  const newInhibitor = new Float32Array(size);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const a = activator[idx];
      const i = inhibitor[idx];

      // Reaction terms (simplified Gray-Scott-like dynamics)
      // Activator promotes its own production and inhibitor production
      // Inhibitor suppresses activator
      const reaction = a * a * i;
      
      // Diffusion
      const aLap = laplacian(activator, x, y, width, height);
      const iLap = laplacian(inhibitor, x, y, width, height);

      // Update equations
      newActivator[idx] = a + 
        params.activatorRate * a - 
        params.inhibitorRate * reaction + 
        params.activatorDiffusion * aLap;
      
      newInhibitor[idx] = i + 
        params.activatorRate * reaction - 
        params.inhibitorRate * i + 
        params.inhibitorDiffusion * iLap;

      // Clamp values
      newActivator[idx] = Math.max(0, Math.min(1, newActivator[idx]));
      newInhibitor[idx] = Math.max(0, Math.min(1, newInhibitor[idx]));
    }
  }

  // Copy new values back
  activator.set(newActivator);
  inhibitor.set(newInhibitor);
}

// Render the grid to canvas
function renderToCanvas(
  ctx: CanvasRenderingContext2D,
  activator: Float32Array,
  inhibitor: Float32Array,
  width: number,
  height: number,
  colorScheme: string
): void {
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES["nature"];
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pixelIdx = idx * 4;

      // Pattern value based on activator/inhibitor difference
      const patternValue = activator[idx] - inhibitor[idx] * 0.5;
      const normalized = (patternValue + 0.5) * 0.5; // Map to 0-1
      const clamped = Math.max(0, Math.min(0.999, normalized));

      // Map to color
      const colorIdx = Math.floor(clamped * (colors.length - 1));
      const color = colors[colorIdx];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Persistent state for animation
interface TuringState {
  activator: Float32Array;
  inhibitor: Float32Array;
  width: number;
  height: number;
  lastPattern: string;
  lastSeed: number;
}

let persistentState: TuringState | null = null;

export const turingPatterns: ArtGenerator = {
  name: "Turing Patterns",
  description: "Activator-inhibitor reaction-diffusion based on Alan Turing's morphogenesis equations. Patterns emerge from chemical interactions like those found in animal coats and seashells.",
  
  params: {
    pattern: {
      name: "Pattern Type",
      type: "select",
      default: "spots",
      options: ["spots", "stripes", "labyrinth", "bubbles", "waves", "chaos"],
    },
    activatorRate: {
      name: "Activator Rate",
      type: "range",
      default: 0.08,
      min: 0.01,
      max: 0.2,
      step: 0.01,
    },
    inhibitorRate: {
      name: "Inhibitor Rate",
      type: "range",
      default: 0.04,
      min: 0.01,
      max: 0.1,
      step: 0.005,
    },
    activatorDiffusion: {
      name: "Activator Diffusion",
      type: "range",
      default: 0.2,
      min: 0.05,
      max: 0.5,
      step: 0.05,
    },
    inhibitorDiffusion: {
      name: "Inhibitor Diffusion",
      type: "range",
      default: 0.1,
      min: 0.02,
      max: 0.3,
      step: 0.02,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      default: "nature",
      options: ["nature", "zebra", "coral", "leopard", "ocean", "sunset", "neon", "earth"],
    },
    speed: {
      name: "Animation Speed",
      type: "range",
      default: 1,
      min: 0,
      max: 5,
      step: 0.5,
    },
  },

  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time: number = 0): void => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const typedParams = params as TuringParams;
    const pattern = typedParams.pattern || "spots";
    const colorScheme = typedParams.colorScheme || "nature";
    const speed = typedParams.speed || 1;

    // Use preset parameters if pattern changed, otherwise use custom
    const preset = PATTERN_PRESETS[pattern];
    const simParams = {
      activatorRate: typedParams.activatorRate || preset.activatorRate,
      inhibitorRate: typedParams.inhibitorRate || preset.inhibitorRate,
      activatorDiffusion: typedParams.activatorDiffusion || preset.activatorDiffusion,
      inhibitorDiffusion: typedParams.inhibitorDiffusion || preset.inhibitorDiffusion,
    };

    // Check if we need to reinitialize
    const needsReinit = !persistentState || 
      persistentState.width !== width || 
      persistentState.height !== height ||
      persistentState.lastPattern !== pattern;

    if (needsReinit) {
      const seed = Math.floor(time / 1000); // Change seed every second
      const { activator, inhibitor } = initializeGrids(
        width, 
        height, 
        preset.seedScale,
        seed
      );
      
      // Run initial simulation steps to establish pattern
      for (let i = 0; i < 100; i++) {
        simulateStep(activator, inhibitor, width, height, simParams);
      }

      persistentState = {
        activator,
        inhibitor,
        width,
        height,
        lastPattern: pattern,
        lastSeed: seed,
      };
    }

    // Run simulation steps based on speed
    const stepsPerFrame = Math.floor(speed * 2);
    for (let i = 0; i < stepsPerFrame; i++) {
      simulateStep(
        persistentState.activator,
        persistentState.inhibitor,
        width,
        height,
        simParams
      );
    }

    // Render
    renderToCanvas(
      ctx,
      persistentState.activator,
      persistentState.inhibitor,
      width,
      height,
      colorScheme
    );
  },

  meta: {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "organic", "nature", "detailed"],
    created: "2026-02-27",
  },
};

// Export for individual use
export function renderTuringPatterns(
  ctx: CanvasRenderingContext2D,
  params: TuringParams,
  time: number = 0
): void {
  turingPatterns.generate(ctx, params, time);
}

export const turingPatternsDefaultParams: TuringParams = {
  pattern: "spots",
  activatorRate: 0.08,
  inhibitorRate: 0.04,
  activatorDiffusion: 0.2,
  inhibitorDiffusion: 0.1,
  colorScheme: "nature",
  speed: 1,
};
