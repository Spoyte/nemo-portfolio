import {
  ArtGenerator,
  fillCanvas,
  SeededRandom,
  generateSeed,
} from "./core";

// Physarum Transport Networks
// Simulates slime mold (Physarum polycephalum) pathfinding behavior
// Agents deposit trails, sense gradients, and create optimal network structures

interface Agent {
  x: number;
  y: number;
  angle: number;
  speed: number;
}

export const physarumNetwork: ArtGenerator = {
  name: "Physarum Network",
  description: "Slime mold transport networks — emergent optimal pathfinding through trail deposition and chemotaxis",
  params: {
    agentCount: {
      name: "Agent Count",
      type: "range",
      min: 500,
      max: 8000,
      step: 500,
      default: 4000,
    },
    sensorAngle: {
      name: "Sensor Angle",
      type: "range",
      min: 10,
      max: 60,
      step: 5,
      default: 30,
    },
    sensorDistance: {
      name: "Sensor Distance",
      type: "range",
      min: 5,
      max: 30,
      step: 1,
      default: 15,
    },
    turnSpeed: {
      name: "Turn Speed",
      type: "range",
      min: 5,
      max: 45,
      step: 5,
      default: 20,
    },
    decayRate: {
      name: "Trail Decay",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: 3,
    },
    depositAmount: {
      name: "Deposit Amount",
      type: "range",
      min: 10,
      max: 100,
      step: 10,
      default: 50,
    },
    colorHue: {
      name: "Base Hue",
      type: "range",
      min: 0,
      max: 360,
      step: 10,
      default: 120,
    },
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  meta: {
    category: "natural",
    complexity: "complex",
    tags: ["animated", "organic", "chaotic", "nature"],
    created: "2026-03-15",
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    const {
      agentCount,
      sensorAngle,
      sensorDistance,
      turnSpeed,
      decayRate,
      depositAmount,
      colorHue,
      seed,
    } = params;

    // Initialize seeded RNG
    const rng = new SeededRandom(seed as number);
    
    // Trail map (floating point for accumulation)
    const trailMap = new Float32Array(width * height);
    
    // Initialize agents with random positions and headings
    const agents: Agent[] = [];
    for (let i = 0; i < (agentCount as number); i++) {
      agents.push({
        x: rng.random() * width,
        y: rng.random() * height,
        angle: rng.random() * Math.PI * 2,
        speed: 1 + rng.random() * 0.5,
      });
    }

    // Simulation steps per frame
    const stepsPerFrame = 4;
    
    // Trail decay factor
    const decay = 1 - (decayRate as number) * 0.001;
    
    // Sensor configuration
    const sensorAngleRad = ((sensorAngle as number) * Math.PI) / 180;
    const sensorDist = sensorDistance as number;
    const turnSpeedRad = ((turnSpeed as number) * Math.PI) / 180;
    const deposit = (depositAmount as number) / 255;

    // Run simulation for accumulated effect
    for (let step = 0; step < stepsPerFrame; step++) {
      // Agent update phase
      for (const agent of agents) {
        // Sense trail concentrations at three points
        const leftAngle = agent.angle - sensorAngleRad;
        const rightAngle = agent.angle + sensorAngleRad;
        
        const leftX = Math.floor(agent.x + Math.cos(leftAngle) * sensorDist);
        const leftY = Math.floor(agent.y + Math.sin(leftAngle) * sensorDist);
        const centerX = Math.floor(agent.x + Math.cos(agent.angle) * sensorDist);
        const centerY = Math.floor(agent.y + Math.sin(agent.angle) * sensorDist);
        const rightX = Math.floor(agent.x + Math.cos(rightAngle) * sensorDist);
        const rightY = Math.floor(agent.y + Math.sin(rightAngle) * sensorDist);
        
        // Sample trail values (with boundary handling)
        const leftTrail = (leftX >= 0 && leftX < width && leftY >= 0 && leftY < height) 
          ? trailMap[leftY * width + leftX] : 0;
        const centerTrail = (centerX >= 0 && centerX < width && centerY >= 0 && centerY < height) 
          ? trailMap[centerY * width + centerX] : 0;
        const rightTrail = (rightX >= 0 && rightX < width && rightY >= 0 && rightY < height) 
          ? trailMap[rightY * width + rightX] : 0;
        
        // Chemotaxis: steer toward higher concentrations
        if (centerTrail > leftTrail && centerTrail > rightTrail) {
          // Continue straight
        } else if (centerTrail < leftTrail && centerTrail < rightTrail) {
          // Random turn when no clear gradient
          agent.angle += (rng.random() - 0.5) * 2 * turnSpeedRad;
        } else if (leftTrail > rightTrail) {
          agent.angle -= turnSpeedRad;
        } else if (rightTrail > leftTrail) {
          agent.angle += turnSpeedRad;
        }
        
        // Add slight randomness to prevent perfect loops
        agent.angle += (rng.random() - 0.5) * 0.1;
        
        // Move agent
        agent.x += Math.cos(agent.angle) * agent.speed;
        agent.y += Math.sin(agent.angle) * agent.speed;
        
        // Wrap around edges (toroidal world)
        if (agent.x < 0) agent.x += width;
        if (agent.x >= width) agent.x -= width;
        if (agent.y < 0) agent.y += height;
        if (agent.y >= height) agent.y -= height;
        
        // Deposit trail
        const ix = Math.floor(agent.x);
        const iy = Math.floor(agent.y);
        if (ix >= 0 && ix < width && iy >= 0 && iy < height) {
          trailMap[iy * width + ix] = Math.min(1, trailMap[iy * width + ix] + deposit);
        }
      }
      
      // Trail decay phase
      for (let i = 0; i < trailMap.length; i++) {
        trailMap[i] *= decay;
      }
    }
    
    // Render trail map to canvas
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const hue = colorHue as number;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const trail = trailMap[idx];
        
        // Map trail value to color
        // Low trails: dark background
        // High trails: bright, saturated color
        const intensity = Math.pow(trail, 0.7); // Gamma correction for visibility
        
        const h = (hue + trail * 60) % 360; // Slight hue shift based on intensity
        const s = 40 + intensity * 60; // 40% to 100% saturation
        const l = 5 + intensity * 55;  // 5% to 60% lightness
        
        // HSL to RGB conversion
        const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
        const x2 = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = (l / 100) - c / 2;
        
        let r, g, b;
        if (h < 60) { r = c; g = x2; b = 0; }
        else if (h < 120) { r = x2; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x2; }
        else if (h < 240) { r = 0; g = x2; b = c; }
        else if (h < 300) { r = x2; g = 0; b = c; }
        else { r = c; g = 0; b = x2; }
        
        const pixelIdx = idx * 4;
        data[pixelIdx] = (r + m) * 255;
        data[pixelIdx + 1] = (g + m) * 255;
        data[pixelIdx + 2] = (b + m) * 255;
        data[pixelIdx + 3] = 255; // Alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  },
};

export default physarumNetwork;
