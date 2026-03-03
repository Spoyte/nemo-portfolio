"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Trophy, 
  Zap, 
  Star,
  Heart,
  Rocket,
  Ghost,
  Gamepad2,
  Music,
  Palette,
  Code2,
  Terminal,
  Keyboard,
  MousePointer,
  Eye,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface EasterEgg {
  id: string;
  name: string;
  icon: React.ElementType;
  discovered: boolean;
  description: string;
  hint: string;
}

const initialEasterEggs: EasterEgg[] = [
  { id: "konami", name: "Konami Code", icon: Gamepad2, discovered: false, description: "Enter the legendary Konami code", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
  { id: "night", name: "Night Owl", icon: Eye, discovered: false, description: "Visit between midnight and 6 AM", hint: "Late night browsing..." },
  { id: "rapid", name: "Speed Clicker", icon: MousePointer, discovered: false, description: "Click 10 times in 2 seconds", hint: "Fast fingers required" },
  { id: "explorer", name: "Deep Explorer", icon: Rocket, discovered: false, description: "Visit 10 different pages", hint: "Explore everywhere" },
  { id: "themer", name: "Theme Master", icon: Palette, discovered: false, description: "Switch themes 5 times", hint: "Try all the colors" },
  { id: "typist", name: "Secret Typist", icon: Keyboard, discovered: false, description: "Type 'hello' anywhere", hint: "Just say hello" },
  { id: "listener", name: "Music Lover", icon: Music, discovered: false, description: "Play a song in the music player", hint: "Enjoy the tunes" },
  { id: "developer", name: "Developer Mode", icon: Terminal, discovered: false, description: "Open the console", hint: "F12 or Ctrl+Shift+J" },
  { id: "heart", name: "Heart Giver", icon: Heart, discovered: false, description: "Like 3 testimonials", hint: "Show some love" },
  { id: "star", name: "Star Collector", icon: Star, discovered: false, description: "Find 5 hidden stars", hint: "Look for sparkles" },
];

export function EasterEggHunt() {
  const [isOpen, setIsOpen] = useState(false);
  const [eggs, setEggs] = useState<EasterEgg[]>(initialEasterEggs);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [typedKeys, setTypedKeys] = useState("");

  const discoveredCount = eggs.filter(e => e.discovered).length;
  const progress = (discoveredCount / eggs.length) * 100;

  // Check for easter eggs
  useEffect(() => {
    const checkKonami = (e: KeyboardEvent) => {
      const konami = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";
      setTypedKeys(prev => {
        const newKeys = (prev + e.key).slice(-konami.length);
        if (newKeys === konami) {
          discoverEgg("konami");
        }
        return newKeys;
      });

      // Check for "hello" typing
      setTypedKeys(prev => {
        const newKeys = (prev + e.key.toLowerCase()).slice(-5);
        if (newKeys === "hello") {
          discoverEgg("typist");
        }
        return newKeys;
      });
    };

    window.addEventListener("keydown", checkKonami);
    return () => window.removeEventListener("keydown", checkKonami);
  }, []);

  // Check for rapid clicking
  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 10) {
        discoverEgg("rapid");
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  }, [clickCount, lastClickTime]);

  // Check for night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      discoverEgg("night");
    }
  }, []);

  const discoverEgg = useCallback((id: string) => {
    setEggs(prev => {
      const egg = prev.find(e => e.id === id);
      if (egg && !egg.discovered) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#fbbf24", "#f59e0b", "#d97706"],
        });
        return prev.map(e => e.id === id ? { ...e, discovered: true } : e);
      }
      return prev;
    });
  }, []);

  // Listen for page visits
  useEffect(() => {
    const visitedPages = new Set<string>();
    const originalPushState = history.pushState;
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      visitedPages.add(window.location.pathname);
      if (visitedPages.size >= 10) {
        discoverEgg("explorer");
      }
    };

    return () => {
      history.pushState = originalPushState;
    };
  }, [discoverEgg]);

  // Listen for console open
  useEffect(() => {
    const checkConsole = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        discoverEgg("developer");
      }
    };

    window.addEventListener("resize", checkConsole);
    return () => window.removeEventListener("resize", checkConsole);
  }, [discoverEgg]);

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 z-40 p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        style={{ display: isOpen ? "none" : "block" }}
      >
        <div className="relative">
          <Ghost className="h-6 w-6" />
          {discoveredCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {discoveredCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50 bg-card rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                      <Ghost className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Easter Egg Hunt</h2>
                      <p className="text-sm text-muted-foreground">
                        {discoveredCount} of {eggs.length} discovered
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Egg Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {eggs.map((egg) => (
                    <motion.div
                      key={egg.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        egg.discovered
                          ? "bg-card border-amber-500/30"
                          : "bg-muted/50 border-muted opacity-75"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-3 rounded-xl mb-3 ${
                          egg.discovered
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-muted"
                        }`}>
                          <egg.icon className={`h-6 w-6 ${egg.discovered ? "text-white" : "text-muted-foreground"}`} />
                        </div>

                        <h3 className={`font-semibold mb-1 ${!egg.discovered && "blur-sm"}`}>
                          {egg.discovered ? egg.name : "???"}
                        </h3>

                        <p className="text-xs text-muted-foreground mb-2">
                          {egg.discovered ? egg.description : egg.hint}
                        </p>

                        {egg.discovered ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                            <Trophy className="h-3 w-3 mr-1" />
                            Found!
                          </span>
                        ) : (
                          <Badge variant="secondary">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {discoveredCount === eggs.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center"
                  >
                    <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Congratulations! 🎉</h3>
                    <p className="text-muted-foreground">
                      You&apos;ve discovered all the easter eggs! You&apos;re a true explorer.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/50">
                <p className="text-xs text-center text-muted-foreground">
                  Tip: Explore the site, try different interactions, and see what you can find!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Badge component for the easter egg UI
function Badge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary";
}) {
  const classes = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${classes[variant]}`}>
      {children}
    </span>
  );
}
