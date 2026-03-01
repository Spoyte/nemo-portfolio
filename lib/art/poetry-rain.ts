import { ArtGenerator, ParamConfig, ArtParams } from "./core";

// ============================================================================
// POETRY RAIN - Matrix-style falling text with lyrical/artistic content
// ============================================================================

export interface PoetryRainParams {
  textSource: string;
  fallSpeed: number;        // 1-10: how fast characters fall
  density: number;          // 1-10: how many columns of text
  trailLength: number;      // 3-20: length of character trails
  colorTheme: string;
  fontSize: number;         // 10-30: size of characters
  glowIntensity: number;    // 0-10: glow/bloom effect
  wind: number;             // -5 to 5: horizontal drift
  shuffleRate: number;      // 0-10: how often characters change
}

export const poetryRainDefaultParams: PoetryRainParams = {
  textSource: "poetry",
  fallSpeed: 5,
  density: 6,
  trailLength: 12,
  colorTheme: "matrix",
  fontSize: 16,
  glowIntensity: 5,
  wind: 0,
  shuffleRate: 3,
};

// Text content libraries
const TEXT_LIBRARIES = {
  poetry: [
    "the", "silent", "stars", "go", "by", "and", "still", "the", "world", "is", "beautiful",
    "i", "will", "dream", "of", "you", "tonight", "under", "moonlit", "skies",
    "time", "flows", "like", "water", "through", "my", "hands", "slipping", "away",
    "shadows", "dance", "upon", "the", "wall", "whispering", "secrets", "untold",
    "beneath", "the", "willow", "tree", "we", "rest", "our", "weary", "souls",
    "ocean", "waves", "crash", "against", "the", "shore", "endless", "motion",
    "fireflies", "flicker", "in", "the", "twilight", "glow", "summer", "evening",
    "mountains", "rise", "to", "touch", "the", "sky", "eternal", "silent", "giants",
    "rain", "falls", "softly", "on", "the", "roof", "a", "gentle", "melody",
    "dreams", "take", "flight", "on", "wings", "of", "hope", "into", "the", "night",
    "memories", "linger", "like", "perfume", "in", "an", "empty", "room",
    "the", "wind", "sings", "songs", "of", "far", "away", "places", "unknown",
  ],
  code: [
    "function", "const", "let", "var", "return", "if", "else", "for", "while",
    "class", "extends", "import", "export", "from", "async", "await", "promise",
    "map", "filter", "reduce", "=>", "{}", "[]", "();", "===", "!==", "&&", "||",
    "true", "false", "null", "undefined", "this", "new", "try", "catch", "throw",
    "0x1F", "0xFF", "NaN", "Infinity", "Math.PI", "console.log", "debugger",
    "git", "commit", "push", "pull", "merge", "branch", "main", "origin",
    "npm", "install", "build", "start", "test", "lint", "deploy", "docker",
  ],
  symbols: [
    "★", "☆", "✦", "✧", "✪", "✯", "✰", "⚝", "⚹", "✵", "✶", "✷", "✸",
    "♠", "♥", "♦", "♣", "♪", "♫", "♬", "♭", "♮", "♯", "ø", "∞", "∂", "∫",
    "∆", "∇", "∑", "∏", "√", "∝", "∠", "∧", "∨", "∩", "∪", "⊂", "⊃", "∈",
    "∀", "∃", "∄", "∴", "∵", "≈", "≠", "≡", "≤", "≥", "«", "»", "†", "‡",
    "☀", "☁", "☂", "☃", "☄", "★", "☆", "☉", "☊", "☋", "☌", "☍", "☎",
    "✂", "✈", "✉", "✌", "✍", "✎", "✏", "✐", "✑", "✒", "✓", "✔", "✕",
  ],
  kanji: [
    "雨", "雪", "風", "雲", "雷", "電", "光", "影", "夢", "想", "心", "愛",
    "時", "空", "道", "路", "山", "川", "海", "森", "花", "鳥", "月", "星",
    "春", "夏", "秋", "冬", "朝", "昼", "夕", "夜", "東", "西", "南", "北",
    "紅", "青", "白", "黒", "金", "銀", "炎", "水", "土", "木", "鉄", "石",
    "無", "有", "真", "幻", "生", "死", "過", "未", "今", "永", "遠", "一",
    "人", "天", "地", "神", "魔", "龍", "剣", "弓", "詩", "歌", "舞", "画",
  ],
};

