/**
 * Emergent Canvas — Collective Creation from Simple Rules
 *
 * Simple agents with local rules collectively paint a canvas.
 * No single agent knows the whole picture. Emergence does the work.
 *
 * Each agent has:
 * - A color preference (hue family)
 * - A movement pattern (wanderer, follower, avoider, creator)
 * - A response to existing paint (attracted/repelled by certain colors)
 * - A brush size and opacity
 *
 * The result: a collaborative artwork that emerges from local interactions.
 */

import type { ArtGenerator, ParamConfig } from "./core";

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  saturation: number;
  lightness: number;
  size: number;
  opacity: number;
  behavior: "wanderer" | "follower" | "avoider" | "creator";
  energy: number;
  age: number;
}

interface PixelData {
  r: number;
  g: number;
  b: number;
  count: number;
}

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

// Color conversion utilities
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function getHueFromRgb(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d === 0) return 0;
  if (max === r) return ((g - b) / d + (g < b ? 6 : 0)) * 60;
  if (max === g) return ((b - r) / d + 2) * 60;
  return ((r - g) / d + 4) * 60;
}

// Create an agent with randomized properties
function createAgent(
  width: number,
  height: number,
  rng: SeededRandom,
  palette: "warm" | "cool" | "neon" | "earth" | "monochrome"
): Agent {
  let baseHue: number;

  switch (palette) {
    case "warm":
      baseHue = rng.range(0, 60) + (rng.next() > 0.5 ? 300 : 0);
      break;
    case "cool":
      baseHue = rng.range(120, 260);
      break;
    case "neon":
      baseHue = rng.pick([60, 180, 300, 0]);
      break;
    case "earth":
      baseHue = rng.range(20, 60);
      break;
    case "monochrome":
      baseHue = 0;
      break;
    default:
      baseHue = rng.range(0, 360);
  }

  const behaviors: Agent["behavior"][] = ["wanderer", "follower", "avoider", "creator"];

  return {
    x: rng.range(0, width),
    y: rng.range(0, height),
    vx: rng.range(-1, 1),
    vy: rng.range(-1, 1),
    hue: baseHue,
    saturation: palette === "monochrome" ? 0 : rng.range(50, 90),
    lightness: rng.range(40, 70),
    size: rng.range(2, 8),
    opacity: rng.range(0.1, 0.4),
    behavior: rng.pick(behaviors),
    energy: rng.range(50, 100),
    age: 0,
  };
}

// Get pixel color from ImageData
function getPixel(
  imageData: ImageData,
  x: number,
  y: number
): [number, number, number] {
  const idx = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
  return [imageData.data[idx], imageData.data[idx + 1], imageData.data[idx + 2]];
}

// Set pixel color in ImageData
function setPixel(
  imageData: ImageData,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
): void {
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  if (fx < 0 || fx >= imageData.width || fy < 0 || fy >= imageData.height) return;

  const idx = (fy * imageData.width + fx) * 4;
  const alpha = a / 255;
  const invAlpha = 1 - alpha;

  imageData.data[idx] = r * alpha + imageData.data[idx] * invAlpha;
  imageData.data[idx + 1] = g * alpha + imageData.data[idx + 1] * invAlpha;
  imageData.data[idx + 2] = b * alpha + imageData.data[idx + 2] * invAlpha;
  imageData.data[idx + 3] = 255;
}

// Paint a brush stroke
function paintBrush(
  imageData: ImageData,
  x: number,
  y: number,
  size: number,
  r: number,
  g: number,
  b: number,
  opacity: number
): void {
  const radius = Math.floor(size);
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;

      const fade = 1 - dist / radius;
      const alpha = opacity * fade * 255;
      setPixel(imageData, x + dx, y + dy, r, g, b, alpha);
    }
  }
}

