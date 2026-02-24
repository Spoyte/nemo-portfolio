export interface FluidSmokeParams {
  viscosity: number;        // 1-100: fluid resistance
  diffusion: number;        // 1-100: color spread rate
  densitySource: number;    // 10-200: smoke generation rate
  colorScheme: 'fire' | 'ink' | 'neon' | 'steam';
}

export const fluidSmokeDefaultParams: FluidSmokeParams = {
  viscosity: 30,
  diffusion: 20,
  densitySource: 80,
  colorScheme: 'fire',
};

// Grid size for fluid simulation
const N = 64;
const SIZE = (N + 2) * (N + 2);

// Fluid state
let density: Float32Array = new Float32Array(SIZE);
let densityPrev: Float32Array = new Float32Array(SIZE);
let u: Float32Array = new Float32Array(SIZE);      // x velocity
let uPrev: Float32Array = new Float32Array(SIZE);
let v: Float32Array = new Float32Array(SIZE);      // y velocity
let vPrev: Float32Array = new Float32Array(SIZE);

// Source positions (multiple emitters)
const sources: { x: number; y: number; vx: number; vy: number }[] = [
  { x: 0.3, y: 0.85, vx: 0, vy: -2 },
  { x: 0.7, y: 0.85, vx: 0, vy: -2 },
];

function IX(x: number, y: number): number {
  return x + (N + 2) * y;
}

function addSource(x: number, y: number, amount: number, arr: Float32Array) {
  const i = Math.floor(x * N) + 1;
  const j = Math.floor(y * N) + 1;
  if (i >= 1 && i <= N && j >= 1 && j <= N) {
    arr[IX(i, j)] += amount;
    // Spread to neighbors for smoother source
    arr[IX(i - 1, j)] += amount * 0.5;
    arr[IX(i + 1, j)] += amount * 0.5;
    arr[IX(i, j - 1)] += amount * 0.5;
    arr[IX(i, j + 1)] += amount * 0.5;
  }
}

function diffuse(b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) {
  const a = dt * diff * N * N;
  for (let k = 0; k < 10; k++) {
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        x[IX(i, j)] = (x0[IX(i, j)] + a * (x[IX(i - 1, j)] + x[IX(i + 1, j)] + x[IX(i, j - 1)] + x[IX(i, j + 1)])) / (1 + 4 * a);
      }
    }
    setBoundary(b, x);
  }
}

function advect(b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array, dt: number) {
  let i0: number, j0: number, i1: number, j1: number;
  let x: number, y: number, s0: number, t0: number, s1: number, t1: number;
  const dt0 = dt * N;

  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= N; j++) {
      x = i - dt0 * u[IX(i, j)];
      y = j - dt0 * v[IX(i, j)];
      if (x < 0.5) x = 0.5;
      if (x > N + 0.5) x = N + 0.5;
      i0 = Math.floor(x);
      i1 = i0 + 1;
      if (y < 0.5) y = 0.5;
      if (y > N + 0.5) y = N + 0.5;
      j0 = Math.floor(y);
      j1 = j0 + 1;
      s1 = x - i0;
      s0 = 1 - s1;
      t1 = y - j0;
      t0 = 1 - t1;
      d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
                    s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
    }
  }
  setBoundary(b, d);
}

function project(u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array) {
  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= N; j++) {
      div[IX(i, j)] = -0.5 * (u[IX(i + 1, j)] - u[IX(i - 1, j)] + v[IX(i, j + 1)] - v[IX(i, j - 1)]) / N;
      p[IX(i, j)] = 0;
    }
  }
  setBoundary(0, div);
  setBoundary(0, p);

  for (let k = 0; k < 10; k++) {
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        p[IX(i, j)] = (div[IX(i, j)] + p[IX(i - 1, j)] + p[IX(i + 1, j)] + p[IX(i, j - 1)] + p[IX(i, j + 1)]) / 4;
      }
    }
    setBoundary(0, p);
  }

  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= N; j++) {
      u[IX(i, j)] -= 0.5 * N * (p[IX(i + 1, j)] - p[IX(i - 1, j)]);
      v[IX(i, j)] -= 0.5 * N * (p[IX(i, j + 1)] - p[IX(i, j - 1)]);
    }
  }
  setBoundary(1, u);
  setBoundary(2, v);
}

function setBoundary(b: number, x: Float32Array) {
  for (let i = 1; i <= N; i++) {
    x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
    x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
    x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
    x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
  }
  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0, N)]);
  x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)] + x[IX(N + 1, 1)]);
  x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
}

function stepDensity(diffusion: number, dt: number) {
  diffuse(0, densityPrev, density, diffusion, dt);
  advect(0, density, densityPrev, u, v, dt);
}

