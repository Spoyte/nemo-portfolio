"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Users,
  Eye,
  Clock,
  Globe,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  MapPin,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock real-time data
const generateVisitorData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      visitors: Math.floor(Math.random() * 500) + 200,
      pageViews: Math.floor(Math.random() * 1500) + 500,
      uniqueVisitors: Math.floor(Math.random() * 400) + 150,
    });
  }
  return data;
};

const hourlyData = [
  { hour: "00:00", visitors: 12 },
  { hour: "04:00", visitors: 5 },
  { hour: "08:00", visitors: 45 },
  { hour: "12:00", visitors: 89 },
  { hour: "16:00", visitors: 76 },
  { hour: "20:00", visitors: 54 },
  { hour: "23:59", visitors: 23 },
];

const deviceData = [
  { name: "Desktop", value: 58, color: "#dc2626" },
  { name: "Mobile", value: 35, color: "#ea580c" },
  { name: "Tablet", value: 7, color: "#d97706" },
];

const browserData = [
  { name: "Chrome", value: 62 },
  { name: "Safari", value: 24 },
  { name: "Firefox", value: 8 },
  { name: "Edge", value: 4 },
  { name: "Other", value: 2 },
];

const topPages = [
  { path: "/", views: 2847, trend: "up", change: 12 },
  { path: "/projects", views: 1234, trend: "up", change: 8 },
  { path: "/blog", views: 987, trend: "down", change: -3 },
  { path: "/about", views: 756, trend: "up", change: 15 },
  { path: "/contact", views: 543, trend: "up", change: 5 },
];

const countries = [
  { name: "United States", visitors: 1245, flag: "🇺🇸" },
  { name: "United Kingdom", visitors: 678, flag: "🇬🇧" },
  { name: "Germany", visitors: 432, flag: "🇩🇪" },
  { name: "France", visitors: 389, flag: "🇫🇷" },
  { name: "Canada", visitors: 298, flag: "🇨🇦" },
];

const skillsRadarData = [
  { subject: "React", A: 95, fullMark: 100 },
  { subject: "TypeScript", A: 90, fullMark: 100 },
  { subject: "Node.js", A: 85, fullMark: 100 },
  { subject: "Design", A: 80, fullMark: 100 },
  { subject: "DevOps", A: 70, fullMark: 100 },
  { subject: "AI/ML", A: 65, fullMark: 100 },
];

const milestones = [
  { label: "Total Views", value: 50000, target: 100000, icon: Eye },
  { label: "Projects Completed", value: 47, target: 50, icon: Target },
  { label: "GitHub Stars", value: 234, target: 500, icon: Award },
  { label: "Coffee Consumed", value: 999, target: 1000, icon: Zap },
];

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card className="relative overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant={trend === "up" ? "default" : "destructive"}
            className="text-xs"
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-xs text-muted-foreground">Live</span>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [visitorData, setVisitorData] = useState(generateVisitorData());
  const [activeUsers, setActiveUsers] = useState(42);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setVisitorData(generateVisitorData());
  };

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
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time insights into portfolio performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LiveIndicator />
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            title="Total Visitors"
            value="12,847"
            change="+12.5%"
            trend="up"
            icon={Users}
            description="vs last week"
          />
          <StatCard
            title="Page Views"
            value="45,231"
            change="+8.2%"
            trend="up"
            icon={Eye}
            description="vs last week"
          />
          <StatCard
            title="Avg. Session"
            value="4m 32s"
            change="+18s"
            trend="up"
            icon={Clock}
            description="vs last week"
          />
          <StatCard
            title="Active Now"
            value={activeUsers.toString()}
            change="Live"
            trend="up"
            icon={Activity}
            description="real-time"
          />
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Trends</CardTitle>
                  <CardDescription>Daily visitors over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={visitorData}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#dc2626"
                        fillOpacity={1}
                        fill="url(#colorVisitors)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hourly Activity</CardTitle>
                  <CardDescription>Visitor distribution by hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="hour" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="visitors" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Milestones</CardTitle>
                <CardDescription>Progress towards key goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <milestone.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{milestone.label}</p>
                          <p className="text-2xl font-bold">
                            {milestone.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={(milestone.value / milestone.target) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Target: {milestone.target.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Visitors by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-4">
                    {deviceData.map((device) => (
                      <div key={device.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: device.color }}
                        />
                        <span className="text-sm">
                          {device.name} ({device.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Visitors by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {countries.map((country, index) => (
                      <div key={country.name} className="flex items-center gap-4">
                        <span className="text-2xl">{country.flag}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{country.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {country.visitors.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(country.visitors / countries[0].visitors) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="font-medium">{page.path}</p>
                          <p className="text-sm text-muted-foreground">
                            {page.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={page.trend === "up" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {page.trend === "up" ? "+" : ""}
                        {page.change}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Radar</CardTitle>
                  <CardDescription>Technical proficiency overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#dc2626"
                        fill="#dc2626"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Browser Distribution</CardTitle>
                  <CardDescription>Visitors by browser</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={browserData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
