"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Code2, 
  Coffee, 
  Clock, 
  Target, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  GitBranch,
  FileCode,
  Bug,
  CheckCircle,
  Timer,
  Music,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Trophy,
  Flame,
  Moon,
  Sun,
  CloudRain,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-500";

  return (
    <Card className="relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
      />
      <CardContent className="p-6"
      >
        <div className="flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1"
            >{title}</p>
            <h3 className="text-3xl font-bold"
            >{value}</h3>
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}
            >
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium"
            >{Math.abs(change)}%</span>
              <span className="text-sm text-muted-foreground"
            >vs last week</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}
          >
            <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  category: string;
}

interface PomodoroState {
  time: number;
  isActive: boolean;
  mode: "work" | "break";
  cycles: number;
}

export function DeveloperDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review pull requests", completed: false, priority: "high", category: "Code Review" },
    { id: "2", title: "Update documentation", completed: true, priority: "medium", category: "Docs" },
    { id: "3", title: "Fix navigation bug", completed: false, priority: "high", category: "Bug Fix" },
    { id: "4", title: "Optimize images", completed: false, priority: "low", category: "Performance" },
  ]);
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    time: 25 * 60,
    isActive: false,
    mode: "work",
    cycles: 0,
  });
  const [focusMode, setFocusMode] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [productivityScore, setProductivityScore] = useState(87);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro timer
  useEffect(() => {
    if (!pomodoro.isActive) return;

    const interval = setInterval(() => {
      setPomodoro((prev) => {
        if (prev.time <= 0) {
          const newMode = prev.mode === "work" ? "break" : "work";
          return {
            ...prev,
            time: newMode === "work" ? 25 * 60 : 5 * 60,
            mode: newMode,
            cycles: newMode === "work" ? prev.cycles + 1 : prev.cycles,
            isActive: false,
          };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoro.isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = currentTime.getDay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6"
    >
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
            >
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold"
            >Developer Dashboard</h1>
              <p className="text-white/60"
            >Your productivity command center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4"
          >
            <div className="text-right"
            >
              <p className="text-2xl font-mono font-bold"
            >{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-sm text-white/60"
            >{currentTime.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFocusMode(!focusMode)}
              className={`rounded-full ${focusMode ? "bg-primary text-white" : "border-white/20"}`}
            >
              {focusMode ? <Zap className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Code Commits"
          value="147"
          change={12}
          icon={GitBranch}
          color="bg-blue-500"
        />
        <StatCard
          title="Files Changed"
          value="23"
          change={-5}
          icon={FileCode}
          color="bg-green-500"
        />
        <StatCard
          title="Bugs Fixed"
          value="8"
          change={20}
          icon={Bug}
          color="bg-red-500"
        />
        <StatCard
          title="Focus Hours"
          value="6.5"
          change={8}
          icon={Clock}
          color="bg-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-6"
        >
          {/* Productivity Score */}
          <Card className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2"
              >
                <Trophy className="w-5 h-5 text-yellow-500" />
                Productivity Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4"
              >
                <div className="relative w-32 h-32"
                >
                  <svg className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${productivityScore * 3.52} 352`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="text-4xl font-bold"
                  >{productivityScore}</span>
                    <span className="text-xs text-white/60"
                  >Excellent</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mt-4"
              >
                {weekDays.map((day, i) => (
                  <div key={day} className="text-center"
                  >
                    <div 
                      className={`h-8 rounded-md ${
                        i === currentDay 
                          ? "bg-gradient-to-b from-violet-500 to-fuchsia-500" 
                          : i < currentDay 
                            ? "bg-white/20" 
                            : "bg-white/5"
                      }`}
                    />
                    <span className="text-xs text-white/60 mt-1 block"
                  >{day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card>
            <CardContent className="p-6"
            >
              <div className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center"
                >
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold"
                >12 Days</p>
                  <p className="text-sm text-white/60"
                >Current streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Pomodoro */}
        <div>
          <Card className="h-full"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2"
              >
                <Timer className="w-5 h-5" />
                Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center"
            >
              <div className="relative w-48 h-48 mb-6"
              >
                <motion.div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                    pomodoro.mode === "work" ? "from-violet-500 to-fuchsia-500" : "from-green-500 to-emerald-500"
                  } opacity-20`}
                  animate={pomodoro.isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="absolute inset-4 rounded-full bg-slate-900 flex flex-col items-center justify-center"
                >
                  <span className="text-5xl font-mono font-bold"
                >{formatTime(pomodoro.time)}</span>
                  <Badge variant="outline" className="mt-2 border-white/20"
                >
                  {pomodoro.mode === "work" ? "Focus Time" : "Break Time"}
                </Badge>
                </div>
              </div>

              <div className="flex gap-3 mb-6"
              >
                <Button
                  variant={pomodoro.isActive ? "destructive" : "default"}
                  onClick={() => setPomodoro(p => ({ ...p, isActive: !p.isActive }))}
                  className="w-24"
                >
                  {pomodoro.isActive ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPomodoro({ time: 25 * 60, isActive: false, mode: "work", cycles: 0 })}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <div className="w-full space-y-2"
              >
                <div className="flex justify-between text-sm"
                >
                  <span className="text-white/60">Cycles completed</span>
                  <span className="font-medium">{pomodoro.cycles}</span>
                </div>
                <Progress value={(pomodoro.cycles % 4) * 25} className="h-2" />
              </div>
            </CardContent>          </Card>
        </div>

        {/* Right Column - Tasks */}
        <div>
          <Card className="h-full"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2"
              >
                  <Target className="w-5 h-5" />
                  Today's Tasks
                </span>
                <Badge>{completedTasks}/{tasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-6" />
              
              <div className="space-y-3"
              >
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      task.completed ? "bg-white/5" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? "bg-green-500 border-green-500" 
                        : "border-white/30"
                    }`}
                    >
                      {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    
                    <div className="flex-1"
                    >
                      <p className={`font-medium ${task.completed ? "line-through text-white/40" : ""}`}
                    >{task.title}</p>
                      <p className="text-xs text-white/50"
                    >{task.category}</p>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        task.priority === "high" ? "border-red-500/50 text-red-400" :
                        task.priority === "medium" ? "border-yellow-500/50 text-yellow-400" :
                        "border-green-500/50 text-green-400"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="text-center"
            >
              <Zap className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse" />
              <h2 className="text-4xl font-bold mb-4"
            >Focus Mode Active</h2>
              <p className="text-xl text-white/60 mb-8"
            >{formatTime(pomodoro.time)} remaining</p>
              
              <Button 
                size="lg" 
                onClick={() => setFocusMode(false)}
                className="bg-white/10 hover:bg-white/20"
              >
                Exit Focus Mode
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
