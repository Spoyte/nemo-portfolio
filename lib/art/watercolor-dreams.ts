import { ArtGenerator, ArtParams, fillCanvas, createNoise, hslToRgb } from "./core";

// Watercolor Dreams - Traditional media simulation
// Simulates pigment diffusion, paper texture, backruns, and wet-on-wet bleeding

interface WatercolorParams extends ArtParams {
  palette: string;
  paperType: string;
  wetness: number;
  pigmentDensity: number;
  bloomIntensity: number;
  brushSize: number;
  layerCount: number;
  granulation: number;
  diffusionRate: number;
  seed: number;
}

const PALETTES: Record<string, string[]> = {
  "sunset-glow": ["#ff6b6b", "#f9ca24", "#f0932b", "#eb4d4b", "#6c5ce7", "#a29bfe"],
  "ocean-mist": ["#74b9ff", "#0984e3", "#00cec9", "#81ecec", "#dfe6e9", "#636e72"],
  "forest-dew": ["#55efc4", "#00b894", "#00cec9", "#b8e994", "#78e08f", "#38ada9"],
  "rose-garden": ["#fd79a8", "#e84393", "#ff7675", "#fab1a0", "#fdcb6e", "#6c5ce7"],
  "monochrome-ink": ["#2d3436", "#636e72", "#b2bec3", "#dfe6e9", "#74b9ff", "#0984e3"],
  "autumn-leaves": ["#e17055", "#d63031", "#fdcb6e", "#e84393", "#f39c12", "#c0392b"],
};

const PAPER_TEXTURES: Record<string, { roughness: number; absorbency: number; color: string }> = {
  "cold-pressed": { roughness: 0.7, absorbency: 0.6, color: "#f8f6f0" },
  "hot-pressed": { roughness: 0.3, absorbency: 0.4, color: "#faf9f6" },
  "rough": { roughness: 1.0, absorbency: 0.8, color: "#f5f3ec" },
  "tinted-cream": { roughness: 0.5, absorbency: 0.5, color: "#f5f0e6" },
  "grey-toned": { roughness: 0.5, absorbency: 0.5, color: "#e8e6e1" },
};

// Simplex noise for organic patterns
function createSimplexNoise(seed: number = Math.random()) {
  const perm: number[] = [];
  let s = seed * 12345;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647);
  };
  
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    return lerp(
      v,
      lerp(u, grad(perm[A], x, y), grad(perm[B], x - 1, y)),
      lerp(u, grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1))
    );
  };
}

// Fractal Brownian Motion for organic detail
function fbm(noise: (x: number, y: number) => number, x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Blend two colors with alpha
function blendColors(
  base: { r: number; g: number; b: number; a: number },
  over: { r: number; g: number; b: number; a: number }
): { r: number; g: number; b: number; a: number } {
  const alpha = over.a + base.a * (1 - over.a);
  if (alpha < 0.001) return { r: 0, g: 0, b: 0, a: 0 };
  
  return {
    r: Math.round((over.r * over.a + base.r * base.a * (1 - over.a)) / alpha),
    g: Math.round((over.g * over.a + base.g * base.a * (1 - over.a)) / alpha),
    b: Math.round((over.b * over.a + base.b * base.a * (1 - over.a)) / alpha),
    a: Math.min(1, alpha),
  };
}

// Generate paper texture
function generatePaperTexture(
  width: number,
  height: number,
  paperType: string,
  seed: number
): ImageData {
  const paper = PAPER_TEXTURES[paperType] || PAPER_TEXTURES["cold-pressed"];
  const noise = createSimplexNoise(seed);
  const imageData = new ImageData(width, height);
  const baseColor = hexToRgb(paper.color);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Multi-octave noise for paper grain
      const grain = fbm(noise, x * 0.02, y * 0.02, 3) * paper.roughness;
      const fineGrain = fbm(noise, x * 0.1, y * 0.1, 2) * 0.1;
      
      // Paper fiber variation
      const variation = (grain + fineGrain) * 15;
      
      imageData.data[idx] = Math.min(255, Math.max(0, baseColor.r + variation));
      imageData.data[idx + 1] = Math.min(255, Math.max(0, baseColor.g + variation));
      imageData.data[idx + 2] = Math.min(255, Math.max(0, baseColor.b + variation));
      imageData.data[idx + 3] = 255;
    }
  }
  
  return imageData;
}

