"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Flame, 
  Crown, 
  Gem,
  Rocket,
  Heart,
  Eye,
  MousePointer,
  Keyboard,
  Gamepad2,
  Share2,
  Lock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "explorer" | "social" | "mastery" | "special";
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  xpReward: number;
}

const initialAchievements: Achievement[] = [
  // Explorer Achievements
  {
    id: "first_visit",
    name: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: <Footprints className="w-5 h-5" />,
    category: "explorer",
    unlocked: true,
    unlockedAt: new Date(),
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    xpReward: 10,
  },
  {
    id: "explorer",
    name: "Curious Explorer",
    description: "Visit 5 different pages",
    icon: <Eye className="w-5 h-5" />,
    category: "explorer",
    unlocked: false,
    progress: 1,
    maxProgress: 5,
    rarity: "common",
    xpReward: 25,
  },
  {
    id: "deep_diver",
    name: "Deep Diver",
    description: "Spend 5 minutes on the site",
    icon: <Target className="w-5 h-5" />,
    category: "explorer",
    unlocked: false,
    progress: 0,
    maxProgress: 300,
    rarity: "rare",
    xpReward: 50,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Visit between midnight and 5 AM",
    icon: <Moon className="w-5 h-5" />,
    category: "explorer",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "rare",
    xpReward: 30,
  },
  
  // Social Achievements
  {
    id: "sharer",
    name: "Social Butterfly",
    description: "Share the portfolio with a friend",
    icon: <Share2 className="w-5 h-5" />,
    category: "social",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "common",
    xpReward: 20,
  },
  {
    id: "connector",
    name: "Connector",
    description: "Click on 10 external links",
    icon: <MousePointer className="w-5 h-5" />,
    category: "social",
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rarity: "rare",
    xpReward: 40,
  },
  
  // Mastery Achievements
  {
    id: "code_master",
    name: "Code Master",
    description: "Try 3 code demos in the playground",
    icon: <Zap className="w-5 h-5" />,
    category: "mastery",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    rarity: "rare",
    xpReward: 60,
  },
  {
    id: "skill_seeker",
    name: "Skill Seeker",
    description: "Explore all skills in the 3D visualization",
    icon: <Star className="w-5 h-5" />,
    category: "mastery",
    unlocked: false,
    progress: 0,
    maxProgress: 15,
    rarity: "epic",
    xpReward: 100,
  },
  {
    id: "easter_egg_hunter",
    name: "Easter Egg Hunter",
    description: "Find 3 hidden easter eggs",
    icon: <Gamepad2 className="w-5 h-5" />,
    category: "mastery",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    rarity: "epic",
    xpReward: 150,
  },
  
  // Special Achievements
  {
    id: "konami",
    name: "Konami Code Master",
    description: "Enter the Konami code (↑↑↓↓←→←→BA)",
    icon: <Keyboard className="w-5 h-5" />,
    category: "special",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "legendary",
    xpReward: 200,
  },
  {
    id: "speed_runner",
    name: "Speed Runner",
    description: "Visit all pages in under 2 minutes",
    icon: <Rocket className="w-5 h-5" />,
    category: "special",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "legendary",
    xpReward: 300,
  },
  {
    id: "completionist",
    name: "True Completionist",
    description: "Unlock all achievements",
    icon: <Crown className="w-5 h-5" />,
    category: "special",
    unlocked: false,
    progress: 0,
    maxProgress: 11,
    rarity: "legendary",
    xpReward: 500,
  },
];

// Missing icon components
function Footprints({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.97 2.33-1 4-.03 1.83 1 2.5 1 4.5" />
      <path d="M8 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C2.63 2 1 3.8 1 8c0 1.25.97 2.33 1 4 .03 1.83-1 2.5-1 4.5" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

const rarityColors = {
  common: "bg-slate-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
};

const rarityTextColors = {
  common: "text-slate-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-yellow-500",
};

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<Achievement | null>(null);
  const [totalXP, setTotalXP] = useState(10);
  const [level, setLevel] = useState(1);

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.floor(totalXP / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`Level Up! You are now level ${newLevel}`);
    }
  }, [totalXP, level]);

  // Track time on site
  useEffect(() => {
    const interval = setInterval(() => {
      setAchievements(prev => prev.map(a => {
        if (a.id === "deep_diver" && !a.unlocked) {
          const newProgress = Math.min(a.progress + 1, a.maxProgress);
          if (newProgress === a.maxProgress) {
            unlockAchievement(a);
          }
          return { ...a, progress: newProgress };
        }
        return a;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      unlockAchievementById("night_owl");
    }
  }, []);

  const unlockAchievement = (achievement: Achievement) => {
    setShowUnlockAnimation(achievement);
    setTotalXP(prev => prev + achievement.xpReward);
    toast.success(`Achievement Unlocked: ${achievement.name}!`, {
      icon: achievement.icon,
    });
    
    setTimeout(() => setShowUnlockAnimation(null), 3000);
  };

  const unlockAchievementById = useCallback((id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        unlockAchievement(a);
        return { ...a, unlocked: true, unlockedAt: new Date(), progress: a.maxProgress };
      }
      return a;
    }));
  }, []);

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

  const categories = [
    { id: "all", name: "All", icon: <Trophy className="w-4 h-4" /> },
    { id: "explorer", name: "Explorer", icon: <Eye className="w-4 h-4" /> },
    { id: "social", name: "Social", icon: <Share2 className="w-4 h-4" /> },
    { id: "mastery", name: "Mastery", icon: <Star className="w-4 h-4" /> },
    { id: "special", name: "Special", icon: <Gem className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-background/95 backdrop-blur-xl border-2 border-primary p-8 rounded-3xl shadow-2xl text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white"
              >
                {showUnlockAnimation.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
              <p className="text-xl font-semibold text-primary">{showUnlockAnimation.name}</p>
              <p className="text-muted-foreground">{showUnlockAnimation.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600">
                <Sparkles className="w-4 h-4" />
                <span>+{showUnlockAnimation.xpReward} XP</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Level Badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">{level}</div>
                  <div className="text-xs">Level</div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Progress */}
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total XP: {totalXP}</span>
                <span className="text-muted-foreground">{totalXP % 100}/100 to next level</span>
              </div>
              <Progress value={totalXP % 100} className="h-3" />
              
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{unlockedCount}</div>
                  <div className="text-xs text-muted-foreground">Unlocked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="gap-2"
          >
            {cat.icon}
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`overflow-hidden transition-all ${
              achievement.unlocked ? 'border-primary/50' : 'opacity-70'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.unlocked 
                      ? rarityColors[achievement.rarity]
                      : 'bg-muted'
                  } text-white`}
                  >
                    {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${
                        achievement.unlocked ? '' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${rarityTextColors[achievement.rarity]}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>

                    {/* Progress */}
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span>
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </span>
                        <span className="ml-auto text-yellow-600">+{achievement.xpReward} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
