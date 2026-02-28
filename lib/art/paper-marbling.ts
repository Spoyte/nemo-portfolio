import { ArtGenerator, ArtParams, fillCanvas, createNoise } from "./core";

// Paper Marbling (Ebru) - Traditional Turkish art simulation
// Paint floats on thickened water, manipulated with tools, transferred to paper
// Creates organic, swirling patterns with characteristic "vein" structures

interface PaperMarblingParams extends ArtParams {
  baseColor: string;
  palette: string;
  pattern: string;
  complexity: number;
  turbulence: number;
  veinDensity: number;
  colorSpread: number;
  paperTexture: number;
  animateFlow: boolean;
  seed: number;
}

// Traditional Ebru color palettes
const PALETTES: Record<string, string[]> = {
  classic: ["#1a3a5c", "#8b0000", "#d4af37", "#2f4f4f", "#f5f5dc"], // Prussian blue, crimson, gold, slate, cream
  ocean: ["#006994", "#40e0d0", "#008080", "#4682b4", "#e0ffff"], // Ocean depths
  earth: ["#8b4513", "#d2691e", "#cd853f", "#deb887", "#f5deb3"], // Earth tones
  floral: ["#dc143c", "#ff1493", "#ff69b4", "#ffb6c1", "#fff0f5"], // Rose garden
  night: ["#191970", "#4b0082", "#483d8b", "#6a5acd", "#e6e6fa"], // Midnight
  autumn: ["#ff4500", "#ff8c00", "#daa520", "#8b4513", "#fff8dc"], // Fall leaves
  peacock: ["#008080", "#20b2aa", "#48d1cc", "#ffd700", "#ff6347"], // Peacock feathers
  monochrome: ["#000000", "#333333", "#666666", "#999999", "#cccccc"], // Sumi-e style
};

// Base paper colors
const BASE_COLORS: Record<string, string> = {
  cream: "#f5f5dc",
  white: "#fafafa",
  aged: "#f0e6d2",
  blue: "#e6f3ff",
  grey: "#e8e8e8",
};

// Pattern types inspired by traditional Ebru techniques
interface FlowPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  age: number;
}

