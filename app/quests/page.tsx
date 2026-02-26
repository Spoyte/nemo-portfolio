"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  Star,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Lock,
  Sparkles,
  Gift,
  Crown,
  Sword,
  Shield,
  Gem,
  Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  completed: boolean;
  category: "daily" | "weekly" | "achievement";
  progress: number;
  maxProgress: number;
  reward?: string;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalQuestsCompleted: number;
  rank: string;
}

const RANKS = [
  { level: 1, name: "Novice Coder", color: "text-gray-500" },
  { level: 5, name: "Apprentice", color: "text-green-500" },
  { level: 10, name: "Journeyman", color: "text-blue-500" },
  { level: 15, name: "Expert", color: "text-purple-500" },
  { level: 20, name: "Master", color: "text-orange-500" },
  { level: 30, name: "Grandmaster", color: "text-red-500" },
  { level: 50, name: "Legend", color: "text-yellow-500" },
];

const INITIAL_QUESTS: Quest[] = [
  // Daily Quests
  {
    id: "d1",
    title: "Portfolio Explorer",
    description: "Visit 5 different pages on the portfolio",
    icon: CompassIcon,
    xp: 50,
    completed: false,
    category: "daily",
    progress: 0,
    maxProgress: 5,
    reward: "Explorer Badge",
  },
  {
    id: "d2",
    title: "Code Poetry Reader",
    description: "Read 3 code poems in the Code Poetry section",
    icon: Code2,
    xp: 75,
    completed: false,
    category: "daily",
    progress: 0,
    maxProgress: 3,
    reward: "Poet's Quill",
  },
  {
    id: "d3",
    title: "Speed Demon",
    description: "Complete a typing test with 60+ WPM",
    icon: Zap,
    xp: 100,
    completed: false,
    category: "daily",
    progress: 0,
    maxProgress: 1,
    reward: "Lightning Badge",
  },
  // Weekly Quests
  {
    id: "w1",
    title: "Art Connoisseur",
    description: "View 10 different art pieces in the gallery",
    icon: PaletteIcon,
    xp: 200,
    completed: false,
    category: "weekly",
    progress: 0,
    maxProgress: 10,
    reward: "Art Collector Frame",
  },
  {
    id: "w2",
    title: "Secret Hunter",
    description: "Find 3 hidden easter eggs",
    icon: Target,
    xp: 300,
    completed: false,
    category: "weekly",
    progress: 0,
    maxProgress: 3,
    reward: "Detective Hat",
  },
  // Achievements
  {
    id: "a1",
    title: "First Steps",
    description: "Complete your first quest",
    icon: FootprintsIcon,
    xp: 25,
    completed: false,
    category: "achievement",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "a2",
    title: "Dedicated Visitor",
    description: "Visit the portfolio 7 days in a row",
    icon: Flame,
    xp: 150,
    completed: false,
    category: "achievement",
    progress: 0,
    maxProgress: 7,
  },
  {
    id: "a3",
    title: "Master Explorer",
    description: "Visit every page on the portfolio",
    icon: Crown,
    xp: 500,
    completed: false,
    category: "achievement",
    progress: 0,
    maxProgress: 25,
  },
  {
    id: "a4",
    title: "Zen Master",
    description: "Spend 10 minutes in Zen Mode",
    icon: Sparkles,
    xp: 200,
    completed: false,
    category: "achievement",
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "a5",
    title: "Keyboard Warrior",
    description: "Type 1000 characters total",
    icon: Sword,
    xp: 100,
    completed: false,
    category: "achievement",
    progress: 0,
    maxProgress: 1000,
  },
];

function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
    </svg>
  );
}

function PaletteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function FootprintsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.97 3.33-3 3.88V16" />
      <path d="M13 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C7.63 2 6 3.8 6 8c0 1.25.97 3.33 3 3.88V16" />
      <path d="M20 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 2 13 3.8 13 8c0 1.25.97 3.33 3 3.88V16" />
      <path d="M17 16v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 1.49-6 4.5-6C21.37 2 23 3.8 23 8c0 1.25-.97 3.33-3 3.88V16" />
    </svg>
  );
}

