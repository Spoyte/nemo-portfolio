import { ArtGenerator, ArtParams, ParamConfig } from "./core";

export interface PenroseTilingParams extends ArtParams {
  iterations: number;
  scale: number;
  colorScheme: "monochrome" | "golden" | "sunset" | "ocean" | "forest";
  strokeWidth: number;
  fillTiles: boolean;
  showRhombi: boolean;
  showAmmannLines: boolean;
  rotation: number;
}

export const penroseTilingDefaultParams: PenroseTilingParams = {
  iterations: 5,
  scale: 1,
  colorScheme: "golden",
  strokeWidth: 1,
  fillTiles: true,
  showRhombi: true,
  showAmmannLines: false,
  rotation: 0,
};

// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2;

// Color schemes
const colorSchemes: Record<string, (type: "thin" | "thick", index: number, total: number) => { fill: string; stroke: string }> = {
  monochrome: (type) => ({
    fill: type === "thin" ? "#1a1a2e" : "#16213e",
    stroke: "#e94560",
  }),
  
  golden: (type, index, total) => {
    const t = index / Math.max(total, 1);
    if (type === "thin") {
      return {
        fill: `hsl(${45 + t * 30}, 70%, ${20 + t * 15}%)`,
        stroke: `hsl(${45 + t * 30}, 80%, 60%)`,
      };
    }
    return {
      fill: `hsl(${35 + t * 25}, 60%, ${25 + t * 10}%)`,
      stroke: `hsl(${35 + t * 25}, 70%, 55%)`,
    };
  },
  
  sunset: (type, index, total) => {
    const t = index / Math.max(total, 1);
    if (type === "thin") {
      return {
        fill: `hsl(${280 + t * 60}, 60%, ${20 + t * 15}%)`,
        stroke: `hsl(${300 + t * 40}, 80%, 65%)`,
      };
    }
    return {
      fill: `hsl(${340 + t * 40}, 70%, ${25 + t * 10}%)`,
      stroke: `hsl(${10 + t * 30}, 90%, 60%)`,
      };
  },
  
  ocean: (type, index, total) => {
    const t = index / Math.max(total, 1);
    if (type === "thin") {
      return {
        fill: `hsl(${180 + t * 40}, 50%, ${15 + t * 15}%)`,
        stroke: `hsl(${190 + t * 30}, 70%, 60%)`,
      };
    }
    return {
      fill: `hsl(${200 + t * 30}, 45%, ${20 + t * 10}%)`,
      stroke: `hsl(${210 + t * 20}, 60%, 55%)`,
      };
  },
  
  forest: (type, index, total) => {
    const t = index / Math.max(total, 1);
    if (type === "thin") {
      return {
        fill: `hsl(${100 + t * 40}, 40%, ${15 + t * 10}%)`,
        stroke: `hsl(${120 + t * 30}, 60%, 50%)`,
      };
    }
    return {
      fill: `hsl(${80 + t * 30}, 35%, ${20 + t * 8}%)`,
      stroke: `hsl(${90 + t * 20}, 50%, 45%)`,
      };
  },
};

// Point type for rhombus vertices
interface Point {
  x: number;
  y: number;
}

// Rhombus type with vertices labeled for subdivision
interface Rhombus {
  a: Point;
  b: Point;
  c: Point;
  d: Point;
  type: "thin" | "thick";
  colorIndex: number;
}

// Create a rhombus from center, angle, and type
function createRhombus(center: Point, angle: number, type: "thin" | "thick", size: number): Rhombus {
  // Thin rhombus: angles are 36° and 144°
  // Thick rhombus: angles are 72° and 108°
  const halfAngle = type === "thin" ? Math.PI / 10 : Math.PI / 5; // 18° or 36°
  
  // Side length
  const side = size / (2 * Math.cos(halfAngle));
  
  // Calculate vertices
  // a and c are opposite corners (the acute/obtuse angles)
  // b and d are the other two corners
  const a: Point = {
    x: center.x + side * Math.cos(angle - halfAngle),
    y: center.y + side * Math.sin(angle - halfAngle),
  };
  
  const b: Point = {
    x: center.x + side * Math.cos(angle + halfAngle),
    y: center.y + side * Math.sin(angle + halfAngle),
  };
  
  const c: Point = {
    x: center.x + side * Math.cos(angle + Math.PI - halfAngle),
    y: center.y + side * Math.sin(angle + Math.PI - halfAngle),
  };
  
  const d: Point = {
    x: center.x + side * Math.cos(angle + Math.PI + halfAngle),
    y: center.y + side * Math.sin(angle + Math.PI + halfAngle),
  };
  
  return { a, b, c, d, type, colorIndex: 0 };
}

