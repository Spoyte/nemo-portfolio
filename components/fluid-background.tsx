"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface FluidSimulationProps {
  className?: string;
}

export function FluidSimulation({ className = "" }: FluidSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const isActiveRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle system for fluid effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }> = [];

    const colors = [
      "rgba(220, 38, 38, 0.5)",   // Red
      "rgba(234, 88, 12, 0.5)",   // Orange
      "rgba(245, 158, 11, 0.5)",  // Amber
      "rgba(16, 185, 129, 0.5)",  // Emerald
      "rgba(59, 130, 246, 0.5)",  // Blue
      "rgba(139, 92, 246, 0.5)",  // Violet
    ];

    let frameCount = 0;
    const animate = () => {
      if (!isActiveRef.current) return;
      
      frameCount++;
      // Skip every other frame for performance
      if (frameCount % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add particles at mouse position
      if (mouseRef.current.vx !== 0 || mouseRef.current.vy !== 0) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: (Math.random() - 0.5) * 2 + mouseRef.current.vx * 0.5,
            vy: (Math.random() - 0.5) * 2 + mouseRef.current.vy * 0.5,
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 3 + 1,
          });
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // Friction
        p.vy *= 0.98;
        p.life -= 0.005;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("0.5", (p.life * 0.5).toString());
        ctx.fill();

        // Connect nearby particles
        for (let j = i - 1; j >= 0; j--) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * p.life * p2.life})`;
            ctx.stroke();
          }
        }
      }

      // Limit particles
      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current.vx = x - mouseRef.current.x;
    mouseRef.current.vy = y - mouseRef.current.y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 pointer-events-auto z-0 opacity-30 ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// Simplified starfield for performance
export function Starfield({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isActiveRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create stars
    const stars: Array<{ x: number; y: number; size: number; speed: number; brightness: number }> = [];
    const starCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random(),
      });
    }

    let frameCount = 0;
    const animate = () => {
      if (!isActiveRef.current) return;
      
      frameCount++;
      if (frameCount % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y += star.speed;
        star.brightness += (Math.random() - 0.5) * 0.1;
        star.brightness = Math.max(0.2, Math.min(1, star.brightness));

        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.5})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}

// Animated gradient orbs
export function GradientOrbs({ className = "" }: { className?: string }) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
        animate={{
          x: ["-20%", "30%", "-20%"],
          y: ["-20%", "40%", "-20%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/20 blur-[100px]"
        animate={{
          x: ["20%", "-30%", "20%"],
          y: ["20%", "-20%", "20%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "50%", right: "10%" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px]"
        animate={{
          x: ["-10%", "20%", "-10%"],
          y: ["30%", "-30%", "30%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", left: "30%" }}
      />
    </div>
  );
}
