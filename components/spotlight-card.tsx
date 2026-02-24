"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({ 
  children, 
  className,
  spotlightColor = "rgba(220, 38, 38, 0.15)"
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };
  
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`;
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        "hover:border-primary/30 transition-colors duration-300",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Group version for multiple cards
interface SpotlightGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightGroup({ children, className }: SpotlightGroupProps) {
  return (
    <div className={cn("group", className)}>
      {children}
    </div>
  );
}
