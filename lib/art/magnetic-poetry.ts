import { ArtGenerator } from "./core";

export const magneticPoetry: ArtGenerator = {
  name: "Magnetic Poetry",
  description:
    "Interactive physics-based word magnets. Drag words to compose poetry, watch them drift and collide with satisfying momentum. Words carry emotional weight through color and movement.",

  params: {
    friction: {
      name: "Friction",
      type: "range",
      min: 0.9,
      max: 0.99,
      step: 0.01,
      default: 0.96,
    },
    magnetism: {
      name: "Word Magnetism",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    wordCount: {
      name: "Word Count",
      type: "range",
      min: 10,
      max: 50,
      step: 5,
      default: 25,
    },
    theme: {
      name: "Word Theme",
      type: "select",
      options: ["love", "nature", "cosmos", "dreams", "chaos"],
      default: "love",
    },
    glowIntensity: {
      name: "Glow",
      type: "range",
      min: 0,
      max: 50,
      step: 5,
      default: 20,
    },
  },

  meta: {
    category: "interactive",
    complexity: "complex",
    tags: ["interactive", "physics", "text", "generative"],
  },

  generate: (ctx, params, time) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const theme = params.theme as string;
    const wordCount = params.wordCount as number;
    const friction = params.friction as number;
    const magnetism = params.magnetism as number;
    const glowIntensity = params.glowIntensity as number;

    // Word banks by theme
    const wordBanks: Record<string, string[]> = {
      love: [
        "breathe",
        "whisper",
        "touch",
        "softly",
        "always",
        "forever",
        "heart",
        "soul",
        "dance",
        "moonlight",
        "ocean",
        "stars",
        "embrace",
        "tender",
        "passion",
        "desire",
        "longing",
        "beloved",
        "eternal",
        "grace",
      ],
      nature: [
        "river",
        "mountain",
        "forest",
        "breeze",
        "petal",
        "thunder",
        "meadow",
        "crystal",
        "wild",
        "grow",
        "bloom",
        "roots",
        "stream",
        "sunset",
        "dawn",
        "winter",
        "summer",
        "autumn",
        "spring",
        "earth",
      ],
      cosmos: [
        "nebula",
        "galaxy",
        "void",
        "infinite",
        "gravity",
        "orbit",
        "stardust",
        "cosmos",
        "quantum",
        "singularity",
        "expanse",
        "celestial",
        "aurora",
        "eclipse",
        "zenith",
        "abyss",
        "radiant",
        "ethereal",
        "cosmic",
        "eternity",
      ],
      dreams: [
        "wander",
        "lucid",
        "subconscious",
        "memory",
        "fog",
        "mirror",
        "labyrinth",
        "shadow",
        "awakening",
        "drift",
        "silence",
        "echo",
        "phantom",
        "reverie",
        "twilight",
        "mystery",
        "secret",
        "hidden",
        "beyond",
        "within",
      ],
      chaos: [
        "fracture",
        "storm",
        "turbulence",
        "entropy",
        "disrupt",
        "shatter",
        "wildfire",
        "maelstrom",
        "discord",
        "anarchy",
        "rebel",
        "rupture",
        "volatile",
        "frenzy",
        "tremor",
        "collapse",
        "upheaval",
        "reckoning",
        "catalyst",
        "revolution",
      ],
    };

    // Color palettes by theme
    const palettes: Record<string, string[]> = {
      love: ["#ff6b9d", "#c44569", "#f8b500", "#ff9ff3", "#ff6b6b"],
      nature: ["#27ae60", "#2ecc71", "#16a085", "#1abc9c", "#52d681"],
      cosmos: ["#6c5ce7", "#a29bfe", "#74b9ff", "#0984e3", "#dfe6e9"],
      dreams: ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"],
      chaos: ["#e74c3c", "#c0392b", "#e67e22", "#d35400", "#8e44ad"],
    };

    // Initialize state on first render
    if (!(ctx.canvas as any).__magneticPoetryState) {
      const words = wordBanks[theme] || wordBanks.love;
      const selectedWords: Word[] = [];
      const palette = palettes[theme] || palettes.love;

      for (let i = 0; i < Math.min(wordCount, words.length); i++) {
        selectedWords.push({
          text: words[i],
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 50) + 25,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: Math.random() * 16 + 20,
          rotation: (Math.random() - 0.5) * 0.5,
          vRotation: (Math.random() - 0.5) * 0.02,
          hovered: false,
          dragging: false,
        });
      }

      (ctx.canvas as any).__magneticPoetryState = {
        words: selectedWords,
        mouseX: width / 2,
        mouseY: height / 2,
        isMouseDown: false,
        draggedWord: null,
        time: 0,
      };
    }

    const state = (ctx.canvas as any).__magneticPoetryState;
    state.time = time;

    // Clear with fade effect
    ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
    ctx.fillRect(0, 0, width, height);

    // Update and draw words
    state.words.forEach((word: Word, i: number) => {
      // Physics update
      if (!word.dragging) {
        // Apply friction
        word.vx *= friction;
        word.vy *= friction;
        word.vRotation *= friction;

        // Gentle floating motion
        word.vx += Math.sin(time * 0.5 + i) * 0.02;
        word.vy += Math.cos(time * 0.3 + i * 0.7) * 0.02;

        // Mouse magnetism (words gently attracted to mouse)
        if (magnetism > 0) {
          const dx = state.mouseX - word.x;
          const dy = state.mouseY - word.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 50) {
            const force = (magnetism / dist) * 0.001;
            word.vx += dx * force;
            word.vy += dy * force;
          }
        }

        // Word-to-word repulsion
        state.words.forEach((other: Word, j: number) => {
          if (i === j) return;
          const dx = word.x - other.x;
          const dy = word.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = word.size * 2 + other.size;

          if (dist < minDist && dist > 0) {
            const force = (minDist - dist) * 0.001;
            word.vx += (dx / dist) * force;
            word.vy += (dy / dist) * force;
          }
        });

        // Update position
        word.x += word.vx;
        word.y += word.vy;
        word.rotation += word.vRotation;

        // Boundary bounce
        const margin = word.size * 2;
        if (word.x < margin) {
          word.x = margin;
          word.vx *= -0.8;
        }
        if (word.x > width - margin) {
          word.x = width - margin;
          word.vx *= -0.8;
        }
        if (word.y < margin) {
          word.y = margin;
          word.vy *= -0.8;
        }
        if (word.y > height - margin) {
          word.y = height - margin;
          word.vy *= -0.8;
        }
      }

      // Draw word
      ctx.save();
      ctx.translate(word.x, word.y);
      ctx.rotate(word.rotation);

      // Glow effect
      if (glowIntensity > 0) {
        ctx.shadowColor = word.color;
        ctx.shadowBlur = word.hovered ? glowIntensity * 2 : glowIntensity;
      }

      // Text
      ctx.font = `${word.dragging ? "bold" : ""} ${word.size}px 'Georgia', serif`;
      ctx.fillStyle = word.hovered ? "#ffffff" : word.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Subtle background for readability
      const metrics = ctx.measureText(word.text);
      const padding = 8;
      ctx.fillStyle = word.hovered
        ? "rgba(0,0,0,0.6)"
        : `rgba(0,0,0,${0.3 + Math.sin(time + i) * 0.1})`;
      ctx.beginPath();
      ctx.roundRect(
        -metrics.width / 2 - padding,
        -word.size / 2 - padding / 2,
        metrics.width + padding * 2,
        word.size + padding,
        6
      );
      ctx.fill();

      // Text
      ctx.fillStyle = word.hovered ? "#ffffff" : word.color;
      ctx.fillText(word.text, 0, 0);

      ctx.restore();
    });

    // Draw connections between nearby words
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < state.words.length; i++) {
      for (let j = i + 1; j < state.words.length; j++) {
        const w1 = state.words[i];
        const w2 = state.words[j];
        const dx = w1.x - w2.x;
        const dy = w1.y - w2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(w1.x, w1.y);
          ctx.lineTo(w2.x, w2.y);
          ctx.globalAlpha = (1 - dist / 150) * 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  },
};

