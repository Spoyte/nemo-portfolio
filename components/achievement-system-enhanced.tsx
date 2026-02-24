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
  Gem,
  Rocket,
  Brain,
  Eye,
  MousePointer,
  Keyboard,
  Clock,
  Award,
  Lock,
  Unlock,
  Share2,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: "explorer" | "social" | "mastery" | "secret";
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
}

interface UserStats {
  pagesVisited: string[];
  timeSpent: number;
  clicks: number;
  scrollDepth: number;
  achievementsUnlocked: string[];
  easterEggsFound: string[];
  lastVisit: Date;
  streak: number;
  totalPoints: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Explorer Achievements
  {
    id: "first_visit",
    title: "Welcome Aboard",
    description: "Visit the portfolio for the first time",
    icon: <Rocket className="h-5 w-5" />,
    points: 10,
    unlocked: false,
    category: "explorer",
    rarity: "common",
    condition: "Visit any page",
  },
  {
    id: "explorer",
    title: "Curious Explorer",
    description: "Visit 5 different pages",
    icon: <Eye className="h-5 w-5" />,
    points: 25,
    unlocked: false,
    category: "explorer",
    rarity: "common",
    condition: "Visit 5 pages",
  },
  {
    id: "deep_diver",
    title: "Deep Diver",
    description: "Spend 5 minutes exploring",
    icon: <Clock className="h-5 w-5" />,
    points: 30,
    unlocked: false,
    category: "explorer",
    rarity: "common",
    condition: "Spend 5 minutes",
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Visit every page on the site",
    icon: <Target className="h-5 w-5" />,
    points: 100,
    unlocked: false,
    category: "explorer",
    rarity: "rare",
    condition: "Visit all pages",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit between midnight and 4 AM",
    icon: <Star className="h-5 w-5" />,
    points: 50,
    unlocked: false,
    category: "explorer",
    rarity: "rare",
    condition: "Late night visit",
  },
  
  // Social Achievements
  {
    id: "sharer",
    title: "Spread the Word",
    description: "Share the portfolio with someone",
    icon: <Share2 className="h-5 w-5" />,
    points: 40,
    unlocked: false,
    category: "social",
    rarity: "rare",
    condition: "Click share button",
  },
  {
    id: "return_visitor",
    title: "Regular",
    description: "Visit on 3 different days",
    icon: <RotateCcw className="h-5 w-5" />,
    points: 60,
    unlocked: false,
    category: "social",
    rarity: "rare",
    condition: "3 day streak",
  },
  
  // Mastery Achievements
  {
    id: "click_master",
    title: "Click Master",
    description: "Click 50 times on the site",
    icon: <MousePointer className="h-5 w-5" />,
    points: 25,
    unlocked: false,
    category: "mastery",
    rarity: "common",
    condition: "50 clicks",
  },
  {
    id: "scroll_king",
    title: "Scroll King",
    description: "Scroll through 10,000 pixels",
    icon: <Zap className="h-5 w-5" />,
    points: 35,
    unlocked: false,
    category: "mastery",
    rarity: "common",
    condition: "Scroll 10000px",
  },
  {
    id: "keyboard_warrior",
    title: "Keyboard Warrior",
    description: "Use 10 keyboard shortcuts",
    icon: <Keyboard className="h-5 w-5" />,
    points: 50,
    unlocked: false,
    category: "mastery",
    rarity: "rare",
    condition: "10 shortcuts",
  },
  {
    id: "speed_reader",
    title: "Speed Reader",
    description: "Read 3 blog posts",
    icon: <Brain className="h-5 w-5" />,
    points: 45,
    unlocked: false,
    category: "mastery",
    rarity: "rare",
    condition: "Read 3 posts",
  },
  
  // Secret Achievements
  {
    id: "konami",
    title: "Cheat Code Master",
    description: "Enter the Konami code",
    icon: <Gem className="h-5 w-5" />,
    points: 100,
    unlocked: false,
    category: "secret",
    rarity: "legendary",
    condition: "Konami code",
  },
  {
    id: "dark_mode",
    title: "Creature of the Night",
    description: "Switch to dark mode",
    icon: <Flame className="h-5 w-5" />,
    points: 20,
    unlocked: false,
    category: "secret",
    rarity: "common",
    condition: "Toggle dark mode",
  },
  {
    id: "easter_egg_hunter",
    title: "Easter Egg Hunter",
    description: "Find 3 hidden easter eggs",
    icon: <Crown className="h-5 w-5" />,
    points: 150,
    unlocked: false,
    category: "secret",
    rarity: "epic",
    condition: "Find 3 eggs",
  },
  {
    id: "all_achievements",
    title: "True Master",
    description: "Unlock all achievements",
    icon: <Award className="h-5 w-5" />,
    points: 500,
    unlocked: false,
    category: "secret",
    rarity: "legendary",
    condition: "Unlock everything",
  },
];

