"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  GitCommit, 
  Sparkles, 
  Rocket,
  Code,
  Palette,
  Zap,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TimelineEvent {
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
    date: "February 2025",
    title: "The Beginning",
    description: "Portfolio v1.0 launched with basic Next.js setup, simple navigation, and a clean hero section.",
    icon: Code,
    color: "from-gray-500 to-slate-500",
    features: [
      "Basic Next.js 14 setup",
      "Simple navigation",
      "Hero section with CTA",
      "Contact form",
      "Dark mode support"
    ],
    stats: [
      { label: "Pages", value: "5" },
      { label: "Components", value: "12" },
      { label: "Art Pieces", value: "0" }
    ]
  },
  {
    date: "February 2025",
    title: "Generative Art Gallery",
    description: "Added the first generative art pieces - Flow Fields and Particle Systems brought the portfolio to life.",
    icon: Palette,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Flow Field algorithm",
      "Particle systems",
      "Interactive canvas",
      "Art gallery grid",
      "Real-time generation"
    ],
    stats: [
      { label: "Art Pieces", value: "5" },
      { label: "Algorithms", value: "3" },
      { label: "Interactions", value: "10+" }
    ]
  },
  {
    date: "March 2025",
    title: "Version 2.0 - Interactive Features",
    description: "Major upgrade with games, challenges, and interactive tools. The portfolio became an experience.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Typing Race game",
      "Daily Challenges",
      "Idea Generator",
      "Soundboard",
      "Achievement System",
      "Easter Egg Hunt"
    ],
    stats: [
      { label: "Games", value: "3" },
      { label: "Features", value: "15+" },
      { label: "Easter Eggs", value: "8" }
    ]
  },
  {
    date: "March 2025",
    title: "Version 3.0 - Immersive Experience",
    description: "Three.js integration, AI art generation, physics playground, and shader studio pushed boundaries.",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    features: [
      "Immersive 3D world",
      "AI Art Generator",
      "Physics Playground",
      "Shader Studio",
      "Voice Navigation",
      "Code Evolution Theater"
    ],
    stats: [
      { label: "3D Scenes", value: "5" },
      { label: "Physics Sims", value: "3" },
      { label: "AI Features", value: "2" }
    ]
  },
  {
    date: "March 2025",
    title: "Version 4.0 - Wellness & Reflection",
    description: "Added meditation, time machine, secret garden, and analytics dashboard for a holistic experience.",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500",
    features: [
      "Code Meditation",
      "Time Machine",
      "Secret Garden",
      "Analytics Dashboard",
      "Bookmarks Manager",
      "Guestbook"
    ],
    stats: [
      { label: "Wellness Features", value: "4" },
      { label: "Total Pages", value: "50+" },
      { label: "Art Algorithms", value: "40+" }
    ]
  }
];

const futurePlans = [
  "WebXR Virtual Reality experience",
  "Multiplayer collaborative canvas",
  "AI-powered portfolio assistant",
  "Real-time code streaming",
  "Community art challenges",
  "Interactive tutorials platform"
];

export default function TimeMachinePage() {
  const [currentIndex, setCurrentIndex] = useState(portfolioVersions.length - 1);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentVersion = portfolioVersions[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % portfolioVersions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const newIndex = prev + newDirection;
      if (newIndex < 0) return portfolioVersions.length - 1;
      if (newIndex >= portfolioVersions.length) return 0;
      return newIndex;
    });
    setIsAutoPlaying(false);
  };

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">Time Machine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Portfolio Evolution
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Journey through the evolution of this portfolio. See how it grew from a simple site to an immersive experience.
          </p>
        </motion.div>

        {/* Timeline Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full p-2">
            {portfolioVersions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              >
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-white/50"
                    initial={{ scale: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center mb-12">
          <div className="relative w-full max-w-4xl">
            {/* Navigation Buttons */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Version Card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
              >
                {/* Card Header */}
                <div className={`p-8 bg-gradient-to-r ${currentVersion.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-white/20">
                        <currentVersion.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {currentVersion.date}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                          {currentVersion.title}
                        </h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-white">
                        v{currentIndex + 1}.0
                      </p>
                    </div>
                  </div>
                  <p className="text-white/80 text-lg">{currentVersion.description}</p>
                </div>

                {/* Card Content */}
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {currentVersion.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-white/70"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentVersion.color}`} />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitCommit className="w-5 h-5 text-blue-400" />
                      By the Numbers
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {currentVersion.stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-center p-4 rounded-xl bg-white/5"
                        >
                          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-xs text-white/50">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant="outline"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isAutoPlaying ? (
              <><RotateCcw className="w-4 h-4 mr-2" /> Stop Tour</>
            ) : (
              <><Rocket className="w-4 h-4 mr-2" /> Auto Tour</>
            )}
          </Button>
        </div>

        {/* Future Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" />
              Coming Soon
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {futurePlans.map((plan, i) => (
                <motion.div
                  key={plan}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {plan}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Return to Present
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
