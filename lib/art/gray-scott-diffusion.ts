import { ArtGenerator, fillCanvas, SeededRandom } from "./core";

// True Gray-Scott Reaction-Diffusion Model
// Based on: Pearson, J. E. (1993). Complex patterns in a simple system. Science, 261(5118), 189-192.
// 
// The Gray-Scott model simulates the reaction: U + 2V → 3V
// where U is the feed chemical and V is the catalyst that auto-catalyzes its own production.
// Different (F, k) parameter pairs create distinct pattern classes:
//   - Coral growth: F=0.0545, k=0.062
//   - Spots: F=0.035, k=0.065
//   - Stripes: F=0.03, k=0.062
//   - Labyrinth: F=0.029, k=0.057

export const grayScottDiffusion: ArtGenerator = {
  name: "Gray-Scott Diffusion",
  description: "True chemical reaction-diffusion simulation using the Gray-Scott model. Creates organic patterns like coral growth, animal coat patterns, and microscopic structures through computational morphogenesis.",
  
  params: {
    patternType: {
      name: "Pattern Type",
      type: "select",
      options: ["coral", "spots", "stripes", "labyrinth", "bacteria", "fingerprint"],
      default: "coral",
    },
    iterations: {
      name: "Simulation Steps",
      type: "range",
      min: 1000,
      max: 20000,
      step: 1000,
      default: 8000,
    },
    scale: {
      name: "Pattern Scale",
      type: "range",
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.0,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["ocean", "coral", "zebra", "magma", "neon", "forest", "microscopic"],
      default: "ocean",
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
  },

  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const { patternType, iterations, scale, colorScheme, seed } = params;
    const rng = new SeededRandom(seed as number);
    
    // Gray-Scott parameters for different pattern types
    const patternParams: Record<string, { F: number; K: number; Du: number; Dv: number }> = {
      coral: { F: 0.0545, K: 0.062, Du: 0.16, Dv: 0.08 },
      spots: { F: 0.035, K: 0.065, Du: 0.16, Dv: 0.08 },
      stripes: { F: 0.03, K: 0.062, Du: 0.16, Dv: 0.08 },
      labyrinth: { F: 0.029, K: 0.057, Du: 0.16, Dv: 0.08 },
      bacteria: { F: 0.034, K: 0.061, Du: 0.16, Dv: 0.08 },
      fingerprint: { F: 0.037, K: 0.06, Du: 0.16, Dv: 0.08 },
    };
    
    const { F, K, Du, Dv } = patternParams[patternType as string] || patternParams.coral;
    const steps = iterations as number;
    const dt = 1.0;
    
    // Grid dimensions (scaled for performance)
    const gridScale = Math.max(1, Math.floor(2 / (scale as number)));
    const W = Math.floor(width / gridScale);
    const H = Math.floor(height / gridScale);
    
    // Initialize concentration grids
    let U = new Float32Array(W * H);
    let V = new Float32Array(W * H);
    let U_next = new Float32Array(W * H);
    let V_next = new Float32Array(W * H);
    
    // Initialize: U = 1 everywhere, V = 0
    for (let i = 0; i < W * H; i++) {
      U[i] = 1.0;
      V[i] = 0.0;
    }
    
    // Seed with random perturbations (reproducible with seed)
    const numSeeds = 2 + Math.floor(rng.random() * 4);
    for (let s = 0; s < numSeeds; s++) {
      const cx = Math.floor(rng.random() * W * 0.7 + W * 0.15);
      const cy = Math.floor(rng.random() * H * 0.7 + H * 0.15);
      const radius = 4 + Math.floor(rng.random() * 12 * (scale as number));
      
      for (let y = Math.max(0, cy - radius); y < Math.min(H, cy + radius); y++) {
        for (let x = Math.max(0, cx - radius); x < Math.min(W, cx + radius); x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy < radius * radius) {
            const i = y * W + x;
            // Seed with chemical V in the center
            U[i] = 0.5 + rng.random() * 0.1;
            V[i] = 0.25 + rng.random() * 0.1;
          }
        }
      }
    }
    
    // Helper: get value with wrap-around (toroidal boundary)
    const get = (arr: Float32Array, x: number, y: number) => {
      x = (x + W) % W;
      y = (y + H) % H;
      return arr[y * W + x];
    };
    
    // 9-point Laplacian stencil for better stability
    const laplacian = (arr: Float32Array, x: number, y: number) => {
      const center = get(arr, x, y);
      return (
        0.05 * get(arr, x - 1, y - 1) +
        0.2  * get(arr, x,     y - 1) +
        0.05 * get(arr, x + 1, y - 1) +
        0.2  * get(arr, x - 1, y)     +
        0.2  * get(arr, x + 1, y)     +
        0.05 * get(arr, x - 1, y + 1) +
        0.2  * get(arr, x,     y + 1) +
        0.05 * get(arr, x + 1, y + 1) -
        center
      );
    };
    
    // Run Gray-Scott simulation
    for (let step = 0; step < steps; step++) {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const u = U[i];
          const v = V[i];
          
          // Reaction: U + 2V → 3V (V catalyzes its own production)
          const reaction = u * v * v;
          
          // Gray-Scott equations
          const dU = Du * laplacian(U, x, y) - reaction + F * (1 - u);
          const dV = Dv * laplacian(V, x, y) + reaction - (F + K) * v;
          
          // Update with time step
          U_next[i] = u + dt * dU;
          V_next[i] = v + dt * dV;
          
          // Clamp to valid range [0, 1]
          U_next[i] = Math.max(0, Math.min(1, U_next[i]));
          V_next[i] = Math.max(0, Math.min(1, V_next[i]));
        }
      }
      
      // Swap buffers
      [U, U_next] = [U_next, U];
      [V, V_next] = [V_next, V];
    }
    
    // Color palettes
    const palettes: Record<string, { stops: { t: number; r: number; g: number; b: number }[] }> = {
      ocean: {
        stops: [
          { t: 0.0, r: 5,   g: 15,  b: 40 },
          { t: 0.15, r: 10, g: 35,  b: 75 },
          { t: 0.3, r: 20,  g: 65,  b: 110 },
          { t: 0.45, r: 40, g: 105, b: 140 },
          { t: 0.6, r: 80,  g: 150, b: 160 },
          { t: 0.75, r: 150, g: 180, b: 100 },
          { t: 0.9, r: 220, g: 140, b: 60 },
          { t: 1.0, r: 255, g: 100, b: 50 },
        ],
      },
      coral: {
        stops: [
          { t: 0.0, r: 30,  g: 10,  b: 25 },
          { t: 0.15, r: 60, g: 25,  b: 45 },
          { t: 0.3, r: 100, g: 45,  b: 65 },
          { t: 0.45, r: 150, g: 70,  b: 85 },
          { t: 0.6, r: 190, g: 100, b: 100 },
          { t: 0.75, r: 220, g: 140, b: 120 },
          { t: 0.9, r: 245, g: 190, b: 160 },
          { t: 1.0, r: 255, g: 230, b: 210 },
        ],
      },
      zebra: {
        stops: [
          { t: 0.0, r: 250, g: 250, b: 250 },
          { t: 0.2, r: 200, g: 200, b: 200 },
          { t: 0.4, r: 140, g: 140, b: 140 },
          { t: 0.6, r: 80,  g: 80,  b: 80 },
          { t: 0.8, r: 30,  g: 30,  b: 30 },
          { t: 1.0, r: 5,   g: 5,   b: 5 },
        ],
      },
      magma: {
        stops: [
          { t: 0.0, r: 10,  g: 5,   b: 20 },
          { t: 0.15, r: 40, g: 15,  b: 50 },
          { t: 0.3, r: 90,  g: 25,  b: 70 },
          { t: 0.45, r: 150, g: 40,  b: 60 },
          { t: 0.6, r: 200, g: 60,  b: 40 },
          { t: 0.75, r: 235, g: 100, b: 30 },
          { t: 0.9, r: 255, g: 160, b: 40 },
          { t: 1.0, r: 255, g: 255, b: 120 },
        ],
      },
      neon: {
        stops: [
          { t: 0.0, r: 5,   g: 0,   b: 20 },
          { t: 0.15, r: 30, g: 0,   b: 70 },
          { t: 0.3, r: 70,  g: 0,   b: 130 },
          { t: 0.45, r: 120, g: 0,   b: 180 },
          { t: 0.6, r: 170, g: 20,  b: 220 },
          { t: 0.75, r: 210, g: 60,  b: 255 },
          { t: 0.9, r: 240, g: 130, b: 255 },
          { t: 1.0, r: 255, g: 200, b: 255 },
        ],
      },
      forest: {
        stops: [
          { t: 0.0, r: 10,  g: 25,  b: 10 },
          { t: 0.15, r: 25, g: 55,  b: 20 },
          { t: 0.3, r: 45,  g: 90,  b: 35 },
          { t: 0.45, r: 70,  g: 130, b: 50 },
          { t: 0.6, r: 100, g: 170, b: 70 },
          { t: 0.75, r: 140, g: 200, b: 100 },
          { t: 0.9, r: 190, g: 230, b: 140 },
          { t: 1.0, r: 230, g: 255, b: 190 },
        ],
      },
      microscopic: {
        stops: [
          { t: 0.0, r: 0,   g: 0,   b: 0 },
          { t: 0.15, r: 20, g: 30,  b: 60 },
          { t: 0.3, r: 40,  g: 70,  b: 110 },
          { t: 0.45, r: 70,  g: 120, b: 160 },
          { t: 0.6, r: 110, g: 170, b: 200 },
          { t: 0.75, r: 160, g: 210, b: 230 },
          { t: 0.9, r: 210, g: 240, b: 250 },
          { t: 1.0, r: 255, g: 255, b: 255 },
        ],
      },
    };
    
    const palette = palettes[colorScheme as string] || palettes.ocean;
    
    // Sample color from palette
    const getColor = (v: number) => {
      const t = Math.max(0, Math.min(1, v));
      
      let lower = palette.stops[0];
      let upper = palette.stops[palette.stops.length - 1];
      
      for (let i = 0; i < palette.stops.length - 1; i++) {
        if (t >= palette.stops[i].t && t <= palette.stops[i + 1].t) {
          lower = palette.stops[i];
          upper = palette.stops[i + 1];
          break;
        }
      }
      
      const range = upper.t - lower.t;
      const localT = range > 0 ? (t - lower.t) / range : 0;
      
      return {
        r: Math.round(lower.r + (upper.r - lower.r) * localT),
        g: Math.round(lower.g + (upper.g - lower.g) * localT),
        b: Math.round(lower.b + (upper.b - lower.b) * localT),
      };
    };
    
    // Render to canvas
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Sample from simulation grid
        const sx = Math.min(W - 1, Math.floor(x / gridScale));
        const sy = Math.min(H - 1, Math.floor(y / gridScale));
        const si = sy * W + sx;
        
        // Use V concentration for visualization (the catalyst pattern)
        const v = V[si];
        const color = getColor(v);
        
        const idx = (y * width + x) * 4;
        data[idx] = color.r;
        data[idx + 1] = color.g;
        data[idx + 2] = color.b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  },
  
  meta: {
    category: "abstract",
    complexity: "complex",
    tags: ["static", "colorful", "organic"],
    created: "2026-03-02",
  },
};
