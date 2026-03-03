"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  Sliders,
  Wand2,
  Download,
  Share2,
  Sparkles,
  Image as ImageIcon,
  Code,
  Eye,
  Grid3X3,
  List,
  Heart,
  Trash2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-animations";
import { toast } from "sonner";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  likes: number;
  createdAt: Date;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

// Color harmony algorithms
function generateHarmony(baseHue: number, type: "analogous" | "monochromatic" | "triadic" | "complementary" | "split-complementary" | "tetradic"): number[] {
  switch (type) {
    case "analogous":
      return [baseHue, (baseHue + 30) % 360, (baseHue - 30 + 360) % 360];
    case "monochromatic":
      return [baseHue, baseHue, baseHue];
    case "triadic":
      return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
    case "complementary":
      return [baseHue, (baseHue + 180) % 360];
    case "split-complementary":
      return [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
    case "tetradic":
      return [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
    default:
      return [baseHue];
  }
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHsl(hex: string): HSLColor {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generateRandomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 50;
  const l = Math.floor(Math.random() * 40) + 30;
  return hslToHex(h, s, l);
}

function generatePaletteFromBase(baseColor: string, type: "analogous" | "monochromatic" | "triadic" | "complementary" | "split-complementary" | "tetradic", count: number = 5): string[] {
  const hsl = hexToHsl(baseColor);
  const hues = generateHarmony(hsl.h, type);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hueIndex = i % hues.length;
    const hue = hues[hueIndex];
    const saturation = Math.max(20, Math.min(90, hsl.s + (Math.random() * 20 - 10)));
    const lightness = Math.max(15, Math.min(85, hsl.l + ((i / count) * 60 - 30)));
    colors.push(hslToHex(hue, saturation, lightness));
  }

  return colors;
}

const harmonyTypes = [
  { id: "analogous", name: "Analogous", description: "Colors next to each other on the wheel" },
  { id: "monochromatic", name: "Monochromatic", description: "Variations of a single hue" },
  { id: "triadic", name: "Triadic", description: "Three evenly spaced colors" },
  { id: "complementary", name: "Complementary", description: "Opposite colors on the wheel" },
  { id: "split-complementary", name: "Split Comp.", description: "Base color plus two adjacent to its complement" },
  { id: "tetradic", name: "Tetradic", description: "Four colors in a rectangle on the wheel" },
];

const presetPalettes: ColorPalette[] = [
  {
    id: "1",
    name: "Ocean Breeze",
    colors: ["#0C4A6E", "#075985", "#0369A1", "#0EA5E9", "#38BDF8"],
    tags: ["Blue", "Calm", "Nature"],
    likes: 234,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Sunset Glow",
    colors: ["#7C2D12", "#9A3412", "#C2410C", "#EA580C", "#FB923C"],
    tags: ["Orange", "Warm", "Energetic"],
    likes: 189,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Forest Mist",
    colors: ["#14532D", "#166534", "#15803D", "#16A34A", "#4ADE80"],
    tags: ["Green", "Natural", "Fresh"],
    likes: 312,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Berry Smoothie",
    colors: ["#831843", "#9D174D", "#BE185D", "#DB2777", "#F472B6"],
    tags: ["Pink", "Sweet", "Playful"],
    likes: 156,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Midnight City",
    colors: ["#0F172A", "#1E293B", "#334155", "#475569", "#94A3B8"],
    tags: ["Dark", "Sleek", "Modern"],
    likes: 445,
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Cotton Candy",
    colors: ["#FDF4FF", "#FAE8FF", "#F5D0FE", "#F0ABFC", "#E879F9"],
    tags: ["Light", "Soft", "Dreamy"],
    likes: 278,
    createdAt: new Date(),
  },
];

export default function ColorStudioPage() {
  const [baseColor, setBaseColor] = useState("#6366F1");
  const [harmonyType, setHarmonyType] = useState<typeof harmonyTypes[0]["id"]>("analogous");
  const [currentPalette, setCurrentPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>(presetPalettes);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [paletteName, setPaletteName] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [history, setHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [colorCount, setColorCount] = useState(5);

  // Generate initial palette
  useEffect(() => {
    generateNewPalette();
  }, []);

  const generateNewPalette = useCallback(() => {
    const newColors = generatePaletteFromBase(baseColor, harmonyType, colorCount);
    
    // Keep locked colors
    const finalColors = newColors.map((color, index) => {
      if (lockedColors.has(index) && currentPalette[index]) {
        return currentPalette[index];
      }
      return color;
    });

    setCurrentPalette(finalColors);
    addToHistory(finalColors);
  }, [baseColor, harmonyType, colorCount, lockedColors, currentPalette]);

  const addToHistory = (colors: string[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...colors]);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPalette([...history[historyIndex - 1]]);
    }
  };

  const toggleLock = (index: number) => {
    const newLocked = new Set(lockedColors);
    if (newLocked.has(index)) {
      newLocked.delete(index);
    } else {
      newLocked.add(index);
    }
    setLockedColors(newLocked);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard!`);
  };

  const savePalette = () => {
    if (!paletteName.trim()) {
      toast.error("Please enter a palette name");
      return;
    }

    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: [...currentPalette],
      tags: [harmonyType],
      likes: 0,
      createdAt: new Date(),
    };

    setSavedPalettes([newPalette, ...savedPalettes]);
    setPaletteName("");
    toast.success("Palette saved!");
  };

  const deletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter((p) => p.id !== id));
    toast.success("Palette deleted");
  };

  const likePalette = (id: string) => {
    setSavedPalettes(
      savedPalettes.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const exportPalette = (format: "css" | "json" | "tailwind") => {
    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "css":
        content = `:root {\n${currentPalette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
        filename = "palette.css";
        mimeType = "text/css";
        break;
      case "json":
        content = JSON.stringify({
          name: paletteName || "Untitled Palette",
          colors: currentPalette,
          createdAt: new Date().toISOString(),
        }, null, 2);
        filename = "palette.json";
        mimeType = "application/json";
        break;
      case "tailwind":
        content = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${currentPalette.map((c, i) => `        'brand-${i + 1}': '${c}',`).join("\n")}\n      }\n    }\n  }\n}`;
        filename = "tailwind.config.js";
        mimeType = "application/javascript";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Color Studio</h1>
                <p className="text-muted-foreground text-sm">Generate, explore, and export beautiful color palettes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <Undo2 className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="w-4 h-4 mr-1" /> : <Grid3X3 className="w-4 h-4 mr-1" />}
                {viewMode === "grid" ? "List" : "Grid"}
              </Button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <div className="space-y-6">
              {/* Base Color */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  Base Color
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-16 h-16 rounded-xl cursor-pointer border-0"
                  />
                  <div className="flex-1">
                    <Input
                      value={baseColor.toUpperCase()}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="font-mono uppercase"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Click the color picker or enter a hex code
                    </p>
                  </div>
                </div>
              </div>

              {/* Harmony Type */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  Harmony Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {harmonyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setHarmonyType(type.id as typeof harmonyType)}
                      className={`p-3 rounded-xl text-left text-sm transition-all ${
                        harmonyType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="font-medium">{type.name}</div>
                      <div className={`text-xs ${harmonyType === type.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Count */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Color Count: {colorCount}</h3>
                <Slider
                  value={[colorCount]}
                  onValueChange(([v]) => setColorCount(v)}
                  min={2}
                  max={8}
                  step={1}
                />
              </div>

              {/* Generate Button */}
              <Button onClick={generateNewPalette} className="w-full gap-2">
                <Wand2 className="w-4 h-4" />
                Generate New Palette
              </Button>

              {/* Export Options */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  Export
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["css", "json", "tailwind"] as const).map((format) => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      onClick={() => exportPalette(format)}
                    >
                      <Code className="w-3 h-3 mr-1" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Panel - Palette Display */}
          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <div className="space-y-6">
              {/* Current Palette */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <div className="flex h-64 md:h-80">
                  {currentPalette.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex-1 relative group cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                    >
                      {/* Color Info */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
003e
                        <p
                          className="font-mono font-bold text-lg"
                          style={{ color: getContrastColor(color) }}
                        >
                          {color.toUpperCase()}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-2"
                          style={{ color: getContrastColor(color) }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLock(index);
                          }}
                        >
                          {lockedColors.has(index) ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Lock Indicator */}
                      <{lockedColors.has(index) && (
                        <div
                          className="absolute top-2 right-2 p-1 rounded"
                          style={{ backgroundColor: getContrastColor(color), color: color }}
                        >
                          <Lock className="w-3 h-3" />
                        </div>
                      )}

                      {/* Index */}
                      <div
                        className="absolute bottom-2 left-2 text-xs font-mono opacity-50"
                        style={{ color: getContrastColor(color) }}
                      >
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Palette Actions */}
                <div className="p-4 bg-card border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Palette name..."
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={savePalette} size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentPalette.join(", "))}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy All
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateNewPalette}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UI Preview */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">UI Preview</h3>
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: currentPalette[0] }}
                    >
                      <p style={{ color: getContrastColor(currentPalette[0]) }}>Primary Background</p>
                    </div>
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: currentPalette[1] }}
                    >
                      <p style={{ color: getContrastColor(currentPalette[1]) }}>Secondary Background</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{
                          backgroundColor: currentPalette[2],
                          color: getContrastColor(currentPalette[2]),
                        }}
                      >
                        Button
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg font-medium border-2"
                        style={{
                          borderColor: currentPalette[3],
                          color: currentPalette[3],
                        }}
                      >
                        Outline
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Preview */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">Text Preview</h3>
                  <div className="space-y-3">
                    <h1 style={{ color: currentPalette[0] }}>Heading Text</h1>
                    <h2 style={{ color: currentPalette[1] }}>Subheading Text</h2>
                    <p style={{ color: currentPalette[2] }}>
                      Body text using the palette color. This shows how your colors work together.
                    </p>
                    <a href="#" style={{ color: currentPalette[3] }} className="underline">
                      Link text
                    </a>
                  </div>
                </div>
              </div>

              {/* Saved Palettes */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Saved Palettes
                  </h3>
                  <Badge variant="secondary">{savedPalettes.length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedPalettes.map((palette) => (
                    <motion.div
                      key={palette.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{palette.name}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => likePalette(palette.id)}
                          >
                            <Heart
                              className={`w-4 h-4 ${palette.likes > 0 ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <span className="text-sm text-muted-foreground">{palette.likes}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={() => deletePalette(palette.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex h-12 rounded-lg overflow-hidden mb-3">
                        {palette.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: color }}
                            onClick={() => copyToClipboard(color)}
                            title={color}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {palette.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPalette(palette.colors);
                            toast.success(`Loaded "${palette.name}"`);
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
