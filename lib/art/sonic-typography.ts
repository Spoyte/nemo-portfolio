import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface SonicTypographyParams {
  text: string;           // Text to visualize
  waveIntensity: number;  // 10-100: Wave amplitude
  frequency: number;      // 1-20: Wave frequency
  speed: number;          // 0.1-3: Animation speed
  colorScheme: "spectrum" | "neon" | "fire" | "ocean" | "gold";
  particleSize: number;   // 8-24: Character size
  trail: boolean;         // Show motion trails
}

export const sonicTypographyDefaultParams: SonicTypographyParams = {
  text: "SOUND",
  waveIntensity: 50,
  frequency: 8,
  speed: 1,
  colorScheme: "spectrum",
  particleSize: 16,
  trail: true,
};

export function renderSonicTypography(
  ctx: CanvasRenderingContext2D,
  params: Partial<SonicTypographyParams> = {},
  time: number = 0
): void {
  const config = { ...sonicTypographyDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes inspired by sound visualization
  const palettes: Record<string, string[]> = {
    spectrum: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFA5"],
    fire: ["#FF0000", "#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#FF6347"],
    ocean: ["#000080", "#0000CD", "#008B8B", "#00CED1", "#40E0D0", "#7FFFD4"],
    gold: ["#B8860B", "#DAA520", "#FFD700", "#FFE4B5", "#FFEFD5", "#FFF8DC"],
  };
  const colors = palettes[config.colorScheme] || palettes.spectrum;

  // Trail effect
  if (config.trail) {
    ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, width, height);
  }

  const t = time * config.speed * 0.001;
  const text = config.text.toUpperCase();
  const chars = text.split("");
  
  // Grid layout for characters
  const cols = Math.ceil(Math.sqrt(chars.length * 1.5));
  const rows = Math.ceil(chars.length / cols);
  const cellW = width / (cols + 1);
  const cellH = height / (rows + 1);
  const startX = cellW;
  const startY = cellH;

  // Sound wave parameters
  const waveAmp = config.waveIntensity * 0.5;
  const waveFreq = config.frequency * 0.1;
  
  chars.forEach((char, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    // Base position
    const baseX = startX + col * cellW;
    const baseY = startY + row * cellH;
    
    // Multiple wave sources (simulating speakers)
    const source1X = width * 0.2;
    const source1Y = height * 0.5;
    const source2X = width * 0.8;
    const source2Y = height * 0.5;
    
    // Distance from wave sources
    const dist1 = Math.sqrt((baseX - source1X) ** 2 + (baseY - source1Y) ** 2);
    const dist2 = Math.sqrt((baseX - source2X) ** 2 + (baseY - source2Y) ** 2);
    
    // Wave interference pattern
    const wave1 = Math.sin(dist1 * waveFreq - t * 3) * Math.exp(-dist1 * 0.002);
    const wave2 = Math.sin(dist2 * waveFreq - t * 3 + Math.PI * 0.3) * Math.exp(-dist2 * 0.002);
    const interference = wave1 + wave2;
    
    // Displacement from sound waves
    const dispX = Math.cos(interference * Math.PI) * waveAmp * interference;
    const dispY = Math.sin(interference * Math.PI) * waveAmp * interference * 0.5;
    
    // Vertical bounce from "beat"
    const beat = Math.sin(t * 4) * Math.max(0, interference) * waveAmp * 0.3;
    
    const x = baseX + dispX;
    const y = baseY + dispY - beat;
    
    // Color based on wave intensity at this point
    const intensity = Math.abs(interference);
    const colorIndex = Math.floor(intensity * (colors.length - 1));
    const color = colors[Math.min(colorIndex, colors.length - 1)];
    
    // Character size pulses with wave
    const sizePulse = 1 + intensity * 0.4;
    const fontSize = config.particleSize * sizePulse;
    
    // Draw character
    ctx.font = `bold ${fontSize}px "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 15 + intensity * 20;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3 + intensity * 0.7;
    
    // Rotation based on wave direction
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(interference * 0.3);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  });

  // Draw wave source indicators (speakers)
  const speakerY = height * 0.5;
  [width * 0.2, width * 0.8].forEach((sx, i) => {
    const pulse = 1 + Math.sin(t * 4 + i) * 0.2;
    
    ctx.beginPath();
    ctx.arc(sx, speakerY, 8 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = colors[0];
    ctx.globalAlpha = 0.6;
    ctx.fill();
    
    // Sound rings emanating
    for (let r = 1; r <= 3; r++) {
      const ringRadius = (r * 40 + t * 60) % 150;
      const ringAlpha = 1 - ringRadius / 150;
      
      ctx.beginPath();
      ctx.arc(sx, speakerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = colors[r % colors.length];
      ctx.globalAlpha = ringAlpha * 0.3;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Reset alpha
  ctx.globalAlpha = 1;
}

// Backward compatibility: ArtGenerator interface
export const sonicTypography: ArtGenerator = {
  id: "sonic-typography",
  name: "Sonic Typography",
  category: "text",
  render: (ctx, params, time) => renderSonicTypography(ctx, params as SonicTypographyParams, time),
  defaultParams: sonicTypographyDefaultParams,
};

export default sonicTypography;
