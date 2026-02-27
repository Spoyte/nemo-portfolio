import { ArtGenerator } from "./core";

export interface DoublePendulumParams {
  gravity: number;
  length1: number;
  length2: number;
  mass1: number;
  mass2: number;
  damping: number;
  trailLength: number;
  trailFade: number;
  colorMode: "rainbow" | "velocity" | "time" | "monochrome" | "fire" | "ocean";
  showArms: boolean;
  armThickness: number;
  timeStep: number;
  initialAngle1: number;
  initialAngle2: number;
  chaosMode: boolean;
  particleCount: number;
}

export const doublePendulumDefaultParams: DoublePendulumParams = {
  gravity: 9.81,
  length1: 120,
  length2: 120,
  mass1: 20,
  mass2: 20,
  damping: 0.995,
  trailLength: 800,
  trailFade: 0.98,
  colorMode: "rainbow",
  showArms: true,
  armThickness: 2,
  timeStep: 0.3,
  initialAngle1: Math.PI / 2,
  initialAngle2: Math.PI / 2,
  chaosMode: false,
  particleCount: 1,
};

// Color palettes
const colorPalettes: Record<string, string[]> = {
  rainbow: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFA5"],
  fire: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FF6347", "#DC143C"],
  ocean: ["#000080", "#0047AB", "#0077BE", "#0099CC", "#40E0D0", "#00FFFF"],
  monochrome: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080"],
};

// Get color based on mode
function getColor(
  mode: string,
  velocity: number,
  time: number,
  trailIndex: number,
  maxTrail: number
): string {
  const normalizedIndex = trailIndex / maxTrail;

  switch (mode) {
    case "rainbow": {
      const hue = (time * 50 + normalizedIndex * 360) % 360;
      return `hsla(${hue}, 80%, 60%, ${1 - normalizedIndex * 0.7})`;
    }
    case "velocity": {
      const speed = Math.min(velocity / 15, 1);
      const hue = 240 - speed * 240; // Blue (slow) to Red (fast)
      return `hsla(${hue}, 80%, 60%, ${1 - normalizedIndex * 0.7})`;
    }
    case "time": {
      const hue = (time * 30) % 360;
      return `hsla(${hue}, 70%, 60%, ${1 - normalizedIndex * 0.7})`;
    }
    case "fire": {
      const colors = colorPalettes.fire;
      const idx = Math.floor(normalizedIndex * colors.length);
      return colors[Math.min(idx, colors.length - 1)];
    }
    case "ocean": {
      const colors = colorPalettes.ocean;
      const idx = Math.floor(normalizedIndex * colors.length);
      return colors[Math.min(idx, colors.length - 1)];
    }
    case "monochrome": {
      const gray = Math.floor(255 * (1 - normalizedIndex));
      return `rgba(${gray}, ${gray}, ${gray}, ${1 - normalizedIndex * 0.5})`;
    }
    default:
      return `hsla(${(time * 50) % 360}, 80%, 60%, ${1 - normalizedIndex * 0.7})`;
  }
}

// Double pendulum state
interface PendulumState {
  angle1: number;
  angle2: number;
  velocity1: number;
  velocity2: number;
  trail: { x: number; y: number; velocity: number; time: number }[];
  colorOffset: number;
}

// Initialize pendulum state
function createPendulumState(
  angle1: number,
  angle2: number,
  colorOffset: number = 0
): PendulumState {
  return {
    angle1,
    angle2,
    velocity1: 0,
    velocity2: 0,
    trail: [],
    colorOffset,
  };
}

// Calculate derivatives using Lagrangian mechanics
function calculateDerivatives(
  state: PendulumState,
  params: DoublePendulumParams
): { dAngle1: number; dAngle2: number; dVelocity1: number; dVelocity2: number } {
  const { gravity, length1, length2, mass1, mass2 } = params;
  const { angle1, angle2, velocity1, velocity2 } = state;

  const cosDiff = Math.cos(angle1 - angle2);
  const sinDiff = Math.sin(angle1 - angle2);

  const totalMass = mass1 + mass2;

  // Denominator for both angular accelerations
  const denom1 = (totalMass) * length1;
  const denom2 = mass2 * length2 * cosDiff;

  // Angular acceleration of first pendulum
  const num1 =
    -mass2 * length1 * velocity1 * velocity1 * sinDiff * cosDiff +
    mass2 * gravity * Math.sin(angle2) * cosDiff +
    mass2 * length2 * velocity2 * velocity2 * sinDiff -
    totalMass * gravity * Math.sin(angle1);

  const dVelocity1 = num1 / (denom1 - (denom2 * cosDiff * length1) / length2);

  // Angular acceleration of second pendulum
  const num2 =
    -mass2 * length2 * velocity2 * velocity2 * sinDiff * cosDiff +
    totalMass * gravity * Math.sin(angle1) * cosDiff +
    totalMass * length1 * velocity1 * velocity1 * sinDiff -
    totalMass * gravity * Math.sin(angle2);

  const dVelocity2 = num2 / ((mass2 * length2 * cosDiff * cosDiff * length1) / length1 - totalMass * length2 / mass2);

  return {
    dAngle1: velocity1,
    dAngle2: velocity2,
    dVelocity1,
    dVelocity2,
  };
}

