import { ArtGenerator, ArtParams } from "./core";

// Ink Diffusion - Simulating ink drops spreading through water
// Creates organic Rorschach-like patterns with controllable chaos and symmetry
// Inspired by sumi-e painting and fluid dynamics

interface InkDiffusionParams extends ArtParams {
  symmetry: string;
  chaos: number;
  viscosity: number;
  dropCount: number;
  colorScheme: string;
  diffusionRate: number;
  turbulence: number;
  animationSpeed: number;
}

// Color schemes inspired by ink and watercolor traditions
const COLOR_SCHEMES: Record<string, string[]> = {
  sumi: ["#0a0a0a", "#1a1a1a", "#2d2d2d", "#404040", "#595959", "#737373"],
  sanguine: ["#3d1f1f", "#5c2e2e", "#7a3d3d", "#994c4c", "#b85c5c", "#d66b6b"],
  sepia: ["#2d2416", "#4a3d26", "#665536", "#826e46", "#9f8756", "#bb9f66"],
  indigo: ["#0a1628", "#142a4a", "#1e3e6c", "#28528e", "#3266b0", "#3c7ad2"],
  vermillion: ["#4a0a0a", "#7a1414", "#aa1e1e", "#da2828", "#ea5050", "#fa7878"],
  emerald: ["#0a281a", "#144a32", "#1e6c4a", "#288e62", "#32b07a", "#3cd292"],
  prussian: ["#0a1a2d", "#142e4a", "#1e426c", "#28568e", "#326ab0", "#3c7ed2"],
  multicolor: ["#1a0a2e", "#2d1a4a", "#4a2a6c", "#6c3a8e", "#8e4ab0", "#b05ad2"],
};

// Ink drop structure
interface InkDrop {
  x: number;
  y: number;
  size: number;
  age: number;
  color: string;
  intensity: number;
  vx: number;
  vy: number;
}

// Particle representing diffusing ink
interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  parentDrop: number;
}

// Persistent state for animation
interface DiffusionState {
  drops: InkDrop[];
  particles: InkParticle[];
  grid: Float32Array; // Density field for diffusion
  width: number;
  height: number;
  lastSymmetry: string;
  lastDropCount: number;
  initialized: boolean;
}

let persistentState: DiffusionState | null = null;

// Seeded random for reproducibility
function createSeededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

// Simplex-like noise for organic movement
function createNoise(seed: number): (x: number, y: number, t: number) => number {
  const random = createSeededRandom(seed);
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = Math.floor(random() * 256);
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number, t: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(t) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    t -= Math.floor(t);
    const u = fade(x);
    const v = fade(y);
    const w = fade(t);
    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;

    return lerp(
      w,
      lerp(
        v,
        lerp(u, grad(perm[AA], x, y, t), grad(perm[BA], x - 1, y, t)),
        lerp(u, grad(perm[AB], x, y - 1, t), grad(perm[BB], x - 1, y - 1, t))
      ),
      lerp(
        v,
        lerp(u, grad(perm[AA + 1], x, y, t - 1), grad(perm[BA + 1], x - 1, y, t - 1)),
        lerp(u, grad(perm[AB + 1], x, y - 1, t - 1), grad(perm[BB + 1], x - 1, y - 1, t - 1))
      )
    );
  };
}

// Initialize drops with given symmetry
function initializeDrops(
  width: number,
  height: number,
  dropCount: number,
  symmetry: string,
  seed: number,
  colors: string[]
): InkDrop[] {
  const random = createSeededRandom(seed);
  const drops: InkDrop[] = [];
  const centerX = width / 2;
  const centerY = height / 2;

  const addDrop = (x: number, y: number, colorIdx: number) => {
    drops.push({
      x,
      y,
      size: 5 + random() * 15,
      age: 0,
      color: colors[colorIdx % colors.length],
      intensity: 0.5 + random() * 0.5,
      vx: (random() - 0.5) * 2,
      vy: (random() - 0.5) * 2,
    });
  };

  for (let i = 0; i < dropCount; i++) {
    const colorIdx = Math.floor(random() * colors.length);
    
    switch (symmetry) {
      case "none":
        addDrop(random() * width, random() * height, colorIdx);
        break;
      case "horizontal":
        const y1 = random() * height;
        addDrop(random() * width, y1, colorIdx);
        addDrop(width - (random() * width), y1, colorIdx);
        break;
      case "vertical":
        const x1 = random() * width;
        addDrop(x1, random() * height, colorIdx);
        addDrop(x1, height - (random() * height), colorIdx);
        break;
      case "radial":
        const angle = random() * Math.PI * 2;
        const radius = random() * Math.min(width, height) * 0.35;
        const x2 = centerX + Math.cos(angle) * radius;
        const y2 = centerY + Math.sin(angle) * radius;
        addDrop(x2, y2, colorIdx);
        // Add 3 more drops at 90 degree intervals
        for (let r = 1; r < 4; r++) {
          const rotAngle = angle + (r * Math.PI / 2);
          addDrop(
            centerX + Math.cos(rotAngle) * radius,
            centerY + Math.sin(rotAngle) * radius,
            colorIdx
          );
        }
        break;
      case "rorschach":
        // Classic inkblot symmetry - horizontal mirror
        const rx = random() * width * 0.4;
        const ry = centerY + (random() - 0.5) * height * 0.8;
        addDrop(centerX + rx, ry, colorIdx);
        addDrop(centerX - rx, ry, colorIdx);
        break;
      case "kaleidoscope":
        // 6-fold symmetry
        const kAngle = random() * Math.PI * 2;
        const kRadius = random() * Math.min(width, height) * 0.3;
        for (let s = 0; s < 6; s++) {
          const sAngle = kAngle + (s * Math.PI / 3);
          addDrop(
            centerX + Math.cos(sAngle) * kRadius,
            centerY + Math.sin(sAngle) * kRadius,
            colorIdx
          );
        }
        break;
    }
  }

  return drops;
}

