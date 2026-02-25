import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
} from "./core";

// Frequency Visualizer - Audio-reactive generative art
// Simulates frequency spectrum visualization with flowing bars and particles

interface Bar {
  height: number;
  targetHeight: number;
  velocity: number;
  hue: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
}

export const frequencyVisualizer: ArtGenerator = {
  name: "Frequency Visualizer",
  description: "Audio-reactive visualization with flowing frequency bars and particle bursts",
  params: {
    barCount: {
      name: "Bar Count",
      type: "range",
      min: 16,
      max: 128,
      step: 8,
      default: 64,
    },
    smoothing: {
      name: "Smoothing",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 60,
    },
    bassBoost: {
      name: "Bass Boost",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 50,
    },
    particleIntensity: {
      name: "Particles",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 40,
    },
    waveSpeed: {
      name: "Wave Speed",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    mirrorMode: {
      name: "Mirror Mode",
      type: "select",
      options: ["off", "horizontal", "vertical", "both"],
      default: "horizontal",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["spectrum", "fire", "ocean", "neon", "monochrome"],
      default: "spectrum",
    },
    barStyle: {
      name: "Bar Style",
      type: "select",
      options: ["solid", "gradient", "outline", "glow"],
      default: "gradient",
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const {
      barCount,
      smoothing,
      bassBoost,
      particleIntensity,
      waveSpeed,
      mirrorMode,
      colorScheme,
      barStyle,
      seed,
    } = params;

    const colorSchemes: Record<string, { base: number; range: number }> = {
      spectrum: { base: 0, range: 360 },
      fire: { base: 0, range: 60 },
      ocean: { base: 180, range: 60 },
      neon: { base: 280, range: 120 },
      monochrome: { base: 200, range: 40 },
    };

    // Get or initialize state
    let bars: Bar[] = (ctx as any).__freqBars || [];
    let particles: Particle[] = (ctx as any).__freqParticles || [];
    let storedSeed = (ctx as any).__freqSeed;
    const rng = new SeededRandom(storedSeed !== undefined ? storedSeed : (seed as number));
    
    if ((ctx as any).__freqSeed === undefined) {
      (ctx as any).__freqSeed = seed as number;
    }

    const targetBarCount = barCount as number;
    const smoothFactor = (smoothing as number) / 100;
    const bassWeight = (bassBoost as number) / 100;
    const particleChance = (particleIntensity as number) / 100;
    const speed = (waveSpeed as number) / 50;
    const scheme = colorSchemes[colorScheme as string];

    // Initialize bars
    while (bars.length < targetBarCount) {
      const hue = scheme.base + (bars.length / targetBarCount) * scheme.range;
      bars.push({
        height: 0,
        targetHeight: 0,
        velocity: 0,
        hue,
      });
    }
    if (bars.length > targetBarCount) {
      bars.splice(targetBarCount);
    }

    // Clear canvas with fade for trails
    ctx.fillStyle = "rgba(5, 5, 10, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const barWidth = canvas.width / targetBarCount;

    // Generate frequency data using multiple sine waves + noise
    const t = time * 0.001 * speed;
    
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const normalizedIndex = i / bars.length;
      
      // Multi-layered wave synthesis
      const wave1 = Math.sin(t * 2 + normalizedIndex * Math.PI * 4) * 0.5 + 0.5;
      const wave2 = Math.sin(t * 3.7 + normalizedIndex * Math.PI * 8) * 0.3 + 0.3;
      const wave3 = Math.sin(t * 5.3 + normalizedIndex * Math.PI * 12) * 0.2 + 0.2;
      const noise = rng.random() * 0.15;
      
      // Bass boost on lower frequencies
      const bassMultiplier = 1 + (1 - normalizedIndex) * bassWeight;
      
      // Combine waves
      let target = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.15 + noise * 0.05) * bassMultiplier;
      target = Math.min(1, Math.max(0.05, target));
      
      // Smooth transition
      bar.targetHeight = target * canvas.height * 0.85;
      bar.height += (bar.targetHeight - bar.height) * (1 - smoothFactor * 0.9);
      
      // Update hue based on height for dynamic coloring
      if (colorScheme === "spectrum") {
        bar.hue = (normalizedIndex * 360 + t * 30) % 360;
      }
    }

    // Spawn particles from bar peaks
    for (let i = 0; i < bars.length; i++) {
      if (rng.random() < particleChance * 0.1 && bars[i].height > canvas.height * 0.3) {
        const x = i * barWidth + barWidth / 2;
        const y = canvas.height - bars[i].height;
        
        particles.push({
          x,
          y,
          vx: (rng.random() - 0.5) * 4,
          vy: -rng.random() * 3 - 1,
          life: 1,
          maxLife: 30 + rng.random() * 30,
          hue: bars[i].hue,
          size: 2 + rng.random() * 3,
        });
      }
    }

    // Update and draw particles
    ctx.globalCompositeOperation = "screen";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life -= 1 / p.maxLife;
      
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      
      const alpha = p.life * 0.8;
      const size = p.size * p.life;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
      ctx.fill();
      
      // Glow
      ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
      ctx.shadowBlur = size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalCompositeOperation = "source-over";

    // Draw bars
    const drawBar = (x: number, y: number, w: number, h: number, hue: number, alpha: number = 1) => {
      const lightness = 50 + (h / canvas.height) * 30;
      const saturation = 70 + (h / canvas.height) * 20;
      
      switch (barStyle) {
        case "solid":
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fillRect(x, y, w, h);
          break;
          
        case "gradient":
          const grad = ctx.createLinearGradient(x, y + h, x, y);
          grad.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
          grad.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${alpha * 0.8})`);
          grad.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness + 40}%, ${alpha * 0.4})`);
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, w, h);
          break;
          
        case "outline":
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);
          break;
          
        case "glow":
          ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
          ctx.shadowBlur = 15;
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fillRect(x, y, w, h);
          ctx.shadowBlur = 0;
          break;
      }
    };

    // Draw frequency bars
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const x = i * barWidth;
      const y = canvas.height - bar.height;
      
      // Main bar
      drawBar(x + 1, y, barWidth - 2, bar.height, bar.hue);
      
      // Mirror modes
      if (mirrorMode === "horizontal" || mirrorMode === "both") {
        // Mirror horizontally (top)
        drawBar(x + 1, 0, barWidth - 2, bar.height, bar.hue, 0.5);
      }
      
      if (mirrorMode === "vertical" || mirrorMode === "both") {
        // Mirror vertically (center outward)
        const mirrorX = canvas.width - x - barWidth;
        drawBar(mirrorX + 1, y, barWidth - 2, bar.height, bar.hue, 0.7);
        
        if (mirrorMode === "both") {
          drawBar(mirrorX + 1, 0, barWidth - 2, bar.height, bar.hue, 0.35);
        }
      }
    }

    // Draw center line for horizontal mirror mode
    if (mirrorMode === "horizontal" || mirrorMode === "both") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
    }

    // Draw peak indicators
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    for (let i = 0; i < bars.length; i++) {
      if (bars[i].height > canvas.height * 0.7) {
        const x = i * barWidth + barWidth / 2;
        const y = canvas.height - bars[i].height - 5;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Store state for next frame
    (ctx as any).__freqBars = bars;
    (ctx as any).__freqParticles = particles;
  },
};
