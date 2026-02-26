import { ArtGenerator, ArtParams, fillCanvas } from "./core";

export interface KineticTypographyParams extends ArtParams {
  text: string;
  fontSize: number;
  animationMode: "wave" | "scatter" | "orbit" | "matrix" | "glitch" | "breath" | "ripple";
  colorScheme: "cyan" | "magenta" | "gold" | "rainbow" | "white" | "fire" | "neon";
  particleSize: number;
  connectionDistance: number;
  speed: number;
  density: number;
}

export const kineticTypographyDefaultParams: KineticTypographyParams = {
  text: "HELLO",
  fontSize: 120,
  animationMode: "wave",
  colorScheme: "cyan",
  particleSize: 2,
  connectionDistance: 20,
  speed: 1,
  density: 3,
};

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  char?: string;
  life: number;
  maxLife: number;
}

const colorSchemes: Record<string, string[]> = {
  cyan: ["#00ffff", "#00cccc", "#009999", "#66ffff", "#33cccc"],
  magenta: ["#ff00ff", "#cc00cc", "#990099", "#ff66ff", "#cc33cc"],
  gold: ["#ffd700", "#ffaa00", "#cc8800", "#ffee88", "#ffcc44"],
  rainbow: ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff"],
  white: ["#ffffff", "#dddddd", "#bbbbbb", "#eeeeee", "#cccccc"],
  fire: ["#ff4400", "#ff8800", "#ffcc00", "#ff2200", "#ff6600"],
  neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"],
};

function sampleTextPixels(
  text: string,
  fontSize: number,
  canvasWidth: number,
  canvasHeight: number,
  density: number
): { x: number; y: number; char?: string }[] {
  const offCanvas = document.createElement("canvas");
  const offCtx = offCanvas.getContext("2d")!;
  offCanvas.width = canvasWidth;
  offCanvas.height = canvasHeight;

  // Setup font
  offCtx.font = `bold ${fontSize}px "Inter", "SF Pro Display", system-ui, sans-serif`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "#ffffff";

  // Draw text
  offCtx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  // Sample pixels
  const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels: { x: number; y: number; char?: string }[] = [];

  for (let y = 0; y < canvasHeight; y += density) {
    for (let x = 0; x < canvasWidth; x += density) {
      const idx = (y * canvasWidth + x) * 4;
      if (imageData.data[idx + 3] > 128) {
        pixels.push({ x, y });
      }
    }
  }

  return pixels;
}

function createParticles(
  pixelPositions: { x: number; y: number }[],
  particleSize: number
): Particle[] {
  return pixelPositions.map((pos, i) => ({
    x: pos.x,
    y: pos.y,
    originX: pos.x,
    originY: pos.y,
    vx: 0,
    vy: 0,
    phase: (i / pixelPositions.length) * Math.PI * 2,
    size: particleSize * (0.8 + Math.random() * 0.4),
    life: Math.random() * 100,
    maxLife: 100 + Math.random() * 50,
  }));
}

function getColor(colorScheme: string, index: number, total: number, time: number): string {
  const palette = colorSchemes[colorScheme];
  if (colorScheme === "rainbow") {
    const hue = (index / total) * 360 + time * 50;
    return `hsl(${hue % 360}, 80%, 60%)`;
  }
  return palette[index % palette.length];
}

