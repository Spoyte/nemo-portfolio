import type { ArtGenerator, ParameterDefinition } from "./core";
import { seededRandom } from "./seeded-random";

// Volumetric Mist — Ray-marched atmospheric fog with dynamic lighting
// Creates immersive depth through participating media simulation

export interface VolumetricMistParams {
  seed: number;
  density: number;        // 0.1 - 2.0
  turbulence: number;     // 0.0 - 1.0
  lightCount: number;     // 1 - 5
  lightHue: number;       // 0 - 360
  fogHeight: number;      // 0.2 - 1.0
  windDirection: number;  // 0 - 360
  absorption: number;     // 0.1 - 1.0
  scattering: number;     // 0.1 - 1.0
}

export const volumetricMistDefaultParams: VolumetricMistParams = {
  seed: Math.floor(Math.random() * 10000),
  density: 0.8,
  turbulence: 0.5,
  lightCount: 3,
  lightHue: 220,
  fogHeight: 0.6,
  windDirection: 45,
  absorption: 0.5,
  scattering: 0.7,
};

export const volumetricMistParamDefinitions: Record<keyof VolumetricMistParams, ParameterDefinition> = {
  seed: { type: "number", min: 0, max: 99999, step: 1, default: volumetricMistDefaultParams.seed },
  density: { type: "number", min: 0.1, max: 2.0, step: 0.1, default: 0.8 },
  turbulence: { type: "number", min: 0.0, max: 1.0, step: 0.05, default: 0.5 },
  lightCount: { type: "number", min: 1, max: 5, step: 1, default: 3 },
  lightHue: { type: "number", min: 0, max: 360, step: 5, default: 220 },
  fogHeight: { type: "number", min: 0.2, max: 1.0, step: 0.05, default: 0.6 },
  windDirection: { type: "number", min: 0, max: 360, step: 5, default: 45 },
  absorption: { type: "number", min: 0.1, max: 1.0, step: 0.05, default: 0.5 },
  scattering: { type: "number", min: 0.1, max: 1.0, step: 0.05, default: 0.7 },
};

// 3D Noise function (simplex-like)
function noise3D(x: number, y: number, z: number, seed: number): number {
  const X = Math.floor(x);
  const Y = Math.floor(y);
  const Z = Math.floor(z);
  
  x -= X;
  y -= Y;
  z -= Z;
  
  const u = x * x * x * (x * (x * 6 - 15) + 10);
  const v = y * y * y * (y * (y * 6 - 15) + 10);
  const w = z * z * z * (z * (z * 6 - 15) + 10);
  
  const rng = seededRandom(seed + X * 374761 + Y * 668265 + Z * 727408);
  const n000 = rng() * 2 - 1;
  const n001 = seededRandom(seed + X * 374761 + Y * 668265 + (Z + 1) * 727408)() * 2 - 1;
  const n010 = seededRandom(seed + X * 374761 + (Y + 1) * 668265 + Z * 727408)() * 2 - 1;
  const n011 = seededRandom(seed + X * 374761 + (Y + 1) * 668265 + (Z + 1) * 727408)() * 2 - 1;
  const n100 = seededRandom(seed + (X + 1) * 374761 + Y * 668265 + Z * 727408)() * 2 - 1;
  const n101 = seededRandom(seed + (X + 1) * 374761 + Y * 668265 + (Z + 1) * 727408)() * 2 - 1;
  const n110 = seededRandom(seed + (X + 1) * 374761 + (Y + 1) * 668265 + Z * 727408)() * 2 - 1;
  const n111 = seededRandom(seed + (X + 1) * 374761 + (Y + 1) * 668265 + (Z + 1) * 727408)() * 2 - 1;
  
  const nx00 = n000 * (1 - u) + n100 * u;
  const nx01 = n001 * (1 - u) + n101 * u;
  const nx10 = n010 * (1 - u) + n110 * u;
  const nx11 = n011 * (1 - u) + n111 * u;
  
  const nxy0 = nx00 * (1 - v) + nx10 * v;
  const nxy1 = nx01 * (1 - v) + nx11 * v;
  
  return nxy0 * (1 - w) + nxy1 * w;
}

