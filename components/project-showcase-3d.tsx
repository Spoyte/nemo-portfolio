"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project3D {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  color: string;
  featured?: boolean;
}

const projects: Project3D[] = [
  {
    id: "1",
    title: "AI Portfolio",
    description: "An intelligent portfolio with AI-powered features, generative art, and interactive experiences.",
    image: "🎨",
    tags: ["Next.js", "AI", "Framer Motion"],
    github: "https://github.com",
    demo: "https://nemo.dev",
    color: "from-purple-500 to-pink-500",
    featured: true,
  },
  {
    id: "2",
    title: "Code Cinema",
    description: "Watch code come to life with cinematic typewriter animations and syntax highlighting.",
    image: "🎬",
    tags: ["React", "TypeScript", "Canvas"],
    github: "https://github.com",
    demo: "/code-cinema",
    color: "from-blue-500 to-cyan-500",
    featured: true,
  },
  {
    id: "3",
    title: "Color Studio",
    description: "Generate beautiful color palettes with harmony algorithms and real-time preview.",
    image: "🎨",
    tags: ["React", "Color Theory", "Algorithms"],
    github: "https://github.com",
    demo: "/color-studio",
    color: "from-pink-500 via-rose-500 to-orange-500",
    featured: true,
  },
  {
    id: "4",
    title: "Art Generator",
    description: "Create algorithmic artwork with interactive controls and export options.",
    image: "✨",
    tags: ["Canvas", "Generative Art", "Algorithms"],
    github: "https://github.com",
    demo: "/art-studio",
    color: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    id: "5",
    title: "Dev Tools",
    description: "Essential utilities for developers: UUID, password generator, JSON formatter.",
    image: "🛠️",
    tags: ["Utilities", "React", "TypeScript"],
    github: "https://github.com",
    demo: "/dev-tools",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "6",
    title: "Speed Type",
    description: "A typing speed test with real-time WPM tracking and accuracy analysis.",
    image: "⌨️",
    tags: ["Game", "React", "Performance"],
    github: "https://github.com",
    demo: "/speed-type",
    color: "from-green-500 to-emerald-500",
  },
];

function ProjectCard3D({ project, index }: { project: Project3D; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group cursor-pointer"
      >
        {/* Card Background with Gradient */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
        
        {/* Main Card */}
        <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
              transform: "translateX(-100%)",
            }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Project Icon/Image */}
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-3xl mb-4`}>
            {project.image}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {project.demo && (
              <Button size="sm" variant="default" className="flex-1 gap-1" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Demo
                </a>
              </Button>
            )}
            {project.github && (
              <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* 3D Depth Layer */}
        <div
          style={{
            transform: "translateZ(-50px)",
            transformStyle: "preserve-3d",
          }}
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} opacity-20 blur-sm`}
        />
      </motion.div>
    </motion.div>
  );
}

export function ProjectShowcase3D() {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const filteredProjects = filter === "featured" 
    ? projects.filter(p => p.featured) 
    : projects;

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
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">3D Interactive</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Project{" "}
            <span className="text-gradient-animated">Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Hover over the cards to see the 3D tilt effect. Each project represents a unique challenge and creative solution.
          </p>

          {/* Filter */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "featured"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Featured
            </button>
          </div>
        </motion.div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard3D key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <a href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
