"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Calendar,
  TrendingUp,
  Target,
  Zap,
  Coffee,
  Code,
  BookOpen,
  Dumbbell,
  Moon,
  Sun,
  RotateCcw,
  Plus,
  X,
  Sparkles,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Habit {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  completedDates: string[];
  streak: number;
  targetDays: number;
  category: "coding" | "learning" | "wellness" | "creative";
}

interface DailyQuote {
  text: string;
  author: string;
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Morning Coffee", icon: Coffee, color: "text-amber-500", completedDates: [], streak: 0, targetDays: 30, category: "wellness" },
  { id: "2", name: "Code Review", icon: Code, color: "text-blue-500", completedDates: [], streak: 0, targetDays: 30, category: "coding" },
  { id: "3", name: "Read Docs", icon: BookOpen, color: "text-emerald-500", completedDates: [], streak: 0, targetDays: 30, category: "learning" },
  { id: "4", name: "Exercise", icon: Dumbbell, color: "text-rose-500", completedDates: [], streak: 0, targetDays: 30, category: "wellness" },
  { id: "5", name: "Side Project", icon: Sparkles, color: "text-purple-500", completedDates: [], streak: 0, targetDays: 30, category: "creative" },
  { id: "6", name: "Early Sleep", icon: Moon, color: "text-indigo-500", completedDates: [], streak: 0, targetDays: 30, category: "wellness" },
];

const quotes: DailyQuote[] = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The code you write today makes you the developer you'll be tomorrow.", author: "Unknown" },
];

const categoryColors: Record<string, string> = {
  coding: "bg-blue-500/10 text-blue-500",
  learning: "bg-emerald-500/10 text-emerald-500",
  wellness: "bg-rose-500/10 text-rose-500",
  creative: "bg-purple-500/10 text-purple-500",
};

