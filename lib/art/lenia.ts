import { ArtGenerator, ArtParams, ParamType } from "./core";

// Lenia - Continuous Cellular Automata
// A generalization of Conway's Game of Life with continuous states
// Based on the work of Bert Chan: https://chakazul.github.io/lenia.html

export interface LeniaParams extends ArtParams {
  // Grid size
  gridSize: number;
  
  // Kernel parameters (growth function)
  kernelRadius: number;      // Radius of the neighborhood kernel
  kernelType: "gaussian" | "polynomial" | "exponential";
  
  // Growth function parameters
  growthCenter: number;      // Center of growth (mu)
  growthWidth: number;       // Width of growth (sigma)
  growthType: "gaussian" | "linear" | "polynomial";
  
  // Time step
  dt: number;                // Time step size
  
  // Initial pattern
  initialPattern: "random" | "glider" | "orbium" | "cell" | "scatter";
  initialDensity: number;    // For random initialization
  
  // Visual parameters
  colorScheme: "heatmap" | "ocean" | "fire" | "life" | "cosmic";
  showTrails: boolean;
  trailDecay: number;
  
  // Simulation control
  stepsPerFrame: number;
  
  // Mutation (for evolving patterns)
  mutationRate: number;
  autoEvolve: boolean;
}

export const leniaDefaultParams: LeniaParams = {
  gridSize: 128,
  kernelRadius: 13,
  kernelType: "gaussian",
  growthCenter: 0.15,
  growthWidth: 0.015,
  growthType: "gaussian",
  dt: 0.1,
  initialPattern: "orbium",
  initialDensity: 0.1,
  colorScheme: "ocean",
  showTrails: true,
  trailDecay: 0.95,
  stepsPerFrame: 1,
  mutationRate: 0,
  autoEvolve: false,
};

// Gaussian function for kernel and growth
function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

// Create the convolution kernel (bell-shaped neighborhood)
function createKernel(radius: number, type: string): Float32Array {
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size * size);
  let sum = 0;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const dist = Math.sqrt(dx * dx + dy * dy) / radius;
      
      let value = 0;
      if (dist <= 1) {
        switch (type) {
          case "gaussian":
            // Bell curve peaking at r=0.5
            value = gaussian(dist, 0.5, 0.15);
            break;
          case "polynomial":
            // Smooth polynomial falloff
            value = Math.pow(1 - dist, 2) * (2 * dist + 1);
            break;
          case "exponential":
            value = Math.exp(-dist * 4);
            break;
        }
      }
      
      kernel[y * size + x] = value;
      sum += value;
    }
  }
  
  // Normalize kernel
  if (sum > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= sum;
    }
  }
  
  return kernel;
}

// Growth function: determines how cells grow based on neighborhood
function growth(neighborhood: number, center: number, width: number, type: string): number {
  switch (type) {
    case "gaussian":
      return gaussian(neighborhood, center, width) * 2 - 1;
    case "linear":
      const diff = neighborhood - center;
      return diff > -width && diff < width ? (1 - Math.abs(diff) / width) * 2 - 1 : -1;
    case "polynomial":
      const d = (neighborhood - center) / width;
      if (Math.abs(d) > 1) return -1;
      return (1 - d * d) * 2 - 1;
    default:
      return 0;
  }
}

// Initialize the grid with a pattern
function initializeGrid(grid: Float32Array, size: number, pattern: string, density: number): void {
  const center = Math.floor(size / 2);
  
  switch (pattern) {
    case "random":
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < density ? Math.random() : 0;
      }
      break;
      
    case "scatter":
      for (let i = 0; i < grid.length; i++) {
        if (Math.random() < 0.02) {
          const cx = i % size;
          const cy = Math.floor(i / size);
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const nx = (cx + dx + size) % size;
              const ny = (cy + dy + size) % size;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist <= 3) {
                grid[ny * size + nx] = Math.max(0, 1 - dist / 3) * Math.random();
              }
            }
          }
        }
      }
      break;
      
    case "glider":
      // A simple glider-like pattern
      const gliderPattern = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          grid[(center + y) * size + (center + x)] = gliderPattern[y][x];
        }
      }
      break;
      
    case "orbium":
      // The famous "Orbium" pattern - a self-propelling creature in Lenia
      // This is an approximation of the classic Lenia species
      const orbiumPattern = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0, 0],
        [0, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 0, 0],
        [0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0],
        [0, 0, 0, 0.5, 1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const offsetY = center - 7;
      const offsetX = center - 7;
      for (let y = 0; y < orbiumPattern.length; y++) {
        for (let x = 0; x < orbiumPattern[y].length; x++) {
          const py = (offsetY + y + size) % size;
          const px = (offsetX + x + size) % size;
          grid[py * size + px] = orbiumPattern[y][x];
        }
      }
      break;
      
    case "cell":
      // Single cell with smooth falloff
      for (let y = -5; y <= 5; y++) {
        for (let x = -5; x <= 5; x++) {
          const dist = Math.sqrt(x * x + y * y);
          if (dist <= 5) {
            const py = (center + y + size) % size;
            const px = (center + x + size) % size;
            grid[py * size + px] = Math.max(0, 1 - dist / 5);
          }
        }
      }
      break;
  }
}

