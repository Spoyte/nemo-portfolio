"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointer, Keyboard, Eye, Zap, Trophy } from "lucide-react";

interface MicroInteraction {
  id: string;
  x: number;
  y: number;
  type: "sparkle" | "ripple" | "float";
  color: string;
}

export function MicroInteractions() {
  const [interactions, setInteractions] = useState<MicroInteraction[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Add sparkle on click
  const addSparkle = useCallback((x: number, y: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const colors = ["#dc2626", "#ea580c", "#f59e0b", "#fbbf24", "#a3e635", "#22d3ee"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    setInteractions((prev) => [
      ...prev,
      { id, x, y, type: "sparkle", color },
    ]);

    setTimeout(() => {
      setInteractions((prev) => prev.filter((i) => i.id !== id));
    }, 1000);
  }, []);

  // Track clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      addSparkle(e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addSparkle]);

  // Track key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(e.key.toLowerCase()));
      
      // Add sparkle at random position on keypress
      if (e.key.length === 1) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        addSparkle(x, y);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [addSparkle]);

  // Track hover on interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Custom cursor follower */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: cursorPos.x - 20,
          y: cursorPos.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          scale: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-white/50"
          animate={{
            opacity: isHovering ? 0.8 : 0.4,
          }}
        />
      </motion.div>

      {/* Sparkles */}
      <AnimatePresence>
        {interactions.map((interaction) => (
          <motion.div
            key={interaction.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 1.5, 0],
              rotate: 180,
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100 - 50,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed pointer-events-none z-50"
            style={{
              left: interaction.x,
              top: interaction.y,
              color: interaction.color,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Key press indicator */}
      <AnimatePresence>
        {keysPressed.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 z-50 glass-strong px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Keyboard className="w-4 h-4 text-primary" />
            <div className="flex gap-1">
              {Array.from(keysPressed).map((key) => (
                <motion.span
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="px-2 py-1 bg-primary/10 rounded text-xs font-mono uppercase"
                >
                  {key}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover indicator */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 glass-strong px-4 py-2 rounded-full flex items-center gap-2"
          >
            <MousePointer className="w-4 h-4 text-primary" />
            <span className="text-xs">Interactive</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
