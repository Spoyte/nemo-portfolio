"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Trophy, 
  Target, 
  Flame, 
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "streak";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  icon: React.ReactNode;
  category: "coding" | "learning" | "creative" | "social";
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Code Streak",
    description: "Write code for 30 minutes today",
    type: "daily",
    difficulty: "easy",
    points: 50,
    completed: false,
    progress: 0,
    maxProgress: 30,
    icon: <Zap className="w-5 h-5" />,
    category: "coding"
  },
  {
    id: "2",
    title: "Bug Hunter",
    description: "Find and fix 3 bugs in your code",
    type: "daily",
    difficulty: "medium",
    points: 100,
    completed: false,
    progress: 0,
    maxProgress: 3,
    icon: <Target className="w-5 h-5" />,
    category: "coding"
  },
  {
    id: "3",
    title: "Learning Spree",
    description: "Complete 1 tutorial or course lesson",
    type: "daily",
    difficulty: "easy",
    points: 75,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: <Star className="w-5 h-5" />,
    category: "learning"
  },
  {
    id: "4",
    title: "Creative Flow",
    description: "Design a new component or UI element",
    type: "weekly",
    difficulty: "medium",
    points: 150,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: <Sparkles className="w-5 h-5" />,
    category: "creative"
  },
  {
    id: "5",
    title: "7-Day Streak",
    description: "Complete daily challenges for 7 days straight",
    type: "streak",
    difficulty: "hard",
    points: 500,
    completed: false,
    progress: 3,
    maxProgress: 7,
    icon: <Flame className="w-5 h-5" />,
    category: "coding"
  },
  {
    id: "6",
    title: "Open Source",
    description: "Contribute to an open source project",
    type: "weekly",
    difficulty: "hard",
    points: 300,
    completed: false,
    progress: 0,
    maxProgress: 1,
    icon: <TrendingUp className="w-5 h-5" />,
    category: "social"
  }
];

const difficultyColors = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20"
};

const categoryColors = {
  coding: "from-blue-500 to-cyan-500",
  learning: "from-purple-500 to-pink-500",
  creative: "from-orange-500 to-yellow-500",
  social: "from-green-500 to-emerald-500"
};

export function DailyChallenges() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(challenges);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [streak, setStreak] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const completeChallenge = useCallback((id: string) => {
    setActiveChallenges(prev => prev.map(challenge => {
      if (challenge.id === id && !challenge.completed) {
        const newChallenge = { ...challenge, completed: true, progress: challenge.maxProgress };
        setTotalPoints(p => p + challenge.points);
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ea580c', '#fbbf24']
        });
        
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        
        return newChallenge;
      }
      return challenge;
    }));
  }, []);

  const updateProgress = useCallback((id: string, increment: number) => {
    setActiveChallenges(prev => prev.map(challenge => {
      if (challenge.id === id && !challenge.completed) {
        const newProgress = Math.min(challenge.progress + increment, challenge.maxProgress);
        const completed = newProgress >= challenge.maxProgress;
        
        if (completed) {
          completeChallenge(id);
        }
        
        return { ...challenge, progress: newProgress, completed };
      }
      return challenge;
    }));
  }, [completeChallenge]);

  const filteredChallenges = selectedCategory 
    ? activeChallenges.filter(c => c.category === selectedCategory)
    : activeChallenges;

  const completedCount = activeChallenges.filter(c => c.completed).length;
  const progressPercentage = (completedCount / activeChallenges.length) * 100;

  return (
    <section className="py-24 border-y border-border/50">
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
            <span className="text-sm font-medium">Daily Challenges</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Level Up Your{" "}
            <span className="text-gradient-animated">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete daily coding challenges, earn points, and maintain your streak. 
            Gamify your learning journey!
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">{streak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{completedCount}/{activeChallenges.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">Level 5</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {["coding", "learning", "creative", "social"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card 
                  className={`p-6 relative overflow-hidden transition-all duration-300 ${
                    challenge.completed ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[challenge.category]} opacity-0 ${
                    challenge.completed ? "opacity-5" : ""
                  }`} />
                  
                  {/* Completed Overlay */}
                  {challenge.completed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                    >
                      <div className="text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold text-green-500">Completed!</p>
                        <p className="text-sm text-muted-foreground">+{challenge.points} points</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[challenge.category]}`}>
                        {challenge.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">{challenge.type}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[challenge.category]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">{challenge.points} pts</span>
                      {!challenge.completed && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProgress(challenge.id, 1)}
                          >
                            +Progress
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => completeChallenge(challenge.id)}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Celebration Toast */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="fixed bottom-8 right-8 z-50 glass-strong px-6 py-4 rounded-2xl border border-primary/20 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Trophy className="w-8 h-8 text-primary" />
                </motion.div>
                <div>
                  <p className="font-bold text-lg">Challenge Complete!</p>
                  <p className="text-sm text-muted-foreground">Keep up the amazing work!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
