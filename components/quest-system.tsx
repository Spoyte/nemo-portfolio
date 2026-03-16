"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Flame,
  Lock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Quest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "achievement";
  difficulty: "easy" | "medium" | "hard" | "legendary";
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: number;
  icon: React.ElementType;
}

const initialQuests: Quest[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Visit 5 different pages on the portfolio",
    category: "daily",
    difficulty: "easy",
    progress: 0,
    maxProgress: 5,
    completed: false,
    reward: 10,
    icon: Target,
  },
  {
    id: "2",
    title: "Code Explorer",
    description: "Check out the Code Evolution page",
    category: "daily",
    difficulty: "easy",
    progress: 0,
    maxProgress: 1,
    completed: false,
    reward: 15,
    icon: Zap,
  },
  {
    id: "3",
    title: "Art Connoisseur",
    description: "View 3 different generative art pieces",
    category: "daily",
    difficulty: "medium",
    progress: 0,
    maxProgress: 3,
    completed: false,
    reward: 25,
    icon: Star,
  },
  {
    id: "4",
    title: "Secret Hunter",
    description: "Find 3 hidden easter eggs",
    category: "weekly",
    difficulty: "hard",
    progress: 0,
    maxProgress: 3,
    completed: false,
    reward: 50,
    icon: Lock,
  },
  {
    id: "5",
    title: "Konami Master",
    description: "Activate the Konami code",
    category: "achievement",
    difficulty: "legendary",
    progress: 0,
    maxProgress: 1,
    completed: false,
    reward: 100,
    icon: Trophy,
  },
  {
    id: "6",
    title: "Speed Reader",
    description: "Spend 10 minutes reading the blog",
    category: "weekly",
    difficulty: "medium",
    progress: 0,
    maxProgress: 10,
    completed: false,
    reward: 30,
    icon: Flame,
  },
];

const difficultyColors = {
  easy: "from-green-500 to-emerald-500",
  medium: "from-blue-500 to-cyan-500",
  hard: "from-orange-500 to-amber-500",
  legendary: "from-purple-500 to-pink-500",
};

const difficultyBadges = {
  easy: "bg-green-500/10 text-green-500",
  medium: "bg-blue-500/10 text-blue-500",
  hard: "bg-orange-500/10 text-orange-500",
  legendary: "bg-purple-500/10 text-purple-500",
};

export function QuestSystem() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "daily" | "weekly" | "achievement">("all");
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.floor(totalXP / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [totalXP, level]);

  // Track page visits
  useEffect(() => {
    const currentPath = window.location.pathname;
    setVisitedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentPath);
      return newSet;
    });
  }, []);

  // Update quest progress based on page visits
  useEffect(() => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.completed) return quest;

        let newProgress = quest.progress;

        if (quest.id === "1") {
          // First Steps - visit 5 pages
          newProgress = Math.min(visitedPages.size, quest.maxProgress);
        } else if (quest.id === "2" && visitedPages.has("/code-evolution")) {
          // Code Explorer
          newProgress = 1;
        }

        const completed = newProgress >= quest.maxProgress;
        if (completed && !quest.completed) {
          setTotalXP((xp) => xp + quest.reward);
          setLastCompleted(quest);
          setTimeout(() => setLastCompleted(null), 3000);
        }

        return { ...quest, progress: newProgress, completed };
      })
    );
  }, [visitedPages]);

  // Listen for Konami code
  useEffect(() => {
    const handleKonami = () => {
      setQuests((prev) =>
        prev.map((quest) => {
          if (quest.id === "5" && !quest.completed) {
            setTotalXP((xp) => xp + quest.reward);
            setLastCompleted(quest);
            setTimeout(() => setLastCompleted(null), 3000);
            return { ...quest, progress: 1, completed: true };
          }
          return quest;
        })
      );
    };

    window.addEventListener("konami-code", handleKonami);
    return () => window.removeEventListener("konami-code", handleKonami);
  }, []);

  const resetQuests = () => {
    setQuests(initialQuests);
    setTotalXP(0);
    setLevel(1);
    setVisitedPages(new Set());
  };

  const filteredQuests = quests.filter(
    (quest) => activeTab === "all" || quest.category === activeTab
  );

  const completedCount = quests.filter((q) => q.completed).length;
  const progressPercent = (completedCount / quests.length) * 100;

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
003e
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Quest System</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete Quests, Earn{" "}
            <span className="text-gradient-animated">Rewards</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the portfolio, find secrets, and complete challenges to earn XP and level up!
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Level Badge */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {level}
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/30"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold">Explorer</p>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">XP Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {totalXP % 100} / 100 XP
                  </span>
                </div>
                <Progress value={(totalXP % 100)} max={100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {100 - (totalXP % 100)} XP until next level
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{totalXP}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {completedCount}/{quests.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Quests Done</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(["all", "daily", "weekly", "achievement"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
              {tab !== "all" && (
                <span className="ml-2 text-xs opacity-70">
                  {quests.filter((q) => q.category === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    "p-5 relative overflow-hidden transition-all hover:shadow-lg",
                    quest.completed && "opacity-75"
                  )}
                >
                  {/* Difficulty Gradient */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-1 h-full bg-gradient-to-b",
                      difficultyColors[quest.difficulty]
                    )}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        quest.completed
                          ? "bg-green-500/10 text-green-500"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {quest.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <quest.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        difficultyBadges[quest.difficulty]
                      )}
                    >
                      {quest.difficulty}
                    </span>
                  </div>

                  <h3 className={cn("font-semibold mb-1", quest.completed && "line-through")}>
                    {quest.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {quest.progress} / {quest.maxProgress}
                      </span>
                    </div>
                    <Progress
                      value={(quest.progress / quest.maxProgress) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Reward */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{quest.reward} XP</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={resetQuests} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </Button>
        </div>

        {/* Completion Celebration */}
        <AnimatePresence>
          {lastCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="fixed bottom-24 right-6 z-50"
            >
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">Quest Complete!</p>
                    <p className="text-sm">
                      {lastCompleted.title} • +{lastCompleted.reward} XP
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.5, rotate: 10 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                  {level}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Level Up!</h2>
                <p className="text-white/80">You reached level {level}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
