"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  BookOpen,
  Music,
  Coffee,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Activity,
  Sun,
  Moon,
  Cloud,
  Wind,
  Droplets,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Radio,
  RadioTower,
  Wifi,
  Battery,
  BatteryCharging,
  Cpu,
  Monitor,
  Smartphone,
  Headphones,
  Keyboard,
  Mouse,
  Glasses,
  Watch,
  Briefcase,
  GraduationCap,
  Trophy,
  Star,
  Flame,
  Timer,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  RefreshCw,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface NowData {
  lastUpdated: string;
  location: string;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  currently: {
    workingOn: string;
    learning: string;
    reading: string;
    listening: string;
    watching: string;
    playing: string;
  };
  goals: {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };
  stats: {
    codingHours: number;
    commits: number;
    articlesRead: number;
    workouts: number;
  };
  setup: {
    computer: string;
    editor: string;
    terminal: string;
    browser: string;
    headphones: string;
    keyboard: string;
    mouse: string;
    monitor: string;
  };
  focus: {
    pomodoro: {
      completed: number;
      total: number;
      currentSession: number;
    };
    deepWork: {
      hoursToday: number;
      goal: number;
    };
  };
}

const defaultData: NowData = {
  lastUpdated: new Date().toISOString(),
  location: "Shanghai, China",
  weather: {
    temp: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
  },
  currently: {
    workingOn: "Building an AI-powered portfolio with Next.js and Three.js",
    learning: "Rust programming language and WebAssembly",
    reading: "The Pragmatic Programmer (20th Anniversary Edition)",
    listening: "Synthwave & Lo-fi beats for coding",
    watching: "The Last of Us Season 2",
    playing: "Hades II",
  },
  goals: {
    daily: [
      { text: "Complete 4 pomodoro sessions", completed: true },
      { text: "Read 30 minutes", completed: true },
      { text: "Exercise for 45 minutes", completed: false },
      { text: "Write 500 words", completed: false },
      { text: "Learn something new", completed: true },
    ] as { text: string; completed: boolean }[],
    weekly: [
      "Ship 3 new features",
      "Write 2 blog posts",
      "Contribute to open source",
      "Network with 5 developers",
    ],
    monthly: [
      "Launch portfolio v4.0",
      "Complete Rust course",
      "Build 2 side projects",
      "Read 4 books",
    ],
  },
  stats: {
    codingHours: 6.5,
    commits: 12,
    articlesRead: 3,
    workouts: 1,
  },
  setup: {
    computer: "MacBook Pro 16\" M3 Max",
    editor: "VS Code with custom theme",
    terminal: "Warp + Oh My Zsh",
    browser: "Arc Browser",
    headphones: "Sony WH-1000XM5",
    keyboard: "Keychron Q1 Pro",
    mouse: "Logitech MX Master 3S",
    monitor: "LG UltraFine 5K",
  },
  focus: {
    pomodoro: {
      completed: 6,
      total: 8,
      currentSession: 25,
    },
    deepWork: {
      hoursToday: 4.5,
      goal: 6,
    },
  },
};

function StatusIndicator({ status }: { status: "online" | "busy" | "away" | "offline" }) {
  const colors = {
    online: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`}></span>
    </span>
  );
}

function WeatherIcon({ condition }: { condition: string }) {
  if (condition.toLowerCase().includes("sun")) return <Sun className="h-6 w-6 text-yellow-500" />;
  if (condition.toLowerCase().includes("cloud")) return <Cloud className="h-6 w-6 text-gray-400" />;
  if (condition.toLowerCase().includes("rain")) return <Droplets className="h-6 w-6 text-blue-500" />;
  return <Sun className="h-6 w-6 text-yellow-500" />;
}

export default function NowPage() {
  const [data, setData] = useState<NowData>(defaultData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        stats: {
          ...prev.stats,
          codingHours: prev.stats.codingHours + Math.random() * 0.5,
          commits: prev.stats.commits + Math.floor(Math.random() * 3),
        },
      }));
      setIsRefreshing(false);
      toast.success("Data refreshed!");
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied!");
  };

  const toggleGoal = (index: number) => {
    setData((prev) => ({
      ...prev,
      goals: {
        ...prev.goals,
        daily: prev.goals.daily.map((goal, i) =>
          i === index ? { ...goal, completed: !goal.completed } : goal
        ),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-2"
              >
                <h1 className="text-4xl md:text-5xl font-bold">
                  What I&apos;m Doing{" "}
                  <span className="text-gradient-animated">Now</span>
                </h1>
                <StatusIndicator status="online" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Share
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currently Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Currently
                  </CardTitle>
                  <CardDescription>What I&apos;m up to right now</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Code2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Working On</p>
                        <p className="text-sm text-muted-foreground">{data.currently.workingOn}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <GraduationCap className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Learning</p>
                        <p className="text-sm text-muted-foreground">{data.currently.learning}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Reading</p>
                        <p className="text-sm text-muted-foreground">{data.currently.reading}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Music className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Listening To</p>
                        <p className="text-sm text-muted-foreground">{data.currently.listening}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Goals
                  </CardTitle>
                  <CardDescription>My current objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Daily Goals */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        Today
                      </h4>
                      <div className="space-y-2">
                        {data.goals.daily.map((goal, index) => (
                          <motion.button
                            key={index}
                            onClick={() => toggleGoal(index)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <span className={goal.completed ? "line-through text-muted-foreground" : ""}>
                              {goal.text}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {data.goals.daily.filter((g) => g.completed).length}/{data.goals.daily.length}
                          </span>
                        </div>
                        <Progress
                          value={(data.goals.daily.filter((g) => g.completed).length / data.goals.daily.length) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Weekly Goals */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        This Week
                      </h4>
                      <ul className="space-y-2">
                        {data.goals.weekly.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Monthly Goals */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Moon className="h-4 w-4 text-purple-500" />
                        This Month
                      </h4>
                      <ul className="space-y-2">
                        {data.goals.monthly.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Today&apos;s Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <Code2 className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{data.stats.codingHours.toFixed(1)}h</p>
                      <p className="text-sm text-muted-foreground">Coding</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <Github className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{data.stats.commits}</p>
                      <p className="text-sm text-muted-foreground">Commits</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{data.stats.articlesRead}</p>
                      <p className="text-sm text-muted-foreground">Articles</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{data.stats.workouts}</p>
                      <p className="text-sm text-muted-foreground">Workouts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location & Weather */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{data.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <WeatherIcon condition={data.weather.condition} />
                      <div>
                        <p className="font-medium">{data.weather.temp}°C</p>
                        <p className="text-sm text-muted-foreground">{data.weather.condition}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>💧 {data.weather.humidity}%</p>
                      <p>💨 {data.weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Focus Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-primary" />
                    Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Pomodoro Sessions</span>
                      <span className="font-medium">
                        {data.focus.pomodoro.completed}/{data.focus.pomodoro.total}
                      </span>
                    </div>
                    <Progress
                      value={(data.focus.pomodoro.completed / data.focus.pomodoro.total) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Deep Work</span>
                      <span className="font-medium">
                        {data.focus.deepWork.hoursToday}/{data.focus.deepWork.goal}h
                      </span>
                    </div>
                    <Progress
                      value={(data.focus.deepWork.hoursToday / data.focus.deepWork.goal) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Setup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data.setup).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    Connect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
