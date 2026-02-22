"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  Star, 
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  Code2,
  Lightbulb,
  Trophy,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "work" | "education" | "milestone" | "project" | "learning";
  location?: string;
  tags?: string[];
  link?: string;
  icon?: React.ReactNode;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2024 - Present",
    title: "Senior Full-Stack Developer",
    description: "Leading development of scalable web applications and mentoring junior developers. Architecting solutions for high-traffic platforms serving millions of users.",
    type: "work",
    location: "San Francisco, CA",
    tags: ["React", "Node.js", "AWS", "System Design"],
  },
  {
    id: "2",
    date: "2023",
    title: "AWS Certified Developer",
    description: "Achieved AWS Certified Developer - Associate certification. Deepened knowledge of cloud architecture, serverless computing, and DevOps practices.",
    type: "milestone",
    tags: ["AWS", "Cloud", "Certification"],
  },
  {
    id: "3",
    date: "2021 - 2024",
    title: "Full-Stack Developer",
    description: "Built and maintained multiple client projects ranging from e-commerce platforms to SaaS applications. Collaborated with cross-functional teams to deliver high-quality products.",
    type: "work",
    location: "Remote",
    tags: ["React", "TypeScript", "PostgreSQL", "GraphQL"],
  },
  {
    id: "4",
    date: "2022",
    title: "Launched Personal Portfolio",
    description: "Created and launched this portfolio website to showcase my work and share my learnings with the developer community. Open sourced the code for others to learn from.",
    type: "project",
    tags: ["Next.js", "Tailwind CSS", "Open Source"],
    link: "https://github.com/nemodev/portfolio",
  },
  {
    id: "5",
    date: "2021",
    title: "Meta Frontend Developer Certificate",
    description: "Completed Meta's Frontend Developer Professional Certificate program. Mastered React, UI/UX principles, and modern frontend development practices.",
    type: "education",
    tags: ["React", "UI/UX", "Certificate"],
  },
  {
    id: "6",
    date: "2020 - 2021",
    title: "Junior Web Developer",
    description: "Started my professional journey as a junior developer. Learned the fundamentals of web development, version control, and agile methodologies while working on real client projects.",
    type: "work",
    location: "New York, NY",
    tags: ["JavaScript", "HTML/CSS", "jQuery", "PHP"],
  },
  {
    id: "7",
    date: "2020",
    title: "First Open Source Contribution",
    description: "Made my first contribution to an open source project. A small bug fix that taught me the value of community and collaborative development.",
    type: "milestone",
    tags: ["Open Source", "Git", "Community"],
  },
  {
    id: "8",
    date: "2019",
    title: "Computer Science Degree",
    description: "Graduated with a Bachelor's degree in Computer Science. Focused on software engineering, algorithms, and web development.",
    type: "education",
    location: "University of Technology",
    tags: ["Computer Science", "Algorithms", "Software Engineering"],
  },
  {
    id: "9",
    date: "2018",
    title: "First Website Deployed",
    description: "Built and deployed my first website. A simple portfolio that sparked my passion for web development and design.",
    type: "project",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "10",
    date: "2017",
    title: "Hello World",
    description: "Wrote my first line of code. The beginning of an incredible journey into the world of software development.",
    type: "learning",
    tags: ["Python", "Programming Basics"],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'work': return <Briefcase className="h-5 w-5" />;
    case 'education': return <GraduationCap className="h-5 w-5" />;
    case 'milestone': return <Trophy className="h-5 w-5" />;
    case 'project': return <Rocket className="h-5 w-5" />;
    case 'learning': return <Lightbulb className="h-5 w-5" />;
    default: return <Star className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'work': return 'bg-blue-500';
    case 'education': return 'bg-green-500';
    case 'milestone': return 'bg-yellow-500';
    case 'project': return 'bg-purple-500';
    case 'learning': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

export default function JourneyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-sm font-medium">My Journey</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Development Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of my growth as a developer, from writing my first line of code 
            to building production applications used by thousands.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { label: "Years Coding", value: "7+", icon: Code2 },
            { label: "Projects Built", value: "50+", icon: Rocket },
            { label: "Technologies", value: "30+", icon: Lightbulb },
            { label: "Commits", value: "2K+", icon: Heart },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl border bg-card text-center"
            >
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

          {/* Timeline Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`absolute left-4 md:left-1/2 w-8 h-8 rounded-full ${getTypeColor(event.type)} 
                      flex items-center justify-center text-white z-10 md:-translate-x-1/2 shadow-lg`}
                  >
                    {getTypeIcon(event.type)}
                  </motion.div>

                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isLeft ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                            {event.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </>
                            )}
                          </div>
                          
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          
                          {event.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {event.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {event.link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={event.link} target="_blank" rel="noopener noreferrer">
                                View Project
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-500 mb-6">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">The Journey Continues</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Every day is a new opportunity to learn and grow. I&apos;m excited about 
            what the future holds and the amazing projects yet to be built.
          </p>
          
          <Button asChild>
            <a href="/contact">
              Let&apos;s Build Something Together
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