export const paperMarbling: ArtGenerator = {
  name: "Paper Marbling",
  description: "Traditional Ebru art simulation - floating pigments creating organic swirling patterns on water, transferred to paper",
  params: {
    baseColor: {
      name: "Base Paper",
      type: "select",
      options: ["cream", "white", "aged", "blue", "grey"],
      default: "cream",
    },
    palette: {
      name: "Color Palette",
      type: "select",
      options: ["classic", "ocean", "earth", "floral", "night", "autumn", "peacock", "monochrome"],
      default: "classic",
    },
    pattern: {
      name: "Pattern Style",
      type: "select",
      options: ["veined", "stormont", "shell", "tiger", "swirls", "comb", "freestyle"],
      default: "veined",
    },
    complexity: {
      name: "Complexity",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 40,
    },
    veinDensity: {
      name: "Vein Density",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 50,
    },
    colorSpread: {
      name: "Color Spread",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 60,
    },
    paperTexture: {
      name: "Paper Texture",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    animateFlow: {
      name: "Animate Flow",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    seed: {
      name: "Random Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
  },

  meta: {
    category: "traditional",
    complexity: "moderate",
    tags: ["animated", "colorful", "organic", "detailed"],
    created: "2026-02-28",
  },

  generate: (ctx, params, time = 0) => {
    const p = params as PaperMarblingParams;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const seed = p.seed;
    const noise = createNoise(seed);
    
    // Animation time factor
    const t = p.animateFlow ? time * 0.0003 : 0;
    
    // Fill base paper
    const baseColor = BASE_COLORS[p.baseColor] || BASE_COLORS.cream;
    fillCanvas(ctx, baseColor, width, height);
    
    // Add paper texture
    if (p.paperTexture > 0) {
      addPaperTexture(ctx, width, height, p.paperTexture, noise);
    }
    
    // Create offscreen canvas for the marbling simulation
    const marbleCanvas = document.createElement("canvas");
    marbleCanvas.width = width;
    marbleCanvas.height = height;
    const mctx = marbleCanvas.getContext("2d")!;
    
    // Generate the marbling pattern
    const colors = PALETTES[p.palette] || PALETTES.classic;
    generateMarblingPattern(mctx, width, height, p, colors, noise, t);
    
    // Apply water-to-paper transfer effect
    applyTransferEffect(ctx, marbleCanvas, width, height, p);
    
    // Add final paper grain
    addPaperGrain(ctx, width, height, p.paperTexture * 0.5);
  },
};

function addPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  noise: ReturnType<typeof createNoise>
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const n = noise(x * 0.01, y * 0.01);
      const variation = (n - 0.5) * intensity * 0.5;
      
      const idx = (y * width + x) * 4;
      data[idx] = Math.max(0, Math.min(255, data[idx] + variation));
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + variation));
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + variation));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function generateMarblingPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: PaperMarblingParams,
  colors: string[],
  noise: ReturnType<typeof createNoise>,
  time: number
): void {
  const complexity = p.complexity / 100;
  const turbulence = p.turbulence / 100;
  const veinDensity = p.veinDensity / 100;
  const spread = p.colorSpread / 100;
  
  // Number of pigment drops based on complexity
  const numDrops = Math.floor(20 + complexity * 80);
  
  // Initialize flow points (pigment particles)
  const points: FlowPoint[] = [];
  
  for (let i = 0; i < numDrops; i++) {
    const angle = (i / numDrops) * Math.PI * 2 + noise(i, 0) * Math.PI;
    const radius = 0.1 + noise(i, 1) * 0.4;
    
    points.push({
      x: 0.5 + Math.cos(angle) * radius * 0.8,
      y: 0.5 + Math.sin(angle) * radius * 0.8,
      vx: 0,
      vy: 0,
      color: colors[i % colors.length],
      size: 0.02 + noise(i, 2) * 0.04 * spread,
      age: 0,
    });
  }
  
  // Simulate pigment flow based on pattern type
  const steps = 100;
  
  for (let step = 0; step < steps; step++) {
    const stepProgress = step / steps;
    
    // Update velocities based on pattern
    points.forEach((point, i) => {
      const nx = point.x;
      const ny = point.y;
      
      // Base flow field
      let fx = 0, fy = 0;
      
      switch (p.pattern) {
        case "veined":
          // Classic vein pattern - radial with noise
          const dist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
          const angle = Math.atan2(ny - 0.5, nx - 0.5);
          fx = Math.cos(angle + dist * 3) * 0.5;
          fy = Math.sin(angle + dist * 3) * 0.5;
          break;
          
        case "stormont":
          // Non-parallel veins
          fx = Math.sin(ny * 10 + time) * 0.3;
          fy = Math.cos(nx * 8 - time) * 0.2;
          break;
          
        case "shell":
          // Concentric shell-like patterns
          const shellDist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
          const shellAngle = Math.atan2(ny - 0.5, nx - 0.5);
          fx = Math.cos(shellAngle + shellDist * 8) * (1 - shellDist);
          fy = Math.sin(shellAngle + shellDist * 8) * (1 - shellDist);
          break;
          
        case "tiger":
          // Tiger stripe pattern
          const stripePhase = nx * 15 + Math.sin(ny * 20) * 0.5;
          fx = Math.cos(stripePhase) * 0.4;
          fy = Math.sin(stripePhase) * 0.1;
          break;
          
        case "swirls":
          // Spiral swirls
          const swirlDist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);
          const swirlAngle = Math.atan2(ny - 0.5, nx - 0.5);
          fx = Math.cos(swirlAngle + swirlDist * 5 + time * 2) * (1 - swirlDist * 0.5);
          fy = Math.sin(swirlAngle + swirlDist * 5 + time * 2) * (1 - swirlDist * 0.5);
          break;
          
        case "comb":
          // Combed pattern
          fx = Math.sin(ny * 12) * 0.3;
          fy = Math.cos(nx * 10 + time) * 0.2;
          break;
          
        default: // freestyle
          fx = noise(nx * 3 + time, ny * 3) - 0.5;
          fy = noise(nx * 3, ny * 3 + time) - 0.5;
      }
      
      // Add turbulence
      const turbX = (noise(nx * 5 + step * 0.1, ny * 5) - 0.5) * turbulence;
      const turbY = (noise(nx * 5, ny * 5 + step * 0.1) - 0.5) * turbulence;
      
      point.vx += (fx + turbX) * 0.1;
      point.vy += (fy + turbY) * 0.1;
      
      // Damping
      point.vx *= 0.95;
      point.vy *= 0.95;
      
      // Update position
      point.x += point.vx * 0.01;
      point.y += point.vy * 0.01;
      
      // Boundary wrapping
      point.x = (point.x + 1) % 1;
      point.y = (point.y + 1) % 1;
      
      point.age += 0.01;
    });
    
    // Render points with vein-like connections
    if (step > 10) {
      points.forEach((point, i) => {
        const px = point.x * width;
        const py = point.y * height;
        const size = point.size * width * (1 - point.age * 0.3);
        
        // Draw pigment drop
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, size);
        const alpha = 0.3 * (1 - stepProgress * 0.5);
        gradient.addColorStop(0, hexToRgba(point.color, alpha));
        gradient.addColorStop(0.5, hexToRgba(point.color, alpha * 0.5));
        gradient.addColorStop(1, hexToRgba(point.color, 0));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw veins to nearby points
        if (veinDensity > 0) {
          points.slice(i + 1).forEach((other, j) => {
            const dx = (other.x - point.x) * width;
            const dy = (other.y - point.y) * height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < size * 3 * veinDensity && dist > size * 0.5) {
              const veinGradient = ctx.createLinearGradient(px, py, other.x * width, other.y * height);
              veinGradient.addColorStop(0, hexToRgba(point.color, alpha * 0.3));
              veinGradient.addColorStop(0.5, hexToRgba(blendColors(point.color, other.color), alpha * 0.5));
              veinGradient.addColorStop(1, hexToRgba(other.color, alpha * 0.3));
              
              ctx.strokeStyle = veinGradient;
              ctx.lineWidth = size * 0.2 * veinDensity;
              ctx.beginPath();
              ctx.moveTo(px, py);
              
              // Curved vein
              const midX = (px + other.x * width) / 2 + (Math.random() - 0.5) * dist * 0.3;
              const midY = (py + other.y * height) / 2 + (Math.random() - 0.5) * dist * 0.3;
              ctx.quadraticCurveTo(midX, midY, other.x * width, other.y * height);
              ctx.stroke();
            }
          });
        }
      });
    }
  }
  
  // Add characteristic Ebru "bulls-eye" rings for some patterns
  if (p.pattern === "shell" || p.pattern === "veined") {
    addBullsEyes(ctx, width, height, colors, noise, time);
  }
}

