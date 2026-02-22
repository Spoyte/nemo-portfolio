"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorFollowerProps {
  children: React.ReactNode;
}

export function CursorFollower({ children }: CursorFollowerProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<"default" | "text" | "link" | "button">("default");
  const [clickBurst, setClickBurst] = useState<{ x: number; y: number } | null>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === "A" || target.closest("a")) {
        setCursorVariant("link");
      } else if (target.tagName === "BUTTON" || target.closest("button")) {
        setCursorVariant("button");
      } else if (target.tagName === "P" || target.tagName === "SPAN" || target.tagName === "H1" || target.tagName === "H2" || target.tagName === "H3") {
        setCursorVariant("text");
      } else {
        setCursorVariant("default");
      }
    };

    const handleClick = (e: MouseEvent) => {
      setClickBurst({ x: e.clientX, y: e.clientY });
      setTimeout(() => setClickBurst(null), 500);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(220, 38, 38, 0.2)",
      border: "2px solid rgba(220, 38, 38, 0.5)",
      mixBlendMode: "difference" as const,
    },
    text: {
      width: 4,
      height: 32,
      backgroundColor: "rgba(220, 38, 38, 0.8)",
      border: "none",
      mixBlendMode: "normal" as const,
    },
    link: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(220, 38, 38, 0.1)",
      border: "2px solid rgba(220, 38, 38, 0.8)",
      mixBlendMode: "normal" as const,
    },
    button: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(220, 38, 38, 0.15)",
      border: "2px solid rgba(220, 38, 38, 0.6)",
      mixBlendMode: "normal" as const,
    },
  };

  return (
    <>
      {/* Custom Cursor - Desktop Only */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      {/* Click Burst Effect */}
      {clickBurst && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-[9998] hidden md:block"
          style={{
            left: clickBurst.x,
            top: clickBurst.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            borderRadius: "50%",
            border: "2px solid rgba(220, 38, 38, 0.5)",
          }}
        />
      )}

      {/* Trail Effect */}
      <CursorTrail cursorX={cursorX} cursorY={cursorY} />

      {children}
    </>
  );
}

function CursorTrail({ cursorX, cursorY }: { cursorX: ReturnType<typeof useMotionValue<number>>; cursorY: ReturnType<typeof useMotionValue<number>> }) {
  const trailRef = useRef<{ x: number; y: number; id: number }[]>([]);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    let animationId: number;
    let lastUpdate = 0;

    const updateTrail = () => {
      const now = Date.now();
      if (now - lastUpdate > 50) { // Update every 50ms
        const x = cursorX.get();
        const y = cursorY.get();
        
        if (x > 0 && y > 0) {
          trailRef.current = [
            { x, y, id: now },
            ...trailRef.current.slice(0, 5),
          ];
          forceUpdate({});
        }
        lastUpdate = now;
      }
      animationId = requestAnimationFrame(updateTrail);
    };

    // Only on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      animationId = requestAnimationFrame(updateTrail);
    }

    return () => cancelAnimationFrame(animationId);
  }, [cursorX, cursorY]);

  return (
    <>
      {trailRef.current.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.6 - index * 0.1, scale: 1 - index * 0.15 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-[9997] hidden md:block w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: point.x,
            top: point.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      ))}
    </>
  );
}
