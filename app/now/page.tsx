"use client";

import { motion } from "framer-motion";
import { Calendar, Briefcase, BookOpen, Lightbulb, Target, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const currentWork = {
  title: "Building a SaaS Platform",
  description: "Developing a comprehensive project management tool for remote teams.",
  progress: 65,
  status: "In Progress",
};

const currentlyReading = [
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    progress: 75,
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    progress: 30,
  },
];

const learning = [
  { name: "Rust", level: 40, description: "Systems programming and WebAssembly" },
  { name: "Three.js", level: 60, description: "3D web graphics and animations" },
  { name: "AI/ML", level: 25, description: "Machine learning fundamentals" },
];

const sideProjects = [
  {
    title: "CLI Tool",
    description: "A command-line utility for automating daily development tasks.",
    tech: ["Rust", "Clap"],
  },
  {
    title: "Browser Extension",
    description: "Productivity extension for managing browser tabs and sessions.",
    tech: ["TypeScript", "Plasmo"],
  },
];

const goals = [
  { text: "Contribute to 5 open source projects", completed: 3 },
  { text: "Learn Rust to proficiency", completed: 1 },
  { text: "Write 12 technical blog posts", completed: 8 },
  { text: "Speak at a tech conference", completed: 0 },
];

export default function NowPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Now</h1>
          <p className="text-muted-foreground">
            What I'm currently working on, learning, and thinking about.{" "}
            <span className="text-sm">(Last updated: February 2025)</span>
          </p>
        </motion.div>

        {/* Current Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Currently Working On
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{currentWork.title}</h3>
                  <Badge>{currentWork.status}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{currentWork.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentWork.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentWork.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Currently Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentlyReading.map((book) => (
                <div key={book.title}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <span className="text-sm font-medium">{book.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${book.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {learning.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge variant="outline">{item.level}%</Badge>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Side Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Side Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sideProjects.map((project) => (
                  <div
                    key={project.title}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                2025 Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={goal.text} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        goal.completed > 0
                          ? "border-primary bg-primary"
                          : "border-muted"
                      }`}
                    >
                      {goal.completed > 0 && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className={goal.completed > 0 ? "" : "text-muted-foreground"}>
                      {goal.text}
                    </span>
                    {goal.completed > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {goal.completed} done
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
