"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { spaceFillingCurvesDefaultParams } from "@/lib/art/space-filling-curves";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  rainbow: string;
  iterations: number;
  lineWidth: number;
  colorScheme: string;
  animationSpeed: number;
  showConstruction: string;
  drawMode: string;
  backgroundFade: number;
  symmetry: number;
}

const defaultParams: Params = {
  rainbow: return generateHilbert(iterations);,
  iterations: 4,
  lineWidth: 2,
  colorScheme: "rainbow",
  animationSpeed: 1,
  showConstruction: "false",
  drawMode: "glow",
  backgroundFade: 0.95,
  symmetry: 1,
};

export default function SpaceFillingCurvesPage() {
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
        spaceFillingCurvesDefaultParams.generate(ctx, params, time);
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
      rainbow: ["hilbert", "peano", "dragon", "gosper", "koch"][Math.floor(Math.random() * 5)],
      iterations: Math.floor(1 + Math.random() * 6),
      lineWidth: 0.5 + Math.random() * 7.5,
      colorScheme: ["rainbow", "gradient", "monochrome", "fire", "ocean"][Math.floor(Math.random() * 5)],
      animationSpeed: 0 + Math.random() * 3,
      showConstruction: ["true", "false"][Math.floor(Math.random() * 2)],
      drawMode: ["line", "dots", "glow"][Math.floor(Math.random() * 3)],
      backgroundFade: 0.5 + Math.random() * 0.5,
      symmetry: Math.floor(1 + Math.random() * 7),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Space-Filling Curves</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Mathematical curves that visit every point in a space. From Hilbert
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

            {/* Rainbow */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Rainbow
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, rainbow: "hilbert" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.rainbow === "hilbert"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  hilbert
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, rainbow: "peano" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.rainbow === "peano"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  peano
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, rainbow: "dragon" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.rainbow === "dragon"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  dragon
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, rainbow: "gosper" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.rainbow === "gosper"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gosper
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, rainbow: "koch" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.rainbow === "koch"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  koch
                </button>
              </div>
            </div>

            {/* Iterations */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Iterations: {params.iterations}
              </label>
              <Slider
                value={[params.iterations]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, iterations: v }))}
                min={1}
                max={7}
                step={1}
                className="w-full"
              />
            </div>

            {/* LineWidth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineWidth: {params.lineWidth.toFixed(2)}
              </label>
              <Slider
                value={[params.lineWidth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineWidth: v }))}
                min={0.5}
                max={8}
                step={0.5}
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
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "gradient" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "gradient"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gradient
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
              </div>
            </div>

            {/* AnimationSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimationSpeed: {params.animationSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.animationSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, animationSpeed: v }))}
                min={0}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* ShowConstruction */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowConstruction
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showConstruction: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showConstruction === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showConstruction: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showConstruction === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* DrawMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DrawMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, drawMode: "line" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.drawMode === "line"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  line
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, drawMode: "dots" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.drawMode === "dots"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  dots
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, drawMode: "glow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.drawMode === "glow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  glow
                </button>
              </div>
            </div>

            {/* BackgroundFade */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BackgroundFade: {params.backgroundFade.toFixed(2)}
              </label>
              <Slider
                value={[params.backgroundFade]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, backgroundFade: v }))}
                min={0.5}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Symmetry */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Symmetry: {params.symmetry}
              </label>
              <Slider
                value={[params.symmetry]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, symmetry: v }))}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Mathematical curves that visit every point in a space. From Hilbert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
