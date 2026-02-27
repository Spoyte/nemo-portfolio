import { ArtGenerator, ArtParameter } from "./core";

export interface SacredGeometryParams {
  pattern: "fibonacci" | "flower-of-life" | "metatrons-cube" | "seed-of-life" | "vesica-piscis" | "sri-yantra";
  size: number;
  iterations: number;
  strokeWidth: number;
  colorScheme: "gold" | "silver" | "rainbow" | "monochrome" | "sunset" | "ocean";
  background: "dark" | "light" | "gradient";
  animate: boolean;
  rotationSpeed: number;
  glowIntensity: number;
  showConstruction: boolean;
}

export const sacredGeometryDefaultParams: SacredGeometryParams = {
  pattern: "flower-of-life",
  size: 200,
  iterations: 7,
  strokeWidth: 2,
  colorScheme: "gold",
  background: "dark",
  animate: true,
  rotationSpeed: 0.5,
  glowIntensity: 0.6,
  showConstruction: false,
};

export const sacredGeometryParams: ArtParameter[] = [
  {
    id: "pattern",
    name: "Sacred Pattern",
    type: "select",
    defaultValue: "flower-of-life",
    options: [
      { value: "fibonacci", label: "Fibonacci Spiral" },
      { value: "flower-of-life", label: "Flower of Life" },
      { value: "metatrons-cube", label: "Metatron's Cube" },
      { value: "seed-of-life", label: "Seed of Life" },
      { value: "vesica-piscis", label: "Vesica Piscis" },
      { value: "sri-yantra", label: "Sri Yantra" },
    ],
  },
  {
    id: "size",
    name: "Base Size",
    type: "range",
    min: 50,
    max: 400,
    step: 10,
    defaultValue: 200,
  },
  {
    id: "iterations",
    name: "Iterations",
    type: "range",
    min: 3,
    max: 12,
    step: 1,
    defaultValue: 7,
  },
  {
    id: "strokeWidth",
    name: "Line Thickness",
    type: "range",
    min: 0.5,
    max: 8,
    step: 0.5,
    defaultValue: 2,
  },
  {
    id: "colorScheme",
    name: "Color Scheme",
    type: "select",
    defaultValue: "gold",
    options: [
      { value: "gold", label: "Sacred Gold" },
      { value: "silver", label: "Mystic Silver" },
      { value: "rainbow", label: "Chakra Rainbow" },
      { value: "monochrome", label: "Monochrome" },
      { value: "sunset", label: "Sunset Glow" },
      { value: "ocean", label: "Ocean Depth" },
    ],
  },
  {
    id: "background",
    name: "Background",
    type: "select",
    defaultValue: "dark",
    options: [
      { value: "dark", label: "Deep Void" },
      { value: "light", label: "Pure Light" },
      { value: "gradient", label: "Sacred Gradient" },
    ],
  },
  {
    id: "animate",
    name: "Animate",
    type: "boolean",
    defaultValue: true,
  },
  {
    id: "rotationSpeed",
    name: "Rotation Speed",
    type: "range",
    min: 0,
    max: 3,
    step: 0.1,
    defaultValue: 0.5,
  },
  {
    id: "glowIntensity",
    name: "Glow Intensity",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.6,
  },
  {
    id: "showConstruction",
    name: "Show Construction Lines",
    type: "boolean",
    defaultValue: false,
  },
];

// Golden ratio constant
const PHI = (1 + Math.sqrt(5)) / 2;

// Color schemes
const colorSchemes: Record<string, string[]> = {
  gold: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B", "#F0E68C"],
  silver: ["#C0C0C0", "#A9A9A9", "#D3D3D3", "#E5E5E5", "#B0B0B0", "#909090"],
  rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
  monochrome: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080", "#606060"],
  sunset: ["#FF6B6B", "#FF8E53", "#FE6B8B", "#FF6F61", "#F7DC6F", "#BB8FCE"],
  ocean: ["#006994", "#0085B5", "#00A8E8", "#00D4AA", "#4ECDC4", "#44A08D"],
};

