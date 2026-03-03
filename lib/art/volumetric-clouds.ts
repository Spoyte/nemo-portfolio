import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface VolumetricCloudsParams {
  // Visual parameters
  density: number;        // 10-100: Cloud density
  speed: number;          // 0.1-3: Animation speed
  colorScheme: "daylight" | "sunset" | "storm" | "dream" | "monochrome";
  coverage: number;       // 0.1-1.0: Sky coverage
  animated: boolean;
}

export const volumetricCloudsDefaultParams: VolumetricCloudsParams = {
  density: 60,
  speed: 0.5,
  colorScheme: "daylight",
  coverage: 0.6,
  animated: true,
};

// 3D Simplex noise implementation for volumetric clouds
class SimplexNoise3D {
  private perm: Uint8Array;
  private permMod12: Uint8Array;
  private grad3: number[][];

  constructor(seed = Math.random()) {
    // Gradients for 3D
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    // Generate permutation table from seed
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    
    // Fisher-Yates shuffle with seeded random
    let s = seed * 2147483647;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }

    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  private dot(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  noise3D(x: number, y: number, z: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    let s = (x + y + z) * F3;
    let i = Math.floor(x + s);
    let j = Math.floor(y + s);
    let k = Math.floor(z + s);

    let t = (i + j + k) * G3;
    let X0 = i - t;
    let Y0 = j - t;
    let Z0 = k - t;
    let x0 = x - X0;
    let y0 = y - Y0;
    let z0 = z - Z0;

    let i1, j1, k1;
    let i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    let x1 = x0 - i1 + G3;
    let y1 = y0 - j1 + G3;
    let z1 = z0 - k1 + G3;
    let x2 = x0 - i2 + 2.0 * G3;
    let y2 = y0 - j2 + 2.0 * G3;
    let z2 = z0 - k2 + 2.0 * G3;
    let x3 = x0 - 1.0 + 3.0 * G3;
    let y3 = y0 - 1.0 + 3.0 * G3;
    let z3 = z0 - 1.0 + 3.0 * G3;

    let ii = i & 255;
    let jj = j & 255;
    let kk = k & 255;

    let n0, n1, n2, n3;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[this.permMod12[ii + this.perm[jj + this.perm[kk]]]], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]]], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]]], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;
    else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot(this.grad3[this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]]], x3, y3, z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }

  // Fractal Brownian Motion for cloud-like detail
  fbm(x: number, y: number, z: number, octaves: number = 4): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise3D(x * frequency, y * frequency, z * frequency);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return value / maxValue;
  }
}

// Ray marching through volumetric clouds
function rayMarchClouds(
  origin: number[],
  direction: number[],
  noise: SimplexNoise3D,
  time: number,
  densityScale: number,
  coverage: number
): { color: number[]; alpha: number } {
  const maxSteps = 64;
  const stepSize = 0.15;
  const cloudBottom = -1.0;
  const cloudTop = 2.0;
  
  let transmittance = 1.0;
  let accumulatedColor = [0, 0, 0];
  
  // Sun direction for lighting
  const sunDir = [0.5, 0.8, 0.3];
  const sunIntensity = 1.5;
  
  for (let step = 0; step < maxSteps; step++) {
    const t = step * stepSize;
    const pos = [
      origin[0] + direction[0] * t,
      origin[1] + direction[1] * t,
      origin[2] + direction[2] * t
    ];
    
    // Only sample within cloud layer
    if (pos[1] < cloudBottom || pos[1] > cloudTop) continue;
    
    // Sample density using FBM noise
    const noiseScale = 0.8;
    const density = Math.max(0, 
      noise.fbm(
        pos[0] * noiseScale + time * 0.1,
        pos[1] * noiseScale * 0.5,
        pos[2] * noiseScale + time * 0.05,
        5
      ) * densityScale - (1 - coverage)
    );
    
    if (density > 0.01) {
      // Simple lighting approximation
      const lightSample = [
        pos[0] + sunDir[0] * 0.3,
        pos[1] + sunDir[1] * 0.3,
        pos[2] + sunDir[2] * 0.3
      ];
      const lightDensity = Math.max(0,
        noise.fbm(
          lightSample[0] * noiseScale + time * 0.1,
          lightSample[1] * noiseScale * 0.5,
          lightSample[2] * noiseScale + time * 0.05,
          3
        ) * densityScale - (1 - coverage)
      );
      
      // Beer-Lambert law for light attenuation
      const lightTransmittance = Math.exp(-lightDensity * 2.0);
      const scattering = density * stepSize;
      
      // Accumulate color with lighting
      const stepAlpha = scattering * transmittance;
      accumulatedColor[0] += stepAlpha * lightTransmittance * sunIntensity;
      accumulatedColor[1] += stepAlpha * lightTransmittance * sunIntensity;
      accumulatedColor[2] += stepAlpha * lightTransmittance * sunIntensity;
      
      // Update transmittance
      transmittance *= Math.exp(-scattering * 0.5);
      
      if (transmittance < 0.01) break;
    }
  }
  
  const alpha = 1 - transmittance;
  return { color: accumulatedColor, alpha };
}

