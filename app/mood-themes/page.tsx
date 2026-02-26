"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Zap,
  Coffee,
  Music,
  BookOpen,
  Gamepad2,
  Dumbbell,
  Briefcase,
  Heart,
  Palette,
  Type,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  RotateCcw,
  Sparkle,
  Wand2,
  Save,
  Share2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import confetti from "canvas-confetti";

type Mood = "energetic" | "calm" | "focused" | "creative" | "cozy" | "professional";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: "compact" | "comfortable" | "spacious";
  radius: "none" | "small" | "medium" | "large" | "full";
  animations: "minimal" | "subtle" | "playful" | "dynamic";
}

const moodThemes: Record<Mood, ThemeConfig> = {
  energetic: {
    name: "Electric Pulse",
    colors: {
      primary: "#FF6B35",
      secondary: "#F7C59F",
      accent: "#FFD93D",
      background: "#FFF5F0",
      foreground: "#1A1A2E",
      muted: "#FFE8E0",
      border: "#FFD4C4"
    },
    fonts: { heading: "Inter", body: "Inter" },
    spacing: "comfortable",
    radius: "large",
    animations: "dynamic"
  },
  calm: {
    name: "Ocean Breeze",
    colors: {
      primary: "#4ECDC4",
      secondary: "#96CEB4",
      accent: "#FFEAA7",
      background: "#F0F9F9",
      foreground: "#2D3436",
      muted: "#E0F2F1",
      border: "#B2DFDB"
    },
    fonts: { heading: "Inter", body: "Inter" },
    spacing: "spacious",
    radius: "medium",
    animations: "subtle"
  },
  focused: {
    name: "Deep Work",
    colors: {
      primary: "#6366F1",
      secondary: "#8B5CF6",
      accent: "#10B981",
      background: "#FAFAFA",
      foreground: "#111827",
      muted: "#E5E7EB",
      border: "#D1D5DB"
    },
    fonts: { heading: "JetBrains Mono", body: "Inter" },
    spacing: "compact",
    radius: "small",
    animations: "minimal"
  },
  creative: {
    name: "Artist's Studio",
    colors: {
      primary: "#E056FD",
      secondary: "#FF6B9D",
      accent: "#C7CEEA",
      background: "#FFF0F5",
      foreground: "#2D1B2E",
      muted: "#FFE4EC",
      border: "#FFB8D0"
    },
    fonts: { heading: "Playfair Display", body: "Inter" },
    spacing: "comfortable",
    radius: "full",
    animations: "playful"
  },
  cozy: {
    name: "Warm Blanket",
    colors: {
      primary: "#D4A373",
      secondary: "#CCD5AE",
      accent: "#FAEDCD",
      background: "#FEFAE0",
      foreground: "#3D405B",
      muted: "#FAF3E0",
      border: "#E9EDC9"
    },
    fonts: { heading: "Inter", body: "Inter" },
    spacing: "comfortable",
    radius: "large",
    animations: "subtle"
  },
  professional: {
    name: "Executive",
    colors: {
      primary: "#1E3A5F",
      secondary: "#4A6FA5",
      accent: "#D4AF37",
      background: "#FFFFFF",
      foreground: "#1A1A1A",
      muted: "#F5F5F5",
      border: "#E0E0E0"
    },
    fonts: { heading: "Inter", body: "Inter" },
    spacing: "compact",
    radius: "small",
    animations: "minimal"
  }
};

const moods: { id: Mood; label: string; icon: typeof Sun; description: string }[] = [
  { id: "energetic", label: "Energetic", icon: Zap, description: "High energy, vibrant colors" },
  { id: "calm", label: "Calm", icon: Cloud, description: "Peaceful, soothing tones" },
  { id: "focused", label: "Focused", icon: Briefcase, description: "Minimal distractions" },
  { id: "creative", label: "Creative", icon: Palette, description: "Inspiring, artistic vibes" },
  { id: "cozy", label: "Cozy", icon: Coffee, description: "Warm, comfortable feeling" },
  { id: "professional", label: "Professional", icon: Briefcase, description: "Clean, business-ready" },
];

const activities = [
  { id: "coding", label: "Coding", icon: Briefcase },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "music", label: "Music", icon: Music },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "relaxing", label: "Relaxing", icon: Heart },
];

