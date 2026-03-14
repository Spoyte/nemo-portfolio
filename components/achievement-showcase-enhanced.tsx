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
  Award,
  Gem,
  Rocket,
  Brain,
  Heart,
  Lock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "coding" | "design" | "social" | "milestone";
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

const achievements: Achievement[] = [
  // Coding Achievements
  {
    id: "first-commit",
    title: "First Steps",
    description: "Make your first commit",
    icon: <Zap className="w-6 h-6" />,
    category: "coding",
    tier: "bronze",
    points: 50,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: "2024-01-15"
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Code past midnight 10 times",
    icon: <Star className="w-6 h-6" />,
    category: "coding",
    tier: "silver",
    points: 100,
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    unlockedAt: "2024-02-01"
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Fix 50 bugs in your code",
    icon: <Target className="w-6 h-6" />,
    category: "coding",
    tier: "gold",
    points: 250,
    unlocked: false,
    progress: 32,
    maxProgress: 50
  },
  {
    id: "code-marathon",
    title: "Marathon Coder",
    description: "Code for 8 hours straight",
    icon: <Flame className="w-6 h-6" />,
    category: "coding",
    tier: "platinum",
    points: 500,
    unlocked: false,
    progress: 5,
    maxProgress: 8
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Use 10 different programming languages",
    icon: <Brain className="w-6 h-6" />,
    category: "coding",
    tier: "diamond",
    points: 1000,
    unlocked: false,
    progress: 6,
    maxProgress: 10
  },
  
  // Design Achievements
  {
    id: "pixel-perfect",
    title: "Pixel Perfect",
    description: "Create 20 UI components",
    icon: <Gem className="w-6 h-6" />,
    category: "design",
    tier: "silver",
    points: 150,
    unlocked: true,
    progress: 20,
    maxProgress: 20,
    unlockedAt: "2024-02-10"
  },
  {
    id: "animation-master",
    title: "Animation Master",
    description: "Create 50 smooth animations",
    icon: <Sparkles className="w-6 h-6" />,
    category: "design",
    tier: "gold",
    points: 300,
    unlocked: false,
    progress: 38,
    maxProgress: 50
  },
  {
    id: "dark-mode",
    title: "Dark Mode Advocate",
    description: "Implement dark mode in 5 projects",
    icon: <Star className="w-6 h-6" />,
    category: "design",
    tier: "silver",
    points: 100,
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: "2024-01-28"
  },
  
  // Social Achievements
  {
    id: "helper",
    title: "Community Helper",
    description: "Answer 25 questions on forums",
    icon: <Heart className="w-6 h-6" />,
    category: "social",
    tier: "silver",
    points: 150,
    unlocked: false,
    progress: 18,
    maxProgress: 25
  },
  {
    id: "open-source",
    title: "Open Source Hero",
    description: "Contribute to 10 open source projects",
    icon: <Rocket className="w-6 h-6" />,
    category: "social",
    tier: "platinum",
    points: 600,
    unlocked: false,
    progress: 3,
    maxProgress: 10
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Help 5 developers level up",
    icon: <Crown className="w-6 h-6" />,
    category: "social",
    tier: "gold",
    points: 400,
    unlocked: false,
    progress: 2,
    maxProgress: 5
  },
  
  // Milestone Achievements
  {
    id: "portfolio",
    title: "Portfolio Launch",
    description: "Launch your personal portfolio",
    icon: <Trophy className="w-6 h-6" />,
    category: "milestone",
    tier: "gold",
    points: 300,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: "2024-03-01"
  },
  {
    id: "first-client",
    title: "First Client",
    description: "Complete your first paid project",
    icon: <Medal className="w-6 h-6" />,
    category: "milestone",
    tier: "platinum",
    points: 500,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: "2024-02-20"
  },
  {
    id: "veteran",
    title: "Veteran Developer",
    description: "5 years of coding experience",
    icon: <Award className="w-6 h-6" />,
    category: "milestone",
    tier: "diamond",
    points: 2000,
    unlocked: false,
    progress: 3,
    maxProgress: 5
  }
];

const tierColors = {
  bronze: "from-amber-700 to-amber-600",
  silver: "from-slate-400 to-slate-300",
  gold: "from-yellow-500 to-amber-400",
  platinum: "from-cyan-400 to-blue-400",
  diamond: "from-purple-500 to-pink-500"
};

