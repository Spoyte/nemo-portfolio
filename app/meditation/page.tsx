"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Wind, 
  Waves, 
  CloudRain,
  Volume2,
  VolumeX,
  Sparkles,
  Code,
  Coffee,
  Leaf,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty: number;
}

const patterns: BreathingPattern[] = [
  { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
  { name: "Coherent 5-5", inhale: 5, hold: 0, exhale: 5, holdEmpty: 0 },
  { name: "Energizing 2-4", inhale: 2, hold: 0, exhale: 4, holdEmpty: 0 },
];

const ambientSounds = [
  { name: "Gentle Rain", icon: CloudRain, color: "from-blue-400 to-cyan-400" },
  { name: "Ocean Waves", icon: Waves, color: "from-cyan-400 to-teal-400" },
  { name: "Forest Wind", icon: Wind, color: "from-green-400 to-emerald-400" },
  { name: "White Noise", icon: Sparkles, color: "from-purple-400 to-pink-400" },
];

const codeMantras = [
  "Breathe in clarity, breathe out complexity",
  "Every bug is a teacher in disguise",
  "Progress over perfection",
  "The code will wait, your mind needs rest",
  "Small steps lead to big changes",
  "Embrace the learning curve",
  "Rest is part of the process",
  "Your best code comes from a calm mind",
];

export default function MeditationPage() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdEmpty">("inhale");
  const [progress, setProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedSound, setSelectedSound] = useState<number | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentMantra, setCurrentMantra] = useState(0);
  const [showMantra, setShowMantra] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const pattern = patterns[selectedPattern];

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("meditation-stats");
    if (saved) {
      const stats = JSON.parse(saved);
      setTotalSessions(stats.sessions || 0);
      setTotalMinutes(stats.minutes || 0);
    }
  }, []);

  // Save stats
  const saveStats = useCallback((sessions: number, minutes: number) => {
    localStorage.setItem("meditation-stats", JSON.stringify({ sessions, minutes }));
  }, []);

  // Breathing cycle
  useEffect(() => {
    if (!isActive) return;

    let interval: NodeJS.Timeout;
    const cyclePhase = () => {
      switch (phase) {
        case "inhale":
          interval = setTimeout(() => {
            if (pattern.hold > 0) setPhase("hold");
            else setPhase("exhale");
          }, pattern.inhale * 1000);
          break;
        case "hold":
          interval = setTimeout(() => setPhase("exhale"), pattern.hold * 1000);
          break;
        case "exhale":
          interval = setTimeout(() => {
            if (pattern.holdEmpty > 0) setPhase("holdEmpty");
            else setPhase("inhale");
          }, pattern.exhale * 1000);
          break;
        case "holdEmpty":
          interval = setTimeout(() => setPhase("inhale"), pattern.holdEmpty * 1000);
          break;
      }
    };

    cyclePhase();
    return () => clearTimeout(interval);
  }, [isActive, phase, pattern]);

  // Progress animation
  useEffect(() => {
    if (!isActive) return;

    const duration = {
      inhale: pattern.inhale,
      hold: pattern.hold,
      exhale: pattern.exhale,
      holdEmpty: pattern.holdEmpty,
    }[phase];

    if (duration === 0) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isActive, phase, pattern]);

  // Session timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Rotate mantras
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setShowMantra(false);
      setTimeout(() => {
        setCurrentMantra((prev) => (prev + 1) % codeMantras.length);
        setShowMantra(true);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    if (!isActive && sessionTime === 0) {
      setTotalSessions((prev) => {
        const newSessions = prev + 1;
        saveStats(newSessions, totalMinutes);
        return newSessions;
      });
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setProgress(0);
    setSessionTime(0);
    
    // Save session minutes
    const minutes = Math.ceil(sessionTime / 60);
    if (minutes > 0) {
      setTotalMinutes((prev) => {
        const newMinutes = prev + minutes;
        saveStats(totalSessions, newMinutes);
        return newMinutes;
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseDuration = () => {
    switch (phase) {
      case "inhale": return pattern.inhale;
      case "hold": return pattern.hold;
      case "exhale": return pattern.exhale;
      case "holdEmpty": return pattern.holdEmpty;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "holdEmpty": return "Pause";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "from-blue-400 to-cyan-400";
      case "hold": return "from-yellow-400 to-orange-400";
      case "exhale": return "from-purple-400 to-pink-400";
      case "holdEmpty": return "from-gray-400 to-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 0.8 : 1,
            opacity: phase === "hold" ? 0.6 : 0.3,
          }}
          transition={{ duration: getPhaseDuration(), ease: "easeInOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r ${getPhaseColor()} blur-3xl`}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Code Meditation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Find Your Flow
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Take a moment to breathe, reset, and return to your code with clarity and focus.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-8 mb-12"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{totalSessions}</p>
            <p className="text-sm text-white/50">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{totalMinutes}</p>
            <p className="text-sm text-white/50">Minutes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{formatTime(sessionTime)}</p>
            <p className="text-sm text-white/50">Current</p>
          </div>
        </motion.div>

        {/* Main Breathing Circle */}
        <div className="flex-1 flex items-center justify-center mb-12">
          <div className="relative">
            {/* Outer Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-full border-2 border-white/10`}
                animate={{
                  scale: isActive ? [1, 1.2 + i * 0.1, 1] : 1,
                  opacity: isActive ? [0.3, 0.1, 0.3] : 0.1,
                }}
                transition={{
                  duration: getPhaseDuration() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Main Circle */}
            <motion.div
              className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center cursor-pointer`}
              animate={{
                scale: phase === "inhale" ? 1.1 : phase === "exhale" ? 0.9 : 1,
              }}
              transition={{ duration: getPhaseDuration(), ease: "easeInOut" }}
              onClick={handleStart}
            >
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 3.02} 302`}
                  className="transition-all duration-100"
                />
              </svg>

              {/* Center Content */}
              <div className="text-center z-10">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                >
                  {getPhaseText()}
                </motion.div>
                <p className="text-white/80 text-lg">
                  {Math.ceil((getPhaseDuration() * (100 - progress)) / 100)}s
                </p>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <AnimatePresence>
              {isActive && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-4 -right-4"
                  >
                    <Code className="w-6 h-6 text-white/40" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -bottom-4 -left-4"
                  >
                    <Coffee className="w-6 h-6 text-white/40" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mantra */}
        <AnimatePresence mode="wait">
          {showMantra && (
            <motion.div
              key={currentMantra}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <p className="text-xl md:text-2xl text-white/70 italic max-w-2xl mx-auto">
                &ldquo;{codeMantras[currentMantra]}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto w-full space-y-8"
        >
          {/* Play Controls */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={handleStart}
              className={`rounded-full px-8 ${
                isActive 
                  ? "bg-white/20 hover:bg-white/30" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              }`}
            >
              {isActive ? (
                <><Pause className="w-5 h-5 mr-2" /> Pause</>
              ) : (
                <><Play className="w-5 h-5 mr-2" /> Start Session</>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="rounded-full border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Reset
            </Button>
          </div>

          {/* Pattern Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {patterns.map((p, i) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPattern(i);
                  setPhase("inhale");
                  setProgress(0);
                }}
                className={`p-3 rounded-xl border transition-all text-sm ${
                  selectedPattern === i
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-xs opacity-60 mt-1">
                  {p.inhale}-{p.hold > 0 ? p.hold + "-" : ""}{p.exhale}
                  {p.holdEmpty > 0 ? "-" + p.holdEmpty : ""}
                </p>
              </button>
            ))}
          </div>

          {/* Ambient Sounds */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">Ambient Sound</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(v) => {
                    setVolume(v[0]);
                    setIsMuted(v[0] === 0);
                  }}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ambientSounds.map((sound, i) => (
                <button
                  key={sound.name}
                  onClick={() => setSelectedSound(selectedSound === i ? null : i)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    selectedSound === i
                      ? `border-white/40 bg-gradient-to-br ${sound.color} text-white`
                      : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  <sound.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{sound.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/40 text-sm"
        >
          <p className="flex items-center justify-center gap-2">
            <Timer className="w-4 h-4" />
            Tip: Even 5 minutes of mindful breathing can significantly improve focus and reduce stress
          </p>
        </motion.div>
      </div>
    </div>
  );
}
