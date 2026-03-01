import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// Vector3 operations
const vec3 = {
  add: (a: number[], b: number[]) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a: number[], s: number) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  length: (a: number[]) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]),
  normalize: (a: number[]) => {
    const len = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    return len > 0.0001 ? [a[0] / len, a[1] / len, a[2] / len] : [0, 0, 0];
  },
  abs: (a: number[]) => [Math.abs(a[0]), Math.abs(a[1]), Math.abs(a[2])],
  max: (a: number[], s: number) => [
    Math.max(a[0], s),
    Math.max(a[1], s),
    Math.max(a[2], s),
  ],
};

// Rotation matrix for Y axis
function rotateY(p: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    p[0] * cos - p[2] * sin,
    p[1],
    p[0] * sin + p[2] * cos,
  ];
}

// Rotation matrix for X axis
function rotateX(p: number[], angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    p[0],
    p[1] * cos - p[2] * sin,
    p[1] * sin + p[2] * cos,
  ];
}

// Signed Distance Functions
const sdf = {
  sphere: (p: number[], r: number) => vec3.length(p) - r,
  
  box: (p: number[], b: number[]) => {
    const q = vec3.sub(vec3.abs(p), b);
    const len = vec3.length(vec3.max(q, 0));
    return len + Math.min(Math.max(q[0], Math.max(q[1], q[2])), 0);
  },
  
  torus: (p: number[], t: number[]) => {
    const q = [vec3.length([p[0], p[2]]) - t[0], p[1]];
    return vec3.length(q) - t[1];
  },
  
  mandelbulb: (p: number[], power: number, iterations: number) => {
    let z = [...p];
    let dr = 1.0;
    let r = 0.0;
    
    for (let i = 0; i < iterations; i++) {
      r = vec3.length(z);
      if (r > 2.0) break;
      
      const theta = Math.acos(z[2] / r);
      const phi = Math.atan2(z[1], z[0]);
      
      dr = Math.pow(r, power - 1.0) * power * dr + 1.0;
      
      const zr = Math.pow(r, power);
      const newTheta = theta * power;
      const newPhi = phi * power;
      
      z = [
        zr * Math.sin(newTheta) * Math.cos(newPhi) + p[0],
        zr * Math.sin(newTheta) * Math.sin(newPhi) + p[1],
        zr * Math.cos(newTheta) + p[2],
      ];
    }
    
    return 0.5 * Math.log(r) * r / dr;
  },
};

// Scene distance function
function sceneDistance(p: number[], shape: string, time: number): number {
  const rotSpeed = time * 0.5;
  let rp = rotateY(p, rotSpeed);
  rp = rotateX(rp, rotSpeed * 0.3);
  
  switch (shape) {
    case "sphere":
      return sdf.sphere(rp, 0.8);
    case "box":
      return sdf.box(rp, [0.5, 0.5, 0.5]);
    case "torus":
      return sdf.torus(rp, [0.5, 0.2]);
    case "mandelbulb":
      return sdf.mandelbulb(rp, 8.0, 8);
    default:
      return sdf.sphere(rp, 0.8);
  }
}

// Calculate normal using gradient
function calculateNormal(p: number[], shape: string, time: number): number[] {
  const eps = 0.001;
  const dx = [eps, 0, 0];
  const dy = [0, eps, 0];
  const dz = [0, 0, eps];
  
  const nx = sceneDistance(vec3.add(p, dx), shape, time) - 
             sceneDistance(vec3.sub(p, dx), shape, time);
  const ny = sceneDistance(vec3.add(p, dy), shape, time) - 
             sceneDistance(vec3.sub(p, dy), shape, time);
  const nz = sceneDistance(vec3.add(p, dz), shape, time) - 
             sceneDistance(vec3.sub(p, dz), shape, time);
  
  return vec3.normalize([nx, ny, nz]);
}

// Soft shadow calculation
function softShadow(
  ro: number[],
  rd: number[],
  mint: number,
  maxt: number,
  k: number,
  shape: string,
  time: number
): number {
  let res = 1.0;
  let t = mint;
  
  for (let i = 0; i < 24; i++) {
    if (t >= maxt) break;
    const h = sceneDistance(vec3.add(ro, vec3.mul(rd, t)), shape, time);
    if (h < 0.001) return 0.0;
    res = Math.min(res, k * h / t);
    t += h;
  }
  
  return res;
}

// Ambient occlusion
function ambientOcclusion(p: number[], n: number[], shape: string, time: number): number {
  let occ = 0.0;
  let weight = 1.0;
  
  for (let i = 0; i < 5; i++) {
    const len = 0.01 + 0.12 * i;
    const dist = sceneDistance(vec3.add(p, vec3.mul(n, len)), shape, time);
    occ += weight * (len - dist);
    weight *= 0.5;
  }
  
  return 1.0 - Math.max(0.0, occ);
}

// Helper: hex to RGB
function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : [255, 255, 255];
}

