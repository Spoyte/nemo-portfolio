import { ArtGenerator, ParamConfig, ArtParams } from "./core";

// ============================================================================
// CODE GARDEN - Organic growth of code syntax as digital flora
// ============================================================================

export interface CodeGardenParams {
  language: string;         // programming language theme
  growthSpeed: number;      // 1-10: how fast plants grow
  plantDensity: number;     // 1-10: number of plants
  complexity: number;       // 1-10: branching complexity
  colorScheme: string;      // visual theme
  season: string;           // growth season effect
  windStrength: number;     // 0-10: movement amount
  bloomRate: number;        // 0-10: flowering frequency
  decayEnabled: boolean;    // plants fade and regrow
}

export const codeGardenDefaultParams: CodeGardenParams = {
  language: "javascript",
  growthSpeed: 5,
  plantDensity: 6,
  complexity: 5,
  colorScheme: "synthwave",
  season: "spring",
  windStrength: 3,
  bloomRate: 4,
  decayEnabled: true,
};

// Code syntax elements by language
const CODE_VOCABULARIES: Record<string, { keywords: string[]; symbols: string[]; types: string[]; comments: string[] }> = {
  javascript: {
    keywords: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "async", "await", "import", "export", "class", "extends"],
    symbols: ["=>", "===", "!==", "&&", "||", "++", "--", "...", "?.", "??", "{}", "[]", "()"],
    types: ["string", "number", "boolean", "array", "object", "promise", "undefined", "null"],
    comments: ["// TODO", "// FIXME", "// HACK", "// NOTE", "/* */", "///"],
  },
  python: {
    keywords: ["def", "class", "return", "if", "elif", "else", "for", "while", "import", "from", "async", "await", "with", "try", "except"],
    symbols: ["==", "!=", "and", "or", "not", "in", "is", "+=", "-=" "*=" "**", "//", "[]", "{}"],
    types: ["str", "int", "float", "list", "dict", "tuple", "None", "True", "False"],
    comments: ["# TODO", "# FIXME", "# HACK", "# NOTE", '""" """', "''' '''"],
  },
  rust: {
    keywords: ["fn", "let", "mut", "const", "struct", "enum", "impl", "trait", "match", "if", "else", "for", "while", "use", "mod"],
    symbols: ["->", "=>", "::", "..", "...", "==", "!=", "&&", "||", "|", "&", "<>", "{}", "[]"],
    types: ["i32", "u64", "f64", "String", "Vec", "Option", "Result", "bool", "char"],
    comments: ["// TODO", "// FIXME", "// HACK", "// NOTE", "///", "//!"],
  },
  haskell: {
    keywords: ["data", "type", "newtype", "class", "instance", "where", "let", "in", "case", "of", "if", "then", "else", "do", "module"],
    symbols: ["->", "=>", "::", "|", "\\", "<-", "=", "$", ".", "<>", "++", "!!", "[]"],
    types: ["Int", "Integer", "Float", "Double", "Bool", "Char", "String", "Maybe", "Either"],
    comments: ["-- TODO", "-- FIXME", "-- HACK", "-- NOTE", "{- -}", "-- |"],
  },
  lisp: {
    keywords: ["defun", "defvar", "defmacro", "lambda", "let", "if", "cond", "when", "unless", "loop", "recur", "quote", "eval"],
    symbols: ["'", "`", ",", ",@", "#", "##", "'()", "#()", "~", "~@", "->", "->>"],
    types: ["t", "nil", "list", "vector", "hash-map", "symbol", "keyword", "string"],
    comments: ["; TODO", "; FIXME", "; HACK", "; NOTE", "#| |#", ";;"],
  },
  sql: {
    keywords: ["SELECT", "FROM", "WHERE", "JOIN", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "INDEX"],
    symbols: ["=", "!=", "<>", "<", ">", "<=", ">=", "LIKE", "IN", "BETWEEN", "AND", "OR", "NOT", "*", "%", "_"],
    types: ["INT", "VARCHAR", "TEXT", "DATE", "DATETIME", "BOOLEAN", "FLOAT", "DECIMAL", "NULL"],
    comments: ["-- TODO", "-- FIXME", "/* */", "#"],
  },
};

