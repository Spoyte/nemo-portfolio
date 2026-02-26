import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// Islamic Geometric Patterns - Traditional star polygons, rosettes, and tessellations
// Inspired by the rich mathematical art tradition of Islamic geometric design

interface IslamicPatternParams extends ArtParams {
  pattern: string; // star-6, star-8, star-12, rosette, girih, tessellation
  complexity: number; // 1-5
  scale: number; // 50-200
  rotation: number; // 0-360
  colorScheme: string; // traditional, cobalt, gold, emerald, sunset, monochrome
  lineWidth: number; // 1-5
  showConstruction: number; // 0-1 (boolean as number)
  animationSpeed: number; // 0-2
}

const colorSchemes: Record<string, { bg: string; primary: string; secondary: string; accent: string; lines: string }> = {
  traditional: { bg: "#f5f0e6", primary: "#1a4d6e", secondary: "#c9a227", accent: "#8b4513", lines: "#1a1a1a" },
  cobalt: { bg: "#0a1628", primary: "#1e3a5f", secondary: "#4a90e2", accent: "#87ceeb", lines: "#ffffff" },
  gold: { bg: "#1a1410", primary: "#8b6914", secondary: "#d4af37", accent: "#f4e4c1", lines: "#ffd700" },
  emerald: { bg: "#0d2818", primary: "#1a5233", secondary: "#2e8b57", accent: "#90ee90", lines: "#98fb98" },
  sunset: { bg: "#2d1b2e", primary: "#8b3a3a", secondary: "#d4665a", accent: "#f4a460", lines: "#ffdab9" },
  monochrome: { bg: "#0a0a0a", primary: "#2a2a2a", secondary: "#4a4a4a", accent: "#6a6a6a", lines: "#cccccc" },
};

function drawStarPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  points: number,
  density: number,
  rotation: number,
  colors: { bg: string; primary: string; secondary: string; accent: string; lines: string },
  lineWidth: number,
  showConstruction: boolean,
  time: number = 0
): void {
  const vertices: { x: number; y: number }[] = [];
  const animRotation = rotation + time * 0.1;
  
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2 + (animRotation * Math.PI) / 180;
    vertices.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }

  // Draw construction circles if enabled
  if (showConstruction) {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw vertex points
    ctx.fillStyle = colors.accent;
    vertices.forEach((v) => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.setLineDash([]);
  }

  // Draw the star polygon by connecting every nth vertex
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  
  ctx.beginPath();
  let current = 0;
  const visited = new Set<number>();
  
  while (!visited.has(current)) {
    visited.add(current);
    const next = (current + density) % points;
    
    if (visited.size === 1) {
      ctx.moveTo(vertices[current].x, vertices[current].y);
    }
    ctx.lineTo(vertices[next].x, vertices[next].y);
    current = next;
  }
  ctx.closePath();
  ctx.stroke();

  // Fill the star with primary color
  ctx.fillStyle = colors.primary + "40";
  ctx.fill();

  // Draw inner intersections
  ctx.fillStyle = colors.secondary;
  const intersections: { x: number; y: number }[] = [];
  
  for (let i = 0; i < points; i++) {
    for (let j = i + 1; j < points; j++) {
      if (Math.abs(i - j) !== density && Math.abs(i - j) !== points - density) {
        const line1Start = vertices[i];
        const line1End = vertices[(i + density) % points];
        const line2Start = vertices[j];
        const line2End = vertices[(j + density) % points];
        
        const intersection = getLineIntersection(line1Start, line1End, line2Start, line2End);
        if (intersection && 
            Math.abs(intersection.x - cx) < radius * 0.8 && 
            Math.abs(intersection.y - cy) < radius * 0.8) {
          intersections.push(intersection);
        }
      }
    }
  }

  // Draw rosette center
  intersections.forEach((pt) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, lineWidth * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function getLineIntersection(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
): { x: number; y: number } | null {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 0.001) return null;
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;
  
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  }
  return null;
}

