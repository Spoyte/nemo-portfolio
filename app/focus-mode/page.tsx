"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  CheckCircle2, 
  Circle,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Wind,
  Waves,
  CloudRain,
  Coffee,
  Maximize2,
  Minimize2,
  Focus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

const ambientSounds = [
  { id: "none", label: "Silent", icon: VolumeX },
  { id: "wind", label: "Wind", icon: Wind },
  { id: "waves", label: "Ocean Waves", icon: Waves },
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "cafe", label: "Coffee Shop", icon: Coffee },
];

export default function FocusModePage() {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSound, setSelectedSound] = useState("none");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Breathing exercise state
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("focus-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("focus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Breathing animation
  useEffect(() => {
    if (!showBreathing) return;
    
    const cycle = async () => {
      setBreathingPhase("inhale");
      await new Promise(r => setTimeout(r, 4000));
      setBreathingPhase("hold");
      await new Promise(r => setTimeout(r, 2000));
      setBreathingPhase("exhale");
      await new Promise(r => setTimeout(r, 4000));
    };
    
    const interval = setInterval(cycle, 10000);
    cycle();
    
    return () => clearInterval(interval);
  }, [showBreathing]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreakDuration * 60);
        toast.success("Great work! Take a long break.");
      } else {
        setMode("break");
        setTimeLeft(settings.breakDuration * 60);
        toast.success("Session complete! Take a short break.");
      }
    } else {
      setMode("work");
      setTimeLeft(settings.workDuration * 60);
      toast.success("Break over! Ready to focus?");
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    const duration = mode === "work" ? settings.workDuration : 
                    mode === "break" ? settings.breakDuration : 
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode: "work" | "break" | "longBreak") => {
    setMode(newMode);
    setIsActive(false);
    const duration = newMode === "work" ? settings.workDuration : 
                    newMode === "break" ? settings.breakDuration : 
                    settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Task added!");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const progress = () => {
    const duration = mode === "work" ? settings.workDuration * 60 : 
                    mode === "break" ? settings.breakDuration * 60 : 
                    settings.longBreakDuration * 60;
    return ((duration - timeLeft) / duration) * 100;
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isFullscreen ? "bg-background" : "py-24 px-4 sm:px-6 lg:px-8"
    }`}>
      <div className={`mx-auto transition-all duration-500 ${
        isFullscreen ? "max-w-none p-8" : "max-w-6xl"
      }`}>
        {/* Header */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Focus className="h-4 w-4" />
              <span className="text-sm font-medium">Deep Work Mode</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Focus{" "}
              <span className="text-gradient-animated">Mode</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Eliminate distractions and achieve deep focus with the Pomodoro technique.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Main Timer Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border p-8">
              {/* Mode Tabs */}
              <div className="flex gap-2 mb-8">
                {(["work", "break", "longBreak"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      mode === m
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {m === "work" ? "Focus" : m === "break" ? "Short Break" : "Long Break"}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="text-center mb-8">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-7xl md:text-8xl font-bold tabular-nums tracking-tight"
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <p className="text-muted-foreground mt-2">
                  {mode === "work" ? "Stay focused" : mode === "break" ? "Recharge" : "Deep rest"}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  className="w-20 h-20 rounded-full"
                >
                  {isActive ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Focus Duration: {settings.workDuration} min</label>
                      <Slider
                        value={[settings.workDuration]}
                        onValueChange={([v]) => setSettings({...settings, workDuration: v})}
                        min={5}
                        max={60}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Break Duration: {settings.breakDuration} min</label>
                      <Slider
                        value={[settings.breakDuration]}
                        onValueChange={([v]) => setSettings({...settings, breakDuration: v})}
                        min={1}
                        max={30}
                        step={1}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-card border text-center">
                <p className="text-3xl font-bold text-primary">{sessionsCompleted}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border text-center">
                <p className="text-3xl font-bold text-primary">{Math.floor(sessionsCompleted * settings.workDuration / 60)}</p>
                <p className="text-xs text-muted-foreground">Hours Focused</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border text-center">
                <p className="text-3xl font-bold text-primary">{Math.round(completionRate)}%</p>
                <p className="text-xs text-muted-foreground">Tasks Done</p>
              </div>
            </div>

            {/* Ambient Sounds */}
            <div className="p-6 rounded-2xl bg-card border">
              <div className="flex items-center gap-2 mb-4">
                {selectedSound === "none" ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="font-medium">Ambient Sound</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {ambientSounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => setSelectedSound(sound.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedSound === sound.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <sound.icon className="w-4 h-4" />
                    {sound.label}
                  </button>
                ))}
              </div>
              {selectedSound !== "none" && (
                <p className="text-xs text-muted-foreground mt-3">
                  🔊 Visual indicator only — play your own ambient audio
                </p>
              )}
            </div>
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tasks Card */}
            <div className="rounded-3xl bg-card border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Focus Tasks</h2>
                <Badge variant="secondary">
                  {completedTasks}/{tasks.length} Done
                </Badge>
              </div>

              {/* Add Task */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="What needs focus?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <Button onClick={addTask} size="icon">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* Task List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        task.completed ? "bg-muted/50" : "bg-muted"
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.text}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {tasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No tasks yet. Add one to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Breathing Exercise</h3>
                  <p className="text-sm text-muted-foreground">4-2-4 breathing technique</p>
                </div>
                <Button
                  variant={showBreathing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBreathing(!showBreathing)}
                >
                  {showBreathing ? "Stop" : "Start"}
                </Button>
              </div>
              
              {showBreathing && (
                <div className="flex flex-col items-center py-8">
                  <motion.div
                    animate={{
                      scale: breathingPhase === "inhale" ? 1.5 : 
                             breathingPhase === "hold" ? 1.5 : 1,
                      opacity: breathingPhase === "hold" ? 0.7 : 1,
                    }}
                    transition={{ duration: breathingPhase === "hold" ? 2 : 4 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center"
                  >
                    <span className="text-white font-medium capitalize">
                      {breathingPhase}
                    </span>
                  </motion.div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {breathingPhase === "inhale" && "Breathe in slowly..."}
                    {breathingPhase === "hold" && "Hold..."}
                    {breathingPhase === "exhale" && "Breathe out slowly..."}
                  </p>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Enter Fullscreen Focus
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
