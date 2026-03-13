import { ArtGenerator, ArtCategory, ArtComplexity, ArtTag } from "./core";

// ============================================================================
// KOHONEN SELF-ORGANIZING MAP
// ============================================================================
// A neural network that learns to map high-dimensional data to a 2D grid
// through competitive learning. The result is a beautiful topological map
// where similar inputs cluster together, creating organic, flowing patterns.
//
// Visual approach:
// - Grid of neurons as nodes
// - Connections show neighborhood relationships
// - Color represents the neuron's "weight vector" (learned preferences)
// - Animation shows the learning process converging
// ============================================================================

interface Neuron {
  x: number;        // Grid position
  y: number;
  wx: number;       // Weight vector (maps to color)
  wy: number;
  wz: number;
}

interface SOMConfig {
  gridSize: number;
  learningRate: number;
  neighborhoodRadius: number;
  iterations: number;
  showConnections: boolean;
  showNodes: boolean;
  colorMode: "rgb" | "hsv" | "gradient";
  animationSpeed: number;
}

function createDefaultConfig(): SOMConfig {
  return {
    gridSize: 20,
    learningRate: 0.1,
    neighborhoodRadius: 10,
    iterations: 1000,
    showConnections: true,
    showNodes: true,
    colorMode: "gradient",
    animationSpeed: 1,
  };
}

function initializeGrid(size: number): Neuron[][] {
  const grid: Neuron[][] = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = {
        x: i,
        y: j,
        wx: Math.random(),
        wy: Math.random(),
        wz: Math.random(),
      };
    }
  }
  return grid;
}

function findBestMatchingUnit(grid: Neuron[][], input: number[]): { i: number; j: number } {
  let minDist = Infinity;
  let bmu = { i: 0, j: 0 };
  const size = grid.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const neuron = grid[i][j];
      const dist = Math.sqrt(
        Math.pow(neuron.wx - input[0], 2) +
        Math.pow(neuron.wy - input[1], 2) +
        Math.pow(neuron.wz - input[2], 2)
      );
      if (dist < minDist) {
        minDist = dist;
        bmu = { i, j };
      }
    }
  }
  return bmu;
}

function updateNeurons(
  grid: Neuron[][],
  bmu: { i: number; j: number },
  input: number[],
  learningRate: number,
  radius: number
): void {
  const size = grid.length;
  const radiusSq = radius * radius;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const distSq = Math.pow(i - bmu.i, 2) + Math.pow(j - bmu.j, 2);
      if (distSq < radiusSq) {
        const influence = Math.exp(-distSq / (2 * radiusSq));
        const neuron = grid[i][j];
        neuron.wx += learningRate * influence * (input[0] - neuron.wx);
        neuron.wy += learningRate * influence * (input[1] - neuron.wy);
        neuron.wz += learningRate * influence * (input[2] - neuron.wz);
      }
    }
  }
}

function generateInput(iteration: number, totalIterations: number): number[] {
  // Create structured input patterns that evolve over time
  const t = iteration / totalIterations;
  const phase = t * Math.PI * 4;
  
  // Mix of patterns: spiral, waves, and noise
  const spiralR = t * 0.4 + 0.1;
  const spiralX = 0.5 + spiralR * Math.cos(phase * 3);
  const spiralY = 0.5 + spiralR * Math.sin(phase * 3);
  
  const waveX = 0.5 + 0.3 * Math.sin(phase * 2);
  const waveY = 0.5 + 0.3 * Math.cos(phase * 1.5);
  
  // Blend between patterns based on iteration
  const blend = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
  const noise = Math.random() * 0.1;
  
  return [
    spiralX * blend + waveX * (1 - blend) + noise,
    spiralY * blend + waveY * (1 - blend) + noise,
    0.3 + 0.4 * Math.sin(phase) + noise,
  ];
}

function neuronColor(neuron: Neuron, mode: string): string {
  switch (mode) {
    case "rgb":
      const r = Math.floor(neuron.wx * 255);
      const g = Math.floor(neuron.wy * 255);
      const b = Math.floor(neuron.wz * 255);
      return `rgb(${r},${g},${b})`;
    
    case "hsv": {
      // HSV to RGB conversion
      const h = neuron.wx * 360;
      const s = 0.7 + neuron.wy * 0.3;
      const v = 0.5 + neuron.wz * 0.5;
      const c = v * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v - c;
      let r1 = 0, g1 = 0, b1 = 0;
      if (h < 60) [r1, g1, b1] = [c, x, 0];
      else if (h < 120) [r1, g1, b1] = [x, c, 0];
      else if (h < 180) [r1, g1, b1] = [0, c, x];
      else if (h < 240) [r1, g1, b1] = [0, x, c];
      else if (h < 300) [r1, g1, b1] = [x, 0, c];
      else [r1, g1, b1] = [c, 0, x];
      return `rgb(${Math.floor((r1 + m) * 255)},${Math.floor((g1 + m) * 255)},${Math.floor((b1 + m) * 255)})`;
    }
    
    case "gradient":
    default: {
      // Smooth gradient based on position in weight space
      const hue = (neuron.wx * 0.7 + neuron.wy * 0.3) * 280 + 160; // Blue to purple to pink
      const sat = 60 + neuron.wz * 40;
      const light = 40 + neuron.wx * 30;
      return `hsl(${hue},${sat}%,${light}%)`;
    }
  }
}