interface Word {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRotation: number;
  hovered: boolean;
  dragging: boolean;
}

// Event handlers for interactivity
export function setupMagneticPoetryEvents(canvas: HTMLCanvasElement) {
  const state = (canvas as any).__magneticPoetryState;
  if (!state) return;

  const getWordAt = (x: number, y: number): Word | null => {
    for (let i = state.words.length - 1; i >= 0; i--) {
      const word = state.words[i];
      const dx = x - word.x;
      const dy = y - word.y;
      if (Math.sqrt(dx * dx + dy * dy) < word.size * 1.5) {
        return word;
      }
    }
    return null;
  };

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    state.mouseX = x;
    state.mouseY = y;

    // Update hover states
    state.words.forEach((word: Word) => {
      const dx = x - word.x;
      const dy = y - word.y;
      word.hovered = Math.sqrt(dx * dx + dy * dy) < word.size * 1.5;
    });

    // Dragging
    if (state.isMouseDown && state.draggedWord) {
      state.draggedWord.x = x;
      state.draggedWord.y = y;
      state.draggedWord.vx = 0;
      state.draggedWord.vy = 0;
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const word = getWordAt(x, y);
    if (word) {
      state.isMouseDown = true;
      state.draggedWord = word;
      word.dragging = true;
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (state.draggedWord) {
      state.draggedWord.dragging = false;
      // Give a little throw velocity based on recent movement
      state.draggedWord.vx = (Math.random() - 0.5) * 2;
      state.draggedWord.vy = (Math.random() - 0.5) * 2;
    }
    state.isMouseDown = false;
    state.draggedWord = null;
  });

  canvas.addEventListener("mouseleave", () => {
    if (state.draggedWord) {
      state.draggedWord.dragging = false;
    }
    state.isMouseDown = false;
    state.draggedWord = null;
  });

  // Touch support
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

    const word = getWordAt(x, y);
    if (word) {
      state.isMouseDown = true;
      state.draggedWord = word;
      word.dragging = true;
    }
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!state.draggedWord) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

    state.draggedWord.x = x;
    state.draggedWord.y = y;
    state.mouseX = x;
    state.mouseY = y;
  });

  canvas.addEventListener("touchend", () => {
    if (state.draggedWord) {
      state.draggedWord.dragging = false;
    }
    state.isMouseDown = false;
    state.draggedWord = null;
  });
}
