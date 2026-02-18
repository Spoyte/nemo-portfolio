"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.",
    image: "/images/project-1.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description: "Real-time data visualization dashboard with AI-powered insights and predictive analytics.",
    image: "/images/project-2.jpg",
    tags: ["React", "Python", "TensorFlow", "D3.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    id: "social-app",
    title: "Social Media App",
    description: "A modern social platform with real-time messaging, stories, and content recommendations.",
    image: "/images/project-3.jpg",
    tags: ["React Native", "Firebase", "Redux", "Node.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: true,
  },
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive component library with accessibility-first design tokens and documentation.",
    image: "/images/project-4.jpg",
    tags: ["TypeScript", "Storybook", "Tailwind", "Rollup"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: false,
  },
  {
    id: "task-manager",
    title: "Task Management App",
    description: "Collaborative project management tool with kanban boards, time tracking, and team features.",
    image: "/images/project-5.jpg",
    tags: ["Vue.js", "GraphQL", "Prisma", "AWS"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: false,
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    description: "Headless CMS built for creatives with media management and custom content types.",
    image: "/images/project-6.jpg",
    tags: ["Next.js", "Sanity", "Framer Motion", "Vercel"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    featured: false,
  },
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
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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
            A selection of projects I've worked on. Each one taught me something new.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 mb-20"
        >
          <h2 className="text-2xl font-bold">Featured Projects</h2>

          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <Link
                href={`/projects/${project.id}`}
                className={`group relative aspect-video rounded-2xl overflow-hidden bg-muted ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                  <Code2 className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="p-4 rounded-full bg-white text-black">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                </motion.div>
              </Link>

              <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <Link href={`/projects/${project.id}`}>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground">{project.description}</p>

                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Source
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-8">More Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Card className="group h-full hover:border-primary/50 transition-colors">
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
      </div>
    </div>
  );
}
