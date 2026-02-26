import { ArtGenerator, ArtParams, ParamConfig, fillCanvas } from "./core";

export interface CymaticsParams extends ArtParams {
  frequency: number;
  amplitude: number;
  particleCount: number;
  mode: string;
  colorScheme: string;
  viscosity: number;
  resonance: number;
  showNodes: number;
}

export const cymaticsDefaultParams: CymaticsParams = {
  frequency: 440,
  amplitude: 50,
  particleCount: 3000,
  mode: "radial",
  colorScheme: "aurora",
  viscosity: 0.5,
  resonance: 1.2,
  showNodes: 1,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  energy: number;
}

function createParticles(count: number, width: number, height: number, mode: string): Particle[] {
  const particles: Particle[] = [];
  const cx = width / 2;
  const cy = height / 2;
  
  for (let i = 0; i < count; i++) {
    let x, y;
    
    if (mode === "radial") {
      // Distribute in circular pattern
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.45;
      x = cx + Math.cos(angle) * radius;
      y = cy + Math.sin(angle) * radius;
    } else if (mode === "grid") {
      // Grid distribution
      const cols = Math.ceil(Math.sqrt(count * width / height));
      const rows = Math.ceil(count / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      x = (col + 0.5) * width / cols;
      y = (row + 0.5) * height / rows;
    } else if (mode === "random") {
      // Pure random with margin
      x = Math.random() * (width - 40) + 20;
      y = Math.random() * (height - 40) + 20;
    } else {
      // Spiral distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const r = Math.sqrt(i / count) * Math.min(width, height) * 0.45;
      const theta = i * goldenAngle;
      x = cx + r * Math.cos(theta);
      y = cy + r * Math.sin(theta);
    }
    
    particles.push({
      x, y,
      vx: 0, vy: 0,
      baseX: x, baseY: y,
      energy: 0,
    });
  }
  
  return particles;
}

// Calculate wave displacement at point (x, y) given frequency and time
function calculateDisplacement(
  x: number, y: number,
  cx: number, cy: number,
  freq: number,
  time: number,
  mode: string,
  resonance: number
): { dx: number; dy: number; intensity: number } {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  // Normalize frequency to visual scale
  const k = freq / 100;
  
  let displacement = 0;
  
  if (mode === "radial") {
    // Circular standing waves
    const wave1 = Math.sin(k * dist - time * 2);
    const wave2 = Math.sin(k * dist + time * 2);
    displacement = (wave1 + wave2) * 0.5;
  } else if (mode === "bessel") {
    // Bessel function approximation for drum modes
    const r = k * dist * 0.1;
    const j0 = Math.cos(r) / Math.sqrt(r + 0.1); // Approximation of J0
    const angular = Math.cos(3 * angle + time);
    displacement = j0 * angular;
  } else if (mode === "interference") {
    // Two-source interference pattern
    const d1 = Math.sqrt((x - cx + 100) ** 2 + (y - cy) ** 2);
    const d2 = Math.sqrt((x - cx - 100) ** 2 + (y - cy) ** 2);
    const wave1 = Math.sin(k * d1 - time * 2);
    const wave2 = Math.sin(k * d2 - time * 2);
    displacement = (wave1 + wave2) * 0.5;
  } else if (mode === "spiral") {
    // Spiral wave
    const spiral = Math.sin(k * dist - 3 * angle + time * 2);
    displacement = spiral;
  } else {
    // Mandala pattern - multiple harmonics
    const harmonic1 = Math.sin(k * dist * 0.5 + time);
    const harmonic2 = Math.sin(6 * angle + time * 0.5) * 0.3;
    const harmonic3 = Math.cos(k * dist * 0.3 - time * 0.7) * 0.5;
    displacement = (harmonic1 + harmonic2 + harmonic3) / 1.8;
  }
  
  // Calculate gradient for displacement direction
  const intensity = Math.abs(displacement);
  const displaceX = Math.cos(angle) * displacement * resonance;
  const displaceY = Math.sin(angle) * displacement * resonance;
  
  return { dx: displaceX, dy: displaceY, intensity };
}

function getColor(intensity: number, scheme: string, time: number): string {
  const t = (intensity + 1) * 0.5; // Normalize to 0-1
  
  switch (scheme) {
    case "aurora": {
      // Shifting aurora colors
      const hue = (140 + t * 120 + time * 10) % 360;
      const sat = 60 + t * 40;
      const light = 30 + t * 50;
      return `hsla(${hue}, ${sat}%, ${light}%, ${0.3 + t * 0.7})`;
    }
    case "plasma": {
      // Hot plasma
      const hue = (280 + t * 80 - time * 15) % 360;
      const sat = 80 + t * 20;
      const light = 40 + t * 40;
      return `hsla(${hue}, ${sat}%, ${light}%, ${0.4 + t * 0.6})`;
    }
    case "gold": {
      // Liquid gold
      const hue = 35 + t * 25;
      const sat = 70 + t * 30;
      const light = 40 + t * 45;
      return `hsla(${hue}, ${sat}%, ${light}%, ${0.3 + t * 0.7})`;
    }
    case "deep": {
      // Deep ocean
      const hue = (200 + t * 60 + time * 5) % 360;
      const sat = 50 + t * 50;
      const light = 20 + t * 40;
      return `hsla(${hue}, ${sat}%, ${light}%, ${0.4 + t * 0.6})`;
    }
    case "monochrome": {
      // Silver liquid
      const light = 20 + t * 70;
      return `hsla(0, 0%, ${light}%, ${0.3 + t * 0.7})`;
    }
    default: {
      const hue = (time * 20 + t * 60) % 360;
      return `hsla(${hue}, 70%, ${30 + t * 40}%, ${0.4 + t * 0.6})`;
    }
  }
}

function drawNodeLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freq: number,
  time: number,
  mode: string
) {
  const cx = width / 2;
  const cy = height / 2;
  const k = freq / 100;
  
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  
  // Draw nodal lines where displacement is near zero
  const step = 8;
  ctx.beginPath();
  
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const { intensity } = calculateDisplacement(x, y, cx, cy, freq, time, mode, 1);
      
      if (intensity < 0.15) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
      }
    }
  }
  
  ctx.stroke();
}

