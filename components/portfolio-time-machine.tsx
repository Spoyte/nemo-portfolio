"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Code2,
  Palette,
  Rocket,
  Star,
  GitBranch,
  Zap,
  Layers,
  Terminal,
  Gamepad2,
  Brain,
  Box,
  Eye,
  Atom,
  Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  stats: { label: string; value: string }[];
}

const portfolioVersions: TimelineEvent[] = [
  {
    id: "v1",
    date: "February 2024",
    title: "Portfolio v1.0 - The Beginning",
    description: "The first version of my portfolio launched with essential features and a clean, minimal design focused on showcasing projects.",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    features: ["Static pages", "Project showcase", "Basic contact form", "Simple animations"],
    stats: [
      { label: "Pages", value: "5" },
      { label: "Components", value: "12" },
      { label: "Animations", value: "Basic" },
    ],
  },
  {
    id: "v2",
    date: "March 2024",
    title: "Portfolio v2.0 - Interactive Era",
    description: "A major redesign introducing interactive elements, dark mode, and gamification features to create a more engaging experience.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    features: ["Dark mode toggle", "Achievement system", "Easter eggs", "Matrix rain", "Typing race"],
    stats: [
      { label: "Pages", value: "15" },
      { label: "Components", value: "35" },
      { label: "Games", value: "3" },
    ],
  },
  {
    id: "v3",
    date: "May 2024",
    title: "Portfolio v3.0 - Immersive Experience",
    description: "Pushing boundaries with 3D graphics, AI integration, physics simulations, and voice control for a truly next-gen portfolio.",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    features: ["Three.js 3D world", "AI art generator", "Physics playground", "Shader studio", "Voice navigation"],
    stats: [
      { label: "Pages", value: "40+" },
      { label: "Components", value: "100+" },
      { label: "Experiments", value: "25" },
    ],
  },
  {
    id: "v4",
    date: "March 2026",
    title: "Portfolio v4.0 - Zen & Evolution",
    description: "The latest evolution featuring meditation spaces, time travel capabilities, and a secret garden sanctuary for mindful browsing.",
    icon: Star,
    color: "from-emerald-500 to-teal-500",
    features: ["Meditation sanctuary", "Time machine", "Secret garden", "Developer dashboard", "Code poetry"],
    stats: [
      { label: "Pages", value: "60+" },
      { label: "Components", value: "150+" },
      { label: "Features", value: "50+" },
    ],
  },
];

const milestoneFeatures = [
  { icon: Terminal, label: "Matrix Rain", version: "v2", color: "text-green-400" },
  { icon: Gamepad2, label: "Mini Games", version: "v2", color: "text-yellow-400" },
  { icon: Brain, label: "AI Art Gen", version: "v3", color: "text-pink-400" },
  { icon: Box, label: "3D World", version: "v3", color: "text-purple-400" },
  { icon: Eye, label: "Shaders", version: "v3", color: "text-cyan-400" },
  { icon: Atom, label: "Physics", version: "v3", color: "text-blue-400" },
  { icon: Mic, label: "Voice AI", version: "v3", color: "text-amber-400" },
  { icon: Clock, label: "Time Machine", version: "v4", color: "text-emerald-400" },
];

export function PortfolioTimeMachine() {
  const [selectedVersion, setSelectedVersion] = useState(3);
  const [isTimeTraveling, setIsTimeTraveling] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  const handleTimeTravel = (index: number) => {
    if (index === selectedVersion) return;
    
    setIsTimeTraveling(true);
    setShowGlitch(true);
    
    setTimeout(() => {
      setSelectedVersion(index);
      setShowGlitch(false);
      setTimeout(() => setIsTimeTraveling(false), 500);
    }, 800);
  };

  const currentVersion = portfolioVersions[selectedVersion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Time Vortex */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${selectedVersion === 0 ? '#3b82f6' : selectedVersion === 1 ? '#a855f7' : selectedVersion === 2 ? '#f97316' : '#10b981'}, transparent)`,
            opacity: 0.1,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Glitch Effect */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              )`,
            }}
          >
            <motion.div
              className="absolute inset-0 bg-primary/20"
              animate={{
                opacity: [0, 0.5, 0, 0.3, 0],
              }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
            >
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Time Machine</h1>
              <p className="text-sm text-white/60">Journey through portfolio evolution</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-white/20 text-white/80"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().getFullYear()}
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]"
        >
          {/* Left: Timeline Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold mb-8"
            >
              Select a{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
              >
                Timeline
              </span>
            </h2>

            <div className="relative"
            >
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-transparent"
              />

              {/* Timeline Items */}
              <div className="space-y-6"
              >
                {portfolioVersions.map((version, index) => {
                  const Icon = version.icon;
                  const isSelected = selectedVersion === index;
                  
                  return (
                    <motion.button
                      key={version.id}
                      onClick={() => handleTimeTravel(index)}
                      whileHover={{ x: 10 }}
                      className={`relative flex items-start gap-4 w-full text-left p-4 rounded-2xl transition-all ${
                        isSelected
                          ? "bg-white/10 border border-white/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${version.color} ${
                        isSelected ? "ring-4 ring-white/20" : ""
                      }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1"
                      >
                        <div className="flex items-center gap-2 mb-1"
                        >
                          <span className="text-sm text-white/50">{version.date}</span>
                          {isSelected && (
                            <Badge className="bg-primary text-white text-xs"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg"
                        >{version.title}</h3>
                        <p className="text-sm text-white/60 line-clamp-2"
                        >{version.description}</p>
                      </div>

                      {isSelected && (
                        <motion.div
                          layoutId="selectedIndicator"
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Version Details */}
          <motion.div
            key={currentVersion.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Version Card */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${currentVersion.color} opacity-20 blur-xl rounded-3xl`}
              />

              <div className="relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6"
                >
                  <div>
                    <Badge className={`mb-3 bg-gradient-to-r ${currentVersion.color} text-white`}
                    >
                      {currentVersion.id.toUpperCase()}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2"
                    >{currentVersion.title}</h2>
                    <p className="text-white/70"
                    >{currentVersion.description}</p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentVersion.color} flex items-center justify-center`}
                  >
                    <currentVersion.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8"
                >
                  {currentVersion.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5"
                    >
                      <p className="text-2xl font-bold text-primary"
                      >{stat.value}</p>
                      <p className="text-sm text-white/60"
                      >{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="mb-8"
                >
                  <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider"
                  >Key Features</h3>
                  <div className="flex flex-wrap gap-2"
                  >
                    {currentVersion.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline" 
                        className="border-white/20 text-white/80 px-3 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className={`w-full bg-gradient-to-r ${currentVersion.color} hover:opacity-90 text-white`}
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Experience This Version
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Feature Milestones */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8"
          >
            Feature{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
            >
              Milestones
            </span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {milestoneFeatures.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="text-center"
                >
                  <p className="text-sm font-medium"
                  >{feature.label}</p>
                  <p className="text-xs text-white/50"
                  >{feature.version}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Evolution Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid md:grid-cols-4 gap-6"
        >
          {[
            { label: "Total Commits", value: "500+", icon: GitBranch },
            { label: "Lines of Code", value: "50K+", icon: Code2 },
            { label: "Experiments", value: "100+", icon: Zap },
            { label: "Happy Visitors", value: "10K+", icon: Star },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold mb-1"
              >{stat.value}</p>
              <p className="text-sm text-white/60"
              >{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
