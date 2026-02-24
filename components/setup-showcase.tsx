"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones, 
  Coffee,
  Sun,
  Moon,
  Zap,
  Download,
  Copy,
  Check,
  Palette,
  Image as ImageIcon,
  Maximize2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface SetupItem {
  name: string;
  description: string;
  link?: string;
  icon: React.ElementType;
}

interface Wallpaper {
  id: string;
  name: string;
  colors: string[];
  gradient: string;
  category: "minimal" | "gradient" | "nature" | "abstract";
}

const deskSetup: SetupItem[] = [
  {
    name: "MacBook Pro 16\"",
    description: "M3 Pro, 36GB RAM - My daily driver for development",
    link: "https://www.apple.com/macbook-pro/",
    icon: Monitor,
  },
  {
    name: "Keychron Q1 Pro",
    description: "Gateron G Pro Red switches, custom keycaps",
    link: "https://keychron.com/products/keychron-q1-pro",
    icon: Keyboard,
  },
  {
    name: "Logitech MX Master 3S",
    description: "Best mouse for productivity and comfort",
    link: "https://www.logitech.com/mx-master-3s",
    icon: Mouse,
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise canceling for deep work sessions",
    link: "https://www.sony.com/wh-1000xm5",
    icon: Headphones,
  },
  {
    name: "Herman Miller Aeron",
    description: "Ergonomic chair for long coding sessions",
    link: "https://www.hermanmiller.com/aeron",
    icon: Zap,
  },
];

const softwareSetup: SetupItem[] = [
  {
    name: "VS Code",
    description: "Primary editor with custom theme and extensions",
    link: "https://code.visualstudio.com/",
    icon: Monitor,
  },
  {
    name: "Warp Terminal",
    description: "Modern Rust-based terminal with AI features",
    link: "https://www.warp.dev/",
    icon: Zap,
  },
  {
    name: "Figma",
    description: "Design tool for UI/UX work",
    link: "https://www.figma.com/",
    icon: Palette,
  },
  {
    name: "Raycast",
    description: "Spotlight replacement with workflows",
    link: "https://www.raycast.com/",
    icon: Zap,
  },
  {
    name: "Notion",
    description: "Notes, docs, and project management",
    link: "https://www.notion.so/",
    icon: Monitor,
  },
];

const wallpapers: Wallpaper[] = [
  {
    id: "1",
    name: "Midnight Ocean",
    colors: ["#0f172a", "#1e3a5f", "#0c4a6e"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
    category: "gradient",
  },
  {
    id: "2",
    name: "Sunset Vibes",
    colors: ["#7c2d12", "#c2410c", "#fb923c"],
    gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)",
    category: "gradient",
  },
  {
    id: "3",
    name: "Forest Calm",
    colors: ["#14532d", "#166534", "#15803d"],
    gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
    category: "gradient",
  },
  {
    id: "4",
    name: "Purple Dreams",
    colors: ["#581c87", "#7c3aed", "#a855f7"],
    gradient: "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)",
    category: "gradient",
  },
  {
    id: "5",
    name: "Clean Slate",
    colors: ["#f8fafc", "#e2e8f0", "#cbd5e1"],
    gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
    category: "minimal",
  },
  {
    id: "6",
    name: "Dark Matter",
    colors: ["#020617", "#0f172a", "#1e293b"],
    gradient: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
    category: "minimal",
  },
];

const colorThemes = [
  {
    name: "Rose Pine",
    colors: ["#191724", "#1f1d2e", "#26233a", "#ebbcba", "#f6c177"],
    description: "A soothing theme with warm pastel colors",
  },
  {
    name: "Catppuccin",
    colors: ["#1e1e2e", "#302d41", "#575268", "#f5c2e7", "#89dceb"],
    description: "Pastel theme with soft, cozy colors",
  },
  {
    name: "Tokyo Night",
    colors: ["#1a1b26", "#24283b", "#414868", "#7aa2f7", "#bb9af7"],
    description: "Dark theme inspired by Tokyo nightlife",
  },
  {
    name: "Dracula",
    colors: ["#282a36", "#44475a", "#6272a4", "#ff79c6", "#8be9fd"],
    description: "Classic dark theme with vibrant accents",
  },
  {
    name: "Nord",
    colors: ["#2e3440", "#3b4252", "#434c5e", "#88c0d0", "#81a1c1"],
    description: "Arctic-inspired color palette",
  },
];

export function SetupShowcase() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast(`Copied ${color} to clipboard!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const downloadWallpaper = (wallpaper: Wallpaper) => {
    // Create a canvas to generate the wallpaper
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      wallpaper.colors.forEach((color, index) => {
        gradient.addColorStop(index / (wallpaper.colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Download
      const link = document.createElement("a");
      link.download = `${wallpaper.name.toLowerCase().replace(/\s+/g, "-")}-wallpaper.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast("Wallpaper downloaded!");
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="hardware" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="wallpapers">Wallpapers</TabsTrigger>
        </TabsList>

        <TabsContent value="hardware" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deskSetup.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.link && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <Zap className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="software" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {softwareSetup.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.link && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <Zap className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wallpapers" className="space-y-6">
          {/* Generated Wallpapers */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Generated Gradients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallpapers.map((wallpaper, index) => (
                <motion.div
                  key={wallpaper.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedWallpaper(wallpaper)}
                  >
                    <div
                      className="h-32 w-full transition-transform group-hover:scale-105"
                      style={{ background: wallpaper.gradient }}
                    />
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{wallpaper.name}</h4>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {wallpaper.category}
                          </Badge>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadWallpaper(wallpaper);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Color Themes */}
          <section>
            <h3 className="text-lg font-semibold mb-4">VS Code Themes I Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorThemes.map((theme, index) => (
                <motion.div
                  key={theme.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{theme.name}</h4>
                        <div className="flex gap-1">
                          {theme.colors.slice(0, 3).map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded-full border-2 border-border hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => copyColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {theme.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => copyColor(color)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs hover:bg-muted/80 transition-colors"
                          >
                            {copiedColor === color ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                {color}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Wallpaper Preview Modal */}
      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedWallpaper(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white"
                onClick={() => setSelectedWallpaper(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <div
                className="aspect-video rounded-lg shadow-2xl"
                style={{ background: selectedWallpaper.gradient }}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedWallpaper.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {selectedWallpaper.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => copyColor(color)}
                        className="px-2 py-1 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => downloadWallpaper(selectedWallpaper)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SetupShowcase;
