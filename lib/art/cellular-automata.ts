import { ArtGenerator, fillCanvas, SeededRandom } from "./core";

export const cellularAutomata: ArtGenerator = {
  name: "Cellular Automata",
  description: "Emergent patterns from simple rules (seeded)",
  params: {
    cellSize: {
      name: "Cell Size",
      type: "range",
      min: 2,
      max: 10,
      step: 1,
      default: 4,
    },
    generations: {
      name: "Generations",
      type: "range",
      min: 50,
      max: 400,
      step: 50,
      default: 200,
    },
    rule: {
      name: "Rule",
      type: "range",
      min: 0,
      max: 255,
      step: 1,
      default: 90,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "range",
      min: 0,
      max: 360,
      step: 30,
      default: 200,
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
  generate: (ctx, params) => {
    const canvas = ctx.canvas;
    const { cellSize, generations, rule, colorScheme, seed } = params;
    const rng = new SeededRandom(seed as number);

    fillCanvas(ctx, "#0a0a0a", canvas.width, canvas.height);

    const cols = Math.floor(canvas.width / (cellSize as number));
    const rows = Math.min(generations as number, Math.floor(canvas.height / (cellSize as number)));

    let currentRow = new Array(cols).fill(0);
    
    // Seed-controlled initial state: either center cell or random pattern
    const useRandomInitial = rng.random() > 0.5;
    if (useRandomInitial) {
      // Random initial row based on seed
      for (let x = 0; x < cols; x++) {
        currentRow[x] = rng.random() > 0.7 ? 1 : 0;
      }
    } else {
      // Classic single center cell
      currentRow[Math.floor(cols / 2)] = 1;
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (currentRow[x]) {
          const hue = ((colorScheme as number) + y * 2) % 360;
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
          ctx.fillRect(
            x * (cellSize as number),
            y * (cellSize as number),
            (cellSize as number) - 1,
            (cellSize as number) - 1
          );
        }
      }

      // Generate next row based on rule
      const nextRow = new Array(cols).fill(0);
      for (let x = 1; x < cols - 1; x++) {
        const left = currentRow[x - 1];
        const center = currentRow[x];
        const right = currentRow[x + 1];
        const pattern = left * 4 + center * 2 + right;
        nextRow[x] = (rule >> pattern) & 1;
      }
      currentRow = nextRow;
    }
  },
};
