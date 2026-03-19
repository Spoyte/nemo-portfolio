import { ArtGenerator } from "./core";

/**
 * Breath Poetry — Guided Breathing Through Kinetic Text
 * 
 * A wellness art piece that combines poetry with visual breathing guidance.
 * Words emerge and dissolve in rhythm with a calming breath cycle,
 * creating a meditative experience that guides the viewer through
 * conscious breathing exercises.
 * 
 * Neuroaesthetic principles applied:
 * - Rhythmic motion entrains breathing (respiratory sinus arrhythmia)
 * - Poetry engages language centers, distracting from anxious thoughts
 * - Visual breath cues provide external pacing (reduces cognitive load)
 * - Gradual fade transitions prevent startling responses
 * - Cool color palette activates parasympathetic nervous system
 */

export interface BreathPoetryParams {
  /** Breathing pattern */
  pattern: "calm" | "box" | "deep" | "coherent";
  /** Poetry theme */
  theme: "ocean" | "forest" | "night" | "dawn";
  /** Text size */
  fontSize: number;
  /** Cycle duration in seconds */
  cycleDuration: number;
  /** Particle ambience */
  particleDensity: number;
  /** Show breath indicator */
  showIndicator: boolean;
}

export const breathPoetryDefaultParams: BreathPoetryParams = {
  pattern: "calm",
  theme: "ocean",
  fontSize: 48,
  cycleDuration: 8,
  particleDensity: 50,
  showIndicator: true,
};

// Breathing patterns: [inhale, hold, exhale, hold] in cycle fractions
const patterns = {
  calm: { ratio: [0.4, 0, 0.6, 0], name: "4-7-8 Calm" },
  box: { ratio: [0.25, 0.25, 0.25, 0.25], name: "Box Breathing" },
  deep: { ratio: [0.35, 0.15, 0.5, 0], name: "Deep Breathing" },
  coherent: { ratio: [0.5, 0, 0.5, 0], name: "Coherent (5-5)" },
};

const themes = {
  ocean: {
    background: ["#0a1628", "#1a3a52", "#0d2137"],
    text: "#a8d5e5",
    accent: "#4ecdc4",
    particles: "#5dade2",
    poems: [
      "breathe in the tide",
      "let go like waves",
      "depth holds peace",
      "flow with the current",
      "salt and serenity",
      "the sea breathes too",
    ],
  },
  forest: {
    background: ["#0a1f0a", "#1a3d1a", "#0d280d"],
    text: "#b8e6b8",
    accent: "#88d8a3",
    particles: "#7cb87c",
    poems: [
      "roots breathe deep",
      "leaves whisper exhale",
      "grow with patience",
      "the forest waits",
      "stillness is alive",
      "breathe with the trees",
    ],
  },
  night: {
    background: ["#0a0a1a", "#1a1a3d", "#0d0d28"],
    text: "#d0d0e8",
    accent: "#9b8dc7",
    particles: "#b8a9d9",
    poems: [
      "stars breathe slow",
      "darkness is rest",
      "moonlight exhales",
      "quiet the mind",
      "night holds you",
      "breathe in the dark",
    ],
  },
  dawn: {
    background: ["#1a0f1a", "#3d2430", "#281820"],
    text: "#f0d0c0",
    accent: "#ffb088",
    particles: "#ffd4a3",
    poems: [
      "morning arrives soft",
      "light begins again",
      "dawn breathes hope",
      "wake with wonder",
      "new air enters",
      "begin with breath",
    ],
  },
};

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
}

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2,
    speed: 0.0002 + Math.random() * 0.0003,
    phase: Math.random() * Math.PI * 2,
    opacity: 0.2 + Math.random() * 0.4,
  }));
}

