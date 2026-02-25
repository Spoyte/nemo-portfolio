import { ArtGenerator, ArtParams, ParamConfig, SeededRandom } from "./core";

// Neural Dreams - Visualization of neural network activation patterns
// Fully connected feed-forward network with signal propagation

export interface NeuralDreamsParams {
  layers: number;
  neuronsPerLayer: number;
  signalSpeed: number;
  colorMode: string;
  seed: number;
}

interface Neuron {
  x: number;
  y: number;
  layer: number;
  index: number;
  activation: number;
  targetActivation: number;
  pulsePhase: number;
}

interface Connection {
  from: Neuron;
  to: Neuron;
  weight: number;
  activity: number;
}

interface Signal {
  connection: Connection;
  progress: number;
  strength: number;
  speed: number;
  dead: boolean;
}

interface NeuralDreamsState {
  neurons: Neuron[][];
  connections: Connection[];
  signals: Signal[];
  pulseTimer: number;
  totalProcessed: number;
  rng: SeededRandom;
}

// Color palettes
const PALETTES: Record<string, { bg: string; neuron: string; active: string; signal: string; connection: string }> = {
  neural: { bg: "#0a0a0a", neuron: "#2a2a2a", active: "#00ff88", signal: "#00ffff", connection: "#1a1a2e" },
  fire: { bg: "#1a0a0a", neuron: "#2a1a1a", active: "#ff4400", signal: "#ffaa00", connection: "#2a1510" },
  ocean: { bg: "#0a0a1a", neuron: "#1a1a2a", active: "#0088ff", signal: "#00ccff", connection: "#10152a" },
  aurora: { bg: "#0a1a0a", neuron: "#1a2a1a", active: "#ff00ff", signal: "#00ffaa", connection: "#152a15" },
};

// Module-level state for animation persistence
const stateMap = new Map<string, NeuralDreamsState>();

function getState(canvasId: string, seed: number): NeuralDreamsState {
  if (!stateMap.has(canvasId)) {
    stateMap.set(canvasId, {
      neurons: [],
      connections: [],
      signals: [],
      pulseTimer: 0,
      totalProcessed: 0,
      rng: new SeededRandom(seed),
    });
  }
  return stateMap.get(canvasId)!;
}

function buildNetwork(
  state: NeuralDreamsState,
  layers: number,
  neuronsPerLayer: number,
  width: number,
  height: number,
  seed: number
): void {
  // Re-initialize RNG with seed for deterministic network structure
  state.rng = new SeededRandom(seed);
  
  state.neurons = [];
  state.connections = [];
  state.signals = [];

  const layerWidth = (width - 40) / (layers - 1);
  const layerHeight = (height - 40) / (neuronsPerLayer - 1);
  const startX = 20;
  const startY = 20;

  // Create neurons
  for (let l = 0; l < layers; l++) {
    const layerNeurons: Neuron[] = [];
    const x = startX + l * layerWidth;
    const yOffset = (height - 40 - (neuronsPerLayer - 1) * layerHeight) / 2 + startY;

    for (let n = 0; n < neuronsPerLayer; n++) {
      const y = yOffset + n * layerHeight;
      layerNeurons.push({
        x,
        y,
        layer: l,
        index: n,
        activation: 0,
        targetActivation: 0,
        pulsePhase: state.rng.random() * Math.PI * 2,
      });
    }
    state.neurons.push(layerNeurons);
  }

  // Create connections (fully connected between adjacent layers)
  for (let l = 0; l < layers - 1; l++) {
    for (const from of state.neurons[l]) {
      for (const to of state.neurons[l + 1]) {
        state.connections.push({
          from,
          to,
          weight: state.rng.random() * 2 - 1,
          activity: 0,
        });
      }
    }
  }
}

function propagateFrom(state: NeuralDreamsState, neuron: Neuron, strength: number): void {
  const outgoing = state.connections.filter((c) => c.from === neuron);
  for (const conn of outgoing) {
    if (state.rng.random() < 0.7) {
      // 70% propagation chance
      state.signals.push({
        connection: conn,
        progress: 0,
        strength,
        speed: 0,
        dead: false,
      });
    }
  }
}

