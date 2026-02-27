import { ArtGenerator } from "./core";

export interface KaleidoscopeChamberParams {
  segments: number;
  rotationSpeed: number;
  reflectionDepth: number;
  patternComplexity: number;
  colorScheme: "rainbow" | "gold" | "ocean" | "sunset" | "monochrome" | "neon";
  mirrorCount: number;
  particleCount: number;
  symmetryMode: "radial" | "bilateral" | "triangular" | "hexagonal";
}

export const kaleidoscopeChamberDefaultParams: KaleidoscopeChamberParams = {
  segments: 8,
  rotationSpeed: 0.5,
  reflectionDepth: 3,
  patternComplexity: 5,
  colorScheme: "rainbow",
  mirrorCount: 6,
  particleCount: 50,
  symmetryMode: "radial",
};

// Color palettes
const colorSchemes: Record<string, string[]> = {
  rainbow: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFA5"],
  gold: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B", "#F4A460"],
  ocean: ["#0077BE", "#0099CC", "#00BBDD", "#00DDEE", "#00FFFF", "#40E0D0"],
  sunset: ["#FF6B6B", "#FF8E53", "#FE6B8B", "#FF8E53", "#C44569", "#F8B500"],
  monochrome: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080", "#606060"],
  neon: ["#FF00FF", "#00FFFF", "#FF0099", "#99FF00", "#9900FF", "#FF9900"],
};

