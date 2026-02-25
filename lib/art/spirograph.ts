// Spirograph - Mathematical epitrochoid and hypotrochoid curves
// Creates intricate geometric patterns from rolling circle mathematics
// Inspired by the classic Spirograph toy but with infinite variations

import { ArtGenerator, ArtParams, fillCanvas, hslToRgb } from "./core";

export interface SpirographParams {
  outerRadius: number;      // Fixed circle radius (R)
  innerRadius: number;      // Rolling circle radius (r)
  penDistance: number;      // Distance from rolling circle center (d)
  rotations: number;        // Number of complete rotations
  lineWidth: number;        // Stroke thickness
  colorMode: string;        // Color scheme
  speed: number;            // Animation speed
  rainbow: boolean;         // Rainbow gradient effect
  symmetry: number;         // Number of symmetric arms
}

export const spirographDefaultParams: SpirographParams = {
  outerRadius: 120,
  innerRadius: 65,
  penDistance: 45,
  rotations: 20,
  lineWidth: 1.5,
  colorMode: "rainbow",
  speed: 1,
  rainbow: true,
  symmetry: 1,
};

// Color schemes
const COLOR_SCHEMES: Record<string, string[]> = {
  rainbow: ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff", "#ff0088"],
  ocean: ["#001a3a", "#004080", "#0066cc", "#0099ff", "#66ccff", "#b3e6ff"],
  sunset: ["#2d0015", "#660033", "#cc4400", "#ff6600", "#ffaa44", "#ffdd88"],
  forest: ["#0a1f0a", "#1a3d1a", "#2d5a2d", "#4a8b4a", "#7cb342", "#aed581"],
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00", "#8000ff"],
  gold: ["#1a1200", "#4a3a00", "#8b6914", "#daa520", "#ffd700", "#ffec8b"],
  midnight: ["#0a0a1a", "#1a1a3e", "#2d2d5a", "#4a4a8e", "#6a6aaa", "#9a9aff"],
};

// Calculate GCD for determining pattern periodicity
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Generate spirograph path points
function generateSpirographPoints(
  R: number,
  r: number,
  d: number,
  rotations: number,
  width: number,
  height: number,
  symmetry: number
): Array<{ x: number; y: number; t: number; arm: number }> {
  const points: Array<{ x: number; y: number; t: number; arm: number }> = [];
  
  // Calculate the period of the pattern
  const g = gcd(R, r);
  const baseRotations = r / g;
  const totalSteps = Math.max(rotations, baseRotations) * 100;
  
  for (let arm = 0; arm < symmetry; arm++) {
    const armOffset = (arm / symmetry) * Math.PI * 2;
    
    for (let i = 0; i <= totalSteps; i++) {
      const t = (i / totalSteps) * Math.PI * 2 * Math.max(rotations, baseRotations);
      
      // Epitrochoid equations (circle rolling outside)
      // x = (R + r) * cos(t) - d * cos((R + r) * t / r)
      // y = (R + r) * sin(t) - d * sin((R + r) * t / r)
      
      // Or hypotrochoid (circle rolling inside)
      // x = (R - r) * cos(t) + d * cos((R - r) * t / r)
      // y = (R - r) * sin(t) - d * sin((R - r) * t / r)
      
      const ratio = (R - r) / r;
      const x = (R - r) * Math.cos(t + armOffset) + d * Math.cos(ratio * (t + armOffset));
      const y = (R - r) * Math.sin(t + armOffset) - d * Math.sin(ratio * (t + armOffset));
      
      points.push({
        x: width / 2 + x,
        y: height / 2 + y,
        t: t / (Math.PI * 2),
        arm,
      });
    }
  }
  
  return points;
}

// Generate epitrochoid points (rolling outside)
function generateEpitrochoidPoints(
  R: number,
  r: number,
  d: number,
  rotations: number,
  width: number,
  height: number,
  symmetry: number
): Array<{ x: number; y: number; t: number; arm: number }> {
  const points: Array<{ x: number; y: number; t: number; arm: number }> = [];
  const g = gcd(R, r);
  const baseRotations = r / g;
  const totalSteps = Math.max(rotations, baseRotations) * 100;
  
  for (let arm = 0; arm < symmetry; arm++) {
    const armOffset = (arm / symmetry) * Math.PI * 2;
    
    for (let i = 0; i <= totalSteps; i++) {
      const t = (i / totalSteps) * Math.PI * 2 * Math.max(rotations, baseRotations);
      
      const ratio = (R + r) / r;
      const x = (R + r) * Math.cos(t + armOffset) - d * Math.cos(ratio * (t + armOffset));
      const y = (R + r) * Math.sin(t + armOffset) - d * Math.sin(ratio * (t + armOffset));
      
      points.push({
        x: width / 2 + x,
        y: height / 2 + y,
        t: t / (Math.PI * 2),
        arm,
      });
    }
  }
  
  return points;
}

