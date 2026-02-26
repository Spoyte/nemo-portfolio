import { ArtGenerator, ArtworkParams, CanvasContext, AnimationState } from "./core";

// Pendulum Harmonograph - Multi-pendulum drawing machine simulation
// Creates intricate patterns through damped harmonic motion interference

export interface HarmonographParams extends ArtworkParams {
  // Pendulum configuration
  pendulumCount: number;      // 2-4 pendulums
  frequencyX1: number;        // X-axis pendulum 1 frequency
  frequencyX2: number;        // X-axis pendulum 2 frequency (if count >= 3)
  frequencyY1: number;        // Y-axis pendulum 1 frequency
  frequencyY2: number;        // Y-axis pendulum 2 frequency (if count >= 4)
  
  // Amplitudes
  amplitudeX1: number;        // Primary X amplitude
  amplitudeX2: number;        // Secondary X amplitude
  amplitudeY1: number;        // Primary Y amplitude
  amplitudeY2: number;        // Secondary Y amplitude
  
  // Damping (decay over time)
  damping: number;            // 0.001 - 0.01
  
  // Phase offsets
  phaseX1: number;            // 0 - 2π
  phaseX2: number;
  phaseY1: number;
  phaseY2: number;
  
  // Drawing parameters
  lineWidth: number;          // 0.1 - 2.0
  opacity: number;            // 0.1 - 1.0
  iterations: number;         // 1000 - 10000
  
  // Visual style
  colorScheme: "monochrome" | "gradient" | "rainbow" | "fire" | "ocean" | "neon";
  backgroundStyle: "black" | "white" | "dark-blue" | "cream";
  showPendulums: boolean;     // Visualize pendulum arms
  rainbowSpeed: number;       // Color cycling speed
  
  // Rotation
  rotation: number;           // 0 - 360 degrees
  autoRotate: boolean;
  rotationSpeed: number;      // degrees per frame
}

export const harmonographDefaultParams: HarmonographParams = {
  pendulumCount: 4,
  frequencyX1: 2.01,
  frequencyX2: 3.02,
  frequencyY1: 3.0,
  frequencyY2: 2.0,
  amplitudeX1: 200,
  amplitudeX2: 100,
  amplitudeY1: 200,
  amplitudeY2: 100,
  damping: 0.002,
  phaseX1: 0,
  phaseX2: Math.PI / 2,
  phaseY1: Math.PI / 4,
  phaseY2: Math.PI / 3,
  lineWidth: 0.5,
  opacity: 0.6,
  iterations: 5000,
  colorScheme: "gradient",
  backgroundStyle: "black",
  showPendulums: false,
  rainbowSpeed: 0.5,
  rotation: 0,
  autoRotate: false,
  rotationSpeed: 0.2,
};

// Preset configurations for interesting patterns
const PRESETS = {
  "classic": {
    frequencyX1: 2, frequencyY1: 3,
    frequencyX2: 0, frequencyY2: 0,
    phaseX1: 0, phaseY1: Math.PI / 2,
  },
  "lisajous": {
    frequencyX1: 3, frequencyY1: 4,
    frequencyX2: 0, frequencyY2: 0,
    phaseX1: 0, phaseY1: Math.PI / 4,
  },
  "complex": {
    frequencyX1: 2.01, frequencyX2: 3.02,
    frequencyY1: 3.0, frequencyY2: 2.0,
    phaseX1: 0, phaseX2: Math.PI / 2,
    phaseY1: Math.PI / 4, phaseY2: Math.PI / 3,
  },
  "dance": {
    frequencyX1: 5, frequencyX2: 3,
    frequencyY1: 4, frequencyY2: 2,
    phaseX1: 0, phaseX2: Math.PI,
    phaseY1: Math.PI / 2, phaseY2: Math.PI / 3,
  },
  "galaxy": {
    frequencyX1: 1.618, frequencyX2: 2.618,
    frequencyY1: 2.618, frequencyY2: 1.618,
    phaseX1: 0, phaseX2: Math.PI / 4,
    phaseY1: Math.PI / 2, phaseY2: Math.PI * 0.75,
  },
};