export function renderKohonenMap(
  canvas: HTMLCanvasElement,
  config: Partial<SOMConfig> = {}
): () => void {
  const ctx = canvas.getContext("2d")!;
  const fullConfig = { ...createDefaultConfig(), ...config };
  const { gridSize, showConnections, showNodes, colorMode, animationSpeed } = fullConfig;

  let grid = initializeGrid(gridSize);
  let iteration = 0;
  let animationId: number;
  let isRunning = true;

  // Pre-calculate input pattern for smoother animation
  const inputPattern: number[][] = [];
  for (let i = 0; i < fullConfig.iterations; i++) {
    inputPattern.push(generateInput(i, fullConfig.iterations));
  }

  function render() {
    if (!isRunning) return;

    // Clear with dark background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;
    const nodeRadius = Math.min(cellWidth, cellHeight) * 0.35;

    // Draw connections first (behind nodes)
    if (showConnections) {
      ctx.lineWidth = 1;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const neuron = grid[i][j];
          const x = (i + 0.5) * cellWidth;
          const y = (j + 0.5) * cellHeight;

          // Connect to right neighbor
          if (i < gridSize - 1) {
            const right = grid[i + 1][j];
            const gradient = ctx.createLinearGradient(x, y, (i + 1.5) * cellWidth, y);
            gradient.addColorStop(0, neuronColor(neuron, colorMode));
            gradient.addColorStop(1, neuronColor(right, colorMode));
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo((i + 1.5) * cellWidth, y);
            ctx.stroke();
          }

          // Connect to bottom neighbor
          if (j < gridSize - 1) {
            const bottom = grid[i][j + 1];
            const gradient = ctx.createLinearGradient(x, y, x, (j + 1.5) * cellHeight);
            gradient.addColorStop(0, neuronColor(neuron, colorMode));
            gradient.addColorStop(1, neuronColor(bottom, colorMode));
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, (j + 1.5) * cellHeight);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Draw nodes
    if (showNodes) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const neuron = grid[i][j];
          const x = (i + 0.5) * cellWidth;
          const y = (j + 0.5) * cellHeight;

          // Glow effect
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius * 2);
          const color = neuronColor(neuron, colorMode);
          glowGradient.addColorStop(0, color.replace(")", ", 0.3)").replace("rgb", "rgba").replace("hsl", "hsla"));
          glowGradient.addColorStop(1, "transparent");
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fill();

          // Core node
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath();
          ctx.arc(x - nodeRadius * 0.3, y - nodeRadius * 0.3, nodeRadius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Progress indicator
    const progress = iteration / fullConfig.iterations;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(10, canvas.height - 20, (canvas.width - 20) * progress, 4);

    // Learning iterations
    const stepsPerFrame = animationSpeed;
    for (let s = 0; s < stepsPerFrame && iteration < fullConfig.iterations; s++) {
      const t = iteration / fullConfig.iterations;
      const currentLearningRate = fullConfig.learningRate * (1 - t * 0.9);
      const currentRadius = fullConfig.neighborhoodRadius * (1 - t * 0.95);
      
      const input = inputPattern[iteration];
      const bmu = findBestMatchingUnit(grid, input);
      updateNeurons(grid, bmu, input, currentLearningRate, currentRadius);
      
      iteration++;
    }

    // Loop when complete
    if (iteration >= fullConfig.iterations) {
      setTimeout(() => {
        grid = initializeGrid(gridSize);
        iteration = 0;
      }, 1000);
    }

    animationId = requestAnimationFrame(render);
  }

  render();

  return () => {
    isRunning = false;
    cancelAnimationFrame(animationId);
  };
}

// Thumbnail version - simplified, faster
export function renderKohonenMapThumb(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")!;
  const gridSize = 12;
  const grid = initializeGrid(gridSize);
  
  // Quick training
  for (let iter = 0; iter < 200; iter++) {
    const t = iter / 200;
    const input = generateInput(iter, 200);
    const bmu = findBestMatchingUnit(grid, input);
    updateNeurons(grid, bmu, input, 0.1 * (1 - t), 6 * (1 - t));
  }

  // Render
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellWidth = canvas.width / gridSize;
  const cellHeight = canvas.height / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const neuron = grid[i][j];
      const x = (i + 0.5) * cellWidth;
      const y = (j + 0.5) * cellHeight;
      const radius = Math.min(cellWidth, cellHeight) * 0.4;

      ctx.fillStyle = neuronColor(neuron, "gradient");
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Generator metadata
export const kohonenMapGenerator: ArtGenerator = {
  id: "kohonen-map",
  name: "Kohonen Map",
  description: "Self-organizing neural network that learns topological patterns through competitive learning",
  category: "mathematical" as ArtCategory,
  complexity: "medium" as ArtComplexity,
  tags: ["neural-network", "machine-learning", "topology", "emergent", "grid"] as ArtTag[],
  render: renderKohonenMap,
  renderThumbnail: renderKohonenMapThumb,
};

export default kohonenMapGenerator;
