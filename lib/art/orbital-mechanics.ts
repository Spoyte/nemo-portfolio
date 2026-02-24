export interface OrbitalMechanicsParams {
  particleCount: number;
  gravityStrength: number;
  trailLength: number;
  colorScheme: 'cosmic' | 'solar' | 'nebula' | 'monochrome';
}

export const orbitalMechanicsDefaultParams: OrbitalMechanicsParams = {
  particleCount: 800,
  gravityStrength: 50,
  trailLength: 40,
  colorScheme: 'cosmic',
};

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
  // Random position in a ring around the center
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 120;
  const x = centerX + Math.cos(angle) * distance;
  const y = centerY + Math.sin(angle) * distance;
  
  // Orbital velocity (perpendicular to radius)
  const orbitalSpeed = Math.sqrt(2000 / distance); // Approximate orbital velocity
  const vx = -Math.sin(angle) * orbitalSpeed * (0.8 + Math.random() * 0.4);
  const vy = Math.cos(angle) * orbitalSpeed * (0.8 + Math.random() * 0.4);
  
  return {
    x,
    y,
    vx,
    vy,
    mass: 0.5 + Math.random() * 1.5,
    hue: Math.random() * 360,
    trail: [],
  };
}

function getColorFromScheme(scheme: string, hue: number, brightness: number): [number, number, number] {
  const palettes: Record<string, (h: number, b: number) => [number, number, number]> = {
    cosmic: (h, b) => {
      // Deep space with purples, blues, and cyan
      const r = Math.floor(20 + b * 60 * (0.5 + 0.5 * Math.sin(h * 0.017)));
      const g = Math.floor(10 + b * 40 * (0.3 + 0.7 * Math.cos(h * 0.013)));
      const bl = Math.floor(40 + b * 100);
      return [r, g, bl];
    },
    solar: (h, b) => {
      // Warm oranges, yellows, reds
      const r = Math.floor(200 + b * 55);
      const g = Math.floor(80 + b * 120 * (0.5 + 0.5 * Math.sin(h * 0.01)));
      const bl = Math.floor(b * 40);
      return [r, g, bl];
    },
    nebula: (h, b) => {
      // Pink, purple, teal nebula colors
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

export function renderOrbitalMechanics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: OrbitalMechanicsParams,
  particles: Particle[] = [],
  initParticles: boolean = false
): Particle[] {
  const { particleCount, gravityStrength, trailLength, colorScheme } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Initialize particles on first run
  if (initParticles || particles.length === 0) {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(width, height, centerX, centerY));
    }
  }
  
  // Trail fade effect
  ctx.fillStyle = 'rgba(5, 5, 10, 0.15)';
  ctx.fillRect(0, 0, width, height);
  
  const G = gravityStrength * 0.5; // Gravitational constant
  const dt = 0.3; // Time step
  
  // Update and draw each particle
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Calculate distance to center (sun)
    const dx = centerX - p.x;
    const dy = centerY - p.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    
    // Gravitational acceleration: a = G * M / r^2
    // Direction is toward center
    const minDist = 15; // Prevent singularity
    const effectiveDist = Math.max(dist, minDist);
    const accel = G * 50 / (effectiveDist * effectiveDist);
    
    const ax = (dx / effectiveDist) * accel;
    const ay = (dy / effectiveDist) * accel;
    
    // Update velocity (Verlet integration approximation)
    p.vx += ax * dt;
    p.vy += ay * dt;
    
    // Damping to prevent energy explosion
    p.vx *= 0.9995;
    p.vy *= 0.9995;
    
    // Update position
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    
    // Add to trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }
    
    // Draw trail
    if (p.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      
      for (let j = 1; j < p.trail.length; j++) {
        // Quadratic bezier for smooth curves
        const prev = p.trail[j - 1];
        const curr = p.trail[j];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      
      const last = p.trail[p.trail.length - 1];
      ctx.lineTo(last.x, last.y);
      
      // Trail gradient based on velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const brightness = Math.min(1, speed / 8);
      const [r, g, b] = getColorFromScheme(colorScheme, p.hue + time * 0.02, brightness);
      
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
      ctx.lineWidth = p.mass * 0.8;
      ctx.stroke();
    }
    
    // Draw particle
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const brightness = Math.min(1, speed / 10);
    const [r, g, b] = getColorFromScheme(colorScheme, p.hue + time * 0.02, brightness);
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.mass * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fill();
    
    // Glow effect
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.mass * 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
    ctx.fill();
    
    // Reset if particle goes too far or falls into center
    if (dist > Math.max(width, height) * 0.8 || dist < 8) {
      const newP = createParticle(width, height, centerX, centerY);
      particles[i] = newP;
    }
  }
  
  // Draw central mass (sun)
  const sunGlow = 20 + Math.sin(time * 0.002) * 5;
  
  // Outer glow
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
  
  // Core
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${sr}, ${sg}, ${sb})`;
  ctx.fill();
  
  return particles;
}
