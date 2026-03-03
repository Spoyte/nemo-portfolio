import { ArtConfig, ArtPiece } from "./core";

export const config: ArtConfig = {
  id: "flowing-silk",
  name: "Flowing Silk",
  description: "Digital silk flows and ripples like fabric caught in an eternal breeze. Each thread responds to invisible currents, creating organic waves of light and shadow that breathe with mathematical grace.",
  category: "natural",
  tags: ["animated", "organic", "flowing", "detailed", "elegant"],
  thumbnail: "/thumbnails/flowing-silk.jpg",
  created: "2026-03-03",
  parameters: [
    {
      id: "silkColor",
      name: "Silk Color",
      type: "select",
      options: ["pearl", "midnight", "rose", "emerald", "gold", "obsidian"],
      default: "pearl",
    },
    {
      id: "threadCount",
      name: "Thread Density",
      type: "range",
      min: 20,
      max: 100,
      step: 10,
      default: 50,
    },
    {
      id: "flowSpeed",
      name: "Flow Speed",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    {
      id: "turbulence",
      name: "Turbulence",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 40,
    },
    {
      id: "waveAmplitude",
      name: "Wave Height",
      type: "range",
      min: 10,
      max: 100,
      step: 10,
      default: 50,
    },
    {
      id: "sheenIntensity",
      name: "Silk Sheen",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 70,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════════════════════

interface SilkPalette {
  base: string;
  highlight: string;
  shadow: string;
  sheen: string;
  bg: string;
}

const COLOR_SCHEMES: Record<string, SilkPalette> = {
  pearl: {
    base: "#e8e4dc",
    highlight: "#ffffff",
    shadow: "#b8b0a0",
    sheen: "rgba(255, 255, 255, 0.6)",
    bg: "#1a1a1f",
  },
  midnight: {
    base: "#2a3a5a",
    highlight: "#4a6a9a",
    shadow: "#1a2535",
    sheen: "rgba(100, 150, 200, 0.5)",
    bg: "#0a0a10",
  },
  rose: {
    base: "#c4a0a0",
    highlight: "#f0d0d0",
    shadow: "#8a6060",
    sheen: "rgba(255, 200, 200, 0.5)",
    bg: "#1a1010",
  },
  emerald: {
    base: "#4a8a6a",
    highlight: "#7ac49a",
    shadow: "#2a4a3a",
    sheen: "rgba(150, 255, 180, 0.4)",
    bg: "#0a1510",
  },
  gold: {
    base: "#c4a45a",
    highlight: "#ffe080",
    shadow: "#8a7030",
    sheen: "rgba(255, 220, 120, 0.5)",
    bg: "#1a1508",
  },
  obsidian: {
    base: "#3a3a3a",
    highlight: "#5a5a5a",
    shadow: "#1a1a1a",
    sheen: "rgba(100, 100, 100, 0.4)",
    bg: "#050505",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY LAYER
// ═══════════════════════════════════════════════════════════════════════════════

/** Parse hex color to RGB components */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/** Interpolate between two colors */
function lerpColor(c1: string, c2: string, t: number): string {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Type-safe parameter extraction */
function getParam<T extends string | number>(
  params: Record<string, number | string>,
  key: string,
  defaultValue: T
): T {
  const value = params[key];
  return (value !== undefined ? value : defaultValue) as T;
}

/** Simplex-like noise for organic flow */
function createNoise() {
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = Math.floor(Math.random() * 256);
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    return lerp(
      v,
      lerp(u, grad(perm[A], x, y), grad(perm[B], x - 1, y)),
      lerp(u, grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1))
    );
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING LAYER
// ═══════════════════════════════════════════════════════════════════════════════

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  palette: SilkPalette;
  threadCount: number;
  flowSpeed: number;
  turbulence: number;
  waveAmplitude: number;
  sheenIntensity: number;
  time: number;
  noise: (x: number, y: number) => number;
}

function createRenderContext(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: Record<string, number | string>,
  time: number,
  noise: (x: number, y: number) => number
): RenderContext {
  const colorScheme = getParam(params, "silkColor", "pearl");
  
  return {
    ctx,
    canvas,
    palette: COLOR_SCHEMES[colorScheme] ?? COLOR_SCHEMES.pearl,
    threadCount: getParam(params, "threadCount", 50),
    flowSpeed: getParam(params, "flowSpeed", 30),
    turbulence: getParam(params, "turbulence", 40),
    waveAmplitude: getParam(params, "waveAmplitude", 50),
    sheenIntensity: getParam(params, "sheenIntensity", 70),
    time,
    noise,
  };
}

function drawBackground({ ctx, canvas, palette }: RenderContext): void {
  // Gradient background for depth
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
  );
  gradient.addColorStop(0, palette.bg);
  gradient.addColorStop(1, palette.shadow + "20");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/** Calculate silk thread position with wave physics */
function calculateThreadY(
  x: number,
  threadIndex: number,
  rc: RenderContext
): { y: number; angle: number; velocity: number } {
  const { time, flowSpeed, turbulence, waveAmplitude, noise, canvas } = rc;
  
  const normalizedX = x / canvas.width;
  const normalizedThread = threadIndex / rc.threadCount;
  
  // Base wave motion
  const waveFreq = 2 + (turbulence / 100) * 3;
  const wavePhase = time * (flowSpeed / 100) * 2 + normalizedThread * Math.PI;
  
  // Layer multiple sine waves for organic feel
  const primaryWave = Math.sin(normalizedX * waveFreq * Math.PI * 2 + wavePhase);
  const secondaryWave = Math.sin(normalizedX * waveFreq * 1.5 * Math.PI * 2 - wavePhase * 0.7) * 0.5;
  const tertiaryWave = Math.sin(normalizedX * waveFreq * 0.5 * Math.PI * 2 + wavePhase * 0.3) * 0.3;
  
  // Add noise turbulence
  const noiseVal = noise(normalizedX * 3 + time * 0.1, normalizedThread * 2);
  
  // Combine waves
  const combinedWave = primaryWave + secondaryWave + tertiaryWave + noiseVal * (turbulence / 100);
  
  // Calculate derivative for thread angle (lighting)
  const delta = 0.01;
  const y1 = Math.sin((normalizedX - delta) * waveFreq * Math.PI * 2 + wavePhase);
  const y2 = Math.sin((normalizedX + delta) * waveFreq * Math.PI * 2 + wavePhase);
  const angle = Math.atan2((y2 - y1) * waveAmplitude, delta * canvas.width);
  
  // Velocity affects sheen
  const velocity = Math.abs(Math.cos(normalizedX * waveFreq * Math.PI * 2 + wavePhase));
  
  const centerY = canvas.height / 2;
  const amplitudePx = (waveAmplitude / 100) * canvas.height * 0.4;
  
  return {
    y: centerY + combinedWave * amplitudePx,
    angle,
    velocity,
  };
}

function drawSilkThreads(rc: RenderContext): void {
  const { ctx, canvas, palette, threadCount, sheenIntensity } = rc;
  
  const threadSpacing = canvas.width / threadCount;
  
  for (let i = 0; i < threadCount; i++) {
    const x = i * threadSpacing + threadSpacing / 2;
    
    // Sample points along the thread for smooth curve
    const points: { x: number; y: number; brightness: number }[] = [];
    const segments = 50;
    
    for (let s = 0; s <= segments; s++) {
      const px = (s / segments) * canvas.width;
      const { y, angle, velocity } = calculateThreadY(px, i, rc);
      
      // Calculate brightness based on angle (silk sheen effect)
      // Threads perpendicular to light are brighter
      const lightAngle = Math.PI / 4; // Light from top-left
      const angleDiff = Math.abs(angle - lightAngle);
      const sheen = Math.cos(angleDiff) * (sheenIntensity / 100);
      const brightness = 0.3 + sheen * 0.7 + velocity * 0.2;
      
      points.push({ x: px, y, brightness });
    }
    
    // Draw the thread with varying color based on brightness
    for (let p = 0; p < points.length - 1; p++) {
      const pt1 = points[p];
      const pt2 = points[p + 1];
      
      // Color based on brightness
      const color = lerpColor(palette.shadow, palette.highlight, pt1.brightness);
      
      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y + (i - threadCount / 2) * 2);
      ctx.lineTo(pt2.x, pt2.y + (i - threadCount / 2) * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6 + pt1.brightness * 0.4;
      ctx.stroke();
    }
  }
  
  ctx.globalAlpha = 1;
}

function drawSheenOverlay(rc: RenderContext): void {
  const { ctx, canvas, palette, sheenIntensity, time } = rc;
  
  if (sheenIntensity < 10) return;
  
  // Create moving sheen highlights
  const sheenCount = 3;
  
  for (let i = 0; i < sheenCount; i++) {
    const sheenX = (Math.sin(time * 0.5 + i * 2) * 0.3 + 0.5) * canvas.width;
    const sheenY = (Math.cos(time * 0.3 + i * 1.5) * 0.2 + 0.5) * canvas.height;
    
    const gradient = ctx.createRadialGradient(
      sheenX, sheenY, 0,
      sheenX, sheenY, Math.min(canvas.width, canvas.height) * 0.4
    );
    
    const alpha = (sheenIntensity / 100) * 0.15 * (0.5 + Math.sin(time + i) * 0.5);
    gradient.addColorStop(0, palette.sheen.replace(/[\d.]+\)$/, `${alpha})`));
    gradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawThreadHighlights(rc: RenderContext): void {
  const { ctx, canvas, palette, threadCount, sheenIntensity, time } = rc;
  
  // Add subtle sparkle on thread peaks
  const sparkleCount = Math.floor(threadCount / 5);
  
  for (let i = 0; i < sparkleCount; i++) {
    const threadIdx = Math.floor((i / sparkleCount) * threadCount);
    const x = (Math.sin(time * 0.7 + i * 3) * 0.4 + 0.5) * canvas.width;
    const { y, brightness } = calculateThreadY(x, threadIdx, rc);
    
    if (brightness > 0.7) {
      const sparkleSize = (brightness - 0.7) * 3 * (sheenIntensity / 100);
      
      ctx.beginPath();
      ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
      ctx.fillStyle = palette.highlight;
      ctx.globalAlpha = brightness * 0.5;
      ctx.fill();
    }
  }
  
  ctx.globalAlpha = 1;
}

function drawVignette({ ctx, canvas, palette }: RenderContext): void {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
  );
  
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, palette.bg + "80");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function create(): ArtPiece {
  let animationId: number;
  const noise = createNoise();

  return {
    config,

    setup(_canvas: HTMLCanvasElement, _params: Record<string, number | string>): void {
      // Noise is already initialized
    },

    render(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number | string>,
      time: number,
      _deltaTime: number
    ): void {
      const rc = createRenderContext(ctx, canvas, params, time, noise);
      
      drawBackground(rc);
      drawSilkThreads(rc);
      drawSheenOverlay(rc);
      drawThreadHighlights(rc);
      drawVignette(rc);
    },

    cleanup(): void {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

export const flowingSilk = {
  id: "flowing-silk",
  name: "Flowing Silk",
  category: "natural",
  create,
};

export default flowingSilk;