const RARITY_COLORS = {
  common: "bg-slate-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

const RARITY_TEXT = {
  common: "text-slate-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-amber-500",
};

export function AchievementSystemEnhanced() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [stats, setStats] = useState<UserStats>({
    pagesVisited: [],
    timeSpent: 0,
    clicks: 0,
    scrollDepth: 0,
    achievementsUnlocked: [],
    easterEggsFound: [],
    lastVisit: new Date(),
    streak: 1,
    totalPoints: 0,
  });
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "explorer" | "social" | "mastery" | "secret">("all");
  const [konamiProgress, setKonamiProgress] = useState(0);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("portfolio-stats");
    const savedAchievements = localStorage.getItem("portfolio-achievements");
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        lastVisit: new Date(parsed.lastVisit),
      });
    }
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      // Mark first visit achievement
      unlockAchievement("first_visit");
    }
  }, []);

  // Save stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("portfolio-stats", JSON.stringify(stats));
      localStorage.setItem("portfolio-achievements", JSON.stringify(achievements));
    }, 5000);
    return () => clearInterval(interval);
  }, [stats, achievements]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newTime = prev.timeSpent + 1;
        if (newTime === 300 && !prev.achievementsUnlocked.includes("deep_diver")) {
          unlockAchievement("deep_diver");
        }
        return { ...prev, timeSpent: newTime };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track clicks
  useEffect(() => {
    const handleClick = () => {
      setStats(prev => {
        const newClicks = prev.clicks + 1;
        if (newClicks === 50 && !prev.achievementsUnlocked.includes("click_master")) {
          unlockAchievement("click_master");
        }
        return { ...prev, clicks: newClicks };
      });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Track scroll
  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > maxScroll) {
        maxScroll = scrollY;
        setStats(prev => {
          if (maxScroll >= 10000 && !prev.achievementsUnlocked.includes("scroll_king")) {
            unlockAchievement("scroll_king");
          }
          return { ...prev, scrollDepth: maxScroll };
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Konami code listener
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let currentIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[currentIndex]) {
        currentIndex++;
        setKonamiProgress(currentIndex);
        if (currentIndex === konamiCode.length) {
          unlockAchievement("konami");
          currentIndex = 0;
          setKonamiProgress(0);
        }
      } else {
        currentIndex = 0;
        setKonamiProgress(0);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check night owl
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) {
      unlockAchievement("night_owl");
    }
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;
      
      const updated = prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: new Date() }
          : a
      );
      
      setShowUnlockAnimation(achievement);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ea580c", "#f59e0b", "#10b981", "#3b82f6"],
      });
      
      setStats(s => ({
        ...s,
        achievementsUnlocked: [...s.achievementsUnlocked, id],
        totalPoints: s.totalPoints + achievement.points,
      }));
      
      // Check for "all achievements" unlock
      const newlyUnlocked = updated.filter(a => a.unlocked).length;
      if (newlyUnlocked === updated.length - 1) {
        setTimeout(() => unlockAchievement("all_achievements"), 1000);
      }
      
      return updated;
    });
  }, []);

  const filteredAchievements = achievements.filter(a => 
    activeTab === "all" ? true : a.category === activeTab
  );

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{unlockedCount}/{achievements.length}</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{Math.floor(stats.timeSpent / 60)}m</p>
            <p className="text-xs text-muted-foreground">Time Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
          </div>
          <Progress value={(unlockedCount / achievements.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Konami Progress (hidden hint) */}
      {konamiProgress > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground"
        >
          {konamiProgress}/10...
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "explorer", "social", "mastery", "secret"] as const).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
            <Card className={`overflow-hidden transition-all duration-300 ${
              achievement.unlocked 
                ? "border-primary/50 bg-primary/5" 
                : "opacity-60 grayscale"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.unlocked 
                      ? RARITY_COLORS[achievement.rarity] 
                      : "bg-muted"
                  } text-white`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${RARITY_TEXT[achievement.rarity]}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.unlocked ? achievement.description : "???"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {achievement.points} points
                      </span>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <span className="text-xs text-primary">
                          <Unlock className="h-3 w-3 inline mr-1" />
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-card border-2 border-primary rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className={`inline-flex p-4 rounded-2xl ${RARITY_COLORS[showUnlockAnimation.rarity]} text-white mb-4`}
              >
                {showUnlockAnimation.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
              <p className="text-lg font-semibold text-primary mb-1">
                {showUnlockAnimation.title}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {showUnlockAnimation.description}
              </p>
              <Badge className="text-lg px-4 py-1">
                +{showUnlockAnimation.points} XP
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
