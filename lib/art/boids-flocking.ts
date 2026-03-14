import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface BoidsFlockingParams {
  // Boid parameters
  boidCount: number;      // 50-300: Number of boids
  visualRange: number;    // 50-150: Perception radius
  protectedRange: number; // 10-40: Personal space
  
  // Force strengths
  separationFactor: number;  // 0.01-0.1: Avoid crowding
  alignmentFactor: number;   // 0.01-0.1: Match velocity
  cohesionFactor: number;    // 0.001-0.01: Move to center
  turnFactor: number;        // 0.1-0.5: Edge avoidance
  
  // Physics
  maxSpeed: number;       // 3-15: Maximum velocity
  minSpeed: number;       // 2-8: Minimum velocity
  
  // Visual
  colorScheme: "neon" | "sunset" | "ocean" | "forest" | "cosmic";
  showTrails: boolean;    // Show motion trails
  trailLength: number;    // 5-50: Trail fade length
  boidSize: number;       // 2-8: Size of each boid
  
  // Behavior
  animated: boolean;
  mouseInteraction: boolean; // Boids avoid/follow mouse
}

export const boidsFlockingDefaultParams: BoidsFlockingParams = {
  boidCount: 150,
  visualRange: 80,
  protectedRange: 15,
  separationFactor: 0.05,
  alignmentFactor: 0.05,
  cohesionFactor: 0.005,
  turnFactor: 0.3,
  maxSpeed: 8,
  minSpeed: 4,
  colorScheme: "neon",
  showTrails: true,
  trailLength: 20,
  boidSize: 4,
  animated: true,
  mouseInteraction: true,
};

// Boid state
interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
}

// Initialize boids
function initBoids(count: number, width: number, height: number, colors: string[]): Boid[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    trail: [],
  }));
}

// Update boid based on three rules: separation, alignment, cohesion
function updateBoid(
  boid: Boid,
  allBoids: Boid[],
  width: number,
  height: number,
  mouseX: number | null,
  mouseY: number | null,
  config: BoidsFlockingParams
): void {
  let closeDx = 0, closeDy = 0;        // Separation
  let xvelAvg = 0, yvelAvg = 0;        // Alignment
  let xposAvg = 0, yposAvg = 0;        // Cohesion
  let neighboringBoids = 0;

  for (const other of allBoids) {
    if (other === boid) continue;

    const dx = boid.x - other.x;
    const dy = boid.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < config.visualRange) {
      // Separation: avoid crowding
      if (distance < config.protectedRange) {
        closeDx += dx;
        closeDy += dy;
      }

      // Alignment: match velocity
      xvelAvg += other.vx;
      yvelAvg += other.vy;

      // Cohesion: move toward center of neighbors
      xposAvg += other.x;
      yposAvg += other.y;

      neighboringBoids++;
    }
  }

  if (neighboringBoids > 0) {
    // Average and apply alignment
    xvelAvg /= neighboringBoids;
    yvelAvg /= neighboringBoids;
    boid.vx += (xvelAvg - boid.vx) * config.alignmentFactor;
    boid.vy += (yvelAvg - boid.vy) * config.alignmentFactor;

    // Average and apply cohesion
    xposAvg /= neighboringBoids;
    yposAvg /= neighboringBoids;
    boid.vx += (xposAvg - boid.x) * config.cohesionFactor;
    boid.vy += (yposAvg - boid.y) * config.cohesionFactor;
  }

  // Apply separation
  boid.vx += closeDx * config.separationFactor;
  boid.vy += closeDy * config.separationFactor;

  // Mouse interaction
  if (config.mouseInteraction && mouseX !== null && mouseY !== null) {
    const dx = boid.x - mouseX;
    const dy = boid.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      // Avoid mouse
      boid.vx += dx * 0.002;
      boid.vy += dy * 0.002;
    }
  }

  // Edge avoidance (turn factor)
  const margin = 100;
  if (boid.x < margin) boid.vx += config.turnFactor;
  if (boid.x > width - margin) boid.vx -= config.turnFactor;
  if (boid.y < margin) boid.vy += config.turnFactor;
  if (boid.y > height - margin) boid.vy -= config.turnFactor;

  // Speed limits
  const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
  if (speed > config.maxSpeed) {
    boid.vx = (boid.vx / speed) * config.maxSpeed;
    boid.vy = (boid.vy / speed) * config.maxSpeed;
  } else if (speed < config.minSpeed) {
    boid.vx = (boid.vx / speed) * config.minSpeed;
    boid.vy = (boid.vy / speed) * config.minSpeed;
  }

  // Update position
  boid.x += boid.vx;
  boid.y += boid.vy;

  // Wrap around edges
  if (boid.x < 0) boid.x = width;
  if (boid.x > width) boid.x = 0;
  if (boid.y < 0) boid.y = height;
  if (boid.y > height) boid.y = 0;

  // Update trail
  if (config.showTrails) {
    boid.trail.push({ x: boid.x, y: boid.y });
    if (boid.trail.length > config.trailLength) {
      boid.trail.shift();
    }
  }
}

