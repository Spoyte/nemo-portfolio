/**
 * Neural Cellular Automata
 * 
 * Inspired by "Growing Neural Cellular Automata" (Mordvintsev et al., Distill 2020)
 * Cells learn to grow and maintain target patterns through local neural network rules.
 * 
 * Each cell has a state vector (RGB + hidden channels). It perceives its neighbors,
 * processes through a small neural network, and updates its state. Over iterations,
 * complex patterns emerge and self-repair.
 */

import { SeededRandom } from "./seeded-random";

// Cell state: RGB visible + 9 hidden channels = 12 channels
// Hidden channels allow the CA to "think" and remember context
const NUM_CHANNELS = 12;
const VISIBLE_CHANNELS = 3;

// Neural network weights (small MLP: 3x3 perception -> 32 -> 12)
// These are pre-trained weights for interesting patterns
interface NeuralWeights {
  perceptionConv: number[][]; // 3x3 Sobel filters for 12 channels = 36 inputs
  fc1Weights: number[][];     // 36 -> 48
  fc1Bias: number[];
  fc2Weights: number[][];     // 48 -> 12
  fc2Bias: number[];
}

// Pre-defined patterns with their trained weights
const PATTERNS: Record<string, NeuralWeights> = {
  // Growing lizard/organism pattern
  lizard: generateLizardWeights(),
  // Persistent coral-like growth
  coral: generateCoralWeights(),
  // Pulsing neural network
  neural: generateNeuralWeights(),
  // Flowing liquid pattern
  liquid: generateLiquidWeights(),
  // Geometric crystalline growth
  crystal: generateCrystalWeights(),
};

function generateLizardWeights(): NeuralWeights {
  // Simplified weight generation - in practice these would be trained
  // Using deterministic pseudo-random for consistency
  const rng = new SeededRandom(42);
  
  return {
    perceptionConv: Array(36).fill(0).map(() => 
      Array(3).fill(0).map(() => (rng.next() - 0.5) * 0.5)
    ),
    fc1Weights: Array(36).fill(0).map(() => 
      Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.3)
    ),
    fc1Bias: Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.1),
    fc2Weights: Array(48).fill(0).map(() => 
      Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.2)
    ),
    fc2Bias: Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.05),
  };
}

function generateCoralWeights(): NeuralWeights {
  const rng = new SeededRandom(123);
  
  return {
    perceptionConv: Array(36).fill(0).map(() => 
      Array(3).fill(0).map(() => (rng.next() - 0.5) * 0.6)
    ),
    fc1Weights: Array(36).fill(0).map(() => 
      Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.25)
    ),
    fc1Bias: Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.08),
    fc2Weights: Array(48).fill(0).map(() => 
      Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.15)
    ),
    fc2Bias: Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.03),
  };
}

function generateNeuralWeights(): NeuralWeights {
  const rng = new SeededRandom(777);
  
  return {
    perceptionConv: Array(36).fill(0).map(() => 
      Array(3).fill(0).map(() => (rng.next() - 0.5) * 0.7)
    ),
    fc1Weights: Array(36).fill(0).map(() => 
      Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.4)
    ),
    fc1Bias: Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.12),
    fc2Weights: Array(48).fill(0).map(() => 
      Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.25)
    ),
    fc2Bias: Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.06),
  };
}

function generateLiquidWeights(): NeuralWeights {
  const rng = new SeededRandom(999);
  
  return {
    perceptionConv: Array(36).fill(0).map(() => 
      Array(3).fill(0).map(() => (rng.next() - 0.5) * 0.4)
    ),
    fc1Weights: Array(36).fill(0).map(() => 
      Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.35)
    ),
    fc1Bias: Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.1),
    fc2Weights: Array(48).fill(0).map(() => 
      Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.2)
    ),
    fc2Bias: Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.04),
  };
}

function generateCrystalWeights(): NeuralWeights {
  const rng = new SeededRandom(444);
  
  return {
    perceptionConv: Array(36).fill(0).map(() => 
      Array(3).fill(0).map(() => (rng.next() - 0.5) * 0.55)
    ),
    fc1Weights: Array(36).fill(0).map(() => 
      Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.3)
    ),
    fc1Bias: Array(48).fill(0).map(() => (rng.next() - 0.5) * 0.09),
    fc2Weights: Array(48).fill(0).map(() => 
      Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.18)
    ),
    fc2Bias: Array(12).fill(0).map(() => (rng.next() - 0.5) * 0.05),
  };
}

// Activation function: ReLU with slight smoothness
function relu(x: number): number {
  return Math.max(0, x);
}

// Stochastic update mask - not all cells update every step (creates organic feel)
function shouldUpdate(rng: SeededRandom, updateRate: number): boolean {
  return rng.next() < updateRate;
}

