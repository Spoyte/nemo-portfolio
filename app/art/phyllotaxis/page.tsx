"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { phyllotaxisDefaultParams } from "@/lib/art/phyllotaxis";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  goldenAngle: number;
  spread: number;
  dotSize: number;
  spiralTightness: number;
  colorScheme: string;
  animate: string;
  speed: number;
}

const defaultParams: Params = {
  params: 800,
  goldenAngle: 137.5,
  spread: 8,
  dotSize: 4,
  spiralTightness: 1,
  colorScheme: "sunflower",
  animate: "grow",
  speed: 1,
};

export default function PhyllotaxisPage() {
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
        phyllotaxisDefaultParams.generate(ctx, params, time);
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
      params: 100 + Math.random() * 1900,
      goldenAngle: 130 + Math.random() * 15,
      spread: 3 + Math.random() * 12,
      dotSize: 1 + Math.random() * 9,
      spiralTightness: 0.5 + Math.random() * 1.5,
      colorScheme: ["sunflower", "rainbow", "ocean", "fire", "monochrome", "aurora", "galaxy"][Math.floor(Math.random() * 7)],
      animate: ["none", "grow", "rotate", "breathe", "spiral"][Math.floor(Math.random() * 5)],
      speed: 0.1 + Math.random() * 2.9,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Phyllotaxis</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Sunflower seed spiral patterns using the golden angle (137.5°). Nature
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
                min={100}
                max={2000}
                step={50}
                className="w-full"
              />
            </div>

            {/* GoldenAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                GoldenAngle: {params.goldenAngle.toFixed(2)}
              </label>
              <Slider
                value={[params.goldenAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, goldenAngle: v }))}
                min={130}
                max={145}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Spread */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Spread: {params.spread.toFixed(2)}
              </label>
              <Slider
                value={[params.spread]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, spread: v }))}
                min={3}
                max={15}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* DotSize */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DotSize: {params.dotSize.toFixed(2)}
              </label>
              <Slider
                value={[params.dotSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dotSize: v }))}
                min={1}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* SpiralTightness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SpiralTightness: {params.spiralTightness.toFixed(2)}
              </label>
              <Slider
                value={[params.spiralTightness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, spiralTightness: v }))}
                min={0.5}
                max={2}
                step={0.1}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "sunflower" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "sunflower"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sunflower
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
              </div>
            </div>

            {/* Animate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Animate
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, animate: "none" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animate === "none"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  none
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animate: "grow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animate === "grow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  grow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animate: "rotate" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animate === "rotate"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rotate
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animate: "breathe" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animate === "breathe"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  breathe
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animate: "spiral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animate === "spiral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spiral
                </button>
              </div>
            </div>

            {/* Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                Speed: {params.speed.toFixed(1)}x
              </label>
              <Slider
                value={[params.speed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, speed: v }))}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Sunflower seed spiral patterns using the golden angle (137.5°). Nature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
