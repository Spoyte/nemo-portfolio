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
  Gem,
  Rocket,
  Code2,
  Palette,
  BookOpen,
  Heart,
  Share2,
  MessageSquare,
  Eye,
  Clock,
  Award,
  Medal,
  Sparkles,
  Lock,
  Unlock,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  icon: React.ElementType;
}

interface Stat {
  label: string;
  value: number;
  max: number;
  icon: React.ElementType;
  color: string;
}

const rarityColors = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 to-orange-500",
};

const rarityBorders = {
  common: "border-gray-400/30",
  rare: "border-blue-400/30",
  epic: "border-purple-400/30",
  legendary: "border-amber-400/30",
};

const initialAchievements: Achievement[] = [
  {
    id: "first-visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: FootprintsIcon,
    unlocked: true,
    unlockedAt: "2026-03-01",
    rarity: "common",
    category: "Exploration",
    progress: 1,
    maxProgress: 1,
    xpReward: 10,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit 5 different pages",
    icon: Eye,
    unlocked: true,
    unlockedAt: "2026-03-02",
    rarity: "common",
    category: "Exploration",
    progress: 5,
    maxProgress: 5,
    xpReward: 25,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Visit between midnight and 6 AM",
    icon: MoonIcon,
    unlocked: false,
    rarity: "rare",
    category: "Exploration",
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Share the portfolio on social media",
    icon: Share2,
    unlocked: false,
    rarity: "rare",
    category: "Social",
    progress: 0,
    maxProgress: 1,
    xpReward: 75,
  },
  {
    id: "code-master",
    title: "Code Master",
    description: "Spend 10 minutes on the code playground",
    icon: Code2,
    unlocked: false,
    rarity: "epic",
    category: "Skills",
    progress: 3,
    maxProgress: 10,
    xpReward: 100,
  },
  {
    id: "design-guru",
    title: "Design Guru",
    description: "Try 5 different theme customizations",
    icon: Palette,
    unlocked: false,
    rarity: "epic",
    category: "Skills",
    progress: 2,
    maxProgress: 5,
    xpReward: 100,
  },
  {
    id: "easter-egg-hunter",
    title: "Easter Egg Hunter",
    description: "Find 3 hidden easter eggs",
    icon: SearchIcon,
    unlocked: false,
    rarity: "legendary",
    category: "Exploration",
    progress: 1,
    maxProgress: 3,
    xpReward: 200,
  },
  {
    id: "konami-master",
    title: "Konami Master",
    description: "Enter the Konami code",
    icon: GamepadIcon,
    unlocked: false,
    rarity: "legendary",
    category: "Secrets",
    progress: 0,
    maxProgress: 1,
    xpReward: 500,
  },
  {
    id: "speed-reader",
    title: "Speed Reader",
    description: "Read 3 blog posts",
    icon: BookOpen,
    unlocked: true,
    unlockedAt: "2026-03-02",
    rarity: "common",
    category: "Learning",
    progress: 3,
    maxProgress: 3,
    xpReward: 30,
  },
  {
    id: "supporter",
    title: "Supporter",
    description: "Send a message through the contact form",
    icon: MessageSquare,
    unlocked: false,
    rarity: "rare",
    category: "Social",
    progress: 0,
    maxProgress: 1,
    xpReward: 50,
  },
  {
    id: "return-visitor",
    title: "Regular",
    description: "Visit on 3 different days",
    icon: Calendar,
    unlocked: true,
    unlockedAt: "2026-03-03",
    rarity: "rare",
    category: "Exploration",
    progress: 3,
    maxProgress: 3,
    xpReward: 60,
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlock all achievements",
    icon: Crown,
    unlocked: false,
    rarity: "legendary",
    category: "Mastery",
    progress: 4,
    maxProgress: 12,
    xpReward: 1000,
  },
];

const dailyQuests: DailyQuest[] = [
  { id: "q1", title: "Daily Explorer", description: "Visit 3 pages", completed: true, xpReward: 20, icon: Eye },
  { id: "q2", title: "Theme Switcher", description: "Try a different theme", completed: false, xpReward: 15, icon: Palette },
  { id: "q3", title: "Social Share", description: "Share on social media", completed: false, xpReward: 30, icon: Share2 },
  { id: "q4", title: "Time Traveler", description: "Check the timeline", completed: true, xpReward: 20, icon: Clock },
];

