import { ArtGenerator, ArtParams } from "./core";

// Sierpinski Triangle - Classic fractal via recursive subdivision
// The pattern: recursively remove the middle triangle from each triangle

interface Point {
  x: number;
  y: number;
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.fill();
}

function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

function sierpinskiRecursive(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  depth: number,
  colorScheme: string,
  inverted: boolean,
  time?: number
): void {
  if (depth === 0) {
    // Base case: draw the triangle
    let color: string;
    
    if (colorScheme === "classic") {
      color = inverted ? "#1a1a2e" : "#e94560";
    } else if (colorScheme === "gradient") {
      // Gradient based on triangle position
      const avgY = (p1.y + p2.y + p3.y) / 3;
      const hue = (avgY / 600) * 360 + (time ? time * 0.01 : 0);
      color = `hsl(${hue % 360}, 70%, 50%)`;
    } else if (colorScheme === "fire") {
      const avgY = (p1.y + p2.y + p3.y) / 3;
      const intensity = 1 - avgY / 600;
      color = `hsl(${intensity * 60}, 100%, ${30 + intensity * 40}%)`;
    } else if (colorScheme === "ocean") {
      const avgY = (p1.y + p2.y + p3.y) / 3;
      const intensity = avgY / 600;
      color = `hsl(${180 + intensity * 60}, 80%, ${30 + intensity * 40}%)`;
    } else if (colorScheme === "neon") {
      const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"];
      color = colors[Math.floor(Math.random() * colors.length)];
    } else {
      color = inverted ? "#0a0a0a" : "#ffffff";
    }
    
    drawTriangle(ctx, p1, p2, p3, color);
    return;
  }

  // Calculate midpoints
  const m12 = getMidpoint(p1, p2);
  const m23 = getMidpoint(p2, p3);
  const m31 = getMidpoint(p3, p1);

  if (inverted) {
    // Inverted mode: draw the center triangle, recurse on corners
    let centerColor: string;
    if (colorScheme === "classic") {
      centerColor = "#e94560";
    } else if (colorScheme === "gradient") {
      const avgY = (m12.y + m23.y + m31.y) / 3;
      const hue = (avgY / 600) * 360 + (time ? time * 0.01 : 0);
      centerColor = `hsl(${hue % 360}, 70%, 50%)`;
    } else if (colorScheme === "fire") {
      centerColor = "#ff6b35";
    } else if (colorScheme === "ocean") {
      centerColor = "#0066cc";
    } else if (colorScheme === "neon") {
      centerColor = "#ff00ff";
    } else {
      centerColor = "#ffffff";
    }
    drawTriangle(ctx, m12, m23, m31, centerColor);
    
    // Recurse on the three corner triangles
    sierpinskiRecursive(ctx, p1, m12, m31, depth - 1, colorScheme, inverted, time);
    sierpinskiRecursive(ctx, m12, p2, m23, depth - 1, colorScheme, inverted, time);
    sierpinskiRecursive(ctx, m31, m23, p3, depth - 1, colorScheme, inverted, time);
  } else {
    // Standard mode: recurse on the three corner triangles
    sierpinskiRecursive(ctx, p1, m12, m31, depth - 1, colorScheme, inverted, time);
    sierpinskiRecursive(ctx, m12, p2, m23, depth - 1, colorScheme, inverted, time);
    sierpinskiRecursive(ctx, m31, m23, p3, depth - 1, colorScheme, inverted, time);
  }
}

export function renderSierpinski(
  ctx: CanvasRenderingContext2D,
  params: {
    depth: number;
    colorScheme: string;
    inverted: boolean;
    rotation: number;
    scale: number;
    offsetX: number;
    offsetY: number;
  },
  time?: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Clear canvas
  ctx.fillStyle = params.inverted ? "#16213e" : "#0a0a0a";
  ctx.fillRect(0, 0, width, height);
  
  // Calculate triangle size based on canvas
  const baseSize = Math.min(width, height) * 0.8 * (params.scale / 100);
  const centerX = width / 2 + (params.offsetX - 50) * width / 100;
  const centerY = height / 2 + (params.offsetY - 50) * height / 100;
  
  // Calculate triangle vertices (equilateral)
  const rotationRad = (params.rotation * Math.PI) / 180 + (time ? time * 0.0005 : 0);
  
  const p1: Point = {
    x: centerX + baseSize * Math.cos(rotationRad - Math.PI / 2),
    y: centerY + baseSize * Math.sin(rotationRad - Math.PI / 2),
  };
  const p2: Point = {
    x: centerX + baseSize * Math.cos(rotationRad + Math.PI / 6),
    y: centerY + baseSize * Math.sin(rotationRad + Math.PI / 6),
  };
  const p3: Point = {
    x: centerX + baseSize * Math.cos(rotationRad + 5 * Math.PI / 6),
    y: centerY + baseSize * Math.sin(rotationRad + 5 * Math.PI / 6),
  };
  
  if (!params.inverted) {
    // Draw base triangle for standard mode
    ctx.fillStyle = params.colorScheme === "classic" ? "#1a1a2e" : "#1a1a1a";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
  }
  
  // Draw Sierpinski pattern
  sierpinskiRecursive(ctx, p1, p2, p3, params.depth, params.colorScheme, params.inverted, time);
  
  // Add subtle border for depth
  ctx.strokeStyle = params.inverted ? "#e94560" : "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.stroke();
}

export const sierpinskiTriangle: ArtGenerator = {
  name: "Sierpinski Triangle",
  description: "The iconic fractal triangle — infinite complexity from simple recursion. Each iteration subdivides, revealing the void within.",
  params: {
    depth: {
      name: "Recursion Depth",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["classic", "monochrome", "gradient", "fire", "ocean", "neon"],
      default: "classic",
    },
    inverted: {
      name: "Inverted Mode",
      type: "select",
      options: ["false", "true"],
      default: "false",
    },
    rotation: {
      name: "Rotation",
      type: "range",
      min: 0,
      max: 360,
      step: 5,
      default: 0,
    },
    scale: {
      name: "Scale",
      type: "range",
      min: 30,
      max: 120,
      step: 5,
      default: 80,
    },
    offsetX: {
      name: "Offset X",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 50,
    },
    offsetY: {
      name: "Offset Y",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 50,
    },
  },
  generate: (ctx, params, time) => {
    renderSierpinski(ctx, {
      depth: params.depth as number,
      colorScheme: params.colorScheme as string,
      inverted: params.inverted === "true",
      rotation: params.rotation as number,
      scale: params.scale as number,
      offsetX: params.offsetX as number,
      offsetY: params.offsetY as number,
    }, time);
  },
  meta: {
    category: "mathematical",
    complexity: "moderate",
    tags: ["geometric", "ordered", "minimal"],
    created: "2026-02-28",
  },
};
