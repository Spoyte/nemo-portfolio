"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cymaticsDefaultParams } from "@/lib/art/cymatics";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  default: number;
  amplitude: number;
  particleCount: number;
  mode: string;
  colorScheme: string;
  viscosity: number;
  resonance: number;
  showNodes: number;
}

const defaultParams: Params = {
  default: {,
  amplitude: 50,
  particleCount: 3000,
  mode: "radial",
  colorScheme: "aurora",
  viscosity: 0.5,
  resonance: 1.2,
  showNodes: 1,
};

export default function CymaticsPage() {
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
        cymaticsDefaultParams.generate(ctx, params, time);
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
      default: 80 + Math.random() * 800,
      amplitude: 10 + Math.random() * 140,
      particleCount: 500 + Math.random() * 7500,
      mode: ["radial", "bessel", "interference", "spiral", "mandala"][Math.floor(Math.random() * 5)],
      colorScheme: ["aurora", "plasma", "gold", "deep", "monochrome"][Math.floor(Math.random() * 5)],
      viscosity: 0.1 + Math.random() * 0.85,
      resonance: 0.5 + Math.random() * 2.5,
      showNodes: Math.floor(0 + Math.random() * 1),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Cymatics</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Visualize sound frequencies as fluid particle patterns. Particles respond to simulated standing waves, creating mesmerizing cymatic patterns similar to vibrating liquid surfaces.
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

            {/* Default */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Default: {params.default}
              </label>
              <Slider
                value={[params.default]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, default: v }))}
                min={80}
                max={880}
                step={10}
                className="w-full"
              />
            </div>

            {/* Amplitude */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Amplitude: {params.amplitude}
              </label>
              <Slider
                value={[params.amplitude]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitude: v }))}
                min={10}
                max={150}
                step={5}
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
                min={500}
                max={8000}
                step={500}
                className="w-full"
              />
            </div>

            {/* Mode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, mode: "radial" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mode === "radial"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  radial
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mode: "bessel" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mode === "bessel"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  bessel
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mode: "interference" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mode === "interference"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  interference
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mode: "spiral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mode === "spiral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spiral
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, mode: "mandala" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.mode === "mandala"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mandala
                </button>
              </div>
            </div>

            {/* ColorScheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorScheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "aurora" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "aurora"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  aurora
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "plasma" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "plasma"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  plasma
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
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "deep" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "deep"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  deep
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

            {/* Viscosity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Viscosity: {params.viscosity.toFixed(2)}
              </label>
              <Slider
                value={[params.viscosity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, viscosity: v }))}
                min={0.1}
                max={0.95}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Resonance */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Resonance: {params.resonance.toFixed(2)}
              </label>
              <Slider
                value={[params.resonance]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, resonance: v }))}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* ShowNodes */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowNodes: {params.showNodes}
              </label>
              <Slider
                value={[params.showNodes]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, showNodes: v }))}
                min={0}
                max={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Visualize sound frequencies as fluid particle patterns. Particles respond to simulated standing waves, creating mesmerizing cymatic patterns similar to vibrating liquid surfaces.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
