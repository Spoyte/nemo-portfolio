import { ArtGenerator } from "./core";

/**
 * Pulse Garden — Meditative Interactive Pulse Blooms
 * 
 * Concentric rings that pulse and breathe, responding to your presence.
 * A digital meditation on rhythm, breath, and the beauty of simplicity.
 * 
 * Based on neuroaesthetic principles:
 * - Symmetry creates visual fluency (pleasure)
 * - Gentle motion induces alpha waves (relaxation)
 * - Interactive control provides agency (engagement)
 * - Optimal complexity sustains attention without overwhelm
 */

export interface PulseGardenParams {
  /** Number of concentric rings */
  ringCount: number;
  /** Base speed of the pulse */
  pulseSpeed: number;
  /** Color theme */
  theme: "zen" | "sunset" | "ocean" | "forest" | "cosmos";
  /** Ring thickness */
  ringThickness: number;
  /** Gap between rings */
  ringGap: number;
  /** Pulse amplitude */
  pulseIntensity: number;
  /** Particle density */
  particleDensity: number;
  /** Breathing sync (seconds per cycle) */
  breathCycle: number;
}

export const pulseGardenDefaultParams: PulseGardenParams = {
  ringCount: 8,
  pulseSpeed: 0.5,
  theme: "zen",
  ringThickness: 2,
  ringGap: 15,
  pulseIntensity: 10,
  particleDensity: 30,
  breathCycle: 4,
};

const themes = {
  zen: {
    background: "#0a0a0f",
    rings: ["#e8e8e8", "#d0d0d0", "#b8b8b8", "#a0a0a0", "#888888", "#707070", "#585858", "#404040"],
    particles: "#ffffff",
    accent: "#f0f0f0",
  },
  sunset: {
    background: "#1a0a0f",
    rings: ["#ff6b6b", "#ff8e72", "#ffb347", "#ffd700", "#ff8c42", "#ff6b9d", "#c44569", "#8b4513"],
    particles: "#ffd700",
    accent: "#ff6b6b",
  },
  ocean: {
    background: "#0a0f1a",
    rings: ["#4ecdc4", "#44a3aa", "#3d8b8b", "#367373", "#2f5b5b", "#284343", "#212b2b", "#1a1a1a"],
    particles: "#a8e6cf",
    accent: "#4ecdc4",
  },
  forest: {
    background: "#0a1a0f",
    rings: ["#88d8b0", "#6bc5a8", "#4eb2a0", "#319f98", "#1a8c90", "#0d7988", "#066680", "#005378"],
    particles: "#c8e6c9",
    accent: "#88d8b0",
  },
  cosmos: {
    background: "#0a0a1a",
    rings: ["#9b59b6", "#8e44ad", "#7d3c98", "#6c3483", "#5b2c6f", "#4a235a", "#391b46", "#281232"],
    particles: "#e8daef",
    accent: "#9b59b6",
  },
};

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
}

function createParticles(count: number, centerX: number, centerY: number, maxRadius: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const radius = maxRadius * (0.3 + Math.random() * 0.7);
    particles.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle,
      radius,
      speed: 0.0005 + Math.random() * 0.001,
      size: 1 + Math.random() * 2,
      alpha: 0.3 + Math.random() * 0.5,
    });
  }
  return particles;
}