// Get color from scheme
function getColor(scheme: string, index: number, alpha = 1): string {
  const colors = colorSchemes[scheme] || colorSchemes.rainbow;
  const color = colors[index % colors.length];
  if (alpha < 1) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

// Particle class for floating elements
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  angle: number;
  angularVelocity: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 8 + 4;
    this.color = color;
    this.life = 1;
    this.maxLife = 1;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.1;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.angularVelocity;

    // Bounce off walls
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Keep in bounds
    this.x = Math.max(0, Math.min(width, this.x));
    this.y = Math.max(0, Math.min(height, this.y));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life * 0.8;

    // Draw geometric shape
    ctx.beginPath();
    const sides = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const px = Math.cos(angle) * this.size;
      const py = Math.sin(angle) * this.size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Mirror line class
class Mirror {
  angle: number;
  length: number;
  x: number;
  y: number;

  constructor(angle: number, radius: number, cx: number, cy: number) {
    this.angle = angle;
    this.length = radius * 0.8;
    this.x = cx + Math.cos(angle) * radius * 0.3;
    this.y = cy + Math.sin(angle) * radius * 0.3;
  }

  draw(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number) {
    const endX = this.x + Math.cos(this.angle + time * 0.001) * this.length;
    const endY = this.y + Math.sin(this.angle + time * 0.001) * this.length;

    // Mirror surface with gradient
    const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
    gradient.addColorStop(0, "rgba(200, 220, 255, 0.3)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(1, "rgba(200, 220, 255, 0.3)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Mirror glow
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 8;
    ctx.stroke();
  }
}

// Draw a single segment of the kaleidoscope
function drawSegment(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  segmentAngle: number,
  segmentIndex: number,
  params: KaleidoscopeChamberParams,
  time: number,
  particles: Particle[]
) {
  ctx.save();

  // Clip to segment wedge
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, segmentAngle, segmentAngle + (Math.PI * 2) / params.segments);
  ctx.closePath();
  ctx.clip();

  // Draw base pattern
  const colors = colorSchemes[params.colorScheme];
  const baseColor = colors[segmentIndex % colors.length];

  // Background gradient for segment
  const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  bgGradient.addColorStop(0, getColor(params.colorScheme, segmentIndex, 0.1));
  bgGradient.addColorStop(0.5, getColor(params.colorScheme, segmentIndex + 2, 0.05));
  bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
  ctx.fillStyle = bgGradient;
  ctx.fill();

  // Draw geometric patterns based on complexity
  for (let i = 0; i < params.patternComplexity; i++) {
    const layerRadius = (radius / params.patternComplexity) * (i + 1);
    const rotation = time * 0.001 * params.rotationSpeed * (i % 2 === 0 ? 1 : -1);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation + segmentIndex * 0.3);

    const color = getColor(params.colorScheme, segmentIndex + i, 0.6 - i * 0.1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 - i * 0.2;

    // Draw different shapes based on symmetry mode
    switch (params.symmetryMode) {
      case "radial":
        drawRadialPattern(ctx, layerRadius, i, params.segments);
        break;
      case "bilateral":
        drawBilateralPattern(ctx, layerRadius, i);
        break;
      case "triangular":
        drawTriangularPattern(ctx, layerRadius, i);
        break;
      case "hexagonal":
        drawHexagonalPattern(ctx, layerRadius, i);
        break;
    }

    ctx.restore();
  }

  // Draw reflected particles
  particles.forEach((particle, idx) => {
    if (idx % params.segments === segmentIndex) {
      const reflectedX = cx + (particle.x - cx) * Math.cos(segmentAngle) - (particle.y - cy) * Math.sin(segmentAngle);
      const reflectedY = cy + (particle.x - cx) * Math.sin(segmentAngle) + (particle.y - cy) * Math.cos(segmentAngle);

      ctx.save();
      ctx.translate(reflectedX, reflectedY);
      ctx.rotate(particle.angle + segmentAngle);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life * 0.6;

      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  ctx.restore();
}

function drawRadialPattern(ctx: CanvasRenderingContext2D, radius: number, layer: number, segments: number) {
  // Concentric circles with spokes
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Spokes
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  }

  // Inner decorative elements
  const innerRadius = radius * 0.7;
  ctx.beginPath();
  for (let i = 0; i < segments * 2; i++) {
    const angle = (i / (segments * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? innerRadius : innerRadius * 0.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawBilateralPattern(ctx: CanvasRenderingContext2D, radius: number, layer: number) {
  // Symmetrical patterns
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.moveTo(0, -radius);
  ctx.lineTo(0, radius);
  ctx.stroke();

  // Curved elements
  ctx.beginPath();
  ctx.arc(radius * 0.5, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-radius * 0.5, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTriangularPattern(ctx: CanvasRenderingContext2D, radius: number, layer: number) {
  // Triangle-based patterns
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    ctx.beginPath();
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Nested triangles
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(angle) * radius * 0.5;
    const y = Math.sin(angle) * radius * 0.5;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawHexagonalPattern(ctx: CanvasRenderingContext2D, radius: number, layer: number) {
  // Hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner hexagon
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 12;
    const x = Math.cos(angle) * radius * 0.6;
    const y = Math.sin(angle) * radius * 0.6;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Connecting lines
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  }
}

// Main render function
export function renderKaleidoscopeChamber(
  ctx: CanvasRenderingContext2D,
  params: KaleidoscopeChamberParams,
  time: number,
  particles: Particle[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;

  // Clear with fade effect for trails
  ctx.fillStyle = "rgba(10, 10, 20, 0.15)";
  ctx.fillRect(0, 0, width, height);

  // Update and draw particles
  particles.forEach((p) => {
    p.update(width, height);
  });

  // Draw outer glow
  const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.2);
  outerGlow.addColorStop(0, getColor(params.colorScheme, 0, 0.1));
  outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = outerGlow;
  ctx.fillRect(0, 0, width, height);

  // Draw kaleidoscope segments
  const segmentAngle = (Math.PI * 2) / params.segments;
  for (let i = 0; i < params.segments; i++) {
    const angle = i * segmentAngle + time * 0.0005 * params.rotationSpeed;
    drawSegment(ctx, cx, cy, radius, angle, i, params, time, particles);
  }

  // Draw center ornament
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.001 * params.rotationSpeed);

  const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.15);
  centerGradient.addColorStop(0, "#FFFFFF");
  centerGradient.addColorStop(0.5, getColor(params.colorScheme, 0, 0.8));
  centerGradient.addColorStop(1, getColor(params.colorScheme, 2, 0.3));

  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Center decorative pattern
  ctx.strokeStyle = getColor(params.colorScheme, 1, 0.9);
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius * 0.1, Math.sin(angle) * radius * 0.1);
    ctx.stroke();
  }

  ctx.restore();

  // Draw mirror frame
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.0002);

  const frameGradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
  frameGradient.addColorStop(0, getColor(params.colorScheme, 0, 0.3));
  frameGradient.addColorStop(0.5, getColor(params.colorScheme, 3, 0.5));
  frameGradient.addColorStop(1, getColor(params.colorScheme, 0, 0.3));

  ctx.strokeStyle = frameGradient;
  ctx.lineWidth = 4;

  // Outer decorative ring
  for (let i = 0; i < params.mirrorCount; i++) {
    const angle = (i / params.mirrorCount) * Math.PI * 2;
    const nextAngle = ((i + 1) / params.mirrorCount) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, nextAngle);
    ctx.stroke();

    // Decorative nodes
    const nodeX = Math.cos(angle) * radius;
    const nodeY = Math.sin(angle) * radius;

    ctx.fillStyle = getColor(params.colorScheme, i);
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Glow around nodes
    ctx.fillStyle = getColor(params.colorScheme, i, 0.3);
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Generator definition
export const kaleidoscopeChamber: ArtGenerator = {
  name: "Kaleidoscope Chamber",
  description: "A mesmerizing mirror chamber where light and geometry create infinite reflections. Multiple mirrors arranged in a radial pattern reflect floating geometric particles, creating ever-changing symmetrical patterns.",
  params: {
    segments: {
      name: "Mirror Segments",
      type: "range",
      min: 3,
      max: 16,
      step: 1,
      default: 8,
    },
    rotationSpeed: {
      name: "Rotation Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 0.5,
    },
    reflectionDepth: {
      name: "Reflection Depth",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
    },
    patternComplexity: {
      name: "Pattern Complexity",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["rainbow", "gold", "ocean", "sunset", "monochrome", "neon"],
      default: "rainbow",
    },
    mirrorCount: {
      name: "Mirror Count",
      type: "range",
      min: 3,
      max: 12,
      step: 1,
      default: 6,
    },
    particleCount: {
      name: "Particles",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    symmetryMode: {
      name: "Symmetry Mode",
      type: "select",
      options: ["radial", "bilateral", "triangular", "hexagonal"],
      default: "radial",
    },
  },
  generate: (ctx, params, timestamp = 0) => {
    const p = { ...kaleidoscopeChamberDefaultParams, ...params } as KaleidoscopeChamberParams;

    // Initialize or get particles from canvas data
    let particles: Particle[] = (ctx.canvas as any).__kaleidoscopeParticles;
    if (!particles || particles.length !== p.particleCount) {
      const colors = colorSchemes[p.colorScheme];
      particles = [];
      for (let i = 0; i < p.particleCount; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        particles.push(new Particle(x, y, colors[i % colors.length]));
      }
      (ctx.canvas as any).__kaleidoscopeParticles = particles;
    }

    // Update particle colors if scheme changed
    const colors = colorSchemes[p.colorScheme];
    particles.forEach((particle, i) => {
      particle.color = colors[i % colors.length];
    });

    renderKaleidoscopeChamber(ctx, p, timestamp, particles);
  },
};
