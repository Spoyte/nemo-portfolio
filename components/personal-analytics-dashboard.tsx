"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Target, 
  Trophy, 
  Star,
  Flame,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  GitBranch,
  Code2,
  Coffee,
  Moon,
  Sun,
  Activity,
  Users,
  MousePointer,
  Keyboard,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  XCircle,
  MinusCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simulated real-time data
interface LiveStats {
  activeVisitors: number;
  totalViews: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  newVisitors: number;
  returningVisitors: number;
}

interface ActivityEvent {
  id: string;
  type: "pageview" | "click" | "scroll" | "achievement" | "easter_egg";
  message: string;
  timestamp: Date;
  location?: string;
}

interface DailyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ElementType;
}

interface StreakData {
  current: number;
  longest: number;
  lastActive: Date;
  history: boolean[];
}

const generateRandomStats = (): LiveStats => ({
  activeVisitors: Math.floor(Math.random() * 15) + 3,
  totalViews: 15420 + Math.floor(Math.random() * 100),
  pageViews: 89 + Math.floor(Math.random() * 20),
  avgSessionDuration: 245 + Math.floor(Math.random() * 60),
  bounceRate: 32 + Math.floor(Math.random() * 10),
  newVisitors: 65,
  returningVisitors: 35,
});

const activityMessages = [
  { type: "pageview" as const, message: "Viewed portfolio homepage", location: "San Francisco, CA" },
  { type: "pageview" as const, message: "Explored projects section", location: "London, UK" },
  { type: "click" as const, message: "Clicked 'Hire Me' button", location: "New York, NY" },
  { type: "achievement" as const, message: "Unlocked 'First Visit' achievement", location: "Tokyo, JP" },
  { type: "scroll" as const, message: "Scrolled through timeline", location: "Berlin, DE" },
  { type: "easter_egg" as const, message: "Found the Konami code easter egg!", location: "Toronto, CA" },
  { type: "pageview" as const, message: "Read blog article", location: "Sydney, AU" },
  { type: "click" as const, message: "Downloaded resume", location: "Paris, FR" },
];

const dailyGoals: DailyGoal[] = [
  { id: "1", title: "Portfolio Views", target: 500, current: 342, unit: "views", icon: Eye },
  { id: "2", title: "GitHub Contributions", target: 10, current: 7, unit: "commits", icon: GitBranch },
  { id: "3", title: "Coding Hours", target: 8, current: 5.5, unit: "hours", icon: Code2 },
  { id: "4", title: "Coffee Consumed", target: 4, current: 3, unit: "cups", icon: Coffee },
];

const streakHistory = Array.from({ length: 30 }, (_, i) => {
  // Generate a realistic streak pattern
  const daysAgo = 29 - i;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // More likely to be active on weekdays
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const baseProbability = isWeekend ? 0.6 : 0.9;
  
  return Math.random() < baseProbability;
});

export function PersonalAnalyticsDashboard() {
  const [stats, setStats] = useState<LiveStats>(generateRandomStats());
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateRandomStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live activities
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomActivity = activityMessages[Math.floor(Math.random() * activityMessages.length)];
        const newEvent: ActivityEvent = {
          id: Date.now().toString(),
          type: randomActivity.type,
          message: randomActivity.message,
          timestamp: new Date(),
          location: randomActivity.location,
        };
        setActivities(prev => [newEvent, ...prev].slice(0, 20));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll activities
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activities]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getActivityIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "pageview": return <Eye className="w-4 h-4" />;
      case "click": return <MousePointer className="w-4 h-4" />;
      case "scroll": return <Activity className="w-4 h-4" />;
      case "achievement": return <Trophy className="w-4 h-4" />;
      case "easter_egg": return <Sparkles className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "pageview": return "text-blue-500 bg-blue-500/10";
      case "click": return "text-green-500 bg-green-500/10";
      case "scroll": return "text-purple-500 bg-purple-500/10";
      case "achievement": return "text-yellow-500 bg-yellow-500/10";
      case "easter_egg": return "text-pink-500 bg-pink-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Live Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Personal{" "}
                <span className="text-gradient-animated">Analytics</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time insights into my digital presence and productivity
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-mono font-bold">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {["24h", "7d", "30d", "All Time"].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTimeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: "Active Visitors", 
              value: stats.activeVisitors, 
              change: "+12%", 
              icon: Users,
              color: "text-green-500"
            },
            { 
              label: "Total Views", 
              value: stats.totalViews.toLocaleString(), 
              change: "+8%", 
              icon: Eye,
              color: "text-blue-500"
            },
            { 
              label: "Avg. Session", 
              value: formatDuration(stats.avgSessionDuration), 
              change: "+5%", 
              icon: Clock,
              color: "text-purple-500"
            },
            { 
              label: "Bounce Rate", 
              value: `${stats.bounceRate}%`, 
              change: "-3%", 
              icon: TrendingUp,
              color: "text-orange-500"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="relative overflow-hidden group hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last period
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals & Streaks */}
          <div className="space-y-6">
            {/* Daily Goals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Daily Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dailyGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <goal.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{goal.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${
                            goal.current >= goal.target 
                              ? "bg-green-500" 
                              : "bg-primary"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Activity Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{streakHistory.filter(Boolean).length}</p>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-3xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Longest</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-3xl font-bold">156</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {streakHistory.map((active, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`aspect-square rounded-sm ${
                          active 
                            ? "bg-green-500/80 hover:bg-green-500" 
                            : "bg-muted hover:bg-muted/80"
                        } transition-colors`}
                        title={active ? "Active" : "Inactive"}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column - Live Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Live Activity
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]" ref={scrollRef}>
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {activities.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Waiting for activity...
                        </div>
                      ) : (
                        activities.map((activity) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.location} • {activity.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Visitor Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Visitor Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Visitor Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New Visitors</span>
                    <span className="font-medium">{stats.newVisitors}%</span>
                  </div>
                  <Progress value={stats.newVisitors} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Returning</span>
                    <span className="font-medium">{stats.returningVisitors}%</span>
                  </div>
                  <Progress value={stats.returningVisitors} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { page: "/", views: 4520, change: "+15%" },
                    { page: "/projects", views: 2840, change: "+8%" },
                    { page: "/blog", views: 1920, change: "+22%" },
                    { page: "/about", views: 1240, change: "+5%" },
                    { page: "/contact", views: 890, change: "+12%" },
                  ].map((page, i) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                        <span className="text-sm font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{page.views.toLocaleString()}</span>
                        <span className="text-xs text-green-500">{page.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "1000 Views", date: "2 days ago", icon: Eye },
                    { title: "7 Day Streak", date: "Today", icon: Flame },
                    { title: "First Share", date: "3 days ago", icon: Share2 },
                    { title: "Feedback Star", date: "1 week ago", icon: MessageSquare },
                  ].map((achievement) => (
                    <div key={achievement.title} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <achievement.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PersonalAnalyticsDashboard;
