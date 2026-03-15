import { ArtGenerator, ArtParams } from "./core";

export interface MultiScaleTuringParams extends ArtParams {
  scale1: number;      // Large pattern scale
  scale2: number;      // Medium pattern scale
  scale3: number;      // Small pattern scale
  rate1: number;       // Reaction rate for scale 1
  rate2: number;       // Reaction rate for scale 2
  rate3: number;       // Reaction rate for scale 3
  feed: number;        // Feed rate
  kill: number;        // Kill rate
  diffusionA: number;  // Activator diffusion
  diffusionB: number;  // Inhibitor diffusion
  colorScheme: "zebra" | "leopard" | "coral" | "midnight" | "sunset";
  blendMode: "additive" | "multiplicative" | "max" | "overlay";
  animate: boolean;
  speed: number;
}

export const multiScaleTuringDefaultParams: MultiScaleTuringParams = {
  scale1: 8,
  scale2: 4,
  scale3: 2,
  rate1: 1.0,
  rate2: 0.7,
  rate3: 0.4,
  feed: 0.055,
  kill: 0.062,
  diffusionA: 1.0,
  diffusionB: 0.5,
  colorScheme: "leopard",
  blendMode: "overlay",
  animate: true,
  speed: 1.0,
};

// Color schemes inspired by natural patterns
const colorSchemes: Record<string, { bg: [number, number, number]; fg: [number, number, number]; accent: [number, number, number] }> = {
  zebra: {
    bg: [20, 20, 25],
    fg: [240, 240, 245],
    accent: [180, 180, 190],
  },
  leopard: {
    bg: [180, 150, 100],
    fg: [40, 30, 20],
    accent: [120, 80, 40],
  },
  coral: {
    bg: [10, 30, 40],
    fg: [255, 120, 100],
    accent: [255, 200, 150],
  },
  midnight: {
    bg: [5, 10, 25],
    fg: [100, 150, 255],
    accent: [200, 100, 255],
  },
  sunset: {
    bg: [40, 20, 40],
    fg: [255, 100, 80],
    accent: [255, 200, 100],
  },
};

interface TuringLayer {
  gridA: Float32Array;
  gridB: Float32Array;
  nextA: Float32Array;
  nextB: Float32Array;
  scale: number;
  rate: number;
}

function createTuringLayer(width: number, height: number, scale: number, rate: number): TuringLayer {
  const size = width * height;
  const gridA = new Float32Array(size);
  const gridB = new Float32Array(size);
  const nextA = new Float32Array(size);
  const nextB = new Float32Array(size);

  // Initialize with noise at appropriate scale
  for (let i = 0; i < size; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    
    // Multi-frequency noise for rich initial conditions
    const noise1 = Math.sin(x / scale) * Math.cos(y / scale);
    const noise2 = Math.sin(x / (scale * 0.5) + 1.5) * Math.cos(y / (scale * 0.5) + 2.3);
    const noise3 = Math.random() * 0.1;
    
    gridA[i] = 1.0 + noise1 * 0.1 + noise2 * 0.05 + noise3;
    gridB[i] = 0.0 + Math.random() * 0.1;
  }

  // Seed with some B spots
  const numSeeds = Math.floor((width * height) / (scale * scale * 10));
  for (let i = 0; i < numSeeds; i++) {
    const x = Math.floor(Math.random() * (width - scale) + scale / 2);
    const y = Math.floor(Math.random() * (height - scale) + scale / 2);
    const idx = y * width + x;
    gridB[idx] = 1.0;
    
    // Small cluster
    if (idx + 1 < size) gridB[idx + 1] = 0.8;
    if (idx - 1 >= 0) gridB[idx - 1] = 0.8;
    if (idx + width < size) gridB[idx + width] = 0.8;
    if (idx - width >= 0) gridB[idx - width] = 0.8;
  }

  return { gridA, gridB, nextA, nextB, scale, rate };
}

