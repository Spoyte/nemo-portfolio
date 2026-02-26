import { ArtGenerator, ArtParams, fillCanvas, hslToRgb } from "./core";

export interface SpaceFillingCurvesParams {
  curveType: "hilbert" | "peano" | "dragon" | "gosper" | "koch";
  iterations: number;
  lineWidth: number;
  colorScheme: "rainbow" | "gradient" | "monochrome" | "fire" | "ocean";
  animationSpeed: number;
  showConstruction: boolean;
  drawMode: "line" | "dots" | "glow";
  backgroundFade: number;
  symmetry: number;
}

export const spaceFillingCurvesDefaultParams: SpaceFillingCurvesParams = {
  curveType: "hilbert",
  iterations: 4,
  lineWidth: 2,
  colorScheme: "rainbow",
  animationSpeed: 1,
  showConstruction: false,
  drawMode: "glow",
  backgroundFade: 0.95,
  symmetry: 1,
};

// Color scheme definitions
const COLOR_SCHEMES: Record<string, { bg: string; colors: string[] }> = {
  rainbow: {
    bg: "#0a0a0f",
    colors: ["#ff0080", "#ff8000", "#ffff00", "#00ff80", "#0080ff", "#8000ff"],
  },
  gradient: {
    bg: "#0f0a0a",
    colors: ["#ff0066", "#ff3366", "#ff6666", "#ff9966", "#ffcc66", "#ffff66"],
  },
  monochrome: {
    bg: "#0a0a0a",
    colors: ["#ffffff", "#cccccc", "#999999", "#666666", "#444444", "#222222"],
  },
  fire: {
    bg: "#1a0500",
    colors: ["#ff0000", "#ff4400", "#ff8800", "#ffcc00", "#ffff00", "#ff6600"],
  },
  ocean: {
    bg: "#000a1a",
    colors: ["#0066ff", "#0099ff", "#00ccff", "#00ffff", "#66ffff", "#99ffff"],
  },
};

// Get color from scheme with interpolation
function getColor(scheme: string, t: number): string {
  const colors = COLOR_SCHEMES[scheme].colors;
  const idx = Math.floor(t * (colors.length - 1));
  const frac = t * (colors.length - 1) - idx;
  
  const c1 = hexToRgb(colors[Math.min(idx, colors.length - 1)]);
  const c2 = hexToRgb(colors[Math.min(idx + 1, colors.length - 1)]);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * frac);
  const g = Math.round(c1.g + (c2.g - c1.g) * frac);
  const b = Math.round(c1.b + (c2.b - c1.b) * frac);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// ============ HILBERT CURVE ============
// L-system: A → - B F + A F A + F B -
//           B → + A F - B F B - F A +
function generateHilbert(iterations: number): string {
  let axiom = "A";
  const rules: Record<string, string> = {
    A: "-BF+AFA+FB-",
    B: "+AF-BFB-FA+",
  };
  
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of axiom) {
      next += rules[char] || char;
    }
    axiom = next;
  }
  
  return axiom;
}

// ============ PEANO CURVE ============
// Space-filling curve with 9 segments per iteration
function generatePeano(iterations: number): string {
  // Simplified Peano-like curve using L-system
  let axiom = "F";
  const rule = "F+F-F-F-F+F+F+F-F";
  
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of axiom) {
      next += char === "F" ? rule : char;
    }
    axiom = next;
  }
  
  return axiom;
}

// ============ DRAGON CURVE ============
// L-system: F → F+G, G → F-G
function generateDragon(iterations: number): string {
  let axiom = "FX";
  const rules: Record<string, string> = {
    X: "X+YF+",
    Y: "-FX-Y",
  };
  
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of axiom) {
      next += rules[char] || char;
    }
    axiom = next;
  }
  
  // Remove X and Y, keep only drawing commands
  return axiom.replace(/[XY]/g, "");
}

// ============ GOSPER CURVE (Flowsnake) ============
// L-system for Gosper island boundary
function generateGosper(iterations: number): string {
  let axiom = "A";
  const rules: Record<string, string> = {
    A: "A-B--B+A++AA+B-",
    B: "+A-BB--B-A++A+B",
  };
  
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of axiom) {
      next += rules[char] || char;
    }
    axiom = next;
  }
  
  return axiom;
}

