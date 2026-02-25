"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X } from "lucide-react";

interface CodeRainBackgroundProps {
  isActive?: boolean;
  onToggle?: () => void;
}

const codeSnippets = [
  "const nemo = new Developer();",
  "nemo.skills.push('React', 'TypeScript');",
  "while (alive) { nemo.learn(); }",
  "if (bug) { nemo.fix(); }",
  "git commit -m 'fix everything'",
  "npm install happiness",
  "console.log('Hello World');",
  "function createMagic() { return ✨; }",
  "import { Creativity } from 'mind';",
  "export default AwesomePortfolio;",
  "sudo make me a sandwich",
  "rm -rf doubts/",
  "mkdir -p success/",
  "chmod +x dreams.sh",
  "./achieve-goals --force",
  "docker run -d imagination",
  "kubectl apply -f future.yaml",
  "terraform plan -out=greatness",
  "aws s3 cp ideas s3://reality/",
];

export function CodeRainBackground({ isActive: propIsActive, onToggle }: CodeRainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [internalIsActive, setInternalIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isActive = propIsActive !== undefined ? propIsActive : internalIsActive;

  const startMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,..<>?/~`";

    const draw = () => {
      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Randomly color some characters
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#fff";
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = "#0fa";
        } else {
          ctx.fillStyle = "#0f0";
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isActive && isVisible) {
      const cleanup = startMatrix();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        cleanup?.();
      };
    }
  }, [isActive, isVisible, startMatrix]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      </motion.div>
    </AnimatePresence>
  );
}

export function CodeRainToggle() {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <CodeRainBackground isActive={isActive} onToggle={handleToggle} />
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`fixed top-24 right-4 z-40 p-3 rounded-full glass transition-all duration-300 ${
          isActive ? "bg-green-500/20 text-green-400 border-green-500/50" : "text-muted-foreground hover:text-foreground"
        }`}
        title={isActive ? "Disable Code Rain" : "Enable Code Rain"}
      >
        <Code className="h-5 w-5" />
      </motion.button>
    </>
  );
}

export default CodeRainBackground;
