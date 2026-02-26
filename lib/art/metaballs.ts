import { ArtGenerator, ArtParams, ParamConfig, renderPixels, hexToRgb } from "./core";

interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: { r: number; g: number; b: number };
}

export interface MetaballsParams extends ArtParams {
  ballCount: number;
  ballRadius: number;
  threshold: number;
  speed: number;
  colorScheme: string;
  wireframe: string;
  glow: string;
  trails: number;
  resolution: number;
}

export const metaballsDefaultParams: MetaballsParams = {
  ballCount: 4,
  ballRadius: 60,
  threshold: 1.0,
  speed: 0.8,
  colorScheme: "neon",
  wireframe: "off",
  glow: "on",
  trails: 0.3,
  resolution: 4,
};

export function renderMetaballs(
  ctx: CanvasRenderingContext2D,
  params: MetaballsParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const {
    ballCount,
    ballRadius,
    threshold,
    speed,
    colorScheme,
    wireframe,
    glow,
    trails,
    resolution,
  } = params;

  const isWireframe = wireframe === "on";
  const hasGlow = glow === "on";

  // Color schemes
  const colorSchemes: Record<string, string[]> = {
    neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00", "#8000ff", "#ff8000", "#00ff80"],
    ocean: ["#001f3f", "#0074d9", "#39cccc", "#2ecc40", "#01ff70", "#7fdbff", "#39cccc", "#0055a4"],
    sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569", "#2c003e", "#ff4757", "#ffa502"],
    forest: ["#2d5016", "#3a6b1f", "#4a8b2c", "#7cb342", "#aed581", "#1b3d0d", "#5d8c3a", "#8bc34a"],
    magma: ["#1a0000", "#4a0000", "#7a0000", "#b30000", "#ff4500", "#ff8c00", "#ffa500", "#ff6347"],
    ice: ["#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", "#00bcd4", "#00acc1", "#0097a7"],
    gold: ["#fff8e1", "#ffecb3", "#ffe082", "#ffd54f", "#ffca28", "#ffc107", "#ffb300", "#ffa000"],
    midnight: ["#0a0a0a", "#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560", "#4a4e69", "#22223b"],
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.neon;

  // Initialize metaballs with deterministic positions based on time
  const balls: Metaball[] = [];
  
  for (let i = 0; i < ballCount; i++) {
    const angle = (i / ballCount) * Math.PI * 2 + time * 0.0005 * speed;
    const orbitRadius = Math.min(width, height) * 0.25 + Math.sin(time * 0.001 + i) * 50;
    const centerX = width / 2 + Math.cos(angle) * orbitRadius;
    const centerY = height / 2 + Math.sin(angle) * orbitRadius;
    
    // Add some independent motion
    const wobbleX = Math.sin(time * 0.002 + i * 1.5) * 30;
    const wobbleY = Math.cos(time * 0.0018 + i * 1.3) * 30;
    
    const colorHex = colors[i % colors.length];
    const rgb = hexToRgb(colorHex);
    
    balls.push({
      x: centerX + wobbleX,
      y: centerY + wobbleY,
      vx: Math.cos(angle + Math.PI / 2) * speed,
      vy: Math.sin(angle + Math.PI / 2) * speed,
      radius: ballRadius * (0.8 + Math.sin(time * 0.001 + i) * 0.2),
      color: rgb,
    });
  }

  // Apply trails effect
  if (trails > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${trails})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
  }

  // Field function: f(r) = R²/d²
  const fieldFunction = (dx: number, dy: number, radius: number): number => {
    const distSq = dx * dx + dy * dy;
    if (distSq < 0.01) return 100; // Prevent division by zero
    return (radius * radius) / distSq;
  };

  if (isWireframe) {
    // Marching squares wireframe rendering
    const step = resolution;
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        // Calculate field values at corners
        const corners = [
          { dx: x - balls[0].x, dy: y - balls[0].y },
          { dx: x + step - balls[0].x, dy: y - balls[0].y },
          { dx: x + step - balls[0].x, dy: y + step - balls[0].y },
          { dx: x - balls[0].x, dy: y + step - balls[0].y },
        ];
        
        let fieldSum = 0;
        for (const ball of balls) {
          for (const corner of corners) {
            fieldSum += fieldFunction(corner.dx + ball.x - balls[0].x, corner.dy + ball.y - balls[0].y, ball.radius);
          }
        }
        fieldSum /= 4; // Average of corners
        
        if (fieldSum > threshold) {
          ctx.strokeRect(x, y, step, step);
        }
      }
    }
  } else {
    // Filled rendering with pixel manipulation
    renderPixels(
      ctx,
      width,
      height,
      (x, y) => {
        let fieldSum = 0;
        let r = 0, g = 0, b = 0;
        
        // Calculate total field and weighted color
        for (const ball of balls) {
          const dx = x - ball.x;
          const dy = y - ball.y;
          const field = fieldFunction(dx, dy, ball.radius);
          fieldSum += field;
          
          // Weight color contribution by field strength
          r += ball.color.r * field;
          g += ball.color.g * field;
          b += ball.color.b * field;
        }
        
        // Normalize colors
        if (fieldSum > 0) {
          r /= fieldSum;
          g /= fieldSum;
          b /= fieldSum;
        }
        
        // Apply threshold and create smooth falloff
        if (fieldSum > threshold) {
          // Normalize field for alpha calculation
          const normalizedField = Math.min(fieldSum / (threshold * 3), 1);
          const alpha = Math.floor(normalizedField * 255);
          
          // Glow effect: add halo around the surface
          if (hasGlow && fieldSum < threshold * 1.5) {
            const glowIntensity = (threshold * 1.5 - fieldSum) / (threshold * 0.5);
            r = Math.min(255, r + glowIntensity * 100);
            g = Math.min(255, g + glowIntensity * 100);
            b = Math.min(255, b + glowIntensity * 100);
          }
          
          return { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b), a: alpha };
        }
        
        // Subtle background glow for nearby areas
        if (hasGlow && fieldSum > threshold * 0.3) {
          const bgIntensity = (fieldSum - threshold * 0.3) / (threshold * 0.7) * 30;
          return { r: Math.floor(bgIntensity), g: Math.floor(bgIntensity), b: Math.floor(bgIntensity + bgIntensity * 0.5), a: 255 };
        }
        
        return { r: 0, g: 0, b: 0, a: 255 };
      },
      resolution
    );
  }

  // Draw ball centers (optional visual aid)
  if (!isWireframe) {
    for (const ball of balls) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${ball.color.r}, ${ball.color.g}, ${ball.color.b})`;
      ctx.fill();
    }
  }
}

export const metaballs: ArtGenerator = {
  name: "Metaballs",
  description: "Organic implicit surfaces created by blending field functions. Blobby shapes that merge and separate fluidly.",
  params: {
    ballCount: {
      name: "Ball Count",
      type: "range",
      min: 2,
      max: 8,
      step: 1,
      default: 4,
    },
    ballRadius: {
      name: "Ball Radius",
      type: "range",
      min: 30,
      max: 100,
      step: 5,
      default: 60,
    },
    threshold: {
      name: "Surface Threshold",
      type: "range",
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.0,
    },
    speed: {
      name: "Movement Speed",
      type: "range",
      min: 0.2,
      max: 2.0,
      step: 0.1,
      default: 0.8,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["neon", "ocean", "sunset", "forest", "magma", "ice", "gold", "midnight"],
      default: "neon",
    },
    wireframe: {
      name: "Wireframe Mode",
      type: "select",
      options: ["off", "on"],
      default: "off",
    },
    glow: {
      name: "Glow Effect",
      type: "select",
      options: ["off", "on"],
      default: "on",
    },
    trails: {
      name: "Motion Trails",
      type: "range",
      min: 0,
      max: 0.95,
      step: 0.05,
      default: 0.3,
    },
    resolution: {
      name: "Resolution",
      type: "range",
      min: 2,
      max: 8,
      step: 2,
      default: 4,
    },
  },
  generate: (ctx, params, time) => {
    renderMetaballs(ctx, params as MetaballsParams, time);
  },
};