// Distance between two points
function dist(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Linear interpolation between two points
function lerp(p1: Point, p2: Point, t: number): Point {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}

// Subdivide a rhombus according to Penrose inflation rules
function subdivide(rhombus: Rhombus): Rhombus[] {
  const { a, b, c, d, type } = rhombus;
  
  if (type === "thin") {
    // Thin rhombus subdivision (36°-144° rhombus)
    // Split into one thin and one thick rhombus
    // Point e divides AD in ratio 1:PHI (closer to A)
    const e = lerp(a, d, 1 / PHI);
    
    return [
      { a: e, b: c, c: b, d: a, type: "thin", colorIndex: 0 },
      { a: c, b: e, c: d, d: c, type: "thick", colorIndex: 0 },
    ].filter(r => {
      // Filter out degenerate rhombi
      const d1 = dist(r.a, r.c);
      const d2 = dist(r.b, r.d);
      return d1 > 0.1 && d2 > 0.1;
    });
  } else {
    // Thick rhombus subdivision (72°-108° rhombus)
    // Split into two thick and one thin rhombus
    // Point e divides AB in ratio 1:PHI (closer to A)
    // Point f divides CB in ratio 1:PHI (closer to C)
    const e = lerp(a, b, 1 / PHI);
    const f = lerp(c, b, 1 / PHI);
    
    return [
      { a: f, b: c, c: d, d: a, type: "thick", colorIndex: 0 },
      { a: e, b: f, c: a, d: e, type: "thick", colorIndex: 0 },
      { a: f, b: e, c: b, d: f, type: "thin", colorIndex: 0 },
    ].filter(r => {
      const d1 = dist(r.a, r.c);
      const d2 = dist(r.b, r.d);
      return d1 > 0.1 && d2 > 0.1;
    });
  }
}

// Generate initial set of rhombi (wheel pattern)
function generateInitialRhombi(centerX: number, centerY: number, size: number): Rhombus[] {
  const rhombi: Rhombus[] = [];
  const center: Point = { x: centerX, y: centerY };
  
  // Create 10 rhombi arranged in a wheel pattern
  // This creates a valid Penrose tiling seed
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5; // 36° increments
    // Alternate between thin and thick rhombi
    const type: "thin" | "thick" = i % 2 === 0 ? "thick" : "thin";
    rhombi.push(createRhombus(center, angle, type, size));
  }
  
  return rhombi;
}

// Generate Penrose tiling through iterative subdivision
function generatePenroseTiling(centerX: number, centerY: number, iterations: number, baseSize: number): Rhombus[] {
  let rhombi = generateInitialRhombi(centerX, centerY, baseSize);
  
  for (let i = 0; i < iterations; i++) {
    const newRhombi: Rhombus[] = [];
    for (const rhombus of rhombi) {
      const subdivided = subdivide(rhombus);
      // Assign color index based on iteration for gradient effect
      subdivided.forEach((r, idx) => {
        r.colorIndex = i * 100 + idx;
      });
      newRhombi.push(...subdivided);
    }
    rhombi = newRhombi;
  }
  
  return rhombi;
}

// Get vertices array from rhombus
function getVertices(rhombus: Rhombus): Point[] {
  return [rhombus.a, rhombus.b, rhombus.c, rhombus.d];
}

