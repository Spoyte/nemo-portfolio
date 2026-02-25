import { ArtGenerator, ArtParams, ParamConfig } from "./core";

export interface FractalFlameParams extends ArtParams {
  iterations: number;
  colorScheme: 'inferno' | 'ocean' | 'forest' | 'cosmic' | 'sunset' | 'monochrome';
  symmetry: number;
  brightness: number;
  gamma: number;
  seed: number;
  animate: boolean;
}

export const fractalFlameDefaultParams: FractalFlameParams = {
  iterations: 50000,
  colorScheme: 'inferno',
  symmetry: 1,
  brightness: 1.5,
  gamma: 2.2,
  seed: Math.random() * 1000,
  animate: true,
};

// Color schemes for different flame moods
const COLOR_SCHEMES: Record<string, Array<{r: number, g: number, b: number}>> = {
  inferno: [
    {r: 0, g: 0, b: 0},
    {r: 40, g: 0, b: 0},
    {r: 120, g: 0, b: 0},
    {r: 200, g: 40, b: 0},
    {r: 255, g: 120, b: 0},
    {r: 255, g: 200, b: 50},
    {r: 255, g: 255, b: 150},
  ],
  ocean: [
    {r: 0, g: 0, b: 40},
    {r: 0, g: 40, b: 80},
    {r: 0, g: 80, b: 120},
    {r: 0, g: 120, b: 160},
    {r: 0, g: 160, b: 200},
    {r: 50, g: 200, b: 220},
    {r: 150, g: 230, b: 255},
  ],
  forest: [
    {r: 0, g: 20, b: 0},
    {r: 0, g: 60, b: 10},
    {r: 20, g: 100, b: 20},
    {r: 60, g: 140, b: 40},
    {r: 100, g: 180, b: 60},
    {r: 150, g: 210, b: 80},
    {r: 200, g: 240, b: 120},
  ],
  cosmic: [
    {r: 10, g: 0, b: 30},
    {r: 60, g: 0, b: 80},
    {r: 120, g: 0, b: 120},
    {r: 180, g: 50, b: 180},
    {r: 100, g: 100, b: 255},
    {r: 50, g: 200, b: 255},
    {r: 200, g: 255, b: 255},
  ],
  sunset: [
    {r: 60, g: 20, b: 60},
    {r: 120, g: 40, b: 80},
    {r: 180, g: 60, b: 80},
    {r: 220, g: 100, b: 60},
    {r: 240, g: 160, b: 40},
    {r: 255, g: 200, b: 80},
    {r: 255, g: 240, b: 200},
  ],
  monochrome: [
    {r: 0, g: 0, b: 0},
    {r: 40, g: 40, b: 40},
    {r: 80, g: 80, b: 80},
    {r: 120, g: 120, b: 120},
    {r: 160, g: 160, b: 160},
    {r: 200, g: 200, b: 200},
    {r: 255, g: 255, b: 255},
  ],
};

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

