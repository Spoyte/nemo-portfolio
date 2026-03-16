"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { paperMarbling } from "@/lib/art/paper-marbling";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: string;
  palette: string;
  pattern: string;
  complexity: number;
  turbulence: number;
  veinDensity: number;
  colorSpread: number;
  paperTexture: number;
  animateFlow: string;
  seed: number;
}

const defaultParams: Params = {
  params: "cream",
  palette: "classic",
  pattern: "veined",
  complexity: 50,
  turbulence: 40,
  veinDensity: 50,
  colorSpread: 60,
  paperTexture: 30,
  animateFlow: "true",
  seed: 42,
};

export default function PaperMarblingPage() {
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
        paperMarbling.generate(ctx, params, time);
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
      params: ["cream", "white", "aged", "blue", "grey"][Math.floor(Math.random() * 5)],
      palette: ["classic", "ocean", "earth", "floral", "night", "autumn", "peacock", "monochrome"][Math.floor(Math.random() * 8)],
      pattern: ["veined", "stormont", "shell", "tiger", "swirls", "comb", "freestyle"][Math.floor(Math.random() * 7)],
      complexity: 10 + Math.random() * 90,
      turbulence: 0 + Math.random() * 100,
      veinDensity: 0 + Math.random() * 100,
      colorSpread: 10 + Math.random() * 90,
      paperTexture: 0 + Math.random() * 100,
      animateFlow: ["true", "false"][Math.floor(Math.random() * 2)],
      seed: Math.floor(1 + Math.random() * 9999),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Paper Marbling</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Traditional Ebru art simulation - floating pigments creating organic swirling patterns on water, transferred to paper
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
                  onClick={() => setParams(prev => ({ ...prev, params: "cream" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "cream"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cream
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "white" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "white"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  white
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "aged" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "aged"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  aged
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "blue" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "blue"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  blue
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, params: "grey" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.params === "grey"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  grey
                </button>
              </div>
            </div>

            {/* Palette */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "classic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "classic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  classic
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "earth" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "earth"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  earth
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "floral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "floral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  floral
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "night" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "night"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  night
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "autumn" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "autumn"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  autumn
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "peacock" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "peacock"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  peacock
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
              </div>
            </div>

            {/* Pattern */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Pattern
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "veined" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "veined"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  veined
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "stormont" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "stormont"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  stormont
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "shell" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "shell"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  shell
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "tiger" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "tiger"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  tiger
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "swirls" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "swirls"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  swirls
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "comb" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "comb"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  comb
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "freestyle" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "freestyle"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  freestyle
                </button>
              </div>
            </div>

            {/* Complexity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Complexity: {params.complexity}
              </label>
              <Slider
                value={[params.complexity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, complexity: v }))}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Turbulence */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Cloud className="w-4 h-4" />
                Turbulence: {params.turbulence}
              </label>
              <Slider
                value={[params.turbulence]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, turbulence: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* VeinDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                VeinDensity: {params.veinDensity}
              </label>
              <Slider
                value={[params.veinDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, veinDensity: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* ColorSpread */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorSpread: {params.colorSpread}
              </label>
              <Slider
                value={[params.colorSpread]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, colorSpread: v }))}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* PaperTexture */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PaperTexture: {params.paperTexture}
              </label>
              <Slider
                value={[params.paperTexture]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, paperTexture: v }))}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* AnimateFlow */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AnimateFlow
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, animateFlow: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateFlow === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, animateFlow: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.animateFlow === "false"
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
                max={10000}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Traditional Ebru art simulation - floating pigments creating organic swirling patterns on water, transferred to paper</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