// Update agent based on its behavior and environment
function updateAgent(
  agent: Agent,
  imageData: ImageData,
  width: number,
  height: number,
  rng: SeededRandom,
  params: {
    cohesion: number;
    separation: number;
    alignment: number;
    sensorDistance: number;
  }
): void {
  // Sample environment
  const sensorX = agent.x + Math.cos(Math.atan2(agent.vy, agent.vx)) * params.sensorDistance;
  const sensorY = agent.y + Math.sin(Math.atan2(agent.vy, agent.vx)) * params.sensorDistance;

  let [sr, sg, sb] = [128, 128, 128];
  if (sensorX >= 0 && sensorX < width && sensorY >= 0 && sensorY < height) {
    [sr, sg, sb] = getPixel(imageData, sensorX, sensorY);
  }

  const sensorHue = getHueFromRgb(sr, sg, sb);
  const hueDiff = Math.abs(((sensorHue - agent.hue + 180) % 360) - 180);

  // Behavior-based steering
  let steerX = 0;
  let steerY = 0;

  switch (agent.behavior) {
    case "wanderer":
      // Random walk with slight preference for unexplored areas
      steerX += rng.range(-1, 1);
      steerY += rng.range(-1, 1);
      if (sr + sg + sb > 100) {
        // Prefer darker areas
        steerX += (rng.next() - 0.5) * 2;
        steerY += (rng.next() - 0.5) * 2;
      }
      break;

    case "follower":
      // Follow similar colors
      if (hueDiff < 60) {
        steerX += (sensorX - agent.x) * 0.01;
        steerY += (sensorY - agent.y) * 0.01;
      } else {
        steerX += rng.range(-0.5, 0.5);
        steerY += rng.range(-0.5, 0.5);
      }
      break;

    case "avoider":
      // Avoid similar colors (create contrast)
      if (hueDiff < 60) {
        steerX -= (sensorX - agent.x) * 0.02;
        steerY -= (sensorY - agent.y) * 0.02;
      }
      steerX += rng.range(-0.3, 0.3);
      steerY += rng.range(-0.3, 0.3);
      break;

    case "creator":
      // Seek empty canvas
      if (sr + sg + sb > 50) {
        steerX += rng.range(-2, 2);
        steerY += rng.range(-2, 2);
      } else {
        // Found empty space, slow down and paint
        agent.vx *= 0.9;
        agent.vy *= 0.9;
      }
      break;
  }

  // Apply steering
  agent.vx += steerX * 0.1;
  agent.vy += steerY * 0.1;

  // Limit speed
  const speed = Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy);
  const maxSpeed = 3;
  if (speed > maxSpeed) {
    agent.vx = (agent.vx / speed) * maxSpeed;
    agent.vy = (agent.vy / speed) * maxSpeed;
  }

  // Update position
  agent.x += agent.vx;
  agent.y += agent.vy;

  // Wrap around edges
  if (agent.x < 0) agent.x = width;
  if (agent.x > width) agent.x = 0;
  if (agent.y < 0) agent.y = height;
  if (agent.y > height) agent.y = 0;

  // Age and energy
  agent.age++;
  agent.energy -= 0.1;

  // Occasionally change behavior
  if (rng.next() < 0.001) {
    const behaviors: Agent["behavior"][] = ["wanderer", "follower", "avoider", "creator"];
    agent.behavior = rng.pick(behaviors);
  }
}

// Main render function
function renderEmergentCanvas(
  ctx: CanvasRenderingContext2D,
  params: Record<string, number | string>,
  time?: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const seed = typeof params.seed === "number" ? params.seed : 12345;
  const rng = new SeededRandom(seed);

  const agentCount = params.agentCount as number;
  const iterations = params.iterations as number;
  const palette = params.palette as string;

  // Initialize canvas with subtle gradient background
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) / 2
  );
  gradient.addColorStop(0, "#0a0a0f");
  gradient.addColorStop(1, "#050508");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Get image data for pixel manipulation
  const imageData = ctx.getImageData(0, 0, width, height);

  // Create agents
  const agents: Agent[] = [];
  for (let i = 0; i < agentCount; i++) {
    agents.push(createAgent(width, height, rng, palette as "warm" | "cool" | "neon" | "earth" | "monochrome"));
  }

  // Simulation parameters
  const simParams = {
    cohesion: 0.5,
    separation: 0.3,
    alignment: 0.2,
    sensorDistance: 20,
  };

  // Run simulation
  for (let step = 0; step < iterations; step++) {
    for (const agent of agents) {
      // Update agent
      updateAgent(agent, imageData, width, height, rng, simParams);

      // Paint if agent has energy
      if (agent.energy > 0 && rng.next() < 0.3) {
        const [r, g, b] = hslToRgb(agent.hue, agent.saturation, agent.lightness);
        paintBrush(
          imageData,
          agent.x,
          agent.y,
          agent.size,
          r,
          g,
          b,
          agent.opacity * (agent.energy / 100)
        );
      }

      // Respawn dead agents
      if (agent.energy <= 0 || agent.age > 1000) {
        Object.assign(
          agent,
          createAgent(width, height, rng, palette as "warm" | "cool" | "neon" | "earth" | "monochrome")
        );
      }
    }
  }

  // Put image data back
  ctx.putImageData(imageData, 0, 0);

  // Add subtle vignette
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.3,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// Generator definition
export const emergentCanvas: ArtGenerator = {
  name: "Emergent Canvas",
  description:
    "Simple agents with local rules collectively paint a canvas. No single agent knows the whole picture — emergence creates art from decentralized creation.",
  params: {
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 99999,
      step: 1,
      default: 12345,
    } as ParamConfig,
    agentCount: {
      name: "Agents",
      type: "range",
      min: 10,
      max: 200,
      step: 10,
      default: 50,
    } as ParamConfig,
    iterations: {
      name: "Iterations",
      type: "range",
      min: 100,
      max: 2000,
      step: 100,
      default: 500,
    } as ParamConfig,
    palette: {
      name: "Palette",
      type: "select",
      options: ["warm", "cool", "neon", "earth", "monochrome"],
      default: "warm",
    } as ParamConfig,
  },
  generate: renderEmergentCanvas,
  meta: {
    category: "abstract",
    complexity: "moderate",
    tags: ["animated", "organic", "chaotic", "colorful"],
    created: "2026-03-18",
  },
};

export { renderEmergentCanvas };
