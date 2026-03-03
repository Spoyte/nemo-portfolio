"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Flame, Snowflake, Leaf, Moon } from "lucide-react";

type ParticleType = "sparkle" | "zap" | "flame" | "snow" | "leaf" | "star";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: ParticleType;
  color: string;
}

const PARTICLE_CONFIG: Record<ParticleType, { colors: string[]; icon: string }> = {
  sparkle: { colors: ["#FFD700", "#FFA500", "#FF69B4"], icon: "✨" },
  zap: { colors: ["#00FFFF", "#0080FF", "#8000FF"], icon: "⚡" },
  flame: { colors: ["#FF4500", "#FF6347", "#FFD700"], icon: "🔥" },
  snow: { colors: ["#FFFFFF", "#E0F7FA", "#B2EBF2"], icon: "❄️" },
  leaf: { colors: ["#4CAF50", "#8BC34A", "#CDDC39"], icon: "🍃" },
  star: { colors: ["#FFD700", "#FFA500", "#FF69B4"], icon: "⭐" },
};

export function ParticleBurstButton({
  children,
  onClick,
  className,
  particleType = "sparkle",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  particleType?: ParticleType;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0);

        updated.forEach((p) => {
          const alpha = p.life / p.maxLife;
          ctx.font = `${p.size}px serif`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fillText(PARTICLE_CONFIG[p.type].icon, p.x, p.y);
        });

        ctx.globalAlpha = 1;
        return updated;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!buttonRef.current || !canvasRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    const x = rect.left + rect.width / 2 - canvasRect.left;
    const y = rect.top + rect.height / 2 - canvasRect.top;

    const newParticles: Particle[] = [];
    const config = PARTICLE_CONFIG[particleType];

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = Math.random() * 5 + 3;
      
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        life: 60,
        maxLife: 60,
        size: Math.random() * 16 + 12,
        type: particleType,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100vw", height: "100vh" }}
      />
      <Button
        ref={buttonRef}
        onClick={handleClick}
        className={className}
      >
        {children}
      </Button>
    </div>
  );
}

export function ParticleTypeSelector({
  value,
  onChange,
}: {
  value: ParticleType;
  onChange: (type: ParticleType) => void;
}) {
  const types: { type: ParticleType; icon: React.ReactNode; label: string }[] = [
    { type: "sparkle", icon: <Sparkles className="w-4 h-4" />, label: "Sparkle" },
    { type: "zap", icon: <Zap className="w-4 h-4" />, label: "Zap" },
    { type: "flame", icon: <Flame className="w-4 h-4" />, label: "Flame" },
    { type: "snow", icon: <Snowflake className="w-4 h-4" />, label: "Snow" },
    { type: "leaf", icon: <Leaf className="w-4 h-4" />, label: "Leaf" },
    { type: "star", icon: <Moon className="w-4 h-4" />, label: "Star" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            value === type
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
