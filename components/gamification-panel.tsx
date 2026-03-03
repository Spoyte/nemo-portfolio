"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Target, Flame, Award, Crown, Gem } from "lucide-react";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-visit",
    title: "Welcome Explorer",
    description: "Visit the portfolio for the first time",
    icon: <Star className="w-6 h-6" />,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
  },
  {
    id: "page-explorer",
    title: "Page Explorer",
    description: "Visit 5 different pages",
    icon: <Target className="w-6 h-6" />,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: "common",
  },
  {
    id: "dark-mode",
    title: "Night Owl",
    description: "Switch to dark mode",
    icon: <Zap className="w-6 h-6" />,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "common",
  },
  {
    id: "konami",
    title: "Code Breaker",
    description: "Discover the Konami code easter egg",
    icon: <Trophy className="w-6 h-6" />,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "rare",
  },
  {
    id: "time-spent",
    title: "Time Keeper",
    description: "Spend 5 minutes on the site",
    icon: <Flame className="w-6 h-6" />,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: "rare",
  },
  {
    id: "collector",
    title: "Achievement Hunter",
    description: "Unlock 5 achievements",
    icon: <Award className="w-6 h-6" />,
    unlocked: false,
    progress: 1,
    maxProgress: 5,
    rarity: "epic",
  },
  {
    id: "master",
    title: "Portfolio Master",
    description: "Unlock all achievements",
    icon: <Crown className="w-6 h-6" />,
    unlocked: false,
    progress: 1,
    maxProgress: 7,
    rarity: "legendary",
  },
  {
    id: "secret",
    title: "Secret Finder",
    description: "Find a hidden easter egg",
    icon: <Gem className="w-6 h-6" />,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
  },
];

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-pink-600",
  legendary: "from-yellow-400 via-orange-500 to-red-500",
};

export function GamificationPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);
  const [pagesVisited, setPagesVisited] = useState<Set<string>>(new Set());
  const [timeSpent, setTimeSpent] = useState(0);

  // Track page visits
  useEffect(() => {
    const currentPath = window.location.pathname;
    setPagesVisited((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentPath);
      return newSet;
    });
  }, []);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Update achievements based on progress
  useEffect(() => {
    setAchievements((prev) => {
      const updated = [...prev];

      // Page explorer
      const pageExplorer = updated.find((a) => a.id === "page-explorer");
      if (pageExplorer) {
        pageExplorer.progress = Math.min(pagesVisited.size, pageExplorer.maxProgress);
        if (pageExplorer.progress >= pageExplorer.maxProgress && !pageExplorer.unlocked) {
          pageExplorer.unlocked = true;
          triggerNotification(pageExplorer);
        }
      }

      // Time keeper
      const timeKeeper = updated.find((a) => a.id === "time-spent");
      if (timeKeeper) {
        timeKeeper.progress = Math.min(timeSpent, timeKeeper.maxProgress);
        if (timeKeeper.progress >= timeKeeper.maxProgress && !timeKeeper.unlocked) {
          timeKeeper.unlocked = true;
          triggerNotification(timeKeeper);
        }
      }

      // Achievement hunter
      const unlockedCount = updated.filter((a) => a.unlocked).length;
      const collector = updated.find((a) => a.id === "collector");
      if (collector) {
        collector.progress = unlockedCount;
        if (collector.progress >= collector.maxProgress && !collector.unlocked) {
          collector.unlocked = true;
          triggerNotification(collector);
        }
      }

      // Portfolio master
      const master = updated.find((a) => a.id === "master");
      if (master) {
        master.progress = unlockedCount;
        if (master.progress >= master.maxProgress && !master.unlocked) {
          master.unlocked = true;
          triggerNotification(master);
        }
      }

      return updated;
    });
  }, [pagesVisited, timeSpent]);

  const triggerNotification = (achievement: Achievement) => {
    setShowNotification(achievement);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#fbbf24"],
    });
    setTimeout(() => setShowNotification(null), 5000);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Achievement Progress</h3>
            <p className="text-muted-foreground">
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
          <div className="text-4xl font-bold text-gradient">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 rounded-xl border transition-all ${
              achievement.unlocked
                ? "bg-card border-primary/50"
                : "bg-muted/50 border-border opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${
                  achievement.unlocked
                    ? RARITY_COLORS[achievement.rarity]
                    : "from-gray-400 to-gray-600"
                }`}
              >
                {achievement.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate">{achievement.title}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      achievement.unlocked
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {achievement.rarity}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.description}
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span>
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-primary to-orange-500"
                          : "bg-muted-foreground/30"
                      }`}
                      style={{
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 p-6 rounded-2xl bg-card border border-primary/50 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${
                  RARITY_COLORS[showNotification.rarity]
                }`}
              >
                {showNotification.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievement Unlocked!</p>
                <h4 className="text-lg font-bold">{showNotification.title}</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
