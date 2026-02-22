"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Briefcase, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Code2,
  Music,
  Github,
  Coffee,
  Zap,
  Heart,
  Radio,
  Disc,
  Headphones,
  CheckCircle2,
  Clock,
  Activity,
  Sparkles,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Current status with animated indicator
function CurrentStatus() {
  const [status, setStatus] = useState<"coding" | "learning" | "building" | "resting">("coding");
  
  // Simulate status changes based on time (in real app, this would come from an API)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 18) {
      setStatus("coding");
    } else if (hour >= 18 && hour < 22) {
      setStatus("learning");
    } else if (hour >= 22 || hour < 1) {
      setStatus("building");
    } else {
      setStatus("resting");
    }
  }, []);

  const statusConfig = {
    coding: { 
      label: "Coding", 
      color: "bg-emerald-500", 
      icon: Code2,
      description: "Working on new features"
    },
    learning: { 
      label: "Learning", 
      color: "bg-blue-500", 
      icon: BookOpen,
      description: "Exploring new technologies"
    },
    building: { 
      label: "Building", 
      color: "bg-purple-500", 
      icon: Zap,
      description: "Shipping side projects"
    },
    resting: { 
      label: "Resting", 
      color: "bg-orange-500", 
      icon: Coffee,
      description: "Recharging batteries"
    },
  };

  const current = statusConfig[status];
  const Icon = current.icon;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full ${current.color} flex items-center justify-center`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.color} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-5 w-5 ${current.color}`}></span>
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Currently</p>
            <h3 className="text-2xl font-bold">{current.label}</h3>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <Badge variant="secondary">Active Now</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Spotify-style Now Playing Widget
function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35);

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const track = {
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "🌃",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Disc className="h-4 w-4 text-green-500" />
          Now Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl shadow-lg"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            {track.cover}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="font-semibold truncate"
              animate={{ x: isPlaying ? [0, -10, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {track.title}
            </motion.h4>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            <p className="text-xs text-muted-foreground truncate">{track.album}</p>
            
            <div className="mt-3">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{Math.floor((progress / 100) * 243 / 60)}:{String(Math.floor((progress / 100) * 243 % 60)).padStart(2, '0')}</span>
                <span>4:03</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reading List with Progress
function ReadingList() {
  const books = [
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      progress: 75,
      cover: "📘",
      status: "reading",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      progress: 30,
      cover: "📗",
      status: "reading",
    },
    {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      progress: 0,
      cover: "📕",
      status: "queued",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Reading List
        </CardTitle>
        <CardDescription>Books I'm currently reading or plan to read</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {books.map((book, index) => (
          <motion.div
            key={book.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="text-3xl">{book.cover}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{book.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{book.author}</p>
              <div className="mt-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${book.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      book.status === 'reading' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {book.progress > 0 ? `${book.progress}% complete` : 'Not started'}
                  </span>
                  {book.status === 'reading' && (
                    <Badge variant="secondary" className="text-xs">Reading</Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Monthly Goals Tracker
function MonthlyGoals() {
  const goals = [
    { text: "Contribute to 5 open source projects", completed: 3, target: 5, icon: Github },
    { text: "Learn Rust to proficiency", completed: 1, target: 3, icon: Code2 },
    { text: "Write 12 technical blog posts", completed: 8, target: 12, icon: BookOpen },
    { text: "Speak at a tech conference", completed: 0, target: 1, icon: Target },
  ];

  const month = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {month} {year} Goals
        </CardTitle>
        <CardDescription>Tracking progress on this month's objectives</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            const progress = (goal.completed / goal.target) * 100;
            
            return (
              <motion.div
                key={goal.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    progress >= 100 ? 'bg-green-500/10 text-green-500' : 'bg-muted'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`flex-1 ${progress >= 100 ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.text}
                  </span>
                  <span className="text-sm font-medium">
                    {goal.completed}/{goal.target}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden ml-11">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      progress >= 100 ? 'bg-green-500' : 'bg-primary'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>            <span className="font-bold">
              {Math.round(goals.reduce((acc, g) => acc + (g.completed / g.target), 0) / goals.length * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goals.reduce((acc, g) => acc + (g.completed / g.target), 0) / goals.length * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// GitHub Activity Feed
function GitHubActivity() {
  const activities = [
    { type: 'commit', repo: 'nemo-portfolio', message: 'feat: add interactive skills visualization', time: '2 hours ago' },
    { type: 'pr', repo: 'awesome-react-hooks', message: 'docs: update useDebounce documentation', time: '5 hours ago' },
    { type: 'star', repo: 'vercel/next.js', message: 'Starred vercel/next.js', time: '1 day ago' },
    { type: 'issue', repo: 'tailwindlabs/tailwindcss', message: 'fix: dark mode toggle not persisting', time: '2 days ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'commit': return '💻';
      case 'pr': return '🔄';
      case 'star': return '⭐';
      case 'issue': return '🐛';
      default: return '📝';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5 text-primary" />
          Recent GitHub Activity
        </CardTitle>
        <CardDescription>My latest contributions and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-xl">{getIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.repo}</span>
                </p>
                <p className="text-sm text-muted-foreground truncate">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4" asChild>
          <a href="https://github.com/nemodev" target="_blank" rel="noopener noreferrer">
            View GitHub Profile
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Learning Progress
function LearningProgress() {
  const learning = [
    { name: "Rust", level: 40, description: "Systems programming and WebAssembly", category: "Backend" },
    { name: "Three.js", level: 60, description: "3D web graphics and animations", category: "Frontend" },
    { name: "AI/ML", level: 25, description: "Machine learning fundamentals", category: "Backend" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {learning.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant="outline">{item.category}</Badge>
            </div>            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.level}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.level}% complete</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function NowPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">What I'm Up To</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Now</h1>
          <p className="text-muted-foreground text-lg">
            What I'm currently working on, learning, and thinking about.{" "}
            <span className="text-sm">(Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})</span>
          </p>
        </motion.div>

        {/* Status and Now Playing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CurrentStatus />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NowPlaying />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Currently Working On
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Building a SaaS Platform</h3>
                        <Badge>In Progress</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Developing a comprehensive project management tool for remote teams 
                        with real-time collaboration features.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Code2 className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">CLI Tool</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          A command-line utility for automating daily development tasks.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">Rust</Badge>
                          <Badge variant="secondary" className="text-xs">Clap</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">Browser Extension</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Productivity extension for managing browser tabs and sessions.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                          <Badge variant="secondary" className="text-xs">Plasmo</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MonthlyGoals />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GitHubActivity />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ReadingList />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <LearningProgress />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-3xl">
                      👋
                    </div>
                    <h3 className="font-semibold mb-2">Let&apos;s Connect</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Always open to interesting conversations and collaborations.
                    </p>
                    
                    <Button className="w-full" asChild>
                      <a href="/contact">Get in Touch</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
