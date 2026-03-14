"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MousePointer,
  Activity,
  Zap,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
  Download,
  Share2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";

// Mock data for demonstration
const generateTimeSeriesData = (points: number, min: number, max: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * (max - min) + min)
  }));
};

const stats = {
  visitors: {
    current: 1234,
    previous: 1100,
    change: 12.2
  },
  pageViews: {
    current: 5678,
    previous: 5200,
    change: 9.2
  },
  avgDuration: {
    current: "3m 42s",
    previous: "3m 15s",
    change: 13.8
  },
  bounceRate: {
    current: 42.3,
    previous: 45.1,
    change: -6.2
  }
};

const topPages = [
  { path: "/", views: 2341, change: 15.2 },
  { path: "/projects", views: 1234, change: 8.5 },
  { path: "/blog", views: 987, change: -3.2 },
  { path: "/about", views: 654, change: 5.1 },
  { path: "/contact", views: 432, change: 12.8 }
];

const referrers = [
  { source: "Google", visits: 3456, percentage: 45 },
  { source: "Direct", visits: 2345, percentage: 30 },
  { source: "GitHub", visits: 1234, percentage: 16 },
  { source: "Twitter", visits: 567, percentage: 7 },
  { source: "LinkedIn", visits: 234, percentage: 3 }
];

const devices = [
  { type: "Desktop", percentage: 58, icon: Monitor },
  { type: "Mobile", percentage: 35, icon: Smartphone },
  { type: "Tablet", percentage: 7, icon: Tablet }
];

const countries = [
  { name: "United States", visits: 2341, flag: "🇺🇸" },
  { name: "United Kingdom", visits: 876, flag: "🇬🇧" },
  { name: "Germany", visits: 654, flag: "🇩🇪" },
  { name: "France", visits: 432, flag: "🇫🇷" },
  { name: "Canada", visits: 321, flag: "🇨🇦" }
];

const realtimeEvents = [
  { id: 1, type: "pageview", page: "/projects", location: "San Francisco, CA", time: "2s ago" },
  { id: 2, type: "click", page: "/blog", location: "London, UK", time: "5s ago" },
  { id: 3, type: "pageview", page: "/about", location: "Berlin, DE", time: "8s ago" },
  { id: 4, type: "scroll", page: "/", location: "Toronto, CA", time: "12s ago" },
  { id: 5, type: "pageview", page: "/contact", location: "Paris, FR", time: "15s ago" }
];

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend 
}: { 
  title: string; 
  value: string | number; 
  change: number;
  icon: React.ElementType;
  trend?: "up" | "down";
}) {
  const isPositive = change >= 0;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniChart({ data, color = "#dc2626" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <svg viewBox="0 0 100 30" className="w-full h-8">
      <path
        d={`M ${data.map((v, i) => `${(i / (data.length - 1)) * 100} ${30 - ((v - min) / range) * 30}`).join(" L ")}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RealtimeActivity() {
  const [events, setEvents] = useState(realtimeEvents);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const pages = ["/", "/projects", "/blog", "/about", "/contact"];
      const locations = ["New York, US", "Tokyo, JP", "Sydney, AU", "Mumbai, IN", "São Paulo, BR"];
      const types = ["pageview", "click", "scroll"];
      
      const newEvent = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "Just now"
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div className={`w-2 h-2 rounded-full ${
              event.type === "pageview" ? "bg-green-500" :
              event.type === "click" ? "bg-blue-500" : "bg-yellow-500"
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.page}</p>
              <p className="text-xs text-muted-foreground">{event.location}</p>
            </div>
            
            <span className="text-xs text-muted-foreground">{event.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const visitorData = generateTimeSeriesData(24, 800, 1500);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Live Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Real-time insights into your portfolio performance</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Visitors"
              value={stats.visitors.current.toLocaleString()}
              change={stats.visitors.change}
              icon={Users}
            />
            <StatCard
              title="Page Views"
              value={stats.pageViews.current.toLocaleString()}
              change={stats.pageViews.change}
              icon={Eye}
            />
            <StatCard
              title="Avg. Duration"
              value={stats.avgDuration.current}
              change={stats.avgDuration.change}
              icon={Clock}
            />
            <StatCard
              title="Bounce Rate"
              value={`${stats.bounceRate.current}%`}
              change={stats.bounceRate.change}
              icon={Activity}
            />
          </div>
        </ScrollReveal>

        {/* Main Chart */}
        <ScrollReveal delay={0.2}>
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Visitor Trends</CardTitle>
              <Badge variant="outline" className="gap-1">
                <Zap className="w-3 h-3" />
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {visitorData.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.value / 1500) * 100}%` }}
                      transition={{ delay: i * 0.02, duration: 0.5 }}
                      className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors relative group"
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.value} visitors
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00>
                <span>23:59</span>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPages.map((page, i) => (
                      <div key={page.path} className="flex items-center gap-4">
                        <span className="text-muted-foreground w-6">{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-medium">{page.path}</p>
                          <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(page.views / 2341) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{page.views.toLocaleString()}</p>
                          <p className={`text-xs ${page.change > 0 ? "text-green-500" : "text-red-500"}`}>
                            {page.change > 0 ? "+" : ""}{page.change}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrers.map((ref) => (
                      <div key={ref.source} className="flex items-center gap-4">
                        <div className="w-24 font-medium">{ref.source}</div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                              style={{ width: `${ref.percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{ref.visits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{ref.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ScrollReveal delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Live Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RealtimeActivity />
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {devices.map((device) => (
                      <div key={device.type} className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted">
                          <device.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{device.type}</p>
                          <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-medium">{device.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Top Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {countries.map((country) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {country.visits.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
