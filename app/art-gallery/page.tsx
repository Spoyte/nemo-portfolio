"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Palette, 
  Code2, 
  Shuffle,
  Layers,
  Atom,
  Waves,
  GitBranch,
  Hexagon,
  Mountain,
  Orbit,
  Flower2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { artGenerators } from "@/lib/art";

// Art piece metadata with icons and tags
const artPieces = [
  {
    id: "flow-field",
    name: "Flow Field",
    description: "Perlin noise-driven particle flows creating organic stream patterns",
    icon: Waves,
    tags: ["particles", "noise", "organic"],
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "geometric-mandala",
    name: "Geometric Mandala",
    description: "Sacred geometry with rotating symmetrical patterns",
    icon: Hexagon,
    tags: ["geometry", "symmetry", "sacred"],
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "particle-network",
    name: "Particle Network",
    description: "Connected nodes forming dynamic constellations",
    icon: Atom,
    tags: ["network", "connections", "nodes"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "recursive-trees",
    name: "Recursive Trees",
    description: "Fractal branching structures mimicking natural growth",
    icon: GitBranch,
    tags: ["fractal", "nature", "recursion"],
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "wave-interference",
    name: "Wave Interference",
    description: "Overlapping sine waves creating moiré patterns",
    icon: Waves,
    tags: ["waves", "interference", "physics"],
    color: "from-indigo-500 to-violet-600",
  },
  {
    id: "cellular-automata",
    name: "Cellular Automata",
    description: "Emergent patterns from simple rule-based systems",
    icon: Grid3X3,
    tags: ["emergence", "rules", "life"],
    color: "from-rose-500 to-red-600",
  },
  {
    id: "voronoi-organic",
    name: "Voronoi Organic",
    description: "Breathing cells with organic distortion and depth",
    icon: Layers,
    tags: ["voronoi", "cells", "organic"],
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "topographic-flow",
    name: "Topographic Flow",
    description: "Animated contour maps with flowing terrain",
    icon: Mountain,
    tags: ["terrain", "contours", "maps"],
    color: "from-lime-500 to-green-600",
  },
  {
    id: "strange-attractor",
    name: "Strange Attractor",
    description: "Chaos theory visualized through particle trails",
    icon: Orbit,
    tags: ["chaos", "attractors", "physics"],
    color: "from-orange-500 to-red-600",
  },
  {
    id: "reaction-diffusion",
    name: "Reaction-Diffusion",
    description: "Turing patterns simulating natural formations",
    icon: Zap,
    tags: ["patterns", "turing", "nature"],
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "dla",
    name: "DLA Cluster",
    description: "Diffusion-limited aggregation forming coral-like structures",
    icon: Sparkles,
    tags: ["aggregation", "coral", "growth"],
    color: "from-cyan-500 to-teal-600",
  },
  {
    id: "lsystem-botany",
    name: "L-System Botany",
    description: "Procedural plants using Lindenmayer grammars",
    icon: Flower2,
    tags: ["l-systems", "botany", "grammar"],
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "orbital-mechanics",
    name: "Orbital Mechanics",
    description: "Gravitational particle simulation with orbiting bodies",
    icon: Orbit,
    tags: ["gravity", "orbits", "physics"],
    color: "from-blue-500 to-indigo-600",
  },
];

// Grid icon component
function Grid3X3({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

// Animated thumbnail component
function ArtThumbnail({ piece, index }: { piece: typeof artPieces[0]; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const generator = artGenerators[piece.id];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !generator) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get default params
    const params: Record<string, number | string> = {};
    Object.entries(generator.params).forEach(([key, config]) => {
      params[key] = config.default;
    });

    // Check if animated
    const isAnimated = ["voronoi-organic", "wave-interference", "flow-field", "topographic-flow", "orbital-mechanics"].includes(piece.id);

    if (isAnimated) {
      const animate = (timestamp: number) => {
        generator.generate(ctx, params, timestamp);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      generator.generate(ctx, params);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [piece.id, generator]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/art?piece=${piece.id}`}>
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-0 bg-gradient-to-br from-card to-card/50">
          <div className="relative aspect-[4/3] overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${piece.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {piece.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {piece.description}
                </p>
              </div>
              <piece.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {piece.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Animated background component
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.005;
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Draw flowing lines
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${(time * 50 + i * 60) % 360}, 70%, 50%, 0.1)`;
        ctx.lineWidth = 1;

        for (let x = 0; x < w; x += 10) {
          const y = cy + Math.sin(x * 0.01 + time + i) * 100 * Math.sin(time * 0.5);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      style={{ background: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted)))" }}
    />
  );
}

export default function ArtGalleryIndex() {
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <AnimatedBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">13 Algorithms • Real-time Generated</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Generative Art
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A collection of algorithmic art pieces created with code. Each piece is generated 
            in real-time, unique every time, and infinitely variable.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            <Link href="/art">
              <Button size="lg" className="gap-2">
                <Shuffle className="h-4 w-4" />
                Open Generator
              </Button>
            </Link>
            <a 
              href="https://github.com/nemo/portfolio" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Code2 className="h-4 w-4" />
                View Source
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Algorithms", value: "13" },
            { label: "Parameters", value: "50+" },
            { label: "Color Palettes", value: "40+" },
            { label: "Unique Combinations", value: "∞" },
          ].map((stat, i) => (
            <Card key={stat.label} className="border-0 bg-card/50 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {artPieces.map((piece, index) => (
            <ArtThumbnail key={piece.id} piece={piece} index={index} />
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="p-8">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">How It Works</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each piece uses mathematical algorithms to generate visuals. From Perlin noise 
                flow fields to chaotic attractors, from L-systems to reaction-diffusion — 
                code becomes canvas, math becomes art.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
