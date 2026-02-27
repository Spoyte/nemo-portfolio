import { ArtGenerator } from "./core";

export interface FourierSynthesisParams {
  // Harmonic controls
  fundamentalFreq: number;
  harmonics: number;
  harmonicDecay: number;
  // Waveform type
  waveform: "sawtooth" | "square" | "triangle" | "custom" | "pulse";
  // Visual options
  showComponents: boolean;
  showSum: boolean;
  showCircles: boolean;
  showWaveform: boolean;
  componentOpacity: number;
  lineThickness: number;
  // Animation
  animationSpeed: number;
  freezePhase: boolean;
  // Color
  colorMode: "spectrum" | "harmonic" | "monochrome" | "rainbow";
  // Phase offset for custom waves
  phaseOffset: number;
  // Pulse width (for pulse wave)
  pulseWidth: number;
}

export const fourierSynthesisDefaultParams: FourierSynthesisParams = {
  fundamentalFreq: 1,
  harmonics: 8,
  harmonicDecay: 1,
  waveform: "sawtooth",
  showComponents: true,
  showSum: true,
  showCircles: true,
  showWaveform: true,
  componentOpacity: 0.4,
  lineThickness: 2,
  animationSpeed: 1,
  freezePhase: false,
  colorMode: "spectrum",
  phaseOffset: 0,
  pulseWidth: 0.5,
};

// Get harmonic amplitude based on waveform type
function getHarmonicAmplitude(
  harmonic: number,
  waveform: string,
  decay: number,
  pulseWidth: number
): number {
  switch (waveform) {
    case "sawtooth":
      // 1/n for all harmonics
      return (Math.pow(decay, harmonic - 1) / harmonic) * 100;
    case "square":
      // 1/n for odd harmonics only
      if (harmonic % 2 === 0) return 0;
      return (Math.pow(decay, (harmonic - 1) / 2) / harmonic) * 100;
    case "triangle":
      // 1/n² for odd harmonics, alternating sign
      if (harmonic % 2 === 0) return 0;
      return (Math.pow(decay, (harmonic - 1) / 2) / (harmonic * harmonic)) * 200;
    case "pulse":
      // Complex based on duty cycle
      const duty = pulseWidth * Math.PI;
      return (
        (Math.sin(harmonic * duty) / (harmonic * Math.PI)) *
        Math.pow(decay, harmonic - 1) *
        150
      );
    case "custom":
      // User-controlled decay
      return Math.pow(decay, harmonic - 1) * 80;
    default:
      return 0;
  }
}

// Get color for a harmonic
function getHarmonicColor(
  harmonic: number,
  totalHarmonics: number,
  mode: string,
  time: number
): string {
  const normalized = harmonic / totalHarmonics;

  switch (mode) {
    case "spectrum":
      // Map harmonics to visible spectrum (red to violet)
      const hue = 280 - normalized * 280; // Red (0) to Violet (~280)
      return `hsla(${hue}, 85%, 60%, 0.8)`;
    case "harmonic":
      // Warm colors for lower, cool for higher
      const harmonicHue = 60 - normalized * 180; // Yellow to Blue
      return `hsla(${harmonicHue}, 80%, 55%, 0.8)`;
    case "rainbow":
      const rainbowHue = (time * 30 + harmonic * 30) % 360;
      return `hsla(${rainbowHue}, 80%, 60%, 0.8)`;
    case "monochrome":
    default:
      const lightness = 70 - normalized * 40;
      return `hsla(200, 20%, ${lightness}%, 0.8)`;
  }
}

