"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { dla } from "@/lib/art/dla";
import { Play, Pause, RefreshCw, Sparkles, Zap, Palette, Wind } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// --- Types ---

const COLOR_SCHEMES = ["lightning", "coral", "frost", "copper", "ember", "midnight"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];

interface DLAParams {
  particleCount: number;
  stickiness: number;
  branchFactor: number;
  colorScheme: ColorScheme;
  animationSpeed: number;
  seed: number;
}

// --- Constants ---

const SCHEME_INFO: Record<ColorScheme, { name: string; description: string; gradient: string }> = {
  lightning: {
    name: "Lightning",
    description: "Electric blue-white energy discharge patterns",
    gradient: "from-blue-400 via-white to-purple-500",
  },
  coral: {
    name: "Coral Reef",
    description: "Warm organic structures reminiscent of underwater growth",
    gradient: "from-pink-400 via-orange-300 to-cyan-300",
  },
  frost: {
    name: "Winter Frost",
    description: "Crystalline ice formations on cold glass",
    gradient: "from-white via-cyan-100 to-blue-200",
  },
  copper: {
    name: "Copper Patina",
    description: "Oxidized metal with earthy warmth",
    gradient: "from-amber-600 via-orange-400 to-emerald-600",
  },
  ember: {
    name: "Burning Ember",
    description: "Glowing heat and flame-like tendrils",
    gradient: "from-red-600 via-orange-500 to-yellow-400",
  },
  midnight: {
    name: "Midnight",
    description: "Deep space nebula with subtle color",
    gradient: "from-indigo-900 via-purple-800 to-slate-900",
  },
};

const DEFAULT_PARAMS: DLAParams = {
  particleCount: 2000,
  stickiness: 1.2,
  branchFactor: 0.8,
  colorScheme: "lightning",
  animationSpeed: 2,
  seed: 42,
};

// --- Components ---

const InfoCard = memo(function InfoCard() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-medium text-cyan-400 mb-2">Diffusion-Limited Aggregation</h3>
      <p className="text-sm text-slate-400 mb-3">
        Particles perform random walks until they stick to a growing cluster, 
        creating organic fractal structures found in nature — from lightning bolts 
        to coral reefs to frost patterns on windows.
      </p>
      <code className="text-xs text-slate-500 block bg-slate-950/50 p-2 rounded font-mono">
        random_walk → collision → stick → branch
      </code>
    </div>
  );
});

const ColorSelector = memo(function ColorSelector({
  value,
  onChange,
}: {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {COLOR_SCHEMES.map((scheme) => {
        const info = SCHEME_INFO[scheme];
        return (
          <button
            key={scheme}
            onClick={() => onChange(scheme)}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all capitalize text-left
              ${value === scheme
                ? "bg-slate-700 text-white ring-1 ring-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
              }
            `}
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${info.gradient} shrink-0`} />
            <span className="truncate">{info.name}</span>
          </button>
        );
      })}
    </div>
  );
});

const SliderControl = memo(function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm text-slate-500 font-mono">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
});

// --- Main Page Component ---

export default function DiffusionAggregationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<DLAParams>(DEFAULT_PARAMS);
  const [isGenerating, setIsGenerating] = useState(false);

  // Render the DLA
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsGenerating(true);
    
    // Use requestAnimationFrame to not block the UI
    requestAnimationFrame(() => {
      dla.generate(ctx, params, timeRef.current);
      setIsGenerating(false);
    });
  }, [params]);

  // Animation loop for growth
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      timeRef.current += 16;
      
      // Only re-render periodically to show growth
      if (timeRef.current % 100 < 20) {
        render();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, render]);

  // Initial render and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, 700);
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      // Re-render after resize
      setTimeout(render, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    
    // Initial render
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [render]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const regenerate = useCallback(() => {
    timeRef.current = 0;
    setParams((prev) => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
  }, []);

  const updateParam = useCallback(<K extends keyof DLAParams>(
    key: K,
    value: DLAParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const currentScheme = SCHEME_INFO[params.colorScheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Diffusion Aggregation</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Watch organic fractal structures emerge as particles wander randomly 
            and stick together — the same process that creates lightning, coral, and frost.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr,360px] gap-8 items-start">
          {/* Canvas */}
          <div className="flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 bg-black">
              <canvas
                ref={canvasRef}
                className="block"
                style={{ imageRendering: "pixelated" }}
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full border-slate-700 hover:bg-slate-800"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={regenerate}
                className="rounded-full border-slate-700 hover:bg-slate-800"
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                New Seed
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <aside className="space-y-6">
            <InfoCard />

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Settings
              </h2>

              {/* Color Scheme */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Palette className="w-4 h-4" />
                  Color Scheme
                </label>
                <ColorSelector
                  value={params.colorScheme}
                  onChange={(scheme) => updateParam("colorScheme", scheme)}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {currentScheme.description}
                </p>
              </div>

              {/* Particles */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Zap className="w-4 h-4" />
                  Particles
                </label>
                <SliderControl
                  label="Count"
                  value={params.particleCount}
                  min={500}
                  max={5000}
                  step={500}
                  format={(v) => v.toLocaleString()}
                  onChange={(v) => updateParam("particleCount", v)}
                />
              </div>

              {/* Stickiness */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Wind className="w-4 h-4" />
                  Physics
                </label>
                <div className="space-y-4">
                  <SliderControl
                    label="Stickiness"
                    value={params.stickiness}
                    min={0.5}
                    max={3}
                    step={0.1}
                    onChange={(v) => updateParam("stickiness", v)}
                  />
                  <SliderControl
                    label="Branching"
                    value={params.branchFactor}
                    min={0.3}
                    max={1.5}
                    step={0.1}
                    onChange={(v) => updateParam("branchFactor", v)}
                  />
                </div>
              </div>

              {/* Animation */}
              <div className="mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Sparkles className="w-4 h-4" />
                  Growth
                </label>
                <SliderControl
                  label="Speed"
                  value={params.animationSpeed}
                  min={0}
                  max={5}
                  step={0.5}
                  format={(v) => v === 0 ? "Static" : `${v}x`}
                  onChange={(v) => updateParam("animationSpeed", v)}
                />
              </div>
            </div>

            <footer className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 text-xs text-slate-500 space-y-2">
              <p>
                <strong className="text-slate-400">DLA</strong> is a process where 
                particles undergoing Brownian motion cluster together to form aggregates.
              </p>
              <p>
                First described by Witten and Sander in 1981, it explains patterns 
                in electrodeposition, dielectric breakdown, and mineral deposition.
              </p>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}
