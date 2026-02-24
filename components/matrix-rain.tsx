"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Zap } from "lucide-react";

interface MatrixRainProps {
  isActive: boolean;
  onClose: () => void;
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

export function MatrixRain({ isActive, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  const startMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    let frameCount = 0;

    const draw = () => {
      frameCount++;
      
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

      // Show message after a few seconds
      if (frameCount > 200) {
        setShowMessage(true);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isActive) {
      const cleanup = startMatrix();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        cleanup?.();
      };
    }
  }, [isActive, startMatrix]);

  useEffect(() => {
    if (!isActive) {
      setShowMessage(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 transition-colors"
        >
          <X className="h-4 w-4" />
          Exit Matrix
        </motion.button>

        {/* Secret Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center max-w-2xl px-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <Terminal className="h-16 w-16 mx-auto text-green-400 mb-4" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-green-400 mb-4 font-mono"
                >
                  WAKE UP, NEMO...
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-xl text-green-300/80 mb-8 font-mono"
                >
                  The Matrix has you... but your code is clean and your tests pass.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2 font-mono text-sm text-green-400/60"
                >
                  {codeSnippets.slice(0, 5).map((snippet, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      &gt; {snippet}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8 flex items-center justify-center gap-2 text-green-400"
                >
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span className="font-mono text-sm">Achievement Unlocked: Matrix Explorer</span>
                  <Zap className="h-4 w-4 animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-400/40 text-sm font-mono"
        >
          Press ESC or click Exit Matrix to return to reality
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MatrixRain;
