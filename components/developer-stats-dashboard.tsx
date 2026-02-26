"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Brain,
  Code2,
  Palette,
  Terminal,
  Globe,
  Database,
  Cpu,
  Layers,
  Zap,
  Star,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  GitBranch,
  Coffee,
  Music,
  BookOpen,
  Gamepad2,
  Heart,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Developer stats data
const devStats = {
  coding: {
    daily: [3, 5, 8, 6, 9, 4, 7],
    weekly: 42,
    monthly: 168,
    streak: 12,
    languages: [
      { name: "TypeScript", percentage: 45, color: "#3178C6" },
      { name: "JavaScript", percentage: 25, color: "#F7DF1E" },
      { name: "Python", percentage: 15, color: "#3776AB" },
      { name: "Rust", percentage: 10, color: "#DEA584" },
      { name: "Other", percentage: 5, color: "#9CA3AF" },
    ],
  },
  projects: {
    completed: 47,
    inProgress: 5,
    contributions: 234,
    stars: 1289,
  },
  learning: {
    current: ["Rust", "Three.js", "AI/ML"],
    completed: ["React", "TypeScript", "Node.js", "GraphQL", "Docker"],
    hours: 342,
  },
};

// Fun facts
const funFacts = [
  { icon: Coffee, label: "Cups of Coffee", value: 1337, suffix: "+" },
  { icon: Music, label: "Hours of Lo-Fi", value: 420, suffix: "" },
  { icon: BookOpen, label: "Books Read", value: 23, suffix: "" },
  { icon: Gamepad2, label: "Games Played", value: 15, suffix: "" },
];

// Skill tree data
interface SkillNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  dependencies: string[];
  description: string;
}

const skillTree: SkillNode[] = [
  {
    id: "html",
    name: "HTML5",
    icon: <Code2 className="h-4 w-4" />,
    level: 10,
    maxLevel: 10,
    unlocked: true,
    dependencies: [],
    description: "Semantic markup mastery",
  },
  {
    id: "css",
    name: "CSS3",
    icon: <Palette className="h-4 w-4" />,
    level: 9,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["html"],
    description: "Styling and animations",
  },
  {
    id: "js",
    name: "JavaScript",
    icon: <Zap className="h-4 w-4" />,
    level: 9,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["html"],
    description: "Dynamic programming",
  },
  {
    id: "react",
    name: "React",
    icon: <Layers className="h-4 w-4" />,
    level: 8,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["js"],
    description: "Component-based UI",
  },
  {
    id: "ts",
    name: "TypeScript",
    icon: <Code2 className="h-4 w-4" />,
    level: 7,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["js"],
    description: "Type-safe JavaScript",
  },
  {
    id: "next",
    name: "Next.js",
    icon: <Rocket className="h-4 w-4" />,
    level: 7,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["react", "ts"],
    description: "Full-stack React",
  },
  {
    id: "node",
    name: "Node.js",
    icon: <Terminal className="h-4 w-4" />,
    level: 6,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["js"],
    description: "Server-side JavaScript",
  },
  {
    id: "db",
    name: "Databases",
    icon: <Database className="h-4 w-4" />,
    level: 5,
    maxLevel: 10,
    unlocked: true,
    dependencies: ["node"],
    description: "Data persistence",
  },
  {
    id: "rust",
    name: "Rust",
    icon: <Cpu className="h-4 w-4" />,
    level: 3,
    maxLevel: 10,
    unlocked: true,
    dependencies: [],
    description: "Systems programming",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export function DeveloperStatsDashboard() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "activity">("overview");

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {(["overview", "skills", "activity"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Projects</p>
                      <p className="text-2xl font-bold">
                        <AnimatedCounter value={devStats.projects.completed} />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <GitBranch className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contributions</p>
                      <p className="text-2xl font-bold">
                        <AnimatedCounter value={devStats.projects.contributions} />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">GitHub Stars</p>
                      <p className="text-2xl font-bold">
                        <AnimatedCounter value={devStats.projects.stars} />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Clock className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coding Streak</p>
                      <p className="text-2xl font-bold">{devStats.coding.streak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coding Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weekly Coding Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 gap-2">
                  {devStats.coding.daily.map((hours, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(hours / 10) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full bg-primary/20 rounded-t-lg relative group"
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all"
                          style={{ height: `${(hours / 10) * 100}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {hours}h
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {devStats.coding.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{lang.name}</span>
                        <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lang.percentage}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Fun Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {funFacts.map((fact) => (
                      <div key={fact.label} className="text-center p-4 bg-muted rounded-lg">
                        <fact.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">
                          <AnimatedCounter value={fact.value} suffix={fact.suffix} />
                        </p>
                        <p className="text-xs text-muted-foreground">{fact.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "skills" && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Skill Tree
                </CardTitle>
                <CardDescription>
                  Click on a skill to see details. Level up by building projects!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {skillTree.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedSkill(skill)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                        skill.unlocked
                          ? "border-primary/50 bg-primary/5 hover:border-primary"
                          : "border-muted bg-muted/50 opacity-50"
                      )}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={cn(
                            "p-3 rounded-full mb-2",
                            skill.unlocked ? "bg-primary/20" : "bg-muted"
                          )}
                        >
                          {skill.icon}
                        </div>
                        <p className="font-medium text-sm">{skill.name}</p>
                        <div className="mt-2 w-full">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{
                                width: `${(skill.level / skill.maxLevel) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Lv.{skill.level}
                          </p>
                        </div>
                      </div>

                      {skill.level === skill.maxLevel && (
                        <div className="absolute -top-2 -right-2">
                          <Award className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {selectedSkill && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedSkill.name}</h3>
                        <p className="text-muted-foreground">{selectedSkill.description}</p>
                      </div>
                      <Badge variant={selectedSkill.unlocked ? "default" : "secondary"}>
                        {selectedSkill.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm mb-2">Progress to next level</p>
                      <Progress
                        value={(selectedSkill.level / selectedSkill.maxLevel) * 100}
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {[
              {
                icon: Code2,
                action: "Pushed 3 commits to",
                target: "nemo-portfolio",
                time: "2 hours ago",
                color: "text-green-500",
              },
              {
                icon: Star,
                action: "Starred",
                target: "vercel/next.js",
                time: "5 hours ago",
                color: "text-yellow-500",
              },
              {
                icon: GitBranch,
                action: "Created PR in",
                target: "awesome-react-hooks",
                time: "1 day ago",
                color: "text-purple-500",
              },
              {
                icon: BookOpen,
                action: "Completed chapter 5 of",
                target: "Designing Data-Intensive Applications",
                time: "2 days ago",
                color: "text-blue-500",
              },
            ].map((activity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-muted", activity.color)}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p>
                        {activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
