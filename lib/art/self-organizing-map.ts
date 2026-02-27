import { ArtGenerator, ParamConfig } from "./core";

export interface SOMParams {
  gridSize: number;
  learningRate: number;
  neighborhoodRadius: number;
  decayRate: number;
  colorScheme: "heatmap" | "rainbow" | "ocean" | "cosmic" | "forest";
  showConnections: boolean;
  showNodes: boolean;
  inputDistribution: "uniform" | "gaussian" | "ring" | "spiral" | "clusters";
  animationSpeed: number;
}

export const defaultParams: SOMParams = {
  gridSize: 20,
  learningRate: 0.5,
  neighborhoodRadius: 10,
  decayRate: 0.995,
  colorScheme: "heatmap",
  showConnections: true,
  showNodes: true,
  inputDistribution: "uniform",
  animationSpeed: 1,
};

interface Node {
  x: number;
  y: number;
  weights: number[]; // 3D weights mapped to RGB
  gridX: number;
  gridY: number;
}

interface InputPoint {
  x: number;
  y: number;
  color: [number, number, number];
}

// Generate input point based on distribution
function generateInput(
  width: number,
  height: number,
  distribution: string
): InputPoint {
  const cx = width / 2;
  const cy = height / 2;
  let x: number, y: number;

  switch (distribution) {
    case "gaussian": {
      // Box-Muller transform for Gaussian
      const u1 = Math.random();
      const u2 = Math.random();
      const r = Math.sqrt(-2 * Math.log(u1));
      const theta = 2 * Math.PI * u2;
      x = cx + r * Math.cos(theta) * width * 0.15;
      y = cy + r * Math.sin(theta) * height * 0.15;
      break;
    }
    case "ring": {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.min(width, height) * 0.25 + (Math.random() - 0.5) * 40;
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius;
      break;
    }
    case "spiral": {
      const t = Math.random() * Math.PI * 4;
      const r = (t / (Math.PI * 4)) * Math.min(width, height) * 0.4;
      x = cx + Math.cos(t) * r;
      y = cy + Math.sin(t) * r;
      break;
    }
    case "clusters": {
      const clusters = [
        { x: cx - width * 0.2, y: cy - height * 0.2 },
        { x: cx + width * 0.2, y: cy - height * 0.2 },
        { x: cx, y: cy + height * 0.2 },
      ];
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      x = cluster.x + (Math.random() - 0.5) * width * 0.15;
      y = cluster.y + (Math.random() - 0.5) * height * 0.15;
      break;
    }
    default: // uniform
      x = Math.random() * width;
      y = Math.random() * height;
  }

  // Color based on position (creates smooth color gradients)
  const nx = (x / width) * 2 - 1;
  const ny = (y / height) * 2 - 1;

  return {
    x: Math.max(0, Math.min(width, x)),
    y: Math.max(0, Math.min(height, y)),
    color: [
      (Math.sin(nx * Math.PI) * 0.5 + 0.5) * 255,
      (Math.sin(ny * Math.PI) * 0.5 + 0.5) * 255,
      (Math.sin((nx + ny) * Math.PI * 0.5) * 0.5 + 0.5) * 255,
    ],
  };
}

// Get color for value based on scheme
function getColorScheme(
  value: number,
  scheme: string
): [number, number, number] {
  const t = Math.max(0, Math.min(1, value));

  switch (scheme) {
    case "heatmap":
      return [
        Math.min(255, t * 2 * 255),
        Math.min(255, Math.max(0, (t - 0.5) * 2 * 255)),
        Math.max(0, (t - 0.5) * 2 * 255),
      ];
    case "rainbow":
      const hue = t * 360;
      return hslToRgb(hue / 360, 0.8, 0.5);
    case "ocean":
      return [
        t * 50,
        t * 100 + 50,
        t * 155 + 100,
      ];
    case "cosmic":
      return [
        t * 100 + 50,
        t * 50 + 20,
        t * 200 + 55,
      ];
    case "forest":
      return [
        t * 100 + 30,
        t * 155 + 100,
        t * 80 + 40,
      ];
    default:
      return [t * 255, t * 255, t * 255];
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

// Initialize SOM grid
function initializeGrid(gridSize: number, width: number, height: number): Node[] {
  const nodes: Node[] = [];
  const cellW = width / (gridSize + 1);
  const cellH = height / (gridSize + 1);

  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      nodes.push({
        x: (gx + 1) * cellW,
        y: (gy + 1) * cellH,
        weights: [
          Math.random() * width,
          Math.random() * height,
          Math.random() * 255,
        ],
        gridX: gx,
        gridY: gy,
      });
    }
  }

  return nodes;
}

// Find best matching unit (BMU)
function findBMU(nodes: Node[], input: InputPoint): Node {
  let bmu = nodes[0];
  let minDist = Infinity;

  for (const node of nodes) {
    const dx = node.weights[0] - input.x;
    const dy = node.weights[1] - input.y;
    const dc = node.weights[2] - input.color[0];
    const dist = dx * dx + dy * dy + dc * dc * 0.001;

    if (dist < minDist) {
      minDist = dist;
      bmu = node;
    }
  }

  return bmu;
}

// Update nodes in neighborhood of BMU
function updateNodes(
  nodes: Node[],
  bmu: Node,
  input: InputPoint,
  learningRate: number,
  radius: number,
  width: number,
  height: number
): void {
  const radiusSq = radius * radius;

  for (const node of nodes) {
    const gridDistSq =
      (node.gridX - bmu.gridX) ** 2 + (node.gridY - bmu.gridY) ** 2;

    if (gridDistSq < radiusSq) {
      const influence = Math.exp(-gridDistSq / (2 * radiusSq * 0.5));
      const lr = learningRate * influence;

      node.weights[0] += lr * (input.x - node.weights[0]);
      node.weights[1] += lr * (input.y - node.weights[1]);
      node.weights[2] += lr * (input.color[0] - node.weights[2]);

      // Update position to match weights (visualization)
      node.x = node.weights[0];
      node.y = node.weights[1];
    }
  }
}