function stepVelocity(viscosity: number, dt: number) {
  const temp = new Float32Array(SIZE);
  diffuse(1, uPrev, u, viscosity, dt);
  diffuse(2, vPrev, v, viscosity, dt);
  project(uPrev, vPrev, u, v);
  advect(1, u, uPrev, uPrev, vPrev, dt);
  advect(2, v, vPrev, uPrev, vPrev, dt);
  project(u, v, uPrev, vPrev);
}

const colorSchemes = {
  fire: {
    name: 'Fire',
    colors: [
      { r: 0, g: 0, b: 0, threshold: 0 },
      { r: 60, g: 0, b: 0, threshold: 0.1 },
      { r: 120, g: 20, b: 0, threshold: 0.2 },
      { r: 200, g: 60, b: 0, threshold: 0.4 },
      { r: 255, g: 120, b: 0, threshold: 0.6 },
      { r: 255, g: 200, b: 50, threshold: 0.8 },
      { r: 255, g: 255, b: 200, threshold: 1 },
    ],
  },
  ink: {
    name: 'Ink',
    colors: [
      { r: 255, g: 255, b: 255, threshold: 0 },
      { r: 200, g: 220, b: 240, threshold: 0.1 },
      { r: 150, g: 170, b: 200, threshold: 0.2 },
      { r: 80, g: 100, b: 140, threshold: 0.4 },
      { r: 40, g: 50, b: 80, threshold: 0.6 },
      { r: 20, g: 25, b: 40, threshold: 0.8 },
      { r: 10, g: 10, b: 20, threshold: 1 },
    ],
  },
  neon: {
    name: 'Neon',
    colors: [
      { r: 0, g: 0, b: 0, threshold: 0 },
      { r: 20, g: 0, b: 40, threshold: 0.1 },
      { r: 60, g: 0, b: 80, threshold: 0.2 },
      { r: 120, g: 0, b: 150, threshold: 0.4 },
      { r: 200, g: 0, b: 255, threshold: 0.6 },
      { r: 100, g: 200, b: 255, threshold: 0.8 },
      { r: 200, g: 255, b: 255, threshold: 1 },
    ],
  },
  steam: {
    name: 'Steam',
    colors: [
      { r: 0, g: 0, b: 0, threshold: 0 },
      { r: 30, g: 35, b: 40, threshold: 0.1 },
      { r: 60, g: 65, b: 70, threshold: 0.2 },
      { r: 100, g: 105, b: 110, threshold: 0.4 },
      { r: 150, g: 155, b: 160, threshold: 0.6 },
      { r: 200, g: 205, b: 210, threshold: 0.8 },
      { r: 240, g: 245, b: 250, threshold: 1 },
    ],
  },
};

function getColor(d: number, scheme: typeof colorSchemes.fire): { r: number; g: number; b: number } {
  const colors = scheme.colors;
  for (let i = 0; i < colors.length - 1; i++) {
    if (d <= colors[i + 1].threshold) {
      const t = (d - colors[i].threshold) / (colors[i + 1].threshold - colors[i].threshold);
      return {
        r: Math.floor(colors[i].r + t * (colors[i + 1].r - colors[i].r)),
        g: Math.floor(colors[i].g + t * (colors[i + 1].g - colors[i].g)),
        b: Math.floor(colors[i].b + t * (colors[i + 1].b - colors[i].b)),
      };
    }
  }
  return colors[colors.length - 1];
}

export function renderFluidSmoke(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: FluidSmokeParams
): void {
  const dt = 0.1;
  const viscosity = params.viscosity / 1000;
  const diffusion = params.diffusion / 1000;
  const sourceStrength = params.densitySource / 100;

  // Add sources
  for (const source of sources) {
    // Oscillating source positions
    const offsetX = Math.sin(time * 0.5) * 0.1;
    addSource(source.x + offsetX, source.y, sourceStrength * 5, density);
    addSource(source.x + offsetX, source.y, source.vx + Math.sin(time) * 0.5, u);
    addSource(source.x + offsetX, source.y, source.vy, v);
  }

  // Step simulation
  stepVelocity(viscosity, dt);
  stepDensity(diffusion, dt);

  // Fade density slightly for continuous flow effect
  for (let i = 0; i < SIZE; i++) {
    density[i] *= 0.995;
  }

  // Render to canvas
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const scheme = colorSchemes[params.colorScheme];

  // Scale from simulation grid to canvas
  const scaleX = width / N;
  const scaleY = height / N;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sample from simulation grid
      const simX = Math.floor(x / scaleX) + 1;
      const simY = Math.floor(y / scaleY) + 1;
      const d = Math.min(1, density[IX(simX, simY)] / 3);

      const color = getColor(d, scheme);
      const idx = (y * width + x) * 4;
      data[idx] = color.r;
      data[idx + 1] = color.g;
      data[idx + 2] = color.b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
