"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Download,
  Share2,
  Printer,
  Palette,
  Type,
  Layout,
  Check,
  Sparkles,
  Award,
  Code2,
  GraduationCap,
  Star,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollReveal } from "@/components/scroll-animations";

// Resume data
const RESUME_DATA = {
  name: "Nemo",
  title: "Senior Full-Stack Developer",
  location: "San Francisco, CA",
  email: "hello@nemo.dev",
  phone: "+1 (555) 123-4567",
  website: "nemo.dev",
  summary: "Creative developer with 7+ years of experience building scalable web applications. Passionate about clean code, user experience, and open source. Specialized in React, Node.js, and cloud architecture.",
  experience: [
    {
      id: 1,
      company: "TechCorp Inc.",
      role: "Senior Full-Stack Developer",
      period: "2022 - Present",
      location: "San Francisco, CA",
      description: "Leading development of core platform serving 10M+ users. Architected microservices infrastructure reducing latency by 40%.",
      achievements: ["Reduced API response time by 60%", "Mentored team of 5 developers", "Shipped 15 major features"],
      technologies: ["React", "Node.js", "AWS", "PostgreSQL"]
    },
    {
      id: 2,
      company: "StartupXYZ",
      role: "Full-Stack Developer",
      period: "2020 - 2022",
      location: "Remote",
      description: "Built MVP from scratch to acquisition. Implemented real-time features and payment processing.",
      achievements: ["Grew user base to 100K", "Implemented Stripe payments", "Built real-time chat system"],
      technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io"]
    },
    {
      id: 3,
      company: "Digital Agency",
      role: "Web Developer",
      period: "2018 - 2020",
      location: "New York, NY",
      description: "Developed websites and applications for Fortune 500 clients.",
      achievements: ["Delivered 20+ projects", "99% client satisfaction", "Led frontend team"],
      technologies: ["JavaScript", "Vue.js", "PHP", "MySQL"]
    }
  ],
  education: [
    {
      id: 1,
      school: "University of Technology",
      degree: "B.S. Computer Science",
      period: "2014 - 2018",
      gpa: "3.8/4.0",
      honors: "Magna Cum Laude"
    }
  ],
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Python", "GraphQL", "PostgreSQL", "MongoDB"],
    devops: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    tools: ["Git", "Figma", "Jest", "Cypress", "Storybook"]
  },
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
    { name: "Meta Frontend Developer", issuer: "Meta", year: "2022" },
  ],
  projects: [
    { name: "Open Source Library", description: "React component library with 5K+ GitHub stars", link: "#" },
    { name: "E-commerce Platform", description: "Full-stack solution processing $1M+ annually", link: "#" },
  ]
};

// Theme configurations
const THEMES = {
  modern: {
    name: "Modern",
    primary: "bg-slate-900",
    accent: "bg-blue-600",
    text: "text-slate-900",
    muted: "text-slate-600",
    border: "border-slate-200",
    card: "bg-white"
  },
  minimal: {
    name: "Minimal",
    primary: "bg-black",
    accent: "bg-neutral-800",
    text: "text-black",
    muted: "text-neutral-500",
    border: "border-neutral-200",
    card: "bg-white"
  },
  colorful: {
    name: "Colorful",
    primary: "bg-gradient-to-r from-purple-600 to-blue-600",
    accent: "bg-orange-500",
    text: "text-slate-800",
    muted: "text-slate-500",
    border: "border-purple-200",
    card: "bg-white"
  },
  dark: {
    name: "Dark Mode",
    primary: "bg-zinc-950",
    accent: "bg-emerald-500",
    text: "text-zinc-100",
    muted: "text-zinc-400",
    border: "border-zinc-800",
    card: "bg-zinc-900"
  }
};

// Font options
const FONTS = {
  sans: { name: "Modern Sans", class: "font-sans" },
  serif: { name: "Classic Serif", class: "font-serif" },
  mono: { name: "Developer Mono", class: "font-mono" }
};

