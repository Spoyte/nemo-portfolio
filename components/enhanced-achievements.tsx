"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Flame,
  Star,
  Crown,
  Medal,
  Gem,
  Rocket,
  Brain,
  Code2,
  Terminal,
  Gamepad2,
  Music,
  Palette,
  BookOpen,
  Coffee,
  Moon,
  Sun,
  Eye,
  MousePointer,
  Keyboard,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "explorer" | "mastery" | "social" | "special" | "hidden";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

const achievements: Achievement[] = [
  // Explorer Achievements
  {
    id: "first_visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: <Footprints className="h-5 w-5" />,
    category: "explorer",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2025-02-20",
  },
  {
    id: "explorer",
    title: "Curious Explorer",
    description: "Visit 5 different pages",
    icon: <Eye className="h-5 w-5" />,
    category: "explorer",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2025-02-21",
    progress: 5,
    maxProgress: 5,
  },
  {
    id: "page_master",
    title: "Page Master",
    description: "Visit 15 different pages",
    icon: <Target className="h-5 w-5" />,
    category: "explorer",
    rarity: "rare",
    unlocked: false,
    progress: 8,
    maxProgress: 15,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit the site between 12 AM and 5 AM",
    icon: <Moon className="h-5 w-5" />,
    category: "explorer",
    rarity: "rare",
    unlocked: false,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Visit the site between 5 AM and 8 AM",
    icon: <Sun className="h-5 w-5" />,
    category: "explorer",
    rarity: "rare",
    unlocked: false,
  },
  // Mastery Achievements
  {
    id: "terminal_wizard",
    title: "Terminal Wizard",
    description: "Use the terminal for 10 commands",
    icon: <Terminal className="h-5 w-5" />,
    category: "mastery",
    rarity: "rare",
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Type 80+ WPM in the speed typing game",
    icon: <Zap className="h-5 w-5" />,
    category: "mastery",
    rarity: "epic",
    unlocked: false,
  },
  {
    id: "code_poet",
    title: "Code Poet",
    description: "Generate 5 code poems",
    icon: <Palette className="h-5 w-5" />,
    category: "mastery",
    rarity: "rare",
    unlocked: false,
    progress: 1,
    maxProgress: 5,
  },
  {
    id: "game_master",
    title: "Game Master",
    description: "Score 1000+ points in any game",
    icon: <Gamepad2 className="h-5 w-5" />,
    category: "mastery",
    rarity: "epic",
    unlocked: false,
  },
  // Social Achievements
  {
    id: "konami_code",
    title: "Konami Code",
    description: "Enter the legendary Konami code",
    icon: <Keyboard className="h-5 w-5" />,
    category: "social",
    rarity: "legendary",
    unlocked: false,
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    description: "Click on all social media links",
    icon: <Rocket className="h-5 w-5" />,
    category: "social",
    rarity: "rare",
    unlocked: false,
  },
  // Special Achievements
  {
    id: "music_lover",
    title: "Music Lover",
    description: "Play music in the music player",
    icon: <Music className="h-5 w-5" />,
    category: "special",
    rarity: "common",
    unlocked: false,
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Read 3 blog posts",
    icon: <BookOpen className="h-5 w-5" />,
    category: "special",
    rarity: "common",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "coffee_break",
    title: "Coffee Break",
    description: "Spend 10 minutes on the site",
    icon: <Coffee className="h-5 w-5" />,
    category: "special",
    rarity: "common",
    unlocked: false,
  },
  // Hidden Achievements
  {
    id: "secret_found",
    title: "Secret Finder",
    description: "Discover a hidden page",
    icon: <Gem className="h-5 w-5" />,
    category: "hidden",
    rarity: "legendary",
    unlocked: false,
  },
  {
    id: "easter_egg_hunter",
    title: "Easter Egg Hunter",
    description: "Find all easter eggs",
    icon: <Crown className="h-5 w-5" />,
    category: "hidden",
    rarity: "legendary",
    unlocked: false,
  },
];

// Helper component for footprints icon
function Footprints({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.5 2-1 3" />
      <path d="M8 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C2.63 2 1 3.8 1 8c0 1.25.5 2 1 3" />
      <path d="M20 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 2 13 3.8 13 8c0 1.25.5 2 1 3" />
      <path d="M16 16v-2.38C16 11.5 17.97 10.5 18 8c.03-2.72-1.49-6-4.5-6C11.63 2 10 3.8 10 8c0 1.25.5 2 1 3" />
    </svg>
  );
}

const rarityColors = {
  common: "bg-slate-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

const rarityBorders = {
  common: "border-slate-500/30",
  rare: "border-blue-500/30",
  epic: "border-purple-500/30",
  legendary: "border-amber-500/30",
};

const categoryIcons = {
  explorer: <Eye className="h-4 w-4" />,
  mastery: <Trophy className="h-4 w-4" />,
  social: <Rocket className="h-4 w-4" />,
  special: <Star className="h-4 w-4" />,
  hidden: <Gem className="h-4 w-4" />,
};

export function EnhancedAchievements() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    const count = achievements.filter((a) => a.unlocked).length;
    setUnlockedCount(count);
  }, []);

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === "all" || a.category === selectedCategory
  );

  const totalPoints = achievements.reduce((acc, a) => {
    if (!a.unlocked) return acc;
    const points = { common: 10, rare: 25, epic: 50, legendary: 100 };
    return acc + points[a.rarity];
  }, 0);

  const maxPoints = achievements.reduce((acc, a) => {
    const points = { common: 10, rare: 25, epic: 50, legendary: 100 };
    return acc + points[a.rarity];
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">
                  {unlockedCount} / {achievements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">
                  {totalPoints} / {maxPoints}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">
                  {Math.round((unlockedCount / achievements.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        {["explorer", "mastery", "social", "special", "hidden"].map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="capitalize"
          >
            {categoryIcons[cat as keyof typeof categoryIcons]}
            <span className="ml-2">{cat}</span>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  achievement.unlocked
                    ? "border-primary/50"
                    : "opacity-60 grayscale"
                )}
              >
                {/* Rarity Border Effect */}
                <div
                  className={cn(
                    "absolute inset-0 border-2 rounded-lg pointer-events-none",
                    rarityBorders[achievement.rarity]
                  )}
                />

                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-xl",
                        achievement.unlocked
                          ? "bg-primary/10"
                          : "bg-muted"
                      )}
                    >
                      {achievement.unlocked ? (
                        achievement.icon
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {achievement.unlocked
                            ? achievement.title
                            : "???"}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs capitalize",
                            rarityColors[achievement.rarity]
                          )}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.unlocked
                          ? achievement.description
                          : "Locked achievement"}
                      </p>

                      {achievement.progress !== undefined &&
                        achievement.maxProgress !== undefined && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                            </div>
                            <Progress
                              value={
                                (achievement.progress / achievement.maxProgress) *
                                100
                              }
                              className="h-1.5"
                            />
                          </div>
                        )}

                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Unlock Animation Overlay */}
      <AnimatePresence>
        {showUnlockAnimation && lastUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUnlockAnimation(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-card p-8 rounded-2xl text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-flex p-4 rounded-full bg-primary/10 mb-4"
              >
                <Trophy className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
              <p className="text-muted-foreground mb-4">{lastUnlocked.title}</p>
              <Button onClick={() => setShowUnlockAnimation(false)}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
