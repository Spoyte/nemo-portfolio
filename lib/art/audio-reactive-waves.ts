import { ArtConfig, ArtPiece } from "./core";

export const config: ArtConfig = {
  id: "audio-reactive-waves",
  name: "Audio Reactive Waves",
  description: "Sound-reactive waveform visualization with frequency spectrum analysis. Simulates audio visualization with animated frequency bars and waveform traces.",
  category: "interactive",
  tags: ["animated", "audio", "interactive", "colorful", "futuristic"],
  thumbnail: "/thumbnails/audio-reactive-waves.jpg",
  created: "2026-03-02",
  parameters: [
    {
      id: "mode",
      name: "Visualization Mode",
      type: "select",
      options: ["spectrum", "waveform", "circular", "particles"],
      default: "spectrum",
    },
    {
      id: "colorScheme",
      name: "Color Scheme",
      type: "select",
      options: ["neon", "fire", "ocean", "rainbow", "monochrome"],
      default: "neon",
    },
    {
      id: "sensitivity",
      name: "Audio Sensitivity",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1.5,
    },
    {
      id: "smoothing",
      name: "Smoothing",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.1,
      default: 0.6,
    },
    {
      id: "bars",
      name: "Frequency Bars",
      type: "range",
      min: 16,
      max: 128,
      step: 8,
      default: 64,
    },
  ],
};

// Color schemes
const colorSchemes: Record<string, string[]> = {
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#8000ff"],
  fire: ["#ff0000", "#ff4500", "#ff8c00", "#ffd700", "#ffff00"],
  ocean: ["#000080", "#004080", "#0080ff", "#40c0ff", "#80ffff"],
  rainbow: ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#0080ff", "#8000ff"],
  monochrome: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
};

// Simulated frequency data (since we don't have real audio input)
class SimulatedAudioData {
  private frequencies: number[] = [];
  private time: number = 0;
  private bars: number;

  constructor(bars: number) {
    this.bars = bars;
    this.frequencies = new Array(bars).fill(0);
  }

  update(deltaTime: number): void {
    this.time += deltaTime;

    // Simulate different frequency patterns
    for (let i = 0; i < this.bars; i++) {
      const normalizedIndex = i / this.bars;

      // Base pattern: bass frequencies (low indices) have more energy
      const bassBoost = Math.exp(-normalizedIndex * 3);

      // Multiple oscillating waves for organic feel
      const wave1 = Math.sin(this.time * 2 + i * 0.2) * 0.5 + 0.5;
      const wave2 = Math.sin(this.time * 3.5 + i * 0.1) * 0.3 + 0.7;
      const wave3 = Math.sin(this.time * 5 + i * 0.05) * 0.2;

      // Beat simulation (periodic spikes)
      const beat = Math.exp(-((this.time % 1.5) ** 2) * 10);

      // Combine patterns
      let value = bassBoost * (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2 + beat * 0.3);

      // Add some noise
      value += (Math.random() - 0.5) * 0.1;

      // Smooth transition
      const smoothing = 0.6;
      this.frequencies[i] = this.frequencies[i] * smoothing + value * (1 - smoothing);

      // Clamp
      this.frequencies[i] = Math.max(0, Math.min(1, this.frequencies[i]));
    }
  }

  getFrequencies(): number[] {
    return [...this.frequencies];
  }

  getWaveform(samples: number): number[] {
    // Generate waveform data from simulated audio
    const waveform: number[] = [];
    for (let i = 0; i < samples; i++) {
      const t = i / samples;
      const value =
        Math.sin(this.time * 10 + t * Math.PI * 4) * 0.3 +
        Math.sin(this.time * 23 + t * Math.PI * 8) * 0.2 +
        Math.sin(this.time * 7 + t * Math.PI * 2) * 0.4 +
        (Math.random() - 0.5) * 0.1;
      waveform.push(value);
    }
    return waveform;
  }
}

