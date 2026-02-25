"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointerClick } from "lucide-react";

interface ScreenSaverProps {
  timeout?: number; // Time in milliseconds before screensaver activates
  enabled?: boolean;
}

class Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = (Math.random() - 0.5) * canvasWidth * 2;
    this.y = (Math.random() - 0.5) * canvasHeight * 2;
    this.z = Math.random() * canvasWidth;
    this.size = Math.random() * 2 + 0.5;
    this.speed = Math.random() * 2 + 0.5;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.z -= this.speed * 10;

    if (this.z <= 0) {
      this.x = (Math.random() - 0.5) * canvasWidth * 2;
      this.y = (Math.random() - 0.5) * canvasHeight * 2;
      this.z = canvasWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    const sx = (this.x / this.z) * canvasWidth + canvasWidth / 2;
    const sy = (this.y / this.z) * canvasHeight + canvasHeight / 2;
    const size = (1 - this.z / canvasWidth) * this.size * 3;
    const alpha = 1 - this.z / canvasWidth;

    if (sx > 0 && sx < canvasWidth && sy > 0 && sy < canvasHeight) {
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      // Draw trail
      const px = (this.x / (this.z + 50)) * canvasWidth + canvasWidth / 2;
      const py = (this.y / (this.z + 50)) * canvasHeight + canvasHeight / 2;
      
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.lineWidth = size * 0.5;
      ctx.stroke();
    }
  }
}

export function ScreenSaver({ timeout = 60000, enabled = true }: ScreenSaverProps) {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isActive) {
      setIsActive(false);
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsActive(true);
    }, timeout);
  }, [isActive, timeout]);

  useEffect(() => {
    if (!enabled) return;

    // Activity listeners
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, resetTimer]);

  // Canvas animation
  useEffect(() => {
    if (!isActive || !enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize stars
      starsRef.current = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push(new Star(canvas.width, canvas.height));
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.update(canvas.width, canvas.height);
        star.draw(ctx, canvas.width, canvas.height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, enabled]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Screen Saver Canvas */}
          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[9998] bg-black cursor-none"
            onClick={resetTimer}
          />

          {/* Screen Saver UI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">Screen Saver Active</span>
              <span className="text-white/60">•</span>
              <span className="text-sm text-white/60 flex items-center gap-1">
                <MousePointerClick className="h-3 w-3" />
                Click to resume
              </span>
            </div>
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none text-center"
          >
            <ScreenSaverClock />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ScreenSaverClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white">
      <motion.div
        className="text-8xl md:text-9xl font-bold tabular-nums"
        style={{ textShadow: "0 0 40px rgba(255,255,255,0.5)" }}
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </motion.div>
      <div className="text-xl md:text-2xl text-white/60 mt-4">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>  );
}
