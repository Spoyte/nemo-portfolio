"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { defaultParams as libDefaultParams } from "@/lib/art/julia-set";
import { Palette, Pause, Play, Sparkles, ZoomIn } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  cReal: number;
  cImag: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  maxIterations: number;
  palette: string;
  seedIndex: number;
  colorCycles: number;
  smoothColoring: number;
  showOrbit: number;
  orbitSpeed: number;
  bailout: number;
}

const initialParams: Params = {
  cReal: libDefaultParams.cReal,
  cImag: libDefaultParams.cImag,
  zoom: libDefaultParams.zoom,
  offsetX: libDefaultParams.offsetX,
  offsetY: libDefaultParams.offsetY,
  maxIterations: libDefaultParams.maxIterations,
  palette: libDefaultParams.palette,
  seedIndex: libDefaultParams.seedIndex,
  colorCycles: libDefaultParams.colorCycles,
  smoothColoring: libDefaultParams.smoothColoring ? 1 : 0,
  showOrbit: libDefaultParams.showOrbit ? 1 : 0,
  orbitSpeed: libDefaultParams.orbitSpeed,
  bailout: libDefaultParams.bailout,
};

export default function JuliaSetPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<Params>(initialParams);

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
        defaultParams.generate(ctx, params, time);
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
      cReal: -2 + Math.random() * 4,
      cImag: -2 + Math.random() * 4,
      zoom: 0.1 + Math.random() * 9.9,
      offsetX: -2 + Math.random() * 4,
      offsetY: -2 + Math.random() * 4,
      maxIterations: 20 + Math.random() * 480,
      palette: ["inferno", "ocean", "electric", "silver", "psychedelic"][Math.floor(Math.random() * 5)],
      seedIndex: Math.floor(0 + Math.random() * 9),
      colorCycles: 0.5 + Math.random() * 4.5,


      orbitSpeed: 0 + Math.random() * 2,
      bailout: Math.floor(2 + Math.random() * 14),
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Dragon</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Explore Julia sets - the Mandelbrot
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

            {/* CReal */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CReal: {params.cReal.toFixed(2)}
              </label>
              <Slider
                value={[params.cReal]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, cReal: v }))}
                min={-2}
                max={2}
                step={0.001}
                className="w-full"
              />
            </div>

            {/* CImag */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                CImag: {params.cImag.toFixed(2)}
              </label>
              <Slider
                value={[params.cImag]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, cImag: v }))}
                min={-2}
                max={2}
                step={0.001}
                className="w-full"
              />
            </div>

            {/* Zoom */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <ZoomIn className="w-4 h-4" />
                Zoom: {params.zoom.toFixed(1)}x
              </label>
              <Slider
                value={[params.zoom]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, zoom: v }))}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* OffsetX */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                OffsetX: {params.offsetX.toFixed(2)}
              </label>
              <Slider
                value={[params.offsetX]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, offsetX: v }))}
                min={-2}
                max={2}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* OffsetY */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                OffsetY: {params.offsetY.toFixed(2)}
              </label>
              <Slider
                value={[params.offsetY]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, offsetY: v }))}
                min={-2}
                max={2}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* MaxIterations */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                MaxIterations: {params.maxIterations}
              </label>
              <Slider
                value={[params.maxIterations]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, maxIterations: v }))}
                min={20}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            {/* Palette */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "inferno" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "inferno"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  inferno
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
                  onClick={() => setParams(prev => ({ ...prev, palette: "electric" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "electric"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  electric
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "silver" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "silver"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  silver
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, palette: "psychedelic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.palette === "psychedelic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  psychedelic
                </button>
              </div>
            </div>

            {/* SeedIndex */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SeedIndex: {params.seedIndex}
              </label>
              <Slider
                value={[params.seedIndex]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, seedIndex: v }))}
                min={0}
                max={9}
                step={1}
                className="w-full"
              />
            </div>

            {/* ColorCycles */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorCycles: {params.colorCycles.toFixed(2)}
              </label>
              <Slider
                value={[params.colorCycles]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, colorCycles: v }))}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>





            {/* OrbitSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                OrbitSpeed: {params.orbitSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.orbitSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, orbitSpeed: v }))}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Bailout */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Bailout: {params.bailout}
              </label>
              <Slider
                value={[params.bailout]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, bailout: v }))}
                min={2}
                max={16}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Explore Julia sets - the Mandelbrot</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