// Get color from scheme based on value (0-1)
function getColor(scheme: string, value: number): string {
  const colors = colorSchemes[scheme] || colorSchemes.neon;
  const index = Math.floor(value * (colors.length - 1));
  return colors[Math.min(index, colors.length - 1)];
}

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex2rgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const c1 = hex2rgb(color1);
  const c2 = hex2rgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function create(): ArtPiece {
  let audioData: SimulatedAudioData;
  let animationId: number;

  return {
    config,

    setup(canvas: HTMLCanvasElement, params: Record<string, number | string>): void {
      const bars = (params.bars as number) || 64;
      audioData = new SimulatedAudioData(bars);
    },

    render(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number | string>,
      time: number,
      deltaTime: number
    ): void {
      const mode = (params.mode as string) || "spectrum";
      const scheme = (params.colorScheme as string) || "neon";
      const sensitivity = (params.sensitivity as number) || 1.5;
      const bars = (params.bars as number) || 64;

      // Update simulated audio data
      audioData.update(deltaTime);
      const frequencies = audioData.getFrequencies();

      // Clear with fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colors = colorSchemes[scheme];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      switch (mode) {
        case "spectrum":
          renderSpectrum(ctx, canvas, frequencies, colors, sensitivity);
          break;
        case "waveform":
          renderWaveform(ctx, canvas, audioData, colors, sensitivity);
          break;
        case "circular":
          renderCircular(ctx, canvas, frequencies, colors, sensitivity, time);
          break;
        case "particles":
          renderParticles(ctx, canvas, frequencies, colors, sensitivity, time);
          break;
      }
    },

    cleanup(): void {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
}

// Spectrum bars visualization
function renderSpectrum(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  frequencies: number[],
  colors: string[],
  sensitivity: number
): void {
  const barWidth = canvas.width / frequencies.length;
  const maxHeight = canvas.height * 0.8;

  frequencies.forEach((freq, i) => {
    const height = freq * maxHeight * sensitivity;
    const x = i * barWidth;
    const y = canvas.height - height;

    // Gradient for each bar
    const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
    const colorIndex = Math.floor(freq * (colors.length - 1));
    const color1 = colors[Math.min(colorIndex, colors.length - 1)];
    const color2 = colors[0];

    gradient.addColorStop(0, color2 + "40"); // Low opacity at bottom
    gradient.addColorStop(0.5, color1 + "80");
    gradient.addColorStop(1, color1);

    ctx.fillStyle = gradient;
    ctx.fillRect(x + 1, y, barWidth - 2, height);

    // Top highlight
    ctx.fillStyle = color1;
    ctx.fillRect(x + 1, y, barWidth - 2, 3);
  });
}

// Waveform visualization
function renderWaveform(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  audioData: SimulatedAudioData,
  colors: string[],
  sensitivity: number
): void {
  const waveform = audioData.getWaveform(200);
  const centerY = canvas.height / 2;
  const amplitude = (canvas.height / 3) * sensitivity;

  // Draw main waveform
  ctx.beginPath();
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 3;

  waveform.forEach((value, i) => {
    const x = (i / (waveform.length - 1)) * canvas.width;
    const y = centerY + value * amplitude;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw mirrored waveform with glow
  ctx.beginPath();
  ctx.strokeStyle = colors[1] || colors[0];
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;

  waveform.forEach((value, i) => {
    const x = (i / (waveform.length - 1)) * canvas.width;
    const y = centerY - value * amplitude * 0.7;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
  ctx.globalAlpha = 1;

  // Center line
  ctx.strokeStyle = colors[colors.length - 1];
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Circular visualization
function renderCircular(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  frequencies: number[],
  colors: string[],
  sensitivity: number,
  time: number
): void {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

  // Draw frequency bars in a circle
  const angleStep = (Math.PI * 2) / frequencies.length;

  frequencies.forEach((freq, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const barLength = freq * (maxRadius - baseRadius) * sensitivity;
    const colorIndex = Math.floor(freq * (colors.length - 1));
    const color = colors[Math.min(colorIndex, colors.length - 1)];

    const x1 = centerX + Math.cos(angle) * baseRadius;
    const y1 = centerY + Math.sin(angle) * baseRadius;
    const x2 = centerX + Math.cos(angle) * (baseRadius + barLength);
    const y2 = centerY + Math.sin(angle) * (baseRadius + barLength);

    // Draw bar
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Glow effect
    ctx.beginPath();
    ctx.strokeStyle = color + "40";
    ctx.lineWidth = 10;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Inner circle pulse
  const pulse = Math.sin(time * 3) * 0.1 + 1;
  ctx.beginPath();
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 2;
  ctx.arc(centerX, centerY, baseRadius * pulse, 0, Math.PI * 2);
  ctx.stroke();
}

// Particle visualization
function renderParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  frequencies: number[],
  colors: string[],
  sensitivity: number,
  time: number
): void {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Create particles based on frequency data
  frequencies.forEach((freq, i) => {
    if (freq < 0.1) return; // Skip low energy

    const angle = (i / frequencies.length) * Math.PI * 2 + time * 0.5;
    const distance = freq * Math.min(canvas.width, canvas.height) * 0.4 * sensitivity;
    const size = freq * 8 + 2;

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    const colorIndex = Math.floor(freq * (colors.length - 1));
    const color = colors[Math.min(colorIndex, colors.length - 1)];

    // Particle glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + "60");
    gradient.addColorStop(1, color + "00");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Connecting lines between nearby high-energy frequencies
  ctx.strokeStyle = colors[0] + "30";
  ctx.lineWidth = 1;

  for (let i = 0; i < frequencies.length; i++) {
    if (frequencies[i] < 0.5) continue;

    const angle1 = (i / frequencies.length) * Math.PI * 2 + time * 0.5;
    const dist1 = frequencies[i] * Math.min(canvas.width, canvas.height) * 0.4;
    const x1 = centerX + Math.cos(angle1) * dist1;
    const y1 = centerY + Math.sin(angle1) * dist1;

    // Connect to next high-energy frequency
    for (let j = i + 1; j < frequencies.length && j < i + 8; j++) {
      if (frequencies[j] < 0.5) continue;

      const angle2 = (j / frequencies.length) * Math.PI * 2 + time * 0.5;
      const dist2 = frequencies[j] * Math.min(canvas.width, canvas.height) * 0.4;
      const x2 = centerX + Math.cos(angle2) * dist2;
      const y2 = centerY + Math.sin(angle2) * dist2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}
