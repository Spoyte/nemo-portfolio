"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Waves, 
  Music, 
  Moon, 
  Sun,
  Timer,
  Heart,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Flower2,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
  scale: number;
}

const breathingPatterns = {
  "4-7-8": [
    { name: "Inhale", duration: 4, instruction: "Breathe in deeply...", scale: 1.5 },
    { name: "Hold", duration: 7, instruction: "Hold your breath...", scale: 1.5 },
    { name: "Exhale", duration: 8, instruction: "Breathe out slowly...", scale: 1 },
  ],
  "Box": [
    { name: "Inhale", duration: 4, instruction: "Breathe in...", scale: 1.5 },
    { name: "Hold", duration: 4, instruction: "Hold...", scale: 1.5 },
    { name: "Exhale", duration: 4, instruction: "Breathe out...", scale: 1 },
    { name: "Hold", duration: 4, instruction: "Hold...", scale: 1 },
  ],
  "Coherent": [
    { name: "Inhale", duration: 5.5, instruction: "Breathe in...", scale: 1.5 },
    { name: "Exhale", duration: 5.5, instruction: "Breathe out...", scale: 1 },
  ],
  "Relaxing": [
    { name: "Inhale", duration: 4, instruction: "Gentle inhale...", scale: 1.3 },
    { name: "Exhale", duration: 6, instruction: "Long exhale...", scale: 1 },
  ],
};

const ambientSounds = [
  { name: "Rain", icon: Waves, color: "from-blue-400 to-cyan-400" },
  { name: "Forest", icon: Leaf, color: "from-green-400 to-emerald-400" },
  { name: "Ocean", icon: Wind, color: "from-cyan-400 to-blue-500" },
  { name: "Zen", icon: Flower2, color: "from-purple-400 to-pink-400" },
];

