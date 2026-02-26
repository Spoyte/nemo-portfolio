import { ArtGenerator, ArtParams, fillCanvas, createNoise } from "./core";

// Cross-Hatching Sketch - Traditional media simulation
// Simulates hand-drawn cross-hatching using intersecting lines to represent tone and form

interface CrossHatchingParams extends ArtParams {
  subject: string;
  paperTone: string;
  pencilGrade: string;
  lineDensity: number;
  hatchingLayers: number;
  roughness: number;
  contrast: number;
  animateAbstract: boolean;
  seed: number;
}

// Subject tone maps - define tonal structure for different subjects
const SUBJECT_TONES: Record<string, (x: number, y: number, width: number, height: number, time: number) => number> = {
  // Simplified portrait - eyes, nose, mouth, face structure
  portrait: (x, y, w, h, t) => {
    const nx = x / w;
    const ny = y / h;
    const cx = 0.5;
    const cy = 0.5;
    const dx = nx - cx;
    const dy = ny - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Face oval
    const faceShape = dist < 0.35 ? 1 : Math.max(0, 1 - (dist - 0.35) * 5);
    
    // Eyes (darker)
    const leftEye = Math.exp(-((nx - 0.35) ** 2 + (ny - 0.42) ** 2) * 200);
    const rightEye = Math.exp(-((nx - 0.65) ** 2 + (ny - 0.42) ** 2) * 200);
    
    // Nose shadow
    const nose = Math.exp(-((nx - 0.5) ** 2 + (ny - 0.52) ** 2) * 100) * 0.5;
    
    // Mouth
    const mouth = Math.exp(-((nx - 0.5) ** 2 * 50 + (ny - 0.65) ** 2 * 400)) * 0.7;
    
    // Chin shadow
    const chin = ny > 0.75 ? (ny - 0.75) * 2 : 0;
    
    // Forehead highlight
    const forehead = ny < 0.35 ? 0.3 : 0;
    
    // Cheek hollows
    const leftCheek = Math.exp(-((nx - 0.3) ** 2 + (ny - 0.58) ** 2) * 80) * 0.4;
    const rightCheek = Math.exp(-((nx - 0.7) ** 2 + (ny - 0.58) ** 2) * 80) * 0.4;
    
    return Math.max(0, Math.min(1, 
      faceShape * 0.6 + leftEye + rightEye + nose + mouth + chin + leftCheek + rightCheek - forehead
    ));
  },
  
  // Sphere with shading
  sphere: (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const cx = 0.5;
    const cy = 0.5;
    const dx = nx - cx;
    const dy = ny - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0.4) return 0;
    
    // Spherical shading - lighter top-left, darker bottom-right
    const lightX = 0.3;
    const lightY = 0.3;
    const lightDist = Math.sqrt((nx - lightX) ** 2 + (ny - lightY) ** 2);
    const shading = 0.3 + lightDist * 0.8;
    
    // Edge darkening
    const edge = dist > 0.35 ? (dist - 0.35) * 10 : 0;
    
    return Math.max(0, Math.min(1, shading + edge));
  },
  
  // Rolling landscape
  landscape: (x, y, w, h, t) => {
    const nx = x / w;
    const ny = y / h;
    
    // Hills using sine waves
    const hill1 = Math.sin(nx * Math.PI * 3) * 0.1 + 0.4;
    const hill2 = Math.sin(nx * Math.PI * 5 + 1) * 0.08 + 0.55;
    const hill3 = Math.sin(nx * Math.PI * 2 + 2) * 0.15 + 0.75;
    
    // Distance fog
    const distance = ny;
    
    let tone = 0;
    if (ny < hill1) tone = 0.2; // Sky
    else if (ny < hill1 + 0.05) tone = 0.7; // Hill 1 edge
    else if (ny < hill2) tone = 0.35;
    else if (ny < hill2 + 0.05) tone = 0.75;
    else if (ny < hill3) tone = 0.5;
    else if (ny < hill3 + 0.05) tone = 0.8;
    else tone = 0.9; // Foreground
    
    return tone * (0.5 + distance * 0.5);
  },
  
  // Still life - vase and fruit
  stillLife: (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    
    // Vase
    const vaseCenter = 0.5;
    const vaseWidth = 0.15 + Math.sin(ny * Math.PI) * 0.1;
    const inVase = Math.abs(nx - vaseCenter) < vaseWidth && ny > 0.3 && ny < 0.85;
    const vaseTone = inVase ? 0.5 + Math.sin(ny * 10) * 0.1 : 0;
    
    // Apple
    const appleX = 0.28;
    const appleY = 0.72;
    const appleDist = Math.sqrt((nx - appleX) ** 2 + (ny - appleY) ** 2);
    const appleTone = appleDist < 0.12 ? 0.4 + appleDist * 2 : 0;
    
    // Orange
    const orangeX = 0.72;
    const orangeY = 0.75;
    const orangeDist = Math.sqrt((nx - orangeX) ** 2 + (ny - orangeY) ** 2);
    const orangeTone = orangeDist < 0.1 ? 0.6 + orangeDist * 2 : 0;
    
    // Table surface
    const table = ny > 0.85 ? 0.3 + (nx - 0.5) * 0.2 : 0;
    
    return Math.max(vaseTone, appleTone, orangeTone, table);
  },
  
  // Abstract flowing forms
  abstract: (x, y, w, h, t) => {
    const nx = x / w;
    const ny = y / h;
    const time = t * 0.001;
    
    // Flowing noise-like patterns
    const wave1 = Math.sin(nx * 8 + time + Math.sin(ny * 6) * 0.5);
    const wave2 = Math.cos(ny * 10 - time * 0.7 + Math.sin(nx * 5) * 0.5);
    const wave3 = Math.sin((nx + ny) * 6 + time * 0.5);
    
    return (wave1 + wave2 + wave3 + 3) / 6;
  },
};

