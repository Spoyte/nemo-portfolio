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
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Gamepad2,
  Dumbbell,
  Plane
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollReveal, Counter } from "@/components/scroll-animations";

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

export function EnhancedNowPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("now");

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
      detail: "Currently playing: \"Study Session - Evening Mix\"",
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

  const habits = [
    { name: "Coding", streak: 45, icon: <Code2 className="w-4 h-4" />, color: "bg-blue-500" },
    { name: "Reading", streak: 12, icon: <BookOpen className="w-4 h-4" />, color: "bg-green-500" },
    { name: "Exercise", streak: 8, icon: <Dumbbell className="w-4 h-4" />, color: "bg-orange-500" },
    { name: "Gaming", streak: 3, icon: <Gamepad2 className="w-4 h-4" />, color: "bg-purple-500" },
  ];

  const upcomingEvents = [
    { date: "Mar 20", title: "Project Deadline", type: "work" },
    { date: "Mar 25", title: "Tech Meetup", type: "social" },
    { date: "Apr 1", title: "New Quarter Goals", type: "planning" },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ScrollReveal className="text-center mb-12">
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
            This is my "now" page — a real-time snapshot of what I'm currently focused on, 
            learning, and enjoying.
          </p>
        </ScrollReveal>

        {/* Live Stats Bar */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { 
                icon: Clock, 
                value: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                label: "Local Time",
                color: "text-primary"
              },
              { 
                icon: Sun, 
                value: "22°C", 
                label: "Sunny",
                color: "text-yellow-500"
              },
              { 
                icon: Activity, 
                value: "Active", 
                label: "Status",
                color: "text-green-500"
              },
              { 
                icon: Coffee, 
                value: currentTime.getHours() >= 14 ? "Tea" : "Coffee", 
                label: "Fuel",
                color: "text-orange-500"
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-2xl border border-border bg-card text-center hover:border-primary/30 transition-colors"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Tabs Navigation */}
        <ScrollReveal delay={0.2}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-full bg-muted">
              {["now", "habits", "upcoming"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "now" && (
            <motion.div
              key="now"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Now Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary" />
                  What I'm Up To
                </h2>

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
              <div className="space-y-6">
                {/* Focus Sessions */}
                <Card>
                  <CardContent className="p-6">
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
                          <Progress value={session.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {session.target} • {session.deadline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Updates */}
                <Card>
                  <CardContent className="p-6">
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
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Connect</h3>
                    <div className="flex gap-2">
                      {[
                        { icon: Github, href: "#", label: "GitHub" },
                        { icon: Twitter, href: "#", label: "Twitter" },
                        { icon: Linkedin, href: "#", label: "LinkedIn" },
                        { icon: Mail, href: "#", label: "Email" },
                      ].map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "habits" && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Daily Habits
                  </h2>
                  
                  <div className="space-y-6">
                    {habits.map((habit, index) => (
                      <motion.div
                        key={habit.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                      >
                        <div className={`p-3 rounded-lg ${habit.color} text-white`}>
                          {habit.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{habit.name}</span>
                            <Badge variant="secondary">
                              {habit.streak} day streak
                            </Badge>
                          </div>
                          <Progress value={(habit.streak / 50) * 100} className="h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
                    <p className="text-sm text-center">
                      🔥 Current longest streak: <strong>45 days</strong> of coding!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "upcoming" && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Upcoming Events
                  </h2>
                  
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs text-muted-foreground">{event.date.split(" ")[0]}</p>
                          <p className="text-xl font-bold">{event.date.split(" ")[1]}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              event.type === "work" ? "border-blue-500 text-blue-500" :
                              event.type === "social" ? "border-green-500 text-green-500" :
                              "border-orange-500 text-orange-500"
                            }`}
                          >
                            {event.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Note */}
        <ScrollReveal className="mt-16 text-center">
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
        </ScrollReveal>
      </div>
    </div>
  );
}
