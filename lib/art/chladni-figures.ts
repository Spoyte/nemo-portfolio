import { ArtGenerator, ArtParams, fillCanvas, hslToRgb } from "./core";

export interface ChladniFiguresParams {
  mode: "circle" | "square" | "rectangle";
  m: number; // First mode number
  n: number; // Second mode number
  frequency: number; // Animation frequency
  particleCount: number; // Number of particles to visualize
  colorScheme: "monochrome" | "heatmap" | "electric" | "ocean" | "sunset";
  showParticles: boolean;
  showLines: boolean;
  lineThickness: number;
  vibrationIntensity: number;
  damping: number;
}

export const chladniFiguresDefaultParams: ChladniFiguresParams = {
  mode: "square",
  m: 3,
  n: 2,
  frequency: 1,
  particleCount: 3000,
  colorScheme: "electric",
  showParticles: true,
  showLines: true,
  lineThickness: 1.5,
  vibrationIntensity: 1,
  damping: 0.5,
};

// Color schemes
const COLOR_SCHEMES: Record<string, { bg: string; primary: string; secondary: string; accent: string }> = {
  monochrome: {
    bg: "#0a0a0a",
    primary: "#ffffff",
    secondary: "#888888",
    accent: "#cccccc",
  },
  heatmap: {
    bg: "#1a0505",
    primary: "#ff4400",
    secondary: "#ffaa00",
    accent: "#ffff00",
  },
  electric: {
    bg: "#0a0a1a",
    primary: "#00ffff",
    secondary: "#0088ff",
    accent: "#ff00ff",
  },
  ocean: {
    bg: "#001a2e",
    primary: "#00e5ff",
    secondary: "#0099cc",
    accent: "#66ffff",
  },
  sunset: {
    bg: "#1a0a1a",
    primary: "#ff6b9d",
    secondary: "#ffaa5e",
    accent: "#ffd700",
  },
};

// Calculate Chladni figure value for square plate
// Returns displacement amplitude (0 = nodal line, 1 = antinode)
function chladniSquare(x: number, y: number, m: number, n: number): number {
  // Normalized coordinates [0, 1]
  const u = x;
  const v = y;
  
  // Chladni figure for square: sin(mπx) * sin(nπy) + sin(nπx) * sin(mπy)
  // This creates the characteristic nodal patterns
  const term1 = Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v);
  const term2 = Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v);
  
  return Math.abs(term1 + term2);
}

// Calculate Chladni figure for circular plate (Bessel functions approximation)
function chladniCircle(x: number, y: number, m: number, n: number): number {
  // Convert to polar coordinates
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y - 0.5, x - 0.5);
  
  // Simplified circular mode (approximation)
  // Uses cosine for angular dependence and Bessel-like for radial
  const radial = Math.sin(n * Math.PI * r * 2);
  const angular = Math.cos(m * theta);
  
  return Math.abs(radial * angular);
}

// Calculate Chladni figure for rectangular plate
function chladniRectangle(x: number, y: number, m: number, n: number, aspect: number): number {
  const u = x;
  const v = y * aspect; // Adjust for aspect ratio
  
  // Rectangular modes
  const term1 = Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v);
  const term2 = Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v);
  
  return Math.abs(term1 + term2);
}

// Get Chladni value based on mode
function getChladniValue(
  x: number,
  y: number,
  mode: string,
  m: number,
  n: number,
  aspect: number
): number {
  switch (mode) {
    case "circle":
      return chladniCircle(x, y, m, n);
    case "rectangle":
      return chladniRectangle(x, y, m, n, aspect);
    case "square":
    default:
      return chladniSquare(x, y, m, n);
  }
}

