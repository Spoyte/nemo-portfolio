import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface CelestialMechanicsParams {
  bodyCount: number;        // 3-12: Number of celestial bodies
  trailLength: number;      // 20-200: Length of motion trails
  speed: number;            // 0.1-3: Simulation speed
  colorScheme: "cosmic" | "fire" | "ocean" | "forest" | "monochrome";
  showConnections: boolean; // Draw gravitational influence lines
  gravityStrength: number;  // 0.5-3: Strength of gravitational pull
  animated: boolean;
}

export const celestialMechanicsDefaultParams: CelestialMechanicsParams = {
  bodyCount: 5,
  trailLength: 80,
  speed: 1,
  colorScheme: "cosmic",
  showConnections: true,
  gravityStrength: 1.5,
  animated: true,
};

// Color palettes
const palettes: Record<string, string[]> = {
  cosmic: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
  fire: ["#FF4500", "#FF6347", "#FF8C00", "#FFA500", "#FFD700", "#DC143C"],
  ocean: ["#006994", "#0096C7", "#48CAE4", "#90E0EF", "#CAF0F8", "#0077B6"],
  forest: ["#2D5016", "#3A7D44", "#69B578", "#98D9A8", "#C8E6C9", "#1B4332"],
  monochrome: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD", "#6C757D"],
};

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

function createBodies(
  count: number,
  width: number,
  height: number,
  colors: string[]
): Body[] {
  const bodies: Body[] = [];
  const centerX = width / 2;
  const centerY = height / 2;

  // Central star (heaviest body)
  bodies.push({
    x: centerX,
    y: centerY,
    vx: 0,
    vy: 0,
    mass: 50,
    radius: 12,
    color: colors[0],
    trail: [],
  });

  // Orbiting bodies
  for (let i = 1; i < count; i++) {
    const angle = (i / (count - 1)) * Math.PI * 2;
    const distance = 60 + i * 35;
    const orbitalSpeed = Math.sqrt(1000 / distance) * 0.15;

    bodies.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      vx: -Math.sin(angle) * orbitalSpeed,
      vy: Math.cos(angle) * orbitalSpeed,
      mass: 5 + Math.random() * 10,
      radius: 4 + Math.random() * 5,
      color: colors[i % colors.length],
      trail: [],
    });
  }

  return bodies;
}

function updatePhysics(
  bodies: Body[],
  gravityStrength: number,
  speed: number,
  width: number,
  height: number
): void {
  const dt = 0.5 * speed;
  const G = 0.3 * gravityStrength;

  // Calculate gravitational forces
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];

      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Softening parameter to prevent singularities
      const softening = 20;
      const force = (G * b1.mass * b2.mass) / (distSq + softening * softening);

      const fx = (force * dx) / dist;
      const fy = (force * dy) / dist;

      b1.vx += (fx / b1.mass) * dt;
      b1.vy += (fy / b1.mass) * dt;
      b2.vx -= (fx / b2.mass) * dt;
      b2.vy -= (fy / b2.mass) * dt;
    }
  }

  // Update positions and trails
  for (const body of bodies) {
    body.x += body.vx * dt;
    body.y += body.vy * dt;

    // Add to trail
    body.trail.push({ x: body.x, y: body.y });

    // Damping to prevent runaway velocities
    body.vx *= 0.9995;
    body.vy *= 0.9995;
  }
}

export function renderCelestialMechanics(
  ctx: CanvasRenderingContext2D,
  params: Partial<CelestialMechanicsParams> = {},
  time: number = 0
): void {
  const config = { ...celestialMechanicsDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const colors = palettes[config.colorScheme] || palettes.cosmic;

  // Dark space background with subtle gradient
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, "#0a0a1a");
  gradient.addColorStop(0.5, "#050510");
  gradient.addColorStop(1, "#020205");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Static starfield (pseudo-random based on position)
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 0; i < 100; i++) {
    const sx = ((i * 137.5) % width);
    const sy = ((i * 73.3) % height);
    const size = (i % 3) + 1;
    ctx.globalAlpha = 0.2 + (i % 5) * 0.15;
    ctx.beginPath();
    ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Initialize or retrieve bodies from context
  const context = ctx as GeneratorContext;
  if (!context.celestialBodies || context.celestialBodies.length !== config.bodyCount) {
    context.celestialBodies = createBodies(config.bodyCount, width, height, colors);
  }

  const bodies = context.celestialBodies;

  // Update physics if animated
  if (config.animated) {
    updatePhysics(bodies, config.gravityStrength, config.speed, width, height);
  }

  // Trim trails
  for (const body of bodies) {
    while (body.trail.length > config.trailLength) {
      body.trail.shift();
    }
  }

  // Draw gravitational connections
  if (config.showConnections) {
    ctx.strokeStyle = "rgba(100, 150, 200, 0.1)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const b1 = bodies[i];
        const b2 = bodies[j];
        const dist = Math.hypot(b2.x - b1.x, b2.y - b1.y);
        const opacity = Math.max(0, 1 - dist / 200) * 0.15;
        
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.strokeStyle = `rgba(100, 150, 200, ${opacity})`;
        ctx.stroke();
      }
    }
  }

  // Draw trails
  for (const body of bodies) {
    if (body.trail.length < 2) continue;

    ctx.beginPath();
    ctx.moveTo(body.trail[0].x, body.trail[0].y);
    
    for (let i = 1; i < body.trail.length; i++) {
      const point = body.trail[i];
      ctx.lineTo(point.x, point.y);
    }

    // Trail gradient
    const trailGradient = ctx.createLinearGradient(
      body.trail[0].x, body.trail[0].y,
      body.trail[body.trail.length - 1].x, body.trail[body.trail.length - 1].y
    );
    trailGradient.addColorStop(0, body.color + "00"); // Transparent
    trailGradient.addColorStop(1, body.color + "60"); // 38% opacity

    ctx.strokeStyle = trailGradient;
    ctx.lineWidth = body.radius * 0.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  // Draw bodies with glow
  for (const body of bodies) {
    // Outer glow
    const glowRadius = body.radius * 3;
    const glowGradient = ctx.createRadialGradient(
      body.x, body.y, 0,
      body.x, body.y, glowRadius
    );
    glowGradient.addColorStop(0, body.color + "80");
    glowGradient.addColorStop(0.5, body.color + "20");
    glowGradient.addColorStop(1, body.color + "00");

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(body.x, body.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Core body
    ctx.fillStyle = body.color;
    ctx.beginPath();
    ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(
      body.x - body.radius * 0.3,
      body.y - body.radius * 0.3,
      body.radius * 0.3,
      0, Math.PI * 2
    );
    ctx.fill();
  }

  // Central star extra glow
  const star = bodies[0];
  const starGlow = ctx.createRadialGradient(
    star.x, star.y, 0,
    star.x, star.y, star.radius * 6
  );
  starGlow.addColorStop(0, star.color + "40");
  starGlow.addColorStop(0.5, star.color + "10");
  starGlow.addColorStop(1, star.color + "00");
  ctx.fillStyle = starGlow;
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.radius * 6, 0, Math.PI * 2);
  ctx.fill();
}

// Backward compatibility: ArtGenerator interface
export const celestialMechanics: ArtGenerator = {
  id: "celestial-mechanics",
  name: "Celestial Mechanics",
  category: "geometric",
  render: (ctx, params, time) => renderCelestialMechanics(ctx, params as CelestialMechanicsParams, time),
  defaultParams: celestialMechanicsDefaultParams,
};

export default celestialMechanics;