function getBreathPhase(time: number, cycleDuration: number, pattern: keyof typeof patterns): {
  phase: "inhale" | "hold-in" | "exhale" | "hold-out";
  progress: number;
  cycleProgress: number;
} {
  const cycleMs = cycleDuration * 1000;
  const cycleProgress = (time % cycleMs) / cycleMs;
  const ratios = patterns[pattern].ratio;
  
  let accumulated = 0;
  
  // Inhale phase
  accumulated += ratios[0];
  if (cycleProgress < accumulated) {
    const phaseProgress = cycleProgress / ratios[0];
    return { phase: "inhale", progress: phaseProgress, cycleProgress };
  }
  
  // Hold after inhale
  accumulated += ratios[1];
  if (cycleProgress < accumulated && ratios[1] > 0) {
    const phaseProgress = (cycleProgress - ratios[0]) / ratios[1];
    return { phase: "hold-in", progress: phaseProgress, cycleProgress };
  }
  
  // Exhale phase
  accumulated += ratios[2];
  if (cycleProgress < accumulated) {
    const phaseProgress = (cycleProgress - ratios[0] - ratios[1]) / ratios[2];
    return { phase: "exhale", progress: phaseProgress, cycleProgress };
  }
  
  // Hold after exhale
  if (ratios[3] > 0) {
    const phaseProgress = (cycleProgress - ratios[0] - ratios[1] - ratios[2]) / ratios[3];
    return { phase: "hold-out", progress: phaseProgress, cycleProgress };
  }
  
  return { phase: "inhale", progress: 0, cycleProgress };
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function renderBreathPoetry(
  ctx: CanvasRenderingContext2D,
  params: Partial<BreathPoetryParams>,
  time: number
): void {
  const config = { ...breathPoetryDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const theme = themes[config.theme];
  const breath = getBreathPhase(time, config.cycleDuration, config.pattern);
  
  // Create gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  theme.background.forEach((color, i) => {
    bgGradient.addColorStop(i / (theme.background.length - 1), color);
  });
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw ambient particles
  const particles = createParticles(config.particleDensity, width, height);
  particles.forEach((p) => {
    const floatY = Math.sin(time * p.speed + p.phase) * 20;
    const breatheScale = 1 + Math.sin(time * 0.001 + p.phase) * 0.2;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y + floatY, p.size * breatheScale, 0, Math.PI * 2);
    ctx.fillStyle = theme.particles + Math.floor(p.opacity * 100).toString(16).padStart(2, "0");
    ctx.fill();
  });
  
  // Calculate text animation based on breath phase
  let textScale = 1;
  let textOpacity = 1;
  let textY = height / 2;
  
  switch (breath.phase) {
    case "inhale":
      textScale = 1 + easeInOutSine(breath.progress) * 0.15;
      textOpacity = 0.5 + easeInOutSine(breath.progress) * 0.5;
      textY = height / 2 - easeInOutSine(breath.progress) * 20;
      break;
    case "hold-in":
      textScale = 1.15;
      textOpacity = 1;
      break;
    case "exhale":
      textScale = 1.15 - easeInOutSine(breath.progress) * 0.15;
      textOpacity = 1 - easeInOutSine(breath.progress) * 0.3;
      textY = height / 2 + easeInOutSine(breath.progress) * 10;
      break;
    case "hold-out":
      textScale = 1;
      textOpacity = 0.7;
      break;
  }
  
  // Select poem based on cycle
  const cycleMs = config.cycleDuration * 1000;
  const cycleIndex = Math.floor(time / cycleMs);
  const poemIndex = cycleIndex % theme.poems.length;
  const currentPoem = theme.poems[poemIndex];
  
  // Draw main text
  ctx.save();
  ctx.translate(width / 2, textY);
  ctx.scale(textScale, textScale);
  
  ctx.font = `300 ${config.fontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Text glow
  ctx.shadowColor = theme.accent;
  ctx.shadowBlur = 20 * textOpacity;
  ctx.fillStyle = theme.text + Math.floor(textOpacity * 255).toString(16).padStart(2, "0");
  ctx.fillText(currentPoem, 0, 0);
  
  // Subtle reflection
  ctx.save();
  ctx.scale(1, -0.3);
  ctx.globalAlpha = 0.1 * textOpacity;
  ctx.fillText(currentPoem, 0, -config.fontSize * 0.5);
  ctx.restore();
  
  ctx.restore();
  
  // Draw breath indicator if enabled
  if (config.showIndicator) {
    const indicatorY = height * 0.75;
    const indicatorSize = Math.min(width, height) * 0.15;
    
    // Outer ring (static)
    ctx.beginPath();
    ctx.arc(width / 2, indicatorY, indicatorSize, 0, Math.PI * 2);
    ctx.strokeStyle = theme.accent + "30";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Breathing circle
    let breathScale = 0.5;
    switch (breath.phase) {
      case "inhale":
        breathScale = 0.5 + easeInOutSine(breath.progress) * 0.5;
        break;
      case "hold-in":
        breathScale = 1;
        break;
      case "exhale":
        breathScale = 1 - easeInOutSine(breath.progress) * 0.5;
        break;
      case "hold-out":
        breathScale = 0.5;
        break;
    }
    
    // Animated breath circle
    const gradient = ctx.createRadialGradient(
      width / 2, indicatorY, 0,
      width / 2, indicatorY, indicatorSize * breathScale
    );
    gradient.addColorStop(0, theme.accent + "60");
    gradient.addColorStop(0.7, theme.accent + "20");
    gradient.addColorStop(1, theme.accent + "00");
    
    ctx.beginPath();
    ctx.arc(width / 2, indicatorY, indicatorSize * breathScale, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Phase label
    ctx.font = `400 14px "SF Mono", monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = theme.text + "cc";
    const phaseLabels: Record<string, string> = {
      inhale: "breathe in",
      "hold-in": "hold",
      exhale: "breathe out",
      "hold-out": "hold",
    };
    ctx.fillText(phaseLabels[breath.phase], width / 2, indicatorY + indicatorSize + 30);
  }
  
  // Pattern name in corner
  ctx.font = `400 12px "SF Mono", monospace`;
  ctx.textAlign = "right";
  ctx.fillStyle = theme.text + "80";
  ctx.fillText(patterns[config.pattern].name, width - 20, height - 20);
  
  // Vignette overlay
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.3,
    width / 2, height / 2, height * 0.8
  );
  vignette.addColorStop(0, "#00000000");
  vignette.addColorStop(1, "#00000040");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export const breathPoetry: ArtGenerator = {
  name: "Breath Poetry",
  description: "Guided breathing through kinetic poetry — words that breathe with you",
  params: [
    { name: "pattern", type: "select", options: ["calm", "box", "deep", "coherent"], default: "calm", label: "Breathing Pattern" },
    { name: "theme", type: "select", options: ["ocean", "forest", "night", "dawn"], default: "ocean", label: "Poetry Theme" },
    { name: "fontSize", type: "range", min: 24, max: 72, step: 4, default: 48, label: "Text Size" },
    { name: "cycleDuration", type: "range", min: 4, max: 12, step: 0.5, default: 8, label: "Cycle Duration (sec)" },
    { name: "particleDensity", type: "range", min: 0, max: 100, step: 10, default: 50, label: "Ambient Particles" },
    { name: "showIndicator", type: "boolean", default: true, label: "Show Breath Indicator" },
  ],
  defaultParams: breathPoetryDefaultParams,
  render: renderBreathPoetry,
  category: "text",
  tags: ["wellness", "meditation", "breathing", "poetry", "calm", "interactive"],
};
