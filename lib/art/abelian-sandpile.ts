"use client";

import { ArtGenerator, ArtParams } from "./core";

export interface SandpileParams extends ArtParams {
  gridSize: number;
  dropRate: number;
  maxGrains: number;
  colorScheme: string;
  dropPattern: string;
  showNumbers: number;
}

// Color schemes for sandpile visualization
const COLOR_SCHEMES: Record<string, string[]> = {
  "heat": ["#0a0a0a", "#1a237e", "#283593", "#3949ab", "#5e35b1", "#8e24aa", "#d81b60", "#e53935", "#fb8c00", "#ffb300", "#fdd835", "#fff176", "#ffffff"],
  "ocean": ["#000510", "#001a33", "#003366", "#004c8c", "#0066b3", "#0080d9", "#3399ff", "#66b3ff", "#99ccff", "#cce5ff", "#e6f2ff", "#f0f8ff"],
  "forest": ["#0a1f0a", "#1a3d1a", "#2d5a2d", "#407840", "#529652", "#65b465", "#78c878", "#8edc8e", "#a2f0a2", "#b8ffb8", "#ceffce", "#e4ffe4"],
  "fire": ["#1a0500", "#330a00", "#661400", "#991f00", "#cc2900", "#ff3300", "#ff5c1a", "#ff8533", "#ffad4d", "#ffd666", "#ffee80", "#ffff99", "#ffffcc"],
  "monochrome": ["#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666", "#808080", "#999999", "#b3b3b3", "#cccccc", "#e6e6e6", "#f2f2f2", "#ffffff"],
  "neon": ["#0a0a0a", "#1a0033", "#330066", "#4d0099", "#6600cc", "#8000ff", "#9933ff", "#b366ff", "#cc99ff", "#e6ccff", "#f5e6ff", "#faf0ff"],
  "earth": ["#1a0f0a", "#3d241a", "#5c3626", "#7a4833", "#995a40", "#b86c4d", "#d47e5a", "#e6916b", "#f0a57c", "#f5b88d", "#facc9e", "#ffe0b3"],
};

// Sandpile state
interface SandpileState {
  grid: number[][];
  width: number;
  height: number;
  maxGrains: number;
  toTopple: Set<string>; // Set of "x,y" coordinates that need toppling
}

// Initialize sandpile state
function createSandpile(width: number, height: number, maxGrains: number): SandpileState {
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    grid[y] = new Array(width).fill(0);
  }
  return {
    grid,
    width,
    height,
    maxGrains,
    toTopple: new Set(),
  };
}

// Add sand to a cell and track if it needs toppling
function addSand(state: SandpileState, x: number, y: number, amount: number): void {
  if (x < 0 || x >= state.width || y < 0 || y >= state.height) return;
  
  state.grid[y][x] += amount;
  if (state.grid[y][x] >= state.maxGrains) {
    state.toTopple.add(`${x},${y}`);
  }
}

// Topple all unstable cells (one iteration)
// Returns true if any toppling occurred
function topple(state: SandpileState): boolean {
  const toProcess = Array.from(state.toTopple);
  state.toTopple.clear();
  
  if (toProcess.length === 0) return false;
  
  for (const coord of toProcess) {
    const [x, y] = coord.split(",").map(Number);
    const grains = state.grid[y][x];
    
    if (grains < state.maxGrains) continue;
    
    // Distribute 4 grains to neighbors (von Neumann neighborhood)
    const toDistribute = Math.floor(grains / 4) * 4;
    const perNeighbor = toDistribute / 4;
    
    state.grid[y][x] -= toDistribute;
    
    // Top neighbor
    addSand(state, x, y - 1, perNeighbor);
    // Right neighbor
    addSand(state, x + 1, y, perNeighbor);
    // Bottom neighbor
    addSand(state, x, y + 1, perNeighbor);
    // Left neighbor
    addSand(state, x - 1, y, perNeighbor);
  }
  
  return true;
}

// Drop sand according to pattern
function dropSand(state: SandpileState, pattern: string, amount: number): void {
  const cx = Math.floor(state.width / 2);
  const cy = Math.floor(state.height / 2);
  
  switch (pattern) {
    case "center":
      addSand(state, cx, cy, amount);
      break;
    case "random":
      for (let i = 0; i < amount; i++) {
        const x = Math.floor(Math.random() * state.width);
        const y = Math.floor(Math.random() * state.height);
        addSand(state, x, y, 1);
      }
      break;
    case "corners":
      const margin = Math.floor(Math.min(state.width, state.height) * 0.1);
      addSand(state, margin, margin, amount / 4);
      addSand(state, state.width - 1 - margin, margin, amount / 4);
      addSand(state, margin, state.height - 1 - margin, amount / 4);
      addSand(state, state.width - 1 - margin, state.height - 1 - margin, amount / 4);
      break;
    case "circle":
      const radius = Math.min(cx, cy) * 0.6;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.floor(cx + Math.cos(angle) * radius);
        const y = Math.floor(cy + Math.sin(angle) * radius);
        addSand(state, x, y, amount / 8);
      }
      break;
    case "line":
      for (let x = cx - 10; x <= cx + 10; x++) {
        addSand(state, x, cy, amount / 21);
      }
      break;
  }
}

