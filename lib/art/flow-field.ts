import {
  ArtGenerator,
  fillCanvas,
  createNoise,
  renderPixels,
  hslToRgb,
} from "./core";

export const flowField: ArtGenerator = {
  name: "Flow Field",
  description: "Organic flowing lines following Perlin noise vectors",
  params: {
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 100,
      max: 2000,
      step: 100,
      default: 500,
    },
    noiseScale: {
      name: "Noise Scale",
      type: "range",
      min: 0.001,
      max: 0.05,
      step: 0.001,
      default: 0.01,
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 2,
    },
    colorHue: {
      name: "Base Hue",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 200,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const { particleCount, noiseScale, speed, colorHue } = params;

    fillCanvas(ctx, "#0a0a0a", canvas.width, canvas.height);

    const noise = createNoise();
    const t = time * 0.0005;

    for (let i = 0; i < particleCount; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x, y);

      const hue = (colorHue as number) + (i * 0.5) % 360;
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
      ctx.lineWidth = 1;

      for (let j = 0; j < 100; j++) {
        const angle = noise(x * (noiseScale as number) + t, y * (noiseScale as number)) * Math.PI * 4;
        x += Math.cos(angle) * (speed as number);
        y += Math.sin(angle) * (speed as number);
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  },
};
