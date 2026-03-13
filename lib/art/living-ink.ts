import { ArtGenerator, defineGenerator } from "./core";
import { seededRandom } from "./seeded-random";

// ============================================================================
// Living Ink — Generative Calligraphy with Breathing Strokes
// ============================================================================
// A fusion of traditional East Asian ink wash painting and generative art.
// Brush strokes breathe, fade, and regenerate like living organisms.
// Each stroke has its own lifecycle: birth → growth → maturity → fade → rebirth
//
// Inspired by:
// - Sumi-e (Japanese ink wash painting)
// - Shodo (Japanese calligraphy)
// - The concept of "ma" (negative space as active element)
//
// Technical approach:
// - Perlin noise for organic stroke variation
// - Particle systems for ink diffusion
// - Spring physics for brush tip movement
// - Layered rendering for depth
// ============================================================================

interface Point {
  x: number;
  y: number;
  pressure: number;
  velocity: number;
  age: number;
}

interface Stroke {
  points: Point[];
  maxAge: number;
  birthTime: number;
  color: { r: number; g: number; b: number; a: number };
  width: number;
  breathingPhase: number;
  seed: number;
}

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  opacity: number;
}

// Generate a flowing stroke path using noise
function generateStrokePath(
  startX: number,
  startY: number,
  seed: number,
  length: number,
  time: number
): Point[] {
  const points: Point[] = [];
  const rng = seededRandom(seed);
  
  let x = startX;
  let y = startY;
  let angle = rng() * Math.PI * 2;
  let pressure = 0.5 + rng() * 0.5;
  
  // Control points for organic flow
  const numPoints = Math.floor(length * 2);
  
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    
    // Organic angle variation using multiple sine waves
    const noise1 = Math.sin(t * Math.PI * 3 + time * 0.5 + seed);
    const noise2 = Math.cos(t * Math.PI * 5 + time * 0.3 + seed * 2);
    const noise3 = Math.sin(t * Math.PI * 7 + time * 0.7 + seed * 3);
    
    angle += (noise1 * 0.3 + noise2 * 0.2 + noise3 * 0.1) * 0.1;
    
    // Pressure varies along stroke (heavier at start, lighter at end)
    const pressureCurve = Math.sin(t * Math.PI) * 0.8 + 0.2;
    const breathing = Math.sin(time * 2 + t * Math.PI * 4) * 0.1;
    pressure = pressureCurve + breathing;
    
    // Velocity based on curve tightness
    const velocity = 1 + Math.abs(Math.cos(angle)) * 0.5;
    
    // Move along angle
    const step = 3 + rng() * 2;
    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step;
    
    // Add some vertical drift
    y += Math.sin(t * Math.PI * 2 + time) * 0.5;
    
    points.push({
      x,
      y,
      pressure: Math.max(0.1, Math.min(1, pressure)),
      velocity,
      age: t,
    });
  }
  
  return points;
}

// Generate ink particles that diffuse from stroke edges
function generateInkParticles(
  stroke: Stroke,
  time: number,
  density: number
): InkParticle[] {
  const particles: InkParticle[] = [];
  const rng = seededRandom(stroke.seed + Math.floor(time * 10));
  
  for (let i = 0; i < stroke.points.length; i += Math.max(1, Math.floor(3 / density))) {
    const point = stroke.points[i];
    const numParticles = Math.floor(point.pressure * density * 3);
    
    for (let j = 0; j < numParticles; j++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * point.pressure * 15;
      
      particles.push({
        x: point.x + Math.cos(angle) * dist,
        y: point.y + Math.sin(angle) * dist,
        vx: Math.cos(angle) * 0.2 + (rng() - 0.5) * 0.3,
        vy: Math.sin(angle) * 0.2 + (rng() - 0.5) * 0.3,
        size: 1 + rng() * 3,
        life: 0,
        maxLife: 60 + rng() * 120,
        opacity: point.pressure * 0.6,
      });
    }
  }
  
  return particles;
}

