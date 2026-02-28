"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Flame, 
  Crown,
  Medal,
  Award,
  Gift,
  Lock,
  Unlock,
  Sparkles,
  Gamepad2,
  Code2,
  Eye,
  MousePointer,
  Clock,
  Heart,
  Share2,
  MessageSquare,
  Terminal,
  Rocket,
  Compass,
  Bookmark,
  ThumbsUp,
  Lightbulb,
  Palette,
  Music,
  Coffee
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
}

const achievements: Achievement[] = [
  {
    id: "first_visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: Footprints,
    color: "#22c55e",
    condition: "Visit any page",
    unlocked: true,
    unlockedAt: new Date(),
    rarity: "common",
    points: 10,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit the site between midnight and 5 AM",
    icon: Moon,
    color: "#8b5cf6",
    condition: "Visit during night hours",
    unlocked: false,
    rarity: "rare",
    points: 25,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit 5 different pages",
    icon: Compass,
    color: "#3b82f6",
    condition: "Visit 5 pages",
    unlocked: false,
    rarity: "common",
    points: 15,
  },
  {
    id: "deep_diver",
    title: "Deep Diver",
    description: "Spend 5 minutes on a single page",
    icon: Clock,
    color: "#06b6d4",
    condition: "Stay 5 minutes on one page",
    unlocked: false,
    rarity: "common",
    points: 20,
  },
  {
    id: "konami_master",
    title: "Konami Master",
    description: "Unlock the Konami code easter egg",
    icon: Gamepad2,
    color: "#dc2626",
    condition: "Enter the Konami code",
    unlocked: false,
    rarity: "legendary",
    points: 100,
  },
  {
    id: "theme_switcher",
    title: "Chameleon",
    description: "Switch between light and dark themes",
    icon: Palette,
    color: "#f59e0b",
    condition: "Toggle theme 3 times",
    unlocked: false,
    rarity: "common",
    points: 15,
  },
  {
    id: "social_butterfly",
    title: "Social Butterfly",
    description: "Click on any social media link",
    icon: Share2,
    color: "#ec4899",
    condition: "Click a social link",
    unlocked: false,
    rarity: "common",
    points: 10,
  },
  {
    id: "commander",
    title: "Commander",
    description: "Use the command palette (Cmd/Ctrl + K)",
    icon: Terminal,
    color: "#6366f1",
    condition: "Open command palette",
    unlocked: false,
    rarity: "rare",
    points: 30,
  },
  {
    id: "speed_reader",
    title: "Speed Reader",
    description: "Read a blog post in under 30 seconds",
    icon: Zap,
    color: "#eab308",
    condition: "Quick blog visit",
    unlocked: false,
    rarity: "epic",
    points: 50,
  },
  {
    id: "curious_mind",
    title: "Curious Mind",
    description: "Visit the secret lab",
    icon: Lightbulb,
    color: "#f97316",
    condition: "Find /secret",
    unlocked: false,
    rarity: "epic",
    points: 75,
  },
  {
    id: "coffee_lover",
    title: "Coffee Lover",
    description: "Visit the Now page and see coffee activity",
    icon: Coffee,
    color: "#78350f",
    condition: "Check Now page",
    unlocked: false,
    rarity: "common",
    points: 15,
  },
  {
    id: "music_enthusiast",
    title: "Music Enthusiast",
    description: "See the music player on the Now page",
    icon: Music,
    color: "#a855f7",
    condition: "Check Now page music",
    unlocked: false,
    rarity: "common",
    points: 15,
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlock all achievements",
    icon: Crown,
    color: "#ffd700",
    condition: "Unlock everything",
    unlocked: false,
    rarity: "legendary",
    points: 500,
  },
];

// Helper component for footprints
function Footprints({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.97 3.52-1 5-.03 2 1 3 1 3" />
      <path d="M4 22v-2.38C4 17.5 2.97 16.5 3 14c.03-2.72 1.49-6 4.5-6C9.37 8 11 9.8 11 14c0 1.25-.97 3.52-1 5-.03 2 1 3 1 3" />
      <path d="M13 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C6.63 2 5 3.8 5 8c0 1.25.97 3.52 1 5 .03 2-1 3-1 3" />
      <path d="M13 22v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C6.63 8 5 9.8 5 14c0 1.25.97 3.52 1 5 .03 2-1 3-1 3" />
    </svg>
  );
}

// Helper component for moon
function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

const rarityConfig = {
  common: { color: "#9ca3af", bg: "bg-gray-500/10", label: "Common" },
  rare: { color: "#3b82f6", bg: "bg-blue-500/10", label: "Rare" },
  epic: { color: "#a855f7", bg: "bg-purple-500/10", label: "Epic" },
  legendary: { color: "#eab308", bg: "bg-yellow-500/10", label: "Legendary" },
};

