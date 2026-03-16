"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { strangeAttractor } from "@/lib/art/strange-attractor";
import { Play, Pause, RefreshCw, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

// --- Types ---

const ATTRACTOR_TYPES = ["lorenz", "rossler", "aizawa", "thomas"] as const;
type AttractorType = (typeof ATTRACTOR_TYPES)[number];

const COLOR_SCHEMES = ["fire", "ocean", "neon", "gold"] as const;
type ColorScheme = (typeof COLOR_SCHEMES)[number];

interface AttractorMeta {
  name: string;
  description: string;
  equation: string;
}

interface AttractorParams {
  attractorType: AttractorType;
  particleCount: number;
  trailLength: number;
  colorScheme: ColorScheme;
  zoom: number;
  rotationSpeed: number;
  seed: number;
}

// --- Constants ---

const ATTRACTOR_INFO: Record<AttractorType, AttractorMeta> = {
  lorenz: {
    name: "Lorenz Attractor",
    description:
      "The classic butterfly-shaped chaotic system discovered by Edward Lorenz in 1963 while studying atmospheric convection.",
    equation: "dx/dt = σ(y - x), dy/dt = x(ρ - z) - y, dz/dt = xy - βz",
  },
  rossler: {
    name: "Rössler Attractor",
    description:
      "A simpler chaotic system with a single folded band, discovered by Otto Rössler in 1976.",
    equation: "dx/dt = -y - z, dy/dt = x + ay, dz/dt = b + z(x - c)",
  },
  aizawa: {
    name: "Aizawa Attractor",
    description:
      "A complex attractor with elegant spherical structure and internal chaos.",
    equation:
      "A multi-parameter system showing spherical chaos with intricate internal dynamics.",
  },
  thomas: {
    name: "Thomas Attractor",
    description:
      "A symmetric attractor based on sine functions, creating beautiful organic patterns.",
    equation: "dx/dt = sin(y) - bx, dy/dt = sin(z) - by, dz/dt = sin(x) - bz",
  },
};

const COLOR_STYLES: Record<ColorScheme, string> = {
  fire: "from-red-500 to-yellow-400",
  ocean: "from-cyan-500 to-blue-600",
  neon: "from-purple-500 to-pink-400",
  gold: "from-amber-400 to-yellow-600",
};

const DEFAULT_PARAMS: AttractorParams = {
  attractorType: "lorenz",
  particleCount: 2000,
  trailLength: 80,
  colorScheme: "fire",
  zoom: 12,
  rotationSpeed: 0.3,
  seed: 42,
};

// --- Components ---

const InfoCard = memo(function InfoCard({ type }: { type: AttractorType }) {
  const info = ATTRACTOR_INFO[type];
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-medium text-amber-400 mb-2">{info.name}</h3>
      <p className="text-sm text-slate-400 mb-3">{info.description}</p>
      <code className="text-xs text-slate-500 block bg-slate-950/50 p-2 rounded font-mono">
        {info.equation}
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

const TypeSelector = memo(function TypeSelector({
  value,
  onChange,
}: {
  value: AttractorType;
  onChange: (type: AttractorType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ATTRACTOR_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`
            px-3 py-2 rounded-lg text-sm transition-all capitalize
            ${value === type
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent"
            }
          `}
        >
          {type === "rossler" ? "Rössler" : type}
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
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${COLOR_STYLES[scheme]}`} />
          {scheme}
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

// --- Main Page Component ---

export default function StrangeAttractorsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rendererRef = useRef<{
    pixels: Uint8ClampedArray;
    width: number;
    height: number;
    drawLine: (x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number) => void;
  } | null>(null);
  const timeRef = useRef(0);
  const frameGeneratorRef = useRef<((renderer: typeof rendererRef.current) => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [params, setParams] = useState<AttractorParams>(DEFAULT_PARAMS);

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const size = Math.min(container.clientWidth, 600);
      const dpr = Math.min(window.devicePixelRatio, 2);

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const imageData = ctx.createImageData(canvas.width, canvas.height);

      rendererRef.current = {
        pixels: imageData.data,
        width: canvas.width,
        height: canvas.height,
        drawLine: (x1, y1, x2, y2, r, g, b, a) => {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const steps = Math.max(Math.abs(dx), Math.abs(dy));
          const pixels = rendererRef.current!.pixels;
          const width = rendererRef.current!.width;
          const height = rendererRef.current!.height;

          for (let i = 0; i <= steps; i++) {
            const x = Math.floor(x1 + (dx * i) / steps);
            const y = Math.floor(y1 + (dy * i) / steps);

            if (x >= 0 && x < width && y >= 0 && y < height) {
              const idx = (y * width + x) * 4;
              const alpha = a / 255;
              const invAlpha = 1 - alpha;
              pixels[idx] = Math.min(255, pixels[idx] * invAlpha + r * alpha);
              pixels[idx + 1] = Math.min(255, pixels[idx + 1] * invAlpha + g * alpha);
              pixels[idx + 2] = Math.min(255, pixels[idx + 2] * invAlpha + b * alpha);
              pixels[idx + 3] = 255;
            }
          }
        },
      };

      // Regenerate frame generator on resize
      frameGeneratorRef.current = strangeAttractor.generate(
        canvas.width,
        canvas.height,
        timeRef.current,
        params
      );
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [params]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rendererRef.current) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Create frame generator
    frameGeneratorRef.current = strangeAttractor.generate(
      canvas.width,
      canvas.height,
      timeRef.current,
      params
    );

    const animate = () => {
      if (isPlaying && frameGeneratorRef.current && rendererRef.current) {
        timeRef.current += 16;
        frameGeneratorRef.current(rendererRef.current);

        const imageData = new ImageData(
          rendererRef.current.pixels,
          rendererRef.current.width,
          rendererRef.current.height
        );
        ctx.putImageData(imageData, 0, 0);
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
    setParams((prev) => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
    timeRef.current = 0;
    // Clear canvas
    if (rendererRef.current) {
      rendererRef.current.pixels.fill(0);
    }
  }, []);

  const updateParam = useCallback(<K extends keyof AttractorParams>(
    key: K,
    value: AttractorParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Strange Attractors</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Mathematical chaos rendered beautiful. Watch as particles trace the invisible
            geometry of deterministic yet unpredictable systems.
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
                New Seed
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <aside className="space-y-6">
            <InfoCard type={params.attractorType} />

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Settings
              </h2>

              <ControlSection title="Attractor Type" icon={Sparkles}>
                <TypeSelector
                  value={params.attractorType}
                  onChange={(type) => updateParam("attractorType", type)}
                />
              </ControlSection>

              <ControlSection title="Color Scheme" icon={Sparkles}>
                <ColorSelector
                  value={params.colorScheme}
                  onChange={(scheme) => updateParam("colorScheme", scheme)}
                />
              </ControlSection>

              <ControlSection title="Particles" icon={Sparkles}>
                <SliderControl
                  label="Count"
                  value={params.particleCount}
                  min={500}
                  max={5000}
                  step={100}
                  onChange={(v) => updateParam("particleCount", v)}
                />
              </ControlSection>

              <ControlSection title="Trails" icon={Sparkles}>
                <SliderControl
                  label="Length"
                  value={params.trailLength}
                  min={20}
                  max={150}
                  step={10}
                  onChange={(v) => updateParam("trailLength", v)}
                />
              </ControlSection>

              <ControlSection title="View" icon={Sparkles}>
                <div className="space-y-4">
                  <SliderControl
                    label="Zoom"
                    value={params.zoom}
                    min={5}
                    max={25}
                    step={1}
                    onChange={(v) => updateParam("zoom", v)}
                  />
                  <SliderControl
                    label="Rotation"
                    value={params.rotationSpeed}
                    min={0}
                    max={1}
                    step={0.1}
                    format={(v) => `${v}x`}
                    onChange={(v) => updateParam("rotationSpeed", v)}
                  />
                </div>
              </ControlSection>
            </div>

            <footer className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/50 text-xs text-slate-500 space-y-2">
              <p>
                Strange attractors are sets of points in phase space that chaotic systems
                evolve toward.
              </p>
              <p>
                Despite being deterministic, they exhibit sensitive dependence on initial
                conditions — the butterfly effect.
              </p>
            </footer>
          </aside>
        </div>
      </div>
    </div>
  );
}
