"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fourierSynthesisDefaultParams } from "@/lib/art/fourier-synthesis";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  waveformPoints: number;
  harmonics: number;
  harmonicDecay: number;
  waveform: string;
  showComponents: number;
  showSum: number;
  showCircles: number;
  showWaveform: number;
  componentOpacity: number;
  lineThickness: number;
  animationSpeed: number;
  freezePhase: number;
  colorMode: string;
  phaseOffset: number;
  pulseWidth: number;
}

const defaultParams: Params = {
  waveformPoints: 1,
  harmonics: 8,
  harmonicDecay: 1,
  waveform: "sawtooth",
  showComponents: true,
  showSum: true,
  showCircles: true,
  showWaveform: true,
  componentOpacity: 0.4,
  lineThickness: 2,
  animationSpeed: 1,
  freezePhase: false,
  colorMode: "spectrum",
  phaseOffset: 0,
  pulseWidth: 0.5,
};

export default function FourierSynthesisPage() {
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
        fourierSynthesisDefaultParams.generate(ctx, params, time);
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
      waveformPoints: 0.5 + Math.random() * 2.5,
      harmonics: Math.floor(1 + Math.random() * 19),
      harmonicDecay: 0.1 + Math.random() * 1.4,
      waveform: ["sawtooth", "square", "triangle", "pulse", "custom"][Math.floor(Math.random() * 5)],




      componentOpacity: 0.1 + Math.random() * 0.9,
      lineThickness: 1 + Math.random() * 4,
      animationSpeed: 0 + Math.random() * 3,

      colorMode: ["spectrum", "harmonic", "rainbow", "monochrome"][Math.floor(Math.random() * 4)],
      phaseOffset: 0 + Math.random() * 100,
      pulseWidth: 0.1 + Math.random() * 0.8,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Fourier Synthesis</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Visualize how complex waveforms are built from simple sine waves. Watch rotating epicycles trace out waveforms while individual harmonics combine to create sawtooth, square, triangle, and custom waves. A beautiful demonstration of the mathematics behind sound and signal processing.
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

            {/* WaveformPoints */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                WaveformPoints: {params.waveformPoints.toFixed(2)}
              </label>
              <Slider
                value={[params.waveformPoints]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, waveformPoints: v }))}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Harmonics */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Harmonics: {params.harmonics}
              </label>
              <Slider
                value={[params.harmonics]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, harmonics: v }))}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* HarmonicDecay */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                HarmonicDecay: {params.harmonicDecay.toFixed(2)}
              </label>
              <Slider
                value={[params.harmonicDecay]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, harmonicDecay: v }))}
                min={0.1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Waveform */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Waveform
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, waveform: "sawtooth" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.waveform === "sawtooth"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  sawtooth
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, waveform: "square" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.waveform === "square"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  square
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, waveform: "triangle" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.waveform === "triangle"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  triangle
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, waveform: "pulse" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.waveform === "pulse"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  pulse
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, waveform: "custom" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.waveform === "custom"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  custom
                </button>
              </div>
            </div>









            {/* ComponentOpacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                ComponentOpacity: {params.componentOpacity.toFixed(2)}
              </label>
              <Slider
                value={[params.componentOpacity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, componentOpacity: v }))}
                min={0.1}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* LineThickness */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                LineThickness: {params.lineThickness.toFixed(2)}
              </label>
              <Slider
                value={[params.lineThickness]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, lineThickness: v }))}
                min={1}
                max={5}
                step={0.5}
                className="w-full"
              />
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



            {/* ColorMode */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                ColorMode
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "spectrum" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "spectrum"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  spectrum
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "harmonic" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "harmonic"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  harmonic
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "rainbow" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "rainbow"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  rainbow
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorMode: "monochrome" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorMode === "monochrome"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  monochrome
                </button>
              </div>
            </div>

            {/* PhaseOffset */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PhaseOffset: {params.phaseOffset.toFixed(2)}
              </label>
              <Slider
                value={[params.phaseOffset]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, phaseOffset: v }))}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* PulseWidth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PulseWidth: {params.pulseWidth.toFixed(2)}
              </label>
              <Slider
                value={[params.pulseWidth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, pulseWidth: v }))}
                min={0.1}
                max={0.9}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Visualize how complex waveforms are built from simple sine waves. Watch rotating epicycles trace out waveforms while individual harmonics combine to create sawtooth, square, triangle, and custom waves. A beautiful demonstration of the mathematics behind sound and signal processing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
