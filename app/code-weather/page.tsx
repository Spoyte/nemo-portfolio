"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Activity,
  Zap,
  Code2,
  GitBranch,
  Bug,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Terminal,
  Cpu,
  Database,
  Wifi,
  Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollReveal } from "@/components/scroll-animations";

// Simulated weather data for code metrics
interface CodeWeather {
  temperature: number; // Lines of code changed
  humidity: number; // Test coverage
  windSpeed: number; // Commit velocity
  visibility: number; // Code clarity score
  pressure: number; // Build stability
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "clear";
}

interface CodeMetrics {
  timestamp: string;
  commits: number;
  additions: number;
  deletions: number;
  filesChanged: number;
  testsPassed: number;
  testsFailed: number;
  buildTime: number;
  bundleSize: number;
}

const generateMockMetrics = (): CodeMetrics => ({
  timestamp: new Date().toISOString(),
  commits: Math.floor(Math.random() * 20) + 5,
  additions: Math.floor(Math.random() * 500) + 100,
  deletions: Math.floor(Math.random() * 200) + 50,
  filesChanged: Math.floor(Math.random() * 15) + 3,
  testsPassed: Math.floor(Math.random() * 50) + 100,
  testsFailed: Math.floor(Math.random() * 5),
  buildTime: Math.floor(Math.random() * 30) + 15,
  bundleSize: Math.floor(Math.random() * 500) + 200,
});

const getWeatherCondition = (metrics: CodeMetrics): CodeWeather => {
  const testRatio = metrics.testsPassed / (metrics.testsPassed + metrics.testsFailed);
  const changeVolume = metrics.additions + metrics.deletions;
  
  let condition: CodeWeather["condition"] = "clear";
  if (testRatio < 0.8) condition = "stormy";
  else if (testRatio < 0.9) condition = "rainy";
  else if (changeVolume > 400) condition = "cloudy";
  else if (testRatio > 0.95 && metrics.buildTime < 25) condition = "sunny";
  
  return {
    temperature: Math.min(100, Math.floor(changeVolume / 5)),
    humidity: Math.floor(testRatio * 100),
    windSpeed: Math.floor(metrics.commits * 2),
    visibility: Math.floor((1 - metrics.filesChanged / 50) * 100),
    pressure: Math.floor(1000 + (100 - metrics.buildTime) * 2),
    condition,
  };
};

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  switch (condition) {
    case "sunny": return <Sun className={className} />;
    case "cloudy": return <Cloud className={className} />;
    case "rainy": return <Droplets className={className} />;
    case "stormy": return <Zap className={className} />;
    default: return <Moon className={className} />;
  }
};

