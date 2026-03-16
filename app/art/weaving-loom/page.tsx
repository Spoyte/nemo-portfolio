"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { weavingLoomDefaultParams } from "@/lib/art/weaving-loom";
import { Palette, Pause, Play, Sparkles, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  denim: number;
  weftThreads: number;
  weaveType: string;
  warpColor: string;
  weftColor: string;
  pattern: string;
  threadThickness: number;
  tension: number;
  shine: number;
  speed: number;
  colorVariation: number;
}

const defaultParams: Params = {
  denim: isWarpUp = (x + y) % 2 === 0;,
  weftThreads: 40,
  weaveType: "twill",
  warpColor: "#8b4513",
  weftColor: "#d2691e",
  pattern: "diamond",
  threadThickness: 3,
  tension: 0.3,
  shine: 0.6,
  speed: 1,
  colorVariation: 0.2,
};

export default function WeavingLoomPage() {
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
        weavingLoomDefaultParams.generate(ctx, params, time);
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
      denim: 10 + Math.random() * 70,
      weftThreads: 10 + Math.random() * 70,
      weaveType: ["plain", "twill", "satin", "basket", "herringbone", "broken"][Math.floor(Math.random() * 6)],
      warpColor: ["#8b4513", "#1a237e", "#b71c1c", "#4a148c", "#5d4037", "#e0e0e0", "#e65100", "#1a1a2e"][Math.floor(Math.random() * 8)],
      weftColor: ["#d2691e", "#3949ab", "#2e7d32", "#7b1fa2", "#8d6e63", "#f5f5f5", "#f57c00", "#16213e"][Math.floor(Math.random() * 8)],
      pattern: ["none", "stripes", "checks", "diamond", "zigzag", "gradient", "random"][Math.floor(Math.random() * 7)],
      threadThickness: 1 + Math.random() * 7,
      tension: 0 + Math.random() * 1,
      shine: 0 + Math.random() * 1,
      speed: 0 + Math.random() * 3,
      colorVariation: 0 + Math.random() * 1,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Weaving Loom</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Simulated textile weaving with warp and weft threads. Creates intricate fabric patterns inspired by traditional looms, featuring multiple weave structures, color gradients, and animated shuttle movement.
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

            {/* Denim */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Denim: {params.denim}
              </label>
              <Slider
                value={[params.denim]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, denim: v }))}
                min={10}
                max={80}
                step={5}
                className="w-full"
              />
            </div>

            {/* WeftThreads */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WeftThreads: {params.weftThreads}
              </label>
              <Slider
                value={[params.weftThreads]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, weftThreads: v }))}
                min={10}
                max={80}
                step={5}
                className="w-full"
              />
            </div>

            {/* WeaveType */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WeaveType
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "plain" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "plain"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  plain
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "twill" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "twill"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  twill
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "satin" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "satin"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  satin
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "basket" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "basket"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  basket
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "herringbone" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "herringbone"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  herringbone
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weaveType: "broken" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weaveType === "broken"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  broken
                </button>
              </div>
            </div>

            {/* WarpColor */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WarpColor
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#8b4513" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#8b4513"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #8b4513
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#1a237e" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#1a237e"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #1a237e
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#b71c1c" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#b71c1c"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #b71c1c
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#4a148c" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#4a148c"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #4a148c
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#5d4037" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#5d4037"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #5d4037
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#e0e0e0" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#e0e0e0"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #e0e0e0
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#e65100" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#e65100"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #e65100
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, warpColor: "#1a1a2e" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.warpColor === "#1a1a2e"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #1a1a2e
                </button>
              </div>
            </div>

            {/* WeftColor */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WeftColor
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#d2691e" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#d2691e"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #d2691e
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#3949ab" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#3949ab"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #3949ab
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#2e7d32" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#2e7d32"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #2e7d32
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#7b1fa2" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#7b1fa2"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #7b1fa2
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#8d6e63" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#8d6e63"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #8d6e63
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#f5f5f5" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#f5f5f5"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #f5f5f5
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#f57c00" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#f57c00"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #f57c00
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, weftColor: "#16213e" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.weftColor === "#16213e"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  #16213e
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
                  onClick={() => setParams(prev => ({ ...prev, pattern: "none" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "none"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  none
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "stripes" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "stripes"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  stripes
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "checks" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "checks"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  checks
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "diamond" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "diamond"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  diamond
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "zigzag" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "zigzag"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  zigzag
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "gradient" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "gradient"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gradient
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, pattern: "random" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.pattern === "random"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  random
                </button>
              </div>
            </div>

            {/* ThreadThickness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ThreadThickness: {params.threadThickness.toFixed(2)}
              </label>
              <Slider
                value={[params.threadThickness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, threadThickness: v }))}
                min={1}
                max={8}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Tension */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Tension: {params.tension.toFixed(2)}
              </label>
              <Slider
                value={[params.tension]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, tension: v }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Shine */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Shine: {params.shine.toFixed(2)}
              </label>
              <Slider
                value={[params.shine]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, shine: v }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
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
                min={0}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* ColorVariation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorVariation: {params.colorVariation.toFixed(2)}
              </label>
              <Slider
                value={[params.colorVariation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, colorVariation: v }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Simulated textile weaving with warp and weft threads. Creates intricate fabric patterns inspired by traditional looms, featuring multiple weave structures, color gradients, and animated shuttle movement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
