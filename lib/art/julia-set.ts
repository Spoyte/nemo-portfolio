// Julia Set Explorer - The Mandelbrot's complex sibling
// Shows how changing the seed constant (c) creates entirely different fractals
//
// While Mandelbrot varies c across the complex plane with z starting at 0,
// Julia sets fix c and vary the starting z position
//
// Mathematical beauty: Every point in the Mandelbrot set corresponds to a
// connected Julia set. Points outside create disconnected "dust" Julia sets.

import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// Color palettes for different visual moods
const PALETTES = {
  // Classic fiery fractal colors
  inferno: [
    [0, 0, 4], [31, 12, 72], [85, 15, 109], [136, 34, 106],
    [186, 54, 85], [227, 89, 66], [249, 140, 71], [252, 206, 127],
  ],
  // Ocean depths
  ocean: [
    [0, 0, 20], [0, 20, 60], [0, 40, 100], [0, 80, 140],
    [0, 120, 180], [40, 160, 200], [100, 200, 220], [180, 240, 255],
  ],
  // Electric/neon
  electric: [
    [10, 0, 30], [40, 0, 80], [80, 0, 140], [120, 0, 200],
    [160, 40, 255], [100, 200, 255], [0, 255, 200], [200, 255, 100],
  ],
  // Grayscale with subtle tint
  silver: [
    [0, 0, 0], [20, 20, 25], [50, 50, 60], [90, 90, 100],
    [140, 140, 150], [180, 180, 190], [220, 220, 230], [255, 255, 255],
  ],
  // Psychedelic
  psychedelic: [
    [60, 0, 80], [120, 0, 120], [200, 0, 100], [255, 80, 0],
    [255, 200, 0], [180, 255, 0], [0, 255, 150], [0, 150, 255],
  ],
};

// Interesting Julia set constants (c values) that produce beautiful patterns
const INTERESTING_SEEDS = [
  { re: -0.8, im: 0.156, name: "Dragon" },
  { re: -0.4, im: 0.6, name: "Douady Rabbit" },
  { re: 0.285, im: 0.01, name: "San Marco" },
  { re: -0.70176, im: -0.3842, name: "Siegel Disk" },
  { re: -0.835, im: -0.2321, name: "Dendrite" },
  { re: -0.7269, im: 0.1889, name: "Spiral" },
  { re: 0.3, im: 0.5, name: "Gaston Julia" },
  { re: -0.1, im: 0.651, name: "Elephant" },
  { re: -0.75, im: 0.11, name: "Mini Mandelbrot" },
  { re: -0.12, im: -0.77, name: "Cauliflower" },
];

interface JuliaParams extends ArtParams {
  cReal: number;
  cImag: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  maxIterations: number;
  palette: keyof typeof PALETTES;
  seedIndex: number;
  colorCycles: number;
  smoothColoring: boolean;
  showOrbit: boolean;
  orbitSpeed: number;
  bailout: number;
}

export const defaultParams: JuliaParams = {
  cReal: -0.8,
  cImag: 0.156,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  maxIterations: 100,
  palette: "inferno",
  seedIndex: 0,
  colorCycles: 1,
  smoothColoring: true,
  showOrbit: true,
  orbitSpeed: 0.5,
  bailout: 4,
};

