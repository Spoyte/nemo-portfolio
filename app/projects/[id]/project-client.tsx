"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
  date: string;
  role: string;
}

interface ProjectClientProps {
  project: Project;
}

export function ProjectClient({ project }: ProjectClientProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link href="/projects">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Button>
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {project.date}
              </div>
              <div className="text-sm text-muted-foreground">{project.role}</div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            </div>
          </header>

          {/* Hero Image */}
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center mb-12">
            <span className="text-8xl font-bold text-gradient">{project.title[0]}</span>
          </div>

          <Separator className="mb-12" />

          {/* Content */}
          <article className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8">{project.description}</p>

            {project.longDescription.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>;
              }
              if (paragraph.trim() === '') {
                return null;
              }
              return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
            })}
          </article>

          <Separator className="my-12" />

          {/* Footer */}
          <footer className="flex items-center justify-between">
            <Link href="/projects">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                All Projects
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Share
              </Button>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
