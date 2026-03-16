"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Wind,
  Waves,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Timer,
  Heart,
  Zap,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Gentle Rain", icon: CloudRain },
  { id: "ocean", name: "Ocean Waves", icon: Waves },
  { id: "forest", name: "Forest", icon: Leaf },
  { id: "cafe", name: "Coffee Shop", icon: Coffee },
  { id: "white", name: "White Noise", icon: Wind },
];

import { CloudRain, Coffee } from "lucide-react";

const BREATHING_PATTERNS = [
  { name: "4-7-8 Relax", inhale: 4, hold: 7, exhale: 8, description: "Calming for sleep" },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, hold2: 4, description: "Focus & clarity" },
  { name: "Energizing", inhale: 6, hold: 0, exhale: 2, description: "Quick energy boost" },
];

export function CodeMeditation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
  const [breathProgress, setBreathProgress] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(50);
  const [activeTab, setActiveTab] = useState("breathe");
  const [meditationTime, setMeditationTime] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [totalSessions, setTotalSessions] = useState(12);
  const [totalMinutes, setTotalMinutes] = useState(145);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: ["#dc2626", "#ea580c", "#d97706", "#65a30d", "#0891b2"][Math.floor(Math.random() * 5)],
      });
    }
    setParticles(newParticles);
  }, []);

  // Draw meditation canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear with fade effect
    ctx.fillStyle = "rgba(12, 10, 9, 0.1)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw breathing circle
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const baseRadius = 80;
    
    let breathRadius = baseRadius;
    const pattern = BREATHING_PATTERNS[selectedPattern];
    
    if (breathPhase === "inhale") {
      breathRadius = baseRadius + (baseRadius * 0.5) * breathProgress;
    } else if (breathPhase === "hold" || breathPhase === "hold2") {
      breathRadius = baseRadius * 1.5;
    } else if (breathPhase === "exhale") {
      breathRadius = baseRadius * 1.5 - (baseRadius * 0.5) * breathProgress;
    }

    // Outer glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, breathRadius * 2);
    gradient.addColorStop(0, `rgba(220, 38, 38, ${0.3 + breathProgress * 0.2})`);
    gradient.addColorStop(0.5, `rgba(220, 38, 38, ${0.1 + breathProgress * 0.1})`);
    gradient.addColorStop(1, "rgba(220, 38, 38, 0)");
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Main circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(220, 38, 38, ${0.5 + breathProgress * 0.5})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathRadius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 38, 38, ${0.1 + breathProgress * 0.2})`;
    ctx.fill();

    // Draw particles
    particles.forEach((particle) => {
      const x = (particle.x / 100) * rect.width;
      const y = (particle.y / 100) * rect.height;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw text
    ctx.font = "600 24px system-ui";
    ctx.fillStyle = "rgba(250, 250, 249, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const phaseText = {
      inhale: "Breathe In",
      hold: "Hold",
      exhale: "Breathe Out",
      hold2: "Hold",
    };
    
    ctx.fillText(phaseText[breathPhase], centerX, centerY - 20);
    
    ctx.font = "400 16px system-ui";
    ctx.fillStyle = "rgba(250, 250, 249, 0.6)";
    ctx.fillText(`${Math.ceil(breathProgress * 100)}%`, centerX, centerY + 10);
  }, [particles, breathPhase, breathProgress, selectedPattern]);

  // Breathing animation
  useEffect(() => {
    if (!isPlaying) return;

    const pattern = BREATHING_PATTERNS[selectedPattern];
    let startTime = Date.now();
    let currentPhase: "inhale" | "hold" | "exhale" | "hold2" = "inhale";

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (currentPhase === "inhale") {
        const progress = Math.min(elapsed / pattern.inhale, 1);
        setBreathPhase("inhale");
        setBreathProgress(progress);
        
        if (progress >= 1) {
          startTime = Date.now();
          currentPhase = pattern.hold > 0 ? "hold" : "exhale";
        }
      } else if (currentPhase === "hold") {
        const progress = Math.min(elapsed / pattern.hold, 1);
        setBreathPhase("hold");
        setBreathProgress(1 - progress * 0.1);
        
        if (progress >= 1) {
          startTime = Date.now();
          currentPhase = "exhale";
        }
      } else if (currentPhase === "exhale") {
        const progress = Math.min(elapsed / pattern.exhale, 1);
        setBreathPhase("exhale");
        setBreathProgress(1 - progress);
        
        if (progress >= 1) {
          startTime = Date.now();
          currentPhase = pattern.hold2 ? "hold2" : "inhale";
        }
      } else if (currentPhase === "hold2") {
        const progress = Math.min(elapsed / (pattern.hold2 || 1), 1);
        setBreathPhase("hold2");
        setBreathProgress(0.1 + progress * 0.1);
        
        if (progress >= 1) {
          startTime = Date.now();
          currentPhase = "inhale";
        }
      }
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [isPlaying, selectedPattern]);

  // Meditation timer
  useEffect(() => {
    if (!isMeditating) return;

    const interval = setInterval(() => {
      setMeditationTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMeditating]);

  // Canvas animation loop
  useEffect(() => {
    const animate = () => {
      draw();
      
      // Update particles
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100,
        alpha: p.alpha + (Math.random() - 0.5) * 0.02,
      })));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Initialize
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Mindfulness</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code{" "}
            <span className="text-gradient-animated">Meditation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a break from coding. Practice breathing exercises, listen to ambient sounds, 
            and find your zen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Canvas */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="breathe" className="gap-2">
                      <Wind className="h-4 w-4" />
                      Breathe
                    </TabsTrigger>
                    <TabsTrigger value="meditate" className="gap-2">
                      <Timer className="h-4 w-4" />
                      Meditate
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <TabsContent value="breathe" className="m-0">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[400px] md:h-[500px] bg-background"
                  />
                </TabsContent>

                <TabsContent value="meditate" className="m-0">
                  <div className="w-full h-[400px] md:h-[500px] bg-background flex flex-col items-center justify-center p-8">
                    <motion.div
                      animate={{
                        scale: isMeditating ? [1, 1.05, 1] : 1,
                        opacity: isMeditating ? [0.8, 1, 0.8] : 0.6,
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center mb-8"
                    >
                      <div className="text-5xl font-bold text-gradient">
                        {formatTime(meditationTime)}
                      </div>
                    </motion.div>

                    <div className="flex gap-4">
                      <Button
                        size="lg"
                        onClick={() => {
                          setIsMeditating(!isMeditating);
                          if (isMeditating) {
                            setTotalSessions(s => s + 1);
                            setTotalMinutes(m => m + Math.floor(meditationTime / 60));
                          }
                        }}
                      >
                        {isMeditating ? (
                          <><Pause className="h-4 w-4 mr-2" /> Pause</>
                        ) : (
                          <><Play className="h-4 w-4 mr-2" /> {meditationTime > 0 ? "Resume" : "Start"}</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setIsMeditating(false);
                          setMeditationTime(0);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                      </Button>
                    </div>

                    <p className="text-muted-foreground mt-6 text-center max-w-md">
                      {isMeditating 
                        ? "Focus on your breath. Let thoughts come and go like clouds in the sky." 
                        : "Start a meditation session to clear your mind and recharge."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Breathing Controls */}
            {activeTab === "breathe" && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wind className="h-4 w-4" />
                      Breathing Pattern
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={isPlaying ? "default" : "outline"}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex-1"
                      >
                        {isPlaying ? (
                          <><Pause className="h-4 w-4 mr-2" /> Pause</>
                        ) : (
                          <><Play className="h-4 w-4 mr-2" /> Start</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsPlaying(false);
                          setBreathPhase("inhale");
                          setBreathProgress(0);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {BREATHING_PATTERNS.map((pattern, index) => (
                        <button
                          key={pattern.name}
                          onClick={() => {
                            setSelectedPattern(index);
                            setBreathPhase("inhale");
                            setBreathProgress(0);
                          }}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedPattern === index
                              ? "bg-primary/10 border border-primary/30"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <div className="font-medium">{pattern.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {pattern.inhale}-{pattern.hold || 0}-{pattern.exhale}
                            {pattern.hold2 ? `-${pattern.hold2}` : ""} • {pattern.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sound Settings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Ambient Sound
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Sounds</span>
                      <Switch
                        checked={soundEnabled}
                        onCheckedChange={setSoundEnabled}
                      />
                    </div>

                    {soundEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-sm">Volume: {volume}%</label>
                          <Slider
                            value={[volume]}
                            onValueChange={([v]) => setVolume(v)}
                            min={0}
                            max={100}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {AMBIENT_SOUNDS.map((sound) => (
                            <Button
                              key={sound.id}
                              variant="outline"
                              size="sm"
                              className="justify-start gap-2"
                            >
                              <sound.icon className="h-4 w-4" />
                              {sound.name}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-gradient">{totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-gradient">{totalMinutes}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Daily streak: 5 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
