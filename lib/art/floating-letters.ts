"use client";

import { useEffect, useRef, useCallback } from "react";
import { ArtGenerator, ArtParams } from "@/lib/art/core";

interface Letter {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  rotation: number;
  vRotation: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const generateKineticTypography = (
  ctx: CanvasRenderingContext2D,
  params: ArtParams,
  time: number,
  mouseRef: React.MutableRefObject<{ x: number; y: number; isDown: boolean }>,
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>
) => {
  const width = dimensionsRef.current.width;
  const height = dimensionsRef.current.height;
  const mouse = mouseRef.current;

  // Parameters
  const text = String(params.text || "FLOAT");
  const fontSize = Number(params.fontSize || 48);
  const spread = Number(params.spread || 100);
  const mouseForce = Number(params.mouseForce || 0.5);
  const returnForce = Number(params.returnForce || 0.02);
  const friction = Number(params.friction || 0.95);
  const rotationSpeed = Number(params.rotationSpeed || 0.5);
  const colorScheme = String(params.colorScheme || "neon");
  const particleTrails = Boolean(params.particleTrails ?? true);

  // Color schemes
  const schemes: Record<string, string[]> = {
    neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"],
    ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#004080"],
    sunset: ["#ff6b35", "#f7931e", "#ffd23f", "#ff6b9d", "#c44569"],
    monochrome: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
    rainbow: ["#ff0000", "#ff8800", "#ffff00", "#00ff00", "#0088ff", "#8800ff"],
  };

  const colors = schemes[colorScheme] || schemes.neon;

  // Initialize letters on first run
  const lettersRef = (generateKineticTypography as any).letters as Letter[] | undefined;
  const particlesRef = (generateKineticTypography as any).particles as Particle[] | undefined;

  if (!lettersRef || lettersRef.length !== text.length) {
    const letters: Letter[] = [];
    const totalWidth = text.length * fontSize * 0.6;
    const startX = (width - totalWidth) / 2;
    const centerY = height / 2;

    for (let i = 0; i < text.length; i++) {
      const x = startX + i * fontSize * 0.6;
      const y = centerY + Math.sin(i * 0.5) * 20;
      letters.push({
        char: text[i],
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        vx: 0,
        vy: 0,
        targetX: x,
        targetY: y,
        size: fontSize,
        color: colors[i % colors.length],
        rotation: Math.random() * Math.PI * 2,
        vRotation: 0,
      });
    }
    (generateKineticTypography as any).letters = letters;
    (generateKineticTypography as any).particles = [];
  }

  const letters = (generateKineticTypography as any).letters as Letter[];
  let particles = (generateKineticTypography as any).particles as Particle[];

  // Clear with fade effect for trails
  if (particleTrails) {
    ctx.fillStyle = "rgba(10, 10, 15, 0.2)";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, width, height);
  }