// Draw a boid as a triangle pointing in velocity direction
function drawBoid(ctx: CanvasRenderingContext2D, boid: Boid, size: number): void {
  const angle = Math.atan2(boid.vy, boid.vx);
  
  ctx.save();
  ctx.translate(boid.x, boid.y);
  ctx.rotate(angle);
  
  ctx.beginPath();
  ctx.moveTo(size * 2, 0);
  ctx.lineTo(-size, -size * 0.8);
  ctx.lineTo(-size * 0.5, 0);
  ctx.lineTo(-size, size * 0.8);
  ctx.closePath();
  
  ctx.fillStyle = boid.color;
  ctx.fill();
  
  ctx.restore();
}

// Draw trail for a boid
function drawTrail(ctx: CanvasRenderingContext2D, boid: Boid, maxLength: number): void {
  if (boid.trail.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(boid.trail[0].x, boid.trail[0].y);
  
  for (let i = 1; i < boid.trail.length; i++) {
    ctx.lineTo(boid.trail[i].x, boid.trail[i].y);
  }

  for (let i = 0; i < boid.trail.length - 1; i++) {
    const alpha = (i / maxLength) * 0.4;
    ctx.strokeStyle = boid.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boid.trail[i].x, boid.trail[i].y);
    ctx.lineTo(boid.trail[i + 1].x, boid.trail[i + 1].y);
    ctx.stroke();
  }
}

// Module-level state for persistence across frames
let boids: Boid[] | null = null;
let lastMouseX: number | null = null;
let lastMouseY: number | null = null;

export function renderBoidsFlocking(
  ctx: CanvasRenderingContext2D,
  params: Partial<BoidsFlockingParams> = {},
  time: number = 0
): void {
  const config = { ...boidsFlockingDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Color palettes
  const palettes: Record<string, string[]> = {
    neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
    sunset: ["#FF6B6B", "#FF8E53", "#FE6B8B", "#FF8E53", "#FFA07A"],
    ocean: ["#0077BE", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF"],
    forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
    cosmic: ["#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#3F37C9"],
  };
  const colors = palettes[config.colorScheme] || palettes.neon;

  // Clear with fade for trail effect
  ctx.fillStyle = "rgba(10, 10, 15, 0.3)";
  ctx.fillRect(0, 0, width, height);

  // Initialize boids on first run
  if (!boids || boids.length !== config.boidCount) {
    boids = initBoids(config.boidCount, width, height, colors);
  }

  // Update and draw boids
  if (config.animated) {
    for (const boid of boids) {
      updateBoid(boid, boids, width, height, lastMouseX, lastMouseY, config);
    }
  }

  // Draw trails first (behind boids)
  if (config.showTrails) {
    for (const boid of boids) {
      drawTrail(ctx, boid, config.trailLength);
    }
  }

  // Draw boids
  for (const boid of boids) {
    drawBoid(ctx, boid, config.boidSize);
  }

  // Draw info
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px monospace";
  ctx.fillText(`boids: ${config.boidCount} | cohesion + alignment + separation`, 10, height - 10);
}

// Mouse tracking for interaction
export function setBoidsMousePosition(x: number | null, y: number | null): void {
  lastMouseX = x;
  lastMouseY = y;
}

// Reset boids state
export function resetBoids(): void {
  boids = null;
}

// Backward compatibility: ArtGenerator interface
export const boidsFlocking: ArtGenerator = {
  id: "boids-flocking",
  name: "Emergent Flocking Behavior",
  category: "natural",
  render: (ctx, params, time) => renderBoidsFlocking(ctx, params as BoidsFlockingParams, time),
  defaultParams: boidsFlockingDefaultParams,
};

export default boidsFlocking;