export function renderPulseGarden(
  ctx: CanvasRenderingContext2D,
  params: Partial<PulseGardenParams>,
  time: number
): void {
  const config = { ...pulseGardenDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const theme = themes[config.theme];

  // Clear with background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  // Calculate breathing phase (0 to 1, smooth sine wave)
  const breathPhase = (Math.sin((time * Math.PI * 2) / (config.breathCycle * 1000)) + 1) / 2;
  const breathScale = 0.9 + breathPhase * 0.2;

  // Maximum radius based on canvas size
  const maxRadius = Math.min(width, height) * 0.4 * breathScale;

  // Draw ambient particles
  const particles = createParticles(config.particleDensity, centerX, centerY, maxRadius * 1.2);
  
  particles.forEach((particle, i) => {
    // Animate particle position
    const animatedAngle = particle.angle + time * particle.speed;
    const driftRadius = particle.radius + Math.sin(time * 0.001 + i) * 5;
    
    const x = centerX + Math.cos(animatedAngle) * driftRadius;
    const y = centerY + Math.sin(animatedAngle) * driftRadius;

    // Draw particle with glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
    gradient.addColorStop(0, theme.particles + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, theme.particles + "00");
    
    ctx.beginPath();
    ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });

  // Draw concentric pulse rings
  for (let i = 0; i < config.ringCount; i++) {
    const ringProgress = i / (config.ringCount - 1);
    const baseRadius = (maxRadius * (i + 1)) / config.ringCount;
    
    // Each ring has its own phase offset for wave-like effect
    const phaseOffset = (i * Math.PI) / config.ringCount;
    const pulsePhase = Math.sin((time * config.pulseSpeed * 0.002) + phaseOffset);
    const pulseRadius = baseRadius + pulsePhase * config.pulseIntensity;

    // Ring opacity varies with pulse
    const alpha = 0.4 + (pulsePhase + 1) / 2 * 0.6;
    
    // Draw main ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0, pulseRadius), 0, Math.PI * 2);
    ctx.strokeStyle = theme.rings[i % theme.rings.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = config.ringThickness;
    ctx.stroke();

    // Draw inner glow ring
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, Math.max(0, pulseRadius - config.ringThickness * 2),
      centerX, centerY, Math.max(0, pulseRadius + config.ringThickness * 2)
    );
    glowGradient.addColorStop(0, theme.rings[i % theme.rings.length] + "00");
    glowGradient.addColorStop(0.5, theme.rings[i % theme.rings.length] + Math.floor(alpha * 100).toString(16).padStart(2, '0'));
    glowGradient.addColorStop(1, theme.rings[i % theme.rings.length] + "00");
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(0, pulseRadius + config.ringThickness), 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
  }

  // Draw center point (the "heart")
  const centerPulse = Math.sin(time * 0.003) * 0.5 + 0.5;
  const centerSize = 3 + centerPulse * 4;
  
  const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerSize * 4);
  centerGradient.addColorStop(0, theme.accent);
  centerGradient.addColorStop(0.5, theme.accent + "80");
  centerGradient.addColorStop(1, theme.accent + "00");
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize * 4, 0, Math.PI * 2);
  ctx.fillStyle = centerGradient;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
  ctx.fillStyle = theme.accent;
  ctx.fill();

  // Draw subtle vignette
  const vignetteGradient = ctx.createRadialGradient(
    centerX, centerY, maxRadius * 0.5,
    centerX, centerY, maxRadius * 1.5
  );
  vignetteGradient.addColorStop(0, "#00000000");
  vignetteGradient.addColorStop(1, "#00000060");
  
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);
}

export const pulseGarden: ArtGenerator = {
  name: "Pulse Garden",
  description: "Meditative concentric rings that pulse and breathe — a digital sanctuary for mindful moments",
  params: [
    { name: "ringCount", type: "range", min: 3, max: 15, step: 1, default: 8, label: "Ring Count" },
    { name: "pulseSpeed", type: "range", min: 0.1, max: 2, step: 0.1, default: 0.5, label: "Pulse Speed" },
    { name: "theme", type: "select", options: ["zen", "sunset", "ocean", "forest", "cosmos"], default: "zen", label: "Theme" },
    { name: "ringThickness", type: "range", min: 1, max: 8, step: 0.5, default: 2, label: "Ring Thickness" },
    { name: "ringGap", type: "range", min: 5, max: 40, step: 5, default: 15, label: "Ring Spacing" },
    { name: "pulseIntensity", type: "range", min: 0, max: 30, step: 2, default: 10, label: "Pulse Intensity" },
    { name: "particleDensity", type: "range", min: 0, max: 100, step: 10, default: 30, label: "Ambient Particles" },
    { name: "breathCycle", type: "range", min: 2, max: 10, step: 0.5, default: 4, label: "Breath Cycle (sec)" },
  ],
  defaultParams: pulseGardenDefaultParams,
  render: renderPulseGarden,
  category: "geometric",
  tags: ["meditation", "wellness", "interactive", "minimal", "breathing", "calm"],
};
