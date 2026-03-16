"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sonicHarmonographParams } from "@/lib/art/sonic-harmonograph";
import { Palette, Pause, Play, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Params {
  points: number;
  frequencyX2: number;
  frequencyY1: number;
  frequencyY2: number;
  amplitudeX1: number;
  amplitudeX2: number;
  amplitudeY1: number;
  amplitudeY2: number;
  damping: number;
  phaseX1: number;
  phaseX2: number;
  phaseY1: number;
  phaseY2: number;
  lineWidth: number;
  opacity: number;
  iterations: number;
  colorScheme: string;
  backgroundStyle: string;
  rainbowSpeed: number;
  rotation: number;
  autoRotate: string;
  rotationSpeed: number;
  audioEnabled: string;
  baseFrequency: number;
  fmDepth: number;
  harmonicRatio: number;
  audioVolume: number;
  audioVisualSync: number;
}

const defaultParams: Params = {
  points: 2.01 },
  frequencyX2: 3.02 },
  frequencyY1: 3.0 },
  frequencyY2: 2.0 },
  amplitudeX1: 200 },
  amplitudeX2: 100 },
  amplitudeY1: 200 },
  amplitudeY2: 100 },
  damping: 0.002 },
  phaseX1: 0 },
  phaseX2: Math.PI / 2 },
  phaseY1: Math.PI / 4 },
  phaseY2: Math.PI / 3 },
  lineWidth: 0.5 },
  opacity: 0.6 },
  iterations: 5000 },
  colorScheme: "gradient" },
  backgroundStyle: "black" },
  rainbowSpeed: 0.5 },
  rotation: 0 },
  autoRotate: "false" },
  rotationSpeed: 0.2 },
  audioEnabled: "false" },
  baseFrequency: 220 },
  fmDepth: 100 },
  harmonicRatio: 1.5 },
  audioVolume: 0.15 },
  audioVisualSync: 1 },
};

