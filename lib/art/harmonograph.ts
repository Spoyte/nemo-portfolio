import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// Pendulum Harmonograph - Multi-pendulum drawing machine simulation
// Creates intricate patterns through damped harmonic motion interference

export interface HarmonographParams extends ArtParams {
  pendulumCount: number;
  frequencyX1: number;
  frequencyX2: number;
  frequencyY1: number;
  frequencyY2: number;
  amplitudeX1: number;
  amplitudeX2: number;
  amplitudeY1: number;
  amplitudeY2: number;
  damping: number;
  phaseX1: number;
  phaseX2: number;
  phaseY1: number;
  phaseY2: number;
  lineWidth: number;
  opacity: number;
  iterations: number;
  colorScheme: "monochrome" | "gradient" | "rainbow" | "fire" | "ocean" | "neon";
  backgroundStyle: "black" | "white" | "dark-blue" | "cream";
  showPendulums: boolean;
  rainbowSpeed: number;
  rotation: number;
  autoRotate: boolean;
  rotationSpeed: number;
}

const PRESETS = {
  classic: {
    frequencyX1: 2, frequencyY1: 3,
    frequencyX2: 0, frequencyY2: 0,
    phaseX1: 0, phaseY1: Math.PI / 2,
  },
  lisajous: {
    frequencyX1: 3, frequencyY1: 4,
    frequencyX2: 0, frequencyY2: 0,
    phaseX1: 0, phaseY1: Math.PI / 4,
  },
  complex: {
    frequencyX1: 2.01, frequencyX2: 3.02,
    frequencyY1: 3.0, frequencyY2: 2.0,
    phaseX1: 0, phaseX2: Math.PI / 2,
    phaseY1: Math.PI / 4, phaseY2: Math.PI / 3,
  },
};

function getColorFromScheme(
  scheme: HarmonographParams["colorScheme"],
  t: number,
  hueOffset: number
): string {
  switch (scheme) {
    case "monochrome":
      const gray = Math.floor(255 * (0.3 + 0.7 * (1 - t)));
      return `rgb(${gray}, ${gray}, ${gray})`;
    case "gradient":
      const r = Math.floor(255 * (1 - t * 0.5));
      const g = Math.floor(200 * (1 - t));
      const b = Math.floor(100 + 155 * t);
      return `rgb(${r}, ${g}, ${b})`;
    case "rainbow":
      const hue = (t * 360 + hueOffset) % 360;
      return `hsl(${hue}, 80%, 60%)`;
    case "fire":
      return `rgb(255, ${Math.floor(100 + 155 * (1 - t))}, ${Math.floor(50 * (1 - t))})`;
    case "ocean":
      return `rgb(${Math.floor(50 + 100 * (1 - t))}, ${Math.floor(100 + 155 * (1 - t * 0.5))}, ${Math.floor(200 + 55 * t)})`;
    case "neon":
      const nh = (t * 180 + hueOffset) % 360;
      return `hsl(${nh}, 100%, 70%)`;
    default:
      return "white";
  }
}

function getBackgroundColor(style: HarmonographParams["backgroundStyle"]): string {
  const colors: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    "dark-blue": "#0a0a1a",
    cream: "#f5f0e6",
  };
  return colors[style] || "#000000";
}

