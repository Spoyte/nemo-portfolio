// Calligraphy Brush — Procedural East Asian brush stroke simulation
// Simulates the physics of ink, brush pressure, and flowing movement

import { ArtGenerator, ArtParams, fillCanvas, ParamConfig } from "./core";

interface StrokePoint {
  x: number;
  y: number;
  pressure: number; // 0-1, affects brush width
  speed: number; // affects ink deposition
}

interface BrushState {
  x: number;
  y: number;
  pressure: number;
  ink: number; // 0-1, remaining ink
  angle: number; // brush angle
}

// Generate a flowing stroke path using Perlin-like noise
function generateStrokePath(
  startX: number,
  startY: number,
  length: number,
  curvature: number,
  seed: number
): StrokePoint[] {
  const points: StrokePoint[] = [];
  let x = startX;
  let y = startY;
  let angle = Math.random() * Math.PI * 2;
  let ink = 1.0;
  
  // Simple pseudo-random function
  const rnd = (s: number) => {
    const x = Math.sin(s * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < length; i++) {
    // Vary angle with noise-like behavior
    const noise = rnd(i * 0.1) * 2 - 1;
    angle += noise * curvature * 0.1;
    
    // Calculate speed based on curvature (slower on curves)
    const speed = 1 - Math.abs(noise) * 0.5;
    
    // Move forward
    x += Math.cos(angle) * 3;
    y += Math.sin(angle) * 3;
    
    // Pressure varies along stroke (heavier at start and end in calligraphy)
    const t = i / length;
    const pressure = Math.sin(t * Math.PI) * 0.7 + 0.3 + rnd(i) * 0.2;
    
    // Consume ink
    ink = Math.max(0, ink - 0.01 * speed);
    
    points.push({
      x,
      y,
      pressure: Math.min(1, pressure),
      speed
    });
  }
  
  return points;
}

// Draw a single brush stroke
function drawBrushStroke(
  ctx: CanvasRenderingContext2D,
  points: StrokePoint[],
  baseWidth: number,
  inkColor: string,
  dryBrush: boolean,
  paperTexture: number
) {
  if (points.length < 2) return;
  
  ctx.save();
  
  // Parse ink color
  const r = parseInt(inkColor.slice(1, 3), 16);
  const g = parseInt(inkColor.slice(3, 5), 16);
  const b = parseInt(inkColor.slice(5, 7), 16);
  
  // Draw the main stroke body
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    // Calculate brush width at this point
    const width1 = baseWidth * p1.pressure * (0.5 + p1.speed * 0.5);
    const width2 = baseWidth * p2.pressure * (0.5 + p2.speed * 0.5);
    
    // Ink density varies with speed (faster = lighter)
    const inkDensity1 = p1.speed * 0.8 + 0.2;
    const inkDensity2 = p2.speed * 0.8 + 0.2;
    
    // Create gradient for this segment
    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    const alpha1 = Math.floor(inkDensity1 * 255);
    const alpha2 = Math.floor(inkDensity2 * 255);
    
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha1 / 255})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alpha2 / 255})`);
    
    ctx.fillStyle = grad;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(alpha1, alpha2) / 255})`;
    ctx.lineWidth = 1;
    
    // Draw tapered stroke segment
    ctx.beginPath();
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const perp1 = angle + Math.PI / 2;
    const perp2 = angle - Math.PI / 2;
    
    ctx.moveTo(
      p1.x + Math.cos(perp1) * width1 / 2,
      p1.y + Math.sin(perp1) * width1 / 2
    );
    ctx.lineTo(
      p2.x + Math.cos(perp1) * width2 / 2,
      p2.y + Math.sin(perp1) * width2 / 2
    );
    ctx.lineTo(
      p2.x + Math.cos(perp2) * width2 / 2,
      p2.y + Math.sin(perp2) * width2 / 2
    );
    ctx.lineTo(
      p1.x + Math.cos(perp2) * width1 / 2,
      p1.y + Math.sin(perp2) * width1 / 2
    );
    ctx.closePath();
    ctx.fill();
    
    // "Flying white" effect — dry brush texture
    if (dryBrush && i % 3 === 0 && p1.speed > 0.7) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      for (let j = 0; j < 3; j++) {
        const fx = p1.x + (Math.random() - 0.5) * width1;
        const fy = p1.y + (Math.random() - 0.5) * width1 * 0.3;
        const fw = Math.random() * width1 * 0.4;
        ctx.moveTo(fx + fw, fy);
        ctx.arc(fx, fy, fw, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  
  // Add ink bleeding at edges
  if (paperTexture > 0) {
    ctx.globalCompositeOperation = 'multiply';
    for (let i = 0; i < points.length; i += 2) {
      const p = points[i];
      const bleed = baseWidth * 0.3 * paperTexture;
      const alpha = 0.1 * paperTexture;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, bleed * p.pressure, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  
  ctx.restore();
}

// Generate paper texture background
function drawPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  paperType: string
) {
  // Base paper color
  const paperColors: Record<string, string> = {
    rice: '#f5f0e6',
    xuan: '#f0ebe0',
    aged: '#e8dcc8',
    silk: '#faf8f3',
    charcoal: '#2a2a2a'
  };
  
  const baseColor = paperColors[paperType] || paperColors.rice;
  fillCanvas(ctx, baseColor, width, height);
  
  // Add subtle grain
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add fiber texture
  ctx.strokeStyle = paperType === 'charcoal' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const len = 20 + Math.random() * 50;
    const angle = Math.random() * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
}

// Generate seal stamp (traditional red seal)
function drawSeal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: string
) {
  ctx.save();
  
  // Seal red color
  const sealColors: Record<string, string> = {
    cinnabar: '#c41e3a',
    vermillion: '#e34234',
    crimson: '#990000',
    gold: '#d4af37'
  };
  
  const color = sealColors[style] || sealColors.cinnabar;
  
  // Rough square shape
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  
  // Draw with slight irregularity
  ctx.beginPath();
  const jitter = size * 0.02;
  ctx.moveTo(x - size/2 + (Math.random()-0.5)*jitter, y - size/2 + (Math.random()-0.5)*jitter);
  ctx.lineTo(x + size/2 + (Math.random()-0.5)*jitter, y - size/2 + (Math.random()-0.5)*jitter);
  ctx.lineTo(x + size/2 + (Math.random()-0.5)*jitter, y + size/2 + (Math.random()-0.5)*jitter);
  ctx.lineTo(x - size/2 + (Math.random()-0.5)*jitter, y + size/2 + (Math.random()-0.5)*jitter);
  ctx.closePath();
  ctx.fill();
  
  // Inner texture
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 5; i++) {
    const sx = x + (Math.random() - 0.5) * size * 0.6;
    const sy = y + (Math.random() - 0.5) * size * 0.6;
    const ss = Math.random() * size * 0.15;
    ctx.fillRect(sx - ss/2, sy - ss/2, ss, ss);
  }
  
  ctx.restore();
}

