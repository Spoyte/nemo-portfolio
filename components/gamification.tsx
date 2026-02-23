"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Zap,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Gift,
  Lock,
  Unlock,
  Sparkles,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  totalVisits: number;
  achievements: string[];
  points: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  requirement: number;
  type: "visits" | "streak" | "time";
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-visit",
    name: "Welcome Aboard",
    description: "Visit the portfolio for the first time",
    icon: <Sparkles className="h-5 w-5" />,
    points: 10,
    requirement: 1,
    type: "visits",
  },
  {
    id: "regular",
    name: "Regular Visitor",
    description: "Visit 5 times",
    icon: <Clock className="h-5 w-5" />,
    points: 25,
    requirement: 5,
    type: "visits",
  },
  {
    id: "enthusiast",
    name: "Portfolio Enthusiast",
    description: "Visit 10 times",
    icon: <Star className="h-5 w-5" />,
    points: 50,
    requirement: 10,
    type: "visits",
  },
  {
    id: "superfan",
    name: "Super Fan",
    description: "Visit 25 times",
    icon: <Crown className="h-5 w-5" />,
    points: 100,
    requirement: 25,
    type: "visits",
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Visit 3 days in a row",
    icon: <Flame className="h-5 w-5" />,
    points: 30,
    requirement: 3,
    type: "streak",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Visit 7 days in a row",
    icon: <Flame className="h-5 w-5" />,
    points: 75,
    requirement: 7,
    type: "streak",
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Visit 30 days in a row",
    icon: <Flame className="h-5 w-5" />,
    points: 200,
    requirement: 30,
    type: "streak",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Visit between midnight and 4 AM",
    icon: <Clock className="h-5 w-5" />,
    points: 50,
    requirement: 1,
    type: "time",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Visit between 5 AM and 7 AM",
    icon: <TrendingUp className="h-5 w-5" />,
    points: 50,
    requirement: 1,
    type: "time",
  },
];

export function GamificationSystem() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: "",
    totalVisits: 0,
    achievements: [],
    points: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load and update streak data
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-streak");
    const data: StreakData = saved ? JSON.parse(saved) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: "",
      totalVisits: 0,
      achievements: [],
      points: 0,
    };

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let updated = { ...data };

    // Check if this is a new day
    if (data.lastVisit !== today) {
      updated.totalVisits += 1;

      // Update streak
      if (data.lastVisit === yesterday) {
        updated.currentStreak += 1;
      } else if (data.lastVisit !== today) {
        updated.currentStreak = 1;
      }

      // Update longest streak
      if (updated.currentStreak > data.longestStreak) {
        updated.longestStreak = updated.currentStreak;
      }

      updated.lastVisit = today;

      // Check time-based achievements
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 4 && !data.achievements.includes("night-owl")) {
        updated.achievements.push("night-owl");
        triggerCelebration(ACHIEVEMENTS.find(a => a.id === "night-owl")!);
      }
      if (hour >= 5 && hour < 7 && !data.achievements.includes("early-bird")) {
        updated.achievements.push("early-bird");
        triggerCelebration(ACHIEVEMENTS.find(a => a.id === "early-bird")!);
      }

      // Check visit-based achievements
      ACHIEVEMENTS.filter(a => a.type === "visits").forEach(achievement => {
        if (updated.totalVisits >= achievement.requirement && !data.achievements.includes(achievement.id)) {
          updated.achievements.push(achievement.id);
          triggerCelebration(achievement);
        }
      });

      // Check streak-based achievements
      ACHIEVEMENTS.filter(a => a.type === "streak").forEach(achievement => {
        if (updated.currentStreak >= achievement.requirement && !data.achievements.includes(achievement.id)) {
          updated.achievements.push(achievement.id);
          triggerCelebration(achievement);
        }
      });

      // Calculate total points
      updated.points = updated.achievements.reduce((acc, id) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        return acc + (achievement?.points || 0);
      }, 0);

      setStreakData(updated);
      localStorage.setItem("portfolio-streak", JSON.stringify(updated));
    } else {
      setStreakData(data);
    }
  }, []);

  const triggerCelebration = useCallback((achievement: Achievement) => {
    setNewAchievement(achievement);
    setShowCelebration(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#f59e0b", "#10b981"],
    });

    setTimeout(() => {
      setShowCelebration(false);
      setNewAchievement(null);
    }, 4000);
  }, []);

  const getNextLevel = () => {
    const levels = [0, 100, 250, 500, 1000, 2000];
    for (let i = 0; i < levels.length; i++) {
      if (streakData.points < levels[i]) {
        return { level: i, pointsNeeded: levels[i] - streakData.points, currentLevelPoints: levels[i - 1] || 0, nextLevelPoints: levels[i] };
      }
    }
    return { level: levels.length, pointsNeeded: 0, currentLevelPoints: levels[levels.length - 1], nextLevelPoints: levels[levels.length - 1] };
  };

  const levelInfo = getNextLevel();
  const progressInLevel = streakData.points - levelInfo.currentLevelPoints;
  const levelProgress = levelInfo.nextLevelPoints > levelInfo.currentLevelPoints 
    ? (progressInLevel / (levelInfo.nextLevelPoints - levelInfo.currentLevelPoints)) * 100 
    : 100;

  return (
    <>
      {/* Achievement Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && newAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-card border-2 border-primary p-8 rounded-3xl shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="inline-flex p-4 rounded-full bg-primary/10 mb-4"
              >
                <Trophy className="h-12 w-12 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
              <p className="text-xl font-semibold text-primary mb-1">{newAchievement.name}</p>
              <p className="text-muted-foreground mb-4">{newAchievement.description}</p>
              <div className="flex items-center justify-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">+{newAchievement.points} points</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak Widget */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base">Visitor Stats</CardTitle>
                <p className="text-xs text-muted-foreground">Level {levelInfo.level} • {streakData.points} XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="h-4 w-4" />
                <span className="font-bold">{streakData.currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Level Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Level {levelInfo.level}</span>
              <span>Level {levelInfo.level + 1}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {levelInfo.pointsNeeded > 0 ? `${levelInfo.pointsNeeded} XP to next level` : "Max level reached!"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{streakData.totalVisits}</p>
              <p className="text-xs text-muted-foreground">Visits</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{streakData.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{streakData.achievements.length}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
          </div>

          {/* Recent Achievements */}
          {streakData.achievements.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2">Recent Achievements</p>
              <div className="flex flex-wrap gap-1">
                {streakData.achievements.slice(-3).map((id) => {
                  const achievement = ACHIEVEMENTS.find(a => a.id === id);
                  if (!achievement) return null;
                  return (
                    <div
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      title={achievement.description}
                    >
                      {achievement.icon}
                      <span className="hidden sm:inline">{achievement.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// Achievement showcase component for a dedicated page/section
export function AchievementShowcase() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: "",
    totalVisits: 0,
    achievements: [],
    points: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-streak");
    if (saved) {
      setStreakData(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ACHIEVEMENTS.map((achievement, index) => {
        const unlocked = streakData.achievements.includes(achievement.id);
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`h-full transition-all ${unlocked ? 'border-primary/50' : 'opacity-60'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {unlocked ? achievement.icon : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {unlocked && <Unlock className="h-3 w-3 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium">{achievement.points} XP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
