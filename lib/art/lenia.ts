import { ArtGenerator, ArtParams } from "../core";

interface LeniaParams {
  kernelRadius: number;
  growthCenter: number;
  growthWidth: number;
  dt: number;
  colorHue: number;
  saturation: number;
}

const DEFAULT_PARAMS: LeniaParams = {
  kernelRadius: 13,
  growthCenter: 0.15,
  growthWidth: 0.015,
  dt: 0.2,
  colorHue: 200,
  saturation: 70,
};

// Gaussian kernel for Lenia
function createKernel(radius: number): Float32Array {
  const size = radius * 2 + 1;
  const kernel = new Float32Array(size * size);
  const sigma = radius / 3;
  const sigma2 = 2 * sigma * sigma;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist <= radius) {
        // Smooth bell-shaped kernel (Gaussian-ish)
        const normalized = dist / radius;
        const value = Math.exp(-normalized * normalized * 4) * Math.cos(normalized * Math.PI / 2);
        kernel[y * size + x] = Math.max(0, value);
      }
    }
  }
  
  // Normalize
  const sum = kernel.reduce((a, b) => a + b, 0);
  if (sum > 0) {
    for (let i = 0; i < kernel.length; i++) {
      kernel[i] /= sum;
    }
  }
  
  return kernel;
}

// Growth function - determines how cells change based on neighbor sum
function growth(U: number, center: number, width: number): number {
  // Gaussian growth function centered at 'center' with width 'width'
  return 2 * Math.exp(-Math.pow((U - center) / width, 2) / 2) - 1;
}

export function renderLenia(
  ctx: CanvasRenderingContext2D,
  params: Partial<ArtParams>,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const leniaParams: LeniaParams = {
    ...DEFAULT_PARAMS,
    ...(params as Partial<LeniaParams>),
  };
  
  // Initialize grid on first frame or if seed changed
  const seed = params.seed || "default";
  const gridKey = `lenia-grid-${width}-${height}-${seed}`;
  const nextKey = `lenia-next-${width}-${height}-${seed}`;
  const kernelKey = `lenia-kernel-${leniaParams.kernelRadius}`;
  
  if (!(ctx as any)[gridKey]) {
    // Initialize with random clusters
    const grid = new Float32Array(width * height);
    const clusters = 15;
    
    for (let i = 0; i < clusters; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const r = 10 + Math.random() * 30;
      
      for (let y = Math.floor(cy - r); y < Math.ceil(cy + r); y++) {
        for (let x = Math.floor(cx - r); x < Math.ceil(cx + r); x++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < r) {
              const value = Math.exp(-dist * dist / (r * r / 4));
              grid[y * width + x] = Math.max(grid[y * width + x], value * (0.5 + Math.random() * 0.5));
            }
          }
        }
      }
    }
    
    (ctx as any)[gridKey] = grid;
    (ctx as any)[nextKey] = new Float32Array(width * height);
    (ctx as any)[kernelKey] = createKernel(leniaParams.kernelRadius);
    (ctx as any)[`lenia-init-${seed}`] = true;
  }
  
  const grid = (ctx as any)[gridKey] as Float32Array;
  const next = (ctx as any)[nextKey] as Float32Array;
  const kernel = (ctx as any)[kernelKey] as Float32Array;
  const kRadius = leniaParams.kernelRadius;
  const kSize = kRadius * 2 + 1;
  
  // Update grid using convolution
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      
      // Convolve with kernel
      for (let ky = 0; ky < kSize; ky++) {
        for (let kx = 0; kx < kSize; kx++) {
          const kVal = kernel[ky * kSize + kx];
          if (kVal === 0) continue;
          
          // Wrap around edges (toroidal)
          const gx = ((x + kx - kRadius) % width + width) % width;
          const gy = ((y + ky - kRadius) % height + height) % height;
          
          sum += grid[gy * width + gx] * kVal;
        }
      }
      
      // Apply growth function
      const current = grid[y * width + x];
      const g = growth(sum, leniaParams.growthCenter, leniaParams.growthWidth);
      
      // Update with clamping
      next[y * width + x] = Math.max(0, Math.min(1, current + leniaParams.dt * g));
    }
  }
  
  // Swap grids
  (ctx as any)[gridKey] = next;
  (ctx as any)[nextKey] = grid;
  
  // Render to canvas
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const hue = leniaParams.colorHue;
  const sat = leniaParams.saturation;
  
  for (let i = 0; i < width * height; i++) {
    const value = (ctx as any)[gridKey][i];
    const idx = i * 4;
    
    // Map value to color
    // Use HSL-like coloring: low values = dark, high = bright with hue
    const brightness = value * 255;
    const cellHue = (hue + value * 60) % 360;
    
    // Simple HSL to RGB conversion
    const c = (1 - Math.abs(2 * (value * 0.5 + 0.1) - 1)) * (sat / 100);
    const x = c * (1 - Math.abs(((cellHue / 60) % 2) - 1));
    const m = value * 0.5 + 0.1 - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (cellHue < 60) { r = c; g = x; b = 0; }
    else if (cellHue < 120) { r = x; g = c; b = 0; }
    else if (cellHue < 180) { r = 0; g = c; b = x; }
    else if (cellHue < 240) { r = 0; g = x; b = c; }
    else if (cellHue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    data[idx] = Math.floor((r + m) * 255);
    data[idx + 1] = Math.floor((g + m) * 255);
    data[idx + 2] = Math.floor((b + m) * 255);
    data[idx + 3] = 255;
  }
  
  ctx.putImageData(imageData, 0, 0);
}

export const lenia: ArtGenerator = {
  name: "Lenia",
  description: "Continuous cellular automata - smooth, lifelike patterns from floating-point states and kernel-based growth",
  params: {
    kernelRadius: {
      name: "Kernel Radius",
      type: "range",
      min: 5,
      max: 25,
      step: 1,
      default: 13,
    },
    growthCenter: {
      name: "Growth Center",
      type: "range",
      min: 0.05,
      max: 0.3,
      step: 0.005,
      default: 0.15,
    },
    growthWidth: {
      name: "Growth Width",
      type: "range",
      min: 0.005,
      max: 0.05,
      step: 0.005,
      default: 0.015,
    },
    dt: {
      name: "Time Step",
      type: "range",
      min: 0.05,
      max: 0.5,
      step: 0.05,
      default: 0.2,
    },
    colorHue: {
      name: "Base Hue",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 200,
    },
    saturation: {
      name: "Saturation",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 70,
    },
  },
  generate: renderLenia,
};

export { DEFAULT_PARAMS as defaultParams };
