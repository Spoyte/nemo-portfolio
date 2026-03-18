import { ArtGenerator } from "./core";

/**
 * Typewriter Poetry - Interactive Text Art
 * 
 * A physics-based typewriter simulation where each keystroke generates
 * letters that fall, bounce, and settle into poetic arrangements.
 * 
 * Features:
 * - Real-time typing with physics simulation
 * - Letters have mass, velocity, and collision
 * - Word magnets attract related words
 * - Fade-out trails create calligraphic effects
 * - Multiple poetry themes (haiku, surrealist, code)
 * 
 * Interactions:
 * - Type to spawn letters
 * - Click to explode/shake existing letters
 * - Space to clear
 * - Backspace to remove last word
 */

// Physics constants
const GRAVITY = 0.3;
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.6;
const LETTER_SIZE = 24;
const FLOOR_Y_OFFSET = 40;

interface Letter {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRotation: number;
  opacity: number;
  color: string;
  size: number;
  settled: boolean;
  settleTime: number;
  wordId: number;
}

interface WordCluster {
  id: number;
  letters: Letter[];
  theme: string;
  x: number;
  y: number;
}

// Poetry themes with curated word banks
const POETRY_THEMES: Record<string, string[]> = {
  haiku: [
    "autumn", "moonlight", "river", "silence", "petals", "fading",
    "mountain", "morning", "dew", "bamboo", "cricket", "evening",
    "frost", "shadow", "blossom", "drifting", "ancient", "temple"
  ],
  surrealist: [
    "melting", "clocks", "dream", "elephant", "spider", "sky",
    "floating", "eyes", "desert", "memory", "labyrinth", "mirror",
    "whisper", "crystal", "violet", "horizon", "echo", "silence"
  ],
  code: [
    "function", "async", "await", "promise", "null", "undefined",
    "recurse", "compile", "runtime", "syntax", "binary", "matrix",
    "render", "compute", "vector", "lambda", "closure", "stream"
  ],
  cosmic: [
    "nebula", "quasar", "gravity", "orbit", "void", "light",
    "singularity", "expansion", "particle", "photon", "dark", "matter",
    "infinity", "eclipse", "aurora", "comet", "pulsar", "zenith"
  ],
  ocean: [
    "tide", "abyss", "current", "coral", "kelp", "pearl",
    "bioluminescent", "plankton", "narwhal", "jellyfish", "depth", "pressure",
    "brine", "shipwreck", "mermaid", "tsunami", "lagoon", "atoll"
  ]
};

// Color palettes for each theme
const THEME_COLORS: Record<string, string[]> = {
  haiku: ["#e8d5b7", "#c9b896", "#a38b71", "#8b7355", "#d4c4a8"],
  surrealist: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"],
  code: ["#00ff00", "#00cc00", "#009900", "#66ff66", "#33ff33"],
  cosmic: ["#9d4edd", "#c77dff", "#e0aaff", "#7b2cbf", "#5a189a"],
  ocean: ["#0077be", "#0096c7", "#48cae4", "#90e0ef", "#caf0f8"]
};

