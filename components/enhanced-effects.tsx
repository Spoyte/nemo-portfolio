"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isActiveRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Matrix characters
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const charArray = chars.split("");
    
    // Columns
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let frameCount = 0;
    const draw = () => {
      if (!isActiveRef.current) return;
      
      // Only draw every 2nd frame for performance
      frameCount++;
      if (frameCount % 2 !== 0) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Random color variation
        const hue = 120 + Math.random() * 40 - 20;
        ctx.fillStyle = `hsl(${hue}, 100%, ${50 + Math.random() * 30}%)`;
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// Konami code detector with visual feedback
export function useKonamiCode(onSuccess: () => void) {
  const [progress, setProgress] = useState(0);
  const konamiCode = useRef([
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ]);
  const currentIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode.current[currentIndex.current]) {
        currentIndex.current++;
        setProgress(currentIndex.current);
        
        if (currentIndex.current === konamiCode.current.length) {
          onSuccess();
          currentIndex.current = 0;
          setProgress(0);
        }
      } else {
        currentIndex.current = 0;
        setProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSuccess]);

  return progress;
}

// Particle burst effect on click
export function ClickParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticles = useCallback((x: number, y: number) => {
    const colors = ["#dc2626", "#ea580c", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const velocity = 2 + Math.random() * 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleClick = (e: MouseEvent) => {
      createParticles(e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.02;

        if (p.life <= 0) return false;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

// Text scramble effect
export function TextScramble({ 
  text, 
  className = "",
  trigger = true 
}: { 
  text: string; 
  className?: string;
  trigger?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span className={className}>{displayText}</span>;
}

// Glitch effect component
export function GlitchText({ 
  children, 
  className = "" 
}: { 
  children: string; 
  className?: string;
}) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover="glitch"
      initial="normal"
      variants={{
        normal: {},
        glitch: {
          x: [0, -2, 2, -2, 0],
          transition: { duration: 0.2 }
        }
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 text-red-500 opacity-0"
        variants={{
          normal: { opacity: 0, x: 0 },
          glitch: { opacity: 0.7, x: -2 }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-500 opacity-0"
        variants={{
          normal: { opacity: 0, x: 0 },
          glitch: { opacity: 0.7, x: 2 }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Magnetic button effect
export function MagneticButton({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    controls.start({
      x: x * 0.3,
      y: y * 0.3,
      transition: { type: "spring", stiffness: 150, damping: 15 }
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 150, damping: 15 }
    });
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Import useState for the components that need it
import { useState } from "react";