// Paper tones
const PAPER_TONES: Record<string, { color: string; texture: number }> = {
  white: { color: "#fafafa", texture: 0.3 },
  cream: { color: "#f5f0e6", texture: 0.4 },
  grey: { color: "#e8e6e1", texture: 0.5 },
  tan: { color: "#d4c4a8", texture: 0.6 },
  blueprint: { color: "#1a3a5c", texture: 0.4 },
};

// Pencil grades - opacity curves
const PENCIL_GRADES: Record<string, { baseOpacity: number; maxOpacity: number; softness: number }> = {
  "2H": { baseOpacity: 0.15, maxOpacity: 0.4, softness: 0.3 },
  HB: { baseOpacity: 0.25, maxOpacity: 0.6, softness: 0.5 },
  "2B": { baseOpacity: 0.35, maxOpacity: 0.75, softness: 0.7 },
  "4B": { baseOpacity: 0.45, maxOpacity: 0.85, softness: 0.8 },
  "6B": { baseOpacity: 0.55, maxOpacity: 0.95, softness: 0.9 },
};

// Seeded random generator
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647);
  };
}

// Render cross-hatching sketch
export function renderCrossHatching(
  ctx: CanvasRenderingContext2D,
  params: CrossHatchingParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const {
    subject = "portrait",
    paperTone = "cream",
    pencilGrade = "HB",
    lineDensity = 0.7,
    hatchingLayers = 3,
    roughness = 0.3,
    contrast = 0.6,
    animateAbstract = true,
    seed = 42,
  } = params;
  
  const paper = PAPER_TONES[paperTone] || PAPER_TONES.cream;
  const pencil = PENCIL_GRADES[pencilGrade] || PENCIL_GRADES.HB;
  const rand = createSeededRandom(seed);
  const noise = createNoise();
  
  // Fill background
  fillCanvas(ctx, paper.color, width, height);
  
  // Add paper texture
  const imageData = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const grain = (rand() - 0.5) * paper.texture * 20;
      
      imageData.data[idx] = Math.min(255, Math.max(0, imageData.data[idx] + grain));
      imageData.data[idx + 1] = Math.min(255, Math.max(0, imageData.data[idx + 1] + grain));
      imageData.data[idx + 2] = Math.min(255, Math.max(0, imageData.data[idx + 2] + grain));
    }
  }
  ctx.putImageData(imageData, 0, 0);
  
  // Get tone function
  const getTone = SUBJECT_TONES[subject] || SUBJECT_TONES.portrait;
  const animTime = animateAbstract && subject === "abstract" ? time : 0;
  
  // Line color based on paper (blueprint uses white lines)
  const lineColor = paperTone === "blueprint" ? "#ffffff" : "#1a1a1a";
  
  // Draw hatching layers at different angles
  const angles = [0, Math.PI / 3, -Math.PI / 3, Math.PI / 6];
  
  for (let layer = 0; layer < hatchingLayers; layer++) {
    const angle = angles[layer % angles.length];
    const layerRand = createSeededRandom(seed + layer * 100);
    
    // Layer opacity increases with layer index
    const layerIntensity = (layer + 1) / hatchingLayers;
    
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5 + pencil.softness * 0.5;
    ctx.lineCap = "round";
    
    // Spacing between lines
    const baseSpacing = 8 / lineDensity;
    const spacing = baseSpacing * (1 + layer * 0.3);
    
    // Calculate line endpoints across the canvas at this angle
    const diag = Math.sqrt(width * width + height * height);
    const numLines = Math.ceil(diag / spacing);
    
    for (let i = -numLines / 2; i < numLines / 2; i++) {
      const offset = i * spacing;
      
      // Line endpoints
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const x1 = width / 2 + offset * cos - diag * sin;
      const y1 = height / 2 + offset * sin + diag * cos;
      const x2 = width / 2 + offset * cos + diag * sin;
      const y2 = height / 2 + offset * sin - diag * cos;
      
      // Sample points along the line
      const steps = Math.ceil(diag / 2);
      let currentPath: { x: number; y: number; alpha: number }[] = [];
      
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        
        // Skip if outside canvas
        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) continue;
        
        // Get tone at this position
        const tone = getTone(x, y, width, height, animTime);
        
        // Determine if line should be drawn based on tone and layer
        const threshold = (1 - tone) * contrast * layerIntensity;
        const shouldDraw = threshold > layerRand() * 0.5;
        
        if (shouldDraw && x >= 0 && x <= width && y >= 0 && y <= height) {
          // Calculate alpha based on tone
          const alpha = Math.min(1, threshold * pencil.maxOpacity + pencil.baseOpacity);
          
          // Add roughness to position
          const roughX = x + (layerRand() - 0.5) * roughness * 2;
          const roughY = y + (layerRand() - 0.5) * roughness * 2;
          
          currentPath.push({ x: roughX, y: roughY, alpha });
        } else if (currentPath.length > 1) {
          // Draw accumulated path
          drawHatchLine(ctx, currentPath, lineColor);
          currentPath = [];
        }
      }
      
      // Draw remaining path
      if (currentPath.length > 1) {
        drawHatchLine(ctx, currentPath, lineColor);
      }
    }
    
    ctx.restore();
  }
  
  // Add contour hatching - lines that follow the gradient direction
  if (hatchingLayers >= 3) {
    drawContourHatching(ctx, width, height, getTone, lineColor, pencil, roughness, seed, animTime);
  }
}

