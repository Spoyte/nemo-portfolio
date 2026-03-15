"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Music, 
  BookOpen, 
  Coffee, 
  Code2, 
  Zap,
  Heart,
  Sun,
  Moon,
  Cloud,
  Wind,
  Target,
  TrendingUp,
  Activity,
  Laptop,
  Headphones,
  MessageSquare,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NowItem {
  id: string;
  category: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  detail?: string;
  link?: string;
  color: string;
}

interface FocusSession {
  project: string;
  progress: number;
  target: string;
  deadline: string;
}

export function NowPageContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState({ temp: 22, condition: "sunny" });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    return () => clearInterval(timer);
  }, [currentTime]);

  const nowItems: NowItem[] = [
    {
      id: "working",
      category: "Working On",
      icon: <Laptop className="w-5 h-5" />,
      title: "Portfolio Enhancement",
      description: "Adding new interactive features and generative art pieces",
      detail: "Current focus: AI companion and creative coding playground",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "learning",
      category: "Learning",
      icon: <BookOpen className="w-5 h-5" />,
      title: "Advanced WebGL",
      description: "Three.js and shader programming",
      detail: "Exploring procedural textures and particle systems",
      link: "https://threejs-journey.com",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "listening",
      category: "Listening To",
      icon: <Headphones className="w-5 h-5" />,
      title: "Lo-Fi Coding Beats",
      description: "Chill instrumental music for focus",
      detail: "Currently playing: "Study Session - Evening Mix"",
      link: "https://open.spotify.com",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "reading",
      category: "Reading",
      icon: <BookOpen className="w-5 h-5" />,
      title: "The Creative Programmer",
      description: "Exploring the intersection of code and art",
      detail: "Chapter 5: Generative Algorithms",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "location",
      category: "Location",
      icon: <MapPin className="w-5 h-5" />,
      title: "Asia/Shanghai",
      description: "Building from here",
      detail: `Local time: ${currentTime.toLocaleTimeString()}`,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "mood",
      category: "Current Mood",
      icon: <Heart className="w-5 h-5" />,
      title: "Energetic & Creative",
      description: "Feeling inspired and productive",
      detail: "Perfect flow state for deep work",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const focusSessions: FocusSession[] = [
    {
      project: "Generative Art Gallery",
      progress: 75,
      target: "20 new art pieces",
      deadline: "End of month",
    },
    {
      project: "Interactive Components",
      progress: 60,
      target: "10 new components",
      deadline: "Next week",
    },
    {
      project: "Documentation",
      progress: 40,
      target: "Complete README",
      deadline: "Ongoing",
    },
  ];

  const recentUpdates = [
    {
      date: "Today",
      content: "Added AI Companion feature with voice interaction",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      date: "Yesterday",
      content: "Launched Code Evolution Theater",
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      date: "This week",
      content: "Redesigned navigation with micro-interactions",
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Last updated: Just now</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {greeting},{" "}
            <span className="text-gradient-animated">I'm Nemo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This is my "now" page — a snapshot of what I'm currently focused on, 
            learning, and enjoying. Updated in real-time.
          </p>
        </motion.div>

        {/* Live Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="p-4 rounded-2xl border border-border bg-card text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-xs text-muted-foreground">Local Time</p>
          </div>
          
          <div className="p-4 rounded-2xl border border-border bg-card text-center">
            <Sun className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{weather.temp}°C</p>
            <p className="text-xs text-muted-foreground">{weather.condition}</p>
          </div>
          
          <div className="p-4 rounded-2xl border border-border bg-card text-center">
            <Activity className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">Active</p>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
          
          <div className="p-4 rounded-2xl border border-border bg-card text-center">
            <Coffee className="w-5 h-5 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{currentTime.getHours() >= 14 ? "Tea" : "Coffee"}</p>
            <p className="text-xs text-muted-foreground">Fuel</p>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Now Items */}
          <div className="lg:col-span-2 space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold mb-6 flex items-center gap-2"
            >
              <Zap className="w-6 h-6 text-primary" />
              What I'm Up To
            </motion.h2>

            {nowItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shrink-0`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    
                    {item.detail && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Focus Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Current Focus
              </h3>
              
              <div className="space-y-4">
                {focusSessions.map((session) => (
                  <div key={session.project}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{session.project}</span>
                      <span className="text-xs text-muted-foreground">{session.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${session.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.target} • {session.deadline}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Updates
              </h3>
              
              <div className="space-y-4">
                {recentUpdates.map((update, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 h-fit">
                      {update.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{update.date}</p>
                      <p className="text-sm">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary to-orange-500 text-white"
            >
              <h3 className="font-semibold mb-2">Let's Connect!</h3>
              <p className="text-sm text-white/80 mb-4">
                Interested in collaborating or just want to chat about code?
              </p>
              <Button variant="secondary" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Inspired by{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              nownownow.com
            </a>
            {" "}— a movement of people sharing what they're focused on right now.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
