"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project3DCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  stars?: number;
  views?: number;
  featured?: boolean;
}

export function Project3DCard({
  title,
  description,
  image,
  tags,
  demoUrl,
  repoUrl,
  stars,
  views,
  featured = false,
}: Project3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
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
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="relative group"
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 ${
          featured ? "ring-2 ring-primary/50" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glare Effect */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
              transform: isHovered ? "translateZ(50px) scale(1.1)" : "translateZ(0) scale(1)",
              transition: "transform 0.3s ease",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

          {/* Stats Overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            {stars !== undefined && (
              <Badge variant="secondary" className="glass">
                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                {stars}
              </Badge>
            )}
            {views !== undefined && (
              <Badge variant="secondary" className="glass">
                <Eye className="w-3 h-3 mr-1" />
                {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {demoUrl && (
              <Button size="sm" className="flex-1 gap-1" asChild>
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Demo
                </a>
              </Button>
            )}
            {repoUrl && (
              <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Border Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-orange-500/20 to-primary/20 blur-xl" />
        </div>
      </div>
    </motion.div>
  );
}