export function ZenMeditationSanctuary() {
  const [isActive, setIsActive] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<keyof typeof breathingPatterns>("4-7-8");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(breathingPatterns["4-7-8"][0].duration);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedSound, setSelectedSound] = useState<number | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"day" | "night">("night");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pattern = breathingPatterns[currentPattern];
  const phase = pattern[currentPhase];

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  // Breathing timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            setCurrentPhase((prevPhase) => (prevPhase + 1) % pattern.length);
            return pattern[(currentPhase + 1) % pattern.length].duration;
          }
          return prev - 0.1;
        });
      }, 100);

      sessionTimerRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isActive, currentPhase, pattern, currentPattern]);

  // Reset phase when pattern changes
  useEffect(() => {
    setCurrentPhase(0);
    setTimeLeft(pattern[0].duration);
  }, [currentPattern]);

  const handleStart = () => {
    setIsActive(true);
    setTotalSessions((prev) => prev + 1);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setTimeLeft(pattern[0].duration);
    setSessionTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${
      theme === "night" 
        ? "bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950" 
        : "bg-gradient-to-b from-sky-100 via-cyan-50 to-white"
    }`}>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${theme === "night" ? "bg-white/10" : "bg-primary/10"}`}
            style={{
              left: `${particle.x}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: ["100vh", "-10vh"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 20 / particle.speed,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              theme === "night" 
                ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                : "bg-gradient-to-br from-cyan-400 to-blue-500"
            }`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme === "night" ? "text-white" : "text-slate-900"}`}>
                Zen Sanctuary
              </h1>
              <p className={`text-sm ${theme === "night" ? "text-white/60" : "text-slate-600"}`}>
                Find your inner peace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "night" ? "day" : "night")}
              className={theme === "night" ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}
            >
              {theme === "night" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={theme === "night" ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </motion.header>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl ${
            theme === "night" ? "bg-white/5 backdrop-blur-sm" : "bg-white/50 backdrop-blur-sm"
          }`}
        >
          <div className="text-center">
            <p className={`text-2xl font-bold ${theme === "night" ? "text-white" : "text-slate-900"}`}>
              {totalSessions}
            </p>
            <p className={`text-xs ${theme === "night" ? "text-white/60" : "text-slate-500"}`}>Sessions</p>
          </div>
          <div className="text-center border-x border-border/20">
            <p className={`text-2xl font-bold ${theme === "night" ? "text-white" : "text-slate-900"}`}>
              {formatTime(sessionTime)}
            </p>
            <p className={`text-xs ${theme === "night" ? "text-white/60" : "text-slate-500"}`}>Current</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${theme === "night" ? "text-white" : "text-slate-900"}`}>
              {Math.floor(sessionTime / 60 * 5)} cal
            </p>
            <p className={`text-xs ${theme === "night" ? "text-white/60" : "text-slate-500"}`}>Calm Score</p>
          </div>
        </motion.div>

        {/* Main Breathing Circle */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            className="relative"
            animate={{
              scale: isActive ? phase.scale : 1,
            }}
            transition={{
              duration: isActive ? timeLeft : 0.5,
              ease: "easeInOut",
            }}
          >
            {/* Outer Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-full border-2 ${
                  theme === "night" ? "border-white/10" : "border-primary/10"
                }`}
                animate={{
                  scale: [1, 1.2 + i * 0.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ))}

            {/* Main Circle */}
            <div className={`w-64 h-64 rounded-full flex flex-col items-center justify-center relative ${
              theme === "night"
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10"
                : "bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-primary/10"
            }`}>
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke={theme === "night" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                  strokeWidth="4"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="754"
                  animate={{
                    strokeDashoffset: 754 - (754 * (phase.duration - timeLeft)) / phase.duration,
                  }}
                  transition={{ duration: 0.1 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={theme === "night" ? "#a855f7" : "#06b6d4"} />
                    <stop offset="100%" stopColor={theme === "night" ? "#ec4899" : "#3b82f6"} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Phase Info */}
              <motion.div 
                key={phase.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center z-10"
              >
                <h2 className={`text-3xl font-bold mb-2 ${theme === "night" ? "text-white" : "text-slate-900"}`}>
                  {phase.name}
                </h2>
                <p className={`text-lg ${theme === "night" ? "text-white/70" : "text-slate-600"}`}>
                  {phase.instruction}
                </p>
                <p className={`text-4xl font-mono mt-4 ${theme === "night" ? "text-white" : "text-slate-900"}`}>
                  {Math.ceil(timeLeft)}s
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className={`rounded-full w-14 h-14 ${
                theme === "night" 
                  ? "border-white/20 text-white hover:bg-white/10" 
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              onClick={isActive ? handlePause : handleStart}
              className={`rounded-full w-20 h-20 text-lg font-semibold ${
                theme === "night"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              }`}
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full w-14 h-14 ${
                theme === "night" 
                  ? "border-white/20 text-white hover:bg-white/10" 
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>

        {/* Pattern Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className={`text-sm mb-3 text-center ${theme === "night" ? "text-white/60" : "text-slate-500"}`}>
            Breathing Pattern
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.keys(breathingPatterns).map((pattern) => (
              <Button
                key={pattern}
                variant={currentPattern === pattern ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPattern(pattern as keyof typeof breathingPatterns)}
                className={`rounded-full ${
                  currentPattern === pattern
                    ? theme === "night"
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-cyan-500 hover:bg-cyan-600"
                    : theme === "night"
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pattern}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Ambient Sounds */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className={`text-sm mb-3 text-center ${theme === "night" ? "text-white/60" : "text-slate-500"}`}>
            Ambient Sound
          </p>
          <div className="flex justify-center gap-3">
            {ambientSounds.map((sound, index) => (
              <motion.button
                key={sound.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSound(selectedSound === index ? null : index)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  selectedSound === index
                    ? `bg-gradient-to-br ${sound.color} text-white shadow-lg`
                    : theme === "night"
                      ? "bg-white/5 text-white/70 hover:bg-white/10"
                      : "bg-white/50 text-slate-600 hover:bg-white/80"
                }`}
              >
                <sound.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{sound.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-4 left-4 right-4 p-6 rounded-3xl shadow-2xl z-50 ${
                theme === "night" ? "bg-slate-900/95 border border-white/10" : "bg-white/95 border border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${theme === "night" ? "text-white" : "text-slate-900"}`}>
                  Settings
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  Close
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm mb-2 block ${theme === "night" ? "text-white/70" : "text-slate-600"}`}>
                    Volume
                  </label>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
