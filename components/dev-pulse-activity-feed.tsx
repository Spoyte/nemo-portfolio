"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  GitBranch,
  Star,
  MessageSquare,
  Zap,
  Trophy,
  Clock,
  Activity,
  Flame,
  Code2,
  Bug,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { ScrollReveal } from "./scroll-animations";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface ActivityItem {
  id: string;
  type: "commit" | "pr" | "issue" | "star" | "comment" | "milestone" | "streak";
  title: string;
  description: string;
  project: string;
  timestamp: Date;
  stats?: {
    additions?: number;
    deletions?: number;
    files?: number;
  };
  likes: number;
  comments: number;
}

const generateMockActivities = (): ActivityItem[] => {
  const projects = ["nemo-portfolio", "generative-art", "openclaw-tools", "design-system", "api-gateway"];
  const types: ActivityItem["type"][] = ["commit", "pr", "issue", "star", "comment", "milestone", "streak"];
  
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "streak",
      title: "🔥 30 Day Coding Streak!",
      description: "Just hit 30 consecutive days of commits. The grind continues!",
      project: "Personal",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      likes: 47,
      comments: 12,
    },
    {
      id: "2",
      type: "commit",
      title: "feat: Add DevPulse activity feed",
      description: "Implemented real-time activity tracking with beautiful animations",
      project: "nemo-portfolio",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      stats: { additions: 342, deletions: 28, files: 4 },
      likes: 23,
      comments: 5,
    },
    {
      id: "3",
      type: "pr",
      title: "Merge PR #142: Code Garden visualization",
      description: "New interactive feature showing code growth as a digital garden",
      project: "nemo-portfolio",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 18,
      comments: 8,
    },
    {
      id: "4",
      type: "milestone",
      title: "🎯 1000+ GitHub Stars Reached!",
      description: "The generative-art project just hit a major milestone. Thank you all!",
      project: "generative-art",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      likes: 156,
      comments: 34,
    },
    {
      id: "5",
      type: "issue",
      title: "Fixed: Dark mode flickering on page load",
      description: "Resolved hydration mismatch causing theme flash",
      project: "design-system",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      likes: 12,
      comments: 3,
    },
    {
      id: "6",
      type: "star",
      title: "Starred vercel/next.js",
      description: "Great framework for building modern web applications",
      project: "Open Source",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      likes: 8,
      comments: 0,
    },
    {
      id: "7",
      type: "comment",
      title: "Replied to discussion on React Server Components",
      description: "Shared insights about streaming SSR and performance optimization",
      project: "Community",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      likes: 31,
      comments: 7,
    },
  ];
  
  return activities;
};

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "commit":
      return <GitCommit className="h-4 w-4" />;
    case "pr":
      return <GitBranch className="h-4 w-4" />;
    case "issue":
      return <Bug className="h-4 w-4" />;
    case "star":
      return <Star className="h-4 w-4" />;
    case "comment":
      return <MessageSquare className="h-4 w-4" />;
    case "milestone":
      return <Trophy className="h-4 w-4" />;
    case "streak":
      return <Flame className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: ActivityItem["type"]) => {
  switch (type) {
    case "commit":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "pr":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "issue":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "star":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "comment":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "milestone":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "streak":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const LiveIndicator = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
  </span>
);

export function DevPulseActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<"all" | ActivityItem["type"]> ("all");
  const [isLive, setIsLive] = useState(true);
  const [newActivityCount, setNewActivityCount] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivities(generateMockActivities());
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: ["commit", "star", "comment"][Math.floor(Math.random() * 3)] as ActivityItem["type"],
          title: ["New commit pushed", "Starred a project", "Left a comment"][Math.floor(Math.random() * 3)],
          description: "Live activity from the feed",
          project: ["nemo-portfolio", "generative-art", "design-system"][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          likes: 0,
          comments: 0,
        };
        
        setActivities(prev => [newActivity, ...prev].slice(0, 20));
        setNewActivityCount(prev => prev + 1);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  const handleLoadNew = () => {
    setNewActivityCount(0);
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filters: { value: typeof filter; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: <Activity className="h-3 w-3" /> },
    { value: "commit", label: "Commits", icon: <GitCommit className="h-3 w-3" /> },
    { value: "pr", label: "PRs", icon: <GitBranch className="h-3 w-3" /> },
    { value: "milestone", label: "Milestones", icon: <Trophy className="h-3 w-3" /> },
  ];

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Live Activity</span>
            <LiveIndicator />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dev<span className="text-gradient-animated">Pulse</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time feed of coding activity, contributions, and project updates.
          </p>
        </ScrollReveal>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Commits Today", value: 24, icon: GitCommit, color: "text-emerald-500" },
            { label: "Active Streak", value: 30, suffix: " days", icon: Flame, color: "text-orange-500" },
            { label: "PRs Merged", value: 8, icon: GitBranch, color: "text-purple-500" },
            { label: "Issues Closed", value: 15, icon: CheckCircle2, color: "text-blue-500" },
          ].map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}{stat.suffix}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f.value)}
                className="gap-1.5"
              >
                {f.icon}
                {f.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={isLive ? "text-green-500" : ""}
            >
              {isLive ? <>
                <LiveIndicator />
                <span className="ml-2">Live</span>
              </> : <>
                <Clock className="h-4 w-4 mr-2" />
                Paused
              </>}
            </Button>
          </div>
        </div>

        {/* New Activity Banner */}
        <AnimatePresence>
          {newActivityCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Button
                variant="outline"
                className="w-full bg-primary/5 border-primary/20 hover:bg-primary/10"
                onClick={handleLoadNew}
              >
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                {newActivityCount} new activit{newActivityCount === 1 ? "y" : "ies"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Feed */}
        <div
          ref={feedRef}
          className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide"
        >
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>

                    {/* Project Badge & Stats */}
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {activity.project}
                      </Badge>
                      
                      {activity.stats && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-emerald-500">+{activity.stats.additions}</span>
                          <span className="text-red-500">-{activity.stats.deletions}</span>
                          <span>in {activity.stats.files} files</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-3.5 w-3.5" />
                        {activity.likes}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {activity.comments}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button variant="outline" size="sm">
            Load More Activity
          </Button>
        </div>
      </div>
    </section>
  );
}