// Draw epicycles (rotating circles)
function drawEpicycles(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  time: number,
  params: FourierSynthesisParams,
  waveformPoints: { x: number; y: number }[]
): { x: number; y: number } {
  let x = centerX;
  let y = centerY;

  for (let h = 1; h <= params.harmonics; h++) {
    const amplitude = getHarmonicAmplitude(
      h,
      params.waveform,
      params.harmonicDecay,
      params.pulseWidth
    );
    if (Math.abs(amplitude) < 0.1) continue;

    const prevX = x;
    const prevY = y;

    // Phase for this harmonic
    const phase = params.freezePhase ? 0 : time * params.animationSpeed * h;
    const phaseOffset = params.phaseOffset * h;

    // Calculate new position
    x += amplitude * Math.cos(phase + phaseOffset);
    y += amplitude * Math.sin(phase + phaseOffset);

    if (params.showCircles) {
      const color = getHarmonicColor(h, params.harmonics, params.colorMode, time);

      // Draw circle
      ctx.strokeStyle = color.replace("0.8", "0.2");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(prevX, prevY, Math.abs(amplitude), 0, Math.PI * 2);
      ctx.stroke();

      // Draw radius line
      ctx.strokeStyle = color.replace("0.8", "0.4");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Store the tip position for waveform
  if (waveformPoints.length > 800) {
    waveformPoints.pop();
  }
  waveformPoints.unshift({ x, y });

  return { x, y };
}

// Draw individual harmonic components as sine waves
function drawHarmonicComponents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FourierSynthesisParams
): void {
  if (!params.showComponents) return;

  const waveY = height * 0.75;
  const waveHeight = height * 0.15;
  const waveWidth = width * 0.8;
  const startX = width * 0.1;

  // Draw each harmonic as a separate wave
  for (let h = 1; h <= params.harmonics; h++) {
    const amplitude = getHarmonicAmplitude(
      h,
      params.waveform,
      params.harmonicDecay,
      params.pulseWidth
    );
    if (Math.abs(amplitude) < 0.1) continue;

    const color = getHarmonicColor(h, params.harmonics, params.colorMode, time);
    const alphaColor = color.replace("0.8", params.componentOpacity.toFixed(2));

    ctx.strokeStyle = alphaColor;
    ctx.lineWidth = params.lineThickness;
    ctx.beginPath();

    for (let px = 0; px <= waveWidth; px += 2) {
      const t = (px / waveWidth) * Math.PI * 2;
      const phase = params.freezePhase ? 0 : time * params.animationSpeed * h;
      const phaseOffset = params.phaseOffset * h;
      const y =
        waveY + (amplitude / 100) * waveHeight * Math.sin(h * t + phase + phaseOffset);

      if (px === 0) {
        ctx.moveTo(startX + px, y);
      } else {
        ctx.lineTo(startX + px, y);
      }
    }
    ctx.stroke();
  }
}

// Draw the summed waveform
function drawSummedWaveform(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FourierSynthesisParams
): void {
  if (!params.showSum) return;

  const waveY = height * 0.75;
  const waveHeight = height * 0.15;
  const waveWidth = width * 0.8;
  const startX = width * 0.1;

  ctx.strokeStyle =
    params.colorMode === "monochrome"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(255, 200, 100, 0.9)";
  ctx.lineWidth = params.lineThickness * 1.5;
  ctx.beginPath();

  for (let px = 0; px <= waveWidth; px += 1) {
    const t = (px / waveWidth) * Math.PI * 2;
    let sum = 0;

    for (let h = 1; h <= params.harmonics; h++) {
      const amplitude = getHarmonicAmplitude(
        h,
        params.waveform,
        params.harmonicDecay,
        params.pulseWidth
      );
      if (Math.abs(amplitude) < 0.1) continue;

      const phase = params.freezePhase ? 0 : time * params.animationSpeed * h;
      const phaseOffset = params.phaseOffset * h;
      sum += amplitude * Math.sin(h * t + phase + phaseOffset);
    }

    const y = waveY + (sum / 100) * waveHeight * 0.5;

    if (px === 0) {
      ctx.moveTo(startX + px, y);
    } else {
      ctx.lineTo(startX + px, y);
    }
  }
  ctx.stroke();

  // Draw center line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, waveY);
  ctx.lineTo(startX + waveWidth, waveY);
  ctx.stroke();
}

// Draw the traced waveform from epicycles
function drawTracedWaveform(
  ctx: CanvasRenderingContext2D,
  waveformPoints: { x: number; y: number }[],
  tipX: number,
  tipY: number,
  params: FourierSynthesisParams,
  time: number
): void {
  if (!params.showWaveform || waveformPoints.length < 2) return;

  const width = ctx.canvas.width;
  const waveY = width * 0.75;

  // Draw connection line from epicycle tip to waveform
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(width * 0.9, tipY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw the traced waveform
  ctx.strokeStyle =
    params.colorMode === "monochrome"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(100, 255, 200, 0.9)";
  ctx.lineWidth = params.lineThickness * 1.5;
  ctx.beginPath();

  waveformPoints.forEach((point, i) => {
    const x = width * 0.9 - i * 2;
    if (x < width * 0.1) return;

    if (i === 0) {
      ctx.moveTo(x, point.y);
    } else {
      ctx.lineTo(x, point.y);
    }
  });
  ctx.stroke();

  // Draw current point
  ctx.fillStyle =
    params.colorMode === "monochrome" ? "#ffffff" : "#64ffc8";
  ctx.beginPath();
  ctx.arc(width * 0.9, tipY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Glow effect
  const gradient = ctx.createRadialGradient(
    width * 0.9,
    tipY,
    0,
    width * 0.9,
    tipY,
    15
  );
  gradient.addColorStop(0, "rgba(100, 255, 200, 0.5)");
  gradient.addColorStop(1, "rgba(100, 255, 200, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(width * 0.9, tipY, 15, 0, Math.PI * 2);
  ctx.fill();
}

// Waveform point storage per canvas
const waveformStorage = new WeakMap<
  HTMLCanvasElement,
  { x: number; y: number }[]
>();

// Main render function
export function renderFourierSynthesis(
  ctx: CanvasRenderingContext2D,
  params: FourierSynthesisParams,
  timestamp: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const time = timestamp / 1000;

  // Clear canvas with fade
  ctx.fillStyle = "rgba(10, 12, 20, 0.3)";
  ctx.fillRect(0, 0, width, height);

  // Get or initialize waveform points
  let waveformPoints = waveformStorage.get(ctx.canvas);
  if (!waveformPoints) {
    waveformPoints = [];
    waveformStorage.set(ctx.canvas, waveformPoints);
  }

  // Layout: Epicycles on left, waveforms on bottom
  const epicycleCenterX = width * 0.25;
  const epicycleCenterY = height * 0.35;

  // Draw title/info
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "14px sans-serif";
  ctx.fillText(
    `Fourier Synthesis — ${params.harmonics} harmonics`,
    20,
    30
  );

  // Draw epicycles and get tip position
  const tip = drawEpicycles(
    ctx,
    epicycleCenterX,
    epicycleCenterY,
    time,
    params,
    waveformPoints
  );

  // Draw harmonic components
  drawHarmonicComponents(ctx, width, height, time, params);

  // Draw summed waveform
  drawSummedWaveform(ctx, width, height, time, params);

  // Draw traced waveform from epicycles
  drawTracedWaveform(ctx, waveformPoints, tip.x, tip.y, params, time);

  // Draw legend
  drawLegend(ctx, width, height, params, time);
}

// Draw legend showing harmonic amplitudes
function drawLegend(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: FourierSynthesisParams,
  time: number
): void {
  const legendX = width - 150;
  const legendY = 50;

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px sans-serif";
  ctx.fillText("Harmonics:", legendX, legendY - 10);

  let yOffset = 0;
  for (let h = 1; h <= Math.min(params.harmonics, 12); h++) {
    const amplitude = getHarmonicAmplitude(
      h,
      params.waveform,
      params.harmonicDecay,
      params.pulseWidth
    );
    if (Math.abs(amplitude) < 0.1) continue;

    const color = getHarmonicColor(h, params.harmonics, params.colorMode, time);

    // Color indicator
    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY + yOffset, 12, 12);

    // Label
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "10px sans-serif";
    ctx.fillText(
      `H${h}: ${amplitude.toFixed(1)}`,
      legendX + 18,
      legendY + yOffset + 10
    );

    yOffset += 18;
  }

  // Waveform label
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "11px sans-serif";
  ctx.fillText(
    `Mode: ${params.waveform}`,
    legendX,
    legendY + yOffset + 10
  );
}

// Generator definition
export const fourierSynthesis: ArtGenerator = {
  name: "Fourier Synthesis",
  description:
    "Visualize how complex waveforms are built from simple sine waves. Watch rotating epicycles trace out waveforms while individual harmonics combine to create sawtooth, square, triangle, and custom waves. A beautiful demonstration of the mathematics behind sound and signal processing.",
  params: {
    fundamentalFreq: {
      name: "Fundamental Frequency",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1,
    },
    harmonics: {
      name: "Number of Harmonics",
      type: "range",
      min: 1,
      max: 20,
      step: 1,
      default: 8,
    },
    harmonicDecay: {
      name: "Harmonic Decay",
      type: "range",
      min: 0.1,
      max: 1.5,
      step: 0.05,
      default: 1,
    },
    waveform: {
      name: "Waveform Type",
      type: "select",
      options: ["sawtooth", "square", "triangle", "pulse", "custom"],
      default: "sawtooth",
    },
    showComponents: {
      name: "Show Components",
      type: "boolean",
      default: true,
    },
    showSum: {
      name: "Show Sum",
      type: "boolean",
      default: true,
    },
    showCircles: {
      name: "Show Epicycles",
      type: "boolean",
      default: true,
    },
    showWaveform: {
      name: "Show Traced Wave",
      type: "boolean",
      default: true,
    },
    componentOpacity: {
      name: "Component Opacity",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 0.4,
    },
    lineThickness: {
      name: "Line Thickness",
      type: "range",
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    animationSpeed: {
      name: "Animation Speed",
      type: "range",
      min: 0,
      max: 3,
      step: 0.1,
      default: 1,
    },
    freezePhase: {
      name: "Freeze Phase",
      type: "boolean",
      default: false,
    },
    colorMode: {
      name: "Color Mode",
      type: "select",
      options: ["spectrum", "harmonic", "rainbow", "monochrome"],
      default: "spectrum",
    },
    phaseOffset: {
      name: "Phase Offset",
      type: "range",
      min: 0,
      max: Math.PI * 2,
      step: 0.1,
      default: 0,
    },
    pulseWidth: {
      name: "Pulse Width",
      type: "range",
      min: 0.1,
      max: 0.9,
      step: 0.05,
      default: 0.5,
    },
  },
  generate: (ctx, params, timestamp = 0) => {
    const p = { ...fourierSynthesisDefaultParams, ...params } as FourierSynthesisParams;
    renderFourierSynthesis(ctx, p, timestamp);
  },
};
