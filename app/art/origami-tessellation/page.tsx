"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { origamiTessellationDefaultParams } from "@/lib/art/origami-tessellation";
import { Palette, Pause, Play, Sparkles, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  washi: string;
  foldAngle: number;
  gridSize: number;
  amplitude: number;
  colorScheme: string;
  showCreases: number;
  lighting: number;
  animateFold: number;
}

const defaultParams: Params = {
  washi: return miuraOri;,
  foldAngle: 45,
  gridSize: 12,
  amplitude: 30,
  colorScheme: "washi",
  showCreases: 1,
  lighting: 0.7,
  animateFold: 1,
};

export default function OrigamiTessellationPage() {
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
        origamiTessellationDefaultParams.generate(ctx, params, time);
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
      washi: ["miura", "waterbomb", "hexagonal", "yoshimura", "square-twist"][Math.floor(Math.random() * 5)],
      foldAngle: 15 + Math.random() * 60,
      gridSize: 8 + Math.random() * 16,
      amplitude: 15 + Math.random() * 35,
      colorScheme: ["washi", "indigo", "sakura", "matcha", "kuro", "gold", "sunset"][Math.floor(Math.random() * 7)],
      showCreases: Math.floor(0 + Math.random() * 1),
      lighting: 0.3 + Math.random() * 0.7,
      animateFold: Math.floor(0 + Math.random() * 1),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Origami Tessellation</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Mathematical paper folding patterns inspired by traditional Japanese origami. Features Miura-ori, waterbomb, hexagonal, Yoshimura, and square twist tessellations with realistic 3D shading and washi paper textures.
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

            {/* Washi */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Washi
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, washi: "miura" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.washi === "miura"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  miura
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, washi: "waterbomb" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.washi === "waterbomb"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  waterbomb
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, washi: "hexagonal" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.washi === "hexagonal"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  hexagonal
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, washi: "yoshimura" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.washi === "yoshimura"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  yoshimura
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, washi: "square-twist" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.washi === "square-twist"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  square-twist
                </button>
              </div>
            </div>

            {/* FoldAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FoldAngle: {params.foldAngle}
              </label>
              <Slider
                value={[params.foldAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, foldAngle: v }))}
                min={15}
                max={75}
                step={5}
                className="w-full"
              />
            </div>

            {/* GridSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                GridSize: {params.gridSize}
              </label>
              <Slider
                value={[params.gridSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, gridSize: v }))}
                min={8}
                max={24}
                step={2}
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
                min={15}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "washi" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "washi"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  washi
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "indigo" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "indigo"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  indigo
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sakura" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sakura"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sakura
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "matcha" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "matcha"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  matcha
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "kuro" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "kuro"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  kuro
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sunset" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sunset"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sunset
                </button>
              </div>
            </div>

            {/* ShowCreases */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowCreases: {params.showCreases}
              </label>
              <Slider
                value={[params.showCreases]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, showCreases: v }))}
                min={0}
                max={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Lighting */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                Lighting: {params.lighting.toFixed(2)}
              </label>
              <Slider
                value={[params.lighting]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lighting: v }))}
                min={0.3}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* AnimateFold */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimateFold: {params.animateFold}
              </label>
              <Slider
                value={[params.animateFold]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, animateFold: v }))}
                min={0}
                max={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Mathematical paper folding patterns inspired by traditional Japanese origami. Features Miura-ori, waterbomb, hexagonal, Yoshimura, and square twist tessellations with realistic 3D shading and washi paper textures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
