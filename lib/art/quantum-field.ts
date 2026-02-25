// Quantum Field - Visualization of quantum probability waves and particle interactions
// A generative art piece exploring wave-particle duality through visual aesthetics

import { ArtGenerator, ArtParams, fillCanvas, hslToRgb } from "./core";

export interface QuantumFieldParams {
  waveCount: number;      // Number of wave sources (1-8)
  frequency: number;      // Wave oscillation speed (0.5-3.0)
  amplitude: number;      // Wave intensity (20-100)
  particleCount: number;  // Number of quantum particles (50-500)
  coherence: number;      // Wave coherence/phase alignment (0-1)
  colorMode: string;      // Color scheme
  showProbability: boolean; // Show probability density
  showParticles: boolean;   // Show particle positions
}

export const quantumFieldDefaultParams: QuantumFieldParams = {
  waveCount: 4,
  frequency: 1.2,
  amplitude: 60,
  particleCount: 200,
  coherence: 0.7,
  colorMode: "quantum",
  showProbability: true,
  showParticles: true,
};

interface WaveSource {
  x: number;
  y: number;
  phase: number;
  frequency: number;
}

interface QuantumParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  energy: number;
}

// Color schemes
const COLOR_SCHEMES: Record<string, { bg: string; low: string; mid: string; high: string; particle: string }> = {
  quantum: { bg: "#0a0a1a", low: "#1a1a3e", mid: "#4a4a8e", high: "#00ffff", particle: "#ffffff" },
  thermal: { bg: "#1a0a0a", low: "#3e1a1a", mid: "#8e4a2a", high: "#ff6600", particle: "#ffcc00" },
  plasma: { bg: "#0a001a", low: "#1a003e", mid: "#4a008e", high: "#ff00ff", particle: "#ff80ff" },
  bioluminescence: { bg: "#001a0a", low: "#003e1a", mid: "#008e4a", high: "#00ff80", particle: "#80ffaa" },
};

