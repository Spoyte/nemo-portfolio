import { ArtGenerator, ArtParams } from "./core";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  hue: number;
  trail: Array<{ x: number; y: number }>;
}

function createParticle(width: number, height: number, centerX: number, centerY: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 120;
  const x = centerX + Math.cos(angle) * distance;
  const y = centerY + Math.sin(angle) * distance;
  
  const orbitalSpeed = Math.sqrt(2000 / distance);
  const vx = -Math.sin(angle) * orbitalSpeed * (0.8 + Math.random() * 0.4);
  const vy = Math.cos(angle) * orbitalSpeed * (0.8 + Math.random() * 0.4);
  
  return {
    x, y, vx, vy,
    mass: 0.5 + Math.random() * 1.5,
    hue: Math.random() * 360,
    trail: [],
  };
}

function getColor(scheme: string, hue: number, brightness: number): [number, number, number] {
  const palettes: Record<string, (h: number, b: number) => [number, number, number]> = {
    cosmic: (h, b) => {
      const r = Math.floor(20 + b * 60 * (0.5 + 0.5 * Math.sin(h * 0.017)));
      const g = Math.floor(10 + b * 40 * (0.3 + 0.7 * Math.cos(h * 0.013)));
      const bl = Math.floor(40 + b * 100);
      return [r, g, bl];
    },
    solar: (h, b) => {
      const r = Math.floor(200 + b * 55);
      const g = Math.floor(80 + b * 120 * (0.5 + 0.5 * Math.sin(h * 0.01)));
      const bl = Math.floor(b * 40);
      return [r, g, bl];
    },
    nebula: (h, b) => {
      const r = Math.floor(30 + b * 80 * (0.7 + 0.3 * Math.sin(h * 0.015)));
      const g = Math.floor(10 + b * 60 * (0.4 + 0.6 * Math.cos(h * 0.02)));
      const bl = Math.floor(50 + b * 100 * (0.6 + 0.4 * Math.sin(h * 0.01)));
      return [r, g, bl];
    },
    monochrome: (h, b) => {
      const v = Math.floor(20 + b * 200);
      return [v, v, v];
    },
  };
  
  return (palettes[scheme] || palettes.cosmic)(hue, brightness);
}

export const orbitalMechanics: ArtGenerator = {
  name: "Orbital Mechanics",
  description: "Gravitational particle simulation with decaying trails",
  params: {
    particleCount: {
      name: "Particles",
      type: "range",
      min: 100,
      max: 2000,
      step: 100,
      default: 800,
    },
    gravityStrength: {
      name: "Gravity",
      type: "range",
      min: 10,
      max: 150,
      step: 10,
      default: 50,
    },
    trailLength: {
      name: "Trail Length",
      type: "range",
      min: 10,
      max: 100,
      step: 5,
      default: 40,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["cosmic", "solar", "nebula", "monochrome"],
      default: "cosmic",
    },
  },
  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time?: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const t = time || 0;
    
    const particleCount = params.particleCount as number;
    const gravityStrength = params.gravityStrength as number;
    const trailLength = params.trailLength as number;
    const colorScheme = params.colorScheme as string;
    
    // Store particles in canvas data attribute for persistence
    let particles: Particle[] = (ctx.canvas as any).__orbitalParticles || [];
    
    // Initialize if needed
    if (particles.length !== particleCount) {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(width, height, centerX, centerY));
      }
      (ctx.canvas as any).__orbitalParticles = particles;
    }
    
    const G = gravityStrength * 0.5;
    const dt = 0.3;
    
    // Trail fade effect
    ctx.fillStyle = 'rgba(5, 5, 10, 0.15)';
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      const dx = centerX - p.x;
      const dy = centerY - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      const minDist = 15;
      const effectiveDist = Math.max(dist, minDist);
      const accel = G * 50 / (effectiveDist * effectiveDist);
      
      const ax = (dx / effectiveDist) * accel;
      const ay = (dy / effectiveDist) * accel;
      
      p.vx += ax * dt;
      p.vy += ay * dt;
      p.vx *= 0.9995;
      p.vy *= 0.9995;
      
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > trailLength) p.trail.shift();
      
      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        
        for (let j = 1; j < p.trail.length; j++) {
          const prev = p.trail[j - 1];
          const curr = p.trail[j];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        
        const last = p.trail[p.trail.length - 1];
        ctx.lineTo(last.x, last.y);
        
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const brightness = Math.min(1, speed / 8);
        const [r, g, b] = getColor(colorScheme, p.hue + t * 0.02, brightness);
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.lineWidth = p.mass * 0.8;
        ctx.stroke();
      }
      
      // Draw particle
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const brightness = Math.min(1, speed / 10);
      const [r, g, b] = getColor(colorScheme, p.hue + t * 0.02, brightness);
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.mass * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.mass * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
      ctx.fill();
      
      // Reset if particle goes too far or falls into center
      if (dist > Math.max(width, height) * 0.8 || dist < 8) {
        particles[i] = createParticle(width, height, centerX, centerY);
      }
    }
    
    // Draw sun
    const sunGlow = 20 + Math.sin(t * 0.002) * 5;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunGlow * 2);
    const [sr, sg, sb] = colorScheme === 'solar' ? [255, 200, 50] : 
                         colorScheme === 'nebula' ? [200, 100, 255] :
                         colorScheme === 'monochrome' ? [200, 200, 200] : [100, 150, 255];
    
    gradient.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, 1)`);
    gradient.addColorStop(0.3, `rgba(${sr}, ${sg}, ${sb}, 0.4)`);
    gradient.addColorStop(1, `rgba(${sr}, ${sg}, ${sb}, 0)`);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunGlow * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${sr}, ${sg}, ${sb})`;
    ctx.fill();
    
    (ctx.canvas as any).__orbitalParticles = particles;
  },
};
