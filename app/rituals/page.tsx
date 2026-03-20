"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Code2, 
  Coffee, 
  Moon, 
  Sun, 
  Music, 
  Brain,
  Zap,
  Flame,
  Wind,
  Droplets,
  Leaf,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Timer,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";

interface Ritual {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  duration: number;
  category: "morning" | "focus" | "break" | "evening";
  color: string;
  benefits: string[];
  xp: number;
}

const rituals: Ritual[] = [
  {
    id: "morning-coffee",
    name: "Morning Coffee & Code",
    description: "Start your day with a warm beverage and review your goals",
    icon: Coffee,
    duration: 15,
    category: "morning",
    color: "from-amber-500 to-orange-500",
    benefits: ["Sets daily intentions", "Warms up your mind", "Creates routine"],
    xp: 50
  },
  {
    id: "deep-focus",
    name: "Deep Focus Session",
    description: "90-minute uninterrupted coding with music or silence",
    icon: Brain,
    duration: 90,
    category: "focus",
    color: "from-purple-500 to-indigo-500",
    benefits: ["Achieves flow state", "Maximizes productivity", "Deep work"],
    xp: 200
  },
  {
    id: "pomodoro",
    name: "Pomodoro Sprint",
    description: "25 minutes work, 5 minutes break - repeat 4 times",
    icon: Timer,
    duration: 25,
    category: "focus",
    color: "from-red-500 to-rose-500",
    benefits: ["Maintains energy", "Prevents burnout", "Trackable progress"],
    xp: 75
  },
  {
    id: "nature-break",
    name: "Nature Reset",
    description: "Step outside, breathe fresh air, look at something green",
    icon: Leaf,
    duration: 10,
    category: "break",
    color: "from-green-500 to-emerald-500",
    benefits: ["Reduces eye strain", "Clears mind", "Boosts creativity"],
    xp: 40
  },
  {
    id: "code-review",
    name: "Mindful Code Review",
    description: "Review yesterday's code with fresh eyes before new work",
    icon: Code2,
    duration: 20,
    category: "morning",
    color: "from-blue-500 to-cyan-500",
    benefits: ["Catches bugs early", "Improves quality", "Knowledge sharing"],
    xp: 60
  },
  {
    id: "meditation",
    name: "Code Meditation",
    description: "Close eyes, breathe, visualize your architecture",
    icon: Wind,
    duration: 10,
    category: "break",
    color: "from-teal-500 to-cyan-500",
    benefits: ["Reduces stress", "Improves focus", "Mental clarity"],
    xp: 45
  },
  {
    id: "evening-wind-down",
    name: "Evening Wind Down",
    description: "Document progress, plan tomorrow, disconnect gradually",
    icon: Moon,
    duration: 15,
    category: "evening",
    color: "from-indigo-500 to-purple-500",
    benefits: ["Better sleep", "Clear mind", "Ready for tomorrow"],
    xp: 55
  },
  {
    id: "energy-boost",
    name: "Energy Boost",
    description: "Quick stretch, water, and a power pose",
    icon: Zap,
    duration: 5,
    category: "break",
    color: "from-yellow-500 to-amber-500",
    benefits: ["Increases alertness", "Physical health", "Mood boost"],
    xp: 30
  }
];

const categories = [
  { id: "all", name: "All Rituals", icon: Sparkles },
  { id: "morning", name: "Morning", icon: Sun },
  { id: "focus", name: "Focus", icon: Brain },
  { id: "break", name: "Breaks", icon: Coffee },
  { id: "evening", name: "Evening", icon: Moon }
];

const achievements = [
  { id: "first-ritual", name: "First Step", description: "Complete your first ritual", icon: Star, requirement: 1 },
  { id: "ritual-master", name: "Ritual Master", description: "Complete 10 rituals", icon: Award, requirement: 10 },
  { id: "focus-champion", name: "Focus Champion", description: "Complete 5 deep focus sessions", icon: Target, requirement: 5 },
  { id: "streak-keeper", name: "Streak Keeper", description: "Maintain a 7-day streak", icon: Flame, requirement: 7 }
];