// Global state for animation persistence
let grid: Node[] | null = null;
let currentParams: SOMParams | null = null;
let learningRate: number = 0.5;
let neighborhoodRadius: number = 10;
let iteration: number = 0;

export function renderSelfOrganizingMap(
  ctx: CanvasRenderingContext2D,
  params: Partial<SOMParams>,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const p = { ...defaultParams, ...params };

  // Reset if params changed significantly
  if (
    !grid ||
    !currentParams ||
    currentParams.gridSize !== p.gridSize ||
    currentParams.inputDistribution !== p.inputDistribution
  ) {
    grid = initializeGrid(p.gridSize, width, height);
    currentParams = p;
    learningRate = p.learningRate;
    neighborhoodRadius = p.neighborhoodRadius;
    iteration = 0;
  }

  // Fade background slightly for trail effect
  ctx.fillStyle = "rgba(10, 10, 20, 0.15)";
  ctx.fillRect(0, 0, width, height);

  // Multiple training iterations per frame for faster convergence
  const iterationsPerFrame = Math.ceil(p.animationSpeed * 3);

  for (let i = 0; i < iterationsPerFrame; i++) {
    const input = generateInput(width, height, p.inputDistribution);
    const bmu = findBMU(grid, input);
    updateNodes(grid, bmu, input, learningRate, neighborhoodRadius, width, height);

    // Decay learning parameters
    learningRate *= p.decayRate;
    neighborhoodRadius *= Math.pow(p.decayRate, 0.5);
    iteration++;

    // Prevent complete stagnation
    if (learningRate < 0.001) learningRate = 0.001;
    if (neighborhoodRadius < 0.5) neighborhoodRadius = 0.5;
  }

  // Draw connections between neighboring nodes
  if (p.showConnections) {
    ctx.lineWidth = 0.5;

    for (const node of grid) {
      // Connect to right neighbor
      if (node.gridX < p.gridSize - 1) {
        const right = grid.find(
          (n) => n.gridX === node.gridX + 1 && n.gridY === node.gridY
        );
        if (right) {
          const color = getColorScheme(
            (node.weights[2] / 255 + right.weights[2] / 255) / 2,
            p.colorScheme
          );
          ctx.strokeStyle = `rgba(${color[0].toFixed(0)}, ${color[1].toFixed(
            0
          )}, ${color[2].toFixed(0)}, 0.3)`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(right.x, right.y);
          ctx.stroke();
        }
      }

      // Connect to bottom neighbor
      if (node.gridY < p.gridSize - 1) {
        const bottom = grid.find(
          (n) => n.gridX === node.gridX && n.gridY === node.gridY + 1
        );
        if (bottom) {
          const color = getColorScheme(
            (node.weights[2] / 255 + bottom.weights[2] / 255) / 2,
            p.colorScheme
          );
          ctx.strokeStyle = `rgba(${color[0].toFixed(0)}, ${color[1].toFixed(
            0
          )}, ${color[2].toFixed(0)}, 0.3)`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(bottom.x, bottom.y);
          ctx.stroke();
        }
      }
    }
  }

  // Draw nodes
  if (p.showNodes) {
    for (const node of grid) {
      const color = getColorScheme(node.weights[2] / 255, p.colorScheme);
      const size = 3 + (node.weights[2] / 255) * 3;

      // Glow
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        size * 3
      );
      gradient.addColorStop(
        0,
        `rgba(${color[0].toFixed(0)}, ${color[1].toFixed(0)}, ${color[2].toFixed(
          0
        )}, 0.6)`
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `rgb(${color[0].toFixed(0)}, ${color[1].toFixed(0)}, ${color[2].toFixed(0)})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw info overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px monospace";
  ctx.fillText(`Iteration: ${iteration}`, 10, 20);
  ctx.fillText(`Learning Rate: ${learningRate.toFixed(4)}`, 10, 35);
  ctx.fillText(`Neighborhood: ${neighborhoodRadius.toFixed(2)}`, 10, 50);
}

export const selfOrganizingMap: ArtGenerator = {
  name: "Self-Organizing Map",
  description:
    "Neural network learning visualization - watch a Kohonen map organize itself in real-time",
  params: {
    gridSize: {
      name: "Grid Size",
      type: "range",
      min: 5,
      max: 40,
      step: 1,
      default: 20,
    },
    learningRate: {
      name: "Learning Rate",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.5,
    },
    neighborhoodRadius: {
      name: "Initial Radius",
      type: "range",
      min: 1,
      max: 20,
      step: 1,
      default: 10,
    },
    decayRate: {
      name: "Decay Rate",
      type: "range",
      min: 0.99,
      max: 0.9999,
      step: 0.0001,
      default: 0.995,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["heatmap", "rainbow", "ocean", "cosmic", "forest"],
      default: "heatmap",
    },
    inputDistribution: {
      name: "Input Distribution",
      type: "select",
      options: ["uniform", "gaussian", "ring", "spiral", "clusters"],
      default: "uniform",
    },
    showConnections: {
      name: "Show Connections",
      type: "boolean",
      default: true,
    },
    showNodes: {
      name: "Show Nodes",
      type: "boolean",
      default: true,
    },
    animationSpeed: {
      name: "Animation Speed",
      type: "range",
      min: 0.5,
      max: 5,
      step: 0.5,
      default: 1,
    },
  },
  generate: (ctx, params, time) => {
    renderSelfOrganizingMap(ctx, params as Partial<SOMParams>, time);
  },
};
