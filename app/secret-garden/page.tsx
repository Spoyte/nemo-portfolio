"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flower2,
  Leaf,
  Wind,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  Music,
  Volume2,
  VolumeX,
  Heart,
  Star,
  Butterfly,
  Droplets,
  Flame,
  Snowflake,
  Rainbow,
  Zap,
  Ghost,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Mic,
  MessageCircle,
  Send,
  X,
  Settings,
  Palette,
  Type,
  Image as ImageIcon,
  Music2,
  Volume1,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  CloudSnow,
  CloudLightning,
  Wind as WindIcon,
  Thermometer,
  Droplets as DropletsIcon,
  Umbrella,
  Snowflake as SnowflakeIcon,
  Flame as FlameIcon,
  Rainbow as RainbowIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Sparkles as SparklesIcon,
  Ghost as GhostIcon,
  Butterfly as ButterflyIcon,
  Leaf as LeafIcon,
  Flower2 as Flower2Icon,
  Zap as ZapIcon,
  Music as MusicIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  Mic as MicIcon,
  MessageCircle as MessageCircleIcon,
  Send as SendIcon,
  X as XIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Type as TypeIcon,
  ImageIcon as ImageIcon2,
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Particle types for the garden
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: "petal" | "firefly" | "snow" | "rain" | "leaf" | "sparkle";
}

interface GardenState {
  theme: "spring" | "summer" | "autumn" | "winter" | "night" | "rainbow";
  particleCount: number;
  windSpeed: number;
  musicEnabled: boolean;
  ambientSounds: boolean;
}

const themes = {
  spring: {
    name: "Spring Garden",
    bg: "from-pink-100 via-rose-50 to-green-50",
    accent: "text-pink-500",
    particles: "petal",
    icon: Flower2,
    description: "Cherry blossoms and gentle breezes",
  },
  summer: {
    name: "Summer Meadow",
    bg: "from-yellow-100 via-orange-50 to-green-50",
    accent: "text-yellow-500",
    particles: "firefly",
    icon: Sun,
    description: "Warm sunshine and buzzing fireflies",
  },
  autumn: {
    name: "Autumn Forest",
    bg: "from-orange-100 via-amber-50 to-yellow-50",
    accent: "text-orange-500",
    particles: "leaf",
    icon: Leaf,
    description: "Falling leaves and crisp air",
  },
  winter: {
    name: "Winter Wonderland",
    bg: "from-blue-100 via-slate-50 to-white",
    accent: "text-blue-500",
    particles: "snow",
    icon: Snowflake,
    description: "Gentle snowfall and frosty air",
  },
  night: {
    name: "Midnight Garden",
    bg: "from-indigo-950 via-purple-950 to-slate-950",
    accent: "text-indigo-400",
    particles: "sparkle",
    icon: Moon,
    description: "Starlight and magical glows",
  },
  rainbow: {
    name: "Rainbow Valley",
    bg: "from-red-100 via-yellow-100 to-blue-100",
    accent: "text-purple-500",
    particles: "sparkle",
    icon: Rainbow,
    description: "Vibrant colors and joy",
  },
};

// Zen quotes for the garden
const zenQuotes = [
  "Breathe in peace, breathe out worry.",
  "The present moment is the only moment.",
  "Like a garden, the mind must be cultivated.",
  "Peace comes from within. Do not seek it without.",
  "In the midst of movement and chaos, keep stillness inside of you.",
  "Nature does not hurry, yet everything is accomplished.",
  "The quieter you become, the more you can hear.",
  "Every moment is a fresh beginning.",
  "Let go of the thoughts that do not make you strong.",
  "Be like water, my friend.",
];

// Breathing exercise guide
const breathingSteps = [
  { phase: "inhale", duration: 4000, text: "Breathe In" },
  { phase: "hold", duration: 4000, text: "Hold" },
  { phase: "exhale", duration: 4000, text: "Breathe Out" },
  { phase: "hold", duration: 2000, text: "Hold" },
];