function getColor(scheme: string, index: number, total: number): string {
  const colors = colorSchemes[scheme] || colorSchemes.gold;
  const normalizedIndex = (index / Math.max(1, total - 1)) * (colors.length - 1);
  const lowerIdx = Math.floor(normalizedIndex);
  const upperIdx = Math.min(lowerIdx + 1, colors.length - 1);
  const t = normalizedIndex - lowerIdx;
  
  // Return interpolated or direct color
  return colors[Math.floor((index % colors.length))];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Draw Fibonacci spiral
function drawFibonacciSpiral(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, iterations, strokeWidth, colorScheme, glowIntensity, showConstruction } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Rotation animation
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.001);
  }
  
  // Calculate Fibonacci sequence
  const fib: number[] = [1, 1];
  for (let i = 2; i < iterations + 2; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  
  // Scale to fit
  const maxFib = fib[fib.length - 1];
  const scale = size / Math.sqrt(maxFib);
  
  // Draw squares and arcs
  let x = 0, y = 0;
  let angle = 0;
  
  for (let i = 0; i < iterations; i++) {
    const f = fib[i];
    const squareSize = f * scale * 0.5;
    const color = getColor(colorScheme, i, iterations);
    
    // Draw square (construction line)
    if (showConstruction) {
      ctx.strokeStyle = hexToRgba(color, 0.2);
      ctx.lineWidth = strokeWidth * 0.5;
      ctx.strokeRect(x, y, squareSize, squareSize);
    }
    
    // Draw quarter circle arc
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    // Arc based on current quadrant
    const arcX = x + (angle === 0 || angle === 3 ? squareSize : 0);
    const arcY = y + (angle === 0 || angle === 1 ? squareSize : 0);
    const startAngle = (angle * Math.PI) / 2;
    const endAngle = startAngle + Math.PI / 2;
    
    ctx.arc(arcX, arcY, squareSize, startAngle, endAngle);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Update position for next square
    switch (angle) {
      case 0: x += squareSize; y -= fib[i - 1] * scale * 0.5 || 0; break;
      case 1: x -= fib[i - 1] * scale * 0.5 || 0; y -= squareSize; break;
      case 2: x -= squareSize; y += 0; break;
      case 3: x += 0; y += squareSize; break;
    }
    
    angle = (angle + 1) % 4;
  }
  
  ctx.restore();
}

// Draw Flower of Life
function drawFlowerOfLife(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, iterations, strokeWidth, colorScheme, glowIntensity, showConstruction } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.0005);
  }
  
  const radius = size / 3;
  const circles: { x: number; y: number; r: number }[] = [];
  
  // Center circle
  circles.push({ x: 0, y: 0, r: radius });
  
  // Surrounding circles
  for (let layer = 1; layer < iterations; layer++) {
    const count = layer * 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = layer * radius * Math.sqrt(3);
      circles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        r: radius,
      });
    }
  }
  
  // Draw circles
  circles.forEach((circle, index) => {
    const color = getColor(colorScheme, index, circles.length);
    
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Optional fill for overlapping regions
    if (showConstruction) {
      ctx.fillStyle = hexToRgba(color, 0.05);
      ctx.fill();
    }
  });
  
  ctx.restore();
}

// Draw Seed of Life (center of Flower of Life)
function drawSeedOfLife(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, strokeWidth, colorScheme, glowIntensity } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.001);
  }
  
  const radius = size / 3;
  const circles = [{ x: 0, y: 0, r: radius }];
  
  // Six surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    circles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      r: radius,
    });
  }
  
  circles.forEach((circle, index) => {
    const color = getColor(colorScheme, index, circles.length);
    
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
  });
  
  // Draw central vesica piscis intersection points
  ctx.fillStyle = getColor(colorScheme, 0, 1);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(angle) * radius * 0.5;
    const y = Math.sin(angle) * radius * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