export function renderKineticTypography(
  ctx: CanvasRenderingContext2D,
  params: KineticTypographyParams,
  time: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const {
    text,
    fontSize,
    animationMode,
    colorScheme,
    particleSize,
    connectionDistance,
    speed,
    density,
  } = params;

  // Trail effect
  ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
  ctx.fillRect(0, 0, width, height);

  // Sample pixels from text (cache this in real implementation)
  const pixelPositions = sampleTextPixels(text, fontSize, width, height, density);
  
  // Create particles
  const particles = createParticles(pixelPositions, particleSize);

  const t = time * speed;
  const centerX = width / 2;
  const centerY = height / 2;

  // Update particle positions based on animation mode
  particles.forEach((p, i) => {
    switch (animationMode) {
      case "wave":
        p.x = p.originX + Math.cos(t + p.phase) * 15;
        p.y = p.originY + Math.sin(t * 0.8 + p.phase) * 10;
        break;

      case "scatter":
        const scatterPhase = (t + p.phase) % (Math.PI * 2);
        const scatterAmount = Math.sin(scatterPhase) * 50;
        const angle = p.phase * 3;
        p.x = p.originX + Math.cos(angle) * scatterAmount;
        p.y = p.originY + Math.sin(angle) * scatterAmount;
        break;

      case "orbit":
        const orbitRadius = Math.sqrt(
          Math.pow(p.originX - centerX, 2) + Math.pow(p.originY - centerY, 2)
        );
        const orbitAngle = Math.atan2(p.originY - centerY, p.originX - centerX) + t * 0.5;
        p.x = centerX + Math.cos(orbitAngle) * orbitRadius;
        p.y = centerY + Math.sin(orbitAngle) * orbitRadius;
        break;

      case "matrix":
        p.y = (p.originY + t * 30 + i * 2) % height;
        p.x = p.originX;
        p.life = (p.life + 1) % p.maxLife;
        break;

      case "glitch":
        if (Math.random() < 0.05) {
          p.x = p.originX + (Math.random() - 0.5) * 40;
          p.y = p.originY + (Math.random() - 0.5) * 20;
        } else {
          p.x += (p.originX - p.x) * 0.1;
          p.y += (p.originY - p.y) * 0.1;
        }
        break;

      case "breath":
        const breathScale = 1 + Math.sin(t * 0.5) * 0.2;
        p.x = centerX + (p.originX - centerX) * breathScale;
        p.y = centerY + (p.originY - centerY) * breathScale;
        break;

      case "ripple":
        const distFromCenter = Math.sqrt(
          Math.pow(p.originX - centerX, 2) + Math.pow(p.originY - centerY, 2)
        );
        const ripplePhase = t * 2 - distFromCenter * 0.02;
        const rippleAmp = Math.sin(ripplePhase) * 10 * Math.exp(-distFromCenter * 0.002);
        const normX = (p.originX - centerX) / (distFromCenter + 1);
        const normY = (p.originY - centerY) / (distFromCenter + 1);
        p.x = p.originX + normX * rippleAmp;
        p.y = p.originY + normY * rippleAmp;
        break;
    }
  });

  // Draw connection lines (for wave, breath, and ripple modes)
  if (["wave", "breath", "ripple"].includes(animationMode) && connectionDistance > 0) {
    ctx.strokeStyle = colorScheme === "white" ? "rgba(255,255,255,0.1)" : 
                      colorScheme === "cyan" ? "rgba(0,255,255,0.1)" :
                      colorScheme === "magenta" ? "rgba(255,0,255,0.1)" :
                      "rgba(255,255,255,0.1)";
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i += 3) {
      const p1 = particles[i];
      for (let j = i + 1; j < Math.min(i + 20, particles.length); j += 3) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          ctx.globalAlpha = (1 - dist / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Draw particles
  particles.forEach((p, i) => {
    const color = getColor(colorScheme, i, particles.length, t);
    
    if (animationMode === "matrix") {
      // Matrix mode: draw characters
      const chars = text.split("");
      const char = chars[i % chars.length];
      const brightness = p.life / p.maxLife;
      ctx.font = `${p.size * 3}px monospace`;
      ctx.fillStyle = color;
      ctx.globalAlpha = brightness;
      ctx.fillText(char, p.x, p.y);
    } else {
      // Normal mode: draw glowing dots
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

export const kineticTypography: ArtGenerator = {
  name: "Kinetic Typography",
  description: "Living text that decomposes into particles and responds to kinetic forces. Type anything and watch it come alive with wave, scatter, orbit, matrix, glitch, breath, and ripple animations.",
  params: {
    text: {
      name: "Text",
      type: "select",
      options: ["HELLO", "FLOW", "WAVE", "LIFE", "ART", "CODE", "DREAM", "LIGHT"],
      default: "HELLO",
    },
    fontSize: {
      name: "Font Size",
      type: "range",
      min: 60,
      max: 200,
      step: 10,
      default: 120,
    },
    animationMode: {
      name: "Animation Mode",
      type: "select",
      options: ["wave", "scatter", "orbit", "matrix", "glitch", "breath", "ripple"],
      default: "wave",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["cyan", "magenta", "gold", "rainbow", "white", "fire", "neon"],
      default: "cyan",
    },
    particleSize: {
      name: "Particle Size",
      type: "range",
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    connectionDistance: {
      name: "Connection Distance",
      type: "range",
      min: 0,
      max: 50,
      step: 5,
      default: 20,
    },
    speed: {
      name: "Animation Speed",
      type: "range",
      min: 0.1,
      max: 3,
      step: 0.1,
      default: 1,
    },
    density: {
      name: "Particle Density",
      type: "range",
      min: 2,
      max: 6,
      step: 1,
      default: 3,
    },
  },
  generate: (ctx, params, time = 0) => {
    renderKineticTypography(ctx, params as KineticTypographyParams, time);
  },
  meta: {
    category: "text",
    complexity: "complex",
    tags: ["animated", "colorful", "futuristic", "abstract"],
    created: "2024-02-27",
  },
};
