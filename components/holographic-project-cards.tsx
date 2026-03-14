"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Eye,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  stars: number;
  forks: number;
  views: number;
  github?: string;
  demo?: string;
  color: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Generative Art Engine",
    description: "A powerful engine for creating algorithmic art with 50+ algorithms including fractals, particle systems, and mathematical visualizations.",
    image: "/art/neural-network.png",
    tags: ["TypeScript", "Canvas", "WebGL", "React"],
    stars: 128,
    forks: 34,
    views: 2500,
    github: "https://github.com/nemo/art-engine",
    demo: "/art-gallery",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Interactive Portfolio",
    description: "This very portfolio - featuring 3D animations, easter eggs, mini-games, and a fully interactive experience.",
    image: "/art/flow-field.png",
    tags: ["Next.js", "Framer Motion", "Tailwind", "TypeScript"],
    stars: 89,
    forks: 21,
    views: 1800,
    github: "https://github.com/nemo/portfolio",
    demo: "/",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    title: "Code Playground",
    description: "Live HTML/CSS/JS editor with real-time preview, examples, and sharing capabilities.",
    image: "/art/matrix-rain.png",
    tags: ["React", " Monaco Editor", "Sandpack"],
    stars: 67,
    forks: 15,
    views: 1200,
    github: "https://github.com/nemo/code-playground",
    demo: "/code-playground",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "4",
    title: "Dev Dashboard",
    description: "Analytics dashboard for developers with GitHub integration, productivity tracking, and insights.",
    image: "/art/wave-interference.png",
    tags: ["Next.js", "D3.js", "API", "Charts"],
    stars: 45,
    forks: 12,
    views: 890,
    github: "https://github.com/nemo/dev-dashboard",
    demo: "/stats",
    color: "from-orange-500 to-amber-500",
  },
];

interface HolographicCardProps {
  project: Project;
  index: number;
}

function HolographicCard({ project, index }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform({ rotateX, rotateY });
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="relative group"
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300">
        {/* Holographic Glare Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />

        {/* Glow Border */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-30">
                {index === 0 && "🎨"}
                {index === 1 && "✨"}
                {index === 2 && "💻"}
                {index === 3 && "📊"}
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                {project.stars}
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                <GitFork className="w-3 h-3 mr-1" />
                {project.forks}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {project.demo && (
                <Button size="sm" className="flex-1" asChild>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
              {project.github && (
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HolographicProjectCards() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Work</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Holographic{" "}
            <span className="text-gradient-animated">Project Cards</span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hover over these cards to see the 3D holographic effect in action.
            Each card responds to your mouse movement with realistic depth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <HolographicCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <a href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default HolographicProjectCards;