// Update pendulum state using RK4 integration
function updatePendulum(
  state: PendulumState,
  params: DoublePendulumParams,
  cx: number,
  cy: number
): void {
  const dt = params.timeStep * 0.016; // Normalize to ~60fps

  // RK4 integration
  const k1 = calculateDerivatives(state, params);

  const state2: PendulumState = {
    ...state,
    angle1: state.angle1 + k1.dAngle1 * dt * 0.5,
    angle2: state.angle2 + k1.dAngle2 * dt * 0.5,
    velocity1: state.velocity1 + k1.dVelocity1 * dt * 0.5,
    velocity2: state.velocity2 + k1.dVelocity2 * dt * 0.5,
    trail: [],
    colorOffset: state.colorOffset,
  };
  const k2 = calculateDerivatives(state2, params);

  const state3: PendulumState = {
    ...state,
    angle1: state.angle1 + k2.dAngle1 * dt * 0.5,
    angle2: state.angle2 + k2.dAngle2 * dt * 0.5,
    velocity1: state.velocity1 + k2.dVelocity1 * dt * 0.5,
    velocity2: state.velocity2 + k2.dVelocity2 * dt * 0.5,
    trail: [],
    colorOffset: state.colorOffset,
  };
  const k3 = calculateDerivatives(state3, params);

  const state4: PendulumState = {
    ...state,
    angle1: state.angle1 + k3.dAngle1 * dt,
    angle2: state.angle2 + k3.dAngle2 * dt,
    velocity1: state.velocity1 + k3.dVelocity1 * dt,
    velocity2: state.velocity2 + k3.dVelocity2 * dt,
    trail: [],
    colorOffset: state.colorOffset,
  };
  const k4 = calculateDerivatives(state4, params);

  // Update state
  state.angle1 += (k1.dAngle1 + 2 * k2.dAngle1 + 2 * k3.dAngle1 + k4.dAngle1) * dt / 6;
  state.angle2 += (k1.dAngle2 + 2 * k2.dAngle2 + 2 * k3.dAngle2 + k4.dAngle2) * dt / 6;
  state.velocity1 += (k1.dVelocity1 + 2 * k2.dVelocity1 + 2 * k3.dVelocity1 + k4.dVelocity1) * dt / 6;
  state.velocity2 += (k1.dVelocity2 + 2 * k2.dVelocity2 + 2 * k3.dVelocity2 + k4.dVelocity2) * dt / 6;

  // Apply damping
  state.velocity1 *= params.damping;
  state.velocity2 *= params.damping;

  // Calculate bob positions
  const x1 = cx + Math.sin(state.angle1) * params.length1;
  const y1 = cy + Math.cos(state.angle1) * params.length1;
  const x2 = x1 + Math.sin(state.angle2) * params.length2;
  const y2 = y1 + Math.cos(state.angle2) * params.length2;

  // Calculate velocity magnitude for coloring
  const velocity = Math.sqrt(state.velocity1 * state.velocity1 + state.velocity2 * state.velocity2);

  // Add to trail
  state.trail.push({ x: x2, y: y2, velocity, time: Date.now() });

  // Limit trail length
  while (state.trail.length > params.trailLength) {
    state.trail.shift();
  }
}

// Draw pendulum trail
function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: { x: number; y: number; velocity: number; time: number }[],
  params: DoublePendulumParams,
  globalTime: number
): void {
  if (trail.length < 2) return;

  for (let i = 1; i < trail.length; i++) {
    const point = trail[i];
    const prevPoint = trail[i - 1];
    const color = getColor(params.colorMode, point.velocity, globalTime, trail.length - i, trail.length);

    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.5, 3 * (1 - (trail.length - i) / trail.length));
    ctx.stroke();
  }
}

