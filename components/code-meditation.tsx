"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Heart, 
  Zap, 
  Coffee,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  color: string;
}

const breathingPatterns: BreathingPattern[] = [
  { 
    name: "4-7-8 Relaxation", 
    description: "Calm your nervous system",
    inhale: 4, 
    hold: 7, 
    exhale: 8, 
    rest: 0,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    name: "Box Breathing", 
    description: "Focus and clarity",
    inhale: 4, 
    hold: 4, 
    exhale: 4, 
    rest: 4,
    color: "from-purple-500 to-pink-500"
  },
  { 
    name: "Coherent Breathing", 
    description: "Balance and harmony",
    inhale: 5, 
    hold: 0, 
    exhale: 5, 
    rest: 0,
    color: "from-green-500 to-emerald-500"
  },
  { 
    name: "Energizing", 
    description: "Quick energy boost",
    inhale: 2, 
    hold: 0, 
    exhale: 2, 
    rest: 0,
    color: "from-orange-500 to-yellow-500"
  },
];

const ambientSounds = [
  { name: "Silence", icon: VolumeX },
  { name: "Rain", icon: Wind },
  { name: "Ocean", icon: Zap },
  { name: "Forest", icon: Coffee },
  { name: "White Noise", icon: Music },
];

export function CodeMeditation() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [progress, setProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedSound, setSelectedSound] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showQuote, setShowQuote] = useState(true);
  
  const pattern = breathingPatterns[selectedPattern];
  const phaseDuration = {
    inhale: pattern.inhale,
    hold: pattern.hold,
    exhale: pattern.exhale,
    rest: pattern.rest,
  };

  // Breathing cycle
  useEffect(() => {
    if (!isActive) return;

    const duration = phaseDuration[phase] * 1000;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        // Move to next phase
        const phases: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];
        const currentIndex = phases.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phases.length;
        
        // Skip phases with 0 duration
        let nextPhase = phases[nextIndex];
        let checkIndex = nextIndex;
        while (phaseDuration[nextPhase] === 0 && checkIndex !== currentIndex) {
          checkIndex = (checkIndex + 1) % phases.length;
          nextPhase = phases[checkIndex];
        }
        
        setPhase(nextPhase);
        setProgress(0);
        
        if (nextPhase === "inhale") {
          setTotalBreaths(prev => prev + 1);
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isActive, phase, pattern]);

  // Session timer
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "rest": return "Rest";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale": return "Fill your lungs completely";
      case "hold": return "Keep the breath gentle";
      case "exhale": return "Release slowly and fully";
      case "rest": return "Prepare for next breath";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale": return 1 + (progress / 100) * 0.5;
      case "hold": return 1.5;
      case "exhale": return 1.5 - (progress / 100) * 0.5;
      case "rest": return 1;
    }
  };

  const getCircleOpacity = () => {
    switch (phase) {
      case "inhale": return 0.3 + (progress / 100) * 0.4;
      case "hold": return 0.7;
      case "exhale": return 0.7 - (progress / 100) * 0.4;
      case "rest": return 0.3;
    }
  };

  const quotes = [
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "Any fool can write code that a computer can understand.",
    "Simplicity is the soul of efficiency.",
    "Make it work, make it right, make it fast.",
    "The best code is no code at all.",
    "Clear is better than clever.",
    "Debugging is twice as hard as writing the code.",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/80">Code Meditation</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Breathe &amp; Focus</h1>
          <p className="text-white/60">A moment of calm for developers</p>
        </motion.div>

        {/* Breathing Circle */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          {/* Outer rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute inset-0 rounded-full border-2 border-gradient-to-r ${pattern.color} opacity-20`}
              animate={{
                scale: isActive ? [1, 1.1 + i * 0.1, 1] : 1,
                rotate: isActive ? [0, 360] : 0,
              }}
              transition={{
                scale: {
                  duration: pattern.inhale + pattern.exhale,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 20 + i * 10,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{
                borderColor: "transparent",
                borderImage: `linear-gradient(135deg, ${pattern.color.includes("blue") ? "#3b82f6" : pattern.color.includes("purple") ? "#a855f7" : pattern.color.includes("green") ? "#22c55e" : "#f97316"}, transparent) 1`,
              }}
            />
          ))}

          {/* Main breathing circle */}
          <motion.div
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${pattern.color} flex items-center justify-center`}
            animate={{
              scale: getCircleScale(),
              opacity: getCircleOpacity(),
            }}
            transition={{
              duration: phaseDuration[phase],
              ease: phase === "inhale" ? "easeInOut" : phase === "exhale" ? "easeInOut" : "linear",
            }}
          >
            <motion.div
              className="text-center"
              animate={{ opacity: isActive ? 1 : 0.5 }}
            >
              <motion.p 
                className="text-2xl font-bold text-white mb-1"
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getPhaseText()}
              </motion.p>
              <p className="text-sm text-white/80">{getPhaseInstruction()}</p>
            </motion.div>
          </motion.div>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 150}`}
              strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          {showQuote && (
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8 px-8"
            >
              <p className="text-white/60 italic text-sm">"{quotes[currentQuote]}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white">{formatTime(sessionTime)}</p>
            <p className="text-xs text-white/50">Session Time</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white">{totalBreaths}</p>
            <p className="text-xs text-white/50">Breaths</p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsActive(false);
              setPhase("inhale");
              setProgress(0);
              setSessionTime(0);
              setTotalBreaths(0);
            }}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          
          <Button
            size="lg"
            onClick={() => setIsActive(!isActive)}
            className={`px-8 ${
              isActive 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            }`}
          >
            {isActive ? (
              <><Pause className="w-5 h-5 mr-2" /> Pause</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Start</>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className={`border-white/20 text-white hover:bg-white/10 ${showSettings ? "bg-white/10" : ""}`}
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              {/* Pattern Selection */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-3 block">Breathing Pattern</label>
                <div className="grid grid-cols-2 gap-2">
                  {breathingPatterns.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setSelectedPattern(i);
                        setIsActive(false);
                        setPhase("inhale");
                        setProgress(0);
                      }}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedPattern === i
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/50">{p.description}</p>
                      <div className="flex gap-1 mt-2">
                        {p.inhale > 0 && <Badge variant="secondary" className="text-[10px]">{`In ${p.inhale}s`}</Badge>}
                        {p.hold > 0 && <Badge variant="secondary" className="text-[10px]">{`Hold ${p.hold}s`}</Badge>}
                        {p.exhale > 0 && <Badge variant="secondary" className="text-[10px]">{`Out ${p.exhale}s`}</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Selection */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-3 block">Ambient Sound</label>
                <div className="flex gap-2">
                  {ambientSounds.map((sound, i) => (
                    <button
                      key={sound.name}
                      onClick={() => setSelectedSound(i)}
                      className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        selectedSound === i
                          ? "bg-white/20 border border-white/30"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <sound.icon className="w-5 h-5 text-white/80" />
                      <span className="text-xs text-white/60">{sound.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                  {selectedSound === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  Volume
                </label>
                <Slider
                  value={[volume]}
                  onValueChange={([v]) => setVolume(v)}
                  max={100}
                  step={1}
                  disabled={selectedSound === 0}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-white/40">
            Take a moment to breathe. Your code can wait.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
