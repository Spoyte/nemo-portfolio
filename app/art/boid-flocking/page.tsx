"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  BoidsFlockingParams,
  boidsFlockingDefaultParams,
  renderBoidsFlocking,
  resetBoids,
  setBoidsMousePosition,
} from "@/lib/art/boids-flocking";
import { Play, Pause, RefreshCw, Bird, Info, MousePointer2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// --- Types ---

const COLOR_SCHEMES = ["neon", "sunset", "ocean", "forest", "cosmic"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];

// --- Constants ---

const COLOR_STYLES: Record<ColorScheme, { name: string; gradient: string; accent: string }> = {
  neon: { name: "Neon", gradient: "from-fuchsia-500 to-cyan-400", accent: "text-fuchsia-400" },
  sunset: { name: "Sunset", gradient: "from-rose-500 to-amber-400", accent: "text-rose-400" },
  ocean: { name: "Ocean", gradient: "from-cyan-600 to-blue-400", accent: "text-cyan-400" },
  forest: { name: "Forest", gradient: "from-emerald-600 to-lime-400", accent: "text-emerald-400" },
  cosmic: { name: "Cosmic", gradient: "from-violet-600 to-indigo-400", accent: "text-violet-400" },
};

// --- Components ---

const InfoCard = memo(function InfoCard({ boidCount }: { boidCount: number }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-fuchsia-400">Emergent Flocking</h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-950/50 px-2 py-1 rounded">
          {boidCount} boids
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-3">
        Individual agents following simple local rules create complex collective behavior.
        No single boid knows the flock&apos;s shape — they only see their neighbors.
      </p>
      <code className="text-xs text-slate-500 block bg-slate-950/50 p-2 rounded font-mono">
        separation + alignment + cohesion = emergence
      </code>
    </div>
  );
});

