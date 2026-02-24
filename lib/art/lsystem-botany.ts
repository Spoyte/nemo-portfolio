import { ArtGenerator, ArtParams, fillCanvas, SeededRandom } from "./core";

// L-System rules for different plant types
const lsystemRules: Record<string, { axiom: string; rules: Record<string, string>; angle: number; length: number }> = {
  fern: {
    axiom: "X",
    rules: {
      X: "F+[[X]-X]-F[-FX]+X",
      F: "FF",
    },
    angle: 25,
    length: 4,
  },
  tree: {
    axiom: "F",
    rules: {
      F: "F[+F]F[-F]F",
    },
    angle: 25.7,
    length: 3,
  },
  bush: {
    axiom: "F",
    rules: {
      F: "FF+[+F-F-F]-[-F+F+F]",
    },
    angle: 22.5,
    length: 3,
  },
  weed: {
    axiom: "F",
    rules: {
      F: "F[+F]F[-F]F",
    },
    angle: 35,
    length: 2.5,
  },
};

// Generate L-system string by applying rules iteratively
function generateLsystem(type: string, iterations: number): string {
  const config = lsystemRules[type];
  let result = config.axiom;

  for (let i = 0; i < iterations; i++) {
    let newResult = "";
    for (const char of result) {
      newResult += config.rules[char] || char;
    }
    result = newResult;
  }

  return result;
}

// Color palettes
const palettes: Record<string, Array<[number, number, number]>> = {
  forest: [
    [20, 60, 20],
    [40, 120, 40],
    [80, 180, 60],
    [150, 220, 100],
  ],
  autumn: [
    [80, 30, 20],
    [180, 60, 20],
    [220, 140, 30],
    [255, 200, 80],
  ],
  neon: [
    [20, 0, 40],
    [100, 0, 150],
    [200, 50, 255],
    [150, 255, 200],
  ],
  monochrome: [
    [30, 30, 30],
    [80, 80, 80],
    [150, 150, 150],
    [220, 220, 220],
  ],
};

export const lsystemBotany: ArtGenerator = {
  name: "L-System Botany",
  description: "Procedural plant growth using Lindenmayer systems (seeded)",
  params: {
    iterations: {
      name: "Iterations",
      type: "range",
      min: 3,
      max: 6,
      step: 1,
      default: 5,
    },
    plantType: {
      name: "Plant Type",
      type: "select",
      options: ["fern", "tree", "bush", "weed"],
      default: "fern",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["forest", "autumn", "neon", "monochrome"],
      default: "forest",
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
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const iterations = params.iterations as number;
    const plantType = params.plantType as string;
    const colorScheme = params.colorScheme as string;
    const seed = params.seed as number;
    const t = (time || 0) * 0.0005;

    // Initialize seeded RNG for deterministic variation
    const rng = new SeededRandom(seed);

    fillCanvas(ctx, "#0a0a0a", width, height);

    const config = lsystemRules[plantType];
    const lsystemString = generateLsystem(plantType, iterations);
    const palette = palettes[colorScheme];

    // Turtle graphics state
    interface TurtleState {
      x: number;
      y: number;
      angle: number;
    }

    // Start at bottom center with seed-based horizontal variation
    const startX = width / 2 + (rng.random() - 0.5) * width * 0.3;
    let x = startX;
    let y = height - 40;
    let angle = -90 + (rng.random() - 0.5) * 20; // Slight angle variation based on seed
    const stack: TurtleState[] = [];

    // Calculate animated length based on time
    const baseLength = config.length * (width / 800);
    const animatedLength = baseLength * (0.8 + Math.sin(t) * 0.2);

    // Track all line segments for rendering
    const segments: Array<{ x1: number; y1: number; x2: number; y2: number; depth: number }> = [];
    let currentDepth = 0;
    const maxDepth = iterations;

    // Parse L-system string and build segments
    for (const char of lsystemString) {
      switch (char) {
        case "F":
          const rad = (angle * Math.PI) / 180;
          const newX = x + Math.cos(rad) * animatedLength;
          const newY = y + Math.sin(rad) * animatedLength;
          segments.push({ x1: x, y1: y, x2: newX, y2: newY, depth: currentDepth });
          x = newX;
          y = newY;
          break;
        case "+":
          angle += config.angle;
          break;
        case "-":
          angle -= config.angle;
          break;
        case "[":
          stack.push({ x, y, angle });
          currentDepth++;
          break;
        case "]":
          {
            const state = stack.pop();
            if (state) {
              x = state.x;
              y = state.y;
              angle = state.angle;
              currentDepth--;
            }
          }
          break;
      }
    }

    // Render segments with depth-based coloring
    segments.forEach((seg, index) => {
      const depthRatio = seg.depth / maxDepth;
      const colorIndex = Math.min(Math.floor(depthRatio * palette.length), palette.length - 1);
      const [r, g, b] = palette[colorIndex];

      // Vary line width by depth (thicker at base)
      const lineWidth = Math.max(1, 4 - depthRatio * 3);

      // Add subtle animation to line opacity
      const opacity = 0.7 + Math.sin(t * 2 + index * 0.1) * 0.3;

      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    });

    // Draw glowing tips for leaves (at the end of deepest branches)
    const leafSegments = segments.filter((s) => s.depth >= maxDepth - 1);
    leafSegments.forEach((seg, index) => {
      const pulse = 0.5 + Math.sin(t * 3 + index * 0.2) * 0.5;
      const [r, g, b] = palette[palette.length - 1];

      ctx.beginPath();
      ctx.arc(seg.x2, seg.y2, 2 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + pulse * 0.4})`;
      ctx.fill();
    });
  },
};
