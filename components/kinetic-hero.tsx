"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface KineticLetterProps {
  char: string;
  index: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}

function KineticLetter({ char, index, mouseX, mouseY }: KineticLetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  useEffect(() => {
    const handleMouseMove = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();
      
      const distanceX = mouseXVal - centerX;
      const distanceY = mouseYVal - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      const maxDistance = 300;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      x.set((distanceX / maxDistance) * strength);
      y.set((distanceY / maxDistance) * strength);
    };

    const unsubscribeX = mouseX.on("change", handleMouseMove);
    const unsubscribeY = mouseY.on("change", handleMouseMove);
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, x, y]);

  const isSpace = char === " ";

  return (
    <motion.span
      ref={ref}
      style={{
        rotateX,
        rotateY,
        display: isSpace ? "inline" : "inline-block",
        transformStyle: "preserve-3d",
      }}
      className={`${isSpace ? "w-[0.3em]" : ""} transition-colors duration-300`}
      whileHover={{
        scale: 1.2,
        color: "#dc2626",
        transition: { duration: 0.2 },
      }}
    >
      {isSpace ? "\u00A0" : char}
    </motion.span>
  );
}

export function KineticHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const title = "Creative Developer";
  const subtitle = "Crafting Digital Experiences";

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[60vh] flex flex-col items-center justify-center perspective-1000 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center mb-6"
        style={{ transformStyle: "preserve-3d" }}
      >
        {title.split("").map((char, index) => (
          <KineticLetter
            key={`title-${index}`}
            char={char}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl sm:text-2xl md:text-3xl text-muted-foreground text-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {subtitle.split("").map((char, index) => (
          <KineticLetter
            key={`subtitle-${index}`}
            char={char}
            index={index}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-10 left-10 w-20 h-20 border border-primary/20 rounded-full"
        style={{
          animation: "spin-slow 20s linear infinite",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-10 right-10 w-32 h-32 border border-primary/10 rounded-full"
        style={{
          animation: "spin-slow 30s linear infinite reverse",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/40 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
