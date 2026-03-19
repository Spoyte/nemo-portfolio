import { ArtGenerator } from "./core";

/**
 * Semantic Rain - Text as Weather
 * 
 * Words fall like raindrops, clustering by semantic similarity.
 * When related words collide, they bond and form phrases.
 * Unrelated words bounce apart.
 * 
 * The result: emergent poetry from physics and meaning.
 * 
 * Features:
 * - Word particles with semantic "charge" (positive, negative, neutral)
 * - Collision-based bonding for related concepts
 * - Wind affects word drift
 * - Accumulation creates layered text landscapes
 * - Evaporation slowly clears old words
 */

// Word banks organized by semantic charge
const WORD_BANKS = {
  positive: {
    emotions: ["joy", "hope", "love", "peace", "bliss", "wonder", "grace", "light"],
    nature: ["bloom", "dawn", "meadow", "river", "starlight", "petal", "breeze", "sunrise"],
    abstract: ["harmony", "beauty", "truth", "dream", "magic", "serenity", "euphoria", "radiance"],
  },
  negative: {
    emotions: ["sorrow", "longing", "melancholy", "solitude", "shadow", "silence", "distance", "fading"],
    nature: ["twilight", "fog", "winter", "dusk", "storm", "frost", "tide", "abyss"],
    abstract: ["mystery", "eternity", "infinity", "void", "echo", "memory", "ghost", "twilight"],
  },
  neutral: {
    concepts: ["time", "space", "form", "pattern", "rhythm", "motion", "stillness", "change"],
    elements: ["water", "air", "earth", "fire", "crystal", "dust", "ash", "ember"],
    perception: ["sight", "sound", "touch", "thought", "moment", "glance", "whisper", "breath"],
  },
};

// Color palettes for each charge
const CHARGE_COLORS = {
  positive: ["#ffd700", "#ffec8b", "#fff8dc", "#f0e68c", "#ffe4b5"],
  negative: ["#708090", "#778899", "#b0c4de", "#c0c0c0", "#a9a9a9"],
  neutral: ["#e6e6fa", "#f5f5f5", "#fffafa", "#f0f8ff", "#f5fffa"],
};

// Background gradients
const BACKGROUNDS = {
  positive: ["#1a1a2e", "#16213e", "#0f3460"],
  negative: ["#0d0d0d", "#1a1a1a", "#2d2d2d"],
  neutral: ["#0f1419", "#1a1f2e", "#252b3d"],
};

interface RainWord {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: "positive" | "negative" | "neutral";
  category: string;
  size: number;
  opacity: number;
  bonded: boolean;
  bondPartner: RainWord | null;
  age: number;
  rotation: number;
  vRotation: number;
  settled: boolean;
}

interface Bond {
  word1: RainWord;
  word2: RainWord;
  strength: number;
  age: number;
}

// Check if two categories are semantically related
function areRelated(cat1: string, cat2: string): boolean {
  const relatedGroups = [
    ["emotions", "emotions"],
    ["nature", "nature"],
    ["abstract", "abstract"],
    ["concepts", "concepts"],
    ["elements", "elements"],
    ["perception", "perception"],
    ["emotions", "abstract"],
    ["nature", "elements"],
    ["concepts", "perception"],
  ];
  return relatedGroups.some(([a, b]) => 
    (cat1 === a && cat2 === b) || (cat1 === b && cat2 === a)
  );
}

