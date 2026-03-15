"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Star,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Rocket,
  Code2,
  Coffee,
  Moon,
  Sun,
  Gamepad2,
  BookOpen,
  Share2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StreakDay {
  date: string;
  completed: boolean;
  activities: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  category: string;
}

const rarityColors = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-500",
  epic: "from-purple-400 to-pink-500",
  legendary: "from-yellow-400 to-orange-500",
};

const rarityBorders = {
  common: "border-gray-400/30",
  rare: "border-blue-400/30",
  epic: "border-purple-400/30",
  legendary: "border-yellow-400/30",
};

export function GamifiedPortfolio() {
  const [streak, setStreak] = useState(12);
  const [totalPoints, setTotalPoints] = useState(2847);
  const [level, setLevel] = useState(15);
  const [xp, setXp] = useState(450);
  const [xpToNext, setXpToNext] = useState(1000);
  const [selectedTab, setSelectedTab] = useState<"overview" | "achievements" | "challenges">("overview");
  const [showConfetti, setShowConfetti] = useState(false);

  const [streakDays, setStreakDays] = useState<StreakDay[]>(() => {
    const days: StreakDay[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        completed: Math.random() > 0.3,
        activities: [],
      });
    }
    return days;
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-visit",
      name: "First Steps",
      description: "Visited the portfolio for the first time",
      icon: <Footprints className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-01-15",
      rarity: "common",
    },
    {
      id: "explorer",
      name: "Explorer",
      description: "Visited 10 different pages",
      icon: <Rocket className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-01-16",
      rarity: "common",
    },
    {
      id: "code-master",
      name: "Code Master",
      description: "Spent 30 minutes in the code playground",
      icon: <Code2 className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-01-20",
      rarity: "rare",
    },
    {
      id: "art-connoisseur",
      name: "Art Connoisseur",
      description: "Viewed 20 generative art pieces",
      icon: <Palette className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-02-01",
      rarity: "rare",
    },
    {
      id: "night-owl",
      name: "Night Owl",
      description: "Visited between 2am and 5am",
      icon: <Moon className="w-5 h-5" />,
      unlocked: false,
      rarity: "epic",
    },
    {
      id: "early-bird",
      name: "Early Bird",
      description: "Visited before 6am",
      icon: <Sun className="w-5 h-5" />,
      unlocked: false,
      rarity: "epic",
    },
    {
      id: "game-champion",
      name: "Game Champion",
      description: "Achieved high score in all mini-games",
      icon: <Gamepad2 className="w-5 h-5" />,
      unlocked: false,
      rarity: "legendary",
    },
    {
      id: "knowledge-seeker",
      name: "Knowledge Seeker",
      description: "Read all blog posts",
      icon: <BookOpen className="w-5 h-5" />,
      unlocked: false,
      rarity: "rare",
    },
    {
      id: "coffee-addict",
      name: "Coffee Addict",
      description: "Spent 2 hours total on the site",
      icon: <Coffee className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-02-10",
      rarity: "common",
    },
    {
      id: "streak-master",
      name: "Streak Master",
      description: "Maintained a 7-day streak",
      icon: <Flame className="w-5 h-5" />,
      unlocked: true,
      unlockedAt: "2024-02-15",
      rarity: "epic",
    },
  ]);

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: "explore-art",
      title: "Art Explorer",
      description: "View 5 generative art pieces",
      completed: false,
      points: 50,
      category: "exploration",
    },
    {
      id: "play-game",
      title: "Game On",
      description: "Play any mini-game",
      completed: true,
      points: 30,
      category: "fun",
    },
    {
      id: "read-blog",
      title: "Knowledge Hunter",
      description: "Read a blog post",
      completed: false,
      points: 40,
      category: "learning",
    },
    {
      id: "share-portfolio",
      title: "Spread the Word",
      description: "Share the portfolio",
      completed: false,
      points: 100,
      category: "social",
    },
  ]);

  const handleChallengeComplete = (challengeId: string) => {
    setDailyChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, completed: !c.completed } : c
      )
    );
    
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (challenge && !challenge.completed) {
      setTotalPoints((p) => p + challenge.points);
      setXp((x) => {
        const newXp = x + challenge.points;
        if (newXp >= xpToNext) {
          setLevel((l) => l + 1);
          setXpToNext((n) => n + 200);
          return newXp - xpToNext;
        }
        return newXp;
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const completedChallenges = dailyChallenges.filter((c) => c.completed).length;
  const completedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Gamified Experience</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Journey{" "}
            <span className="text-gradient-animated">Tracked</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every interaction counts! Complete challenges, earn achievements, 
            and build your streak as you explore the portfolio.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl border border-border bg-card text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity:1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-border bg-card text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold">{level}</p>
            <p className="text-sm text-muted-foreground">Level</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-border bg-card text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold">{completedAchievements}/{achievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl border border-border bg-card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Level {level}</h3>
              <p className="text-sm text-muted-foreground">{xp} / {xpToNext} XP to next level</p>
            </div>
            <Badge variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              {Math.round((xp / xpToNext) * 100)}%
            </Badge>
          </div>
          <div className="h-4 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / xpToNext) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {(["overview", "achievements", "challenges"] as const).map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "outline"}
              onClick={() => setSelectedTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Streak Calendar */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    30-Day Activity
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-primary" />
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-muted" />
                      <span className="text-muted-foreground">Inactive</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-10 md:grid-cols-15 gap-2">
                  {streakDays.map((day, idx) => (
                    <motion.div
                      key={day.date}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      className={`aspect-square rounded-md ${
                        day.completed
                          ? "bg-gradient-to-br from-primary to-orange-500"
                          : "bg-muted"
                      }`}
                      title={day.date}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="font-semibold md:col-span-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </h3>
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(-4)
                  .map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border ${rarityBorders[achievement.rarity]} bg-card flex items-center gap-4`}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {achievement.rarity}
                      </Badge>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {selectedTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-6 rounded-2xl border ${
                    achievement.unlocked
                      ? rarityBorders[achievement.rarity]
                      : "border-border opacity-60"
                  } bg-card relative overflow-hidden`}
                >
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      achievement.unlocked
                        ? rarityColors[achievement.rarity]
                        : "from-gray-400 to-gray-500"
                    } text-white`}>
                      {achievement.icon}
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold mb-1">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Unlocked {achievement.unlockedAt}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === "challenges" && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Daily Challenges</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete challenges to earn points and maintain your streak
                  </p>
                </div>
                <Badge variant="secondary">
                  <Target className="w-3 h-3 mr-1" />
                  {completedChallenges}/{dailyChallenges.length} Completed
                </Badge>
              </div>

              {dailyChallenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-2xl border ${
                    challenge.completed ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleChallengeComplete(challenge.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        challenge.completed
                          ? "bg-green-500 border-green-500"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                    >
                      {challenge.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-semibold ${challenge.completed ? "line-through opacity-60" : ""}`}>
                          {challenge.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          +{challenge.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>

                    <Badge variant="secondary" className="capitalize">
                      {challenge.category}
                    </Badge>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => setDailyChallenges((prev) =>
                  prev.map((c) => ({ ...c, completed: false }))
                )}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Challenges
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 500,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="absolute w-4 h-4 rounded"
                  style={{
                    backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b"][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-8 text-center shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Challenge Complete!</h3>
                <p className="text-muted-foreground">Keep up the great work!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Additional icons
function Footprints(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.5 2-1 3" />
      <path d="M4 16c0 2.75 1.81 5 4.5 5S13 18.75 13 16v-2" />
      <path d="M13 14v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C7.63 0 6 1.8 6 6c0 1.25.5 2 1 3" />
      <path d="M13 14c0 2.75-1.81 5-4.5 5S4 16.75 4 14v-2" />
    </svg>
  );
}

function Palette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z" />
    </svg>
  );
}
