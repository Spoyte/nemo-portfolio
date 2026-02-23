"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Layers,
  Sparkles,
  Code2,
  Database,
  Palette,
  Server,
  Cloud,
  Wrench
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
  category: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  years: number;
  projects: number;
}

const skills: Skill[] = [
  // Frontend
  { name: "React", level: 95, category: "Frontend", color: "#61DAFB", icon: <Code2 className="w-4 h-4" />, description: "Component-based UI library", years: 5, projects: 45 },
  { name: "Next.js", level: 90, category: "Frontend", color: "#000000", icon: <Code2 className="w-4 h-4" />, description: "React framework for production", years: 4, projects: 32 },
  { name: "TypeScript", level: 92, category: "Frontend", color: "#3178C6", icon: <Code2 className="w-4 h-4" />, description: "Typed JavaScript", years: 4, projects: 50 },
  { name: "Tailwind CSS", level: 95, category: "Frontend", color: "#06B6D4", icon: <Palette className="w-4 h-4" />, description: "Utility-first CSS", years: 4, projects: 48 },
  { name: "Framer Motion", level: 88, category: "Frontend", color: "#FF0055", icon: <Sparkles className="w-4 h-4" />, description: "Animation library", years: 3, projects: 25 },
  
  // Backend
  { name: "Node.js", level: 85, category: "Backend", color: "#339933", icon: <Server className="w-4 h-4" />, description: "JavaScript runtime", years: 5, projects: 35 },
  { name: "PostgreSQL", level: 80, category: "Backend", color: "#336791", icon: <Database className="w-4 h-4" />, description: "Relational database", years: 4, projects: 28 },
  { name: "GraphQL", level: 78, category: "Backend", color: "#E10098", icon: <Server className="w-4 h-4" />, description: "Query language", years: 3, projects: 15 },
  { name: "Redis", level: 75, category: "Backend", color: "#DC382D", icon: <Database className="w-4 h-4" />, description: "In-memory store", years: 3, projects: 20 },
  
  // DevOps/Cloud
  { name: "Docker", level: 82, category: "DevOps", color: "#2496ED", icon: <Cloud className="w-4 h-4" />, description: "Containerization", years: 4, projects: 30 },
  { name: "AWS", level: 78, category: "DevOps", color: "#FF9900", icon: <Cloud className="w-4 h-4" />, description: "Cloud platform", years: 3, projects: 22 },
  { name: "Vercel", level: 90, category: "DevOps", color: "#000000", icon: <Cloud className="w-4 h-4" />, description: "Deployment platform", years: 4, projects: 40 },
  
  // Tools
  { name: "Git", level: 92, category: "Tools", color: "#F05032", icon: <Wrench className="w-4 h-4" />, description: "Version control", years: 6, projects: 55 },
  { name: "Figma", level: 85, category: "Tools", color: "#F24E1E", icon: <Palette className="w-4 h-4" />, description: "Design tool", years: 4, projects: 35 },
  { name: "VS Code", level: 95, category: "Tools", color: "#007ACC", icon: <Code2 className="w-4 h-4" />, description: "Code editor", years: 6, projects: 55 },
];

const categories = ["All", "Frontend", "Backend", "DevOps", "Tools"];

function SkillGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  const filteredSkills = useMemo(() => {
    return activeCategory === "All" ? skills : skills.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 0.2 }));
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate 3D position for each skill
  const getSkillPosition = (index: number, total: number) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    
    const radius = 180 * zoom;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    return { x, y, z };
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setZoom(z => Math.min(2, z + 0.2))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={autoRotate ? "default" : "outline"}
          onClick={() => setAutoRotate(!autoRotate)}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* 3D Globe Container */}
      <div 
        ref={containerRef}
        className="relative h-[500px] cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ perspective: "1000px" }}
      >
        {/* Globe Core */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Inner sphere */}
          <div 
            className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20"
            style={{
              transform: "translateZ(0)",
              boxShadow: "0 0 60px rgba(220, 38, 38, 0.3), inset 0 0 60px rgba(220, 38, 38, 0.1)",
            }}
          />

          {/* Skills */}
          {filteredSkills.map((skill, index) => {
            const pos = getSkillPosition(index, filteredSkills.length);
            const isSelected = selectedSkill?.name === skill.name;
            
            return (
              <motion.div
                key={skill.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSkill(skill);
                }}
              >
                <div 
                  className={`
                    relative flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer
                    transition-all duration-300
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  style={{
                    backgroundColor: `${skill.color}20`,
                    border: `1px solid ${skill.color}40`,
                    boxShadow: isSelected ? `0 0 20px ${skill.color}60` : 'none',
                  }}
                >
                  <span style={{ color: skill.color }}>{skill.icon}</span>
                  <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
                  
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle, ${skill.color}30 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Connection lines */}
          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20">
            {filteredSkills.map((skill, i) => {
              const pos1 = getSkillPosition(i, filteredSkills.length);
              return filteredSkills.slice(i + 1).map((_, j) => {
                const pos2 = getSkillPosition(i + j + 1, filteredSkills.length);
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={250 + pos1.x}
                    y1={250 + pos1.y}
                    x2={250 + pos2.x}
                    y2={250 + pos2.y}
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                );
              });
            })}
          </svg>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
          <p>Drag to rotate • Click skills for details</p>
        </div>
      </div>

      {/* Skill Detail Panel */}
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="overflow-hidden">
            <CardHeader 
              className="text-white"
              style={{ backgroundColor: selectedSkill.color }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  {selectedSkill.icon}
                </div>
                <div>
                  <CardTitle className="text-white">{selectedSkill.name}</CardTitle>
                  <p className="text-white/80 text-sm">{selectedSkill.category}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">{selectedSkill.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold" style={{ color: selectedSkill.color }}>
                    {selectedSkill.level}%
                  </div>
                  <div className="text-xs text-muted-foreground">Proficiency</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold" style={{ color: selectedSkill.color }}>
                    {selectedSkill.years}y
                  </div>
                  <div className="text-xs text-muted-foreground">Experience</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold" style={{ color: selectedSkill.color }}>
                    {selectedSkill.projects}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Skill Level</span>
                  <span>{selectedSkill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSkill.level}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: selectedSkill.color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export function SkillsVisualization() {
  return (
    <div className="w-full">
      <SkillGlobe />
    </div>
  );
}