// Color schemes
const COLOR_SCHEMES: Record<string, { stem: string[]; leaf: string[]; flower: string[]; bg: string }> = {
  synthwave: {
    stem: ["#FF00FF", "#00FFFF", "#FF0080", "#8000FF"],
    leaf: ["#00FF99", "#00CCFF", "#FF66CC", "#CC99FF"],
    flower: ["#FFFF00", "#FF6600", "#FF0066", "#FFFFFF"],
    bg: "#0a0a1a",
  },
  forest: {
    stem: ["#2d5016", "#3a6b1c", "#1a3d0a", "#4a7c23"],
    leaf: ["#4ade80", "#22c55e", "#16a34a", "#15803d"],
    flower: ["#f472b6", "#fb7185", "#fcd34d", "#a78bfa"],
    bg: "#052e16",
  },
  ocean: {
    stem: ["#0ea5e9", "#0284c7", "#0369a1", "#075985"],
    leaf: ["#22d3ee", "#06b6d4", "#0891b2", "#0e7490"],
    flower: ["#f0abfc", "#e879f9", "#c084fc", "#a78bfa"],
    bg: "#0c4a6e",
  },
  autumn: {
    stem: ["#7c2d12", "#9a3412", "#c2410c", "#ea580c"],
    leaf: ["#fbbf24", "#f59e0b", "#d97706", "#b45309"],
    flower: ["#dc2626", "#b91c1c", "#991b1b", "#f87171"],
    bg: "#451a03",
  },
  monochrome: {
    stem: ["#525252", "#737373", "#404040", "#262626"],
    leaf: ["#a3a3a3", "#d4d4d4", "#e5e5e5", "#f5f5f5"],
    flower: ["#ffffff", "#fafafa", "#f0f0f0", "#e8e8e8"],
    bg: "#171717",
  },
  terminal: {
    stem: ["#22c55e", "#16a34a", "#15803d", "#166534"],
    leaf: ["#4ade80", "#86efac", "#bbf7d0", "#dcfce7"],
    flower: ["#facc15", "#fde047", "#fef08a", "#fef9c3"],
    bg: "#0f172a",
  },
};

// Season modifiers
const SEASON_MODIFIERS: Record<string, { growthRate: number; bloomChance: number; decayRate: number; colorShift: number }> = {
  spring: { growthRate: 1.2, bloomChance: 1.3, decayRate: 0.8, colorShift: 0 },
  summer: { growthRate: 1.5, bloomChance: 1.0, decayRate: 1.2, colorShift: 20 },
  autumn: { growthRate: 0.9, bloomChance: 0.7, decayRate: 1.5, colorShift: 40 },
  winter: { growthRate: 0.5, bloomChance: 0.3, decayRate: 0.5, colorShift: 180 },
};

interface PlantNode {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  depth: number;
  maxDepth: number;
  text: string;
  type: "stem" | "leaf" | "flower" | "root";
  children: PlantNode[];
  age: number;
  maxAge: number;
  opacity: number;
  hue: number;
}

