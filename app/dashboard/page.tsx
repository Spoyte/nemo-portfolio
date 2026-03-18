"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  GitBranch, 
  Code2, 
  Coffee,
  Moon,
  Sun,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Github,
  Terminal,
  BookOpen,
  Music,
  Gamepad2,
  Heart,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock data for the dashboard
const codingActivityData = [
  { day: "Mon", hours: 6.5, commits: 12 },
  { day: "Tue", hours: 8.2, commits: 18 },
  { day: "Wed", hours: 7.0, commits: 15 },
  { day: "Thu", hours: 9.5, commits: 22 },
  { day: "Fri", hours: 5.5, commits: 8 },
  { day: "Sat", hours: 3.0, commits: 4 },
  { day: "Sun", hours: 2.5, commits: 3 },
];

const projectProgress = [
  { name: "Portfolio V4", progress: 85, status: "In Progress" },
  { name: "AI Art Generator", progress: 100, status: "Completed" },
  { name: "Physics Engine", progress: 60, status: "In Progress" },
  { name: "Secret Garden", progress: 40, status: "In Progress" },
];

const skillsGrowth = [
  { skill: "React", level: 92, growth: +5 },
  { skill: "TypeScript", level: 88, growth: +8 },
  { skill: "Three.js", level: 75, growth: +15 },
  { skill: "WebGL", level: 65, growth: +20 },
  { skill: "Rust", level: 45, growth: +25 },
];

const recentAchievements = [
  { icon: Trophy, title: "7-Day Streak", description: "Coded every day for a week", color: "text-yellow-500" },
  { icon: Flame, title: "Early Bird", description: "Started coding before 6am", color: "text-orange-500" },
  { icon: Star, title: "Code Poet", description: "Created 5 beautiful algorithms", color: "text-purple-500" },
  { icon: Heart, title: "Open Source", description: "Contributed to 3 projects", color: "text-red-500" },
];

// Live clock component
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-5xl font-bold font-mono tracking-wider">
        {time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-muted-foreground mt-1">
        {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}

// Animated stat card
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = "primary" 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  trend?: string; 
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/20 to-primary/5",
    blue: "from-blue-500/20 to-blue-500/5",
    green: "from-green-500/20 to-green-500/5",
    orange: "from-orange-500/20 to-orange-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border border-border`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        {trend && (
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1 inline" />
            {trend}
          </Badge>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

// Coding activity chart
function CodingActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Weekly Coding Activity
        </CardTitle>
        <CardDescription>Hours spent coding this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={codingActivityData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorHours)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Project progress tracker
function ProjectProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectProgress.map((project) => (
          <div key={project.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{project.name}</span>
              <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                {project.status}
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Skills radar/growth
function SkillsGrowth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Skills Growth
        </CardTitle>
        <CardDescription>This month's improvement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {skillsGrowth.map((skill) => (
          <div key={skill.skill} className="flex items-center gap-4">
            <span className="w-24 text-sm font-medium">{skill.skill}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium w-8">{skill.level}%</span>
              <Badge variant="secondary" className="text-xs text-green-500">
                +{skill.growth}%
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Daily focus widget
function DailyFocus() {
  const [focus, setFocus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Today&apos;s Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="What are you focusing on today?"
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              autoFocus
            />
            <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="p-4 rounded-xl bg-card/50 cursor-pointer hover:bg-card transition-colors min-h-[80px] flex items-center"
          >
            {focus ? (
              <span className="text-lg">{focus}</span>
            ) : (
              <span className="text-muted-foreground">Click to set today&apos;s focus...</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick actions
function QuickActions() {
  const actions = [
    { icon: Terminal, label: "Open Terminal", href: "/terminal" },
    { icon: BookOpen, label: "Read Blog", href: "/blog" },
    { icon: Music, label: "Music", href: "/music" },
    { icon: Gamepad2, label: "Games", href: "/games" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-background">
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main dashboard page
export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {greeting}, <span className="text-gradient-animated">Nemo</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s your personal developer dashboard
              </p>
            </div>
            <LiveClock />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
003e
          <StatCard 
            icon={Code2} 
            label="Coding Hours" 
            value="42.2h" 
            trend="+12%" 
            color="primary" 
          />
          <StatCard 
            icon={GitBranch} 
            label="Commits" 
            value="82" 
            trend="+28%" 
            color="blue" 
          />
          <StatCard 
            icon={Trophy} 
            label="Achievements" 
            value="24" 
            trend="+4 new" 
            color="orange" 
          />
          <StatCard 
            icon={Coffee} 
            label="Coffee Consumed" 
            value="47" 
            trend="Caffeinated" 
            color="purple" 
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DailyFocus />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CodingActivityChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SkillsGrowth />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProjectProgress />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                      <div className={`p-2 rounded-lg bg-background ${achievement.color}`}>
                        <achievement.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
