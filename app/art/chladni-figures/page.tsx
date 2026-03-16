"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  ChladniFiguresParams,
  chladniFiguresDefaultParams,
  renderChladniFigures,
} from "@/lib/art/chladni-figures";
import { Play, Pause, RefreshCw, Waves, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// --- Types ---

const PLATE_SHAPES = ["square", "circle", "rectangle"] as const;
type PlateShape = (typeof PLATE_SHAPES)[number];

const COLOR_SCHEMES = ["electric", "ocean", "sunset", "heatmap", "monochrome"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];

interface ChladniInfo {
  name: string;
  description: string;
  physics: string;
}

// --- Constants ---

const SHAPE_INFO: Record<PlateShape, ChladniInfo> = {
  square: {
    name: "Square Plate",
    description:
      "The classic Chladni experiment. A square metal plate vibrates at specific frequencies, causing fine particles to settle along nodal lines where vibration amplitude is zero.",
    physics: "Eigenfunctions: sin(mπx)sin(nπy) + sin(nπx)sin(mπy)",
  },
  circle: {
    name: "Circular Plate",
    description:
      "Radial symmetry creates circular and star-like patterns. The Bessel functions that govern these modes appear throughout nature — from drumheads to quantum orbitals.",
    physics: "Bessel functions Jₘ(αₘₙ·r) · cos(mθ)",
  },
  rectangle: {
    name: "Rectangular Plate",
    description:
      "Asymmetric boundary conditions create distorted versions of square patterns. The aspect ratio introduces additional complexity to the mode structure.",
    physics: "Modified eigenfunctions with aspect ratio correction",
  },
};

const COLOR_STYLES: Record<ColorScheme, { name: string; gradient: string; accent: string }> = {
  electric: { name: "Electric", gradient: "from-cyan-400 to-fuchsia-500", accent: "text-cyan-400" },
  ocean: { name: "Ocean", gradient: "from-blue-400 to-cyan-300", accent: "text-blue-400" },
  sunset: { name: "Sunset", gradient: "from-amber-400 to-rose-500", accent: "text-amber-400" },
  heatmap: { name: "Heatmap", gradient: "from-yellow-400 to-red-600", accent: "text-orange-400" },
  monochrome: { name: "Mono", gradient: "from-slate-200 to-slate-400", accent: "text-slate-300" },
};

// --- Components ---

const InfoCard = memo(function InfoCard({ shape, m, n }: { shape: PlateShape; m: number; n: number }) {
  const info = SHAPE_INFO[shape];
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-cyan-400">{info.name}</h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-950/50 px-2 py-1 rounded">
          m={m}, n={n}
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-3">{info.description}</p>
      <code className="text-xs text-slate-500 block bg-slate-950/50 p-2 rounded font-mono">
        {info.physics}
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

const ShapeSelector = memo(function ShapeSelector({
  value,
  onChange,
}: {
  value: PlateShape;
  onChange: (shape: PlateShape) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PLATE_SHAPES.map((shape) => (
        <button
          key={shape}
          onClick={() => onChange(shape)}
          className={`
            px-3 py-2 rounded-lg text-sm transition-all capitalize
            ${value === shape
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
            }
          `}
        >
          {shape}
        </button>
      ))}
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
          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
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

export default function ChladniFiguresPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<ChladniFiguresParams>(chladniFiguresDefaultParams);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, 600);
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
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
        renderChladniFigures(ctx, params, timeRef.current);
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
    timeRef.current = 0;
    // Randomize mode numbers for discovery
    setParams((prev) => ({
      ...prev,
      m: Math.floor(Math.random() * 6) + 1,
      n: Math.floor(Math.random() * 6) + 1,
    }));
  }, []);

  const updateParam = useCallback(<K extends keyof ChladniFiguresParams>(
    key: K,
    value: ChladniFiguresParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Chladni Figures</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Cymatic patterns created by vibrating plates. Fine particles dance along nodal lines,
            revealing the hidden geometry of sound and the eigenfunctions of the wave equation.
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
                Random Mode
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <aside className="space-y-6">
            <InfoCard shape={params.mode} m={params.m} n={params.n} />

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                Settings
              </h2>

              <ControlSection title="Plate Shape" icon={Waves}>
                <ShapeSelector
                  value={params.mode}
                  onChange={(mode) => updateParam("mode", mode)}
                />
              </ControlSection>

              <ControlSection title="Vibration Modes" icon={Waves}>
                <div className="space-y-4">
                  <SliderControl
                    label="Mode M"
                    value={params.m}
                    min={1}
                    max={8}
                    step={1}
                    onChange={(v) => updateParam("m", v)}
                  />
                  <SliderControl
                    label="Mode N"
                    value={params.n}
                    min={1}
                    max={8}
                    step={1}
                    onChange={(v) => updateParam("n", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Color Scheme" icon={Waves}>
                <ColorSelector
                  value={params.colorScheme}
                  onChange={(scheme) => updateParam("colorScheme", scheme)}
                />
              </ControlSection>

              <ControlSection title="Visualization" icon={Waves}>
                <div className="space-y-2">
                  <ToggleControl
                    label="Show Particles"
                    value={params.showParticles}
                    onChange={(v) => updateParam("showParticles", v)}
                  />
                  <ToggleControl
                    label="Show Nodal Lines"
                    value={params.showLines}
                    onChange={(v) => updateParam("showLines", v)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Particles" icon={Waves}>
                <SliderControl
                  label="Density"
                  value={params.particleCount}
                  min={500}
                  max={8000}
                  step={500}
                  onChange={(v) => updateParam("particleCount", v)}
                />
              </ControlSection>

              <ControlSection title="Animation" icon={Waves}>
                <div className="space-y-4">
                  <SliderControl
                    label="Vibration Speed"
                    value={params.frequency}
                    min={0.1}
                    max={3}
                    step={0.1}
                    format={(v) => `${v}x`}
                    onChange={(v) => updateParam("frequency", v)}
                  />
                  <SliderControl
                    label="Intensity"
                    value={params.vibrationIntensity}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={(v) => updateParam("vibrationIntensity", v)}
                  />
                </div>
              </ControlSection>
            </div>

            <footer className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 text-xs text-slate-500 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Ernst Chladni (1756–1827) discovered these patterns by bowing the edge of
                  a metal plate covered with sand. The sand collects where the plate is
                  still — the nodal lines.
                </p>
              </div>
              <p>
                Each combination of mode numbers (m, n) produces a unique pattern based on
                the eigenfunctions of the wave equation for the plate's geometry.
              </p>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}
