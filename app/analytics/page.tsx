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
  Tablet,
  TrendingUp,
  TrendingDown,
  MousePointer,
  MapPin,
  Calendar,
  ArrowUpRight,
  Activity,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-animations";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Simulated real-time data
const generateVisitors = () => Math.floor(Math.random() * 50) + 20;
const generatePageViews = () => Math.floor(Math.random() * 150) + 80;

interface LiveStats {
  activeVisitors: number;
  totalViews: number;
  avgSessionDuration: string;
  bounceRate: string;
}

const topPages = [
  { path: "/", views: 1247, trend: "up" },
  { path: "/projects", views: 892, trend: "up" },
  { path: "/blog", views: 654, trend: "down" },
  { path: "/about", views: 423, trend: "up" },
  { path: "/contact", views: 312, trend: "up" },
];

const trafficSources = [
  { name: "Direct", value: 45, color: "#dc2626" },
  { name: "Search", value: 30, color: "#ea580c" },
  { name: "Social", value: 15, color: "#d97706" },
  { name: "Referral", value: 10, color: "#65a30d" },
];

const deviceBreakdown = [
  { name: "Desktop", value: 58, icon: Monitor },
  { name: "Mobile", value: 35, icon: Smartphone },
  { name: "Tablet", value: 7, icon: Tablet },
];

const topCountries = [
  { name: "United States", flag: "🇺🇸", visitors: 456, percentage: 32 },
  { name: "China", flag: "🇨🇳", visitors: 312, percentage: 22 },
  { name: "United Kingdom", flag: "🇬🇧", visitors: 189, percentage: 13 },
  { name: "Germany", flag: "🇩🇪", visitors: 134, percentage: 9 },
  { name: "Canada", flag: "🇨🇦", visitors: 98, percentage: 7 },
];

const hourlyData = [
  { hour: "00:00", visitors: 12 },
  { hour: "02:00", visitors: 8 },
  { hour: "04:00", visitors: 5 },
  { hour: "06:00", visitors: 15 },
  { hour: "08:00", visitors: 32 },
  { hour: "10:00", visitors: 48 },
  { hour: "12:00", visitors: 42 },
  { hour: "14:00", visitors: 56 },
  { hour: "16:00", visitors: 64 },
  { hour: "18:00", visitors: 52 },
  { hour: "20:00", visitors: 38 },
  { hour: "22:00", visitors: 24 },
];

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  delay,
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            <div className="flex items-center gap-1 mt-2">
              {changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : changeType === "negative" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`text-sm ${
                  changeType === "positive"
                    ? "text-green-500"
                    : changeType === "negative"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function AnalyticsDashboard() {
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeVisitors: 42,
    totalViews: 15234,
    avgSessionDuration: "3m 24s",
    bounceRate: "42%",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        activeVisitors: generateVisitors(),
        totalViews: prev.totalViews + Math.floor(Math.random() * 5),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
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
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                Last 30 days
              </Badge>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Visitors"
            value={
              <AnimatePresence mode="wait">
                <motion.span
                  key={liveStats.activeVisitors}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {liveStats.activeVisitors}
                </motion.span>
              </AnimatePresence>
            }
            change="+12% vs last hour"
            changeType="positive"
            icon={Users}
            delay={0.1}
          />
          <StatCard
            title="Total Page Views"
            value={<AnimatedCounter value={liveStats.totalViews} />}
            change="+8.5% this week"
            changeType="positive"
            icon={Eye}
            delay={0.2}
          />
          <StatCard
            title="Avg. Session"
            value={liveStats.avgSessionDuration}
            change="+15s vs yesterday"
            changeType="positive"
            icon={Clock}
            delay={0.3}
          />
          <StatCard
            title="Bounce Rate"
            value={liveStats.bounceRate}
            change="-3% this week"
            changeType="positive"
            icon={Activity}
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic Chart */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Hourly Traffic</h2>
                <Badge variant="outline">
                  <Zap className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="h-64 flex items-end gap-2">
                {hourlyData.map((data, index) => (
                  <motion.div
                    key={data.hour}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.visitors / 64) * 100}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <motion.div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/20 to-primary relative group cursor-pointer"
                      whileHover={{ opacity: 0.8 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.visitors} visitors
                      </div>
                    </motion.div>
                    <span className="text-xs text-muted-foreground">
                      {data.hour}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Traffic Sources */}
          <ScrollReveal delay={0.2}>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{source.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {source.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${source.value}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Top Pages */}
          <ScrollReveal delay={0.1}>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-6">Top Pages</h2>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <motion.div
                    key={page.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <span className="font-medium">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()}
                      </span>
                      {page.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Device Breakdown */}
          <ScrollReveal delay={0.2}>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-bold mb-6">Device Breakdown</h2>
              <div className="space-y-4">
                {deviceBreakdown.map((device, index) => (
                  <motion.div
                    key={device.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <device.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{device.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {device.value}%
                        </span>
                      </div>
                      <Progress value={device.value} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Top Countries */}
          <ScrollReveal delay={0.3}>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Top Countries</h2>
              </div>
              <div className="space-y-3">
                {topCountries.map((country, index) => (
                  <motion.div
                    key={country.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{country.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {country.visitors}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${country.percentage}%` }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Footer */}
        <ScrollReveal delay={0.4}>
          <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                You are visitor #{Math.floor(Math.random() * 10000) + 15000}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Data updates in real-time • Privacy-friendly analytics • No cookies
              required
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
