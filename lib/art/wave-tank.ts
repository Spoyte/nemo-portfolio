import { ArtGenerator, ArtParams, fillCanvas } from "./core";

export interface WaveTankParams extends ArtParams {
  waveSpeed: number;
  damping: number;
  dropRate: number;
  dropSize: number;
  colorScheme: string;
  showDepth: boolean;
  reflection: boolean;
  viscosity: number;
  windStrength: number;
  dropPattern: string;
}

export const waveTankDefaultParams: WaveTankParams = {
  waveSpeed: 50,
  damping: 95,
  dropRate: 30,
  dropSize: 15,
  colorScheme: "ocean",
  showDepth: true,
  reflection: true,
  viscosity: 30,
  windStrength: 10,
  dropPattern: "random",
};

// Color schemes for water visualization
const COLOR_SCHEMES: Record<string, (height: number, depth: number) => string> = {
  ocean: (h, d) => {
    // Map wave height to ocean colors
    const normalized = Math.max(-1, Math.min(1, h));
    if (normalized > 0.3) {
      // Crest - white foam
      const intensity = Math.min(1, (normalized - 0.3) * 3);
      return `rgba(255, 255, 255, ${0.3 + intensity * 0.7})`;
    } else if (normalized > 0) {
      // Shallow water - cyan to blue
      const t = normalized / 0.3;
      const r = Math.floor(0 + t * 100);
      const g = Math.floor(150 + t * 105);
      const b = Math.floor(200 + t * 55);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Deep water - dark blue
      const t = Math.max(0, 1 + normalized);
      const r = Math.floor(0);
      const g = Math.floor(50 * t);
      const b = Math.floor(100 + t * 100);
      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  sunset: (h, d) => {
    const normalized = Math.max(-1, Math.min(1, h));
    if (normalized > 0.2) {
      const intensity = Math.min(1, (normalized - 0.2) * 4);
      return `rgba(255, 200, 150, ${0.4 + intensity * 0.6})`;
    } else if (normalized > -0.2) {
      const t = (normalized + 0.2) / 0.4;
      const r = Math.floor(255);
      const g = Math.floor(100 + t * 100);
      const b = Math.floor(50 + t * 100);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = Math.max(0, 1 + normalized);
      const r = Math.floor(150 + t * 105);
      const g = Math.floor(50 + t * 50);
      const b = Math.floor(100 + t * 50);
      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  emerald: (h, d) => {
    const normalized = Math.max(-1, Math.min(1, h));
    if (normalized > 0.3) {
      const intensity = Math.min(1, (normalized - 0.3) * 3);
      return `rgba(200, 255, 220, ${0.3 + intensity * 0.7})`;
    } else {
      const t = (normalized + 1) / 1.3;
      const r = Math.floor(0 + t * 50);
      const g = Math.floor(100 + t * 155);
      const b = Math.floor(80 + t * 100);
      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  magma: (h, d) => {
    const normalized = Math.max(-1, Math.min(1, h));
    if (normalized > 0.2) {
      const intensity = Math.min(1, (normalized - 0.2) * 4);
      const r = 255;
      const g = Math.floor(100 + intensity * 155);
      const b = Math.floor(intensity * 100);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (normalized + 1) / 1.2;
      const r = Math.floor(50 + t * 100);
      const g = Math.floor(20 + t * 40);
      const b = Math.floor(10 + t * 20);
      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  monochrome: (h, d) => {
    const normalized = Math.max(-1, Math.min(1, h));
    const v = Math.floor(128 + normalized * 127);
    return `rgb(${v}, ${v}, ${v})`;
  },
  neon: (h, d) => {
    const normalized = Math.max(-1, Math.min(1, h));
    const hue = (normalized + 1) * 180; // Blue to cyan to green
    const sat = 80 + Math.abs(normalized) * 20;
    const light = 40 + Math.abs(normalized) * 40;
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  },
};

// Wave tank simulation state
interface WaveState {
  height: Float32Array;
  velocity: Float32Array;
  prevHeight: Float32Array;
}

function createWaveState(width: number, height: number): WaveState {
  const size = width * height;
  return {
    height: new Float32Array(size),
    velocity: new Float32Array(size),
    prevHeight: new Float32Array(size),
  };
}

function getIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

// Add a drop (disturbance) to the wave field
function addDrop(
  state: WaveState,
  x: number,
  y: number,
  radius: number,
  strength: number,
  width: number,
  height: number
): void {
  const r2 = radius * radius;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const px = Math.floor(x + dx);
      const py = Math.floor(y + dy);
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= r2) {
          const idx = getIndex(px, py, width);
          const falloff = Math.cos((Math.sqrt(dist2) / radius) * Math.PI / 2);
          state.height[idx] += strength * falloff;
        }
      }
    }
  }
}

// Update wave simulation using discrete wave equation
function updateWaves(
  state: WaveState,
  width: number,
  height: number,
  waveSpeed: number,
  damping: number,
  viscosity: number
): void {
  const c = waveSpeed * 0.1; // Wave propagation speed
  const damp = damping / 100; // Energy loss per frame
  const visc = viscosity / 100; // Velocity damping

  // Swap buffers
  const temp = state.prevHeight;
  state.prevHeight = state.height;
  state.height = temp;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getIndex(x, y, width);
      
      // Neighbor indices
      const left = getIndex(x - 1, y, width);
      const right = getIndex(x + 1, y, width);
      const up = getIndex(x, y - 1, width);
      const down = getIndex(x, y + 1, width);
      
      // Discrete Laplacian (average of neighbors - center)
      const neighborAvg = (state.prevHeight[left] + state.prevHeight[right] + 
                          state.prevHeight[up] + state.prevHeight[down]) * 0.25;
      
      // Wave equation: acceleration proportional to Laplacian
      const acceleration = (neighborAvg - state.prevHeight[idx]) * c * c;
      
      // Update velocity with damping
      state.velocity[idx] = (state.velocity[idx] + acceleration) * (1 - visc * 0.1);
      
      // Update position
      state.height[idx] = state.prevHeight[idx] + state.velocity[idx];
      
      // Apply damping
      state.height[idx] *= damp;
    }
  }

  // Boundary conditions (absorbing boundaries)
  for (let x = 0; x < width; x++) {
    state.height[getIndex(x, 0, width)] = state.height[getIndex(x, 1, width)] * 0.5;
    state.height[getIndex(x, height - 1, width)] = state.height[getIndex(x, height - 2, width)] * 0.5;
  }
  for (let y = 0; y < height; y++) {
    state.height[getIndex(0, y, width)] = state.height[getIndex(1, y, width)] * 0.5;
    state.height[getIndex(width - 1, y, width)] = state.height[getIndex(width - 2, y, width)] * 0.5;
  }
}

// Calculate surface normal for lighting
function calculateNormal(
  state: WaveState,
  x: number,
  y: number,
  width: number,
  height: number
): { nx: number; ny: number; nz: number } => {
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    return { nx: 0, ny: 0, nz: 1 };
  }
  
  const idx = getIndex(x, y, width);
  const left = state.height[getIndex(x - 1, y, width)];
  const right = state.height[getIndex(x + 1, y, width)];
  const up = state.height[getIndex(x, y - 1, width)];
  const down = state.height[getIndex(x, y + 1, width)];
  
  // Approximate partial derivatives
  const dx = (right - left) * 0.5;
  const dy = (down - up) * 0.5;
  
  // Normal vector (pointing up, perturbed by slope)
  const nx = -dx;
  const ny = -dy;
  const nz = 1;
  
  // Normalize
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
  return { nx: nx / len, ny: ny / len, nz: nz / len };
};

// Add drops based on pattern
function addPatternDrops(
  state: WaveState,
  width: number,
  height: number,
  time: number,
  dropRate: number,
  dropSize: number,
  pattern: string,
  windStrength: number
): void {
  const dropProbability = dropRate / 100;
  
  switch (pattern) {
    case "random":
      if (Math.random() < dropProbability) {
        const x = Math.floor(Math.random() * (width - 20)) + 10;
        const y = Math.floor(Math.random() * (height - 20)) + 10;
        addDrop(state, x, y, dropSize, 2, width, height);
      }
      break;
      
    case "rain":
      // Multiple drops from top
      for (let i = 0; i < 3; i++) {
        if (Math.random() < dropProbability * 0.5) {
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height * 0.3);
          addDrop(state, x, y, dropSize * 0.7, 1.5, width, height);
        }
      }
      break;
      
    case "heartbeat":
      // Rhythmic drops from center
      const beat = Math.sin(time * 0.005);
      if (beat > 0.8 && Math.random() < 0.3) {
        const cx = width / 2;
        const cy = height / 2;
        addDrop(state, cx, cy, dropSize * 2, 3, width, height);
      }
      break;
      
    case "ripple":
      // Concentric rings
      const ringRadius = (time * 0.05) % (Math.min(width, height) * 0.4);
      const angle = time * 0.002;
      const cx = width / 2;
      const cy = height / 2;
      const rx = cx + Math.cos(angle) * ringRadius;
      const ry = cy + Math.sin(angle) * ringRadius;
      addDrop(state, rx, ry, dropSize * 0.5, 1, width, height);
      break;
      
    case "interference":
      // Two sources creating interference pattern
      const ix1 = width * 0.3;
      const ix2 = width * 0.7;
      const iy = height / 2;
      const phase = time * 0.003;
      if (Math.sin(phase) > 0.9) {
        addDrop(state, ix1, iy + Math.sin(phase) * 20, dropSize, 2, width, height);
      }
      if (Math.sin(phase + Math.PI) > 0.9) {
        addDrop(state, ix2, iy + Math.sin(phase + Math.PI) * 20, dropSize, 2, width, height);
      }
      break;
      
    case "wind":
      // Drops moving with "wind"
      if (Math.random() < dropProbability) {
        const windOffset = (time * windStrength * 0.01) % width;
        const x = (Math.floor(Math.random() * width * 0.3) + windOffset) % width;
        const y = Math.floor(Math.random() * height);
        addDrop(state, x, y, dropSize * 0.8, 1.5, width, height);
      }
      break;
  }
}

