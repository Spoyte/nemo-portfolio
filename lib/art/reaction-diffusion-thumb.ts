import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface ReactionDiffusionParams {
  feedRate: number;
  killRate: number;
  diffusionA: number;
  diffusionB: number;
  colorScheme: "coral" | "zebra" | "bacteria" | "fingerprint" | "waves";
  scale: number;
  animated: boolean;
}

export const reactionDiffusionDefaultParams: ReactionDiffusionParams = {
  feedRate: 0.0545,
  killRate: 0.062,
  diffusionA: 1.0,
  diffusionB: 0.5,
  colorScheme: "coral",
  scale: 2,
  animated: false,
};

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
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    const radius = Math.min(this.width, this.height) / 8;
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < radius) {
          this.gridB[idx] = 0.9 + Math.random() * 0.1;
        } else if (Math.random() < 0.01) {
          this.gridB[idx] = Math.random() * 0.5;
        }
      }
    }
  }
  
  laplacian(grid: Float32Array, x: number, y: number): number {
    const w = this.width;
    const h = this.height;
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
        
        this.nextA[idx] = Math.max(0, Math.min(1, this.nextA[idx]));
        this.nextB[idx] = Math.max(0, Math.min(1, this.nextB[idx]));
      }
    }
    
    [this.gridA, this.nextA] = [this.nextA, this.gridA];
    [this.gridB, this.nextB] = [this.nextB, this.gridB];
  }
}

export function renderReactionDiffusion(
  ctx: CanvasRenderingContext2D,
  params: Partial<ReactionDiffusionParams> = {},
  time: number = 0
): void {
  const config = { ...reactionDiffusionDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  
  const scale = Math.max(1, Math.floor(config.scale));
  const simWidth = Math.floor(width / scale);
  const simHeight = Math.floor(height / scale);
  
  const f = config.feedRate;
  const k = config.killRate;
  const dA = config.diffusionA;
  const dB = config.diffusionB;
  
  const sim = new ReactionDiffusionSimulation(simWidth, simHeight);
  
  for (let i = 0; i < 1500; i++) {
    sim.step(f, k, dA, dB);
  }
  
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const getColor = (a: number, b: number): [number, number, number] => {
    const concentration = b;
    
    switch (config.colorScheme) {
      case "coral":
        return [
          Math.floor(20 + concentration * 200),
          Math.floor(10 + concentration * 100),
          Math.floor(40 + concentration * 150),
        ];
      case "zebra":
        const zebra = concentration > 0.5 ? 255 : Math.floor(concentration * 100);
        return [zebra, zebra, zebra];
      case "bacteria":
        return [
          Math.floor(concentration * 100),
          Math.floor(50 + concentration * 205),
          Math.floor(concentration * 50),
        ];
      case "fingerprint":
        return [
          Math.floor(40 + concentration * 150),
          Math.floor(30 + concentration * 120),
          Math.floor(20 + concentration * 80),
        ];
      case "waves":
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
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
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

export const reactionDiffusion: ArtGenerator = {
  id: "reaction-diffusion",
  name: "Reaction-Diffusion Patterns",
  category: "natural",
  render: (ctx, params, time) => renderReactionDiffusion(ctx, params as ReactionDiffusionParams, time),
  defaultParams: reactionDiffusionDefaultParams,
};

export default reactionDiffusion;
