"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  GitCommit,
  Rocket,
  Palette,
  Code2,
  Star,
  Zap,
  Trophy,
  RotateCcw,
  Search,
  Filter
} from "lucide-react";

// Portfolio evolution timeline data
const portfolioVersions = [
  {
    version: "v1.0",
    date: "2024-01-15",
    title: "The Beginning",
    description: "A simple HTML/CSS portfolio with basic styling and static content.",
    features: ["Static HTML", "Basic CSS", "Single Page", "Contact Form"],
    color: "from-gray-500 to-gray-600",
    icon: Code2,
    commits: 12,
    highlight: "First portfolio ever built",
  },
  {
    version: "v2.0",
    date: "2024-06-20",
    title: "The React Era",
    description: "Migrated to React with component-based architecture and better animations.",
    features: ["React Components", "Framer Motion", "Dark Mode", "Responsive Design"],
    color: "from-blue-500 to-cyan-500",
    icon: Rocket,
    commits: 45,
    highlight: "First framework adoption",
  },
  {
    version: "v3.0",
    date: "2024-09-10",
    title: "Generative Art",
    description: "Added creative coding section with interactive generative art pieces.",
    features: ["Canvas API", "Generative Art", "Algorithm Gallery", "Interactive Demos"],
    color: "from-purple-500 to-pink-500",
    icon: Palette,
    commits: 89,
    highlight: "Art + Code fusion",
  },
  {
    version: "v4.0",
    date: "2025-01-05",
    title: "The Experience",
    description: "Full-featured portfolio with games, easter eggs, and immersive experiences.",
    features: ["Mini Games", "Easter Eggs", "Achievement System", "3D Elements"],
    color: "from-orange-500 to-yellow-500",
    icon: Star,
    commits: 156,
    highlight: "Playful portfolio concept",
  },
  {
    version: "v5.0",
    date: "2025-03-18",
    title: "AI & Beyond",
    description: "Integrated AI features, voice control, and next-gen web technologies.",
    features: ["AI Art Generator", "Voice Navigation", "Physics Engine", "Shader Studio"],
    color: "from-green-500 to-emerald-500",
    icon: Zap,
    commits: 234,
    highlight: "Future of web portfolios",
  },
];

// Mock commit history
const generateCommits = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `commit-${i}`,
    message: [
      "feat: Add new interactive component",
      "fix: Resolve animation timing issue",
      "style: Update color scheme",
      "refactor: Optimize performance",
      "docs: Update documentation",
      "chore: Clean up dependencies",
    ][Math.floor(Math.random() * 6)],
    date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    author: "Nemo",
  }));
};

// Version card component
function VersionCard({ 
  version, 
  isActive, 
  onClick 
}: { 
  version: typeof portfolioVersions[0]; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-6 border transition-all ${
        isActive 
          ? "bg-card border-primary shadow-lg" 
          : "bg-card/50 border-border hover:border-primary/50"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${version.color}`}>
          <version.icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{version.version}</Badge>
            <span className="text-sm text-muted-foreground">{version.date}</span>
          </div>
          <h3 className="font-bold text-lg">{version.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{version.description}</p>
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              <div className="flex flex-wrap gap-2">
                {version.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <GitCommit className="h-4 w-4" />
                  <span>{version.commits} commits</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Trophy className="h-4 w-4" />
                  <span>{version.highlight}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Commit timeline visualization
function CommitTimeline({ commits }: { commits: ReturnType<typeof generateCommits> }) {
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {commits.map((commit, index) => (
        <motion.div
          key={commit.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{commit.message}</p>
            <p className="text-xs text-muted-foreground">{commit.date}</p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {commit.author}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}

// Stats comparison
function StatsComparison({ currentVersion }: { currentVersion: typeof portfolioVersions[0] }) {
  const stats = [
    { label: "Components", value: currentVersion.commits * 3, suffix: "" },
    { label: "Lines of Code", value: currentVersion.commits * 150, suffix: "+" },
    { label: "Easter Eggs", value: Math.floor(currentVersion.commits / 10), suffix: "" },
    { label: "Features", value: currentVersion.features.length * 5, suffix: "" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 rounded-xl bg-muted text-center"
        >
          <div className="text-2xl font-bold text-primary">
            {stat.value.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Main page component
export default function TimeMachinePage() {
  const [selectedVersion, setSelectedVersion] = useState(portfolioVersions[portfolioVersions.length - 1]);
  const [commits] = useState(() => generateCommits(10));
  const [isAnimating, setIsAnimating] = useState(false);

  const currentIndex = portfolioVersions.findIndex(v => v.version === selectedVersion.version);

  const navigateVersion = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < portfolioVersions.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedVersion(portfolioVersions[newIndex]);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Travel Through Time</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Portfolio <span className="text-gradient-animated">Time Machine</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the evolution of this portfolio from its humble beginnings to the feature-rich experience it is today.
          </p>
        </motion.div>

        {/* Timeline Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(currentIndex / (portfolioVersions.length - 1)) * 100}%` }}
            />

            {/* Timeline points */}
            <div className="relative flex justify-between">
              {portfolioVersions.map((version, index) => (
                <motion.button
                  key={version.version}
                  onClick={() => setSelectedVersion(version)}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index <= currentIndex 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  } ${index === currentIndex ? "ring-4 ring-primary/20 scale-110" : ""}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs font-bold">{version.version}</span>
                  
                  {index === currentIndex && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <span className="text-sm font-medium">{version.date}</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateVersion("prev")}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {selectedVersion.version}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateVersion("next")}
                disabled={currentIndex === portfolioVersions.length - 1}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVersion.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VersionCard
                  version={selectedVersion}
                  isActive={true}
                  onClick={() => {}}
                />
              </motion.div>
            </AnimatePresence>

            {/* All versions */}
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-muted-foreground">All Versions</h3>
              {portfolioVersions.map((version) => (
                <VersionCard
                  key={version.version}
                  version={version}
                  isActive={selectedVersion.version === version.version}
                  onClick={() => setSelectedVersion(version)}
                />
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
003e
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Version Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatsComparison currentVersion={selectedVersion} />
              </CardContent>
            </Card>

            {/* Recent Commits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Recent Commits
                </CardTitle>
                <CardDescription>
                  Activity during {selectedVersion.version} development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommitTimeline commits={commits} />
              </CardContent>
            </Card>

            {/* Fun Fact */}
            <Card className="bg-gradient-to-br from-primary/10 to-orange-500/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Did You Know?</p>
                    <p className="text-sm text-muted-foreground">
                      This portfolio has evolved through {portfolioVersions.length} major versions 
                      with over {portfolioVersions.reduce((acc, v) => acc + v.commits, 0)} commits 
                      spanning more than a year of continuous development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
