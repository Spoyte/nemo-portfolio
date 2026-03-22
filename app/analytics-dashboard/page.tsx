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
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Target,
  Zap,
  MousePointer,
  Timer,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";

// Mock data - in production this would come from real analytics
const trafficData = [
  { name: "Mon", visitors: 120, pageViews: 340, uniqueVisitors: 95 },
  { name: "Tue", visitors: 180, pageViews: 520, uniqueVisitors: 145 },
  { name: "Wed", visitors: 240, pageViews: 680, uniqueVisitors: 190 },
  { name: "Thu", visitors: 200, pageViews: 580, uniqueVisitors: 165 },
  { name: "Fri", visitors: 280, pageViews: 820, uniqueVisitors: 230 },
  { name: "Sat", visitors: 320, pageViews: 950, uniqueVisitors: 280 },
  { name: "Sun", visitors: 290, pageViews: 860, uniqueVisitors: 250 },
];

const deviceData = [
  { name: "Desktop", value: 58, color: "#dc2626" },
  { name: "Mobile", value: 32, color: "#ea580c" },
  { name: "Tablet", value: 10, color: "#d97706" },
];

const browserData = [
  { name: "Chrome", value: 62 },
  { name: "Safari", value: 18 },
  { name: "Firefox", value: 12 },
  { name: "Edge", value: 8 },
];

const topPages = [
  { path: "/", views: 1240, avgTime: "2:34", bounceRate: 32 },
  { path: "/projects", views: 890, avgTime: "4:12", bounceRate: 28 },
  { path: "/blog", views: 650, avgTime: "3:45", bounceRate: 35 },
  { path: "/about", views: 420, avgTime: "2:18", bounceRate: 45 },
  { path: "/contact", views: 280, avgTime: "1:52", bounceRate: 52 },
];

const countries = [
  { name: "United States", visitors: 450, percentage: 35 },
  { name: "United Kingdom", visitors: 180, percentage: 14 },
  { name: "Germany", visitors: 120, percentage: 9 },
  { name: "Canada", visitors: 95, percentage: 7 },
  { name: "France", visitors: 78, percentage: 6 },
];

const skillsRadarData = [
  { subject: "React", A: 95, fullMark: 100 },
  { subject: "TypeScript", A: 90, fullMark: 100 },
  { subject: "Node.js", A: 85, fullMark: 100 },
  { subject: "Design", A: 80, fullMark: 100 },
  { subject: "DevOps", A: 70, fullMark: 100 },
  { subject: "AI/ML", A: 65, fullMark: 100 },
];

const hourlyActivity = [
  { hour: "00:00", activity: 12 },
  { hour: "03:00", activity: 5 },
  { hour: "06:00", activity: 18 },
  { hour: "09:00", activity: 85 },
  { hour: "12:00", activity: 120 },
  { hour: "15:00", activity: 145 },
  { hour: "18:00", activity: 110 },
  { hour: "21:00", activity: 75 },
];

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
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
            variant={changeType === "positive" ? "default" : changeType === "negative" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {changeType === "positive" && <ArrowUpRight className="h-3 w-3 mr-1" />}
            {changeType === "negative" && <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function AnalyticsDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold"
              >
                Analytics{" "}
                <span className="text-gradient-animated">Dashboard</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground mt-2"
              >
                Real-time insights into portfolio performance and visitor behavior
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScrollReveal delay={0}>
              <StatCard
                title="Total Visitors"
                value="12,847"
                change="+23.5%"
                changeType="positive"
                icon={Users}
                description="vs last week"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <StatCard
                title="Page Views"
                value="38,420"
                change="+18.2%"
                changeType="positive"
                icon={Eye}
                description="vs last week"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <StatCard
                title="Avg. Session"
                value="4m 32s"
                change="+12.8%"
                changeType="positive"
                icon={Clock}
                description="vs last week"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <StatCard
                title="Bounce Rate"
                value="34.2%"
                change="-5.4%"
                changeType="positive"
                icon={Activity}
                description="vs last week"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Charts */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="traffic" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                {["24h", "7d", "30d", "90d"].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="traffic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>Visitor trends over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="visitors"
                          stroke="#dc2626"
                          fillOpacity={1}
                          fill="url(#colorVisitors)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="pageViews"
                          stroke="#ea580c"
                          fillOpacity={1}
                          fill="url(#colorViews)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Breakdown</CardTitle>
                    <CardDescription>Visitors by device type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
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
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      {deviceData.map((device) => (
                        <div key={device.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: device.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {device.name} ({device.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Browser Distribution</CardTitle>
                    <CardDescription>Visitors by browser</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={browserData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages on your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Page
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Views
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Avg. Time
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Bounce Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPages.map((page, index) => (
                          <motion.tr
                            key={page.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">{page.path}</td>
                            <td className="py-3 px-4 text-right">{page.views.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">{page.avgTime}</td>
                            <td className="py-3 px-4 text-right">
                              <Badge variant={page.bounceRate > 40 ? "destructive" : "default"}>
                                {page.bounceRate}%
                              </Badge>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hourly Activity</CardTitle>
                  <CardDescription>Visitor activity throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyActivity}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="hour" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="activity" fill="#dc2626" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Countries</CardTitle>
                    <CardDescription>Visitor distribution by country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {countries.map((country, index) => (
                        <motion.div
                          key={country.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{country.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {country.visitors.toLocaleString()} ({country.percentage}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${country.percentage}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                className="h-full bg-primary rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Global visitor map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Visitors from 42 countries
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Top 5 shown above
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Radar</CardTitle>
                    <CardDescription>Technical proficiency visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Skills currently being developed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { name: "Rust", progress: 45, target: "System Programming" },
                        { name: "WebAssembly", progress: 60, target: "Performance" },
                        { name: "Machine Learning", progress: 35, target: "AI Integration" },
                        { name: "Kubernetes", progress: 50, target: "DevOps" },
                        { name: "GraphQL", progress: 80, target: "APIs" },
                      ].map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                → {skill.target}
                              </span>
                            </div>
                            <span className="text-sm font-medium">{skill.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.progress}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Activity */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Activity</CardTitle>
                  <CardDescription>Real-time visitor actions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Now", value: "12", icon: Activity },
                  { label: "Page Views/min", value: "45", icon: Eye },
                  { label: "Avg. Session", value: "3m 24s", icon: Clock },
                  { label: "Conversions", value: "3.2%", icon: Target },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/50 text-center"
                  >
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