function laplacian(grid: Float32Array, x: number, y: number, width: number, height: number): number {
  const idx = y * width + x;
  const xm1 = x > 0 ? -1 : width - 1;
  const xp1 = x < width - 1 ? 1 : -(width - 1);
  const ym1 = y > 0 ? -width : width * (height - 1);
  const yp1 = y < height - 1 ? width : -width * (height - 1);

  // 9-point stencil for smoother patterns
  const center = grid[idx];
  const sum = (
    grid[idx + ym1 + xm1] * 0.05 +
    grid[idx + ym1] * 0.2 +
    grid[idx + ym1 + xp1] * 0.05 +
    grid[idx + xm1] * 0.2 +
    center * -1.0 +
    grid[idx + xp1] * 0.2 +
    grid[idx + yp1 + xm1] * 0.05 +
    grid[idx + yp1] * 0.2 +
    grid[idx + yp1 + xp1] * 0.05
  );

  return sum;
}

function stepTuring(
  layer: TuringLayer,
  width: number,
  height: number,
  feed: number,
  kill: number,
  diffusionA: number,
  diffusionB: number,
  dt: number
): void {
  const { gridA, gridB, nextA, nextB, rate } = layer;
  const adjustedDt = dt * rate;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const a = gridA[idx];
      const b = gridB[idx];

      const la = laplacian(gridA, x, y, width, height);
      const lb = laplacian(gridB, x, y, width, height);

      const reaction = a * b * b;

      nextA[idx] = a + adjustedDt * (diffusionA * la - reaction + feed * (1 - a));
      nextB[idx] = b + adjustedDt * (diffusionB * lb + reaction - (kill + feed) * b);

      // Clamp to prevent instability
      nextA[idx] = Math.max(0, Math.min(1, nextA[idx]));
      nextB[idx] = Math.max(0, Math.min(1, nextB[idx]));
    }
  }

  // Swap buffers
  layer.gridA.set(nextA);
  layer.gridB.set(nextB);
}

function blendLayers(
  layers: TuringLayer[],
  result: Float32Array,
  width: number,
  height: number,
  blendMode: string
): void {
  const size = width * height;

  for (let i = 0; i < size; i++) {
    let value = 0;

    switch (blendMode) {
      case "additive":
        value = 0;
        for (const layer of layers) {
          value += layer.gridB[i] * layer.rate;
        }
        value = Math.min(1, value);
        break;

      case "multiplicative":
        value = 1;
        for (const layer of layers) {
          value *= (1 - layer.gridB[i] * layer.rate);
        }
        value = 1 - value;
        break;

      case "max":
        value = 0;
        for (const layer of layers) {
          value = Math.max(value, layer.gridB[i] * layer.rate);
        }
        break;

      case "overlay":
      default: {
        // Weighted combination favoring detail
        let weightSum = 0;
        value = 0;
        for (const layer of layers) {
          const weight = layer.rate / layer.scale;
          value += layer.gridB[i] * weight;
          weightSum += weight;
        }
        value = weightSum > 0 ? value / weightSum : 0;
        break;
      }
    }

    result[i] = Math.max(0, Math.min(1, value));
  }
}

