import { ArtGenerator, ArtParams, ParamConfig, renderPixels } from "./core";

// Diffusion Limited Aggregation - organic branching structures
// Particles random walk until they hit the cluster, creating fractal growth

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ClusterPoint {
  x: number;
  y: number;
  age: number;
  generation: number;
}

const COLOR_SCHEMES: Record<string, string[]> = {
  lightning: ["#ffffff", "#e0e0ff", "#c0c0ff", "#8080ff", "#4040ff", "#202080"],
  coral: ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#ff9999"],
  frost: ["#ffffff", "#e8f4f8", "#d0e8f0", "#b8dce8", "#a0d0e0", "#88c4d8"],
  copper: ["#b87333", "#cd853f", "#d4a574", "#e6c9a8", "#8b4513", "#654321"],
  ember: ["#ff4500", "#ff6347", "#ff7f50", "#ffa500", "#ffd700", "#8b0000"],
  midnight: ["#0a0a1a", "#1a1a3a", "#2a2a5a", "#3a3a7a", "#4a4a9a", "#5a5aba"],
};

export const dla: ArtGenerator = {
  name: "Diffusion Limited Aggregation",
  description: "Organic fractal growth through particle random walks",
  params: {
    particleCount: {
      name: "Particles",
      type: "range",
      min: 500,
      max: 5000,
      step: 500,
      default: 2000,
    },
    stickiness: {
      name: "Stickiness",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.1,
      default: 1.2,
    },
    branchFactor: {
      name: "Branching",
      type: "range",
      min: 0.3,
      max: 1.5,
      step: 0.1,
      default: 0.8,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: Object.keys(COLOR_SCHEMES),
      default: "lightning",
    },
    animationSpeed: {
      name: "Growth Speed",
      type: "range",
      min: 0,
      max: 5,
      step: 0.5,
      default: 2,
    },
  },

  generate: (ctx: CanvasRenderingContext2D, params: ArtParams, time: number = 0) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const particleCount = params.particleCount as number;
    const stickiness = params.stickiness as number;
    const branchFactor = params.branchFactor as number;
    const colorSchemeName = params.colorScheme as string;
    const animationSpeed = params.animationSpeed as number;

    const palette = COLOR_SCHEMES[colorSchemeName] || COLOR_SCHEMES.lightning;
    
    // Initialize cluster with seed at center
    const cluster: ClusterPoint[] = [{ x: centerX, y: centerY, age: 0, generation: 0 }];
    const clusterSet = new Set<string>([`${Math.floor(centerX)},${Math.floor(centerY)}`]);
    
    // Active particles doing random walks
    const particles: Particle[] = [];
    const stuckParticles: ClusterPoint[] = [];
    
    // Spawn particles from edges
    const spawnParticle = (): Particle => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const margin = 10;
      
      switch (side) {
        case 0: // top
          x = Math.random() * width;
          y = margin;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 2 + 0.5;
          break;
        case 1: // right
          x = width - margin;
          y = Math.random() * height;
          vx = -(Math.random() * 2 + 0.5);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // bottom
          x = Math.random() * width;
          y = height - margin;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 2 + 0.5);
          break;
        default: // left
          x = margin;
          y = Math.random() * height;
          vx = Math.random() * 2 + 0.5;
          vy = (Math.random() - 0.5) * 2;
      }
      
      return { x, y, vx, vy };
    };
    
    // Initialize particles
    for (let i = 0; i < Math.min(particleCount / 10, 50); i++) {
      particles.push(spawnParticle());
    }
    
    // Simulation steps based on animation speed
    const steps = animationSpeed > 0 ? Math.floor(animationSpeed * 10) : particleCount;
    
    for (let step = 0; step < steps && cluster.length < particleCount; step++) {
      // Update each particle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Random walk with momentum
        p.vx += (Math.random() - 0.5) * 0.5;
        p.vy += (Math.random() - 0.5) * 0.5;
        
        // Limit velocity
        const maxSpeed = 3;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x >= width) {
          p.vx *= -1;
          p.x = Math.max(0, Math.min(width - 1, p.x));
        }
        if (p.y < 0 || p.y >= height) {
          p.vy *= -1;
          p.y = Math.max(0, Math.min(height - 1, p.y));
        }
        
        // Check if particle sticks to cluster
        let stuck = false;
        const checkRadius = Math.ceil(stickiness * 3);
        
        for (const cp of cluster) {
          const dx = p.x - cp.x;
          const dy = p.y - cp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < stickiness * 2) {
            // Stick probability based on branch factor and distance from center
            const distFromCenter = Math.sqrt(
              (p.x - centerX) ** 2 + (p.y - centerY) ** 2
            );
            const maxDist = Math.min(width, height) / 2;
            const normalizedDist = distFromCenter / maxDist;
            
            // Higher chance to stick near tips (further from center)
            const stickProbability = 0.3 + branchFactor * normalizedDist * 0.7;
            
            if (Math.random() < stickProbability) {
              const generation = cp.generation + 1;
              const newPoint: ClusterPoint = {
                x: Math.floor(p.x),
                y: Math.floor(p.y),
                age: step,
                generation,
              };
              
              const key = `${newPoint.x},${newPoint.y}`;
              if (!clusterSet.has(key)) {
                cluster.push(newPoint);
                stuckParticles.push(newPoint);
                clusterSet.add(key);
                stuck = true;
              }
              break;
            }
          }
        }
        
        if (stuck) {
          particles.splice(i, 1);
        }
      }
      
      // Spawn new particles to maintain population
      while (particles.length < 30 && cluster.length + particles.length < particleCount) {
        particles.push(spawnParticle());
      }
    }
    
    // Render the cluster
    renderPixels(ctx, width, height, (x, y) => {
      const key = `${x},${y}`;
      
      if (clusterSet.has(key)) {
        // Find the cluster point to get generation
        const point = cluster.find(p => Math.floor(p.x) === x && Math.floor(p.y) === y);
        const generation = point?.generation || 0;
        const maxGen = Math.max(...cluster.map(p => p.generation), 1);
        
        // Color based on generation (distance from center)
        const colorIndex = Math.min(
          Math.floor((generation / maxGen) * palette.length),
          palette.length - 1
        );
        
        const hex = palette[colorIndex];
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // Add glow effect for newer particles
        const age = point?.age || 0;
        const glow = Math.max(0, 1 - (step - age) / 100);
        
        return {
          r: Math.min(255, r + glow * 50),
          g: Math.min(255, g + glow * 50),
          b: Math.min(255, b + glow * 50),
          a: 255,
        };
      }
      
      // Background gradient based on color scheme
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const maxDist = Math.min(width, height) / 2;
      const bgIntensity = Math.max(0, 1 - distFromCenter / maxDist) * 0.15;
      
      if (colorSchemeName === "lightning" || colorSchemeName === "frost") {
        const bg = Math.floor(bgIntensity * 40);
        return { r: bg, g: bg, b: Math.floor(bg * 1.5) + 10, a: 255 };
      } else if (colorSchemeName === "ember") {
        const bg = Math.floor(bgIntensity * 30);
        return { r: bg + 10, g: bg / 2, b: bg / 4, a: 255 };
      } else {
        const bg = Math.floor(bgIntensity * 30);
        return { r: bg, g: bg, b: bg, a: 255 };
      }
    }, 1);
    
    // Draw connecting lines for smoother branches
    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = 0.5;
    
    for (let i = 1; i < cluster.length; i++) {
      const p = cluster[i];
      // Find nearest cluster point with lower generation
      let nearest: ClusterPoint | null = null;
      let minDist = Infinity;
      
      for (const other of cluster) {
        if (other.generation < p.generation) {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist && dist < 15) {
            minDist = dist;
            nearest = other;
          }
        }
      }
      
      if (nearest) {
        const maxGen = Math.max(...cluster.map(cp => cp.generation), 1);
        const colorIndex = Math.min(
          Math.floor((p.generation / maxGen) * palette.length),
          palette.length - 1
        );
        ctx.strokeStyle = palette[colorIndex] + "40"; // 25% opacity
        ctx.beginPath();
        ctx.moveTo(nearest.x, nearest.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }
    
    ctx.globalCompositeOperation = "source-over";
  },
};
