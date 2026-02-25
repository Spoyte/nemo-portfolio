"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Code2,
  Coffee,
  Zap,
  Target,
  Trophy,
  Flame,
  Clock,
  GitBranch,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Brain,
  Music,
  Moon,
  Sun,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { toast } from "sonner";

// Types
interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: "work" | "personal" | "learning";
  createdAt: number;
}

interface CodingSession {
  language: string;
  duration: number; // minutes
  project: string;
  timestamp: number;
}

interface DailyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
}

// Focus Timer Component
function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short" | "long">("work");
  const [sessions, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modes = {
    work: { time: 25 * 60, label: "Focus", color: "bg-primary" },
    short: { time: 5 * 60, label: "Short Break", color: "bg-green-500" },
    long: { time: 15 * 60, label: "Long Break", color: "bg-blue-500" },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "work") {
        setSessions((s) => s + 1);
        toast.success("Focus session complete! 🎉");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode: "work" | "short" | "long") => {
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Timer className="h-4 w-4 text-primary" />
          Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Mode Switcher */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                mode === m ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {modes[m].label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <motion.div
            key={timeLeft}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold tabular-nums tracking-tight"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">
            {isActive ? "Focusing..." : "Ready to start"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div
            className={`h-full ${modes[mode].color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            size="lg"
            className={`gap-2 ${isActive ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            onClick={toggleTimer}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" size="icon" onClick={resetTimer}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Counter */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Completed today: <span className="font-semibold text-foreground">{sessions}</span> sessions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Task Manager Component
function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState<Task["category"]>("work");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dev-dashboard-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("dev-dashboard-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      category,
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask("");
    toast.success("Task added!");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const categoryColors = {
    work: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    personal: "bg-green-500/10 text-green-500 border-green-500/20",
    learning: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Today&apos;s Tasks
        </CardTitle>
        <CardDescription>
          {completedCount} of {tasks.length} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Task["category"])}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="learning">Learning</option>
          </select>
          <Button size="icon" onClick={addTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  task.completed ? "bg-muted/50 opacity-60" : "bg-card hover:border-primary/30"
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30 hover:border-primary"
                  }`}
                >
                  {task.completed && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                </button>
                <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.text}
                </span>
                <Badge variant="outline" className={`text-xs ${categoryColors[task.category]}`}>
                  {task.category}
                </Badge>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks yet. Add one above!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Coding Activity Heatmap
function CodingActivityHeatmap() {
  // Generate last 365 days of mock data
  const data = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push({
        date: date.toISOString().split("T")[0],
        intensity,
        count: intensity * Math.floor(Math.random() * 5 + 1),
      });
    }
    return days;
  }, []);

  const getColor = (intensity: number) => {
    const colors = [
      "bg-muted",
      "bg-primary/20",
      "bg-primary/40",
      "bg-primary/60",
      "bg-primary",
    ];
    return colors[intensity] || colors[0];
  };

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);
  const streak = 12; // Mock streak

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          Coding Activity
        </CardTitle>
        <CardDescription>
          {totalContributions} contributions in the last year · {streak} day streak 🔥
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Heatmap Grid */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: weekIndex * 0.01 + dayIndex * 0.001 }}
                  className={`w-3 h-3 rounded-sm ${getColor(day.intensity)} hover:ring-2 hover:ring-primary/50 cursor-pointer transition-all`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${getColor(i)}`} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Daily Goals Tracker
function DailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>([
    { id: "1", title: "Code", target: 4, current: 2.5, unit: "hrs", icon: <Code2 className="h-4 w-4" /> },
    { id: "2", title: "Learn", target: 1, current: 0.5, unit: "hrs", icon: <Brain className="h-4 w-4" /> },
    { id: "3", title: "Commits", target: 5, current: 3, unit: "", icon: <GitBranch className="h-4 w-4" /> },
    { id: "4", title: "Water", target: 8, current: 5, unit: "glasses", icon: <Coffee className="h-4 w-4" /> },
  ]);

  const incrementGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, current: Math.min(g.current + 1, g.target) } : g)));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-primary" />
          Daily Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const isComplete = progress >= 100;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${isComplete ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"}`}>
                    {goal.icon}
                  </div>
                  <span className="font-medium">{goal.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isComplete ? "text-green-500 font-semibold" : "text-muted-foreground"}`}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                  {!isComplete && (
                    <button
                      onClick={() => incrementGoal(goal.id)}
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isComplete ? "bg-green-500" : "bg-primary"}`}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Productivity Stats
function ProductivityStats() {
  const stats = [
    { label: "Focus Time", value: "4h 32m", change: "+12%", icon: <Clock className="h-4 w-4" /> },
    { label: "Lines Written", value: "1,247", change: "+8%", icon: <Code2 className="h-4 w-4" /> },
    { label: "Tasks Done", value: "12", change: "+3", icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: "Streak", value: "12 days", change: "🔥", icon: <Flame className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{stat.value}</span>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Main Dashboard Component
export function DeveloperDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
            >
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Developer Dashboard</span>
            </motion.div>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Productivity Hub</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track your coding activity, manage tasks, and stay focused with built-in productivity tools.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ProductivityStats />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer & Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FocusTimer />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DailyGoals />
            </motion.div>
          </div>

          {/* Middle Column - Task Manager */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <TaskManager />
          </motion.div>

          {/* Right Column - Activity & Insights */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CodingActivityHeatmap />
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">💡 Productivity Tip</h3>
                  <p className="text-muted-foreground text-sm">
                    Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.
                    After 4 cycles, take a longer 15-30 minute break. This helps maintain focus
                    and prevents burnout.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
