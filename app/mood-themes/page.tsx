"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Smile,
  Zap,
  Moon,
  Sun,
  Coffee,
  Music,
  BookOpen,
  Gamepad2,
  Sparkles,
  Palette,
  Type,
  Layout,
  Check,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MoodTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  icon: React.ElementType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  font: string;
  borderRadius: number;
  animations: 'subtle' | 'playful' | 'calm' | 'energetic';
  particleEffect?: 'none' | 'bubbles' | 'stars' | 'leaves';
}

const moodThemes: MoodTheme[] = [
  {
    id: "focused",
    name: "Deep Focus",
    emoji: "🎯",
    description: "Minimal distractions, maximum productivity",
    icon: Coffee,
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#a78bfa",
      background: "#0f0f1a",
      foreground: "#e2e8f0",
      muted: "#1e1e2e"
    },
    font: "Inter",
    borderRadius: 4,
    animations: 'subtle',
    particleEffect: 'none'
  },
  {
    id: "creative",
    name: "Creative Flow",
    emoji: "🎨",
    description: "Vibrant colors to spark inspiration",
    icon: Palette,
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#fbbf24",
      background: "#1a0f1a",
      foreground: "#fef3c7",
      muted: "#2d1f2d"
    },
    font: "Georgia",
    borderRadius: 16,
    animations: 'playful',
    particleEffect: 'stars'
  },
  {
    id: "calm",
    name: "Zen Mode",
    emoji: "🧘",
    description: "Soft tones for peaceful browsing",
    icon: Moon,
    colors: {
      primary: "#14b8a6",
      secondary: "#06b6d4",
      accent: "#22d3ee",
      background: "#0f1f1f",
      foreground: "#ccfbf1",
      muted: "#1e2e2e"
    },
    font: "System",
    borderRadius: 24,
    animations: 'calm',
    particleEffect: 'bubbles'
  },
  {
    id: "energetic",
    name: "High Energy",
    emoji: "⚡",
    description: "Bold and dynamic for active sessions",
    icon: Zap,
    colors: {
      primary: "#fbbf24",
      secondary: "#f59e0b",
      accent: "#ef4444",
      background: "#1a0f0f",
      foreground: "#fef2f2",
      muted: "#2d1f1f"
    },
    font: "Impact",
    borderRadius: 8,
    animations: 'energetic',
    particleEffect: 'leaves'
  },
  {
    id: "cozy",
    name: "Cozy Evening",
    emoji: "🕯️",
    description: "Warm tones for relaxed reading",
    icon: BookOpen,
    colors: {
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fdba74",
      background: "#1f1510",
      foreground: "#ffedd5",
      muted: "#2d2520"
    },
    font: "Georgia",
    borderRadius: 12,
    animations: 'calm',
    particleEffect: 'none'
  },
  {
    id: "playful",
    name: "Playground",
    emoji: "🎮",
    description: "Fun and colorful for exploration",
    icon: Gamepad2,
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "#0f0a1f",
      foreground: "#faf5ff",
      muted: "#1e1a2e"
    },
    font: "Comic Sans MS",
    borderRadius: 20,
    animations: 'playful',
    particleEffect: 'bubbles'
  }
];

function ParticleEffect({ type }: { type: string }) {
  if (type === 'none') return null;
  
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));
  
  const getParticleContent = () => {
    switch (type) {
      case 'bubbles': return '○';
      case 'stars': return '✦';
      case 'leaves': return '🍃';
      default: return '•';
    }
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-white/10"
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.3, 0.3, 0],
            x: [0, Math.random() * 50 - 25, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {getParticleContent()}
        </motion.div>
      ))}
    </div>
  );
}

