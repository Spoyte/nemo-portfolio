"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Flame,
  Crown,
  Medal,
  Award,
  Gift,
  Lock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-animations";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
}

const achievements: Achievement[] = [
  {
    id: "first-visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: Star,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    xp: 10
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit 10 different pages",
    icon: Target,
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    rarity: "common",
    xp: 25
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Visit between midnight and 5 AM",
    icon: Flame,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "rare",
    xp: 50
  },
  {
    id: "konami",
    title: "Code Breaker",
    description: "Enter the Konami code",
    icon: Zap,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
    xp: 100
  },
  {
    id: "collector",
    title: "Collector",
    description: "Find 5 easter eggs",
    icon: Gift,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: "rare",
    xp: 75
  },
  {
    id: "master",
    title: "Portfolio Master",
    description: "Unlock all achievements",
    icon: Crown,
    unlocked: false,
    progress: 2,
    maxProgress: 10,
    rarity: "legendary",
    xp: 500
  },
  {
    id: "speed-reader",
    title: "Speed Reader",
    description: "Read 5 blog posts",
    icon: Medal,
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    rarity: "common",
    xp: 30
  },
  {
    id: "social",
    title: "Social Butterfly",
    description: "Share the portfolio on social media",
    icon: Share2,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "rare",
    xp: 50
  }
];

const rarityColors = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-500",
  epic: "from-purple-400 to-purple-500",
  legendary: "from-yellow-400 via-orange-500 to-red-500"
};

const rarityBgColors = {
  common: "bg-gray-500/10 border-gray-500/20",
  rare: "bg-blue-500/10 border-blue-500/20",
  epic: "bg-purple-500/10 border-purple-500/20",
  legendary: "bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/30"
};

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = achievement.icon;
  const isLegendary = achievement.rarity === "legendary";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-6 rounded-2xl border transition-all ${
        achievement.unlocked 
          ? rarityBgColors[achievement.rarity]
          : "bg-muted/50 border-border opacity-60"
      }`}
    >
      {/* Locked Overlay */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/50 backdrop-blur-[1px]">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{achievement.title}</h3>
            {achievement.unlocked && (
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <Progress 
              value={(achievement.progress / achievement.maxProgress) * 100} 
              className="h-1.5"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Badge variant="outline" className="text-xs capitalize">
              {achievement.rarity}
            </Badge>
            <span className="text-xs text-muted-foreground">+{achievement.xp} XP</span>
          </div>
        </div>
      </div>
      
      {/* Legendary Glow Effect */}
      {isLegendary && achievement.unlocked && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 blur-xl -z-10 animate-pulse" />
      )}
    </motion.div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  
  useEffect(() => {
    const xp = achievements
      .filter(a => a.unlocked)
      .reduce((acc, a) => acc + a.xp, 0);
    setTotalXP(xp);
    setUnlockedCount(achievements.filter(a => a.unlocked).length);
  }, []);
  
  const filteredAchievements = achievements.filter(a => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    return true;
  });
  
  const completionPercentage = (unlockedCount / achievements.length) * 100;
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Achievement System</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Your <span className="text-gradient-animated">Achievements</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore, discover, and unlock achievements as you navigate through the portfolio. 
            Can you collect them all?
          </p>
        </ScrollReveal>

        {/* Stats Overview */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
                    <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{completionPercentage.toFixed(0)}% Complete</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalXP}</p>
                    <p className="text-sm text-muted-foreground">Total XP Earned</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline">Level {Math.floor(totalXP / 100) + 1}</Badge>
                  <Badge variant="outline" className="text-yellow-500">
                    {100 - (totalXP % 100)} XP to next level
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{achievements.filter(a => a.rarity === "legendary" && a.unlocked).length}</p>
                    <p className="text-sm text-muted-foreground">Legendary Achievements</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">
                    {achievements.filter(a => a.rarity === "legendary" && !a.unlocked).length} more to discover
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(["all", "unlocked", "locked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="ml-2 text-xs opacity-70">
                  ({f === "all" ? achievements.length : 
                    f === "unlocked" ? unlockedCount : 
                    achievements.length - unlockedCount})
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Achievements Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No achievements found in this category.</p>
          </motion.div>
        )}

        {/* Tips */}
        <ScrollReveal className="mt-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">How to Earn Achievements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-muted-foreground">Explore different pages and sections of the portfolio</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-muted-foreground">Look for hidden easter eggs and secret interactions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-muted-foreground">Try keyboard shortcuts and special commands</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-muted-foreground">Visit at different times of day for special achievements</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
