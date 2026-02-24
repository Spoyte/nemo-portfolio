import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
} from "./core";

export const geometricMandala: ArtGenerator = {
  name: "Geometric Mandala",
  description: "Symmetrical patterns inspired by sacred geometry (seeded)",
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
    organic: {
      name: "Organic Variation",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const { layers, symmetry, radius, colorShift, organic, seed } = params;

    fillCanvas(ctx, "#fafafa", canvas.width, canvas.height);

    // Initialize seeded RNG for deterministic output
    const rng = new SeededRandom(seed as number);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const orgFactor = (organic as number) / 100;

    for (let l = 0; l < (layers as number); l++) {
      const layerRadius = (radius as number) * (l + 1) / (layers as number);
      const hue = ((colorShift as number) + l * 30) % 360;

      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.6)`;
      ctx.lineWidth = 2;

      for (let i = 0; i < (symmetry as number); i++) {
        const baseAngle = (i / (symmetry as number)) * Math.PI * 2;
        // Add organic variation to angle
        const angleOffset = rng.range(-0.1, 0.1) * orgFactor;
        const angle = baseAngle + angleOffset;

        const x = cx + Math.cos(angle) * layerRadius;
        const y = cy + Math.sin(angle) * layerRadius;

        // Organic petal size variation
        const petalSize = layerRadius * 0.3 * (1 + rng.range(-0.3, 0.3) * orgFactor);

        ctx.beginPath();
        ctx.arc(x, y, Math.max(5, petalSize), 0, Math.PI * 2);
        ctx.stroke();

        // Connect to center with slight curve
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        if (orgFactor > 0.1) {
          // Curved line to center
          const cpX = cx + Math.cos(angle + rng.range(-0.2, 0.2)) * layerRadius * 0.5;
          const cpY = cy + Math.sin(angle + rng.range(-0.2, 0.2)) * layerRadius * 0.5;
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        } else {
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Connect to neighbors with organic variation
        const nextBaseAngle = ((i + 1) / (symmetry as number)) * Math.PI * 2;
        const nextAngleOffset = rng.range(-0.1, 0.1) * orgFactor;
        const nextAngle = nextBaseAngle + nextAngleOffset;
        const nextX = cx + Math.cos(nextAngle) * layerRadius;
        const nextY = cy + Math.sin(nextAngle) * layerRadius;

        ctx.beginPath();
        ctx.moveTo(x, y);
        if (orgFactor > 0.1 && rng.random() < orgFactor) {
          // Occasionally add decorative arcs between petals
          const midAngle = (angle + nextAngle) / 2;
          const arcRadius = layerRadius * (0.7 + rng.range(-0.2, 0.2));
          const arcX = cx + Math.cos(midAngle) * arcRadius;
          const arcY = cy + Math.sin(midAngle) * arcRadius;
          ctx.quadraticCurveTo(arcX, arcY, nextX, nextY);
        } else {
          ctx.lineTo(nextX, nextY);
        }
        ctx.stroke();

        // Add inner decorative elements based on seed
        if (rng.random() < 0.3 * orgFactor) {
          const innerRadius = layerRadius * rng.range(0.4, 0.7);
          const innerX = cx + Math.cos(angle) * innerRadius;
          const innerY = cy + Math.sin(angle) * innerRadius;
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.3)`;
          ctx.beginPath();
          ctx.arc(innerX, innerY, 3 + rng.range(0, 4), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Add seed-based decorative center
    const centerDecorations = Math.floor(rng.range(3, 8));
    for (let d = 0; d < centerDecorations; d++) {
      const angle = (d / centerDecorations) * Math.PI * 2 + rng.range(-0.2, 0.2);
      const dist = rng.range(10, 30);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const hue = ((colorShift as number) + d * 20) % 360;

      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.4)`;
      ctx.beginPath();
      ctx.arc(x, y, rng.range(2, 6), 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