export default function MoodThemesPage() {
  const [selectedMood, setSelectedMood] = useState<MoodTheme>(moodThemes[0]);
  const [intensity, setIntensity] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const applyTheme = (mood: MoodTheme) => {
    setSelectedMood(mood);
    
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', mood.colors.primary);
    root.style.setProperty('--mood-secondary', mood.colors.secondary);
    root.style.setProperty('--mood-accent', mood.colors.accent);
    root.style.setProperty('--mood-radius', `${mood.borderRadius}px`);
    root.style.setProperty('--mood-font', mood.font);
    
    // Apply animation class
    document.body.className = document.body.className.replace(/mood-animation-\w+/, '');
    document.body.classList.add(`mood-animation-${mood.animations}`);
  };
  
  useEffect(() => {
    applyTheme(selectedMood);
  }, [selectedMood]);

  return (
    <div 
      className="min-h-screen pt-24 pb-16 transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${selectedMood.colors.background} 0%, ${selectedMood.colors.muted} 100%)`,
        color: selectedMood.colors.foreground,
        fontFamily: selectedMood.font
      }}
    >
      <ParticleEffect type={selectedMood.particleEffect || 'none'} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ 
              backgroundColor: `${selectedMood.colors.primary}20`,
              color: selectedMood.colors.primary 
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Set Your Vibe</span>
          </motion.div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: selectedMood.colors.foreground }}
          >
            Mood <span style={{ color: selectedMood.colors.primary }}>Themes</span>
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: `${selectedMood.colors.foreground}99` }}>
            Transform your browsing experience based on how you feel.
            Each theme is carefully crafted to match your mood.
          </p>
        </motion.div>

        {/* Current Mood Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card 
            className="overflow-hidden border-0 shadow-2xl"
            style={{ 
              backgroundColor: selectedMood.colors.muted,
              borderRadius: selectedMood.borderRadius * 2
            }}
          >
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  animate={{ 
                    rotate: selectedMood.animations === 'playful' ? [0, 10, -10, 0] : 0,
                    scale: selectedMood.animations === 'energetic' ? [1, 1.1, 1] : 1
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl"
                >
                  {selectedMood.emoji}
                </motion.div>
                
                <div className="text-center md:text-left flex-1">
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ color: selectedMood.colors.foreground }}
                  >
                    {selectedMood.name}
                  </h2>
                  <p style={{ color: `${selectedMood.colors.foreground}99` }}>
                    {selectedMood.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: `${selectedMood.colors.primary}30`,
                        color: selectedMood.colors.primary
                      }}
                    >
                      {selectedMood.font}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: `${selectedMood.colors.secondary}30`,
                        color: selectedMood.colors.secondary
                      }}
                    >
                      {selectedMood.animations} animations
                    </Badge>
                    {selectedMood.particleEffect !== 'none' && (
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${selectedMood.colors.accent}30`,
                          color: selectedMood.colors.accent
                        }}
                      >
                        {selectedMood.particleEffect} particles
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Color Preview */}
                <div className="flex gap-2">
                  {Object.entries(selectedMood.colors).slice(0, 4).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-12 h-12 rounded-lg shadow-lg"
                      style={{ backgroundColor: color }}
                      title={key}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Smile className="h-5 w-5" style={{ color: selectedMood.colors.primary }} />
            Choose Your Mood
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moodThemes.map((mood, index) => {
              const Icon = mood.icon;
              const isActive = mood.id === selectedMood.id;
              
              return (
                <motion.button
                  key={mood.id}
                  onClick={() => applyTheme(mood)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isActive 
                      ? 'ring-2 ring-offset-2' 
                      : 'hover:shadow-lg'
                  }`}
                  style={{
                    backgroundColor: isActive ? mood.colors.primary : mood.colors.muted,
                    color: isActive ? '#fff' : mood.colors.foreground,
                    borderRadius: mood.borderRadius,
                    ringColor: isActive ? mood.colors.primary : 'transparent'
                  }}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="font-semibold text-sm">{mood.name}</div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: mood.colors.accent }}
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Customization Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Intensity Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card style={{ backgroundColor: selectedMood.colors.muted }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" style={{ color: selectedMood.colors.primary }} />
                  Intensity
                </CardTitle>
                <CardDescription style={{ color: `${selectedMood.colors.foreground}99` }}>
                  Adjust how strongly the theme affects the interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Slider
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between mt-2 text-sm" style={{ color: `${selectedMood.colors.foreground}99` }}>
                  <span>Subtle</span>
                  <span>{intensity}%</span>
                  <span>Intense</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accessibility Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card style={{ backgroundColor: selectedMood.colors.muted }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" style={{ color: selectedMood.colors.primary }} />
                  Accessibility
                </CardTitle>
                <CardDescription style={{ color: `${selectedMood.colors.foreground}99` }}>
                  Customize for your comfort
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-xl font-semibold mb-6">Preview Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Button Preview */}
            <Card style={{ backgroundColor: selectedMood.colors.muted }}>
              <CardHeader>
                <CardTitle className="text-sm">Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  style={{ 
                    backgroundColor: selectedMood.colors.primary,
                    borderRadius: selectedMood.borderRadius
                  }}
                >
                  Primary Action
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{ 
                    borderColor: selectedMood.colors.primary,
                    color: selectedMood.colors.primary,
                    borderRadius: selectedMood.borderRadius
                  }}
                >
                  Secondary
                </Button>
              </CardContent>
            </Card>

            {/* Card Preview */}
            <Card style={{ backgroundColor: selectedMood.colors.muted }}>
              <CardHeader>
                <CardTitle className="text-sm">Card Component</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3" style={{ color: `${selectedMood.colors.foreground}99` }}>
                  This is how cards appear with the current mood theme.
                </p>
                <div className="flex gap-2">
                  <Badge style={{ backgroundColor: selectedMood.colors.primary }}>
                    Tag 1
                  </Badge>
                  <Badge style={{ backgroundColor: selectedMood.colors.secondary }}>
                    Tag 2
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Typography Preview */}
            <Card style={{ backgroundColor: selectedMood.colors.muted }}>
              <CardHeader>
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <h4 style={{ color: selectedMood.colors.foreground }}>Heading Text</h4>
                <p className="text-sm" style={{ color: `${selectedMood.colors.foreground}99` }}>
                  Body text appears with adjusted contrast for readability.
                </p>
                <a 
                  href="#" 
                  className="text-sm"
                  style={{ color: selectedMood.colors.primary }}
                  onClick={(e) => e.preventDefault()}
                >
                  Link text
                </a>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            onClick={() => applyTheme(moodThemes[0])}
            style={{ borderColor: selectedMood.colors.primary }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
