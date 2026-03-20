"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { kineticTypography, KineticTypographyParams, kineticTypographyDefaultParams } from "@/lib/art/kinetic-typography";
import { Palette, Pause, Play, Sparkles, SlidersHorizontal, Type, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function KineticTypographyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<KineticTypographyParams>(kineticTypographyDefaultParams);

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
        kineticTypography.generate(ctx, params, time);
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
      text: ["MOTION", "CREATE", "FLOW", "WAVE", "DREAM", "TYPE"][Math.floor(Math.random() * 6)],
      style: ["wave", "scatter", "orbit", "breathe", "glitch", "liquid"][Math.floor(Math.random() * 6)] as KineticTypographyParams["style"],
      fontFamily: ["serif", "sans", "mono", "display"][Math.floor(Math.random() * 4)] as KineticTypographyParams["fontFamily"],
      fontSize: 24 + Math.floor(Math.random() * 96),
      palette: ["neon", "monochrome", "sunset", "ocean", "forest", "candy"][Math.floor(Math.random() * 6)] as KineticTypographyParams["palette"],
      speed: 0.1 + Math.random() * 2.9,
      amplitude: 5 + Math.floor(Math.random() * 75),
      letterSpacing: 0.8 + Math.random() * 1.2,
      trails: Math.random() > 0.3,
      seed: Math.floor(1 + Math.random() * 99),
    });
  }, []);

  const reset = useCallback(() => {
    setParams(kineticTypographyDefaultParams);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Kinetic Typography</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Text as living matter - letters breathe, pulse, and dance with physics-based motion
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

            {/* Text */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Type className="w-4 h-4" />
                Text
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["MOTION", "CREATE", "FLOW", "WAVE", "DREAM", "TYPE"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setParams(prev => ({ ...prev, text: t }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                      ${params.text === t
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                      }
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Zap className="w-4 h-4" />
                Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["wave", "scatter", "orbit", "breathe", "glitch", "liquid"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setParams(prev => ({ ...prev, style: s as KineticTypographyParams["style"] }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                      ${params.style === s
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Type className="w-4 h-4" />
                Font: {params.fontFamily}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["serif", "sans", "mono", "display"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setParams(prev => ({ ...prev, fontFamily: f as KineticTypographyParams["fontFamily"] }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                      ${params.fontFamily === f
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                      }
                    `}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Font Size: {params.fontSize}
              </label>
              <Slider
                value={[params.fontSize]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, fontSize: v }))}
                min={24}
                max={120}
                step={4}
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
                {["neon", "monochrome", "sunset", "ocean", "forest", "candy"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setParams(prev => ({ ...prev, palette: p as KineticTypographyParams["palette"] }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                      ${params.palette === p
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Speed: {params.speed.toFixed(1)}
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

            {/* Amplitude */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Amplitude: {params.amplitude}
              </label>
              <Slider
                value={[params.amplitude]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitude: v }))}
                min={5}
                max={80}
                step={5}
                className="w-full"
              />
            </div>

            {/* Letter Spacing */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Letter Spacing: {params.letterSpacing.toFixed(1)}
              </label>
              <Slider
                value={[params.letterSpacing]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, letterSpacing: v }))}
                min={0.8}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Trails */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Trails: {params.trails ? "On" : "Off"}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setParams(prev => ({ ...prev, trails: true }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all
                    ${params.trails
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  On
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, trails: false }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all
                    ${!params.trails
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  Off
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
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Text as living matter - letters breathe, pulse, and dance with physics-based motion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
