"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  centerX: number;
  centerY: number;
}

export function OrbitalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const colors = [
    "rgba(220, 38, 38, 0.6)",   // primary red
    "rgba(234, 88, 12, 0.5)",   // orange
    "rgba(251, 191, 36, 0.4)",  // yellow
    "rgba(34, 197, 94, 0.4)",   // green
    "rgba(59, 130, 246, 0.4)",  // blue
    "rgba(139, 92, 246, 0.4)",  // purple
  ];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const particleCount = Math.min(25, Math.floor((width * height) / 40000));

    for (let i = 0; i < particleCount; i++) {
      const orbitRadius = 100 + Math.random() * Math.min(width, height) * 0.4;
      const orbitAngle = (Math.PI * 2 * i) / particleCount + Math.random() * Math.PI;
      const orbitSpeed = 0.0005 + Math.random() * 0.001;
      
      particles.push({
        x: centerX + Math.cos(orbitAngle) * orbitRadius,
        y: centerY + Math.sin(orbitAngle) * orbitRadius,
        vx: 0,
        vy: 0,
        radius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        orbitRadius,
        orbitAngle,
        orbitSpeed,
        centerX,
        centerY,
      });
    }
    
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        // Update and draw particles
        particles.forEach((particle, i) => {
          // Update orbit
          particle.orbitAngle += particle.orbitSpeed;
          
          // Calculate position with some noise
          const noiseX = Math.sin(frameCount * 0.01 + i) * 20;
          const noiseY = Math.cos(frameCount * 0.01 + i) * 20;
          
          particle.x = particle.centerX + Math.cos(particle.orbitAngle) * particle.orbitRadius + noiseX;
          particle.y = particle.centerY + Math.sin(particle.orbitAngle) * particle.orbitRadius * 0.6 + noiseY;

          // Mouse interaction (only process every 5th particle for performance)
          if (i % 5 === 0) {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              const force = (150 - dist) / 150;
              particle.x -= dx * force * 0.02;
              particle.y -= dy * force * 0.02;
            }
          }

          // Draw particle glow
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 3
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, "transparent");
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw particle core
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, "0.9)");
          ctx.fill();
        });

        // Draw connections (limited for performance)
        ctx.strokeStyle = "rgba(220, 38, 38, 0.1)";
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i += 2) {
          for (let j = i + 1; j < particles.length; j += 2) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw mouse connections
        const mouse = mouseRef.current;
        ctx.strokeStyle = "rgba(220, 38, 38, 0.2)";
        
        for (let i = 0; i < particles.length; i += 3) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