// Color themes
const COLOR_THEMES: Record<string, { head: string; body: string[]; glow: string }> = {
  matrix: {
    head: "#FFFFFF",
    body: ["#00FF41", "#00CC33", "#009922", "#006611"],
    glow: "rgba(0, 255, 65, 0.5)",
  },
  amber: {
    head: "#FFFFFF",
    body: ["#FFB000", "#CC8C00", "#996900", "#664600"],
    glow: "rgba(255, 176, 0, 0.5)",
  },
  ocean: {
    head: "#E0F7FF",
    body: ["#00D4FF", "#00A3CC", "#007299", "#004166"],
    glow: "rgba(0, 212, 255, 0.5)",
  },
  fire: {
    head: "#FFFFFF",
    body: ["#FF4500", "#CC3700", "#992900", "#661B00"],
    glow: "rgba(255, 69, 0, 0.5)",
  },
  ghost: {
    head: "#FFFFFF",
    body: ["#C0C0C0", "#909090", "#606060", "#404040"],
    glow: "rgba(255, 255, 255, 0.3)",
  },
  rainbow: {
    head: "#FFFFFF",
    body: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
    glow: "rgba(255, 255, 255, 0.4)",
  },
};

interface RainDrop {
  x: number;
  y: number;
  chars: string[];
  speeds: number[];
  column: number;
  hue: number;
}

function getRandomChar(source: string): string {
  if (source === "mixed") {
    const sources = ["poetry", "code", "symbols", "kanji"] as const;
    source = sources[Math.floor(Math.random() * sources.length)];
  }
  const lib = TEXT_LIBRARIES[source as keyof typeof TEXT_LIBRARIES];
  if (!lib) return "?";
  
  const word = lib[Math.floor(Math.random() * lib.length)];
  // Return a random character from the word, or the whole word for short ones
  if (word.length <= 2 || Math.random() > 0.7) {
    return word;
  }
  return word[Math.floor(Math.random() * word.length)];
}

function createDrop(column: number, columnWidth: number, fontSize: number, params: PoetryRainParams, canvasHeight: number): RainDrop {
  const trailLength = Math.max(3, Math.min(20, params.trailLength));
  const chars: string[] = [];
  const speeds: number[] = [];
  
  for (let i = 0; i < trailLength; i++) {
    chars.push(getRandomChar(params.textSource));
    speeds.push(0.5 + Math.random() * 0.5);
  }
  
  return {
    x: column * columnWidth + columnWidth / 2,
    y: -Math.random() * canvasHeight * 0.5, // Start above screen at random heights
    chars,
    speeds,
    column,
    hue: Math.random() * 360,
  };
}

