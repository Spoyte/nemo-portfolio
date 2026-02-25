"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Copy, Check, RefreshCw, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface ColorHarmony {
  name: string;
  colors: string[];
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
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
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

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function generateHarmonies(baseHue: number): ColorHarmony[] {
  return [
    {
      name: "Complementary",
      colors: [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
      ],
    },
    {
      name: "Analogous",
      colors: [
        hslToHex((baseHue - 30 + 360) % 360, 70, 50),
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 30) % 360, 70, 50),
      ],
    },
    {
      name: "Triadic",
      colors: [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 120) % 360, 70, 50),
        hslToHex((baseHue + 240) % 360, 70, 50),
      ],
    },
    {
      name: "Split Complementary",
      colors: [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 150) % 360, 70, 50),
        hslToHex((baseHue + 210) % 360, 70, 50),
      ],
    },
    {
      name: "Tetradic",
      colors: [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 90) % 360, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
        hslToHex((baseHue + 270) % 360, 70, 50),
      ],
    },
    {
      name: "Monochromatic",
      colors: [
        hslToHex(baseHue, 70, 30),
        hslToHex(baseHue, 70, 50),
        hslToHex(baseHue, 70, 70),
      ],
    },
  ];
}

export function ColorHarmonyVisualizer() {
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(50);
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setHarmonies(generateHarmonies(hue));
  }, [hue]);

  const baseColor = hslToHex(hue, saturation, lightness);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const randomize = () => {
    if (isLocked) return;
    setHue(Math.floor(Math.random() * 360));
    setSaturation(Math.floor(Math.random() * 40) + 50);
    setLightness(Math.floor(Math.random() * 40) + 30);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Color Harmony Visualizer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsLocked(!isLocked)}
              title={isLocked ? "Unlock" : "Lock"}
            >
              {isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={randomize}
              disabled={isLocked}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Color Preview */}
        <div className="flex items-center gap-6">
          <motion.div
            className="w-24 h-24 rounded-2xl shadow-lg cursor-pointer"
            style={{ backgroundColor: baseColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(baseColor)}
          >
            <div className="w-full h-full flex items-center justify-center">
              {copiedColor === baseColor ? (
                <Check className="h-6 w-6 text-white drop-shadow-md" />
              ) : (
                <Copy className="h-6 w-6 text-white/70 drop-shadow-md opacity-0 hover:opacity-100 transition-opacity" />
              )}
            </div>
          </motion.div>
          <div className="flex-1 space-y-4">
            <div className="text-2xl font-mono font-bold">{baseColor}</div>
            <div className="text-sm text-muted-foreground">
              hsl({Math.round(hue)}, {Math.round(saturation)}%, {Math.round(lightness)}%)
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hue</span>
              <span>{Math.round(hue)}°</span>
            </div>
            <div
              className="h-4 rounded-full"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, ${saturation}%, ${lightness}%), 
                  hsl(60, ${saturation}%, ${lightness}%), 
                  hsl(120, ${saturation}%, ${lightness}%), 
                  hsl(180, ${saturation}%, ${lightness}%), 
                  hsl(240, ${saturation}%, ${lightness}%), 
                  hsl(300, ${saturation}%, ${lightness}%), 
                  hsl(360, ${saturation}%, ${lightness}%))`,
              }}
            >
              <Slider
                value={[hue]}
                onValueChange={([v]) => setHue(v)}
                min={0}
                max={360}
                step={1}
                disabled={isLocked}
                className="relative -top-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Saturation</span>
              <span>{Math.round(saturation)}%</span>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={([v]) => setSaturation(v)}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Lightness</span>
              <span>{Math.round(lightness)}%</span>
            </div>
            <Slider
              value={[lightness]}
              onValueChange={([v]) => setLightness(v)}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>
        </div>

        {/* Harmonies */}
        <div className="space-y-4">
          <h3 className="font-semibold">Color Harmonies</h3>
          <div className="grid gap-4">
            {harmonies.map((harmony) => (
              <motion.div
                key={harmony.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{harmony.name}</span>
                </div>
                <div className="flex gap-2">
                  {harmony.colors.map((color, i) => (
                    <motion.button
                      key={i}
                      className="flex-1 h-16 rounded-lg shadow-sm relative group"
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(color)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === color ? (
                          <Check className="h-5 w-5 text-white drop-shadow-md" />
                        ) : (
                          <Copy className="h-5 w-5 text-white drop-shadow-md" />
                        )}
                      </div>
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/90 bg-black/30 px-1.5 rounded">
                        {color}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
