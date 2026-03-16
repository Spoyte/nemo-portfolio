"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { doublePendulumDefaultParams } from "@/lib/art/double-pendulum";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  trail: number;
  length1: number;
  length2: number;
  mass1: number;
  mass2: number;
  damping: number;
  trailLength: number;
  trailFade: number;
  colorMode: string;
  showArms: number;
  armThickness: number;
  timeStep: number;
  initialAngle1: number;
  initialAngle2: number;
  chaosMode: number;
  particleCount: number;
}

const defaultParams: Params = {
  trail: 9.81,
  length1: 120,
  length2: 120,
  mass1: 20,
  mass2: 20,
  damping: 0.995,
  trailLength: 800,
  trailFade: 0.98,
  colorMode: "rainbow",
  showArms: true,
  armThickness: 2,
  timeStep: 0.3,
  initialAngle1: Math.PI / 2,
  initialAngle2: Math.PI / 2,
  chaosMode: false,
  particleCount: 1,
};

export default function DoublePendulumPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<Params>(defaultParams);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      if (isPlaying) {
        time += 16;
        doublePendulumDefaultParams.generate(ctx, params, time);
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
        const rect = container.getBoundingClientRect();
        const width = Math.min(rect.width, 900);
        const height = Math.min(window.innerHeight * 0.6, 600);
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const randomize = useCallback(() => {
    setParams({
      trail: 1 + Math.random() * 19,
      length1: 50 + Math.random() * 150,
      length2: 50 + Math.random() * 150,
      mass1: 10 + Math.random() * 30,
      mass2: 10 + Math.random() * 30,
      damping: 0.95 + Math.random() * 0.050000000000000044,
      trailLength: 100 + Math.random() * 1900,
      trailFade: 0.9 + Math.random() * 0.09899999999999998,
      colorMode: ["rainbow", "velocity", "time", "monochrome", "fire", "ocean"][Math.floor(Math.random() * 6)],

      armThickness: 1 + Math.random() * 4,
      timeStep: 0.1 + Math.random() * 0.9,
      initialAngle1: 0 + Math.random() * 100,
      initialAngle2: 0 + Math.random() * 100,

      particleCount: Math.floor(1 + Math.random() * 4),
    });
  }, []);

  const reset = useCallback(() => {
    setParams(defaultParams);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Double Pendulum Chaos</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            A mesmerizing physics simulation of the double pendulum — a classic example of chaotic motion. Watch as simple deterministic rules create beautifully unpredictable patterns through the trails left by the swinging bobs.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50">
                <canvas
                  ref={canvasRef}
                  className="block"
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
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
                onClick={randomize}
                className="rounded-full border-slate-700 hover:bg-slate-800"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                className="rounded-full text-slate-500 hover:text-slate-300"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Settings
            </h2>

            {/* Trail */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Trail: {params.trail.toFixed(2)}
              </label>
              <Slider
                value={[params.trail]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, trail: v }))}
                min={1}
                max={20}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Length1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Length1: {params.length1}
              </label>
              <Slider
                value={[params.length1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, length1: v }))}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Length2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Length2: {params.length2}
              </label>
              <Slider
                value={[params.length2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, length2: v }))}
                min={50}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* Mass1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Mass1: {params.mass1}
              </label>
              <Slider
                value={[params.mass1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, mass1: v }))}
                min={10}
                max={40}
                step={2}
                className="w-full"
              />
            </div>

            {/* Mass2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Mass2: {params.mass2}
              </label>
              <Slider
                value={[params.mass2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, mass2: v }))}
                min={10}
                max={40}
                step={2}
                className="w-full"
              />
            </div>

            {/* Damping */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Damping: {params.damping.toFixed(2)}
              </label>
              <Slider
                value={[params.damping]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, damping: v }))}
                min={0.95}
                max={1.0}
                step={0.001}
                className="w-full"
              />
            </div>

            {/* TrailLength */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TrailLength: {params.trailLength}
              </label>
              <Slider
                value={[params.trailLength]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, trailLength: v }))}
                min={100}
                max={2000}
                step={50}
                className="w-full"
              />
            </div>

            {/* TrailFade */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TrailFade: {params.trailFade.toFixed(2)}
              </label>
              <Slider
                value={[params.trailFade]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, trailFade: v }))}
                min={0.9}
                max={0.999}
                step={0.001}
                className="w-full"
              />
            </div>

            {/* ColorMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "velocity" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "velocity"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  velocity
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "time" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "time"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  time
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "fire" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "fire"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  fire
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
              </div>
            </div>



            {/* ArmThickness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ArmThickness: {params.armThickness.toFixed(2)}
              </label>
              <Slider
                value={[params.armThickness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, armThickness: v }))}
                min={1}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* TimeStep */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TimeStep: {params.timeStep.toFixed(2)}
              </label>
              <Slider
                value={[params.timeStep]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, timeStep: v }))}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* InitialAngle1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                InitialAngle1: {params.initialAngle1.toFixed(2)}
              </label>
              <Slider
                value={[params.initialAngle1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, initialAngle1: v }))}
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* InitialAngle2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                InitialAngle2: {params.initialAngle2.toFixed(2)}
              </label>
              <Slider
                value={[params.initialAngle2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, initialAngle2: v }))}
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                className="w-full"
              />
            </div>



            {/* ParticleCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleCount: {params.particleCount}
              </label>
              <Slider
                value={[params.particleCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particleCount: v }))}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>A mesmerizing physics simulation of the double pendulum — a classic example of chaotic motion. Watch as simple deterministic rules create beautifully unpredictable patterns through the trails left by the swinging bobs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