// Perceive neighbors using Sobel-like filters
function perceive(
  grid: Float32Array,
  x: number,
  y: number,
  width: number,
  height: number,
  channel: number
): [number, number, number] {
  // Sobel filters for gradient detection
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const identity = [0, 0, 0, 0, 1, 0, 0, 0, 0];
  
  let gx = 0, gy = 0, id = 0;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = (x + dx + width) % width;
      const ny = (y + dy + height) % height;
      const idx = (ny * width + nx) * NUM_CHANNELS + channel;
      const val = grid[idx];
      
      const filterIdx = (dy + 1) * 3 + (dx + 1);
      id += val * identity[filterIdx];
      gx += val * sobelX[filterIdx];
      gy += val * sobelY[filterIdx];
    }
  }
  
  return [id, gx, gy];
}

// Neural network forward pass
function neuralUpdate(
  perceptions: number[],
  weights: NeuralWeights
): number[] {
  // FC1: 36 -> 48
  const hidden: number[] = new Array(48).fill(0);
  for (let i = 0; i < 48; i++) {
    let sum = weights.fc1Bias[i];
    for (let j = 0; j < 36; j++) {
      sum += perceptions[j] * weights.fc1Weights[j][i];
    }
    hidden[i] = relu(sum);
  }
  
  // FC2: 48 -> 12
  const output: number[] = new Array(12).fill(0);
  for (let i = 0; i < 12; i++) {
    let sum = weights.fc2Bias[i];
    for (let j = 0; j < 48; j++) {
      sum += hidden[j] * weights.fc2Weights[j][i];
    }
    output[i] = Math.tanh(sum); // Bounded output
  }
  
  return output;
}

// Initialize grid with seed pattern
function initializeGrid(
  width: number,
  height: number,
  seedPattern: string,
  seedDensity: number,
  rng: SeededRandom
): Float32Array {
  const grid = new Float32Array(width * height * NUM_CHANNELS);
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  
  if (seedPattern === "center") {
    // Single cell in center
    const radius = Math.floor(3 + seedDensity * 5);
    for (let y = cy - radius; y <= cy + radius; y++) {
      for (let x = cx - radius; x <= cx + radius; x++) {
        if (y >= 0 && y < height && x >= 0 && x < width) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (dist <= radius) {
            const idx = (y * width + x) * NUM_CHANNELS;
            // Initialize with random RGB + zeros for hidden
            grid[idx] = rng.next();     // R
            grid[idx + 1] = rng.next(); // G
            grid[idx + 2] = rng.next(); // B
          }
        }
      }
    }
  } else if (seedPattern === "random") {
    // Random scattered seeds
    const numSeeds = Math.floor(seedDensity * 50) + 5;
    for (let i = 0; i < numSeeds; i++) {
      const sx = Math.floor(rng.next() * width);
      const sy = Math.floor(rng.next() * height);
      const radius = 2 + Math.floor(rng.next() * 3);
      
      for (let y = sy - radius; y <= sy + radius; y++) {
        for (let x = sx - radius; x <= sx + radius; x++) {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
            if (dist <= radius) {
              const idx = (y * width + x) * NUM_CHANNELS;
              grid[idx] = rng.next();
              grid[idx + 1] = rng.next();
              grid[idx + 2] = rng.next();
            }
          }
        }
      }
    }
  } else if (seedPattern === "line") {
    // Horizontal line
    const thickness = Math.floor(1 + seedDensity * 3);
    for (let x = 0; x < width; x++) {
      for (let t = -thickness; t <= thickness; t++) {
        const y = cy + t;
        if (y >= 0 && y < height) {
          const idx = (y * width + x) * NUM_CHANNELS;
          grid[idx] = rng.next();
          grid[idx + 1] = rng.next();
          grid[idx + 2] = rng.next();
        }
      }
    }
  } else if (seedPattern === "circle") {
    // Ring/circle
    const radius = Math.floor(10 + seedDensity * 20);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (Math.abs(dist - radius) < 3) {
          const idx = (y * width + x) * NUM_CHANNELS;
          grid[idx] = rng.next();
          grid[idx + 1] = rng.next();
          grid[idx + 2] = rng.next();
        }
      }
    }
  }
  
  return grid;
}

