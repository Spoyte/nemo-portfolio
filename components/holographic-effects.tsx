"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  rainbow?: boolean;
}

export function HolographicCard({
  children,
  className,
  intensity = 0.5,
  rainbow = false,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        className
      )}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: rainbow
            ? `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 0, 0, ${0.1 * intensity}) 45%,
                rgba(255, 127, 0, ${0.1 * intensity}) 50%,
                rgba(255, 255, 0, ${0.1 * intensity}) 55%,
                rgba(0, 255, 0, ${0.1 * intensity}) 60%,
                rgba(0, 0, 255, ${0.1 * intensity}) 65%,
                rgba(75, 0, 130, ${0.1 * intensity}) 70%,
                rgba(148, 0, 211, ${0.1 * intensity}) 75%,
                transparent 80%
              )`
            : `linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, ${0.2 * intensity}) 45%,
                rgba(255, 255, 255, ${0.4 * intensity}) 50%,
                rgba(255, 255, 255, ${0.2 * intensity}) 55%,
                transparent 60%
              )`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(
            circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%,
            rgba(255, 255, 255, ${0.3 * intensity}) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-30"
        style={{
          boxShadow: isHovered
            ? `0 0 ${30 * intensity}px rgba(220, 38, 38, ${0.3 * intensity}),
               inset 0 0 ${20 * intensity}px rgba(255, 255, 255, ${0.1 * intensity})`
            : "none",
        }}
      />

      {children}
    </motion.div>
  );
}

// Glitch text effect
interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        animate={{
          x: [0, -2, 2, -1, 0],
          opacity: [0.7, 0.3, 0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        aria-hidden
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-70"
        animate={{
          x: [0, 2, -2, 1, 0],
          opacity: [0.7, 0.3, 0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.1,
        }}
        aria-hidden
      >
        {text}
      </motion.span>
    </div>
  );
}

// Neon button effect
interface NeonButtonProps {
  children: React.ReactNode;
  className?: string;
  color?: "red" | "blue" | "green" | "purple" | "orange";
  onClick?: () => void;
}

export function NeonButton({
  children,
  className,
  color = "red",
  onClick,
}: NeonButtonProps) {
  const colorMap = {
    red: "from-red-500 to-orange-500 shadow-red-500/50",
    blue: "from-blue-500 to-cyan-500 shadow-blue-500/50",
    green: "from-green-500 to-emerald-500 shadow-green-500/50",
    purple: "from-purple-500 to-pink-500 shadow-purple-500/50",
    orange: "from-orange-500 to-yellow-500 shadow-orange-500/50",
  };

  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 font-semibold text-white rounded-lg overflow-hidden group",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-100 group-hover:opacity-100 transition-opacity",
          colorMap[color]
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity",
          colorMap[color]
        )}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
