import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface DragonCurveParams {
  iterations: number;     // 8-16: Folding iterations (complexity)
  speed: number;          // 0.1-3: Animation speed
  colorScheme: "neon" | "fire" | "ocean" | "forest" | "monochrome";
  lineWidth: number;      // 1-5: Stroke thickness
  animated: boolean;
  showConstruction: boolean; // Show folding construction lines
}

export const dragonCurveDefaultParams: DragonCurveParams = {
  iterations: 12,
  speed: 0.5,
  colorScheme: "neon",
  lineWidth: 2,
  animated: true,
  showConstruction: false,
};

/**
 * Generate the dragon curve sequence using the paper-folding method.
 * Each iteration doubles the sequence by mirroring and appending a turn.
 */
function generateDragonSequence(iterations: number): boolean[] {
  // true = right turn, false = left turn
  const sequence: boolean[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Mirror the existing sequence and add a right turn in the middle
    const mirrored = [...sequence].reverse().map(turn => !turn);
    sequence.push(true); // Right turn at the fold
    sequence.push(...mirrored);
  }
  
  return sequence;
}

/**
 * Calculate dragon curve points from turn sequence.
 * Returns array of {x, y} points starting from origin.
 */
function calculatePoints(
  sequence: boolean[],
  segmentLength: number,
  centerX: number,
  centerY: number
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];
  
  // Direction: 0=right, 1=up, 2=left, 3=down
  let direction = 0;
  
  for (const turnRight of sequence) {
    // Turn
    direction = turnRight 
      ? (direction + 1) % 4  // Right turn
      : (direction + 3) % 4; // Left turn (same as -1 mod 4)
    
    // Move forward
    const lastPoint = points[points.length - 1];
    let newX = lastPoint.x;
    let newY = lastPoint.y;
    
    switch (direction) {
      case 0: newX += segmentLength; break; // Right
      case 1: newY -= segmentLength; break; // Up
      case 2: newX -= segmentLength; break; // Left
      case 3: newY += segmentLength; break; // Down
    }
    
    points.push({ x: newX, y: newY });
  }
  
  // Center the curve
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  
  const offsetX = centerX - (minX + maxX) / 2;
  const offsetY = centerY - (minY + maxY) / 2;
  
  return points.map(p => ({
    x: p.x + offsetX,
    y: p.y + offsetY,
  }));
}

export function renderDragonCurve(
  ctx: CanvasRenderingContext2D,
  params: Partial<DragonCurveParams> = {},
  time: number = 0
): void {
  const config = { ...dragonCurveDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes
  const palettes: Record<string, string[]> = {
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
    fire: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FF6347"],
    ocean: ["#006994", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8"],
    forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
    monochrome: ["#F8F9FA", "#DEE2E6", "#ADB5BD", "#6C757D", "#495057"],
  };
  const colors = palettes[config.colorScheme] || palettes.neon;

  // Clear with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxSize = Math.min(width, height) * 0.85;

  // Animation: gradually increase iterations or cycle through color shifts
  const t = config.animated ? time * config.speed * 0.0005 : 0;
  
  // Animated iteration count - smoothly cycles through iterations 8 to max
  const maxIterations = Math.min(config.iterations, 16);
  const minIterations = Math.max(8, maxIterations - 4);
  const animatedIterations = config.animated
    ? minIterations + Math.floor((Math.sin(t) + 1) / 2 * (maxIterations - minIterations))
    : maxIterations;

  // Generate the dragon curve
  const sequence = generateDragonSequence(animatedIterations);
  
  // Calculate segment length to fit in canvas
  const numSegments = sequence.length + 1;
  const segmentLength = maxSize / Math.sqrt(numSegments);
  
  const points = calculatePoints(sequence, segmentLength, centerX, centerY);

  // Draw construction lines (subtle background)
  if (config.showConstruction) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
    }
    ctx.stroke();
  }

  // Draw the dragon curve with gradient coloring
  const totalPoints = points.length;
  
  for (let i = 0; i < totalPoints - 1; i++) {
    const progress = i / (totalPoints - 1);
    const colorIndex = Math.floor(progress * (colors.length - 1));
    const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
    const colorProgress = (progress * (colors.length - 1)) % 1;
    
    // Interpolate between colors for smooth gradient
    const color1 = colors[colorIndex];
    const color2 = colors[nextColorIndex];
    
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(points[i + 1].x, points[i + 1].y);
    
    // Create gradient for this segment
    const gradient = ctx.createLinearGradient(
      points[i].x, points[i].y,
      points[i + 1].x, points[i + 1].y
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Add subtle glow effect
    ctx.shadowColor = color1;
    ctx.shadowBlur = config.lineWidth * 2;
    
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset for next segment
  }

  // Draw endpoints with glow
  if (points.length > 0) {
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    
    // Start point
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, config.lineWidth * 2, 0, Math.PI * 2);
    ctx.fillStyle = colors[0];
    ctx.shadowColor = colors[0];
    ctx.shadowBlur = 10;
    ctx.fill();
    
    // End point
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, config.lineWidth * 2, 0, Math.PI * 2);
    ctx.fillStyle = colors[colors.length - 1];
    ctx.shadowColor = colors[colors.length - 1];
    ctx.shadowBlur = 10;
    ctx.fill();
    
    ctx.shadowBlur = 0;
  }
}

// Backward compatibility: ArtGenerator interface
export const dragonCurve: ArtGenerator = {
  id: "dragon-curve",
  name: "Dragon Curve",
  category: "mathematical",
  render: (ctx, params, time) => renderDragonCurve(ctx, params as DragonCurveParams, time),
  defaultParams: dragonCurveDefaultParams,
};

export default dragonCurve;