export function renderQuantumField(
  ctx: CanvasRenderingContext2D,
  params: QuantumFieldParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const colors = COLOR_SCHEMES[params.colorMode] || COLOR_SCHEMES.quantum;

  // Initialize wave sources
  const waveSources: WaveSource[] = [];
  for (let i = 0; i < params.waveCount; i++) {
    const angle = (i / params.waveCount) * Math.PI * 2 + time * 0.1;
    const radius = Math.min(width, height) * 0.35;
    waveSources.push({
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      phase: i * (Math.PI * 2 / params.waveCount) * params.coherence,
      frequency: params.frequency * (0.8 + Math.random() * 0.4),
    });
  }

  // Calculate wave field
  const getWaveValue = (x: number, y: number, t: number): number => {
    let value = 0;
    for (const source of waveSources) {
      const dx = x - source.x;
      const dy = y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const wave = Math.sin(dist * 0.05 - t * source.frequency + source.phase);
      const attenuation = 1 / (1 + dist * 0.005);
      value += wave * attenuation;
    }
    return value / waveSources.length;
  };

  // Render probability field
  if (params.showProbability) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const sampleSize = 2;

    for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
        const waveValue = getWaveValue(x, y, time);
        const probability = Math.abs(waveValue);
        const phase = (waveValue + 1) * 0.5;

        // Map to color based on wave properties
        let r: number, g: number, b: number;
        
        if (params.colorMode === "quantum") {
          // Cyan to blue to purple based on amplitude and phase
          const hue = 180 + phase * 120; // 180-300 (cyan to purple)
          const sat = 50 + probability * 50;
          const light = 10 + probability * 40;
          const rgb = hslToRgb(hue, sat, light);
          r = rgb.r; g = rgb.g; b = rgb.b;
        } else if (params.colorMode === "thermal") {
          // Heat map style
          const hue = 240 - probability * 240; // Blue to red
          const sat = 80;
          const light = 20 + probability * 30;
          const rgb = hslToRgb(hue, sat, light);
          r = rgb.r; g = rgb.g; b = rgb.b;
        } else if (params.colorMode === "plasma") {
          // Purple to magenta to pink
          const hue = 270 + probability * 60;
          const sat = 70 + probability * 30;
          const light = 15 + probability * 35;
          const rgb = hslToRgb(hue, sat, light);
          r = rgb.r; g = rgb.g; b = rgb.b;
        } else {
          // Bioluminescence - green/cyan
          const hue = 120 + probability * 60;
          const sat = 60 + probability * 40;
          const light = 10 + probability * 40;
          const rgb = hslToRgb(hue, sat, light);
          r = rgb.r; g = rgb.g; b = rgb.b;
        }

        // Apply intensity based on amplitude
        const intensity = Math.min(1, probability * params.amplitude / 50);
        r = Math.floor(r * intensity);
        g = Math.floor(g * intensity);
        b = Math.floor(b * intensity);

        for (let dy = 0; dy < sampleSize && y + dy < height; dy++) {
          for (let dx = 0; dx < sampleSize && x + dx < width; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  } else {
    fillCanvas(ctx, colors.bg, width, height);
  }

  // Render wave source centers
  for (const source of waveSources) {
    const pulse = Math.sin(time * 3 + source.phase) * 0.5 + 0.5;
    const gradient = ctx.createRadialGradient(
      source.x, source.y, 0,
      source.x, source.y, 20 + pulse * 10
    );
    gradient.addColorStop(0, colors.high);
    gradient.addColorStop(0.5, colors.mid);
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(source.x, source.y, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  // Render quantum particles
  if (params.showParticles) {
    const particles: QuantumParticle[] = [];
    
    // Generate particle positions based on probability field
    for (let i = 0; i < params.particleCount; i++) {
      // Use rejection sampling based on wave field
      let px = Math.random() * width;
      let py = Math.random() * height;
      let attempts = 0;
      
      // Bias particles toward high-probability regions
      while (attempts < 5) {
        const prob = Math.abs(getWaveValue(px, py, time));
        if (Math.random() < prob * 2 || attempts === 4) {
          break;
        }
        px = Math.random() * width;
        py = Math.random() * height;
        attempts++;
      }

      const waveValue = getWaveValue(px, py, time);
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(waveValue * Math.PI) * 2,
        vy: Math.sin(waveValue * Math.PI) * 2,
        phase: waveValue * Math.PI,
        energy: Math.abs(waveValue),
      });
    }

    // Draw particles
    for (const p of particles) {
      const size = 1 + p.energy * 3;
      const alpha = 0.3 + p.energy * 0.7;
      
      ctx.fillStyle = colors.particle;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw velocity trail
      ctx.strokeStyle = colors.particle;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }

  // Draw interference pattern overlay
  ctx.strokeStyle = colors.high;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.1;
  
  for (let i = 0; i < 20; i++) {
    const t = time * 0.5 + i * 0.1;
    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const r = 50 + Math.sin(t + angle * 3) * 30;
      const x = width / 2 + Math.cos(angle) * r;
      const y = height / 2 + Math.sin(angle) * r;
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
}

// Gallery generator wrapper
export const quantumField: ArtGenerator = {
  name: "Quantum Field",
  description: "Visualization of quantum probability waves and particle interactions, exploring wave-particle duality through interference patterns.",
  params: {
    waveCount: {
      name: "Wave Sources",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4,
    },
    frequency: {
      name: "Frequency",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1.2,
    },
    amplitude: {
      name: "Amplitude",
      type: "range",
      min: 20,
      max: 100,
      step: 5,
      default: 60,
    },
    particleCount: {
      name: "Particles",
      type: "range",
      min: 50,
      max: 500,
      step: 50,
      default: 200,
    },
    coherence: {
      name: "Coherence",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.7,
    },
    colorMode: {
      name: "Color Mode",
      type: "select",
      options: ["quantum", "thermal", "plasma", "bioluminescence"],
      default: "quantum",
    },
    showProbability: {
      name: "Show Probability",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    showParticles: {
      name: "Show Particles",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
  },
  generate: (ctx, params, time) => {
    renderQuantumField(ctx, {
      waveCount: params.waveCount as number,
      frequency: params.frequency as number,
      amplitude: params.amplitude as number,
      particleCount: params.particleCount as number,
      coherence: params.coherence as number,
      colorMode: params.colorMode as string,
      showProbability: params.showProbability === "true",
      showParticles: params.showParticles === "true",
    }, time);
  },
};
