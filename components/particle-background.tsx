"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  variant?: "default" | "sparse" | "dense" | "snow" | "stars";
  interactive?: boolean;
  className?: string;
}

const colors = {
  default: ["#dc2626", "#ea580c", "#f59e0b", "#fbbf24"],
  sparse: ["#dc2626", "#f87171", "#fca5a5"],
  dense: ["#dc2626", "#ea580c", "#f59e0b", "#fbbf24", "#fcd34d", "#fed7aa"],
  snow: ["#ffffff", "#e5e7eb", "#d1d5db", "#f3f4f6"],
  stars: ["#ffffff", "#fef3c7", "#fde68a", "#fcd34d"],
};

export function ParticleBackground({ 
  variant = "default", 
  interactive = true,
  className = "" 
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const particleCount = {
    default: 50,
    sparse: 25,
    dense: 100,
    snow: 80,
    stars: 60,
  }[variant];

  const colorPalette = colors[variant];

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * (variant === "snow" ? 0.5 : 1),
      speedY: variant === "snow" ? Math.random() * 1 + 0.5 : (Math.random() - 0.5) * 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    }));
  }, [dimensions, particleCount, variant, colorPalette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x -= (dx / distance) * force * 2;
            particle.y -= (dy / distance) * force * 2;
          }
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections (only for non-snow/stars variants)
        if (variant !== "snow" && variant !== "stars") {
          particlesRef.current.forEach((other) => {
            if (particle.id === other.id) return;
            
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (1 - distance / 100) * 0.2;
              ctx.stroke();
            }
          });
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, variant, interactive]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
}

// Floating elements background
export function FloatingElementsBackground({ className = "" }: { className?: string }) {
  const elements = [
    { icon: "⚛️", delay: 0, duration: 20, x: "10%", y: "20%" },
    { icon: "▲", delay: 2, duration: 25, x: "80%", y: "15%" },
    { icon: "📘", delay: 4, duration: 22, x: "70%", y: "70%" },
    { icon: "🌊", delay: 1, duration: 18, x: "20%", y: "80%" },
    { icon: "🟢", delay: 3, duration: 24, x: "90%", y: "50%" },
    { icon: "🐘", delay: 5, duration: 21, x: "30%", y: "40%" },
    { icon: "◈", delay: 2.5, duration: 19, x: "60%", y: "30%" },
    { icon: "🐳", delay: 4.5, duration: 23, x: "15%", y: "60%" },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </div>
  );
}

// Gradient mesh background
export function GradientMeshBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{
          background: "linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(234, 88, 12, 0.2))",
          top: "10%",
          left: "10%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.15))",
          bottom: "10%",
          right: "10%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.15))",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// Animated grid background
export function AnimatedGridBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "100px 100px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
