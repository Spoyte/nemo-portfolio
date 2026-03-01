"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Flame, 
  Clock, 
  Code2,
  Sparkles,
  Lock,
  CheckCircle2,
  Gift,
  Rocket,
  Heart,
  Brain,
  Eye,
  Terminal,
  Gamepad2,
  Music,
  Palette,
  MessageSquare,
  Mail,
  Share2,
  Bookmark,
  Moon,
  Sun,
  Keyboard,
  MousePointer,
  ScrollText,
  Scan,
  Binary,
  Fingerprint,
  Key,
  Compass,
  Lightbulb,
  Crown,
  Medal,
  Award,
  Gem
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: "explorer" | "interactor" | "collector" | "master" | "secret";
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  condition: string;
  hidden?: boolean;
}

const rarityColors = {
  common: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30", glow: "" },
  rare: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
  epic: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
  legendary: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/30" },
};

const categoryIcons = {
  explorer: Compass,
  interactor: HandIcon,
  collector: Gem,
  master: Crown,
  secret: Eye,
};

function HandIcon({ className }: { className?: string }) {
  return <MousePointer className={className} />;
}

const initialAchievements: Achievement[] = [
  // Explorer Achievements
  {
    id: "first_visit",
    title: "First Steps",
    description: "Visit the portfolio for the first time",
    icon: FootprintsIcon,
    category: "explorer",
    rarity: "common",
    points: 10,
    unlocked: true,
    unlockedAt: new Date(),
    condition: "Visit the site",
  },
  {
    id: "page_explorer",
    title: "Page Explorer",
    description: "Visit 5 different pages",
    icon: Compass,
    category: "explorer",
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    condition: "Visit 5 pages",
  },
  {
    id: "deep_diver",
    title: "Deep Diver",
    description: "Visit 10 different pages",
    icon: Scan,
    category: "explorer",
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    condition: "Visit 10 pages",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit the site between 12am and 5am",
    icon: Moon,
    category: "explorer",
    rarity: "rare",
    points: 30,
    unlocked: false,
    condition: "Visit at midnight",
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Visit the site before 7am",
    icon: Sun,
    category: "explorer",
    rarity: "rare",
    points: 30,
    unlocked: false,
    condition: "Visit before 7am",
  },

  // Interactor Achievements
  {
    id: "theme_switcher",
    title: "Theme Switcher",
    description: "Toggle between light and dark mode",
    icon: Palette,
    category: "interactor",
    rarity: "common",
    points: 15,
    unlocked: false,
    condition: "Switch themes",
  },
  {
    id: "command_master",
    title: "Command Master",
    description: "Use the command palette 5 times",
    icon: Terminal,
    category: "interactor",
    rarity: "rare",
    points: 40,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    condition: "Use command palette",
  },
  {
    id: "konami_code",
    title: "Konami Code",
    description: "Enter the legendary Konami code",
    icon: Gamepad2,
    category: "interactor",
    rarity: "epic",
    points: 100,
    unlocked: false,
    hidden: true,
    condition: "↑↑↓↓←→←→BA",
  },
  {
    id: "speed_reader",
    title: "Speed Reader",
    description: "Scroll through an entire page in under 3 seconds",
    icon: ScrollText,
    category: "interactor",
    rarity: "rare",
    points: 35,
    unlocked: false,
    condition: "Fast scroll",
  },
  {
    id: "keyboard_warrior",
    title: "Keyboard Warrior",
    description: "Navigate using only keyboard shortcuts",
    icon: Keyboard,
    category: "interactor",
    rarity: "epic",
    points: 75,
    unlocked: false,
    condition: "Keyboard nav",
  },

  // Collector Achievements
  {
    id: "project_viewer",
    title: "Project Viewer",
    description: "View 3 project details",
    icon: Target,
    category: "collector",
    rarity: "common",
    points: 20,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    condition: "View projects",
  },
  {
    id: "blog_reader",
    title: "Blog Reader",
    description: "Read 3 blog posts",
    icon: BookOpenIcon,
    category: "collector",
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    condition: "Read blogs",
  },
  {
    id: "skill_master",
    title: "Skill Master",
    description: "View all skills on the skills page",
    icon: Brain,
    category: "collector",
    rarity: "rare",
    points: 45,
    unlocked: false,
    condition: "View skills",
  },
  {
    id: "timeline_traveler",
    title: "Timeline Traveler",
    description: "View the entire journey timeline",
    icon: Clock,
    category: "collector",
    rarity: "rare",
    points: 40,
    unlocked: false,
    condition: "View timeline",
  },

  // Master Achievements
  {
    id: "return_visitor",
    title: "Return Visitor",
    description: "Visit the site on 3 different days",
    icon: Flame,
    category: "master",
    rarity: "rare",
    points: 50,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    condition: "3 day streak",
  },
  {
    id: "dedicated_fan",
    title: "Dedicated Fan",
    description: "Spend 10 minutes on the site",
    icon: Heart,
    category: "master",
    rarity: "epic",
    points: 80,
    unlocked: false,
    progress: 0,
    maxProgress: 600,
    condition: "10 min visit",
  },
  {
    id: "completionist",
    title: "The Completionist",
    description: "Unlock 50% of all achievements",
    icon: Trophy,
    category: "master",
    rarity: "legendary",
    points: 200,
    unlocked: false,
    condition: "50% achievements",
  },
  {
    id: "grand_master",
    title: "Grand Master",
    description: "Unlock all achievements",
    icon: Crown,
    category: "master",
    rarity: "legendary",
    points: 500,
    unlocked: false,
    condition: "All achievements",
  },

  // Secret Achievements
  {
    id: "secret_terminal",
    title: "Hacker",
    description: "Find and use the secret terminal",
    icon: Terminal,
    category: "secret",
    rarity: "epic",
    points: 150,
    unlocked: false,
    hidden: true,
    condition: "Find terminal",
  },
  {
    id: "secret_konami",
    title: "Code Breaker",
    description: "You know the secrets",
    icon: Key,
    category: "secret",
    rarity: "legendary",
    points: 250,
    unlocked: false,
    hidden: true,
    condition: "Secret code",
  },
  {
    id: "secret_easter_egg",
    title: "Easter Egg Hunter",
    description: "Find a hidden easter egg",
    icon: Gift,
    category: "secret",
    rarity: "epic",
    points: 125,
    unlocked: false,
    hidden: true,
    condition: "Find easter egg",
  },
];

function FootprintsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.5 2-1 3" />
      <path d="M8 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C2.63 2 1 3.8 1 8c0 1.25.5 2 1 3" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 13 7.8 13 12c0 1.25.5 2 1 3" />
      <path d="M16 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C10.63 6 9 7.8 9 12c0 1.25.5 2 1 3" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function GamifiedAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [selectedCategory, setSelectedCategory] = useState<Achievement["category"] | "all">("all");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [visitTime, setVisitTime] = useState(0);

  // Calculate stats
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Track visit time
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitTime(prev => {
        const newTime = prev + 1;
        // Check for dedicated fan achievement
        if (newTime === 600) {
          unlockAchievement("dedicated_fan");
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total points
  useEffect(() => {
    const points = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(points);
  }, [achievements]);

  // Check completionist achievement
  useEffect(() => {
    if (completionPercentage >= 50 && !achievements.find(a => a.id === "completionist")?.unlocked) {
      unlockAchievement("completionist");
    }
  }, [completionPercentage, achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      // Show unlock animation
      setShowUnlockAnimation(achievement);
      setTimeout(() => setShowUnlockAnimation(null), 4000);

      // Trigger confetti for rare+ achievements
      if (["rare", "epic", "legendary"].includes(achievement.rarity)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: achievement.rarity === "legendary" 
            ? ["#fbbf24", "#f59e0b", "#d97706"] 
            : achievement.rarity === "epic"
            ? ["#a855f7", "#9333ea", "#7c3aed"]
            : ["#3b82f6", "#2563eb", "#1d4ed8"],
        });
      }

      return prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: new Date() }
          : a
      );
    });
  }, []);

  const updateProgress = useCallback((id: string, increment: number = 1) => {
    setAchievements(prev => prev.map(a => {
      if (a.id !== id || a.unlocked || !a.maxProgress) return a;
      
      const newProgress = (a.progress || 0) + increment;
      if (newProgress >= a.maxProgress) {
        // Auto-unlock when max progress reached
        setTimeout(() => unlockAchievement(id), 100);
      }
      
      return { ...a, progress: newProgress };
    }));
  }, [unlockAchievement]);

  // Listen for achievement events
  useEffect(() => {
    const handleAchievement = (e: CustomEvent) => {
      const { id, progress } = e.detail;
      if (progress) {
        updateProgress(id, progress);
      } else {
        unlockAchievement(id);
      }
    };

    window.addEventListener("unlock-achievement" as any, handleAchievement);
    return () => window.removeEventListener("unlock-achievement" as any, handleAchievement);
  }, [unlockAchievement, updateProgress]);

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const categories: { id: Achievement["category"] | "all"; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All", icon: Trophy },
    { id: "explorer", label: "Explorer", icon: Compass },
    { id: "interactor", label: "Interactor", icon: MousePointer },
    { id: "collector", label: "Collector", icon: Gem },
    { id: "master", label: "Master", icon: Crown },
    { id: "secret", label: "Secret", icon: Eye },
  ];

  return (
    <>
      {/* Unlock Animation Overlay */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-card border-2 border-primary p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="inline-flex p-4 rounded-2xl bg-primary/20 mb-4"
              >
                <Trophy className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
              <p className="text-xl font-semibold text-primary mb-1">{showUnlockAnimation.title}</p>
              <p className="text-muted-foreground mb-4">{showUnlockAnimation.description}</p>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-bold">+{showUnlockAnimation.points} XP</span>
              </div>
              <Badge 
                variant="outline" 
                className={`mt-4 capitalize ${rarityColors[showUnlockAnimation.rarity].text}`}
              >
                {showUnlockAnimation.rarity}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Header Stats */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Points */}
              <div className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-2">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>

              {/* Achievements Unlocked */}
              <div className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-green-500/10 mb-2">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{unlockedCount}/{totalCount}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>

              {/* Completion */}
              <div className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-purple-500/10 mb-2">
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{completionPercentage}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>

              {/* Visit Time */}
              <div className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-orange-500/10 mb-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{Math.floor(visitTime / 60)}m</p>
                <p className="text-sm text-muted-foreground">Time on Site</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to Grand Master</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === "all" 
              ? achievements.filter(a => a.unlocked).length
              : achievements.filter(a => a.category === cat.id && a.unlocked).length;
            const total = cat.id === "all" 
              ? achievements.length
              : achievements.filter(a => a.category === cat.id).length;
            
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className="text-xs opacity-60">({count}/{total})</span>
              </Button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const colors = rarityColors[achievement.rarity];
            const isHidden = achievement.hidden && !achievement.unlocked;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${achievement.unlocked 
                    ? `${colors.bg} ${colors.border} ${colors.glow} shadow-lg` 
                    : "bg-muted/50 border-muted opacity-60"
                  }
                `}
              >
                {/* Locked Overlay */}
                {!achievement.unlocked && isHidden && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    p-3 rounded-xl shrink-0
                    ${achievement.unlocked 
                      ? `bg-gradient-to-br ${colors.bg.replace("/20", "")} text-white` 
                      : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {isHidden ? (
                      <Lock className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">
                        {isHidden ? "???" : achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {isHidden ? "Hidden Achievement" : achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.unlocked && achievement.maxProgress && !isHidden && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{achievement.condition}</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs capitalize ${achievement.unlocked ? colors.text : ""}`}
                      >
                        {achievement.rarity}
                      </Badge>
                      <span className="text-sm font-medium">
                        {achievement.points} XP
                      </span>
                    </div>

                    {/* Unlock Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Helper to trigger achievements from other components
export function triggerAchievement(id: string, progress?: number) {
  window.dispatchEvent(new CustomEvent("unlock-achievement", { 
    detail: { id, progress } 
  }));
}
