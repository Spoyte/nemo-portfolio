"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Copy, 
  RefreshCw, 
  Lock, 
  Unlock,
  Sparkles,
  Download,
  Shuffle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}

function generateRandomColor(hue?: number, saturation?: number, lightness?: number): string {
  const h = hue ?? Math.floor(Math.random() * 360);
  const s = saturation ?? Math.floor(Math.random() * 40) + 50;
  const l = lightness ?? Math.floor(Math.random() * 40) + 30;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateComplementaryPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    `hsl(${baseHue}, 70%, 50%)`,
    `hsl(${(baseHue + 180) % 360}, 70%, 50%)`,
    `hsl(${baseHue}, 50%, 70%)`,
    `hsl(${(baseHue + 180) % 360}, 50%, 70%)`,
    `hsl(${baseHue}, 30%, 90%)`,
  ];
}

function generateAnalogousPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    `hsl(${(baseHue - 30 + 360) % 360}, 60%, 50%)`,
    `hsl(${(baseHue - 15 + 360) % 360}, 60%, 50%)`,
    `hsl(${baseHue}, 70%, 50%)`,
    `hsl(${(baseHue + 15) % 360}, 60%, 50%)`,
    `hsl(${(baseHue + 30) % 360}, 60%, 50%)`,
  ];
}

function generateTriadicPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    `hsl(${baseHue}, 70%, 50%)`,
    `hsl(${(baseHue + 120) % 360}, 70%, 50%)`,
    `hsl(${(baseHue + 240) % 360}, 70%, 50%)`,
    `hsl(${baseHue}, 50%, 70%)`,
    `hsl(${(baseHue + 120) % 360}, 50%, 70%)`,
  ];
}

function generateMonochromaticPalette(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    `hsl(${baseHue}, 70%, 20%)`,
    `hsl(${baseHue}, 70%, 35%)`,
    `hsl(${baseHue}, 70%, 50%)`,
    `hsl(${baseHue}, 70%, 65%)`,
    `hsl(${baseHue}, 70%, 85%)`,
  ];
}

function hslToHex(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function getContrastColor(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#000000';
  
  const l = parseInt(match[3]);
  return l > 50 ? '#000000' : '#FFFFFF';
}

export function ColorPaletteGenerator() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [baseHue, setBaseHue] = useState(180);
  const [saturation, setSaturation] = useState(60);
  const [lightness, setLightness] = useState(50);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const generatePalettes = useCallback(() => {
    const newPalettes: ColorPalette[] = [
      {
        id: "complementary",
        name: "Complementary",
        colors: generateComplementaryPalette(),
        tags: ["bold", "contrast"]
      },
      {
        id: "analogous",
        name: "Analogous",
        colors: generateAnalogousPalette(),
        tags: ["harmonious", "natural"]
      },
      {
        id: "triadic",
        name: "Triadic",
        colors: generateTriadicPalette(),
        tags: ["vibrant", "balanced"]
      },
      {
        id: "monochromatic",
        name: "Monochromatic",
        colors: generateMonochromaticPalette(),
        tags: ["elegant", "minimal"]
      }
    ];
    setPalettes(newPalettes);
  }, []);

  useEffect(() => {
    generatePalettes();
  }, [generatePalettes]);

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      colors: palette.colors.map(c => ({
        hsl: c,
        hex: hslToHex(c),
        rgb: "rgb conversion here"
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Color Palette Generator</CardTitle>
              <p className="text-sm text-muted-foreground">Generate beautiful color palettes for your projects</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={generatePalettes} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
            <Button onClick={() => setLockedColors(new Set())} variant="outline">
              <Unlock className="h-4 w-4 mr-2" />
              Unlock All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {palettes.map((palette, index) => (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{palette.name}</CardTitle>
                      <div className="flex gap-1">
                        {palette.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => exportPalette(palette)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="flex h-32">
                    {palette.colors.map((color, colorIndex) => (
                      <motion.div
                        key={colorIndex}
                        className="flex-1 relative group/color cursor-pointer"
                        style={{ backgroundColor: color }}
                        whileHover={{ flex: 1.5 }}
                        onClick={() => copyToClipboard(hslToHex(color))}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                          <div 
                            className="text-center"
                            style={{ color: getContrastColor(color) }}
                          >
                            <p className="font-mono text-sm font-bold">
                              {copiedColor === hslToHex(color) ? "Copied!" : hslToHex(color)}
                            </p>
                            <p className="text-xs opacity-80">{color}</p>
                          </div>
                        </div>
                        
                        <button
                          className="absolute top-2 right-2 p-1 rounded bg-black/20 opacity-0 group-hover/color:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(hslToHex(color));
                          }}
                        >
                          <Copy className="h-3 w-3" style={{ color: getContrastColor(color) }} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Custom Palette Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Custom Palette Builder
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Hue</label>
                <span className="text-sm text-muted-foreground">{baseHue}°</span>
              </div>
              <Slider
                value={[baseHue]}
                onValueChange={([v]) => setBaseHue(v)}
                max={360}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Saturation</label>
                <span className="text-sm text-muted-foreground">{saturation}%</span>
              </div>
              <Slider
                value={[saturation]}
                onValueChange={([v]) => setSaturation(v)}
                max={100}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Lightness</label>
                <span className="text-sm text-muted-foreground">{lightness}%</span>
              </div>
              <Slider
                value={[lightness]}
                onValueChange={([v]) => setLightness(v)}
                max={100}
                step={1}
              />
            </div>
          </div>
          
          <div className="flex gap-2 h-24 rounded-lg overflow-hidden">
            {[0.3, 0.5, 0.7, 0.85, 0.95].map((l, i) => {
              const color = `hsl(${baseHue}, ${saturation}%, ${Math.round(lightness * l)}%)`;
              return (
                <motion.div
                  key={i}
                  className="flex-1 cursor-pointer relative group"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => copyToClipboard(hslToHex(color))}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span 
                      className="font-mono text-sm font-bold"
                      style={{ color: getContrastColor(color) }}
                    >
                      {copiedColor === hslToHex(color) ? "Copied!" : hslToHex(color)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
