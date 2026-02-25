import { ArtGenerator, ArtParams, ColorScheme } from "./core";

export interface DigitalWeaveParams extends ArtParams {
  warpCount: number;        // Vertical threads
  weftCount: number;        // Horizontal threads
  pattern: "plain" | "twill" | "satin" | "damask" | "ikat";
  threadThickness: number;  // 1-10
  colorScheme: ColorScheme;
  weaveTightness: number;   // 0-1, how close threads are
  irregularity: number;     // 0-1, organic variation
  metallicThreads: boolean;
  showSelvedge: boolean;    // Show fabric edges
}

export const digitalWeaveDefaultParams: DigitalWeaveParams = {
  warpCount: 40,
  weftCount: 30,
  pattern: "twill",
  threadThickness: 3,
  colorScheme: "warm",
  weaveTightness: 0.85,
  irregularity: 0.15,
  metallicThreads: true,
  showSelvedge: true,
  animated: true,
  speed: 1,
};

const colorPalettes: Record<ColorScheme, string[]> = {
  warm: ["#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460", "#DAA520"],
  cool: ["#191970", "#4682B4", "#5F9EA0", "#87CEEB", "#B0C4DE", "#708090"],
  rainbow: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
  monochrome: ["#1a1a1a", "#404040", "#666666", "#8c8c8c", "#b3b3b3", "#d9d9d9"],
  neon: ["#FF0080", "#00FF80", "#8000FF", "#FF8000", "#0080FF", "#80FF00"],
  earth: ["#5D4E37", "#8B7355", "#A0522D", "#BC8F8F", "#D2B48C", "#F5DEB3"],
  ocean: ["#000080", "#004080", "#008080", "#40E0D0", "#87CEFA", "#E0FFFF"],
};

function getThreadColor(
  palette: string[],
  warpIndex: number,
  weftIndex: number,
  pattern: string,
  time: number,
  irregularity: number
): { color: string; isWarp: boolean; brightness: number } {
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const variation = rng(warpIndex * 1000 + weftIndex) * irregularity;
  const animatedShift = Math.sin(time * 0.5 + warpIndex * 0.1 + weftIndex * 0.1) * 0.1;
  
  let isWarp = true;
  let patternIndex = 0;
  
  switch (pattern) {
    case "plain":
      isWarp = (warpIndex + weftIndex) % 2 === 0;
      patternIndex = isWarp ? warpIndex % palette.length : weftIndex % palette.length;
      break;
    case "twill":
      const twillOffset = Math.floor(weftIndex / 3);
      isWarp = ((warpIndex + twillOffset) % 4) < 2;
      patternIndex = ((warpIndex + weftIndex) % palette.length);
      break;
    case "satin":
      const satinStep = 5;
      isWarp = ((warpIndex * satinStep + weftIndex) % 7) < 3;
      patternIndex = (warpIndex + Math.floor(weftIndex / 2)) % palette.length;
      break;
    case "damask":
      const centerX = 20;
      const centerY = 15;
      const dist = Math.sqrt((warpIndex - centerX) ** 2 + (weftIndex - centerY) ** 2);
      const angle = Math.atan2(weftIndex - centerY, warpIndex - centerX);
      const damaskPattern = Math.sin(dist * 0.5 + angle * 3) > 0;
      isWarp = damaskPattern;
      patternIndex = Math.floor((dist + variation * 5) % palette.length);
      break;
    case "ikat":
      const ikatBlur = Math.sin(warpIndex * 0.3) * Math.cos(weftIndex * 0.3) * 2;
      isWarp = ((warpIndex + weftIndex + Math.floor(ikatBlur)) % 2) === 0;
      patternIndex = Math.floor((warpIndex * 0.5 + weftIndex * 0.3 + variation * 3) % palette.length);
      break;
  }
  
  const brightness = 0.9 + variation * 0.2 + animatedShift;
  return { color: palette[patternIndex], isWarp, brightness };
}

function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const newR = Math.min(255, Math.floor(r * factor));
  const newG = Math.min(255, Math.floor(g * factor));
  const newB = Math.min(255, Math.floor(b * factor));
  
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

