"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Moon, 
  Sun, 
  Sparkles, 
  Cloud, 
  Flame,
  Droplets,
  Leaf,
  Coffee,
  Music,
  BookOpen,
  Gamepad2,
  Heart,
  Zap,
  Wind,
  Mountain,
  Rainbow,
  Star,
  Ghost,
  Check,
  RotateCcw,
  Download,
  Share2,
  Wand2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// Mood theme definitions
interface MoodTheme {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  animations: {
    speed: 'slow' | 'normal' | 'fast';
    intensity: 'subtle' | 'medium' | 'intense';
  };
  particleEffect?: string;
  soundscape?: string;
}

const moodThemes: MoodTheme[] = [
  {
    id: "midnight",
    name: "Midnight Focus",
    description: "Deep concentration with dark, calming tones",
    icon: <Moon className="w-5 h-5" />,
    colors: {
      primary: "#6366f1",
      secondary: "#1e1b4b",
      accent: "#818cf8",
      background: "#020617",
      foreground: "#e2e8f0",
      muted: "#1e293b",
      border: "#334155"
    },
    gradients: {
      hero: "from-indigo-950 via-slate-950 to-black",
      card: "from-indigo-900/20 to-slate-900/20",
      button: "from-indigo-600 to-violet-600"
    },
    animations: { speed: 'slow', intensity: 'subtle' },
    particleEffect: 'stars',
    soundscape: 'ambient'
  },
  {
    id: "sunrise",
    name: "Sunrise Energy",
    description: "Fresh, optimistic vibes for morning productivity",
    icon: <Sun className="w-5 h-5" />,
    colors: {
      primary: "#f97316",
      secondary: "#fef3c7",
      accent: "#fbbf24",
      background: "#fffbeb",
      foreground: "#451a03",
      muted: "#fde68a",
      border: "#fcd34d"
    },
    gradients: {
      hero: "from-orange-100 via-amber-50 to-yellow-50",
      card: "from-orange-100/50 to-amber-100/50",
      button: "from-orange-500 to-amber-500"
    },
    animations: { speed: 'normal', intensity: 'medium' },
    particleEffect: 'sunrays',
    soundscape: 'upbeat'
  },
  {
    id: "forest",
    name: "Forest Calm",
    description: "Nature-inspired serenity for mindful work",
    icon: <Leaf className="w-5 h-5" />,
    colors: {
      primary: "#16a34a",
      secondary: "#dcfce7",
      accent: "#4ade80",
      background: "#f0fdf4",
      foreground: "#14532d",
      muted: "#bbf7d0",
      border: "#86efac"
    },
    gradients: {
      hero: "from-green-100 via-emerald-50 to-teal-50",
      card: "from-green-100/50 to-emerald-100/50",
      button: "from-green-600 to-emerald-600"
    },
    animations: { speed: 'slow', intensity: 'subtle' },
    particleEffect: 'leaves',
    soundscape: 'nature'
  },
  {
    id: "ocean",
    name: "Ocean Flow",
    description: "Fluid, deep blues for creative flow states",
    icon: <Droplets className="w-5 h-5" />,
    colors: {
      primary: "#0ea5e9",
      secondary: "#e0f2fe",
      accent: "#38bdf8",
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      muted: "#bae6fd",
      border: "#7dd3fc"
    },
    gradients: {
      hero: "from-sky-100 via-cyan-50 to-blue-50",
      card: "from-sky-100/50 to-cyan-100/50",
      button: "from-sky-600 to-cyan-600"
    },
    animations: { speed: 'normal', intensity: 'medium' },
    particleEffect: 'bubbles',
    soundscape: 'waves'
  },
  {
    id: "cosmic",
    name: "Cosmic Dreams",
    description: "Purple nebula vibes for imaginative exploration",
    icon: <Sparkles className="w-5 h-5" />,
    colors: {
      primary: "#a855f7",
      secondary: "#f3e8ff",
      accent: "#c084fc",
      background: "#faf5ff",
      foreground: "#581c87",
      muted: "#e9d5ff",
      border: "#d8b4fe"
    },
    gradients: {
      hero: "from-purple-100 via-fuchsia-50 to-pink-50",
      card: "from-purple-100/50 to-fuchsia-100/50",
      button: "from-purple-600 to-fuchsia-600"
    },
    animations: { speed: 'slow', intensity: 'intense' },
    particleEffect: 'nebula',
    soundscape: 'ethereal'
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    description: "High-contrast neon for intense coding sessions",
    icon: <Zap className="w-5 h-5" />,
    colors: {
      primary: "#ec4899",
      secondary: "#1a0b2e",
      accent: "#22d3ee",
      background: "#0f0518",
      foreground: "#e879f9",
      muted: "#2d1b4e",
      border: "#4c1d95"
    },
    gradients: {
      hero: "from-fuchsia-950 via-purple-950 to-black",
      card: "from-fuchsia-900/20 to-cyan-900/20",
      button: "from-fuchsia-600 to-cyan-600"
    },
    animations: { speed: 'fast', intensity: 'intense' },
    particleEffect: 'glitch',
    soundscape: 'synthwave'
  },
  {
    id: "minimal",
    name: "Pure Minimal",
    description: "Clean, distraction-free monochrome",
    icon: <Mountain className="w-5 h-5" />,
    colors: {
      primary: "#171717",
      secondary: "#f5f5f5",
      accent: "#525252",
      background: "#ffffff",
      foreground: "#171717",
      muted: "#e5e5e5",
      border: "#d4d4d4"
    },
    gradients: {
      hero: "from-neutral-100 to-white",
      card: "from-neutral-100/50 to-gray-100/50",
      button: "from-neutral-800 to-neutral-900"
    },
    animations: { speed: 'normal', intensity: 'subtle' },
    particleEffect: 'none',
    soundscape: 'silence'
  },
  {
    id: "autumn",
    name: "Autumn Warmth",
    description: "Cozy, warm tones for comfortable browsing",
    icon: <Flame className="w-5 h-5" />,
    colors: {
      primary: "#dc2626",
      secondary: "#fef2f2",
      accent: "#f87171",
      background: "#fef9f3",
      foreground: "#7f1d1d",
      muted: "#fecaca",
      border: "#fca5a5"
    },
    gradients: {
      hero: "from-red-100 via-orange-50 to-amber-50",
      card: "from-red-100/50 to-orange-100/50",
      button: "from-red-600 to-orange-600"
    },
    animations: { speed: 'slow', intensity: 'subtle' },
    particleEffect: 'leaves',
    soundscape: 'lofi'
  }
];

