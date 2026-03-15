import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
  hexToRgb,
} from "./core";

// Color palettes for the breathing mandala
const PALETTES = [
  { // Sunset
    bg: "#0a0a0f",
    primary: ["#ff6b6b", "#feca57", "#ff9ff3", "#54a0ff"],
    secondary: ["#ff8a80", "#ffd54f", "#ce93d8", "#81d4fa"],
    accent: "#ff6b6b"
  },
  { // Ocean
    bg: "#0a0f14",
    primary: ["#00d2d3", "#01a3a4", "#54a0ff", "#5f27cd"],
    secondary: ["#48dbfb", "#0abde3", "#74b9ff", "#a29bfe"],
    accent: "#00d2d3"
  },
  { // Forest
    bg: "#0a0f0a",
    primary: ["#1dd1a1", "#10ac84", "#00d2d3", "#5f27cd"],
    secondary: ["#55efc4", "#26de81", "#81ecec", "#74b9ff"],
    accent: "#1dd1a1"
  },
  { // Warm Earth
    bg: "#0f0a0a",
    primary: ["#e17055", "#fdcb6e", "#e84393", "#6c5ce7"],
    secondary: ["#fab1a0", "#ffeaa7", "#fd79a8", "#a29bfe"],
    accent: "#e17055"
  },
  { // Cosmic
    bg: "#0a0a14",
    primary: ["#a29bfe", "#6c5ce7", "#fd79a8", "#fdcb6e"],
    secondary: ["#dfe6e9", "#b2bec3", "#81ecec", "#fab1a0"],
    accent: "#a29bfe"
  }
];

// Convert hex to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// Mandala layer class
class MandalaLayer {
  radius: number;
  petals: number;
  speed: number;
  offset: number;
  rotation: number;
  pulseOffset: number;

  constructor(radius: number, petals: number, speed: number, offset: number, rng: SeededRandom) {
    this.radius = radius;
    this.petals = petals;
    this.speed = speed;
    this.offset = offset;
    this.rotation = rng.random() * Math.PI * 2;
    this.pulseOffset = rng.random() * Math.PI * 2;
  }

  update(breath: number, time: number): void {
    this.rotation += this.speed * (0.5 + breath * 0.5);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    breath: number,
    palette: typeof PALETTES[0]
  ): void {
    const pulse = 1 + Math.sin(breath * Math.PI * 2 + this.pulseOffset) * 0.15;
    const currentRadius = this.radius * (0.85 + breath * 0.3) * pulse;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.rotation);