// Draw a rhombus
function drawRhombus(
  ctx: CanvasRenderingContext2D,
  rhombus: Rhombus,
  getColor: (type: "thin" | "thick", index: number, total: number) => { fill: string; stroke: string },
  params: PenroseTilingParams,
  totalRhombi: number
): void {
  const vertices = getVertices(rhombus);
  const { type, colorIndex } = rhombus;
  const { fill, stroke } = getColor(type, colorIndex, totalRhombi);
  
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  
  if (params.fillTiles) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  
  if (params.showRhombi) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = params.strokeWidth;
    ctx.stroke();
  }
}

// Draw Ammann bars (decoration lines that reveal the quasicrystal structure)
function drawAmmannBars(ctx: CanvasRenderingContext2D, rhombi: Rhombus[], params: PenroseTilingParams): void {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = params.strokeWidth * 0.5;
  
  for (const rhombus of rhombi) {
    const { a, b, c, d, type } = rhombus;
    
    if (type === "thin") {
      // For thin rhombus, draw line connecting specific points
      const t1 = 1 / PHI;
      const p1 = lerp(a, b, t1);
      const p2 = lerp(d, c, t1);
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else {
      // For thick rhombus
      const t1 = 1 / (PHI * PHI);
      const p1 = lerp(a, b, t1);
      const p2 = lerp(d, c, t1);
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
}

export function renderPenroseTiling(
  ctx: CanvasRenderingContext2D,
  params: PenroseTilingParams,
  timestamp?: number
): void {
  const { width, height } = ctx.canvas;
  const { iterations, scale, colorScheme, rotation } = params;
  
  // Clear canvas
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);
  
  // Save context for rotation
  ctx.save();
  
  // Apply rotation
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);
  
  // Calculate base size based on canvas and scale
  const baseSize = Math.min(width, height) * 0.35 * scale;
  
  // Generate tiling
  const rhombi = generatePenroseTiling(width / 2, height / 2, iterations, baseSize);
  
  // Get color function
  const getColor = colorSchemes[colorScheme] || colorSchemes.golden;
  
  // Draw all rhombi
  for (const rhombus of rhombi) {
    drawRhombus(ctx, rhombus, getColor, params, rhombi.length);
  }
  
  // Draw Ammann bars if enabled
  if (params.showAmmannLines) {
    drawAmmannBars(ctx, rhombi, params);
  }
  
  ctx.restore();
  
  // Draw info overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px monospace";
  ctx.fillText(`Rhombi: ${rhombi.length}`, 20, height - 20);
  ctx.fillText(`φ = ${PHI.toFixed(6)}`, 20, height - 40);
}

export const penroseTiling: ArtGenerator = {
  name: "Penrose Tiling",
  description: "Aperiodic quasicrystal patterns that never repeat — two rhombus types tile the plane infinitely without periodicity, using the golden ratio.",
  params: {
    iterations: {
      type: "range",
      default: 5,
      min: 1,
      max: 7,
      step: 1,
      label: "Iterations",
      description: "Subdivision depth (higher = more tiles)",
    },
    scale: {
      type: "range",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
      label: "Scale",
      description: "Size of the tiling pattern",
    },
    colorScheme: {
      type: "select",
      default: "golden",
      options: ["monochrome", "golden", "sunset", "ocean", "forest"],
      label: "Color Scheme",
      description: "Color palette for the tiles",
    },
    strokeWidth: {
      type: "range",
      default: 1,
      min: 0.5,
      max: 3,
      step: 0.5,
      label: "Stroke Width",
      description: "Width of tile outlines",
    },
    fillTiles: {
      type: "boolean",
      default: true,
      label: "Fill Tiles",
      description: "Fill rhombi with color",
    },
    showRhombi: {
      type: "boolean",
      default: true,
      label: "Show Outlines",
      description: "Display tile boundaries",
    },
    showAmmannLines: {
      type: "boolean",
      default: false,
      label: "Ammann Bars",
      description: "Show decorative lines revealing quasicrystal structure",
    },
    rotation: {
      type: "range",
      default: 0,
      min: 0,
      max: 360,
      step: 5,
      label: "Rotation",
      description: "Rotate the entire pattern",
    },
  },
  generate: renderPenroseTiling,
  category: "geometric",
  tags: ["quasicrystal", "aperiodic", "golden-ratio", "tiling", "mathematical"],
};
