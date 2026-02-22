"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Github, 
  ExternalLink, 
  Code2, 
  Folder,
  Layers,
  Star,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCaseStudies, CASE_STUDIES } from "@/components/project-case-studies";
import { ImageGallery } from "@/components/image-gallery";
import { useState, useMemo } from "react";

const otherProjects = [
  {
    id: "design-system",
    title: "Design System",
    description: "A comprehensive component library with accessibility-first design tokens and documentation.",
    tags: ["TypeScript", "Storybook", "Tailwind", "Rollup"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 234,
    forks: 45,
  },
  {
    id: "task-manager",
    title: "Task Management App",
    description: "Collaborative project management tool with kanban boards, time tracking, and team features.",
    tags: ["Vue.js", "GraphQL", "Prisma", "AWS"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 189,
    forks: 32,
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    description: "Headless CMS built for creatives with media management and custom content types.",
    tags: ["Next.js", "Sanity", "Framer Motion", "Vercel"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 567,
    forks: 89,
  },
  {
    id: "weather-app",
    title: "Weather Dashboard",
    description: "Real-time weather tracking with interactive maps and 7-day forecasts.",
    tags: ["React", "OpenWeather API", "Mapbox", "Chart.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 123,
    forks: 21,
  },
  {
    id: "chat-app",
    title: "Real-time Chat",
    description: "End-to-end encrypted messaging platform with file sharing and voice messages.",
    tags: ["Socket.io", "Express", "MongoDB", "WebRTC"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 445,
    forks: 67,
  },
  {
    id: "finance-tracker",
    title: "Personal Finance",
    description: "Expense tracking and budgeting tool with bank integration and analytics.",
    tags: ["React Native", "Plaid API", "Firebase", "D3.js"],
    demoUrl: "https://demo.example.com",
    repoUrl: "https://github.com",
    stars: 278,
    forks: 43,
  },
];

const projectImages = [
  { src: "/images/project-1.jpg", alt: "E-Commerce Platform", caption: "E-Commerce Dashboard" },
  { src: "/images/project-2.jpg", alt: "AI Analytics", caption: "Analytics Dashboard" },
  { src: "/images/project-3.jpg", alt: "Social App", caption: "Social Media App" },
  { src: "/images/project-4.jpg", alt: "Design System", caption: "Design System Components" },
];

const allTags = Array.from(new Set(otherProjects.flatMap(p => p.tags)));

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return otherProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || project.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Featured Case Studies</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of projects I&apos;ve worked on. Each one taught me something new
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
          className="mt-32 mb-12"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Project Gallery
          </h2>
          <ImageGallery images={projectImages} />
        </motion.div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              More Projects
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Card className="group h-full hover:border-primary/50 transition-all overflow-hidden">
                  <Link href={`/projects/${project.id}`}>
                    <CardHeader className="p-0">
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-orange-500/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-bold text-gradient opacity-50">
                            {project.title[0]}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.div 
                          className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ y: 20 }}
                          whileHover={{ y: 0 }}
                        >
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {project.stars}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Code2 className="h-3 w-3 mr-1" />
                            {project.forks}
                          </Badge>
                        </motion.div>
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
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Source
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
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
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