// ============ KOCH SNOWFLAKE ============
function generateKoch(iterations: number): string {
  let axiom = "F--F--F";
  const rule = "F+F--F+F";
  
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const char of axiom) {
      next += char === "F" ? rule : char;
    }
    axiom = next;
  }
  
  return axiom;
}

// Generate curve based on type
function generateCurve(curveType: string, iterations: number): string {
  switch (curveType) {
    case "hilbert": return generateHilbert(iterations);
    case "peano": return generatePeano(iterations);
    case "dragon": return generateDragon(iterations);
    case "gosper": return generateGosper(iterations);
    case "koch": return generateKoch(iterations);
    default: return generateHilbert(iterations);
  }
}

// Parse L-system and generate points
function curveToPoints(
  instructions: string,
  curveType: string,
  width: number,
  height: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Determine angle and step size based on curve type
  let angle = 0;
  let angleIncrement = 90;
  let stepScale = 1;
  
  switch (curveType) {
    case "hilbert":
      angleIncrement = 90;
      stepScale = 0.9;
      break;
    case "peano":
      angleIncrement = 90;
      stepScale = 0.85;
      break;
    case "dragon":
      angleIncrement = 90;
      stepScale = 0.95;
      break;
    case "gosper":
      angleIncrement = 60;
      stepScale = 0.88;
      break;
    case "koch":
      angleIncrement = 60;
      stepScale = 0.92;
      break;
  }
  
  // Calculate bounds to center the curve
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  let x = 0, y = 0;
  let tempAngle = 0;
  
  // First pass: calculate bounds
  for (const cmd of instructions) {
    switch (cmd) {
      case "F":
      case "A":
      case "B":
        x += Math.cos((tempAngle * Math.PI) / 180);
        y += Math.sin((tempAngle * Math.PI) / 180);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        break;
      case "+":
        tempAngle += angleIncrement;
        break;
      case "-":
        tempAngle -= angleIncrement;
        break;
    }
  }
  
  // Calculate scale to fit in canvas
  const curveWidth = maxX - minX || 1;
  const curveHeight = maxY - minY || 1;
  const scale = Math.min(
    (width * stepScale) / curveWidth,
    (height * stepScale) / curveHeight
  );
  
  const offsetX = (width - curveWidth * scale) / 2 - minX * scale;
  const offsetY = (height - curveHeight * scale) / 2 - minY * scale;
  
  // Second pass: generate points
  x = offsetX;
  y = offsetY;
  points.push({ x, y });
  
  for (const cmd of instructions) {
    switch (cmd) {
      case "F":
      case "A":
      case "B":
        x += Math.cos((angle * Math.PI) / 180) * scale;
        y += Math.sin((angle * Math.PI) / 180) * scale;
        points.push({ x, y });
        break;
      case "+":
        angle += angleIncrement;
        break;
      case "-":
        angle -= angleIncrement;
        break;
    }
  }
  
  return points;
}

