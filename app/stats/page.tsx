"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Code2, 
  Coffee, 
  Clock, 
  Zap, 
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Award,
  Terminal,
  GitBranch,
  Star,
  Activity
} from "lucide-react";
import { ScrollReveal, Counter } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon, label, value, suffix = "", color, delay = 0 }: StatCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative p-6 rounded-2xl bg-card border border-border overflow-hidden group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        <div className="relative">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-4`}>
            {icon}
          </div>
          
          <div className="text-3xl font-bold mb-1">
            <Counter to={value} suffix={suffix} />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {label}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

const weeklyData = [
  { day: "Mon", commits: 12, hours: 6 },
  { day: "Tue", commits: 18, hours: 8 },
  { day: "Wed", commits: 15, hours: 7 },
  { day: "Thu", commits: 22, hours: 9 },
  { day: "Fri", commits: 10, hours: 5 },
  { day: "Sat", commits: 8, hours: 4 },
  { day: "Sun", commits: 5, hours: 3 },
];

const skills = [
  { name: "React/Next.js", level: 95, color: "from-cyan-500 to-blue-500" },
  { name: "TypeScript", level: 90, color: "from-blue-500 to-indigo-500" },
  { name: "Node.js", level: 85, color: "from-green-500 to-emerald-500" },
  { name: "Python", level: 80, color: "from-yellow-500 to-orange-500" },
  { name: "CSS/Tailwind", level: 92, color: "from-pink-500 to-rose-500" },
  { name: "Database", level: 78, color: "from-purple-500 to-violet-500" },
];

const achievements = [
  { icon: <Flame className="w-5 h-5" />, label: "30 Day Streak", color: "text-orange-500" },
  { icon: <Star className="w-5 h-5" />, label: "100+ Stars", color: "text-yellow-500" },
  { icon: <GitBranch className="w-5 h-5" />, label: "50+ PRs", color: "text-blue-500" },
  { icon: <Award className="w-5 h-5" />, label: "Top Contributor", color: "text-purple-500" },
];

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Developer Analytics</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              By the{" "}
              <span className="text-gradient-animated">Numbers</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A deep dive into my coding journey, productivity metrics, and developer statistics.
            </p>
          </ScrollReveal>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <StatCard
              icon={<Code2 className="w-6 h-6 text-white" />}
              label="Lines of Code"
              value={150000}
              suffix="+"
              color="from-blue-500 to-cyan-500"
              delay={0}
            />
            <StatCard
              icon={<Coffee className="w-6 h-6 text-white" />}
              label="Cups of Coffee"
              value={2847}
              suffix=""
              color="from-amber-500 to-orange-500"
              delay={0.1}
            />
            <StatCard
              icon={<Clock className="w-6 h-6 text-white" />}
              label="Coding Hours"
              value={4200}
              suffix="+"
              color="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <StatCard
              icon={<Zap className="w-6 h-6 text-white" />}
              label="Projects Built"
              value={50}
              suffix="+"
              color="from-purple-500 to-pink-500"
              delay={0.3}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Github className="w-6 h-6 text-white" />}
              label="GitHub Commits"
              value={2847}
              suffix=""
              color="from-gray-500 to-slate-500"
              delay={0.4}
            />
            <StatCard
              icon={<Target className="w-6 h-6 text-white" />}
              label="Bugs Fixed"
              value={892}
              suffix=""
              color="from-red-500 to-rose-500"
              delay={0.5}
            />
            <StatCard
              icon={<Terminal className="w-6 h-6 text-white" />}
              label="Terminal Commands"
              value={15000}
              suffix="+"
              color="from-indigo-500 to-violet-500"
              delay={0.6}
            />
            <StatCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              label="Days Coding"
              value={730}
              suffix="+"
              color="from-teal-500 to-cyan-500"
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Weekly Activity */}
      <section className="py-24 border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Weekly Activity</h2>
            </div>
            <p className="text-muted-foreground">
              My coding patterns over the past week.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-end justify-between gap-4 h-64">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 h-full items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(day.commits / 25) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex-1 bg-primary/60 rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-card px-2 py-1 rounded border">
                          {day.commits} commits
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(day.hours / 10) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.05, duration: 0.5 }}
                        className="flex-1 bg-orange-500/60 rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-card px-2 py-1 rounded border">
                          {day.hours} hrs
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/60" />
                  <span className="text-sm text-muted-foreground">Commits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-orange-500/60" />
                  <span className="text-sm text-muted-foreground">Hours</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills Breakdown */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Skills{" "}
              <span className="text-gradient-animated">Breakdown</span>
            </h2>
            <p className="text-muted-foreground">
              Proficiency levels across different technologies.
            </p>
          </ScrollReveal>

          <div className="grid gap-6">
            {skills.map((skill, index) => (
              <ScrollReveal key={skill.name} delay={index * 0.1}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Recent{" "}
              <span className="text-gradient-animated">Achievements</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <ScrollReveal key={achievement.label} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl bg-card border border-border text-center"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-muted mb-4 ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div className="font-medium">{achievement.label}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Fun Facts */}
          <ScrollReveal className="mt-16">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border">
              <h3 className="text-xl font-bold mb-6 text-center">Fun Facts</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎵</div>
                  <div className="font-medium">Favorite Coding Music</div>
                  <div className="text-sm text-muted-foreground">Lo-fi Hip Hop</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🕐</div>
                  <div className="font-medium">Most Productive Hour</div>
                  <div className="text-sm text-muted-foreground">2:00 AM - 4:00 AM</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">☕</div>
                  <div className="font-medium">Coffee per Day</div>
                  <div className="text-sm text-muted-foreground">3.5 cups average</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
