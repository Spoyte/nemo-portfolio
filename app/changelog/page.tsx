"use client";

import { motion } from "framer-motion";
import { 
  GitCommit, 
  Sparkles, 
  Calendar, 
  Tag,
  Rocket,
  Zap,
  Star,
  Heart,
  Code2,
  Palette,
  Layers,
  Cpu,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  type: "feature" | "improvement" | "fix" | "design";
  highlights: string[];
  tags: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    id: "1",
    version: "2.0.0",
    date: "February 2026",
    title: "The Renaissance Update",
    description: "A complete overhaul with new pages, enhanced interactions, and experimental features.",
    type: "feature",
    highlights: [
      "Added Changelog page with version history",
      "New Bookmarks page for curated resources",
      "Experiments page with creative coding demos",
      "Enhanced Bento Grid layout on homepage",
      "New micro-interactions throughout",
      "Spotlight card effects",
      "Animated counters and text reveals",
    ],
    tags: ["Major Release", "UI/UX", "New Features"],
  },
  {
    id: "2",
    version: "1.5.0",
    date: "January 2026",
    title: "The Playground Expansion",
    description: "Introduced interactive elements and gamification features.",
    type: "feature",
    highlights: [
      "Added Playground page with interactive demos",
      "3D Skills Globe visualization",
      "AI Project Generator",
      "Achievement system with XP and levels",
      "Typing speed test",
      "Color palette generator",
    ],
    tags: ["Interactive", "Gamification"],
  },
  {
    id: "3",
    version: "1.4.0",
    date: "December 2025",
    title: "The Analytics Update",
    description: "Added comprehensive analytics and visitor insights.",
    type: "improvement",
    highlights: [
      "Real-time visitor counter",
      "Analytics dashboard with charts",
      "Live visitor map",
      "GitHub activity integration",
      "Monthly goals tracker",
    ],
    tags: ["Analytics", "Data"],
  },
  {
    id: "4",
    version: "1.3.0",
    date: "November 2025",
    title: "The Content Expansion",
    description: "New content pages and improved navigation.",
    type: "feature",
    highlights: [
      "Added Journey timeline page",
      "Now page with current activities",
      "Enhanced blog with MDX support",
      "Project case studies",
      "Testimonials section",
    ],
    tags: ["Content", "Pages"],
  },
  {
    id: "5",
    version: "1.2.0",
    date: "October 2025",
    title: "The Easter Egg Hunt",
    description: "Added hidden features and delightful surprises.",
    type: "feature",
    highlights: [
      "Konami code easter egg",
      "Secret page for explorers",
      "Achievement tracking system",
      "Confetti celebrations",
      "Hidden terminal commands",
    ],
    tags: ["Easter Eggs", "Fun"],
  },
  {
    id: "6",
    version: "1.1.0",
    date: "September 2025",
    title: "The Animation Update",
    description: "Enhanced visual effects and animations.",
    type: "design",
    highlights: [
      "Framer Motion page transitions",
      "Scroll-triggered animations",
      "Tilt cards with 3D effects",
      "Particle background",
      "Cursor follower effect",
      "Text scramble effects",
    ],
    tags: ["Animation", "Design"],
  },
  {
    id: "7",
    version: "1.0.0",
    date: "August 2025",
    title: "Hello World",
    description: "Initial launch of the portfolio website.",
    type: "feature",
    highlights: [
      "Initial portfolio release",
      "Home page with hero section",
      "About page with timeline",
      "Projects showcase",
      "Contact form",
      "Dark mode support",
      "Responsive design",
    ],
    tags: ["Launch", "MVP"],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature': return <Rocket className="h-5 w-5" />;
    case 'improvement': return <Zap className="h-5 w-5" />;
    case 'fix': return <Code2 className="h-5 w-5" />;
    case 'design': return <Palette className="h-5 w-5" />;
    default: return <Star className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feature': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'improvement': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'fix': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'design': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'feature': return 'New Feature';
    case 'improvement': return 'Improvement';
    case 'fix': return 'Bug Fix';
    case 'design': return 'Design';
    default: return 'Update';
  }
};

export default function ChangelogPage() {
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
            <GitCommit className="h-4 w-4" />
            <span className="text-sm font-medium">Version History</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Changelog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey through the evolution of this portfolio. Track new features, 
            improvements, and design iterations over time.
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
            { label: "Total Versions", value: changelogData.length, icon: GitCommit },
            { label: "New Features", value: "25+", icon: Sparkles },
            { label: "Major Updates", value: "3", icon: Rocket },
            { label: "Days Active", value: "180+", icon: Calendar },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-xl border bg-card text-center hover:border-primary/50 transition-colors"
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
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2" />

          {/* Changelog Entries */}
          <div className="space-y-12">
            {changelogData.map((entry, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={entry.id}
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
                    className={`absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-card border-2 border-primary
                      flex items-center justify-center z-10 md:-translate-x-1/2 shadow-lg`}
                  >
                    {getTypeIcon(entry.type)}
                  </motion.div>

                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isLeft ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300 group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`${getTypeColor(entry.type)}`}>
                                {getTypeLabel(entry.type)}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {entry.date}
                              </span>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                              v{entry.version}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {entry.title}
                          </CardTitle>
                          <CardDescription className="text-base mt-2">
                            {entry.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2 mb-4">
                            {entry.highlights.map((highlight, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                              </motion.li>
                            ))}
                          </ul>
                          
                          <div className="flex flex-wrap gap-2 pt-4 border-t">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
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
            <Layers className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">What&apos;s Next?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            The journey never ends. Here are some features planned for future releases:
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "AI-Powered Chat",
              "Real-time Collaboration",
              "More Interactive Demos",
              "Performance Optimizations",
              "Accessibility Improvements",
            ].map((feature) => (
              <Badge key={feature} variant="secondary" className="px-4 py-2 text-sm">
                <Cpu className="h-3 w-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>
            Built with <Heart className="h-4 w-4 inline text-primary" /> and lots of coffee. 
            Follow the journey on <a href="https://github.com/Spoyte/nemo-portfolio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
