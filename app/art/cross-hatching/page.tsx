"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { crossHatchingSketch } from "@/lib/art/cross-hatching";
import { Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  white: string;
  paperTone: string;
  pencilGrade: string;
  lineDensity: number;
  hatchingLayers: number;
  roughness: number;
  contrast: number;
  animateAbstract: string;
  seed: number;
}

const defaultParams: Params = {
  white: "portrait",
  paperTone: "cream",
  pencilGrade: "HB",
  lineDensity: 0.7,
  hatchingLayers: 3,
  roughness: 0.3,
  contrast: 0.6,
  animateAbstract: "true",
  seed: 42,
};

export default function CrossHatchingPage() {
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
        crossHatchingSketch.generate(ctx, params, time);
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
      white: ["portrait", "sphere", "landscape", "stillLife", "abstract"][Math.floor(Math.random() * 5)],
      paperTone: ["white", "cream", "grey", "tan", "blueprint"][Math.floor(Math.random() * 5)],
      pencilGrade: ["2H", "HB", "2B", "4B", "6B"][Math.floor(Math.random() * 5)],
      lineDensity: 0.3 + Math.random() * 0.8999999999999999,
      hatchingLayers: Math.floor(1 + Math.random() * 3),
      roughness: 0 + Math.random() * 1,
      contrast: 0.3 + Math.random() * 0.7,
      animateAbstract: ["true", "false"][Math.floor(Math.random() * 2)],
      seed: Math.floor(1 + Math.random() * 999),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Cross-Hatching Sketch</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Traditional cross-hatching technique using intersecting lines to represent tone and form, simulating hand-drawn pencil sketches
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

            {/* White */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                White
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, white: "portrait" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.white === "portrait"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  portrait
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, white: "sphere" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.white === "sphere"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sphere
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, white: "landscape" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.white === "landscape"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  landscape
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, white: "stillLife" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.white === "stillLife"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  stillLife
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, white: "abstract" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.white === "abstract"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  abstract
                </button>
              </div>
            </div>

            {/* PaperTone */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PaperTone
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, paperTone: "white" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperTone === "white"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  white
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperTone: "cream" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperTone === "cream"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cream
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperTone: "grey" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperTone === "grey"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  grey
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperTone: "tan" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperTone === "tan"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  tan
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, paperTone: "blueprint" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.paperTone === "blueprint"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  blueprint
                </button>
              </div>
            </div>

            {/* PencilGrade */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PencilGrade
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, pencilGrade: "2H" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pencilGrade === "2H"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  2H
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pencilGrade: "HB" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pencilGrade === "HB"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  HB
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pencilGrade: "2B" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pencilGrade === "2B"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  2B
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pencilGrade: "4B" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pencilGrade === "4B"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  4B
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pencilGrade: "6B" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pencilGrade === "6B"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  6B
                </button>
              </div>
            </div>

            {/* LineDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineDensity: {params.lineDensity.toFixed(2)}
              </label>
              <Slider
                value={[params.lineDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineDensity: v }))}
                min={0.3}
                max={1.2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* HatchingLayers */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                HatchingLayers: {params.hatchingLayers}
              </label>
              <Slider
                value={[params.hatchingLayers]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, hatchingLayers: v }))}
                min={1}
                max={4}
                step={1}
                className="w-full"
              />
            </div>

            {/* Roughness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Roughness: {params.roughness.toFixed(2)}
              </label>
              <Slider
                value={[params.roughness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, roughness: v }))}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Contrast: {params.contrast.toFixed(2)}
              </label>
              <Slider
                value={[params.contrast]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, contrast: v }))}
                min={0.3}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* AnimateAbstract */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimateAbstract
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, animateAbstract: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateAbstract === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animateAbstract: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateAbstract === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* Seed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Seed: {params.seed}
              </label>
              <Slider
                value={[params.seed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, seed: v }))}
                min={1}
                max={1000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Traditional cross-hatching technique using intersecting lines to represent tone and form, simulating hand-drawn pencil sketches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