function addBullsEyes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  noise: ReturnType<typeof createNoise>,
  time: number
): void {
  const numRings = 3 + Math.floor(noise(0, 0) * 4);
  
  for (let i = 0; i < numRings; i++) {
    const cx = (0.3 + noise(i, 0) * 0.4) * width;
    const cy = (0.3 + noise(i, 1) * 0.4) * height;
    const maxRadius = (0.1 + noise(i, 2) * 0.15) * Math.min(width, height);
    
    const color = colors[i % colors.length];
    
    for (let r = maxRadius * 0.3; r < maxRadius; r += maxRadius * 0.15) {
      const alpha = 0.15 * (1 - r / maxRadius);
      
      ctx.strokeStyle = hexToRgba(color, alpha);
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Wobbly ring
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const wobble = noise(Math.cos(a) * 2 + i, Math.sin(a) * 2 + time) * 10;
        const radius = r + wobble;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        
        if (a === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function applyTransferEffect(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  p: PaperMarblingParams
): void {
  // Simulate the transfer from water surface to paper
  // This creates subtle distortions and absorption effects
  
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.85;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.restore();
  
  // Add subtle water distortion overlay
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.1;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(255,255,255,0.2)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,0.1)");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function addPaperGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  if (intensity <= 0) return;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 16) {
    const grain = (Math.random() - 0.5) * intensity;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Utility functions
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function blendColors(color1: string, color2: string): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round((r1 + r2) / 2);
  const g = Math.round((g1 + g2) / 2);
  const b = Math.round((b1 + b2) / 2);
  
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Export render function for unified registry
export function renderPaperMarbling(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time?: number
): void {
  paperMarbling.generate(ctx, params, time);
}
