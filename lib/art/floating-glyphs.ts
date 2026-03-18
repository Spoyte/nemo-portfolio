import type { ArtGenerator, ParameterDefinition } from "./core";
import { seededRandom } from "./seeded-random";

// Floating Glyphs — 3D extruded typography floating in volumetric space
// Characters emerge from chaos, rotate with physics, form transient poetry

export interface FloatingGlyphsParams {
  seed: number;
  glyphCount: number;      // 10 - 100
  chaos: number;           // 0.0 - 1.0 (randomness of positions)
  cohesion: number;        // 0.0 - 1.0 (attraction to word clusters)
  depth: number;           // 0.5 - 3.0 (3D depth of field)
  rotationSpeed: number;   // 0.0 - 2.0
  glyphSize: number;       // 0.5 - 2.0
  theme: "cosmos" | "ocean" | "embers" | "neon" | "monochrome";
  wordSet: "poetry" | "code" | "dreams" | "chaos" | "silence";
}

export const floatingGlyphsDefaultParams: FloatingGlyphsParams = {
  seed: Math.floor(Math.random() * 10000),
  glyphCount: 40,
  chaos: 0.6,
  cohesion: 0.4,
  depth: 1.5,
  rotationSpeed: 0.5,
  glyphSize: 1.0,
  theme: "cosmos",
  wordSet: "poetry",
};

export const floatingGlyphsParamDefinitions: Record<keyof FloatingGlyphsParams, ParameterDefinition> = {
  seed: { type: "number", min: 0, max: 99999, step: 1, default: floatingGlyphsDefaultParams.seed },
  glyphCount: { type: "number", min: 10, max: 100, step: 5, default: 40 },
  chaos: { type: "number", min: 0.0, max: 1.0, step: 0.05, default: 0.6 },
  cohesion: { type: "number", min: 0.0, max: 1.0, step: 0.05, default: 0.4 },
  depth: { type: "number", min: 0.5, max: 3.0, step: 0.1, default: 1.5 },
  rotationSpeed: { type: "number", min: 0.0, max: 2.0, step: 0.1, default: 0.5 },
  glyphSize: { type: "number", min: 0.5, max: 2.0, step: 0.1, default: 1.0 },
  theme: { type: "select", options: ["cosmos", "ocean", "embers", "neon", "monochrome"], default: "cosmos" },
  wordSet: { type: "select", options: ["poetry", "code", "dreams", "chaos", "silence"], default: "poetry" },
};

// Word banks for different themes
const WORD_BANKS: Record<string, string[]> = {
  poetry: ["star", "void", "whisper", "drift", "echo", "fade", "bloom", "wane", "pulse", "flow", "dream", "night", "soft", "deep", "vast"],
  code: ["function", "return", "async", "await", "const", "let", "var", "if", "else", "while", "for", "map", "reduce", "filter", "promise"],
  dreams: ["fly", "fall", "float", "sink", "rise", "melt", "shatter", "merge", "split", "twist", "spin", "glide", "hover", "vanish", "appear"],
  chaos: ["entropy", "noise", "static", "fracture", "scatter", "collide", "rupture", "turbulence", "storm", "frenzy", "jitter", "shock", "surge", "erupt", "tangle"],
  silence: ["hush", "still", "calm", "quiet", "mute", "pause", "rest", "peace", "serene", "tranquil", "gentle", "soft", "subtle", "faint", "distant"],
};

// Theme color palettes (background, primary, secondary, accent, glow)
const THEMES: Record<string, { bg: string; primary: string; secondary: string; accent: string; glow: string }> = {
  cosmos: { bg: "#0a0a12", primary: "#e8e6f0", secondary: "#a090c0", accent: "#60a0ff", glow: "rgba(100, 150, 255, 0.5)" },
  ocean: { bg: "#051016", primary: "#c8e0e8", secondary: "#70a0b0", accent: "#40d0c0", glow: "rgba(60, 200, 180, 0.5)" },
  embers: { bg: "#120805", primary: "#f0d8c8", secondary: "#c08060", accent: "#ff6040", glow: "rgba(255, 100, 60, 0.5)" },
  neon: { bg: "#0a0a0a", primary: "#ffffff", secondary: "#ff00ff", accent: "#00ffff", glow: "rgba(255, 0, 255, 0.6)" },
  monochrome: { bg: "#0a0a0a", primary: "#f0f0f0", secondary: "#808080", accent: "#404040", glow: "rgba(200, 200, 200, 0.4)" },
};