export function renderPoetryRain(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
): void {
  const p = params as unknown as PoetryRainParams;
  const { width, height } = ctx.canvas;
  
  // Clear with fade effect for trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, width, height);
  
  const fontSize = Math.max(10, Math.min(30, p.fontSize || 16));
  const density = Math.max(1, Math.min(10, p.density || 6));
  const numColumns = Math.floor((width / fontSize) * (density / 5));
  const columnWidth = width / numColumns;
  
  // Get or initialize drops from canvas data attribute
  const canvas = ctx.canvas as HTMLCanvasElement & { _rainDrops?: RainDrop[]; _lastTime?: number };
  if (!canvas._rainDrops) {
    canvas._rainDrops = [];
    // Initialize drops
    for (let i = 0; i < numColumns; i++) {
      if (Math.random() < 0.7) {
        canvas._rainDrops.push(createDrop(i, columnWidth, fontSize, p, height));
      }
    }
  }
  
  const drops = canvas._rainDrops;
  const theme = COLOR_THEMES[p.colorTheme || "matrix"] || COLOR_THEMES.matrix;
  const fallSpeed = Math.max(1, Math.min(10, p.fallSpeed || 5));
  const wind = Math.max(-5, Math.min(5, p.wind || 0));
  const shuffleRate = Math.max(0, Math.min(10, p.shuffleRate || 3));
  const glowIntensity = Math.max(0, Math.min(10, p.glowIntensity || 5));
  
  // Setup font
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Apply glow effect
  if (glowIntensity > 0) {
    ctx.shadowBlur = glowIntensity * 2;
    ctx.shadowColor = theme.glow;
  }
  
  // Update and draw each drop
  drops.forEach((drop, dropIndex) => {
    // Update position
    const speedMultiplier = fallSpeed * 0.5;
    drop.y += speedMultiplier;
    drop.x += wind * 0.3;
    
    // Wrap around horizontally
    if (drop.x < 0) drop.x += width;
    if (drop.x > width) drop.x -= width;
    
    // Randomly shuffle characters
    if (Math.random() < shuffleRate * 0.01) {
      const idx = Math.floor(Math.random() * drop.chars.length);
      drop.chars[idx] = getRandomChar(p.textSource || "poetry");
    }
    
    // Draw trail
    drop.chars.forEach((char, i) => {
      const charY = drop.y - i * fontSize * 0.9;
      
      // Skip if off screen
      if (charY < -fontSize || charY > height + fontSize) return;
      
      // Determine color based on position in trail
      let color: string;
      if (i === 0) {
        // Head character - brightest
        color = theme.head;
        ctx.globalAlpha = 1;
      } else {
        // Body characters - gradient
        const bodyIndex = Math.min(i - 1, theme.body.length - 1);
        color = theme.body[bodyIndex] || theme.body[theme.body.length - 1];
        ctx.globalAlpha = Math.max(0.2, 1 - i / drop.chars.length);
      }
      
      // Rainbow theme uses dynamic hues
      if (p.colorTheme === "rainbow") {
        const hue = (drop.hue + i * 30 + time * 0.05) % 360;
        color = i === 0 ? "#FFFFFF" : `hsl(${hue}, 80%, ${60 - i * 8}%)`;
      }
      
      ctx.fillStyle = color;
      ctx.fillText(char, drop.x, charY);
    });
    
    // Reset drop if it falls off screen
    if (drop.y - drop.chars.length * fontSize > height) {
      const newDrop = createDrop(drop.column, columnWidth, fontSize, p, height);
      drops[dropIndex] = newDrop;
    }
  });
  
  // Occasionally spawn new drops
  if (drops.length < numColumns * 0.8 && Math.random() < 0.05) {
    const availableColumns = Array.from({ length: numColumns }, (_, i) => i)
      .filter(c => !drops.some(d => d.column === c));
    if (availableColumns.length > 0) {
      const col = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      drops.push(createDrop(col, columnWidth, fontSize, p, height));
    }
  }
  
  // Reset context
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

// ============================================================================
// ART GENERATOR EXPORT
// ============================================================================

export const poetryRainParamsConfig: ParamConfig[] = [
  {
    name: "textSource",
    type: "select",
    options: ["poetry", "code", "symbols", "kanji", "mixed"],
    default: "poetry",
  },
  {
    name: "colorTheme",
    type: "select",
    options: ["matrix", "amber", "ocean", "fire", "ghost", "rainbow"],
    default: "matrix",
  },
  {
    name: "fallSpeed",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    default: 5,
  },
  {
    name: "density",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    default: 6,
  },
  {
    name: "trailLength",
    type: "range",
    min: 3,
    max: 20,
    step: 1,
    default: 12,
  },
  {
    name: "fontSize",
    type: "range",
    min: 10,
    max: 30,
    step: 2,
    default: 16,
  },
  {
    name: "glowIntensity",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    default: 5,
  },
  {
    name: "wind",
    type: "range",
    min: -5,
    max: 5,
    step: 1,
    default: 0,
  },
  {
    name: "shuffleRate",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    default: 3,
  },
];

export const poetryRain: ArtGenerator = {
  name: "Poetry Rain",
  description: "Matrix-style cascading text with lyrical, code, and symbolic content streams",
  params: {
    textSource: { name: "textSource", type: "select", options: ["poetry", "code", "symbols", "kanji", "mixed"], default: "poetry" },
    colorTheme: { name: "colorTheme", type: "select", options: ["matrix", "amber", "ocean", "fire", "ghost", "rainbow"], default: "matrix" },
    fallSpeed: { name: "fallSpeed", type: "range", min: 1, max: 10, step: 1, default: 5 },
    density: { name: "density", type: "range", min: 1, max: 10, step: 1, default: 6 },
    trailLength: { name: "trailLength", type: "range", min: 3, max: 20, step: 1, default: 12 },
    fontSize: { name: "fontSize", type: "range", min: 10, max: 30, step: 2, default: 16 },
    glowIntensity: { name: "glowIntensity", type: "range", min: 0, max: 10, step: 1, default: 5 },
    wind: { name: "wind", type: "range", min: -5, max: 5, step: 1, default: 0 },
    shuffleRate: { name: "shuffleRate", type: "range", min: 0, max: 10, step: 1, default: 3 },
  },
  generate: renderPoetryRain,
  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["animated", "futuristic", "abstract", "monochrome"],
    created: "2026-03-01",
  },
};
