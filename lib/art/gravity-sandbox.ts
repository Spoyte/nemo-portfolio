import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface GravitySandboxParams {
  // Simulation parameters
  gravity: number;        // 0.1-5: Gravitational constant
  trailLength: number;    // 10-100: Particle trail fade
  timeScale: number;      // 0.1-2: Simulation speed
  particleCount: number;  // 5-50: Initial particles
  // Visual parameters
  colorScheme: "cosmic" | "neon" | "aurora" | "fire" | "ocean";
  showTrails: boolean;
  showConnections: boolean;
  animated: boolean;
}

export const gravitySandboxDefaultParams: GravitySandboxParams = {
  gravity: 1,
  trailLength: 30,
  timeScale: 1,
  particleCount: 8,
  colorScheme: "cosmic",
  showTrails: true,
  showConnections: false,
  animated: true,
};

// Particle with mass, position, velocity
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  id: number;
}

// Persistent simulation state
let particles: Particle[] = [];
let nextId = 0;
let initialized = false;

// Color palettes
const palettes: Record<string, string[]> = {
  cosmic: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"],
  neon: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFB4"],
  aurora: ["#00FF87", "#60EFFF", "#00D9FF", "#0099CC", "#0066AA", "#5D3FD3"],
  fire: ["#FF4500", "#FF6347", "#FF8C00", "#FFA500", "#FFD700", "#FF6B35"],
  ocean: ["#006994", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF", "#CAF0F8"],
};

function createParticle(x: number, y: number, mass: number, color: string): Particle {
  // Give random initial velocity for orbital motion
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.sqrt(mass) * 0.5 + Math.random() * 0.5;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    mass,
    radius: Math.sqrt(mass) * 3 + 2,
    color,
    id: nextId++,
  };
}

function initializeParticles(width: number, height: number, count: number, scheme: string): void {
  particles = [];
  nextId = 0;
  const colors = palettes[scheme] || palettes.cosmic;
  const centerX = width / 2;
  const centerY = height / 2;

  // Create central massive body (sun)
  const sun = createParticle(centerX, centerY, 50, "#FFD700");
  sun.vx = 0;
  sun.vy = 0;
  particles.push(sun);

  // Create orbiting bodies
  for (let i = 0; i < count - 1; i++) {
    const angle = (i / (count - 1)) * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Calculate orbital velocity for circular orbit: v = sqrt(GM/r)
    const orbitalSpeed = Math.sqrt(50 / distance) * 2;
    const particle = createParticle(x, y, 5 + Math.random() * 15, colors[i % colors.length]);
    
    // Perpendicular velocity for orbit
    particle.vx = -Math.sin(angle) * orbitalSpeed;
    particle.vy = Math.cos(angle) * orbitalSpeed;
    
    particles.push(particle);
  }
}

function updatePhysics(width: number, height: number, dt: number, G: number): void {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Calculate gravitational forces
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    let fx = 0;
    let fy = 0;
    
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const p2 = particles[j];
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      // Softening parameter to prevent singularities
      const softening = 20;
      const force = (G * p1.mass * p2.mass) / (distSq + softening * softening);
      
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }
    
    // Update velocity (F = ma, so a = F/m)
    p1.vx += (fx / p1.mass) * dt;
    p1.vy += (fy / p1.mass) * dt;
  }
  
  // Update positions
  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    
    // Soft boundary - gentle pull back to center if too far
    const dx = p.x - centerX;
    const dy = p.y - centerY;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.min(width, height) * 0.6;
    
    if (distFromCenter > maxDist) {
      const pullStrength = 0.001;
      p.vx -= dx * pullStrength;
      p.vy -= dy * pullStrength;
    }
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, showGlow: boolean): void {
  // Glow effect
  if (showGlow) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
    gradient.addColorStop(0, p.color + "80"); // 50% opacity
    gradient.addColorStop(0.5, p.color + "20"); // 12% opacity
    gradient.addColorStop(1, p.color + "00"); // 0% opacity
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Core
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
  
  // Highlight
  ctx.beginPath();
  ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fill();
}

function drawConnections(ctx: CanvasRenderingContext2D, threshold: number): void {
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < threshold) {
        const opacity = 1 - dist / threshold;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

export function renderGravitySandbox(
  ctx: CanvasRenderingContext2D,
  params: Partial<GravitySandboxParams> = {},
  time: number = 0
): void {
  const config = { ...gravitySandboxDefaultParams, ...params };
  const { width, height } = ctx.canvas;

  // Initialize on first render
  if (!initialized || particles.length === 0) {
    initializeParticles(width, height, config.particleCount, config.colorScheme);
    initialized = true;
  }

  // Trail effect: fade the canvas instead of clearing
  if (config.showTrails) {
    const fadeAmount = Math.max(0.05, 1 - config.trailLength / 100);
    ctx.fillStyle = `rgba(10, 10, 15, ${fadeAmount})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, width, height);
  }

  // Physics update (only when animated)
  if (config.animated) {
    const dt = 0.5 * config.timeScale;
    updatePhysics(width, height, dt, config.gravity * 0.5);
  }

  // Draw connections between nearby particles
  if (config.showConnections) {
    drawConnections(ctx, 150);
  }

  // Draw particles
  for (const p of particles) {
    drawParticle(ctx, p, true);
  }

  // Draw UI hint
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${particles.length} bodies • G=${config.gravity.toFixed(1)}`, width / 2, height - 20);
}

// Reset function for interactive use
export function resetGravitySandbox(): void {
  initialized = false;
  particles = [];
}

// Add a particle at position (for interactive use)
export function addParticleAt(x: number, y: number, mass: number, scheme: string): void {
  const colors = palettes[scheme] || palettes.cosmic;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const particle = createParticle(x, y, mass, color);
  
  // Give it some initial orbital velocity around center
  const centerX = 200; // Assuming 400x400 canvas
  const centerY = 200;
  const dx = x - centerX;
  const dy = y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist > 10) {
    const orbitalSpeed = Math.sqrt(50 / dist) * 1.5;
    particle.vx = -dy / dist * orbitalSpeed;
    particle.vy = dx / dist * orbitalSpeed;
  }
  
  particles.push(particle);
}

// Backward compatibility: ArtGenerator interface
export const gravitySandbox: ArtGenerator = {
  id: "gravity-sandbox",
  name: "Gravity Sandbox",
  category: "interactive",
  render: (ctx, params, time) => renderGravitySandbox(ctx, params as GravitySandboxParams, time),
  defaultParams: gravitySandboxDefaultParams,
};

export default gravitySandbox;