// Draw nodal lines (contours where displacement = 0)
function drawNodalLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: ChladniFiguresParams,
  time: number
): void {
  const colors = COLOR_SCHEMES[params.colorScheme];
  const threshold = 0.05 + Math.sin(time * 0.001 * params.frequency) * 0.02 * params.vibrationIntensity;
  
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = params.lineThickness;
  ctx.lineCap = "round";
  
  const resolution = 4; // Pixel step for line detection
  
  // Marching squares-like approach for contour detection
  for (let y = 0; y < height - resolution; y += resolution) {
    for (let x = 0; x < width - resolution; x += resolution) {
      const nx1 = x / width;
      const ny1 = y / height;
      const nx2 = (x + resolution) / width;
      const ny2 = (y + resolution) / height;
      
      const v1 = getChladniValue(nx1, ny1, params.mode, params.m, params.n, width / height);
      const v2 = getChladniValue(nx2, ny1, params.mode, params.m, params.n, width / height);
      const v3 = getChladniValue(nx1, ny2, params.mode, params.m, params.n, width / height);
      const v4 = getChladniValue(nx2, ny2, params.mode, params.m, params.n, width / height);
      
      // Check for zero crossing (nodal line)
      const crossings = [
        v1 < threshold && v2 >= threshold,
        v2 < threshold && v4 >= threshold,
        v4 < threshold && v3 >= threshold,
        v3 < threshold && v1 >= threshold,
      ];
      
      if (crossings.filter(Boolean).length >= 2) {
        ctx.beginPath();
        ctx.moveTo(x + resolution / 2, y + resolution / 2);
        ctx.lineTo(x + resolution / 2 + 1, y + resolution / 2 + 1);
        ctx.stroke();
      }
    }
  }
}

