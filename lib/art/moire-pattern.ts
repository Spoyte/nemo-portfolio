import { ArtGenerator, ArtParams, fillCanvas, hslToRgb } from "./core";

export interface MoirePatternParams {
  patternType: "concentric" | "radial" | "grid" | "spiral" | "waves";
  lineDensity: number;
  lineWidth: number;
  overlayOffset: number;
  rotationSpeed: number;
  colorScheme: "monochrome" | "gradient" | "complementary" | "rainbow" | "gold";
  interferenceIntensity: number;
  animationMode: "rotate" | "breathe" | "slide" | "morph";
}

export const moirePatternDefaultParams: MoirePatternParams = {
  patternType: "concentric",
  lineDensity: 30,
  lineWidth: 1,
  overlayOffset: 5,
  rotationSpeed: 0.5,
  colorScheme: "monochrome",
  interferenceIntensity: 1,
  animationMode: "rotate",
};

// Color schemes
const COLOR_SCHEMES: Record<string, string[]> = {
  monochrome: ["#0a0a0a", "#333333", "#666666", "#999999", "#cccccc"],
  gradient: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b"],
  complementary: ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5", "#ffbe0b"],
  rainbow: ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"],
  gold: ["#1a1a1a", "#4a3728", "#8b6914", "#c9a227", "#ffd700", "#fff8dc"],
};