export function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved achievements
    const saved = localStorage.getItem("portfolio-achievements");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserAchievements((prev) =>
        prev.map((a) => ({
          ...a,
          unlocked: parsed[a.id]?.unlocked || false,
          unlockedAt: parsed[a.id]?.unlockedAt ? new Date(parsed[a.id].unlockedAt) : undefined,
        }))
      );
    }

    // Check for night owl
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      unlockAchievement("night_owl");
    }

    // Mark first visit
    unlockAchievement("first_visit");

    // Listen for achievements
    const handleAchievement = (e: CustomEvent) => {
      unlockAchievement(e.detail);
    };

    window.addEventListener("unlock-achievement" as never, handleAchievement);
    return () => window.removeEventListener("unlock-achievement" as never, handleAchievement);
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setUserAchievements((prev) => {
      const achievement = prev.find((a) => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const updated = prev.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
      );

      // Save to localStorage
      const saveData = updated.reduce((acc, a) => {
        acc[a.id] = { unlocked: a.unlocked, unlockedAt: a.unlockedAt };
        return acc;
      }, {} as Record<string, { unlocked: boolean; unlockedAt?: Date }>);
      localStorage.setItem("portfolio-achievements", JSON.stringify(saveData));

      // Show notification
      setRecentUnlock(achievement);
      
      // Confetti for rare+ achievements
      if (["rare", "epic", "legendary"].includes(achievement.rarity)) {
        confetti({
          particleCount: achievement.rarity === "legendary" ? 100 : 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: [achievement.color, "#ffffff"],
        });
      }

      // Hide notification after 5 seconds
      setTimeout(() => setRecentUnlock(null), 5000);

      return updated;
    });
  }, []);

  const filteredAchievements = userAchievements.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });

  const unlockedCount = userAchievements.filter((a) => a.unlocked).length;
  const totalPoints = userAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  const maxPoints = userAchievements.reduce((sum, a) => sum + a.points, 0);
  const progress = (unlockedCount / userAchievements.length) * 100;

  if (!mounted) return null;

  return (
    <>
      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {recentUnlock && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed top-24 right-4 z-50 glass-strong px-6 py-4 rounded-2xl shadow-2xl border-2 max-w-sm"
            style={{ borderColor: recentUnlock.color }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-3 rounded-xl"
                style={{ backgroundColor: recentUnlock.color }}
              >
                <recentUnlock.icon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Achievement Unlocked
                </p>
                <h4 className="font-bold text-lg">{recentUnlock.title}</h4>
                <p className="text-sm text-muted-foreground">{recentUnlock.description}</p>
                <Badge 
                  variant="secondary" 
                  className="mt-2"
                  style={{ 
                    backgroundColor: `${recentUnlock.color}20`,
                    color: recentUnlock.color 
                  }}
                >
                  +{recentUnlock.points} XP
                </Badge>
              </div>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-1 rounded-full"
              style={{ backgroundColor: recentUnlock.color }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Component */}
      <div className="space-y-6">
        {/* Stats Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold">
                  {unlockedCount}/{userAchievements.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {progress.toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "unlocked", "locked"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const rarity = rarityConfig[achievement.rarity];
            const Icon = achievement.icon;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all ${
                    achievement.unlocked
                      ? "border-primary/50"
                      : "opacity-60 grayscale"
                  }`}
                >
                  {achievement.unlocked && (
                    <div
                      className="absolute top-0 right-0 w-20 h-20 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10"
                      style={{ backgroundColor: achievement.color }}
                    />
                  )}

                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          achievement.unlocked ? "" : "bg-muted"
                        }`}
                        style={{
                          backgroundColor: achievement.unlocked
                            ? `${achievement.color}20`
                            : undefined,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{
                            color: achievement.unlocked
                              ? achievement.color
                              : "currentColor",
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">
                            {achievement.unlocked
                              ? achievement.title
                              : "???"}
                          </h4>
                          {achievement.unlocked ? (
                            <Unlock className="w-3 h-3 text-green-500" />
                          ) : (
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.unlocked
                            ? achievement.description
                            : achievement.condition}
                        </p>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: rarity.color + "20",
                              color: rarity.color,
                            }}
                          >
                            {rarity.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {achievement.points} XP
                          </Badge>
                        </div>

                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Unlocked{" "}
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Export unlock function for use in other components
export function unlockPortfolioAchievement(id: string) {
  window.dispatchEvent(new CustomEvent("unlock-achievement", { detail: id }));
}
