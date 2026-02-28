import { ArtGenerator, ArtParams, fillCanvas, ParamConfig } from "./core";

export interface PoetryVisualizerParams extends ArtParams {
  text: string;
  fontFamily: "serif" | "sans" | "mono" | "script";
  layoutMode: "flow" | "cascade" | "spiral" | "scatter" | "waves";
  colorTheme: "ink" | "sunset" | "ocean" | "forest" | "monochrome" | "neon";
  particleDensity: number;
  flowSpeed: number;
  textOpacity: number;
  showParticles: "true" | "false";
  particleTrails: "true" | "false";
}

export const poetryVisualizerDefaultParams: PoetryVisualizerParams = {
  text: "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold",
  fontFamily: "serif",
  layoutMode: "flow",
  colorTheme: "ink",
  particleDensity: 0.7,
  flowSpeed: 1,
  textOpacity: 0.9,
  showParticles: "true",
  particleTrails: "true",
};

interface WordParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  size: number;
  opacity: number;
  phase: number;
  color: string;
  targetX: number;
  targetY: number;
}

interface FlowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
}

const THEMES: Record<string, { bg: string; primary: string; secondary: string; accent: string[] }> = {
  ink: {
    bg: "#0a0a0f",
    primary: "#e8e6e3",
    secondary: "#8b8680",
    accent: ["#c9b8a0", "#a09080", "#d4c4b0"],
  },
  sunset: {
    bg: "#1a0f1a",
    primary: "#ffd4a3",
    secondary: "#ff8c69",
    accent: ["#ff6b6b", "#ff8e53", "#ff6b9d"],
  },
  ocean: {
    bg: "#0a1628",
    primary: "#a8d8ea",
    secondary: "#7ec8e3",
    accent: ["#4fb0c6", "#3d8b8b", "#6dd5ed"],
  },
  forest: {
    bg: "#0d1f0d",
    primary: "#c8e6c9",
    secondary: "#a5d6a7",
    accent: ["#81c784", "#66bb6a", "#9ccc65"],
  },
  monochrome: {
    bg: "#111111",
    primary: "#ffffff",
    secondary: "#888888",
    accent: ["#cccccc", "#999999", "#666666"],
  },
  neon: {
    bg: "#0a0a1a",
    primary: "#00ffff",
    secondary: "#ff00ff",
    accent: ["#ffff00", "#ff0080", "#00ff80"],
  },
};

const FONTS: Record<string, string> = {
  serif: '"Crimson Text", "Playfair Display", Georgia, serif',
  sans: '"Inter", "SF Pro Display", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
  script: '"Dancing Script", "Pacifico", cursive',
};

function parseTextIntoWords(text: string): { word: string; line: number; index: number }[] {
  const lines = text.split("\n");
  const words: { word: string; line: number; index: number }[] = [];
  let index = 0;
  
  lines.forEach((line, lineNum) => {
    const lineWords = line.trim().split(/\s+/).filter(w => w.length > 0);
    lineWords.forEach(word => {
      words.push({ word, line: lineNum, index: index++ });
    });
  });
  
  return words;
}

function createWordParticles(
  words: { word: string; line: number; index: number }[],
  canvasWidth: number,
  canvasHeight: number,
  theme: typeof THEMES["ink"],
  layoutMode: string
): WordParticle[] {
  const particles: WordParticle[] = [];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  words.forEach((wordData, i) => {
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const progress = i / Math.max(1, words.length - 1);
    
    switch (layoutMode) {
      case "flow":
        targetX = 50 + (canvasWidth - 100) * progress;
        targetY = centerY + Math.sin(progress * Math.PI * 2) * 50 + (wordData.line * 40);
        x = targetX + (Math.random() - 0.5) * 100;
        y = targetY + (Math.random() - 0.5) * 100;
        break;
        
      case "cascade":
        targetX = centerX + Math.sin(wordData.line * 0.5) * 100;
        targetY = 80 + wordData.index * 35;
        x = centerX + (Math.random() - 0.5) * 300;
        y = targetY + (Math.random() - 0.5) * 50;
        break;
        
      case "spiral":
        const angle = progress * Math.PI * 4;
        const radius = 30 + progress * Math.min(canvasWidth, canvasHeight) * 0.35;
        targetX = centerX + Math.cos(angle) * radius;
        targetY = centerY + Math.sin(angle) * radius;
        x = centerX + (Math.random() - 0.5) * 200;
        y = centerY + (Math.random() - 0.5) * 200;
        break;
        
      case "scatter":
        targetX = 50 + Math.random() * (canvasWidth - 100);
        targetY = 50 + Math.random() * (canvasHeight - 100);
        x = centerX + (Math.random() - 0.5) * 400;
        y = centerY + (Math.random() - 0.5) * 400;
        break;
        
      case "waves":
        targetX = 50 + (canvasWidth - 100) * progress;
        targetY = centerY + Math.sin(progress * Math.PI * 6) * (canvasHeight * 0.3);
        x = targetX;
        y = canvasHeight + 50;
        break;
    }
    
    const accentColor = theme.accent[i % theme.accent.length];
    
    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      text: wordData.word,
      size: 16 + Math.random() * 12 + (wordData.word.length > 5 ? 4 : 0),
      opacity: 0,
      phase: progress * Math.PI * 2,
      color: i % 3 === 0 ? theme.primary : accentColor,
      targetX,
      targetY,
    });
  });
  
  return particles;
}

