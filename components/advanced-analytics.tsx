"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Map,
  MousePointer,
  Timer,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Download,
  Share2,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  subtitle?: string;
}

function StatCard({ title, value, change, icon: Icon, subtitle }: StatCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-3xl font-bold mt-1">{value}</h3>
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            {isPositive ? (
              <>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+{change}%</span>
              </>
            ) : isNeutral ? (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">0%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">{change}%</span>
              </>
            )}
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Animated Counter
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
}

// Real-time Activity Feed
function ActivityFeed() {
  const [activities, setActivities] = useState([
    { id: 1, type: "pageview", page: "/projects", location: "San Francisco, US", time: "Just now" },
    { id: 2, type: "click", page: "Contact button", location: "London, UK", time: "2 min ago" },
    { id: 3, type: "download", page: "Resume PDF", location: "Tokyo, JP", time: "5 min ago" },
    { id: 4, type: "pageview", page: "/blog", location: "Berlin, DE", time: "8 min ago" },
    { id: 5, type: "click", page: "GitHub link", location: "Toronto, CA", time: "12 min ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pages = ["/", "/projects", "/blog", "/about", "/contact"];
      const locations = ["New York, US", "Paris, FR", "Sydney, AU", "Singapore, SG", "Mumbai, IN"];
      const types = ["pageview", "click", "scroll"];
      
      const newActivity = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "Just now",
      };
      
      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "pageview": return <Eye className="h-4 w-4" />;
      case "click": return <MousePointer className="h-4 w-4" />;
      case "download": return <Download className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Live Activity</CardTitle>
            <CardDescription>Real-time visitor actions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">LIVE</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.page}</p>
                  <p className="text-xs text-muted-foreground">{activity.location}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{activity.time}</Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

// Device Breakdown
function DeviceBreakdown() {
  const devices = [
    { name: "Desktop", percentage: 58, icon: "💻", color: "bg-blue-500" },
    { name: "Mobile", percentage: 35, icon: "📱", color: "bg-green-500" },
    { name: "Tablet", percentage: 7, icon: "📱", color: "bg-purple-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Device Breakdown</CardTitle>
        <CardDescription>Visitors by device type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{device.icon}</span>
                  <span className="font-medium">{device.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{device.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${device.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${device.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Top Pages
function TopPages() {
  const pages = [
    { path: "/", views: 12543, avgTime: "2:34" },
    { path: "/projects", views: 8932, avgTime: "4:12" },
    { path: "/blog", views: 6543, avgTime: "5:45" },
    { path: "/about", views: 4321, avgTime: "3:21" },
    { path: "/contact", views: 3210, avgTime: "2:18" },
  ];

  const maxViews = Math.max(...pages.map((p) => p.views));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Pages</CardTitle>
        <CardDescription>Most visited pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pages.map((page, index) => (
            <motion.div
              key={page.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-8 text-sm text-muted-foreground">#{index + 1}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{page.path}</span>
                  <span className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(page.views / maxViews) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground w-16 text-right">{page.avgTime}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Referrers
function Referrers() {
  const referrers = [
    { name: "Google", percentage: 45, icon: "🔍" },
    { name: "GitHub", percentage: 25, icon: "🐙" },
    { name: "Twitter", percentage: 15, icon: "🐦" },
    { name: "LinkedIn", percentage: 10, icon: "💼" },
    { name: "Direct", percentage: 5, icon: "🔗" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Traffic Sources</CardTitle>
        <CardDescription>Where visitors come from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrers.map((ref, index) => (
            <motion.div
              key={ref.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{ref.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ref.name}</span>
                  <span className="text-sm text-muted-foreground">{ref.percentage}%</span>
                </div>
                <Progress value={ref.percentage} className="h-1.5 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Browser Stats
function BrowserStats() {
  const browsers = [
    { name: "Chrome", percentage: 62, color: "bg-blue-500" },
    { name: "Safari", percentage: 22, color: "bg-cyan-500" },
    { name: "Firefox", percentage: 8, color: "bg-orange-500" },
    { name: "Edge", percentage: 6, color: "bg-green-500" },
    { name: "Other", percentage: 2, color: "bg-gray-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Browsers</CardTitle>
        <CardDescription>Visitor browser distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {browsers.reduce(
                (acc, browser, index) => {
                  const startAngle = acc.angle;
                  const endAngle = startAngle + (browser.percentage / 100) * 360;
                  const largeArc = browser.percentage > 50 ? 1 : 0;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 18 + 15 * Math.cos(startRad);
                  const y1 = 18 + 15 * Math.sin(startRad);
                  const x2 = 18 + 15 * Math.cos(endRad);
                  const y2 = 18 + 15 * Math.sin(endRad);
                  
                  acc.paths.push(
                    <motion.path
                      key={browser.name}
                      d={`M 18 18 L ${x1} ${y1} A 15 15 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="currentColor"
                      className={browser.color.replace("bg-", "text-")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  );
                  acc.angle = endAngle;
                  return acc;
                },
                { paths: [] as React.ReactNode[], angle: 0 }
              ).paths}
              <circle cx="18" cy="18" r="8" className="fill-background" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {browsers.map((browser, index) => (
              <motion.div
                key={browser.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${browser.color}`} />
                <span className="text-sm flex-1">{browser.name}</span>
                <span className="text-sm text-muted-foreground">{browser.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdvancedAnalyticsDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Real-time insights into portfolio performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value="24,592"
          change={12.5}
          icon={Users}
          subtitle="Unique visitors this month"
        />
        <StatCard
          title="Page Views"
          value="89,432"
          change={8.3}
          icon={Eye}
          subtitle="Total page impressions"
        />
        <StatCard
          title="Avg. Session"
          value="4m 32s"
          change={-2.1}
          icon={Clock}
          subtitle="Time spent on site"
        />
        <StatCard
          title="Bounce Rate"
          value="32.4%"
          change={-5.2}
          icon={Activity}
          subtitle="Single page sessions"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div className="space-y-6">
              <DeviceBreakdown />
              <Referrers />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPages />
            <BrowserStats />
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeviceBreakdown />
            <Referrers />
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <ActivityFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
