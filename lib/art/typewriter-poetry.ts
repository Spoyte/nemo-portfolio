import { ArtGenerator, ParamConfig, SeededRandom } from "./core";

// Typewriter Poetry - Vintage mechanical typewriter creating generative poetry
// Features: realistic typewriter mechanics, ink variations, paper texture, carriage return

interface PoemLine {
  text: string;
  indent: number;
  style: "normal" | "emphasis" | "whisper";
}

interface TypewriterParams {
  seed: number;
  paperAge: number; // 0-100, yellowing
  ribbonInk: number; // 0-100, freshness
  typingSpeed: number; // 0-100
  chaos: number; // 0-100, misalignment
  poemLength: number; // 1-5 stanzas
}

const POEM_TEMPLATES = {
  opening: [
    "The {noun} {verb} in the {adjective} {place}",
    "When {noun} meets {noun} under {adjective} skies",
    "I remember the {noun} we {verb} together",
    "The {adjective} silence of {place}",
    "For {noun}, time moves like {liquid}",
  ],
  middle: [
    "and the {noun} {verb} without sound",
    "while {noun} watches from {place}",
    "as if {noun} could {verb} forever",
    "but {noun} remains {adjective}",
    "until {noun} becomes {abstract}",
  ],
  closing: [
    "This is how {noun} ends: {adjective}, alone.",
    "We {verb} the {noun} into {place}.",
    "The {noun} {verb}. The {noun} remains.",
    "In {place}, even {noun} learns to {verb}.",
    "Tomorrow, the {noun} will be {adjective} again.",
  ],
};

const WORD_BANK = {
  noun: [
    "shadow", "light", "memory", "ocean", "mountain", "star", "silence",
    "dream", "river", "wind", "heart", "time", "ghost", "flame",
    "garden", "clock", "mirror", "door", "bridge", "song", "rain",
    "leaf", "stone", "bird", "ship", "candle", "book", "window",
    "road", "cloud", "forest", "wave", "dust", "smoke", "glass",
  ],
  verb: [
    "waits", "falls", "rises", "drifts", "burns", "sleeps", "sings",
    "breaks", "flows", "lingers", "fades", "glows", "trembles", "whispers",
    "returns", "remembers", "floats", "dives", "dances", "cries",
    "melts", "grows", "flies", "sinks", "turns", "opens", "closes",
  ],
  adjective: [
    "ancient", "silent", "golden", "fragile", "endless", "faded", "wild",
    "tender", "hollow", "bright", "heavy", "empty", "slow", "soft",
    "bitter", "sweet", "distant", "near", "broken", "whole", "lost",
    "found", "secret", "open", "hidden", "patient", "eager", "still",
  ],
  place: [
    "darkness", "twilight", "morning", "evening", "winter", "summer",
    "garden", "cellar", "attic", "harbor", "meadow", "desert", "city",
    "forest", "cave", "shore", "valley", "sky", "room", "street",
    "field", "ruins", "temple", "cafe", "station", "park", "bridge",
  ],
  liquid: [
    "honey", "mercury", "ink", "wine", "rain", "molasses", "light",
    "shadows", "memory", "dreams", "smoke", "water", "glass", "silver",
  ],
  abstract: [
    "nothing", "everything", "eternity", "absence", "presence", "dust",
    "silence", "echo", "ghost", "myth", "truth", "beauty", "chaos",
  ],
};

function generatePoem(rng: SeededRandom, length: number): PoemLine[] {
  const lines: PoemLine[] = [];
  const stanzas = Math.max(1, Math.min(5, length));

  for (let s = 0; s < stanzas; s++) {
    // Opening line
    lines.push({
      text: fillTemplate(POEM_TEMPLATES.opening[rng.nextInt(0, POEM_TEMPLATES.opening.length - 1)], rng),
      indent: 0,
      style: "normal",
    });

    // Middle lines (1-2)
    const middleCount = rng.nextInt(1, 2);
    for (let m = 0; m < middleCount; m++) {
      lines.push({
        text: fillTemplate(POEM_TEMPLATES.middle[rng.nextInt(0, POEM_TEMPLATES.middle.length - 1)], rng),
        indent: 2,
        style: m === 0 ? "normal" : "whisper",
      });
    }

    // Closing line
    lines.push({
      text: fillTemplate(POEM_TEMPLATES.closing[rng.nextInt(0, POEM_TEMPLATES.closing.length - 1)], rng),
      indent: 0,
      style: "emphasis",
    });

    // Stanza break (except last)
    if (s < stanzas - 1) {
      lines.push({ text: "", indent: 0, style: "normal" });
    }
  }

  return lines;
}

