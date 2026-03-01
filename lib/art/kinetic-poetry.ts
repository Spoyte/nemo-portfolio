import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface KineticPoetryParams {
  // Visual parameters
  wordCount: number;      // 5-30: Number of floating words
  driftSpeed: number;     // 0.1-3: How fast words drift
  connectionDensity: number; // 0-100: How many word connections
  colorScheme: "neon" | "twilight" | "monochrome" | "warm" | "cool" | "gold";
  theme: "cosmos" | "dreams" | "nature" | "time" | "silence";
  animated: boolean;
}

export const kineticPoetryDefaultParams: KineticPoetryParams = {
  wordCount: 15,
  driftSpeed: 1,
  connectionDensity: 50,
  colorScheme: "twilight",
  theme: "cosmos",
  animated: true,
};

// Word banks for different themes
const wordBanks: Record<string, string[]> = {
  cosmos: ["star", "void", "orbit", "nebula", "light", "dark", "infinite", "gravity", "dust", "cosmos", "galaxy", "aurora", "eclipse", "nova", "quasar", "zenith", "horizon", "ether", "celestial", "astral"],
  dreams: ["drift", "float", "whisper", "shadow", "memory", "echo", "fading", "lucid", "somnolent", "reverie", "phantom", "ethereal", "mist", "haze", "slumber", "awakening", "subconscious", "vision", "trace", "gossamer"],
  nature: ["bloom", "wither", "root", "branch", "petal", "thunder", "dew", "moss", "fern", "stream", "meadow", "canopy", "soil", "seed", "wild", "verdant", "rustle", "breeze", "cascade", "flora"],
  time: ["fleeting", "eternal", "moment", "hour", "fading", "lingering", "passage", "cycle", "rhythm", "pulse", "decay", "bloom", "wither", "renew", "ancient", "futures", "now", "then", "always", "never"],
  silence: ["hush", "still", "quiet", "mute", "void", "empty", "pause", "breath", "listen", "absence", "solitude", "tranquil", "serene", "calm", "peace", "dormant", "latent", "potential", "space", "rest"],
};

// Color palettes
const palettes: Record<string, { bg: string; words: string[]; connections: string }> = {
  neon: {
    bg: "#0a0a0f",
    words: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#00F5FF"],
    connections: "rgba(255, 255, 255, 0.15)",
  },
  twilight: {
    bg: "#0f0a1a",
    words: ["#E8D5F2", "#C9B1D4", "#A67DB5", "#7B5A9E", "#5A3D7A", "#3D2656"],
    connections: "rgba(200, 180, 220, 0.12)",
  },
  monochrome: {
    bg: "#0a0a0a",
    words: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080", "#606060"],
    connections: "rgba(255, 255, 255, 0.08)",
  },
  warm: {
    bg: "#1a0f0a",
    words: ["#FF6B35", "#F7931E", "#FFD23F", "#EE4266", "#FF8C42", "#FFA07A"],
    connections: "rgba(255, 200, 150, 0.12)",
  },
  cool: {
    bg: "#0a121a",
    words: ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#6366F1", "#14B8A6"],
    connections: "rgba(150, 200, 255, 0.12)",
  },
  gold: {
    bg: "#0a0a05",
    words: ["#FFD700", "#DAA520", "#B8860B", "#F0E68C", "#FFE4B5", "#DEB887"],
    connections: "rgba(255, 215, 0, 0.1)",
  },
};

interface WordParticle {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  phase: number;
  connections: number[];
}

function createWordParticles(
  count: number,
  width: number,
  height: number,
  theme: string,
  colors: string[]
): WordParticle[] {
  const words = wordBanks[theme] || wordBanks.cosmos;
  const particles: WordParticle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 0.4 + 0.1; // 10-50% from center
    
    particles.push({
      text: words[i % words.length],
      x: width / 2 + Math.cos(angle) * width * distance,
      y: height / 2 + Math.sin(angle) * height * distance,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 14 + Math.random() * 18,
      color: colors[i % colors.length],
      opacity: 0.6 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      connections: [],
    });
  }
  
  return particles;
}

function updateConnections(particles: WordParticle[], density: number): void {
  const maxConnections = Math.floor(density / 10) + 1;
  const connectionDistance = 150;
  
  particles.forEach((p, i) => {
    p.connections = [];
    
    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < connectionDistance && p.connections.length < maxConnections) {
        p.connections.push(j);
      }
    }
  });
}

export function renderKineticPoetry(
  ctx: CanvasRenderingContext2D,
  params: Partial<KineticPoetryParams> = {},
  time: number = 0
): void {
  const config = { ...kineticPoetryDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const palette = palettes[config.colorScheme] || palettes.twilight;
  
  // Clear with background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Animation time
  const t = config.animated ? time * config.driftSpeed * 0.0005 : 0;
  
  // Initialize or get particles from context
  const ctxAny = ctx as any;
  if (!ctxAny._kineticPoetryParticles || ctxAny._kineticPoetryWordCount !== config.wordCount) {
    ctxAny._kineticPoetryParticles = createWordParticles(
      config.wordCount,
      width,
      height,
      config.theme,
      palette.words
    );
    ctxAny._kineticPoetryWordCount = config.wordCount;
    updateConnections(ctxAny._kineticPoetryParticles, config.connectionDensity);
  }
  
  const particles = ctxAny._kineticPoetryParticles;
  
  // Update connections if density changed
  if (ctxAny._lastConnectionDensity !== config.connectionDensity) {
    updateConnections(particles, config.connectionDensity);
    ctxAny._lastConnectionDensity = config.connectionDensity;
  }
  
  // Update particle positions
  particles.forEach((p: WordParticle, i: number) => {
    // Gentle drift with sine wave modulation
    const driftX = Math.sin(t + p.phase) * 0.5;
    const driftY = Math.cos(t * 0.7 + p.phase) * 0.5;
    
    p.x += p.vx + driftX * 0.1;
    p.y += p.vy + driftY * 0.1;
    
    // Wrap around edges with margin
    const margin = 100;
    if (p.x < -margin) p.x = width + margin;
    if (p.x > width + margin) p.x = -margin;
    if (p.y < -margin) p.y = height + margin;
    if (p.y > height + margin) p.y = -margin;
    
    // Pulsing opacity
    p.opacity = 0.5 + 0.3 * Math.sin(t * 2 + p.phase);
  });
  
  // Draw connections first (behind words)
  ctx.strokeStyle = palette.connections;
  ctx.lineWidth = 0.5;
  
  particles.forEach((p: WordParticle, i: number) => {
    p.connections.forEach((j: number) => {
      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const alpha = Math.max(0, 1 - dist / 150) * 0.3;
      
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(other.x, other.y);
      ctx.stroke();
    });
  });
  
  // Draw words
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  particles.forEach((p: WordParticle) => {
    // Glow effect
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    
    ctx.font = `${p.size}px "Georgia", "Times New Roman", serif`;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fillText(p.text, p.x, p.y);
    
    // Reset shadow
    ctx.shadowBlur = 0;
  });
  
  // Reset alpha
  ctx.globalAlpha = 1;
}

// Backward compatibility: ArtGenerator interface
export const kineticPoetry: ArtGenerator = {
  id: "kinetic-poetry",
  name: "Kinetic Poetry",
  category: "text",
  render: (ctx, params, time) => renderKineticPoetry(ctx, params as KineticPoetryParams, time),
  defaultParams: kineticPoetryDefaultParams,
};

export default kineticPoetry;