// Draw the curve with animation
function drawCurve(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  params: SpaceFillingCurvesParams,
  time: number
): void {
  const { colorScheme, lineWidth, drawMode, animationSpeed } = params;
  
  // Animation progress (0 to 1, looping)
  const animProgress = (time * 0.0005 * animationSpeed) % 1;
  
  // Number of points to draw based on animation
  const drawCount = Math.floor(points.length * animProgress);
  const fadeStart = Math.max(0, drawCount - 50);
  
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  if (drawMode === "glow") {
    // Multi-layer glow effect
    for (let layer = 3; layer >= 0; layer--) {
      const layerWidth = lineWidth * (layer + 1) * 2;
      const alpha = layer === 0 ? 1 : 0.15 / layer;
      
      ctx.lineWidth = layerWidth;
      
      for (let i = 0; i < drawCount - 1; i++) {
        const t = i / (points.length - 1);
        const color = getColor(colorScheme, t);
        
        if (layer === 0) {
          ctx.strokeStyle = color;
        } else {
          const rgb = hexToRgb(color);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        }
        
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.stroke();
      }
    }
  } else if (drawMode === "line") {
    ctx.lineWidth = lineWidth;
    
    for (let i = 0; i < drawCount - 1; i++) {
      const t = i / (points.length - 1);
      ctx.strokeStyle = getColor(colorScheme, t);
      
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
      ctx.stroke();
    }
  } else if (drawMode === "dots") {
    for (let i = 0; i < drawCount; i++) {
      const t = i / (points.length - 1);
      const fade = i < fadeStart ? 0.3 : 1;
      
      ctx.fillStyle = getColor(colorScheme, t);
      ctx.globalAlpha = fade;
      
      const size = lineWidth * (1 + Math.sin(i * 0.1 + time * 0.002) * 0.3);
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  
  // Draw construction lines if enabled
  if (params.showConstruction && drawCount > 1) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// Apply symmetry transformations
function applySymmetry(
  points: { x: number; y: number }[],
  symmetry: number,
  width: number,
  height: number
): { x: number; y: number }[][] {
  const result: { x: number; y: number }[][] = [points];
  
  if (symmetry <= 1) return result;
  
  const cx = width / 2;
  const cy = height / 2;
  
  for (let s = 1; s < symmetry; s++) {
    const angle = (s * 2 * Math.PI) / symmetry;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    const transformed = points.map((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return {
        x: cx + dx * cos - dy * sin,
        y: cy + dx * sin + dy * cos,
      };
    });
    
    result.push(transformed);
  }
  
  return result;
}

export function renderSpaceFillingCurves(
  ctx: CanvasRenderingContext2D,
  params: SpaceFillingCurvesParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const colors = COLOR_SCHEMES[params.colorScheme];
  
  // Fade effect for trails
  ctx.fillStyle = colors.bg + Math.round((1 - params.backgroundFade) * 255).toString(16).padStart(2, '0');
  ctx.fillRect(0, 0, width, height);
  
  // Generate curve instructions
  const instructions = generateCurve(params.curveType, params.iterations);
  
  // Convert to points
  let points = curveToPoints(instructions, params.curveType, width, height);
  
  // Apply symmetry
  const symmetricPoints = applySymmetry(points, params.symmetry, width, height);
  
  // Draw each symmetry copy
  for (const pointSet of symmetricPoints) {
    drawCurve(ctx, pointSet, params, time);
  }
  
  // Add subtle vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export const spaceFillingCurves: ArtGenerator = {
  name: "Space-Filling Curves",
  description:
    "Mathematical curves that visit every point in a space. From Hilbert's continuous " +
    "mapping of a line to a square, to the dragon curve's fractal complexity, these " +
    "curves reveal the deep connection between dimensionality and continuity. " +
    "Each iteration increases the curve's complexity exponentially, creating intricate " +
    "patterns that approach infinite length while remaining confined to a finite area.",
  params: {
    curveType: {
      name: "Curve Type",
      type: "select",
      options: ["hilbert", "peano", "dragon", "gosper", "koch"],
      default: "hilbert",
    },
    iterations: {
      name: "Iterations",
      type: "range",
      min: 1,
      max: 7,
      step: 1,
      default: 4,
    },
    lineWidth: {
      name: "Line Width",
      type: "range",
      min: 0.5,
      max: 8,
      step: 0.5,
      default: 2,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["rainbow", "gradient", "monochrome", "fire", "ocean"],
      default: "rainbow",
    },
    animationSpeed: {
      name: "Animation Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1,
    },
    showConstruction: {
      name: "Show Construction",
      type: "select",
      options: ["true", "false"],
      default: "false",
    },
    drawMode: {
      name: "Draw Mode",
      type: "select",
      options: ["line", "dots", "glow"],
      default: "glow",
    },
    backgroundFade: {
      name: "Trail Persistence",
      type: "range",
      min: 0.5,
      max: 1,
      step: 0.01,
      default: 0.95,
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
    const typedParams: SpaceFillingCurvesParams = {
      curveType: params.curveType as SpaceFillingCurvesParams["curveType"],
      iterations: Number(params.iterations),
      lineWidth: Number(params.lineWidth),
      colorScheme: params.colorScheme as SpaceFillingCurvesParams["colorScheme"],
      animationSpeed: Number(params.animationSpeed),
      showConstruction: params.showConstruction === "true",
      drawMode: params.drawMode as SpaceFillingCurvesParams["drawMode"],
      backgroundFade: Number(params.backgroundFade),
      symmetry: Number(params.symmetry),
    };
    renderSpaceFillingCurves(ctx, typedParams, time);
  },
  meta: {
    category: "mathematical",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed"],
    created: "2024-02-26",
  },
};
