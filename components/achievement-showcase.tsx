"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Flame,
  Crown,
  Medal,
  Award,
  Gem,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  Share2,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  category: "explorer" | "social" | "mastery" | "special";
}

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 via-orange-500 to-red-500",
};

const RARITY_BG = {
  common: "bg-gray-500/10 border-gray-500/20",
  rare: "bg-blue-500/10 border-blue-500/20",
  epic: "bg-purple-500/10 border-purple-500/20",
  legendary: "bg-yellow-500/10 border-yellow-500/20",
};

const ACHIEVEMENTS: Achievement[] = [
  // Explorer Achievements
  {
    id: "first_visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: Star,
    rarity: "common",
    points: 10,
    unlocked: true,
    unlockedAt: new Date(),
    progress: 1,
    maxProgress: 1,
    category: "explorer",
  },
  {
    id: "page_explorer",
    title: "Page Explorer",
    description: "Visit 5 different pages",
    icon: Zap,
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: "explorer",
  },
  {
    id: "deep_diver",
    title: "Deep Diver",
    description: "Spend 10 minutes exploring",
    icon: Target,
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    category: "explorer",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit between 12am and 5am",
    icon: Flame,
    rarity: "rare",
    points: 75,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "explorer",
  },
  {
    id: "world_traveler",
    title: "World Traveler",
    description: "Visit from 3 different countries",
    icon: Crown,
    rarity: "epic",
    points: 150,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: "explorer",
  },

  // Social Achievements
  {
    id: "sharer",
    title: "Social Butterfly",
    description: "Share the portfolio on social media",
    icon: Share2,
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "social",
  },
  {
    id: "connector",
    title: "Connector",
    description: "Click on 3 social links",
    icon: Medal,
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: "social",
  },
  {
    id: "referrer",
    title: "Referrer",
    description: "Refer 5 friends to the site",
    icon: Award,
    rarity: "epic",
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: "social",
  },

  // Mastery Achievements
  {
    id: "terminal_master",
    title: "Terminal Master",
    description: "Use 10 different terminal commands",
    icon: Zap,
    rarity: "rare",
    points: 75,
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    category: "mastery",
  },
  {
    id: "easter_hunter",
    title: "Easter Egg Hunter",
    description: "Find 5 easter eggs",
    icon: Gem,
    rarity: "epic",
    points: 150,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: "mastery",
  },
  {
    id: "konami_code",
    title: "Konami Code",
    description: "Enter the Konami code",
    icon: Trophy,
    rarity: "legendary",
    points: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "mastery",
  },
  {
    id: "speed_reader",
    title: "Speed Reader",
    description: "Read 3 blog posts",
    icon: Target,
    rarity: "common",
    points: 30,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: "mastery",
  },

  // Special Achievements
  {
    id: "coffee_lover",
    title: "Coffee Lover",
    description: "Check the coffee counter 5 times",
    icon: Flame,
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    category: "special",
  },
  {
    id: "music_enthusiast",
    title: "Music Enthusiast",
    description: "Check what's playing 3 times",
    icon: Sparkles,
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    category: "special",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Unlock all other achievements",
    icon: Crown,
    rarity: "legendary",
    points: 500,
    unlocked: false,
    progress: 3,
    maxProgress: 14,
    category: "special",
  },
];

function AchievementCard({ achievement, onClick }: { achievement: Achievement; onClick?: () => void }) {
  const Icon = achievement.icon;
  const isLocked = !achievement.unlocked;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isLocked 
          ? "border-muted bg-muted/30 opacity-60" 
          : `${RARITY_BG[achievement.rarity]} cursor-pointer`
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${
          isLocked 
            ? "bg-muted" 
            : `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]}`
        }`}>
          {isLocked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Icon className="h-6 w-6 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isLocked ? "text-muted-foreground" : ""}`}>
              {achievement.title}
            </h3>
            {!isLocked && (
              <Badge variant="secondary" className="text-xs">
                +{achievement.points} XP
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
          
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <Progress 
              value={(achievement.progress / achievement.maxProgress) * 100} 
              className="h-1.5"
            />
          </div>
          
          {achievement.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="absolute top-2 right-2">
        <Badge 
          variant="outline" 
          className={`text-xs capitalize ${
            achievement.rarity === "legendary" && "border-yellow-500 text-yellow-600"
          }`}
        >
          {achievement.rarity}
        </Badge>
      </div>
    </motion.div>
  );
}

function StatsOverview({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  const completionRate = (unlockedCount / achievements.length) * 100;
  
  // Calculate level based on points
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = level * 100;
  const currentLevelProgress = totalPoints % 100;
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(completionRate)}%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">Lv. {level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Level {level} Progress</span>
            <span>{currentLevelProgress}/{nextLevelPoints} XP</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentLevelProgress / 100) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementShowcase() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter((a) => a.category === selectedCategory);

  const categories = [
    { id: "all", label: "All", count: achievements.length },
    { id: "explorer", label: "Explorer", count: achievements.filter((a) => a.category === "explorer").length },
    { id: "social", label: "Social", count: achievements.filter((a) => a.category === "social").length },
    { id: "mastery", label: "Mastery", count: achievements.filter((a) => a.category === "mastery").length },
    { id: "special", label: "Special", count: achievements.filter((a) => a.category === "special").length },
  ];

  const simulateUnlock = () => {
    const locked = achievements.filter((a) => !a.unlocked);
    if (locked.length === 0) {
      toast.info("All achievements unlocked! You're a legend! 🎉");
      return;
    }
    
    const random = locked[Math.floor(Math.random() * locked.length)];
    setLastUnlocked(random);
    setShowUnlockAnimation(true);
    
    setTimeout(() => {
      setAchievements((prev) =>
        prev.map((a) =
          a.id === random.id 
            ? { ...a, unlocked: true, unlockedAt: new Date(), progress: a.maxProgress }
            : a
        )
      );
      toast.success(`Achievement Unlocked: ${random.title}! +${random.points} XP`);
    }, 1500);
    
    setTimeout(() => setShowUnlockAnimation(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Unlock Animation Overlay */}
      <AnimatePresence>
        {showUnlockAnimation && lastUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${RARITY_COLORS[lastUnlocked.rarity]} flex items-center justify-center shadow-2xl`}
              >
                <lastUnlocked.icon className="h-16 w-16 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Achievement Unlocked!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-white/90 mb-4"
              >
                {lastUnlocked.title}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500 text-black font-bold"
              >
                <Trophy className="h-5 w-5" />
                +{lastUnlocked.points} XP
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <StatsOverview achievements={achievements} />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
            <Badge variant="secondary" className="ml-2">{cat.count}</Badge>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              onClick={() => {
                if (achievement.unlocked) {
                  toast.info(`${achievement.title}: ${achievement.description}`);
                }
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Debug/Simulation Controls */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Developer Tools</h3>
              <p className="text-sm text-muted-foreground">Simulate achievement unlocks for testing</p>
            </div>
            <Button onClick={simulateUnlock} variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Simulate Unlock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
