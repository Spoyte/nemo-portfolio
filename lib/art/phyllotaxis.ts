import { ArtGenerator, ArtParams, hslToRgb } from "./core";

export interface PhyllotaxisParams extends ArtParams {
  seedCount: number;
  goldenAngle: number;
  spread: number;
  dotSize: number;
  colorScheme: string;
  animate: string;
  speed: number;
  spiralTightness: number;
}

export const phyllotaxisDefaultParams: PhyllotaxisParams = {
  seedCount: 800,
  goldenAngle: 137.5,
  spread: 8,
  dotSize: 4,
  colorScheme: "sunflower",
  animate: "grow",
  speed: 1,
  spiralTightness: 1,
};

// Color schemes inspired by nature and art
const COLOR_SCHEMES: Record<string, (i: number, total: number, time: number) => string> = {
  sunflower: (i, total) => {
    // Natural sunflower coloring: darker center, lighter edges
    const ratio = i / total;
    if (ratio < 0.1) return "#3d2817"; // Dark brown center
    if (ratio < 0.3) return "#8b4513"; // Saddle brown
    if (ratio < 0.6) return "#daa520"; // Goldenrod
    return "#ffd700"; // Gold tips
  },
  rainbow: (i, total, time) => {
    const hue = (i / total * 360 + time * 0.05) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  },
  ocean: (i, total) => {
    const ratio = i / total;
    const hue = 180 + ratio * 60; // Cyan to blue
    const lightness = 40 + ratio * 40;
    return `hsl(${hue}, 70%, ${lightness}%)`;
  },
  fire: (i, total, time) => {
    const ratio = i / total;
    const hue = (60 - ratio * 60 + time * 0.02) % 360; // Yellow to red
    return `hsl(${hue}, 90%, ${50 + ratio * 20}%)`;
  },
  monochrome: (i, total) => {
    const lightness = 20 + (i / total) * 60;
    return `hsl(0, 0%, ${lightness}%)`;
  },
  aurora: (i, total, time) => {
    const hue = (120 + Math.sin(i / total * Math.PI + time * 0.001) * 60) % 360;
    return `hsl(${hue}, 80%, 65%)`;
  },
  galaxy: (i, total) => {
    const ratio = i / total;
    // Purple to pink to white
    const hue = 270 + ratio * 60;
    const lightness = 30 + Math.pow(ratio, 0.5) * 50;
    return `hsl(${hue}, 80%, ${lightness}%)`;
  },
};

function getColor(scheme: string, i: number, total: number, time: number): string {
  const colorFn = COLOR_SCHEMES[scheme] || COLOR_SCHEMES.sunflower;
  return colorFn(i, total, time);
}

export function renderPhyllotaxis(
  ctx: CanvasRenderingContext2D,
  params: PhyllotaxisParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  // Clear canvas with dark background
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);

  const {
    seedCount,
    goldenAngle,
    spread,
    dotSize,
    colorScheme,
    animate,
    speed,
    spiralTightness,
  } = params;

  // Calculate animation progress
  let animatedSeedCount = seedCount;
  let rotationOffset = 0;
  let pulseScale = 1;

  if (animate === "grow") {
    // Seeds appear gradually from center
    const cycle = (time * speed * 0.0005) % 2;
    animatedSeedCount = Math.floor(seedCount * (cycle <= 1 ? cycle : 2 - cycle));
  } else if (animate === "rotate") {
    // Continuous rotation
    rotationOffset = time * speed * 0.0002;
  } else if (animate === "breathe") {
    // Pulsing effect
    pulseScale = 1 + Math.sin(time * speed * 0.002) * 0.1;
  } else if (animate === "spiral") {
    // Spiral in/out
    const cycle = (time * speed * 0.0003) % 2;
    const t = cycle <= 1 ? cycle : 2 - cycle;
    rotationOffset = t * Math.PI * 4;
    pulseScale = 0.5 + t * 0.5;
  }

  const angleIncrement = (goldenAngle * Math.PI) / 180;

  // Draw seeds from center outward
  for (let i = 0; i < animatedSeedCount; i++) {
    const angle = i * angleIncrement + rotationOffset;
    const radius = spread * Math.sqrt(i) * spiralTightness * pulseScale;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Skip if outside canvas bounds (with padding)
    if (x < -dotSize || x > width + dotSize || y < -dotSize || y > height + dotSize) {
      continue;
    }

    // Calculate dot size based on position (smaller at edges)
    const distanceFromCenter = radius / (spread * Math.sqrt(seedCount));
    const sizeMultiplier = 1 - distanceFromCenter * 0.3;
    const finalDotSize = dotSize * sizeMultiplier * pulseScale;

    // Get color
    ctx.fillStyle = getColor(colorScheme, i, seedCount, time);

    // Draw seed with slight glow effect
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.5, finalDotSize), 0, Math.PI * 2);
    ctx.fill();

    // Add subtle highlight for depth
    if (finalDotSize > 2) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(x - finalDotSize * 0.2, y - finalDotSize * 0.2, finalDotSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw connecting spiral line (optional visual enhancement)
  if (animate === "spiral" && animatedSeedCount > 10) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < Math.min(animatedSeedCount, 200); i++) {
      const angle = i * angleIncrement + rotationOffset;
      const radius = spread * Math.sqrt(i) * spiralTightness * pulseScale;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

export const phyllotaxis: ArtGenerator = {
  name: "Phyllotaxis",
  description: "Sunflower seed spiral patterns using the golden angle (137.5°). Nature's mathematical beauty.",
  params: {
    seedCount: {
      name: "Seed Count",
      type: "range",
      min: 100,
      max: 2000,
      step: 50,
      default: 800,
    },
    goldenAngle: {
      name: "Golden Angle",
      type: "range",
      min: 130,
      max: 145,
      step: 0.5,
      default: 137.5,
    },
    spread: {
      name: "Spread",
      type: "range",
      min: 3,
      max: 15,
      step: 0.5,
      default: 8,
    },
    dotSize: {
      name: "Dot Size",
      type: "range",
      min: 1,
      max: 10,
      step: 0.5,
      default: 4,
    },
    spiralTightness: {
      name: "Spiral Tightness",
      type: "range",
      min: 0.5,
      max: 2,
      step: 0.1,
      default: 1,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["sunflower", "rainbow", "ocean", "fire", "monochrome", "aurora", "galaxy"],
      default: "sunflower",
    },
    animate: {
      name: "Animation",
      type: "select",
      options: ["none", "grow", "rotate", "breathe", "spiral"],
      default: "grow",
    },
    speed: {
      name: "Animation Speed",
      type: "range",
      min: 0.1,
      max: 3,
      step: 0.1,
      default: 1,
    },
  },
  generate: (ctx, params, time) => {
    renderPhyllotaxis(ctx, params as PhyllotaxisParams, time);
  },
};
