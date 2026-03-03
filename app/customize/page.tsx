"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Moon, 
  Sun, 
  Monitor,
  Sparkles,
  Palette,
  Type,
  Layout,
  Check
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";

const colorThemes = [
  { name: "Default", primary: "#dc2626", secondary: "#ea580c", gradient: "from-red-600 to-orange-600" },
  { name: "Ocean", primary: "#0ea5e9", secondary: "#3b82f6", gradient: "from-sky-500 to-blue-600" },
  { name: "Forest", primary: "#10b981", secondary: "#059669", gradient: "from-emerald-500 to-green-600" },
  { name: "Purple", primary: "#8b5cf6", secondary: "#a855f7", gradient: "from-violet-500 to-purple-600" },
  { name: "Sunset", primary: "#f59e0b", secondary: "#ec4899", gradient: "from-amber-500 to-pink-500" },
  { name: "Midnight", primary: "#6366f1", secondary: "#8b5cf6", gradient: "from-indigo-500 to-violet-600" },
];

const fontOptions = [
  { name: "System", value: "system-ui", description: "Default system font" },
  { name: "Inter", value: "Inter, sans-serif", description: "Clean and modern" },
  { name: "Geist", value: "var(--font-geist-sans)", description: "Vercel's geometric font" },
  { name: "Mono", value: "var(--font-geist-mono)", description: "Code-like aesthetic" },
];

const animationSpeeds = [
  { name: "Slow", value: 0.5, description: "Relaxed transitions" },
  { name: "Normal", value: 1, description: "Balanced speed" },
  { name: "Fast", value: 1.5, description: "Snappy interactions" },
  { name: "Instant", value: 0, description: "No animations" },
];

export default function ThemeCustomizer() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeColor, setActiveColor] = useState(colorThemes[0]);
  const [activeFont, setActiveFont] = useState(fontOptions[1]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [glassEffects, setGlassEffects] = useState(true);
  const [particleEffects, setParticleEffects] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply color theme
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", activeColor.primary);
    root.style.setProperty("--primary-foreground", resolvedTheme === "dark" ? "#0c0a09" : "#fafaf9");
    root.style.setProperty("--ring", activeColor.primary);
  }, [activeColor, mounted, resolvedTheme]);

  // Apply font
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty("--font-sans", activeFont.value);
  }, [activeFont, mounted]);

  // Apply animation speed
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (reducedMotion || animationSpeed === 0) {
      root.style.setProperty("--animation-duration", "0ms");
    } else {
      root.style.setProperty("--animation-duration", `${1 / animationSpeed}s`);
    }
  }, [animationSpeed, reducedMotion, mounted]);

  // Apply high contrast
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Personalization</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Theme{" "}
            <span className="text-gradient-animated">Customizer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Make this portfolio truly yours. Customize colors, fonts, animations, and more.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appearance Section */}
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Mode */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "light", icon: Sun, label: "Light" },
                      { value: "dark", icon: Moon, label: "Dark" },
                      { value: "system", icon: Monitor, label: "Auto" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          theme === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <option.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {theme === option.value && (
                          <motion.div
                            layoutId="themeCheck"
                            className="absolute top-2 right-2"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Accent Color</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorThemes.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setActiveColor(color)}
                        className={`relative p-4 rounded-xl border transition-all ${
                          activeColor.name === color.name
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${color.gradient} mb-2`} />
                        <span className="text-sm font-medium">{color.name}</span>
                        {activeColor.name === color.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Typography Section */}
          <ScrollReveal delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Font Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Font Family</label>
                  <div className="space-y-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => setActiveFont(font)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                          activeFont.name === font.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div>
                          <span className="font-medium block">{font.name}</span>
                          <span className="text-sm text-muted-foreground">{font.description}</span>
                        </div>
                        {activeFont.name === font.name && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Preview</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: activeFont.value }}>
                    The quick brown fox
                  </p>
                  <p className="text-lg" style={{ fontFamily: activeFont.value }}>
                    jumps over the lazy dog
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Animation Section */}
          <ScrollReveal delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Animation & Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Animation Speed */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Animation Speed</label>
                  <div className="grid grid-cols-2 gap-3">
                    {animationSpeeds.map((speed) => (
                      <button
                        key={speed.name}
                        onClick={() => setAnimationSpeed(speed.value)}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          animationSpeed === speed.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium block">{speed.name}</span>
                        <span className="text-xs text-muted-foreground">{speed.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Reduced Motion</span>
                      <p className="text-sm text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Glass Effects</span>
                      <p className="text-sm text-muted-foreground">Frosted glass backgrounds</p>
                    </div>
                    <Switch checked={glassEffects} onCheckedChange={setGlassEffects} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Particle Effects</span>
                      <p className="text-sm text-muted-foreground">Interactive particles</p>
                    </div>
                    <Switch checked={particleEffects} onCheckedChange={setParticleEffects} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Accessibility Section */}
          <ScrollReveal delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <span className="font-medium">High Contrast Mode</span>
                    <p className="text-sm text-muted-foreground">Enhanced visibility</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>

                {/* Preview Card */}
                <div className={`p-6 rounded-xl border-2 ${highContrast ? "border-black dark:border-white" : "border-primary"}`}>
                  <h3 className="text-lg font-bold mb-2">Preview</h3>
                  <p className={`${highContrast ? "text-black dark:text-white" : "text-muted-foreground"}`}>
                    This is how content will appear with your selected settings.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge>Sample Badge</Badge>
                    <Button size="sm">Button</Button>
                  </div>
                </div>

                {/* Reset Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setActiveColor(colorThemes[0]);
                    setActiveFont(fontOptions[1]);
                    setAnimationSpeed(1);
                    setReducedMotion(false);
                    setHighContrast(false);
                    setGlassEffects(true);
                    setParticleEffects(true);
                    setTheme("system");
                  }}
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Live Preview Section */}
        <ScrollReveal delay={0.4} className="mt-12">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-orange-500/10">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sample Card 1 */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    glassEffects ? "glass" : "bg-card border-border"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeColor.gradient} mb-4`} />
                  <h3 className="text-lg font-semibold mb-2">Sample Card</h3>
                  <p className="text-sm text-muted-foreground">
                    This demonstrates your selected theme settings.
                  </p>
                </motion.div>

                {/* Sample Card 2 */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    glassEffects ? "glass" : "bg-card border-border"
                  }`}
                >
                  <div className="flex gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                    <div className="w-8 h-8 rounded-full bg-primary/40" />
                    <div className="w-8 h-8 rounded-full bg-primary/60" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
                  <p className="text-sm text-muted-foreground">
                    Your accent color applied to UI elements.
                  </p>
                </motion.div>

                {/* Sample Card 3 */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    glassEffects ? "glass" : "bg-card border-border"
                  }`}
                >
                  <div className="space-y-2 mb-4">
                    <div className="h-2 bg-primary/20 rounded-full w-full" />
                    <div className="h-2 bg-primary/40 rounded-full w-3/4" />
                    <div className="h-2 bg-primary/60 rounded-full w-1/2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Typography</h3>
                  <p className="text-sm text-muted-foreground">
                    Font: {activeFont.name}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
