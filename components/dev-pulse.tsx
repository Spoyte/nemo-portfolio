"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitCommit, 
  Coffee, 
  Music, 
  Terminal, 
  MessageSquare, 
  Zap,
  Activity,
  Clock,
  Code2,
  Sparkles,
  Radio,
  Wifi,
  Cpu,
  Eye,
  MousePointer,
  Keyboard
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";

interface ActivityEvent {
  id: string;
  type: "commit" | "coffee" | "music" | "terminal" | "chat" | "code" | "focus" | "build";
  message: string;
  details?: string;
  timestamp: Date;
  project?: string;
  duration?: number;
  icon?: React.ReactNode;
}

const activityIcons = {
  commit: <GitCommit className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
  chat: <MessageSquare className="w-4 h-4" />,
  code: <Code2 className="w-4 h-4" />,
  focus: <Zap className="w-4 h-4" />,
  build: <Cpu className="w-4 h-4" />,
};

const activityColors = {
  commit: "bg-green-500/10 text-green-500 border-green-500/20",
  coffee: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  music: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  terminal: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  chat: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  code: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  focus: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  build: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const initialActivities: ActivityEvent[] = [
  {
    id: "1",
    type: "code",
    message: "Writing TypeScript for new portfolio feature",
    details: "DevPulse component with real-time updates",
    project: "nemo-portfolio",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "2",
    type: "commit",
    message: "feat: add DevPulse live activity feed",
    details: "3 files changed, 247 insertions",
    project: "nemo-portfolio",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    type: "focus",
    message: "Deep work session",
    details: "45 minutes of uninterrupted coding",
    duration: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "4",
    type: "coffee",
    message: "Coffee break",
    details: "Espresso + code review",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: "5",
    type: "music",
    message: "Now playing: Lo-fi Beats",
    details: "Focus playlist",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
];

const generateRandomActivity = (): ActivityEvent => {
  const types: ActivityEvent["type"][] = ["commit", "code", "focus", "terminal", "build"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const messages: Record<ActivityEvent["type"], string[]> = {
    commit: ["Fixed bug in animation logic", "Refactored component structure", "Updated dependencies", "Added new feature flag"],
    code: ["Writing React components", "Debugging CSS animations", "Optimizing performance", "Reviewing PR #247"],
    focus: ["Deep work session", "Coding sprint", "Design review", "Architecture planning"],
    terminal: ["Running tests", "Deploying to Vercel", "Git push origin main", "npm install new-package"],
    build: ["Build successful", "Tests passing", "Deploy preview ready", "CI/CD pipeline completed"],
    coffee: ["Coffee break", "Refilling energy", "Quick break"],
    music: ["Now playing: Synthwave", "Lo-fi beats", "Coding playlist"],
    chat: ["Team standup", "Code review discussion", "Pair programming session"],
  };
  
  const message = messages[type][Math.floor(Math.random() * messages[type].length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message,
    timestamp: new Date(),
    project: Math.random() > 0.5 ? "nemo-portfolio" : undefined,
  };
};

export function DevPulse() {
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(42);
  const [typingSpeed, setTypingSpeed] = useState(85);
  const [sessionTime, setSessionTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity = generateRandomActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      }
      
      // Random viewer count fluctuation
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      
      // Typing speed variation
      setTypingSpeed(prev => Math.max(60, Math.min(120, prev + Math.floor(Math.random() * 10) - 5)));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSessionTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Radio className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Live Activity</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dev<span className="text-gradient-animated">Pulse</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time glimpse into my development workflow. Watch as I code, commit, and create.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <span className="font-semibold">Activity Feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isLive 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isLive ? "● LIVE" : "PAUSED"}
                  </button>
                </div>
              </div>

              {/* Activity List */}
              <div 
                ref={scrollRef}
                className="max-h-[500px] overflow-y-auto scrollbar-hide"
              >
                <AnimatePresence initial={false}>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg border ${activityColors[activity.type]} shrink-0`}>
                        {activityIcons[activity.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.message}</p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(activity.timestamp)}
                          </span>
                          {activity.project && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {activity.project}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Live Stats */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                Live Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Viewers
                  </span>
                  <motion.span 
                    key={viewerCount}
                    initial={{ scale: 1.2, color: "#22c55e" }}
                    animate={{ scale: 1, color: "inherit" }}
                    className="font-mono font-bold"
                  >
                    {viewerCount}
                  </motion.span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Typing Speed
                  </span>
                  <span className="font-mono font-bold">{typingSpeed} WPM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Session Time
                  </span>
                  <span className="font-mono font-bold">{formatSessionTime(sessionTime)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    Clicks Today
                  </span>
                  <span className="font-mono font-bold">{Math.floor(sessionTime * 2.5)}</span>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Current Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm">Currently coding</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">VS Code - 3 files open</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Terminal - 2 tabs</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Coffee level: 73%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                  📧 Email Me
                </button>
                <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                  💬 Chat
                </button>
                <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                  📅 Schedule
                </button>
                <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                  🐦 Twitter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
