import { ArtGenerator } from "./core";

/**
 * Kinetic Typography — Text That Dances
 * 
 * Words and letters animated through physics-based motion,
 * wave interference, and rhythmic transformations.
 * Letters don't just sit there — they breathe, wave, scatter,
 * and reform in response to time and mathematical forces.
 * 
 * Neuroaesthetic principles:
 * - Predictable motion creates comfort (sine waves)
 * - Chaotic motion creates excitement (noise fields)
 * - Text anchors meaning while motion adds emotion
 * - Rhythm creates anticipation and satisfaction
 */

export interface KineticTypographyParams {
  /** Display text */
  text: string;
  /** Animation style */
  style: "wave" | "scatter" | "orbit" | "breathe" | "glitch" | "liquid";
  /** Typography */
  fontFamily: "serif" | "sans" | "mono" | "display";
  /** Base font size */
  fontSize: number;
  /** Color scheme */
  palette: "neon" | "monochrome" | "sunset" | "ocean" | "forest" | "candy";
  /** Animation speed */
  speed: number;
  /** Wave amplitude */
  amplitude: number;
  /** Letter spacing multiplier */
  letterSpacing: number;
  /** Add trailing effect */
  trails: boolean;
  /** Random seed for scatter */
  seed: number;
}

export const kineticTypographyDefaultParams: KineticTypographyParams = {
  text: "MOTION",
  style: "wave",
  fontFamily: "display",
  fontSize: 64,
  palette: "neon",
  speed: 1,
  amplitude: 30,
  letterSpacing: 1.2,
  trails: true,
  seed: 42,
};

// Color palettes
const palettes: Record<string, { bg: string; primary: string; secondary: string; accent: string; glow: string }> = {
  neon: {
    bg: "#0a0a0f",
    primary: "#ff00ff",
    secondary: "#00ffff",
    accent: "#ffff00",
    glow: "#ff00ff",
  },
  monochrome: {
    bg: "#0a0a0a",
    primary: "#ffffff",
    secondary: "#888888",
    accent: "#cccccc",
    glow: "#ffffff",
  },
  sunset: {
    bg: "#1a0a1a",
    primary: "#ff6b6b",
    secondary: "#ffa500",
    accent: "#ff1493",
    glow: "#ff6b6b",
  },
  ocean: {
    bg: "#0a1a2e",
    primary: "#4ecdc4",
    secondary: "#44a3aa",
    accent: "#96ceb4",
    glow: "#4ecdc4",
  },
  forest: {
    bg: "#0a1f0a",
    primary: "#88d8a3",
    secondary: "#7cb87c",
    accent: "#b8e6b8",
    glow: "#88d8a3",
  },
  candy: {
    bg: "#2a0a2a",
    primary: "#ff69b4",
    secondary: "#da70d6",
    accent: "#dda0dd",
    glow: "#ff69b4",
  },
};

// Font families
const fonts: Record<string, string> = {
  serif: '"Playfair Display", Georgia, "Times New Roman", serif',
  sans: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"SF Mono", "Fira Code", "JetBrains Mono", Consolas, monospace',
  display: '"Bebas Neue", "Impact", "Arial Black", sans-serif',
};

// Seeded random for scatter
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
}

// Easing functions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// Get letter position for wave style
function getWavePosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number
): { y: number; rotation: number; scale: number } {
  const phase = (index / total) * Math.PI * 2;
  const wave = Math.sin(phase + time * speed * 2);
  const y = wave * amplitude;
  const rotation = Math.cos(phase + time * speed * 2) * 15;
  const scale = 1 + Math.sin(phase * 2 + time * speed) * 0.2;
  return { y, rotation, scale };
}

// Get letter position for scatter style
function getScatterPosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number,
  seed: number
): { x: number; y: number; rotation: number; scale: number; opacity: number } {
  const rand = seededRandom(seed + index * 1000);
  const baseX = (rand() - 0.5) * amplitude * 4;
  const baseY = (rand() - 0.5) * amplitude * 4;
  const baseRotation = (rand() - 0.5) * 360;
  
  // Reassemble over time
  const cycle = (time * speed * 0.5) % 4;
  let progress = 0;
  
  if (cycle < 1) {
    // Scattered
    progress = 0;
  } else if (cycle < 2) {
    // Gathering
    progress = easeInOutCubic(cycle - 1);
  } else if (cycle < 3) {
    // Formed
    progress = 1;
  } else {
    // Scattering
    progress = 1 - easeInOutCubic(cycle - 3);
  }
  
  return {
    x: baseX * (1 - progress),
    y: baseY * (1 - progress),
    rotation: baseRotation * (1 - progress),
    scale: 0.5 + progress * 0.5,
    opacity: 0.3 + progress * 0.7,
  };
}

