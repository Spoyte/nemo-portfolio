"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Code2,
  GitCommit,
  Coffee,
  Bug,
  Zap,
  RefreshCw,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy";
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface CodingMetrics {
  commits: number;
  bugsFixed: number;
  coffeeConsumed: number;
  linesWritten: number;
  energyLevel: number;
  focusScore: number;
}

interface DayForecast {
  date: string;
  weather: WeatherData;
  metrics: CodingMetrics;
}

const WEATHER_CONDITIONS = {
  sunny: { icon: Sun, color: "#f59e0b", bg: "from-amber-400/20 to-orange-500/20" },
  cloudy: { icon: Cloud, color: "#6b7280", bg: "from-gray-400/20 to-slate-500/20" },
  rainy: { icon: CloudRain, color: "#3b82f6", bg: "from-blue-400/20 to-cyan-500/20" },
  snowy: { icon: CloudSnow, color: "#06b6d4", bg: "from-cyan-400/20 to-blue-500/20" },
  stormy: { icon: CloudLightning, color: "#8b5cf6", bg: "from-purple-400/20 to-violet-500/20" },
};

const CODING_QUOTES = [
  { threshold: 90, quote: "Peak performance! Your code is flowing like poetry." },
  { threshold: 70, quote: "Great focus! You're in the zone." },
  { threshold: 50, quote: "Steady progress. Keep pushing forward!" },
  { threshold: 30, quote: "A bit sluggish today. Maybe time for a coffee break?" },
  { threshold: 0, quote: "Everyone has off days. Tomorrow will be better!" },
];

function generateMockData(): DayForecast[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const conditions: Array<keyof typeof WEATHER_CONDITIONS> = ["sunny", "cloudy", "rainy", "snowy", "stormy"];
  
  return days.map((day, index) => {
    const commits = Math.floor(Math.random() * 20) + 1;
    const bugsFixed = Math.floor(Math.random() * 8);
    const coffeeConsumed = Math.floor(Math.random() * 6) + 1;
    const linesWritten = Math.floor(Math.random() * 500) + 100;
    const energyLevel = Math.floor(Math.random() * 40) + 60;
    const focusScore = Math.floor(Math.random() * 30) + 70;
    
    // Determine weather based on coding metrics
    let condition: keyof typeof WEATHER_CONDITIONS;
    if (commits > 15 && bugsFixed > 5) condition = "sunny";
    else if (commits > 10) condition = "cloudy";
    else if (bugsFixed > 3) condition = "rainy";
    else if (coffeeConsumed > 4) condition = "stormy";
    else condition = "snowy";
    
    return {
      date: day,
      weather: {
        condition,
        temperature: Math.floor(Math.random() * 30) + 10,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        description: `${condition.charAt(0).toUpperCase() + condition.slice(1)} with ${commits} commits`,
      },
      metrics: {
        commits,
        bugsFixed,
        coffeeConsumed,
        linesWritten,
        energyLevel,
        focusScore,
      },
    };
  });
}