export default function SecretGardenPage() {
  const [state, setState] = useState<GardenState>({
    theme: "spring",
    particleCount: 30,
    windSpeed: 1,
    musicEnabled: false,
    ambientSounds: false,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentQuote, setCurrentQuote] = useState(zenQuotes[0]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    const theme = themes[state.theme];

    for (let i = 0; i < state.particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * state.windSpeed,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.3,
        color: getParticleColor(theme.particles as Particle["type"]),
        type: theme.particles as Particle["type"],
      });
    }
    setParticles(newParticles);
  }, [state.theme, state.particleCount, state.windSpeed]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.speedX * state.windSpeed + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
          speedX: p.speedX + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, [state.windSpeed]);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Breathing exercise
  useEffect(() => {
    if (!showBreathing) return;

    const currentStep = breathingSteps[breathingPhase];
    const timer = setTimeout(() => {
      setBreathingPhase((prev) => (prev + 1) % breathingSteps.length);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [showBreathing, breathingPhase]);

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  function getParticleColor(type: Particle["type"]): string {
    switch (type) {
      case "petal":
        return ["#ffb7c5", "#ffc0cb", "#ff69b4", "#ffb6c1"][Math.floor(Math.random() * 4)];
      case "firefly":
        return "#ffff00";
      case "snow":
        return "#ffffff";
      case "rain":
        return "#a0c4ff";
      case "leaf":
        return ["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5"][Math.floor(Math.random() * 4)];
      case "sparkle":
        return ["#ffd700", "#ffec8b", "#fff8dc", "#ffffff"][Math.floor(Math.random() * 4)];
      default:
        return "#ffffff";
    }
  }

  const currentTheme = themes[state.theme];
  const currentStep = breathingSteps[breathingPhase];

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 bg-gradient-to-br ${currentTheme.bg}`}
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Parallax layers */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: particle.type === "firefly" || particle.type === "sparkle"
                ? `0 0 ${particle.size * 2}px ${particle.color}`
                : "none",
            }}
            animate={{
              rotate: [0, 360],
              scale: particle.type === "firefly" ? [1, 1.2, 1] : 1,
            }}
            transition={{
              rotate: { duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Ambient glow orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${currentTheme.accent.replace("text-", "")} 0%, transparent 70%)`,
            left: "10%",
            top: "20%",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${currentTheme.accent.replace("text-", "")} 0%, transparent 70%)`,
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-0 right-0 flex justify-between items-center px-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ${currentTheme.accent}`}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Flower2 className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Secret Garden</h1>
              <p className="text-sm text-muted-foreground">A peaceful retreat</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBreathing(!showBreathing)}
              className={showBreathing ? "bg-white/20" : ""}
            >
              <Wind className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={showSettings ? "bg-white/20" : ""}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </motion.div>

        {/* Central Zen Quote */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            className="mb-8"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <currentTheme.icon className={`w-24 h-24 mx-auto ${currentTheme.accent} opacity-50`} />
          </motion.div>

          <blockquote className="text-2xl md:text-4xl font-light leading-relaxed mb-8">
            "{currentQuote}"
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuote(zenQuotes[Math.floor(Math.random() * zenQuotes.length)])}
              className="bg-white/10 backdrop-blur-sm border-white/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>
        </motion.div>

        {/* Breathing Exercise */}
        <AnimatePresence>
          {showBreathing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowBreathing(false)}
            >
              <motion.div
                className="text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentTheme.bg} mx-auto mb-8 flex items-center justify-center`}
                  animate={{
                    scale: currentStep.phase === "inhale" ? 1.5 : currentStep.phase === "exhale" ? 1 : 1.5,
                    opacity: currentStep.phase === "hold" ? 0.7 : 1,
                  }}
                  transition={{
                    duration: currentStep.duration / 1000,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-2xl font-light">{currentStep.text}</span>
                </motion.div>
                <p className="text-white/80">Click anywhere to stop</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-8 top-24 w-80"
            >
              <Card className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Garden Settings</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Theme Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Season</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(themes).map(([key, theme]) => (
                        <Button
                          key={key}
                          variant={state.theme === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setState({ ...state, theme: key as GardenState["theme"] })}
                          className="justify-start"
                        >
                          <theme.icon className="w-4 h-4 mr-2" />
                          {theme.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Particle Count */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Particle Density</label>
                    <Slider
                      value={[state.particleCount]}
                      onValueChange={([value]) => setState({ ...state, particleCount: value })}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  {/* Wind Speed */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Wind Speed</label>
                    <Slider
                      value={[state.windSpeed]}
                      onValueChange={([value]) => setState({ ...state, windSpeed: value })}
                      min={0}
                      max={5}
                      step={0.5}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Selector (Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            {Object.entries(themes).map(([key, theme]) => (
              <motion.button
                key={key}
                onClick={() => setState({ ...state, theme: key as GardenState["theme"] })}
                className={`p-3 rounded-xl transition-all ${
                  state.theme === key
                    ? "bg-white/30 shadow-lg"
                    : "hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={theme.name}
              >
                <theme.icon className={`w-5 h-5 ${theme.accent}`} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8 text-xs text-muted-foreground"
        >
          <p>{particles.length} particles active</p>
          <p>Wind: {state.windSpeed}x</p>
        </motion.div>
      </div>

      {/* Easter Egg Hint */}
      <div className="absolute bottom-8 left-8 text-[10px] text-muted-foreground/50">
        <p>Try pressing the spacebar for a surprise...</p>
      </div>
    </div>
  );
}
