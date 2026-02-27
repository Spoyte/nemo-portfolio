"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Rocket,
  Calendar,
  MapPin,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  year: string;
  month: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  type: "work" | "education" | "achievement" | "project";
  skills?: string[];
  link?: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    year: "2024",
    month: "Present",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "Remote",
    description: "Leading frontend architecture decisions and mentoring junior developers. Building scalable React applications serving millions of users.",
    type: "work",
    skills: ["React", "TypeScript", "Next.js", "System Design"],
  },
  {
    id: "2",
    year: "2023",
    month: "Jun",
    title: "Open Source Contributor Award",
    description: "Recognized for significant contributions to the React ecosystem with over 10k stars on personal projects.",
    type: "achievement",
    skills: ["Open Source", "Community"],
  },
  {
    id: "3",
    year: "2022",
    month: "Mar",
    title: "Full Stack Developer",
    company: "Digital Agency Co.",
    location: "San Francisco, CA",
    description: "Developed full-stack applications for Fortune 500 clients. Implemented CI/CD pipelines and mentored team members.",
    type: "work",
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker"],
  },
  {
    id: "4",
    year: "2021",
    month: "Sep",
    title: "Portfolio Platform Launch",
    description: "Launched this portfolio website with interactive features, games, and unique user experiences.",
    type: "project",
    link: "https://nemo.dev",
    skills: ["Next.js", "Framer Motion", "Tailwind CSS"],
  },
  {
    id: "5",
    year: "2020",
    month: "May",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "New York, NY",
    description: "First professional role. Built responsive web applications and learned agile development practices.",
    type: "work",
    skills: ["JavaScript", "React", "CSS", "Git"],
  },
  {
    id: "6",
    year: "2019",
    month: "Aug",
    title: "Computer Science Degree",
    company: "University of Technology",
    location: "Boston, MA",
    description: "Graduated with honors. Specialized in Human-Computer Interaction and Web Technologies.",
    type: "education",
    skills: ["Algorithms", "UI/UX", "Software Engineering"],
  },
  {
    id: "7",
    year: "2018",
    month: "Jan",
    title: "First Code Commit",
    description: "Wrote my first line of code. The beginning of an incredible journey into software development.",
    type: "achievement",
    skills: ["HTML", "CSS", "JavaScript"],
  },
];

const typeIcons = {
  work: Briefcase,
  education: GraduationCap,
  achievement: Award,
  project: Rocket,
};

const typeColors = {
  work: "bg-blue-500",
  education: "bg-green-500",
  achievement: "bg-yellow-500",
  project: "bg-purple-500",
};

export default function InteractiveResumeTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<TimelineEvent["type"] | "all">("all");

  const filteredEvents = filter === "all" 
    ? timelineData 
    : timelineData.filter(e => e.type === filter);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient-animated">Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A visual timeline of my career, education, and achievements.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {(["all", "work", "education", "achievement", "project"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {type === "all" ? "All Events" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => {
                const Icon = typeIcons[event.type];
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-start gap-4 md:gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-background z-10 md:-translate-x-1/2">
                      <div className={`w-full h-full rounded-full ${typeColors[event.type]}`} />
                    </div>

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedEvent(event)}
                        className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all group"
                      >
                        <div className={`flex items-center gap-3 mb-3 ${isEven ? "md:flex-row-reverse" : ""}`}>
                          <div className={`w-10 h-10 rounded-xl ${typeColors[event.type]}/10 flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${typeColors[event.type].replace("bg-", "text-")}`} />
                          </div>
                          <div className={`flex-1 ${isEven ? "md:text-right" : ""}`}>
                            <span className="text-sm text-muted-foreground">
                              {event.month} {event.year}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        {event.company && (
                          <p className="text-sm text-muted-foreground mb-2">{event.company}</p>
                        )}

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>

                        {event.skills && (
                          <div className={`flex flex-wrap gap-1 mt-3 ${isEven ? "md:justify-end" : ""}`}>
                            {event.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 rounded-full text-xs bg-muted"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg p-6 rounded-2xl bg-card border shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${typeColors[selectedEvent.type]} flex items-center justify-center`}>
                      {(() => {
                        const Icon = typeIcons[selectedEvent.type];
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.month} {selectedEvent.year}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-lg hover:bg-muted"
                  >
                    ✕
                  </button>
                </div>

                {selectedEvent.company && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedEvent.company}</span>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                <p className="text-muted-foreground mb-4">{selectedEvent.description}</p>

                {selectedEvent.skills && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.link && (
                  <Button className="w-full gap-2" asChild>
                    <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