// Spawn particles from a drop
function spawnParticles(
  drop: InkDrop,
  count: number,
  turbulence: number,
  seed: number,
  dropIndex: number
): InkParticle[] {
  const random = createSeededRandom(seed + dropIndex * 1000);
  const particles: InkParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const dist = random() * drop.size;
    particles.push({
      x: drop.x + Math.cos(angle) * dist,
      y: drop.y + Math.sin(angle) * dist,
      vx: Math.cos(angle) * (0.5 + random() * turbulence),
      vy: Math.sin(angle) * (0.5 + random() * turbulence),
      life: 0,
      maxLife: 100 + random() * 200,
      color: drop.color,
      size: 1 + random() * 3,
      parentDrop: dropIndex,
    });
  }

  return particles;
}

// Update particles with fluid-like movement
function updateParticles(
  particles: InkParticle[],
  noise: (x: number, y: number, t: number) => number,
  time: number,
  viscosity: number,
  width: number,
  height: number
): void {
  for (const p of particles) {
    if (p.life >= p.maxLife) continue;

    // Apply noise-based turbulence
    const n = noise(p.x * 0.01, p.y * 0.01, time * 0.001);
    const angle = n * Math.PI * 4;
    
    p.vx += Math.cos(angle) * 0.1;
    p.vy += Math.sin(angle) * 0.1;
    
    // Apply viscosity (damping)
    p.vx *= viscosity;
    p.vy *= viscosity;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary conditions - wrap around
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    p.life++;
  }
}

