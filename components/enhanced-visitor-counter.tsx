"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Eye, TrendingUp, Clock, Globe, Sparkles } from "lucide-react";

interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  onlineNow: number;
  lastVisit: string;
}

export function EnhancedVisitorCounter() {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    onlineNow: 0,
    lastVisit: "",
  });
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load or initialize visitor data
    const initializeStats = () => {
      const stored = localStorage.getItem("visitor-stats");
      const today = new Date().toDateString();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Check if this is a new day
        if (parsed.lastVisitDate !== today) {
          parsed.dailyVisits = (parsed.dailyVisits || 0) + 1;
          parsed.lastVisitDate = today;
        }
        
        // Increment total visitors
        parsed.totalVisitors = (parsed.totalVisitors || 1337) + 1;
        parsed.pageViews = (parsed.pageViews || 0) + 1;
        
        // Simulate unique visitors (in reality, this would use fingerprinting)
        const isNewVisitor = !sessionStorage.getItem("visited");
        if (isNewVisitor) {
          parsed.uniqueVisitors = (parsed.uniqueVisitors || 0) + 1;
          sessionStorage.setItem("visited", "true");
        }
        
        // Simulate online users (random between 1-15)
        parsed.onlineNow = Math.floor(Math.random() * 15) + 1;
        parsed.lastVisit = new Date().toISOString();
        
        localStorage.setItem("visitor-stats", JSON.stringify(parsed));
        setStats(parsed);
      } else {
        const initialStats: VisitorStats & { lastVisitDate: string; dailyVisits: number } = {
          totalVisitors: 1338,
          uniqueVisitors: 1,
          pageViews: 1,
          onlineNow: Math.floor(Math.random() * 10) + 1,
          lastVisit: new Date().toISOString(),
          lastVisitDate: today,
          dailyVisits: 1,
        };
        localStorage.setItem("visitor-stats", JSON.stringify(initialStats));
        sessionStorage.setItem("visited", "true");
        setStats(initialStats);
      }
    };

    initializeStats();

    // Update online count periodically
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        onlineNow: Math.floor(Math.random() * 15) + 1,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>{stats.totalVisitors.toLocaleString()} visitors</span>
        <span className="text-muted-foreground">•</span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {stats.onlineNow} online
        </span>
      </motion.button>

      <AnimatePresence>
        {showDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowDetails(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 z-50 w-72 p-4 rounded-2xl bg-popover border shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold">Visitor Analytics</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total Visitors</span>
                  </div>
                  <span className="font-bold">{stats.totalVisitors.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Unique Visitors</span>
                  </div>
                  <span className="font-bold">{stats.uniqueVisitors.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Page Views</span>
                  </div>
                  <span className="font-bold">{stats.pageViews.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Online Now</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-bold text-green-500">{stats.onlineNow}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t text-xs text-muted-foreground text-center">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple counter for use in other places
export function VisitorCounterBadge() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("visitor-stats");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCount(parsed.totalVisitors || 1337);
    } else {
      setCount(1337);
    }
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
      </span>
      <span>{count.toLocaleString()} visitors</span>
    </motion.div>
  );
}
