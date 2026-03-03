"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  category: string;
}

const SKILLS = [
  // Frontend
  { name: "React", category: "frontend", color: "#61DAFB" },
  { name: "Next.js", category: "frontend", color: "#ffffff" },
  { name: "TypeScript", category: "frontend", color: "#3178C6" },
  { name: "Tailwind", category: "frontend", color: "#06B6D4" },
  { name: "Vue", category: "frontend", color: "#4FC08D" },
  // Backend
  { name: "Node.js", category: "backend", color: "#339933" },
  { name: "Python", category: "backend", color: "#3776AB" },
  { name: "PostgreSQL", category: "backend", color: "#336791" },
  { name: "GraphQL", category: "backend", color: "#E10098" },
  { name: "Redis", category: "backend", color: "#DC382D" },
  // DevOps
  { name: "Docker", category: "devops", color: "#2496ED" },
  { name: "AWS", category: "devops", color: "#FF9900" },
  { name: "Kubernetes", category: "devops", color: "#326CE5" },
  { name: "CI/CD", category: "devops", color: "#2088FF" },
  // Tools
  { name: "Git", category: "tools", color: "#F05032" },
  { name: "Figma", category: "tools", color: "#F24E1E" },
  { name: "VS Code", category: "tools", color: "#007ACC" },
];

export function SkillConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const nodesRef = useRef<SkillNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      // Initialize nodes
      nodesRef.current = SKILLS.map((skill, i) => ({
        id: skill.name,
        name: skill.name,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 25 + Math.random() * 10,
        color: skill.color,
        category: skill.category,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Check for hover
      const mouse = mouseRef.current;
      let hovered = null;
      nodesRef.current.forEach((node) => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius) {
          hovered = node.id;
        }
      });
      setHoveredSkill(hovered);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update and draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other) => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150 && node.category === other.category) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.3 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - dist / 200)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary check
        if (node.x < node.radius || node.x > canvas.width - node.radius) node.vx *= -1;
        if (node.y < node.radius || node.y > canvas.height - node.radius) node.vy *= -1;

        // Draw node
        const isHovered = hoveredSkill === node.id;
        
        // Glow effect
        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = node.color;
        } else {
          ctx.shadowBlur = 0;
        }

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? node.radius * 1.2 : node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}20`;
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = isHovered ? node.color : "#ffffff";
        ctx.font = `${isHovered ? "bold " : ""}12px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.name, node.x, node.y);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [hoveredSkill]);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-black/50 border border-border">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
        {["frontend", "backend", "devops", "tools"].map((cat) => (
          <div key={cat} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: SKILLS.find(s => s.category === cat)?.color 
              }}
            />
            <span className="capitalize text-muted-foreground">{cat}</span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 text-xs text-muted-foreground">
        Hover to interact
      </div>
    </div>
  );
}
