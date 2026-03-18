import {
  ArtGenerator,
  fillCanvas,
} from "./core";

// Less, But Better
// A meditation on Dieter Rams' 10th principle
// One circle. One motion. One breath.

export const lessButBetter: ArtGenerator = {
  name: "Less, But Better",
  description: "A meditation on Dieter Rams' 10th principle — one perfect circle that breathes with your presence. Maximum impact from minimum complexity.",
  params: {
    seed: {
      name: "Seed",
      type: "range",
      min: 1,
      max: 10000,
      step: 1,
      default: 1,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height);
    const baseRadius = size * 0.15;
    
    // Breathing cycle — 4 second inhale/exhale
    const breathCycle = (time * 0.008) % 1;
    const breath = (Math.sin(breathCycle * Math.PI * 2 - Math.PI / 2) + 1) / 2;
    
    // Easing for smooth motion
    const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easedBreath = ease(breath);
    
    const radius = baseRadius + easedBreath * (size * 0.1);
    const lineWidth = 2 - easedBreath * 0.5;
    
    // Clear with subtle gradient background
    const bg = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, size * 0.8
    );
    bg.addColorStop(0, '#0f0f0f');
    bg.addColorStop(1, '#050505');
    fillCanvas(ctx, '#050505', canvas.width, canvas.height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // The circle — one perfect form
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    // Gradient stroke — white to warm gray
    const stroke = ctx.createLinearGradient(
      centerX - radius, centerY - radius,
      centerX + radius, centerY + radius
    );
    stroke.addColorStop(0, `rgba(255, 255, 255, ${0.9 - easedBreath * 0.3})`);
    stroke.addColorStop(0.5, `rgba(240, 235, 220, ${0.8 - easedBreath * 0.2})`);
    stroke.addColorStop(1, `rgba(255, 255, 255, ${0.9 - easedBreath * 0.3})`);
    
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Subtle glow — only when breathing
    if (easedBreath > 0.01) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 250, 240, ${easedBreath * 0.1})`;
      ctx.lineWidth = lineWidth + easedBreath * 20;
      ctx.stroke();
    }
    
    // Four corner marks — restraint, precision
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const markSize = size * 0.015;
    const margin = size * 0.12;
    
    // Top left
    ctx.fillRect(margin, margin, markSize, 1);
    ctx.fillRect(margin, margin, 1, markSize);
    
    // Top right
    ctx.fillRect(size - margin - markSize, margin, markSize, 1);
    ctx.fillRect(size - margin - 1, margin, 1, markSize);
    
    // Bottom left
    ctx.fillRect(margin, size - margin - 1, markSize, 1);
    ctx.fillRect(margin, size - margin - markSize, 1, markSize);
    
    // Bottom right
    ctx.fillRect(size - margin - markSize, size - margin - 1, markSize, 1);
    ctx.fillRect(size - margin - 1, size - margin - markSize, 1, markSize);
  },
  meta: {
    category: "geometric",
    complexity: "minimal",
    tags: ["animated", "minimal", "monochrome", "geometric", "zen"],
    created: "2026-03-17",
  },
};
