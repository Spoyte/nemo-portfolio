import { ArtGenerator } from "./core";

// Simplified boids for thumbnail - static snapshot
export function renderBoidsFlockingThumb(
  ctx: CanvasRenderingContext2D,
  time: number = 0
): void {
  const { width, height } = ctx.canvas;
  
  // Color palette
  const colors = ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"];
  
  // Dark background
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);
  
  // Generate deterministic "boids" based on position
  const numBoids = 30;
  
  for (let i = 0; i < numBoids; i++) {
    // Deterministic pseudo-random based on index
    const angle = (i / numBoids) * Math.PI * 2 + time * 0.001;
    const radius = 30 + (i % 3) * 25;
    const centerX = width / 2 + Math.cos(angle * 0.7) * 20;
    const centerY = height / 2 + Math.sin(angle * 0.7) * 20;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const vx = Math.cos(angle + Math.PI / 2);
    const vy = Math.sin(angle + Math.PI / 2);
    
    // Draw boid as small triangle
    const boidAngle = Math.atan2(vy, vx);
    const size = 3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(boidAngle);
    
    ctx.beginPath();
    ctx.moveTo(size * 2, 0);
    ctx.lineTo(-size, -size * 0.8);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size, size * 0.8);
    ctx.closePath();
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.restore();
    
    // Draw faint connection lines to neighbors
    if (i < numBoids - 1) {
      const nextAngle = ((i + 1) / numBoids) * Math.PI * 2 + time * 0.001;
      const nextX = centerX + Math.cos(nextAngle) * radius;
      const nextY = centerY + Math.sin(nextAngle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nextX, nextY);
      ctx.strokeStyle = colors[i % colors.length] + "20";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

export const boidsFlockingThumb: ArtGenerator = {
  id: "boids-flocking-thumb",
  name: "Emergent Flocking Behavior (Thumbnail)",
  category: "natural",
  render: (ctx, _params, time) => renderBoidsFlockingThumb(ctx, time),
  defaultParams: {},
};

export default boidsFlockingThumb;
