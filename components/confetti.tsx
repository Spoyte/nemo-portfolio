"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
}

const COLORS = [
  "#dc2626", // red
  "#ea580c", // orange
  "#d97706", // amber
  "#65a30d", // lime
  "#0891b2", // cyan
  "#2563eb", // blue
  "#7c3aed", // violet
  "#db2777", // pink
];

export function Confetti({ 
  trigger, 
  origin = { x: 0.5, y: 0.5 },
  count = 50 
}: { 
  trigger: boolean;
  origin?: { x: number; y: number };
  count?: number;
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: origin.x + (Math.random() - 0.5) * 0.2,
        y: origin.y + (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.5 + Math.random() * 0.5,
      }));
      setPieces(newPieces);

      // Clear pieces after animation
      setTimeout(() => setPieces([]), 3000);
    }
  }, [trigger, origin, count]);

  return (
    <AnimatePresence>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x * 100}vw`,
            y: `${piece.y * 100}vh`,
            scale: 0,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: `${piece.x * 100 + (Math.random() - 0.5) * 50}vw`,
            y: `${piece.y * 100 + 50 + Math.random() * 30}vh`,
            scale: piece.scale,
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2 + Math.random(),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="fixed pointer-events-none z-[9999]"
          style={{
            width: 10,
            height: 10,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

// Achievement notification
export function AchievementNotification({ 
  show, 
  title, 
  description, 
  icon,
  onComplete 
}: { 
  show: boolean;
  title: string;
  description: string;
  icon: React.ReactNode;
  onComplete?: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-24 right-4 z-50"
        >
          <div className="glass-strong rounded-2xl p-4 shadow-2xl border border-primary/20 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                {icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                  Achievement Unlocked
                </p>
                <h4 className="font-semibold text-lg">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-0.5 bg-primary mt-3 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Achievement manager hook
export function useAchievements() {
  const [achievements, setAchievements] = useState<Set<string>>(new Set());
  const [currentAchievement, setCurrentAchievement] = useState<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const unlockAchievement = useCallback((id: string, title: string, description: string, icon: React.ReactNode) => {
    if (achievements.has(id)) return;

    setAchievements(prev => new Set([...prev, id]));
    setCurrentAchievement({ id, title, description, icon });
    setShowConfetti(true);
    
    // Save to localStorage
    const saved = localStorage.getItem("unlocked-achievements");
    const unlocked = saved ? JSON.parse(saved) : [];
    localStorage.setItem("unlocked-achievements", JSON.stringify([...unlocked, id]));

    setTimeout(() => setShowConfetti(false), 100);
  }, [achievements]);

  const clearAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  // Load saved achievements on mount
  useEffect(() => {
    const saved = localStorage.getItem("unlocked-achievements");
    if (saved) {
      setAchievements(new Set(JSON.parse(saved)));
    }
  }, []);

  return {
    achievements,
    currentAchievement,
    showConfetti,
    unlockAchievement,
    clearAchievement,
    hasAchievement: (id: string) => achievements.has(id),
  };
}