// Fractal Brownian Motion for turbulent fog
function fbm(x: number, y: number, z: number, seed: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency, seed + i * 12345);
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value;
}

// Density function for volumetric fog
function densityAtPoint(
  x: number, y: number, z: number,
  params: VolumetricMistParams,
  time: number
): number {
  const { seed, density, turbulence, fogHeight, windDirection } = params;
  
  // Wind offset
  const windRad = (windDirection * Math.PI) / 180;
  const windX = Math.cos(windRad) * time * 0.1;
  const windZ = Math.sin(windRad) * time * 0.1;
  
  // Base fog density (higher at bottom, fades with height)
  const heightFactor = Math.max(0, 1 - y / fogHeight);
  
  // Turbulent noise
  const noiseScale = 2 + turbulence * 3;
  const noise = fbm(
    (x + windX) * noiseScale,
    y * noiseScale * 0.5,
    (z + windZ) * noiseScale,
    seed
  );
  
  // Combine: base density modulated by noise and height
  const baseDensity = density * heightFactor * (0.5 + 0.5 * noise);
  
  return Math.max(0, baseDensity);
}

// Light source definition
interface Light {
  x: number;
  y: number;
  z: number;
  hue: number;
  intensity: number;
  radius: number;
}

// Generate light sources
function generateLights(params: VolumetricMistParams): Light[] {
  const lights: Light[] = [];
  const rng = seededRandom(params.seed + 999);
  
  for (let i = 0; i < params.lightCount; i++) {
    const angle = (i / params.lightCount) * Math.PI * 2 + rng() * 0.5;
    const radius = 0.3 + rng() * 0.4;
    
    lights.push({
      x: Math.cos(angle) * radius,
      y: 0.2 + rng() * 0.5,
      z: Math.sin(angle) * radius,
      hue: (params.lightHue + i * 30 + rng() * 20) % 360,
      intensity: 0.8 + rng() * 0.4,
      radius: 0.1 + rng() * 0.15,
    });
  }
  
  return lights;
}

// Ray marching through volume
function marchRay(
  origin: { x: number; y: number; z: number },
  direction: { x: number; y: number; z: number },
  params: VolumetricMistParams,
  lights: Light[],
  time: number
): { r: number; g: number; b: number; alpha: number } {
  const { absorption, scattering } = params;
  
  const stepSize = 0.02;
  const maxSteps = 100;
  
  let transmittance = 1;
  let accumulatedR = 0;
  let accumulatedG = 0;
  let accumulatedB = 0;
  
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  
  for (let step = 0; step < maxSteps; step++) {
    // Sample density at current position
    const density = densityAtPoint(x, y, z, params, time);
    
    if (density > 0.01) {
      // Calculate in-scattering from lights
      let inScatterR = 0;
      let inScatterG = 0;
      let inScatterB = 0;
      
      for (const light of lights) {
        const dx = light.x - x;
        const dy = light.y - y;
        const dz = light.z - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Light attenuation
        const attenuation = 1 / (1 + dist * dist * 2);
        
        // Check light visibility (simple shadow approximation)
        const lightDir = { x: dx / dist, y: dy / dist, z: dz / dist };
        let lightTransmittance = 1;
        
        // March towards light to check occlusion
        const lightStepSize = 0.05;
        const lightSteps = Math.min(20, Math.floor(dist / lightStepSize));
        let lx = x;
        let ly = y;
        let lz = z;
        
        for (let ls = 0; ls < lightSteps && lightTransmittance > 0.01; ls++) {
          lx += lightDir.x * lightStepSize;
          ly += lightDir.y * lightStepSize;
          lz += lightDir.z * lightStepSize;
          
          const ld = densityAtPoint(lx, ly, lz, params, time);
          lightTransmittance *= Math.exp(-ld * absorption * lightStepSize);
        }
        
        // Convert hue to RGB
        const h = light.hue / 60;
        const c = light.intensity * attenuation * lightTransmittance;
        const x_ = c * (1 - Math.abs((h % 2) - 1));
        
        let lr = 0, lg = 0, lb = 0;
        if (h < 1) { lr = c; lg = x_; }
        else if (h < 2) { lr = x_; lg = c; }
        else if (h < 3) { lg = c; lb = x_; }
        else if (h < 4) { lg = x_; lb = c; }
        else if (h < 5) { lr = x_; lb = c; }
        else { lr = c; lb = x_; }
        
        inScatterR += lr * scattering;
        inScatterG += lg * scattering;
        inScatterB += lb * scattering;
      }
      
      // Ambient scattering
      inScatterR += 0.02 * scattering;
      inScatterG += 0.03 * scattering;
      inScatterB += 0.05 * scattering;
      
      // Accumulate color
      const alpha = density * stepSize;
      const sampleTransmittance = Math.exp(-density * absorption * stepSize);
      
      accumulatedR += transmittance * inScatterR * alpha;
      accumulatedG += transmittance * inScatterG * alpha;
      accumulatedB += transmittance * inScatterB * alpha;
      
      transmittance *= sampleTransmittance;
      
      if (transmittance < 0.01) break;
    }
    
    // Step forward
    x += direction.x * stepSize;
    y += direction.y * stepSize;
    z += direction.z * stepSize;
    
    // Bounds check
    if (y > 1.5 || Math.abs(x) > 1.5 || Math.abs(z) > 1.5) break;
  }
  
  return {
    r: Math.min(1, accumulatedR),
    g: Math.min(1, accumulatedG),
    b: Math.min(1, accumulatedB),
    alpha: 1 - transmittance,
  };
}

