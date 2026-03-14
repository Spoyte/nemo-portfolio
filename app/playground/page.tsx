"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Save,
  Download,
  Share2,
  Copy,
  Check,
  Code,
  Sparkles,
  Zap,
  Terminal,
  Layout,
  Palette,
  Type,
  Image,
  MousePointer,
  Layers,
  Box,
  Grid3X3,
  Maximize2,
  Minimize2,
  Settings,
  ChevronRight,
  FolderOpen,
  FileCode,
  Plus,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { toast } from "sonner";

// Demo components for live preview
const demoComponents: Record<string, string> = {
  button: `<button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
  Click Me
</button>`,
  card: `<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">
    This is a beautiful card component with hover effects.
  </p>
  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
    Learn More
  </button>
</div>`,
  input: `<div className="space-y-2 max-w-sm">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Email Address
  </label>
  <input 
    type="email" 
    placeholder="you@example.com"
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800"
  />
  <p className="text-xs text-gray-500">We'll never share your email.</p>
</div>`,
  toggle: `<label className="flex items-center cursor-pointer">
  <div className="relative">
    <input type="checkbox" className="sr-only" />
    <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-colors peer-checked:bg-blue-500"></div>
    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform peer-checked:translate-x-6"></div>
  </div>
  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
    Enable Notifications
  </span>
</label>`,
  badge: `<div className="flex flex-wrap gap-2">
  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
    New Feature
  </span>
  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
    Stable
  </span>
  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">
    Beta
  </span>
  <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-sm font-medium">
    Deprecated
  </span>
</div>`,
  alert: `<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
        Information
      </h3>
      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
        This is an informational alert message.
      </p>
    </div>
  </div>
</div>`,
  skeleton: `<div className="animate-pulse space-y-4 max-w-sm">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
  </div>
  <div className="flex gap-4">
    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
    </div>
  </div>
</div>`,
  gradient: `<div className="space-y-4">
  <div className="h-32 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
  <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600"></div>
  <div className="h-32 rounded-xl bg-gradient-to-tr from-orange-400 via-red-500 to-pink-600"></div>
</div>`,
  grid: `<div className="grid grid-cols-3 gap-4 max-w-xs">
  {[...Array(9)].map((_, i) => (
    <div key={i} className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
      {i + 1}
    </div>
  ))}
</div>`,
  glass: `<div className="relative p-8 rounded-2xl overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600"></div>
  <div className="relative p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
    <h3 className="text-xl font-bold text-white mb-2">Glassmorphism</h3>
    <p className="text-white/80">A modern glass-like effect using backdrop blur.</p>
  </div>
</div>`,
  animation: `<div className="flex items-center justify-center h-32">
  <div className="relative">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
  </div>
</div>`,
};

const templates = [
  { id: "button", name: "Button", icon: MousePointer },
  { id: "card", name: "Card", icon: Layout },
  { id: "input", name: "Input", icon: Type },
  { id: "toggle", name: "Toggle", icon: Zap },
  { id: "badge", name: "Badges", icon: Sparkles },
  { id: "alert", name: "Alert", icon: Terminal },
  { id: "skeleton", name: "Skeleton", icon: Layers },
  { id: "gradient", name: "Gradients", icon: Palette },
  { id: "grid", name: "Grid", icon: Grid3X3 },
  { id: "glass", name: "Glass", icon: Box },
  { id: "animation", name: "Animation", icon: Play },
];

export default function ComponentPlaygroundPage() {
  const [code, setCode] = useState(demoComponents.button);
  const [activeTemplate, setActiveTemplate] = useState("button");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const handleTemplateChange = (templateId: string) => {
    setActiveTemplate(templateId);
    setCode(demoComponents[templateId]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Playground</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Component <span className="text-gradient-animated">Playground</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experiment with UI components in real-time. Edit code, see instant previews, and copy ready-to-use snippets.
          </p>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTemplate === template.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                <template.icon className="h-4 w-4" />
                {template.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid gap-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "grid-cols-1 lg:grid-cols-2"}`}
        >
          {/* Code Editor */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                <span className="font-medium">Code Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy
                </Button>
              </div>
            </div>
            <div className="relative flex-1 min-h-[400px]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm bg-card border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                <span className="font-medium">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Device Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  {(["desktop", "tablet", "mobile"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={`p-1.5 rounded-md transition-colors ${
                        device === d ? "bg-background shadow-sm" : "hover:bg-background/50"
                      }`}
                    >
                      {d === "desktop" && <Maximize2 className="h-4 w-4" />}
                      {d === "tablet" && <Layout className="h-4 w-4" />}
                      {d === "mobile" && <Minimize2 className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] bg-card border border-border rounded-xl overflow-hidden">
              <div className="h-full flex items-center justify-center p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')]">
                <div
                  className="w-full transition-all duration-300"
                  style={{ maxWidth: getDeviceWidth() }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: code
                        .replace(/className=/g, "class=")
                        .replace(/jsx/g, "")
                        .replace(/{\/\*/g, "<!--")
                        .replace(/\*\/}/g, "-->"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: "Instant Preview",
              description: "See changes in real-time as you edit your code.",
            },
            {
              icon: Palette,
              title: "Ready-to-Use",
              description: "Copy production-ready components with one click.",
            },
            {
              icon: Layout,
              title: "Responsive Testing",
              description: "Test components across different screen sizes.",
            },
          ].map((feature, index) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