// Variation functions for IFS
const variations: Array<(x: number, y: number) => [number, number]> = [
  // Linear
  (x, y) => [x, y],
  // Sinusoidal
  (x, y) => [Math.sin(x), Math.sin(y)],
  // Spherical
  (x, y) => {
    const r2 = x * x + y * y;
    return r2 > 0 ? [x / r2, y / r2] : [0, 0];
  },
  // Swirl
  (x, y) => {
    const r2 = x * x + y * y;
    const c = Math.cos(r2);
    const s = Math.sin(r2);
    return [x * s - y * c, x * c + y * s];
  },
  // Horseshoe
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    return r > 0 ? [(x - y) * (x + y) / r, 2 * x * y / r] : [0, 0];
  },
  // Polar
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [theta / Math.PI, r - 1];
  },
  // Handkerchief
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [r * Math.sin(theta + r), r * Math.cos(theta - r)];
  },
  // Heart
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [r * Math.sin(theta * r), -r * Math.cos(theta * r)];
  },
  // Disc
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [theta / Math.PI * Math.sin(Math.PI * r), theta / Math.PI * Math.cos(Math.PI * r)];
  },
  // Spiral
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [(Math.cos(theta) + Math.sin(r)) / r, (Math.sin(theta) - Math.cos(r)) / r];
  },
  // Hyperbolic
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [Math.sin(theta) / r, r * Math.cos(theta)];
  },
  // Diamond
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [Math.sin(theta) * Math.cos(r), Math.cos(theta) * Math.sin(r)];
  },
  // Ex
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    const p0 = Math.sin(theta + r);
    const p1 = Math.cos(theta - r);
    return [r * (p0 * p0 * p0 + p1 * p1 * p1), r * (p0 * p0 * p0 - p1 * p1 * p1)];
  },
  // Julia
  (x, y) => {
    const r = Math.sqrt(Math.sqrt(x * x + y * y));
    const theta = Math.atan2(y, x) * 0.5;
    const omega = Math.random() < 0.5 ? theta : theta + Math.PI;
    return [r * Math.cos(omega), r * Math.sin(omega)];
  },
  // Bent
  (x, y) => {
    const nx = x >= 0 ? x : 2 * x;
    const ny = y >= 0 ? y : y * 0.5;
    return [nx, ny];
  },
  // Waves
  (x, y) => {
    return [x + 0.5 * Math.sin(y / 0.5), y + 0.25 * Math.sin(x / 0.5)];
  },
  // Fisheye
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const factor = 2 / (r + 1);
    return [factor * y, factor * x];
  },
  // Popcorn
  (x, y) => {
    return [x + 0.05 * Math.sin(Math.tan(3 * y)), y + 0.05 * Math.sin(Math.tan(3 * x))];
  },
  // Exponential
  (x, y) => {
    return [Math.exp(x - 1) * Math.cos(Math.PI * y), Math.exp(x - 1) * Math.sin(Math.PI * y)];
  },
  // Power
  (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return [Math.pow(r, Math.sin(theta)) * Math.cos(theta), Math.pow(r, Math.sin(theta)) * Math.sin(theta)];
  },
];

// Transform with affine coefficients and variation
interface Transform {
  a: number; b: number; c: number;
  d: number; e: number; f: number;
  variation: (x: number, y: number) => [number, number];
  colorIndex: number;
  weight: number;
}

// Generate random transforms
function generateTransforms(rand: () => number, count: number): Transform[] {
  const transforms: Transform[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random affine coefficients (biased toward contractive transforms)
    const a = (rand() - 0.5) * 1.2;
    const b = (rand() - 0.5) * 1.2;
    const c = (rand() - 0.5) * 2;
    const d = (rand() - 0.5) * 1.2;
    const e = (rand() - 0.5) * 1.2;
    const f = (rand() - 0.5) * 2;
    
    // Random variation
    const variationIndex = Math.floor(rand() * variations.length);
    
    transforms.push({
      a, b, c, d, e, f,
      variation: variations[variationIndex],
      colorIndex: rand(),
      weight: rand(),
    });
  }
  
  return transforms;
}

// Apply affine transform followed by variation
function applyTransform(x: number, y: number, t: Transform): [number, number] {
  // Affine transform
  const nx = t.a * x + t.b * y + t.c;
  const ny = t.d * x + t.e * y + t.f;
  // Variation
  return t.variation(nx, ny);
}

