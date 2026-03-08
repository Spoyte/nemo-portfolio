"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone,
  Terminal,
  Cpu,
  Globe,
  Lock,
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: React.ElementType;
  color: string;
  description: string;
  projects: number;
  years: number;
  related: string[];
}

const skillsData: Skill[] = [
  // Frontend
  { id: "react", name: "React", level: 95, category: "Frontend", icon: Code2, color: "#61DAFB", description: "Component-based UI development with hooks and context", projects: 45, years: 5, related: ["nextjs", "typescript", "redux"] },
  { id: "nextjs", name: "Next.js", level: 92, category: "Frontend", icon: Globe, color: "#000000", description: "Full-stack React framework with SSR and SSG", projects: 32, years: 4, related: ["react", "typescript", "vercel"] },
  { id: "typescript", name: "TypeScript", level: 90, category: "Frontend", icon: Code2, color: "#3178C6", description: "Type-safe JavaScript development", projects: 50, years: 4, related: ["react", "nextjs", "nodejs"] },
  { id: "tailwind", name: "Tailwind CSS", level: 95, category: "Frontend", icon: Palette, color: "#06B6D4", description: "Utility-first CSS framework", projects: 40, years: 4, related: ["css", "scss", "styled-components"] },
  
  // Backend
  { id: "nodejs", name: "Node.js", level: 88, category: "Backend", icon: Terminal, color: "#339933", description: "JavaScript runtime for server-side development", projects: 30, years: 5, related: ["typescript", "express", "nestjs"] },
  { id: "postgresql", name: "PostgreSQL", level: 85, category: "Backend", icon: Database, color: "#336791", description: "Advanced open-source relational database", projects: 25, years: 4, related: ["prisma", "sql", "redis"] },
  { id: "graphql", name: "GraphQL", level: 82, category: "Backend", icon: Database, color: "#E10098", description: "Query language for APIs", projects: 20, years: 3, related: ["apollo", "rest", "nodejs"] },
  
  // DevOps & Cloud
  { id: "docker", name: "Docker", level: 80, category: "DevOps", icon: Cloud, color: "#2496ED", description: "Containerization platform", projects: 18, years: 3, related: ["kubernetes", "aws", "ci-cd"] },
  { id: "aws", name: "AWS", level: 78, category: "DevOps", icon: Cloud, color: "#FF9900", description: "Cloud computing services", projects: 15, years: 3, related: ["docker", "terraform", "serverless"] },
  
  // Mobile
  { id: "react-native", name: "React Native", level: 75, category: "Mobile", icon: Smartphone, color: "#61DAFB", description: "Cross-platform mobile development", projects: 12, years: 3, related: ["react", "ios", "android"] },
  
  // Other
  { id: "rust", name: "Rust", level: 65, category: "Systems", icon: Cpu, color: "#DEA584", description: "Systems programming with safety guarantees", projects: 5, years: 2, related: ["wasm", "cpp", "systems"] },
  { id: "security", name: "Security", level: 70, category: "Other", icon: Lock, color: "#10B981", description: "Application security and best practices", projects: 20, years: 4, related: ["oauth", "jwt", "encryption"] },
];

const categories = ["All", "Frontend", "Backend", "DevOps", "Mobile", "Systems", "Other"];

