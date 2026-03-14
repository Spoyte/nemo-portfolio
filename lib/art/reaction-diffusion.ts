import { ArtGenerator, fillCanvas, SeededRandom } from "./core";

// Gray-Scott Reaction-Diffusion Model
// Two chemicals: U (substrate) and V (activator)
// Reaction: U + 2V -> 3V (converts U to V)
// U is continuously fed, V is continuously removed

export const reactionDiffusion: ArtGenerator = {
  name: "Reaction Diffusion",
  description: "Emergent patterns from chemical reaction simulation (Gray-Scott model)",
  params: {
    feedRate: {
      name: "Feed Rate (F)",
      type: "range",
      min: 0.01,
      max: 0.1,
      step: 0.001,
      default: 0.0545,
    },
    killRate: {
      name: "Kill Rate (k)",
      type: "range",
      min: 0.01,
      max: 0.08,
      step: 0.001,
      default: 0.062,
    },
    diffusionU: {
      name: "Diffusion U",
      type: "range",
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.0,
    },
    diffusionV: {
      name: "Diffusion V",
      type: "range",
      min: 0.1,
      max: 1.0,
      step: 0.05,
      default: 0.5,
    },
    iterations: {
      name: "Iterations",
      type: "range",
      min: 1000,
      max: 10000,
      step: 500,
      default: 5000,
    },
    pattern: {
      name: "Initial Pattern",
      type: "select",
      options: ["center", "random", "stripes", "spots"],
      default: "center",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["coral", "electric", "fire", "ocean", "neon"],
      default: "coral",
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
    const { 
      feedRate, 
      killRate, 
      diffusionU, 
      diffusionV, 
      iterations, 
      pattern, 
      colorScheme,
      seed 
    } = params;
    const rng = new SeededRandom(seed as number);

    // Grid size - smaller for performance, scaled up for display
    const gridSize = 128;
    const scale = canvas.width / gridSize;

    // Initialize grids
    let u: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(1));
    let v: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

    const F = feedRate as number;
    const k = killRate as number;
    const Du = diffusionU as number;
    const Dv = diffusionV as number;
    const steps = iterations as number;
    const initialPattern = pattern as string;

    // Seed initial V concentration based on pattern
    const center = Math.floor(gridSize / 2);
    const radius = Math.floor(gridSize / 8);

    if (initialPattern === "center") {
      // Central square of V
      for (let y = center - radius; y < center + radius; y++) {
        for (let x = center - radius; x < center + radius; x++) {
          if (y >= 0 && y < gridSize && x >= 0 && x < gridSize) {
            v[y][x] = 1;
            u[y][x] = 0;
          }
        }
      }
    } else if (initialPattern === "random") {
      // Random spots
      const numSpots = 5 + Math.floor(rng.random() * 10);
      for (let s = 0; s < numSpots; s++) {
        const sx = Math.floor(rng.random() * (gridSize - 20)) + 10;
        const sy = Math.floor(rng.random() * (gridSize - 20)) + 10;
        const sr = 3 + Math.floor(rng.random() * 5);
        for (let y = sy - sr; y < sy + sr; y++) {
          for (let x = sx - sr; x < sx + sr; x++) {
            if (y >= 0 && y < gridSize && x >= 0 && x < gridSize) {
              v[y][x] = 1;
              u[y][x] = 0;
            }
          }
        }
      }
    } else if (initialPattern === "stripes") {
      // Vertical stripes
      for (let x = 0; x < gridSize; x += 8) {
        for (let y = 0; y < gridSize; y++) {
          if (x < gridSize) {
            v[y][x] = 1;
            u[y][x] = 0;
          }
        }
      }
    } else if (initialPattern === "spots") {
      // Grid of spots
      for (let y = 10; y < gridSize; y += 20) {
        for (let x = 10; x < gridSize; x += 20) {
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < gridSize && nx >= 0 && nx < gridSize) {
                v[ny][nx] = 1;
                u[ny][nx] = 0;
              }
            }
          }
        }
      }
    }

    // Simulation loop
    for (let iter = 0; iter < steps; iter++) {
      const newU: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
      const newV: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const uVal = u[y][x];
          const vVal = v[y][x];

          // Laplacian (diffusion) - using 5-point stencil
          let laplaceU = -4 * uVal;
          let laplaceV = -4 * vVal;

          if (x > 0) {
            laplaceU += u[y][x - 1];
            laplaceV += v[y][x - 1];
          }
          if (x < gridSize - 1) {
            laplaceU += u[y][x + 1];
            laplaceV += v[y][x + 1];
          }
          if (y > 0) {
            laplaceU += u[y - 1][x];
            laplaceV += v[y - 1][x];
          }
          if (y < gridSize - 1) {
            laplaceU += u[y + 1][x];
            laplaceV += v[y + 1][x];
          }

          // Reaction: U + 2V -> 3V
          const reaction = uVal * vVal * vVal;

          // Update equations
          newU[y][x] = uVal + Du * laplaceU - reaction + F * (1 - uVal);
          newV[y][x] = vVal + Dv * laplaceV + reaction - (F + k) * vVal;

          // Clamp values
          newU[y][x] = Math.max(0, Math.min(1, newU[y][x]));
          newV[y][x] = Math.max(0, Math.min(1, newV[y][x]));
        }
      }

      u = newU;
      v = newV;
    }

    // Render
    fillCanvas(ctx, "#0a0a0a", canvas.width, canvas.height);

    const scheme = colorScheme as string;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const vVal = v[y][x];
        const uVal = u[y][x];
        
        // Skip empty cells
        if (vVal < 0.01) continue;

        // Color mapping based on scheme
        let r = 0, g = 0, b = 0;
        const intensity = Math.min(1, vVal * 2);

        switch (scheme) {
          case "coral":
            // Pink/orange coral-like colors
            r = Math.floor(255 * intensity);
            g = Math.floor(100 * intensity + 50 * uVal);
            b = Math.floor(150 * intensity * (1 - vVal));
            break;
          case "electric":
            // Cyan/purple electric
            r = Math.floor(100 * intensity);
            g = Math.floor(200 * intensity + 55 * uVal);
            b = Math.floor(255 * intensity);
            break;
          case "fire":
            // Red/yellow flames
            r = Math.floor(255 * intensity);
            g = Math.floor(150 * intensity * vVal + 50);
            b = Math.floor(50 * intensity * (1 - vVal));
            break;
          case "ocean":
            // Deep blue/teal
            r = Math.floor(50 * intensity * (1 - vVal));
            g = Math.floor(150 * intensity + 50 * uVal);
            b = Math.floor(200 * intensity + 55);
            break;
          case "neon":
            // Green/yellow neon
            r = Math.floor(150 * intensity * vVal);
            g = Math.floor(255 * intensity);
            b = Math.floor(100 * intensity * uVal);
            break;
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x * scale, y * scale, scale + 1, scale + 1);
      }
    }
  },
};