export function renderDigitalWeave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: DigitalWeaveParams,
  time: number
): void {
  const palette = colorPalettes[params.colorScheme];
  const margin = params.showSelvedge ? 20 : 0;
  const fabricWidth = width - margin * 2;
  const fabricHeight = height - margin * 2;
  
  const warpSpacing = fabricWidth / params.warpCount;
  const weftSpacing = fabricHeight / params.weftCount;
  const threadWidth = Math.min(warpSpacing, weftSpacing) * params.weaveTightness * (params.threadThickness / 5);
  
  // Background (loom/foundation)
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);
  
  // Draw fabric shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(margin + 5, margin + 5, fabricWidth, fabricHeight);
  
  // Create offscreen canvas for thread texture
  const threadCache = new Map<string, CanvasGradient>();
  
  function getThreadGradient(color: string, isVertical: boolean, x: number, y: number, w: number, h: number): CanvasGradient {
    const key = `${color}-${isVertical}`;
    if (!threadCache.has(key)) {
      const grad = isVertical
        ? ctx.createLinearGradient(x, y, x + w, y)
        : ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, adjustBrightness(color, 0.6));
      grad.addColorStop(0.3, color);
      grad.addColorStop(0.5, adjustBrightness(color, 1.2));
      grad.addColorStop(0.7, color);
      grad.addColorStop(1, adjustBrightness(color, 0.6));
      threadCache.set(key, grad);
    }
    return threadCache.get(key)!;
  }
  
  // Draw weave pattern
  const threads: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    isWarp: boolean;
    brightness: number;
    z: number;
  }> = [];
  
  // Generate all thread segments
  for (let wy = 0; wy < params.weftCount; wy++) {
    for (let wx = 0; wx < params.warpCount; wx++) {
      const { color, isWarp, brightness } = getThreadColor(
        palette, wx, wy, params.pattern, time, params.irregularity
      );
      
      const x = margin + wx * warpSpacing;
      const y = margin + wy * weftSpacing;
      
      // Warp thread (vertical) segment
      if (isWarp) {
        threads.push({
          x: x + (warpSpacing - threadWidth) / 2,
          y: y,
          w: threadWidth,
          h: weftSpacing + 1,
          color,
          isWarp: true,
          brightness,
          z: 1,
        });
      } else {
        // Weft thread (horizontal) segment
        threads.push({
          x: x,
          y: y + (weftSpacing - threadWidth) / 2,
          w: warpSpacing + 1,
          h: threadWidth,
          color,
          isWarp: false,
          brightness,
          z: 0,
        });
      }
    }
  }
  
  // Sort by Z (weft behind warp)
  threads.sort((a, b) => a.z - b.z);
  
  // Draw threads
  threads.forEach((thread) => {
    const grad = getThreadGradient(
      thread.color,
      thread.isWarp,
      thread.x,
      thread.y,
      thread.w,
      thread.h
    );
    
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.95;
    
    // Thread with rounded ends
    ctx.beginPath();
    if (thread.isWarp) {
      ctx.roundRect(thread.x, thread.y, thread.w, thread.h, thread.w / 2);
    } else {
      ctx.roundRect(thread.x, thread.y, thread.w, thread.h, thread.h / 2);
    }
    ctx.fill();
    
    // Metallic sheen effect
    if (params.metallicThreads && thread.brightness > 1.0) {
      ctx.globalAlpha = (thread.brightness - 1.0) * 0.5;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      if (thread.isWarp) {
        ctx.rect(thread.x + thread.w * 0.3, thread.y, thread.w * 0.4, thread.h);
      } else {
        ctx.rect(thread.x, thread.y + thread.h * 0.3, thread.w, thread.h * 0.4);
      }
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  });
  
  // Selvedge (fabric edges)
  if (params.showSelvedge) {
    ctx.strokeStyle = adjustBrightness(palette[0], 0.5);
    ctx.lineWidth = 3;
    ctx.strokeRect(margin - 2, margin - 2, fabricWidth + 4, fabricHeight + 4);
    
    // Decorative border pattern
    ctx.strokeStyle = palette[palette.length - 1];
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(margin - 6, margin - 6, fabricWidth + 12, fabricHeight + 12);
    ctx.setLineDash([]);
  }
  
  // Subtle texture overlay
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = "#000";
  for (let i = 0; i < 100; i++) {
    const tx = margin + Math.random() * fabricWidth;
    const ty = margin + Math.random() * fabricHeight;
    ctx.fillRect(tx, ty, 2, 2);
  }
  ctx.globalAlpha = 1;
}

export const digitalWeave: ArtGenerator = {
  name: "Digital Weave",
  description: "Textile-inspired generative weaving patterns — plain, twill, satin, damask, and ikat styles with organic thread variation",
  category: "geometric",
  tags: ["textile", "weaving", "patterns", "fabric", "traditional"],
  params: digitalWeaveDefaultParams,
  paramConfig: {
    warpCount: { type: "range", min: 10, max: 80, step: 5, label: "Warp Threads" },
    weftCount: { type: "range", min: 10, max: 60, step: 5, label: "Weft Threads" },
    pattern: {
      type: "select",
      options: [
        { value: "plain", label: "Plain Weave" },
        { value: "twill", label: "Twill" },
        { value: "satin", label: "Satin" },
        { value: "damask", label: "Damask" },
        { value: "ikat", label: "Ikat" },
      ],
      label: "Weave Pattern",
    },
    threadThickness: { type: "range", min: 1, max: 10, step: 1, label: "Thread Thickness" },
    colorScheme: {
      type: "select",
      options: [
        { value: "warm", label: "Warm (Amber/Wool)" },
        { value: "cool", label: "Cool (Indigo)" },
        { value: "earth", label: "Earth Tones" },
        { value: "rainbow", label: "Rainbow" },
        { value: "monochrome", label: "Monochrome" },
        { value: "neon", label: "Neon" },
        { value: "ocean", label: "Ocean" },
      ],
      label: "Color Scheme",
    },
    weaveTightness: { type: "range", min: 0.3, max: 1, step: 0.05, label: "Weave Tightness" },
    irregularity: { type: "range", min: 0, max: 0.5, step: 0.05, label: "Organic Irregularity" },
    metallicThreads: { type: "boolean", label: "Metallic Threads" },
    showSelvedge: { type: "boolean", label: "Show Fabric Edge" },
    animated: { type: "boolean", label: "Animated" },
    speed: { type: "range", min: 0.1, max: 3, step: 0.1, label: "Animation Speed" },
  },
  render: renderDigitalWeave,
};
