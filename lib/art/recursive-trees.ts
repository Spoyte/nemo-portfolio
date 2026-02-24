import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
} from "./core";

export const recursiveTrees: ArtGenerator = {
  name: "Recursive Trees",
  description: "Fractal tree structures with organic variation (seeded)",
  params: {
    branchLength: {
      name: "Branch Length",
      type: "range",
      min: 50,
      max: 200,
      step: 10,
      default: 120,
    },
    angle: {
      name: "Branch Angle",
      type: "range",
      min: 0.2,
      max: 1.0,
      step: 0.1,
      default: 0.5,
    },
    depth: {
      name: "Recursion Depth",
      type: "range",
      min: 5,
      max: 15,
      step: 1,
      default: 10,
    },
    randomness: {
      name: "Randomness",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.3,
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
    const { branchLength, angle, depth, randomness, seed } = params;

    fillCanvas(ctx, "#0f172a", canvas.width, canvas.height);

    // Initialize seeded RNG for deterministic output
    const rng = new SeededRandom(seed as number);

    const drawBranch = (
      x: number,
      y: number,
      len: number,
      currentAngle: number,
      currentDepth: number
    ) => {
      if (currentDepth === 0) return;

      const endX = x + Math.cos(currentAngle) * len;
      const endY = y + Math.sin(currentAngle) * len;

      const hue = 120 + currentDepth * 10;
      ctx.strokeStyle = `hsla(${hue}, 60%, ${30 + currentDepth * 5}%, ${currentDepth / 10})`;
      ctx.lineWidth = currentDepth * 0.8;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const angleVar = (rng.random() - 0.5) * (randomness as number);

      drawBranch(
        endX,
        endY,
        len * 0.7,
        currentAngle - (angle as number) + angleVar,
        currentDepth - 1
      );
      drawBranch(
        endX,
        endY,
        len * 0.7,
        currentAngle + (angle as number) + angleVar,
        currentDepth - 1
      );
    };

    // Draw multiple trees with seeded positions
    for (let i = 0; i < 5; i++) {
      const x = canvas.width * (0.2 + i * 0.15);
      drawBranch(x, canvas.height, branchLength as number, -Math.PI / 2, depth as number);
    }
  },
};