// Render particles with soft edges
function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: InkParticle[],
  diffusionRate: number,
  width: number,
  height: number
): void {
  // Sort by color to minimize state changes
  const byColor: Record<string, InkParticle[]> = {};
  for (const p of particles) {
    if (p.life >= p.maxLife) continue;
    if (!byColor[p.color]) byColor[p.color] = [];
    byColor[p.color].push(p);
  }

  for (const [color, colorParticles] of Object.entries(byColor)) {
    ctx.fillStyle = color;
    
    for (const p of colorParticles) {
      const lifeRatio = p.life / p.maxLife;
      const alpha = (1 - lifeRatio) * diffusionRate;
      const size = p.size * (1 + lifeRatio * 2);
      
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.globalAlpha = 1;
}

// Render density field for smooth diffusion effect
function renderDensityField(
  ctx: CanvasRenderingContext2D,
  particles: InkParticle[],
  width: number,
  height: number,
  colors: string[]
): void {
  const gridSize = 4; // Pixel size for density grid
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  // Accumulate density per color
  const density: Record<string, Float32Array> = {};
  for (const color of colors) {
    density[color] = new Float32Array(cols * rows);
  }
  
  // Accumulate particle influence
  for (const p of particles) {
    if (p.life >= p.maxLife) continue;
    
    const gx = Math.floor(p.x / gridSize);
    const gy = Math.floor(p.y / gridSize);
    const radius = Math.ceil(p.size / gridSize) + 1;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const cx = gx + dx;
        const cy = gy + dy;
        
        if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
        
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;
        
        const idx = cy * cols + cx;
        const influence = (1 - dist / radius) * (1 - p.life / p.maxLife);
        density[p.color][idx] += influence;
      }
    }
  }
  
  // Render density as image data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx = Math.floor(x / gridSize);
      const gy = Math.floor(y / gridSize);
      const idx = gy * cols + gx;
      const pixelIdx = (y * width + x) * 4;
      
      let r = 255, g = 255, b = 255, a = 0;
      
      // Blend all colors
      for (const color of colors) {
        const d = Math.min(1, density[color][idx] * 0.5);
        if (d > 0) {
          const cr = parseInt(color.slice(1, 3), 16);
          const cg = parseInt(color.slice(3, 5), 16);
          const cb = parseInt(color.slice(5, 7), 16);
          
          r = r * (1 - d) + cr * d;
          g = g * (1 - d) + cg * d;
          b = b * (1 - d) + cb * d;
          a = Math.max(a, d * 255);
        }
      }
      
      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = a;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

export const inkDiffusion: ArtGenerator = {
  name: "Ink Diffusion",
  description: "Simulates ink drops spreading through water, creating organic Rorschach-like patterns. Inspired by sumi-e painting and fluid dynamics.",

  params: {
    symmetry: {
      name: "Symmetry Mode",
      type: "select",
      default: "rorschach",
      options: ["none", "horizontal", "vertical", "radial", "rorschach", "kaleidoscope"],
    },
    chaos: {
      name: "Chaos Level",
      type: "range",
      default: 50,
      min: 0,
      max: 100,
      step: 5,
    },
    viscosity: {
      name: "Viscosity",
      type: "range",
      default: 95,
      min: 80,
      max: 99,
      step: 1,
    },
    dropCount: {
      name: "Drop Count",
      type: "range",
      default: 5,
      min: 1,
      max: 20,
      step: 1,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      default: "sumi",
      options: ["sumi", "sanguine", "sepia", "indigo", "vermillion", "emerald", "prussian", "multicolor"],
    },
    diffusionRate: {
      name: "Diffusion Rate",
      type: "range",
      default: 70,
      min: 20,
      max: 100,
      step: 5,
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      default: 30,
      min: 0,
      max: 100,
      step: 5,
    },
    animationSpeed: {
      name: "Animation Speed",
      type: "range",
      default: 1,
      min: 0,
      max: 3,
      step: 0.5,
    },
  },

  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time: number = 0): void => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    const typedParams = params as InkDiffusionParams;
    const symmetry = typedParams.symmetry || "rorschach";
    const chaos = (typedParams.chaos || 50) / 100;
    const viscosity = (typedParams.viscosity || 95) / 100;
    const dropCount = typedParams.dropCount || 5;
    const colorScheme = typedParams.colorScheme || "sumi";
    const diffusionRate = (typedParams.diffusionRate || 70) / 100;
    const turbulence = (typedParams.turbulence || 30) / 100;
    const animationSpeed = typedParams.animationSpeed || 1;

    const colors = COLOR_SCHEMES[colorScheme];

    // Clear with white background (paper)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Check if we need to reinitialize
    const needsReinit = !persistentState ||
      persistentState.width !== width ||
      persistentState.height !== height ||
      persistentState.lastSymmetry !== symmetry ||
      persistentState.lastDropCount !== dropCount;

    if (needsReinit) {
      const seed = Math.floor(time / 1000);
      const drops = initializeDrops(width, height, dropCount, symmetry, seed, colors);
      const noise = createNoise(seed);
      
      // Initial particle spawn
      let allParticles: InkParticle[] = [];
      drops.forEach((drop, i) => {
        const particles = spawnParticles(drop, 50 + Math.floor(chaos * 100), turbulence, seed, i);
        allParticles = allParticles.concat(particles);
      });

      persistentState = {
        drops,
        particles: allParticles,
        grid: new Float32Array(width * height),
        width,
        height,
        lastSymmetry: symmetry,
        lastDropCount: dropCount,
        initialized: true,
      };
    }

    if (!persistentState) return;

    const noise = createNoise(Math.floor(time / 1000));

    // Spawn new particles periodically
    if (animationSpeed > 0 && Math.random() < 0.1 * animationSpeed) {
      persistentState.drops.forEach((drop, i) => {
        if (drop.age < 300) {
          const newParticles = spawnParticles(drop, 5, turbulence, Math.floor(time / 1000), i);
          persistentState!.particles.push(...newParticles);
          drop.age++;
        }
      });
    }

    // Update particles
    const steps = Math.ceil(animationSpeed);
    for (let s = 0; s < steps; s++) {
      updateParticles(persistentState.particles, noise, time + s * 100, viscosity, width, height);
    }

    // Remove dead particles
    persistentState.particles = persistentState.particles.filter(p => p.life < p.maxLife);

    // Render
    renderDensityField(ctx, persistentState.particles, width, height, colors);
  },

  meta: {
    category: "traditional",
    complexity: "complex",
    tags: ["animated", "organic", "detailed", "nature"],
    created: "2026-02-28",
  },
};

// Export for individual use
export function renderInkDiffusion(
  ctx: CanvasRenderingContext2D,
  params: InkDiffusionParams,
  time: number = 0
): void {
  inkDiffusion.generate(ctx, params, time);
}

export const inkDiffusionDefaultParams: InkDiffusionParams = {
  symmetry: "rorschach",
  chaos: 50,
  viscosity: 95,
  dropCount: 5,
  colorScheme: "sumi",
  diffusionRate: 70,
  turbulence: 30,
  animationSpeed: 1,
};
