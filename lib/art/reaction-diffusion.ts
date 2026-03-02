import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface ReactionDiffusionParams {
  // Gray-Smith model parameters
  feedRate: number;       // 0.01-0.1: Feed rate (f)
  killRate: number;       // 0.01-0.1: Kill rate (k)
  diffusionA: number;     // 0.5-1.0: Diffusion rate A
  diffusionB: number;     // 0.1-0.5: Diffusion rate B
  // Visual parameters
  colorScheme: "coral" | "zebra" | "bacteria" | "fingerprint" | "waves";
  scale: number;          // 1-4: Pattern scale
  animated: boolean;
}

export const reactionDiffusionDefaultParams: ReactionDiffusionParams = {
  feedRate: 0.0545,
  killRate: 0.062,
  diffusionA: 1.0,
  diffusionB: 0.5,
  colorScheme: "coral",
  scale: 2,
  animated: true,
};

// Gray-Scott reaction-diffusion model
// Simulates: A + 2B → 3B (B is autocatalytic)
// ∂A/∂t = Dₐ∇²A - AB² + f(1-A)
// ∂B/∂t = Dᵦ∇²B + AB² - (k+f)B

class ReactionDiffusionSimulation {
  width: number;
  height: number;
  gridA: Float32Array;
  gridB: Float32Array;
  nextA: Float32Array;
  nextB: Float32Array;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.gridA = new Float32Array(width * height).fill(1);
    this.gridB = new Float32Array(width * height).fill(0);
    this.nextA = new Float32Array(width * height);
    this.nextB = new Float32Array(width * height);
    this.seed();
  }
  
  seed() {
    // Seed with random patches of B
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    const radius = Math.min(this.width, this.height) / 8;
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Central seed with some noise
        if (dist < radius) {
          this.gridB[idx] = 0.9 + Math.random() * 0.1;
        } else if (Math.random() < 0.01) {
          // Sparse random seeds
          this.gridB[idx] = Math.random() * 0.5;
        }
      }
    }
  }
  
  laplacian(grid: Float32Array, x: number, y: number): number {
    const w = this.width;
    const h = this.height;
    
    // Wrap around boundaries
    const xm = (x - 1 + w) % w;
    const xp = (x + 1) % w;
    const ym = (y - 1 + h) % h;
    const yp = (y + 1) % h;
    
    const idx = y * w + x;
    const idxL = y * w + xm;
    const idxR = y * w + xp;
    const idxU = ym * w + x;
    const idxD = yp * w + x;
    const idxUL = ym * w + xm;
    const idxUR = ym * w + xp;
    const idxDL = yp * w + xm;
    const idxDR = yp * w + xp;
    
    // 9-point Laplacian stencil for smoother results
    return (
      grid[idxUL] * 0.05 + grid[idxU] * 0.2 + grid[idxUR] * 0.05 +
      grid[idxL] * 0.2 + grid[idx] * -1.0 + grid[idxR] * 0.2 +
      grid[idxDL] * 0.05 + grid[idxD] * 0.2 + grid[idxDR] * 0.05
    );
  }
  
  step(f: number, k: number, dA: number, dB: number) {
    const w = this.width;
    const h = this.height;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        const a = this.gridA[idx];
        const b = this.gridB[idx];
        
        const lapA = this.laplacian(this.gridA, x, y);
        const lapB = this.laplacian(this.gridB, x, y);
        
        const reaction = a * b * b;
        
        this.nextA[idx] = a + dA * lapA - reaction + f * (1 - a);
        this.nextB[idx] = b + dB * lapB + reaction - (k + f) * b;
        
        // Clamp to valid range
        this.nextA[idx] = Math.max(0, Math.min(1, this.nextA[idx]));
        this.nextB[idx] = Math.max(0, Math.min(1, this.nextB[idx]));
      }
    }
    
    // Swap grids
    [this.gridA, this.nextA] = [this.nextA, this.gridA];
    [this.gridB, this.nextB] = [this.nextB, this.gridB];
  }
}

