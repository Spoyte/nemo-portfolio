"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wind,
  Music,
  Moon,
  Sun,
  Flower2,
  Waves,
  Pause,
  Play,
  RotateCcw,
  Heart,
  Leaf,
  Cloud,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  type: "petal" | "firefly" | "snow" | "leaf";
  rotation: number;
  rotationSpeed: number;
}

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
  color: string;
}

const breathingPhases: BreathingPhase[] = [
  { name: "Inhale", duration: 4000, instruction: "Breathe in slowly...", color: "#22d3ee" },
  { name: "Hold", duration: 4000, instruction: "Hold your breath...", color: "#a78bfa" },
  { name: "Exhale", duration: 4000, instruction: "Breathe out gently...", color: "#f472b6" },
  { name: "Pause", duration: 2000, instruction: "Rest and relax...", color: "#34d399" },
];

const ambientSounds = [
  { name: "Gentle Rain", icon: Droplets, color: "from-blue-400 to-cyan-400" },
  { name: "Forest Wind", icon: Wind, color: "from-green-400 to-emerald-400" },
  { name: "Ocean Waves", icon: Waves, color: "from-teal-400 to-blue-400" },
  { name: "Birdsong", icon: Cloud, color: "from-amber-400 to-orange-400" },
];

const mantras = [
  "Code with intention, debug with patience",
  "Every bug is a teacher in disguise",
  "Progress over perfection",
  "Rest is part of the process",
  "Small steps lead to big changes",
  "Your best code is yet to come",
  "Breathe. You're doing great.",
  "Creativity flows when the mind is still",
  "Errors are just opportunities to learn",
  "Take breaks. Your brain will thank you.",
];

export function CodeMeditationGarden() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedSound, setSelectedSound] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(50);
  const [showMantra, setShowMantra] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(mantras[0]);
  const [gardenTheme, setGardenTheme] = useState<"zen" | "night" | "sunset">("zen");
  const [breathScale, setBreathScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseTimerRef = useRef<NodeJS.Timeout>();

  // Generate particles
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const count = Math.floor(intensity / 5);
    
    for (let i = 0; i < count; i++) {
      const types: Particle["type"][] = gardenTheme === "night" 
        ? ["firefly", "snow"] 
        : gardenTheme === "sunset" 
          ? ["petal", "leaf"] 
          : ["petal", "firefly", "leaf"];
      
      newParticles.push({
        id: Math.random(),
        x: Math.random() * (canvasRef.current?.width || 800),
        y: Math.random() * (canvasRef.current?.height || 600),
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.5 + 0.2,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }
    setParticles(newParticles);
  }, [intensity, gardenTheme]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;

        switch (particle.type) {
          case "petal":
            ctx.fillStyle = gardenTheme === "sunset" ? "#fbbf24" : "#f472b6";
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size, particle.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "firefly":
            ctx.fillStyle = "#fde047";
            ctx.shadowColor = "#fde047";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "snow":
            ctx.fillStyle = "#e0f2fe";
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "leaf":
            ctx.fillStyle = gardenTheme === "sunset" ? "#fb923c" : "#86efac";
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size, particle.size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();

        // Update particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Wrap around
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, gardenTheme]);

  // Breathing cycle
  useEffect(() => {
    if (!isPlaying) return;

    const runPhase = () => {
      const phase = breathingPhases[currentPhase];
      
      // Animate breath scale
      if (phase.name === "Inhale") {
        setBreathScale(1.5);
      } else if (phase.name === "Exhale") {
        setBreathScale(1);
      }

      // Show mantra on certain phases
      if (phase.name === "Hold" && Math.random() > 0.5) {
        setCurrentMantra(mantras[Math.floor(Math.random() * mantras.length)]);
        setShowMantra(true);
        setTimeout(() => setShowMantra(false), 3000);
      }

      phaseTimerRef.current = setTimeout(() => {
        setCurrentPhase((prev) => (prev + 1) % breathingPhases.length);
      }, phase.duration);
    };

    runPhase();

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [isPlaying, currentPhase]);

  // Generate particles when intensity changes
  useEffect(() => {
    generateParticles();
  }, [generateParticles]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentPhase(0);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setBreathScale(1);
    setShowMantra(false);
  };

  const themeStyles = {
    zen: "from-emerald-950 via-teal-950 to-cyan-950",
    night: "from-slate-950 via-purple-950 to-indigo-950",
    sunset: "from-orange-950 via-rose-950 to-pink-950",
  };

  return (
    <section className="py-24 border-y border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-500 mb-6">
            <Flower2 className="h-4 w-4" />
            <span className="text-sm font-medium">Mindful Coding</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Meditation{" "}
            <span className="text-gradient-animated">Garden</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a moment to breathe, reflect, and find peace. A space for developers to recharge and reset.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meditation Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${themeStyles[gardenTheme]} min-h-[500px]`}>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Breathing Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: breathScale }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center">
                        {isPlaying ? (
                          <motion.div
                            key={breathingPhases[currentPhase].name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center"
                          >
                            <p className="text-white/60 text-sm mb-1">
                              {breathingPhases[currentPhase].instruction}
                            </p>
                            <p className="text-white text-2xl font-light">
                              {breathingPhases[currentPhase].name}
                            </p>
                          </motion.div>
                        ) : (
                          <Button
                            onClick={togglePlay}
                            size="lg"
                            className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
                          >
                            <Play className="h-6 w-6 mr-2" />
                            Begin
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mantra Overlay */}
              <AnimatePresence>
                {showMantra && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10"
                  >
                    <div className="text-center px-8">
                      <Sparkles className="h-8 w-8 text-yellow-300 mx-auto mb-4" />
                      <p className="text-white text-xl md:text-2xl font-light italic max-w-md">
                        &ldquo;{currentMantra}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={togglePlay}
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button
                    onClick={reset}
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setGardenTheme("zen")}
                    variant="ghost"
                    size="icon"
                    className={`${gardenTheme === "zen" ? "bg-white/20" : ""} text-white/70 hover:text-white`}
                  >
                    <Leaf className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => setGardenTheme("night")}
                    variant="ghost"
                    size="icon"
                    className={`${gardenTheme === "night" ? "bg-white/20" : ""} text-white/70 hover:text-white`}
                  >
                    <Moon className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => setGardenTheme("sunset")}
                    variant="ghost"
                    size="icon"
                    className={`${gardenTheme === "sunset" ? "bg-white/20" : ""} text-white/70 hover:text-white`}
                  >
                    <Sun className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Intensity Control */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Particle Density
              </h3>
              <Slider
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
                min={10}
                max={100}
                step={10}
              />
              <p className="text-sm text-muted-foreground mt-2">{intensity}% intensity</p>
            </div>

            {/* Ambient Sounds */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                Ambient Sound
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ambientSounds.map((sound, index) => (
                  <button
                    key={sound.name}
                    onClick={() => setSelectedSound(selectedSound === index ? null : index)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedSound === index
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <sound.icon className={`h-5 w-5 mx-auto mb-2 ${selectedSound === index ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs">{sound.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Session Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Breaths Completed</span>
                  <span className="font-medium">{Math.floor(currentPhase / 4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Phase</span>
                  <Badge variant="outline" className="text-xs">
                    {isPlaying ? breathingPhases[currentPhase].name : "Ready"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Garden Theme</span>
                  <span className="font-medium capitalize">{gardenTheme}</span>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="p-4 rounded-xl bg-muted text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Tip:</strong> Practice this breathing exercise 
                between coding sessions to reduce stress and improve focus.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