function getColorFromScheme(
  scheme: HarmonographParams["colorScheme"],
  t: number, // 0-1 progress
  hueOffset: number
): string {
  switch (scheme) {
    case "monochrome":
      const gray = Math.floor(255 * (0.3 + 0.7 * (1 - t)));
      return `rgb(${gray}, ${gray}, ${gray})`;
    
    case "gradient":
      // Gold to purple gradient
      const r = Math.floor(255 * (1 - t * 0.5));
      const g = Math.floor(200 * (1 - t));
      const b = Math.floor(100 + 155 * t);
      return `rgb(${r}, ${g}, ${b})`;
    
    case "rainbow":
      const hue = (t * 360 + hueOffset) % 360;
      return `hsl(${hue}, 80%, 60%)`;
    
    case "fire":
      const fr = Math.floor(255);
      const fg = Math.floor(100 + 155 * (1 - t));
      const fb = Math.floor(50 * (1 - t));
      return `rgb(${fr}, ${fg}, ${fb})`;
    
    case "ocean":
      const or = Math.floor(50 + 100 * (1 - t));
      const og = Math.floor(100 + 155 * (1 - t * 0.5));
      const ob = Math.floor(200 + 55 * t);
      return `rgb(${or}, ${og}, ${ob})`;
    
    case "neon":
      const nh = (t * 180 + hueOffset) % 360;
      return `hsl(${nh}, 100%, 70%)`;
    
    default:
      return "white";
  }
}

function getBackgroundColor(style: HarmonographParams["backgroundStyle"]): string {
  switch (style) {
    case "black": return "#000000";
    case "white": return "#ffffff";
    case "dark-blue": return "#0a0a1a";
    case "cream": return "#f5f0e6";
    default: return "#000000";
  }
}

export function renderHarmonograph(
  ctx: CanvasRenderingContext2D,
  params: HarmonographParams,
  animationState: AnimationState
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Clear and set background
  ctx.fillStyle = getBackgroundColor(params.backgroundStyle);
  ctx.fillRect(0, 0, width, height);
  
  // Calculate scale factor to fit the pattern
  const scale = Math.min(width, height) / 600;
  
  // Current rotation angle
  const currentRotation = params.autoRotate
    ? (params.rotation + animationState.frame * params.rotationSpeed) * Math.PI / 180
    : params.rotation * Math.PI / 180;
  
  // Rainbow hue offset for animation
  const hueOffset = params.autoRotate ? animationState.frame * params.rainbowSpeed : 0;
  
  // Set up line style
  ctx.lineWidth = params.lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Calculate pendulum positions over time
  const points: { x: number; y: number; t: number }[] = [];
  const dt = 0.01; // Time step
  
  for (let i = 0; i < params.iterations; i++) {
    const t = i * dt;
    const decay = Math.exp(-params.damping * t * 100);
    
    // X position: sum of X pendulums
    let x = params.amplitudeX1 * Math.sin(params.frequencyX1 * t + params.phaseX1) * decay;
    if (params.pendulumCount >= 3) {
      x += params.amplitudeX2 * Math.sin(params.frequencyX2 * t + params.phaseX2) * decay;
    }
    
    // Y position: sum of Y pendulums
    let y = params.amplitudeY1 * Math.sin(params.frequencyY1 * t + params.phaseY1) * decay;
    if (params.pendulumCount >= 4) {
      y += params.amplitudeY2 * Math.sin(params.frequencyY2 * t + params.phaseY2) * decay;
    }
    
    // Apply rotation
    const rx = x * Math.cos(currentRotation) - y * Math.sin(currentRotation);
    const ry = x * Math.sin(currentRotation) + y * Math.cos(currentRotation);
    
    points.push({
      x: centerX + rx * scale,
      y: centerY + ry * scale,
      t: i / params.iterations,
    });
  }
  
  // Draw the harmonograph pattern
  if (points.length > 1) {
    // Draw with varying colors
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      
      // Color based on progress through the curve
      const color = getColorFromScheme(params.colorScheme, p1.t, hueOffset);
      ctx.strokeStyle = color;
      ctx.globalAlpha = params.opacity * (1 - p1.t * 0.5); // Fade slightly at the end
      ctx.stroke();
    }
  }
  
  ctx.globalAlpha = 1;
  
  // Optionally draw pendulum arms (simplified visualization)
  if (params.showPendulums && !animationState.isPlaying) {
    drawPendulumArms(ctx, centerX, centerY, scale, params);
  }
  
  // Draw title/info if not animating
  if (!animationState.isPlaying) {
    ctx.fillStyle = params.backgroundStyle === "white" || params.backgroundStyle === "cream" 
      ? "#333" 
      : "#888";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    const info = `fX₁:${params.frequencyX1.toFixed(2)} fY₁:${params.frequencyY1.toFixed(2)}`;
    ctx.fillText(info, 10, height - 20);
  }
}