export default function DeveloperRitualsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedRituals, setCompletedRituals] = useState<string[]>([]);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState(3);
  const [todayCompleted, setTodayCompleted] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("completedRituals");
    const savedTime = localStorage.getItem("totalFocusTime");
    const savedStreak = localStorage.getItem("ritualStreak");
    const savedXP = localStorage.getItem("totalXP");
    const savedLevel = localStorage.getItem("ritualLevel");
    const savedAchievements = localStorage.getItem("unlockedAchievements");
    const savedToday = localStorage.getItem("todayCompleted");
    const savedDate = localStorage.getItem("lastRitualDate");
    
    const today = new Date().toDateString();
    
    if (saved) setCompletedRituals(JSON.parse(saved));
    if (savedTime) setTotalFocusTime(parseInt(savedTime));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedXP) setTotalXP(parseInt(savedXP));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));
    
    if (savedDate === today && savedToday) {
      setTodayCompleted(parseInt(savedToday));
    } else {
      setTodayCompleted(0);
      localStorage.setItem("lastRitualDate", today);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      completeRitual();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const checkAchievements = (newCompleted: string[], newStreak: number) => {
    const newlyUnlocked: string[] = [];
    
    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;
      
      let unlocked = false;
      switch (achievement.id) {
        case "first-ritual":
          unlocked = newCompleted.length >= 1;
          break;
        case "ritual-master":
          unlocked = newCompleted.length >= 10;
          break;
        case "focus-champion":
          unlocked = newCompleted.filter(id => id === "deep-focus").length >= 5;
          break;
        case "streak-keeper":
          unlocked = newStreak >= 7;
          break;
      }
      
      if (unlocked) {
        newlyUnlocked.push(achievement.id);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#f59e0b", "#d97706"]
        });
      }
    });
    
    if (newlyUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newlyUnlocked];
      setUnlockedAchievements(updated);
      localStorage.setItem("unlockedAchievements", JSON.stringify(updated));
    }
  };

  const startRitual = (ritual: Ritual) => {
    setActiveRitual(ritual);
    setTimeRemaining(ritual.duration * 60);
    setIsRunning(true);
  };

  const completeRitual = () => {
    if (activeRitual) {
      const newCompleted = [...completedRituals, activeRitual.id];
      setCompletedRituals(newCompleted);
      localStorage.setItem("completedRituals", JSON.stringify(newCompleted));
      
      const newTotalTime = totalFocusTime + activeRitual.duration;
      setTotalFocusTime(newTotalTime);
      localStorage.setItem("totalFocusTime", newTotalTime.toString());
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("ritualStreak", newStreak.toString());
      
      const newXP = totalXP + activeRitual.xp;
      setTotalXP(newXP);
      localStorage.setItem("totalXP", newXP.toString());
      
      const newLevel = Math.floor(newXP / 500) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        localStorage.setItem("ritualLevel", newLevel.toString());
      }
      
      const newToday = todayCompleted + 1;
      setTodayCompleted(newToday);
      localStorage.setItem("todayCompleted", newToday.toString());
      localStorage.setItem("lastRitualDate", new Date().toDateString());
      
      checkAchievements(newCompleted, newStreak);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ea580c", "#f59e0b", "#10b981", "#3b82f6"]
      });
    }
    setIsRunning(false);
    setActiveRitual(null);
  };

  const resetRitual = () => {
    setIsRunning(false);
    setActiveRitual(null);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredRituals = activeCategory === "all" 
    ? rituals 
    : rituals.filter(r => r.category === activeCategory);

  const progress = activeRitual 
    ? ((activeRitual.duration * 60 - timeRemaining) / (activeRitual.duration * 60)) * 100 
    : 0;

  const xpProgress = (totalXP % 500) / 500 * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Developer Wellness</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Developer <span className="text-gradient-animated">Rituals</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Transform your coding practice with intentional rituals. 
              Build habits that enhance focus, creativity, and well-being.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="p-6 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{completedRituals.length}</p>
              <p className="text-xs text-muted-foreground">Rituals Done</p>
            </Card>
            <Card className="p-6 text-center">
              <Timer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-3xl font-bold">{totalFocusTime}</p>
              <p className="text-xs text-muted-foreground">Minutes Focused</p>
            </Card>
            <Card className="p-6 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </Card>
            <Card className="p-6 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-3xl font-bold">{totalXP}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </Card>
          </motion.div>

          {/* Level & Daily Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{level}</span>
                  </div>
                  <div>
                    <p className="font-semibold">Level {level}</p>
                    <p className="text-xs text-muted-foreground">Ritual Master</p>
                  </div>
                </div>
                <Badge variant="secondary">{totalXP} / {level * 500} XP</Badge>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Daily Goal</p>
                    <p className="text-xs text-muted-foreground">{todayCompleted} / {dailyGoal} rituals</p>
                  </div>
                </div>
                <Badge variant={todayCompleted >= dailyGoal ? "default" : "secondary"}>
                  {todayCompleted >= dailyGoal ? "Completed!" : "In Progress"}
                </Badge>
              </div>
              <Progress value={(todayCompleted / dailyGoal) * 100} className="h-2" />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Active Ritual Timer */}
      <AnimatePresence>
        {activeRitual && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-0 right-0 z-40 px-4"
          >
            <Card className="max-w-md mx-auto p-6 border-primary/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${activeRitual.color}`}>
                    <activeRitual.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{activeRitual.name}</p>
                    <p className="text-xs text-muted-foreground">+{activeRitual.xp} XP on completion</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetRitual}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center py-4">
                <p className="text-5xl font-mono font-bold text-gradient">
                  {formatTime(timeRemaining)}
                </p>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? "Pause" : "Resume"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={completeRitual}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="rituals" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="rituals" className="flex-1">Rituals</TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1">Achievements</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="rituals">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className="gap-2"
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </Button>
                ))}
              </div>

              {/* Rituals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRituals.map((ritual, index) => {
                  const isCompleted = completedRituals.includes(ritual.id);
                  const Icon = ritual.icon;
                  
                  return (
                    <motion.div
                      key={ritual.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-6 h-full transition-all hover:shadow-lg ${isCompleted ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${ritual.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{ritual.duration} min</Badge>
                            {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{ritual.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{ritual.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {ritual.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {benefit}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            +{ritual.xp} XP
                          </Badge>
                          <Button
                            variant={isCompleted ? "outline" : "default"}
                            size="sm"
                            onClick={() => startRitual(ritual)}
                            disabled={activeRitual !== null}
                          >
                            {isCompleted ? "Do Again" : "Start Ritual"}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  const Icon = achievement.icon;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-6 ${isUnlocked ? 'border-yellow-500/30 bg-yellow-500/5' : 'opacity-60'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-yellow-500/20' : 'bg-muted'}`}>
                            <Icon className={`h-6 w-6 ${isUnlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{achievement.name}</h3>
                              {isUnlocked && <Sparkles className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          {isUnlocked && (
                            <Badge className="bg-yellow-500/10 text-yellow-500">Unlocked</Badge>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Focus Time Distribution
                  </h3>
                  <div className="space-y-4">
                    {categories.slice(1).map((cat) => {
                      const catRituals = rituals.filter(r => r.category === cat.id);
                      const catCompleted = catRituals.filter(r => completedRituals.includes(r.id)).length;
                      const percentage = catRituals.length > 0 ? (catCompleted / catRituals.length) * 100 : 0;
                      
                      return (
                        <div key={cat.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat.name}</span>
                            <span className="text-muted-foreground">{catCompleted} / {catRituals.length}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Ritual Mastery
                  </h3>
                  <div className="space-y-4">
                    {rituals.slice(0, 4).map((ritual) => {
                      const timesCompleted = completedRituals.filter(id => id === ritual.id).length;
                      const masteryLevel = Math.min(timesCompleted * 20, 100);
                      
                      return (
                        <div key={ritual.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{ritual.name}</span>
                            <span className="text-muted-foreground">{timesCompleted} times</span>
                          </div>
                          <Progress value={masteryLevel} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