// Main generate function
function generate(
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number = 0
): void {
  const { width, height } = ctx.canvas;
  
  // Extract parameters
  const density = (params.density as number) ?? 60;
  const speed = (params.speed as number) ?? 1;
  const colorScheme = (params.colorScheme as string) ?? "neon";
  const shape = (params.shape as string) ?? "torus";
  const shadows = (params.shadows as boolean) ?? true;
  const animated = (params.animated as boolean) ?? true;
  
  // Color palettes
  const palettes: Record<string, { colors: string[]; bg: string; light: number[] }> = {
    neon: {
      colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
      bg: "#0a0a0f",
      light: [2.0, 2.0, -2.0],
    },
    gold: {
      colors: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B"],
      bg: "#0f0a05",
      light: [2.0, 3.0, -1.0],
    },
    cyber: {
      colors: ["#00FFFF", "#FF00FF", "#00FF00", "#FFFF00", "#FF0080"],
      bg: "#050510",
      light: [1.5, 2.5, -2.5],
    },
    sunset: {
      colors: ["#FF6B6B", "#FF8E53", "#FE6B8B", "#FF8E53", "#C44569"],
      bg: "#1a0a15",
      light: [2.5, 1.5, -2.0],
    },
    matrix: {
      colors: ["#00FF41", "#008F11", "#003B00", "#00CC33", "#0D0208"],
      bg: "#000500",
      light: [1.0, 3.0, -1.0],
    },
  };
  
  const palette = palettes[colorScheme] || palettes.neon;
  
  // Clear background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Animation time
  const t = animated ? time * speed * 0.0005 : 0;
  
  // Camera setup
  const cameraPos: number[] = [0, 0, -2.5];
  
  // Image data for pixel manipulation
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Ray marching parameters
  const maxSteps = Math.floor(density * 1.5);
  const maxDist = 20.0;
  const epsilon = 0.001;
  
  // Light position
  const lightPos = vec3.normalize(palette.light);
  
  // Render loop
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Normalized screen coordinates (-1 to 1)
      const u = (2.0 * x - width) / height;
      const v = (2.0 * y - height) / height;
      
      // Ray direction
      const rayDir = vec3.normalize([u, -v, 1.0]);
      
      // Ray marching
      let dist = 0.0;
      let hit = false;
      let p = [...cameraPos];
      
      for (let step = 0; step < maxSteps; step++) {
        const d = sceneDistance(p, shape, t);
        
        if (d < epsilon) {
          hit = true;
          break;
        }
        
        dist += d;
        p = vec3.add(cameraPos, vec3.mul(rayDir, dist));
        
        if (dist > maxDist) break;
      }
      
      // Calculate color
      let r = 0, g = 0, b = 0;
      
      if (hit) {
        // Calculate normal
        const normal = calculateNormal(p, shape, t);
        
        // Diffuse lighting
        const diff = Math.max(0, vec3.dot(normal, lightPos));
        
        // Specular
        const reflectDir = vec3.sub(vec3.mul(normal, 2 * vec3.dot(normal, lightPos)), lightPos);
        const spec = Math.pow(Math.max(0, vec3.dot(reflectDir, vec3.mul(rayDir, -1))), 32);
        
        // Shadows
        let shadow = 1.0;
        if (shadows) {
          const shadowRay = vec3.add(p, vec3.mul(normal, epsilon * 2));
          shadow = softShadow(shadowRay, lightPos, 0.1, 5.0, 16.0, shape, t);
        }
        
        // Ambient occlusion
        const ao = ambientOcclusion(p, normal, shape, t);
        
        // Color based on position and normal
        const colorIndex = Math.floor(
          ((Math.atan2(p[2], p[0]) + Math.PI) / (2 * Math.PI) + 
           (p[1] + 1) * 0.2 + t * 0.1) * palette.colors.length
        ) % palette.colors.length;
        
        const baseColor = hexToRgb(palette.colors[Math.abs(colorIndex)]);
        
        // Combine lighting
        const intensity = (diff * 0.6 + 0.3) * shadow * ao + spec * 0.3;
        
        r = Math.min(255, baseColor[0] * intensity);
        g = Math.min(255, baseColor[1] * intensity);
        b = Math.min(255, baseColor[2] * intensity);
        
        // Fog
        const fog = Math.exp(-dist * 0.15);
        const bgRgb = hexToRgb(palette.bg);
        r = r * fog + bgRgb[0] * (1 - fog);
        g = g * fog + bgRgb[1] * (1 - fog);
        b = b * fog + bgRgb[2] * (1 - fog);
      } else {
        // Background gradient
        const bgRgb = hexToRgb(palette.bg);
        const gradient = 1.0 - (y / height) * 0.3;
        r = bgRgb[0] * gradient;
        g = bgRgb[1] * gradient;
        b = bgRgb[2] * gradient;
      }
      
      // Set pixel
      const idx = (y * width + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  
  // Put image data
  ctx.putImageData(imageData, 0, 0);
}

// Parameter definitions
const params: Record<string, ParamConfig> = {
  density: {
    name: "Density",
    type: "range",
    min: 30,
    max: 100,
    step: 5,
    default: 60,
  },
  speed: {
    name: "Speed",
    type: "range",
    min: 0.1,
    max: 5,
    step: 0.1,
    default: 1,
  },
  colorScheme: {
    name: "Color Scheme",
    type: "select",
    options: ["neon", "gold", "cyber", "sunset", "matrix"],
    default: "neon",
  },
  shape: {
    name: "Shape",
    type: "select",
    options: ["sphere", "box", "torus", "mandelbulb"],
    default: "torus",
  },
  shadows: {
    name: "Shadows",
    type: "select",
    options: ["true", "false"],
    default: "true",
  },
  animated: {
    name: "Animated",
    type: "select",
    options: ["true", "false"],
    default: "true",
  },
};

// Export the generator
export const raymarcher: ArtGenerator = {
  name: "Raymarcher",
  description: "SDF-based raymarching with soft shadows - real-time 3D rendering using signed distance functions",
  params,
  generate,
  meta: {
    category: "3d",
    complexity: "expert",
    tags: ["animated", "futuristic", "detailed"],
    created: "2026-03-02",
  },
};

export default raymarcher;