// 3D point type
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Glyph instance
interface Glyph {
  char: string;
  word: string;
  pos: Point3D;
  rotation: Point3D;
  rotationVel: Point3D;
  scale: number;
  opacity: number;
  targetPos: Point3D;
  color: string;
  extrusion: number;
}

// Project 3D point to 2D with perspective
function project(point: Point3D, canvasWidth: number, canvasHeight: number, depth: number): { x: number; y: number; scale: number } {
  const fov = 400;
  const distance = fov + point.z * 100 * depth;
  const scale = fov / Math.max(1, distance);
  
  return {
    x: canvasWidth / 2 + point.x * scale * 100,
    y: canvasHeight / 2 + point.y * scale * 100,
    scale: scale,
  };
}

// Rotate point around axis
function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function rotateY(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

function rotateZ(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
    z: point.z,
  };
}

// Generate glyphs
function generateGlyphs(params: FloatingGlyphsParams): Glyph[] {
  const rng = seededRandom(params.seed);
  const words = WORD_BANKS[params.wordSet];
  const glyphs: Glyph[] = [];
  
  // Select words to form loose clusters
  const selectedWords: string[] = [];
  const wordCount = Math.max(2, Math.floor(params.glyphCount / 8));
  for (let i = 0; i < wordCount; i++) {
    selectedWords.push(words[Math.floor(rng() * words.length)]);
  }
  
  // Distribute glyphs
  let wordIndex = 0;
  let charInWord = 0;
  let currentWord = selectedWords[0];
  
  // Cluster centers
  const clusters: Point3D[] = [];
  const clusterCount = Math.max(2, Math.floor(wordCount / 2));
  for (let i = 0; i < clusterCount; i++) {
    clusters.push({
      x: (rng() - 0.5) * 3,
      y: (rng() - 0.5) * 2,
      z: (rng() - 0.5) * 2,
    });
  }
  
  for (let i = 0; i < params.glyphCount; i++) {
    // Get next character from words
    if (charInWord >= currentWord.length) {
      wordIndex = (wordIndex + 1) % selectedWords.length;
      currentWord = selectedWords[wordIndex];
      charInWord = 0;
    }
    const char = currentWord[charInWord++];
    
    // Assign to cluster
    const cluster = clusters[i % clusters.length];
    
    // Position with chaos factor
    const chaosOffset = {
      x: (rng() - 0.5) * params.chaos * 2,
      y: (rng() - 0.5) * params.chaos * 1.5,
      z: (rng() - 0.5) * params.chaos * 1.5,
    };
    
    const pos: Point3D = {
      x: cluster.x + chaosOffset.x,
      y: cluster.y + chaosOffset.y,
      z: cluster.z + chaosOffset.z,
    };
    
    // Rotation
    const rotation: Point3D = {
      x: rng() * Math.PI * 2,
      y: rng() * Math.PI * 2,
      z: rng() * Math.PI * 2,
    };
    
    // Rotation velocity
    const rotationVel: Point3D = {
      x: (rng() - 0.5) * params.rotationSpeed * 0.02,
      y: (rng() - 0.5) * params.rotationSpeed * 0.02,
      z: (rng() - 0.5) * params.rotationSpeed * 0.01,
    };
    
    glyphs.push({
      char,
      word: currentWord,
      pos,
      rotation,
      rotationVel,
      scale: (0.8 + rng() * 0.4) * params.glyphSize,
      opacity: 0.6 + rng() * 0.4,
      targetPos: { ...pos },
      color: "",
      extrusion: 0.1 + rng() * 0.2,
    });
  }
  
  return glyphs;
}