function createFlowParticles(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  theme: typeof THEMES["ink"],
  layoutMode: string
): FlowParticle[] {
  const particles: FlowParticle[] = [];
  
  for (let i = 0; i < count; i++) {
    particles.push(createSingleFlowParticle(canvasWidth, canvasHeight, theme, layoutMode));
  }
  
  return particles;
}

function createSingleFlowParticle(
  canvasWidth: number,
  canvasHeight: number,
  theme: typeof THEMES["ink"],
  layoutMode: string
): FlowParticle {
  const x = Math.random() * canvasWidth;
  const y = Math.random() * canvasHeight;
  const accentColor = theme.accent[Math.floor(Math.random() * theme.accent.length)];
  
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    life: Math.random() * 100,
    maxLife: 100 + Math.random() * 100,
    size: 1 + Math.random() * 2,
    color: accentColor,
    trail: [],
  };
}

export const poetryVisualizer: ArtGenerator = {
  name: "Poetry Visualizer",
  description: "Transform text into flowing visual poetry - words become particles that dance and flow through space",
  params: {
    text: {
      name: "Text Content",
      type: "select",
      options: [
        "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold",
        "In the garden\nwhispers of wind\ncarry petals\nto silent ponds",
        "Code flows like\nrivers of thought\nthrough circuits\ninto light",
        "Mountains rise\nclouds drift by\ntime stands still\nbeneath the sky",
        "Dreams take flight\nin the dark of night\nstars align\nworlds combine",
      ],
      default: "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold",
    },
    fontFamily: {
      name: "Font Style",
      type: "select",
      options: ["serif", "sans", "mono", "script"],
      default: "serif",
    },
    layoutMode: {
      name: "Layout Mode",
      type: "select",
      options: ["flow", "cascade", "spiral", "scatter", "waves"],
      default: "flow",
    },
    colorTheme: {
      name: "Color Theme",
      type: "select",
      options: ["ink", "sunset", "ocean", "forest", "monochrome", "neon"],
      default: "ink",
    },
    particleDensity: {
      name: "Particle Density",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.7,
    },
    flowSpeed: {
      name: "Flow Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1,
    },
    textOpacity: {
      name: "Text Opacity",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.9,
    },
    showParticles: {
      name: "Show Particles",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    particleTrails: {
      name: "Particle Trails",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
  },
  
  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["animated", "colorful", "organic", "detailed"],
    created: "2026-03-01",
  },
  
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const p = { ...poetryVisualizerDefaultParams, ...params } as PoetryVisualizerParams;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const t = (time || 0) * 0.001 * p.flowSpeed;
    
    const theme = THEMES[p.colorTheme];
    
    // Fade effect for trails
    if (p.particleTrails === "true" && time) {
      ctx.fillStyle = theme.bg + "20";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      fillCanvas(ctx, theme.bg, canvasWidth, canvasHeight);
    }
    
    // Initialize or retrieve state
    const stateKey = "__poetry_state__";
    let state = (ctx.canvas as any)[stateKey] as {
      words: WordParticle[];
      particles: FlowParticle[];
      textHash: string;
      layoutMode: string;
    } | undefined;
    
    const currentTextHash = p.text + p.layoutMode + p.colorTheme;
    
    if (!state || state.textHash !== currentTextHash) {
      const parsedWords = parseTextIntoWords(p.text);
      state = {
        words: createWordParticles(parsedWords, canvasWidth, canvasHeight, theme, p.layoutMode),
        particles: createFlowParticles(
          Math.floor(50 + p.particleDensity * 150),
          canvasWidth,
          canvasHeight,
          theme,
          p.layoutMode
        ),
        textHash: currentTextHash,
        layoutMode: p.layoutMode,
      };
      (ctx.canvas as any)[stateKey] = state;
    }
    
    // Update and draw flow particles
    if (p.showParticles === "true") {
      state.particles.forEach((particle, i) => {
        // Update trail
        if (p.particleTrails === "true") {
          particle.trail.push({ x: particle.x, y: particle.y });
          if (particle.trail.length > 10) {
            particle.trail.shift();
          }
        }
        
        // Movement based on layout mode
        switch (p.layoutMode) {
          case "flow":
            particle.vx += Math.sin(t + particle.y * 0.01) * 0.02;
            particle.vy += Math.cos(t + particle.x * 0.01) * 0.02;
            break;
          case "cascade":
            particle.vy += 0.05;
            particle.vx += Math.sin(t * 2 + particle.y * 0.02) * 0.03;
            break;
          case "spiral":
            const dx = particle.x - canvasWidth / 2;
            const dy = particle.y - canvasHeight / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            particle.vx += -dy * 0.001 + dx * 0.0001;
            particle.vy += dx * 0.001 + dy * 0.0001;
            break;
          case "waves":
            particle.vx += Math.sin(t + particle.y * 0.02) * 0.05;
            particle.vy *= 0.95;
            break;
          case "scatter":
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            break;
        }
        
        // Apply velocity with damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvasWidth;
        if (particle.x > canvasWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvasHeight;
        if (particle.y > canvasHeight) particle.y = 0;
        
        // Update life
        particle.life--;
        if (particle.life <= 0) {
          const newParticle = createSingleFlowParticle(canvasWidth, canvasHeight, theme, p.layoutMode);
          particle.x = newParticle.x;
          particle.y = newParticle.y;
          particle.vx = newParticle.vx;
          particle.vy = newParticle.vy;
          particle.life = newParticle.life;
          particle.maxLife = newParticle.maxLife;
          particle.trail = [];
        }
        
        // Draw trail
        if (p.particleTrails === "true" && particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let j = 1; j < particle.trail.length; j++) {
            ctx.lineTo(particle.trail[j].x, particle.trail[j].y);
          }
          const lifeRatio = particle.life / particle.maxLife;
          ctx.strokeStyle = particle.color + Math.floor(lifeRatio * 80).toString(16).padStart(2, "0");
          ctx.lineWidth = particle.size * 0.5;
          ctx.stroke();
        }
        
        // Draw particle
        const lifeRatio = particle.life / particle.maxLife;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(lifeRatio * 100).toString(16).padStart(2, "0");
        ctx.fill();
      });
    }
    
    // Update and draw word particles
    ctx.font = `400 ${16}px ${FONTS[p.fontFamily]}`;
    
    state.words.forEach((word, i) => {
      // Spring physics toward target
      const dx = word.targetX - word.x;
      const dy = word.targetY - word.y;
      word.vx += dx * 0.02;
      word.vy += dy * 0.02;
      word.vx *= 0.9;
      word.vy *= 0.9;
      
      // Add floating motion
      word.vx += Math.sin(t + word.phase) * 0.1;
      word.vy += Math.cos(t * 0.7 + word.phase) * 0.1;
      
      word.x += word.vx;
      word.y += word.vy;
      
      // Fade in
      if (word.opacity < p.textOpacity) {
        word.opacity += 0.01;
      }
      
      // Draw word with glow effect
      const glowSize = 10 + Math.sin(t * 2 + word.phase) * 5;
      
      // Glow
      ctx.shadowColor = word.color;
      ctx.shadowBlur = glowSize;
      ctx.fillStyle = word.color + Math.floor(word.opacity * 255).toString(16).padStart(2, "0");
      ctx.font = `${word.size}px ${FONTS[p.fontFamily]}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(word.text, word.x, word.y);
      
      // Reset shadow
      ctx.shadowBlur = 0;
    });
    
    // Draw connecting lines between nearby words (subtle)
    ctx.globalAlpha = 0.1 * p.textOpacity;
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < state.words.length; i++) {
      for (let j = i + 1; j < state.words.length; j++) {
        const w1 = state.words[i];
        const w2 = state.words[j];
        const dx = w1.x - w2.x;
        const dy = w1.y - w2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(w1.x, w1.y);
          ctx.lineTo(w2.x, w2.y);
          ctx.globalAlpha = (1 - dist / 100) * 0.1 * p.textOpacity;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  },
};

export default poetryVisualizer;
