"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  RefreshCw, 
  Copy, 
  Download, 
  Sparkles, 
  Palette,
  Sun,
  Moon,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

interface ColorPalette {
  name: string;
  colors: string[];
  mood: string;
}

const moodPresets = {
  energetic: {
    hueRange: [0, 60],
    saturation: [70, 100],
    lightness: [50, 70],
  },
  calm: {
    hueRange: [180, 240],
    saturation: [30, 60],
    lightness: [60, 80],
  },
  warm: {
    hueRange: [20, 50],
    saturation: [60, 90],
    lightness: [55, 75],
  },
  cool: {
    hueRange: [200, 280],
    saturation: [40, 80],
    lightness: [50, 70],
  },
  dramatic: {
    hueRange: [280, 340],
    saturation: [70, 100],
    lightness: [40, 60],
  },
  natural: {
    hueRange: [80, 160],
    saturation: [40, 70],
    lightness: [45, 65],
  },
};

function generateHSLColor(
  hueRange: [number, number],
  saturationRange: [number, number],
  lightnessRange: [number, number]
): string {
  const hue = Math.floor(Math.random() * (hueRange[1] - hueRange[0]) + hueRange[0]);
  const saturation = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0]) + saturationRange[0]);
  const lightness = Math.floor(Math.random() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0]);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;
  
  let [, h, s, l] = match.map(Number);
  s /= 100;
  l /= 100;
  
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function generatePalette(mood: keyof typeof moodPresets, count: number = 5): ColorPalette {
  const preset = moodPresets[mood];
  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    colors.push(generateHSLColor(
      preset.hueRange as [number, number],
      preset.saturation as [number, number],
      preset.lightness as [number, number]
    ));
  }
  
  return {
    name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Palette`,
    colors,
    mood,
  };
}

function generateComplementary(baseHue: number): ColorPalette {
  const colors = [
    `hsl(${baseHue}, 70%, 55%)`,
    `hsl(${(baseHue + 30) % 360}, 65%, 60%)`,
    `hsl(${(baseHue + 180) % 360}, 70%, 55%)`,
    `hsl(${(baseHue + 210) % 360}, 65%, 60%)`,
    `hsl(${baseHue}, 40%, 85%)`,
  ];
  
  return {
    name: "Complementary",
    colors,
    mood: "custom",
  };
}

function generateAnalogous(baseHue: number): ColorPalette {
  const colors = [
    `hsl(${(baseHue - 30 + 360) % 360}, 65%, 55%)`,
    `hsl(${(baseHue - 15 + 360) % 360}, 70%, 58%)`,
    `hsl(${baseHue}, 75%, 60%)`,
    `hsl(${(baseHue + 15) % 360}, 70%, 58%)`,
    `hsl(${(baseHue + 30) % 360}, 65%, 55%)`,
  ];
  
  return {
    name: "Analogous",
    colors,
    mood: "custom",
  };
}

function generateTriadic(baseHue: number): ColorPalette {
  const colors = [
    `hsl(${baseHue}, 70%, 55%)`,
    `hsl(${(baseHue + 120) % 360}, 70%, 55%)`,
    `hsl(${(baseHue + 240) % 360}, 70%, 55%)`,
    `hsl(${baseHue}, 40%, 75%)`,
    `hsl(${(baseHue + 120) % 360}, 40%, 75%)`,
  ];
  
  return {
    name: "Triadic",
    colors,
    mood: "custom",
  };
}

export function DynamicThemeGenerator() {
  const [palette, setPalette] = useState<ColorPalette>(() => generatePalette("energetic"));
  const [baseHue, setBaseHue] = useState(30);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [activeTab, setActiveTab] = useState<"mood" | "custom">("mood");

  const generateNewPalette = useCallback((mood: keyof typeof moodPresets) => {
    setPalette(generatePalette(mood));
  }, []);

  const generateFromHue = useCallback((type: "complementary" | "analogous" | "triadic") => {
    switch (type) {
      case "complementary":
        setPalette(generateComplementary(baseHue));
        break;
      case "analogous":
        setPalette(generateAnalogous(baseHue));
        break;
      case "triadic":
        setPalette(generateTriadic(baseHue));
        break;
    }
  }, [baseHue]);

  const copyColor = useCallback((color: string) => {
    navigator.clipboard.writeText(hslToHex(color));
    toast.success(`Copied ${hslToHex(color)} to clipboard!`);
  }, []);

  const copyAllColors = useCallback(() => {
    const hexColors = palette.colors.map(hslToHex).join(", ");
    navigator.clipboard.writeText(hexColors);
    toast.success("All colors copied to clipboard!");
  }, [palette]);

  const savePalette = useCallback(() => {
    setSavedPalettes(prev => {
      if (prev.find(p => p.colors.join() === palette.colors.join())) {
        toast.info("Palette already saved!");
        return prev;
      }
      toast.success("Palette saved!");
      return [...prev, { ...palette, name: `${palette.name} ${prev.length + 1}` }];
    });
  }, [palette]);

  const downloadPalette = useCallback(() => {
    const data = {
      name: palette.name,
      colors: palette.colors.map(hslToHex),
      mood: palette.mood,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Palette downloaded!");
  }, [palette]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Dynamic Theme Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={savePalette}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={copyAllColors}>
            <Copy className="h-4 w-4 mr-1" />
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPalette}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "mood" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("mood")}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Mood Based
        </Button>
        <Button
          variant={activeTab === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("custom")}
        >
          <Sun className="h-4 w-4 mr-1" />
          Custom Hue
        </Button>
      </div>

      {/* Controls */}
      <AnimatePresence mode="wait">
        {activeTab === "mood" ? (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6"
          >
            {(Object.keys(moodPresets) as Array<keyof typeof moodPresets>).map((mood) => (
              <Button
                key={mood}
                variant={palette.mood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => generateNewPalette(mood)}
                className="capitalize"
              >
                {mood}
              </Button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-20">Base Hue:</span>
              <Slider
                value={[baseHue]}
                onValueChange={([v]) => setBaseHue(v)}
                max={360}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{baseHue}°</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => generateFromHue("complementary")}>
                Complementary
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateFromHue("analogous")}>
                Analogous
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateFromHue("triadic")}>
                Triadic
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{palette.name}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => activeTab === "mood" ? generateNewPalette(palette.mood as keyof typeof moodPresets) : generateFromHue("complementary")}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {palette.colors.map((color, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyColor(color)}
              className="group relative aspect-square rounded-xl shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-mono">{hslToHex(color)}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Saved Palettes */}
      {savedPalettes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium mb-3">Saved Palettes ({savedPalettes.length})</h4>
          <div className="space-y-2">
            {savedPalettes.map((saved, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => setPalette(saved)}
              >
                <div className="flex gap-1">
                  {saved.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm flex-1">{saved.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