// Get letter position for orbit style
function getOrbitPosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number
): { x: number; y: number; rotation: number } {
  const angle = (index / total) * Math.PI * 2 + time * speed;
  const radius = amplitude * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const rotation = (angle * 180) / Math.PI + 90;
  return { x, y, rotation };
}

// Get letter position for breathe style
function getBreathePosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number
): { y: number; scale: number; letterSpacing: number } {
  const breathCycle = Math.sin(time * speed);
  const letterOffset = (index / total) * Math.PI * 0.5;
  const y = Math.sin(breathCycle + letterOffset) * amplitude * 0.3;
  const scale = 1 + breathCycle * 0.3 + Math.sin(letterOffset) * 0.1;
  const letterSpacing = 1 + breathCycle * 0.5;
  return { y, scale, letterSpacing };
}

// Get letter position for glitch style
function getGlitchPosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number
): { x: number; y: number; r: number; g: number; b: number; glitch: boolean } {
  const glitchSeed = Math.floor(time * speed * 10);
  const rand = seededRandom(glitchSeed + index);
  const isGlitch = rand() > 0.85;
  
  if (!isGlitch) {
    return { x: 0, y: 0, r: 0, g: 0, b: 0, glitch: false };
  }
  
  const x = (rand() - 0.5) * amplitude;
  const y = (rand() - 0.5) * amplitude * 0.5;
  const r = rand() > 0.5 ? amplitude : 0;
  const g = rand() > 0.5 ? amplitude : 0;
  const b = rand() > 0.5 ? amplitude : 0;
  
  return { x, y, r, g, b, glitch: true };
}

// Get letter position for liquid style
function getLiquidPosition(
  index: number,
  total: number,
  time: number,
  amplitude: number,
  speed: number
): { y: number; skewX: number; scaleX: number; scaleY: number } {
  const phase = (index / total) * Math.PI * 2;
  const flow = Math.sin(phase + time * speed * 1.5) * Math.cos(time * speed * 0.5);
  const y = flow * amplitude;
  const skewX = Math.cos(phase + time * speed) * 20;
  const scaleX = 1 + Math.sin(phase * 2 + time * speed * 2) * 0.3;
  const scaleY = 1 - Math.sin(phase * 2 + time * speed * 2) * 0.2;
  return { y, skewX, scaleX, scaleY };
}