function drawRosette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  petals: number,
  rotation: number,
  colors: { bg: string; primary: string; secondary: string; accent: string; lines: string },
  lineWidth: number,
  time: number = 0
): void {
  const animRotation = rotation + time * 0.05;
  
  // Draw outer ring of petals
  for (let i = 0; i < petals; i++) {
    const angle = (i * 2 * Math.PI) / petals + (animRotation * Math.PI) / 180;
    const petalX = cx + radius * 0.6 * Math.cos(angle);
    const petalY = cy + radius * 0.6 * Math.sin(angle);
    
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? colors.primary + "60" : colors.secondary + "60";
    ctx.strokeStyle = colors.lines;
    ctx.lineWidth = lineWidth;
    
    // Draw petal as a pointed ellipse
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      const petalRadius = radius * 0.35 * (1 + 0.5 * Math.cos(t));
      const px = petalX + petalRadius * Math.cos(t + angle);
      const py = petalY + petalRadius * Math.sin(t + angle);
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  // Draw inner star
  drawStarPolygon(ctx, cx, cy, radius * 0.5, petals, 2, animRotation, colors, lineWidth, false, 0);
  
  // Center circle
  ctx.beginPath();
  ctx.fillStyle = colors.accent;
  ctx.arc(cx, cy, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawGirihPattern(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  complexity: number,
  rotation: number,
  colors: { bg: string; primary: string; secondary: string; accent: string; lines: string },
  lineWidth: number,
  time: number = 0
): void {
  const animRotation = rotation + time * 0.03;
  const tiles = complexity + 2;
  
  // Girih tiles: decagon, hexagon, bowtie, rhombus, pentagon
  const tileTypes = ["decagon", "hexagon", "bowtie", "rhombus", "pentagon"];
  
  for (let ring = 0; ring < tiles; ring++) {
    const ringRadius = (size * (ring + 1)) / tiles;
    const tilesInRing = Math.max(6, ring * 6);
    
    for (let t = 0; t < tilesInRing; t++) {
      const angle = (t * 2 * Math.PI) / tilesInRing + (animRotation * Math.PI) / 180;
      const tx = cx + ringRadius * Math.cos(angle);
      const ty = cy + ringRadius * Math.sin(angle);
      
      const tileType = tileTypes[(ring + t) % tileTypes.length];
      const tileSize = (size / tiles) * 0.8;
      
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(angle + Math.PI / 2);
      
      ctx.fillStyle = (ring + t) % 2 === 0 ? colors.primary + "40" : colors.secondary + "40";
      ctx.strokeStyle = colors.lines;
      ctx.lineWidth = lineWidth;
      
      drawGirihTile(ctx, tileType, tileSize);
      
      ctx.restore();
    }
  }
}

function drawGirihTile(
  ctx: CanvasRenderingContext2D,
  type: string,
  size: number
): void {
  ctx.beginPath();
  
  switch (type) {
    case "decagon":
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = size * 0.8 * Math.cos(angle);
        const y = size * 0.8 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      break;
    case "bowtie":
      ctx.moveTo(-size * 0.5, -size * 0.3);
      ctx.lineTo(size * 0.5, -size * 0.5);
      ctx.lineTo(size * 0.5, size * 0.5);
      ctx.lineTo(-size * 0.5, size * 0.3);
      break;
    case "rhombus":
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.7, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.7, 0);
      break;
    case "pentagon":
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = size * 0.7 * Math.cos(angle);
        const y = size * 0.7 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      break;
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Add internal girih lines
  ctx.beginPath();
  ctx.strokeStyle = ctx.strokeStyle;
  ctx.lineWidth = ctx.lineWidth * 0.5;
  
  switch (type) {
    case "decagon":
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.7 * Math.cos(angle), size * 0.7 * Math.sin(angle));
      }
      break;
    case "rhombus":
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.moveTo(-size * 0.7, 0);
      ctx.lineTo(size * 0.7, 0);
      break;
  }
  ctx.stroke();
}

function drawTessellation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  rotation: number,
  colors: { bg: string; primary: string; secondary: string; accent: string; lines: string },
  lineWidth: number,
  time: number = 0
): void {
  const animRotation = rotation + time * 0.02;
  const hexSize = scale;
  const hexHeight = hexSize * Math.sqrt(3);
  
  // Hexagonal grid
  for (let row = -2; row < height / hexHeight + 2; row++) {
    for (let col = -2; col < width / (hexSize * 1.5) + 2; col++) {
      const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
      const y = row * hexHeight * 0.5;
      
      // Skip if outside canvas
      if (x < -hexSize || x > width + hexSize || y < -hexSize || y > height + hexSize) continue;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((animRotation * Math.PI) / 180);
      
      // Draw hexagon
      ctx.beginPath();
      const pattern = (Math.abs(col) + Math.abs(row)) % 3;
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = hexSize * 0.5 * Math.cos(angle);
        const hy = hexSize * 0.5 * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      
      // Fill based on pattern
      if (pattern === 0) ctx.fillStyle = colors.primary + "50";
      else if (pattern === 1) ctx.fillStyle = colors.secondary + "50";
      else ctx.fillStyle = colors.accent + "30";
      ctx.fill();
      
      ctx.strokeStyle = colors.lines;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Add star pattern inside hexagon
      if (pattern !== 2) {
        drawStarPolygon(ctx, 0, 0, hexSize * 0.35, 6, 2, 0, colors, lineWidth * 0.7, false, 0);
      }
      
      ctx.restore();
    }
  }
}