export default function SonicHarmonographPage() {
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
        sonicHarmonographParams.generate(ctx, params, time);
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
      points: 0.1 + Math.random() * 9.9,
      frequencyX2: 0.1 + Math.random() * 9.9,
      frequencyY1: 0.1 + Math.random() * 9.9,
      frequencyY2: 0.1 + Math.random() * 9.9,
      amplitudeX1: 0 + Math.random() * 300,
      amplitudeX2: 0 + Math.random() * 200,
      amplitudeY1: 0 + Math.random() * 300,
      amplitudeY2: 0 + Math.random() * 200,
      damping: 0.0001 + Math.random() * 0.0199,
      phaseX1: 0 + Math.random() * 100,
      phaseX2: 0 + Math.random() * 100,
      phaseY1: 0 + Math.random() * 100,
      phaseY2: 0 + Math.random() * 100,
      lineWidth: 0.1 + Math.random() * 2.9,
      opacity: 0.1 + Math.random() * 0.9,
      iterations: 1000 + Math.random() * 19000,
      colorScheme: ["monochrome", "gradient", "rainbow", "fire", "ocean", "neon", "gold"][Math.floor(Math.random() * 7)],
      backgroundStyle: ["black", "dark-blue", "deep-purple", "void"][Math.floor(Math.random() * 4)],
      rainbowSpeed: 0 + Math.random() * 5,
      rotation: Math.floor(0 + Math.random() * 360),
      autoRotate: ["true", "false"][Math.floor(Math.random() * 2)],
      rotationSpeed: -2 + Math.random() * 4,
      audioEnabled: ["true", "false"][Math.floor(Math.random() * 2)],
      baseFrequency: 50 + Math.random() * 350,
      fmDepth: 0 + Math.random() * 500,
      harmonicRatio: 0.5 + Math.random() * 3.5,
      audioVolume: 0 + Math.random() * 0.5,
      audioVisualSync: 0 + Math.random() * 2,
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
          <h1 className="text-4xl font-light tracking-tight mb-2">Freq X1</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Audio-visual harmonograph with FM synthesis — each pendulum drives both visual motion and audio frequency. Enable audio for a unified sensory experience.
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

            {/* Points */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Points: {params.points.toFixed(2)}
              </label>
              <Slider
                value={[params.points]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, points: v }))}
                min={0.1}
                max={10}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* FrequencyX2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FrequencyX2: {params.frequencyX2.toFixed(2)}
              </label>
              <Slider
                value={[params.frequencyX2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, frequencyX2: v }))}
                min={0.1}
                max={10}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* FrequencyY1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FrequencyY1: {params.frequencyY1.toFixed(2)}
              </label>
              <Slider
                value={[params.frequencyY1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, frequencyY1: v }))}
                min={0.1}
                max={10}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* FrequencyY2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FrequencyY2: {params.frequencyY2.toFixed(2)}
              </label>
              <Slider
                value={[params.frequencyY2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, frequencyY2: v }))}
                min={0.1}
                max={10}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* AmplitudeX1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AmplitudeX1: {params.amplitudeX1}
              </label>
              <Slider
                value={[params.amplitudeX1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitudeX1: v }))}
                min={0}
                max={300}
                step={10}
                className="w-full"
              />
            </div>

            {/* AmplitudeX2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AmplitudeX2: {params.amplitudeX2}
              </label>
              <Slider
                value={[params.amplitudeX2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitudeX2: v }))}
                min={0}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            {/* AmplitudeY1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AmplitudeY1: {params.amplitudeY1}
              </label>
              <Slider
                value={[params.amplitudeY1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitudeY1: v }))}
                min={0}
                max={300}
                step={10}
                className="w-full"
              />
            </div>

            {/* AmplitudeY2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AmplitudeY2: {params.amplitudeY2}
              </label>
              <Slider
                value={[params.amplitudeY2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, amplitudeY2: v }))}
                min={0}
                max={200}
                step={10}
                className="w-full"
              />
            </div>

            {/* Damping */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Damping: {params.damping.toFixed(2)}
              </label>
              <Slider
                value={[params.damping]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, damping: v }))}
                min={0.0001}
                max={0.02}
                step={0.0001}
                className="w-full"
              />
            </div>

            {/* PhaseX1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PhaseX1: {params.phaseX1.toFixed(2)}
              </label>
              <Slider
                value={[params.phaseX1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, phaseX1: v }))}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* PhaseX2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PhaseX2: {params.phaseX2.toFixed(2)}
              </label>
              <Slider
                value={[params.phaseX2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, phaseX2: v }))}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* PhaseY1 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PhaseY1: {params.phaseY1.toFixed(2)}
              </label>
              <Slider
                value={[params.phaseY1]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, phaseY1: v }))}
                min={0}
                max={Math.PI * 2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* PhaseY2 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                PhaseY2: {params.phaseY2.toFixed(2)}
              </label>
              <Slider
                value={[params.phaseY2]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, phaseY2: v }))}
                min={0}
                max={Math.PI * 2}
                step={0.1}
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
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Opacity */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Opacity: {params.opacity.toFixed(2)}
              </label>
              <Slider
                value={[params.opacity]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, opacity: v }))}
                min={0.1}
                max={1}
                step={0.05}
                className="w-full"
              />
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
                min={1000}
                max={20000}
                step={500}
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
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "neon" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "neon"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  neon
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, colorScheme: "gold" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.colorScheme === "gold"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  gold
                </button>
              </div>
            </div>

            {/* BackgroundStyle */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BackgroundStyle
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "black" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "black"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  black
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "dark-blue" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "dark-blue"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  dark-blue
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "deep-purple" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "deep-purple"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  deep-purple
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, backgroundStyle: "void" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.backgroundStyle === "void"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  void
                </button>
              </div>
            </div>

            {/* RainbowSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                RainbowSpeed: {params.rainbowSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.rainbowSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rainbowSpeed: v }))}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {params.rotation}
              </label>
              <Slider
                value={[params.rotation]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotation: v }))}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>

            {/* AutoRotate */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AutoRotate
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, autoRotate: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.autoRotate === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, autoRotate: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.autoRotate === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* RotationSpeed */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <RotateCw className="w-4 h-4" />
                RotationSpeed: {params.rotationSpeed.toFixed(2)}
              </label>
              <Slider
                value={[params.rotationSpeed]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, rotationSpeed: v }))}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* AudioEnabled */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AudioEnabled
              </label>
              <div className="grid grid-cols-2 gap-2">
                                <button
                  onClick={() => setParams(prev => ({ ...prev, audioEnabled: "true" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.audioEnabled === "true"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  true
                </button>
                <button
                  onClick={() => setParams(prev => ({ ...prev, audioEnabled: "false" }))}
                  className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
                    ${params.audioEnabled === "false"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
                    }
                  `}
                >
                  false
                </button>
              </div>
            </div>

            {/* BaseFrequency */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                BaseFrequency: {params.baseFrequency}
              </label>
              <Slider
                value={[params.baseFrequency]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, baseFrequency: v }))}
                min={50}
                max={400}
                step={10}
                className="w-full"
              />
            </div>

            {/* FmDepth */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                FmDepth: {params.fmDepth}
              </label>
              <Slider
                value={[params.fmDepth]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, fmDepth: v }))}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
            </div>

            {/* HarmonicRatio */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                HarmonicRatio: {params.harmonicRatio.toFixed(2)}
              </label>
              <Slider
                value={[params.harmonicRatio]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, harmonicRatio: v }))}
                min={0.5}
                max={4}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* AudioVolume */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AudioVolume: {params.audioVolume.toFixed(2)}
              </label>
              <Slider
                value={[params.audioVolume]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, audioVolume: v }))}
                min={0}
                max={0.5}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* AudioVisualSync */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                AudioVisualSync: {params.audioVisualSync.toFixed(2)}
              </label>
              <Slider
                value={[params.audioVisualSync]}
                onValueChange={([v]) => setParams(prev => ({ ...prev, audioVisualSync: v }))}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Audio-visual harmonograph with FM synthesis — each pendulum drives both visual motion and audio frequency. Enable audio for a unified sensory experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
