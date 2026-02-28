"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Monitor,
  Smartphone,
  Tablet,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  RefreshCw,
  MapPin,
  Search,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  BarChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock data for analytics
const trafficData = [
  { date: "Mon", visitors: 120, pageViews: 340 },
  { date: "Tue", visitors: 145, pageViews: 420 },
  { date: "Wed", visitors: 180, pageViews: 520 },
  { date: "Thu", visitors: 165, pageViews: 480 },
  { date: "Fri", visitors: 210, pageViews: 650 },
  { date: "Sat", visitors: 190, pageViews: 580 },
  { date: "Sun", visitors: 175, pageViews: 510 },
];

const monthlyData = [
  { month: "Jan", visitors: 3200, pageViews: 8900 },
  { month: "Feb", visitors: 3800, pageViews: 10200 },
  { month: "Mar", visitors: 4200, pageViews: 11500 },
  { month: "Apr", visitors: 3900, pageViews: 10800 },
  { month: "May", visitors: 4500, pageViews: 12800 },
  { month: "Jun", visitors: 4800, pageViews: 13500 },
];

const deviceData = [
  { name: "Desktop", value: 58, color: "#dc2626" },
  { name: "Mobile", value: 35, color: "#ea580c" },
  { name: "Tablet", value: 7, color: "#f59e0b" },
];

const browserData = [
  { name: "Chrome", value: 62, color: "#4285F4" },
  { name: "Safari", value: 22, color: "#00D8FF" },
  { name: "Firefox", value: 8, color: "#FF7139" },
  { name: "Edge", value: 6, color: "#0078D7" },
  { name: "Other", value: 2, color: "#9CA3AF" },
];

const topPages = [
  { path: "/", views: 2450, avgTime: "2:34", bounceRate: 32 },
  { path: "/projects", views: 1890, avgTime: "4:12", bounceRate: 28 },
  { path: "/about", views: 1230, avgTime: "3:45", bounceRate: 35 },
  { path: "/skills", views: 980, avgTime: "5:20", bounceRate: 22 },
  { path: "/contact", views: 650, avgTime: "2:10", bounceRate: 45 },
  { path: "/blog", views: 520, avgTime: "6:30", bounceRate: 18 },
];

const referrers = [
  { source: "Google", visitors: 1850, percentage: 45 },
  { source: "Direct", visitors: 980, percentage: 24 },
  { source: "GitHub", visitors: 520, percentage: 13 },
  { source: "Twitter", visitors: 340, percentage: 8 },
  { source: "LinkedIn", visitors: 260, percentage: 6 },
  { source: "Other", visitors: 160, percentage: 4 },
];

const locations = [
  { country: "United States", visitors: 1450, flag: "🇺🇸" },
  { country: "China", visitors: 890, flag: "🇨🇳" },
  { country: "United Kingdom", visitors: 420, flag: "🇬🇧" },
  { country: "Germany", visitors: 340, flag: "🇩🇪" },
  { country: "India", visitors: 290, flag: "🇮🇳" },
  { country: "Canada", visitors: 220, flag: "🇨🇦" },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(42);

  useEffect(() => {
    setMounted(true);
    
    // Simulate live visitor updates
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(10, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const stats = [
    {
      title: "Total Visitors",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Page Views",
      value: "38,420",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: "+15.3%",
      trend: "up",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Live Visitors",
      value: liveVisitors.toString(),
      change: "Active now",
      trend: "neutral",
      icon: Globe,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Real-time insights into portfolio performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-lg p-1">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-green-500" : 
                      stat.trend === "down" ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                      {stat.trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Traffic Overview
                </CardTitle>
                <CardDescription>Visitors and page views over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="#dc2626" 
                        fillOpacity={1} 
                        fill="url(#colorVisitors)" 
                        name="Visitors"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pageViews" 
                        stroke="#ea580c" 
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                        name="Page Views"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Devices
                </CardTitle>
                <CardDescription>Visitor device breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.name === "Desktop" && <Monitor className="h-4 w-4 text-muted-foreground" />}
                        {device.name === "Mobile" && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                        {device.name === "Tablet" && <Tablet className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <span className="text-sm font-medium">{device.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Page</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Views</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg. Time</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bounce Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPages.map((page, index) => (
                        <tr key={page.path} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground w-6">#{index + 1}</span>
                              <span className="font-medium">{page.path}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{page.views.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{page.avgTime}</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant={page.bounceRate < 30 ? "default" : "secondary"}>
                              {page.bounceRate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrers">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrers.map((referrer) => (
                    <div key={referrer.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{referrer.source}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{referrer.visitors.toLocaleString()} visitors</span>
                          <span className="text-sm font-medium w-12 text-right">{referrer.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${referrer.percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Where your visitors are located</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {locations.map((location, index) => (
                      <motion.div
                        key={location.country}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{location.flag}</span>
                          <span>{location.country}</span>
                        </div>
                        <span className="font-medium">{location.visitors.toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-[300px] aspect-square">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 animate-pulse" />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-orange-500/30" />
                      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/40 to-orange-500/40 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">78</p>
                          <p className="text-sm text-muted-foreground">Countries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
