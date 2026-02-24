import {
  ArtGenerator,
  renderPixels,
} from "./core";

// Simplex-like noise implementation
class NoiseGenerator {
  private perm: number[];
  
  constructor() {
    this.perm = new Array(512);
    const p = new Array(256).fill(0).map((_, i) => i);
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.perm[X] + Y;
    const B = this.perm[X + 1] + Y;
    
    return this.lerp(v,
      this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
      this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
    );
  }
  
  // Multi-octave noise
  fbm(x: number, y: number, octaves: number = 4): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    
    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise(x * frequency, y * frequency);
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return value;
  }
}

const colorSchemes = {
  ocean: {
    low: [10, 30, 60],
    mid: [40, 100, 140],
    high: [200, 220, 240],
    contour: [255, 255, 255],
  },
  earth: {
    low: [60, 40, 20],
    mid: [120, 160, 80],
    high: [220, 210, 180],
    contour: [40, 30, 20],
  },
  heatmap: {
    low: [40, 20, 60],
    mid: [200, 80, 60],
    high: [255, 220, 100],
    contour: [255, 255, 255],
  },
  monochrome: {
    low: [20, 20, 20],
    mid: [100, 100, 100],
    high: [240, 240, 240],
    contour: [255, 255, 255],
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

export const topographicFlow: ArtGenerator = {
  name: "Topographic Flow",
  description: "Animated topographic maps with flowing contour lines",
  params: {
    noiseScale: {
      name: "Terrain Scale",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    contourInterval: {
      name: "Contour Density",
      type: "range",
      min: 5,
      max: 20,
      step: 1,
      default: 8,
    },
    animationSpeed: {
      name: "Flow Speed",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["ocean", "earth", "heatmap", "monochrome"],
      default: "ocean",
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const noiseScale = (params.noiseScale as number) * 0.001;
    const contourInterval = params.contourInterval as number;
    const animationSpeed = (params.animationSpeed as number) * 0.0001;
    const colorScheme = params.colorScheme as keyof typeof colorSchemes;
    
    const scheme = colorSchemes[colorScheme] || colorSchemes.ocean;
    const t = time * animationSpeed;
    
    // Create noise generator (recreated each frame for simplicity, could be cached)
    const noise = new NoiseGenerator();
    
    const offsetX = t * 50;
    const offsetY = t * 30;
    
    renderPixels(ctx, canvas.width, canvas.height, (x, y) => {
      const nx = (x + offsetX) * noiseScale;
      const ny = (y + offsetY) * noiseScale;
      const elevation = noise.fbm(nx, ny, 5);
      const normalized = (elevation + 1) * 0.5;
      
      const contourLevel = Math.floor(normalized * 100 / contourInterval);
      const isContour = Math.abs((normalized * 100) - contourLevel * contourInterval) < 1.5;
      
      if (isContour) {
        return {
          r: scheme.contour[0],
          g: scheme.contour[1],
          b: scheme.contour[2],
          a: 200,
        };
      } else {
        let r, g, b;
        if (normalized < 0.4) {
          const t = normalized / 0.4;
          r = lerp(scheme.low[0], scheme.mid[0], t);
          g = lerp(scheme.low[1], scheme.mid[1], t);
          b = lerp(scheme.low[2], scheme.mid[2], t);
        } else {
          const t = (normalized - 0.4) / 0.6;
          r = lerp(scheme.mid[0], scheme.high[0], t);
          g = lerp(scheme.mid[1], scheme.high[1], t);
          b = lerp(scheme.mid[2], scheme.high[2], t);
        }
        return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: 255 };
      }
    });
  },
};