export const semanticRain: ArtGenerator = {
  name: "Semantic Rain",
  description: "Words fall like raindrops, bonding when semantically related. Emergent poetry from physics and meaning.",
  params: {
    mood: {
      name: "Mood",
      type: "select",
      default: "mixed",
      options: ["positive", "negative", "neutral", "mixed"],
    },
    intensity: {
      name: "Rain Intensity",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 5,
    },
    wind: {
      name: "Wind",
      type: "range",
      min: -3,
      max: 3,
      step: 0.5,
      default: 0.5,
    },
    gravity: {
      name: "Gravity",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1.5,
    },
    evaporation: {
      name: "Evaporation Rate",
      type: "range",
      min: 0,
      max: 0.01,
      step: 0.001,
      default: 0.002,
    },
  },

  generate: (ctx, params, time) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const mood = params.mood as string;
    const intensity = params.intensity as number;
    const wind = params.wind as number;
    const gravity = params.gravity as number;
    const evaporation = params.evaporation as number;

    // Initialize state
    if (!ctx._state) {
      ctx._state = {
        words: [] as RainWord[],
        bonds: [] as Bond[],
        spawnTimer: 0,
        mood: mood,
        mouseX: width / 2,
        mouseY: height / 2,
        mouseActive: false,
      };
    }
    const state = ctx._state as {
      words: RainWord[];
      bonds: Bond[];
      spawnTimer: number;
      mood: string;
      mouseX: number;
      mouseY: number;
      mouseActive: boolean;
    };

    // Determine which charges to use based on mood
    const getCharges = (): ("positive" | "negative" | "neutral")[] => {
      switch (mood) {
        case "positive": return ["positive"];
        case "negative": return ["negative"];
        case "neutral": return ["neutral"];
        default: return ["positive", "negative", "neutral"];
      }
    };

    // Draw background gradient
    const bgColors = BACKGROUNDS[mood as keyof typeof BACKGROUNDS] || BACKGROUNDS.neutral;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, bgColors[0]);
    gradient.addColorStop(0.5, bgColors[1]);
    gradient.addColorStop(1, bgColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Spawn new words
    state.spawnTimer += 1;
    const spawnRate = Math.max(10, 60 - intensity * 5);
    if (state.spawnTimer > spawnRate && state.words.length < 80) {
      state.spawnTimer = 0;
      const charges = getCharges();
      const charge = charges[Math.floor(Math.random() * charges.length)];
      const bank = WORD_BANKS[charge];
      const categories = Object.keys(bank);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const words = bank[category as keyof typeof bank];
      const text = words[Math.floor(Math.random() * words.length)];
      
      state.words.push({
        text,
        x: Math.random() * width,
        y: -30,
        vx: (Math.random() - 0.5) * 0.5 + wind * 0.1,
        vy: Math.random() * 2 + 1,
        charge,
        category,
        size: 14 + Math.random() * 8,
        opacity: 1,
        bonded: false,
        bondPartner: null,
        age: 0,
        rotation: (Math.random() - 0.5) * 0.2,
        vRotation: (Math.random() - 0.5) * 0.01,
        settled: false,
      });
    }

    // Update and draw words
    const wordsToRemove: number[] = [];
    
    state.words.forEach((word, i) => {
      word.age += 1;
      
      // Physics
      if (!word.settled) {
        word.vy += gravity * 0.1;
        word.vx += wind * 0.02;
        word.vx *= 0.99; // Air resistance
        word.vy *= 0.99;
        
        word.x += word.vx;
        word.y += word.vy;
        word.rotation += word.vRotation;

        // Floor collision
        if (word.y > height - 30) {
          word.y = height - 30;
          word.vy *= -0.3;
          word.vx *= 0.8;
          word.settled = true;
        }

        // Wall wrapping
        if (word.x < -50) word.x = width + 50;
        if (word.x > width + 50) word.x = -50;
      }

      // Mouse interaction - repel words
      if (state.mouseActive) {
        const dx = word.x - state.mouseX;
        const dy = word.y - state.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 2;
          word.vx += (dx / dist) * force;
          word.vy += (dy / dist) * force;
          word.settled = false;
        }
      }

      // Evaporation
      if (word.settled) {
        word.opacity -= evaporation;
      }
      if (word.opacity <= 0) {
        wordsToRemove.push(i);
      }

      // Draw word
      const colors = CHARGE_COLORS[word.charge];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.save();
      ctx.translate(word.x, word.y);
      ctx.rotate(word.rotation);
      
      // Glow for bonded words
      if (word.bonded) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
      }
      
      ctx.fillStyle = color;
      ctx.font = `${word.size}px 'SF Pro Text', -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = word.opacity;
      ctx.fillText(word.text, 0, 0);
      
      // Subtle underline for settled words
      if (word.settled) {
        ctx.globalAlpha = word.opacity * 0.3;
        ctx.fillRect(-word.text.length * word.size * 0.3, word.size * 0.6, 
                     word.text.length * word.size * 0.6, 1);
      }
      
      ctx.restore();
    });

    // Check for bonds between nearby words
    state.bonds = [];
    for (let i = 0; i < state.words.length; i++) {
      for (let j = i + 1; j < state.words.length; j++) {
        const w1 = state.words[i];
        const w2 = state.words[j];
        
        const dx = w1.x - w2.x;
        const dy = w1.y - w2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Bond if close and semantically related
        if (dist < 60 && areRelated(w1.category, w2.category) && !w1.bonded && !w2.bonded) {
          state.bonds.push({ word1: w1, word2: w2, strength: 1 - dist / 60, age: 0 });
          w1.bonded = true;
          w2.bonded = true;
          w1.bondPartner = w2;
          w2.bondPartner = w1;
          
          // Gentle pull toward each other
          const pull = 0.02;
          w1.vx -= dx * pull;
          w1.vy -= dy * pull;
          w2.vx += dx * pull;
          w2.vy += dy * pull;
        }
      }
    }

    // Draw bonds
    state.bonds.forEach(bond => {
      bond.age += 1;
      const colors1 = CHARGE_COLORS[bond.word1.charge];
      const colors2 = CHARGE_COLORS[bond.word2.charge];
      const color1 = colors1[0];
      const color2 = colors2[0];
      
      ctx.save();
      ctx.strokeStyle = color1;
      ctx.globalAlpha = bond.strength * 0.4 * Math.min(1, bond.age / 30);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      
      ctx.beginPath();
      ctx.moveTo(bond.word1.x, bond.word1.y);
      ctx.lineTo(bond.word2.x, bond.word2.y);
      ctx.stroke();
      
      // Draw combined word hint at midpoint
      if (bond.age > 30) {
        const midX = (bond.word1.x + bond.word2.x) / 2;
        const midY = (bond.word1.y + bond.word2.y) / 2;
        ctx.fillStyle = color2;
        ctx.font = "10px 'SF Pro Text', sans-serif";
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([]);
        ctx.fillText("✦", midX, midY);
      }
      
      ctx.restore();
    });

    // Remove evaporated words (in reverse order)
    for (let i = wordsToRemove.length - 1; i >= 0; i--) {
      state.words.splice(wordsToRemove[i], 1);
    }

    // Draw atmospheric effects
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = mood === "positive" ? "#ffd700" : mood === "negative" ? "#4a4a4a" : "#ffffff";
    for (let i = 0; i < 5; i++) {
      const x = (time * 10 + i * 100) % (width + 200) - 100;
      const y = Math.sin(time * 0.5 + i) * 50 + height / 2;
      ctx.beginPath();
      ctx.arc(x, y, 100 + i * 20, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Stats overlay
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'SF Pro Text', sans-serif";
    ctx.globalAlpha = 0.4;
    ctx.textAlign = "left";
    ctx.fillText(`${state.words.length} words • ${state.bonds.length} bonds`, 20, height - 20);
    ctx.globalAlpha = 1;

    state.mouseActive = false;
  },

  onMouseMove: (ctx, x, y) => {
    const state = ctx._state as { mouseX: number; mouseY: number; mouseActive: boolean };
    if (state) {
      state.mouseX = x;
      state.mouseY = y;
      state.mouseActive = true;
    }
  },

  onClick: (ctx, x, y) => {
    const state = ctx._state as { words: RainWord[] };
    if (!state) return;
    
    // Add burst of words at click location
    const charges: ("positive" | "negative" | "neutral")[] = ["positive", "negative", "neutral"];
    for (let i = 0; i < 5; i++) {
      const charge = charges[Math.floor(Math.random() * charges.length)];
      const bank = WORD_BANKS[charge];
      const categories = Object.keys(bank);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const words = bank[category as keyof typeof bank];
      const text = words[Math.floor(Math.random() * words.length)];
      
      state.words.push({
        text,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        charge,
        category,
        size: 12 + Math.random() * 6,
        opacity: 1,
        bonded: false,
        bondPartner: null,
        age: 0,
        rotation: (Math.random() - 0.5) * 0.5,
        vRotation: (Math.random() - 0.5) * 0.02,
        settled: false,
      });
    }
  },

  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["text", "physics", "animated", "interactive", "generative"],
    created: "2026-03-19",
  },
};