// Draw Metatron's Cube
function drawMetatronsCube(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, strokeWidth, colorScheme, glowIntensity, showConstruction } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.001);
  }
  
  const radius = size / 2.5;
  
  // 13 circles of Metatron's Cube (Fruit of Life pattern)
  const circles: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  
  // Inner ring of 6
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    circles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  
  // Outer ring of 6
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    circles.push({
      x: Math.cos(angle) * radius * 2,
      y: Math.sin(angle) * radius * 2,
    });
  }
  
  const circleRadius = radius * 0.4;
  
  // Draw circles
  circles.forEach((center, index) => {
    const color = getColor(colorScheme, index, circles.length);
    
    ctx.beginPath();
    ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
  });
  
  // Draw lines connecting all centers (the "cube")
  ctx.strokeStyle = getColor(colorScheme, 0, 1);
  ctx.lineWidth = strokeWidth * 0.5;
  
  if (glowIntensity > 0) {
    ctx.shadowBlur = 10 * glowIntensity;
    ctx.shadowColor = ctx.strokeStyle;
  }
  
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const dx = circles[i].x - circles[j].x;
      const dy = circles[i].y - circles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Only draw lines for specific distances (sacred geometry connections)
      if (dist <= radius * 2.1) {
        ctx.beginPath();
        ctx.moveTo(circles[i].x, circles[i].y);
        ctx.lineTo(circles[j].x, circles[j].y);
        ctx.stroke();
      }
    }
  }
  
  ctx.shadowBlur = 0;
  
  // Draw center points
  circles.forEach((center, index) => {
    ctx.fillStyle = getColor(colorScheme, index, circles.length);
    ctx.beginPath();
    ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
}

// Draw Vesica Piscis
function drawVesicaPiscis(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, iterations, strokeWidth, colorScheme, glowIntensity, showConstruction } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.001);
  }
  
  const radius = size / 2;
  
  // Draw multiple vesica piscis in a pattern
  for (let i = 0; i < iterations; i++) {
    const scale = 1 - (i * 0.1);
    const r = radius * scale;
    const offset = r * 0.866; // sqrt(3)/2
    
    const color = getColor(colorScheme, i, iterations);
    
    // Left circle
    ctx.beginPath();
    ctx.arc(-offset / 2, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 20 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    
    // Right circle
    ctx.beginPath();
    ctx.arc(offset / 2, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Fill the lens shape
    if (showConstruction) {
      ctx.fillStyle = hexToRgba(color, 0.1);
      ctx.fill();
    }
  }
  
  // Draw central eye (mandorla)
  ctx.fillStyle = getColor(colorScheme, 0, 1);
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// Draw Sri Yantra
function drawSriYantra(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  params: SacredGeometryParams,
  time: number
): void {
  const { size, strokeWidth, colorScheme, glowIntensity } = params;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  if (params.animate) {
    ctx.rotate(time * params.rotationSpeed * 0.0003);
  }
  
  const scale = size / 400;
  
  // Sri Yantra triangles
  const triangles = [
    // Downward pointing (Shakti - 4 triangles)
    { points: [[0, -150], [-130, 100], [130, 100]], down: true },
    { points: [[0, -100], [-90, 70], [90, 70]], down: true },
    { points: [[0, -50], [-50, 40], [50, 40]], down: true },
    { points: [[0, 0], [-25, 20], [25, 20]], down: true },
    // Upward pointing (Shiva - 5 triangles)
    { points: [[0, 150], [-130, -100], [130, -100]], down: false },
    { points: [[0, 100], [-90, -70], [90, -70]], down: false },
    { points: [[0, 50], [-50, -40], [50, -40]], down: false },
    { points: [[0, 0], [-25, -20], [25, -20]], down: false },
    { points: [[0, -30], [-15, -10], [15, -10]], down: false },
  ];
  
  // Scale triangles
  const scaledTriangles = triangles.map((t) => ({
    ...t,
    points: t.points.map((p) => [p[0] * scale, p[1] * scale]),
  }));
  
  // Draw triangles
  scaledTriangles.forEach((triangle, index) => {
    const color = getColor(colorScheme, index, scaledTriangles.length);
    
    ctx.beginPath();
    ctx.moveTo(triangle.points[0][0], triangle.points[0][1]);
    ctx.lineTo(triangle.points[1][0], triangle.points[1][1]);
    ctx.lineTo(triangle.points[2][0], triangle.points[2][1]);
    ctx.closePath();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Fill with slight transparency
    ctx.fillStyle = hexToRgba(color, 0.05);
    ctx.fill();
  });
  
  // Draw bindu (center point)
  ctx.fillStyle = getColor(colorScheme, 0, 1);
  ctx.beginPath();
  ctx.arc(0, 0, 6 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw outer circles (representing the lotus)
  const outerCircles = 3;
  for (let i = 0; i < outerCircles; i++) {
    const r = (160 + i * 20) * scale;
    const color = getColor(colorScheme, i, outerCircles);
    
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth * 0.5;
    
    if (glowIntensity > 0) {
      ctx.shadowBlur = 10 * glowIntensity;
      ctx.shadowColor = color;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

export function renderSacredGeometry(
  ctx: CanvasRenderingContext2D,
  params: SacredGeometryParams,
  time: number
): void {
  const { width, height } = ctx.canvas;
  const { background } = params;
  
  // Clear and draw background
  if (background === "gradient") {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    if (params.colorScheme === "gold") {
      gradient.addColorStop(0, "#1a0f00");
      gradient.addColorStop(0.5, "#0d0800");
      gradient.addColorStop(1, "#000000");
    } else if (params.colorScheme === "ocean") {
      gradient.addColorStop(0, "#001a2e");
      gradient.addColorStop(0.5, "#000d1a");
      gradient.addColorStop(1, "#000000");
    } else {
      gradient.addColorStop(0, "#1a0a1a");
      gradient.addColorStop(0.5, "#0d050d");
      gradient.addColorStop(1, "#000000");
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else if (background === "light") {
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);
  }
  
  // Draw selected pattern
  const centerX = width / 2;
  const centerY = height / 2;
  
  switch (params.pattern) {
    case "fibonacci":
      drawFibonacciSpiral(ctx, centerX, centerY, params, time);
      break;
    case "flower-of-life":
      drawFlowerOfLife(ctx, centerX, centerY, params, time);
      break;
    case "seed-of-life":
      drawSeedOfLife(ctx, centerX, centerY, params, time);
      break;
    case "metatrons-cube":
      drawMetatronsCube(ctx, centerX, centerY, params, time);
      break;
    case "vesica-piscis":
      drawVesicaPiscis(ctx, centerX, centerY, params, time);
      break;
    case "sri-yantra":
      drawSriYantra(ctx, centerX, centerY, params, time);
      break;
  }
}

export const sacredGeometry: ArtGenerator = {
  id: "sacred-geometry",
  name: "Sacred Geometry",
  description: "Ancient mathematical patterns: Fibonacci spirals, Flower of Life, Metatron's Cube, and Sri Yantra. Visual representations of the mathematical principles underlying nature and consciousness.",
  params: sacredGeometryParams,
  defaultParams: sacredGeometryDefaultParams,
  render: renderSacredGeometry,
};