function getColorFromScheme(
  scheme: string,
  index: number,
  total: number,
  alpha: number = 1
): string {
  const colors = COLOR_SCHEMES[scheme] || COLOR_SCHEMES.monochrome;
  const colorIndex = Math.floor((index / total) * colors.length) % colors.length;
  const color = colors[colorIndex];
  
  // Parse hex and apply alpha
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawConcentricPattern(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  maxRadius: number,
  density: number,
  lineWidth: number,
  offset: number,
  rotation: number,
  colorScheme: string,
  isOverlay: boolean
): void {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.translate(offset, offset);
  
  const spacing = maxRadius / density;
  
  for (let i = 0; i < density; i++) {
    const radius = (i + 1) * spacing;
    const alpha = isOverlay ? 0.4 : 0.8;
    ctx.strokeStyle = getColorFromScheme(colorScheme, i, density, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawRadialPattern(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  maxRadius: number,
  density: number,
  lineWidth: number,
  offset: number,
  rotation: number,
  colorScheme: string,
  isOverlay: boolean
): void {
  ctx.save();
  ctx.translate(centerX, centerY);
  
  const angleStep = (Math.PI * 2) / density;
  const alpha = isOverlay ? 0.4 : 0.8;
  
  for (let i = 0; i < density; i++) {
    const angle = i * angleStep + rotation + (isOverlay ? offset * 0.01 : 0);
    ctx.strokeStyle = getColorFromScheme(colorScheme, i, density, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  density: number,
  lineWidth: number,
  offset: number,
  rotation: number,
  colorScheme: string,
  isOverlay: boolean
): void {
  ctx.save();
  
  const spacing = Math.min(width, height) / density;
  const alpha = isOverlay ? 0.3 : 0.6;
  
  // Vertical lines
  for (let i = 0; i <= density; i++) {
    const x = i * spacing + (isOverlay ? offset : 0);
    ctx.strokeStyle = getColorFromScheme(colorScheme, i, density * 2, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(rotation) * 20, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let i = 0; i <= density; i++) {
    const y = i * spacing + (isOverlay ? offset * 0.5 : 0);
    ctx.strokeStyle = getColorFromScheme(colorScheme, i + density, density * 2, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + Math.cos(rotation) * 20);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawSpiralPattern(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  maxRadius: number,
  density: number,
  lineWidth: number,
  offset: number,
  rotation: number,
  colorScheme: string,
  isOverlay: boolean
): void {
  ctx.save();
  ctx.translate(centerX, centerY);
  
  const spirals = 3;
  const alpha = isOverlay ? 0.35 : 0.7;
  
  for (let s = 0; s < spirals; s++) {
    const spiralOffset = (s / spirals) * Math.PI * 2;
    
    ctx.strokeStyle = getColorFromScheme(colorScheme, s, spirals, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    
    for (let i = 0; i < density * 10; i++) {
      const t = i / 10;
      const angle = t * 0.3 + spiralOffset + rotation + (isOverlay ? offset * 0.02 : 0);
      const radius = t * (maxRadius / density) * 3;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawWavePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  density: number,
  lineWidth: number,
  offset: number,
  rotation: number,
  colorScheme: string,
  isOverlay: boolean
): void {
  ctx.save();
  
  const spacing = height / density;
  const alpha = isOverlay ? 0.35 : 0.7;
  const waveAmplitude = 30 + rotation * 10;
  const waveFrequency = 0.02;
  
  for (let i = 0; i < density; i++) {
    const baseY = i * spacing;
    ctx.strokeStyle = getColorFromScheme(colorScheme, i, density, alpha);
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 5) {
      const phaseOffset = isOverlay ? offset * 0.1 : 0;
      const y = baseY + Math.sin(x * waveFrequency + phaseOffset) * waveAmplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }
  
  ctx.restore();
}

export function renderMoirePattern(
  ctx: CanvasRenderingContext2D,
  params: MoirePatternParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  
  // Background
  const bgColors: Record<string, string> = {
    monochrome: "#f5f5f5",
    gradient: "#0a0a0a",
    complementary: "#1a1a2e",
    rainbow: "#0a0a0a",
    gold: "#1a1a1a",
  };
  fillCanvas(ctx, bgColors[params.colorScheme] || "#f5f5f5", width, height);
  
  // Calculate animation values
  let rotation = 0;
  let offset = params.overlayOffset;
  
  switch (params.animationMode) {
    case "rotate":
      rotation = time * params.rotationSpeed * 0.001;
      break;
    case "breathe":
      offset = params.overlayOffset + Math.sin(time * 0.002) * 10;
      break;
    case "slide":
      offset = params.overlayOffset + Math.sin(time * 0.001) * 20;
      break;
    case "morph":
      rotation = time * params.rotationSpeed * 0.0005;
      offset = params.overlayOffset + Math.sin(time * 0.0015) * 15;
      break;
  }
  
  // Draw base pattern
  switch (params.patternType) {
    case "concentric":
      drawConcentricPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, 0, 0,
        params.colorScheme, false
      );
      drawConcentricPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, offset, rotation,
        params.colorScheme, true
      );
      break;
      
    case "radial":
      drawRadialPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, 0, 0,
        params.colorScheme, false
      );
      drawRadialPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, offset, rotation,
        params.colorScheme, true
      );
      break;
      
    case "grid":
      drawGridPattern(
        ctx, width, height,
        params.lineDensity, params.lineWidth, 0, 0,
        params.colorScheme, false
      );
      drawGridPattern(
        ctx, width, height,
        params.lineDensity, params.lineWidth, offset, rotation,
        params.colorScheme, true
      );
      break;
      
    case "spiral":
      drawSpiralPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, 0, 0,
        params.colorScheme, false
      );
      drawSpiralPattern(
        ctx, centerX, centerY, maxRadius,
        params.lineDensity, params.lineWidth, offset, rotation,
        params.colorScheme, true
      );
      break;
      
    case "waves":
      drawWavePattern(
        ctx, width, height,
        params.lineDensity, params.lineWidth, 0, 0,
        params.colorScheme, false
      );
      drawWavePattern(
        ctx, width, height,
        params.lineDensity, params.lineWidth, offset, rotation,
        params.colorScheme, true
      );
      break;
  }
  
  // Add interference highlight effect
  if (params.interferenceIntensity > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, maxRadius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 * params.interferenceIntensity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.05 * params.interferenceIntensity})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

export const moirePattern: ArtGenerator = {
  name: "Moiré Patterns",
  description: 
    "Interference patterns created by overlapping geometric structures. " +
    "Two identical or similar patterns are overlaid with slight offset, rotation, or scale differences, " +
    "creating emergent visual phenomena that appear to move and breathe. " +
    "A mathematical exploration of how simple rules create complex optical illusions.",
  params: {
    patternType: {
      name: "Pattern Type",
      type: "select",
      options: ["concentric", "radial", "grid", "spiral", "waves"],
      default: "concentric",
    },
    lineDensity: {
      name: "Line Density",
      type: "range",
      min: 10,
      max: 80,
      step: 5,
      default: 30,
    },
    lineWidth: {
      name: "Line Width",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
    },
    overlayOffset: {
      name: "Overlay Offset",
      type: "range",
      min: 0,
      max: 30,
      step: 1,
      default: 5,
    },
    rotationSpeed: {
      name: "Animation Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["monochrome", "gradient", "complementary", "rainbow", "gold"],
      default: "monochrome",
    },
    interferenceIntensity: {
      name: "Glow Effect",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 1,
    },
    animationMode: {
      name: "Animation Mode",
      type: "select",
      options: ["rotate", "breathe", "slide", "morph"],
      default: "rotate",
    },
  },
  generate: renderMoirePattern,
  meta: {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "minimal", "abstract"],
    created: "2024-02-26",
  },
};
