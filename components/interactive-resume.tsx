"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Share2, 
  Copy, 
  Check,
  Printer,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Sparkles,
  Palette,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    description: string;
    highlights: string[];
  }[];
  education: {
    school: string;
    degree: string;
    period: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
}

const resumeData: ResumeData = {
  name: "Nemo",
  title: "Senior Frontend Developer",
  email: "hello@nemo.dev",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "nemo.dev",
  linkedin: "linkedin.com/in/nemo",
  github: "github.com/nemo",
  summary: "Creative developer with 7+ years of experience building beautiful, performant web applications. Specialized in React, TypeScript, and modern frontend architecture. Passionate about creating delightful user experiences and mentoring junior developers.",
  experience: [
    {
      company: "Tech Innovations Inc.",
      role: "Senior Frontend Developer",
      period: "2022 - Present",
      description: "Leading frontend architecture for enterprise applications serving millions of users.",
      highlights: [
        "Reduced load times by 75% through performance optimization",
        "Mentored 5 junior developers to senior level",
        "Architected design system used across 12 products",
      ],
    },
    {
      company: "Digital Agency Co.",
      role: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Developed full-stack applications for Fortune 500 clients.",
      highlights: [
        "Built 20+ client projects with 98% satisfaction rate",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
        "Led migration from legacy systems to modern React architecture",
      ],
    },
    {
      company: "StartupXYZ",
      role: "Frontend Developer",
      period: "2019 - 2020",
      description: "First professional role building responsive web applications.",
      highlights: [
        "Developed core product features used by 100K+ users",
        "Implemented responsive design system from scratch",
        "Collaborated with design team on UX improvements",
      ],
    },
  ],
  education: [
    {
      school: "University of Technology",
      degree: "B.S. Computer Science",
      period: "2015 - 2019",
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      category: "Backend",
      items: ["Node.js", "PostgreSQL", "GraphQL", "Redis"],
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS", "Vercel", "Figma"],
    },
  ],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
    { name: "React Advanced Patterns", issuer: "Frontend Masters", year: "2022" },
  ],
};

const themes = [
  { id: "modern", name: "Modern", primary: "#dc2626", secondary: "#ea580c", bg: "#ffffff" },
  { id: "minimal", name: "Minimal", primary: "#171717", secondary: "#525252", bg: "#fafafa" },
  { id: "ocean", name: "Ocean", primary: "#0891b2", secondary: "#06b6d4", bg: "#ecfeff" },
  { id: "forest", name: "Forest", primary: "#16a34a", secondary: "#22c55e", bg: "#f0fdf4" },
  { id: "purple", name: "Purple", primary: "#7c3aed", secondary: "#a855f7", bg: "#faf5ff" },
];

export function InteractiveResume() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [showPhoto, setShowPhoto] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Resume</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            My{" "}
            <span className="text-gradient-animated">Resume</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Customize the theme, toggle sections, and download or share my resume.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 space-y-6"
        >
          {/* Theme Selector */}
          <div className="flex flex-wrap justify-center gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTheme.id === theme.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.primary }}
                />
                {theme.name}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap justify-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch checked={showPhoto} onCheckedChange={setShowPhoto} />
              <span className="text-sm">Show Photo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              <span className="text-sm">Compact Mode</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Copied!" : "Share Link"}
            </Button>
          </div>
        </motion.div>

        {/* Resume Preview */}
        <motion.div
          ref={resumeRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="rounded-2xl shadow-2xl overflow-hidden print:shadow-none"
            style={{ backgroundColor: selectedTheme.bg }}
          >
            {/* Resume Header */}
            <div 
              className="p-8 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})` 
              }}
            >
              <div className="flex items-center gap-6">
                {showPhoto && (
                  <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
                    {resumeData.name[0]}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-1">{resumeData.name}</h1>
                  <p className="text-white/80 text-lg">{resumeData.title}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {resumeData.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {resumeData.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {resumeData.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Body */}
            <div className={`p-8 ${compactMode ? "space-y-4" : "space-y-6"}`}>
              {/* Summary */}
              <div>
                <h2 
                  className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ color: selectedTheme.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                  Summary
                </h2>
                <p className="text-muted-foreground">{resumeData.summary}</p>
              </div>

              {/* Experience */}
              <div>
                <h2 
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: selectedTheme.primary }}
                >
                  <Briefcase className="w-5 h-5" />
                  Experience
                </h2>
                <div className={`space-y-${compactMode ? "3" : "4"}`}>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 pl-4" style={{ borderColor: selectedTheme.secondary + "40" }}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold">{exp.role}</h3>
                        <Badge variant="outline" className="text-xs">{exp.period}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>
                      <ul className="space-y-1">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span style={{ color: selectedTheme.primary }}>•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: selectedTheme.primary }}
                >
                  <Code2 className="w-5 h-5" />
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resumeData.skills.map((skillGroup) => (
                    <div key={skillGroup.category}>
                      <h3 className="font-medium text-sm mb-2" style={{ color: selectedTheme.secondary }}>
                        {skillGroup.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary"
                            style={{ 
                              backgroundColor: selectedTheme.primary + "15",
                              color: selectedTheme.primary 
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: selectedTheme.primary }}
                >
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.school}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{edu.period}</Badge>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h2 
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: selectedTheme.primary }}
                >
                  <Award className="w-5 h-5" />
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-3">
                  {resumeData.certifications.map((cert) => (
                    <div 
                      key={cert.name}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: selectedTheme.primary + "10" }}
                    >
                      <Award className="w-4 h-4" style={{ color: selectedTheme.primary }} />
                      <span>{cert.name}</span>
                      <span className="text-muted-foreground">• {cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t">
                <div className="flex flex-wrap justify-center gap-6">
                  <a 
                    href={`https://${resumeData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: selectedTheme.primary }}
                  >
                    <Globe className="w-4 h-4" />
                    {resumeData.website}
                  </a>
                  <a 
                    href={`https://${resumeData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: selectedTheme.primary }}
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a 
                    href={`https://${resumeData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: selectedTheme.primary }}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