export default function ResumeBuilderPage() {
  const [theme, setTheme] = useState<keyof typeof THEMES>("modern");
  const [font, setFont] = useState<keyof typeof FONTS>("sans");
  const [layout, setLayout] = useState<"single" | "two-column">("single");
  const [showPhoto, setShowPhoto] = useState(true);
  const [activeSection, setActiveSection] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentTheme = THEMES[theme];
  const currentFont = FONTS[font];

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 1500);
  };

  const ResumePreview = () => (
    <div 
      className={`${currentFont.class} max-w-[850px] mx-auto ${currentTheme.card} shadow-2xl overflow-hidden print:shadow-none`}
      id="resume"
    >
      {/* Header */}
      <div className={`${currentTheme.primary} text-white p-8`}>
        <div className="flex items-start gap-6">
          {showPhoto && (
            <motion.div 
              className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              N
            </motion.div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{RESUME_DATA.name}</h1>
            <p className="text-xl opacity-90 mb-4">{RESUME_DATA.title}</p>
            
            <div className="flex flex-wrap gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {RESUME_DATA.location}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {RESUME_DATA.email}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> {RESUME_DATA.website}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-8 ${layout === "two-column" ? "grid grid-cols-3 gap-8" : ""}`}>
        <div className={layout === "two-column" ? "col-span-2" : ""}>
          {/* Summary */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-3 flex items-center gap-2`}>
              <Sparkles className="w-5 h-5" /> Summary
            </h2>
            <p className={`${currentTheme.muted} leading-relaxed`}>{RESUME_DATA.summary}</p>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
              <Briefcase className="w-5 h-5" /> Experience
            </h2>
            
            <div className="space-y-6">
              {RESUME_DATA.experience.map((job) => (
                <div key={job.id} className="relative pl-4 border-l-2 border-border">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${currentTheme.accent}`} />
                  
                  <div className="mb-2">
                    <h3 className={`font-semibold ${currentTheme.text}`}>{job.role}</h3>
                    <div className={`flex flex-wrap gap-2 text-sm ${currentTheme.muted}`}>
                      <span className="font-medium">{job.company}</span>
                      <span>•</span>
                      <span>{job.period}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  
                  <p className={`${currentTheme.muted} text-sm mb-3`}>{job.description}</p>
                  
                  <ul className="space-y-1 mb-3">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className={`text-sm ${currentTheme.muted} flex items-start gap-2`}>
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
              <Code2 className="w-5 h-5" /> Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESUME_DATA.projects.map((project) => (
                <Card key={project.name} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${currentTheme.text}`}>{project.name}</h3>
                        <p className={`text-sm ${currentTheme.muted} mt-1`}>{project.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className={layout === "two-column" ? "col-span-1" : ""}>
          {/* Skills */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
              <Star className="w-5 h-5" /> Skills
            </h2>
            
            <div className="space-y-4">
              {Object.entries(RESUME_DATA.skills).map(([category, skills]) => (
                <div key={category}>
                  <p className={`text-sm font-medium ${currentTheme.muted} mb-2 capitalize`}>
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
              <GraduationCap className="w-5 h-5" /> Education
            </h2>
            
            {RESUME_DATA.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className={`font-semibold ${currentTheme.text}`}>{edu.school}</h3>
                <p className={`text-sm ${currentTheme.muted}`}>{edu.degree}</p>
                <p className={`text-sm ${currentTheme.muted}`}>{edu.period}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">GPA: {edu.gpa}</Badge>
                  <Badge variant="secondary" className="text-xs">{edu.honors}</Badge>
                </div>
              </div>
            ))}
          </section>

          {/* Certifications */}
          <section className="mb-8">
            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
              <Award className="w-5 h-5" /> Certifications
            </h2>
            
            <div className="space-y-3">
              {RESUME_DATA.certifications.map((cert) => (
                <div key={cert.name} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${currentTheme.accent}`} />
                  <div>
                    <p className={`text-sm font-medium ${currentTheme.text}`}>{cert.name}</p>
                    <p className={`text-xs ${currentTheme.muted}`}>
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">Resume Builder</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Dynamic{" "}
            <span className="text-gradient-animated">Resume Builder</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your resume with different themes, fonts, and layouts. 
            Preview in real-time and download as PDF.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Theme
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(THEMES).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => setTheme(key as keyof typeof THEMES)}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          theme === key 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-full h-4 rounded mb-2 ${t.primary}`} />
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Font
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(FONTS).map(([key, f]) => (
                      <button
                        key={key}
                        onClick={() => setFont(key as keyof typeof FONTS)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          font === key 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className={f.class}>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Layout
                  </h3>
                  <div className="flex gap-2">
                    {(["single", "two-column"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`flex-1 p-3 rounded-lg border text-sm transition-all ${
                          layout === l 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {l === "single" ? "Single Column" : "Two Column"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Photo</span>
                  <Switch checked={showPhoto} onCheckedChange={setShowPhoto} />
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleDownload}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>Generating PDF...</>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Preview Area */}
          <ScrollReveal delay={0.2} className="lg:col-span-3">
            <div className="bg-muted/50 rounded-2xl p-8 print:p-0 print:bg-white">
              <ResumePreview />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
