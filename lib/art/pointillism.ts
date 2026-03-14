import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface PointillismParams {
  // Visual parameters
  dotDensity: number;        // 20-100: Number of dots per row
  dotSize: number;           // 1-8: Base dot size
  colorScheme: "seurat" | "sunset" | "ocean" | "forest" | "cosmic";
  composition: "portrait" | "landscape" | "abstract" | "radial";
  dotVariance: number;       // 0-1: Size randomness
  animated: boolean;
}

export const pointillismDefaultParams: PointillismParams = {
  dotDensity: 60,
  dotSize: 3,
  colorScheme: "seurat",
  composition: "radial",
  dotVariance: 0.4,
  animated: true,
};

// Seurat-inspired palettes — scientific color theory
const PALETTES: Record<string, { primary: string[]; secondary: string[]; accent: string[] }> = {
  seurat: {
    // Neo-impressionist palette — pure unmixed pigments
    primary: ["#E8D4C4", "#F4E8D0", "#D4A574", "#8B7355", "#4A3728"], // Earth tones
    secondary: ["#87CEEB", "#98D8C8", "#B8E6B8", "#7EC8E3", "#5BA8C4"], // Blues/greens
    accent: ["#FFB347", "#FF8C69", "#FFD700", "#FFA07A", "#FF6B6B"], // Warm accents
  },
  sunset: {
    primary: ["#FF6B35", "#F7931E", "#FFD23F", "#FF8C42", "#E63946"],
    secondary: ["#9D4EDD", "#7B2CBF", "#5A189A", "#3C096C", "#240046"],
    accent: ["#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#E76F51"],
  },
  ocean: {
    primary: ["#0077B6", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF"],
    secondary: ["#CAF0F8", "#ADE8F4", "#48CAE4", "#00B4D8", "#0077B6"],
    accent: ["#023E8A", "#03045E", "#FF6B35", "#F4A261", "#E9C46A"],
  },
  forest: {
    primary: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
    secondary: ["#1B4332", "#081C15", "#D8F3DC", "#B7E4C7", "#95D5B2"],
    accent: ["#E9C46A", "#F4A261", "#E76F51", "#BC6C25", "#606C38"],
  },
  cosmic: {
    primary: ["#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9"],
    secondary: ["#4361EE", "#4895EF", "#4CC9F0", "#F72585", "#B5179E"],
    accent: ["#FFD700", "#FF6B35", "#FFFFFF", "#C77DFF", "#E0AAFF"],
  },
};

// Pseudo-random for deterministic patterns
function mulberry32(seed: number): () => number {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function renderPointillism(
  ctx: CanvasRenderingContext2D,
  params: Partial<PointillismParams> = {},
  time: number = 0
): void {
  const config = { ...pointillismDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  const palette = PALETTES[config.colorScheme] || PALETTES.seurat;
  const allColors = [...palette.primary, ...palette.secondary, ...palette.accent];

  // Animation time factor (subtle breathing effect)
  const t = config.animated ? time * 0.0005 : 0;
  const breath = 1 + Math.sin(t) * 0.05;

  // Clear with off-white canvas (traditional pointillist ground)
  ctx.fillStyle = "#F5F1E8";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.48;

  // Grid-based dot placement with jitter
  const cols = config.dotDensity;
  const rows = Math.floor(cols * (height / width));
  const cellW = width / cols;
  const cellH = height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Base position with slight offset for organic feel
      const baseX = col * cellW + cellW / 2;
      const baseY = row * cellH + cellH / 2;

      // Distance from center for radial composition
      const dx = baseX - centerX;
      const dy = baseY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxRadius;

      // Skip dots outside circular boundary for "radial" composition
      if (config.composition === "radial" && dist > 1) continue;

      // Seeded random for this position
      const seed = row * 10000 + col * 100 + Math.floor(time / 1000);
      const rng = mulberry32(seed);
      const jitterX = (rng() - 0.5) * cellW * 0.8;
      const jitterY = (rng() - 0.5) * cellH * 0.8;

      const x = baseX + jitterX;
      const y = baseY + jitterY;

      // Color selection based on position and composition
      let colorIndex: number;

      switch (config.composition) {
        case "portrait":
          // Face-like oval composition
          const faceDist = Math.sqrt(
            Math.pow((x - centerX) / (width * 0.25), 2) +
            Math.pow((y - centerY) / (height * 0.35), 2)
          );
          if (faceDist < 0.8) {
            colorIndex = Math.floor(rng() * palette.primary.length);
          } else if (faceDist < 1.2) {
            colorIndex = Math.floor(rng() * palette.secondary.length) + palette.primary.length;
          } else {
            colorIndex = Math.floor(rng() * palette.accent.length) + palette.primary.length + palette.secondary.length;
          }
          break;

        case "landscape":
          // Horizon-based composition
          const horizonY = centerY + Math.sin(t * 0.5) * 20;
          if (y < horizonY - height * 0.1) {
            // Sky
            colorIndex = Math.floor(rng() * palette.secondary.length) + palette.primary.length;
          } else if (y > horizonY + height * 0.1) {
            // Ground
            colorIndex = Math.floor(rng() * palette.primary.length);
          } else {
            // Horizon accent
            colorIndex = Math.floor(rng() * palette.accent.length) + palette.primary.length + palette.secondary.length;
          }
          break;

        case "abstract":
          // Flow field-inspired color zones
          const angle = Math.atan2(dy, dx);
          const flow = Math.sin(angle * 3 + dist * 5 + t);
          colorIndex = Math.floor(((flow + 1) / 2) * allColors.length) % allColors.length;
          break;

        case "radial":
        default:
          // Concentric rings with color transitions
          const ring = Math.floor(dist * 5);
          if (ring % 3 === 0) {
            colorIndex = Math.floor(rng() * palette.primary.length);
          } else if (ring % 3 === 1) {
            colorIndex = Math.floor(rng() * palette.secondary.length) + palette.primary.length;
          } else {
            colorIndex = Math.floor(rng() * palette.accent.length) + palette.primary.length + palette.secondary.length;
          }
          break;
      }

      const color = allColors[colorIndex % allColors.length];

      // Dot size varies by position and randomness
      const sizeVar = 1 + rng() * config.dotVariance * 2;
      const baseSize = config.dotSize * breath;
      const size = baseSize * sizeVar * (1 - dist * 0.3); // Smaller dots at edges

      // Draw the pointillist dot
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fillStyle = color;

      // Slight opacity for optical mixing effect
      ctx.globalAlpha = 0.85 + rng() * 0.15;
      ctx.fill();

      // Occasional highlight dot (smaller, lighter)
      if (rng() > 0.92) {
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
    }
  }

  // Reset context
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

// Backward compatibility: ArtGenerator interface
export const pointillism: ArtGenerator = {
  id: "pointillism",
  name: "Pointillism",
  category: "traditional",
  render: (ctx, params, time) => renderPointillism(ctx, params as PointillismParams, time),
  defaultParams: pointillismDefaultParams,
};

export default pointillism;
