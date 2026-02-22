"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gamepad2, Terminal, Eye, MousePointer, Keyboard, Zap, Heart, Star } from "lucide-react";

interface EasterEggTrigger {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const EASTER_EGGS: Omit<EasterEggTrigger, "unlocked">[] = [
  {
    id: "konami",
    name: "Code Breaker",
    description: "Entered the Konami code",
    icon: <Gamepad2 className="h-5 w-5" />,
  },
  {
    id: "explorer",
    name: "Curious Explorer",
    description: "Found the secret page",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: "clicker",
    name: "Click Master",
    description: "Clicked 100 times on the page",
    icon: <MousePointer className="h-5 w-5" />,
  },
  {
    id: "typist",
    name: "Speed Typist",
    description: "Typed 50 characters in 10 seconds",
    icon: <Keyboard className="h-5 w-5" />,
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Visited at midnight",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "returner",
    name: "Welcome Back",
    description: "Returned for a 5th visit",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    id: "terminal-master",
    name: "Terminal Master",
    description: "Used the terminal widget",
    icon: <Terminal className="h-5 w-5" />,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Unlocked all easter eggs",
    icon: <Star className="h-5 w-5" />,
  },
];

export function EasterEggTracker() {
  const [eggs, setEggs] = useState<EasterEggTrigger[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  // Load unlocked eggs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("easter-eggs");
    const unlockedIds: string[] = saved ? JSON.parse(saved) : [];
    
    setEggs(EASTER_EGGS.map(egg => ({
      ...egg,
      unlocked: unlockedIds.includes(egg.id),
    })));

    // Check for night owl
    const hour = new Date().getHours();
    if (hour === 0) {
      unlockEgg("night-owl");
    }

    // Check for returner
    const visits = parseInt(localStorage.getItem("visit-count") || "0");
    localStorage.setItem("visit-count", (visits + 1).toString());
    if (visits >= 4) {
      unlockEgg("returner");
    }
  }, []);

  const unlockEgg = useCallback((id: string) => {
    setEggs(prev => {
      const egg = prev.find(e => e.id === id);
      if (egg?.unlocked) return prev;

      const updated = prev.map(e => 
        e.id === id ? { ...e, unlocked: true } : e
      );

      // Save to localStorage
      const unlockedIds = updated.filter(e => e.unlocked).map(e => e.id);
      localStorage.setItem("easter-eggs", JSON.stringify(unlockedIds));

      // Check for completionist
      if (unlockedIds.length === EASTER_EGGS.length - 1 && id !== "completionist") {
        setTimeout(() => unlockEgg("completionist"), 500);
      }

      return updated;
    });
  }, []);

  // Track clicks for click master
  useEffect(() => {
    const handleClick = () => {
      setClickCount(prev => {
        const next = prev + 1;
        if (next === 100) {
          unlockEgg("clicker");
        }
        return next;
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [unlockEgg]);

  // Track typing for speed typist
  useEffect(() => {
    const handleKeyDown = () => {
      const now = Date.now();
      
      if (now - lastKeyTime > 10000) {
        setKeyCount(1);
      } else {
        setKeyCount(prev => {
          const next = prev + 1;
          if (next >= 50) {
            unlockEgg("typist");
          }
          return next;
        });
      }
      
      setLastKeyTime(now);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastKeyTime, unlockEgg]);

  // Listen for terminal usage
  useEffect(() => {
    const handleTerminalOpen = () => unlockEgg("terminal-master");
    window.addEventListener("terminal-opened", handleTerminalOpen);
    return () => window.removeEventListener("terminal-opened", handleTerminalOpen);
  }, [unlockEgg]);

  const unlockedCount = eggs.filter(e => e.unlocked).length;
  const totalCount = eggs.length;

  return (
    <>
      {/* Floating Trophy Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPanel(true)}
        className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="relative">
          <Trophy className="h-6 w-6" />
          {unlockedCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold"
            >
              {unlockedCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Achievement Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-orange-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Easter Eggs</h2>
                        <p className="text-sm text-muted-foreground">
                          {unlockedCount} of {totalCount} unlocked
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPanel(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Eggs Grid */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-3">
                    {eggs.map((egg, index) => (
                      <motion.div
                        key={egg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          egg.unlocked
                            ? "bg-card border-border"
                            : "bg-muted/50 border-transparent opacity-60"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl ${
                            egg.unlocked
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {egg.unlocked ? egg.icon : <span>?️</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!egg.unlocked && "blur-sm"}`}>
                            {egg.unlocked ? egg.name : "Hidden Achievement"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {egg.unlocked ? egg.description : "Keep exploring to unlock!"}
                          </p>
                        </div>                        {egg.unlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-primary"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer Hint */}
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                  <p className="text-xs text-center text-muted-foreground">
                    💡 Hint: Try the Konami code (↑↑↓↓←→←→BA) or explore the terminal!
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
