"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: "coding" | "design" | "learning" | "other";
}

interface DailyStats {
  date: string;
  completed: number;
  total: number;
}

const categories = {
  coding: { color: "bg-blue-500", icon: "💻" },
  design: { color: "bg-purple-500", icon: "🎨" },
  learning: { color: "bg-green-500", icon: "📚" },
  other: { color: "bg-gray-500", icon: "📋" },
};

export function DeveloperProductivityDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Task["category"]>("coding");
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [history, setHistory] = useState<DailyStats[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dev-productivity");
    if (saved) {
      const data = JSON.parse(saved);
      setTasks(data.tasks || []);
      setStreak(data.streak || 0);
      setXp(data.xp || 0);
      setLevel(data.level || 1);
      setHistory(data.history || []);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(
      "dev-productivity",
      JSON.stringify({ tasks, streak, xp, level, history })
    );
  }, [tasks, streak, xp, level, history]);

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      createdAt: Date.now(),
      category: selectedCategory,
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          setXp(prev => {
            const newXp = prev + 10;
            if (newXp >= level * 100) {
              setLevel(l => l + 1);
              return newXp - level * 100;
            }
            return newXp;
          });
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const getMotivationalMessage = () => {
    if (progress === 100) return "🎉 All tasks completed! You're on fire!";
    if (progress >= 75) return "🔥 Almost there! Keep pushing!";
    if (progress >= 50) return "💪 Halfway there! Great progress!";
    if (progress >= 25) return "🚀 Good start! Keep going!";
    return "🎯 Let's crush those tasks today!";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold">{streak} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-muted-foreground">Level</span>
          </div>
          <p className="text-2xl font-bold">{level}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
          <p className="text-2xl font-bold">{xp}/{level * 100}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold">{completedCount}/{tasks.length}</p>
        </motion.div>
      </div>

      {/* Progress Section */}
      <div className="p-6 rounded-2xl bg-card border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Today's Progress
          </h3>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Add Task */}
      <div className="p-6 rounded-2xl bg-card border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Task
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What are you working on?"
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
          />
          <div className="flex gap-2">
            {(Object.keys(categories) as Task["category"][]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {categories[cat].icon} {cat}
              </button>
            ))}
          </div>
          <Button onClick={addTask}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                task.completed
                  ? "bg-muted/50 border-muted"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-green-500 border-green-500"
                    : "border-muted-foreground/30 hover:border-primary"
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>

              <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {categories[task.category].icon} {task.text}
              </span>

              <span className={`px-2 py-1 rounded-full text-xs ${categories[task.category].color}/20 text-${categories[task.category].color}`}>
                {task.category}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
