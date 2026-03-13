"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Lock,
  Unlock,
  Sparkles,
  Gamepad2,
  Code2,
  Palette,
  Terminal,
  MousePointer,
  Keyboard,
  Eye,
  EyeOff,
  Crown,
  Medal,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  secret?: boolean;
}

const initialAchievements: Achievement[] = [
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit 5 different pages on the site",
    icon: Target,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: "common",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Toggle dark mode",
    icon: Eye,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "common",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete the typing game with 80+ WPM",
    icon: Zap,
    unlocked: false,
    progress: 0,
    maxProgress: 80,
    rarity: "rare",
  },
  {
    id: "code-master",
    title: "Code Master",
    description: "Copy code from the live demo 3 times",
    icon: Code2,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    rarity: "rare",
  },
  {
    id: "artist",
    title: "Digital Artist",
    description: "Generate 5 art pieces in the Art Studio",
    icon: Palette,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: "rare",
  },
  {
    id: "konami",
    title: "Konami Code",
    description: "Enter the secret Konami code",
    icon: Gamepad2,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
    secret: true,
  },
  {
    id: "terminal",
    title: "Hacker",
    description: "Access the secret terminal",
    icon: Terminal,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
    secret: true,
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlock all other achievements",
    icon: Crown,
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    rarity: "legendary",
  },
];

const rarityColors = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-pink-500",
  legendary: "from-yellow-400 via-orange-400 to-red-500",
};

const rarityBadges = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-gradient-to-r from-yellow-500 to-orange-500",
};

export function AchievementShowcase() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [showSecret, setShowSecret] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null);

  // Simulate progress updates (in real app, this would come from actual user actions)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(prev => prev.map(a => {
        if (a.id === "explorer" && a.progress < a.maxProgress) {
          return { ...a, progress: Math.min(a.progress + 1, a.maxProgress) };
        }
        return a;
      }));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check for unlocks
  useEffect(() => {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.progress >= achievement.maxProgress) {
        setAchievements(prev => prev.map(a => 
          a.id === achievement.id ? { ...a, unlocked: true } : a
        ));
        setRecentlyUnlocked(achievement.id);
        setTimeout(() => setRecentlyUnlocked(null), 3000);
      }
    });
  }, [achievements]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.reduce((sum, a) => {
    if (!a.unlocked) return sum;
    const points = { common: 10, rare: 25, epic: 50, legendary: 100 };
    return sum + points[a.rarity];
  }, 0);

  const filteredAchievements = showSecret 
    ? achievements 
    : achievements.filter(a => !a.secret);

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Gamification</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Achievement{" "}
            <span className="text-gradient-animated">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore the site to unlock hidden achievements. Some are secret and require special actions to discover!
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{unlockedCount}/{achievements.length}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="max-w-md mx-auto mb-8">
            <Progress value={(unlockedCount / achievements.length) * 100} className="h-3" />
          </div>

          {/* Toggle Secret */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSecret ? "Hide Secret" : "Show Secret"} Achievements
          </Button>
        </motion.div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const isRecentlyUnlocked = recentlyUnlocked === achievement.id;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`relative group ${achievement.secret && !achievement.unlocked ? "opacity-60" : ""}`}
              >
                <motion.div
                  animate={isRecentlyUnlocked ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 rgba(220, 38, 38, 0)",
                      "0 0 30px rgba(220, 38, 38, 0.5)",
                      "0 0 0 rgba(220, 38, 38, 0)",
                    ],
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    achievement.unlocked
                      ? "bg-card border-primary/50"
                      : "bg-muted/50 border-border"
                  }`}
                >
                  {/* Rarity Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      className={`text-xs ${rarityBadges[achievement.rarity]} text-white border-0`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}`
                      : "bg-muted"
                  }`}>
                    {achievement.secret && !achievement.unlocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Icon className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold mb-1">
                    {achievement.secret && !achievement.unlocked ? "???" : achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.secret && !achievement.unlocked ? "Secret achievement" : achievement.description}
                  </p>

                  {/* Progress */}
                  {!achievement.unlocked && !(achievement.secret && !achievement.unlocked) && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  )}

                  {achievement.unlocked && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <Unlock className="w-4 h-4" />
                      <span>Unlocked!</span>
                    </div>
                  )}
                </motion.div>

                {/* Shine Effect for Unlocked */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">Common (10 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Rare (25 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Epic (50 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" />
            <span className="text-muted-foreground">Legendary (100 pts)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
