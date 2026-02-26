import { ArtGenerator, ArtParams } from "./core";

export interface SlimeMoldParams extends ArtParams {
  particleCount: number;
  sensorAngle: number;
  sensorDist: number;
  turnAngle: number;
  decayRate: number;
  depositAmount: number;
  colorScheme: "slime-green" | "electric-blue" | "magma" | "rainbow" | "monochrome";
  foodSourceCount: number;
  obstacleCount: number;
  showParticles: boolean;
  trailPersistence: number;
}

export const slimeMoldDefaultParams: SlimeMoldParams = {
  particleCount: 4000,
  sensorAngle: 45,
  sensorDist: 20,
  turnAngle: 20,
  decayRate: 2,
  depositAmount: 15,
  colorScheme: "slime-green",
  foodSourceCount: 3,
  obstacleCount: 0,
  showParticles: true,
  trailPersistence: 95,
};

interface Particle {
  x: number;
  y: number;
  angle: number;
}

interface FoodSource {
  x: number;
  y: number;
  radius: number;
}

interface Obstacle {
  x: number;
  y: number;
  radius: number;
}

// Color schemes
const colorSchemes: Record<string, { r: number; g: number; b: number }[]> = {
  "slime-green": [
    { r: 10, g: 30, b: 10 },
    { r: 30, g: 80, b: 20 },
    { r: 60, g: 140, b: 30 },
    { r: 100, g: 200, b: 50 },
    { r: 150, g: 255, b: 80 },
  ],
  "electric-blue": [
    { r: 5, g: 10, b: 30 },
    { r: 15, g: 40, b: 80 },
    { r: 30, g: 80, b: 150 },
    { r: 60, g: 140, b: 255 },
    { r: 120, g: 200, b: 255 },
  ],
  "magma": [
    { r: 20, g: 5, b: 5 },
    { r: 60, g: 15, b: 10 },
    { r: 120, g: 30, b: 10 },
    { r: 200, g: 80, b: 20 },
    { r: 255, g: 150, b: 50 },
  ],
  "rainbow": [
    { r: 50, g: 0, b: 50 },
    { r: 100, g: 0, b: 100 },
    { r: 0, g: 100, b: 200 },
    { r: 0, g: 200, b: 100 },
    { r: 200, g: 200, b: 0 },
    { r: 255, g: 100, b: 0 },
  ],
  "monochrome": [
    { r: 10, g: 10, b: 10 },
    { r: 40, g: 40, b: 40 },
    { r: 80, g: 80, b: 80 },
    { r: 140, g: 140, b: 140 },
    { r: 220, g: 220, b: 220 },
  ],
};