export default function QuestLogPage() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 1,
    totalQuestsCompleted: 0,
    rank: "Novice Coder",
  });
  const [activeTab, setActiveTab] = useState<"all" | "daily" | "weekly" | "achievements">("all");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("questLogData");
    if (saved) {
      const { quests: savedQuests, stats: savedStats } = JSON.parse(saved);
      setQuests(savedQuests);
      setStats(savedStats);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("questLogData", JSON.stringify({ quests, stats }));
  }, [quests, stats]);

  const getRankForLevel = (level: number) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (level >= RANKS[i].level) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  const completeQuest = useCallback((questId: string) => {
    setQuests((prev) => {
      const quest = prev.find((q) => q.id === questId);
      if (!quest || quest.completed) return prev;

      const updated = prev.map((q) =>
        q.id === questId ? { ...q, completed: true, progress: q.maxProgress } : q
      );

      // Add XP and check for level up
      setStats((prevStats) => {
        const newXp = prevStats.xp + quest.xp;
        let newLevel = prevStats.level;
        let xpToNext = prevStats.xpToNextLevel;

        // Check for level up
        if (newXp >= prevStats.xpToNextLevel) {
          newLevel = prevStats.level + 1;
          xpToNext = Math.floor(prevStats.xpToNextLevel * 1.5);
          setNewLevel(newLevel);
          setShowLevelUp(true);
          
          // Trigger confetti
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#dc2626", "#f97316", "#fbbf24", "#22d3ee"],
          });

          setTimeout(() => setShowLevelUp(false), 3000);
        }

        return {
          ...prevStats,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: xpToNext,
          totalQuestsCompleted: prevStats.totalQuestsCompleted + 1,
          rank: getRankForLevel(newLevel).name,
        };
      });

      return updated;
    });
  }, []);

  const incrementQuestProgress = useCallback((questId: string) => {
    setQuests((prev) => {
      const quest = prev.find((q) => q.id === questId);
      if (!quest || quest.completed) return prev;

      const newProgress = Math.min(quest.progress + 1, quest.maxProgress);
      const isComplete = newProgress >= quest.maxProgress;

      if (isComplete) {
        completeQuest(questId);
      }

      return prev.map((q) =>
        q.id === questId ? { ...q, progress: newProgress, completed: isComplete } : q
      );
    });
  }, [completeQuest]);

  const filteredQuests = quests.filter((q) => {
    if (activeTab === "all") return true;
    if (activeTab === "achievements") return q.category === "achievement";
    return q.category === activeTab;
  });

  const completedCount = quests.filter((q) => q.completed).length;
  const completionPercentage = Math.round((completedCount / quests.length) * 100);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Quest Log</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Your Adventure
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete quests, earn XP, and level up as you explore the portfolio!
          </p>
        </motion.div>

        {/* Level Up Modal */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-gradient-to-br from-primary to-orange-500 text-white p-8 rounded-3xl shadow-2xl text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Crown className="h-16 w-16 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
                <p className="text-xl">You reached Level {newLevel}</p>
                <p className="text-white/80 mt-2">{getRankForLevel(newLevel).name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Level Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold">{stats.level}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>XP: {stats.xp}</span>
                  <span>{stats.xpToNextLevel}</span>
                </div>
                <Progress value={(stats.xp / stats.xpToNextLevel) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Rank Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className={`text-lg font-bold ${getRankForLevel(stats.level).color}`}>
                    {stats.rank}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">{stats.streak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}/{quests.length}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {(["all", "daily", "weekly", "achievements"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
              {tab !== "all" && (
                <Badge variant="secondary" className="ml-2">
                  {quests.filter((q) => q.category === (tab === "achievements" ? "achievement" : tab)).length}
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        {/* Quests Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest, index) => {
              const Icon = quest.icon;
              const progressPercent = (quest.progress / quest.maxProgress) * 100;

              return (
                <motion.div
                  key={quest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`transition-all duration-300 ${
                      quest.completed
                        ? "bg-green-500/5 border-green-500/30"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            quest.completed
                              ? "bg-green-500 text-white"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {quest.title}
                                {quest.completed && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {quest.description}
                              </p>
                            </div>
                            <Badge variant={quest.completed ? "default" : "secondary"}>
                              +{quest.xp} XP
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span>
                                Progress: {quest.progress}/{quest.maxProgress}
                              </span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className={`h-full rounded-full ${
                                  quest.completed
                                    ? "bg-green-500"
                                    : "bg-gradient-to-r from-primary to-orange-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Reward */}
                          {quest.reward && (
                            <div className="flex items-center gap-2 mt-3 text-sm">
                              <Gift className="h-4 w-4 text-amber-500" />
                              <span className="text-muted-foreground">Reward: </span>
                              <span className="font-medium">{quest.reward}</span>
                            </div>
                          )}

                          {/* Simulate Progress Button (for demo) */}
                          {!quest.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() => incrementQuestProgress(quest.id)}
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Make Progress
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No quests available</h3>
            <p className="text-muted-foreground">
              Check back later for new quests in this category!
            </p>
          </motion.div>
        )}

        {/* Rank Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Rank Progression</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-orange-500 -translate-y-1/2 transition-all duration-500"
              style={{ width: `${Math.min((stats.level / 50) * 100, 100)}%` }}
            />

            {/* Rank Points */}
            <div className="relative flex justify-between">
              {RANKS.map((rank) => {
                const isUnlocked = stats.level >= rank.level;
                const isCurrent = stats.rank === rank.name;

                return (
                  <motion.div
                    key={rank.level}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                        isUnlocked
                          ? isCurrent
                            ? "bg-primary border-primary text-white ring-4 ring-primary/30"
                            : "bg-green-500 border-green-500 text-white"
                          : "bg-muted border-muted text-muted-foreground"
                      }`}
                    >
                      {isUnlocked ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isUnlocked ? rank.color : "text-muted-foreground"
                      }`}
                    >
                      {rank.name}
                    </span>
                    <span className="text-xs text-muted-foreground">Lvl {rank.level}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
