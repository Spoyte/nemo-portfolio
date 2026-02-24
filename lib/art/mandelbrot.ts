// Mandelbrot Fractal Explorer
// Interactive fractal rendering with orbit trap coloring and smooth iteration counts

export interface MandelbrotParams {
  zoom: number;           // Zoom level (1 = full view)
  centerX: number;        // Center X coordinate (-0.5 is interesting)
  centerY: number;        // Center Y coordinate (0 is center)
  maxIterations: number;  // Detail level (higher = more detail, slower)
  colorScheme: string;    // Coloring algorithm
  escapeRadius: number;   // Escape radius (2.0 is standard)
}

export const mandelbrotDefaultParams: MandelbrotParams = {
  zoom: 1,
  centerX: -0.5,
  centerY: 0,
  maxIterations: 100,
  colorScheme: "smooth",
  escapeRadius: 2.0,
};

// Color schemes
const COLOR_SCHEMES: Record<string, (t: number) => { r: number; g: number; b: number }> = {
  // Smooth gradient through the spectrum
  smooth: (t) => {
    const hue = t * 360;
    return hslToRgb(hue, 80, 50);
  },
  // Fire colors
  fire: (t) => ({
    r: Math.floor(255 * Math.min(1, t * 3)),
    g: Math.floor(255 * Math.max(0, Math.min(1, (t - 0.33) * 3))),
    b: Math.floor(255 * Math.max(0, Math.min(1, (t - 0.66) * 3))),
  }),
  // Electric blues and purples
  electric: (t) => {
    const r = Math.floor(255 * Math.pow(t, 0.5) * 0.3);
    const g = Math.floor(255 * Math.pow(t, 2) * 0.5);
    const b = Math.floor(255 * (0.5 + 0.5 * Math.sin(t * Math.PI)));
    return { r, g, b };
  },
  // Grayscale with contrast
  grayscale: (t) => {
    const v = Math.floor(255 * Math.pow(t, 0.5));
    return { r: v, g: v, b: v };
  },
  // Neon cyberpunk
  neon: (t) => {
    const r = Math.floor(255 * Math.pow(Math.sin(t * Math.PI * 2), 2));
    const g = Math.floor(255 * Math.pow(Math.sin(t * Math.PI * 2 + 2), 2));
    const b = Math.floor(255 * Math.pow(Math.sin(t * Math.PI * 2 + 4), 2));
    return { r, g, b };
  },
  // Ocean depths
  ocean: (t) => ({
    r: Math.floor(20 + 40 * t),
    g: Math.floor(60 + 100 * t),
    b: Math.floor(120 + 135 * t),
  }),
};

// HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

// Compute smooth iteration count for a point
function computeSmoothIterations(
  cx: number,
  cy: number,
  maxIterations: number,
  escapeRadius: number
): number {
  let zx = 0;
  let zy = 0;
  let zx2 = 0;
  let zy2 = 0;
  
  for (let i = 0; i < maxIterations; i++) {
    zy = 2 * zx * zy + cy;
    zx = zx2 - zy2 + cx;
    zx2 = zx * zx;
    zy2 = zy * zy;
    
    if (zx2 + zy2 > escapeRadius * escapeRadius) {
      // Smooth coloring using log-log formula
      const logZn = Math.log(zx2 + zy2) / 2;
      const nu = Math.log(logZn / Math.log(escapeRadius)) / Math.log(2);
      return i + 1 - nu;
    }
  }
  
  return maxIterations;
}

// Render the Mandelbrot set
export function renderMandelbrot(
  ctx: CanvasRenderingContext2D,
  params: MandelbrotParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const { zoom, centerX, centerY, maxIterations, colorScheme, escapeRadius } = params;
  const colorFn = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.smooth;
  
  // Calculate view bounds
  const aspectRatio = width / height;
  const scale = 3.5 / zoom; // Base scale covers roughly (-2.5, 1) x (-1.75, 1.75)
  
  const xMin = centerX - scale * aspectRatio / 2;
  const xMax = centerX + scale * aspectRatio / 2;
  const yMin = centerY - scale / 2;
  const yMax = centerY + scale / 2;
  
  // Animated subtle color shift based on time
  const timeOffset = time * 0.0001;
  
  // Render with adaptive sampling for performance
  const sampleSize = zoom > 100 ? 1 : zoom > 10 ? 2 : 4;
  
  for (let py = 0; py < height; py += sampleSize) {
    for (let px = 0; px < width; px += sampleSize) {
      // Map pixel to complex plane
      const cx = xMin + (px / width) * (xMax - xMin);
      const cy = yMin + (py / height) * (yMax - yMin);
      
      // Compute iteration count
      const iterations = computeSmoothIterations(cx, cy, maxIterations, escapeRadius);
      
      // Color based on iteration count
      let r: number, g: number, b: number;
      
      if (iterations >= maxIterations) {
        // Inside the set - black
        r = g = b = 0;
      } else {
        // Normalize and apply color
        const t = ((iterations / maxIterations) + timeOffset) % 1;
        const color = colorFn(t);
        r = color.r;
        g = color.g;
        b = color.b;
      }
      
      // Fill sample block
      for (let dy = 0; dy < sampleSize && py + dy < height; dy++) {
        for (let dx = 0; dx < sampleSize && px + dx < width; dx++) {
          const idx = ((py + dy) * width + (px + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Predefined interesting locations
export const MANDELBROT_LOCATIONS = [
  { name: "Full View", centerX: -0.5, centerY: 0, zoom: 1 },
  { name: "Seahorse Valley", centerX: -0.75, centerY: 0.1, zoom: 10 },
  { name: "Elephant Valley", centerX: 0.3, centerY: 0, zoom: 15 },
  { name: "Triple Spiral", centerX: -0.088, centerY: 0.654, zoom: 50 },
  { name: "Mini Mandelbrot", centerX: -1.75, centerY: 0, zoom: 30 },
  { name: "Dendrite", centerX: 0, centerY: 1, zoom: 20 },
  { name: "Scepter", centerX: -1.25, centerY: 0.38, zoom: 100 },
  { name: "Lightning", centerX: -1.78, centerY: 0, zoom: 200 },
];