// Draw a single hatch line with varying opacity
function drawHatchLine(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number; alpha: number }[],
  color: string
): void {
  if (points.length < 2) return;
  
  // Draw as segments with varying opacity
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const avgAlpha = (p1.alpha + p2.alpha) / 2;
    
    ctx.globalAlpha = avgAlpha;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
}

// Draw contour hatching that follows form
function drawContourHatching(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  getTone: (x: number, y: number, w: number, h: number, t: number) => number,
  color: string,
  pencil: { baseOpacity: number; maxOpacity: number; softness: number },
  roughness: number,
  seed: number,
  time: number
): void {
  const rand = createSeededRandom(seed + 500);
  const step = 8;
  
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.3;
  
  for (let y = step; y < height - step; y += step * 2) {
    for (let x = step; x < width - step; x += step * 2) {
      // Calculate gradient direction
      const tone = getTone(x, y, width, height, time);
      const toneRight = getTone(x + step, y, width, height, time);
      const toneDown = getTone(x, y + step, width, height, time);
      
      const dx = toneRight - tone;
      const dy = toneDown - tone;
      
      // Only draw where there's significant gradient
      const gradMag = Math.sqrt(dx * dx + dy * dy);
      if (gradMag < 0.05) continue;
      
      // Contour direction is perpendicular to gradient
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      
      // Line length based on tone
      const length = 10 + tone * 20;
      
      // Draw short contour line
      const alpha = Math.min(1, gradMag * 3) * pencil.baseOpacity;
      ctx.globalAlpha = alpha;
      
      const x1 = x - Math.cos(angle) * length / 2 + (rand() - 0.5) * roughness;
      const y1 = y - Math.sin(angle) * length / 2 + (rand() - 0.5) * roughness;
      const x2 = x + Math.cos(angle) * length / 2 + (rand() - 0.5) * roughness;
      const y2 = y + Math.sin(angle) * length / 2 + (rand() - 0.5) * roughness;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

// Art generator definition
export const crossHatchingSketch: ArtGenerator = {
  name: "Cross-Hatching Sketch",
  description: "Traditional cross-hatching technique using intersecting lines to represent tone and form, simulating hand-drawn pencil sketches",
  params: {
    subject: {
      name: "Subject",
      type: "select",
      options: ["portrait", "sphere", "landscape", "stillLife", "abstract"],
      default: "portrait",
    },
    paperTone: {
      name: "Paper Tone",
      type: "select",
      options: ["white", "cream", "grey", "tan", "blueprint"],
      default: "cream",
    },
    pencilGrade: {
      name: "Pencil Grade",
      type: "select",
      options: ["2H", "HB", "2B", "4B", "6B"],
      default: "HB",
    },
    lineDensity: {
      name: "Line Density",
      type: "range",
      min: 0.3,
      max: 1.2,
      step: 0.1,
      default: 0.7,
    },
    hatchingLayers: {
      name: "Hatching Layers",
      type: "range",
      min: 1,
      max: 4,
      step: 1,
      default: 3,
    },
    roughness: {
      name: "Line Roughness",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.3,
    },
    contrast: {
      name: "Contrast",
      type: "range",
      min: 0.3,
      max: 1,
      step: 0.05,
      default: 0.6,
    },
    animateAbstract: {
      name: "Animate Abstract",
      type: "select",
      options: ["true", "false"],
      default: "true",
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
  generate: renderCrossHatching,
  meta: {
    category: "traditional",
    complexity: "moderate",
    tags: ["animated", "monochrome", "detailed"],
    created: "2024-02-26",
  },
};

// Default params export
export const crossHatchingDefaultParams: CrossHatchingParams = {
  subject: "portrait",
  paperTone: "cream",
  pencilGrade: "HB",
  lineDensity: 0.7,
  hatchingLayers: 3,
  roughness: 0.3,
  contrast: 0.6,
  animateAbstract: true,
  seed: 42,
};

export type { CrossHatchingParams };
export default crossHatchingSketch;
