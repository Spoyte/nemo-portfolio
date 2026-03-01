import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface VolumetricTextParams {
  text: string;
  fontSize: number;       // 20-100: Base font size
  depth: number;          // 10-100: 3D depth layers
  spread: number;         // 50-300: Particle spread
  turbulence: number;     // 0-100: Particle movement
  lightIntensity: number; // 0.1-2: Volumetric light strength
  fogDensity: number;     // 0-100: Fog thickness
  colorScheme: "neon" | "fire" | "ocean" | "cyber" | "gold";
  animated: boolean;
}

export const volumetricTextDefaultParams: VolumetricTextParams = {
  text: "LIGHT",
  fontSize: 60,
  depth: 40,
  spread: 150,
  turbulence: 30,
  lightIntensity: 1.2,
  fogDensity: 40,
  colorScheme: "neon",
  animated: true,
};

// Color palettes for volumetric effects
const palettes: Record<string, { primary: string; secondary: string; glow: string; fog: string }> = {
  neon: { primary: "#FF00FF", secondary: "#00FFFF", glow: "#FF00FF", fog: "rgba(255, 0, 255, 0.1)" },
  fire: { primary: "#FF4500", secondary: "#FFD700", glow: "#FF6B00", fog: "rgba(255, 69, 0, 0.1)" },
  ocean: { primary: "#00CED1", secondary: "#4169E1", glow: "#00BFFF", fog: "rgba(0, 206, 209, 0.1)" },
  cyber: { primary: "#39FF14", secondary: "#FF1493", glow: "#39FF14", fog: "rgba(57, 255, 20, 0.1)" },
  gold: { primary: "#FFD700", secondary: "#FFA500", glow: "#FFD700", fog: "rgba(255, 215, 0, 0.1)" },
};

// 3D point structure
interface Point3D {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  brightness: number;
}

// Project 3D point to 2D with perspective
function project3D(
  point: Point3D,
  centerX: number,
  centerY: number,
  rotationX: number,
  rotationY: number,
  focalLength: number
): { x: number; y: number; scale: number; z: number } {
  // Apply rotation around Y axis
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;

  // Apply rotation around X axis
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  // Perspective projection
  const scale = focalLength / (focalLength + z2);
  const x2d = centerX + x1 * scale;
  const y2d = centerY + y2 * scale;

  return { x: x2d, y: y2d, scale, z: z2 };
}

// Generate text particles from canvas
function generateTextParticles(
  text: string,
  fontSize: number,
  depth: number,
  spread: number
): Point3D[] {
  const offCanvas = document.createElement("canvas");
  const offCtx = offCanvas.getContext("2d")!;
  
  // Measure text
  offCtx.font = `bold ${fontSize}px sans-serif`;
  const metrics = offCtx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;
  
  offCanvas.width = Math.ceil(textWidth) + 20;
  offCanvas.height = Math.ceil(textHeight) + 20;
  
  // Draw text
  offCtx.font = `bold ${fontSize}px sans-serif`;
  offCtx.fillStyle = "white";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);
  
  // Extract pixel data
  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const data = imageData.data;
  const particles: Point3D[] = [];
  
  // Sample pixels and create 3D particles
  const sampleRate = Math.max(1, Math.floor(fontSize / 20));
  
  for (let y = 0; y < offCanvas.height; y += sampleRate) {
    for (let x = 0; x < offCanvas.width; x += sampleRate) {
      const idx = (y * offCanvas.width + x) * 4;
      const brightness = data[idx]; // Red channel (grayscale)
      
      if (brightness > 128) {
        // Create multiple depth layers for volumetric effect
        const numLayers = Math.max(3, Math.floor(depth / 10));
        
        for (let layer = 0; layer < numLayers; layer++) {
          const z = (layer / (numLayers - 1) - 0.5) * spread;
          const jitterX = (Math.random() - 0.5) * sampleRate * 0.5;
          const jitterY = (Math.random() - 0.5) * sampleRate * 0.5;
          
          const px = (x - offCanvas.width / 2) + jitterX;
          const py = (y - offCanvas.height / 2) + jitterY;
          
          particles.push({
            x: px,
            y: py,
            z: z,
            originalX: px,
            originalY: py,
            originalZ: z,
            brightness: brightness / 255,
          });
        }
      }
    }
  }
  
  return particles;
}

