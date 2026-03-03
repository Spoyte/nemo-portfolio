"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Clock, 
  Code2, 
  Coffee,
  Brain,
  Activity,
  TrendingUp,
  Calendar,
  Star,
  Award,
  GitBranch,
  Bug,
  CheckCircle2,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal, Counter } from "@/components/scroll-animations";
import confetti from "canvas-confetti";

// Achievement types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
}

// Daily goal type
interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  icon: React.ElementType;
  category: "coding" | "learning" | "health" | "creative";
}

// Stats data
const WEEKLY_STATS = [
  { day: "Mon", commits: 12, prs: 2, hours: 6 },
  { day: "Tue", commits: 18, prs: 3, hours: 8 },
  { day: "Wed", commits: 8, prs: 1, hours: 4 },
  { day: "Thu", commits: 24, prs: 4, hours: 9 },
  { day: "Fri", commits: 15, prs: 2, hours: 7 },
  { day: "Sat", commits: 6, prs: 0, hours: 3 },
  { day: "Sun", commits: 4, prs: 1, hours: 2 },
];

const LANGUAGE_STATS = [
  { name: "TypeScript", percentage: 45, color: "#3178C6", lines: 45230 },
  { name: "JavaScript", percentage: 25, color: "#F7DF1E", lines: 25100 },
  { name: "Python", percentage: 15, color: "#3776AB", lines: 15060 },
  { name: "CSS", percentage: 10, color: "#1572B6", lines: 10040 },
  { name: "Other", percentage: 5, color: "#9CA3AF", lines: 5020 },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Code before 7 AM for 7 days straight",
    icon: Coffee,
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    rarity: "rare",
    xp: 100
  },
  {
    id: "commit-streak",
    title: "Commit Streak",
    description: "Commit code for 30 consecutive days",
    icon: Flame,
    unlocked: true,
    progress: 45,
    maxProgress: 30,
    rarity: "epic",
    xp: 250
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Fix 50 bugs in production",
    icon: Bug,
    unlocked: true,
    progress: 67,
    maxProgress: 50,
    rarity: "rare",
    xp: 150
  },
  {
    id: "code-reviewer",
    title: "Code Reviewer",
    description: "Review 100 pull requests",
    icon: CheckCircle2,
    unlocked: false,
    progress: 78,
    maxProgress: 100,
    rarity: "common",
    xp: 75
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Code after midnight for 10 days",
    icon: Clock,
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    rarity: "common",
    xp: 50
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Use 10 different programming languages",
    icon: Code2,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: "legendary",
    xp: 500
  }
];

const DAILY_GOALS: DailyGoal[] = [
  { id: "1", title: "Ship a feature", completed: true, icon: RocketIcon, category: "coding" },
  { id: "2", title: "Read tech article", completed: true, icon: Brain, category: "learning" },
  { id: "3", title: "30min exercise", completed: false, icon: Activity, category: "health" },
  { id: "4", title: "Write documentation", completed: false, icon: Sparkles, category: "creative" },
];

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const RARITY_COLORS = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500"
};

export default function DeveloperStatsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [dailyGoals, setDailyGoals] = useState(DAILY_GOALS);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);

  // Calculate total XP and level
  useEffect(() => {
    const xp = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xp, 0);
    setTotalXP(xp);
    setLevel(Math.floor(xp / 500) + 1);
  }, [achievements]);

  const toggleGoal = (id: string) => {
    setDailyGoals(prev => 
      prev.map(goal => {
        if (goal.id === id && !goal.completed) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ["#22c55e"]
          });
        }
        return goal.id === id ? { ...goal, completed: !goal.completed } : goal;
      })
    );
  };

  const completedGoals = dailyGoals.filter(g => g.completed).length;
  const goalProgress = (completedGoals / dailyGoals.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Dashboard</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            My{" "}
            <span className="text-gradient-animated">Developer Stats</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track my coding journey, achievements, and daily productivity metrics.
          </p>
        </ScrollReveal>

        {/* Level Progress */}
        <ScrollReveal delay={0.1} className="mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-2xl font-bold"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {level}
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-3 h-3 text-white" />
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-lg">Level {level} Developer</p>
                      <p className="text-sm text-muted-foreground">{totalXP} XP earned</p>
                    </div>
                    <Badge variant="secondary">
                      {500 - (totalXP % 500)} XP to next level
                    </Badge>
                  </div>
                  <Progress value={(totalXP % 500) / 5} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Coding Streak", value: 45, suffix: " days", icon: Flame, color: "text-orange-500" },
            { label: "Commits Today", value: 12, suffix: "", icon: GitBranch, color: "text-blue-500" },
            { label: "Focus Hours", value: 6.5, suffix: "h", icon: Clock, color: "text-purple-500" },
            { label: "Bugs Fixed", value: 67, suffix: "", icon: Bug, color: "text-green-500" },
          ].map((stat, index) => (
            <ScrollReveal key={stat.label} delay={0.1 + index * 0.05}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">
                        {typeof stat.value === "number" && stat.value % 1 !== 0 
                          ? stat.value.toFixed(1) 
                          : stat.value}
                        <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="goals">Daily Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Commits, PRs, and coding hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {WEEKLY_STATS.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <span className="w-10 text-sm font-medium">{day.day}</span>
                        <div className="flex-1 flex gap-2">
                          <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(day.commits / 30) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                              className="h-full bg-blue-500 rounded-lg"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {day.commits} commits
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {day.hours}h
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Languages
                  </CardTitle>
                  <CardDescription>Code distribution by language</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LANGUAGE_STATS.map((lang, index) => (
                      <motion.div
                        key={lang.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="font-medium">{lang.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {lang.percentage}% ({lang.lines.toLocaleString()} lines)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: lang.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Commits", value: "2,847" },
                { label: "Pull Requests", value: "342" },
                { label: "Code Reviews", value: "156" },
                { label: "Projects", value: "28" },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden ${achievement.unlocked ? '' : 'opacity-60'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{achievement.title}</span>
                            <Badge className={RARITY_COLORS[achievement.rarity]}>
                              {achievement.rarity}
                            </Badge>
                            {achievement.unlocked && (
                              <Badge variant="outline" className="text-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Unlocked
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-2">
                            +{achievement.xp} XP
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Today's Goals
                </CardTitle>
                <CardDescription>
                  {completedGoals}/{dailyGoals.length} completed ({Math.round(goalProgress)}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={goalProgress} className="h-3" />
                </div>
                
                <div className="space-y-3">
                  {dailyGoals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        goal.completed 
                          ? "border-green-500/50 bg-green-500/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        goal.completed ? "bg-green-500 text-white" : "bg-muted"
                      }`}>
                        <goal.icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                          {goal.title}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {goal.category}
                        </Badge>
                      </div>
                      
                      {goal.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
