import type { ArtGenerator } from "./core";

// Simplex-like noise implementation
class PerlinNoise {
  private perm: number[];
  private grad3: number[][] = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  constructor(seed = 0) {
    this.perm = new Array(512);
    const p = new Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    
    // Shuffle with seed
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  noise2D(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;

    let n0, n1, n2;
    let s = (x + y) * F2;
    let i = Math.floor(x + s);
    let j = Math.floor(y + s);
    let t = (i + j) * G2;
    let X0 = i - t;
    let Y0 = j - t;
    let x0 = x - X0;
    let y0 = y - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

    let x1 = x0 - i1 + G2;
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1 + 2 * G2;
    let y2 = y0 - 1 + 2 * G2;

    let ii = i & 255;
    let jj = j & 255;

    let gi0 = this.perm[ii + this.perm[jj]] % 12;
    let gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    let gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1); }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2); }

    return 70 * (n0 + n1 + n2);
  }
}

// Fractal Brownian Motion
function fbm(
  noise: PerlinNoise,
  x: number,
  y: number,
  octaves: number,
  persistence: number,
  lacunarity: number
): number {
  let total = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise.noise2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total / maxValue;
}

// Color schemes
const COLOR_SCHEMES: Record<string, { water: string; sand: string; grass: string; rock: string; snow: string; skyTop: string; skyBottom: string }> = {
  earth: {
    water: "#1e3a5f",
    sand: "#c4a35a",
    grass: "#4a7c59",
    rock: "#6b5b4f",
    snow: "#f5f5f5",
    skyTop: "#87CEEB",
    skyBottom: "#E0F6FF"
  },
  arctic: {
    water: "#2a4d69",
    sand: "#a8c8d8",
    grass: "#7ba3b5",
    rock: "#5d7a8c",
    snow: "#ffffff",
    skyTop: "#b8d4e3",
    skyBottom: "#e8f4f8"
  },
  mars: {
    water: "#3d1f1f",
    sand: "#c1440e",
    grass: "#8b3a0f",
    rock: "#5c2818",
    snow: "#d4a574",
    skyTop: "#e8a87c",
    skyBottom: "#f5d5c0"
  },
  forest: {
    water: "#1a3a3a",
    sand: "#8b7355",
    grass: "#2d5a27",
    rock: "#4a4a4a",
    snow: "#e8e8e8",
    skyTop: "#4a7c59",
    skyBottom: "#a8d5a2"
  },
  moon: {
    water: "#1a1a2e",
    sand: "#4a4a5a",
    grass: "#6a6a7a",
    rock: "#8a8a9a",
    snow: "#e0e0e8",
    skyTop: "#0a0a15",
    skyBottom: "#2a2a3a"
  }
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 };
}

