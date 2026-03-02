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

// Text sources
const textSources: Record<string, string[]> = {
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

// Color schemes
const colorSchemes: Record<string, { bg: string; threads: string[] }> = {
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

// Weave pattern offsets
const weavePatterns: Record<string, number[]> = {
  plain: [0, 0, 0, 0], // Simple over-under
  twill: [0, 1, 2, 3], // Diagonal pattern
  satin: [0, 3, 1, 4], // Long floats
  basket: [0, 0, 1, 1], // Groups of two
  leno: [0, 2, 1, 3], // Open weave
};

export function create(): ArtPiece {
  let animationId: number;
  let processedText: string[] = [];

  return {
    config,

    setup(canvas: HTMLCanvasElement, params: Record<string, number | string>): void {
      const source = (params.textSource as string) || "poetry";
      const custom = (params.customText as string) || "";
      
      if (source === "custom" && custom) {
        processedText = custom.split("").filter(c => c !== " ");
      } else {
        const sourceTexts = textSources[source] || textSources.poetry;
        const combined = sourceTexts.join(" ");
        processedText = combined.split("").filter(c => c !== " ");
      }
    },

    render(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number | string>,
      time: number,
      deltaTime: number
    ): void {
      const weavePattern = (params.weavePattern as string) || "twill";
      const threadDensity = (params.threadDensity as number) || 25;
      const colorScheme = (params.colorScheme as string) || "natural";
      const animationSpeed = (params.animationSpeed as number) || 0.5;
      
      const colors = colorSchemes[colorScheme] || colorSchemes.natural;
      const pattern = weavePatterns[weavePattern] || weavePatterns.twill;
      
      // Background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cellSize = canvas.width / threadDensity;
      const rows = Math.ceil(canvas.height / cellSize);
      const cols = threadDensity;
      
      // Animation offset
      const offset = time * animationSpeed * 2;
      
      // Draw warp threads (vertical)
      for (let col = 0; col < cols; col++) {
        const patternOffset = pattern[col % pattern.length];
        const charIndex = Math.floor((col + offset) % processedText.length);
        const char = processedText[charIndex] || "█";
        
        for (let row = 0; row < rows; row++) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          
          // Determine if this thread goes over or under based on pattern
          const isOver = ((row + patternOffset) % 2) === 0;
          const brightness = isOver ? 1 : 0.4;
          
          const colorIdx = (col + row) % colors.threads.length;
          const baseColor = colors.threads[colorIdx];
          
          // Parse hex color and apply brightness
          const r = parseInt(baseColor.slice(1, 3), 16) * brightness;
          const g = parseInt(baseColor.slice(3, 5), 16) * brightness;
          const b = parseInt(baseColor.slice(5, 7), 16) * brightness;
          
          ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
          ctx.font = `${cellSize * 0.8}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Slight rotation for textile effect
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((Math.sin(time + col * 0.1) * 0.05));
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }
      
      // Draw weft threads (horizontal) with different characters
      ctx.globalCompositeOperation = "multiply";
      for (let row = 0; row < rows; row++) {
        const patternOffset = pattern[row % pattern.length];
        const charIndex = Math.floor((row + offset * 1.5) % processedText.length);
        const char = processedText[charIndex] || "░";
        
        for (let col = 0; col < cols; col++) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          
          // Weft goes opposite of warp
          const isOver = ((col + patternOffset) % 2) === 1;
          const brightness = isOver ? 0.9 : 0.3;
          
          const colorIdx = (row + col + 2) % colors.threads.length;
          const baseColor = colors.threads[colorIdx];
          
          const r = parseInt(baseColor.slice(1, 3), 16) * brightness;
          const g = parseInt(baseColor.slice(3, 5), 16) * brightness;
          const b = parseInt(baseColor.slice(5, 7), 16) * brightness;
          
          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, 0.7)`;
          ctx.font = `${cellSize * 0.7}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((Math.cos(time + row * 0.1) * 0.05));
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      
      // Add textile texture overlay
      ctx.fillStyle = colors.threads[0] + "08";
      for (let i = 0; i < canvas.width; i += 2) {
        ctx.fillRect(i, 0, 1, canvas.height);
      }
      for (let i = 0; i < canvas.height; i += 2) {
        ctx.fillRect(0, i, canvas.width, 1);
      }
      
      // Draw info
      ctx.fillStyle = colors.threads[0];
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${weavePattern} weave • ${processedText.length} chars`, 10, canvas.height - 10);
    },

    cleanup(): void {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
}

// Backward compatibility
export const textileWeave = {
  id: "textile-weave",
  name: "Textile Weave",
  category: "text",
  create,
};

export default textileWeave;
