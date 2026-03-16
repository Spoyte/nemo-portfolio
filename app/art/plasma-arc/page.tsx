"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { plasmaArcDefaultParams } from "@/lib/art/plasma-arc";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: string;
  arcIntensity: number;
  arcComplexity: number;
  colorScheme: string;
  arcThickness: number;
  showGlow: string;
  animateArcs: string;
  dischargeRate: number;
  backgroundStyle: string;
  turbulence: number;
}

const defaultParams: Params = {
  params: "2",
  arcIntensity: 50,
  arcComplexity: 12,
  colorScheme: "electric-blue",
  arcThickness: 2,
  showGlow: "true",
  animateArcs: "true",
  dischargeRate: 30,
  backgroundStyle: "dark",
  turbulence: 0.5,
};

export default function PlasmaArcPage() {
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
        plasmaArcDefaultParams.generate(ctx, params, time);
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
      params: ["1", "2", "3", "4"][Math.floor(Math.random() * 4)],
      arcIntensity: 10 + Math.random() * 90,
      arcComplexity: Math.floor(4 + Math.random() * 16),
      colorScheme: ["electric-blue", "plasma-purple", "lightning-white", "neon-pink", "fire", "rainbow"][Math.floor(Math.random() * 6)],
      arcThickness: 0.5 + Math.random() * 4.5,
      showGlow: ["true", "false"][Math.floor(Math.random() * 2)],
      animateArcs: ["true", "false"][Math.floor(Math.random() * 2)],
      dischargeRate: 0 + Math.random() * 100,
      backgroundStyle: ["dark", "black", "navy", "purple"][Math.floor(Math.random() * 4)],
      turbulence: 0.1 + Math.random() * 1.4,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Plasma Arc Discharge</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Simulate electrical arcs and plasma discharges between electrodes. Uses midpoint displacement to create realistic lightning-like patterns with branching, glow effects, and animated discharge particles.
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
                Params
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "1" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "1"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  1
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "2" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "2"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  2
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "3" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "3"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  3
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "4" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "4"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  4
                </button>
              </div>
            </div>

            {/* ArcIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ArcIntensity: {params.arcIntensity}
              </label>
              <Slider
                value={[params.arcIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, arcIntensity: v }))}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* ArcComplexity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ArcComplexity: {params.arcComplexity}
              </label>
              <Slider
                value={[params.arcComplexity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, arcComplexity: v }))}
                min={4}
                max={20}
                step={1}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "plasma-purple" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "plasma-purple"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  plasma-purple
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "lightning-white" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "lightning-white"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  lightning-white
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "neon-pink" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "neon-pink"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  neon-pink
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "fire" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "fire"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  fire
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
              </div>
            </div>

            {/* ArcThickness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ArcThickness: {params.arcThickness.toFixed(2)}
              </label>
              <Slider
                value={[params.arcThickness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, arcThickness: v }))}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* ShowGlow */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowGlow
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showGlow: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showGlow === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showGlow: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showGlow === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* AnimateArcs */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimateArcs
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, animateArcs: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateArcs === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animateArcs: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateArcs === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* DischargeRate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DischargeRate: {params.dischargeRate}
              </label>
              <Slider
                value={[params.dischargeRate]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dischargeRate: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* BackgroundStyle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BackgroundStyle
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "dark" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "dark"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  dark
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "black" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "black"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  black
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "navy" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "navy"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  navy
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "purple" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "purple"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  purple
                </button>
              </div>
            </div>

            {/* Turbulence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Cloud className="w-4 h-4" />
                Turbulence: {params.turbulence.toFixed(2)}
              </label>
              <Slider
                value={[params.turbulence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, turbulence: v }))}
                min={0.1}
                max={1.5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Simulate electrical arcs and plasma discharges between electrodes. Uses midpoint displacement to create realistic lightning-like patterns with branching, glow effects, and animated discharge particles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