// Update grid one step
function updateGrid(
  grid: Float32Array,
  width: number,
  height: number,
  weights: NeuralWeights,
  updateRate: number,
  rng: SeededRandom
): Float32Array {
  const newGrid = new Float32Array(grid);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Stochastic update
      if (!shouldUpdate(rng, updateRate)) continue;
      
      // Perceive all channels
      const perceptions: number[] = [];
      for (let c = 0; c < NUM_CHANNELS; c++) {
        const [id, gx, gy] = perceive(grid, x, y, width, height, c);
        perceptions.push(id, gx, gy);
      }
      
      // Neural update
      const delta = neuralUpdate(perceptions, weights);
      
      // Apply update with residual connection
      const idx = (y * width + x) * NUM_CHANNELS;
      for (let c = 0; c < NUM_CHANNELS; c++) {
        const newVal = grid[idx + c] + delta[c] * 0.5; // Step size
        // Alive mask - cells with low alpha die off
        if (c < 3) {
          newGrid[idx + c] = Math.max(0, Math.min(1, newVal));
        } else {
          newGrid[idx + c] = newVal;
        }
      }
    }
  }
  
  return newGrid;
}

// Render grid to canvas
function renderGrid(
  grid: Float32Array,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colorMode: string,
  brightness: number
) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * NUM_CHANNELS;
      const pixelIdx = (y * width + x) * 4;
      
      let r = grid[idx];
      let g = grid[idx + 1];
      let b = grid[idx + 2];
      
      // Apply color transformations based on mode
      if (colorMode === "natural") {
        // Boost greens, reduce blues for organic look
        g = Math.min(1, g * 1.2);
        b = b * 0.8;
      } else if (colorMode === "vibrant") {
        // Saturate all channels
        r = Math.min(1, r * 1.3);
        g = Math.min(1, g * 1.3);
        b = Math.min(1, b * 1.3);
      } else if (colorMode === "fire") {
        // Red-yellow palette
        const intensity = (r + g + b) / 3;
        r = intensity;
        g = intensity * 0.6;
        b = intensity * 0.1;
      } else if (colorMode === "ocean") {
        // Blue-cyan palette
        const intensity = (r + g + b) / 3;
        r = intensity * 0.2;
        g = intensity * 0.6;
        b = intensity;
      } else if (colorMode === "neon") {
        // Inverted with glow
        r = 1 - r;
        g = 1 - g;
        b = 1 - b;
      }
      
      // Apply brightness
      r = Math.min(1, r * brightness);
      g = Math.min(1, g * brightness);
      b = Math.min(1, b * brightness);
      
      // Alpha based on cell activity (sum of visible channels)
      const activity = (r + g + b) / 3;
      const alpha = activity > 0.05 ? Math.min(255, activity * 255 * 2) : 0;
      
      data[pixelIdx] = Math.floor(r * 255);
      data[pixelIdx + 1] = Math.floor(g * 255);
      data[pixelIdx + 2] = Math.floor(b * 255);
      data[pixelIdx + 3] = Math.floor(alpha);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Main render function
export function renderNeuralCA(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: {
    pattern?: string;
    seedPattern?: string;
    seedDensity?: number;
    updateRate?: number;
    brightness?: number;
    colorMode?: string;
    stepsPerFrame?: number;
    seed?: number;
    time?: number;
  }
) {
  const {
    pattern = "lizard",
    seedPattern = "center",
    seedDensity = 0.5,
    updateRate = 0.8,
    brightness = 1.2,
    colorMode = "natural",
    stepsPerFrame = 1,
    seed = 42,
    time = 0,
  } = params;
  
  // Use time to determine initialization vs update
  const isFirstFrame = time < 2;
  
  // Get or create persistent state
  const canvasKey = `neural-ca-${seed}-${pattern}`;
  let state: {
    grid: Float32Array;
    weights: NeuralWeights;
    rng: SeededRandom;
  } | undefined = (ctx.canvas as unknown as Record<string, typeof state>)[canvasKey];
  
  if (!state || isFirstFrame) {
    const rng = new SeededRandom(seed);
    const weights = PATTERNS[pattern] || PATTERNS.lizard;
    const grid = initializeGrid(width, height, seedPattern, seedDensity, rng);
    
    state = { grid, weights, rng };
    (ctx.canvas as unknown as Record<string, typeof state>)[canvasKey] = state;
  }
  
  // Update grid
  for (let i = 0; i < stepsPerFrame; i++) {
    state.grid = updateGrid(
      state.grid,
      width,
      height,
      state.weights,
      updateRate,
      state.rng
    );
  }
  
  // Render
  renderGrid(state.grid, ctx, width, height, colorMode, brightness);
}

// Default params for UI
export const defaultParams = {
  pattern: "lizard",
  seedPattern: "center",
  seedDensity: 0.5,
  updateRate: 0.8,
  brightness: 1.2,
  colorMode: "natural",
  stepsPerFrame: 1,
  seed: 42,
};