export function renderVolumetricClouds(
  ctx: CanvasRenderingContext2D,
  params: Partial<VolumetricCloudsParams> = {},
  time: number = 0
): void {
  const config = { ...volumetricCloudsDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  
  // Initialize noise with fixed seed for consistency
  const noise = new SimplexNoise3D(42);
  
  // Animation time
  const t = config.animated ? time * config.speed * 0.0005 : 0;
  
  // Color schemes - sky gradient + cloud tint
  const schemes: Record<string, { skyTop: string; skyBottom: string; cloudTint: number[] }> = {
    daylight: { 
      skyTop: "#4A90D9", 
      skyBottom: "#87CEEB",
      cloudTint: [1.0, 1.0, 1.0]
    },
    sunset: { 
      skyTop: "#2D1B4E", 
      skyBottom: "#FF6B35",
      cloudTint: [1.0, 0.85, 0.7]
    },
    storm: { 
      skyTop: "#1a1a2e", 
      skyBottom: "#4a4a6a",
      cloudTint: [0.7, 0.75, 0.85]
    },
    dream: { 
      skyTop: "#667eea", 
      skyBottom: "#764ba2",
      cloudTint: [0.95, 0.9, 1.0]
    },
    monochrome: { 
      skyTop: "#2d3748", 
      skyBottom: "#4a5568",
      cloudTint: [0.9, 0.9, 0.9]
    },
  };
  
  const scheme = schemes[config.colorScheme] || schemes.daylight;
  
  // Create sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, scheme.skyTop);
  gradient.addColorStop(1, scheme.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Ray march clouds
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Camera setup
  const fov = Math.PI / 3;
  const aspectRatio = width / height;
  
  // Parse sky colors for blending
  const parseColor = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };
  
  const skyTopColor = parseColor(scheme.skyTop);
  const skyBottomColor = parseColor(scheme.skyBottom);
  
  // Render at reduced resolution for performance
  const step = 2; // 2x2 pixel blocks
  
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      // Normalized device coordinates
      const ndcX = (x / width - 0.5) * 2 * aspectRatio;
      const ndcY = (y / height - 0.5) * -2;
      
      // Ray direction
      const rayDir = [
        ndcX * Math.tan(fov / 2),
        ndcY * Math.tan(fov / 2),
        -1
      ];
      const len = Math.sqrt(rayDir[0]**2 + rayDir[1]**2 + rayDir[2]**2);
      rayDir[0] /= len;
      rayDir[1] /= len;
      rayDir[2] /= len;
      
      // Camera position
      const origin = [0, -0.5, 3];
      
      // Sample cloud density
      const result = rayMarchClouds(
        origin,
        rayDir,
        noise,
        t,
        config.density / 50,
        config.coverage
      );
      
      // Sky gradient at this y
      const skyT = y / height;
      const skyColor = [
        skyTopColor[0] * (1 - skyT) + skyBottomColor[0] * skyT,
        skyTopColor[1] * (1 - skyT) + skyBottomColor[1] * skyT,
        skyTopColor[2] * (1 - skyT) + skyBottomColor[2] * skyT
      ];
      
      // Composite cloud over sky
      const finalColor = [
        skyColor[0] * (1 - result.alpha) + result.color[0] * scheme.cloudTint[0] * result.alpha,
        skyColor[1] * (1 - result.alpha) + result.color[1] * scheme.cloudTint[1] * result.alpha,
        skyColor[2] * (1 - result.alpha) + result.color[2] * scheme.cloudTint[2] * result.alpha
      ];
      
      // Fill the pixel block
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = Math.min(255, finalColor[0] * 255);
          data[idx + 1] = Math.min(255, finalColor[1] * 255);
          data[idx + 2] = Math.min(255, finalColor[2] * 255);
          data[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Backward compatibility: ArtGenerator interface
export const volumetricClouds: ArtGenerator = {
  id: "volumetric-clouds",
  name: "Volumetric Clouds",
  category: "abstract",
  render: (ctx, params, time) => renderVolumetricClouds(ctx, params as VolumetricCloudsParams, time),
  defaultParams: volumetricCloudsDefaultParams,
};

export default volumetricClouds;
