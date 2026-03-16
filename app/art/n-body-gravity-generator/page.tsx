"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { nBodyGravity } from "@/lib/art/n-body-gravity-generator";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  gravityStrength: number;
  timeStep: number;
  softening: number;
  trailLength: number;
  colorScheme: string;
  initConfig: string;
}

const defaultParams: Params = {
  params: nBodyGravityDefaultParams.particleCount,
  gravityStrength: nBodyGravityDefaultParams.gravityStrength,
  timeStep: nBodyGravityDefaultParams.timeStep,
  softening: nBodyGravityDefaultParams.softening,
  trailLength: nBodyGravityDefaultParams.trailLength,
  colorScheme: nBodyGravityDefaultParams.colorScheme,
  initConfig: nBodyGravityDefaultParams.initConfig,
};

export default function NBodyGravityGeneratorPage() {
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
        nBodyGravity.generate(ctx, params, time);
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
      params: 50 + Math.random() * 750,
      gravityStrength: 0.1 + Math.random() * 1.9,
      timeStep: 0.1 + Math.random() * 0.9,
      softening: Math.floor(1 + Math.random() * 19),
      trailLength: 0 + Math.random() * 100,
      colorScheme: ["nebula", "galaxy", "inferno", "ocean", "gold"][Math.floor(Math.random() * 5)],
      initConfig: ["random", "disc", "cluster", "binary", "shell"][Math.floor(Math.random() * 5)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">N-Body Gravity</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Mutual gravitational attraction simulation where every particle attracts every other particle, creating emergent galaxy-like structures and orbital dynamics
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
                min={50}
                max={800}
                step={50}
                className="w-full"
              />
            </div>

            {/* GravityStrength */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                GravityStrength: {params.gravityStrength.toFixed(2)}
              </label>
              <Slider
                value={[params.gravityStrength]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, gravityStrength: v }))}
                min={0.1}
                max={2.0}
                step={0.1}
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
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Softening */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Softening: {params.softening}
              </label>
              <Slider
                value={[params.softening]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, softening: v }))}
                min={1}
                max={20}
                step={1}
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
                min={0}
                max={100}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "nebula" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "nebula"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  nebula
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "galaxy" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "galaxy"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  galaxy
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "inferno" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "inferno"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  inferno
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "gold" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "gold"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gold
                </button>
              </div>
            </div>

            {/* InitConfig */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                InitConfig
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, initConfig: "random" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.initConfig === "random"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  random
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, initConfig: "disc" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.initConfig === "disc"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  disc
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, initConfig: "cluster" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.initConfig === "cluster"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cluster
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, initConfig: "binary" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.initConfig === "binary"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  binary
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, initConfig: "shell" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.initConfig === "shell"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  shell
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Mutual gravitational attraction simulation where every particle attracts every other particle, creating emergent galaxy-like structures and orbital dynamics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