function fillTemplate(template: string, rng: SeededRandom): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const words = WORD_BANK[key as keyof typeof WORD_BANK];
    if (words) {
      return words[rng.nextInt(0, words.length - 1)];
    }
    return `{${key}}`;
  });
}

function drawPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  age: number,
  rng: SeededRandom
): void {
  // Base paper color (aging from white to cream/yellow)
  const ageFactor = age / 100;
  const r = 255 - ageFactor * 25;
  const g = 255 - ageFactor * 20;
  const b = 255 - ageFactor * 35;

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, width, height);

  // Paper grain
  ctx.save();
  ctx.globalAlpha = 0.03 + ageFactor * 0.02;
  for (let i = 0; i < 5000; i++) {
    const x = rng.next() * width;
    const y = rng.next() * height;
    const size = rng.next() * 2;
    ctx.fillStyle = rng.next() > 0.5 ? "#000" : "#fff";
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();

  // Coffee stains / aging spots
  if (age > 30) {
    const stainCount = Math.floor((age - 30) / 10);
    ctx.save();
    for (let i = 0; i < stainCount; i++) {
      const x = rng.next() * width * 0.8 + width * 0.1;
      const y = rng.next() * height * 0.8 + height * 0.1;
      const radius = 20 + rng.next() * 40;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(139, 90, 43, ${0.05 + rng.next() * 0.05})`);
      gradient.addColorStop(0.7, `rgba(139, 90, 43, ${0.02 + rng.next() * 0.02})`);
      gradient.addColorStop(1, "rgba(139, 90, 43, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Page creases
  if (age > 50) {
    ctx.save();
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 + (age - 50) * 0.001})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const y = height * (0.3 + i * 0.25) + rng.next() * 20 - 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + rng.next() * 4 - 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawTypewriterCharacter(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  ribbonInk: number,
  chaos: number,
  rng: SeededRandom
): void {
  // Ink variation based on ribbon freshness
  const inkOpacity = 0.7 + (ribbonInk / 100) * 0.25 + rng.next() * 0.1;
  const inkVariation = rng.next();

  // Slight misalignment based on chaos
  const offsetX = (rng.next() - 0.5) * (chaos / 50);
  const offsetY = (rng.next() - 0.5) * (chaos / 50);
  const rotation = (rng.next() - 0.5) * (chaos / 200);

  ctx.save();
  ctx.translate(x + offsetX, y + offsetY);
  ctx.rotate(rotation);

  // Main character
  ctx.fillStyle = `rgba(30, 30, 30, ${inkOpacity})`;
  ctx.font = '18px "Courier New", Courier, monospace';
  ctx.textBaseline = "alphabetic";
  ctx.fillText(char, 0, 0);

  // Ink splatter for older ribbon
  if (ribbonInk < 60 && rng.next() < 0.1) {
    ctx.fillStyle = `rgba(30, 30, 30, ${inkOpacity * 0.5})`;
    const splatterX = rng.next() * 8 - 4;
    const splatterY = rng.next() * 8 - 4;
    const size = rng.next() * 2;
    ctx.beginPath();
    ctx.arc(splatterX, splatterY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Double strike effect (imperfect alignment)
  if (rng.next() < 0.05) {
    ctx.fillStyle = `rgba(30, 30, 30, ${inkOpacity * 0.3})`;
    ctx.fillText(char, 0.5, 0.5);
  }

  ctx.restore();
}

function drawTypedText(
  ctx: CanvasRenderingContext2D,
  lines: PoemLine[],
  startX: number,
  startY: number,
  lineHeight: number,
  ribbonInk: number,
  chaos: number,
  time: number,
  typingSpeed: number,
  rng: SeededRandom
): void {
  const charWidth = 11;
  const charsPerSecond = 5 + (typingSpeed / 100) * 15;
  const totalCharsToShow = Math.floor(time * charsPerSecond);

  let charCount = 0;
  let currentY = startY;

  for (const line of lines) {
    if (line.text === "") {
      // Empty line (stanza break)
      currentY += lineHeight * 0.5;
      continue;
    }

    const lineX = startX + line.indent * charWidth * 2;

    // Draw each character
    for (let i = 0; i < line.text.length; i++) {
      if (charCount >= totalCharsToShow) {
        // Typewriter cursor
        const cursorX = lineX + i * charWidth;
        ctx.save();
        ctx.fillStyle = "rgba(30, 30, 30, 0.8)";
        ctx.fillRect(cursorX, currentY - 14, 2, 18);
        ctx.restore();
        return;
      }

      const char = line.text[i];
      const charX = lineX + i * charWidth;

      // Style variations
      if (line.style === "emphasis") {
        ctx.save();
        ctx.font = 'bold 18px "Courier New", Courier, monospace';
      } else if (line.style === "whisper") {
        ctx.save();
        ctx.globalAlpha = 0.6;
      }

      drawTypewriterCharacter(ctx, char, charX, currentY, ribbonInk, chaos, rng);

      if (line.style === "emphasis" || line.style === "whisper") {
        ctx.restore();
      }

      charCount++;
    }

    currentY += lineHeight;
  }
}

export function renderTypewriterPoetry(
  ctx: CanvasRenderingContext2D,
  params: TypewriterParams,
  time: number = 0
): void {
  const width = 800;
  const height = 600;

  const rng = new SeededRandom(params.seed);

  // Generate poem once (deterministic from seed)
  const poem = generatePoem(rng, params.poemLength);

  // Clear and draw paper
  drawPaperTexture(ctx, width, height, params.paperAge, rng);

  // Draw page margins
  const marginLeft = 80;
  const marginTop = 100;
  const lineHeight = 28;

  // Draw typed text with animation
  drawTypedText(
    ctx,
    poem,
    marginLeft,
    marginTop,
    lineHeight,
    params.ribbonInk,
    params.chaos,
    time,
    params.typingSpeed,
    rng
  );

  // Draw page number at bottom
  const pageNum = String(params.seed % 100).padStart(2, "0");
  ctx.save();
  ctx.fillStyle = `rgba(30, 30, 30, ${0.4 + params.ribbonInk / 200})`;
  ctx.font = '14px "Courier New", Courier, monospace';
  ctx.textAlign = "center";
  ctx.fillText(`- ${pageNum} -`, width / 2, height - 50);
  ctx.restore();
}

export const typewriterPoetry: ArtGenerator = {
  name: "Typewriter Poetry",
  description: "Vintage mechanical typewriter creating generative poetry with realistic ink, paper texture, and mechanical imperfections",
  params: {
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 42,
    },
    paperAge: {
      name: "Paper Age",
      description: "How aged the paper appears (yellowing, stains, creases)",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 30,
    },
    ribbonInk: {
      name: "Ribbon Ink",
      description: "Freshness of the typewriter ribbon (affects darkness and consistency)",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 80,
    },
    typingSpeed: {
      name: "Typing Speed",
      description: "Speed of the typing animation",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 50,
    },
    chaos: {
      name: "Mechanical Chaos",
      description: "Imperfections in alignment (higher = more misaligned characters)",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: 15,
    },
    poemLength: {
      name: "Poem Length",
      description: "Number of stanzas to generate",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
    },
  },
  generate: renderTypewriterPoetry,
  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["animated", "retro", "minimal", "ordered"],
    created: "2026-03-12",
  },
};

export default typewriterPoetry;