export function renderMultiScaleTuring(
  ctx: CanvasRenderingContext2D,
  params: MultiScaleTuringParams,
  timestamp?: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const size = width * height;

  // Initialize or retrieve state
  let layers: TuringLayer[];
  let blendedResult: Float32Array;
  let lastUpdate: number;

  if (!(ctx.canvas as any)._turingState) {
    layers = [
      createTuringLayer(width, height, params.scale1 * 4, params.rate1),
      createTuringLayer(width, height, params.scale2 * 4, params.rate2),
      createTuringLayer(width, height, params.scale3 * 4, params.rate3),
    ];
    blendedResult = new Float32Array(size);
    lastUpdate = timestamp || 0;

    (ctx.canvas as any)._turingState = {
      layers,
      blendedResult,
      lastUpdate,
      width,
      height,
    };
  } else {
    const state = (ctx.canvas as any)._turingState;
    
    // Check for resize
    if (state.width !== width || state.height !== height) {
      layers = [
        createTuringLayer(width, height, params.scale1 * 4, params.rate1),
        createTuringLayer(width, height, params.scale2 * 4, params.rate2),
        createTuringLayer(width, height, params.scale3 * 4, params.rate3),
      ];
      blendedResult = new Float32Array(size);
      state.layers = layers;
      state.blendedResult = blendedResult;
      state.width = width;
      state.height = height;
    } else {
      layers = state.layers;
      blendedResult = state.blendedResult;
    }
    lastUpdate = state.lastUpdate;
  }

  const state = (ctx.canvas as any)._turingState;

  // Update simulation if animating
  if (params.animate && timestamp) {
    const dt = Math.min(1.0, (timestamp - lastUpdate) / 1000 * params.speed);
    if (dt > 0.01) {
      for (const layer of layers) {
        stepTuring(layer, width, height, params.feed, params.kill, params.diffusionA, params.diffusionB, 0.5);
      }
      state.lastUpdate = timestamp;
    }
  }

  // Blend layers
  blendLayers(layers, blendedResult, width, height, params.blendMode);

  // Render to canvas
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const colors = colorSchemes[params.colorScheme];

  for (let i = 0; i < size; i++) {
    const value = blendedResult[i];
    const pixelIdx = i * 4;

    // Interpolate between background and foreground
    const r = Math.floor(colors.bg[0] + (colors.fg[0] - colors.bg[0]) * value);
    const g = Math.floor(colors.bg[1] + (colors.fg[1] - colors.bg[1]) * value);
    const b = Math.floor(colors.bg[2] + (colors.fg[2] - colors.bg[2]) * value);

    data[pixelIdx] = r;
    data[pixelIdx + 1] = g;
    data[pixelIdx + 2] = b;
    data[pixelIdx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

export const multiScaleTuring: ArtGenerator = {
  name: "Multi-Scale Turing Patterns",
  description: "Nested reaction-diffusion patterns at multiple scales — the mathematics behind animal coat patterns",
  params: {
    scale1: {
      name: "Large Scale",
      type: "range",
      min: 2,
      max: 16,
      default: 8,
      step: 1,
    },
    scale2: {
      name: "Medium Scale",
      type: "range",
      min: 1,
      max: 8,
      default: 4,
      step: 1,
    },
    scale3: {
      name: "Small Scale",
      type: "range",
      min: 1,
      max: 4,
      default: 2,
      step: 1,
    },
    rate1: {
      name: "Large Rate",
      type: "range",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
    },
    rate2: {
      name: "Medium Rate",
      type: "range",
      min: 0.1,
      max: 2.0,
      default: 0.7,
      step: 0.1,
    },
    rate3: {
      name: "Small Rate",
      type: "range",
      min: 0.1,
      max: 2.0,
      default: 0.4,
      step: 0.1,
    },
    feed: {
      name: "Feed Rate",
      type: "range",
      min: 0.01,
      max: 0.1,
      default: 0.055,
      step: 0.001,
    },
    kill: {
      name: "Kill Rate",
      type: "range",
      min: 0.01,
      max: 0.1,
      default: 0.062,
      step: 0.001,
    },
    diffusionA: {
      name: "Activator Diffusion",
      type: "range",
      min: 0.1,
      max: 2.0,
      default: 1.0,
      step: 0.1,
    },
    diffusionB: {
      name: "Inhibitor Diffusion",
      type: "range",
      min: 0.1,
      max: 1.0,
      default: 0.5,
      step: 0.1,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["zebra", "leopard", "coral", "midnight", "sunset"],
      default: "leopard",
    },
    blendMode: {
      name: "Blend Mode",
      type: "select",
      options: ["additive", "multiplicative", "max", "overlay"],
      default: "overlay",
    },
    animate: {
      name: "Animate",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    speed: {
      name: "Speed",
      type: "range",
      min: 0.1,
      max: 3.0,
      default: 1.0,
      step: 0.1,
    },
  },
  generate: (ctx, params, timestamp) => {
    const typedParams: MultiScaleTuringParams = {
      scale1: Number(params.scale1),
      scale2: Number(params.scale2),
      scale3: Number(params.scale3),
      rate1: Number(params.rate1),
      rate2: Number(params.rate2),
      rate3: Number(params.rate3),
      feed: Number(params.feed),
      kill: Number(params.kill),
      diffusionA: Number(params.diffusionA),
      diffusionB: Number(params.diffusionB),
      colorScheme: params.colorScheme as MultiScaleTuringParams["colorScheme"],
      blendMode: params.blendMode as MultiScaleTuringParams["blendMode"],
      animate: params.animate === "true",
      speed: Number(params.speed),
    };
    renderMultiScaleTuring(ctx, typedParams, timestamp);
  },
};
