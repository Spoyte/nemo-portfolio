import { ArtConfig, ArtPiece } from "./core";

export const config: ArtConfig = {
  id: "textile-weave",
  name: "Textile Weave",
  description: "Text becomes thread in a digital tapestry. Characters weave together creating fabric-like patterns where words form the warp and weft of an ever-evolving textile.",
  category: "text",
  tags: ["animated", "text", "geometric", "ordered", "detailed"],
  thumbnail: "/thumbnails/textile-weave.jpg",
  created: "2026-03-02",
  parameters: [
    {
      id: "textSource",
      name: "Text Source",
      type: "select",
      options: ["poetry", "code", "nature", "abstract", "custom"],
      default: "poetry",
    },
    {
      id: "customText",
      name: "Custom Text",
      type: "string",
      default: "WEAVE WORDS INTO ART",
    },
    {
      id: "weavePattern",
      name: "Weave Pattern",
      type: "select",
      options: ["plain", "twill", "satin", "basket", "leno"],
      default: "twill",
    },
    {
      id: "threadDensity",
      name: "Thread Density",
      type: "range",
      min: 10,
      max: 50,
      step: 5,
      default: 25,
    },
    {
      id: "colorScheme",
      name: "Color Scheme",
      type: "select",
      options: ["natural", "neon", "sepia", "monochrome", "rainbow"],
      default: "natural",
    },
    {
      id: "animationSpeed",
      name: "Animation Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.5,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════════════════════

const TEXT_SOURCES: Record<string, string[]> = {
  poetry: [
    "threads of thought weave through time",
    "words dance on the loom of mind",
    "patterns emerge from silent rhyme",
    "textile dreams in code designed",
  ],
  code: [
    "function weave(x, y) { return art; }",
    "const thread = new Pattern();",
    "for (let i = 0; i < ∞; i++)",
    "import { creativity } from 'soul';",
  ],
  nature: [
    "roots weave beneath the earth",
    "rivers thread through valleys",
    "vines spiral toward the sun",
    "spider silk glistens with dew",
  ],
  abstract: [
    "∑π√∞∆∫≈≠≤≥",
    "01010101010101",
    "▓▒░█▓▒░█▓▒░█",
    "≋≋≋≋≋≋≋≋≋≋≋≋",
  ],
};

interface ColorPalette {
  bg: string;
  threads: string[];
}

const COLOR_SCHEMES: Record<string, ColorPalette> = {
  natural: {
    bg: "#f5f0e8",
    threads: ["#8b4513", "#d2691e", "#cd853f", "#deb887", "#a0522d"],
  },
  neon: {
    bg: "#0a0a0f",
    threads: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#00ff80"],
  },
  sepia: {
    bg: "#e8dcc8",
    threads: ["#5c4033", "#8b7355", "#a0826d", "#c4a77d", "#6b4423"],
  },
  monochrome: {
    bg: "#f0f0f0",
    threads: ["#000000", "#333333", "#666666", "#999999", "#cccccc"],
  },
  rainbow: {
    bg: "#1a1a2e",
    threads: ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#0080ff", "#8000ff"],
  },
};

/** Weave pattern offsets for thread interlacing */
const WEAVE_PATTERNS: Record<string, number[]> = {
  plain: [0, 0, 0, 0],   // Simple over-under
  twill: [0, 1, 2, 3],   // Diagonal pattern
  satin: [0, 3, 1, 4],   // Long floats
  basket: [0, 0, 1, 1],  // Groups of two
  leno: [0, 2, 1, 3],    // Open weave
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY LAYER
// ═══════════════════════════════════════════════════════════════════════════════

/** Cache for parsed RGB values to avoid repeated hex parsing */
const colorCache = new Map<string, { r: number; g: number; b: number }>();

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  if (colorCache.has(hex)) {
    return colorCache.get(hex)!;
  }
  
  const result = {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
  
  colorCache.set(hex, result);
  return result;
}

function applyBrightness(hex: string, brightness: number): string {
  const { r, g, b } = parseHexColor(hex);
  return `rgb(${Math.floor(r * brightness)}, ${Math.floor(g * brightness)}, ${Math.floor(b * brightness)})`;
}

function getParam<T extends string | number>(
  params: Record<string, number | string>,
  key: string,
  defaultValue: T
): T {
  const value = params[key];
  return (value !== undefined ? value : defaultValue) as T;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING LAYER
// ═══════════════════════════════════════════════════════════════════════════════

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  cellSize: number;
  rows: number;
  cols: number;
  colors: ColorPalette;
  pattern: number[];
  processedText: string[];
  time: number;
  animationSpeed: number;
}

function createRenderContext(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: Record<string, number | string>,
  time: number,
  processedText: string[]
): RenderContext {
  const threadDensity = getParam(params, "threadDensity", 25);
  const colorScheme = getParam(params, "colorScheme", "natural");
  const weavePattern = getParam(params, "weavePattern", "twill");
  
  const cellSize = canvas.width / threadDensity;
  
  return {
    ctx,
    canvas,
    cellSize,
    rows: Math.ceil(canvas.height / cellSize),
    cols: threadDensity,
    colors: COLOR_SCHEMES[colorScheme] ?? COLOR_SCHEMES.natural,
    pattern: WEAVE_PATTERNS[weavePattern] ?? WEAVE_PATTERNS.twill,
    processedText,
    time,
    animationSpeed: getParam(params, "animationSpeed", 0.5),
  };
}

function drawBackground({ ctx, canvas, colors }: RenderContext): void {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWarpThreads(rc: RenderContext): void {
  const { ctx, cellSize, rows, cols, colors, pattern, processedText, time, animationSpeed } = rc;
  const offset = time * animationSpeed * 2;
  
  for (let col = 0; col < cols; col++) {
    const patternOffset = pattern[col % pattern.length];
    const charIndex = Math.floor((col + offset) % processedText.length);
    const char = processedText[charIndex] ?? "█";
    
    for (let row = 0; row < rows; row++) {
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      
      const isOver = ((row + patternOffset) % 2) === 0;
      const brightness = isOver ? 1 : 0.4;
      
      const colorIdx = (col + row) % colors.threads.length;
      ctx.fillStyle = applyBrightness(colors.threads[colorIdx], brightness);
      ctx.font = `${cellSize * 0.8}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(time + col * 0.1) * 0.05);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }
}

function drawWeftThreads(rc: RenderContext): void {
  const { ctx, cellSize, rows, cols, colors, pattern, processedText, time, animationSpeed } = rc;
  const offset = time * animationSpeed * 2;
  
  ctx.globalCompositeOperation = "multiply";
  
  for (let row = 0; row < rows; row++) {
    const patternOffset = pattern[row % pattern.length];
    const charIndex = Math.floor((row + offset * 1.5) % processedText.length);
    const char = processedText[charIndex] ?? "░";
    
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      
      const isOver = ((col + patternOffset) % 2) === 1;
      const brightness = isOver ? 0.9 : 0.3;
      
      const colorIdx = (row + col + 2) % colors.threads.length;
      ctx.fillStyle = applyBrightness(colors.threads[colorIdx], brightness);
      ctx.font = `${cellSize * 0.7}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.cos(time + row * 0.1) * 0.05);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }
  
  ctx.globalCompositeOperation = "source-over";
}

function drawTextureOverlay({ ctx, canvas, colors }: RenderContext): void {
  ctx.fillStyle = colors.threads[0] + "08";
  
  for (let i = 0; i < canvas.width; i += 2) {
    ctx.fillRect(i, 0, 1, canvas.height);
  }
  for (let i = 0; i < canvas.height; i += 2) {
    ctx.fillRect(0, i, canvas.width, 1);
  }
}

function drawInfo(rc: RenderContext): void {
  const { ctx, canvas, colors, pattern, processedText } = rc;
  
  ctx.fillStyle = colors.threads[0];
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${pattern} weave • ${processedText.length} chars`, 10, canvas.height - 10);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

export function create(): ArtPiece {
  let animationId: number;
  let processedText: string[] = [];

  function processSourceText(params: Record<string, number | string>): string[] {
    const source = getParam(params, "textSource", "poetry");
    const custom = getParam(params, "customText", "");
    
    if (source === "custom" && custom) {
      return custom.split("").filter(c => c !== " ");
    }
    
    const sourceTexts = TEXT_SOURCES[source] ?? TEXT_SOURCES.poetry;
    return sourceTexts.join(" ").split("").filter(c => c !== " ");
  }

  return {
    config,

    setup(canvas: HTMLCanvasElement, params: Record<string, number | string>): void {
      processedText = processSourceText(params);
    },

    render(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number | string>,
      time: number,
      deltaTime: number
    ): void {
      const rc = createRenderContext(ctx, canvas, params, time, processedText);
      
      drawBackground(rc);
      drawWarpThreads(rc);
      drawWeftThreads(rc);
      drawTextureOverlay(rc);
      drawInfo(rc);
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

export const textileWeave = {
  id: "textile-weave",
  name: "Textile Weave",
  category: "text",
  create,
};

export default textileWeave;