export function renderHarmonograph(
  ctx: CanvasRenderingContext2D,
  params: HarmonographParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = getBackgroundColor(params.backgroundStyle);
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width, height) / 600;
  const currentRotation = (params.rotation + (params.autoRotate ? time * params.rotationSpeed * 60 : 0)) * Math.PI / 180;
  const hueOffset = params.autoRotate ? time * params.rainbowSpeed * 60 : 0;

  ctx.lineWidth = params.lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const points: { x: number; y: number; t: number }[] = [];
  const dt = 0.01;

  for (let i = 0; i < params.iterations; i++) {
    const t = i * dt;
    const decay = Math.exp(-params.damping * t * 100);

    let x = params.amplitudeX1 * Math.sin(params.frequencyX1 * t + params.phaseX1) * decay;
    if (params.pendulumCount >= 3) {
      x += params.amplitudeX2 * Math.sin(params.frequencyX2 * t + params.phaseX2) * decay;
    }

    let y = params.amplitudeY1 * Math.sin(params.frequencyY1 * t + params.phaseY1) * decay;
    if (params.pendulumCount >= 4) {
      y += params.amplitudeY2 * Math.sin(params.frequencyY2 * t + params.phaseY2) * decay;
    }

    const rx = x * Math.cos(currentRotation) - y * Math.sin(currentRotation);
    const ry = x * Math.sin(currentRotation) + y * Math.cos(currentRotation);

    points.push({
      x: centerX + rx * scale,
      y: centerY + ry * scale,
      t: i / params.iterations,
    });
  }

  if (points.length > 1) {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      const color = getColorFromScheme(params.colorScheme, p1.t, hueOffset);
      ctx.strokeStyle = color;
      ctx.globalAlpha = params.opacity * (1 - p1.t * 0.5);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
}

export const harmonographParams: Record<string, ParamConfig> = {
  pendulumCount: { name: "Pendulum Count", type: "range", min: 2, max: 4, step: 1, default: 4 },
  frequencyX1: { name: "Frequency X1", type: "range", min: 0.1, max: 10, step: 0.01, default: 2.01 },
  frequencyX2: { name: "Frequency X2", type: "range", min: 0.1, max: 10, step: 0.01, default: 3.02 },
  frequencyY1: { name: "Frequency Y1", type: "range", min: 0.1, max: 10, step: 0.01, default: 3.0 },
  frequencyY2: { name: "Frequency Y2", type: "range", min: 0.1, max: 10, step: 0.01, default: 2.0 },
  amplitudeX1: { name: "Amplitude X1", type: "range", min: 0, max: 300, step: 10, default: 200 },
  amplitudeX2: { name: "Amplitude X2", type: "range", min: 0, max: 200, step: 10, default: 100 },
  amplitudeY1: { name: "Amplitude Y1", type: "range", min: 0, max: 300, step: 10, default: 200 },
  amplitudeY2: { name: "Amplitude Y2", type: "range", min: 0, max: 200, step: 10, default: 100 },
  damping: { name: "Damping", type: "range", min: 0.0001, max: 0.02, step: 0.0001, default: 0.002 },
  phaseX1: { name: "Phase X1", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: 0 },
  phaseX2: { name: "Phase X2", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 2 },
  phaseY1: { name: "Phase Y1", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 4 },
  phaseY2: { name: "Phase Y2", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 3 },
  lineWidth: { name: "Line Width", type: "range", min: 0.1, max: 3, step: 0.1, default: 0.5 },
  opacity: { name: "Opacity", type: "range", min: 0.1, max: 1, step: 0.05, default: 0.6 },
  iterations: { name: "Iterations", type: "range", min: 1000, max: 20000, step: 500, default: 5000 },
  colorScheme: { name: "Color Scheme", type: "select", options: ["monochrome", "gradient", "rainbow", "fire", "ocean", "neon"], default: "gradient" },
  backgroundStyle: { name: "Background", type: "select", options: ["black", "white", "dark-blue", "cream"], default: "black" },
  showPendulums: { name: "Show Pendulums", type: "select", options: ["true", "false"], default: "false" },
  rainbowSpeed: { name: "Rainbow Speed", type: "range", min: 0, max: 5, step: 0.1, default: 0.5 },
  rotation: { name: "Rotation", type: "range", min: 0, max: 360, step: 1, default: 0 },
  autoRotate: { name: "Auto Rotate", type: "select", options: ["true", "false"], default: "false" },
  rotationSpeed: { name: "Rotation Speed", type: "range", min: -2, max: 2, step: 0.1, default: 0.2 },
};

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

export const harmonograph: ArtGenerator = {
  name: "Pendulum Harmonograph",
  description: "Multi-pendulum drawing machine creating intricate patterns through damped harmonic motion interference",
  params: harmonographParams,
  generate: renderHarmonograph,
};
