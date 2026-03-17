"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { fourierSynthesisDefaultParams, FourierSynthesisParams } from "@/lib/art/fourier-synthesis";
import { Palette, Pause, Play, Sparkles, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type Waveform = FourierSynthesisParams["waveform"];
type ColorMode = FourierSynthesisParams["colorMode"];

const WAVEFORMS: Waveform[] = ["sawtooth", "square", "triangle", "pulse", "custom"];
const COLOR_MODES: ColorMode[] = ["spectrum", "harmonic", "rainbow", "monochrome"];

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function ControlSlider({ label, value, min, max, step, onChange }: ControlSliderProps) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        <SlidersHorizontal className="w-4 h-4" />
        {label}: {value.toFixed(step < 1 ? 2 : 0)}
      </label>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
    </div>
  );
}

interface ToggleGridProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}

function ToggleGrid<T extends string>({ options, value, onChange }: ToggleGridProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-2 rounded-lg text-sm transition-all capitalize
            ${value === opt
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function FourierSynthesisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<FourierSynthesisParams>(fourierSynthesisDefaultParams);

  const updateParam = useCallback(<K extends keyof FourierSynthesisParams>(key: K, value: FourierSynthesisParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const animate = () => {
      if (isPlaying) time += 16;
      fourierSynthesisDefaultParams.generate(ctx, params, time);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const width = Math.min(rect.width, 900);
      const height = Math.min(window.innerHeight * 0.6, 600);
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const randomize = useCallback(() => {
    setParams({
      fundamentalFreq: 0.5 + Math.random() * 2.5,
      harmonics: Math.floor(1 + Math.random() * 19),
      harmonicDecay: 0.1 + Math.random() * 1.4,
      waveform: WAVEFORMS[Math.floor(Math.random() * WAVEFORMS.length)],
      showComponents: Math.random() > 0.3,
      showSum: Math.random() > 0.2,
      showCircles: Math.random() > 0.3,
      showWaveform: Math.random() > 0.2,
      componentOpacity: 0.1 + Math.random() * 0.9,
      lineThickness: 1 + Math.random() * 4,
      animationSpeed: Math.random() * 3,
      freezePhase: Math.random() > 0.8,
      colorMode: COLOR_MODES[Math.floor(Math.random() * COLOR_MODES.length)],
      phaseOffset: Math.random() * Math.PI * 2,
      pulseWidth: 0.1 + Math.random() * 0.8,
    });
  }, []);

  const reset = useCallback(() => setParams(fourierSynthesisDefaultParams), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Fourier Synthesis</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Visualize how complex waveforms are built from simple sine waves. Watch rotating epicycles 
            trace out waveforms while individual harmonics combine to create sawtooth, square, triangle, 
            and custom waves.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50">
                <canvas ref={canvasRef} className="block" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying((p) => !p)}
                className="w-12 h-12 rounded-full border-slate-700 hover:bg-slate-800"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="outline" onClick={randomize} className="rounded-full border-slate-700 hover:bg-slate-800">
                <Sparkles className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button variant="ghost" onClick={reset} className="rounded-full text-slate-500 hover:text-slate-300">
                Reset
              </Button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Settings
            </h2>

            <ControlSlider label="Fundamental Frequency" value={params.fundamentalFreq} min={0.5} max={3} step={0.1} onChange={(v) => updateParam("fundamentalFreq", v)} />
            <ControlSlider label="Harmonics" value={params.harmonics} min={1} max={20} step={1} onChange={(v) => updateParam("harmonics", v)} />
            <ControlSlider label="Harmonic Decay" value={params.harmonicDecay} min={0.1} max={1.5} step={0.05} onChange={(v) => updateParam("harmonicDecay", v)} />

            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                Waveform
              </label>
              <ToggleGrid options={WAVEFORMS} value={params.waveform} onChange={(v) => updateParam("waveform", v)} />
            </div>

            <ControlSlider label="Component Opacity" value={params.componentOpacity} min={0.1} max={1} step={0.05} onChange={(v) => updateParam("componentOpacity", v)} />
            <ControlSlider label="Line Thickness" value={params.lineThickness} min={1} max={5} step={0.5} onChange={(v) => updateParam("lineThickness", v)} />
            <ControlSlider label="Animation Speed" value={params.animationSpeed} min={0} max={3} step={0.1} onChange={(v) => updateParam("animationSpeed", v)} />

            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Palette className="w-4 h-4" />
                Color Mode
              </label>
              <ToggleGrid options={COLOR_MODES} value={params.colorMode} onChange={(v) => updateParam("colorMode", v)} />
            </div>

            <ControlSlider label="Phase Offset" value={params.phaseOffset} min={0} max={Math.PI * 2} step={0.1} onChange={(v) => updateParam("phaseOffset", v)} />
            <ControlSlider label="Pulse Width" value={params.pulseWidth} min={0.1} max={0.9} step={0.05} onChange={(v) => updateParam("pulseWidth", v)} />

            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500">
              <p>Fourier synthesis demonstrates how any periodic waveform can be constructed from sine waves. The rotating epicycles represent each harmonic's contribution.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