export function DeveloperDailyRituals() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [todayQuote, setTodayQuote] = useState<DailyQuote>(quotes[0]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Habit["category"]>("coding");
  const [animationKey, setAnimationKey] = useState(0);

  // Load habits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("developer-habits");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHabits(parsed.map((h: Habit) => ({
          ...h,
          icon: defaultHabits.find(dh => dh.category === h.category)?.icon || Code
        })));
      } catch {}
    }
    
    // Set daily quote based on date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setTodayQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem("developer-habits", JSON.stringify(habits));
  }, [habits]);

  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(today);
      let newCompletedDates: string[];
      let newStreak = habit.streak;
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== today);
        newStreak = Math.max(0, habit.streak - 1);
      } else {
        newCompletedDates = [...habit.completedDates, today];
        // Check if yesterday was completed for streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (habit.completedDates.includes(yesterdayStr) || habit.streak === 0) {
          newStreak = habit.streak + 1;
        }
      }
      
      return {
        ...habit,
        completedDates: newCompletedDates,
        streak: newStreak
      };
    }));
    setAnimationKey(prev => prev + 1);
  }, [today]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const categoryIcons: Record<string, React.ElementType> = {
      coding: Code,
      learning: BookOpen,
      wellness: Sun,
      creative: Sparkles,
    };
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      icon: categoryIcons[selectedCategory],
      color: "text-primary",
      completedDates: [],
      streak: 0,
      targetDays: 30,
      category: selectedCategory
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName("");
    setShowAddHabit(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const resetAll = () => {
    if (confirm("Reset all habits? This will clear all progress.")) {
      setHabits(habits.map(h => ({ ...h, completedDates: [], streak: 0 })));
    }
  };

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = Math.round((completedToday / habits.length) * 100);
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const bestStreak = Math.max(...habits.map(h => h.streak), 0);

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-amber-950/5 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 mb-6"
          >
            <Flame className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Rituals</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Build Better{" "}
            <span className="text-gradient-animated">Habits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Small daily actions compound into extraordinary results. Track your developer rituals and watch your progress grow.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-bold text-amber-500">{completedToday}/{habits.length}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-bold text-emerald-500">{completionRate}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-bold text-blue-500">{totalStreak}</div>
            <div className="text-sm text-muted-foreground">Total Streak</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <div className="text-3xl font-bold text-purple-500">{bestStreak}</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </div>
        </motion.div>

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Rituals
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={resetAll}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddHabit(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {habits.map((habit, index) => {
                const isCompleted = habit.completedDates.includes(today);
                const Icon = habit.icon;
                
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCompleted 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={isCompleted ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-xl ${isCompleted ? "bg-primary/20" : "bg-muted"}`}
                      >
                        <Icon className={`h-6 w-6 ${isCompleted ? "text-primary" : "text-muted-foreground"}`} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCompleted ? "line-through opacity-60" : ""}`}>
                            {habit.name}
                          </span>
                          <Badge variant="outline" className={`text-xs ${categoryColors[habit.category]}`}>
                            {habit.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {habit.streak} day streak
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {habit.completedDates.length} total
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {last7Days.map((date, i) => (
                            <div
                              key={date}
                              className={`w-2 h-6 rounded-full transition-all ${
                                habit.completedDates.includes(date)
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                              title={date}
                            />
                          ))}
                        </div>
                        
                        <motion.div
                          animate={isCompleted ? { scale: [1, 1.3, 1] } : {}}
                          className="ml-4"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </motion.div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHabit(habit.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add Habit Form */}
            <AnimatePresence>
              {showAddHabit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="New habit name..."
                      className="flex-1 px-4 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary"
                      onKeyDown={(e) => e.key === "Enter" && addHabit()}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Habit["category"])}
                      className="px-4 py-2 rounded-xl bg-muted border-0"
                    >
                      <option value="coding">Coding</option>
                      <option value="learning">Learning</option>
                      <option value="wellness">Wellness</option>
                      <option value="creative">Creative</option>
                    </select>
                    <Button onClick={addHabit}>Add</Button>
                    <Button variant="ghost" onClick={() => setShowAddHabit(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Daily Quote */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-600">Daily Inspiration</span>
              </div>
              <p className="text-sm italic text-muted-foreground mb-3">
                "{todayQuote.text}"
              </p>
              <p className="text-xs text-muted-foreground">— {todayQuote.author}</p>
            </div>

            {/* Weekly Heatmap */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last 7 Days
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {last7Days.map((date, i) => {
                  const dayHabits = habits.filter(h => h.completedDates.includes(date)).length;
                  const intensity = dayHabits / habits.length;
                  
                  return (
                    <div key={date} className="text-center">
                      <div
                        className={`w-full aspect-square rounded-lg transition-all ${
                          intensity === 0 ? "bg-muted" :
                          intensity < 0.3 ? "bg-primary/20" :
                          intensity < 0.6 ? "bg-primary/40" :
                          intensity < 0.9 ? "bg-primary/60" :
                          "bg-primary"
                        }`}
                        title={`${date}: ${dayHabits}/${habits.length} habits`}
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {["S", "M", "T", "W", "T", "F", "S"][new Date(date).getDay()]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Achievements
              </h4>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 ${totalStreak >= 7 ? "" : "opacity-50"}`}>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Flame className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Week Warrior</p>
                    <p className="text-xs text-muted-foreground">7+ total streak days</p>
                  </div>
                  {totalStreak >= 7 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className={`flex items-center gap-3 ${completionRate === 100 ? "" : "opacity-50"}`}>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Zap className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Perfect Day</p>
                    <p className="text-xs text-muted-foreground">Complete all habits</p>
                  </div>
                  {completionRate === 100 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className={`flex items-center gap-3 ${bestStreak >= 5 ? "" : "opacity-50"}`}>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Streak Master</p>
                    <p className="text-xs text-muted-foreground">5+ day single streak</p>
                  </div>
                  {bestStreak >= 5 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
