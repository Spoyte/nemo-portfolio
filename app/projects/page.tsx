"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Code2, Folder } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCaseStudies } from "@/components/project-case-studies";
import { ImageGallery } from "@/components/image-gallery";

const otherProjects = [
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive component library with accessibility-first design tokens and documentation.",
    tags: ["TypeScript", "Storybook", "Tailwind", "Rollup"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "task-manager",
    title: "Task Management App",
    description: "Collaborative project management tool with kanban boards, time tracking, and team features.",
    tags: ["Vue.js", "GraphQL", "Prisma", "AWS"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    description: "Headless CMS built for creatives with media management and custom content types.",
    tags: ["Next.js", "Sanity", "Framer Motion", "Vercel"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "weather-app",
    title: "Weather Dashboard",
    description: "Real-time weather tracking with interactive maps and 7-day forecasts.",
    tags: ["React", "OpenWeather API", "Mapbox", "Chart.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "chat-app",
    title: "Real-time Chat",
    description: "End-to-end encrypted messaging platform with file sharing and voice messages.",
    tags: ["Socket.io", "Express", "MongoDB", "WebRTC"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
  {
    id: "finance-tracker",
    title: "Personal Finance",
    description: "Expense tracking and budgeting tool with bank integration and analytics.",
    tags: ["React Native", "Plaid API", "Firebase", "D3.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
  },
];

const projectImages = [
  { src: "/images/project-1.jpg", alt: "E-Commerce Platform", caption: "E-Commerce Dashboard" },
  { src: "/images/project-2.jpg", alt: "AI Analytics", caption: "Analytics Dashboard" },
  { src: "/images/project-3.jpg", alt: "Social App", caption: "Social Media App" },
  { src: "/images/project-4.jpg", alt: "Design System", caption: "Design System Components" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of projects I've worked on. Each one taught me something new
            and pushed me to grow as a developer.
          </p>
        </motion.div>

        {/* Featured Projects with Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Folder className="h-6 w-6 text-primary" />
            Featured Case Studies
          </h2>
        </motion.div>

        <ProjectCaseStudies />

        {/* Project Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mb-12"
        >
          <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
          <ImageGallery images={projectImages} />
        </motion.div>

        {/* Other Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            More Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Card className="group h-full hover:border-primary/50 transition-all">
                  <Link href={`/projects/${project.id}`}>
                    <CardHeader className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center">
                          <Code2 className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    </CardHeader>
                  </Link>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to see more? Check out my GitHub for all my open source work.
          </p>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/nemodev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              View GitHub Profile
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