const stats: Stat[] = [
  { label: "Exploration", value: 75, max: 100, icon: Eye, color: "#3b82f6" },
  { label: "Skills", value: 45, max: 100, icon: Zap, color: "#8b5cf6" },
  { label: "Social", value: 30, max: 100, icon: Heart, color: "#ec4899" },
  { label: "Learning", value: 60, max: 100, icon: BookOpen, color: "#10b981" },
];

// Icon components
function FootprintsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.97 2.33-1 4-.03 1.67 1 2.67 1 4.5V16" />
      <path d="M13 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C8.63 2 7 3.8 7 8c0 1.25.97 2.33 1 4 .03 1.67-1 2.67-1 4.5V16" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GamepadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

export default function GamificationPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  useEffect(() => {
    const unlocked = achievements.filter(a => a.unlocked);
    const xp = unlocked.reduce((sum, a) => sum + a.xpReward, 0);
    setTotalXP(xp);
    setLevel(Math.floor(xp / 200) + 1);
  }, [achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => 
      prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString().split("T")[0] }
          : a
      )
    );
    setShowUnlockAnimation(id);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#f59e0b"],
    });
    setTimeout(() => setShowUnlockAnimation(null), 3000);
  }, []);

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const categories = ["all", ...Array.from(new Set(achievements.map(a => a.category)))];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Achievement System</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your{" "}
            <span className="text-gradient-animated">Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore, interact, and unlock achievements as you discover my portfolio.
          </p>
        </ScrollReveal>

        {/* Stats Overview */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">Level {level}</p>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-orange-500/10 mb-4">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{totalXP}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-purple-500/10 mb-4">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-green-500/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{completionPercentage}%</p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="quests">Daily Quests</TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="mt-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredAchievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${
                          achievement.unlocked
                            ? `bg-card ${rarityBorders[achievement.rarity]}`
                            : "bg-muted/50 border-muted opacity-75"
                        }`}
                      >
                        {showUnlockAnimation === achievement.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded-2xl z-10"
                          >
                            <div className="text-center text-primary-foreground">
                              <Trophy className="h-12 w-12 mx-auto mb-2" />
                              <p className="text-xl font-bold">Unlocked!</p>
                              <p className="text-sm">+{achievement.xpReward} XP</p>
                            </div>
                          </motion.div>
                        )}

                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} ${
                            achievement.unlocked ? "" : "grayscale"
                          }`}>
                            <achievement.icon className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{achievement.title}</h3>
                              {achievement.unlocked ? (
                                <Unlock className="h-4 w-4 text-green-500" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                                {achievement.rarity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {achievement.xpReward} XP
                              </Badge>
                            </div>

                            {!achievement.unlocked && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="quests" className="mt-6">
                <div className="space-y-4">
                  {dailyQuests.map((quest) => (
                    <Card key={quest.id} className={quest.completed ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${quest.completed ? "bg-green-500/20" : "bg-primary/10"}`}>
                            <quest.icon className={`h-6 w-6 ${quest.completed ? "text-green-500" : "text-primary"}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${quest.completed ? "line-through" : ""}`}>
                                {quest.title}
                              </h3>
                              {quest.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                          </div>

                          <Badge variant="outline">+{quest.xpReward} XP</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-muted text-center">
                  <p className="text-sm text-muted-foreground">
                    Quests reset daily at midnight UTC. Complete them to earn bonus XP!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Level {level}</span>
                    <span className="text-muted-foreground">{totalXP % 200}/200 XP</span>
                  </div>
                  <Progress value={((totalXP % 200) / 200) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {200 - (totalXP % 200)} XP until Level {level + 1}
                  </p>
                </div>

                <div className="space-y-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="text-sm font-medium">{stat.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${stat.value}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rarity Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rarity Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { rarity: "common", label: "Common", desc: "Easy to unlock" },
                  { rarity: "rare", label: "Rare", desc: "Requires effort" },
                  { rarity: "epic", label: "Epic", desc: "Challenging" },
                  { rarity: "legendary", label: "Legendary", desc: "Very difficult" },
                ].map((item) => (
                  <div key={item.rarity} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded bg-gradient-to-br ${rarityColors[item.rarity as keyof typeof rarityColors]}`} />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