export function CodeWeatherStation() {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setForecast(generateMockData());
  }, []);

  // Particle animation for weather
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || forecast.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const currentWeather = forecast[selectedDay]?.weather.condition;
    const particleCount = currentWeather === "stormy" ? 100 : currentWeather === "rainy" ? 50 : 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: currentWeather === "rainy" || currentWeather === "stormy" 
          ? Math.random() * 5 + 2 
          : (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const colors = {
          sunny: `rgba(251, 191, 36, ${particle.opacity})`,
          cloudy: `rgba(156, 163, 175, ${particle.opacity})`,
          rainy: `rgba(59, 130, 246, ${particle.opacity})`,
          snowy: `rgba(6, 182, 212, ${particle.opacity})`,
          stormy: `rgba(139, 92, 246, ${particle.opacity})`,
        };
        
        ctx.fillStyle = colors[currentWeather] || colors.sunny;
        ctx.fill();

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y > canvas.offsetHeight) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [forecast, selectedDay]);

  const refreshData = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setForecast(generateMockData());
      setIsAnimating(false);
    }, 500);
  };

  if (forecast.length === 0) return null;

  const current = forecast[selectedDay];
  const WeatherIcon = WEATHER_CONDITIONS[current.weather.condition].icon;
  const weatherColor = WEATHER_CONDITIONS[current.weather.condition].color;
  const weatherBg = WEATHER_CONDITIONS[current.weather.condition].bg;

  const productivityScore = Math.round(
    (current.metrics.commits * 5 + 
     current.metrics.bugsFixed * 10 + 
     current.metrics.linesWritten / 50 +
     current.metrics.focusScore) / 4
  );

  const quote = CODING_QUOTES.find(q => productivityScore >= q.threshold)?.quote || CODING_QUOTES[CODING_QUOTES.length - 1].quote;

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Cloud className="h-4 w-4" />
            <span className="text-sm font-medium">Code Weather Station</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Coding Conditions{" "}
            <span className="text-gradient-animated">Forecast</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Weather patterns generated from your coding activity. Sunny days mean productive commits!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${weatherBg} border border-border p-8`}>
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="bg-white/50 dark:bg-black/50">
                        <Calendar className="h-3 w-3 mr-1" />
                        {current.date}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshData}
                        className={`h-8 w-8 ${isAnimating ? "animate-spin" : ""}`}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-4xl font-bold capitalize mb-2">
                      {current.weather.condition}
                    </h3>
                    <p className="text-muted-foreground">{current.weather.description}</p>
                  </div>
                  
                  <motion.div
                    animate={{ 
                      rotate: current.weather.condition === "sunny" ? 360 : 0,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <WeatherIcon 
                      className="h-24 w-24" 
                      style={{ color: weatherColor }}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    <Thermometer className="h-5 w-5 mb-2" style={{ color: weatherColor }} />
                    <p className="text-2xl font-bold">{current.weather.temperature}°</p>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    <Droplets className="h-5 w-5 mb-2" style={{ color: weatherColor }} />
                    <p className="text-2xl font-bold">{current.weather.humidity}%</p>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    <Wind className="h-5 w-5 mb-2" style={{ color: weatherColor }} />
                    <p className="text-2xl font-bold">{current.weather.windSpeed}</p>
                    <p className="text-xs text-muted-foreground">km/h Wind</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Forecast */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4">7-Day Forecast</h3>
              <div className="grid grid-cols-7 gap-2">
                {forecast.map((day, index) => {
                  const DayIcon = WEATHER_CONDITIONS[day.weather.condition].icon;
                  const isSelected = selectedDay === index;
                  
                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(index)}
                      className={`p-3 rounded-xl transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <p className="text-xs font-medium mb-2">{day.date}</p>
                      <DayIcon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-lg font-bold">{day.metrics.commits}</p>
                      <p className="text-[10px] opacity-70">commits</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-4">Today's Coding Metrics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                          <GitCommit className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Commits</p>
                          <p className="text-xs text-muted-foreground">Code pushed</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{current.metrics.commits}</p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <Bug className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">Bugs Fixed</p>
                          <p className="text-xs text-muted-foreground">Issues resolved</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{current.metrics.bugsFixed}</p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                          <Coffee className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">Coffee</p>
                          <p className="text-xs text-muted-foreground">Cups consumed</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{current.metrics.coffeeConsumed}</p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Code2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Lines Written</p>
                          <p className="text-xs text-muted-foreground">Code produced</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{current.metrics.linesWritten}</p>
                    </div>
                  </div>
                </div>

                {/* Productivity Score */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Productivity Score</span>
                    </div>
                    <span className="text-3xl font-bold text-primary">{productivityScore}</span>
                  </div>
                  
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${productivityScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <p className="mt-3 text-sm text-muted-foreground">{quote}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="insights">
                <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                  <h3 className="font-semibold">Coding Insights</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-secondary">
                      <p className="text-sm font-medium mb-1">Energy Level</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                            style={{ width: `${current.metrics.energyLevel}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{current.metrics.energyLevel}%</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-secondary">
                      <p className="text-sm font-medium mb-1">Focus Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${current.metrics.focusScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{current.metrics.focusScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Based on your commit patterns, bug fixes, and coding velocity. 
                      Weather conditions are metaphorically generated from these metrics!
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
