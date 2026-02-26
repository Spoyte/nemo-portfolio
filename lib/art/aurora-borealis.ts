import { ArtGenerator, ArtParams, createNoise, hslToRgb } from "./core";

// Aurora Borealis - Northern Lights simulation
// Uses layered noise fields and particle curtains to simulate
// the dancing curtains of ionized gas in Earth's magnetosphere

export interface AuroraParams extends ArtParams {
  intensity: number;
  speed: number;
  curtainCount: number;
  colorShift: number;
  turbulence: number;
  starDensity: number;
  horizonGlow: number;
}

const noise1 = createNoise();
const noise2 = createNoise();
const noise3 = createNoise();

// Aurora color palettes (altitude-based)
const AURORA_PALETTES = {
  green: { // Oxygen at 100-300km
    base: [80, 200, 120],
    highlight: [150, 255, 180],
    shadow: [20, 80, 40],
  },
  red: { // High altitude oxygen
    base: [200, 60, 80],
    highlight: [255, 120, 140],
    shadow: [100, 20, 30],
  },
  purple: { // Nitrogen
    base: [180, 80, 220],
    highlight: [230, 150, 255],
    shadow: [80, 30, 100],
  },
  blue: { // Ionized nitrogen
    base: [60, 120, 220],
    highlight: [120, 180, 255],
    shadow: [20, 50, 120],
  },
};

type AuroraColor = keyof typeof AURORA_PALETTES;