export function renderSpirograph(
  ctx: CanvasRenderingContext2D,
  params: SpirographParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Trail effect
  ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
  ctx.fillRect(0, 0, width, height);
  
  const {
    outerRadius,
    innerRadius,
    penDistance,
    rotations,
    lineWidth,
    colorMode,
    speed,
    rainbow,
    symmetry,
  } = params;
  
  // Animate parameters subtly
  const t = time * speed * 0.001;
  const animatedRadius = outerRadius + Math.sin(t * 0.5) * 5;
  const animatedInner = innerRadius + Math.cos(t * 0.3) * 3;
  const animatedPen = penDistance + Math.sin(t * 0.7) * 8;
  
  // Generate points for both hypotrochoid and epitrochoid
  const hypoPoints = generateSpirographPoints(
    animatedRadius,
    animatedInner,
    animatedPen,
    rotations,
    width,
    height,
    symmetry
  );
  
  const epiPoints = generateEpitrochoidPoints(
    animatedRadius * 0.7,
    animatedInner * 0.5,
    animatedPen * 0.6,
    rotations * 0.5,
    width,
    height,
    symmetry
  );
  
  const colors = COLOR_SCHEMES[colorMode] || COLOR_SCHEMES.rainbow;
  
  // Draw hypotrochoid (main pattern)
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  for (let arm = 0; arm < symmetry; arm++) {
    const armPoints = hypoPoints.filter(p => p.arm === arm);
    
    ctx.beginPath();
    for (let i = 0; i < armPoints.length - 1; i++) {
      const p1 = armPoints[i];
      const p2 = armPoints[i + 1];
      
      if (i === 0) {
        ctx.moveTo(p1.x, p1.y);
      }
      
      // Color based on position in curve
      const colorIndex = rainbow 
        ? Math.floor((p1.t * colors.length) % colors.length)
        : arm % colors.length;
      const color = colors[colorIndex];
      
      // Vary line width based on velocity
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      const dynamicWidth = Math.max(0.5, lineWidth * (1 - velocity * 0.1));
      
      ctx.strokeStyle = color;
      ctx.lineWidth = dynamicWidth;
      ctx.globalAlpha = 0.6 + Math.sin(p1.t * Math.PI * 2 + t) * 0.3;
      
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      
      // Start new path for next segment (allows color gradient)
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
    }
  }
  
  // Draw epitrochoid overlay (secondary pattern)
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = lineWidth * 0.5;
  
  for (let arm = 0; arm < symmetry; arm++) {
    const armPoints = epiPoints.filter(p => p.arm === arm);
    
    ctx.beginPath();
    for (let i = 0; i < armPoints.length - 1; i++) {
      const p1 = armPoints[i];
      const p2 = armPoints[i + 1];
      
      if (i === 0) {
        ctx.moveTo(p1.x, p1.y);
      }
      
      const colorIndex = (arm + 3) % colors.length;
      ctx.strokeStyle = colors[colorIndex];
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();
  }
  
  // Draw decorative nodes at intersection points
  ctx.globalAlpha = 0.8;
  const nodeCount = 12;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + t * 0.2;
    const nodeR = animatedRadius * 0.3 + Math.sin(t + i) * 10;
    const nx = width / 2 + Math.cos(angle) * nodeR;
    const ny = height / 2 + Math.sin(angle) * nodeR;
    
    const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, 4);
    const color = colors[i % colors.length];
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(nx, ny, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
  
  // Draw outer decorative ring
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, animatedRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.globalAlpha = 1;
}

// Gallery generator wrapper
export const spirograph: ArtGenerator = {
  name: "Spirograph",
  description: "Mathematical epitrochoid and hypotrochoid curves creating intricate geometric patterns from rolling circle mathematics",
  params: {
    outerRadius: {
      name: "Outer Radius",
      type: "range",
      min: 50,
      max: 180,
      step: 5,
      default: 120,
    },
    innerRadius: {
      name: "Inner Radius",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 65,
    },
    penDistance: {
      name: "Pen Distance",
      type: "range",
      min: 5,
      max: 100,
      step: 5,
      default: 45,
    },
    rotations: {
      name: "Rotations",
      type: "range",
      min: 5,
      max: 50,
      step: 5,
      default: 20,
    },
    lineWidth: {
      name: "Line Width",
      type: "range",
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 1.5,
    },
    colorMode: {
      name: "Color Mode",
      type: "select",
      options: ["rainbow", "ocean", "sunset", "forest", "neon", "gold", "midnight"],
      default: "rainbow",
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1,
    },
    rainbow: {
      name: "Rainbow Gradient",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    symmetry: {
      name: "Symmetry",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, time) => {
    renderSpirograph(ctx, {
      outerRadius: params.outerRadius as number,
      innerRadius: params.innerRadius as number,
      penDistance: params.penDistance as number,
      rotations: params.rotations as number,
      lineWidth: params.lineWidth as number,
      colorMode: params.colorMode as string,
      speed: params.speed as number,
      rainbow: params.rainbow === "true",
      symmetry: params.symmetry as number,
    }, time);
  },
};
