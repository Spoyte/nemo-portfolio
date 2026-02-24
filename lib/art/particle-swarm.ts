export interface ParticleSwarmParams {
  particleCount: number;
  speed: number;
  attraction: number; // Negative = flee, Positive = follow
  cohesion: number;
  trail: number;
  colorScheme: 'fire' | 'ocean' | 'neon' | 'monochrome';
}

export const particleSwarmDefaultParams: ParticleSwarmParams = {
  particleCount: 200,
  speed: 50,
  attraction: 50, // 0-100, 50 = neutral
  cohesion: 30,
  trail: 70,
  colorScheme: 'ocean',
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

const colorSchemes: Record<string, number[]> = {
  fire: [0, 20, 40, 60], // Red to yellow
  ocean: [180, 200, 220, 240], // Cyan to blue
  neon: [280, 320, 160, 40], // Purple, pink, green, orange
  monochrome: [0], // White/gray only
};

export function renderParticleSwarm(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: ParticleSwarmParams,
  mouseX: number | null,
  mouseY: number | null
): void {
  // Trail effect - fade existing pixels
  const trailAlpha = Math.floor((1 - params.trail / 100) * 50);
  ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha / 255})`;
  ctx.fillRect(0, 0, width, height);

  // Initialize or update particles
  const particles: Particle[] = (ctx as any).__particles || [];
  const targetCount = params.particleCount;
  
  // Add particles up to target
  while (particles.length < targetCount) {
    const scheme = colorSchemes[params.colorScheme];
    const hue = scheme[Math.floor(Math.random() * scheme.length)];
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random() * 100 + 50,
      maxLife: 150,
      hue: hue + (Math.random() - 0.5) * 20,
    });
  }
  
  // Remove excess particles
  if (particles.length > targetCount) {
    particles.splice(targetCount);
  }

  const speedFactor = params.speed / 50;
  const attractionStrength = (params.attraction - 50) / 500; // -0.1 to 0.1
  const cohesionStrength = params.cohesion / 1000; // 0 to 0.1

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Mouse interaction
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0 && dist < 200) {
        const force = (1 - dist / 200) * attractionStrength * 5;
        p.vx += (dx / dist) * force * speedFactor;
        p.vy += (dy / dist) * force * speedFactor;
      }
    }
    
    // Cohesion - particles attract to center of mass of neighbors
    if (cohesionStrength > 0) {
      let avgX = 0, avgY = 0, count = 0;
      const neighborDist = 60;
      
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const other = particles[j];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < neighborDist) {
          avgX += other.x;
          avgY += other.y;
          count++;
        }
      }
      
      if (count > 0) {
        avgX /= count;
        avgY /= count;
        p.vx += (avgX - p.x) * cohesionStrength * speedFactor;
        p.vy += (avgY - p.y) * cohesionStrength * speedFactor;
      }
    }
    
    // Add some randomness/wander
    p.vx += (Math.random() - 0.5) * 0.1 * speedFactor;
    p.vy += (Math.random() - 0.5) * 0.1 * speedFactor;
    
    // Speed limit
    const maxSpeed = 3 * speedFactor;
    const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (currentSpeed > maxSpeed) {
      p.vx = (p.vx / currentSpeed) * maxSpeed;
      p.vy = (p.vy / currentSpeed) * maxSpeed;
    }
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Age particle
    p.life--;
    if (p.life <= 0) {
      // Respawn
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = (Math.random() - 0.5) * 2;
      p.life = p.maxLife;
      const scheme = colorSchemes[params.colorScheme];
      p.hue = scheme[Math.floor(Math.random() * scheme.length)] + (Math.random() - 0.5) * 20;
    }
    
    // Draw particle
    const lifeRatio = p.life / p.maxLife;
    const alpha = lifeRatio * 0.8 + 0.2;
    const size = (1 + lifeRatio) * 1.5;
    
    if (params.colorScheme === 'monochrome') {
      const brightness = Math.floor(lifeRatio * 200 + 55);
      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
    } else {
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw connections to nearby particles
    if (cohesionStrength > 0) {
      const connectionDist = 50;
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDist) {
          const connectionAlpha = (1 - dist / connectionDist) * 0.3 * alpha;
          if (params.colorScheme === 'monochrome') {
            ctx.strokeStyle = `rgba(255, 255, 255, ${connectionAlpha})`;
          } else {
            ctx.strokeStyle = `hsla(${p.hue}, 60%, 50%, ${connectionAlpha})`;
          }
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Store particles for next frame
  (ctx as any).__particles = particles;
}