export function renderCymatics(
  ctx: CanvasRenderingContext2D,
  params: CymaticsParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  
  const {
    frequency,
    amplitude,
    particleCount,
    mode,
    colorScheme,
    viscosity,
    resonance,
    showNodes,
  } = params;
  
  // Initialize or retrieve particles
  const key = `cymatics_particles_${mode}`;
  let particles: Particle[] = (ctx.canvas as any)[key];
  if (!particles || particles.length !== particleCount) {
    particles = createParticles(particleCount, width, height, mode);
    (ctx.canvas as any)[key] = particles;
  }
  
  // Fade background for trails
  const bgAlpha = 0.15 + (1 - viscosity) * 0.25;
  ctx.fillStyle = `rgba(5, 5, 10, ${bgAlpha})`;
  ctx.fillRect(0, 0, width, height);
  
  // Draw nodal lines if enabled
  if (showNodes > 0.5) {
    drawNodeLines(ctx, width, height, frequency, time, mode);
  }
  
  // Update and draw particles
  const viscFactor = viscosity * 0.1;
  
  for (const p of particles) {
    // Calculate wave displacement
    const { dx, dy, intensity } = calculateDisplacement(
      p.baseX, p.baseY, cx, cy, frequency, time, mode, resonance
    );
    
    // Target position
    const targetX = p.baseX + dx * amplitude;
    const targetY = p.baseY + dy * amplitude;
    
    // Spring physics toward target
    const ax = (targetX - p.x) * 0.1;
    const ay = (targetY - p.y) * 0.1;
    
    p.vx += ax;
    p.vy += ay;
    p.vx *= (1 - viscFactor);
    p.vy *= (1 - viscFactor);
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Update energy for coloring
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    p.energy = p.energy * 0.9 + speed * 0.1;
    
    // Draw particle
    const color = getColor(intensity + p.energy * 0.1, colorScheme, time);
    const size = 1.5 + intensity * 2 + p.energy * 0.5;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add glow effect by drawing larger, transparent circles
  ctx.globalCompositeOperation = "screen";
  for (const p of particles) {
    if (Math.random() > 0.7) continue; // Only some particles get glow
    
    const { dx, dy, intensity } = calculateDisplacement(
      p.baseX, p.baseY, cx, cy, frequency, time, mode, resonance
    );
    
    const color = getColor(intensity, colorScheme, time);
    const size = 4 + intensity * 6;
    
    ctx.fillStyle = color.replace(/[\d.]+%?\)$/, '0.15)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  
  // Draw frequency indicator
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = "12px monospace";
  ctx.fillText(`${Math.round(frequency)} Hz`, 15, height - 15);
}

export const cymatics: ArtGenerator = {
  name: "Cymatics",
  description: "Visualize sound frequencies as fluid particle patterns. Particles respond to simulated standing waves, creating mesmerizing cymatic patterns similar to vibrating liquid surfaces.",
  params: {
    frequency: {
      name: "Frequency",
      type: "range",
      min: 80,
      max: 880,
      step: 10,
      default: 440,
    },
    amplitude: {
      name: "Amplitude",
      type: "range",
      min: 10,
      max: 150,
      step: 5,
      default: 50,
    },
    particleCount: {
      name: "Particles",
      type: "range",
      min: 500,
      max: 8000,
      step: 500,
      default: 3000,
    },
    mode: {
      name: "Wave Mode",
      type: "select",
      options: ["radial", "bessel", "interference", "spiral", "mandala"],
      default: "radial",
    },
    colorScheme: {
      name: "Colors",
      type: "select",
      options: ["aurora", "plasma", "gold", "deep", "monochrome"],
      default: "aurora",
    },
    viscosity: {
      name: "Viscosity",
      type: "range",
      min: 0.1,
      max: 0.95,
      step: 0.05,
      default: 0.5,
    },
    resonance: {
      name: "Resonance",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1.2,
    },
    showNodes: {
      name: "Show Nodes",
      type: "range",
      min: 0,
      max: 1,
      step: 1,
      default: 1,
    },
  },
  generate: renderCymatics,
  meta: {
    category: "physics",
    complexity: "moderate",
    tags: ["animated", "colorful", "organic", "chaotic"],
    created: "2026-02-26",
  },
};
