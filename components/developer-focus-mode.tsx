"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Coffee,
  Brain,
  Zap,
  Moon,
  Sun,
  CheckCircle2,
  Sparkles,
  Music,
  Wind,
  Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface FocusSession {
  id: string;
  duration: number;
  completed: boolean;
  timestamp: number;
}

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Gentle Rain", icon: CloudRain },
  { id: "forest", name: "Forest", icon: Trees },
  { id: "cafe", name: "Coffee Shop", icon: Coffee },
  { id: "waves", name: "Ocean Waves", icon: Waves },
  { id: "wind", name: "Wind", icon: Wind },
  { id: "white", name: "White Noise", icon: Music },
];

const QUOTES = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Concentration is the root of all the higher abilities in man.", author: "Bruce Lee" },
  { text: "Where focus goes, energy flows.", author: "Tony Robbins" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "Deep work is the superpower of the 21st century.", author: "Cal Newport" },
];

import { CloudRain, Trees } from "lucide-react";

export function DeveloperFocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [showQuote, setShowQuote] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [breathingActive, setBreathingActive] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);

  const MODES = {
    focus: { minutes: 25, label: "Deep Focus", color: "from-red-500 to-orange-500", icon: Brain },
    short: { minutes: 5, label: "Short Break", color: "from-green-500 to-emerald-500", icon: Coffee },
    long: { minutes: 15, label: "Long Break", color: "from-blue-500 to-cyan-500", icon: Zap },
  };

  // Initialize particles
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
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity})`;
        ctx.fill();
        
        // Draw connections
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      completeSession();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Rotate quotes
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isActive]);

  const completeSession = () => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      duration: MODES[mode].minutes,
      completed: true,
      timestamp: Date.now(),
    };
    setSessions(prev => [...prev, newSession]);
    
    // Play completion sound (visual feedback)
    if (typeof window !== "undefined") {
      // Could add actual audio here
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.timestamp);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const switchMode = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setIsActive(false);
  };

  const CurrentIcon = MODES[mode].icon;

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Focus</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Deep Work <span className="text-gradient-animated">Timer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pomodoro timer with ambient sounds, breathing exercises, and focus analytics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-3xl bg-card border border-border overflow-hidden">
              {/* Background Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-30"
              />
              
              <div className="relative p-8 md:p-12">
                {/* Mode Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => {
                    const ModeIcon = MODES[m].icon;
                    return (
                      <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          mode === m
                            ? `bg-gradient-to-r ${MODES[m].color} text-white`
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <ModeIcon className="w-4 h-4" />
                        {MODES[m].label}
                      </button>
                    );
                  })}
                </div>

                {/* Timer Display */}
                <div className="text-center mb-8">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl md:text-9xl font-bold tabular-nums tracking-tight"
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6 h-2 bg-muted rounded-full overflow-hidden max-w-md mx-auto">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${MODES[mode].color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setTimeLeft(MODES[mode].minutes * 60);
                      setIsActive(false);
                    }}
                    className="rounded-full w-14 h-14 p-0"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    className={`rounded-full px-8 py-6 text-lg bg-gradient-to-r ${MODES[mode].color}`}
                  >
                    {isActive ? (
                      <><Pause className="w-5 h-5 mr-2" /> Pause</>
                    ) : (
                      <><Play className="w-5 h-5 mr-2" /> Start</>
                    )}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="rounded-full w-14 h-14 p-0"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Quote */}
                <AnimatePresence mode="wait">
                  {showQuote && (
                    <motion.div
                      key={currentQuote.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center max-w-lg mx-auto"
                    >
                      <p className="text-lg text-muted-foreground italic mb-2">
                        "{currentQuote.text}"
                      </p>
                      <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Today's Focus
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sessions</span>
                  <span className="text-2xl font-bold">{todaySessions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Focus Time</span>
                  <span className="text-2xl font-bold">
                    {Math.floor(todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h {" "}
                    {todaySessions.reduce((acc, s) => acc + s.duration, 0) % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="text-2xl font-bold text-primary">🔥 5</span>
                </div>
              </div>
            </motion.div>

            {/* Ambient Sounds */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Ambient Sounds
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {AMBIENT_SOUNDS.map((sound) => {
                  const SoundIcon = sound.icon;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => setSelectedSound(selectedSound === sound.id ? null : sound.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-all ${
                        selectedSound === sound.id
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <SoundIcon className="w-4 h-4" />
                      {sound.name}
                    </button>
                  );
                })}
              </div>
              
              {selectedSound && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Volume</span>
                    <span>{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    max={100}
                    step={1}
                  />
                </div>
              )}
            </motion.div>

            {/* Breathing Exercise */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-semibold mb-4">Breathing Exercise</h3>
              
              <div className="flex items-center justify-center py-4">
                <motion.div
                  animate={breathingActive ? {
                    scale: [1, 1.5, 1.5, 1],
                    opacity: [0.5, 1, 1, 0.5],
                  } : {}}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    times: [0, 0.4, 0.6, 1],
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-orange-500/30 flex items-center justify-center"
                >
                  <span className="text-sm font-medium">
                    {breathingActive ? "Breathe" : "Ready"}
                  </span>
                </motion.div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setBreathingActive(!breathingActive)}
              >
                {breathingActive ? "Stop" : "Start Breathing"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
