// Raymarched SDF Sculptor - Infinite mathematical forms through raymarching
// Renders 3D scenes using sphere tracing through signed distance fields

import { ArtGenerator, ArtParams, hslToRgb } from "./core";

// ============================================================================
// SDF PRIMITIVES - Signed Distance Functions define 3D shapes mathematically
// ============================================================================

interface Vec3 { x: number; y: number; z: number }

const vec3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const mul = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
const div = (a: Vec3, s: number): Vec3 => ({ x: a.x / s, y: a.y / s, z: a.z / s });
const length = (a: Vec3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
const normalize = (a: Vec3): Vec3 => {
  const len = length(a);
  return len > 0.0001 ? div(a, len) : { x: 0, y: 0, z: 0 };
};
const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const abs = (a: Vec3): Vec3 => ({ x: Math.abs(a.x), y: Math.abs(a.y), z: Math.abs(a.z) });
const max = (a: Vec3, s: number): Vec3 => ({ x: Math.max(a.x, s), y: Math.max(a.y, s), z: Math.max(a.z, s) });
const min = (a: number, b: number): number => Math.min(a, b);
const maxScalar = (a: number, b: number): number => Math.max(a, b);

// Rotation matrices
const rotateX = (p: Vec3, angle: number): Vec3 => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
};

const rotateY = (p: Vec3, angle: number): Vec3 => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
};

const rotateZ = (p: Vec3, angle: number): Vec3 => {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
};

// ============================================================================
// SDF PRIMITIVES
// ============================================================================

const sdSphere = (p: Vec3, r: number): number => length(p) - r;

const sdBox = (p: Vec3, b: Vec3): number => {
  const q = sub(abs(p), b);
  return length(max(q, 0)) + min(maxScalar(maxScalar(q.x, q.y), q.z), 0);
};

const sdTorus = (p: Vec3, t: Vec3): number => {
  const q = vec3(length(vec3(p.x, p.z, 0)) - t.x, p.y, 0);
  return length(q) - t.y;
};

const sdCylinder = (p: Vec3, h: number, r: number): number => {
  const d = vec3(length(vec3(p.x, p.z, 0)) - r, Math.abs(p.y) - h, 0);
  return min(maxScalar(d.x, d.y), 0) + length(max(d, 0));
};

const sdOctahedron = (p: Vec3, s: number): number => {
  const a = abs(p);
  return (a.x + a.y + a.z - s) * 0.57735027;
};

const sdMandelbulb = (p: Vec3, power: number, iterations: number): number => {
  let z = { ...p };
  let dr = 1;
  let r = 0;
  
  for (let i = 0; i < iterations; i++) {
    r = length(z);
    if (r > 2) break;
    
    const theta = Math.acos(z.z / r) * power;
    const phi = Math.atan2(z.y, z.x) * power;
    const zr = Math.pow(r, power);
    
    dr = Math.pow(r, power - 1) * power * dr + 1;
    
    z = vec3(
      zr * Math.sin(theta) * Math.cos(phi),
      zr * Math.sin(theta) * Math.sin(phi),
      zr * Math.cos(theta)
    );
    z = add(z, p);
  }
  
  return 0.5 * Math.log(r) * r / dr;
};

// Smooth minimum for blending shapes
const smin = (a: number, b: number, k: number): number => {
  const h = maxScalar(k - Math.abs(a - b), 0) / k;
  return min(a, b) - h * h * k * 0.25;
};

// ============================================================================
// SCENE DEFINITIONS - Different sculpture types
// ============================================================================

interface SceneResult {
  distance: number;
  material: number; // 0-3 for different materials
}