  // Update and draw particles
  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life > 0) {
      const alpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(")", `,${alpha})`).replace("rgb", "rgba");
      ctx.fill();
      return true;
    }
    return false;
  });

  // Spawn particles from moving letters
  letters.forEach((letter) => {
    const speed = Math.sqrt(letter.vx * letter.vx + letter.vy * letter.vy);
    if (speed > 2 && Math.random() < 0.3) {
      particles.push({
        x: letter.x,
        y: letter.y,
        vx: letter.vx * 0.3 + (Math.random() - 0.5),
        vy: letter.vy * 0.3 + (Math.random() - 0.5),
        life: 30 + Math.random() * 20,
        maxLife: 50,
        color: letter.color,
      });
    }
  });

  // Physics update for letters
  letters.forEach((letter, i) => {
    // Distance to mouse
    const dx = mouse.x - letter.x;
    const dy = mouse.y - letter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Mouse interaction
    if (dist < 150) {
      const force = (150 - dist) / 150;
      if (mouse.isDown) {
        // Attract when mouse is down
        letter.vx += (dx / dist) * force * mouseForce * 0.5;
        letter.vy += (dy / dist) * force * mouseForce * 0.5;
      } else {
        // Repel when mouse is up
        letter.vx -= (dx / dist) * force * mouseForce;
        letter.vy -= (dy / dist) * force * mouseForce;
      }

      // Add rotation based on mouse proximity
      letter.vRotation += force * rotationSpeed * 0.1;
    }

    // Return to target position (spring force)
    const homeDx = letter.targetX - letter.x;
    const homeDy = letter.targetY - letter.y;
    letter.vx += homeDx * returnForce;
    letter.vy += homeDy * returnForce;

    // Letter-to-letter repulsion
    letters.forEach((other, j) => {
      if (i !== j) {
        const ldx = letter.x - other.x;
        const ldy = letter.y - other.y;
        const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
        if (ldist < fontSize && ldist > 0) {
          letter.vx += (ldx / ldist) * 0.5;
          letter.vy += (ldy / ldist) * 0.5;
        }
      }
    });

    // Apply friction
    letter.vx *= friction;
    letter.vy *= friction;
    letter.vRotation *= friction;

    // Update position
    letter.x += letter.vx;
    letter.y += letter.vy;
    letter.rotation += letter.vRotation;

    // Boundary bounce
    if (letter.x < fontSize / 2 || letter.x > width - fontSize / 2) {
      letter.vx *= -0.8;
      letter.x = Math.max(fontSize / 2, Math.min(width - fontSize / 2, letter.x));
    }
    if (letter.y < fontSize / 2 || letter.y > height - fontSize / 2) {
      letter.vy *= -0.8;
      letter.y = Math.max(fontSize / 2, Math.min(height - fontSize / 2, letter.y));
    }
  });

  // Draw letters
  letters.forEach((letter) => {
    ctx.save();
    ctx.translate(letter.x, letter.y);
    ctx.rotate(letter.rotation);

    // Glow effect
    ctx.shadowColor = letter.color;
    ctx.shadowBlur = 20;

    // Draw character
    ctx.font = `bold ${letter.size}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = letter.color;
    ctx.fillText(letter.char, 0, 0);

    // Inner highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(letter.char, -1, -1);

    ctx.restore();
  });

  // Draw connection lines between nearby letters
  ctx.strokeStyle = colors[0] + "30";
  ctx.lineWidth = 1;
  for (let i = 0; i < letters.length; i++) {
    for (let j = i + 1; j < letters.length; j++) {
      const dx = letters[i].x - letters[j].x;
      const dy = letters[i].y - letters[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < fontSize * 2) {
        ctx.beginPath();
        ctx.moveTo(letters[i].x, letters[i].y);
        ctx.lineTo(letters[j].x, letters[j].y);
        ctx.stroke();
      }
    }
  }

  // Store particles for next frame
  (generateKineticTypography as any).particles = particles;
};

// Reset function for when parameters change
export const resetKineticTypography = () => {
  (generateKineticTypography as any).letters = undefined;
  (generateKineticTypography as any).particles = undefined;
};

export const floatingLetters: ArtGenerator = {
  name: "Kinetic Typography",
  description:
    "Interactive physics-based text. Letters float and respond to mouse movement with magnetic forces. Click and hold to attract, release to repel. Particles trail from moving letters.",
  params: {
    text: {
      name: "Text",
      type: "select",
      options: ["FLOAT", "MOVE", "PLAY", "TYPE", "FLOW", "WAVE", "DANCE"],
      default: "FLOAT",
    },
    fontSize: {
      name: "Font Size",
      type: "range",
      min: 24,
      max: 96,
      step: 4,
      default: 48,
    },
    spread: {
      name: "Initial Spread",
      type: "range",
      min: 0,
      max: 200,
      step: 10,
      default: 100,
    },
    mouseForce: {
      name: "Mouse Force",
      type: "range",
      min: 0.1,
      max: 2,
      step: 0.1,
      default: 0.5,
    },
    returnForce: {
      name: "Return Force",
      type: "range",
      min: 0.01,
      max: 0.1,
      step: 0.01,
      default: 0.02,
    },
    friction: {
      name: "Friction",
      type: "range",
      min: 0.8,
      max: 0.99,
      step: 0.01,
      default: 0.95,
    },
    rotationSpeed: {
      name: "Rotation",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.5,
    },
    colorScheme: {
      name: "Colors",
      type: "select",
      options: ["neon", "ocean", "sunset", "monochrome", "rainbow"],
      default: "neon",
    },
    particleTrails: {
      name: "Particle Trails",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
  },
  generate: generateKineticTypography as any,
  meta: {
    category: "interactive",
    complexity: "moderate",
    tags: ["animated", "colorful", "interactive", "futuristic"],
    created: "2026-03-02",
  },
};

export default floatingLetters;
