"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { breathingMandala } from "@/lib/art/breathing-mandala";
import { Play, Pause, Wind, Palette, Layers, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const PALETTE_NAMES = ["sunset", "ocean", "forest", "warm_earth", "cosmic"];
const PALETTE_LABELS = ["Sunset", "Ocean", "Forest", "Warm Earth", "Cosmic"];

export default function BreathingMandalaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showBreathGuide, setShowBreathGuide] = useState(true);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale" | "">("");
  
  const [params, setParams] = useState({
    palette: "ocean" as string,
    breathSpeed: 1,
    layers: 5,
    particles: 40,
    showSacredGeometry: 1,
    seed: 42,
  });

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    
    const animate = () => {
      if (isPlaying) {
        time += 16; // ~60fps
        
        // Calculate breath phase for UI
        const breathCycle = (time * params.breathSpeed * 0.008) % 1;
        const breath = (Math.sin(breathCycle * Math.PI * 2 - Math.PI / 2) + 1) / 2;
        
        // Determine breath phase (inhale = expanding, exhale = contracting)
        const phase = breathCycle < 0.5 ? "inhale" : "exhale";
        setBreathPhase(phase);
        
        breathingMandala.generate(ctx, params, time);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, container.clientHeight, 600);
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const regenerate = useCallback(() => {
    setParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Breathing Mandala</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            A meditative visualization synchronized with your breath. 
            Inhale as it expands, exhale as it contracts.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Breath Guide Overlay */}
              {showBreathGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className={`
                    text-2xl font-light tracking-widest uppercase transition-all duration-1000
                    ${breathPhase === "inhale" ? "opacity-100 scale-110 text-emerald-400" : ""}
                    ${breathPhase === "exhale" ? "opacity-100 scale-90 text-blue-400" : ""}
                    ${!breathPhase ? "opacity-0" : ""}
                  `}>
                    {breathPhase}
                  </div>
                </div>
              )}
              
              {/* Circular Canvas */}
              <div className="rounded-full overflow-hidden shadow-2xl shadow-black/50 border border-slate-800">
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{ borderRadius: "50%" }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full border-slate-700 hover:bg-slate-800"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={regenerate}
                className="rounded-full border-slate-700 hover:bg-slate-800"
              >
                New Pattern
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBreathGuide(prev => !prev)}
                className={`rounded-full ${showBreathGuide ? "text-emerald-400" : "text-slate-500"}`}
              >
                <Wind className="w-4 h-4 mr-2" />
                Guide
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Settings
            </h2>

            {/* Palette Selection */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Palette className="w-4 h-4" />
                Color Palette
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PALETTE_NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setParams(prev => ({ ...prev, palette: name }))}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${params.palette === name 
                        ? "bg-slate-700 text-white" 
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                      }
                    `}
                  >
                    <div className={`
                      w-4 h-4 rounded-full
                      ${name === "sunset" ? "bg-gradient-to-br from-orange-400 to-pink-500" : ""}
                      ${name === "ocean" ? "bg-gradient-to-br from-cyan-400 to-blue-600" : ""}
                      ${name === "forest" ? "bg-gradient-to-br from-emerald-400 to-teal-600" : ""}
                      ${name === "warm_earth" ? "bg-gradient-to-br from-amber-400 to-rose-500" : ""}
                      ${name === "cosmic" ? "bg-gradient-to-br from-violet-400 to-purple-600" : ""}
                    `} />
                    {PALETTE_LABELS[i]}
                  </button>
                ))}
              </div>
            </div>

            {/* Layers */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Layers className="w-4 h-4" />
                Layers: {params.layers}
              </label>
              <Slider
                value={[params.layers]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, layers: v }))}
                min={3}
                max={7}
                step={1}
                className="w-full"
              />
            </div>

            {/* Particles */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Sparkles className="w-4 h-4" />
                Particles: {params.particles}
              </label>
              <Slider
                value={[params.particles]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particles: v }))}
                min={0}
                max={80}
                step={10}
                className="w-full"
              />
            </div>

            {/* Breath Speed */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Wind className="w-4 h-4" />
                Breath Speed: {params.breathSpeed}x
              </label>
              <Slider
                value={[params.breathSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, breathSpeed: v }))}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Sacred Geometry Toggle */}
            <div className="flex items-center justify-between py-3 border-t border-slate-800">
              <span className="text-sm text-slate-300">Sacred Geometry</span>
              <button
                onClick={() => setParams(prev => ({ 
                  ...prev, 
                  showSacredGeometry: prev.showSacredGeometry ? 0 : 1 
                }))}
                className={`
                  w-12 h-6 rounded-full transition-colors relative
                  ${params.showSacredGeometry ? "bg-emerald-500" : "bg-slate-700"}
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all
                  ${params.showSacredGeometry ? "left-6" : "left-0.5"}
                `} />
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p>Default breath cycle: 4 seconds</p>
              <p>Follow the rhythm to practice box breathing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
