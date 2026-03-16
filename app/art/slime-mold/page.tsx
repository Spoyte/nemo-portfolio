"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { slimeMoldDefaultParams } from "@/lib/art/slime-mold";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  sensorAngle: number;
  sensorDist: number;
  turnAngle: number;
  decayRate: number;
  depositAmount: number;
  colorScheme: string;
  foodSourceCount: number;
  obstacleCount: number;
  showParticles: string;
  trailPersistence: number;
}

const defaultParams: Params = {
  params: 4000,
  sensorAngle: 45,
  sensorDist: 20,
  turnAngle: 20,
  decayRate: 2,
  depositAmount: 15,
  colorScheme: "slime-green",
  foodSourceCount: 3,
  obstacleCount: 0,
  showParticles: "true",
  trailPersistence: 95,
};

export default function SlimeMoldPage() {
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
        slimeMoldDefaultParams.generate(ctx, params, time);
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
      params: 500 + Math.random() * 9500,
      sensorAngle: 10 + Math.random() * 80,
      sensorDist: 5 + Math.random() * 45,
      turnAngle: 5 + Math.random() * 55,
      decayRate: Math.floor(0 + Math.random() * 10),
      depositAmount: 5 + Math.random() * 45,
      colorScheme: ["slime-green", "electric-blue", "magma", "rainbow", "monochrome"][Math.floor(Math.random() * 5)],
      foodSourceCount: Math.floor(1 + Math.random() * 7),
      obstacleCount: Math.floor(0 + Math.random() * 5),
      showParticles: ["true", "false"][Math.floor(Math.random() * 2)],
      trailPersistence: Math.floor(50 + Math.random() * 49),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Slime Mold</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Physarum polycephalum simulation - biological pathfinding through emergent behavior
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

            {/* Params */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Params: {params.params}
              </label>
              <Slider
                value={[params.params]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, params: v }))}
                min={500}
                max={10000}
                step={500}
                className="w-full"
              />
            </div>

            {/* SensorAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SensorAngle: {params.sensorAngle}
              </label>
              <Slider
                value={[params.sensorAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, sensorAngle: v }))}
                min={10}
                max={90}
                step={5}
                className="w-full"
              />
            </div>

            {/* SensorDist */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SensorDist: {params.sensorDist}
              </label>
              <Slider
                value={[params.sensorDist]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, sensorDist: v }))}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            {/* TurnAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TurnAngle: {params.turnAngle}
              </label>
              <Slider
                value={[params.turnAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, turnAngle: v }))}
                min={5}
                max={60}
                step={5}
                className="w-full"
              />
            </div>

            {/* DecayRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DecayRate: {params.decayRate}
              </label>
              <Slider
                value={[params.decayRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, decayRate: v }))}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* DepositAmount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DepositAmount: {params.depositAmount}
              </label>
              <Slider
                value={[params.depositAmount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, depositAmount: v }))}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            {/* ColorScheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorScheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "slime-green" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "slime-green"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  slime-green
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "electric-blue" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "electric-blue"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  electric-blue
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "magma" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "magma"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  magma
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
              </div>
            </div>

            {/* FoodSourceCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FoodSourceCount: {params.foodSourceCount}
              </label>
              <Slider
                value={[params.foodSourceCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, foodSourceCount: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* ObstacleCount */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ObstacleCount: {params.obstacleCount}
              </label>
              <Slider
                value={[params.obstacleCount]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, obstacleCount: v }))}
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* ShowParticles */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowParticles
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showParticles: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showParticles === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showParticles: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showParticles === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* TrailPersistence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TrailPersistence: {params.trailPersistence}
              </label>
              <Slider
                value={[params.trailPersistence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, trailPersistence: v }))}
                min={50}
                max={99}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Physarum polycephalum simulation - biological pathfinding through emergent behavior</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
