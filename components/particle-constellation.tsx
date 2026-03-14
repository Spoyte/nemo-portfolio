"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

type Mode = "galaxy" | "neural" | "geometric" | "constellation";

interface ParticleConstellationProps {
  mode?: Mode;
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
}

const modeConfigs = {
  galaxy: {
    colors: ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"],
    particleCount: 80,
    connectionDistance: 120,
    speed: 0.3,
    glow: true,
  },
  neural: {
    colors: ["#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75"],
    particleCount: 100,
    connectionDistance: 100,
    speed: 0.2,
    glow: true,
  },
  geometric: {
    colors: ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e"],
    particleCount: 60,
    connectionDistance: 150,
    speed: 0.4,
    glow: false,
  },
  constellation: {
    colors: ["#ffffff", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b"],
    particleCount: 70,
    connectionDistance: 130,
    speed: 0.15,
    glow: false,
  },
};

export function ParticleConstellation({
  mode = "galaxy",
  className = "",
}: ParticleConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const [currentMode, setCurrentMode] = useState<Mode>(mode);
  const config = modeConfigs[currentMode];

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          radius: Math.random() * 2 + 1,
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
      return particles;
    },
    [config]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Mouse interaction - particles are attracted to mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          particle.vx += (dx / dist) * 0.02;
          particle.vy += (dy / dist) * 0.02;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();

        if (config.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / config.connectionDistance) * 0.3;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
          const mouseDx = particle.x - mouseRef.current.x;
          const mouseDy = particle.y - mouseRef.current.y;
          const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

          if (mouseDist < config.connectionDistance * 1.5) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - mouseDist / (config.connectionDistance * 1.5)) * 0.5;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    },
    [config]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        particlesRef.current = initParticles(canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      drawParticles(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, drawParticles]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      />
      
      {/* Mode Switcher */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border">
        {(Object.keys(modeConfigs) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setCurrentMode(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              currentMode === m
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ParticleConstellation;
