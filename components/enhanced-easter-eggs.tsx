"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const EASTER_EGGS: EasterEgg[] = [
  { id: "konami", name: "Konami Master", description: "Entered the Konami code", unlocked: false, icon: "🎮" },
  { id: "triple-click", name: "Speed Clicker", description: "Clicked 3 times in 1 second", unlocked: false, icon: "⚡" },
  { id: "secret-terminal", name: "Hacker", description: "Found the secret terminal", unlocked: false, icon: "💻" },
  { id: "night-owl", name: "Night Owl", description: "Visited at 2 AM", unlocked: false, icon: "🦉" },
  { id: "explorer", name: "Explorer", description: "Visited 10 different pages", unlocked: false, icon: "🗺️" },
  { id: "speed-reader", name: "Speed Reader", description: "Scrolled through a page in 5 seconds", unlocked: false, icon: "📖" },
];

export function EnhancedEasterEggs() {
  const [eggs, setEggs] = useState<EasterEgg[]>(EASTER_EGGS);
  const [showNotification, setShowNotification] = useState<EasterEgg | null>(null);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [pagesVisited, setPagesVisited] = useState<Set<string>>(new Set());

  // Unlock an easter egg
  const unlockEgg = useCallback((id: string) => {
    setEggs((prev) => {
      const egg = prev.find((e) => e.id === id);
      if (egg && !egg.unlocked) {
        setShowNotification(egg);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#dc2626", "#ea580c", "#f59e0b"],
        });
        setTimeout(() => setShowNotification(null), 3000);
        return prev.map((e) => (e.id === id ? { ...e, unlocked: true } : e));
      }
      return prev;
    });
  }, []);

  // Track clicks for speed clicker
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      const recentClicks = [...clickTimes, now].filter((t) => now - t < 1000);
      setClickTimes(recentClicks);
      if (recentClicks.length >= 3) {
        unlockEgg("triple-click");
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickTimes, unlockEgg]);

  // Check for night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour === 2) {
      unlockEgg("night-owl");
    }
  }, [unlockEgg]);

  // Track page visits
  useEffect(() => {
    const currentPath = window.location.pathname;
    setPagesVisited((prev) => {
      const newSet = new Set(prev).add(currentPath);
      if (newSet.size >= 10) {
        unlockEgg("explorer");
      }
      return newSet;
    });
  }, [unlockEgg]);

  // Listen for konami code completion
  useEffect(() => {
    const handleKonami = () => unlockEgg("konami");
    window.addEventListener("konami-code", handleKonami);
    return () => window.removeEventListener("konami-code", handleKonami);
  }, [unlockEgg]);

  // Listen for secret terminal
  useEffect(() => {
    const handleTerminal = () => unlockEgg("secret-terminal");
    window.addEventListener("secret-terminal-opened", handleTerminal);
    return () => window.removeEventListener("secret-terminal-opened", handleTerminal);
  }, [unlockEgg]);

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 glass-strong px-6 py-4 rounded-2xl border border-primary/20 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl"
              >
                {showNotification.icon}
              </motion.span>
              <div>
                <p className="font-semibold text-primary">Achievement Unlocked!</p>
                <p className="text-sm text-muted-foreground">{showNotification.name}</p>
                <p className="text-xs text-muted-foreground/70">{showNotification.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden stats (for debugging/fun) */}
      <div className="hidden">
        Unlocked: {eggs.filter((e) => e.unlocked).length}/{eggs.length}
      </div>
    </>
  );
}