export const params: Record<string, ParamConfig> = {
  cReal: {
    name: "C Real",
    type: "range",
    min: -2,
    max: 2,
    step: 0.001,
    default: -0.8,
  },
  cImag: {
    name: "C Imaginary",
    type: "range",
    min: -2,
    max: 2,
    step: 0.001,
    default: 0.156,
  },
  zoom: {
    name: "Zoom",
    type: "range",
    min: 0.1,
    max: 10,
    step: 0.1,
    default: 1,
  },
  offsetX: {
    name: "Pan X",
    type: "range",
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  offsetY: {
    name: "Pan Y",
    type: "range",
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  maxIterations: {
    name: "Iterations",
    type: "range",
    min: 20,
    max: 500,
    step: 10,
    default: 100,
  },
  palette: {
    name: "Color Palette",
    type: "select",
    options: ["inferno", "ocean", "electric", "silver", "psychedelic"],
    default: "inferno",
  },
  seedIndex: {
    name: "Preset Seed",
    type: "range",
    min: 0,
    max: 9,
    step: 1,
    default: 0,
  },
  colorCycles: {
    name: "Color Cycles",
    type: "range",
    min: 0.5,
    max: 5,
    step: 0.5,
    default: 1,
  },
  smoothColoring: {
    name: "Smooth Coloring",
    type: "boolean",
    default: true,
  },
  showOrbit: {
    name: "Show Orbit",
    type: "boolean",
    default: true,
  },
  orbitSpeed: {
    name: "Orbit Speed",
    type: "range",
    min: 0,
    max: 2,
    step: 0.1,
    default: 0.5,
  },
  bailout: {
    name: "Bailout Radius",
    type: "range",
    min: 2,
    max: 16,
    step: 1,
    default: 4,
  },
};

// Smooth coloring using log-log smoothing
function smoothIteration(
  zReal: number,
  zImag: number,
  iterations: number,
  maxIterations: number,
  bailout: number
): number {
  if (iterations >= maxIterations) return maxIterations;
  
  // Smooth iteration count for continuous coloring
  const logZn = Math.log(zReal * zReal + zImag * zImag) / 2;
  const nu = Math.log(logZn / Math.log(bailout)) / Math.log(2);
  return iterations + 1 - nu;
}

// Calculate Julia set iteration for a point
function iterateJulia(
  zr: number,
  zi: number,
  cr: number,
  ci: number,
  maxIter: number,
  bailout: number
): { iterations: number; finalZr: number; finalZi: number; escaped: boolean } {
  let zReal = zr;
  let zImag = zi;
  
  for (let i = 0; i < maxIter; i++) {
    const zr2 = zReal * zReal;
    const zi2 = zImag * zImag;
    
    if (zr2 + zi2 > bailout) {
      return { iterations: i, finalZr: zReal, finalZi: zImag, escaped: true };
    }
    
    // z = z² + c
    zImag = 2 * zReal * zImag + ci;
    zReal = zr2 - zi2 + cr;
  }
  
  return { iterations: maxIter, finalZr: zReal, finalZi: zImag, escaped: false };
}

// Get color from palette based on iteration count
function getColor(
  iterations: number,
  maxIterations: number,
  palette: number[][],
  colorCycles: number,
  smoothValue: number
): string {
  if (iterations >= maxIterations) {
    return "rgb(0, 0, 0)"; // Interior is black
  }
  
  // Map iteration to palette with color cycling
  const t = (smoothValue / maxIterations) * colorCycles;
  const normalizedT = t - Math.floor(t);
  
  // Interpolate between palette colors
  const paletteIndex = normalizedT * (palette.length - 1);
  const index1 = Math.floor(paletteIndex);
  const index2 = Math.min(index1 + 1, palette.length - 1);
  const frac = paletteIndex - index1;
  
  const c1 = palette[index1];
  const c2 = palette[index2];
  
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * frac);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * frac);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * frac);
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate orbit points for a starting position
function generateOrbit(
  zr: number,
  zi: number,
  cr: number,
  ci: number,
  steps: number
): Array<{ r: number; i: number }> {
  const orbit: Array<{ r: number; i: number }> = [{ r: zr, i: zi }];
  let zReal = zr;
  let zImag = zi;
  
  for (let i = 0; i < steps && orbit.length < 50; i++) {
    const zr2 = zReal * zReal;
    const zi2 = zImag * zImag;
    
    if (zr2 + zi2 > 100) break; // Orbit escaped
    
    zImag = 2 * zReal * zImag + ci;
    zReal = zr2 - zi2 + cr;
    
    orbit.push({ r: zReal, i: zImag });
  }
  
  return orbit;
}

