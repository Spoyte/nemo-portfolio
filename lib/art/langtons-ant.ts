import { ArtGenerator, fillCanvas } from "./core";

export const langtonsAnt: ArtGenerator = {
  name: "Langton's Ant",
  description: "Emergent highways from simple rules - a 2D Turing machine on a grid",
  params: {
    steps: {
      name: "Simulation Steps",
      type: "range",
      min: 1000,
      max: 50000,
      step: 1000,
      default: 15000,
    },
    cellSize: {
      name: "Cell Size",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 2,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["classic", "heatmap", "rainbow", "monochrome", "neon"],
      default: "heatmap",
    },
    showAnt: {
      name: "Show Ant",
      type: "select",
      options: ["yes", "no"],
      default: "yes",
    },
    rule: {
      name: "Rule (RL string)",
      type: "select",
      options: ["RL", "RLLR", "RLRR", "RRLR", "RRLL"],
      default: "RL",
    },
  },
  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const steps = params.steps as number;
    const cellSize = params.cellSize as number;
    const colorScheme = params.colorScheme as string;
    const showAnt = params.showAnt === "yes";
    const rule = params.rule as string;

    fillCanvas(ctx, "#0a0a0a", canvas.width, canvas.height);

    // Calculate grid dimensions
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    // Initialize grid (0 = white, 1+ = colored states)
    const grid: number[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    // Parse rule: R = turn right, L = turn left
    const numStates = rule.length;
    const turns: number[] = rule.split("").map((c) => (c === "R" ? 1 : -1));

    // Ant state: x, y, direction (0=up, 1=right, 2=down, 3=left)
    let antX = Math.floor(cols / 2);
    let antY = Math.floor(rows / 2);
    let antDir = 0;

    // Direction vectors: up, right, down, left
    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    // Track visit counts for heatmap
    const visitCount: number[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));

    // Simulate
    for (let i = 0; i < steps; i++) {
      const currentState = grid[antY][antX];

      // Turn based on current state and rule
      const turn = turns[currentState % numStates];
      antDir = (antDir + turn + 4) % 4;

      // Change cell state
      grid[antY][antX] = (currentState + 1) % numStates;
      visitCount[antY][antX]++;

      // Move forward
      antX += dx[antDir];
      antY += dy[antDir];

      // Wrap around edges (toroidal)
      antX = (antX + cols) % cols;
      antY = (antY + rows) % rows;
    }

    // Render the grid
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // Find max visit count for normalization
    let maxVisits = 1;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        maxVisits = Math.max(maxVisits, visitCount[y][x]);
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const state = grid[y][x];
        const visits = visitCount[y][x];
        const intensity = visits / maxVisits;

        let r = 10,
          g = 10,
          b = 10;

        if (state !== 0 || visits > 0) {
          switch (colorScheme) {
            case "classic":
              // Classic black/white with ant trail
              if (state === 1) {
                r = g = b = 255;
              } else {
                r = g = b = Math.floor(50 + intensity * 150);
              }
              break;

            case "heatmap":
              // Heat map based on visit frequency
              if (visits > 0) {
                const hue = 240 - intensity * 240; // Blue to red
                const sat = 80;
                const light = 20 + intensity * 50;
                const rgb = hslToRgb(hue, sat, light);
                r = rgb.r;
                g = rgb.g;
                b = rgb.b;
              }
              break;

            case "rainbow":
              // State-based rainbow colors
              if (state > 0) {
                const hue = ((state - 1) * 60) % 360;
                const rgb = hslToRgb(hue, 80, 50);
                r = rgb.r;
                g = rgb.g;
                b = rgb.b;
              } else if (visits > 0) {
                const rgb = hslToRgb(0, 0, 20 + intensity * 30);
                r = rgb.r;
                g = rgb.g;
                b = rgb.b;
              }
              break;

            case "monochrome":
              // Grayscale based on state
              const gray = Math.floor(30 + state * (200 / numStates));
              r = g = b = gray;
              break;

            case "neon":
              // Neon colors based on state
              if (state > 0) {
                const neonColors = [
                  [255, 0, 128], // Pink
                  [0, 255, 255], // Cyan
                  [255, 255, 0], // Yellow
                  [128, 0, 255], // Purple
                  [0, 255, 128], // Green
                ];
                const color = neonColors[(state - 1) % neonColors.length];
                r = color[0];
                g = color[1];
                b = color[2];
              }
              break;
          }
        }

        // Draw cell
        for (let dy = 0; dy < cellSize; dy++) {
          for (let dx = 0; dx < cellSize; dx++) {
            const px = x * cellSize + dx;
            const py = y * cellSize + dy;
            if (px < canvas.width && py < canvas.height) {
              const idx = (py * canvas.width + px) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 255;
            }
          }
        }
      }
    }

    // Draw ant
    if (showAnt) {
      const antPx = antX * cellSize;
      const antPy = antY * cellSize;
      const antSize = Math.max(cellSize, 4);

      for (let dy = 0; dy < antSize; dy++) {
        for (let dx = 0; dx < antSize; dx++) {
          const px = antPx + dx;
          const py = antPy + dy;
          if (px < canvas.width && py < canvas.height) {
            const idx = (py * canvas.width + px) * 4;
            data[idx] = 255;
            data[idx + 1] = 50;
            data[idx + 2] = 50;
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  },
  meta: {
    category: "abstract",
    complexity: "simple",
    tags: ["animated", "monochrome", "minimal", "chaotic"],
    created: "2026-02-28",
  },
};

// HSL to RGB helper
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

export default langtonsAnt;