// Render the fractal flame
export function renderFractalFlame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FractalFlameParams
): void {
  const rand = seededRandom(params.seed);
  const colors = COLOR_SCHEMES[params.colorScheme];
  
  // Generate transforms
  const numTransforms = 6;
  const transforms = generateTransforms(rand, numTransforms);
  
  // Calculate cumulative weights for selection
  const totalWeight = transforms.reduce((sum, t) => sum + t.weight, 0);
  const cumulativeWeights = transforms.map((t, i) => 
    transforms.slice(0, i + 1).reduce((sum, tr) => sum + tr.weight, 0) / totalWeight
  );
  
  // Animation offset
  const animOffset = params.animate ? time * 0.0001 : 0;
  
  // Initialize histogram for density estimation
  const scale = 0.5; // Downsample for performance
  const histWidth = Math.floor(width * scale);
  const histHeight = Math.floor(height * scale);
  const histogram: Float64Array[] = [];
  const colorAccumulator: Array<{r: number, g: number, b: number, count: number}> = [];
  
  for (let i = 0; i < histWidth * histHeight; i++) {
    histogram[i] = new Float64Array(3);
    colorAccumulator[i] = {r: 0, g: 0, b: 0, count: 0};
  }
  
  // Chaos game iteration
  let x = rand() * 2 - 1;
  let y = rand() * 2 - 1;
  let currentColor = rand();
  
  // Skip first 20 iterations (settling)
  for (let i = 0; i < 20; i++) {
    const r = rand();
    const tIndex = cumulativeWeights.findIndex(w => r <= w);
    const t = transforms[tIndex];
    [x, y] = applyTransform(x, y, t);
    currentColor = (currentColor + t.colorIndex) * 0.5;
  }
  
  // Main iteration loop
  const iterations = params.iterations;
  for (let i = 0; i < iterations; i++) {
    // Select transform based on weight
    const r = rand();
    const tIndex = cumulativeWeights.findIndex(w => r <= w);
    const t = transforms[tIndex];
    
    // Apply transform
    [x, y] = applyTransform(x, y, t);
    
    // Update color
    currentColor = (currentColor + t.colorIndex) * 0.5;
    
    // Apply symmetry
    const symAngle = (2 * Math.PI) / params.symmetry;
    
    for (let s = 0; s < params.symmetry; s++) {
      const angle = s * symAngle + animOffset;
      const sx = x * Math.cos(angle) - y * Math.sin(angle);
      const sy = x * Math.sin(angle) + y * Math.cos(angle);
      
      // Map to histogram coordinates
      const hx = Math.floor((sx + 1) * 0.5 * histWidth);
      const hy = Math.floor((sy + 1) * 0.5 * histHeight);
      
      if (hx >= 0 && hx < histWidth && hy >= 0 && hy < histHeight) {
        const idx = hy * histWidth + hx;
        const colorIdx = Math.floor(currentColor * (colors.length - 1));
        const color = colors[Math.min(colorIdx, colors.length - 1)];
        
        // Accumulate color
        colorAccumulator[idx].r += color.r;
        colorAccumulator[idx].g += color.g;
        colorAccumulator[idx].b += color.b;
        colorAccumulator[idx].count += 1;
        
        // Increment density
        histogram[idx][0] += 1;
      }
    }
  }
  
  // Find maximum density for normalization
  let maxDensity = 0;
  for (let i = 0; i < histWidth * histHeight; i++) {
    maxDensity = Math.max(maxDensity, histogram[i][0]);
  }
  
  // Create image data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Render with supersampling
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Map to histogram coordinates
      const hx = Math.floor((px / width) * histWidth);
      const hy = Math.floor((py / height) * histHeight);
      const idx = hy * histWidth + hx;
      
      const density = histogram[idx][0];
      const acc = colorAccumulator[idx];
      
      let r = 0, g = 0, b = 0;
      
      if (density > 0 && acc.count > 0) {
        // Average color
        r = acc.r / acc.count;
        g = acc.g / acc.count;
        b = acc.b / acc.count;
        
        // Apply gamma correction and brightness
        const normalizedDensity = density / maxDensity;
        const brightness = params.brightness * Math.pow(normalizedDensity, 1 / params.gamma);
        
        r = Math.min(255, r * brightness);
        g = Math.min(255, g * brightness);
        b = Math.min(255, b * brightness);
      }
      
      const pixelIdx = (py * width + px) * 4;
      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Parameter configuration for UI
const fractalFlameParamsConfig: Record<string, ParamConfig> = {
  iterations: {
    name: 'iterations',
    type: 'range',
    min: 10000,
    max: 200000,
    step: 10000,
    default: 50000,
  },
  colorScheme: {
    name: 'colorScheme',
    type: 'select',
    options: ['inferno', 'ocean', 'forest', 'cosmic', 'sunset', 'monochrome'],
    default: 'inferno',
  },
  symmetry: {
    name: 'symmetry',
    type: 'range',
    min: 1,
    max: 8,
    step: 1,
    default: 1,
  },
  brightness: {
    name: 'brightness',
    type: 'range',
    min: 0.5,
    max: 3,
    step: 0.1,
    default: 1.5,
  },
  gamma: {
    name: 'gamma',
    type: 'range',
    min: 1,
    max: 4,
    step: 0.1,
    default: 2.2,
  },
  seed: {
    name: 'seed',
    type: 'range',
    min: 0,
    max: 10000,
    step: 1,
    default: Math.random() * 1000,
  },
  animate: {
    name: 'animate',
    type: 'select',
    options: ['true', 'false'],
    default: 'true',
  },
};

// Art generator definition
export const fractalFlame: ArtGenerator = {
  name: "Fractal Flame",
  description: "Iterated Function System generating organic, coral-like fractal structures through chaos game iteration with non-linear variations.",
  params: fractalFlameParamsConfig,
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time: number = 0) => {
    renderFractalFlame(ctx, ctx.canvas.width, ctx.canvas.height, time, params as FractalFlameParams);
  },
};
