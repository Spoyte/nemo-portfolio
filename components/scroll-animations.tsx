"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 30,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: distance, x: 0 };
      case "down": return { y: -distance, x: 0 };
      case "left": return { x: distance, y: 0 };
      case "right": return { x: -distance, y: 0 };
      case "none": return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for child animations
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) {
  const getVariants = (): Variants => {
    const baseHidden = { opacity: 0 };
    const baseVisible = { opacity: 1 };

    switch (direction) {
      case "up":
        return {
          hidden: { ...baseHidden, y: 30 },
          visible: { ...baseVisible, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        };
      case "down":
        return {
          hidden: { ...baseHidden, y: -30 },
          visible: { ...baseVisible, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        };
      case "left":
        return {
          hidden: { ...baseHidden, x: 30 },
          visible: { ...baseVisible, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        };
      case "right":
        return {
          hidden: { ...baseHidden, x: -30 },
          visible: { ...baseVisible, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        };
      case "scale":
        return {
          hidden: { ...baseHidden, scale: 0.8 },
          visible: { ...baseVisible, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
        };
    }
  };

  return (
    <motion.div variants={getVariants()} className={className}>
      {children}
    </motion.div>
  );
}

// Text reveal animation (character by character)
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  charDelay = 0.03,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.3,
            delay: delay + index * charDelay,
            ease: "easeOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Word reveal animation
interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
}

export function WordReveal({
  text,
  className = "",
  delay = 0,
  wordDelay = 0.1,
}: WordRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: delay + index * wordDelay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
            {index < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Blur reveal
interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
}: BlurRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Counter animation
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function Parallax({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = (ref.current as HTMLElement).getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const multiplier = direction === "up" ? -1 : 1;
      setOffset(scrolled * speed * multiplier * 0.1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return (
    <motion.div
      ref={ref}
      style={{ y: offset }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    setPosition({
      x: distanceX * strength,
      y: distanceY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Line draw animation
interface LineDrawProps {
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "horizontal" | "vertical";
}

export function LineDraw({
  className = "",
  delay = 0,
  duration = 1,
  direction = "horizontal",
}: LineDrawProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ 
        scaleX: direction === "horizontal" ? 0 : 1,
        scaleY: direction === "vertical" ? 0 : 1,
      }}
      animate={isInView ? { scaleX: 1, scaleY: 1 } : {}}
      transition={{ duration, delay, ease: "easeInOut" }}
      style={{ transformOrigin: direction === "horizontal" ? "left" : "top" }}
      className={`bg-primary ${direction === "horizontal" ? "h-px" : "w-px"} ${className}`}
    />
  );
}

// Floating animation
interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function Floating({
  children,
  className = "",
  amplitude = 10,
  duration = 3,
}: FloatingProps) {
  return (
    <motion.div
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation
interface PulseProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function Pulse({
  children,
  className = "",
  scale = 1.05,
  duration = 2,
}: PulseProps) {
  return (
    <motion.div
      animate={{ scale: [1, scale, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Gradient text animation
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({
  children,
  className = "",
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_auto] animate-gradient ${className}`}
    >
      {children}
    </span>
  );
}
