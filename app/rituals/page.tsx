"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Sun,
  Moon,
  Brain,
  Dumbbell,
  BookOpen,
  Music,
  Code2,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Target,
  Star,
  Plus,
  Trash2,
  Edit3,
  Save,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/scroll-animations";

interface Ritual {
  id: string;
  name: string;
  icon: string;
  time: string;
  duration: number;
  completed: boolean;
  streak: number;
  category: "morning" | "work" | "evening" | "health";
}

interface DailyStats {
  date: string;
  ritualsCompleted: number;
  totalRituals: number;
  focusTime: number;
  mood: number;
}

const defaultRituals: Ritual[] = [
  { id: "1", name: "Morning Coffee", icon: "coffee", time: "07:00", duration: 15, completed: true, streak: 45, category: "morning" },
  { id: "2", name: "Deep Work Session", icon: "code", time: "09:00", duration: 120, completed: false, streak: 32, category: "work" },
  { id: "3", name: "Exercise", icon: "dumbbell", time: "18:00", duration: 45, completed: false, streak: 12, category: "health" },
  { id: "4", name: "Reading", icon: "book", time: "21:00", duration: 30, completed: false, streak: 8, category: "evening" },
  { id: "5", name: "Meditation", icon: "brain", time: "07:30", duration: 10, completed: true, streak: 21, category: "morning" },
  { id: "6", name: "Code Review", icon: "code", time: "14:00", duration: 60, completed: false, streak: 28, category: "work" },
];

const iconMap: Record<string, React.ElementType> = {
  coffee: Coffee,
  code: Code2,
  dumbbell: Dumbbell,
  book: BookOpen,
  brain: Brain,
  music: Music,
  sun: Sun,
  moon: Moon,
};

const categoryColors: Record<string, string> = {
  morning: "from-orange-400 to-yellow-400",
  work: "from-blue-400 to-cyan-400",
  evening: "from-purple-400 to-pink-400",
  health: "from-green-400 to-emerald-400",
};

const categoryBgColors: Record<string, string> = {
  morning: "bg-orange-500/10 text-orange-500",
  work: "bg-blue-500/10 text-blue-500",
  evening: "bg-purple-500/10 text-purple-500",
  health: "bg-green-500/10 text-green-500",
};

export default function DeveloperDailyRituals() {
  const [rituals, setRituals] = useState<Ritual[]>(defaultRituals);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingRitual, setEditingRitual] = useState<string | null>(null);
  const [newRitualName, setNewRitualName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleRitual = (id: string) => {
    setRituals(prev => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed, streak: r.completed ? r.streak - 1 : r.streak + 1 } : r
    ));
  };

  const deleteRitual = (id: string) => {
    setRituals(prev => prev.filter(r => r.id !== id));
  };

  const addRitual = () => {
    if (!newRitualName.trim()) return;
    const newRitual: Ritual = {
      id: Date.now().toString(),
      name: newRitualName,
      icon: "code",
      time: "12:00",
      duration: 30,
      completed: false,
      streak: 0,
      category: "work",
    };
    setRituals(prev => [...prev, newRitual]);
    setNewRitualName("");
    setShowAddForm(false);
  };

  const completedCount = rituals.filter(r => r.completed).length;
  const progress = (completedCount / rituals.length) * 100;
  const totalStreak = rituals.reduce((acc, r) => acc + r.streak, 0);
  const longestStreak = Math.max(...rituals.map(r => r.streak));

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getNextRitual = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const upcoming = rituals
      .filter(r => !r.completed)
      .map(r => {
        const [hours, minutes] = r.time.split(":").map(Number);
        const ritualTime = hours * 60 + minutes;
        return { ...r, minutesUntil: ritualTime - now };
      })
      .filter(r => r.minutesUntil > 0)
      .sort((a, b) => a.minutesUntil - b.minutesUntil);
    return upcoming[0];
  };

  const nextRitual = getNextRitual();

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Routine</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Developer <span className="text-gradient-animated">Daily Rituals</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build consistency through daily rituals. Track your habits, maintain streaks, 
            and optimize your development workflow.
          </p>
        </ScrollReveal>

        {/* Stats Overview */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{completedCount}/{rituals.length}</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-orange-500/10 mb-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{totalStreak}</p>
                <p className="text-sm text-muted-foreground">Total Streak Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-yellow-500/10 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">{longestStreak}</p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-green-500/10 mb-3">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{Math.round(progress)}%</p>
                <p className="text-sm text-muted-foreground">Daily Progress</p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Progress Bar */}
        <ScrollReveal delay={0.15}>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{getGreeting()}, Developer!</h2>
                  <p className="text-muted-foreground">
                    {nextRitual ? (
                      <>Next up: <span className="font-semibold text-primary">{nextRitual.name}</span> at {nextRitual.time}</>
                    ) : (
                      "All rituals completed for today! Great job!"
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Morning</span>
                <span>Work</span>
                <span>Evening</span>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Rituals Grid */}
        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Today's Rituals
            </h2>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Ritual
            </Button>
          </div>

          {/* Add Ritual Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="New ritual name..."
                        value={newRitualName}
                        onChange={(e) => setNewRitualName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRitual()}
                      />
                      <Button onClick={addRitual}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rituals.map((ritual, index) => {
              const Icon = iconMap[ritual.icon] || Code2;
              return (
                <motion.div
                  key={ritual.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`group relative overflow-hidden transition-all ${
                    ritual.completed ? "border-green-500/50 bg-green-500/5" : ""
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleRitual(ritual.id)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              ritual.completed 
                                ? "bg-green-500 text-white" 
                                : `bg-gradient-to-br ${categoryColors[ritual.category]} text-white`
                            }`}
                          >
                            {ritual.completed ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                          </motion.button>
                          <div>
                            <h3 className={`font-semibold ${ritual.completed ? "line-through text-muted-foreground" : ""}`}>
                              {ritual.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {ritual.time}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${categoryBgColors[ritual.category]}`}>
                                {ritual.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-semibold">{ritual.streak}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{ritual.duration} min</p>
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => deleteRitual(ritual.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Weekly Calendar */}
        <ScrollReveal delay={0.3} className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Weekly Overview
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const isToday = i === new Date().getDay() - 1;
              const completion = [100, 85, 90, 70, 100, 60, 0][i];
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    isToday ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</p>
                  <div className="mt-2 relative h-16 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${completion}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`absolute bottom-0 left-0 right-0 rounded-full ${
                        completion === 100 ? "bg-green-500" : completion > 50 ? "bg-primary" : "bg-orange-500"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{completion}%</p>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Tips Section */}
        <ScrollReveal delay={0.4} className="mt-12">
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Daily Ritual Tips</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Start with your most important task when energy is highest
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Take regular breaks using the Pomodoro technique
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      End your day by planning tomorrow's priorities
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Consistency beats intensity - small daily actions compound
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
