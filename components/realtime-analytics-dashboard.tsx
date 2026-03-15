"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  TrendingUp, 
  Activity,
  MousePointer,
  Zap,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollReveal, Counter } from "@/components/scroll-animations";

// Simulated real-time data
interface VisitorData {
  totalVisitors: number;
  activeVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: { path: string; views: number; trend: "up" | "down" }[];
  topCountries: { country: string; flag: string; visitors: number }[];
  deviceBreakdown: { device: string; percentage: number; icon: React.ReactNode }[];
  hourlyData: { hour: string; visitors: number }[];
  referrers: { source: string; visitors: number }[];
}

const mockData: VisitorData = {
  totalVisitors: 15234,
  activeVisitors: 42,
  pageViews: 48752,
  avgSessionDuration: "3m 24s",
  bounceRate: 32,
  topPages: [
    { path: "/", views: 5234, trend: "up" },
    { path: "/projects", views: 3421, trend: "up" },
    { path: "/blog", views: 2890, trend: "down" },
    { path: "/about", views: 2134, trend: "up" },
    { path: "/contact", views: 1567, trend: "up" },
  ],
  topCountries: [
    { country: "United States", flag: "🇺🇸", visitors: 4521 },
    { country: "Germany", flag: "🇩🇪", visitors: 2341 },
    { country: "United Kingdom", flag: "🇬🇧", visitors: 1890 },
    { country: "Japan", flag: "🇯🇵", visitors: 1234 },
    { country: "France", flag: "🇫🇷", visitors: 987 },
  ],
  deviceBreakdown: [
    { device: "Desktop", percentage: 58, icon: <Monitor className="w-4 h-4" /> },
    { device: "Mobile", percentage: 32, icon: <Smartphone className="w-4 h-4" /> },
    { device: "Tablet", percentage: 10, icon: <Tablet className="w-4 h-4" /> },
  ],
  hourlyData: [
    { hour: "00:00", visitors: 12 },
    { hour: "02:00", visitors: 8 },
    { hour: "04:00", visitors: 5 },
    { hour: "06:00", visitors: 15 },
    { hour: "08:00", visitors: 34 },
    { hour: "10:00", visitors: 56 },
    { hour: "12:00", visitors: 78 },
    { hour: "14:00", visitors: 89 },
    { hour: "16:00", visitors: 76 },
    { hour: "18:00", visitors: 54 },
    { hour: "20:00", visitors: 43 },
    { hour: "22:00", visitors: 28 },
  ],
  referrers: [
    { source: "Google", visitors: 3241 },
    { source: "GitHub", visitors: 1890 },
    { source: "Twitter/X", visitors: 1234 },
    { source: "LinkedIn", visitors: 876 },
    { source: "Direct", visitors: 2341 },
  ],
};

// World map dots for visual effect
const worldDots = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60 + 20,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 2,
}));

export function RealTimeAnalyticsDashboard() {
  const [data, setData] = useState<VisitorData>(mockData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        activeVisitors: prev.activeVisitors + Math.floor(Math.random() * 5) - 2,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 3),
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const maxHourlyVisitors = Math.max(...data.hourlyData.map(d => d.visitors));

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Real-time insights into portfolio performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Data
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </ScrollReveal>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: "Total Visitors", 
              value: data.totalVisitors, 
              icon: Users, 
              change: "+12.5%",
              color: "text-blue-500"
            },
            { 
              label: "Active Now", 
              value: data.activeVisitors, 
              icon: Eye, 
              change: "Live",
              color: "text-green-500",
              pulse: true
            },
            { 
              label: "Page Views", 
              value: data.pageViews, 
              icon: MousePointer, 
              change: "+8.3%",
              color: "text-purple-500"
            },
            { 
              label: "Avg. Session", 
              value: data.avgSessionDuration, 
              icon: Clock, 
              change: "+2.1%",
              color: "text-orange-500",
              isString: true
            },
          ].map((metric, index) => (
            <ScrollReveal key={metric.label} delay={index * 0.1}>
              <Card className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-primary/10 ${metric.color}`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {metric.pulse && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    <p className="text-3xl font-bold">
                      {metric.isString ? metric.value : <Counter to={typeof metric.value === 'number' ? metric.value : 0} />}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* World Map Visualization */}
        <ScrollReveal className="mb-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Visitor Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative h-64 bg-gradient-to-b from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl overflow-hidden">
                {/* Simplified world map dots */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {worldDots.map((dot) => (
                    <motion.circle
                      key={dot.id}
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.size}
                      fill="currentColor"
                      className="text-primary/40"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3], 
                        scale: [1, 1.5, 1] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: dot.delay 
                      }}
                    />
                  ))}
                </svg>
                
                {/* Active visitor pulses */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${30 + Math.random() * 40}%`,
                    }}
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </motion.div>
                ))}
                
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-medium">{data.activeVisitors} active visitors</p>
                  <p className="text-xs text-muted-foreground">From {data.topCountries.length}+ countries</p>
                </div>
              </div>
              
              {/* Top Countries */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {data.topCountries.map((country, index) => (
                  <div key={country.country} className="text-center p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl">{country.flag}</span>
                    <p className="text-sm font-medium mt-1">{country.country}</p>
                    <p className="text-xs text-muted-foreground">{country.visitors.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Traffic */}
          <ScrollReveal>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-primary" />
                  Hourly Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-48">
                  {data.hourlyData.map((hour, index) => (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: `${(hour.visitors / maxHourlyVisitors) * 100}%` }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-primary/10" />
                      </motion.div>
                      <span className="text-[10px] text-muted-foreground rotate-45 origin-left translate-y-2">
                        {hour.hour}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Device Breakdown */}
          <ScrollReveal delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.deviceBreakdown.map((device) => (
                  <div key={device.device}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {device.icon}
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                    </div>
                    <Progress value={device.percentage} className="h-2" />
                  </div>
                ))}
                
                {/* Visual pie representation */}
                <div className="flex justify-center pt-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {data.deviceBreakdown.reduce((acc, device, index) => {
                        const prevOffset = index === 0 ? 0 : acc.offset;
                        const dashArray = `${device.percentage} ${100 - device.percentage}`;
                        const colors = ["#dc2626", "#ea580c", "#d97706"];
                        acc.elements.push(
                          <circle
                            key={device.device}
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke={colors[index]}
                            strokeWidth="3"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-prevOffset}
                            className="transition-all duration-500"
                          />
                        );
                        acc.offset = prevOffset + device.percentage;
                        return acc;
                      }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Monitor className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Top Pages & Referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                      <span className="font-medium">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</span>
                      {page.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Top Referrers */}
          <ScrollReveal delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.referrers.map((referrer, index) => (
                  <div key={referrer.source} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{referrer.source}</span>
                        <span className="text-sm text-muted-foreground">{referrer.visitors.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(referrer.visitors / data.referrers[0].visitors) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Footer Note */}
        <ScrollReveal className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Data is simulated for demonstration purposes. In production, this would connect to 
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
              Vercel Analytics
            </a> or similar service.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