const WeatherBackground = ({ condition }: { condition: string }) => {
  const gradients = {
    sunny: "from-yellow-400/20 via-orange-400/10 to-transparent",
    cloudy: "from-gray-400/20 via-slate-400/10 to-transparent",
    rainy: "from-blue-400/20 via-cyan-400/10 to-transparent",
    stormy: "from-purple-400/20 via-red-400/10 to-transparent",
    clear: "from-emerald-400/20 via-teal-400/10 to-transparent",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 bg-gradient-to-br ${gradients[condition as keyof typeof gradients]} pointer-events-none`}
    />
  );
};

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  trend,
  color = "primary"
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  color?: string;
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    red: "text-red-500 bg-red-500/10",
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === "up" ? "text-green-500" : 
            trend === "down" ? "text-red-500" : "text-muted-foreground"
          }`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : 
             trend === "down" ? <TrendingDown className="w-3 h-3" /> : 
             <Minus className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span></p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
};

const ForecastCard = ({ day, condition, high, low }: { day: string; condition: string; high: number; low: number }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
    <span className="text-sm font-medium w-16">{day}</span>
    <WeatherIcon condition={condition} className="w-5 h-5" />
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold">{high}°</span>
      <span className="text-sm text-muted-foreground">{low}°</span>
    </div>
  </div>
);

export default function CodeWeatherStation() {
  const [metrics, setMetrics] = useState<CodeMetrics>(generateMockMetrics());
  const [weather, setWeather] = useState<CodeWeather>(getWeatherCondition(generateMockMetrics()));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState<CodeMetrics[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      setWeather(getWeatherCondition(newMetrics));
      setHistory(prev => [newMetrics, ...prev].slice(0, 24));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      setWeather(getWeatherCondition(newMetrics));
      setIsRefreshing(false);
    }, 1000);
  };

  const getWeatherDescription = (condition: string) => {
    const descriptions: Record<string, string> = {
      sunny: "Perfect coding conditions! High productivity expected.",
      cloudy: "Moderate activity. Good time for refactoring.",
      rainy: "Some tests failing. Time to debug and fix.",
      stormy: "High error rate detected. Proceed with caution.",
      clear: "Stable codebase. Ideal for new features.",
    };
    return descriptions[condition];
  };

  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      <WeatherBackground condition={weather.condition} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Cloud className="h-4 w-4" />
            <span className="text-sm font-medium">Live Metrics</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Code <span className="text-gradient-animated">Weather Station</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of your codebase's atmospheric conditions.
            Track commits, tests, builds, and more.
          </p>
        </ScrollReveal>

        {/* Main Weather Display */}
        <ScrollReveal delay={0.1}>
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Current Weather */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <motion.div
                      animate={{ 
                        rotate: weather.condition === "sunny" ? [0, 360] : 0,
                        scale: weather.condition === "stormy" ? [1, 1.1, 1] : 1
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 0.5, repeat: weather.condition === "stormy" ? Infinity : 0 }
                      }}
                    >
                      <WeatherIcon 
                        condition={weather.condition} 
                        className="w-24 h-24 text-primary" 
                      />
                    </motion.div>
                    <div>
                      <h2 className="text-5xl font-bold">{weather.temperature}°</h2>
                      <p className="text-xl text-muted-foreground capitalize">{weather.condition}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {getWeatherDescription(weather.condition)}
                  </p>
                  
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date().toLocaleDateString()}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    icon={Droplets}
                    label="Test Coverage"
                    value={weather.humidity}
                    unit="%"
                    trend={weather.humidity > 90 ? "up" : weather.humidity < 80 ? "down" : "stable"}
                    color="blue"
                  />
                  <MetricCard
                    icon={Wind}
                    label="Commit Velocity"
                    value={weather.windSpeed}
                    unit="/day"
                    trend="up"
                    color="green"
                  />
                  <MetricCard
                    icon={Eye}
                    label="Code Clarity"
                    value={weather.visibility}
                    unit="%"
                    trend={weather.visibility > 80 ? "up" : "stable"}
                    color="purple"
                  />
                  <MetricCard
                    icon={Gauge}
                    label="Build Stability"
                    value={weather.pressure}
                    unit="hPa"
                    trend={weather.pressure > 1020 ? "up" : "stable"}
                    color="orange"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Code Metrics Grid */}
        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Live Code Metrics
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={GitBranch}
              label="Commits Today"
              value={metrics.commits}
              trend="up"
              color="blue"
            />
            <MetricCard
              icon={Code2}
              label="Lines Added"
              value={metrics.additions}
              trend="up"
              color="green"
            />
            <MetricCard
              icon={Terminal}
              label="Files Changed"
              value={metrics.filesChanged}
              trend="stable"
              color="purple"
            />
            <MetricCard
              icon={CheckCircle2}
              label="Tests Passed"
              value={metrics.testsPassed}
              trend={metrics.testsFailed === 0 ? "up" : "down"}
              color={metrics.testsFailed === 0 ? "green" : "orange"}
            />
          </div>
        </ScrollReveal>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Build Stats */}
          <ScrollReveal delay={0.3}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="w-5 h-5 text-primary" />
                  Build Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Build Time</span>
                    <span className="text-sm font-semibold">{metrics.buildTime}s</span>
                  </div>
                  <Progress value={Math.max(0, 100 - metrics.buildTime * 2)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Bundle Size</span>
                    <span className="text-sm font-semibold">{metrics.bundleSize}KB</span>
                  </div>
                  <Progress value={Math.max(0, 100 - metrics.bundleSize / 10)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Test Success Rate</span>
                    <span className="text-sm font-semibold">
                      {Math.round((metrics.testsPassed / (metrics.testsPassed + metrics.testsFailed)) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(metrics.testsPassed / (metrics.testsPassed + metrics.testsFailed)) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* 7-Day Forecast */}
          <ScrollReveal delay={0.4}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  7-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                    const conditions = ["sunny", "cloudy", "clear", "rainy", "sunny", "cloudy", "sunny"];
                    const highs = [85, 78, 82, 75, 88, 80, 87];
                    const lows = [65, 62, 68, 60, 70, 65, 68];
                    return (
                      <ForecastCard
                        key={day}
                        day={day}
                        condition={conditions[i]}
                        high={highs[i]}
                        low={lows[i]}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* System Status */}
          <ScrollReveal delay={0.5}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Server className="w-5 h-5 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: Database, label: "Database", status: "Operational", color: "green" },
                    { icon: Wifi, label: "API", status: "Operational", color: "green" },
                    { icon: Server, label: "Build Server", status: "Busy", color: "yellow" },
                    { icon: Terminal, label: "CI/CD", status: "Running", color: "blue" },
                  ].map((service) => (
                    <div key={service.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <service.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{service.label}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          service.color === "green" ? "border-green-500 text-green-500" :
                          service.color === "yellow" ? "border-yellow-500 text-yellow-500" :
                          "border-blue-500 text-blue-500"
                        }`}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Footer Note */}
        <ScrollReveal delay={0.6} className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Code Weather Station monitors your development environment in real-time.
            Metrics update automatically as you code.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
