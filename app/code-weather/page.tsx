"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  RefreshCw,
  MapPin,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "foggy";
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: string;
  pressure: number;
  description: string;
  codingMood: string;
  recommendedActivity: string;
  emoji: string;
}

const weatherConditions: Record<string, WeatherData> = {
  sunny: {
    condition: "sunny",
    temperature: 28,
    humidity: 45,
    windSpeed: 12,
    visibility: "10km",
    pressure: 1015,
    description: "Clear skies, perfect visibility",
    codingMood: "Energetic & Focused",
    recommendedActivity: "Tackle complex algorithms or start new projects",
    emoji: "☀️"
  },
  cloudy: {
    condition: "cloudy",
    temperature: 22,
    humidity: 60,
    windSpeed: 18,
    visibility: "8km",
    pressure: 1010,
    description: "Overcast with comfortable conditions",
    codingMood: "Calm & Steady",
    recommendedActivity: "Refactoring and code review sessions",
    emoji: "☁️"
  },
  rainy: {
    condition: "rainy",
    temperature: 18,
    humidity: 85,
    windSpeed: 25,
    visibility: "5km",
    pressure: 1005,
    description: "Light rain with cool breeze",
    codingMood: "Cozy & Creative",
    recommendedActivity: "UI/UX design or creative coding projects",
    emoji: "🌧️"
  },
  stormy: {
    condition: "stormy",
    temperature: 15,
    humidity: 90,
    windSpeed: 45,
    visibility: "2km",
    pressure: 995,
    description: "Thunderstorms with heavy rain",
    codingMood: "Intense & Productive",
    recommendedActivity: "Deep debugging or system architecture work",
    emoji: "⛈️"
  },
  foggy: {
    condition: "foggy",
    temperature: 12,
    humidity: 95,
    windSpeed: 8,
    visibility: "500m",
    pressure: 1008,
    description: "Thick fog with low visibility",
    codingMood: "Mysterious & Experimental",
    recommendedActivity: "Try new frameworks or experimental features",
    emoji: "🌫️"
  }
};

const codingQuotes = [
  "The best code is no code at all.",
  "First, solve the problem. Then, write the code.",
  "Code is like humor. When you have to explain it, it's bad.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Any fool can write code that a computer can understand.",
  "Experience is the name everyone gives to their mistakes.",
  "Java is to JavaScript what car is to Carpet."
];

export default function CodeWeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(weatherConditions.sunny);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState(codingQuotes[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate weather based on actual time
    const hour = currentTime.getHours();
    let condition: keyof typeof weatherConditions = "sunny";
    
    if (hour >= 6 && hour < 10) condition = "sunny";
    else if (hour >= 10 && hour < 14) condition = "cloudy";
    else if (hour >= 14 && hour < 18) condition = "rainy";
    else if (hour >= 18 && hour < 22) condition = "stormy";
    else condition = "foggy";
    
    setCurrentWeather(weatherConditions[condition]);
  }, [currentTime]);

  const refreshWeather = () => {
    setLoading(true);
    setTimeout(() => {
      const conditions = Object.keys(weatherConditions);
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)] as keyof typeof weatherConditions;
      setCurrentWeather(weatherConditions[randomCondition]);
      setQuote(codingQuotes[Math.floor(Math.random() * codingQuotes.length)]);
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="h-16 w-16 text-yellow-500" />;
      case "cloudy": return <Cloud className="h-16 w-16 text-gray-400" />;
      case "rainy": return <CloudRain className="h-16 w-16 text-blue-400" />;
      case "stormy": return <Wind className="h-16 w-16 text-purple-500" />;
      case "foggy": return <Droplets className="h-16 w-16 text-slate-400" />;
      default: return <Sun className="h-16 w-16 text-yellow-500" />;
    }
  };

  const getBackgroundGradient = (condition: string) => {
    switch (condition) {
      case "sunny": return "from-orange-400/20 via-yellow-400/10 to-background";
      case "cloudy": return "from-gray-400/20 via-slate-400/10 to-background";
      case "rainy": return "from-blue-400/20 via-cyan-400/10 to-background";
      case "stormy": return "from-purple-400/20 via-indigo-400/10 to-background";
      case "foggy": return "from-slate-400/20 via-gray-400/10 to-background";
      default: return "from-orange-400/20 via-yellow-400/10 to-background";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative py-16 px-4 bg-gradient-to-b ${getBackgroundGradient(currentWeather.condition)}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Developer Atmosphere</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Code <span className="text-gradient-animated">Weather</span>
            </h1>
            <p className="text-muted-foreground">
              Current conditions for optimal coding
            </p>
          </motion.div>

          {/* Main Weather Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Main Weather */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Developer Workspace</span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentWeather.condition}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center md:justify-start gap-4"
                    >
                      <span className="text-6xl">{currentWeather.emoji}</span>
                      <div>
                        <p className="text-5xl font-bold">{currentWeather.temperature}°</p>
                        <p className="text-lg text-muted-foreground capitalize">{currentWeather.condition}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentWeather.description}
                  </p>
                </div>

                {/* Right: Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="font-semibold">{currentWeather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Wind className="h-5 w-5 text-cyan-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="font-semibold">{currentWeather.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Visibility</p>
                      <p className="font-semibold">{currentWeather.visibility}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Gauge className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pressure</p>
                      <p className="font-semibold">{currentWeather.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshWeather}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Conditions
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Coding Mood & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  Coding Mood
                </h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWeather.codingMood}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-2xl font-bold text-gradient mb-2">
                      {currentWeather.codingMood}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The current atmospheric conditions suggest this is your optimal mental state for coding.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recommended Activity
                </h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWeather.recommendedActivity}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-lg font-medium mb-2">
                      {currentWeather.recommendedActivity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on the current "weather" conditions, this activity will maximize your productivity.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card className="p-6 text-center">
              <p className="text-lg italic text-muted-foreground mb-2">"{quote}"</p>
              <p className="text-sm text-muted-foreground">— Developer Wisdom</p>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
