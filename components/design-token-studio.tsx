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
  Sun,
  Moon,
  Monitor,
  Type,
  Layout,
  Sparkles,
  Download,
  Upload,
  Shuffle,
  Eye,
  EyeOff,
  Grid3X3,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorToken {
  name: string;
  value: string;
  description: string;
  category: "primary" | "secondary" | "neutral" | "semantic";
}

interface TypographyToken {
  name: string;
  size: string;
  lineHeight: string;
  weight: number;
  letterSpacing: string;
}

interface SpacingToken {
  name: string;
  value: string;
  px: number;
}

interface ShadowToken {
  name: string;
  value: string;
  preview: string;
}

const INITIAL_COLORS: ColorToken[] = [
  { name: "Primary", value: "#dc2626", description: "Main brand color", category: "primary" },
  { name: "Primary Light", value: "#f87171", description: "Light variant", category: "primary" },
  { name: "Primary Dark", value: "#991b1b", description: "Dark variant", category: "primary" },
  { name: "Secondary", value: "#ea580c", description: "Accent color", category: "secondary" },
  { name: "Background", value: "#fafaf9", description: "Page background", category: "neutral" },
  { name: "Foreground", value: "#1c1917", description: "Text color", category: "neutral" },
  { name: "Muted", value: "#f5f5f4", description: "Subtle background", category: "neutral" },
  { name: "Success", value: "#22c55e", description: "Success states", category: "semantic" },
  { name: "Warning", value: "#f59e0b", description: "Warning states", category: "semantic" },
  { name: "Error", value: "#ef4444", description: "Error states", category: "semantic" },
];

const TYPOGRAPHY: TypographyToken[] = [
  { name: "Heading 1", size: "3rem", lineHeight: "1.2", weight: 700, letterSpacing: "-0.02em" },
  { name: "Heading 2", size: "2.25rem", lineHeight: "1.25", weight: 600, letterSpacing: "-0.01em" },
  { name: "Heading 3", size: "1.5rem", lineHeight: "1.3", weight: 600, letterSpacing: "0" },
  { name: "Body Large", size: "1.125rem", lineHeight: "1.6", weight: 400, letterSpacing: "0" },
  { name: "Body", size: "1rem", lineHeight: "1.6", weight: 400, letterSpacing: "0" },
  { name: "Small", size: "0.875rem", lineHeight: "1.5", weight: 400, letterSpacing: "0" },
  { name: "Caption", size: "0.75rem", lineHeight: "1.4", weight: 500, letterSpacing: "0.02em" },
];

const SPACING: SpacingToken[] = [
  { name: "xs", value: "0.25rem", px: 4 },
  { name: "sm", value: "0.5rem", px: 8 },
  { name: "md", value: "1rem", px: 16 },
  { name: "lg", value: "1.5rem", px: 24 },
  { name: "xl", value: "2rem", px: 32 },
  { name: "2xl", value: "3rem", px: 48 },
  { name: "3xl", value: "4rem", px: 64 },
];