const ControlSection = memo(function ControlSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
        <Icon className="w-4 h-4" />
        {title}
      </label>
      {children}
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
      {COLOR_SCHEMES.map((scheme) => (
        <button
          key={scheme}
          onClick={() => onChange(scheme)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all capitalize
            ${value === scheme
              ? "bg-slate-700 text-white"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
            }
          `}
        >
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${COLOR_STYLES[scheme].gradient}`} />
          {COLOR_STYLES[scheme].name}
        </button>
      ))}
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
        <span className="text-sm text-slate-500">{format(value)}</span>
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

const ToggleControl = memo(function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all
        ${value
          ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30"
          : "bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-800"
        }
      `}
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">{value ? "On" : "Off"}</span>
    </button>
  );
});

// --- Main Page Component ---

export default function BoidsFlockingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<BoidsFlockingParams>(boidsFlockingDefaultParams);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const width = Math.min(container.clientWidth, 900);
      const height = Math.min(window.innerHeight * 0.6, 600);
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Mouse tracking for boid interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvasRef.current?.width || 0) / rect.width;
      const y = (e.clientY - rect.top) * (canvasRef.current?.height || 0) / rect.height;
      setBoidsMousePosition(x, y);
    };

    const handleMouseLeave = () => {
      setBoidsMousePosition(null, null);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (isPlaying) {
        timeRef.current += 16;
        renderBoidsFlocking(ctx, params, timeRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const regenerate = useCallback(() => {
    resetBoids();
    timeRef.current = 0;
  }, []);

  const updateParam = useCallback(<K extends keyof BoidsFlockingParams>(
    key: K,
    value: BoidsFlockingParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Boids Flocking</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Emergent collective behavior from simple local rules. Each boid follows three principles:
            avoid crowding, match velocity, and move toward the center of neighbors.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr,360px] gap-8 items-start">
          {/* Canvas */}
          <div className="flex flex-col items-center">
            <div 
              ref={containerRef}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 bg-black cursor-crosshair"
            >
              <canvas
                ref={canvasRef}
                className="block"
                style={{ imageRendering: "pixelated" }}
              />
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
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Flock
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <aside className="space-y-6">
            <InfoCard boidCount={params.boidCount} />

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Bird className="w-5 h-5 text-fuchsia-400" />
                Settings
              </h2>

              <ControlSection title="Flock Size" icon={Bird}>
                <SliderControl
                  label="Boid Count"
                  value={params.boidCount}
                  min={50}
                  max={300}
                  step={10}
                  onChange={(v) => {
                    updateParam("boidCount", v);
                    resetBoids();
                  }}
                />
              </ControlSection>

              <ControlSection title="Color Scheme" icon={Bird}>
                <ColorSelector
                  value={params.colorScheme}
                  onChange={(scheme) => updateParam("colorScheme", scheme)}
                />
              </ControlSection>

              <ControlSection title="Perception" icon={Bird}>
                <div className="space-y-4">
                  <SliderControl
                    label="Visual Range"
                    value={params.visualRange}
                    min={50}
                    max={150}
                    step={10}
                    onChange={(v) => updateParam("visualRange", v)}
                  />
                  <SliderControl
                    label="Protected Range"
                    value={params.protectedRange}
                    min={10}
                    max={40}
                    step={5}
                    onChange={(v) => updateParam("protectedRange", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Behavior Weights" icon={Bird}>
                <div className="space-y-4">
                  <SliderControl
                    label="Separation"
                    value={params.separationFactor}
                    min={0.01}
                    max={0.1}
                    step={0.01}
                    format={(v) => v.toFixed(2)}
                    onChange={(v) => updateParam("separationFactor", v)}
                  />
                  <SliderControl
                    label="Alignment"
                    value={params.alignmentFactor}
                    min={0.01}
                    max={0.1}
                    step={0.01}
                    format={(v) => v.toFixed(2)}
                    onChange={(v) => updateParam("alignmentFactor", v)}
                  />
                  <SliderControl
                    label="Cohesion"
                    value={params.cohesionFactor}
                    min={0.001}
                    max={0.01}
                    step={0.001}
                    format={(v) => v.toFixed(3)}
                    onChange={(v) => updateParam("cohesionFactor", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Physics" icon={Bird}>
                <div className="space-y-4">
                  <SliderControl
                    label="Max Speed"
                    value={params.maxSpeed}
                    min={3}
                    max={15}
                    step={1}
                    onChange={(v) => updateParam("maxSpeed", v)}
                  />
                  <SliderControl
                    label="Min Speed"
                    value={params.minSpeed}
                    min={2}
                    max={8}
                    step={1}
                    onChange={(v) => updateParam("minSpeed", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Visualization" icon={Bird}>
                <div className="space-y-2">
                  <ToggleControl
                    label="Show Trails"
                    value={params.showTrails}
                    onChange={(v) => updateParam("showTrails", v)}
                  />
                  {params.showTrails && (
                    <SliderControl
                      label="Trail Length"
                      value={params.trailLength}
                      min={5}
                      max={50}
                      step={5}
                      onChange={(v) => updateParam("trailLength", v)}
                    />
                  )}
                  <ToggleControl
                    label="Mouse Interaction"
                    value={params.mouseInteraction}
                    onChange={(v) => updateParam("mouseInteraction", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Appearance" icon={Bird}>
                <SliderControl
                  label="Boid Size"
                  value={params.boidSize}
                  min={2}
                  max={8}
                  step={1}
                  onChange={(v) => updateParam("boidSize", v)}
                />
              </ControlSection>
            </div>

            <footer className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 text-xs text-slate-500 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Craig Reynolds&apos; Boids algorithm (1986) demonstrates how complex flocking
                  behavior emerges from three simple rules applied locally by each agent.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <MousePointer2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Move your mouse over the canvas to interact with the flock — they&apos;ll
                  avoid the cursor when mouse interaction is enabled.
                </p>
              </div>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}