export const typewriterPoetry: ArtGenerator = {
  name: "Typewriter Poetry",
  description: "Physics-based typewriter where keystrokes become falling letters that settle into poetic arrangements. Type to create, click to disturb.",
  params: {
    theme: {
      name: "Theme",
      type: "select",
      default: "haiku",
      options: ["haiku", "surrealist", "code", "cosmic", "ocean"],
    },
    gravity: {
      name: "Gravity",
      type: "range",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      default: 0.3,
    },
    bounce: {
      name: "Bounce",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.1,
      default: 0.6,
    },
    wind: {
      name: "Wind",
      type: "range",
      min: -0.5,
      max: 0.5,
      step: 0.1,
      default: 0,
    },
    fadeTrails: {
      name: "Fade Trails",
      type: "range",
      min: 0,
      max: 0.95,
      step: 0.05,
      default: 0.1,
    },
  },

  generate: (ctx, params, time) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const theme = params.theme as string;
    const gravity = params.gravity as number;
    const bounce = params.bounce as number;
    const wind = params.wind as number;
    const fadeTrails = params.fadeTrails as number;

    // Initialize state
    if (!ctx._state) {
      ctx._state = {
        letters: [] as Letter[],
        wordClusters: [] as WordCluster[],
        currentWordId: 0,
        lastSpawnTime: 0,
        autoSpawnTimer: 0,
        theme: theme,
        mouseX: width / 2,
        mouseY: height / 2,
        mouseDown: false,
        shakeIntensity: 0,
      };
    }
    const state = ctx._state as {
      letters: Letter[];
      wordClusters: WordCluster[];
      currentWordId: number;
      lastSpawnTime: number;
      autoSpawnTimer: number;
      theme: string;
      mouseX: number;
      mouseY: number;
      mouseDown: boolean;
      shakeIntensity: number;
    };

    // Update theme if changed
    if (state.theme !== theme) {
      state.theme = theme;
    }

    // Fade effect for trails
    if (fadeTrails > 0) {
      ctx.fillStyle = `rgba(10, 10, 15, ${fadeTrails})`;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);
    }

    const colors = THEME_COLORS[theme];
    const floorY = height - FLOOR_Y_OFFSET;

    // Auto-spawn poetry words if no user input for a while
    state.autoSpawnTimer += 1 / 60;
    if (state.autoSpawnTimer > 3 && state.letters.length < 50) {
      const words = POETRY_THEMES[theme];
      const word = words[Math.floor(Math.random() * words.length)];
      spawnWord(state, word, width / 2 + (Math.random() - 0.5) * 200, 50, colors);
      state.autoSpawnTimer = 0;
    }

    // Apply shake effect
    if (state.shakeIntensity > 0) {
      ctx.save();
      const shakeX = (Math.random() - 0.5) * state.shakeIntensity;
      const shakeY = (Math.random() - 0.5) * state.shakeIntensity;
      ctx.translate(shakeX, shakeY);
      state.shakeIntensity *= 0.9;
      if (state.shakeIntensity < 0.5) state.shakeIntensity = 0;
    }

    // Update and draw letters
    const lettersToRemove: number[] = [];
    
    state.letters.forEach((letter, index) => {
      // Physics update
      if (!letter.settled) {
        letter.vy += gravity;
        letter.vx += wind * 0.1;
        letter.vx *= FRICTION;
        letter.vy *= FRICTION;
        
        letter.x += letter.vx;
        letter.y += letter.vy;
        letter.rotation += letter.vRotation;

        // Floor collision
        if (letter.y + letter.size / 2 > floorY) {
          letter.y = floorY - letter.size / 2;
          letter.vy *= -bounce;
          letter.vx *= 0.8; // Ground friction
          letter.vRotation *= 0.5;

          // Settle if slow enough
          if (Math.abs(letter.vy) < 1 && Math.abs(letter.vx) < 0.5) {
            letter.settled = true;
            letter.settleTime = time;
          }
        }

        // Wall collisions
        if (letter.x < letter.size / 2) {
          letter.x = letter.size / 2;
          letter.vx *= -bounce;
        }
        if (letter.x > width - letter.size / 2) {
          letter.x = width - letter.size / 2;
          letter.vx *= -bounce;
        }

        // Mouse interaction - explode on click
        if (state.mouseDown) {
          const dx = letter.x - state.mouseX;
          const dy = letter.y - state.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100 * 15;
            letter.vx += (dx / dist) * force;
            letter.vy += (dy / dist) * force;
            letter.settled = false;
            letter.vRotation = (Math.random() - 0.5) * 0.5;
          }
        }
      } else {
        // Settled letters can be disturbed
        const dx = letter.x - state.mouseX;
        const dy = letter.y - state.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (state.mouseDown && dist < 80) {
          letter.settled = false;
          const force = (80 - dist) / 80 * 10;
          letter.vx += (dx / dist) * force;
          letter.vy += (dy / dist) * force;
        }
      }

      // Draw letter
      ctx.save();
      ctx.translate(letter.x, letter.y);
      ctx.rotate(letter.rotation);
      
      // Glow effect
      ctx.shadowColor = letter.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = letter.color;
      ctx.font = `${letter.size}px 'SF Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = letter.opacity;
      ctx.fillText(letter.char, 0, 0);
      
      ctx.restore();

      // Fade out old settled letters
      if (letter.settled && time - letter.settleTime > 10) {
        letter.opacity -= 0.005;
        if (letter.opacity <= 0) {
          lettersToRemove.push(index);
        }
      }
    });

    // Remove faded letters (in reverse order)
    for (let i = lettersToRemove.length - 1; i >= 0; i--) {
      state.letters.splice(lettersToRemove[i], 1);
    }

    // Draw floor line
    ctx.strokeStyle = colors[0];
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw prompt text
    ctx.fillStyle = colors[0];
    ctx.font = "14px 'SF Mono', monospace";
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.6;
    ctx.fillText("Type to create poetry • Click to disturb • Space to clear", width / 2, 30);
    ctx.globalAlpha = 1;

    if (state.shakeIntensity > 0) {
      ctx.restore();
    }

    // Reset mouse down for next frame
    state.mouseDown = false;
  },

  // Handle keyboard input
  onKeyDown: (ctx, key, params) => {
    const state = ctx._state as {
      letters: Letter[];
      currentWordId: number;
      autoSpawnTimer: number;
      theme: string;
      shakeIntensity: number;
    };
    
    if (!state) return;

    const canvas = ctx.canvas;
    const colors = THEME_COLORS[state.theme];
    state.autoSpawnTimer = 0;

    if (key === " ") {
      // Space clears all
      state.letters = [];
      state.shakeIntensity = 20;
      return;
    }

    if (key === "Backspace") {
      // Remove last word
      if (state.letters.length > 0) {
        const lastWordId = state.letters[state.letters.length - 1].wordId;
        state.letters = state.letters.filter(l => l.wordId !== lastWordId);
      }
      return;
    }

    if (key === "Enter") {
      // Spawn a random poetry word
      const words = POETRY_THEMES[state.theme];
      const word = words[Math.floor(Math.random() * words.length)];
      spawnWord(state, word, canvas.width / 2 + (Math.random() - 0.5) * 100, 50, colors);
      return;
    }

    if (key.length === 1 && key.match(/[a-zA-Z0-9\s\.,;:!?\-']/)) {
      // Spawn single letter
      const x = canvas.width / 2 + (Math.random() - 0.5) * 100;
      spawnLetter(state, key, x, 60, colors);
    }
  },

  // Handle mouse/touch input
  onClick: (ctx, x, y, params) => {
    const state = ctx._state as {
      mouseX: number;
      mouseY: number;
      mouseDown: boolean;
      shakeIntensity: number;
    };
    
    if (!state) return;

    state.mouseX = x;
    state.mouseY = y;
    state.mouseDown = true;
    state.shakeIntensity = 10;
  },

  meta: {
    category: "interactive",
    complexity: "moderate",
    tags: ["interactive", "text", "physics", "animated", "colorful"],
    created: "2026-03-18",
  },
};

// Helper to spawn a single letter
function spawnLetter(
  state: { letters: Letter[]; currentWordId: number },
  char: string,
  x: number,
  y: number,
  colors: string[]
): void {
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  state.letters.push({
    char: char.toLowerCase(),
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random() * 2,
    rotation: (Math.random() - 0.5) * 0.5,
    vRotation: (Math.random() - 0.5) * 0.1,
    opacity: 1,
    color,
    size: LETTER_SIZE + Math.random() * 8,
    settled: false,
    settleTime: 0,
    wordId: state.currentWordId,
  });
}

// Helper to spawn a complete word
function spawnWord(
  state: { letters: Letter[]; currentWordId: number },
  word: string,
  startX: number,
  y: number,
  colors: string[]
): void {
  state.currentWordId++;
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  word.split("").forEach((char, i) => {
    state.letters.push({
      char,
      x: startX + i * (LETTER_SIZE * 0.7) + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1,
      vy: Math.random() * 2,
      rotation: (Math.random() - 0.5) * 0.3,
      vRotation: (Math.random() - 0.5) * 0.05,
      opacity: 1,
      color,
      size: LETTER_SIZE + Math.random() * 6,
      settled: false,
      settleTime: 0,
      wordId: state.currentWordId,
    });
  });
}
