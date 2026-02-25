"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Keyboard, 
  X, 
  Command, 
  Search, 
  Moon, 
  Sun, 
  Maximize, 
  Minimize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Music,
  Terminal,
  Zap,
  Gamepad2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Shortcut {
  key: string;
  label: string;
  description: string;
  category: "navigation" | "theme" | "features" | "easter";
  icon?: React.ElementType;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: "?", label: "?", description: "Show keyboard shortcuts", category: "navigation", icon: Keyboard },
  { key: "/", label: "/", description: "Open command palette", category: "navigation", icon: Search },
  { key: "Escape", label: "Esc", description: "Close modals/panels", category: "navigation", icon: X },
  { key: "ArrowUp", label: "↑", description: "Scroll up", category: "navigation", icon: ArrowUp },
  { key: "ArrowDown", label: "↓", description: "Scroll down", category: "navigation", icon: ArrowDown },
  
  // Theme
  { key: "d", label: "D", description: "Toggle dark mode", category: "theme", icon: Moon },
  { key: "l", label: "L", description: "Toggle light mode", category: "theme", icon: Sun },
  
  // Features
  { key: "f", label: "F", description: "Toggle focus mode", category: "features", icon: Maximize },
  { key: "m", label: "M", description: "Toggle music player", category: "features", icon: Music },
  { key: "t", label: "T", description: "Toggle terminal", category: "features", icon: Terminal },
  { key: "p", label: "P", description: "Toggle pomodoro timer", category: "features", icon: Zap },
  { key: "z", label: "Z", description: "Toggle zen mode", category: "features", icon: Minimize },
  
  // Easter Eggs
  { key: "Konami", label: "↑↑↓↓←→←→BA", description: "Secret page", category: "easter", icon: Gamepad2 },
];

const categories = {
  navigation: { label: "Navigation", color: "bg-blue-500" },
  theme: { label: "Theme", color: "bg-purple-500" },
  features: { label: "Features", color: "bg-green-500" },
  easter: { label: "Easter Eggs", color: "bg-orange-500" },
};

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Keyboard Shortcut Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-40 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground"
      >
        <Keyboard className="h-3 w-3" />
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground">?</kbd>
        <span>for shortcuts</span>
      </motion.div>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50"
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Keyboard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Keyboard Shortcuts</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Press a key to quickly navigate and control the site
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search shortcuts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        autoFocus
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, items], categoryIndex) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${categories[category as keyof typeof categories].color}`} />
                          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                            {categories[category as keyof typeof categories].label}
                          </h3>
                        </div>

                        <div className="grid gap-2">
                          {items.map((shortcut, index) => (
                            <motion.div
                              key={shortcut.key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                {shortcut.icon && (
                                  <shortcut.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                )}
                                <span className="text-sm">{shortcut.description}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {shortcut.key.split("").map((char, i) => (
                                  <kbd
                                    key={i}
                                    className="px-2 py-1 rounded bg-background border border-border font-mono text-xs min-w-[1.5rem] text-center"
                                  >
                                    {char}
                                  </kbd>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredShortcuts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Keyboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No shortcuts found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