function MoodCard({ 
  mood, 
  isSelected, 
  onClick 
}: { 
  mood: typeof moods[0]; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const Icon = mood.icon;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-6 rounded-2xl border-2 transition-all text-left w-full ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 bg-card'
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="selectedMood"
          className="absolute top-3 right-3"
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        </motion.div>
      )}
      
      <div className={`inline-flex p-3 rounded-xl mb-4 ${
        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <h3 className="font-semibold text-lg mb-1">{mood.label}</h3>
      <p className="text-sm text-muted-foreground">{mood.description}</p>
    </motion.button>
  );
}

function ThemePreview({ config }: { config: ThemeConfig }) {
  return (
    <div 
      className="rounded-xl overflow-hidden border transition-all duration-500"
      style={{ 
        backgroundColor: config.colors.background,
        borderColor: config.colors.border,
        borderRadius: config.radius === 'full' ? '24px' : config.radius === 'large' ? '16px' : config.radius === 'medium' ? '12px' : config.radius === 'small' ? '8px' : '0'
      }}
    >
      {/* Preview Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          backgroundColor: config.colors.muted,
          borderColor: config.colors.border 
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
            style={{ 
              backgroundColor: config.colors.primary,
              color: '#fff',
              borderRadius: config.radius === 'full' ? '50%' : config.radius === 'large' ? '12px' : config.radius === 'medium' ? '8px' : config.radius === 'small' ? '4px' : '0'
            }}
          >
            N
          </div>
          <div>
            <div 
              className="font-semibold"
              style={{ color: config.colors.foreground }}
            >
              Preview
            </div>
            <div 
              className="text-sm"
              style={{ color: config.colors.foreground + '99' }}
            >
              {config.name}
            </div>
          </div>        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4 space-y-4">
        <div 
          className="h-2 rounded-full w-3/4"
          style={{ 
            backgroundColor: config.colors.primary,
            borderRadius: config.radius === 'none' ? '0' : '9999px'
          }}
        />
        <div className="space-y-2">
          <div 
            className="h-2 rounded-full w-full"
            style={{ 
              backgroundColor: config.colors.muted,
              borderRadius: config.radius === 'none' ? '0' : '9999px'
            }}
          />
          <div 
            className="h-2 rounded-full w-5/6"
            style={{ 
              backgroundColor: config.colors.muted,
              borderRadius: config.radius === 'none' ? '0' : '9999px'
            }}
          />
          <div 
            className="h-2 rounded-full w-4/6"
            style={{ 
              backgroundColor: config.colors.muted,
              borderRadius: config.radius === 'none' ? '0' : '9999px'
            }}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <div 
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ 
              backgroundColor: config.colors.primary,
              color: '#fff',
              borderRadius: config.radius === 'full' ? '9999px' : config.radius === 'large' ? '10px' : config.radius === 'medium' ? '6px' : config.radius === 'small' ? '4px' : '0'
            }}
          >
            Primary
          </div>          
          <div 
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ 
              borderColor: config.colors.border,
              color: config.colors.foreground,
              borderRadius: config.radius === 'full' ? '9999px' : config.radius === 'large' ? '10px' : config.radius === 'medium' ? '6px' : config.radius === 'small' ? '4px' : '0'
            }}
          >
            Secondary
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MoodThemePage() {
  const [selectedMood, setSelectedMood] = useState<Mood>("focused");
  const [currentTime, setCurrentTime] = useState<TimeOfDay>("morning");
  const [selectedActivity, setSelectedActivity] = useState("coding");
  const [intensity, setIntensity] = useState(50);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [savedThemes, setSavedThemes] = useState<string[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setCurrentTime("morning");
    } else if (hour >= 12 && hour < 17) {
      setCurrentTime("afternoon");
    } else if (hour >= 17 && hour < 21) {
      setCurrentTime("evening");
    } else {
      setCurrentTime("night");
    }
  }, []);

  const currentTheme = moodThemes[selectedMood];

  const handleSaveTheme = () => {
    if (!savedThemes.includes(currentTheme.name)) {
      setSavedThemes([...savedThemes, currentTheme.name]);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const timeIcons = {
    morning: Sun,
    afternoon: Sun,
    evening: Cloud,
    night: Moon
  };

  const TimeIcon = timeIcons[currentTime];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Personalize Your Experience</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Mood-Based{" "}
            <span className="text-gradient">Themes</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let your mood guide your workspace. Choose how you feel and we'll create 
            the perfect environment for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <TimeIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Time</p>
                        <h3 className="text-xl font-semibold capitalize">
                          Good {currentTime}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Auto-adjust</span>
                      <Switch 
                        checked={autoAdjust}
                        onCheckedChange={setAutoAdjust}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">How are you feeling?{/* Activity Selection */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {moods.map((mood, index) => (
                <motion.div
                  key={mood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <MoodCard
                    mood={mood}
                    isSelected={selectedMood === mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Activity Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold mb-4">What are you working on?</h2>
              <div className="flex flex-wrap gap-3">
                {activities.map(activity => {
                  const Icon = activity.icon;
                  const isSelected = selectedActivity === activity.id;
                  
                  return (
                    <Button
                      key={activity.id}
                      variant={isSelected ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setSelectedActivity(activity.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {activity.label}
                    </Button>
                  );
                })}
              </div>
            </motion.div>

            {/* Intensity Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Theme Intensity</h3>
                      <p className="text-sm text-muted-foreground">
                        Adjust how vibrant the theme appears
                      </p>
                    </div>
                    <span className="text-2xl font-bold">{intensity}%</span>
                  </div>
                  
                  <Slider
                    value={[intensity]}
                    onValueChange={(value) => setIntensity(value[0])}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Subtle</span>
                    <span>Balanced</span>
                    <span>Vibrant</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Preview
                  </CardTitle>
                  <CardDescription>
                    See how your selected mood transforms the interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemePreview config={currentTheme} />
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Theme Name</span>
                      <span className="font-medium">{currentTheme.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Animations</span>
                      <Badge variant="outline">{currentTheme.animations}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Spacing</span>
                      <Badge variant="outline">{currentTheme.spacing}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Corner Radius</span>
                      <Badge variant="outline">{currentTheme.radius}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button 
                      className="flex-1 gap-2"
                      onClick={handleSaveTheme}
                      disabled={savedThemes.includes(currentTheme.name)}
                    >
                      <Save className="h-4 w-4" />
                      {savedThemes.includes(currentTheme.name) ? 'Saved' : 'Save Theme'}
                    </Button>
                    
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Saved Themes */}
            {savedThemes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Saved Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {savedThemes.map((theme, index) => (
                        <div 
                          key={theme}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted"
                        >
                          <span className="font-medium">{theme}</span>
                          <Badge variant="secondary">Saved</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset to Default
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wand2 className="h-4 w-4" />
                    Surprise Me
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Theme
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
