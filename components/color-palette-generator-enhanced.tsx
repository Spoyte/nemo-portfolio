"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  Download,
  Shuffle,
  Lock,
  Unlock,
  Heart,
  Share2,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  likes: number;
}

function generateRandomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function generateHarmoniousColors(baseHue: number, type: "analogous" | "complementary" | "triadic" | "monochromatic"): string[] {
  const colors: string[] = [];
  
  switch (type) {
    case "analogous":
      for (let i = -2; i <= 2; i++) {
        colors.push(hslToHex((baseHue + i * 30) % 360, 70, 50));
      }
      break;
    case "complementary":
      colors.push(hslToHex(baseHue, 70, 50));
      colors.push(hslToHex((baseHue + 180) % 360, 70, 50));
      colors.push(hslToHex(baseHue, 50, 70));
      colors.push(hslToHex((baseHue + 180) % 360, 50, 70));
      colors.push(hslToHex(baseHue, 60, 30));
      break;
    case "triadic":
      for (let i = 0; i < 3; i++) {
        colors.push(hslToHex((baseHue + i * 120) % 360, 70, 50));
        colors.push(hslToHex((baseHue + i * 120) % 360, 50, 70));
      }
      break;
    case "monochromatic":
      for (let i = 0; i < 5; i++) {
        colors.push(hslToHex(baseHue, 70, 20 + i * 15));
      }
      break;
  }
  
  return colors.slice(0, 5);
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

const PRESET_PALETTES: ColorPalette[] = [
  {
    id: "ocean",
    name: "Deep Ocean",
    colors: ["#0c4a6e", "#075985", "#0369a1", "#0ea5e9", "#38bdf8"],
    tags: ["blue", "calm", "professional"],
    likes: 128,
  },
  {
    id: "sunset",
    name: "Golden Sunset",
    colors: ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#fb923c"],
    tags: ["orange", "warm", "energetic"],
    likes: 256,
  },
  {
    id: "forest",
    name: "Misty Forest",
    colors: ["#14532d", "#166534", "#15803d", "#22c55e", "#86efac"],
    tags: ["green", "nature", "fresh"],
    likes: 189,
  },
  {
    id: "berry",
    name: "Berry Smoothie",
    colors: ["#831843", "#9d174d", "#be185d", "#db2777", "#f472b6"],
    tags: ["pink", "playful", "modern"],
    likes: 167,
  },
  {
    id: "midnight",
    name: "Midnight Purple",
    colors: ["#3b0764", "#581c87", "#7e22ce", "#a855f7", "#d8b4fe"],
    tags: ["purple", "mysterious", "creative"],
    likes: 234,
  },
  {
    id: "monochrome",
    name: "Clean Slate",
    colors: ["#0a0a0a", "#262626", "#525252", "#a3a3a3", "#f5f5f5"],
    tags: ["gray", "minimal", "elegant"],
    likes: 312,
  },
];

export function ColorPaletteGenerator() {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>({
    id: "custom",
    name: "Custom Palette",
    colors: generateHarmoniousColors(Math.random() * 360, "analogous"),
    tags: ["custom"],
    likes: 0,
  });
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [harmonyType, setHarmonyType] = useState<"analogous" | "complementary" | "triadic" | "monochromatic">("analogous");
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  // Load saved palettes
  useEffect(() => {
    const saved = localStorage.getItem("saved-palettes");
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);

  const generateNewPalette = useCallback(() => {
    const baseHue = Math.random() * 360;
    const newColors = generateHarmoniousColors(baseHue, harmonyType);
    
    setCurrentPalette(prev => {
      const mergedColors = prev.colors.map((color, index) => 
        lockedColors.has(index) ? color : newColors[index]
      );
      return {
        ...prev,
        colors: mergedColors,
      };
    });
  }, [harmonyType, lockedColors]);

  const toggleLock = (index: number) => {
    setLockedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const savePalette = () => {
    const newPalette = {
      ...currentPalette,
      id: Date.now().toString(),
      name: `Palette ${savedPalettes.length + 1}`,
    };
    const updated = [...savedPalettes, newPalette];
    setSavedPalettes(updated);
    localStorage.setItem("saved-palettes", JSON.stringify(updated));
  };

  const exportPalette = () => {
    const data = {
      name: currentPalette.name,
      colors: currentPalette.colors,
      tags: currentPalette.tags,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPalette.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Color Palette Generator
              </CardTitle>
              <CardDescription>
                Generate beautiful color palettes with harmony rules
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={savePalette}>
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportPalette}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Display */}
          <div className="flex h-48 rounded-xl overflow-hidden">
            {currentPalette.colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 relative group cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color, index)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getContrastColor(color) }}
                >
                  <p className="font-mono font-bold">{color.toUpperCase()}</p>
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
                    {lockedColors.has(index) ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </div>
                
                {copiedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50"
                  >
                    <Check className="h-8 w-8 text-white" />
                  </motion.div>
                )}
                
                {lockedColors.has(index) && (
                  <div className="absolute top-2 right-2"
                    style={{ color: getContrastColor(color) }}
                  >
                    <Lock className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {(["analogous", "complementary", "triadic", "monochromatic"] as const).map((type) => (
                <Button
                  key={type}
                  variant={harmonyType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setHarmonyType(type);
                    generateNewPalette();
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button onClick={generateNewPalette} className="gap-2">
              <Shuffle className="h-4 w-4" />
              Generate New
            </Button>
          </div>

          {/* CSS Export */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">CSS Variables</p>
            <code className="text-xs font-mono block whitespace-pre">
              {`:root {
${currentPalette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}
}`}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Presets & Saved */}
      <Tabs defaultValue="presets">
        <TabsList>
          <TabsTrigger value="presets">Preset Palettes</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedPalettes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_PALETTES.map((palette) => (
              <Card 
                key={palette.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setCurrentPalette(palette)}
              >
                <CardContent className="p-4">
                  <div className="flex h-16 rounded-lg overflow-hidden mb-3">
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{palette.name}</p>
                      <div className="flex gap-1 mt-1">
                        {palette.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{palette.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          {savedPalettes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No saved palettes yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate and save palettes you love
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPalettes.map((palette) => (
                <Card 
                  key={palette.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setCurrentPalette(palette)}
                >
                  <CardContent className="p-4">
                    <div className="flex h-16 rounded-lg overflow-hidden mb-3">
                      {palette.colors.map((color) => (
                        <div
                          key={color}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="font-medium">{palette.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
