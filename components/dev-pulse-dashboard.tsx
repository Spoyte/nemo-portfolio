"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { 
  Activity, 
  GitCommit, 
  Coffee, 
  Clock, 
  Zap,
  Terminal,
  Music,
  Code,
  Sparkles,
  TrendingUp,
  Flame,
  Target,
  Trophy
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActivityEvent {
  id: string;
  type: "commit" | "coffee" | "code" | "music" | "milestone";
  message: string;
  timestamp: Date;
  icon: React.ReactNode;
}

const MOCK_ACTIVITIES: ActivityEvent[] = [
  { id: "1", type: "commit", message: "Pushed to nemo-portfolio", timestamp: new Date(Date.now() - 1000 * 60 * 5), icon: <GitCommit className="w-4 h-4" /> },
  { id: "2", type: "code", message: "Working on new animation system", timestamp: new Date(Date.now() - 1000 * 60 * 15), icon: <Code className="w-4 h-4" /> },
  { id: "3", type: "coffee", message: "Coffee break ☕", timestamp: new Date(Date.now() - 1000 * 60 * 45), icon: <Coffee className="w-4 h-4" /> },
  { id: "4", type: "music", message: "Listening to synthwave", timestamp: new Date(Date.now() - 1000 * 60 * 60), icon: <Music className="w-4 h-4" /> },
  { id: "5", type: "milestone", message: "Completed 3 projects this week!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), icon: <Trophy className="w-4 h-4" /> },
];

export function DevPulseDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivities] = useState<ActivityEvent[]>(MOCK_ACTIVITIES);
  const [codingStreak, setCodingStreak] = useState(12);
  const [focusTime, setFocusTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }>>([]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate focus time increment
  useEffect(() => {
    const timer = setInterval(() => setFocusTime(prev => prev + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Particle animation for coding activity
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles randomly
    if (Math.random() < 0.1) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 1,
        color: ["#dc2626", "#ea580c", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
      });
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.01;

      if (p.life > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Live Activity</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dev<span className="text-gradient-animated">Pulse</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into my coding journey, current focus, and daily activities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 h-full relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-sm font-medium text-green-500">Online</span>
                  </div>
                  <Badge variant="outline">{formatTime(currentTime)}</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Currently</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-primary" />
                      Coding & Creating
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Focus Time</p>
                    <p className="text-2xl font-bold text-gradient">{formatFocusTime(focusTime)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coding Streak</p>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-2xl font-bold">{codingStreak} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                <Badge variant="secondary">Live</Badge>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-primary"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">This Week</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Commits</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "78%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Hours Coded</span>
                    <span className="font-medium">32h</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Coffees</span>
                    <span className="font-medium">21</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "90%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Goals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Current Goals</h3>
              </div>
              <div className="space-y-3">
                {[
                  { text: "Ship 3 new features", done: true },
                  { text: "Write a blog post", done: true },
                  { text: "Learn Rust basics", done: false },
                  { text: "Contribute to OSS", done: false },
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      goal.done ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}>
                      {goal.done && <Sparkles className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={goal.done ? "line-through text-muted-foreground" : ""}>
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "View Code", icon: Code, color: "bg-blue-500" },
                  { label: "Schedule Call", icon: Clock, color: "bg-green-500" },
                  { label: "Send Message", icon: Terminal, color: "bg-purple-500" },
                  { label: "View Resume", icon: Target, color: "bg-orange-500" },
                ].map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