export function renderIslamicPatterns(
  ctx: CanvasRenderingContext2D,
  params: IslamicPatternParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const colors = colorSchemes[params.colorScheme];
  
  // Clear and fill background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height) * (params.scale / 400);
  
  const animTime = time * params.animationSpeed;
  
  switch (params.pattern) {
    case "star-6":
      drawStarPolygon(ctx, cx, cy, size * 0.4, 6, 2, params.rotation, colors, params.lineWidth, params.showConstruction > 0.5, animTime);
      break;
    case "star-8":
      drawStarPolygon(ctx, cx, cy, size * 0.4, 8, 3, params.rotation, colors, params.lineWidth, params.showConstruction > 0.5, animTime);
      break;
    case "star-12":
      drawStarPolygon(ctx, cx, cy, size * 0.4, 12, 5, params.rotation, colors, params.lineWidth, params.showConstruction > 0.5, animTime);
      break;
    case "rosette":
      drawRosette(ctx, cx, cy, size * 0.45, 8 + params.complexity * 2, params.rotation, colors, params.lineWidth, animTime);
      break;
    case "girih":
      drawGirihPattern(ctx, cx, cy, size * 0.5, params.complexity, params.rotation, colors, params.lineWidth, animTime);
      break;
    case "tessellation":
      drawTessellation(ctx, width, height, params.scale, params.rotation, colors, params.lineWidth, animTime);
      break;
  }
  
  // Add decorative border
  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = params.lineWidth * 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);
}

export const islamicPatternsDefaultParams: IslamicPatternParams = {
  pattern: "star-8",
  complexity: 3,
  scale: 150,
  rotation: 0,
  colorScheme: "traditional",
  lineWidth: 2,
  showConstruction: 0,
  animationSpeed: 1,
};

export const islamicPatterns: ArtGenerator = {
  name: "Islamic Geometric Patterns",
  description: "Traditional Islamic geometric art featuring star polygons, rosettes, and tessellations based on centuries-old mathematical principles",
  params: {
    pattern: {
      name: "Pattern Type",
      type: "select",
      options: ["star-6", "star-8", "star-12", "rosette", "girih", "tessellation"],
      default: "star-8",
    },
    complexity: {
      name: "Complexity",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
    },
    scale: {
      name: "Scale",
      type: "range",
      min: 50,
      max: 200,
      step: 10,
      default: 150,
    },
    rotation: {
      name: "Rotation",
      type: "range",
      min: 0,
      max: 360,
      step: 15,
      default: 0,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["traditional", "cobalt", "gold", "emerald", "sunset", "monochrome"],
      default: "traditional",
    },
    lineWidth: {
      name: "Line Width",
      type: "range",
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    showConstruction: {
      name: "Show Construction",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 0,
    },
    animationSpeed: {
      name: "Animation Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.5,
      default: 1,
    },
  },
  generate: renderIslamicPatterns,
};
