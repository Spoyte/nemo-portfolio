"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Play, Pause, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Orb {
  x: number;
  y: number;
  baseRadius: number;
  currentRadius: number;
  phase: number;
  speed: number;
  hue: number;
  saturation: number;
  lightness: number;
  pulseDepth: number;
  particles: Particle[];
}

interface Particle {
  angle: number;
  distance: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function CelestialBreathing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
  const timeRef = useRef(0);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [breathSpeed, setBreathSpeed] = useState(0.5);
  const [orbCount, setOrbCount] = useState(5);
  const [showParticles, setShowParticles] = useState(true);

  const initOrbs = useCallback((width: number, height: number) => {
    const orbs: Orb[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < orbCount; i++) {
      const angle = (i / orbCount) * Math.PI * 2;
      const distance = 80 + i * 40;
      
      const orb: Orb = {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        baseRadius: 30 + i * 15,
        currentRadius: 30 + i * 15,
        phase: (i / orbCount) * Math.PI * 2,
        speed: 0.3 + i * 0.1,
        hue: 200 + i * 30,
        saturation: 60 + i * 5,
        lightness: 50 + i * 3,
        pulseDepth: 0.3 + i * 0.05,
        particles: []
      };
      
      // Add orbiting particles
      for (let p = 0; p < 8; p++) {
        orb.particles.push({
          angle: (p / 8) * Math.PI * 2,
          distance: orb.baseRadius * (1.2 + Math.random() * 0.5),
          size: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.4,
          speed: 0.02 + Math.random() * 0.03
        });
      }
      
      orbs.push(orb);
    }
    
    orbsRef.current = orbs;
  }, [orbCount]);

  const drawOrb = (
    ctx: CanvasRenderingContext2D,
    orb: Orb,
    time: number,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate breathing pulse
    const breathCycle = Math.sin(time * breathSpeed + orb.phase);
    const pulseFactor = 1 + breathCycle * orb.pulseDepth;
    orb.currentRadius = orb.baseRadius * pulseFactor;
    
    // Gentle orbital drift
    const driftX = Math.sin(time * 0.2 + orb.phase) * 20;
    const driftY = Math.cos(time * 0.15 + orb.phase) * 15;
    const x = orb.x + driftX;
    const y = orb.y + driftY;
    
    // Dynamic color shift
    const hueShift = Math.sin(time * 0.1 + orb.phase) * 20;
    const currentHue = (orb.hue + hueShift) % 360;
    
    // Draw outer glow
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, orb.currentRadius * 2.5
    );
    gradient.addColorStop(0, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness}%, 0.4)`);
    gradient.addColorStop(0.5, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness}%, 0.1)`);
    gradient.addColorStop(1, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness}%, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, orb.currentRadius * 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core
    const coreGradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, orb.currentRadius
    );
    coreGradient.addColorStop(0, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness + 20}%, 0.9)`);
    coreGradient.addColorStop(0.6, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness}%, 0.6)`);
    coreGradient.addColorStop(1, `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness - 10}%, 0)`);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, y, orb.currentRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw orbiting particles
    if (showParticles) {
      orb.particles.forEach(particle => {
        particle.angle += particle.speed * (1 + breathCycle * 0.5);
        const px = x + Math.cos(particle.angle) * particle.distance * pulseFactor;
        const py = y + Math.sin(particle.angle) * particle.distance * pulseFactor;
        
        ctx.fillStyle = `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness + 30}%, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Draw connections to center (subtle)
    ctx.strokeStyle = `hsla(${currentHue}, ${orb.saturation}%, ${orb.lightness}%, 0.05)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Fade effect for trails
    ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
    ctx.fillRect(0, 0, width, height);
    
    timeRef.current += 0.016;
    const time = timeRef.current;
    
    // Draw center glow
    const centerGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, 100
    );
    centerGradient.addColorStop(0, "rgba(100, 150, 200, 0.1)");
    centerGradient.addColorStop(1, "rgba(100, 150, 200, 0)");
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw each orb
    orbsRef.current.forEach(orb => {
      drawOrb(ctx, orb, time, width, height);
    });
    
    // Draw subtle connecting lines between orbs
    ctx.strokeStyle = "rgba(100, 150, 200, 0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < orbsRef.current.length; i++) {
      for (let j = i + 1; j < orbsRef.current.length; j++) {
        const orb1 = orbsRef.current[i];
        const orb2 = orbsRef.current[j];
        const drift1X = Math.sin(time * 0.2 + orb1.phase) * 20;
        const drift1Y = Math.cos(time * 0.15 + orb1.phase) * 15;
        const drift2X = Math.sin(time * 0.2 + orb2.phase) * 20;
        const drift2Y = Math.cos(time * 0.15 + orb2.phase) * 15;
        
        ctx.beginPath();
        ctx.moveTo(orb1.x + drift1X, orb1.y + drift1Y);
        ctx.lineTo(orb2.x + drift2X, orb2.y + drift2Y);
        ctx.stroke();
      }
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, breathSpeed, showParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const size = Math.min(container.clientWidth, container.clientHeight, 800);
      canvas.width = size;
      canvas.height = size;
      
      initOrbs(size, size);
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [initOrbs]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isPlaying]);

  const handleRegenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    initOrbs(canvas.width, canvas.height);
    timeRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#1a1a2e] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300 mb-2">
          Celestial Breathing
        </h1>
        <p className="text-cyan-400/60 text-sm tracking-widest uppercase">
          Ambient · Meditative · Cosmic
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-2xl shadow-cyan-900/20"
          style={{
            background: "radial-gradient(circle at center, #0d1117 0%, #0a0a0f 100%)"
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-slate-900/50 border-cyan-500/30 hover:bg-cyan-950/30 hover:border-cyan-400/50"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-cyan-300" />
          ) : (
            <Play className="w-4 h-4 text-cyan-300" />
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleRegenerate}
          className="bg-slate-900/50 border-cyan-500/30 hover:bg-cyan-950/30 hover:border-cyan-400/50 text-cyan-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowParticles(!showParticles)}
          className={`bg-slate-900/50 border-cyan-500/30 hover:bg-cyan-950/30 hover:border-cyan-400/50 ${
            showParticles ? "text-cyan-300" : "text-cyan-300/50"
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Particles
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-6 w-full max-w-md space-y-4"
      >
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-cyan-400/60">
            <span>Breath Speed</span>
            <span>{breathSpeed.toFixed(1)}x</span>
          </div>
          <Slider
            value={[breathSpeed]}
            onValueChange={([v]) => setBreathSpeed(v)}
            min={0.1}
            max={2}
            step={0.1}
            className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-300 [&_.bg-primary]:bg-cyan-500/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-cyan-400/60">
            <span>Orb Count</span>
            <span>{orbCount}</span>
          </div>
          <Slider
            value={[orbCount]}
            onValueChange={([v]) => {
              setOrbCount(v);
              const canvas = canvasRef.current;
              if (canvas) initOrbs(canvas.width, canvas.height);
            }}
            min={3}
            max={9}
            step={1}
            className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-300 [&_.bg-primary]:bg-cyan-500/50"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-8 text-center max-w-lg"
      >
        <p className="text-cyan-400/40 text-xs leading-relaxed">
          Five celestial orbs pulse in rhythmic harmony, each breathing at its own pace 
          while maintaining cosmic connection. Watch as particles orbit, colors shift, 
          and the universe inhales and exhales.
        </p>
      </motion.div>
    </div>
  );
}
