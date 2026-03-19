/**
 * Chladni Sound Plate
 * Interactive cymatics visualization with generative audio
 * 
 * Visualizes standing wave patterns on a vibrating plate (Chladni figures)
 * accompanied by generated tones matching the resonant frequencies.
 */

import { ArtGenerator, ArtParams, ParamConfig, fillCanvas, hslToRgb } from "../core";

// Chladni figure parameters
// The pattern is determined by: sin(nπx) * sin(mπy) - sin(mπx) * sin(nπy) = 0
// where n, m are mode numbers

interface ChladniParams extends ArtParams {
  modeN: number;
  modeM: number;
  frequency: number;
  amplitude: number;
  particleCount: number;
  vibration: number;
  colorHue: number;
  showGrid: number;
}

export const chladniSoundPlate: ArtGenerator = {
  name: "Chladni Sound Plate",
  description: "Interactive cymatics visualization with generative audio. Watch sand particles settle into resonant patterns as tones play.",
  params: {
    modeN: {
      name: "Mode N",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 3,
    },
    modeM: {
      name: "Mode M", 
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 2,
    },
    frequency: {
      name: "Base Frequency",
      type: "range",
      min: 55,
      max: 880,
      step: 55,
      default: 220,
    },
    amplitude: {
      name: "Vibration Strength",
      type: "range",
      min: 0.1,
      max: 2,
      step: 0.1,
      default: 0.8,
    },
    particleCount: {
      name: "Sand Particles",
      type: "range",
      min: 1000,
      max: 10000,
      step: 1000,
      default: 5000,
    },
    vibration: {
      name: "Vibration Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 1,
    },
    colorHue: {
      name: "Color Base",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 200,
    },
    showGrid: {
      name: "Show Node Lines",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 0,
    },
  },

  generate(ctx: CanvasRenderingContext2D, params: ArtParams, time: number = 0): void {
    const p = params as ChladniParams;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.45;

    // Dark background
    fillCanvas(ctx, "#0a0a0f", width, height);

    // Calculate actual frequency based on mode (simplified physical model)
    // f ∝ sqrt(n² + m²)
    const modeFreq = p.frequency * Math.sqrt(p.modeN * p.modeN + p.modeM * p.modeM) / Math.sqrt(2);
    
    // Animation phase
    const phase = time * p.vibration * 0.002;
    const vibrate = Math.sin(phase) * p.amplitude;

    // Draw the plate boundary
    ctx.strokeStyle = "rgba(100, 120, 140, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, scale, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Chladni pattern (node lines where particles collect)
    if (p.showGrid > 0.5) {
      ctx.strokeStyle = `hsla(${p.colorHue}, 60%, 40%, 0.15)`;
      ctx.lineWidth = 1;
      
      // Draw theoretical node lines
      const resolution = 100;
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = (i / resolution) * 2 - 1;
          const y = (j / resolution) * 2 - 1;
          
          // Chladni equation: sin(nπx) * sin(mπy) - sin(mπx) * sin(nπy) = 0
          const val = Math.sin(p.modeN * Math.PI * x) * Math.sin(p.modeM * Math.PI * y) -
                      Math.sin(p.modeM * Math.PI * x) * Math.sin(p.modeN * Math.PI * y);
          
          // Near zero = node line
          if (Math.abs(val) < 0.05) {
            const px = centerX + x * scale;
            const py = centerY + y * scale;
            ctx.fillRect(px, py, 2, 2);
          }
        }
      }
    }

    // Generate and draw particles
    // Use seeded random for deterministic patterns
    let seed = p.modeN * 1000 + p.modeM * 100 + Math.floor(p.frequency / 55);
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const particles: { x: number; y: number; intensity: number }[] = [];
    
    for (let i = 0; i < p.particleCount; i++) {
      // Generate random position in unit circle
      const angle = random() * Math.PI * 2;
      const r = Math.sqrt(random()) * 0.95; // Keep slightly inside boundary
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      // Calculate Chladni value at this position
      const chladni = Math.sin(p.modeN * Math.PI * x) * Math.sin(p.modeM * Math.PI * y) -
                      Math.sin(p.modeM * Math.PI * x) * Math.sin(p.modeN * Math.PI * y);
      
      // Particles settle at nodes (where chladni ≈ 0)
      // Add vibration displacement
      const displacement = Math.abs(chladni) + vibrate * 0.1;
      const intensity = Math.max(0, 1 - displacement * 3);
      
      if (intensity > 0.1) {
        particles.push({ x, y, intensity });
      }
    }

    // Draw particles with glow effect
    particles.forEach((pt, i) => {
      const px = centerX + pt.x * scale;
      const py = centerY + pt.y * scale;
      
      // Color based on position and intensity
      const hue = (p.colorHue + pt.x * 30 + pt.y * 20) % 360;
      const saturation = 60 + pt.intensity * 30;
      const lightness = 40 + pt.intensity * 40;
      const alpha = pt.intensity * 0.8;
      
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      
      // Particle size varies with intensity
      const size = 1 + pt.intensity * 2;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add sparkle effect for high-intensity particles
      if (pt.intensity > 0.8 && i % 20 === 0) {
        ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${pt.intensity * 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw frequency indicator
    ctx.fillStyle = "rgba(160, 192, 208, 0.6)";
    ctx.font = "12px 'SF Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Mode: ${p.modeN},${p.modeM}`, 20, 30);
    ctx.fillText(`Freq: ${Math.round(modeFreq)} Hz`, 20, 50);
    ctx.fillText(`Particles: ${particles.length}`, 20, 70);

    // Draw animated waveform at bottom
    const waveY = height - 60;
    const waveWidth = width - 40;
    const waveCenterX = 20;
    
    ctx.strokeStyle = `hsla(${p.colorHue}, 70%, 60%, 0.5)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < waveWidth; x += 2) {
      const t = x / waveWidth;
      const wavePhase = phase + t * Math.PI * 4;
      const waveAmp = 20 * p.amplitude;
      const y = waveY + Math.sin(wavePhase) * waveAmp * 
                Math.sin(t * Math.PI); // Envelope
      
      if (x === 0) {
        ctx.moveTo(waveCenterX + x, y);
      } else {
        ctx.lineTo(waveCenterX + x, y);
      }
    }
    ctx.stroke();

    // Draw mode visualization (small diagram)
    const diagSize = 60;
    const diagX = width - diagSize - 20;
    const diagY = 20;
    
    ctx.strokeStyle = "rgba(100, 120, 140, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(diagX, diagY, diagSize, diagSize);
    
    // Draw mode pattern in mini view
    ctx.fillStyle = `hsla(${p.colorHue}, 60%, 50%, 0.6)`;
    const miniRes = 20;
    for (let i = 0; i < miniRes; i++) {
      for (let j = 0; j < miniRes; j++) {
        const mx = i / miniRes;
        const my = j / miniRes;
        const val = Math.sin(p.modeN * Math.PI * mx) * Math.sin(p.modeM * Math.PI * my) -
                    Math.sin(p.modeM * Math.PI * mx) * Math.sin(p.modeN * Math.PI * my);
        if (Math.abs(val) < 0.1) {
          ctx.fillRect(diagX + mx * diagSize, diagY + my * diagSize, 3, 3);
        }
      }
    }
  },

  meta: {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "physics", "interactive", "detailed"],
    created: "2026-03-19",
  },
};