const SHADOWS: ShadowToken[] = [
  { name: "None", value: "none", preview: "shadow-none" },
  { name: "Small", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", preview: "shadow-sm" },
  { name: "Medium", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", preview: "shadow-md" },
  { name: "Large", value: "0 10px 15px -3px rgb(0 0 0 / 0.1)", preview: "shadow-lg" },
  { name: "Extra Large", value: "0 20px 25px -5px rgb(0 0 0 / 0.1)", preview: "shadow-xl" },
  { name: "2XL", value: "0 25px 50px -12px rgb(0 0 0 / 0.25)", preview: "shadow-2xl" },
];

const RADIUS = [
  { name: "None", value: "0" },
  { name: "Small", value: "0.25rem" },
  { name: "Medium", value: "0.5rem" },
  { name: "Large", value: "0.75rem" },
  { name: "Extra Large", value: "1rem" },
  { name: "2XL", value: "1.5rem" },
  { name: "Full", value: "9999px" },
];

export function DesignTokenStudio() {
  const [colors, setColors] = useState<ColorToken[]>(INITIAL_COLORS);
  const [selectedColor, setSelectedColor] = useState<ColorToken | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark" | "system">("light");
  const [radiusValue, setRadiusValue] = useState(0.625);
  const [showPreview, setShowPreview] = useState(true);
  const [generatedTheme, setGeneratedTheme] = useState("");

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const updateColor = (index: number, newValue: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], value: newValue };
    setColors(newColors);
  };

  const generateRandomPalette = () => {
    const hue = Math.floor(Math.random() * 360);
    const newColors = colors.map((color, index) => {
      if (color.category === "primary") {
        const saturation = 70 + Math.random() * 20;
        const lightness = 40 + (index * 15);
        return { ...color, value: `hsl(${hue}, ${saturation}%, ${lightness}%)` };
      }
      return color;
    });
    setColors(newColors);
  };

  const exportTheme = () => {
    const theme = {
      colors: colors.reduce((acc, c) => ({ ...acc, [c.name.toLowerCase().replace(" ", "-")]: c.value }), {}),
      typography: TYPOGRAPHY,
      spacing: SPACING,
      radius: radiusValue,
    };
    
    const css = `:root {
${colors.map(c => `  --color-${c.name.toLowerCase().replace(" ", "-")}: ${c.value};`).join("\n")}
  --radius: ${radiusValue}rem;
}`;
    
    setGeneratedTheme(css);
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const ColorCard = ({ color, index }: { color: ColorToken; index: number }) => {
    const isCopied = copiedColor === color.name;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="group relative rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => copyToClipboard(color.value, color.name)}
      >
        <div
          className="h-24 w-full transition-all"
          style={{ backgroundColor: color.value }}
        />
        <div className="p-4 bg-card border border-t-0 border-border rounded-b-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{color.name}</span>
            <motion.div
              initial={false}
              animate={{ scale: isCopied ? 1.2 : 1 }}
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={color.value}
              onChange={(e) => updateColor(index, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-7 text-xs font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{color.description}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Design System</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Design Token <span className="text-gradient-animated">Studio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore, customize, and export design tokens. Create consistent, beautiful interfaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={generateRandomPalette}
                >
                  <Shuffle className="w-4 h-4" />
                  Randomize Palette
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => setColors(INITIAL_COLORS)}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to Default
                </Button>
                
                <Button 
                  className="w-full gap-2"
                  onClick={exportTheme}
                >
                  <Download className="w-4 h-4" />
                  Export CSS
                </Button>
              </div>            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">Preview Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPreviewMode("light")}
                      className={`p-2 rounded-lg transition-colors ${previewMode === "light" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Sun className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode("dark")}
                      className={`p-2 rounded-lg transition-colors ${previewMode === "dark" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Moon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Border Radius</span>
                    <span className="text-sm text-muted-foreground">{radiusValue}rem</span>
                  </div>
                  <Slider
                    value={[radiusValue]}
                    onValueChange={([v]) => setRadiusValue(v)}
                    min={0}
                    max={2}
                    step={0.125}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {generatedTheme && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Generated CSS</h3>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedTheme, "theme")}
                    >
                      {copiedColor === "theme" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-muted font-mono text-xs overflow-auto max-h-48">
                    <code>{generatedTheme}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="colors" className="gap-2">
                  <Palette className="w-4 h-4" /> Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="gap-2">
                  <Type className="w-4 h-4" /> Typography
                </TabsTrigger>
                <TabsTrigger value="spacing" className="gap-2">
                  <Grid3X3 className="w-4 h-4" /> Spacing
                </TabsTrigger>
                <TabsTrigger value="effects" className="gap-2">
                  <Layers className="w-4 h-4" /> Effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colors.map((color, index) => (
                    <ColorCard key={color.name} color={color} index={index} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                {TYPOGRAPHY.map((type) => (
                  <div
                    key={type.name}
                    className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between"
                  >
                    <div
                      style={{
                        fontSize: type.size,
                        lineHeight: type.lineHeight,
                        fontWeight: type.weight,
                        letterSpacing: type.letterSpacing,
                      }}
                    >
                      {type.name}
                    </div>
                    <div className="text-right text-sm text-muted-foreground font-mono">
                      <div>{type.size}</div>
                      <div>{fontWeight: type.weight}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="spacing" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SPACING.map((space) => (
                    <div
                      key={space.name}
                      className="p-4 rounded-2xl bg-card border border-border text-center"
                    >
                      <div
                        className="mx-auto mb-4 bg-primary/20 rounded"
                        style={{ width: space.px, height: space.px }}
                      />
                      <p className="font-medium">{space.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{space.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Shadows</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SHADOWS.map((shadow) => (
                      <div
                        key={shadow.name}
                        className={`p-6 rounded-xl bg-card ${shadow.preview}`}
                      >
                        <p className="font-medium text-center">{shadow.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Border Radius</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {RADIUS.map((r) => (
                      <div
                        key={r.name}
                        className="p-6 bg-primary/10 flex items-center justify-center"
                        style={{ borderRadius: r.value }}
                      >
                        <p className="text-sm font-medium">{r.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
