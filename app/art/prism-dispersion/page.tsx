"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { prismDispersion, prismDispersionDefaultParams } from "@/lib/art/prism-dispersion";
import { Pause, Play, Sparkles, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  params: number;
  incidentAngle: number;
  baseRefractiveIndex: number;
  dispersionStrength: number;
  beamWidth: number;
  showIndividualRays: string;
  showSpectrum: string;
  glowIntensity: number;
  sweepSpeed: number;
}

const defaultParams: Params = {
  params: prismDispersionDefaultParams.params,
  incidentAngle: prismDispersionDefaultParams.incidentAngle,
  baseRefractiveIndex: prismDispersionDefaultParams.baseRefractiveIndex,
  dispersionStrength: prismDispersionDefaultParams.dispersionStrength,
  beamWidth: prismDispersionDefaultParams.beamWidth,
  showIndividualRays: prismDispersionDefaultParams.showIndividualRays,
  showSpectrum: prismDispersionDefaultParams.showSpectrum,
  glowIntensity: prismDispersionDefaultParams.glowIntensity,
  sweepSpeed: prismDispersionDefaultParams.sweepSpeed,
};

export default function PrismDispersionPage() {
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
        prismDispersion.generate(ctx, params, time);
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
      params: 30 + Math.random() * 60,
      incidentAngle: -30 + Math.random() * 60,
      baseRefractiveIndex: 1.3 + Math.random() * 0.7,
      dispersionStrength: 0.001 + Math.random() * 0.019,
      beamWidth: 5 + Math.random() * 35,
      showIndividualRays: ["yes", "no"][Math.floor(Math.random() * 2)],
      showSpectrum: ["yes", "no"][Math.floor(Math.random() * 2)],
      glowIntensity: 0 + Math.random() * 30,
      sweepSpeed: 0 + Math.random() * 2,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Prism Dispersion</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Physics simulation of white light splitting into spectral colors through a glass prism
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
                min={30}
                max={90}
                step={5}
                className="w-full"
              />
            </div>

            {/* IncidentAngle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                IncidentAngle: {params.incidentAngle}
              </label>
              <Slider
                value={[params.incidentAngle]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, incidentAngle: v }))}
                min={-30}
                max={30}
                step={5}
                className="w-full"
              />
            </div>

            {/* BaseRefractiveIndex */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BaseRefractiveIndex: {params.baseRefractiveIndex.toFixed(2)}
              </label>
              <Slider
                value={[params.baseRefractiveIndex]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, baseRefractiveIndex: v }))}
                min={1.3}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* DispersionStrength */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                DispersionStrength: {params.dispersionStrength.toFixed(2)}
              </label>
              <Slider
                value={[params.dispersionStrength]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, dispersionStrength: v }))}
                min={0.001}
                max={0.02}
                step={0.001}
                className="w-full"
              />
            </div>

            {/* BeamWidth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BeamWidth: {params.beamWidth}
              </label>
              <Slider
                value={[params.beamWidth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, beamWidth: v }))}
                min={5}
                max={40}
                step={5}
                className="w-full"
              />
            </div>

            {/* ShowIndividualRays */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowIndividualRays
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showIndividualRays: "yes" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showIndividualRays === "yes"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  yes
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showIndividualRays: "no" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showIndividualRays === "no"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  no
                </button>
              </div>
            </div>

            {/* ShowSpectrum */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ShowSpectrum
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, showSpectrum: "yes" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showSpectrum === "yes"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  yes
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, showSpectrum: "no" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.showSpectrum === "no"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  no
                </button>
              </div>
            </div>

            {/* GlowIntensity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Sun className="w-4 h-4" />
                GlowIntensity: {params.glowIntensity}
              </label>
              <Slider
                value={[params.glowIntensity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, glowIntensity: v }))}
                min={0}
                max={30}
                step={5}
                className="w-full"
              />
            </div>

            {/* SweepSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                SweepSpeed: {params.sweepSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.sweepSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, sweepSpeed: v }))}
                min={0}
                max={2}
                step={0.25}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Physics simulation of white light splitting into spectral colors through a glass prism</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