interface CodePlant {
  rootX: number;
  rootY: number;
  nodes: PlantNode[];
  vocabulary: { keywords: string[]; symbols: string[]; types: string[]; comments: string[] };
  growthPhase: number;
  totalNodes: number;
  maxNodes: number;
  colorScheme: typeof COLOR_SCHEMES.synthwave;
  windOffset: number;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomText(vocab: CodePlant["vocabulary"], type: PlantNode["type"]): string {
  switch (type) {
    case "stem":
      return getRandomElement(vocab.keywords);
    case "leaf":
      return Math.random() > 0.5 ? getRandomElement(vocab.symbols) : getRandomElement(vocab.types);
    case "flower":
      return getRandomElement(vocab.comments);
    default:
      return "...";
  }
}

function createPlantNode(
  x: number,
  y: number,
  angle: number,
  depth: number,
  maxDepth: number,
  vocab: CodePlant["vocabulary"],
  type: PlantNode["type"] = "stem"
): PlantNode {
  const length = type === "stem" ? 20 + Math.random() * 30 : 10 + Math.random() * 15;
  const width = Math.max(1, (maxDepth - depth) * 1.5);
  
  return {
    x,
    y,
    angle,
    length,
    width,
    depth,
    maxDepth,
    text: getRandomText(vocab, type),
    type,
    children: [],
    age: 0,
    maxAge: 100 + Math.random() * 100,
    opacity: 0,
    hue: Math.random() * 60,
  };
}

function createCodePlant(
  x: number,
  y: number,
  vocab: CodePlant["vocabulary"],
  scheme: typeof COLOR_SCHEMES.synthwave,
  maxComplexity: number
): CodePlant {
  const rootNode = createPlantNode(x, y, -Math.PI / 2, 0, maxComplexity, vocab, "root");
  
  return {
    rootX: x,
    rootY: y,
    nodes: [rootNode],
    vocabulary: vocab,
    growthPhase: 0,
    totalNodes: 1,
    maxNodes: 20 + maxComplexity * 15,
    colorScheme: scheme,
    windOffset: Math.random() * Math.PI * 2,
  };
}

function growPlant(plant: CodePlant, growthSpeed: number, bloomRate: number): void {
  if (plant.totalNodes >= plant.maxNodes) return;
  
  // Find nodes that can grow
  const growableNodes = plant.nodes.filter(n => n.depth < n.maxDepth && n.children.length < 3);
  if (growableNodes.length === 0) return;
  
  // Growth chance based on speed
  const growthChance = growthSpeed * 0.02;
  
  growableNodes.forEach(node => {
    if (Math.random() > growthChance) return;
    if (node.children.length >= 2 + Math.random()) return;
    
    // Calculate new position
    const spreadAngle = Math.PI / 4;
    const baseAngle = node.angle + (Math.random() - 0.5) * spreadAngle;
    
    const endX = node.x + Math.cos(baseAngle) * node.length;
    const endY = node.y + Math.sin(baseAngle) * node.length;
    
    // Determine node type
    let newType: PlantNode["type"] = "stem";
    if (node.depth >= node.maxDepth - 1) {
      newType = Math.random() < bloomRate * 0.1 ? "flower" : "leaf";
    } else if (node.depth > node.maxDepth * 0.6) {
      newType = Math.random() < 0.4 ? "leaf" : "stem";
    }
    
    const newNode = createPlantNode(endX, endY, baseAngle, node.depth + 1, node.maxDepth, plant.vocabulary, newType);
    node.children.push(newNode);
    plant.nodes.push(newNode);
    plant.totalNodes++;
  });
}

function updateNodes(plant: CodePlant, deltaTime: number, decayEnabled: boolean): void {
  plant.nodes.forEach(node => {
    // Age the node
    node.age += deltaTime;
    
    // Fade in
    if (node.opacity < 1) {
      node.opacity = Math.min(1, node.opacity + deltaTime * 0.02);
    }
    
    // Decay if enabled and old
    if (decayEnabled && node.age > node.maxAge) {
      node.opacity -= deltaTime * 0.005;
    }
  });
  
  // Remove fully decayed nodes and their children
  if (decayEnabled) {
    plant.nodes = plant.nodes.filter(n => n.opacity > 0);
    plant.totalNodes = plant.nodes.length;
    
    // Reset if all dead
    if (plant.nodes.length === 0 || (plant.nodes.length === 1 && plant.nodes[0].opacity <= 0.1)) {
      const rootNode = createPlantNode(plant.rootX, plant.rootY, -Math.PI / 2, 0, 5 + Math.random() * 5, plant.vocabulary, "root");
      plant.nodes = [rootNode];
      plant.totalNodes = 1;
    }
  }
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: PlantNode,
  plant: CodePlant,
  windStrength: number,
  time: number
): void {
  if (node.opacity <= 0) return;
  
  const scheme = plant.colorScheme;
  let colors: string[];
  
  switch (node.type) {
    case "stem":
      colors = scheme.stem;
      break;
    case "leaf":
      colors = scheme.leaf;
      break;
    case "flower":
      colors = scheme.flower;
      break;
    default:
      colors = scheme.stem;
  }
  
  const color = colors[Math.floor(node.hue / 60) % colors.length];
  
  // Apply wind effect
  const wind = Math.sin(time * 0.001 + plant.windOffset + node.depth * 0.5) * windStrength * 0.02 * node.depth;
  const actualAngle = node.angle + wind;
  
  const endX = node.x + Math.cos(actualAngle) * node.length;
  const endY = node.y + Math.sin(actualAngle) * node.length;
  
  // Draw connection to parent (except root)
  if (node.type !== "root") {
    ctx.globalAlpha = node.opacity * 0.6;
    ctx.strokeStyle = color;
    ctx.lineWidth = node.width;
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  // Draw text
  ctx.globalAlpha = node.opacity;
  ctx.fillStyle = color;
  ctx.font = `${Math.max(8, node.width * 3)}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Glow effect for flowers
  if (node.type === "flower") {
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
  } else {
    ctx.shadowBlur = 0;
  }
  
  ctx.fillText(node.text, endX, endY);
  ctx.shadowBlur = 0;
  
  // Update node position for next frame (growth)
  if (node.children.length === 0 && node.age < 50) {
    node.x += (endX - node.x) * 0.1;
    node.y += (endY - node.y) * 0.1;
  }
}

export function renderCodeGarden(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
): void {
  const p = params as unknown as CodeGardenParams;
  const { width, height } = ctx.canvas;
  
  // Get color scheme
  const scheme = COLOR_SCHEMES[p.colorScheme || "synthwave"] || COLOR_SCHEMES.synthwave;
  
  // Clear with background
  ctx.fillStyle = scheme.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Get or initialize plants
  const canvas = ctx.canvas as HTMLCanvasElement & { _codePlants?: CodePlant[]; _lastTime?: number };
  if (!canvas._codePlants) {
    const vocab = CODE_VOCABULARIES[p.language || "javascript"] || CODE_VOCABULARIES.javascript;
    const density = Math.max(1, Math.min(10, p.plantDensity || 6));
    const numPlants = Math.floor(density * 1.5);
    
    canvas._codePlants = [];
    for (let i = 0; i < numPlants; i++) {
      const x = (width / (numPlants + 1)) * (i + 1) + (Math.random() - 0.5) * 50;
      const y = height - 20 - Math.random() * 50;
      const complexity = Math.max(3, Math.min(10, p.complexity || 5));
      canvas._codePlants.push(createCodePlant(x, y, vocab, scheme, complexity));
    }
  }
  
  const plants = canvas._codePlants;
  const lastTime = canvas._lastTime || time;
  const deltaTime = time - lastTime;
  canvas._lastTime = time;
  
  // Season modifier
  const season = SEASON_MODIFIERS[p.season || "spring"] || SEASON_MODIFIERS.spring;
  
  // Update and grow plants
  const growthSpeed = Math.max(1, Math.min(10, p.growthSpeed || 5)) * season.growthRate;
  const bloomRate = Math.max(0, Math.min(10, p.bloomRate || 4)) * season.bloomChance;
  const windStrength = Math.max(0, Math.min(10, p.windStrength || 3));
  const decayEnabled = p.decayEnabled !== false;
  
  plants.forEach(plant => {
    growPlant(plant, growthSpeed, bloomRate);
    updateNodes(plant, deltaTime * 0.1, decayEnabled);
  });
  
  // Draw all nodes
  ctx.globalCompositeOperation = "lighter";
  
  plants.forEach(plant => {
    // Draw from root outward
    const drawRecursive = (node: PlantNode) => {
      drawNode(ctx, node, plant, windStrength, time);
      node.children.forEach(drawRecursive);
    };
    
    plant.nodes.forEach(node => {
      if (node.type === "root") {
        drawRecursive(node);
      }
    });
  });
  
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  
  // Draw ground line
  ctx.strokeStyle = scheme.stem[0];
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, height - 10);
  ctx.lineTo(width, height - 10);
  ctx.stroke();
  
  // Draw subtle grid
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = scheme.leaf[0];
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
}

// ============================================================================
// ART GENERATOR EXPORT
// ============================================================================

export const codeGardenParamsConfig: ParamConfig[] = [
  {
    name: "language",
    type: "select",
    options: ["javascript", "python", "rust", "haskell", "lisp", "sql"],
    default: "javascript",
  },
  {
    name: "colorScheme",
    type: "select",
    options: ["synthwave", "forest", "ocean", "autumn", "monochrome", "terminal"],
    default: "synthwave",
  },
  {
    name: "season",
    type: "select",
    options: ["spring", "summer", "autumn", "winter"],
    default: "spring",
  },
  {
    name: "growthSpeed",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    default: 5,
  },
  {
    name: "plantDensity",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    default: 6,
  },
  {
    name: "complexity",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    default: 5,
  },
  {
    name: "windStrength",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    default: 3,
  },
  {
    name: "bloomRate",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    default: 4,
  },
  {
    name: "decayEnabled",
    type: "select",
    options: ["true", "false"],
    default: "true",
  },
];

export const codeGarden: ArtGenerator = {
  name: "Code Garden",
  description: "Organic growth of code syntax as digital flora — watch programming languages bloom into living gardens",
  params: {
    language: { name: "language", type: "select", options: ["javascript", "python", "rust", "haskell", "lisp", "sql"], default: "javascript" },
    colorScheme: { name: "colorScheme", type: "select", options: ["synthwave", "forest", "ocean", "autumn", "monochrome", "terminal"], default: "synthwave" },
    season: { name: "season", type: "select", options: ["spring", "summer", "autumn", "winter"], default: "spring" },
    growthSpeed: { name: "growthSpeed", type: "range", min: 1, max: 10, step: 1, default: 5 },
    plantDensity: { name: "plantDensity", type: "range", min: 1, max: 10, step: 1, default: 6 },
    complexity: { name: "complexity", type: "range", min: 1, max: 10, step: 1, default: 5 },
    windStrength: { name: "windStrength", type: "range", min: 0, max: 10, step: 1, default: 3 },
    bloomRate: { name: "bloomRate", type: "range", min: 0, max: 10, step: 1, default: 4 },
    decayEnabled: { name: "decayEnabled", type: "select", options: ["true", "false"], default: "true" },
  },
  generate: renderCodeGarden,
  meta: {
    category: "text",
    complexity: "complex",
    tags: ["animated", "organic", "futuristic", "colorful"],
    created: "2026-03-02",
  },
};
