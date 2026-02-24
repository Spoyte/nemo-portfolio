"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Copy, 
  Check, 
  Briefcase, 
  Code, 
  GraduationCap,
  Award,
  Globe,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { toast } from "sonner";

interface ResumeSection {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
}

const defaultResumeData: ResumeData = {
  name: "Nemo",
  title: "Creative Developer & Designer",
  email: "hello@nemo.dev",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "nemo.dev",
  summary: "Passionate creative developer with expertise in building beautiful, performant web applications. Specializing in React, TypeScript, and modern web technologies with a keen eye for design and user experience.",
  experience: [
    {
      company: "Tech Innovations Inc.",
      role: "Senior Frontend Developer",
      period: "2022 - Present",
      description: "Leading frontend development for enterprise SaaS platform. Implemented design system used across 12 products. Reduced bundle size by 40% through optimization.",
    },
    {
      company: "Digital Agency Co.",
      role: "Full Stack Developer",
      period: "2020 - 2022",
      description: "Developed 20+ client websites and applications. Specialized in React, Node.js, and cloud infrastructure. Maintained 99.9% uptime for critical services.",
    },
    {
      company: "StartupXYZ",
      role: "Junior Developer",
      period: "2019 - 2020",
      description: "Built MVP from scratch, secured $2M seed funding. Implemented real-time features using WebSockets and optimized database queries.",
    },
  ],
  education: [
    {
      school: "University of Technology",
      degree: "B.S. Computer Science",
      year: "2019",
    },
  ],
  skills: [
    "React", "TypeScript", "Next.js", "Node.js", "GraphQL", 
    "PostgreSQL", "AWS", "Docker", "Figma", "Tailwind CSS"
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory",
      tech: ["Next.js", "Prisma", "Stripe"],
    },
    {
      name: "Design System",
      description: "Component library used by 50+ developers",
      tech: ["React", "Storybook", "TypeScript"],
    },
    {
      name: "AI Dashboard",
      description: "Analytics dashboard for machine learning models",
      tech: ["Python", "React", "D3.js"],
    },
  ],
};

export function DynamicResumeBuilder() {
  const [sections, setSections] = useState<ResumeSection[]>([
    { id: "header", label: "Contact Info", icon: Mail, enabled: true },
    { id: "summary", label: "Summary", icon: Briefcase, enabled: true },
    { id: "experience", label: "Experience", icon: Code, enabled: true },
    { id: "education", label: "Education", icon: GraduationCap, enabled: true },
    { id: "skills", label: "Skills", icon: Award, enabled: true },
    { id: "projects", label: "Projects", icon: Globe, enabled: true },
  ]);
  
  const [resumeData] = useState<ResumeData>(defaultResumeData);
  const [copied, setCopied] = useState(false);

  const toggleSection = useCallback((id: string) => {
    setSections(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  }, []);

  const generateMarkdown = useCallback(() => {
    const enabledIds = new Set(sections.filter(s => s.enabled).map(s => s.id));
    
    let md = "";
    
    if (enabledIds.has("header")) {
      md += `# ${resumeData.name}\n`;
      md += `## ${resumeData.title}\n\n`;
      md += `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}\n`;
      md += `${resumeData.website}\n\n`;
    }
    
    if (enabledIds.has("summary")) {
      md += `## Summary\n\n${resumeData.summary}\n\n`;
    }
    
    if (enabledIds.has("experience")) {
      md += `## Experience\n\n`;
      resumeData.experience.forEach(exp => {
        md += `### ${exp.role} @ ${exp.company}\n`;
        md += `*${exp.period}*\n\n`;
        md += `${exp.description}\n\n`;
      });
    }
    
    if (enabledIds.has("education")) {
      md += `## Education\n\n`;
      resumeData.education.forEach(edu => {
        md += `### ${edu.school}\n`;
        md += `${edu.degree} | ${edu.year}\n\n`;
      });
    }
    
    if (enabledIds.has("skills")) {
      md += `## Skills\n\n`;
      md += resumeData.skills.join(" • ") + "\n\n";
    }
    
    if (enabledIds.has("projects")) {
      md += `## Projects\n\n`;
      resumeData.projects.forEach(proj => {
        md += `### ${proj.name}\n`;
        md += `${proj.description}\n`;
        md += `*Tech: ${proj.tech.join(", ")}*\n\n`;
      });
    }
    
    return md;
  }, [sections, resumeData]);

  const copyToClipboard = useCallback(() => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Resume copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [generateMarkdown]);

  const downloadResume = useCallback(() => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nemo-resume.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded!");
  }, [generateMarkdown]);

  const enabledIds = new Set(sections.filter(s => s.enabled).map(s => s.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Resume Sections</h3>
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <Checkbox
                  checked={section.enabled}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <section.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{section.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <Button onClick={copyToClipboard} className="w-full" variant="outline">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Markdown
              </>
            )}
          </Button>
          <Button onClick={downloadResume} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="p-8 rounded-xl border border-border bg-white dark:bg-black min-h-[800px]">
          <AnimatePresence mode="wait">
            {enabledIds.has("header") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8 pb-8 border-b"
              >
                <h1 className="text-3xl font-bold mb-2">{resumeData.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{resumeData.title}</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {resumeData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {resumeData.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {resumeData.website}
                  </span>
                </div>
              </motion.div>
            )}

            {enabledIds.has("summary") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-3 text-primary">Summary</h2>
                <p className="text-muted-foreground leading-relaxed">{resumeData.summary}</p>
              </motion.div>
            )}

            {enabledIds.has("experience") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 text-primary">Experience</h2>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">{exp.role} @ {exp.company}</h3>
                        <span className="text-sm text-muted-foreground">{exp.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {enabledIds.has("education") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 text-primary">Education</h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-medium">{edu.school}</h3>
                      <p className="text-sm text-muted-foreground">{edu.degree} | {edu.year}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {enabledIds.has("skills") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4 text-primary">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {enabledIds.has("projects") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-primary">Projects</h2>
                <div className="space-y-4">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i}>
                      <h3 className="font-medium">{proj.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
