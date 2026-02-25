"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  RefreshCw
} from "lucide-react";

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy";
  temperature: number;
  humidity: number;
  windSpeed: number;
  location: string;
  description: string;
}

const mockWeatherData: WeatherData[] = [
  { condition: "sunny", temperature: 24, humidity: 45, windSpeed: 12, location: "San Francisco", description: "Clear sky" },
  { condition: "cloudy", temperature: 18, humidity: 65, windSpeed: 18, location: "London", description: "Partly cloudy" },
  { condition: "rainy", temperature: 16, humidity: 80, windSpeed: 22, location: "Seattle", description: "Light rain" },
  { condition: "stormy", temperature: 19, humidity: 85, windSpeed: 35, location: "Singapore", description: "Thunderstorms" },
  { condition: "snowy", temperature: -2, humidity: 70, windSpeed: 15, location: "Toronto", description: "Light snow" },
  { condition: "windy", temperature: 21, humidity: 40, windSpeed: 40, location: "Chicago", description: "Windy" },
];

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: CloudLightning,
  windy: Wind,
};

const weatherGradients = {
  sunny: "from-amber-400 to-orange-500",
  cloudy: "from-slate-400 to-slate-500",
  rainy: "from-blue-400 to-blue-600",
  snowy: "from-cyan-200 to-blue-300",
  stormy: "from-indigo-500 to-purple-600",
  windy: "from-teal-400 to-cyan-500",
};

export function WeatherWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refreshWeather = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % mockWeatherData.length;
      setCurrentIndex(nextIndex);
      setWeather(mockWeatherData[nextIndex]);
      setIsLoading(false);
    }, 800);
  };

  // Auto-rotate weather every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        const nextIndex = (currentIndex + 1) % mockWeatherData.length;
        setCurrentIndex(nextIndex);
        setWeather(mockWeatherData[nextIndex]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [currentIndex, isOpen]);

  const WeatherIcon = weatherIcons[weather.condition];

  return (
    <>
      {/* Compact Widget */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full glass hover:shadow-lg transition-shadow"
      >
        <motion.div
          animate={{ 
            rotate: weather.condition === "sunny" ? 360 : 0,
            scale: weather.condition === "stormy" ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5, repeat: weather.condition === "stormy" ? Infinity : 0 }
          }}
        >
          <WeatherIcon className="h-5 w-5" />
        </motion.div>
        <span className="font-medium">{weather.temperature}°C</span>
      </motion.button>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-36 right-4 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl"
            >
              {/* Header with gradient */}
              <div className={`relative p-6 bg-gradient-to-br ${weatherGradients[weather.condition]}`}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{weather.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <motion.div
                      key={weather.temperature}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-bold text-white"
                    >
                      {weather.temperature}°
                    </motion.div>
                    <div className="text-white/80 mt-1">{weather.description}</div>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: weather.condition === "sunny" ? 360 : [0, -10, 10, 0],
                      scale: weather.condition === "rainy" ? [1, 0.9, 1] : 1
                    }}
                    transition={{ 
                      rotate: { duration: weather.condition === "sunny" ? 10 : 2, repeat: Infinity },
                      scale: { duration: 1, repeat: weather.condition === "rainy" ? Infinity : 0 }
                    }}
                  >
                    <WeatherIcon className="h-16 w-16 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-card">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                      <div className="font-semibold">{weather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <Wind className="h-5 w-5 text-teal-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                      <div className="font-semibold">{weather.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={refreshWeather}
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Weather</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default WeatherWidget;
