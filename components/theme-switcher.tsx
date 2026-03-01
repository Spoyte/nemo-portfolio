"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette,
  Sparkles,
  Flame,
  Droplets,
  Leaf,
  Gem,
  X
} from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: string[];
  description: string;
}

const THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    icon: <Sun className="w-5 h-5" />,
    colors: ["#fafaf9", "#dc2626", "#1c1917"],
    description: "Clean and crisp",
  },
  {
    id: "dark",
    name: "Dark",
    icon: <Moon className="w-5 h-5" />,
    colors: ["#0c0a09", "#f87171", "#fafaf9"],
    description: "Easy on the eyes",
  },
  {
    id: "midnight",
    name: "Midnight",
    icon: <Sparkles className="w-5 h-5" />,
    colors: ["#0f172a", "#8b5cf6", "#e2e8f0"],
    description: "Deep purple vibes",
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: <Droplets className="w-5 h-5" />,
    colors: ["#0c4a6e", "#06b6d4", "#ecfeff"],
    description: "Calm and serene",
  },
  {
    id: "forest",
    name: "Forest",
    icon: <Leaf className="w-5 h-5" />,
    colors: ["#064e3b", "#10b981", "#d1fae5"],
    description: "Natural and fresh",
  },
  {
    id: "sunset",
    name: "Sunset",
    icon: <Flame className="w-5 h-5" />,
    colors: ["#431407", "#f97316", "#ffedd5"],
    description: "Warm and cozy",
  },
  {
    id: "monochrome",
    name: "Mono",
    icon: <Monitor className="w-5 h-5" />,
    colors: ["#18181b", "#71717a", "#fafafa"],
    description: "Minimal and sleek",
  },
  {
    id: "royal",
    name: "Royal",
    icon: <Gem className="w-5 h-5" />,
    colors: ["#2e1065", "#eab308", "#fef9c3"],
    description: "Luxurious gold",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentTheme = THEMES.find((t) => t.id === (theme || resolvedTheme)) || THEMES[0];

  if (!mounted) return null;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-4 z-50 p-3 rounded-full glass-strong shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div 
          className="w-6 h-6 rounded-full"
          style={{ background: `linear-gradient(135deg, ${currentTheme.colors[0]} 50%, ${currentTheme.colors[1]} 50%)` }}
        />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="fixed top-20 right-4 z-50 w-80 glass-strong rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Theme Studio</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      (theme || resolvedTheme) === t.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted hover:border-muted-foreground/20"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: t.colors[0], color: t.colors[2] }}
                      >
                        {t.icon}
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    
                    <div className="flex gap-1 mb-2">
                      {t.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Current: <span className="font-medium text-foreground">{currentTheme.name}</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
