"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase, GraduationCap, Coffee, Music, Book, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const timeline = [
  {
    year: "2024",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    description: "Leading frontend development for enterprise applications, mentoring junior developers, and driving technical decisions.",
    icon: Briefcase,
  },
  {
    year: "2022",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    description: "Built scalable web applications from scratch, implemented CI/CD pipelines, and optimized performance.",
    icon: Briefcase,
  },
  {
    year: "2020",
    title: "Frontend Developer",
    company: "Digital Agency",
    description: "Developed responsive websites and web applications for diverse clients across various industries.",
    icon: Briefcase,
  },
  {
    year: "2019",
    title: "Computer Science Degree",
    company: "University of Technology",
    description: "Graduated with honors, specialized in Human-Computer Interaction and Web Technologies.",
    icon: GraduationCap,
  },
  {
    year: "2017",
    title: "First Code",
    company: "Self-Taught",
    description: "Started learning programming with HTML, CSS, and JavaScript. Built my first website.",
    icon: Coffee,
  },
];

const interests = [
  { icon: Coffee, label: "Coffee", description: "Third-wave coffee enthusiast" },
  { icon: Music, label: "Music", description: "Jazz, electronic, and classical" },
  { icon: Book, label: "Reading", description: "Sci-fi and philosophy" },
  { icon: Gamepad2, label: "Gaming", description: "Indie games and RPGs" },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A passionate developer who loves creating beautiful, functional, and user-friendly digital experiences.
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
              <div className="text-6xl font-bold text-gradient">N</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold">My Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Hello! I'm Nemo, a creative developer based in San Francisco. My journey into web development
                started in 2017 when I built my first HTML page. What began as curiosity quickly turned into
                a passion for creating digital experiences.
              </p>
              <p>
                Over the years, I've had the privilege of working with startups, agencies, and enterprise
                companies. This diverse experience has shaped me into a versatile developer who can adapt
                to different environments and challenges.
              </p>
              <p>
                I believe in the power of clean code, thoughtful design, and user-centered development.
                Every project is an opportunity to learn something new and push the boundaries of what's
                possible on the web.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>7+ Years Experience</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <Separator className="my-16" />

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">My Journey</h2>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden md:block md:w-1/2" />

                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center md:-translate-x-1/2 z-10">
                  <item.icon className="h-4 w-4 text-primary-foreground" />
                </div>

                <Card className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                }`}>
                  <CardContent className="p-6">
                    <span className="text-sm font-medium text-primary">{item.year}</span>
                    <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.company}</p>
                    <p className="text-muted-foreground mt-3">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-16" />

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Beyond Coding</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <interest.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{interest.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{interest.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