export function renderWaveTank(
  ctx: CanvasRenderingContext2D,
  params: WaveTankParams,
  time: number = 0
): void {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  
  // Simulation resolution (lower for performance)
  const simScale = 2;
  const simWidth = Math.floor(canvasWidth / simScale);
  const simHeight = Math.floor(canvasHeight / simScale);
  
  // Initialize or retrieve state
  let state: WaveState;
  const stateKey = "waveTankState";
  const prevParamsKey = "waveTankPrevParams";
  
  // Check if we need to reinitialize
  const prevParams = (ctx.canvas as any)[prevParamsKey];
  const needsInit = !prevParams || 
    prevParams.simWidth !== simWidth || 
    prevParams.simHeight !== simHeight;
  
  if (needsInit || !(ctx.canvas as any)[stateKey]) {
    state = createWaveState(simWidth, simHeight);
    (ctx.canvas as any)[stateKey] = state;
    (ctx.canvas as any)[prevParamsKey] = { simWidth, simHeight };
  } else {
    state = (ctx.canvas as any)[stateKey];
  }
  
  // Add drops based on pattern
  addPatternDrops(
    state,
    simWidth,
    simHeight,
    time,
    params.dropRate,
    Math.max(3, params.dropSize / simScale),
    params.dropPattern,
    params.windStrength
  );
  
  // Update wave simulation
  updateWaves(
    state,
    simWidth,
    simHeight,
    params.waveSpeed,
    params.damping,
    params.viscosity
  );
  
  // Render to canvas
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);
  const data = imageData.data;
  
  const colorFn = COLOR_SCHEMES[params.colorScheme] || COLOR_SCHEMES.ocean;
  
  // Light direction for specular highlights
  const lightX = 0.3;
  const lightY = -0.5;
  const lightZ = 0.8;
  const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
  const lx = lightX / lightLen;
  const ly = lightY / lightLen;
  const lz = lightZ / lightLen;
  
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      // Sample from simulation
      const simX = Math.floor(x / simScale);
      const simY = Math.floor(y / simScale);
      
      if (simX >= 0 && simX < simWidth && simY >= 0 && simY < simHeight) {
        const idx = getIndex(simX, simY, simWidth);
        const height = state.height[idx];
        
        // Get base color
        let color = colorFn(height, 0);
        
        // Add specular highlight if enabled
        if (params.reflection) {
          const normal = calculateNormal(state, simX, simY, simWidth, simHeight);
          const dot = normal.nx * lx + normal.ny * ly + normal.nz * lz;
          const specular = Math.pow(Math.max(0, dot), 20);
          
          if (specular > 0.1) {
            // Blend specular highlight
            const highlightIntensity = specular * 0.5;
            // We'll apply this by adjusting the final pixel
          }
        }
        
        // Parse color and set pixel
        const pixelIdx = (y * canvasWidth + x) * 4;
        
        // Simple color parsing (assuming rgb/rgba format)
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        
        if (rgbaMatch) {
          data[pixelIdx] = parseInt(rgbaMatch[1]);
          data[pixelIdx + 1] = parseInt(rgbaMatch[2]);
          data[pixelIdx + 2] = parseInt(rgbaMatch[3]);
          data[pixelIdx + 3] = Math.round(parseFloat(rgbaMatch[4]) * 255);
        } else if (rgbMatch) {
          data[pixelIdx] = parseInt(rgbMatch[1]);
          data[pixelIdx + 1] = parseInt(rgbMatch[2]);
          data[pixelIdx + 2] = parseInt(rgbMatch[3]);
          data[pixelIdx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add overlay effects
  if (params.showDepth) {
    // Add subtle vignette for depth perception
    const gradient = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,
      canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.7
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 20, 0.3)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  
  // Draw info overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Pattern: ${params.dropPattern}`, 10, canvasHeight - 40);
  ctx.fillText(`Damping: ${params.damping}%`, 10, canvasHeight - 25);
  ctx.fillText(`Speed: ${params.waveSpeed}`, 10, canvasHeight - 10);
}

export const waveTank: ArtGenerator = {
  name: "Wave Tank",
  description: "Real-time 2D water surface simulation using the discrete wave equation. Ripples propagate, reflect, and interfere, creating mesmerizing water patterns. Features multiple drop patterns, adjustable physics parameters, and beautiful color schemes.",
  params: {
    waveSpeed: {
      name: "Wave Speed",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 50,
    },
    damping: {
      name: "Damping",
      type: "range",
      min: 90,
      max: 99,
      step: 1,
      default: 95,
    },
    dropRate: {
      name: "Drop Rate",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: 30,
    },
    dropSize: {
      name: "Drop Size",
      type: "range",
      min: 5,
      max: 40,
      step: 5,
      default: 15,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["ocean", "sunset", "emerald", "magma", "monochrome", "neon"],
      default: "ocean",
    },
    showDepth: {
      name: "Show Depth",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    reflection: {
      name: "Reflection",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    viscosity: {
      name: "Viscosity",
      type: "range",
      min: 0,
      max: 80,
      step: 5,
      default: 30,
    },
    windStrength: {
      name: "Wind Strength",
      type: "range",
      min: 0,
      max: 50,
      step: 5,
      default: 10,
    },
    dropPattern: {
      name: "Drop Pattern",
      type: "select",
      options: ["random", "rain", "heartbeat", "ripple", "interference", "wind"],
      default: "random",
    },
  },
  generate: (ctx, params, time) => {
    renderWaveTank(ctx, params as WaveTankParams, time);
  },
  meta: {
    category: "physics",
    complexity: "complex",
    tags: ["animated", "colorful", "organic", "nature"],
    created: "2026-02-27",
  },
};
