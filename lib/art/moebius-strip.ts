import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface MoebiusStripParams {
  // Visual parameters
  density: number;        // 10-100: Pattern density
  speed: number;          // 0.1-5: Animation speed
  colorScheme: "neon" | "pastel" | "monochrome" | "warm" | "cool";
  complexity: "simple" | "moderate" | "complex";
  animated: boolean;
}

export const moebiusStripDefaultParams: MoebiusStripParams = {
  density: 50,
  speed: 1,
  colorScheme: "neon",
  complexity: "moderate",
  animated: true,
};

export function renderMoebiusStrip(
  ctx: CanvasRenderingContext2D,
  params: Partial<MoebiusStripParams> = {},
  time: number = 0
): void {
  const config = { ...moebiusStripDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes
  const palettes: Record<string, string[]> = {
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
    pastel: ["#FFB5BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
    monochrome: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
    warm: ["#FF6B35", "#F7931E", "#FFD23F", "#EE4266", "#540D6E"],
    cool: ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#6366F1"],
  };
  const colors = palettes[config.colorScheme] || palettes.neon;

  // Clear with dark background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  // Center point
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;

  // Animation time factor
  const t = config.animated ? time * config.speed * 0.001 : 0;

  // TODO: Implement your algorithm here
  // This is a starter pattern - replace with your creative vision!

  const numElements = Math.floor(config.density * 2);
  
  for (let i = 0; i < numElements; i++) {
    const angle = (i / numElements) * Math.PI * 2 + t;
    const radius = (i / numElements) * maxRadius * (0.5 + 0.5 * Math.sin(t + i * 0.1));
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    const size = 3 + (i / numElements) * 15;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.7;
    ctx.fill();
    
    // Connect to center for complexity
    if (config.complexity !== "simple") {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Reset alpha
  ctx.globalAlpha = 1;
}

// Backward compatibility: ArtGenerator interface
export const moebiusStrip: ArtGenerator = {
  id: "moebius-strip",
  name: "Moebius Strip",
  category: "3d",
  render: (ctx, params, time) => renderMoebiusStrip(ctx, params as MoebiusStripParams, time),
  defaultParams: moebiusStripDefaultParams,
};

export default moebiusStrip;