// Draw particles that settle on nodal lines
function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: ChladniFiguresParams,
  time: number
): void {
  const colors = COLOR_SCHEMES[params.colorScheme];
  const threshold = 0.08;
  
  // Seeded random for reproducible particle positions
  let seed = params.m * 1000 + params.n * 100;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  for (let i = 0; i < params.particleCount; i++) {
    // Generate candidate position
    let px = random();
    let py = random();
    
    // Get displacement at this point
    const displacement = getChladniValue(px, py, params.mode, params.m, params.n, width / height);
    
    // Particles only visible near nodal lines (low displacement)
    if (displacement < threshold) {
      const x = px * width;
      const y = py * height;
      
      // Animated vibration
      const vibration = Math.sin(time * 0.003 * params.frequency + i * 0.1) * 
                       (1 - displacement / threshold) * 3 * params.vibrationIntensity;
      
      // Color based on position and time
      const colorPhase = (px + py + time * 0.0002) % 1;
      let color: string;
      if (colorPhase < 0.33) {
        color = colors.primary;
      } else if (colorPhase < 0.66) {
        color = colors.secondary;
      } else {
        color = colors.accent;
      }
      
      // Particle size based on how close to nodal line
      const size = (1 - displacement / threshold) * 2.5;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6 + Math.sin(time * 0.002 + i * 0.05) * 0.3;
      ctx.beginPath();
      ctx.arc(x + vibration, y + vibration, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.globalAlpha = 1;
}

// Draw gradient field visualization
function drawGradientField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: ChladniFiguresParams,
  time: number
): void {
  const colors = COLOR_SCHEMES[params.colorScheme];
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const sampleStep = 2; // Downsample for performance
  
  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const nx = x / width;
      const ny = y / height;
      
      const displacement = getChladniValue(nx, ny, params.mode, params.m, params.n, width / height);
      
      // Animated intensity
      const animatedDisplacement = displacement * (0.8 + 0.2 * Math.sin(time * 0.002 * params.frequency));
      
      // Map displacement to color
      let r: number, g: number, b: number;
      
      switch (params.colorScheme) {
        case "heatmap":
          r = Math.min(255, animatedDisplacement * 400);
          g = Math.min(255, animatedDisplacement * 200);
          b = Math.min(255, animatedDisplacement * 50);
          break;
        case "electric":
          r = Math.min(255, animatedDisplacement * 100);
          g = Math.min(255, 100 + animatedDisplacement * 155);
          b = Math.min(255, 200 + animatedDisplacement * 55);
          break;
        case "ocean":
          r = Math.min(255, animatedDisplacement * 50);
          g = Math.min(255, 100 + animatedDisplacement * 100);
          b = Math.min(255, 150 + animatedDisplacement * 105);
          break;
        case "sunset":
          r = Math.min(255, 150 + animatedDisplacement * 105);
          g = Math.min(255, 50 + animatedDisplacement * 150);
          b = Math.min(255, animatedDisplacement * 100);
          break;
        case "monochrome":
        default:
          const gray = Math.min(255, animatedDisplacement * 300);
          r = g = b = gray;
          break;
      }
      
      // Fill sample block
      for (let dy = 0; dy < sampleStep && y + dy < height; dy++) {
        for (let dx = 0; dx < sampleStep && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

export function renderChladniFigures(
  ctx: CanvasRenderingContext2D,
  params: ChladniFiguresParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const colors = COLOR_SCHEMES[params.colorScheme];
  
  // Background
  fillCanvas(ctx, colors.bg, width, height);
  
  // Draw gradient field as base
  drawGradientField(ctx, width, height, params, time);
  
  // Draw nodal lines
  if (params.showLines) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    drawNodalLines(ctx, width, height, params, time);
    ctx.restore();
  }
  
  // Draw particles on nodal lines
  if (params.showParticles) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    drawParticles(ctx, width, height, params, time);
    ctx.restore();
  }
  
  // Add subtle vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export const chladniFigures: ArtGenerator = {
  name: "Chladni Figures",
  description: 
    "Cymatic patterns created by vibrating plates. Named after Ernst Chladni, who discovered " +
    "that fine particles settle along nodal lines where the plate doesn't vibrate. " +
    "These patterns emerge from the eigenfunctions of the wave equation, revealing " +
    "the hidden geometry of sound. Each mode (m, n) produces a unique pattern, " +
    "from simple curves to intricate mandala-like structures.",
  params: {
    mode: {
      name: "Plate Shape",
      type: "select",
      options: ["square", "circle", "rectangle"],
      default: "square",
    },
    m: {
      name: "Mode M",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 3,
    },
    n: {
      name: "Mode N",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 2,
    },
    frequency: {
      name: "Vibration Speed",
      type: "range",
      min: 0.1,
      max: 3,
      step: 0.1,
      default: 1,
    },
    particleCount: {
      name: "Particle Density",
      type: "range",
      min: 500,
      max: 8000,
      step: 500,
      default: 3000,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["monochrome", "heatmap", "electric", "ocean", "sunset"],
      default: "electric",
    },
    showParticles: {
      name: "Show Particles",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    showLines: {
      name: "Show Nodal Lines",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    lineThickness: {
      name: "Line Thickness",
      type: "range",
      min: 0.5,
      max: 4,
      step: 0.5,
      default: 1.5,
    },
    vibrationIntensity: {
      name: "Vibration Intensity",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 1,
    },
    damping: {
      name: "Damping",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.5,
    },
  },
  generate: (ctx, params, time) => {
    // Convert string params to proper types
    const typedParams: ChladniFiguresParams = {
      mode: params.mode as ChladniFiguresParams["mode"],
      m: Number(params.m),
      n: Number(params.n),
      frequency: Number(params.frequency),
      particleCount: Number(params.particleCount),
      colorScheme: params.colorScheme as ChladniFiguresParams["colorScheme"],
      showParticles: params.showParticles === "true",
      showLines: params.showLines === "true",
      lineThickness: Number(params.lineThickness),
      vibrationIntensity: Number(params.vibrationIntensity),
      damping: Number(params.damping),
    };
    renderChladniFigures(ctx, typedParams, time);
  },
  meta: {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "geometric", "ordered", "detailed", "futuristic"],
    created: "2024-02-26",
  },
};