function lerpColor(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }, t: number): string {
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function renderTerrain(
  ctx: CanvasRenderingContext2D,
  params: {
    seed: number;
    scale: number;
    heightScale: number;
    waterLevel: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
    rotation: number;
    tilt: number;
    colorScheme: string;
  },
  _time?: number
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const noise = new PerlinNoise(params.seed);

  function getHeight(worldX: number, worldZ: number): number {
    const n = fbm(noise, worldX, worldZ, params.octaves, params.persistence, params.lacunarity);
    return Math.pow((n + 1) / 2, 1.2);
  }

  function worldToScreen(worldX: number, worldY: number, worldZ: number) {
    const rotRad = (params.rotation * Math.PI) / 180;
    const tiltRad = (params.tilt * Math.PI) / 180;

    const rx = worldX * Math.cos(rotRad) - worldZ * Math.sin(rotRad);
    const rz = worldX * Math.sin(rotRad) + worldZ * Math.cos(rotRad);

    const screenX = width / 2 + rx;
    const screenY = height / 2 + rz * Math.sin(tiltRad) - worldY * Math.cos(tiltRad);

    return { x: screenX, y: screenY, depth: rz };
  }

  // Sky gradient
  const colors = COLOR_SCHEMES[params.colorScheme] || COLOR_SCHEMES.earth;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, colors.skyTop);
  skyGrad.addColorStop(1, colors.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  const gridSize = 60;
  const cellSize = 8;
  const waterH = params.waterLevel / 100;

  // Generate height map
  const heights: number[][] = [];
  for (let z = 0; z < gridSize; z++) {
    heights[z] = [];
    for (let x = 0; x < gridSize; x++) {
      const wx = (x - gridSize / 2) / params.scale;
      const wz = (z - gridSize / 2) / params.scale;
      heights[z][x] = getHeight(wx, wz);
    }
  }

  // Collect all faces for depth sorting
  const faces: { x: number; z: number; depth: number }[] = [];
  for (let z = 0; z < gridSize - 1; z++) {
    for (let x = 0; x < gridSize - 1; x++) {
      const wx = (x - gridSize / 2) * cellSize;
      const wz = (z - gridSize / 2) * cellSize;
      const projected = worldToScreen(wx, 0, wz);
      faces.push({ x, z, depth: projected.depth });
    }
  }

  // Sort back to front
  faces.sort((a, b) => b.depth - a.depth);

  // Render faces
  for (const face of faces) {
    const x = face.x;
    const z = face.z;

    const h00 = heights[z][x];
    const h10 = heights[z][x + 1];
    const h01 = heights[z + 1][x];
    const h11 = heights[z + 1][x + 1];

    const wx = (x - gridSize / 2) * cellSize;
    const wz = (z - gridSize / 2) * cellSize;

    const p00 = worldToScreen(wx, -h00 * params.heightScale, wz);
    const p10 = worldToScreen(wx + cellSize, -h10 * params.heightScale, wz);
    const p01 = worldToScreen(wx, -h01 * params.heightScale, wz + cellSize);
    const p11 = worldToScreen(wx + cellSize, -h11 * params.heightScale, wz + cellSize);

    const avgH = (h00 + h10 + h01 + h11) / 4;
    const isWater = avgH < waterH;

    const c = hexToRgb;
    const scheme = colors;
    let faceColor: string;

    if (isWater) {
      const waterDepth = Math.max(0, (waterH - avgH) * 2);
      faceColor = lerpColor(c(scheme.water), c(scheme.sand), Math.min(1, waterDepth));
    } else {
      const elevation = (avgH - waterH) / (1 - waterH);
      if (elevation < 0.1) {
        faceColor = lerpColor(c(scheme.sand), c(scheme.grass), elevation / 0.1);
      } else if (elevation < 0.6) {
        faceColor = lerpColor(c(scheme.grass), c(scheme.rock), (elevation - 0.1) / 0.5);
      } else {
        faceColor = lerpColor(c(scheme.rock), c(scheme.snow), (elevation - 0.6) / 0.4);
      }
    }

    const slope = (h10 - h00 + h11 - h01) / 2;

    ctx.fillStyle = faceColor;
    ctx.globalAlpha = isWater ? 0.85 : 1;
    
    ctx.beginPath();
    ctx.moveTo(p00.x, p00.y);
    ctx.lineTo(p10.x, p10.y);
    ctx.lineTo(p11.x, p11.y);
    ctx.lineTo(p01.x, p01.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

export const perlinTerrainGenerator: ArtGenerator = {
  name: "Perlin Terrain",
  description: "3D terrain generation using fractal Perlin noise with multiple biomes — from alpine lakes to Martian canyons.",
  params: {
    seed: {
      name: "Seed",
      type: "range",
      min: 0,
      max: 100000,
      step: 1,
      default: 42,
    },
    scale: {
      name: "Noise Scale",
      type: "range",
      min: 10,
      max: 100,
      step: 1,
      default: 40,
    },
    heightScale: {
      name: "Height Scale",
      type: "range",
      min: 30,
      max: 150,
      step: 5,
      default: 80,
    },
    waterLevel: {
      name: "Water Level",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 30,
    },
    octaves: {
      name: "Octaves",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4,
    },
    persistence: {
      name: "Persistence",
      type: "range",
      min: 0.1,
      max: 0.8,
      step: 0.05,
      default: 0.5,
    },
    lacunarity: {
      name: "Lacunarity",
      type: "range",
      min: 1.5,
      max: 3.0,
      step: 0.1,
      default: 2.0,
    },
    rotation: {
      name: "View Rotation",
      type: "range",
      min: 0,
      max: 360,
      step: 5,
      default: 45,
    },
    tilt: {
      name: "View Tilt",
      type: "range",
      min: 10,
      max: 60,
      step: 5,
      default: 30,
    },
    colorScheme: {
      name: "Biome",
      type: "select",
      options: ["earth", "arctic", "mars", "forest", "moon"],
      default: "earth",
    },
  },
  generate: (ctx, params, time) => {
    renderTerrain(ctx, {
      seed: params.seed as number,
      scale: params.scale as number,
      heightScale: params.heightScale as number,
      waterLevel: params.waterLevel as number,
      octaves: params.octaves as number,
      persistence: params.persistence as number,
      lacunarity: params.lacunarity as number,
      rotation: params.rotation as number,
      tilt: params.tilt as number,
      colorScheme: params.colorScheme as string,
    }, time);
  },
};