export const calligraphyBrush: ArtGenerator = {
  name: "Calligraphy Brush",
  description: "Procedural East Asian calligraphy simulation with ink physics, brush pressure, and flying white effects",
  
  params: {
    strokes: {
      name: "Stroke Count",
      type: "range",
      min: 1,
      max: 12,
      step: 1,
      default: 5
    },
    brushSize: {
      name: "Brush Size",
      type: "range", 
      min: 10,
      max: 80,
      step: 5,
      default: 35
    },
    curvature: {
      name: "Curvature",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 40
    },
    dryBrush: {
      name: "Dry Brush Effect",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 60
    },
    inkTone: {
      name: "Ink Tone",
      type: "select",
      options: ["sumi", "indigo", "sepia", "vermillion", "emerald"],
      default: "sumi"
    },
    paperType: {
      name: "Paper Type",
      type: "select",
      options: ["rice", "xuan", "aged", "silk", "charcoal"],
      default: "rice"
    },
    composition: {
      name: "Composition",
      type: "select",
      options: ["flowing", "balanced", "dynamic", "minimal"],
      default: "flowing"
    },
    seal: {
      name: "Seal Stamp",
      type: "select",
      options: ["none", "corner", "side", "multiple"],
      default: "corner"
    }
  },

  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    const strokes = params.strokes as number;
    const brushSize = params.brushSize as number;
    const curvature = (params.curvature as number) / 100;
    const dryBrush = (params.dryBrush as number) / 100;
    const inkTone = params.inkTone as string;
    const paperType = params.paperType as string;
    const composition = params.composition as string;
    const seal = params.seal as string;
    
    // Ink colors
    const inkColors: Record<string, string> = {
      sumi: '#1a1a1a',
      indigo: '#1e3a5f',
      sepia: '#5c4033',
      vermillion: '#c41e3a',
      emerald: '#1e5945'
    };
    
    const inkColor = inkColors[inkTone];
    
    // Draw paper texture
    drawPaperTexture(ctx, width, height, paperType);
    
    // Composition layout
    const layouts: Record<string, Array<{x: number, y: number, angle: number, length: number}>> = {
      flowing: [],
      balanced: [],
      dynamic: [],
      minimal: []
    };
    
    // Generate stroke positions based on composition
    const strokeData: Array<{x: number, y: number, angle: number, length: number}> = [];
    
    if (composition === 'flowing') {
      // Diagonal flow from upper left
      for (let i = 0; i < strokes; i++) {
        strokeData.push({
          x: width * 0.15 + i * width * 0.08,
          y: height * 0.15 + i * height * 0.06,
          angle: Math.PI / 4,
          length: 80 + Math.random() * 60
        });
      }
    } else if (composition === 'balanced') {
      // Centered, symmetrical
      const cols = Math.ceil(Math.sqrt(strokes));
      for (let i = 0; i < strokes; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        strokeData.push({
          x: width * 0.25 + col * width * 0.5 / cols,
          y: height * 0.25 + row * height * 0.5 / Math.ceil(strokes / cols),
          angle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
          length: 60 + Math.random() * 40
        });
      }
    } else if (composition === 'dynamic') {
      // Scattered, energetic
      for (let i = 0; i < strokes; i++) {
        strokeData.push({
          x: width * 0.1 + Math.random() * width * 0.8,
          y: height * 0.1 + Math.random() * height * 0.8,
          angle: Math.random() * Math.PI * 2,
          length: 50 + Math.random() * 80
        });
      }
    } else if (composition === 'minimal') {
      // Few, deliberate strokes
      const positions = [
        { x: 0.3, y: 0.3 },
        { x: 0.7, y: 0.4 },
        { x: 0.5, y: 0.7 }
      ];
      for (let i = 0; i < Math.min(strokes, positions.length); i++) {
        strokeData.push({
          x: width * positions[i].x,
          y: height * positions[i].y,
          angle: Math.PI / 2 + (Math.random() - 0.5),
          length: 100 + Math.random() * 50
        });
      }
    }
    
    // Draw each stroke
    strokeData.forEach((data, index) => {
      const seed = index * 123.456;
      const points = generateStrokePath(
        data.x,
        data.y,
        data.length,
        curvature,
        seed
      );
      
      // Vary brush size slightly per stroke
      const sizeVariation = 0.7 + Math.random() * 0.6;
      
      drawBrushStroke(
        ctx,
        points,
        brushSize * sizeVariation,
        inkColor,
        dryBrush > 0.3,
        0.5
      );
    });
    
    // Add seal stamp
    if (seal !== 'none') {
      const sealSize = Math.min(width, height) * 0.08;
      let sealX, sealY;
      
      if (seal === 'corner') {
        sealX = width * 0.85;
        sealY = height * 0.85;
      } else if (seal === 'side') {
        sealX = width * 0.9;
        sealY = height * 0.5;
      } else if (seal === 'multiple') {
        // Draw multiple small seals
        drawSeal(ctx, width * 0.85, height * 0.85, sealSize * 0.7, 'cinnabar');
        drawSeal(ctx, width * 0.9, height * 0.75, sealSize * 0.5, 'vermillion');
        drawSeal(ctx, width * 0.15, height * 0.9, sealSize * 0.6, 'crimson');
      }
      
      if (seal !== 'multiple') {
        drawSeal(ctx, sealX!, sealY!, sealSize, 'cinnabar');
      }
    }
    
    // Add subtle vignette
    const grad = ctx.createRadialGradient(
      width/2, height/2, Math.min(width, height) * 0.3,
      width/2, height/2, Math.min(width, height) * 0.7
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, paperType === 'charcoal' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  },

  meta: {
    category: "text",
    complexity: "moderate",
    tags: ["static", "monochrome", "traditional", "organic", "minimal"],
    created: "2026-03-02"
  }
};