const getSceneDistance = (p: Vec3, sceneType: string, time: number): SceneResult => {
  const rotatedP = rotateY(p, time * 0.3);
  
  switch (sceneType) {
    case "infinite-torus": {
      // Infinite recursive torus knot
      const t = rotateZ(rotateX(rotatedP, time * 0.2), time * 0.15);
      let d = sdTorus(t, vec3(1.2, 0.4, 0));
      
      // Add smaller tori at cardinal points
      const s = 0.5;
      const t1 = sub(t, vec3(1.5, 0, 0));
      const t2 = sub(t, vec3(-1.5, 0, 0));
      const t3 = sub(t, vec3(0, 1.5, 0));
      const t4 = sub(t, vec3(0, -1.5, 0));
      
      d = smin(d, sdTorus(t1, vec3(0.6, 0.2, 0)), 0.3);
      d = smin(d, sdTorus(t2, vec3(0.6, 0.2, 0)), 0.3);
      d = smin(d, sdTorus(t3, vec3(0.6, 0.2, 0)), 0.3);
      d = smin(d, sdTorus(t4, vec3(0.6, 0.2, 0)), 0.3);
      
      return { distance: d, material: 0 };
    }
    
    case "mandelbulb": {
      const mb = rotateZ(rotateX(rotatedP, time * 0.1), time * 0.05);
      const d = sdMandelbulb(mb, 8, 8);
      return { distance: d, material: 1 };
    }
    
    case "geometric-garden": {
      const t = rotateY(rotatedP, time * 0.25);
      
      // Central octahedron
      let d = sdOctahedron(t, 0.8);
      
      // Orbiting spheres
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.5;
        const radius = 1.8;
        const spherePos = vec3(
          Math.cos(angle) * radius,
          Math.sin(time * 0.3 + i) * 0.5,
          Math.sin(angle) * radius
        );
        const sphere = sub(t, spherePos);
        d = smin(d, sdSphere(sphere, 0.25), 0.4);
      }
      
      // Corner boxes
      const corner = 1.4;
      const box1 = sub(abs(t), vec3(corner, corner, corner));
      d = smin(d, sdBox(box1, vec3(0.3, 0.3, 0.3)), 0.2);
      
      return { distance: d, material: 2 };
    }
    
    case "crystal-cave": {
      const t = rotateX(rotateZ(rotatedP, time * 0.15), time * 0.1);
      
      // Main crystal structure
      let d = sdBox(t, vec3(1, 1.5, 0.8));
      
      // Internal void
      const inner = mul(t, 1.2);
      d = maxScalar(d, -sdBox(inner, vec3(0.7, 1.1, 0.5)));
      
      // Crystal shards
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const shardPos = vec3(
          Math.cos(angle) * 1.2,
          Math.sin(angle * 2 + time * 0.2) * 0.3,
          Math.sin(angle) * 1.2
        );
        const shard = sub(t, shardPos);
        const rotatedShard = rotateY(shard, angle + time * 0.3);
        d = smin(d, sdBox(rotatedShard, vec3(0.1, 0.8, 0.1)), 0.15);
      }
      
      return { distance: d, material: 3 };
    }
    
    case "alien-egg": {
      const t = rotateZ(rotateY(rotatedP, time * 0.2), time * 0.1);
      
      // Egg shape - blend sphere and box
      const sphere = sdSphere(t, 1.2);
      const box = sdBox(t, vec3(0.8, 1.4, 0.8));
      let d = smin(sphere, box, 0.5);
      
      // Surface details - veins
      const veinP = mul(t, 3);
      const veinNoise = Math.sin(veinP.x + Math.sin(veinP.y * 2) * 0.5) * 
                        Math.cos(veinP.z + Math.sin(veinP.x * 1.5) * 0.5);
      d += veinNoise * 0.05;
      
      // Pores
      const poreP = mul(t, 8);
      const pores = Math.sin(poreP.x) * Math.sin(poreP.y) * Math.sin(poreP.z);
      d += pores * 0.02;
      
      return { distance: d, material: 0 };
    }
    
    default:
      return { distance: sdSphere(rotatedP, 1), material: 0 };
  }
};

// ============================================================================
// RAYMARCHING - Sphere tracing through the SDF
// ============================================================================

const MAX_STEPS = 80;
const MAX_DISTANCE = 20;
const SURFACE_THRESHOLD = 0.001;

const raymarch = (
  ro: Vec3, // ray origin
  rd: Vec3, // ray direction
  sceneType: string,
  time: number
): { distance: number; steps: number; material: number } => {
  let t = 0;
  let material = 0;
  
  for (let i = 0; i < MAX_STEPS; i++) {
    const p = add(ro, mul(rd, t));
    const scene = getSceneDistance(p, sceneType, time);
    const d = scene.distance;
    material = scene.material;
    
    if (d < SURFACE_THRESHOLD) {
      return { distance: t, steps: i, material };
    }
    
    t += d;
    
    if (t > MAX_DISTANCE) {
      return { distance: -1, steps: i, material: 0 };
    }
  }
  
  return { distance: -1, steps: MAX_STEPS, material: 0 };
};

// Calculate normal using gradient
const getNormal = (p: Vec3, sceneType: string, time: number): Vec3 => {
  const eps = 0.001;
  const dx = getSceneDistance(add(p, vec3(eps, 0, 0)), sceneType, time).distance -
             getSceneDistance(sub(p, vec3(eps, 0, 0)), sceneType, time).distance;
  const dy = getSceneDistance(add(p, vec3(0, eps, 0)), sceneType, time).distance -
             getSceneDistance(sub(p, vec3(0, eps, 0)), sceneType, time).distance;
  const dz = getSceneDistance(add(p, vec3(0, 0, eps)), sceneType, time).distance -
             getSceneDistance(sub(p, vec3(0, 0, eps)), sceneType, time).distance;
  return normalize(vec3(dx, dy, dz));
};