    // Draw petals
    for (let i = 0; i < this.petals; i++) {
      const angle = (i / this.petals) * Math.PI * 2;
      const colorIndex = i % palette.primary.length;
      const alpha = 0.3 + breath * 0.4;

      ctx.save();
      ctx.rotate(angle);

      // Petal shape
      const petalLength = currentRadius * (0.6 + Math.sin(breath * Math.PI) * 0.2);
      const petalWidth = currentRadius * 0.15 * (0.8 + breath * 0.4);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(petalWidth, petalLength * 0.5, 0, petalLength);
      ctx.quadraticCurveTo(-petalWidth, petalLength * 0.5, 0, 0);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petalLength);
      gradient.addColorStop(0, hexToRgba(palette.primary[colorIndex], alpha * 0.5));
      gradient.addColorStop(0.5, hexToRgba(palette.secondary[colorIndex], alpha * 0.3));
      gradient.addColorStop(1, hexToRgba(palette.primary[colorIndex], 0));

      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner glow line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, petalLength * 0.8);
      ctx.strokeStyle = hexToRgba(palette.accent, alpha * 0.6);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // Draw connecting ring
    ctx.beginPath();
    ctx.arc(0, 0, currentRadius * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(palette.accent, 0.2 + breath * 0.2);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

// Floating particle class
class FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  colorIndex: number;
  cx: number;
  cy: number;
  sizeCanvas: number;

  constructor(cx: number, cy: number, sizeCanvas: number, rng: SeededRandom) {
    this.cx = cx;
    this.cy = cy;
    this.sizeCanvas = sizeCanvas;
    this.reset(rng);
  }

  reset(rng: SeededRandom): void {
    const angle = rng.random() * Math.PI * 2;
    const dist = 50 + rng.random() * (this.sizeCanvas * 0.35);
    this.x = this.cx + Math.cos(angle) * dist;
    this.y = this.cy + Math.sin(angle) * dist;
    this.vx = (rng.random() - 0.5) * 0.3;
    this.vy = (rng.random() - 0.5) * 0.3;
    this.life = rng.random() * 200 + 100;
    this.maxLife = this.life;
    this.size = rng.random() * 2 + 0.5;
    this.colorIndex = Math.floor(rng.random() * 4);
  }

  update(breath: number, rng: SeededRandom): void {
    const dx = this.x - this.cx;
    const dy = this.y - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Gentle orbital drift
    const angle = Math.atan2(dy, dx);
    const drift = breath * 0.02;
    this.vx += Math.cos(angle + Math.PI / 2) * drift;
    this.vy += Math.sin(angle + Math.PI / 2) * drift;

    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    if (this.life <= 0 || dist > this.sizeCanvas * 0.45) {
      this.reset(rng);
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    breath: number,
    palette: typeof PALETTES[0]
  ): void {
    const alpha = (this.life / this.maxLife) * (0.3 + breath * 0.4);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * (0.8 + breath * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.primary[this.colorIndex % palette.primary.length], alpha);
    ctx.fill();
  }
}

export const breathingMandala: ArtGenerator = {
  name: "Breathing Mandala",
  description: "Meditative mandala synchronized with a 4-second breath cycle — inhale as it expands, exhale as it contracts",
  params: {
    palette: {
      name: "Color Palette",
      type: "select",
      options: ["sunset", "ocean", "forest", "warm_earth", "cosmic"],
      default: "ocean",
    },
    breathSpeed: {
      name: "Breath Speed",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
    },
    layers: {
      name: "Layers",
      type: "range",
      min: 3,
      max: 7,
      step: 1,
      default: 5,
    },
    particles: {
      name: "Particles",
      type: "range",
      min: 0,
      max: 80,
      step: 10,
      default: 40,
    },
    showSacredGeometry: {
      name: "Sacred Geometry",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 1,
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const paletteName = params.palette as string;
    const breathSpeedMult = params.breathSpeed as number;
    const numLayers = params.layers as number;
    const numParticles = params.particles as number;
    const showSacred = params.showSacredGeometry as number;
    const seed = params.seed as number;

    const rng = new SeededRandom(seed);
    const palette = PALETTES[["sunset", "ocean", "forest", "warm_earth", "cosmic"].indexOf(paletteName) || 1];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height);

    // Breath cycle: 4 seconds = ~240 frames at 60fps
    const breathCycle = (time * breathSpeedMult * 0.008) % 1;
    const breath = (Math.sin(breathCycle * Math.PI * 2 - Math.PI / 2) + 1) / 2;

    // Clear with palette background
    fillCanvas(ctx, palette.bg, canvas.width, canvas.height);

    // Draw outer glow
    const glowRadius = size * 0.42 * (0.9 + breath * 0.2);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    glow.addColorStop(0, hexToRgba(palette.accent, 0.05));
    glow.addColorStop(0.5, hexToRgba(palette.accent, 0.02));
    glow.addColorStop(1, hexToRgba(palette.bg, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create and draw mandala layers
    const layerConfigs = [
      { radius: size * 0.38, petals: 24, speed: 0.001 },
      { radius: size * 0.30, petals: 16, speed: -0.0015 },
      { radius: size * 0.22, petals: 12, speed: 0.002 },
      { radius: size * 0.15, petals: 8, speed: -0.0025 },
      { radius: size * 0.08, petals: 6, speed: 0.003 },
      { radius: size * 0.04, petals: 4, speed: -0.004 },
      { radius: size * 0.02, petals: 3, speed: 0.005 },
    ].slice(0, numLayers);

    const layers = layerConfigs.map((config, i) =>
      new MandalaLayer(config.radius, config.petals, config.speed, i * Math.PI / 5, rng)
    );

    // Draw center core
    const coreRadius = size * 0.06 * (0.8 + breath * 0.4);
    const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
    coreGradient.addColorStop(0, hexToRgba(palette.accent, 0.8));
    coreGradient.addColorStop(0.5, hexToRgba(palette.accent, 0.3));
    coreGradient.addColorStop(1, hexToRgba(palette.accent, 0));
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw mandala layers (outside to inside)
    layers.forEach(layer => {
      layer.update(breath, time);
      layer.draw(ctx, cx, cy, breath, palette);
    });

    // Create and draw floating particles
    if (numParticles > 0) {
      // Use seeded positions based on time for deterministic animation
      const particleSeed = new SeededRandom(seed + Math.floor(time / 300));
      const particles: FloatingParticle[] = [];

      for (let i = 0; i < numParticles; i++) {
        particles.push(new FloatingParticle(cx, cy, size, particleSeed));
      }

      particles.forEach(p => {
        p.update(breath, particleSeed);
        p.draw(ctx, breath, palette);
      });
    }

    // Draw sacred geometry overlay (subtle)
    if (showSacred) {
      ctx.save();
      ctx.translate(cx, cy);

      const rotation = time * 0.0005;
      ctx.rotate(rotation);

      const seedRadius = size * 0.12 * (1 + breath * 0.1);
      const alpha = 0.05 + breath * 0.1;

      ctx.strokeStyle = hexToRgba(palette.accent, alpha);
      ctx.lineWidth = 1;

      // Central circle
      ctx.beginPath();
      ctx.arc(0, 0, seedRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Surrounding circles (seed of life)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const sx = Math.cos(angle) * seedRadius;
        const sy = Math.sin(angle) * seedRadius;
        ctx.beginPath();
        ctx.arc(sx, sy, seedRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  },
  meta: {
    category: "geometric",
    complexity: "moderate",
    tags: ["animated", "colorful", "geometric", "ordered", "minimal"],
    created: "2026-03-15",
  },
};
