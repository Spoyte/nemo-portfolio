// Weaving Loom - Simulated textile weaving with warp and weft threads
// Creates intricate fabric patterns inspired by traditional looms and jacquard weaving
// Features: multiple weave structures, thread density control, color gradients, and animated shuttle

import { ArtGenerator, ArtParams, hslToRgb } from "./core";

export interface WeavingLoomParams {
  warpThreads: number;      // Vertical threads (warp)
  weftThreads: number;      // Horizontal threads (weft)
  weaveType: string;        // Plain, twill, satin, basket, herringbone
  warpColor: string;        // Base warp thread color
  weftColor: string;        // Base weft thread color
  pattern: string;          // Pattern type: stripes, checks, diamond, zigzag
  threadThickness: number;  // Thickness of individual threads
  tension: number;          // Thread tension variation (creates texture)
  shine: number;            // Silk/sheen effect intensity
  speed: number;            // Animation speed (shuttle movement)
  colorVariation: number;   // How much colors vary across the weave
}

export const weavingLoomDefaultParams: WeavingLoomParams = {
  warpThreads: 40,
  weftThreads: 40,
  weaveType: "twill",
  warpColor: "#8b4513",
  weftColor: "#d2691e",
  pattern: "diamond",
  threadThickness: 3,
  tension: 0.3,
  shine: 0.6,
  speed: 1,
  colorVariation: 0.2,
};

