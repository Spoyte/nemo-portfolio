"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Code2, 
  BookOpen, 
  Coffee, 
  Music, 
  Gamepad2,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface CurrentActivity {
  id: string;
  title: string;
  description: string;
  category: "work" | "learning" | "side-project" | "personal";
  progress: number;
  startedAt: string;
  targetDate?: string;
  icon: React.ElementType;
  color: string;
}

interface CurrentlyReading {
  title: string;
  author: string;
  progress: number;
  cover?: string;
}

interface CurrentlyListening {
  artist: string;
  track: string;
  album: string;
}

const currentActivities: CurrentActivity[] = [
  {
    id: "1",
    title: "Building AI-Powered Portfolio",
    description: "Adding intelligent features like AI chat, code review, and generative art to my portfolio.",
    category: "side-project",
    progress: 85,
    startedAt: "2024-01-15",
    targetDate: "2024-03-15",
    icon: Rocket,
    color: "#F59E0B",
  },
  {
    id: "2",
    title: "Learning Rust",
    description: "Diving into systems programming with Rust. Building CLI tools and WebAssembly modules.",
    category: "learning",
    progress: 45,
    startedAt: "2024-02-01",
    icon: Code2,
    color: "#DEA584",
  },
  {
    id: "3",
    title: "Senior Frontend Developer",
    description: "Leading frontend architecture at TechCorp. Building scalable React applications.",
    category: "work",
    progress: 100,
    startedAt: "2022-03-01",
    icon: Target,
    color: "#3B82F6",
  },
  {
    id: "4",
    title: "Writing Technical Blog",
    description: "Sharing knowledge about React patterns, performance optimization, and modern web development.",
    category: "personal",
    progress: 60,
    startedAt: "2024-01-01",
    icon: BookOpen,
    color: "#10B981",
  },
];

const currentlyReading: CurrentlyReading[] = [
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    progress: 75,
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    progress: 30,
  },
];

const currentlyListening: CurrentlyListening = {
  artist: "Tycho",
  track: "Awake",
  album: "Awake",
};

const location = {
  city: "San Francisco",
  country: "CA",
  timezone: "PST",
  weather: "☀️ 18°C",
};

const categoryColors = {
  work: "bg-blue-500",
  learning: "bg-amber-500",
  "side-project": "bg-purple-500",
  personal: "bg-green-500",
};

const categoryLabels = {
  work: "Work",
  learning: "Learning",
  "side-project": "Side Project",
  personal: "Personal",
};

function ActivityCard({ activity, index }: { activity: CurrentActivity; index: number }) {
  const Icon = activity.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
        style={{
          background: `radial-gradient(circle at center, ${activity.color}10, transparent 70%)`,
        }}
      />
      
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${activity.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: activity.color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
            >
              {categoryLabels[activity.category]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Started {new Date(activity.startedAt).toLocaleDateString()}
            </span>
          </div>
          
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {activity.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            {activity.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{activity.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activity.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: activity.color }}
              />
            </div>
          </div>
          
          {activity.targetDate && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Target: {new Date(activity.targetDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function NowPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"activities" | "reading" | "listening">("activities");
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Live Updates</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What I&apos;m Doing{" "}
            <span className="text-gradient-animated">Now</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A real-time snapshot of my current projects, learning journey, and daily activities.
          </p>
        </motion.div>
        
        {/* Location & Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 rounded-2xl bg-card border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{location.city}, {location.country}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Local Time</p>
              <p className="text-lg font-semibold font-mono">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-lg font-semibold">Available for work</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "activities", label: "Activities", icon: Target },
            { id: "reading", label: "Reading", icon: BookOpen },
            { id: "listening", label: "Listening", icon: Music },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "activities" && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {currentActivities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index} />
              ))}
            </motion.div>
          )}
          
          {activeTab === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {currentlyReading.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{book.progress}%</span>
                        </div>
                        <Progress value={book.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {activeTab === "listening" && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 bg-primary rounded-full"
                          animate={{
                            height: [20, 60, 20],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <Music className="w-12 h-12 text-primary/50 relative z-10" />
                </div>
                
                <div className="text-center md:text-left">
                  <Badge variant="outline" className="mb-4">Currently Playing</Badge>
                  <h3 className="text-2xl font-bold mb-2">{currentlyListening.track}</h3>
                  <p className="text-lg text-muted-foreground mb-1">{currentlyListening.artist}</p>
                  <p className="text-sm text-muted-foreground">{currentlyListening.album}</p>
                  
                  <div className="flex justify-center md:justify-start gap-4 mt-6">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Spotify
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to collaborate or just say hi?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button>
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </Link>
            <Link href="/hire">
              <Button variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Hire Me
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-12"
        >
          Last updated: March 4, 2026 • Inspired by{" "}
          <a 
            href="https://nownownow.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            nownownow.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default NowPage;