function SkillNode({ skill, isSelected, onClick, index }: { 
  skill: Skill; 
  isSelected: boolean; 
  onClick: () => void;
  index: number;
}) {
  const Icon = skill.icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      onClick={onClick}
      className={`relative cursor-pointer group ${isSelected ? "z-20" : "z-10"}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        animate={{
          backgroundColor: isSelected ? skill.color : "transparent",
          opacity: isSelected ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Node */}
      <div
        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
          isSelected 
            ? "ring-4 ring-offset-4 ring-offset-background" 
            : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-background"
        }`}
        style={{
          background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}40)`,
          borderColor: skill.color,
          borderWidth: isSelected ? 3 : 2,
          boxShadow: isSelected ? `0 0 30px ${skill.color}50` : "none",
        }}
      >
        <Icon 
          className="w-6 h-6 md:w-8 md:h-8 mb-1 transition-transform group-hover:scale-110" 
          style={{ color: skill.color }} 
        />
        <span className="text-xs font-medium text-center px-1 leading-tight">
          {skill.name}
        </span>
      </div>
      
      {/* Level indicator */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i < Math.ceil(skill.level / 20) ? skill.color : "#374151",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const Icon = skill.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 bg-card/95 backdrop-blur-xl border-l border-border p-6 overflow-y-auto z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        ✕
      </button>
      
      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${skill.color}20` }}
          >
            <Icon className="w-8 h-8" style={{ color: skill.color }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{skill.name}</h2>
            <Badge variant="outline">{skill.category}</Badge>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6">{skill.description}</p>
        
        {/* Stats */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Proficiency</span>
              <span className="font-medium">{skill.level}%</span>
            </div>
            <Progress value={skill.level} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm">Projects</span>
              </div>
              <p className="text-2xl font-bold">{skill.projects}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Experience</span>
              </div>
              <p className="text-2xl font-bold">{skill.years} years</p>
            </div>
          </div>
        </div>
        
        {/* Related Skills */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Related Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skill.related.map((related) => (
              <Badge key={related} variant="secondary">
                {related}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Achievement */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="font-semibold">Achievement Unlocked</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {skill.level >= 90 ? "Master" : skill.level >= 80 ? "Expert" : skill.level >= 70 ? "Advanced" : "Intermediate"} level in {skill.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SkillTree() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "orbit">("grid");
  
  const filteredSkills = selectedCategory === "All" 
    ? skillsData 
    : skillsData.filter(s => s.category === selectedCategory);
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Visualization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Skills <span className="text-gradient-animated">Galaxy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my technical skills in an interactive 3D-like visualization. 
            Click on any skill to learn more.
          </p>
        </motion.div>
        
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-12">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === "orbit" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("orbit")}
          >
            Orbit View
          </Button>
        </div>
        
        {/* Skills Visualization */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center"
            >
              {filteredSkills.map((skill, index) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  isSelected={selectedSkill?.id === skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <OrbitView 
              skills={filteredSkills} 
              selectedSkill={selectedSkill}
              onSelectSkill={setSelectedSkill}
            />
          )}
        </AnimatePresence>
        
        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-6 rounded-2xl bg-card border text-center">
            <p className="text-3xl font-bold text-primary">{skillsData.length}</p>
            <p className="text-sm text-muted-foreground">Total Skills</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border text-center">
            <p className="text-3xl font-bold text-primary">{categories.length - 1}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border text-center">
            <p className="text-3xl font-bold text-primary">
              {Math.round(skillsData.reduce((acc, s) => acc + s.level, 0) / skillsData.length)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg. Level</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border text-center">
            <p className="text-3xl font-bold text-primary">
              {skillsData.reduce((acc, s) => acc + s.projects, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
        </motion.div>
      </div>
      
      {/* Skill Detail Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbitView({ 
  skills, 
  selectedSkill, 
  onSelectSkill 
}: { 
  skills: Skill[]; 
  selectedSkill: Skill | null;
  onSelectSkill: (skill: Skill) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => r + 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const centerX = 200;
  const centerY = 200;
  const orbitRadius = 150;
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-[500px] flex items-center justify-center"
    >
      {/* Center */}
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center z-20">
        <Zap className="w-10 h-10 text-white" />
      </div>
      
      {/* Orbit rings */}
      <div className="absolute w-[300px] h-[300px] rounded-full border border-border/30" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-border/20" />
      
      {/* Orbiting skills */}
      {skills.map((skill, index) => {
        const angle = (rotation + (index * 360 / skills.length)) * (Math.PI / 180);
        const x = centerX + orbitRadius * Math.cos(angle) - 40;
        const y = centerY + orbitRadius * Math.sin(angle) - 40;
        const Icon = skill.icon;
        
        return (
          <motion.div
            key={skill.id}
            className="absolute"
            animate={{ 
              left: x, 
              top: y,
              scale: selectedSkill?.id === skill.id ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button
              onClick={() => onSelectSkill(skill)}
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
                selectedSkill?.id === skill.id 
                  ? "ring-4 ring-primary ring-offset-4 ring-offset-background" 
                  : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${skill.color}30, ${skill.color}50)`,
                border: `2px solid ${skill.color}`,
                boxShadow: selectedSkill?.id === skill.id ? `0 0 30px ${skill.color}50` : "none",
              }}
            >
              <Icon className="w-6 h-6 mb-1" style={{ color: skill.color }} />
              <span className="text-xs font-medium">{skill.name}</span>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default SkillTree;