const tierGlow = {
  bronze: "shadow-amber-500/20",
  silver: "shadow-slate-400/20",
  gold: "shadow-yellow-500/30",
  platinum: "shadow-cyan-400/30",
  diamond: "shadow-purple-500/40"
};

const categoryIcons = {
  coding: <Zap className="w-5 h-5" />,
  design: <Gem className="w-5 h-5" />,
  social: <Heart className="w-5 h-5" />,
  milestone: <Trophy className="w-5 h-5" />
};

export function AchievementShowcaseEnhanced() {
  const [activeAchievements, setActiveAchievements] = useState(achievements);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null);

  const filteredAchievements = activeAchievements.filter(a => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (showUnlockedOnly && !a.unlocked) return false;
    return true;
  });

  const unlockedCount = activeAchievements.filter(a => a.unlocked).length;
  const totalPoints = activeAchievements
    .filter(a => a.unlocked)
    .reduce((acc, a) => acc + a.points, 0);
  const completionRate = (unlockedCount / activeAchievements.length) * 100;

  const unlockAchievement = useCallback((id: string) => {
    setActiveAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        const unlocked = { 
          ...a, 
          unlocked: true, 
          progress: a.maxProgress,
          unlockedAt: new Date().toISOString().split("T")[0]
        };
        setRecentlyUnlocked(unlocked);
        
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309']
        });
        
        setTimeout(() => setRecentlyUnlocked(null), 5000);
        return unlocked;
      }
      return a;
    }));
  }, []);

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
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Achievement Gallery</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Track Your{" "}
            <span className="text-gradient-animated">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every milestone matters. Unlock achievements as you grow, 
            and showcase your developer journey.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5" />
            <div className="relative">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{unlockedCount}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
          </Card>
          
          <Card className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5" />
            <div className="relative">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </Card>
          
          <Card className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <div className="relative">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </div>
          </Card>
          
          <Card className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
            <div className="relative">
              <Crown className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">{activeAchievements.filter(a => a.tier === "diamond" && a.unlocked).length}</p>
              <p className="text-sm text-muted-foreground">Diamond</p>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          
          {Object.entries(categoryIcons).map(([cat, icon]) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className="capitalize"
            >
              {icon}
              <span className="ml-2">{cat}</span>
            </Button>
          ))}
          
          <Button
            variant={showUnlockedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Unlocked Only
          </Button>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card 
                  className={`p-6 relative overflow-hidden transition-all duration-500 ${
                    achievement.unlocked 
                      ? `shadow-lg ${tierGlow[achievement.tier]}` 
                      : "opacity-70 grayscale"
                  }`}
                >
                  {/* Tier Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tierColors[achievement.tier]} opacity-0 ${
                    achievement.unlocked ? "opacity-5" : ""
                  }`} />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${tierColors[achievement.tier]} ${
                          achievement.unlocked ? "" : "grayscale"
                        }`}
                        whileHover={achievement.unlocked ? { scale: 1.1, rotate: 5 } : {}}
                      >
                        {achievement.icon}
                      </motion.div>
                      
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full bg-gradient-to-r ${tierColors[achievement.tier]} text-white font-medium capitalize`}>
                          {achievement.tier}
                        </span>
                        <p className="text-sm font-bold mt-1">{achievement.points} pts</p>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

                    {/* Progress */}
                    {!achievement.unlocked && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {categoryIcons[achievement.category]}
                        <span className="text-sm text-muted-foreground capitalize">{achievement.category}</span>
                      </div>
                      
                      {achievement.unlocked ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">{achievement.unlockedAt}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Unlock Notification */}
        <AnimatePresence>
          {recentlyUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Card className={`p-6 border-2 bg-gradient-to-br from-background to-muted`}
                style={{ borderColor: "transparent" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg" />
                <div className="relative flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${tierColors[recentlyUnlocked.tier]}`}
                  >
                    {recentlyUnlocked.icon}
                  </motion.div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Achievement Unlocked!</p>
                    <p className="text-xl font-bold">{recentlyUnlocked.title}</p>
                    <p className="text-sm text-primary font-medium">+{recentlyUnlocked.points} points</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