// Generate volumetric light rays
function generateLightRays(
  particles: Point3D[],
  numRays: number
): { start: Point3D; end: Point3D; intensity: number }[] {
  const rays: { start: Point3D; end: Point3D; intensity: number }[] = [];
  
  for (let i = 0; i < numRays; i++) {
    const startParticle = particles[Math.floor(Math.random() * particles.length)];
    if (!startParticle) continue;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    
    rays.push({
      start: startParticle,
      end: {
        x: startParticle.x + Math.cos(angle) * distance,
        y: startParticle.y + Math.sin(angle) * distance,
        z: startParticle.z + (Math.random() - 0.5) * 50,
        originalX: startParticle.originalX,
        originalY: startParticle.originalY,
        originalZ: startParticle.originalZ,
        brightness: 0.3,
      },
      intensity: 0.1 + Math.random() * 0.3,
    });
  }
  
  return rays;
}

export function renderVolumetricText(
  ctx: CanvasRenderingContext2D,
  params: Partial<VolumetricTextParams> = {},
  time: number = 0
): void {
  const config = { ...volumetricTextDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const palette = palettes[config.colorScheme] || palettes.neon;

  // Animation time
  const t = config.animated ? time * 0.001 : 0;

  // Clear with deep background
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, "#0a0a1a");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Camera parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const rotationX = Math.sin(t * 0.3) * 0.2;
  const rotationY = t * 0.2;
  const focalLength = 400;

  // Generate or retrieve particles
  // In a real implementation, we'd cache this
  const particles = generateTextParticles(
    config.text,
    config.fontSize,
    config.depth,
    config.spread
  );

  // Apply turbulence animation
  particles.forEach((p, i) => {
    const noiseX = Math.sin(t + i * 0.1) * config.turbulence * 0.5;
    const noiseY = Math.cos(t * 0.7 + i * 0.15) * config.turbulence * 0.5;
    const noiseZ = Math.sin(t * 0.5 + i * 0.2) * config.turbulence * 0.3;
    
    p.x = p.originalX + noiseX;
    p.y = p.originalY + noiseY;
    p.z = p.originalZ + noiseZ;
  });

  // Project all particles
  const projectedParticles = particles.map(p => ({
    ...project3D(p, centerX, centerY, rotationX, rotationY, focalLength),
    brightness: p.brightness,
    originalZ: p.z,
  }));

  // Sort by depth (back to front)
  projectedParticles.sort((a, b) => b.z - a.z);

  // Generate light rays
  const lightRays = config.lightIntensity > 0 
    ? generateLightRays(particles, Math.floor(particles.length * 0.1 * config.lightIntensity))
    : [];

  // Draw fog/volumetric background
  if (config.fogDensity > 0) {
    const fogGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(width, height) * 0.6
    );
    const fogAlpha = (config.fogDensity / 100) * 0.3;
    fogGradient.addColorStop(0, palette.fog.replace("0.1", String(fogAlpha)));
    fogGradient.addColorStop(1, "transparent");
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw light rays
  lightRays.forEach(ray => {
    const start = project3D(ray.start, centerX, centerY, rotationX, rotationY, focalLength);
    const end = project3D(ray.end, centerX, centerY, rotationX, rotationY, focalLength);
    
    const rayGradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    rayGradient.addColorStop(0, palette.glow + "40");
    rayGradient.addColorStop(0.5, palette.secondary + "20");
    rayGradient.addColorStop(1, "transparent");
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = rayGradient;
    ctx.lineWidth = 2 * start.scale;
    ctx.stroke();
  });

  // Draw particles with glow
  projectedParticles.forEach(p => {
    const size = (2 + p.brightness * 3) * p.scale;
    const alpha = Math.max(0.2, Math.min(1, (p.scale - 0.3) * 2));
    
    // Glow effect
    ctx.shadowBlur = 15 * config.lightIntensity * p.scale;
    ctx.shadowColor = palette.glow;
    
    // Particle color based on depth
    const depthColor = p.originalZ > 0 ? palette.primary : palette.secondary;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = depthColor + Math.floor(alpha * 255).toString(16).padStart(2, "0");
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  });

  // Draw connecting lines for depth perception
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = palette.secondary;
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i < projectedParticles.length; i += 5) {
    const p1 = projectedParticles[i];
    // Connect to nearby particles
    for (let j = i + 1; j < Math.min(i + 3, projectedParticles.length); j++) {
      const p2 = projectedParticles[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      
      if (dist < 30 * p1.scale) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  
  ctx.globalAlpha = 1;

  // Vignette effect
  const vignette = ctx.createRadialGradient(
    centerX, centerY, Math.min(width, height) * 0.3,
    centerX, centerY, Math.max(width, height) * 0.7
  );
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// Backward compatibility: ArtGenerator interface
export const volumetricText: ArtGenerator = {
  id: "volumetric-text",
  name: "Volumetric Text",
  category: "geometric",
  render: (ctx, params, time) => renderVolumetricText(ctx, params as VolumetricTextParams, time),
  defaultParams: volumetricTextDefaultParams,
};

export default volumetricText;