export function renderSlimeMold(
  ctx: CanvasRenderingContext2D,
  params: SlimeMoldParams,
  timestamp?: number
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Initialize trail map on first render (stored in canvas data attribute)
  let trailMap: Uint8Array;
  let particles: Particle[];
  let foodSources: FoodSource[];
  let obstacles: Obstacle[];
  
  const seed = timestamp || 0;
  
  if (!(ctx.canvas as any)._slimeMoldState) {
    // Initialize trail map (grayscale, 0-255)
    trailMap = new Uint8Array(width * height);
    
    // Initialize particles at random positions
    particles = [];
    for (let i = 0; i < params.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
      });
    }
    
    // Initialize food sources
    foodSources = [];
    for (let i = 0; i < params.foodSourceCount; i++) {
      // Place food sources in a circle around center
      const angle = (i / params.foodSourceCount) * Math.PI * 2 + seed * 0.0001;
      const dist = Math.min(width, height) * 0.35;
      foodSources.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        radius: 25 + Math.random() * 15,
      });
    }
    
    // Initialize obstacles
    obstacles = [];
    for (let i = 0; i < params.obstacleCount; i++) {
      obstacles.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.8 + height * 0.1,
        radius: 30 + Math.random() * 40,
      });
    }
    
    (ctx.canvas as any)._slimeMoldState = {
      trailMap,
      particles,
      foodSources,
      obstacles,
      width,
      height,
    };
  } else {
    const state = (ctx.canvas as any)._slimeMoldState;
    trailMap = state.trailMap;
    particles = state.particles;
    foodSources = state.foodSources;
    obstacles = state.obstacles;
    
    // Check if canvas size changed
    if (state.width !== width || state.height !== height) {
      // Reinitialize
      trailMap = new Uint8Array(width * height);
      particles = [];
      for (let i = 0; i < params.particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          angle: Math.random() * Math.PI * 2,
        });
      }
      foodSources = [];
      for (let i = 0; i < params.foodSourceCount; i++) {
        const angle = (i / params.foodSourceCount) * Math.PI * 2;
        const dist = Math.min(width, height) * 0.35;
        foodSources.push({
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist,
          radius: 25 + Math.random() * 15,
        });
      }
      obstacles = [];
      for (let i = 0; i < params.obstacleCount; i++) {
        obstacles.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.8 + height * 0.1,
          radius: 30 + Math.random() * 40,
        });
      }
      (ctx.canvas as any)._slimeMoldState = {
        trailMap,
        particles,
        foodSources,
        obstacles,
        width,
        height,
      };
    }
  }
  
  const state = (ctx.canvas as any)._slimeMoldState;
  trailMap = state.trailMap;
  particles = state.particles;
  foodSources = state.foodSources;
  obstacles = state.obstacles;
  
  // Convert angles to radians
  const sensorAngleRad = (params.sensorAngle * Math.PI) / 180;
  const turnAngleRad = (params.turnAngle * Math.PI) / 180;
  
  // Helper to get trail value at position
  const getTrail = (x: number, y: number): number => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || ix >= width || iy < 0 || iy >= height) return 0;
    return trailMap[iy * width + ix] || 0;
  };
  
  // Helper to deposit trail
  const depositTrail = (x: number, y: number, amount: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || ix >= width || iy < 0 || iy >= height) return;
    const idx = iy * width + ix;
    trailMap[idx] = Math.min(255, trailMap[idx] + amount);
  };
  
  // Check if position collides with obstacle
  const hitsObstacle = (x: number, y: number): boolean => {
    for (const obs of obstacles) {
      const dx = x - obs.x;
      const dy = y - obs.y;
      if (dx * dx + dy * dy < obs.radius * obs.radius) return true;
    }
    return false;
  };
  
  // Check if position is at food source
  const atFoodSource = (x: number, y: number): boolean => {
    for (const food of foodSources) {
      const dx = x - food.x;
      const dy = y - food.y;
      if (dx * dx + dy * dy < food.radius * food.radius) return true;
    }
    return false;
  };
  
  // Update particles
  for (const p of particles) {
    // Sensor positions
    const leftSensorX = p.x + Math.cos(p.angle - sensorAngleRad) * params.sensorDist;
    const leftSensorY = p.y + Math.sin(p.angle - sensorAngleRad) * params.sensorDist;
    const centerSensorX = p.x + Math.cos(p.angle) * params.sensorDist;
    const centerSensorY = p.y + Math.sin(p.angle) * params.sensorDist;
    const rightSensorX = p.x + Math.cos(p.angle + sensorAngleRad) * params.sensorDist;
    const rightSensorY = p.y + Math.sin(p.angle + sensorAngleRad) * params.sensorDist;
    
    // Sample trail at sensors
    const leftTrail = getTrail(leftSensorX, leftSensorY);
    const centerTrail = getTrail(centerSensorX, centerSensorY);
    const rightTrail = getTrail(rightSensorX, rightSensorY);
    
    // Decide turn direction based on sensor readings
    if (centerTrail > leftTrail && centerTrail > rightTrail) {
      // Continue straight
    } else if (centerTrail < leftTrail && centerTrail < rightTrail) {
      // Random turn
      p.angle += (Math.random() - 0.5) * 2 * turnAngleRad;
    } else if (leftTrail > rightTrail) {
      // Turn left
      p.angle -= turnAngleRad;
    } else if (rightTrail > leftTrail) {
      // Turn right
      p.angle += turnAngleRad;
    }
    
    // Add small random wobble for natural movement
    p.angle += (Math.random() - 0.5) * 0.1;
    
    // Calculate new position
    const speed = 2;
    const newX = p.x + Math.cos(p.angle) * speed;
    const newY = p.y + Math.sin(p.angle) * speed;
    
    // Check boundaries and obstacles
    if (newX < 0 || newX >= width || newY < 0 || newY >= height || hitsObstacle(newX, newY)) {
      // Bounce off boundary/obstacle
      p.angle = p.angle + Math.PI + (Math.random() - 0.5);
    } else {
      p.x = newX;
      p.y = newY;
    }
    
    // Deposit trail
    const deposit = atFoodSource(p.x, p.y) ? params.depositAmount * 2 : params.depositAmount;
    depositTrail(p.x, p.y, deposit);
  }
  
  // Decay trail map
  const persistence = params.trailPersistence / 100;
  const decay = params.decayRate;
  for (let i = 0; i < trailMap.length; i++) {
    trailMap[i] = Math.max(0, trailMap[i] * persistence - decay);
  }
  
  // Render trail map
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  const colors = colorSchemes[params.colorScheme];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const trail = trailMap[idx];
      const pixelIdx = idx * 4;
      
      if (trail > 0) {
        // Map trail value to color
        const colorIndex = Math.min(colors.length - 1, Math.floor((trail / 255) * colors.length));
        const color = colors[colorIndex];
        const intensity = trail / 255;
        
        data[pixelIdx] = color.r * intensity;
        data[pixelIdx + 1] = color.g * intensity;
        data[pixelIdx + 2] = color.b * intensity;
        data[pixelIdx + 3] = 255;
      } else {
        // Dark background
        data[pixelIdx] = 5;
        data[pixelIdx + 1] = 5;
        data[pixelIdx + 2] = 8;
        data[pixelIdx + 3] = 255;
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Draw food sources
  for (const food of foodSources) {
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 200, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 150, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Glow effect
    const gradient = ctx.createRadialGradient(
      food.x, food.y, 0,
      food.x, food.y, food.radius * 1.5
    );
    gradient.addColorStop(0, "rgba(255, 255, 200, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 200, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw obstacles
  for (const obs of obstacles) {
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(40, 40, 50, 0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(80, 80, 100, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  // Draw particles if enabled
  if (params.showParticles) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (const p of particles) {
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
    }
  }
}

export const slimeMold: ArtGenerator = {
  name: "Slime Mold",
  description: "Physarum polycephalum simulation - biological pathfinding through emergent behavior",
  params: {
    particleCount: {
      name: "Particles",
      type: "range",
      min: 500,
      max: 10000,
      default: 4000,
      step: 500,
    },
    sensorAngle: {
      name: "Sensor Angle",
      type: "range",
      min: 10,
      max: 90,
      default: 45,
      step: 5,
    },
    sensorDist: {
      name: "Sensor Distance",
      type: "range",
      min: 5,
      max: 50,
      default: 20,
      step: 5,
    },
    turnAngle: {
      name: "Turn Angle",
      type: "range",
      min: 5,
      max: 60,
      default: 20,
      step: 5,
    },
    decayRate: {
      name: "Trail Decay",
      type: "range",
      min: 0,
      max: 10,
      default: 2,
      step: 1,
    },
    depositAmount: {
      name: "Deposit Amount",
      type: "range",
      min: 5,
      max: 50,
      default: 15,
      step: 5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["slime-green", "electric-blue", "magma", "rainbow", "monochrome"],
      default: "slime-green",
    },
    foodSourceCount: {
      name: "Food Sources",
      type: "range",
      min: 1,
      max: 8,
      default: 3,
      step: 1,
    },
    obstacleCount: {
      name: "Obstacles",
      type: "range",
      min: 0,
      max: 5,
      default: 0,
      step: 1,
    },
    showParticles: {
      name: "Show Particles",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    trailPersistence: {
      name: "Trail Persistence",
      type: "range",
      min: 50,
      max: 99,
      default: 95,
      step: 1,
    },
  },
  generate: (ctx, params, timestamp) => {
    // Convert string params to proper types
    const typedParams: SlimeMoldParams = {
      particleCount: Number(params.particleCount),
      sensorAngle: Number(params.sensorAngle),
      sensorDist: Number(params.sensorDist),
      turnAngle: Number(params.turnAngle),
      decayRate: Number(params.decayRate),
      depositAmount: Number(params.depositAmount),
      colorScheme: params.colorScheme as SlimeMoldParams["colorScheme"],
      foodSourceCount: Number(params.foodSourceCount),
      obstacleCount: Number(params.obstacleCount),
      showParticles: params.showParticles === "true",
      trailPersistence: Number(params.trailPersistence),
    };
    renderSlimeMold(ctx, typedParams, timestamp);
  },
};
