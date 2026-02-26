export interface ImpossibleGeometryParams {
  figure: 'penrose-triangle' | 'impossible-staircase' | 'blivet' | 'necker-cube' | 'all';
  speed: number;
  complexity: number;
  colorScheme: 'classic' | 'neon' | 'monochrome' | 'warm' | 'cool';
  revealMode: 'construct' | 'deconstruct' | 'pulse' | 'rotate';
  lineWidth: number;
}

export const impossibleGeometryDefaultParams: ImpossibleGeometryParams = {
  figure: 'all',
  speed: 30,
  complexity: 50,
  colorScheme: 'classic',
  revealMode: 'construct',
  lineWidth: 3,
};

const colorSchemes: Record<string, { bg: string; lines: string[]; accent: string }> = {
  classic: { 
    bg: '#0a0a0f', 
    lines: ['#e8e8e8', '#c0c0c0', '#a0a0a0'],
    accent: '#ffffff'
  },
  neon: { 
    bg: '#050510', 
    lines: ['#ff00ff', '#00ffff', '#ffff00'],
    accent: '#ff0080'
  },
  monochrome: { 
    bg: '#000000', 
    lines: ['#ffffff', '#aaaaaa', '#666666'],
    accent: '#ffffff'
  },
  warm: { 
    bg: '#1a0f05', 
    lines: ['#ffaa44', '#ff6644', '#ffcc88'],
    accent: '#ff8844'
  },
  cool: { 
    bg: '#050a1a', 
    lines: ['#4488ff', '#44aaff', '#88ccff'],
    accent: '#66aaff'
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function project3D(x: number, y: number, z: number, cx: number, cy: number, scale: number): [number, number] {
  // Isometric projection
  const isoX = (x - z) * 0.866;
  const isoY = y + (x + z) * 0.5;
  return [cx + isoX * scale, cy + isoY * scale];
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  width: number,
  progress: number
): void {
  if (progress <= 0) return;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const endX = x1 + dx * Math.min(progress, 1);
  const endY = y1 + dy * Math.min(progress, 1);
  
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawPenroseTriangle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  progress: number,
  colors: string[],
  lineWidth: number
): void {
  const s = size;
  const h = s * 0.866;
  
  // Define the three corners of the triangle base
  const corners = [
    [cx, cy - s * 0.8],      // top
    [cx - h * 0.8, cy + s * 0.4], // bottom left
    [cx + h * 0.8, cy + s * 0.4], // bottom right
  ];
  
  // The impossible triangle is built from three L-shaped beams
  // Each beam appears to connect two corners but with contradictory depth
  
  const beamWidth = s * 0.15;
  const segments = 9;
  const segProgress = progress * segments;
  
  // Beam 1: Top to bottom-left (outer face)
  const p1 = corners[0];
  const p2 = [corners[0][0] - beamWidth * 0.5, corners[0][1] + beamWidth];
  const p3 = [corners[1][0] + beamWidth, corners[1][1] - beamWidth * 0.5];
  const p4 = corners[1];
  
  drawLine(ctx, p1[0], p1[1], p2[0], p2[1], colors[0], lineWidth, segProgress - 0);
  drawLine(ctx, p2[0], p2[1], p3[0], p3[1], colors[0], lineWidth, segProgress - 1);
  drawLine(ctx, p3[0], p3[1], p4[0], p4[1], colors[0], lineWidth, segProgress - 2);
  
  // Beam 2: Bottom-left to bottom-right (outer face)
  const p5 = [corners[1][0] + beamWidth * 0.5, corners[1][1] - beamWidth * 0.3];
  const p6 = [corners[2][0] - beamWidth * 0.5, corners[2][1] - beamWidth * 0.3];
  
  drawLine(ctx, p4[0], p4[1], p5[0], p5[1], colors[1], lineWidth, segProgress - 3);
  drawLine(ctx, p5[0], p5[1], p6[0], p6[1], colors[1], lineWidth, segProgress - 4);
  drawLine(ctx, p6[0], p6[1], corners[2][0], corners[2][1], colors[1], lineWidth, segProgress - 5);
  
  // Beam 3: Bottom-right to top (outer face)
  const p7 = [corners[2][0] - beamWidth, corners[2][1] - beamWidth * 0.5];
  const p8 = [corners[0][0] + beamWidth * 0.5, corners[0][1] + beamWidth];
  
  drawLine(ctx, corners[2][0], corners[2][1], p7[0], p7[1], colors[2], lineWidth, segProgress - 6);
  drawLine(ctx, p7[0], p7[1], p8[0], p8[1], colors[2], lineWidth, segProgress - 7);
  drawLine(ctx, p8[0], p8[1], p1[0], p1[1], colors[2], lineWidth, segProgress - 8);
  
  // Inner lines that create the paradox
  if (progress > 0.7) {
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = colors[0];
    ctx.globalAlpha = (progress - 0.7) * 3.3;
    
    // Inner corner connections
    ctx.beginPath();
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(p8[0], p8[1]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(p3[0], p3[1]);
    ctx.lineTo(p5[0], p5[1]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(p6[0], p6[1]);
    ctx.lineTo(p7[0], p7[1]);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
}

function drawImpossibleStaircase(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  progress: number,
  colors: string[],
  lineWidth: number
): void {
  const steps = 6;
  const stepHeight = size / steps;
  const stepDepth = size / steps * 0.6;
  const segments = steps * 3 + 2;
  const segProgress = progress * segments;
  
  // Draw steps in isometric-like perspective
  for (let i = 0; i < steps; i++) {
    const x = cx - size * 0.4 + i * stepHeight * 0.5;
    const y = cy + size * 0.3 - i * stepHeight * 0.3;
    
    // Step horizontal
    const p1 = [x, y];
    const p2 = [x + stepHeight, y];
    
    // Step vertical (riser)
    const p3 = [x + stepHeight, y - stepDepth];
    
    // Step depth
    const p4 = [x + stepHeight * 0.3, y - stepDepth * 0.5];
    
    const baseIdx = i * 3;
    
    drawLine(ctx, p1[0], p1[1], p2[0], p2[1], colors[i % colors.length], lineWidth, segProgress - baseIdx);
    drawLine(ctx, p2[0], p2[1], p3[0], p3[1], colors[i % colors.length], lineWidth, segProgress - baseIdx - 1);
    drawLine(ctx, p3[0], p3[1], p4[0], p4[1], colors[i % colors.length], lineWidth * 0.7, segProgress - baseIdx - 2);
  }
  
  // The impossible connection - bottom connects to top
  if (progress > 0.85) {
    const alpha = (progress - 0.85) * 6.67;
    ctx.strokeStyle = colors[0];
    ctx.globalAlpha = alpha;
    ctx.setLineDash([3, 7]);
    
    const bottomX = cx - size * 0.4;
    const bottomY = cy + size * 0.3;
    const topX = cx + size * 0.1;
    const topY = cy - size * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(bottomX, bottomY);
    ctx.lineTo(topX, topY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
}

function drawBlivet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  progress: number,
  colors: string[],
  lineWidth: number
): void {
  const s = size * 0.4;
  const segments = 12;
  const segProgress = progress * segments;
  
  // The blivet (fork with three ends from two prongs)
  // Left prong
  const leftBase = [cx - s, cy + s * 0.5];
  const leftTop = [cx - s * 0.3, cy - s * 0.8];
  
  // Right prong  
  const rightBase = [cx + s, cy + s * 0.5];
  const rightTop = [cx + s * 0.3, cy - s * 0.8];
  
  // Middle prong (the impossible one)
  const middleTop = [cx, cy - s];
  
  // Draw the two base prongs
  drawLine(ctx, leftBase[0], leftBase[1], leftTop[0], leftTop[1], colors[0], lineWidth, segProgress - 0);
  drawLine(ctx, rightBase[0], rightBase[1], rightTop[0], rightTop[1], colors[0], lineWidth, segProgress - 1);
  
  // The fork connection
  const forkY = cy + s * 0.2;
  drawLine(ctx, leftBase[0], leftBase[1], cx, forkY, colors[1], lineWidth, segProgress - 2);
  drawLine(ctx, rightBase[0], rightBase[1], cx, forkY, colors[1], lineWidth, segProgress - 3);
  
  // The three upper prongs
  drawLine(ctx, cx, forkY, leftTop[0], leftTop[1], colors[2], lineWidth, segProgress - 4);
  drawLine(ctx, cx, forkY, rightTop[0], rightTop[1], colors[2], lineWidth, segProgress - 5);
  drawLine(ctx, cx, forkY, middleTop[0], middleTop[1], colors[2], lineWidth, segProgress - 6);
  
  // Cross-connections that create ambiguity
  if (progress > 0.6) {
    const alpha = (progress - 0.6) * 2.5;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = lineWidth * 0.5;
    
    // Ambiguous connection lines
    ctx.beginPath();
    ctx.moveTo(leftTop[0], leftTop[1]);
    ctx.lineTo(cx - s * 0.15, cy - s * 0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(rightTop[0], rightTop[1]);
    ctx.lineTo(cx + s * 0.15, cy - s * 0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(middleTop[0], middleTop[1]);
    ctx.lineTo(cx, cy - s * 0.3);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  }
}

function drawNeckerCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  progress: number,
  colors: string[],
  lineWidth: number
): void {
  const s = size * 0.35;
  const segments = 12;
  const segProgress = progress * segments;
  
  // Front face
  const f1 = [cx - s, cy - s];
  const f2 = [cx + s, cy - s];
  const f3 = [cx + s, cy + s];
  const f4 = [cx - s, cy + s];
  
  // Back face (offset)
  const offset = s * 0.4;
  const b1 = [f1[0] - offset, f1[1] - offset];
  const b2 = [f2[0] - offset, f2[1] - offset];
  const b3 = [f3[0] - offset, f3[1] - offset];
  const b4 = [f4[0] - offset, f4[1] - offset];
  
  // Front face
  drawLine(ctx, f1[0], f1[1], f2[0], f2[1], colors[0], lineWidth, segProgress - 0);
  drawLine(ctx, f2[0], f2[1], f3[0], f3[1], colors[0], lineWidth, segProgress - 1);
  drawLine(ctx, f3[0], f3[1], f4[0], f4[1], colors[0], lineWidth, segProgress - 2);
  drawLine(ctx, f4[0], f4[1], f1[0], f1[1], colors[0], lineWidth, segProgress - 3);
  
  // Back face
  drawLine(ctx, b1[0], b1[1], b2[0], b2[1], colors[1], lineWidth, segProgress - 4);
  drawLine(ctx, b2[0], b2[1], b3[0], b3[1], colors[1], lineWidth, segProgress - 5);
  drawLine(ctx, b3[0], b3[1], b4[0], b4[1], colors[1], lineWidth, segProgress - 6);
  drawLine(ctx, b4[0], b4[1], b1[0], b1[1], colors[1], lineWidth, segProgress - 7);
  
  // Connecting edges
  drawLine(ctx, f1[0], f1[1], b1[0], b1[1], colors[2], lineWidth, segProgress - 8);
  drawLine(ctx, f2[0], f2[1], b2[0], b2[1], colors[2], lineWidth, segProgress - 9);
  drawLine(ctx, f3[0], f3[1], b3[0], b3[1], colors[2], lineWidth, segProgress - 10);
  drawLine(ctx, f4[0], f4[1], b4[0], b4[1], colors[2], lineWidth, segProgress - 11);
  
  // Ambiguity pulse - highlight the perceptual flip
  if (progress > 0.9) {
    const pulse = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = lineWidth * (1 + pulse);
    ctx.globalAlpha = pulse * 0.5;
    
    ctx.beginPath();
    ctx.moveTo(f1[0], f1[1]);
    ctx.lineTo(b3[0], b3[1]);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  }
}

export function renderImpossibleGeometry(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: ImpossibleGeometryParams
): void {
  const { figure, speed, complexity, colorScheme, revealMode, lineWidth } = params;
  const t = time * speed * 0.001;
  
  // Clear canvas
  const scheme = colorSchemes[colorScheme];
  ctx.fillStyle = scheme.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Calculate progress based on reveal mode
  let progress: number;
  const cycle = t % 10;
  
  switch (revealMode) {
    case 'construct':
      progress = Math.min(cycle / 4, 1);
      break;
    case 'deconstruct':
      progress = Math.max(1 - cycle / 4, 0);
      break;
    case 'pulse':
      progress = Math.sin(cycle * 0.8) * 0.5 + 0.5;
      break;
    case 'rotate':
      progress = 1;
      break;
    default:
      progress = Math.min(cycle / 4, 1);
  }
  
  // Add subtle complexity variation
  const size = Math.min(width, height) * (0.25 + complexity * 0.002);
  
  ctx.save();
  
  // Global rotation for 'rotate' mode
  if (revealMode === 'rotate') {
    ctx.translate(width / 2, height / 2);
    ctx.rotate(t * 0.2);
    ctx.translate(-width / 2, -height / 2);
  }
  
  const figures = figure === 'all' 
    ? ['penrose-triangle', 'impossible-staircase', 'blivet', 'necker-cube'] 
    : [figure];
  
  const positions = [
    [width * 0.25, height * 0.25],
    [width * 0.75, height * 0.25],
    [width * 0.25, height * 0.75],
    [width * 0.75, height * 0.75],
  ];
  
  figures.forEach((fig, idx) => {
    const [cx, cy] = positions[idx % positions.length];
    
    // Stagger animation for 'all' mode
    const figProgress = figure === 'all' 
      ? Math.max(0, Math.min(1, progress * 2 - idx * 0.2))
      : progress;
    
    switch (fig) {
      case 'penrose-triangle':
        drawPenroseTriangle(ctx, cx, cy, size, figProgress, scheme.lines, lineWidth);
        break;
      case 'impossible-staircase':
        drawImpossibleStaircase(ctx, cx, cy, size, figProgress, scheme.lines, lineWidth);
        break;
      case 'blivet':
        drawBlivet(ctx, cx, cy, size, figProgress, scheme.lines, lineWidth);
        break;
      case 'necker-cube':
        drawNeckerCube(ctx, cx, cy, size, figProgress, scheme.lines, lineWidth);
        break;
    }
  });
  
  // Title/label
  if (progress > 0.8) {
    ctx.fillStyle = scheme.accent;
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = (progress - 0.8) * 5;
    ctx.fillText('IMPOSSIBLE', width / 2, height - 20);
    ctx.globalAlpha = 1;
  }
  
  ctx.restore();
}