// Generate volumetric mist
export function generateVolumetricMist(
  canvas: HTMLCanvasElement,
  params: VolumetricMistParams = volumetricMistDefaultParams
): void {
  const ctx = canvas.getContext("2d")!;
  const width = canvas.width;
  const height = canvas.height;
  
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const lights = generateLights(params);
  const time = Date.now() / 1000;
  
  // Camera setup
  const cameraZ = 1.5;
  const fov = 60 * (Math.PI / 180);
  const aspectRatio = width / height;
  
  // Render
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Normalized device coordinates
      const ndcX = ((px + 0.5) / width) * 2 - 1;
      const ndcY = -(((py + 0.5) / height) * 2 - 1);
      
      // Ray direction
      const dirX = ndcX * Math.tan(fov / 2) * aspectRatio;
      const dirY = ndcY * Math.tan(fov / 2);
      const dirZ = -1;
      
      // Normalize
      const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
      const direction = {
        x: dirX / len,
        y: dirY / len,
        z: dirZ / len,
      };
      
      // Ray origin
      const origin = { x: 0, y: 0.3, z: cameraZ };
      
      // March ray
      const result = marchRay(origin, direction, params, lights, time);
      
      // Tone mapping (simple Reinhard)
      const mappedR = result.r / (1 + result.r);
      const mappedG = result.g / (1 + result.g);
      const mappedB = result.b / (1 + result.b);
      
      // Gamma correction
      const gamma = 2.2;
      const finalR = Math.pow(mappedR, 1 / gamma);
      const finalG = Math.pow(mappedG, 1 / gamma);
      const finalB = Math.pow(mappedB, 1 / gamma);
      
      const idx = (py * width + px) * 4;
      data[idx] = Math.floor(finalR * 255);
      data[idx + 1] = Math.floor(finalG * 255);
      data[idx + 2] = Math.floor(finalB * 255);
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// Animation loop
export function animateVolumetricMist(
  canvas: HTMLCanvasElement,
  params: VolumetricMistParams = volumetricMistDefaultParams
): () => void {
  let running = true;
  let frameId: number;
  
  const render = () => {
    if (!running) return;
    generateVolumetricMist(canvas, params);
    frameId = requestAnimationFrame(render);
  };
  
  render();
  
  return () => {
    running = false;
    cancelAnimationFrame(frameId);
  };
}

// Export generator
export const volumetricMist: ArtGenerator = {
  id: "volumetric-mist",
  name: "Volumetric Mist",
  description: "Ray-marched atmospheric fog with dynamic volumetric lighting. Creates immersive depth through participating media simulation with turbulent noise patterns.",
  category: "3d",
  complexity: "complex",
  tags: ["volumetric", "raymarching", "atmospheric", "lighting", "fog", "3d"],
  parameters: volumetricMistParamDefinitions,
  defaultParams: volumetricMistDefaultParams,
  render: generateVolumetricMist,
  animate: animateVolumetricMist,
};
