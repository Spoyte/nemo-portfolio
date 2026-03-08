"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Monitor,
  Smartphone,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  MousePointer,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data - in production, this would come from an analytics API
const mockData = {
  overview: {
    totalVisitors: 15420,
    uniqueVisitors: 8932,
    pageViews: 45231,
    avgSessionDuration: "3m 42s",
    bounceRate: "32%",
  },
  trends: {
    visitors: { value: 23, positive: true },
    pageViews: { value: 18, positive: true },
    duration: { value: 5, positive: true },
    bounceRate: { value: 8, positive: false },
  },
  topPages: [
    { path: "/", views: 5234, percentage: 28 },
    { path: "/projects", views: 3421, percentage: 18 },
    { path: "/blog", views: 2890, percentage: 15 },
    { path: "/about", views: 2134, percentage: 11 },
    { path: "/contact", views: 1890, percentage: 10 },
  ],
  devices: [
    { name: "Desktop", percentage: 58, icon: Monitor },
    { name: "Mobile", percentage: 35, icon: Smartphone },
    { name: "Tablet", percentage: 7, icon: Monitor },
  ],
  countries: [
    { name: "United States", visitors: 4520, flag: "🇺🇸" },
    { name: "United Kingdom", visitors: 2340, flag: "🇬🇧" },
    { name: "Germany", visitors: 1890, flag: "🇩🇪" },
    { name: "Canada", visitors: 1234, flag: "🇨🇦" },
    { name: "France", visitors: 980, flag: "🇫🇷" },
  ],
  referrers: [
    { name: "Google", visitors: 5234, percentage: 45 },
    { name: "GitHub", visitors: 2340, percentage: 20 },
    { name: "Twitter", visitors: 1560, percentage: 13 },
    { name: "LinkedIn", visitors: 1234, percentage: 11 },
    { name: "Direct", visitors: 1289, percentage: 11 },
  ],
  hourlyData: [
    { hour: "00:00", visitors: 45 },
    { hour: "02:00", visitors: 32 },
    { hour: "04:00", visitors: 28 },
    { hour: "06:00", visitors: 56 },
    { hour: "08:00", visitors: 134 },
    { hour: "10:00", visitors: 234 },
    { hour: "12:00", visitors: 312 },
    { hour: "14:00", visitors: 298 },
    { hour: "16:00", visitors: 267 },
    { hour: "18:00", visitors: 198 },
    { hour: "20:00", visitors: 156 },
    { hour: "22:00", visitors: 89 },
  ],
  realtime: {
    activeUsers: 42,
    pageViews: 128,
    events: [
      { action: "Page view", path: "/projects", time: "2s ago" },
      { action: "Click", path: "/contact", time: "5s ago" },
      { action: "Page view", path: "/blog/nextjs-tips", time: "8s ago" },
      { action: "Scroll", path: "/", time: "12s ago" },
      { action: "Page view", path: "/about", time: "15s ago" },
    ],
  },
};

function StatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  index 
}: { 
  title: string; 
  value: string; 
  trend: { value: number; positive: boolean };
  icon: React.ElementType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        
        <div className={`flex items-center gap-1 text-sm ${trend.positive ? "text-green-500" : "text-red-500"}`}>
          {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trend.value}%</span>
        </div>
      </div>
      
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
}

function BarChart({ data }: { data: { hour: string; visitors: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.visitors));
  
  return (
    <div className="h-48 flex items-end gap-2">
      {data.map((item, index) => (
        <motion.div
          key={item.hour}
          initial={{ height: 0 }}
          animate={{ height: `${(item.visitors / maxValue) * 100}%` }}
          transition={{ delay: index * 0.05, duration: 0.5 }}
          className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors relative group"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-card border px-2 py-1 rounded whitespace-nowrap">
            {item.visitors} visitors
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RealtimeUsers() {
  const [count, setCount] = useState(mockData.realtime.activeUsers);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="font-bold">{count}</span>
      <span className="text-muted-foreground">active users</span>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                <Zap className="w-4 h-4" />
                <span>Live Dashboard</span>
              </div>
              <RealtimeUsers />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              {(["24h", "7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range === "24h" ? "24 Hours" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
            
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Visitors"
            value={mockData.overview.totalVisitors.toLocaleString()}
            trend={mockData.trends.visitors}
            icon={Users}
            index={0}
          />
          <StatCard
            title="Page Views"
            value={mockData.overview.pageViews.toLocaleString()}
            trend={mockData.trends.pageViews}
            icon={Eye}
            index={1}
          />
          <StatCard
            title="Avg. Session"
            value={mockData.overview.avgSessionDuration}
            trend={mockData.trends.duration}
            icon={Clock}
            index={2}
          />
          <StatCard
            title="Bounce Rate"
            value={mockData.overview.bounceRate}
            trend={mockData.trends.bounceRate}
            icon={BarChart3}
            index={3}
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-card border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Traffic Overview</h3>
              <Badge variant="outline">Hourly</Badge>
            </div>
            
            <BarChart data={mockData.hourlyData} />
            
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              {mockData.hourlyData.filter((_, i) => i % 2 === 0).map((item) => (
                <span key={item.hour}>{item.hour}</span>
              ))}
            </div>
          </motion.div>
          
          {/* Real-time Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-card border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Live Activity</h3>
              <Badge variant="secondary">{mockData.realtime.events.length} events</Badge>
            </div>
            
            <div className="space-y-3">
              {mockData.realtime.events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MousePointer className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.path}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Secondary Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-card border"
          >
            <h3 className="font-semibold mb-6">Top Pages</h3>
            
            <div className="space-y-4">
              {mockData.topPages.map((page, index) => (
                <div key={page.path}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{page.path}</span>
                    <span className="text-sm text-muted-foreground">{page.views.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${page.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl bg-card border"
          >
            <h3 className="font-semibold mb-6">Devices</h3>
            
            <div className="space-y-4">
              {mockData.devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={device.name} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{device.name}</span>
                        <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.percentage}%` }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-2xl bg-card border"
          >
            <h3 className="font-semibold mb-6">Top Countries</h3>
            
            <div className="space-y-3">
              {mockData.countries.map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <span className="text-muted-foreground">{country.visitors.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-12"
        >
          Data is simulated for demonstration purposes. In production, this would integrate with 
          Google Analytics, Plausible, or another analytics provider.
        </motion.p>
      </div>
    </div>
  );
}
