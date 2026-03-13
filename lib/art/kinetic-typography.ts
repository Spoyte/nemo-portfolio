import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
  createSeededNoise,
} from "./core";

export const kineticTypography: ArtGenerator = {
  name: "Kinetic Typography",
  description: "Text as living matter - letters breathe, pulse, and dance with physics-based motion",
  params: {
    text: {
      name: "Text",
      type: "select",
      options: ["CREATE", "FLOW", "WAVE", "DREAM", "CHAOS", "LIGHT"],
      default: "CREATE",
    },
    fontSize: {
      name: "Font Size",
      type: "range",
      min: 40,
      max: 120,
      step: 10,
      default: 80,
    },
    waveAmplitude: {
      name: "Wave Amplitude",
      type: "range",
      min: 5,
      max: 50,
      step: 5,
      default: 20,
    },
    waveFrequency: {
      name: "Wave Frequency",
      type: "range",
      min: 0.01,
      max: 0.1,
      step: 0.01,
      default: 0.03,
    },
    particleDensity: {
      name: "Particle Density",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["neon", "gold", "ocean", "sunset", "monochrome"],
      default: "neon",
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
  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["animated", "colorful", "futuristic"],
    created: "2026-03-12",
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const {
      text,
      fontSize,
      waveAmplitude,
      waveFrequency,
      particleDensity,
      colorScheme,
      seed,
    } = params;

    // Color palettes
    const palettes: Record<string, string[]> = {
      neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"],
      gold: ["#ffd700", "#ffb347", "#ff8c00", "#daa520", "#b8860b"],
      ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#004080"],
      sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569"],
      monochrome: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
    };

    const palette = palettes[colorScheme as string] || palettes.neon;

    // Dark background
    fillCanvas(ctx, "#0a0a0f", canvas.width, canvas.height);

    const rng = new SeededRandom(seed as number);
    const noise = createSeededNoise(seed as number);
    const t = time * 0.001;

    const textStr = text as string;
    const size = fontSize as number;
    const amp = waveAmplitude as number;
    const freq = waveFrequency as number;
    const density = particleDensity as number;

    // Set up font
    ctx.font = `bold ${size}px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate positions for each letter
    const letterSpacing = size * 0.8;
    const totalWidth = textStr.length * letterSpacing;
    const startX = (canvas.width - totalWidth) / 2 + letterSpacing / 2;
    const centerY = canvas.height / 2;

    // Draw each letter with wave effect
    for (let i = 0; i < textStr.length; i++) {
      const letter = textStr[i];
      const baseX = startX + i * letterSpacing;

      // Multiple layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 3;
        const alpha = 0.3 - layer * 0.1;

        ctx.save();
        ctx.translate(baseX, centerY);

        // Wave motion
        const waveY = Math.sin((i * freq * 10) + t * 2 + layer * 0.5) * amp;
        const waveRotate = Math.cos((i * freq * 5) + t + layer * 0.3) * 0.1;

        ctx.translate(0, waveY);
        ctx.rotate(waveRotate);

        // Glow effect
        ctx.shadowColor = palette[i % palette.length];
        ctx.shadowBlur = 20 - layer * 5;
        ctx.fillStyle = palette[i % palette.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0');

        // Draw letter
        ctx.fillText(letter, 0, 0);

        ctx.restore();
      }
    }

    // Particle system around text
    const numParticles = textStr.length * 20 * density;
    for (let i = 0; i < numParticles; i++) {
      const idx = i % textStr.length;
      const baseX = startX + idx * letterSpacing;
      const baseY = centerY;

      // Particle orbit
      const orbitRadius = size * 0.6 + (i % 50) * 2;
      const orbitSpeed = 0.0005 + (i % 10) * 0.0001;
      const angle = t * orbitSpeed * 10 + (i * 0.1);

      const px = baseX + Math.cos(angle) * orbitRadius;
      const py = baseY + Math.sin(angle) * orbitRadius * 0.5 + Math.sin(t + i * 0.05) * 10;

      // Only draw if particle is within canvas bounds
      if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
        const particleSize = 1 + (i % 3);
        const color = palette[(idx + Math.floor(i / 10)) % palette.length];

        ctx.beginPath();
        ctx.arc(px, py, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = color + "80"; // 50% alpha
        ctx.fill();

        // Connect nearby particles with faint lines
        if (i % 5 === 0) {
          const nextIdx = (i + 1) % numParticles;
          const nextAngle = t * orbitSpeed * 10 + (nextIdx * 0.1);
          const nextPx = baseX + Math.cos(nextAngle) * orbitRadius;
          const nextPy = baseY + Math.sin(nextAngle) * orbitRadius * 0.5 + Math.sin(t + nextIdx * 0.05) * 10;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(nextPx, nextPy);
          ctx.strokeStyle = color + "20";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Scanline effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y + (t * 50) % 4, canvas.width, 1);
    }
  },
};