// Get color from value based on color scheme
function getColor(value: number, scheme: string, trail: number): [number, number, number] {
  // Combine current value with trail
  const v = Math.max(value, trail * 0.3);
  
  switch (scheme) {
    case "heatmap":
      // Black → Blue → Cyan → Green → Yellow → Red → White
      if (v < 0.17) return [0, 0, v * 6 * 128];
      if (v < 0.33) return [0, (v - 0.17) * 6 * 255, 128 + (v - 0.17) * 6 * 127];
      if (v < 0.5) return [0, 255, 255 - (v - 0.33) * 6 * 255];
      if (v < 0.67) return [(v - 0.5) * 6 * 255, 255, 0];
      if (v < 0.83) return [255, 255 - (v - 0.67) * 6 * 255, 0];
      return [255, (v - 0.83) * 6 * 255, (v - 0.83) * 6 * 255];
      
    case "ocean":
      // Deep ocean blues and teals
      const oceanR = Math.floor(v * 50);
      const oceanG = Math.floor(v * 150 + 50);
      const oceanB = Math.floor(v * 100 + 155);
      return [oceanR, oceanG, oceanB];
      
    case "fire":
      // Fire: black → red → orange → yellow → white
      const fireR = Math.min(255, v * 400);
      const fireG = Math.max(0, Math.min(255, (v - 0.3) * 400));
      const fireB = Math.max(0, Math.min(255, (v - 0.6) * 400));
      return [fireR, fireG, fireB];
      
    case "life":
      // Classic green "matrix" life
      const lifeG = Math.floor(v * 200 + 55);
      return [0, lifeG, Math.floor(v * 50)];
      
    case "cosmic":
      // Purple/pink cosmic theme
      const cosmicR = Math.floor(v * 200 + 55);
      const cosmicG = Math.floor(v * 100);
      const cosmicB = Math.floor(v * 255);
      return [cosmicR, cosmicG, cosmicB];
      
    default:
      const gray = Math.floor(v * 255);
      return [gray, gray, gray];
  }
}