// Preset parameter combinations for different pattern types
const presets: Record<string, { f: number; k: number; name: string }> = {
  coral: { f: 0.0545, k: 0.062, name: "Coral Growth" },
  zebra: { f: 0.035, k: 0.06, name: "Zebra Stripes" },
  bacteria: { f: 0.037, k: 0.06, name: "Bacteria Colonies" },
  fingerprint: { f: 0.037, k: 0.064, name: "Fingerprints" },
  waves: { f: 0.018, k: 0.05, name: "Spiral Waves" },
};

export function renderReactionDiffusion(
  ctx: CanvasRenderingContext2D,
  params: Partial<ReactionDiffusionParams> = {},
  time: number = 0
): void {
  const config = { ...reactionDiffusionDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  
  // Scale down for performance (simulation resolution)
  const scale = Math.max(1, Math.floor(config.scale));
  const simWidth = Math.floor(width / scale);
  const simHeight = Math.floor(height / scale);
  
  // Get preset or use custom parameters
  const preset = presets[config.colorScheme];
  const f = config.feedRate;
  const k = config.killRate;
  const dA = config.diffusionA;
  const dB = config.diffusionB;
  
  // Create or reuse simulation
  let sim: ReactionDiffusionSimulation;
  const simKey = `rd_${simWidth}_${simHeight}`;
  
  // Use time to determine simulation state
  // We simulate multiple steps per frame for faster evolution
  const stepsPerFrame = config.animated ? 8 : 20;
  const seedOffset = Math.floor(time * 0.01) % 1000;
  
  // Initialize simulation
  sim = new ReactionDiffusionSimulation(simWidth, simHeight);
  
  // Advance simulation
  const targetSteps = config.animated 
    ? Math.floor(time * 0.05) * stepsPerFrame 
    : 1000 + seedOffset * 10;
  
  // Run simulation steps
  const stepsToRun = config.animated ? stepsPerFrame : Math.min(2000, targetSteps);
  for (let i = 0; i < stepsToRun; i++) {
    sim.step(f, k, dA, dB);
  }
  
  // Create image data for rendering
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Color mapping based on scheme
  const getColor = (a: number, b: number): [number, number, number] => {
    const concentration = b; // B concentration drives the pattern
    
    switch (config.colorScheme) {
      case "coral":
        // Deep purple to bright coral
        return [
          Math.floor(20 + concentration * 200),
          Math.floor(10 + concentration * 100),
          Math.floor(40 + concentration * 150),
        ];
      case "zebra":
        // Black and white stripes
        const zebra = concentration > 0.5 ? 255 : Math.floor(concentration * 100);
        return [zebra, zebra, zebra];
      case "bacteria":
        // Green-yellow colonies
        return [
          Math.floor(concentration * 100),
          Math.floor(50 + concentration * 205),
          Math.floor(concentration * 50),
        ];
      case "fingerprint":
        // Sepia tones
        return [
          Math.floor(40 + concentration * 150),
          Math.floor(30 + concentration * 120),
          Math.floor(20 + concentration * 80),
        ];
      case "waves":
        // Blue cyan waves
        return [
          Math.floor(concentration * 50),
          Math.floor(100 + concentration * 155),
          Math.floor(150 + concentration * 105),
        ];
      default:
        return [
          Math.floor(concentration * 255),
          Math.floor(concentration * 255),
          Math.floor(concentration * 255),
        ];
    }
  };
  
  // Render simulation to canvas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sample from simulation grid
      const simX = Math.floor(x / scale) % simWidth;
      const simY = Math.floor(y / scale) % simHeight;
      const simIdx = simY * simWidth + simX;
      
      const a = sim.gridA[simIdx];
      const b = sim.gridB[simIdx];
      
      const [r, g, bl] = getColor(a, b);
      
      const idx = (y * width + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = bl;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Backward compatibility: ArtGenerator interface
export const reactionDiffusion: ArtGenerator = {
  id: "reaction-diffusion",
  name: "Reaction-Diffusion Patterns",
  category: "natural",
  render: (ctx, params, time) => renderReactionDiffusion(ctx, params as ReactionDiffusionParams, time),
  defaultParams: reactionDiffusionDefaultParams,
};

export default reactionDiffusion;
