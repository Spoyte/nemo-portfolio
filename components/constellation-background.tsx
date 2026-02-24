"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Connection {
  p1: Particle;
  p2: Particle;
  strength: number;
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationRef = useRef<number>(0);
  const connectionsRef = useRef<Connection[]>([]);

  const colors = [
    "rgba(220, 38, 38, 0.6)",   // primary red
    "rgba(234, 88, 12, 0.6)",   // orange
    "rgba(217, 119, 6, 0.6)",   // amber
    "rgba(101, 163, 13, 0.6)",  // lime
    "rgba(8, 145, 178, 0.6)",   // cyan
    "rgba(99, 102, 241, 0.6)",  // indigo
    "rgba(168, 85, 247, 0.6)",  // purple
    "rgba(236, 72, 153, 0.6)",  // pink
  ];

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    particlesRef.current = particles;
  }, []);

  const updateConnections = useCallback(() => {
    const particles = particlesRef.current;
    const connections: Connection[] = [];
    const maxDistance = 150;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          connections.push({
            p1: particles[i],
            p2: particles[j],
            strength: 1 - distance / maxDistance,
          });
        }
      }
    }

    connectionsRef.current = connections;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Update particles
    particles.forEach((particle) => {
      // Mouse interaction
      if (mouse.active) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Update pulse
      particle.pulse += particle.pulseSpeed;

      // Draw particle
      const pulseRadius = particle.radius + Math.sin(particle.pulse) * 0.5;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pulseRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace("0.6", "0.1");
      ctx.fill();
    });

    // Update and draw connections
    updateConnections();
    const connections = connectionsRef.current;

    connections.forEach((connection) => {
      const { p1, p2, strength } = connection;
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(220, 38, 38, ${strength * 0.3})`;
      ctx.lineWidth = strength * 1.5;
      ctx.stroke();
    });

    // Draw mouse connection lines
    if (mouse.active) {
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const strength = 1 - distance / 200;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(220, 38, 38, ${strength * 0.5})`;
          ctx.lineWidth = strength * 2;
          ctx.stroke();
        }
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [updateConnections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
