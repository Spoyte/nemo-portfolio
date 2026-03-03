import { ArtConfig, ArtPiece } from "./core";

export const config: ArtConfig = {
  id: "stippled-portraits",
  name: "Stippled Portraits",
  description: "Procedural pointillism creating detailed portraits from thousands of tiny dots. Inspired by traditional stippling art, this algorithm places dots based on density fields to create depth, shadow, and form through pure point accumulation.",
  category: "traditional",
  tags: ["static", "colorful", "detailed", "ordered"],
  thumbnail: "/thumbnails/stippled-portraits.jpg",
  created: "2026-03-03",
  parameters: [
    {
      id: "subject",
      name: "Subject Type",
      type: "select",
      options: ["face", "landscape", "abstract", "floral", "celestial"],
      default: "face",
    },
    {
      id: "dotCount",
      name: "Dot Density",
      type: "range",
      min: 1000,
      max: 15000,
      step: 1000,
      default: 5000,
    },
    {
      id: "colorScheme",
      name: "Color Palette",
      type: "select",
      options: ["sepia", "monochrome", "vibrant", "cool", "warm", "pastel"],
      default: "sepia",
    },
    {
      id: "dotSize",
      name: "Dot Size",
      type: "range",
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    {
      id: "contrast",
      name: "Contrast",
      type: "range",
      min: 20,
      max: 100,
      step: 10,
      default: 60,
    },
    {
      id: "randomness",
      name: "Organic Variation",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 30,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════════════════════

interface ColorPalette {
  background: string;
  dots: string[];
  shadow: string;
  highlight: string;
}

const PALETTES: Record<string, ColorPalette> = {
  sepia: {
    background: "#f5f0e6",
    dots: ["#3d2914", "#5c3a1e", "#7a4f2a", "#a67c52", "#c9a86c"],
    shadow: "#2a1a0a",
    highlight: "#e8d4b8",
  },
  monochrome: {
    background: "#f8f8f8",
    dots: ["#1a1a1a", "#333333", "#555555", "#777777", "#999999"],
    shadow: "#0a0a0a",
    highlight: "#ffffff",
  },
  vibrant: {
    background: "#0a0a1a",
    dots: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff"],
    shadow: "#1a0a2e",
    highlight: "#ffffff",
  },
  cool: {
    background: "#0d1b2a",
    dots: ["#1b3a4b", "#2c5364", "#4a7c8c", "#7ba3b5", "#b8d4e3"],
    shadow: "#05101a",
    highlight: "#e0f4f8",
  },
  warm: {
    background: "#1a0f0a",
    dots: ["#4a1c1c", "#8b3a3a", "#c45c3e", "#e8925c", "#f5c68c"],
    shadow: "#0d0805",
    highlight: "#ffe4c4",
  },
  pastel: {
    background: "#faf8f5",
    dots: ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"],
    shadow: "#e8e0d5",
    highlight: "#ffffff",
  },
};

interface DensityField {
  getDensity(x: number, y: number): number; // 0-1, where 1 = most dots
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY LAYER
// ═══════════════════════════════════════════════════════════════════════════════

/** Type-safe parameter extraction */
function getParam<T extends string | number>(
  params: Record<string, number | string>,
  key: string,
  defaultValue: T
): T {
  const value = params[key];
  return (value !== undefined ? value : defaultValue) as T;
}

/** Simple seeded random for reproducibility */
function createSeededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Distance from point to line segment */
function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/** Smooth minimum for organic blending */
function smoothMin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DENSITY FIELD GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/** Abstract face-like density field */
class FaceDensity implements DensityField {
  private width: number;
  private height: number;
  private seed: number;

  constructor(width: number, height: number, seed: number) {
    this.width = width;
    this.height = height;
    this.seed = seed;
  }

  getDensity(x: number, y: number): number {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const nx = (x - cx) / (this.width * 0.35);
    const ny = (y - cy) / (this.height * 0.45);

    // Face oval shape
    const oval = Math.sqrt(nx * nx + ny * ny * 1.3);
    let density = Math.max(0, 1 - oval);

    // Eye sockets (darker)
    const leftEye = Math.hypot(nx + 0.25, ny + 0.1) < 0.12 ? 0.7 : 1;
    const rightEye = Math.hypot(nx - 0.25, ny + 0.1) < 0.12 ? 0.7 : 1;
    density *= Math.min(leftEye, rightEye);

    // Nose shadow
    const nose = Math.hypot(nx, ny - 0.05) < 0.08 ? 0.85 : 1;
    density *= nose;

    // Mouth line
    const mouthY = ny - 0.25;
    if (Math.abs(mouthY) < 0.05 && Math.abs(nx) < 0.2) {
      density *= 0.8;
    }

    // Hair on top
    if (ny < -0.3 && Math.abs(nx) < 0.6) {
      density *= 0.9 + Math.random() * 0.1;
    }

    return Math.max(0, Math.min(1, density));
  }
}

/** Landscape-like density field */
class LandscapeDensity implements DensityField {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getDensity(x: number, y: number): number {
    const nx = x / this.width;
    const ny = y / this.height;

    // Horizon line
    const horizon = 0.4 + Math.sin(nx * Math.PI * 2) * 0.05;

    // Mountains
    let mountain = 0;
    for (let i = 0; i < 3; i++) {
      const freq = (i + 1) * 3;
      const amp = 0.15 / (i + 1);
      mountain += Math.sin(nx * Math.PI * freq + i) * amp;
    }

    // Combine for density
    const mountainLine = horizon - mountain;
    let density = 0;

    if (ny < mountainLine) {
      // Sky - very light
      density = 0.05 + Math.sin(nx * Math.PI * 4) * 0.03;
    } else if (ny < horizon) {
      // Mountains - gradient
      const t = (ny - mountainLine) / (horizon - mountainLine);
      density = 0.3 + t * 0.4;
    } else {
      // Ground - darker in foreground
      density = 0.7 + (ny - horizon) * 0.5;
    }

    // Sun/moon
    const sunX = 0.7;
    const sunY = 0.25;
    const sunDist = Math.hypot(nx - sunX, ny - sunY);
    if (sunDist < 0.1) {
      density *= 0.3 + sunDist * 7;
    }

    return Math.max(0, Math.min(1, density));
  }
}

/** Abstract geometric density field */
class AbstractDensity implements DensityField {
  private width: number;
  private height: number;
  private seed: number;

  constructor(width: number, height: number, seed: number) {
    this.width = width;
    this.height = height;
    this.seed = seed;
  }

  getDensity(x: number, y: number): number {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const nx = (x - cx) / this.width;
    const ny = (y - cy) / this.height;

    // Multiple overlapping circles
    const circles = [
      { x: -0.2, y: -0.2, r: 0.25 },
      { x: 0.2, y: -0.2, r: 0.2 },
      { x: 0, y: 0.15, r: 0.3 },
      { x: -0.3, y: 0.1, r: 0.15 },
      { x: 0.3, y: 0.1, r: 0.15 },
    ];

    let density = 0;
    for (const c of circles) {
      const d = Math.hypot(nx - c.x, ny - c.y);
      density = Math.max(density, 1 - d / c.r);
    }

    // Add some wave interference
    const wave = Math.sin(nx * 10) * Math.cos(ny * 10) * 0.1;
    density = Math.max(0, Math.min(1, density + wave));

    return density;
  }
}

/** Floral density field */
class FloralDensity implements DensityField {
  private width: number;
  private height: number;
  private seed: number;

  constructor(width: number, height: number, seed: number) {
    this.width = width;
    this.height = height;
    this.seed = seed;
  }

  getDensity(x: number, y: number): number {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const nx = (x - cx) / (this.width * 0.4);
    const ny = (y - cy) / (this.height * 0.4);
    const r = Math.hypot(nx, ny);
    const theta = Math.atan2(ny, nx);

    // Rose curve: r = cos(k * theta)
    const petals = 5;
    const roseR = Math.abs(Math.cos(petals * theta * 0.5));

    // Density based on distance from rose curve
    let density = Math.max(0, 1 - Math.abs(r - roseR * 0.6) * 3);

    // Center disk
    if (r < 0.15) {
      density = Math.max(density, 0.8 - r * 3);
    }

    // Petal veins
    const vein = Math.sin(petals * theta) * 0.5 + 0.5;
    if (r < roseR * 0.6 && r > 0.15) {
      density *= 0.7 + vein * 0.3;
    }

    return Math.max(0, Math.min(1, density));
  }
}

/** Celestial/space density field */
class CelestialDensity implements DensityField {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getDensity(x: number, y: number): number {
    const nx = x / this.width;
    const ny = y / this.height;
    const cx = 0.5;
    const cy = 0.5;

    // Spiral galaxy arms
    const dx = nx - cx;
    const dy = ny - cy;
    const r = Math.hypot(dx, dy);
    const theta = Math.atan2(dy, dx);

    // Logarithmic spiral
    const spiral = Math.cos(theta + r * 8) * 0.5 + 0.5;

    // Galaxy density profile
    let density = Math.exp(-r * 3) * (0.3 + spiral * 0.7);

    // Central bulge
    if (r < 0.15) {
      density = Math.max(density, 0.9 - r * 3);
    }

    // Stars (random bright spots)
    const starNoise = Math.sin(nx * 137.5) * Math.cos(ny * 73.3);
    if (starNoise > 0.95 && r > 0.2) {
      density = Math.max(density, 0.6);
    }

    return Math.max(0, Math.min(1, density));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING LAYER
// ═══════════════════════════════════════════════════════════════════════════════

interface Dot {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
}

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  palette: ColorPalette;
  dotCount: number;
  dotSize: number;
  contrast: number;
  randomness: number;
  densityField: DensityField;
  seed: number;
}

function createRenderContext(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: Record<string, number | string>
): RenderContext {
  const subject = getParam(params, "subject", "face");
  const colorScheme = getParam(params, "colorScheme", "sepia");
  const seed = 42; // Fixed seed for reproducibility

  let densityField: DensityField;
  switch (subject) {
    case "landscape":
      densityField = new LandscapeDensity(canvas.width, canvas.height);
      break;
    case "abstract":
      densityField = new AbstractDensity(canvas.width, canvas.height, seed);
      break;
    case "floral":
      densityField = new FloralDensity(canvas.width, canvas.height, seed);
      break;
    case "celestial":
      densityField = new CelestialDensity(canvas.width, canvas.height);
      break;
    default:
      densityField = new FaceDensity(canvas.width, canvas.height, seed);
  }

  return {
    ctx,
    canvas,
    palette: PALETTES[colorScheme] ?? PALETTES.sepia,
    dotCount: getParam(params, "dotCount", 5000),
    dotSize: getParam(params, "dotSize", 2),
    contrast: getParam(params, "contrast", 60),
    randomness: getParam(params, "randomness", 30),
    densityField,
    seed,
  };
}

function generateDots(rc: RenderContext): Dot[] {
  const { canvas, dotCount, densityField, randomness, seed, palette, contrast } = rc;
  const rand = createSeededRandom(seed);
  const dots: Dot[] = [];

  const margin = 20;
  const w = canvas.width - margin * 2;
  const h = canvas.height - margin * 2;

  // Adaptive sampling: more attempts in high-density regions
  let attempts = 0;
  const maxAttempts = dotCount * 50;

  while (dots.length < dotCount && attempts < maxAttempts) {
    attempts++;

    // Random position with optional jitter
    const jitter = randomness / 100;
    let x = margin + rand() * w;
    let y = margin + rand() * h;

    if (jitter > 0) {
      x += (rand() - 0.5) * jitter * 20;
      y += (rand() - 0.5) * jitter * 20;
    }

    // Get density at this point
    let density = densityField.getDensity(x, y);

    // Apply contrast curve
    density = Math.pow(density, 1 + (contrast - 50) / 50);

    // Acceptance probability based on density
    if (rand() < density) {
      // Determine dot properties based on local density
      const sizeVar = rand() * 0.5 + 0.75;
      const alpha = 0.4 + density * 0.6;

      // Color selection based on density
      const colorIndex = Math.floor((1 - density) * (palette.dots.length - 1));
      const color = palette.dots[Math.min(colorIndex, palette.dots.length - 1)];

      dots.push({
        x,
        y,
        size: rc.dotSize * sizeVar,
        color,
        alpha,
      });
    }
  }

  return dots;
}

function drawBackground(rc: RenderContext): void {
  const { ctx, canvas, palette } = rc;

  // Subtle gradient background
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) / 2
  );
  gradient.addColorStop(0, palette.background);
  gradient.addColorStop(1, palette.shadow);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDots(rc: RenderContext, dots: Dot[]): void {
  const { ctx } = rc;

  // Sort dots by size for better layering (larger behind smaller)
  const sortedDots = [...dots].sort((a, b) => b.size - a.size);

  for (const dot of sortedDots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.globalAlpha = dot.alpha;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawPaperTexture(rc: RenderContext): void {
  const { ctx, canvas } = rc;

  // Subtle noise for paper texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function drawVignette(rc: RenderContext): void {
  const { ctx, canvas, palette } = rc;

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.4,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) * 0.7
  );

  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, palette.shadow + "40");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function create(): ArtPiece {
  let dots: Dot[] | null = null;

  return {
    config,

    setup(_canvas: HTMLCanvasElement, params: Record<string, number | string>): void {
      // Dots are generated on first render
      dots = null;
    },

    render(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number | string>,
      _time: number,
      _deltaTime: number
    ): void {
      const rc = createRenderContext(ctx, canvas, params);

      // Generate dots if first render
      if (!dots) {
        dots = generateDots(rc);
      }

      drawBackground(rc);
      drawDots(rc, dots);
      drawPaperTexture(rc);
      drawVignette(rc);
    },

    cleanup(): void {
      dots = null;
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

export const stippledPortraits = {
  id: "stippled-portraits",
  name: "Stippled Portraits",
  category: "traditional",
  create,
};

export default stippledPortraits;
