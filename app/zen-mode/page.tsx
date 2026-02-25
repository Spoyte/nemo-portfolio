"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Waves, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Settings2,
  Heart,
  Moon,
  Sun
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

// Breathing patterns
const BREATHING_PATTERNS = {
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, name: "4-7-8 Relaxation", description: "Calm your nervous system" },
  box: { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: "Box Breathing", description: "Focus and clarity" },
  "4-4-4": { inhale: 4, hold: 4, exhale: 4, name: "4-4-4 Balanced", description: "Equal rhythm for balance" },
  coherent: { inhale: 5.5, hold: 0, exhale: 5.5, name: "Coherent Breathing", description: "Optimal HRV training" },
};

type BreathingPhase = "inhale" | "hold" | "exhale" | "hold2" | "idle";

// Particle for ambient background
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

function AmbientParticles({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${isPlaying ? particle.opacity : particle.opacity * 0.3})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100) * (isPlaying ? 0.2 : 0.05)})`;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function BreathingCircle({ 
  phase, 
  progress, 
  pattern 
}: { 
  phase: BreathingPhase; 
  progress: number;
  pattern: keyof typeof BREATHING_PATTERNS;
}) {
  const config = BREATHING_PATTERNS[pattern];
  
  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold2": return "Hold";
      default: return "Press Play";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "from-blue-400 to-cyan-300";
      case "hold": return "from-yellow-400 to-orange-300";
      case "exhale": return "from-purple-400 to-pink-300";
      case "hold2": return "from-green-400 to-emerald-300";
      default: return "from-slate-400 to-slate-300";
    }
  };

  const scale = phase === "idle" ? 1 : 0.8 + (progress * 0.4);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full bg-gradient-to-r ${getPhaseColor()} opacity-10 blur-3xl`}
        animate={{ scale: scale * 1.2 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className={`absolute w-80 h-80 rounded-full bg-gradient-to-r ${getPhaseColor()} opacity-20 blur-2xl`}
        animate={{ scale: scale * 1.1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Main breathing circle */}
      <motion.div
        className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl`}
        animate={{ scale }}
        transition={{ 
          duration: phase === "idle" ? 0.5 : undefined,
          ease: "easeInOut"
        }}
      >
        {/* Inner content */}
        <div className="text-center text-white">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-bold mb-2"
          >
            {getPhaseText()}
          </motion.div>
          <div className="text-white/80 text-sm">
            {phase !== "idle" && `${Math.ceil((1 - progress) * getPhaseDuration(phase, config))}s`}
          </div>
        </div>

        {/* Ripple effects */}
        {phase !== "idle" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>

      {/* Orbiting particles */}
      {phase !== "idle" && (
        <motion.div
          className="absolute w-80 h-80"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute w-3 h-3 rounded-full bg-white/60"
              style={{
                top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function getPhaseDuration(phase: BreathingPhase, config: typeof BREATHING_PATTERNS["4-7-8"]): number {
  switch (phase) {
    case "inhale": return config.inhale;
    case "hold": return config.hold || 0;
    case "exhale": return config.exhale;
    case "hold2": return (config as any).hold2 || 0;
    default: return 0;
  }
}

function SessionStats({ sessions }: { sessions: number }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{sessions}</div>
          <div className="text-xs text-white/60">Sessions</div>
        </CardContent>
      </Card>
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{sessions * 5}</div>
          <div className="text-xs text-white/60">Minutes</div>
        </CardContent>
      </Card>
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{sessions * 50}</div>
          <div className="text-xs text-white/60">Breaths</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ZenModePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof BREATHING_PATTERNS>("4-7-8");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const phaseStartTimeRef = useRef<number>(0);

  const runBreathingCycle = useCallback(() => {
    const config = BREATHING_PATTERNS[selectedPattern];
    const phases: BreathingPhase[] = ["inhale", "hold", "exhale"];
    if ((config as any).hold2) phases.push("hold2");

    let currentPhaseIndex = 0;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase);
      phaseStartTimeRef.current = Date.now();

      const duration = getPhaseDuration(currentPhase, config) * 1000;

      // Progress animation
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - phaseStartTimeRef.current;
        const newProgress = Math.min(elapsed / duration, 1);
        setProgress(newProgress);

        if (newProgress >= 1) {
          clearInterval(progressInterval);
        }
      }, 50);

      timerRef.current = setTimeout(() => {
        clearInterval(progressInterval);
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          setSessions(s => s + 1);
        }
        runPhase();
      }, duration);
    };

    runPhase();
  }, [selectedPattern]);

  useEffect(() => {
    if (isPlaying) {
      runBreathingCycle();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setPhase("idle");
      setProgress(0);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, runBreathingCycle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient particles */}
      <AmbientParticles isPlaying={isPlaying} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Wind className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">Zen Mode</h1>
              <p className="text-white/60 text-sm">Breathe. Focus. Be present.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Main breathing area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <BreathingCircle phase={phase} progress={progress} pattern={selectedPattern} />

          {/* Pattern info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <h2 className="text-white/80 text-lg font-medium">
              {BREATHING_PATTERNS[selectedPattern].name}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {BREATHING_PATTERNS[selectedPattern].description}
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className={`rounded-full px-8 py-6 text-lg transition-all ${
                isPlaying 
                  ? "bg-white/20 hover:bg-white/30 text-white" 
                  : "bg-white text-slate-900 hover:bg-white/90"
              }`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <><Pause className="h-5 w-5 mr-2" /> Pause</>
              ) : (
                <><Play className="h-5 w-5 mr-2" /> Start</>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 p-6"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-white font-semibold mb-4">Breathing Pattern</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(BREATHING_PATTERNS).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPattern(key as keyof typeof BREATHING_PATTERNS);
                        setIsPlaying(false);
                      }}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedPattern === key
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-white font-medium text-sm">{config.name}</div>
                      <div className="text-white/50 text-xs mt-1">{config.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6"
        >
          <SessionStats sessions={sessions} />
        </motion.div>
      </div>
    </div>
  );
}
