import { ArtGenerator, ArtParams, ParamConfig } from "./core";

export interface ChaosGameParams extends ArtParams {
  iterations: number;
  pointSize: number;
  colorScheme: "classic" | "gradient" | "rainbow" | "fire" | "ocean";
  animationSpeed: number;
  showVertices: boolean;
  vertexSize: number;
}

export const chaosGameDefaultParams: ChaosGameParams = {
  iterations: 50000,
  pointSize: 1,
  colorScheme: "gradient",
  animationSpeed: 50,
  showVertices: true,
  vertexSize: 4,
};

// Color schemes
const colorSchemes: Record<string, (iteration: number, maxIterations: number, x: number, y: number) => string> = {
  classic: () => "#00ff88",
  
  gradient: (iteration, max) => {
    const t = iteration / max;
    const r = Math.floor(255 * (1 - t) + 100 * t);
    const g = Math.floor(255 * (1 - t) + 200 * t);
    const b = Math.floor(200 * (1 - t) + 255 * t);
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  rainbow: (iteration, max) => {
    const hue = (iteration / max) * 360;
    return `hsl(${hue}, 80%, 60%)`;
  },
  
  fire: (iteration, max, x, y) => {
    // Heat based on y position (higher = hotter)
    const heat = 1 - (y + 1) / 2;
    const r = Math.floor(255);
    const g = Math.floor(255 * heat * 0.8);
    const b = Math.floor(100 * heat * 0.3);
    return `rgb(${r}, ${g}, ${b})`;
  },
  
  ocean: (iteration, max, x, y) => {
    const depth = (y + 1) / 2;
    const r = Math.floor(50 * depth);
    const g = Math.floor(100 + 100 * depth);
    const b = Math.floor(150 + 105 * depth);
    return `rgb(${r}, ${g}, ${b})`;
  },
};

export function renderChaosGame(
  ctx: CanvasRenderingContext2D,
  params: ChaosGameParams,
  timestamp?: number
): void {
  const { width, height } = ctx.canvas;
  const { iterations, pointSize, colorScheme, showVertices, vertexSize } = params;
  
  // Clear canvas with dark background
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);
  
  // Triangle vertices (equilateral triangle)
  const margin = Math.min(width, height) * 0.1;
  const size = Math.min(width, height) - margin * 2;
  const centerX = width / 2;
  const centerY = height / 2 + size * 0.1;
  
  const vertices = [
    { x: centerX, y: centerY - size * 0.577 }, // Top
    { x: centerX - size * 0.5, y: centerY + size * 0.289 }, // Bottom left
    { x: centerX + size * 0.5, y: centerY + size * 0.289 }, // Bottom right
  ];
  
  // Draw vertices if enabled
  if (showVertices) {
    vertices.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, vertexSize, 0, Math.PI * 2);
      ctx.fillStyle = ["#ff6b6b", "#4ecdc4", "#ffe66d"][i];
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  
  // Chaos game algorithm
  // Start at a random point inside the triangle
  let x = centerX + (Math.random() - 0.5) * size * 0.5;
  let y = centerY + (Math.random() - 0.5) * size * 0.5;
  
  // Settle the first 20 points (don't draw them)
  for (let i = 0; i < 20; i++) {
    const vertex = vertices[Math.floor(Math.random() * 3)];
    x = (x + vertex.x) / 2;
    y = (y + vertex.y) / 2;
  }
  
  // Get color function
  const getColor = colorSchemes[colorScheme] || colorSchemes.gradient;
  
  // Draw points
  ctx.fillStyle = colorSchemes[colorScheme] === colorSchemes.classic 
    ? "#00ff88" 
    : undefined;
  
  // For animated mode, we draw progressively
  const isAnimated = timestamp !== undefined;
  const maxPoints = isAnimated 
    ? Math.min(iterations, Math.floor((timestamp % 10000) / (101 - params.animationSpeed) * 100))
    : iterations;
  
  // Batch drawing for performance
  const batchSize = 1000;
  const pointsToDraw = Math.min(maxPoints, iterations);
  
  for (let batch = 0; batch < pointsToDraw; batch += batchSize) {
    const batchEnd = Math.min(batch + batchSize, pointsToDraw);
    
    for (let i = batch; i < batchEnd; i++) {
      // Pick a random vertex
      const vertex = vertices[Math.floor(Math.random() * 3)];
      
      // Move halfway to that vertex
      x = (x + vertex.x) / 2;
      y = (y + vertex.y) / 2;
      
      // Map to normalized coordinates for coloring
      const nx = (x - centerX) / (size * 0.5);
      const ny = (y - centerY) / (size * 0.5);
      
      // Draw point
      if (colorSchemes[colorScheme] !== colorSchemes.classic) {
        ctx.fillStyle = getColor(i, iterations, nx, ny);
      }
      
      ctx.fillRect(x - pointSize/2, y - pointSize/2, pointSize, pointSize);
    }
  }
  
  // Draw iteration counter
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px monospace";
  ctx.fillText(`Points: ${pointsToDraw.toLocaleString()}`, 20, 30);
}

export const chaosGame: ArtGenerator = {
  name: "Chaos Game",
  description: "The Sierpinski triangle emerges from randomness — choose a random vertex, move halfway there, repeat. Order from chaos.",
  params: {
    iterations: {
      type: "range",
      default: 50000,
      min: 1000,
      max: 200000,
      step: 1000,
      label: "Iterations",
      description: "Number of points to draw",
    },
    pointSize: {
      type: "range",
      default: 1,
      min: 0.5,
      max: 3,
      step: 0.5,
      label: "Point Size",
      description: "Size of each point",
    },
    colorScheme: {
      type: "select",
      default: "gradient",
      options: ["classic", "gradient", "rainbow", "fire", "ocean"],
      label: "Color Scheme",
      description: "How to color the points",
    },
    animationSpeed: {
      type: "range",
      default: 50,
      min: 1,
      max: 100,
      step: 1,
      label: "Animation Speed",
      description: "Speed of progressive rendering",
    },
    showVertices: {
      type: "boolean",
      default: true,
      label: "Show Vertices",
      description: "Display the triangle corners",
    },
    vertexSize: {
      type: "range",
      default: 4,
      min: 2,
      max: 10,
      step: 1,
      label: "Vertex Size",
      description: "Size of vertex markers",
    },
  },
  generate: renderChaosGame,
  category: "mathematical",
  tags: ["fractal", "sierpinski", "chaos", "probability", "emergence"],
};
