import { ArtGenerator, fillCanvas } from "./core";

export const geometricMandala: ArtGenerator = {
  name: "Geometric Mandala",
  description: "Symmetrical patterns inspired by sacred geometry",
  params: {
    layers: {
      name: "Layers",
      type: "range",
      min: 3,
      max: 10,
      step: 1,
      default: 5,
    },
    symmetry: {
      name: "Symmetry",
      type: "range",
      min: 6,
      max: 24,
      step: 2,
      default: 12,
    },
    radius: {
      name: "Radius",
      type: "range",
      min: 100,
      max: 400,
      step: 50,
      default: 300,
    },
    colorShift: {
      name: "Color Shift",
      type: "range",
      min: 0,
      max: 360,
      step: 30,
      default: 0,
    },
  },
  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const { layers, symmetry, radius, colorShift } = params;

    fillCanvas(ctx, "#fafafa", canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let l = 0; l < (layers as number); l++) {
      const layerRadius = (radius as number) * (l + 1) / (layers as number);
      const hue = ((colorShift as number) + l * 30) % 360;

      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.6)`;
      ctx.lineWidth = 2;

      for (let i = 0; i < (symmetry as number); i++) {
        const angle = (i / (symmetry as number)) * Math.PI * 2;
        const x = cx + Math.cos(angle) * layerRadius;
        const y = cy + Math.sin(angle) * layerRadius;

        ctx.beginPath();
        ctx.arc(x, y, layerRadius * 0.3, 0, Math.PI * 2);
        ctx.stroke();

        // Connect to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Connect to neighbors
        const nextAngle = ((i + 1) / (symmetry as number)) * Math.PI * 2;
        const nextX = cx + Math.cos(nextAngle) * layerRadius;
        const nextY = cy + Math.sin(nextAngle) * layerRadius;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }
    }
  },
};
