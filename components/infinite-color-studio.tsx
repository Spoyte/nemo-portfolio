"use client";

import { useState, useEffect, useRef } from "react";
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
  Shuffle,
  Heart,
  Share2,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  locked: boolean;
}

interface Harmony {
  name: string;
  type: "complementary" | "analogous" | "triadic" | "split" | "tetradic" | "monochromatic";
  description: string;
}

const harmonies: Harmony[] = [
  { name: "Complementary", type: "complementary", description: "Colors opposite each other on the color wheel" },
  { name: "Analogous", type: "analogous", description: "Colors next to each other on the color wheel" },
  { name: "Triadic", type: "triadic", description: "Three colors evenly spaced on the color wheel" },
  { name: "Split Complementary", type: "split", description: "Base color plus two adjacent to its complement" },
  { name: "Tetradic", type: "tetradic", description: "Four colors forming a rectangle on the color wheel" },
  { name: "Monochromatic", type: "monochromatic", description: "Variations of a single hue" },
];

export function InfiniteColorStudio() {
  const [colors, setColors] = useState<Color[]>([]);
  const [harmony, setHarmony] = useState<Harmony>(harmonies[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [savedPalettes, setSavedPalettes] = useState<Color[][]>([]);

  // Generate random color
  const generateRandomColor = (): Color => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      locked: false
    };
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Generate harmony colors
  const generateHarmonyColors = (baseColor: Color, harmonyType: string): Color[] => {
    const { h, s, l } = baseColor.hsl;
    const colors: Color[] = [baseColor];

    switch (harmonyType) {
      case "complementary":
        colors.push(hslToColor((h + 180) % 360, s, l));
        break;
      case "analogous":
        colors.push(hslToColor((h - 30 + 360) % 360, s, l));
        colors.push(hslToColor((h + 30) % 360, s, l));
        break;
      case "triadic":
        colors.push(hslToColor((h + 120) % 360, s, l));
        colors.push(hslToColor((h + 240) % 360, s, l));
        break;
      case "split":
        colors.push(hslToColor((h + 150) % 360, s, l));
        colors.push(hslToColor((h + 210) % 360, s, l));
        break;
      case "tetradic":
        colors.push(hslToColor((h + 90) % 360, s, l));
        colors.push(hslToColor((h + 180) % 360, s, l));
        colors.push(hslToColor((h + 270) % 360, s, l));
        break;
      case "monochromatic":
        colors.push(hslToColor(h, s, Math.max(10, l - 30)));
        colors.push(hslToColor(h, s, Math.max(20, l - 15)));
        colors.push(hslToColor(h, s, Math.min(90, l + 15)));
        colors.push(hslToColor(h, s, Math.min(95, l + 30)));
        break;
    }

    return colors;
  };

  // Convert HSL to Color object
  const hslToColor = (h: number, s: number, l: number): Color => {
    const rgb = hslToRgb(h, s, l);
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h, s, l },
      locked: false
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255)
    };
  };

  // Generate new palette
  const generatePalette = () => {
    const baseColor = colors[0]?.locked ? colors[0] : generateRandomColor();
    const newColors = generateHarmonyColors(baseColor, harmony.type);
    
    // Preserve locked colors
    setColors(prev => {
      if (prev.length === 0) return newColors;
      return newColors.map((c, i) => (prev[i]?.locked ? prev[i] : c));
    });
  };

  // Toggle lock
  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  // Copy color
  const copyColor = (color: Color, index: number) => {
    navigator.clipboard.writeText(color.hex);
    setCopiedIndex(index);
    toast.success(`Copied ${color.hex} to clipboard`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Save palette
  const savePalette = () => {
    setSavedPalettes(prev => [...prev, [...colors]]);
    toast.success("Palette saved!");
  };

  // Export palette
  const exportPalette = () => {
    const data = {
      name: `Palette ${savedPalettes.length + 1}`,
      harmony: harmony.name,
      colors: colors.map(c => ({
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Palette exported!");
  };

  // Initialize
  useEffect(() => {
    generatePalette();
  }, []);

  // Regenerate when harmony changes
  useEffect(() => {
    if (colors.length > 0) {
      generatePalette();
    }
  }, [harmony]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [colors]);

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Creative Tool</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Infinite{" "}
            <span className="text-gradient-animated">Color Studio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate beautiful color palettes with harmony rules. Lock colors you love, export your creations, and find the perfect combination.
          </p>
        </ScrollReveal>

        {/* Harmony Selector */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {harmonies.map((h) => (
              <button
                key={h.type}
                onClick={() => setHarmony(h)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  harmony.type === h.type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {harmony.description}
          </p>
        </ScrollReveal>

        {/* Color Palette */}
        <Card className="overflow-hidden mb-8">
          <div className="flex h-64 md:h-80">
            <AnimatePresence mode="popLayout">
              {colors.map((color, index) => (
                <motion.div
                  key={`${color.hex}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyColor(color, index)}
                >
                  {/* Color Info */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
003e
                    <motion.button
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(index);
                      }}
                      className="mb-4 p-2 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      {color.locked ? (
                        <Lock className="h-5 w-5 text-white" />
                      ) : (
                        <Unlock className="h-5 w-5 text-white" />
                      )}
                    </motion.button>
                    
                    {showValues && (
                      <div className="text-center text-white">
                        <p className="font-mono text-lg font-bold">{color.hex}</p>
                        <p className="text-sm opacity-80">
                          rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      {copiedIndex === index ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Copy className="h-5 w-5 text-white/60" />
                      )}
                    </div>
                  </div>

                  {/* Lock indicator */}
                  {color.locked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-4 w-4 text-white/60" />
                    </div>
                  )}

                  {/* Contrast text for accessibility */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p 
                      className="font-mono text-sm font-bold text-center"
                      style={{ 
                        color: color.hsl.l > 50 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)'
                      }}
                    >
                      {color.hex}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {/* Controls */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Button onClick={generatePalette} size="lg" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate (Space)
            </Button>
            <Button onClick={savePalette} variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              Save Palette
            </Button>
            <Button onClick={exportPalette} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button 
              onClick={() => setShowValues(!showValues)} 
              variant="ghost"
              size="icon"
            >
              {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </ScrollReveal>

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <ScrollReveal>
            <div className="mt-12">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Saved Palettes ({savedPalettes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPalettes.map((palette, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="flex h-16">
                      {palette.map((color, cidx) => (
                        <div
                          key={cidx}
                          className="flex-1"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Palette {idx + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setColors(palette);
                          toast.success("Palette loaded!");
                        }}
                      >
                        Load
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Tips */}
        <ScrollReveal className="mt-12">
          <Card className="p-6 bg-muted/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-2">Pro Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Press Spacebar to quickly generate new palettes</li>
                  <li>• Click the lock icon to keep colors you like</li>
                  <li>• Click any color to copy its hex code</li>
                  <li>• Try different harmony rules for unique combinations</li>
                  <li>• Export your favorites for use in design tools</li>
                </ul>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