// ============================================================================
// LIGHTING & MATERIALS
// ============================================================================

const getMaterialColor = (material: number, p: Vec3, colorScheme: string): Vec3 => {
  const t = Math.atan2(p.z, p.x);
  const h = (t / (Math.PI * 2) + 0.5 + p.y * 0.2) % 1;
  
  switch (colorScheme) {
    case "neon": {
      const hue = (h * 360 + material * 90) % 360;
      const rgb = hslToRgb(hue, 90, 50);
      return vec3(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    }
    case "gold": {
      const gold = hslToRgb(45 + h * 20, 80, 50 + material * 10);
      return vec3(gold.r / 255, gold.g / 255, gold.b / 255);
    }
    case "ice": {
      const ice = hslToRgb(190 + h * 40, 60, 60 + material * 5);
      return vec3(ice.r / 255, ice.g / 255, ice.b / 255);
    }
    case "magma": {
      const magma = hslToRgb(10 + h * 30 + material * 20, 90, 40 + Math.max(0, p.y) * 20);
      return vec3(magma.r / 255, magma.g / 255, magma.b / 255);
    }
    case "cyber": {
      const cyber = hslToRgb(280 + h * 80, 85, 45 + material * 15);
      return vec3(cyber.r / 255, cyber.g / 255, cyber.b / 255);
    }
    default: {
      const def = hslToRgb(h * 360, 70, 50);
      return vec3(def.r / 255, def.g / 255, def.b / 255);
    }
  }
};

const calculateLighting = (
  p: Vec3,
  n: Vec3,
  rd: Vec3,
  material: number,
  colorScheme: string,
  time: number
): Vec3 => {
  // Light positions
  const light1 = vec3(
    Math.cos(time * 0.5) * 3,
    2,
    Math.sin(time * 0.5) * 3
  );
  const light2 = vec3(
    Math.cos(time * 0.3 + Math.PI) * 2,
    -1,
    Math.sin(time * 0.3 + Math.PI) * 2
  );
  
  // Diffuse lighting
  const l1 = normalize(sub(light1, p));
  const l2 = normalize(sub(light2, p));
  
  const diff1 = maxScalar(dot(n, l1), 0);
  const diff2 = maxScalar(dot(n, l2), 0) * 0.5;
  
  // Specular (Blinn-Phong)
  const h1 = normalize(sub(l1, rd));
  const h2 = normalize(sub(l2, rd));
  const spec1 = Math.pow(maxScalar(dot(n, h1), 0), 32);
  const spec2 = Math.pow(maxScalar(dot(n, h2), 0), 16) * 0.5;
  
  // Ambient occlusion approximation based on position
  const ao = 0.5 + 0.5 * Math.cos(p.y * 2) * Math.cos(p.x * 2);
  
  // Base color
  const baseColor = getMaterialColor(material, p, colorScheme);
  
  // Combine lighting
  let r = baseColor.x * (0.2 + diff1 * 0.6 + diff2 * 0.3) * ao + spec1 * 0.5 + spec2 * 0.2;
  let g = baseColor.y * (0.2 + diff1 * 0.6 + diff2 * 0.3) * ao + spec1 * 0.5 + spec2 * 0.2;
  let b = baseColor.z * (0.2 + diff1 * 0.6 + diff2 * 0.3) * ao + spec1 * 0.5 + spec2 * 0.2;
  
  // Rim lighting
  const rim = 1 - maxScalar(dot(n, mul(rd, -1)), 0);
  const rimPower = Math.pow(rim, 3) * 0.3;
  r += rimPower;
  g += rimPower;
  b += rimPower;
  
  return vec3(r, g, b);
};

// Background gradient
const getBackground = (rd: Vec3, colorScheme: string): Vec3 => {
  const t = (rd.y + 1) * 0.5;
  
  switch (colorScheme) {
    case "neon":
      return vec3(t * 0.1, t * 0.05, t * 0.15);
    case "gold":
      return vec3(t * 0.15, t * 0.1, t * 0.05);
    case "ice":
      return vec3(t * 0.1, t * 0.15, t * 0.2);
    case "magma":
      return vec3(t * 0.2, t * 0.05, t * 0.02);
    case "cyber":
      return vec3(t * 0.08, t * 0.05, t * 0.12);
    default:
      return vec3(t * 0.1, t * 0.1, t * 0.12);
  }
};

// ============================================================================
// MAIN RENDER
// ============================================================================

export interface SDFSculptorParams {
  sculptureType: "infinite-torus" | "mandelbulb" | "geometric-garden" | "crystal-cave" | "alien-egg";
  colorScheme: "neon" | "gold" | "ice" | "magma" | "cyber";
  cameraDistance: number;
  complexity: number;
  glow: number;
}

export const sdfSculptorDefaultParams: SDFSculptorParams = {
  sculptureType: "infinite-torus",
  colorScheme: "neon",
  cameraDistance: 4,
  complexity: 50,
  glow: 30,
};

export const renderSDFSculptor = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: Partial<SDFSculptorParams> = {}
): void => {
  const p = { ...sdfSculptorDefaultParams, ...params };
  
  // Adaptive sampling based on complexity
  const sampleSize = p.complexity > 70 ? 1 : p.complexity > 40 ? 2 : 3;
  
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  // Camera setup
  const camDist = p.cameraDistance;
  const camPos = vec3(
    Math.cos(time * 0.2) * camDist,
    Math.sin(time * 0.15) * camDist * 0.5,
    Math.sin(time * 0.2) * camDist
  );
  const camTarget = vec3(0, 0, 0);
  const camForward = normalize(sub(camTarget, camPos));
  const camRight = normalize(vec3(camForward.z, 0, -camForward.x));
  const camUp = vec3(
    camForward.y * camRight.z - camForward.z * camRight.y,
    camForward.z * camRight.x - camForward.x * camRight.z,
    camForward.x * camRight.y - camForward.y * camRight.x
  );
  
  const aspect = width / height;
  const fov = 1.2;
  
  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      // Normalized device coordinates
      const ndcX = ((x + sampleSize * 0.5) / width * 2 - 1) * aspect * fov;
      const ndcY = -((y + sampleSize * 0.5) / height * 2 - 1) * fov;
      
      // Ray direction
      const rd = normalize(add(
        add(mul(camForward, 1), mul(camRight, ndcX)),
        mul(camUp, ndcY)
      ));
      
      // Raymarch
      const result = raymarch(camPos, rd, p.sculptureType, time);
      
      let color: Vec3;
      
      if (result.distance > 0) {
        // Hit surface
        const hitPoint = add(camPos, mul(rd, result.distance));
        const normal = getNormal(hitPoint, p.sculptureType, time);
        color = calculateLighting(hitPoint, normal, rd, result.material, p.colorScheme, time);
        
        // Glow effect based on steps (shows the raymarching process artistically)
        const glowIntensity = (result.steps / MAX_STEPS) * (p.glow / 100);
        color = add(color, vec3(glowIntensity * 0.3, glowIntensity * 0.2, glowIntensity * 0.4));
      } else {
        // Missed - background
        color = getBackground(rd, p.colorScheme);
      }
      
      // Tone mapping and gamma correction
      color = vec3(
        Math.pow(min(color.x, 1), 0.4545),
        Math.pow(min(color.y, 1), 0.4545),
        Math.pow(min(color.z, 1), 0.4545)
      );
      
      // Convert to 0-255
      const r = Math.floor(color.x * 255);
      const g = Math.floor(color.y * 255);
      const b = Math.floor(color.z * 255);
      
      // Fill sample block
      for (let dy = 0; dy < sampleSize && y + dy < height; dy++) {
        for (let dx = 0; dx < sampleSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// ============================================================================
// ART GENERATOR EXPORT
// ============================================================================

export const sdfSculptor: ArtGenerator = {
  name: "SDF Sculptor",
  description: "Raymarched 3D sculptures using signed distance fields — infinite mathematical forms rendered through sphere tracing",
  params: {
    sculptureType: {
      name: "Sculpture Type",
      type: "select",
      options: ["infinite-torus", "mandelbulb", "geometric-garden", "crystal-cave", "alien-egg"],
      default: "infinite-torus",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["neon", "gold", "ice", "magma", "cyber"],
      default: "neon",
    },
    cameraDistance: {
      name: "Camera Distance",
      type: "range",
      min: 2,
      max: 8,
      step: 0.5,
      default: 4,
    },
    complexity: {
      name: "Render Quality",
      type: "range",
      min: 20,
      max: 90,
      step: 5,
      default: 50,
    },
    glow: {
      name: "Step Glow",
      type: "range",
      min: 0,
      max: 100,
      step: 10,
      default: 30,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    renderSDFSculptor(ctx, canvas.width, canvas.height, time * 0.001, {
      sculptureType: params.sculptureType as SDFSculptorParams["sculptureType"],
      colorScheme: params.colorScheme as SDFSculptorParams["colorScheme"],
      cameraDistance: params.cameraDistance as number,
      complexity: params.complexity as number,
      glow: params.glow as number,
    });
  },
  meta: {
    category: "3d",
    complexity: "expert",
    tags: ["animated", "futuristic", "geometric", "detailed"],
    created: "2026-03-01",
  },
};
