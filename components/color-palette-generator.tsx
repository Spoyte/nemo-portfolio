"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCw, 
  Lock,
  Unlock,
  Sparkles,
  Download,
  Share2,
  Heart,
  Shuffle,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  likes: number;
}

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 60; // 60-90%
  const lightness = Math.floor(Math.random() * 40) + 30; // 30-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const generateHarmoniousPalette = (baseHue?: number) => {
  const hue = baseHue ?? Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 70;
  const lightness = Math.floor(Math.random() * 20) + 40;
  
  return [
    `hsl(${hue}, ${saturation}%, ${lightness + 30}%)`,
    `hsl(${hue}, ${saturation}%, ${lightness + 15}%)`,
    `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness}%)`,
    `hsl(${(hue + 60) % 360}, ${saturation - 10}%, ${lightness - 10}%)`,
  ];
};

const generateComplementaryPalette = () => {
  const hue = Math.floor(Math.random() * 360);
  return [
    `hsl(${hue}, 70%, 85%)`,
    `hsl(${hue}, 60%, 60%)`,
    `hsl(${hue}, 80%, 45%)`,
    `hsl(${(hue + 180) % 360}, 70%, 50%)`,
    `hsl(${(hue + 180) % 360}, 60%, 30%)`,
  ];
};

const generateTriadicPalette = () => {
  const hue = Math.floor(Math.random() * 360);
  return [
    `hsl(${hue}, 75%, 80%)`,
    `hsl(${hue}, 65%, 55%)`,
    `hsl(${(hue + 120) % 360}, 70%, 50%)`,
    `hsl(${(hue + 240) % 360}, 65%, 55%)`,
    `hsl(${hue}, 50%, 25%)`,
  ];
};

const initialPalettes: ColorPalette[] = [
  {
    id: "1",
    name: "Ocean Breeze",
    colors: ["#e0f7fa", "#80deea", "#26c6da", "#0097a7", "#006064"],
    tags: ["cool", "calm", "nature"],
    likes: 128,
  },
  {
    id: "2",
    name: "Sunset Glow",
    colors: ["#fff3e0", "#ffcc80", "#ff9800", "#f57c00", "#e65100"],
    tags: ["warm", "energetic", "vibrant"],
    likes: 256,
  },
  {
    id: "3",
    name: "Forest Mist",
    colors: ["#e8f5e9", "#a5d6a7", "#66bb6a", "#43a047", "#2e7d32"],
    tags: ["nature", "fresh", "organic"],
    likes: 189,
  },
  {
    id: "4",
    name: "Berry Smoothie",
    colors: ["#f3e5f5", "#ce93d8", "#ab47bc", "#8e24aa", "#6a1b9a"],
    tags: ["playful", "creative", "bold"],
    likes: 312,
  },
  {
    id: "5",
    name: "Midnight City",
    colors: ["#e8eaf6", "#9fa8da", "#5c6bc0", "#3949ab", "#1a237e"],
    tags: ["dark", "professional", "tech"],
    likes: 445,
  },
  {
    id: "6",
    name: "Coral Reef",
    colors: ["#fce4ec", "#f48fb1", "#ec407a", "#d81b60", "#ad1457"],
    tags: ["warm", "feminine", "soft"],
    likes: 234,
  },
];

export function ColorPaletteGenerator() {
  const [palettes, setPalettes] = useState<ColorPalette[]>(initialPalettes);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [generationMode, setGenerationMode] = useState<"harmonious" | "complementary" | "triadic" | "random">("harmonious");
  const [customPalette, setCustomPalette] = useState<string[]>(generateHarmoniousPalette());

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const generateNewPalette = () => {
    let newColors: string[];
    
    switch (generationMode) {
      case "complementary":
        newColors = generateComplementaryPalette();
        break;
      case "triadic":
        newColors = generateTriadicPalette();
        break;
      case "random":
        newColors = Array.from({ length: 5 }, generateRandomColor);
        break;
      case "harmonious":
      default:
        newColors = generateHarmoniousPalette();
    }

    // Preserve locked colors
    setCustomPalette((prev) =>
      prev.map((color, index) => (lockedColors.has(index) ? color : newColors[index]))
    );
  };

  const toggleLock = (index: number) => {
    setLockedColors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const likePalette = (id: string) => {
    setPalettes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const exportPalette = () => {
    const data = {
      name: "Custom Palette",
      colors: customPalette,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.json";
    a.click();
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Color Studio</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Palette{" "}
            <span className="text-gradient-animated">Generator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create, explore, and export beautiful color palettes for your projects.
          </p>
        </motion.div>

        {/* Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            {/* Custom Palette Display */}
            <div className="flex h-48 md:h-64">
              {customPalette.map((color, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{ backgroundColor: color }}
                  className="flex-1 relative group cursor-pointer"
                  onClick={() => copyToClipboard(color)}
                >
                  {/* Lock Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(index);
                    }}
                    className={cn(
                      "absolute top-4 left-1/2 -translate-x-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                      lockedColors.has(index)
                        ? "bg-white/90 text-foreground opacity-100"
                        : "bg-white/50 text-foreground hover:bg-white/90"
                    )}
                  >
                    {lockedColors.has(index) ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>

                  {/* Color Code */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 px-3 py-1.5 rounded-lg text-sm font-mono flex items-center gap-2">
                      {copiedColor === color ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{color}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div className="p-6 border-t">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {(["harmonious", "complementary", "triadic", "random"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGenerationMode(mode)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors",
                        generationMode === mode
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportPalette}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button onClick={generateNewPalette} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Preset Palettes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-6">Curated Palettes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palettes.map((palette, index) => (
              <motion.div
                key={palette.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all">
                  {/* Palette Preview */}
                  <div className="flex h-32">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 relative cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                      >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="text-white text-xs font-mono">{color}</span>
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{palette.name}</h4>
                      <button
                        onClick={() => likePalette(palette.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{palette.likes}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {palette.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
