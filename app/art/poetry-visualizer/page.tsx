"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { poetryVisualizerDefaultParams } from "@/lib/art/poetry-visualizer";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  trail: string;
  fontFamily: string;
  layoutMode: string;
  colorTheme: string;
  particleDensity: number;
  flowSpeed: number;
  textOpacity: number;
  showParticles: string;
  particleTrails: string;
}

const defaultParams: Params = {
  trail: "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold",
  fontFamily: "serif",
  layoutMode: "flow",
  colorTheme: "ink",
  particleDensity: 0.7,
  flowSpeed: 1,
  textOpacity: 0.9,
  showParticles: "true",
  particleTrails: "true",
};

export default function PoetryVisualizerPage() {
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
        poetryVisualizerDefaultParams.generate(ctx, params, time);
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
      trail: ["The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold", "In the garden\nwhispers of wind\ncarry petals\nto silent ponds", "Code flows like\nrivers of thought\nthrough circuits\ninto light", "Mountains rise\nclouds drift by\ntime stands still\nbeneath the sky", "Dreams take flight\nin the dark of night\nstars align\nworlds combine"][Math.floor(Math.random() * 5)],
      fontFamily: ["serif", "sans", "mono", "script"][Math.floor(Math.random() * 4)],
      layoutMode: ["flow", "cascade", "spiral", "scatter", "waves"][Math.floor(Math.random() * 5)],
      colorTheme: ["ink", "sunset", "ocean", "forest", "monochrome", "neon"][Math.floor(Math.random() * 6)],
      particleDensity: 0 + Math.random() * 1,
      flowSpeed: 0 + Math.random() * 3,
      textOpacity: 0.1 + Math.random() * 0.9,
      showParticles: ["true", "false"][Math.floor(Math.random() * 2)],
      particleTrails: ["true", "false"][Math.floor(Math.random() * 2)],
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Poetry Visualizer</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Transform text into flowing visual poetry - words become particles that dance and flow through space
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

            {/* Trail */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Trail
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, trail: "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.trail === "The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  The quick brown fox\njumps over the lazy dog\nwhile stars above\nshine bright and cold
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, trail: "In the garden\nwhispers of wind\ncarry petals\nto silent ponds" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.trail === "In the garden\nwhispers of wind\ncarry petals\nto silent ponds"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  In the garden\nwhispers of wind\ncarry petals\nto silent ponds
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, trail: "Code flows like\nrivers of thought\nthrough circuits\ninto light" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.trail === "Code flows like\nrivers of thought\nthrough circuits\ninto light"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  Code flows like\nrivers of thought\nthrough circuits\ninto light
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, trail: "Mountains rise\nclouds drift by\ntime stands still\nbeneath the sky" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.trail === "Mountains rise\nclouds drift by\ntime stands still\nbeneath the sky"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  Mountains rise\nclouds drift by\ntime stands still\nbeneath the sky
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, trail: "Dreams take flight\nin the dark of night\nstars align\nworlds combine" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.trail === "Dreams take flight\nin the dark of night\nstars align\nworlds combine"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  Dreams take flight\nin the dark of night\nstars align\nworlds combine
                </button>
              </div>
            </div>

            {/* FontFamily */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FontFamily
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, fontFamily: "serif" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.fontFamily === "serif"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  serif
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, fontFamily: "sans" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.fontFamily === "sans"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sans
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, fontFamily: "mono" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.fontFamily === "mono"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  mono
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, fontFamily: "script" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.fontFamily === "script"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  script
                </button>
              </div>
            </div>

            {/* LayoutMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LayoutMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, layoutMode: "flow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.layoutMode === "flow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  flow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, layoutMode: "cascade" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.layoutMode === "cascade"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  cascade
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, layoutMode: "spiral" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.layoutMode === "spiral"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spiral
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, layoutMode: "scatter" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.layoutMode === "scatter"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  scatter
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, layoutMode: "waves" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.layoutMode === "waves"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  waves
                </button>
              </div>
            </div>

            {/* ColorTheme */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorTheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "ink" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "ink"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ink
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "sunset" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "sunset"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sunset
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "ocean" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "ocean"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  ocean
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "forest" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "forest"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  forest
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorTheme: "neon" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorTheme === "neon"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  neon
                </button>
              </div>
            </div>

            {/* ParticleDensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleDensity: {params.particleDensity.toFixed(2)}
              </label>
              <Slider
                value={[params.particleDensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, particleDensity: v }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* FlowSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wind className="w-4 h-4" />
                FlowSpeed: {params.flowSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.flowSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, flowSpeed: v }))}
                min={0}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* TextOpacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                TextOpacity: {params.textOpacity.toFixed(2)}
              </label>
              <Slider
                value={[params.textOpacity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, textOpacity: v }))}
                min={0.1}
                max={1}
                step={0.1}
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

            {/* ParticleTrails */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ParticleTrails
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, particleTrails: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.particleTrails === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, particleTrails: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.particleTrails === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Transform text into flowing visual poetry - words become particles that dance and flow through space</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
