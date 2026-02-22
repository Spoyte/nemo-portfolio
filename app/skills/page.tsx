"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  Code2,
  Palette,
  Database,
  Cloud,
  Wrench,
  Terminal,
  Star,
  Zap,
  Award,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

const certifications = [
  {
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023",
    icon: Cloud,
    credential: "AWS-DEV-12345",
  },
  {
    title: "Meta Frontend Developer",
    issuer: "Meta",
    date: "2022",
    icon: Code2,
    credential: "META-FE-67890",
  },
  {
    title: "Google UX Design",
    issuer: "Google",
    date: "2021",
    icon: Palette,
    credential: "GOOGLE-UX-54321",
  },
];

const learningGoals = [
  { name: "Rust", progress: 40, target: "Systems programming" },
  { name: "Three.js", progress: 60, target: "3D web graphics" },
  { name: "AI/ML", progress: 25, target: "Machine learning" },
  { name: "WebAssembly", progress: 35, target: "High-performance web" },
];

// Radar Chart Component
function SkillsRadar() {
  const skills = [
    { name: "Frontend", value: 92 },
    { name: "Backend", value: 85 },
    { name: "Design", value: 83 },
    { name: "DevOps", value: 79 },
    { name: "Tools", value: 88 },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const pathData = skills
    .map((skill, i) => {
      const point = getPoint(i, skill.value);
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles */}
        {[25, 50, 75, 100].map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            className="text-foreground"
          />
        ))}

        {/* Axes */}
        {skills.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeOpacity={0.1}
              className="text-foreground"
            />
          );
        })}

        {/* Data area */}
        <motion.path
          d={pathData}
          fill="rgba(220, 38, 38, 0.2)"
          stroke="rgb(220, 38, 38)"
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Data points */}
        {skills.map((skill, i) => {
          const point = getPoint(i, skill.value);
          return (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={5}
              fill="rgb(220, 38, 38)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, i) => {
          const point = getPoint(i, 115);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-foreground font-medium"
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SkillBar({ skill, index }: { skill: typeof skillCategories[0]["skills"][0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{skill.name}</span>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="text-xs text-muted-foreground"
          >
            {skill.description}
          </motion.div>
        </div>
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

        {/* Skills Radar + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Skill Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SkillsRadar />
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "React / Next.js", level: 95 },
                  { name: "TypeScript", level: 92 },
                  { name: "Tailwind CSS", level: 95 },
                  { name: "Node.js", level: 88 },
                  { name: "UI/UX Design", level: 85 },
                ].map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Skills Tabs */}
        <Tabs defaultValue="frontend" className="w-full mb-20">
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
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Tech Stack</h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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

        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Currently Learning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningGoals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">{goal.target}</p>
                      </div>
                      <Badge variant="outline">{goal.progress}%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${goal.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <cert.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary">{cert.date}</Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {cert.credential}
                          </span>
                        </div>
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