// Create a watercolor blob with diffusion
function createWatercolorBlob(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
  wetness: number,
  diffusionRate: number,
  granulation: number,
  seed: number,
  time: number
): void {
  const noise = createSimplexNoise(seed);
  const rgb = hexToRgb(color);
  
  // Create offscreen canvas for the blob
  const offCanvas = document.createElement("canvas");
  offCanvas.width = ctx.canvas.width;
  offCanvas.height = ctx.canvas.height;
  const offCtx = offCanvas.getContext("2d")!;
  
  // Generate organic blob shape using noise
  const points: { x: number; y: number }[] = [];
  const numPoints = 32;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const noiseValue = fbm(noise, 
      Math.cos(angle) * 2 + seed, 
      Math.sin(angle) * 2 + time * 0.1, 
      3
    );
    const r = radius * (0.7 + noiseValue * 0.6);
    points.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    });
  }
  
  // Draw the main blob with gradient
  offCtx.beginPath();
  offCtx.moveTo(points[0].x, points[0].y);
  
  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % points.length];
    const midX = (p0.x + p1.x) / 2;
    const midY = (p0.y + p1.y) / 2;
    offCtx.quadraticCurveTo(p0.x, p0.y, midX, midY);
  }
  
  offCtx.closePath();
  
  // Create radial gradient for pigment density (darker at edges due to surface tension)
  const gradient = offCtx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius * 1.5
  );
  
  const alpha = (0.3 + wetness * 0.3);
  gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.3})`);
  gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
  gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.1})`);
  
  offCtx.fillStyle = gradient;
  offCtx.fill();
  
  // Add granulation texture (pigment settling into paper valleys)
  if (granulation > 0) {
    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const granNoise = createSimplexNoise(seed + 100);
    
    for (let y = 0; y < offCanvas.height; y += 2) {
      for (let x = 0; x < offCanvas.width; x += 2) {
        const idx = (y * offCanvas.width + x) * 4;
        if (imageData.data[idx + 3] > 10) {
          const g = fbm(granNoise, x * 0.05, y * 0.05, 2);
          const granAlpha = g * granulation * 0.5;
          
          // Darken granulated areas
          const darken = 1 - granAlpha * 0.3;
          imageData.data[idx] = Math.floor(imageData.data[idx] * darken);
          imageData.data[idx + 1] = Math.floor(imageData.data[idx + 1] * darken);
          imageData.data[idx + 2] = Math.floor(imageData.data[idx + 2] * darken);
        }
      }
    }
    offCtx.putImageData(imageData, 0, 0);
  }
  
  // Add backruns (blooms) - pigment pushed back by drying
  const bloomCount = Math.floor(wetness * 5);
  for (let i = 0; i < bloomCount; i++) {
    const bloomAngle = (i / bloomCount) * Math.PI * 2 + seed * 10;
    const bloomDist = radius * (0.5 + Math.random() * 0.5);
    const bloomX = centerX + Math.cos(bloomAngle) * bloomDist;
    const bloomY = centerY + Math.sin(bloomAngle) * bloomDist;
    const bloomSize = radius * 0.2 * (0.5 + Math.random());
    
    const bloomGradient = offCtx.createRadialGradient(
      bloomX, bloomY, 0,
      bloomX, bloomY, bloomSize
    );
    bloomGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    bloomGradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2 * wetness)`);
    bloomGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    
    offCtx.fillStyle = bloomGradient;
    offCtx.beginPath();
    offCtx.arc(bloomX, bloomY, bloomSize, 0, Math.PI * 2);
    offCtx.fill();
  }
  
  // Composite onto main canvas
  ctx.drawImage(offCanvas, 0, 0);
}

// Create flowing watercolor wash
function createWatercolorWash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  wetness: number,
  diffusionRate: number,
  seed: number,
  time: number
): void {
  const noise = createSimplexNoise(seed);
  const flowNoise = createSimplexNoise(seed + 50);
  
  // Create flowing paths for the wash
  const numFlows = 3 + Math.floor(wetness * 4);
  
  for (let f = 0; f < numFlows; f++) {
    const color = colors[f % colors.length];
    const rgb = hexToRgb(color);
    
    // Starting position
    const startY = height * (0.2 + (f / numFlows) * 0.6);
    let x = 0;
    let y = startY;
    
    // Build flow path
    const points: { x: number; y: number; width: number }[] = [];
    const baseWidth = 30 + wetness * 50;
    
    while (x < width) {
      const flowX = x * 0.005;
      const flowY = y * 0.005;
      
      // Flow direction influenced by noise
      const angle = fbm(flowNoise, flowX, flowY + time * 0.05, 2) * Math.PI;
      const speed = 5 + wetness * 10;
      
      x += Math.cos(angle) * speed + speed * 0.5;
      y += Math.sin(angle) * speed * 0.3;
      
      // Varying width
      const w = baseWidth * (0.5 + fbm(noise, flowX, flowY, 2) * 0.5);
      
      points.push({ x, y, width: w });
    }
    
    // Draw the wash as connected blobs
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i];
      const alpha = 0.1 + wetness * 0.1;
      
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.width
      );
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.width, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Main render function
export function renderWatercolorDreams(
  ctx: CanvasRenderingContext2D,
  params: WatercolorParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const {
    palette = "sunset-glow",
    paperType = "cold-pressed",
    wetness = 0.6,
    pigmentDensity = 0.7,
    bloomIntensity = 0.5,
    brushSize = 0.5,
    layerCount = 4,
    granulation = 0.6,
    diffusionRate = 0.5,
    seed = 42,
  } = params;
  
  const colors = PALETTES[palette] || PALETTES["sunset-glow"];
  const paper = PAPER_TEXTURES[paperType] || PAPER_TEXTURES["cold-pressed"];
  
  // Step 1: Render paper texture
  const paperTexture = generatePaperTexture(width, height, paperType, seed);
  ctx.putImageData(paperTexture, 0, 0);
  
  // Step 2: Create watercolor layers (wet-on-wet technique)
  // Use 'screen' or 'multiply' blend mode simulation through alpha layering
  
  // Background wash
  createWatercolorWash(ctx, width, height, colors, wetness, diffusionRate, seed, time);
  
  // Layer multiple blobs for depth
  const numBlobs = Math.floor(layerCount * 3);
  const noise = createSimplexNoise(seed);
  
  for (let i = 0; i < numBlobs; i++) {
    const layerSeed = seed + i * 100;
    const blobNoise = createSimplexNoise(layerSeed);
    
    // Position with some animation
    const baseX = fbm(noise, i * 0.5, 0, 2) * width * 0.6 + width * 0.2;
    const baseY = fbm(noise, 0, i * 0.5, 2) * height * 0.6 + height * 0.2;
    
    // Gentle drift animation
    const driftX = Math.sin(time * 0.0005 + i) * 20 * wetness;
    const driftY = Math.cos(time * 0.0003 + i * 0.7) * 15 * wetness;
    
    const x = baseX + driftX;
    const y = baseY + driftY;
    
    // Size varies by layer (back layers are larger, more diffuse)
    const layerDepth = i / numBlobs;
    const radius = (50 + brushSize * 100) * (1 + layerDepth) * (0.8 + fbm(blobNoise, 0, 0, 2) * 0.4);
    
    // Color selection
    const colorIndex = Math.floor(fbm(noise, i * 0.3, 0.3, 2) * colors.length) % colors.length;
    const color = colors[colorIndex];
    
    // Layer properties
    const layerWetness = wetness * (1 - layerDepth * 0.3);
    const layerGranulation = granulation * (0.5 + layerDepth * 0.5);
    
    createWatercolorBlob(
      ctx,
      x,
      y,
      radius,
      color,
      layerWetness,
      diffusionRate,
      layerGranulation,
      layerSeed,
      time
    );
  }
  
  // Step 3: Add pigment pooling at edges (darker where water evaporates)
  if (bloomIntensity > 0) {
    const edgeNoise = createSimplexNoise(seed + 200);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = Math.min(width, height) * 0.35;
      const x = width / 2 + Math.cos(angle) * dist + fbm(edgeNoise, i, 0, 2) * 50;
      const y = height / 2 + Math.sin(angle) * dist + fbm(edgeNoise, 0, i, 2) * 50;
      
      const color = colors[i % colors.length];
      const rgb = hexToRgb(color);
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * bloomIntensity})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Step 4: Add subtle water spots/splatter
  if (wetness > 0.5) {
    const spotNoise = createSimplexNoise(seed + 300);
    const numSpots = Math.floor(wetness * 15);
    
    for (let i = 0; i < numSpots; i++) {
      const sx = fbm(spotNoise, i * 0.5, 0, 2) * width;
      const sy = fbm(spotNoise, 0, i * 0.5, 2) * height;
      const size = 2 + fbm(spotNoise, i, i, 2) * 8;
      
      const color = colors[Math.floor(fbm(spotNoise, i, 0, 2) * colors.length) % colors.length];
      const rgb = hexToRgb(color);
      
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * wetness})`;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Art generator definition
export const watercolorDreams: ArtGenerator = {
  name: "Watercolor Dreams",
  description: "Traditional watercolor simulation with pigment diffusion, paper texture, backruns, and wet-on-wet bleeding effects",
  params: {
    palette: {
      name: "Color Palette",
      type: "select",
      options: ["sunset-glow", "ocean-mist", "forest-dew", "rose-garden", "monochrome-ink", "autumn-leaves"],
      default: "sunset-glow",
    },
    paperType: {
      name: "Paper Type",
      type: "select",
      options: ["cold-pressed", "hot-pressed", "rough", "tinted-cream", "grey-toned"],
      default: "cold-pressed",
    },
    wetness: {
      name: "Wetness",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.6,
    },
    pigmentDensity: {
      name: "Pigment Density",
      type: "range",
      min: 0.2,
      max: 1,
      step: 0.05,
      default: 0.7,
    },
    bloomIntensity: {
      name: "Bloom Intensity",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.5,
    },
    brushSize: {
      name: "Brush Size",
      type: "range",
      min: 0.2,
      max: 1.5,
      step: 0.1,
      default: 0.5,
    },
    layerCount: {
      name: "Layer Count",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4,
    },
    granulation: {
      name: "Granulation",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.6,
    },
    diffusionRate: {
      name: "Diffusion Rate",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 0.5,
    },
    seed: {
      name: "Random Seed",
      type: "range",
      min: 1,
      max: 1000,
      step: 1,
      default: 42,
    },
  },
  generate: renderWatercolorDreams,
  meta: {
    category: "traditional",
    complexity: "complex",
    tags: ["animated", "organic", "colorful", "detailed"],
    created: "2024-02-26",
  },
};

// Default params export
export const watercolorDreamsDefaultParams: WatercolorParams = {
  palette: "sunset-glow",
  paperType: "cold-pressed",
  wetness: 0.6,
  pigmentDensity: 0.7,
  bloomIntensity: 0.5,
  brushSize: 0.5,
  layerCount: 4,
  granulation: 0.6,
  diffusionRate: 0.5,
  seed: 42,
};

export type { WatercolorParams };
export default watercolorDreams;