// Activity presets
const activityPresets = [
  { id: 'coding', name: 'Deep Coding', icon: <Zap className="w-4 h-4" />, theme: 'midnight', music: 'ambient' },
  { id: 'reading', name: 'Reading', icon: <BookOpen className="w-4 h-4" />, theme: 'forest', music: 'nature' },
  { id: 'creative', name: 'Creative Work', icon: <Palette className="w-4 h-4" />, theme: 'cosmic', music: 'ethereal' },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" />, theme: 'cyberpunk', music: 'synthwave' },
  { id: 'relaxing', name: 'Relaxing', icon: <Coffee className="w-4 h-4" />, theme: 'autumn', music: 'lofi' },
  { id: 'morning', name: 'Morning Routine', icon: <Sun className="w-4 h-4" />, theme: 'sunrise', music: 'upbeat' }
];

// Preview card component
function ThemePreview({ theme, isActive, onClick }: { theme: MoodTheme; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
        isActive 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-border hover:border-primary/50'
      }`}
      style={{ backgroundColor: theme.colors.background }}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground">
            <Check className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: theme.colors.muted }}
        >
          <span style={{ color: theme.colors.primary }}>{theme.icon}</span>
        </div>
        <div className="flex-1">
          <h3 
            className="font-semibold mb-1"
            style={{ color: theme.colors.foreground }}
          >
            {theme.name}
          </h3>
          <p 
            className="text-sm"
            style={{ color: theme.colors.foreground, opacity: 0.7 }}
          >
            {theme.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: theme.colors.muted,
                color: theme.colors.foreground
              }}
            >
              {theme.animations.speed} animations
            </Badge>
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: theme.colors.muted,
                color: theme.colors.foreground
              }}
            >
              {theme.particleEffect}
            </Badge>
          </div>
        </div>
      </div>

      {/* Color preview */}
      <div className="flex gap-1 mt-3">
        {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
          <div
            key={key}
            className="w-6 h-6 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
            title={key}
          />
        ))}
      </div>
    </motion.button>
  );
}

// Live preview component
function LivePreview({ theme }: { theme: MoodTheme }) {
  return (
    <div 
      className="rounded-xl overflow-hidden border-2"
      style={{ 
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background
      }}
    >
      {/* Mock header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: theme.colors.muted }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background
            }}
          >
            N
          </div>
          <span style={{ color: theme.colors.foreground }}>Nemo</span>
        </div>
        <div className="flex gap-2">
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: theme.colors.border }}
          />
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: theme.colors.border }}
          />
        </div>
      </div>

      {/* Mock hero */}
      <div 
        className={`p-8 bg-gradient-to-br ${theme.gradients.hero}`}
      >
        <motion.h1 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.colors.foreground }}
          animate={{ 
            opacity: theme.animations.intensity === 'intense' ? [1, 0.8, 1] : 1 
          }}
          transition={{ 
            duration: theme.animations.speed === 'slow' ? 3 : theme.animations.speed === 'fast' ? 1 : 2,
            repeat: Infinity
          }}
        >
          Hello, I'm Nemo
        </motion.h1>
        <p style={{ color: theme.colors.foreground, opacity: 0.7 }}>
          Creative Developer
        </p>

        <div className="flex gap-2 mt-4">
          <motion.button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Work
          </motion.button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ 
              borderColor: theme.colors.border,
              color: theme.colors.foreground
            }}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Mock cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border"
            style={{ 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.muted
            }}
          >
            <div 
              className="w-8 h-8 rounded-lg mb-2"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div 
              className="h-4 w-20 rounded mb-1"
              style={{ backgroundColor: theme.colors.foreground, opacity: 0.2 }}
            />
            <div 
              className="h-3 w-full rounded"
              style={{ backgroundColor: theme.colors.foreground, opacity: 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MoodThemesPage() {
  const [activeTheme, setActiveTheme] = useState<MoodTheme>(moodThemes[0]);
  const [customizing, setCustomizing] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [particleIntensity, setParticleIntensity] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);

  const applyTheme = (theme: MoodTheme) => {
    setActiveTheme(theme);
    // In a real implementation, this would update CSS variables or context
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--background', theme.colors.background);
    document.documentElement.style.setProperty('--foreground', theme.colors.foreground);
  };

  const applyPreset = (preset: typeof activityPresets[0]) => {
    const theme = moodThemes.find(t => t.id === preset.theme);
    if (theme) {
      applyTheme(theme);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Palette className="w-3 h-3 mr-1" />
            Personalization
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mood Themes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your browsing experience with curated color palettes designed for different moods and activities.
          </p>
        </motion.div>

        {/* Quick Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Activity Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {activityPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={activeTheme.id === preset.theme ? 'default' : 'outline'}
                    className="flex-col h-auto py-4 gap-2"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.icon}
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Grid */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="themes">
              <TabsList className="mb-6">
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="custom">Customize</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="themes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moodThemes.map((theme, index) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ThemePreview
                        theme={theme}
                        isActive={activeTheme.id === theme.id}
                        onClick={() => applyTheme(theme)}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Customization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Animation Speed
                        </label>
                        <Slider
                          value={[animationSpeed]}
                          onValueChange={([v]) => setAnimationSpeed(v)}
                          max={100}
                          step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Slow</span>
                          <span>Fast</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Particle Intensity
                        </label>
                        <Slider
                          value={[particleIntensity]}
                          onValueChange={([v]) => setParticleIntensity(v)}
                          max={100}
                          step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Subtle</span>
                          <span>Intense</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Reduced Motion</label>
                        <Switch
                          checked={reducedMotion}
                          onCheckedChange={setReducedMotion}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Sound Effects</label>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Background Music</label>
                        <Switch />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Apply Changes
                      </Button>
                      <Button variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No Saved Themes</h3>
                    <p className="text-muted-foreground mb-4">
                      Customize a theme and save it for later
                    </p>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Save Current Theme
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LivePreview theme={activeTheme} />

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Theme</span>
                      <span className="font-medium">{activeTheme.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Element</span>
                      <span className="font-medium capitalize">{activeTheme.element}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Animation</span>
                      <span className="font-medium capitalize">{activeTheme.animations.speed}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Apply Theme
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Info */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">About This Theme</h4>
                  <p className="text-sm text-muted-foreground">
                    {activeTheme.description}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      <span>{activeTheme.particleEffect} particles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <span>{activeTheme.soundscape} soundscape</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