function drawPendulumArms(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number,
  params: HarmonographParams
): void {
  ctx.strokeStyle = "rgba(128, 128, 128, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  // Simplified arm visualization at t=0
  const decay = 1;
  
  // X1 arm
  const x1 = params.amplitudeX1 * Math.sin(params.phaseX1) * decay * scale;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x1, centerY);
  ctx.stroke();
  
  // Y1 arm
  const y1 = params.amplitudeY1 * Math.sin(params.phaseY1) * decay * scale;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, centerY + y1);
  ctx.stroke();
  
  if (params.pendulumCount >= 3) {
    const x2 = params.amplitudeX2 * Math.sin(params.phaseX2) * decay * scale;
    ctx.beginPath();
    ctx.moveTo(centerX + x1, centerY);
    ctx.lineTo(centerX + x1 + x2, centerY);
    ctx.stroke();
  }
  
  if (params.pendulumCount >= 4) {
    const y2 = params.amplitudeY2 * Math.sin(params.phaseY2) * decay * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + y1);
    ctx.lineTo(centerX, centerY + y1 + y2);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
}

// Randomize parameters for exploration
export function randomizeHarmonographParams(): Partial<HarmonographParams> {
  const presetKeys = Object.keys(PRESETS);
  const preset = PRESETS[presetKeys[Math.floor(Math.random() * presetKeys.length)] as typeof PRESETS["classic"];
  
  return {
    pendulumCount: Math.floor(Math.random() * 3) + 2, // 2-4
    frequencyX1: preset.frequencyX1 + (Math.random() - 0.5) * 0.1,
    frequencyX2: preset.frequencyX2 + (Math.random() - 0.5) * 0.1,
    frequencyY1: preset.frequencyY1 + (Math.random() - 0.5) * 0.1,
    frequencyY2: preset.frequencyY2 + (Math.random() - 0.5) * 0.1,
    amplitudeX1: 150 + Math.random() * 100,
    amplitudeX2: 50 + Math.random() * 100,
    amplitudeY1: 150 + Math.random() * 100,
    amplitudeY2: 50 + Math.random() * 100,
    damping: 0.001 + Math.random() * 0.004,
    phaseX1: Math.random() * Math.PI * 2,
    phaseX2: Math.random() * Math.PI * 2,
    phaseY1: Math.random() * Math.PI * 2,
    phaseY2: Math.random() * Math.PI * 2,
    colorScheme: ["monochrome", "gradient", "rainbow", "fire", "ocean", "neon"][Math.floor(Math.random() * 6)] as HarmonographParams["colorScheme"],
  };
}

export const harmonograph: ArtGenerator = {
  id: "harmonograph",
  name: "Pendulum Harmonograph",
  description: "Multi-pendulum drawing machine creating intricate patterns through damped harmonic motion interference",
  params: harmonographDefaultParams,
  paramConfig: {
    pendulumCount: { type: "int", min: 2, max: 4, step: 1 },
    frequencyX1: { type: "float", min: 0.1, max: 10, step: 0.01 },
    frequencyX2: { type: "float", min: 0.1, max: 10, step: 0.01 },
    frequencyY1: { type: "float", min: 0.1, max: 10, step: 0.01 },
    frequencyY2: { type: "float", min: 0.1, max: 10, step: 0.01 },
    amplitudeX1: { type: "float", min: 0, max: 300, step: 10 },
    amplitudeX2: { type: "float", min: 0, max: 200, step: 10 },
    amplitudeY1: { type: "float", min: 0, max: 300, step: 10 },
    amplitudeY2: { type: "float", min: 0, max: 200, step: 10 },
    damping: { type: "float", min: 0.0001, max: 0.02, step: 0.0001 },
    phaseX1: { type: "float", min: 0, max: Math.PI * 2, step: 0.1 },
    phaseX2: { type: "float", min: 0, max: Math.PI * 2, step: 0.1 },
    phaseY1: { type: "float", min: 0, max: Math.PI * 2, step: 0.1 },
    phaseY2: { type: "float", min: 0, max: Math.PI * 2, step: 0.1 },
    lineWidth: { type: "float", min: 0.1, max: 3, step: 0.1 },
    opacity: { type: "float", min: 0.1, max: 1, step: 0.05 },
    iterations: { type: "int", min: 1000, max: 20000, step: 500 },
    colorScheme: { type: "enum", options: ["monochrome", "gradient", "rainbow", "fire", "ocean", "neon"] },
    backgroundStyle: { type: "enum", options: ["black", "white", "dark-blue", "cream"] },
    showPendulums: { type: "boolean" },
    rainbowSpeed: { type: "float", min: 0, max: 5, step: 0.1 },
    rotation: { type: "float", min: 0, max: 360, step: 1 },
    autoRotate: { type: "boolean" },
    rotationSpeed: { type: "float", min: -2, max: 2, step: 0.1 },
  },
  render: renderHarmonograph,
  randomize: randomizeHarmonographParams,
};