// Draw extruded character with 3D effect
function drawExtrudedChar(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  size: number,
  rotation: Point3D,
  opacity: number,
  theme: typeof THEMES["cosmos"],
  extrusion: number
): void {
  ctx.save();
  
  // Base size with perspective
  const baseSize = size * 24;
  
  // Draw extrusion layers (back to front for depth)
  const layers = 5;
  for (let i = layers; i >= 0; i--) {
    const layerOffset = i * extrusion * 3;
    const layerAlpha = i === 0 ? opacity : opacity * 0.3;
    
    // Calculate layer position based on rotation
    const offsetX = Math.sin(rotation.y) * layerOffset;
    const offsetY = Math.cos(rotation.x) * layerOffset * 0.5;
    
    ctx.save();
    ctx.translate(x + offsetX, y + offsetY);
    
    // Apply 3D rotation to the character
    // We simulate 3D rotation by scaling and skewing
    const rotX = Math.cos(rotation.x);
    const rotY = Math.cos(rotation.y);
    const rotZ = Math.sin(rotation.z) * 0.3;
    
    ctx.scale(rotY * 0.8 + 0.2, rotX * 0.8 + 0.2);
    ctx.rotate(rotZ);
    
    // Set styles based on layer
    if (i === 0) {
      // Front face - brightest
      ctx.fillStyle = theme.primary;
      ctx.globalAlpha = layerAlpha;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 15;
    } else if (i === layers) {
      // Back face - darkest
      ctx.fillStyle = theme.bg;
      ctx.globalAlpha = layerAlpha * 0.5;
      ctx.shadowBlur = 0;
    } else {
      // Side faces - gradient
      const gradient = (i / layers);
      ctx.fillStyle = i % 2 === 0 ? theme.secondary : theme.accent;
      ctx.globalAlpha = layerAlpha * 0.6;
      ctx.shadowBlur = 0;
    }
    
    // Draw character
    ctx.font = `bold ${baseSize}px "SF Mono", "Fira Code", "Cascadia Code", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 0, 0);
    
    // Outline for definition
    if (i === 0) {
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.5;
      ctx.strokeText(char, 0, 0);
    }
    
    ctx.restore();
  }
  
  ctx.restore();
}

// Draw connecting lines between nearby glyphs in same word
function drawConnections(
  ctx: CanvasRenderingContext2D,
  glyphs: Glyph[],
  projected: { x: number; y: number; scale: number }[],
  theme: typeof THEMES["cosmos"]
): void {
  ctx.save();
  
  for (let i = 0; i < glyphs.length; i++) {
    for (let j = i + 1; j < glyphs.length; j++) {
      // Only connect glyphs from same word
      if (glyphs[i].word !== glyphs[j].word) continue;
      
      const p1 = projected[i];
      const p2 = projected[j];
      
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Connect if close enough
      if (dist < 150) {
        const alpha = (1 - dist / 150) * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = theme.accent;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1 * ((p1.scale + p2.scale) / 2);
        ctx.stroke();
      }
    }
  }
  
  ctx.restore();
}

// Main render function
export function generateFloatingGlyphs(
  canvas: HTMLCanvasElement,
  params: FloatingGlyphsParams = floatingGlyphsDefaultParams,
  glyphs?: Glyph[],
  time?: number
): Glyph[] {
  const ctx = canvas.getContext("2d")!;
  const width = canvas.width;
  const height = canvas.height;
  const theme = THEMES[params.theme];
  
  // Clear with gradient background
  const bgGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height)
  );
  bgGradient.addColorStop(0, theme.bg);
  bgGradient.addColorStop(1, "#000000");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Initialize or update glyphs
  let currentGlyphs = glyphs || generateGlyphs(params);
  const currentTime = time || Date.now() / 1000;
  
  // Update glyph positions and rotations
  currentGlyphs.forEach((glyph, i) => {
    // Apply rotation
    glyph.rotation.x += glyph.rotationVel.x;
    glyph.rotation.y += glyph.rotationVel.y;
    glyph.rotation.z += glyph.rotationVel.z;
    
    // Gentle floating motion
    const floatTime = currentTime * 0.5 + i * 0.5;
    glyph.pos.y += Math.sin(floatTime) * 0.001;
    glyph.pos.x += Math.cos(floatTime * 0.7) * 0.0005;
    
    // Cohesion - gentle pull toward target
    if (params.cohesion > 0) {
      const dx = glyph.targetPos.x - glyph.pos.x;
      const dy = glyph.targetPos.y - glyph.pos.y;
      const dz = glyph.targetPos.z - glyph.pos.z;
      glyph.pos.x += dx * 0.001 * params.cohesion;
      glyph.pos.y += dy * 0.001 * params.cohesion;
      glyph.pos.z += dz * 0.001 * params.cohesion;
    }
  });
  
  // Project all glyphs to 2D
  const projected = currentGlyphs.map(glyph => project(glyph.pos, width, height, params.depth));
  
  // Sort by Z for proper depth rendering
  const sortedIndices = currentGlyphs
    .map((g, i) => ({ index: i, z: g.pos.z }))
    .sort((a, b) => b.z - a.z)
    .map(item => item.index);
  
  // Draw connections first (behind glyphs)
  drawConnections(ctx, currentGlyphs, projected, theme);
  
  // Draw glyphs back to front
  sortedIndices.forEach(i => {
    const glyph = currentGlyphs[i];
    const proj = projected[i];
    
    // Skip if behind camera
    if (glyph.pos.z < -2) return;
    
    // Fade based on depth
    const depthFade = Math.max(0, Math.min(1, (3 - glyph.pos.z) / 4));
    const finalOpacity = glyph.opacity * depthFade * proj.scale;
    
    // Size with perspective
    const size = glyph.scale * proj.scale;
    
    drawExtrudedChar(
      ctx,
      glyph.char,
      proj.x,
      proj.y,
      size,
      glyph.rotation,
      finalOpacity,
      theme,
      glyph.extrusion
    );
  });
  
  // Draw word labels faintly
  ctx.save();
  ctx.font = '10px "SF Mono", monospace';
  ctx.fillStyle = theme.secondary;
  ctx.globalAlpha = 0.3;
  ctx.textAlign = "right";
  const words = [...new Set(currentGlyphs.map(g => g.word))];
  words.slice(0, 3).forEach((word, i) => {
    ctx.fillText(word, width - 20, height - 20 - i * 15);
  });
  ctx.restore();
  
  return currentGlyphs;
}

// Animation loop
export function animateFloatingGlyphs(
  canvas: HTMLCanvasElement,
  params: FloatingGlyphsParams = floatingGlyphsDefaultParams
): () => void {
  let running = true;
  let frameId: number;
  let glyphs = generateGlyphs(params);
  
  const render = () => {
    if (!running) return;
    glyphs = generateFloatingGlyphs(canvas, params, glyphs, Date.now() / 1000);
    frameId = requestAnimationFrame(render);
  };
  
  render();
  
  return () => {
    running = false;
    cancelAnimationFrame(frameId);
  };
}

// Export generator
export const floatingGlyphs: ArtGenerator = {
  id: "floating-glyphs",
  name: "Floating Glyphs",
  description: "3D extruded typography floating in volumetric space. Characters from curated word sets drift and rotate with physics, forming transient poetry from chaos. Features depth-based rendering, volumetric lighting effects, and emergent word clusters.",
  category: "3d",
  complexity: "complex",
  tags: ["3d", "typography", "text", "particles", "physics", "poetry", "volumetric"],
  parameters: floatingGlyphsParamDefinitions,
  defaultParams: floatingGlyphsDefaultParams,
  render: generateFloatingGlyphs,
  animate: animateFloatingGlyphs,
};