function getAuroraColor(
  type: AuroraColor,
  intensity: number,
  altitude: number
): { r: number; g: number; b: number } {
  const palette = AURORA_PALETTES[type];
  const t = Math.max(0, Math.min(1, intensity * altitude));
  
  return {
    r: Math.round(palette.shadow[0] + (palette.highlight[0] - palette.shadow[0]) * t),
    g: Math.round(palette.shadow[1] + (palette.highlight[1] - palette.shadow[1]) * t),
    b: Math.round(palette.shadow[2] + (palette.highlight[2] - palette.shadow[2]) * t),
  };
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  density: number,
  time: number
): void {
  const starCount = Math.floor(width * height * density / 5000);
  
  for (let i = 0; i < starCount; i++) {
    // Deterministic pseudo-random based on index
    const sx = ((i * 137.5) % width);
    const sy = ((i * 73.3) % (height * 0.7));
    const size = ((i * 23) % 3) + 0.5;
    const twinkle = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
    const brightness = ((i * 47) % 155 + 100) * twinkle;
    
    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 20}, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHorizonGlow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const gradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
  const glowAlpha = intensity * 0.3;
  
  gradient.addColorStop(0, `rgba(20, 30, 60, 0)`);
  gradient.addColorStop(0.3, `rgba(40, 60, 100, ${glowAlpha * 0.3})`);
  gradient.addColorStop(0.6, `rgba(60, 90, 140, ${glowAlpha * 0.5})`);
  gradient.addColorStop(1, `rgba(80, 120, 180, ${glowAlpha})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
}

function drawCurtain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  curtainIndex: number,
  totalCurtains: number,
  params: AuroraParams
): void {
  const { intensity, speed, turbulence } = params;
  
  // Each curtain has its own phase and position
  const phase = curtainIndex / totalCurtains * Math.PI * 2;
  const baseX = (curtainIndex / totalCurtains) * width + width * 0.1;
  
  // Determine color based on altitude simulation
  const altitudes: AuroraColor[] = ['green', 'purple', 'red', 'blue'];
  const colorType = altitudes[curtainIndex % altitudes.length];
  
  // Create the curtain path
  ctx.beginPath();
  
  const points: { x: number; y: number; intensity: number }[] = [];
  const segments = 100;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = baseX + (t - 0.5) * width * 0.8;
    
    // Multi-octave noise for organic movement
    const nx = x * 0.003 + time * speed * 0.0003;
    const ny = t * 3 + time * speed * 0.0002;
    
    const n1 = noise1(nx, ny + phase);
    const n2 = noise2(nx * 2, ny * 2 + phase) * 0.5;
    const n3 = noise3(nx * 4, ny * 4 + phase) * 0.25;
    
    const combinedNoise = (n1 + n2 + n3) * turbulence;
    
    // Curtain shape - wider at top, narrower at bottom
    const curtainShape = Math.sin(t * Math.PI) * 0.5 + 0.5;
    const heightMod = 1 - t * 0.3; // Slight taper
    
    const waveHeight = height * 0.4 * curtainShape * heightMod;
    const y = height * 0.3 + waveHeight * (0.5 + combinedNoise * 0.5);
    
    // Intensity varies along the curtain
    const localIntensity = Math.sin(t * Math.PI) * intensity * (0.7 + combinedNoise * 0.3);
    
    points.push({ x, y, intensity: Math.max(0, localIntensity) });
  }
  
  // Draw the curtain as a filled shape with gradient
  if (points.length > 0) {
    // Top edge
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      // Smooth curve
      const cpx = (prev.x + p.x) / 2;
      const cpy = (prev.y + p.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    
    // Bottom edge (ground level)
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.closePath();
    
    // Create vertical gradient for the curtain
    const gradient = ctx.createLinearGradient(0, height * 0.2, 0, height);
    const color = getAuroraColor(colorType, intensity, 0.8);
    
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
    gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.4})`);
    gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.2})`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the bright edge (corona effect)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      const cpy = (prev.y + p.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
    }
    
    ctx.strokeStyle = `rgba(${color.r + 50}, ${color.g + 50}, ${color.b + 50}, ${intensity * 0.6})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    ctx.shadowBlur = 20 * intensity;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawRayStructures(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: AuroraParams
): void {
  const { intensity, speed, turbulence } = params;
  const rayCount = 15;
  
  for (let i = 0; i < rayCount; i++) {
    const phase = i / rayCount * Math.PI * 2;
    const baseX = ((i * 137.5) % width);
    
    ctx.beginPath();
    
    const points: { x: number; y: number }[] = [];
    const segments = 50;
    
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const y = height * 0.2 + t * height * 0.6;
      
      const nx = baseX * 0.005 + time * speed * 0.0005 + t;
      const ny = y * 0.01;
      
      const wave = noise1(nx, ny + phase) * turbulence * 50;
      const x = baseX + wave + Math.sin(t * Math.PI * 2 + time * speed * 0.001 + phase) * 30;
      
      points.push({ x, y });
    }
    
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let j = 1; j < points.length; j++) {
        ctx.lineTo(points[j].x, points[j].y);
      }
      
      // Ray color - mostly green with variation
      const hue = 120 + Math.sin(phase + time * 0.001) * 40;
      const sat = 80 + Math.sin(phase * 2) * 20;
      const light = 50 + Math.sin(time * 0.002 + i) * 20;
      const rgb = hslToRgb(hue, sat, light);
      
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity * 0.3})`;
      ctx.lineWidth = 1 + Math.sin(phase + time * 0.003) * 1;
      ctx.stroke();
    }
  }
}

export function renderAuroraBorealis(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const auroraParams: AuroraParams = {
    intensity: (params.intensity as number) ?? 0.8,
    speed: (params.speed as number) ?? 1.0,
    curtainCount: Math.floor((params.curtainCount as number) ?? 4),
    colorShift: (params.colorShift as number) ?? 0,
    turbulence: (params.turbulence as number) ?? 0.8,
    starDensity: (params.starDensity as number) ?? 0.5,
    horizonGlow: (params.horizonGlow as number) ?? 0.6,
  };
  
  // Clear with deep night sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, '#020510');
  skyGradient.addColorStop(0.4, '#0a1025');
  skyGradient.addColorStop(0.7, '#0d1a35');
  skyGradient.addColorStop(1, '#152240');
  
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw stars
  drawStars(ctx, width, height, auroraParams.starDensity, time * 0.001);
  
  // Draw horizon glow
  drawHorizonGlow(ctx, width, height, auroraParams.horizonGlow);
  
  // Draw ray structures (background detail)
  drawRayStructures(ctx, width, height, time, auroraParams);
  
  // Draw curtains (main aurora display)
  for (let i = 0; i < auroraParams.curtainCount; i++) {
    drawCurtain(ctx, width, height, time, i, auroraParams.curtainCount, auroraParams);
  }
  
  // Add subtle noise/grain for atmosphere
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 1000; i++) {
    const x = ((i * 73) % width);
    const y = ((i * 37) % height);
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalCompositeOperation = 'source-over';
}

export const auroraBorealisDefaultParams: ArtParams = {
  intensity: 0.8,
  speed: 1.0,
  curtainCount: 4,
  colorShift: 0,
  turbulence: 0.8,
  starDensity: 0.5,
  horizonGlow: 0.6,
};

export const auroraBorealis: ArtGenerator = {
  name: "Aurora Borealis",
  description: "Dancing curtains of ionized gas in Earth's magnetosphere — the ethereal Northern Lights rendered through layered noise fields and particle simulations.",
  params: {
    intensity: {
      name: "Intensity",
      type: "range",
      min: 0.2,
      max: 1.0,
      step: 0.05,
      default: 0.8,
    },
    speed: {
      name: "Animation Speed",
      type: "range",
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0,
    },
    curtainCount: {
      name: "Curtain Layers",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4,
    },
    colorShift: {
      name: "Color Shift",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 0,
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      min: 0.2,
      max: 1.5,
      step: 0.1,
      default: 0.8,
    },
    starDensity: {
      name: "Star Density",
      type: "range",
      min: 0,
      max: 1.0,
      step: 0.1,
      default: 0.5,
    },
    horizonGlow: {
      name: "Horizon Glow",
      type: "range",
      min: 0,
      max: 1.0,
      step: 0.1,
      default: 0.6,
    },
  },
  generate: renderAuroraBorealis,
};
