"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function ParticleNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const colors = ["#dc2626", "#ea580c", "#d97706", "#0891b2", "#7c3aed"];

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse attraction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Draw mouse connections
        const mouseDist = Math.sqrt(
          Math.pow(mouse.x - particle.x, 2) + Math.pow(mouse.y - particle.y, 2)
        );

        if (mouseDist < 200) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.3 * (1 - mouseDist / 200)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 1 }}
    />
  );
}
