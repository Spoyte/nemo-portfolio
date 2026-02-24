"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Download,
  RefreshCw,
  Shuffle,
  Settings2,
  Copy,
  Sparkles,
  Grid3X3,
  Maximize2,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { artGenerators, ArtParams, ParamConfig } from "@/lib/art";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Extract default params from generator config
function getDefaultParams(generatorKey: string): ArtParams {
  const generator = artGenerators[generatorKey];
  const params: ArtParams = {};
  Object.entries(generator.params).forEach(([key, config]) => {
    params[key] = config.default;
  });
  return params;
}

// Randomize params within reasonable bounds
function randomizeParams(generatorKey: string): ArtParams {
  const generator = artGenerators[generatorKey];
  const params: ArtParams = {};

  Object.entries(generator.params).forEach(([key, config]) => {
    if (config.type === "range" && typeof config.default === "number") {
      const range = (config.max! - config.min!) * 0.4;
      const minVal = Math.max(config.min!, config.default - range);
      const maxVal = Math.min(config.max!, config.default + range);
      params[key] = Math.floor(Math.random() * (maxVal - minVal) + minVal);
    } else if (config.type === "select" && config.options) {
      params[key] = config.options[Math.floor(Math.random() * config.options.length)];
    } else {
      params[key] = config.default;
    }
  });

  return params;
}

export default function GenerativeArtPage() {
  const searchParams = useSearchParams();
  const pieceParam = searchParams.get("piece");
  
  const [selectedArt, setSelectedArt] = useState(pieceParam && artGenerators[pieceParam] ? pieceParam : "flow-field");
  const [params, setParams] = useState<ArtParams>(() => getDefaultParams(pieceParam && artGenerators[pieceParam] ? pieceParam : "flow-field"));
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const currentGenerator = artGenerators[selectedArt];

  // Generate art on canvas
  const generate = useCallback(
    (targetCanvas?: HTMLCanvasElement, timestamp?: number) => {
      const canvas = targetCanvas || canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      currentGenerator.generate(ctx, params, timestamp);
    },
    [currentGenerator, params]
  );

  // Animation loop for animated generators
  useEffect(() => {
    const isAnimated = selectedArt === "voronoi-organic" || selectedArt === "wave-interference" || selectedArt === "flow-field" || selectedArt === "topographic-flow" || selectedArt === "orbital-mechanics" || selectedArt === "light-caverns" || selectedArt === "fluid-smoke" || selectedArt === "particle-swarm";

    if (isAnimated) {
      const animate = (timestamp: number) => {
        generate(canvasRef.current || undefined, timestamp);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      generate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedArt, generate]);

  // Handle art type change
  const handleArtChange = (artKey: string) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setSelectedArt(artKey);
    setParams(getDefaultParams(artKey));
  };

  // Handle param change
  const handleParamChange = (key: string, value: number | string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  // Randomize parameters
  const handleRandomize = () => {
    setParams(randomizeParams(selectedArt));
    toast.success("Parameters randomized!");
  };

  // Download artwork
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `generative-art-${selectedArt}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast.success("Artwork downloaded!");
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          toast.success("Copied to clipboard!");
        }
      });
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Open fullscreen
  const openFullscreen = () => {
    setShowFullscreen(true);
  };

  // Render parameter control based on type
  const renderParamControl = (key: string, config: ParamConfig) => {
    const value = params[key];

    if (config.type === "select" && config.options) {
      return (
        <div key={key}>
          <label className="text-sm font-medium capitalize mb-2 block">{config.name}</label>
          <div className="flex gap-2 flex-wrap">
            {config.options.map((option) => (
              <button
                key={option}
                onClick={() => handleParamChange(key, option)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  value === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={key}>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium">{config.name}</label>
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
        <Slider
          value={[typeof value === "number" ? value : 0]}
          onValueChange={([v]) => handleParamChange(key, v)}
          max={config.max}
          min={config.min}
          step={config.step}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link href="/art-gallery">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Gallery
              </Button>
            </Link>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Generative Art</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Code Art Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore algorithmic art generated in real-time. Each piece is unique and created with
            code.
          </p>
        </motion.div>

        {/* Art Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(artGenerators).map(([key, generator]) => (
              <Button
                key={key}
                variant={selectedArt === key ? "default" : "outline"}
                onClick={() => handleArtChange(key)}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                {generator.name}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="relative bg-black">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[600px] object-contain"
                    style={{ aspectRatio: "4/3" }}
                  />

                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" onClick={openFullscreen}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{currentGenerator.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentGenerator.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRandomize}>
                      <Shuffle className="h-4 w-4 mr-1" />
                      Randomize
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Parameters</h3>
                </div>

                <div className="space-y-6">
                  {Object.entries(currentGenerator.params).map(([key, config]) =>
                    renderParamControl(key, config)
                  )}
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={() => generate()}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <Palette className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Algorithmic Art</h3>
              <p className="text-sm text-muted-foreground">
                Each piece is generated using mathematical algorithms and randomness, creating
                unique compositions every time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Grid3X3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Adjust parameters in real-time to see how small changes affect the overall
                composition. Experiment and discover!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Download className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your creations as high-resolution PNG images. Perfect for wallpapers,
                backgrounds, or print.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white z-10"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-8 w-8" />
            </Button>
            <canvas
              ref={fullscreenCanvasRef}
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
