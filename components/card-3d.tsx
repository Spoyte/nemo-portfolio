"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glareEnabled?: boolean;
  tiltAmount?: number;
  scale?: number;
  perspective?: number;
}

export function Card3D({
  children,
  className = "",
  glareEnabled = true,
  tiltAmount = 10,
  scale = 1.02,
  perspective = 1000,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective,
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      {children}
      
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        >
          <motion.div
            className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Floating Card with 3D effect
interface FloatingCard3DProps {
  children: React.ReactNode;
  className?: string;
  floatHeight?: number;
  floatDuration?: number;
}

export function FloatingCard3D({
  children,
  className = "",
  floatHeight = 10,
  floatDuration = 3,
}: FloatingCard3DProps) {
  return (
    <motion.div
      animate={{
        y: [-floatHeight, floatHeight, -floatHeight],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      <Card3D className="h-full">{children}</Card3D>
    </motion.div>
  );
}

// Stacked Cards Effect
interface StackedCardsProps {
  cards: React.ReactNode[];
  className?: string;
}

export function StackedCards({ cards, className = "" }: StackedCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ y: index * 10, scale: 1 - index * 0.05 }}
          animate={{
            y: hoveredIndex === index ? -20 : index * 10,
            scale: hoveredIndex === index ? 1.05 : 1 - index * 0.05,
            zIndex: hoveredIndex === index ? 10 : cards.length - index,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {card}
        </motion.div>
      ))}
    </div>
  );
}