export function renderJuliaSet(
  ctx: CanvasRenderingContext2D,
  params: JuliaParams,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Use preset seed if seedIndex changed
  let cReal = params.cReal;
  let cImag = params.cImag;
  
  const seedPreset = INTERESTING_SEEDS[Math.floor(params.seedIndex)];
  if (seedPreset) {
    cReal = seedPreset.re;
    cImag = seedPreset.im;
  }
  
  const palette = PALETTES[params.palette];
  const zoom = params.zoom;
  const offsetX = params.offsetX;
  const offsetY = params.offsetY;
  
  // Create image data for pixel manipulation
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Julia set bounds (typically -2 to 2 in both axes)
  const aspectRatio = width / height;
  const scale = 4 / (Math.min(width, height) * zoom);
  
  // Precompute palette as RGB arrays for speed
  const paletteRGB = palette.map(c => c);
  
  // Render the Julia set
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Map pixel to complex plane
      const zReal = (px - width / 2) * scale * aspectRatio + offsetX;
      const zImag = (py - height / 2) * scale + offsetY;
      
      // Iterate
      const result = iterateJulia(
        zReal,
        zImag,
        cReal,
        cImag,
        params.maxIterations,
        params.bailout
      );
      
      // Get color
      let smoothValue = result.iterations;
      if (params.smoothColoring && result.escaped) {
        smoothValue = smoothIteration(
          result.finalZr,
          result.finalZi,
          result.iterations,
          params.maxIterations,
          params.bailout
        );
      }
      
      const colorStr = getColor(
        result.iterations,
        params.maxIterations,
        paletteRGB,
        params.colorCycles,
        smoothValue
      );
      
      // Parse RGB
      const rgb = colorStr.match(/\d+/g);
      if (rgb) {
        const idx = (py * width + px) * 4;
        data[idx] = parseInt(rgb[0]);
        data[idx + 1] = parseInt(rgb[1]);
        data[idx + 2] = parseInt(rgb[2]);
        data[idx + 3] = 255;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Draw orbit visualization if enabled
  if (params.showOrbit) {
    // Animate orbit starting position
    const orbitTime = time * params.orbitSpeed * 0.5;
    const orbitRadius = 1.2;
    const orbitZr = Math.cos(orbitTime) * orbitRadius;
    const orbitZi = Math.sin(orbitTime * 0.7) * orbitRadius;
    
    // Generate orbit path
    const orbit = generateOrbit(orbitZr, orbitZi, cReal, cImag, 30);
    
    if (orbit.length > 1) {
      ctx.save();
      
      // Draw orbit trail
      ctx.beginPath();
      for (let i = 0; i < orbit.length; i++) {
        const px = width / 2 + (orbit[i].r - offsetX) / (scale * aspectRatio);
        const py = height / 2 + (orbit[i].i - offsetY) / scale;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      
      // Gradient stroke for orbit
      const gradient = ctx.createLinearGradient(
        width / 2 + (orbit[0].r - offsetX) / (scale * aspectRatio),
        height / 2 + (orbit[0].i - offsetY) / scale,
        width / 2 + (orbit[orbit.length - 1].r - offsetX) / (scale * aspectRatio),
        height / 2 + (orbit[orbit.length - 1].i - offsetY) / scale
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 100, 0.2)");
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw orbit points
      for (let i = 0; i < orbit.length; i++) {
        const px = width / 2 + (orbit[i].r - offsetX) / (scale * aspectRatio);
        const py = height / 2 + (orbit[i].i - offsetY) / scale;
        
        const alpha = 1 - i / orbit.length;
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(px, py, 3 * alpha + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Draw info overlay
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(10, 10, 200, 70);
  
  ctx.fillStyle = "#fff";
  ctx.font = "14px monospace";
  ctx.fillText(`c = ${cReal.toFixed(4)} ${cImag >= 0 ? "+" : ""}${cImag.toFixed(4)}i`, 20, 30);
  
  const seedName = seedPreset?.name || "Custom";
  ctx.fillText(seedName, 20, 50);
  ctx.fillText(`zoom: ${zoom.toFixed(2)}x`, 20, 70);
  ctx.restore();
}

export const juliaSet: ArtGenerator = {
  name: "Julia Set Explorer",
  description:
    "Explore Julia sets - the Mandelbrot's complex sibling. Each constant c creates a unique fractal landscape.",
  params,
  generate: renderJuliaSet,
};

// Export alias for backward compatibility
export const juliaSetDefaultParams = defaultParams;
export type JuliaSetParams = JuliaParams;
export { INTERESTING_SEEDS as JULIA_SEEDS };