// Color palettes inspired by traditional textiles
const TEXTILE_PALETTES: Record<string, { warp: string; weft: string; accent: string }> = {
  denim: { warp: "#1a237e", weft: "#3949ab", accent: "#5c6bc0" },
  tartan: { warp: "#b71c1c", weft: "#2e7d32", accent: "#fbc02d" },
  silk: { warp: "#4a148c", weft: "#7b1fa2", accent: "#e1bee7" },
  linen: { warp: "#5d4037", weft: "#8d6e63", accent: "#d7ccc8" },
  wool: { warp: "#3e2723", weft: "#5d4037", accent: "#a1887f" },
  cotton: { warp: "#e0e0e0", weft: "#f5f5f5", accent: "#9e9e9e" },
  ikat: { warp: "#e65100", weft: "#f57c00", accent: "#ffcc80" },
  brocade: { warp: "#1a1a2e", weft: "#16213e", accent: "#e94560" },
};

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Blend two colors
function blendColors(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number): string {
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Add shine/sheen effect to color
function addShine(color: { r: number; g: number; b: number }, intensity: number, angle: number): string {
  const shineFactor = 1 + Math.sin(angle) * intensity * 0.5;
  const r = Math.min(255, Math.round(color.r * shineFactor));
  const g = Math.min(255, Math.round(color.g * shineFactor));
  const b = Math.min(255, Math.round(color.b * shineFactor));
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate weave pattern matrix
function generateWeavePattern(
  weaveType: string,
  warpThreads: number,
  weftThreads: number,
  time: number
): boolean[][] {
  const pattern: boolean[][] = [];
  
  for (let y = 0; y < weftThreads; y++) {
    pattern[y] = [];
    for (let x = 0; x < warpThreads; x++) {
      let isWarpUp = false;
      
      switch (weaveType) {
        case "plain":
          // Plain weave: alternating over/under
          isWarpUp = (x + y) % 2 === 0;
          break;
          
        case "twill":
          // Twill: diagonal pattern
          isWarpUp = (x + y * 2) % 4 < 2;
          break;
          
        case "satin":
          // Satin: long floats
          isWarpUp = (x + y * 5) % 8 === 0 || (x + y * 5) % 8 === 1;
          break;
          
        case "basket":
          // Basket: groups of 2
          isWarpUp = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
          break;
          
        case "herringbone":
          // Herringbone: chevron pattern
          const row = y % 8;
          if (row < 4) {
            isWarpUp = (x + row) % 4 < 2;
          } else {
            isWarpUp = (x + (7 - row)) % 4 < 2;
          }
          break;
          
        case "broken":
          // Broken twill: irregular pattern
          isWarpUp = (x * 3 + y * 2) % 7 < 3;
          break;
          
        default:
          isWarpUp = (x + y) % 2 === 0;
      }
      
      pattern[y][x] = isWarpUp;
    }
  }
  
  return pattern;
}

// Generate color pattern for warp threads
function getWarpColor(
  x: number,
  total: number,
  baseColor: string,
  pattern: string,
  variation: number,
  time: number
): { r: number; g: number; b: number } {
  const base = hexToRgb(baseColor);
  const t = x / total;
  const timeOffset = time * 0.0005;
  
  let patternFactor = 0;
  
  switch (pattern) {
    case "stripes":
      patternFactor = Math.floor(t * 4) % 2 === 0 ? 1 : 0;
      break;
    case "checks":
      patternFactor = (Math.floor(t * 4) % 2 === 0) ? 1 : 0.5;
      break;
    case "diamond":
      patternFactor = Math.abs(Math.sin(t * Math.PI * 2 + timeOffset));
      break;
    case "zigzag":
      patternFactor = (Math.sin(t * Math.PI * 4 + timeOffset) + 1) / 2;
      break;
    case "gradient":
      patternFactor = t;
      break;
    case "random":
      patternFactor = Math.sin(x * 12.9898 + timeOffset * 10) * 0.5 + 0.5;
      break;
    default:
      patternFactor = 0;
  }
  
  // Apply variation
  const v = variation * patternFactor;
  return {
    r: Math.min(255, Math.max(0, base.r + (Math.random() - 0.5) * 30 * variation)),
    g: Math.min(255, Math.max(0, base.g + (Math.random() - 0.5) * 30 * variation)),
    b: Math.min(255, Math.max(0, base.b + (Math.random() - 0.5) * 30 * variation)),
  };
}

// Generate color pattern for weft threads
function getWeftColor(
  y: number,
  total: number,
  baseColor: string,
  pattern: string,
  variation: number,
  time: number
): { r: number; g: number; b: number } {
  const base = hexToRgb(baseColor);
  const t = y / total;
  const timeOffset = time * 0.0003;
  
  let patternFactor = 0;
  
  switch (pattern) {
    case "stripes":
      patternFactor = Math.floor(t * 4) % 2 === 0 ? 0.5 : 1;
      break;
    case "checks":
      patternFactor = (Math.floor(t * 4) % 2 === 0) ? 0.5 : 1;
      break;
    case "diamond":
      patternFactor = Math.abs(Math.cos(t * Math.PI * 2 + timeOffset));
      break;
    case "zigzag":
      patternFactor = (Math.cos(t * Math.PI * 4 + timeOffset) + 1) / 2;
      break;
    case "gradient":
      patternFactor = 1 - t;
      break;
    case "random":
      patternFactor = Math.sin(y * 78.233 + timeOffset * 10) * 0.5 + 0.5;
      break;
    default:
      patternFactor = 0;
  }
  
  const v = variation * patternFactor;
  return {
    r: Math.min(255, Math.max(0, base.r + (Math.random() - 0.5) * 30 * variation)),
    g: Math.min(255, Math.max(0, base.g + (Math.random() - 0.5) * 30 * variation)),
    b: Math.min(255, Math.max(0, base.b + (Math.random() - 0.5) * 30 * variation)),
  };
}

export function renderWeavingLoom(
  ctx: CanvasRenderingContext2D,
  params: WeavingLoomParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Background (loom frame color)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, width, height);
  
  const {
    warpThreads,
    weftThreads,
    weaveType,
    warpColor,
    weftColor,
    pattern,
    threadThickness,
    tension,
    shine,
    speed,
    colorVariation,
  } = params;
  
  // Calculate thread dimensions
  const margin = 40;
  const weaveWidth = width - margin * 2;
  const weaveHeight = height - margin * 2;
  const threadW = weaveWidth / warpThreads;
  const threadH = weaveHeight / weftThreads;
  
  // Generate weave pattern
  const weavePattern = generateWeavePattern(weaveType, warpThreads, weftThreads, time);
  
  // Animation offset for shuttle
  const shuttleY = (time * speed * 0.05) % weftThreads;
  const shuttleGlow = Math.sin(time * speed * 0.01) * 0.5 + 0.5;
  
  // Draw loom frame
  ctx.strokeStyle = "#3d3d3d";
  ctx.lineWidth = 8;
  ctx.strokeRect(margin - 10, margin - 10, weaveWidth + 20, weaveHeight + 20);
  
  // Draw warp threads (vertical)
  for (let x = 0; x < warpThreads; x++) {
    const px = margin + x * threadW + threadW / 2;
    const warpCol = getWarpColor(x, warpThreads, warpColor, pattern, colorVariation, time);
    
    // Tension variation creates slight curves
    const tensionOffset = Math.sin(x * 0.5 + time * 0.001) * tension * 3;
    
    ctx.beginPath();
    ctx.moveTo(px + tensionOffset, margin);
    ctx.lineTo(px - tensionOffset, margin + weaveHeight);
    
    // Thread color with shine
    const shineAngle = x * 0.2 + time * 0.002;
    ctx.strokeStyle = addShine(warpCol, shine, shineAngle);
    ctx.lineWidth = threadThickness;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
  }
  
  // Draw weft threads (horizontal) with weave pattern
  for (let y = 0; y < weftThreads; y++) {
    const py = margin + y * threadH + threadH / 2;
    const weftCol = getWeftColor(y, weftThreads, weftColor, pattern, colorVariation, time);
    
    // Draw each segment based on weave pattern
    for (let x = 0; x < warpThreads; x++) {
      const px = margin + x * threadW;
      const isWarpUp = weavePattern[y][x];
      
      // Weft is visible when warp is down
      if (!isWarpUp) {
        const segmentWidth = threadW + 0.5; // Slight overlap
        
        // Tension creates slight waviness
        const waveY = Math.sin(x * 0.3 + y * 0.5 + time * 0.001) * tension * 2;
        
        ctx.fillStyle = addShine(weftCol, shine * 0.8, y * 0.15);
        ctx.globalAlpha = 0.85;
        ctx.fillRect(px, py - threadThickness / 2 + waveY, segmentWidth, threadThickness);
      }
    }
    
    // Shuttle glow effect on current weaving row
    const distFromShuttle = Math.abs(y - shuttleY);
    if (distFromShuttle < 3) {
      const glowIntensity = (1 - distFromShuttle / 3) * shuttleGlow * 0.3;
      ctx.fillStyle = `rgba(255, 200, 100, ${glowIntensity})`;
      ctx.fillRect(margin, py - threadH, weaveWidth, threadH * 2);
    }
  }
  
  // Draw warp threads on top where they should be visible
  ctx.globalAlpha = 0.6;
  for (let x = 0; x < warpThreads; x++) {
    const px = margin + x * threadW + threadW / 2;
    const warpCol = getWarpColor(x, warpThreads, warpColor, pattern, colorVariation, time);
    
    for (let y = 0; y < weftThreads; y++) {
      const isWarpUp = weavePattern[y][x];
      
      if (isWarpUp) {
        const py = margin + y * threadH;
        const shineAngle = x * 0.2 + y * 0.1 + time * 0.002;
        
        ctx.fillStyle = addShine(warpCol, shine, shineAngle);
        ctx.fillRect(px - threadThickness / 2, py, threadThickness, threadH + 0.5);
      }
    }
  }
  
  // Draw shuttle
  const shuttleYPos = margin + shuttleY * threadH;
  const shuttleX = margin + weaveWidth / 2 + Math.sin(time * speed * 0.02) * (weaveWidth / 2 - 30);
  
  // Shuttle body
  const shuttleGradient = ctx.createLinearGradient(shuttleX - 20, 0, shuttleX + 20, 0);
  shuttleGradient.addColorStop(0, "#5d4037");
  shuttleGradient.addColorStop(0.5, "#8d6e63");
  shuttleGradient.addColorStop(1, "#5d4037");
  
  ctx.fillStyle = shuttleGradient;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.ellipse(shuttleX, shuttleYPos, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Shuttle highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.ellipse(shuttleX - 5, shuttleYPos - 2, 15, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Thread from shuttle
  ctx.strokeStyle = weftColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(shuttleX - 25, shuttleYPos);
  ctx.lineTo(margin - 20, shuttleYPos);
  ctx.stroke();
  
  // Draw selvedge (edges)
  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, margin + weaveHeight);
  ctx.moveTo(margin + weaveWidth, margin);
  ctx.lineTo(margin + weaveWidth, margin + weaveHeight);
  ctx.stroke();
  
  // Reset alpha
  ctx.globalAlpha = 1;
  
  // Draw texture overlay for fabric feel
  const textureAlpha = 0.03;
  ctx.fillStyle = `rgba(255, 255, 255, ${textureAlpha})`;
  for (let i = 0; i < 100; i++) {
    const tx = margin + Math.random() * weaveWidth;
    const ty = margin + Math.random() * weaveHeight;
    ctx.fillRect(tx, ty, 1, 1);
  }
}

// Gallery generator wrapper
export const weavingLoom: ArtGenerator = {
  name: "Weaving Loom",
  description: "Simulated textile weaving with warp and weft threads. Creates intricate fabric patterns inspired by traditional looms, featuring multiple weave structures, color gradients, and animated shuttle movement.",
  meta: {
    category: "traditional",
    complexity: "moderate",
    tags: ["animated", "colorful", "geometric", "ordered", "detailed"],
    created: "2026-02-28",
  },
  params: {
    warpThreads: {
      name: "Warp Threads",
      type: "range",
      min: 10,
      max: 80,
      step: 5,
      default: 40,
    },
    weftThreads: {
      name: "Weft Threads",
      type: "range",
      min: 10,
      max: 80,
      step: 5,
      default: 40,
    },
    weaveType: {
      name: "Weave Type",
      type: "select",
      options: ["plain", "twill", "satin", "basket", "herringbone", "broken"],
      default: "twill",
    },
    warpColor: {
      name: "Warp Color",
      type: "select",
      options: ["#8b4513", "#1a237e", "#b71c1c", "#4a148c", "#5d4037", "#e0e0e0", "#e65100", "#1a1a2e"],
      default: "#8b4513",
    },
    weftColor: {
      name: "Weft Color",
      type: "select",
      options: ["#d2691e", "#3949ab", "#2e7d32", "#7b1fa2", "#8d6e63", "#f5f5f5", "#f57c00", "#16213e"],
      default: "#d2691e",
    },
    pattern: {
      name: "Pattern",
      type: "select",
      options: ["none", "stripes", "checks", "diamond", "zigzag", "gradient", "random"],
      default: "diamond",
    },
    threadThickness: {
      name: "Thread Thickness",
      type: "range",
      min: 1,
      max: 8,
      step: 0.5,
      default: 3,
    },
    tension: {
      name: "Tension",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.3,
    },
    shine: {
      name: "Sheen",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.6,
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1,
    },
    colorVariation: {
      name: "Color Variation",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.2,
    },
  },
  generate: (ctx, params, time) => {
    renderWeavingLoom(ctx, {
      warpThreads: params.warpThreads as number,
      weftThreads: params.weftThreads as number,
      weaveType: params.weaveType as string,
      warpColor: params.warpColor as string,
      weftColor: params.weftColor as string,
      pattern: params.pattern as string,
      threadThickness: params.threadThickness as number,
      tension: params.tension as number,
      shine: params.shine as number,
      speed: params.speed as number,
      colorVariation: params.colorVariation as number,
    }, time);
  },
};
