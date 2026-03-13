import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface ChromaticAberrationParams {
  intensity: number;      // 0.5-3: Separation strength
  speed: number;          // 0.1-2: Animation speed
  pattern: "radial" | "linear" | "wave" | "pulse";
  colorMode: "rgb" | "cmy" | "full-spectrum";
  blurAmount: number;     // 0-20: Softness of separation
  animated: boolean;
}

export const chromaticAberrationDefaultParams: ChromaticAberrationParams = {
  intensity: 1.5,
  speed: 0.5,
  pattern: "radial",
  colorMode: "rgb",
  blurAmount: 5,
  animated: true,
};

export function renderChromaticAberration(
  ctx: CanvasRenderingContext2D,
  params: Partial<ChromaticAberrationParams> = {},
  time: number = 0
): void {
  const config = { ...chromaticAberrationDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Clear with deep black
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const t = config.animated ? time * config.speed * 0.001 : 0;

  // Create offscreen canvas for the base pattern
  const offCanvas = document.createElement("canvas");
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext("2d")!;

  // Draw base pattern based on selected pattern type
  drawBasePattern(offCtx, width, height, t, config.pattern);

  // Apply chromatic aberration effect
  applyChromaticAberration(ctx, offCanvas, width, height, config, t);

  // Add subtle vignette
  drawVignette(ctx, width, height);
}

function drawBasePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pattern: string
): void {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (pattern) {
    case "radial":
      drawRadialPattern(ctx, width, height, centerX, centerY, time);
      break;
    case "linear":
      drawLinearPattern(ctx, width, height, time);
      break;
    case "wave":
      drawWavePattern(ctx, width, height, time);
      break;
    case "pulse":
      drawPulsePattern(ctx, width, height, centerX, centerY, time);
      break;
  }
}

function drawRadialPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cx: number,
  cy: number,
  time: number
): void {
  const maxRadius = Math.min(width, height) * 0.5;
  const rings = 12;

  for (let i = 0; i < rings; i++) {
    const progress = i / rings;
    const radius = maxRadius * (0.2 + progress * 0.8);
    const rotation = time * (0.2 + progress * 0.3) * (i % 2 === 0 ? 1 : -1);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // Draw geometric ring
    const sides = 6 + i;
    ctx.beginPath();
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.3 + progress * 0.4})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2 + progress * 4;
    ctx.stroke();

    ctx.restore();
  }

  // Add central glow
  const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.3);
  glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  glowGradient.addColorStop(0.5, "rgba(200, 200, 255, 0.3)");
  glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);
}

function drawLinearPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
): void {
  const lines = 20;
  const spacing = height / (lines + 1);

  for (let i = 0; i < lines; i++) {
    const y = spacing * (i + 1);
    const waveOffset = Math.sin(time + i * 0.5) * 30;
    const thickness = 2 + Math.sin(time * 2 + i) * 1.5;

    ctx.beginPath();
    ctx.moveTo(0, y);

    // Draw wavy line
    for (let x = 0; x <= width; x += 10) {
      const waveY = y + Math.sin((x / width) * Math.PI * 4 + time + i) * 20 + waveOffset;
      ctx.lineTo(x, waveY);
    }

    const alpha = 0.3 + Math.sin(time + i) * 0.2;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = thickness;
    ctx.stroke();
  }

  // Add vertical accents
  for (let i = 0; i < 8; i++) {
    const x = (width / 9) * (i + 1);
    const height2 = 50 + Math.sin(time + i) * 30;

    const gradient = ctx.createLinearGradient(x, height / 2 - height2, x, height / 2 + height2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.4 + Math.sin(time + i) * 0.2})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(x - 1, height / 2 - height2, 2, height2 * 2);
  }
}

function drawWavePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
): void {
  const waves = 8;

  for (let i = 0; i < waves; i++) {
    const progress = i / waves;
    const amplitude = 30 + progress * 50;
    const frequency = 0.01 + progress * 0.02;
    const phase = time + i * 0.7;
    const yOffset = height * 0.2 + progress * height * 0.6;

    ctx.beginPath();
    for (let x = 0; x <= width; x += 5) {
      const y = yOffset + Math.sin(x * frequency + phase) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    const alpha = 0.2 + progress * 0.3;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1 + progress * 3;
    ctx.stroke();
  }

  // Add interference points
  for (let i = 0; i < 15; i++) {
    const x = (width / 16) * (i + 1) + Math.sin(time + i) * 20;
    const y = height / 2 + Math.cos(time * 0.7 + i) * height * 0.3;
    const radius = 3 + Math.sin(time * 2 + i) * 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
    ctx.fill();
  }
}

function drawPulsePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cx: number,
  cy: number,
  time: number
): void {
  const pulses = 6;
  const maxRadius = Math.min(width, height) * 0.4;

  for (let i = 0; i < pulses; i++) {
    const pulseTime = (time + i * 1.5) % (Math.PI * 2);
    const pulseProgress = Math.sin(pulseTime);
    const radius = maxRadius * (0.2 + pulseProgress * 0.8);

    if (radius > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.abs(radius), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.abs(pulseProgress) * 0.3})`;
      ctx.lineWidth = 2 + Math.abs(pulseProgress) * 4;
      ctx.stroke();
    }
  }

  // Add cross pattern
  const crossSize = maxRadius * 0.6;
  const rotation = time * 0.3;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(crossSize, 0);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

function applyChromaticAberration(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  config: ChromaticAberrationParams,
  time: number
): void {
  const intensity = config.intensity;
  const blur = config.blurAmount;

  // Get color channel offsets based on pattern and time
  const offsets = calculateOffsets(config.pattern, intensity, time, width, height);

  // Create temporary canvas for channel separation
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d")!;

  // Get image data
  tempCtx.drawImage(sourceCanvas, 0, 0);
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Create channel-separated canvas
  const channelCanvas = document.createElement("canvas");
  channelCanvas.width = width;
  channelCanvas.height = height;
  const channelCtx = channelCanvas.getContext("2d")!;

  // Draw each color channel with offset
  const channels = config.colorMode === "cmy"
    ? [
        { name: "cyan", r: 0, g: 255, b: 255, offset: offsets.cyan },
        { name: "magenta", r: 255, g: 0, b: 255, offset: offsets.magenta },
        { name: "yellow", r: 255, g: 255, b: 0, offset: offsets.yellow },
      ]
    : config.colorMode === "full-spectrum"
    ? [
        { name: "red", r: 255, g: 0, b: 0, offset: offsets.red },
        { name: "yellow", r: 255, g: 255, b: 0, offset: offsets.yellow },
        { name: "green", r: 0, g: 255, b: 0, offset: offsets.green },
        { name: "cyan", r: 0, g: 255, b: 255, offset: offsets.cyan },
        { name: "blue", r: 0, g: 0, b: 255, offset: offsets.blue },
        { name: "magenta", r: 255, g: 0, b: 255, offset: offsets.magenta },
      ]
    : [
        { name: "red", r: 255, g: 0, b: 0, offset: offsets.red },
        { name: "green", r: 0, g: 255, b: 0, offset: offsets.green },
        { name: "blue", r: 0, g: 0, b: 255, offset: offsets.blue },
      ];

  // Use composite operation for channel mixing
  ctx.globalCompositeOperation = "screen";

  channels.forEach((channel) => {
    // Clear temp canvas for this channel
    tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, width, height);

    // Apply channel color to the pattern
    tempCtx.globalCompositeOperation = "source-over";
    tempCtx.drawImage(sourceCanvas, 0, 0);

    // Get and modify image data for this channel
    const channelData = tempCtx.getImageData(0, 0, width, height);
    const pixels = channelData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixels[i] = (brightness * channel.r) / 255;
      pixels[i + 1] = (brightness * channel.g) / 255;
      pixels[i + 2] = (brightness * channel.b) / 255;
    }

    tempCtx.putImageData(channelData, 0, 0);

    // Draw with offset and blur
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.globalAlpha = 0.8;
    ctx.drawImage(
      tempCanvas,
      channel.offset.x,
      channel.offset.y,
      width,
      height
    );
    ctx.restore();
  });

  // Reset composite operation
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // Add subtle noise/grain for analog feel
  addGrain(ctx, width, height, 0.03);
}

function calculateOffsets(
  pattern: string,
  intensity: number,
  time: number,
  width: number,
  height: number
): Record<string, { x: number; y: number }> {
  const baseOffset = intensity * 8;
  const animOffset = Math.sin(time) * baseOffset * 0.5;

  switch (pattern) {
    case "radial":
      return {
        red: { x: -baseOffset - animOffset, y: -baseOffset * 0.5 },
        green: { x: 0, y: 0 },
        blue: { x: baseOffset + animOffset, y: baseOffset * 0.5 },
        cyan: { x: baseOffset, y: 0 },
        magenta: { x: -baseOffset, y: 0 },
        yellow: { x: 0, y: baseOffset },
      };
    case "linear":
      return {
        red: { x: -baseOffset - animOffset, y: 0 },
        green: { x: 0, y: 0 },
        blue: { x: baseOffset + animOffset, y: 0 },
        cyan: { x: baseOffset, y: 0 },
        magenta: { x: -baseOffset, y: 0 },
        yellow: { x: 0, y: baseOffset },
      };
    case "wave":
      return {
        red: { x: -baseOffset, y: -animOffset },
        green: { x: 0, y: 0 },
        blue: { x: baseOffset, y: animOffset },
        cyan: { x: baseOffset, y: animOffset * 0.5 },
        magenta: { x: -baseOffset, y: -animOffset * 0.5 },
        yellow: { x: animOffset * 0.3, y: baseOffset },
      };
    case "pulse":
      const pulse = Math.sin(time * 2) * baseOffset;
      return {
        red: { x: -baseOffset - pulse, y: -baseOffset - pulse },
        green: { x: 0, y: 0 },
        blue: { x: baseOffset + pulse, y: baseOffset + pulse },
        cyan: { x: baseOffset + pulse, y: 0 },
        magenta: { x: -baseOffset - pulse, y: 0 },
        yellow: { x: 0, y: baseOffset + pulse },
      };
    default:
      return {
        red: { x: -baseOffset, y: 0 },
        green: { x: 0, y: 0 },
        blue: { x: baseOffset, y: 0 },
        cyan: { x: baseOffset, y: 0 },
        magenta: { x: -baseOffset, y: 0 },
        yellow: { x: 0, y: baseOffset },
      };
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.3,
    width / 2, height / 2, Math.min(width, height) * 0.7
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function addGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity * 255;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

// Backward compatibility: ArtGenerator interface
export const chromaticAberration: ArtGenerator = {
  id: "chromatic-aberration",
  name: "Chromatic Aberration",
  category: "abstract",
  render: (ctx, params, time) => renderChromaticAberration(ctx, params as ChromaticAberrationParams, time),
  defaultParams: chromaticAberrationDefaultParams,
};

export default chromaticAberration;
