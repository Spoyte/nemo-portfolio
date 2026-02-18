"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Code2,
  Palette,
  Database,
  Cloud,
  Wrench,
  Terminal,
  Star,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    icon: Code2,
    skills: [
      { name: "React", level: 95, description: "Advanced hooks, patterns, and performance optimization" },
      { name: "Next.js", level: 90, description: "App Router, SSR, SSG, and API routes" },
      { name: "TypeScript", level: 92, description: "Type-safe development and advanced patterns" },
      { name: "Tailwind CSS", level: 95, description: "Utility-first styling and custom configurations" },
      { name: "Framer Motion", level: 85, description: "Complex animations and gestures" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Database,
    skills: [
      { name: "Node.js", level: 88, description: "Event-driven architecture and performance" },
      { name: "PostgreSQL", level: 82, description: "Complex queries, indexing, and optimization" },
      { name: "GraphQL", level: 80, description: "Schema design and resolver optimization" },
      { name: "Redis", level: 75, description: "Caching strategies and data structures" },
      { name: "Prisma", level: 85, description: "Type-safe database access" },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    skills: [
      { name: "Figma", level: 85, description: "UI/UX design and prototyping" },
      { name: "Adobe XD", level: 75, description: "Wireframing and user flows" },
      { name: "Design Systems", level: 90, description: "Component libraries and documentation" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Cloud,
    skills: [
      { name: "Docker", level: 80, description: "Containerization and orchestration" },
      { name: "AWS", level: 78, description: "EC2, S3, Lambda, and CloudFront" },
      { name: "Vercel", level: 95, description: "Edge functions and deployments" },
      { name: "CI/CD", level: 82, description: "GitHub Actions and automated pipelines" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    skills: [
      { name: "Git", level: 92, description: "Advanced workflows and conflict resolution" },
      { name: "VS Code", level: 95, description: "Extensions and custom configurations" },
      { name: "Jest", level: 85, description: "Unit and integration testing" },
      { name: "Storybook", level: 80, description: "Component documentation and testing" },
    ],
  },
];

function SkillBar({ skill, index }: { skill: typeof skillCategories[0]["skills"][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
              />
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p>{skill.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function SkillsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Skills & Expertise</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and the technologies I work with.
          </p>
        </motion.div>

        {/* Skills Tabs */}
        <Tabs defaultValue="frontend" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-3xl mx-auto mb-12">
            {skillCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {skillCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.label} Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Tech Stack Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "React", color: "#61DAFB" },
              { name: "Next.js", color: "#000000" },
              { name: "TypeScript", color: "#3178C6" },
              { name: "Tailwind", color: "#06B6D4" },
              { name: "Node.js", color: "#339933" },
              { name: "PostgreSQL", color: "#336791" },
              { name: "GraphQL", color: "#E10098" },
              { name: "Redis", color: "#DC382D" },
              { name: "Docker", color: "#2496ED" },
              { name: "AWS", color: "#FF9900" },
              { name: "Figma", color: "#F24E1E" },
              { name: "Git", color: "#F05032" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all text-center group"
              >
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: tech.color }}
                >
                  {tech.name[0]}
                </div>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AWS Certified Developer",
                issuer: "Amazon Web Services",
                date: "2023",
                icon: Cloud,
              },
              {
                title: "Meta Frontend Developer",
                issuer: "Meta",
                date: "2022",
                icon: Code2,
              },
              {
                title: "Google UX Design",
                issuer: "Google",
                date: "2021",
                icon: Palette,
              },
            ].map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <cert.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground mt-1">{cert.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