export function renderKineticTypography(
  ctx: CanvasRenderingContext2D,
  params: Partial<KineticTypographyParams>,
  time: number
): void {
  const config = { ...kineticTypographyDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const palette = palettes[config.palette];
  const font = fonts[config.fontFamily];
  
  // Background with optional trail effect
  if (config.trails) {
    ctx.fillStyle = palette.bg + "20";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, width, height);
  }
  
  // Setup text
  const text = config.text.toUpperCase();
  const letters = text.split("");
  const totalWidth = config.fontSize * config.letterSpacing * letters.length;
  const startX = (width - totalWidth) / 2 + config.fontSize * config.letterSpacing / 2;
  const centerY = height / 2;
  
  // Draw each letter
  letters.forEach((letter, index) => {
    if (letter === " ") return;
    
    const baseX = startX + index * config.fontSize * config.letterSpacing;
    let x = baseX;
    let y = centerY;
    let rotation = 0;
    let scale = 1;
    let opacity = 1;
    let skewX = 0;
    let scaleX = 1;
    let scaleY = 1;
    let glitchOffset = { r: 0, g: 0, b: 0 };
    
    // Apply style-specific transformations
    switch (config.style) {
      case "wave": {
        const pos = getWavePosition(index, letters.length, time / 1000, config.amplitude, config.speed);
        y += pos.y;
        rotation = pos.rotation;
        scale = pos.scale;
        break;
      }
      case "scatter": {
        const pos = getScatterPosition(index, letters.length, time / 1000, config.amplitude, config.speed, config.seed);
        x += pos.x;
        y += pos.y;
        rotation = pos.rotation;
        scale = pos.scale;
        opacity = pos.opacity;
        break;
      }
      case "orbit": {
        const pos = getOrbitPosition(index, letters.length, time / 1000, config.amplitude, config.speed);
        x += pos.x;
        y += pos.y;
        rotation = pos.rotation;
        break;
      }
      case "breathe": {
        const pos = getBreathePosition(index, letters.length, time / 1000, config.amplitude, config.speed);
        y += pos.y;
        scale = pos.scale;
        break;
      }
      case "glitch": {
        const pos = getGlitchPosition(index, letters.length, time / 1000, config.amplitude, config.speed);
        x += pos.x;
        y += pos.y;
        glitchOffset = { r: pos.r, g: pos.g, b: pos.b };
        break;
      }
      case "liquid": {
        const pos = getLiquidPosition(index, letters.length, time / 1000, config.amplitude, config.speed);
        y += pos.y;
        skewX = pos.skewX;
        scaleX = pos.scaleX;
        scaleY = pos.scaleY;
        break;
      }
    }
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * scaleX, scale * scaleY);
    if (skewX !== 0) {
      ctx.transform(1, 0, Math.tan((skewX * Math.PI) / 180), 1, 0, 0);
    }
    
    ctx.font = `bold ${config.fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Draw with glow effect
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = 20;
    
    if (config.style === "glitch" && glitchOffset.r !== 0) {
      // RGB split effect
      ctx.fillStyle = "#ff0000";
      ctx.fillText(letter, -glitchOffset.r * 0.1, 0);
      ctx.fillStyle = "#00ff00";
      ctx.fillText(letter, glitchOffset.g * 0.1, 0);
      ctx.fillStyle = "#0000ff";
      ctx.fillText(letter, glitchOffset.b * 0.1, 0);
    }
    
    // Main letter
    const gradient = ctx.createLinearGradient(0, -config.fontSize / 2, 0, config.fontSize / 2);
    gradient.addColorStop(0, palette.primary);
    gradient.addColorStop(0.5, palette.secondary);
    gradient.addColorStop(1, palette.accent);
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = opacity;
    ctx.fillText(letter, 0, 0);
    
    // Subtle outline
    ctx.shadowBlur = 0;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity * 0.3;
    ctx.strokeText(letter, 0, 0);
    
    ctx.restore();
  });
  
  // Draw style indicator
  ctx.font = '12px "SF Mono", monospace';
  ctx.textAlign = "left";
  ctx.fillStyle = palette.secondary + "80";
  ctx.fillText(`style: ${config.style}`, 20, height - 20);
  ctx.textAlign = "right";
  ctx.fillText(`palette: ${config.palette}`, width - 20, height - 20);
}

export const kineticTypography: ArtGenerator = {
  name: "Kinetic Typography",
  description: "Text that dances — letters animated through physics, waves, and mathematical motion",
  params: {
    text: { name: "text", type: "select", options: ["MOTION", "CREATE", "WAVE", "DREAM", "FLOW", "TYPE"], default: "MOTION", label: "Display Text" },
    style: { name: "style", type: "select", options: ["wave", "scatter", "orbit", "breathe", "glitch", "liquid"], default: "wave", label: "Animation Style" },
    fontFamily: { name: "fontFamily", type: "select", options: ["serif", "sans", "mono", "display"], default: "display", label: "Font Style" },
    fontSize: { name: "fontSize", type: "range", min: 24, max: 120, step: 4, default: 64, label: "Font Size" },
    palette: { name: "palette", type: "select", options: ["neon", "monochrome", "sunset", "ocean", "forest", "candy"], default: "neon", label: "Color Palette" },
    speed: { name: "speed", type: "range", min: 0.1, max: 3, step: 0.1, default: 1, label: "Animation Speed" },
    amplitude: { name: "amplitude", type: "range", min: 5, max: 80, step: 5, default: 30, label: "Motion Amplitude" },
    letterSpacing: { name: "letterSpacing", type: "range", min: 0.8, max: 2, step: 0.1, default: 1.2, label: "Letter Spacing" },
    trails: { name: "trails", type: "select", options: ["true", "false"], default: "true", label: "Enable Trails" },
    seed: { name: "seed", type: "range", min: 1, max: 100, step: 1, default: 42, label: "Random Seed" },
  },
  generate: renderKineticTypography,
  meta: {
    category: "text",
    complexity: "complex",
    tags: ["animated", "colorful", "futuristic", "abstract"],
    created: "2024-02-27",
  },
};
