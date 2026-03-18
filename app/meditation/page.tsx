"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Wind, 
  Music, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Flower2,
  Waves,
  Mountain,
  Cloud,
  Flame
} from "lucide-react";

// Ambient sound generators using Web Audio API
function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggle = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    if (isPlaying) {
      // Fade out
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      }
      setTimeout(() => {
        oscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorsRef.current = [];
      }, 500);
      setIsPlaying(false);
    } else {
      // Create ambient drone
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      // Multiple oscillators for rich texture
      const frequencies = [110, 164.81, 196, 220]; // A2, E3, G3, A3
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Add subtle detune
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(2, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        osc.connect(gainNode);
        osc.start();
        oscillatorsRef.current.push(osc);
      });

      setIsPlaying(true);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(newVolume, audioContextRef.current.currentTime, 0.1);
    }
  };

  return { isPlaying, toggle, volume, adjustVolume };
}

// Breathing exercise component
function BreathingExercise() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const phases: Array<{ phase: "inhale" | "hold" | "exhale" | "rest"; duration: number }> = [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 4000 },
      { phase: "exhale", duration: 4000 },
      { phase: "rest", duration: 4000 },
    ];

    let currentIndex = 0;
    const runPhase = () => {
      const current = phases[currentIndex];
      setPhase(current.phase);
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        if (isActive) runPhase();
      }, current.duration);
    };

    runPhase();

    return () => {
      currentIndex = 0;
    };
  }, [isActive]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In...";
      case "hold": return "Hold...";
      case "exhale": return "Breathe Out...";
      case "rest": return "Rest...";
    }
  };

  const getScale = () => {
    switch (phase) {
      case "inhale": return 1.5;
      case "hold": return 1.5;
      case "exhale": return 1;
      case "rest": return 1;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-6"
          animate={{ scale: getScale() }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/50 to-primary/20"
            animate={{ scale: getScale() }}
            transition={{ duration: 4, ease: "easeInOut", delay: 0.1 }}
          />
        </motion.div>
        
        <p className="text-lg font-medium mb-4">{getPhaseText()}</p>
        
        <Button onClick={() => setIsActive(!isActive)} variant={isActive ? "default" : "outline"}>
          {isActive ? (
            <><Pause className="h-4 w-4 mr-2" /> Pause</>
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Start</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Zen garden with interactive sand
function ZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rakedLines, setRakedLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Draw sand texture
    const drawSand = () => {
      ctx.fillStyle = "#f5f5f0";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Add noise
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.offsetWidth;
        const y = Math.random() * canvas.offsetHeight;
        ctx.fillStyle = Math.random() > 0.5 ? "#e8e8e0" : "#fafaf5";
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw raked lines
      ctx.strokeStyle = "#d0d0c8";
      ctx.lineWidth = 2;
      rakedLines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      });
    };

    drawSand();

    return () => window.removeEventListener("resize", resize);
  }, [rakedLines]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRakedLines(prev => [...prev, { x1: x, y1: y, x2: x, y2: y }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRakedLines(prev => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = { ...newLines[newLines.length - 1], x2: x, y2: y };
      return newLines;
    });
  };

  const handleMouseUp = () => setIsDrawing(false);

  const clearGarden = () => setRakedLines([]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5" />
          Zen Garden
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={clearGarden}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <canvas
          ref={canvasRef}
          className="w-full h-64 cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <p className="text-xs text-muted-foreground text-center py-2">
          Click and drag to rake the sand
        </p>
      </CardContent>
    </Card>
  );
}

// Floating lotus animation
function FloatingLotus() {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-950">
      {/* Water ripples */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-300/30"
          initial={{ width: 50, height: 50, opacity: 0 }}
          animate={{ 
            width: 200 + i * 50, 
            height: 100 + i * 25, 
            opacity: [0, 0.5, 0] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: i * 1.5,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Lotus flower */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
          <defs>
            <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="petal2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          {/* Petals */}
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="50"
              rx="15"
              ry="35"
              fill={i % 2 === 0 ? "url(#petal1)" : "url(#petal2)"}
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="10" fill="#fbbf24" />
        </svg>
      </motion.div>

      {/* Lily pad */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#4ade80" opacity="0.8" />
          <path d="M50 50 L50 5 A45 45 0 0 1 95 50 Z" fill="#22c55e" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  );
}

// Meditation timer
function MeditationTimer() {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const setDurationAndReset = (mins: number) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flower2 className="h-5 w-5" />
          Meditation Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-6xl font-bold mb-6 font-mono">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[5, 10, 15, 20].map(mins => (
            <Button
              key={mins}
              variant={duration === mins ? "default" : "outline"}
              size="sm"
              onClick={() => setDurationAndReset(mins)}
            >
              {mins}m
            </Button>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={() => setIsActive(!isActive)} variant={isActive ? "default" : "outline"}>
            {isActive ? <><Pause className="h-4 w-4 mr-2" /> Pause</> : <><Play className="h-4 w-4 mr-2" /> Start</>}
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function MeditationPage() {
  const { isPlaying, toggle, volume, adjustVolume } = useAmbientSound();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Find Your Center</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code <span className="text-gradient-animated">Meditation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a break from coding. Breathe deeply, clear your mind, and find your center.
          </p>
        </motion.div>

        {/* Ambient Sound Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-orange-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ambient Soundscape</h3>
                    <p className="text-sm text-muted-foreground">Generative ambient drone for deep focus</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isPlaying && (
                    <div className="flex items-center gap-2">
                      {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  )}
                  <Button onClick={toggle} variant={isPlaying ? "default" : "outline"}>
                    {isPlaying ? <><Pause className="h-4 w-4 mr-2" /> Stop</> : <><Play className="h-4 w-4 mr-2" /> Play</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured: Floating Lotus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FloatingLotus />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BreathingExercise />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MeditationTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <ZenGarden />
          </motion.div>
        </div>

        {/* Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <blockquote className="text-xl italic text-muted-foreground max-w-2xl mx-auto">
            "The mind is everything. What you think you become."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">— Buddha</cite>
        </motion.div>
      </div>
    </div>
  );
}
