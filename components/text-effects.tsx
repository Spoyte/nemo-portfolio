"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextScrambleProps {
  children: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  trigger?: "hover" | "inView" | "always";
  duration?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function TextScramble({
  children,
  className = "",
  as: Component = "span",
  trigger = "hover",
  duration = 1.5,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (trigger === "inView" && isInView && !isScrambling) {
      scramble();
    }
  }, [isInView, trigger]);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const originalText = children;
    const length = originalText.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return originalText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration++;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(originalText);
        setIsScrambling(false);
      }
    }, (duration * 1000) / maxIterations);
  };

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      scramble();
    }
  };

  return (
    <Component
      ref={ref as any}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </Component>
  );
}

// Glitch text effect
interface GlitchTextProps {
  children: string;
  className?: string;
}

export function GlitchText({ children, className = "" }: GlitchTextProps) {
  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          transform: "translateX(-2px)",
        }}
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-0 group-hover:opacity-70"
        style={{
          clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
          transform: "translateX(2px)",
        }}
      >
        {children}
      </span>
    </span>
  );
}

// Animated gradient text
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className = "", animate = true }: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary ${
        animate ? "animate-gradient bg-[length:200%_auto]" : ""
      } ${className}`}
      style={{
        animation: animate ? "gradient 3s linear infinite" : undefined,
      }}
    >
      {children}
    </span>
  );
}

// Typewriter with more effects
interface TypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  cursor?: boolean;
  cursorStyle?: "block" | "line" | "underline";
}

export function TypewriterEffect({
  texts,
  className = "",
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  cursor = true,
  cursorStyle = "block",
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const targetText = texts[currentTextIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText === targetText) {
        setIsPaused(true);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, currentTextIndex, isDeleting, isPaused, pauseDuration, deleteSpeed, texts, speed]);

  const cursorClasses = {
    block: "w-[3px] h-[1em] bg-primary",
    line: "w-[2px] h-[1.2em] bg-primary",
    underline: "w-[0.8em] h-[2px] bg-primary self-end",
  };

  return (
    <span className={`inline-flex items-center ${className}`}>
      {currentText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          className={`inline-block ml-1 align-middle ${cursorClasses[cursorStyle]}`}
        />
      )}
    </span>
  );
}
