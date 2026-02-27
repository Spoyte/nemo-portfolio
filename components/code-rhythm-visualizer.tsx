"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarData {
  height: number;
  targetHeight: number;
  speed: number;
}

export function CodeRhythmVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bars, setBars] = useState<BarData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize bars
  useEffect(() => {
    const initialBars = Array.from({ length: 64 }, () => ({
      height: 5,
      targetHeight: 5,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setBars(initialBars);
  }, []);

  // Animation loop
  useAnimationFrame(() => {
    if (!isPlaying) return;

    setBars((prevBars) =>
      prevBars.map((bar) => {
        // Generate new target occasionally
        if (Math.random() < 0.05) {
          bar.targetHeight = Math.random() * 80 + 20;
        }

        // Smooth interpolation
        const diff = bar.targetHeight - bar.height;
        bar.height += diff * bar.speed;

        // Decay target
        bar.targetHeight *= 0.98;
        if (bar.targetHeight < 5) bar.targetHeight = 5;

        return bar;
      })
    );

    // Draw on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / bars.length;

    ctx.clearRect(0, 0, width, height);

    bars.forEach((bar, i) => {
      const x = i * barWidth;
      const barHeight = (bar.height / 100) * height;
      const y = height - barHeight;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height);
      gradient.addColorStop(0, `hsl(${280 + i * 2}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${280 + i * 2}, 70%, 30%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${280 + i * 2}, 70%, 50%)`;
    });

    ctx.shadowBlur = 0;
  });

  // Code lines that sync with visualization
  const codeLines = [
    "const rhythm = await life.getFlow();",
    "while (heartbeat.isActive()) {",
    "  const beat = music.generate();",
    "  visualizer.render(beat);",
    "  soul.dance(beat.frequency);",
    "}",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Visualizer Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-6">
        <canvas
          ref={canvasRef}
          width={640}
          height={200}
          className="w-full h-[200px]"
        />

        {/* Overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Music className="w-4 h-4" />
            <span>Code Rhythm Visualizer</span>
          </div>
        </div>
      </div>

      {/* Synced Code Display */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-400">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2">rhythm.js</span>
        </div>
        <div className="space-y-1">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isPlaying ? [0.5, 1, 0.5] : 0.7,
                x: 0 
              }}
              transition={{
                opacity: {
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.3,
                },
                x: { duration: 0.3, delay: i * 0.1 }
              }}
              className="flex"
            >
              <span className="text-slate-600 w-8 text-right mr-4 select-none">
                {i + 1}
              </span>
              <span
                className={`${
                  line.startsWith("const")
                    ? "text-purple-400"
                    : line.startsWith("while")
                    ? "text-pink-400"
                    : line.startsWith("}")
                    ? "text-pink-400"
                    : line.startsWith("  const") || line.startsWith("  ")
                    ? "text-blue-400"
                    : "text-slate-300"
                }`}
              >
                {line}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        A visual representation of code rhythm and flow. Click play to see it come alive.
      </p>
    </div>
  );
}
