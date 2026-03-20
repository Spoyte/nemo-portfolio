// Seeded Random Number Generator for Deterministic Generative Art
// Based on Mulberry32 - fast, simple, decent quality for visual art
// Enables reproducible outputs: same seed = same artwork

export class SeededRandom {
  private state: number;

  constructor(seed: string | number) {
    // Convert string seed to numeric hash
    if (typeof seed === "string") {
      this.state = this.hashString(seed);
    } else {
      this.state = seed >>> 0; // Ensure unsigned 32-bit
    }
  }

  // FNV-1a inspired string hash
  private hashString(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }

  // Mulberry32 algorithm - returns 32-bit unsigned integer
  private next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Random float in range [0, 1)
  random(): number {
    return this.next();
  }

  // Random float in range [min, max)
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Random integer in range [min, max] (inclusive)
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  // Random boolean with given probability
  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  // Pick random element from array
  pick<T>(array: T[]): T {
    return array[this.rangeInt(0, array.length - 1)];
  }

  // Shuffle array in place (Fisher-Yates)
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.rangeInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Random point in circle
  pointInCircle(radius: number = 1): { x: number; y: number } {
    const angle = this.range(0, Math.PI * 2);
    const r = radius * Math.sqrt(this.next());
    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    };
  }

  // Perlin-like noise (simplified, seeded)
  noise(x: number, y: number = 0): number {
    // Simple value noise based on seed
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.state * 0.1) * 43758.5453;
    return n - Math.floor(n);
  }

  // Gaussian random (Box-Muller transform)
  gaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  // Get current state (for saving/resuming)
  getState(): number {
    return this.state;
  }

  // Set state directly (for deterministic branching)
  setState(state: number): void {
    this.state = state >>> 0;
  }

  // Fork: create independent RNG with derived seed
  fork(): SeededRandom {
    return new SeededRandom(this.next() * 4294967296);
  }
}

// Utility: Generate random seed string
export function generateSeed(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let seed = "";
  for (let i = 0; i < 12; i++) {
    seed += chars[Math.floor(Math.random() * chars.length)];
  }
  return seed;
}

// Utility: Create seeded noise function (compatible with core.ts createNoise)
export function createSeededNoise(seed: string | number) {
  const rng = new SeededRandom(seed);
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = rng.rangeInt(0, 255);
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const u = fade(fx);
    const v = fade(fy);
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;

    return lerp(
      v,
      lerp(u, grad(perm[A], fx, fy), grad(perm[B], fx - 1, fy)),
      lerp(u, grad(perm[A + 1], fx, fy - 1), grad(perm[B + 1], fx - 1, fy - 1))
    );
  };
}

// Example usage for art generators:
// const rng = new SeededRandom(params.seed || generateSeed());
// const x = rng.range(0, width);
// const color = rng.pick(palette);
// const noise = createSeededNoise(params.seed);

// Convenience function to create a seeded random instance
export function seededRandom(seed: string | number): SeededRandom {
  return new SeededRandom(seed);
}