export function renderLenia(
  ctx: CanvasRenderingContext2D,
  params: LeniaParams,
  frame: number,
  gridState?: { grid: Float32Array; nextGrid: Float32Array; trail: Float32Array; kernel: Float32Array }
): { grid: Float32Array; nextGrid: Float32Array; trail: Float32Array; kernel: Float32Array } {
  const { width, height } = ctx.canvas;
  const size = params.gridSize;
  
  // Initialize state on first frame
  if (!gridState || frame === 0) {
    const grid = new Float32Array(size * size);
    const nextGrid = new Float32Array(size * size);
    const trail = new Float32Array(size * size);
    const kernel = createKernel(params.kernelRadius, params.kernelType);
    
    initializeGrid(grid, size, params.initialPattern, params.initialDensity);
    
    gridState = { grid, nextGrid, trail, kernel };
  }
  
  const { grid, nextGrid, trail, kernel } = gridState;
  const kernelSize = params.kernelRadius * 2 + 1;
  
  // Run multiple simulation steps per frame if requested
  for (let step = 0; step < params.stepsPerFrame; step++) {
    // Convolution and growth for each cell
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Compute convolution with kernel
        let neighborhood = 0;
        
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const ny = (y + ky - params.kernelRadius + size) % size;
            const nx = (x + kx - params.kernelRadius + size) % size;
            neighborhood += grid[ny * size + nx] * kernel[ky * kernelSize + kx];
          }
        }
        
        // Apply growth function
        const g = growth(neighborhood, params.growthCenter, params.growthWidth, params.growthType);
        
        // Update cell state
        let newValue = grid[y * size + x] + params.dt * g;
        newValue = Math.max(0, Math.min(1, newValue)); // Clamp to [0, 1]
        
        // Apply mutation if enabled
        if (params.autoEvolve && Math.random() < params.mutationRate * 0.001) {
          newValue = Math.random();
        }
        
        nextGrid[y * size + x] = newValue;
      }
    }
    
    // Swap grids
    for (let i = 0; i < grid.length; i++) {
      grid[i] = nextGrid[i];
    }
  }
  
  // Update trails
  if (params.showTrails) {
    for (let i = 0; i < trail.length; i++) {
      trail[i] = trail[i] * params.trailDecay + grid[i] * (1 - params.trailDecay);
    }
  }
  
  // Render to canvas
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const pixelIdx = idx * 4;
      const value = grid[idx];
      const trailValue = params.showTrails ? trail[idx] : 0;
      
      const [r, g, b] = getColor(value, params.colorScheme, trailValue);
      
      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = 255;
    }
  }
  
  // Create temporary canvas for scaling
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = size;
  tempCanvas.height = size;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Scale to fit display canvas with smooth interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(tempCanvas, 0, 0, width, height);
  
  return { grid, nextGrid, trail, kernel };
}

export const lenia: ArtGenerator = {
  name: "Lenia",
  description: "Continuous cellular automata with smooth states and growth functions. Self-organizing artificial life that creates living, breathing organic patterns.",
  params: [
    {
      name: "gridSize",
      type: ParamType.RANGE,
      min: 64,
      max: 256,
      step: 32,
      default: 128,
      label: "Grid Size",
    },
    {
      name: "kernelRadius",
      type: ParamType.RANGE,
      min: 5,
      max: 25,
      step: 1,
      default: 13,
      label: "Kernel Radius",
    },
    {
      name: "kernelType",
      type: ParamType.SELECT,
      options: ["gaussian", "polynomial", "exponential"],
      default: "gaussian",
      label: "Kernel Type",
    },
    {
      name: "growthCenter",
      type: ParamType.RANGE,
      min: 0.05,
      max: 0.5,
      step: 0.005,
      default: 0.15,
      label: "Growth Center",
    },
    {
      name: "growthWidth",
      type: ParamType.RANGE,
      min: 0.005,
      max: 0.1,
      step: 0.001,
      default: 0.015,
      label: "Growth Width",
    },
    {
      name: "growthType",
      type: ParamType.SELECT,
      options: ["gaussian", "linear", "polynomial"],
      default: "gaussian",
      label: "Growth Type",
    },
    {
      name: "dt",
      type: ParamType.RANGE,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      default: 0.1,
      label: "Time Step",
    },
    {
      name: "initialPattern",
      type: ParamType.SELECT,
      options: ["random", "scatter", "glider", "orbium", "cell"],
      default: "orbium",
      label: "Initial Pattern",
    },
    {
      name: "initialDensity",
      type: ParamType.RANGE,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      default: 0.1,
      label: "Initial Density",
    },
    {
      name: "colorScheme",
      type: ParamType.SELECT,
      options: ["heatmap", "ocean", "fire", "life", "cosmic"],
      default: "ocean",
      label: "Color Scheme",
    },
    {
      name: "showTrails",
      type: ParamType.BOOLEAN,
      default: true,
      label: "Show Trails",
    },
    {
      name: "trailDecay",
      type: ParamType.RANGE,
      min: 0.5,
      max: 0.99,
      step: 0.01,
      default: 0.95,
      label: "Trail Decay",
    },
    {
      name: "stepsPerFrame",
      type: ParamType.RANGE,
      min: 1,
      max: 5,
      step: 1,
      default: 1,
      label: "Steps Per Frame",
    },
    {
      name: "mutationRate",
      type: ParamType.RANGE,
      min: 0,
      max: 1,
      step: 0.01,
      default: 0,
      label: "Mutation Rate",
    },
    {
      name: "autoEvolve",
      type: ParamType.BOOLEAN,
      default: false,
      label: "Auto Evolve",
    },
  ],
  defaultParams: leniaDefaultParams,
  render: renderLenia,
};