// Render sandpile to canvas
function renderSandpile(
  ctx: CanvasRenderingContext2D,
  state: SandpileState,
  colorScheme: string,
  showNumbers: boolean
): void {
  const canvas = ctx.canvas;
  const cellWidth = canvas.width / state.width;
  const cellHeight = canvas.height / state.height;
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.heat;
  
  // Clear canvas
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw each cell
  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      const grains = state.grid[y][x];
      if (grains > 0) {
        const colorIndex = Math.min(grains, colors.length - 1);
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(
          Math.floor(x * cellWidth),
          Math.floor(y * cellHeight),
          Math.ceil(cellWidth),
          Math.ceil(cellHeight)
        );
      }
    }
  }
  
  // Draw numbers if enabled (for low grid sizes)
  if (showNumbers && state.width <= 20) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = `${Math.max(8, Math.min(cellWidth, cellHeight) * 0.5)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let y = 0; y < state.height; y++) {
      for (let x = 0; x < state.width; x++) {
        const grains = state.grid[y][x];
        if (grains > 0) {
          const text = grains >= state.maxGrains ? "!" : grains.toString();
          ctx.fillText(
            text,
            x * cellWidth + cellWidth / 2,
            y * cellHeight + cellHeight / 2
          );
        }
      }
    }
  }
}

// Persistent state for animation
let sandpileState: SandpileState | null = null;
let animationFrame: number | null = null;
let lastDropTime = 0;

export function renderAbelianSandpile(
  ctx: CanvasRenderingContext2D,
  params: SandpileParams,
  time?: number
): void {
  const canvas = ctx.canvas;
  const gridSize = params.gridSize;
  const maxGrains = params.maxGrains;
  const colorScheme = params.colorScheme;
  const dropPattern = params.dropPattern;
  const dropRate = params.dropRate;
  const showNumbers = params.showNumbers === 1;
  
  // Initialize state if needed or if parameters changed
  if (!sandpileState || 
      sandpileState.width !== gridSize || 
      sandpileState.height !== gridSize ||
      sandpileState.maxGrains !== maxGrains) {
    sandpileState = createSandpile(gridSize, gridSize, maxGrains);
    lastDropTime = 0;
  }
  
  const currentTime = time || performance.now();
  
  // Drop sand periodically based on drop rate
  // dropRate is grains per second
  if (currentTime - lastDropTime > 1000 / dropRate) {
    dropSand(sandpileState, dropPattern, 1);
    lastDropTime = currentTime;
  }
  
  // Perform multiple toppling iterations per frame for visible progress
  // More iterations when there are more cells to topple
  const iterations = Math.min(100, Math.max(1, sandpileState.toTopple.size * 2));
  for (let i = 0; i < iterations; i++) {
    if (!topple(sandpileState)) break;
  }
  
  // Render
  renderSandpile(ctx, sandpileState, colorScheme, showNumbers);
}

export const abelianSandpile: ArtGenerator = {
  name: "Abelian Sandpile",
  description: "Self-organized criticality cellular automaton. Sand grains accumulate and topple when exceeding threshold, creating fractal patterns.",
  params: {
    gridSize: {
      name: "Grid Size",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    maxGrains: {
      name: "Max Grains",
      type: "range",
      min: 2,
      max: 8,
      step: 1,
      default: 4,
    },
    dropRate: {
      name: "Drop Rate",
      type: "range",
      min: 1,
      max: 60,
      step: 1,
      default: 10,
    },
    dropPattern: {
      name: "Drop Pattern",
      type: "select",
      options: ["center", "random", "corners", "circle", "line"],
      default: "center",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["heat", "ocean", "forest", "fire", "monochrome", "neon", "earth"],
      default: "heat",
    },
    showNumbers: {
      name: "Show Numbers",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 0,
    },
  },
  generate: renderAbelianSandpile,
  meta: {
    category: "mathematical",
    complexity: "moderate",
    tags: ["animated", "geometric", "ordered", "colorful", "detailed"],
    created: "2024-02-27",
  },
};

export const defaultParams: SandpileParams = {
  gridSize: 50,
  maxGrains: 4,
  dropRate: 10,
  dropPattern: "center",
  colorScheme: "heat",
  showNumbers: 0,
};
