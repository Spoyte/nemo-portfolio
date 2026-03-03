"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CHARACTERS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  charIndex: number;
}

export function MatrixRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let columns: Column[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const columnCount = Math.floor(canvas.width / 20);
      columns = [];
      
      for (let i = 0; i < columnCount; i++) {
        columns.push({
          x: i * 20,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1,
          chars: Array(20).fill(null).map(() => 
            CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          ),
          charIndex: 0,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Fade effect
      ctx.fillStyle = "rgba(12, 10, 9, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px monospace";

      columns.forEach((column) => {
        // Draw characters in column
        column.chars.forEach((char, i) => {
          const y = column.y - i * 20;
          if (y < 0 || y > canvas.height) return;

          // Head character is brighter
          if (i === 0) {
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#dc2626";
          } else if (i < 5) {
            ctx.fillStyle = `rgba(248, 113, 113, ${1 - i * 0.15})`;
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = `rgba(220, 38, 38, ${0.3 - i * 0.01})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, column.x, y);
        });

        // Update position
        column.y += column.speed;

        // Reset when off screen
        if (column.y > canvas.height + 400) {
          column.y = -20;
          column.speed = Math.random() * 2 + 1;
          column.chars = Array(20).fill(null).map(() => 
            CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          );
        }

        // Occasionally change a character
        if (Math.random() < 0.02) {
          column.chars[Math.floor(Math.random() * column.chars.length)] = 
            CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1 }}
    />
  );
}
