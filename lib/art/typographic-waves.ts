import { ArtGenerator, ArtParam } from "../core";

interface WaveParams {
  text: string;
  fontSize: number;
  waveAmplitude: number;
  waveFrequency: number;
  waveSpeed: number;
  colorScheme: "ocean" | "sunset" | "neon" | "monochrome" | "rainbow";
  letterSpacing: number;
  waveLayers: number;
  turbulence: number;
}

const COLOR_SCHEMES = {
  ocean: ["#0066cc", "#0099cc", "#00cccc", "#66ffff", "#ccffff"],
  sunset: ["#ff0066", "#ff3366", "#ff6633", "#ff9933", "#ffcc33"],
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff00aa", "#00ffaa"],
  monochrome: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
  rainbow: ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff"],
};

export const typographicWaves: ArtGenerator = {
  name: "Typographic Waves",
  description:
    "Text flows like ocean waves, with letters undulating in synchronized motion. Multiple wave layers create depth, while color gradients flow through the words like light through water.",
  params: {
    text: {
      name: "Text Content",
      type: "select",
      default: "FLOW",
      options: ["FLOW", "WAVES", "OCEAN", "RHYTHM", "MOTION", "DEPTH", "ENERGY"],
    } as ArtParam,
    fontSize: {
      name: "Font Size",
      type: "range",
      min: 30,
      max: 120,
      step: 5,
      default: 60,
    },
    waveAmplitude: {
      name: "Wave Height",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 40,
    },
    waveFrequency: {
      name: "Wave Frequency",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1.2,
    },
    waveSpeed: {
      name: "Flow Speed",
      type: "range",
      min: 0.2,
      max: 2,
      step: 0.1,
      default: 0.8,
    },
    colorScheme: {
      name: "Color Palette",
      type: "select",
      default: "ocean",
      options: ["ocean", "sunset", "neon", "monochrome", "rainbow"],
    } as ArtParam,
    letterSpacing: {
      name: "Letter Spacing",
      type: "range",
      min: 5,
      max: 50,
      step: 5,
      default: 20,
    },
    waveLayers: {
      name: "Wave Layers",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.3,
    },
  },

  generate: (ctx, params, time) => {
    const {
      text,
      fontSize,
      waveAmplitude,
      waveFrequency,
      waveSpeed,
      colorScheme,
      letterSpacing,
      waveLayers,
      turbulence,
    } = params as WaveParams;

    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (colorScheme === "ocean") {
      bgGradient.addColorStop(0, "#001a33");
      bgGradient.addColorStop(0.5, "#003366");
      bgGradient.addColorStop(1, "#001a33");
    } else if (colorScheme === "sunset") {
      bgGradient.addColorStop(0, "#330011");
      bgGradient.addColorStop(0.5, "#661122");
      bgGradient.addColorStop(1, "#330011");
    } else if (colorScheme === "neon") {
      bgGradient.addColorStop(0, "#0a0a0a");
      bgGradient.addColorStop(0.5, "#1a0a1a");
      bgGradient.addColorStop(1, "#0a0a0a");
    } else if (colorScheme === "monochrome") {
      bgGradient.addColorStop(0, "#000000");
      bgGradient.addColorStop(0.5, "#1a1a1a");
      bgGradient.addColorStop(1, "#000000");
    } else {
      bgGradient.addColorStop(0, "#1a0a33");
      bgGradient.addColorStop(0.5, "#330a66");
      bgGradient.addColorStop(1, "#1a0a33");
    }

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const colors = COLOR_SCHEMES[colorScheme];
    const letters = (text as string).split("");
    const totalWidth = letters.length * (fontSize + letterSpacing);
    const startX = (width - totalWidth) / 2 + fontSize / 2;
    const centerY = height / 2;

    // Draw wave layers from back to front
    for (let layer = waveLayers - 1; layer >= 0; layer--) {
      const layerOffset = layer * 0.5;
      const layerAlpha = 1 - layer * 0.2;
      const layerScale = 1 - layer * 0.1;

      ctx.save();
      ctx.globalAlpha = layerAlpha;

      letters.forEach((letter, i) => {
        const x = startX + i * (fontSize + letterSpacing);

        // Calculate wave position with multiple sine waves for complexity
        const basePhase = time * waveSpeed + i * 0.3 * waveFrequency;
        const wave1 = Math.sin(basePhase) * waveAmplitude * layerScale;
        const wave2 = Math.sin(basePhase * 1.5 + layerOffset) * waveAmplitude * 0.5 * turbulence * layerScale;
        const wave3 = Math.sin(basePhase * 0.7 + time * 0.5) * waveAmplitude * 0.3 * turbulence * layerScale;

        const y = centerY + wave1 + wave2 + wave3;

        // Calculate rotation based on wave slope
        const nextPhase = time * waveSpeed + (i + 0.1) * 0.3 * waveFrequency;
        const nextY = centerY + Math.sin(nextPhase) * waveAmplitude * layerScale;
        const rotation = Math.atan2(nextY - y, (fontSize + letterSpacing) * 0.1);

        // Color cycling through the palette
        const colorIndex = Math.floor((time * 0.5 + i * 0.5 + layer * 0.3) % colors.length);
        const nextColorIndex = (colorIndex + 1) % colors.length;
        const colorMix = (time * 0.5 + i * 0.5 + layer * 0.3) % 1;

        // Interpolate between colors
        const c1 = hexToRgb(colors[colorIndex]);
        const c2 = hexToRgb(colors[nextColorIndex]);
        const r = Math.round(c1.r + (c2.r - c1.r) * colorMix);
        const g = Math.round(c1.g + (c2.g - c1.g) * colorMix);
        const b = Math.round(c1.b + (c2.b - c1.b) * colorMix);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * 0.3); // Subtle rotation following the wave

        // Draw letter with glow effect
        ctx.font = `bold ${fontSize}px "Segoe UI", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Glow
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.shadowBlur = 15 * (1 - layer * 0.2);

        // Fill
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillText(letter, 0, 0);

        // Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (1 - layer * 0.2)})`;
        ctx.fillText(letter, -1, -1);

        ctx.restore();
      });

      ctx.restore();
    }

    // Add subtle particle effects for depth
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const px = ((time * 30 + i * 137.5) % (width + 100)) - 50;
      const py = centerY + Math.sin(time * 0.5 + i) * waveAmplitude * 1.5;
      const size = 2 + Math.sin(time * 2 + i) * 1;
      const alpha = 0.3 + Math.sin(time + i * 0.5) * 0.2;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}