export const livingInk: ArtGenerator = defineGenerator({
  id: "living-ink",
  name: "Living Ink",
  description:
    "Generative calligraphy where brush strokes breathe, fade, and regenerate like living organisms. Inspired by sumi-e ink wash painting.",
  
  params: {
    strokeCount: {
      name: "Strokes",
      type: "range",
      min: 1,
      max: 7,
      step: 1,
      default: 4,
    },
    inkDensity: {
      name: "Ink Density",
      type: "range",
      min: 0.3,
      max: 2,
      step: 0.1,
      default: 1,
    },
    breathingRate: {
      name: "Breathing Rate",
      type: "range",
      min: 0.2,
      max: 3,
      step: 0.1,
      default: 1,
    },
    chaos: {
      name: "Chaos",
      type: "range",
      min: 0,
      max: 1,
      step: 0.05,
      default: 0.3,
    },
    colorScheme: {
      name: "Palette",
      type: "select",
      options: ["sumi", "sepia", "indigo", "vermillion", "forest"],
      default: "sumi",
    },
  },
  
  meta: {
    category: "traditional",
    tags: ["animated", "organic", "ink", "minimal", "zen"],
    complexity: "moderate",
  },
  
  generate: (ctx, params, time) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const strokeCount = params.strokeCount as number;
    const inkDensity = params.inkDensity as number;
    const breathingRate = (params.breathingRate as number) * 0.5;
    const chaos = params.chaos as number;
    const colorScheme = params.colorScheme as string;
    
    // Color palettes
    const palettes: Record<string, { r: number; g: number; b: number }> = {
      sumi: { r: 20, g: 20, b: 25 },        // Deep black ink
      sepia: { r: 62, g: 39, b: 35 },       // Warm sepia
      indigo: { r: 45, g: 45, b: 80 },      // Japanese indigo
      vermillion: { r: 180, g: 50, b: 45 }, // Vermillion red
      forest: { r: 34, g: 60, b: 40 },      // Forest green
    };
    
    const baseColor = palettes[colorScheme] || palettes.sumi;
    
    // Clear with subtle paper texture background
    ctx.fillStyle = `rgb(250, 248, 245)`;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle paper grain
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 16) {
      const noise = (Math.random() - 0.5) * 3;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // Generate strokes
    const strokes: Stroke[] = [];
    const rng = seededRandom(42);
    
    for (let i = 0; i < strokeCount; i++) {
      const seed = i * 1000;
      
      // Position strokes in flowing composition
      const startX = width * (0.2 + (i / strokeCount) * 0.6 + Math.sin(time * 0.2 + i) * 0.05 * chaos);
      const startY = height * (0.3 + (i % 2) * 0.2 + Math.cos(time * 0.15 + i) * 0.1 * chaos);
      
      const strokeLength = 80 + rng() * 120;
      const points = generateStrokePath(startX, startY, seed, strokeLength, time * breathingRate);
      
      // Vary color slightly per stroke
      const colorVar = 0.9 + rng() * 0.2;
      
      strokes.push({
        points,
        maxAge: 300 + rng() * 200,
        birthTime: i * 0.5,
        color: {
          r: Math.min(255, baseColor.r * colorVar),
          g: Math.min(255, baseColor.g * colorVar),
          b: Math.min(255, baseColor.b * colorVar),
          a: 0.8,
        },
        width: 8 + rng() * 12,
        breathingPhase: i * Math.PI * 0.5,
        seed,
      });
    }
    
    // Render strokes with ink diffusion effect
    strokes.forEach((stroke) => {
      const breathingIntensity = 0.5 + Math.sin(time * breathingRate + stroke.breathingPhase) * 0.5;
      const currentOpacity = stroke.color.a * breathingIntensity;
      
      // Main stroke path
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      // Smooth curve through points
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];
        
        const cpX = (p0.x + p1.x) / 2;
        const cpY = (p0.y + p1.y) / 2;
        
        ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }
      
      // Stroke with varying width
      for (let i = 0; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];
        
        const avgPressure = (p1.pressure + p2.pressure) / 2;
        const strokeWidth = stroke.width * avgPressure * breathingIntensity;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${currentOpacity * avgPressure})`;
        ctx.stroke();
        
        // Inner highlight for depth
        if (avgPressure > 0.6) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = strokeWidth * 0.4;
          ctx.strokeStyle = `rgba(${stroke.color.r + 20}, ${stroke.color.g + 20}, ${stroke.color.b + 25}, ${currentOpacity * 0.5})`;
          ctx.stroke();
        }
      }
      
      // Ink diffusion particles
      const particles = generateInkParticles(stroke, time, inkDensity);
      
      particles.forEach((particle) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        particle.vx *= 0.98; // Friction
        particle.vy *= 0.98;
        
        // Diffusion
        const diffusionRate = 0.1;
        particle.vx += (Math.random() - 0.5) * diffusionRate;
        particle.vy += (Math.random() - 0.5) * diffusionRate;
        
        // Fade out
        const lifeRatio = particle.life / particle.maxLife;
        const alpha = particle.opacity * (1 - lifeRatio) * breathingIntensity * 0.5;
        
        if (alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * (1 + lifeRatio), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${alpha})`;
          ctx.fill();
        }
      });
      
      // Dry brush effect at stroke ends
      const lastPoint = stroke.points[stroke.points.length - 1];
      if (lastPoint.pressure < 0.3) {
        for (let j = 0; j < 5; j++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 20;
          ctx.beginPath();
          ctx.arc(
            lastPoint.x + Math.cos(angle) * dist,
            lastPoint.y + Math.sin(angle) * dist,
            Math.random() * 2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(${stroke.color.r}, ${stroke.color.g}, ${stroke.color.b}, ${0.1 * breathingIntensity})`;
          ctx.fill();
        }
      }
    });
    
    // Add subtle seal/chop mark (traditional element)
    const sealX = width * 0.85;
    const sealY = height * 0.85;
    const sealSize = 30 + Math.sin(time * breathingRate) * 2;
    
    ctx.save();
    ctx.translate(sealX, sealY);
    ctx.rotate(Math.sin(time * 0.1) * 0.05);
    
    // Seal border
    ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.6)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(-sealSize / 2, -sealSize / 2, sealSize, sealSize);
    
    // Seal character (simplified)
    ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.4)`;
    ctx.font = `${sealSize * 0.6}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("墨", 0, 0); // "Ink" character
    
    ctx.restore();
    
    // Occasional splash drops
    if (Math.random() < 0.02 * inkDensity) {
      const splashX = Math.random() * width;
      const splashY = Math.random() * height;
      const splashSize = Math.random() * 5 + 2;
      
      ctx.beginPath();
      ctx.arc(splashX, splashY, splashSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.3)`;
      ctx.fill();
    }
  },
});
