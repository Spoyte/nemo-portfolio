"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code2, 
  Eye, 
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface DemoProject {
  id: string;
  name: string;
  description: string;
  code: string;
  css: string;
  preview: React.ReactNode;
}

const demoProjects: DemoProject[] = [
  {
    id: "1",
    name: "Animated Button",
    description: "A beautiful animated button with hover effects",
    code: `const Button = () => {
  return (
    <button className="btn">
      Hover Me
      <span className="shine" />
    </button>
  );
};`,
    css: `.btn {
  position: relative;
  padding: 16px 32px;
  background: linear-gradient(135deg, #dc2626, #ea580c);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.3),
    transparent
  );
  transition: left 0.5s;
}

.btn:hover .shine {
  left: 100%;
}`,
    preview: null,
  },
  {
    id: "2",
    name: "Glass Card",
    description: "Modern glassmorphism card design",
    code: `const GlassCard = () => {
  return (
    <div className="glass-card">
      <h3>Glassmorphism</h3>
      <p>Modern UI design trend</p>
    </div>
  );
};`,
    css: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.glass-card h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.glass-card p {
  margin: 0;
  opacity: 0.8;
}`,
    preview: null,
  },
  {
    id: "3",
    name: "Loading Spinner",
    description: "Smooth animated loading indicator",
    code: `const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  );
};`,
    css: `.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(220, 38, 38, 0.2);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-bottom-color: #ea580c;
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
}`,
    preview: null,
  },
];

function AnimatedButtonDemo() {
  return (
    <button className="relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30">
      <span className="relative z-10">Hover Me</span>
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
}

function GlassCardDemo() {
  return (
    <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl" />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-white">Glassmorphism</h3>
        <p className="text-white/80">Modern UI design trend with frosted glass effect</p>
      </div>
    </div>
  );
}

function SpinnerDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-red-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-red-600 rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-transparent border-b-orange-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
    </div>
  );
}

const demoComponents: Record<string, React.FC> = {
  "1": AnimatedButtonDemo,
  "2": GlassCardDemo,
  "3": SpinnerDemo,
};

export function ProjectDemoMode() {
  const [selectedProject, setSelectedProject] = useState(demoProjects[0]);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [deviceMode, setDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isPlaying, setIsPlaying] = useState(true);

  const DemoComponent = demoComponents[selectedProject.id];

  const copyCode = () => {
    navigator.clipboard.writeText(selectedProject.code + "\n\n/* CSS */\n" + selectedProject.css);
    toast.success("Code copied to clipboard!");
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "100%";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Interactive Demos
            </CardTitle>
            <CardDescription>
              Explore live component demos with source code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoProjects.map((project) => (
              <motion.button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedProject.id === project.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedProject.id === project.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-xs text-muted-foreground">Components</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">Open Source</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Area */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>{selectedProject.name}</CardTitle>
                <CardDescription>{selectedProject.description}</CardDescription>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                {/* View Mode */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === "preview" ? "secondary" : "ghost"}
                    onClick={() => setViewMode("preview")}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "code" ? "secondary" : "ghost"}
                    onClick={() => setViewMode("code")}
                    className="gap-1"
                  >
                    <Code2 className="w-4 h-4" />
                    Code
                  </Button>
                </div>

                {/* Device Mode */}
                {viewMode === "preview" && (
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button
                      size="icon"
                      variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                      onClick={() => setDeviceMode("mobile")}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={deviceMode === "tablet" ? "secondary" : "ghost"}
                      onClick={() => setDeviceMode("tablet")}
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                      onClick={() => setDeviceMode("desktop")}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Button size="icon" variant="outline" onClick={copyCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {viewMode === "preview" ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 bg-gradient-to-br from-muted/50 to-muted min-h-[400px] flex items-center justify-center"
                >
                  <motion.div
                    style={{ width: getDeviceWidth() }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-background rounded-xl shadow-2xl p-8 flex items-center justify-center min-h-[300px]"
                  >
                    <DemoComponent />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 space-y-4"
                >
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      React Component
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{selectedProject.code}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      CSS Styles
                    </h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{selectedProject.css}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