function injectInput(state: NeuralDreamsState, layers: number): void {
  const inputLayer = state.neurons[0];
  if (!inputLayer) return;

  const numActive = Math.floor(state.rng.random() * 3) + 1;

  for (let i = 0; i < numActive; i++) {
    const neuron = inputLayer[Math.floor(state.rng.random() * inputLayer.length)];
    if (neuron) {
      neuron.targetActivation = Math.min(1, neuron.targetActivation + 1);
      propagateFrom(state, neuron, 1);
    }
  }

  state.totalProcessed += numActive;
}

export function renderNeuralDreams(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number,
  canvasId: string = "default"
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const layers = (params.layers as number) || 5;
  const neuronsPerLayer = (params.neuronsPerLayer as number) || 8;
  const signalSpeed = (params.signalSpeed as number) || 4;
  const colorMode = (params.colorMode as string) || "neural";
  const seed = (params.seed as number) || 1;

  const palette = PALETTES[colorMode] || PALETTES.neural;
  const state = getState(canvasId, seed);

  // Initialize network if needed or if seed changed
  if (state.neurons.length === 0 || state.neurons.length !== layers) {
    buildNetwork(state, layers, neuronsPerLayer, width, height, seed);
  }

  // Clear canvas
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Update and draw connections
  for (const conn of state.connections) {
    conn.activity *= 0.9;

    const alpha = 0.1 + conn.activity * 0.5;
    const lineWidth = 0.5 + Math.abs(conn.weight) * 1.5;

    ctx.strokeStyle = conn.activity > 0.01 ? palette.signal : palette.connection;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(conn.from.x, conn.from.y);
    ctx.lineTo(conn.to.x, conn.to.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Update and draw neurons
  for (const layer of state.neurons) {
    for (const neuron of layer) {
      // Smooth activation decay
      neuron.activation += (neuron.targetActivation - neuron.activation) * 0.1;
      neuron.targetActivation *= 0.95;
      neuron.pulsePhase += 0.05;

      const pulse = Math.sin(neuron.pulsePhase) * 0.3 + 0.7;
      const size = 4 + neuron.activation * 6;
      const alpha = 0.3 + neuron.activation * 0.7;

      // Glow effect
      const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, size * 3);
      const alphaHex = Math.floor(alpha * pulse * 255)
        .toString(16)
        .padStart(2, "0");
      gradient.addColorStop(0, palette.active + alphaHex);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = neuron.activation > 0.1 ? palette.active : palette.neuron;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Update and draw signals
  const speedFactor = signalSpeed * 0.02;
  state.signals = state.signals.filter((s) => !s.dead);

  for (const signal of state.signals) {
    signal.progress += speedFactor;
    if (signal.progress >= 1) {
      signal.dead = true;
      signal.connection.to.targetActivation = Math.min(
        1,
        signal.connection.to.targetActivation + signal.strength * 0.5
      );
      signal.connection.activity = 1;

      // Propagate to next layer
      if (signal.connection.to.layer < layers - 1) {
        propagateFrom(state, signal.connection.to, signal.strength * 0.7);
      }
    }

    const x =
      signal.connection.from.x +
      (signal.connection.to.x - signal.connection.from.x) * signal.progress;
    const y =
      signal.connection.from.y +
      (signal.connection.to.y - signal.connection.from.y) * signal.progress;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    gradient.addColorStop(0, palette.signal);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Core dot
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Periodic input injection
  state.pulseTimer++;
  if (state.pulseTimer > 60 / signalSpeed) {
    injectInput(state, layers);
    state.pulseTimer = 0;
  }
}

export const neuralDreamsDefaultParams: Record<string, number | string> = {
  layers: 5,
  neuronsPerLayer: 8,
  signalSpeed: 4,
  colorMode: "neural",
  seed: 1,
};

export const neuralDreams: ArtGenerator = {
  name: "Neural Dreams",
  description: "Visualization of neural network activation patterns with signal propagation through fully-connected layers. Watch as signals flow from input to output, creating organic activation waves. (seeded)",
  params: {
    layers: {
      name: "Layers",
      type: "range",
      min: 3,
      max: 7,
      step: 1,
      default: 5,
    },
    neuronsPerLayer: {
      name: "Neurons Per Layer",
      type: "range",
      min: 4,
      max: 12,
      step: 1,
      default: 8,
    },
    signalSpeed: {
      name: "Signal Speed",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 4,
    },
    colorMode: {
      name: "Color Mode",
      type: "select",
      options: ["neural", "fire", "ocean", "aurora"],
      default: "neural",
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, time) => {
    renderNeuralDreams(ctx, params, time || 0, ctx.canvas.id || "default");
  },
};
