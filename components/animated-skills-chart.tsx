"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Code2, Palette, Database, Cloud, Smartphone, Terminal, Sparkles, TrendingUp } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
  icon: React.ElementType;
}

const SKILLS_DATA: Skill[] = [
  { name: "React", level: 95, category: "Frontend", color: "#61DAFB", icon: Code2 },
  { name: "Next.js", level: 92, category: "Frontend", color: "#000000", icon: Code2 },
  { name: "TypeScript", level: 90, category: "Frontend", color: "#3178C6", icon: Code2 },
  { name: "Tailwind", level: 95, category: "Frontend", color: "#06B6D4", icon: Palette },
  { name: "Node.js", level: 88, category: "Backend", color: "#339933", icon: Terminal },
  { name: "PostgreSQL", level: 85, category: "Backend", color: "#336791", icon: Database },
  { name: "GraphQL", level: 82, category: "Backend", color: "#E10098", icon: Database },
  { name: "Docker", level: 80, category: "DevOps", color: "#2496ED", icon: Cloud },
  { name: "AWS", level: 78, category: "DevOps", color: "#FF9900", icon: Cloud },
  { name: "React Native", level: 75, category: "Mobile", color: "#61DAFB", icon: Smartphone },
  { name: "Rust", level: 65, category: "Systems", color: "#DEA584", icon: Terminal },
  { name: "Security", level: 70, category: "Other", color: "#10B981", icon: Terminal },
];

const RADAR_DATA = [
  { subject: "Frontend", A: 95, fullMark: 100 },
  { subject: "Backend", A: 85, fullMark: 100 },
  { subject: "DevOps", A: 79, fullMark: 100 },
  { subject: "Mobile", A: 75, fullMark: 100 },
  { subject: "Systems", A: 65, fullMark: 100 },
  { subject: "Design", A: 88, fullMark: 100 },
];

export function AnimatedSkillsChart() {
  const [viewMode, setViewMode] = useState<"radar" | "bars" | "grid">("radar");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({});

  // Animate skill levels on mount
  useEffect(() => {
    const initial: Record<string, number> = {};
    SKILLS_DATA.forEach((skill) => {
      initial[skill.name] = 0;
    });
    setAnimatedLevels(initial);

    const timer = setTimeout(() => {
      const final: Record<string, number> = {};
      SKILLS_DATA.forEach((skill) => {
        final[skill.name] = skill.level;
      });
      setAnimatedLevels(final);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: Skill }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.category}</p>
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              <span>Proficiency</span>
              <span className="font-medium">{data.level}%</span>
            </div>
            <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${animatedLevels[data.name] || 0}%`,
                  backgroundColor: data.color,
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Skill Analytics</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills{" "}
            <span className="text-gradient-animated">Visualization</span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive charts showing my technical proficiency across different domains.
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[
            { id: "radar", label: "Radar", icon: Sparkles },
            { id: "bars", label: "Bars", icon: TrendingUp },
            { id: "grid", label: "Grid", icon: Code2 },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as typeof viewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === mode.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <mode.icon className="w-4 h-4" />
              {mode.label}
            </button>
          ))}
        </motion.div>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-orange-500/10 to-primary/10 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative p-6 md:p-8 rounded-2xl bg-card border min-h-[500px]">
            <AnimatePresence mode="wait">
              {viewMode === "radar" && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-[400px] md:h-[450px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {viewMode === "bars" && (
                <motion.div
                  key="bars"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-[400px] md:h-[450px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SKILLS_DATA} layout="vertical" margin={{ left: 80 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={20}>
                        {SKILLS_DATA.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            opacity={hoveredSkill === entry.name ? 1 : 0.8}
                            onMouseEnter={() => setHoveredSkill(entry.name)}
                            onMouseLeave={() => setHoveredSkill(null)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {viewMode === "grid" && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {SKILLS_DATA.map((skill, index) => {
                    const Icon = skill.icon;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-xl bg-muted/50 border hover:border-primary/50 transition-all cursor-pointer group"
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${skill.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: skill.color }} />
                          </div>
                          <span className="font-medium text-sm">{skill.name}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{skill.category}</span>
                            <span className="font-medium">{animatedLevels[skill.name] || 0}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: skill.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${animatedLevels[skill.name] || 0}%` }}
                              transition={{ duration: 1, delay: index * 0.05 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Skills", value: SKILLS_DATA.length },
            { label: "Categories", value: new Set(SKILLS_DATA.map((s) => s.category)).size },
            { label: "Avg Level", value: `${Math.round(SKILLS_DATA.reduce((a, b) => a + b.level, 0) / SKILLS_DATA.length)}%` },
            { label: "Top Skill", value: "React" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-xl bg-card border text-center"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