// Draw pendulum arms and bobs
function drawPendulum(
  ctx: CanvasRenderingContext2D,
  state: PendulumState,
  params: DoublePendulumParams,
  cx: number,
  cy: number,
  colorOffset: number
): void {
  const x1 = cx + Math.sin(state.angle1) * params.length1;
  const y1 = cy + Math.cos(state.angle1) * params.length1;
  const x2 = x1 + Math.sin(state.angle2) * params.length2;
  const y2 = y1 + Math.cos(state.angle2) * params.length2;

  if (params.showArms) {
    // Draw arms
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
    ctx.lineWidth = params.armThickness;

    // First arm
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Second arm
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw bobs with glow
  const hue = (colorOffset + globalTime * 50) % 360;

  // First bob glow
  const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, params.mass1 * 2);
  gradient1.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.8)`);
  gradient1.addColorStop(1, `hsla(${hue}, 80%, 50%, 0)`);
  ctx.fillStyle = gradient1;
  ctx.beginPath();
  ctx.arc(x1, y1, params.mass1 * 2, 0, Math.PI * 2);
  ctx.fill();

  // First bob
  ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
  ctx.beginPath();
  ctx.arc(x1, y1, params.mass1, 0, Math.PI * 2);
  ctx.fill();

  // Second bob glow
  const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, params.mass2 * 2);
  gradient2.addColorStop(0, `hsla(${(hue + 60) % 360}, 80%, 70%, 0.8)`);
  gradient2.addColorStop(1, `hsla(${(hue + 60) % 360}, 80%, 50%, 0)`);
  ctx.fillStyle = gradient2;
  ctx.beginPath();
  ctx.arc(x2, y2, params.mass2 * 2, 0, Math.PI * 2);
  ctx.fill();

  // Second bob
  ctx.fillStyle = `hsla(${(hue + 60) % 360}, 80%, 60%, 0.9)`;
  ctx.beginPath();
  ctx.arc(x2, y2, params.mass2, 0, Math.PI * 2);
  ctx.fill();
}

// Global time reference for color cycling
let globalTime = 0;

// Main render function
export function renderDoublePendulum(
  ctx: CanvasRenderingContext2D,
  params: DoublePendulumParams,
  timestamp: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const cx = width / 2;
  const cy = height / 4; // Anchor point near top

  globalTime = timestamp / 1000;

  // Fade effect for trails
  ctx.fillStyle = `rgba(10, 10, 20, ${1 - params.trailFade})`;
  ctx.fillRect(0, 0, width, height);

  // Get or initialize pendulum states
  let pendulums: PendulumState[] = (ctx.canvas as any).__doublePendulumStates;

  if (!pendulums || pendulums.length !== params.particleCount) {
    pendulums = [];
    for (let i = 0; i < params.particleCount; i++) {
      const angleOffset = params.chaosMode ? (Math.random() - 0.5) * 0.1 : i * 0.05;
      pendulums.push(
        createPendulumState(
          params.initialAngle1 + angleOffset,
          params.initialAngle2 + angleOffset * 0.5,
          i * 60
        )
      );
    }
    (ctx.canvas as any).__doublePendulumStates = pendulums;
  }

  // Update and draw each pendulum
  pendulums.forEach((pendulum, index) => {
    updatePendulum(pendulum, params, cx, cy);
    drawTrail(ctx, pendulum.trail, params, globalTime + index);
  });

  // Draw pendulum structures on top
  pendulums.forEach((pendulum, index) => {
    drawPendulum(ctx, pendulum, params, cx, cy, pendulum.colorOffset);
  });

  // Draw anchor point
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();

  // Anchor glow
  const anchorGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
  anchorGlow.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  anchorGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = anchorGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Generator definition
export const doublePendulum: ArtGenerator = {
  name: "Double Pendulum Chaos",
  description:
    "A mesmerizing physics simulation of the double pendulum — a classic example of chaotic motion. Watch as simple deterministic rules create beautifully unpredictable patterns through the trails left by the swinging bobs.",
  params: {
    gravity: {
      name: "Gravity",
      type: "range",
      min: 1,
      max: 20,
      step: 0.1,
      default: 9.81,
    },
    length1: {
      name: "First Arm Length",
      type: "range",
      min: 50,
      max: 200,
      step: 5,
      default: 120,
    },
    length2: {
      name: "Second Arm Length",
      type: "range",
      min: 50,
      max: 200,
      step: 5,
      default: 120,
    },
    mass1: {
      name: "First Bob Mass",
      type: "range",
      min: 10,
      max: 40,
      step: 2,
      default: 20,
    },
    mass2: {
      name: "Second Bob Mass",
      type: "range",
      min: 10,
      max: 40,
      step: 2,
      default: 20,
    },
    damping: {
      name: "Damping",
      type: "range",
      min: 0.95,
      max: 1.0,
      step: 0.001,
      default: 0.995,
    },
    trailLength: {
      name: "Trail Length",
      type: "range",
      min: 100,
      max: 2000,
      step: 50,
      default: 800,
    },
    trailFade: {
      name: "Trail Fade",
      type: "range",
      min: 0.9,
      max: 0.999,
      step: 0.001,
      default: 0.98,
    },
    colorMode: {
      name: "Color Mode",
      type: "select",
      options: ["rainbow", "velocity", "time", "monochrome", "fire", "ocean"],
      default: "rainbow",
    },
    showArms: {
      name: "Show Arms",
      type: "boolean",
      default: true,
    },
    armThickness: {
      name: "Arm Thickness",
      type: "range",
      min: 1,
      max: 5,
      step: 0.5,
      default: 2,
    },
    timeStep: {
      name: "Simulation Speed",
      type: "range",
      min: 0.1,
      max: 1.0,
      step: 0.05,
      default: 0.3,
    },
    initialAngle1: {
      name: "Initial Angle 1",
      type: "range",
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
      default: Math.PI / 2,
    },
    initialAngle2: {
      name: "Initial Angle 2",
      type: "range",
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
      default: Math.PI / 2,
    },
    chaosMode: {
      name: "Chaos Mode",
      type: "boolean",
      default: false,
    },
    particleCount: {
      name: "Pendulum Count",
      type: "range",
      min: 1,
      max: 5,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, timestamp = 0) => {
    const p = { ...doublePendulumDefaultParams, ...params } as DoublePendulumParams;
    renderDoublePendulum(ctx, p, timestamp);
  },
};
