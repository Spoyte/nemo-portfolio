"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Globe, Activity, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Visitor {
  id: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  flag: string;
  timestamp: number;
}

// Simulated visitor data
const simulatedVisitors: Visitor[] = [
  { id: "1", country: "United States", city: "San Francisco", lat: 37.7749, lng: -122.4194, flag: "🇺🇸", timestamp: Date.now() - 1000 },
  { id: "2", country: "United Kingdom", city: "London", lat: 51.5074, lng: -0.1278, flag: "🇬🇧", timestamp: Date.now() - 5000 },
  { id: "3", country: "Japan", city: "Tokyo", lat: 35.6762, lng: 139.6503, flag: "🇯🇵", timestamp: Date.now() - 10000 },
  { id: "4", country: "Germany", city: "Berlin", lat: 52.52, lng: 13.405, flag: "🇩🇪", timestamp: Date.now() - 15000 },
  { id: "5", country: "Australia", city: "Sydney", lat: -33.8688, lng: 151.2093, flag: "🇦🇺", timestamp: Date.now() - 20000 },
  { id: "6", country: "Brazil", city: "São Paulo", lat: -23.5505, lng: -46.6333, flag: "🇧🇷", timestamp: Date.now() - 25000 },
  { id: "7", country: "India", city: "Bangalore", lat: 12.9716, lng: 77.5946, flag: "🇮🇳", timestamp: Date.now() - 30000 },
  { id: "8", country: "Canada", city: "Toronto", lat: 43.6532, lng: -79.3832, flag: "🇨🇦", timestamp: Date.now() - 35000 },
  { id: "9", country: "France", city: "Paris", lat: 48.8566, lng: 2.3522, flag: "🇫🇷", timestamp: Date.now() - 40000 },
  { id: "10", country: "Singapore", city: "Singapore", lat: 1.3521, lng: 103.8198, flag: "🇸🇬", timestamp: Date.now() - 45000 },
  { id: "11", country: "Netherlands", city: "Amsterdam", lat: 52.3676, lng: 4.9041, flag: "🇳🇱", timestamp: Date.now() - 50000 },
  { id: "12", country: "South Korea", city: "Seoul", lat: 37.5665, lng: 126.978, flag: "🇰🇷", timestamp: Date.now() - 55000 },
];

const additionalCities = [
  { country: "Sweden", city: "Stockholm", lat: 59.3293, lng: 18.0686, flag: "🇸🇪" },
  { country: "Italy", city: "Rome", lat: 41.9028, lng: 12.4964, flag: "🇮🇹" },
  { country: "Spain", city: "Barcelona", lat: 41.3851, lng: 2.1734, flag: "🇪🇸" },
  { country: "Mexico", city: "Mexico City", lat: 19.4326, lng: -99.1332, flag: "🇲🇽" },
  { country: "UAE", city: "Dubai", lat: 25.2048, lng: 55.2708, flag: "🇦🇪" },
  { country: "Russia", city: "Moscow", lat: 55.7558, lng: 37.6173, flag: "🇷🇺" },
  { country: "China", city: "Shanghai", lat: 31.2304, lng: 121.4737, flag: "🇨🇳" },
  { country: "Israel", city: "Tel Aviv", lat: 32.0853, lng: 34.7818, flag: "🇮🇱" },
];

export function LiveVisitorMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visitors, setVisitors] = useState<Visitor[]>(simulatedVisitors);
  const [onlineCount, setOnlineCount] = useState(42);
  const [totalVisitors, setTotalVisitors] = useState(12547);
  const [isLive, setIsLive] = useState(true);
  const animationRef = useRef<number>();

  // Generate new visitor
  const generateVisitor = useCallback(() => {
    const city = additionalCities[Math.floor(Math.random() * additionalCities.length)];
    const newVisitor: Visitor = {
      id: Math.random().toString(36).substr(2, 9),
      ...city,
      timestamp: Date.now(),
    };
    
    setVisitors(prev => {
      const updated = [newVisitor, ...prev].slice(0, 15);
      return updated;
    });
    
    setOnlineCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 100));
    setTotalVisitors(prev => prev + 1);
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        generateVisitor();
      }
      
      // Fluctuate online count
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(20, Math.min(100, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, generateVisitor]);

  // Draw map animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      color: string;
    }> = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw world map outline (simplified)
      ctx.strokeStyle = "rgba(100, 100, 100, 0.2)";
      ctx.lineWidth = 1;
      
      // Draw grid lines
      for (let i = 0; i < 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      for (let i = 0; i < 8; i++) {
        const x = (width / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw connection lines from visitors
      visitors.forEach((visitor, index) => {
        const x = ((visitor.lng + 180) / 360) * width;
        const y = ((90 - visitor.lat) / 180) * height;
        
        // Draw pulse
        const pulse = (Date.now() / 1000 + index) % 2;
        const radius = 3 + pulse * 5;
        const alpha = 1 - pulse * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${alpha * 0.3})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#dc2626";
        ctx.fill();

        // Draw connection line to center (server)
        if (index < 5) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 - index * 0.02})`;
          ctx.stroke();
        }
      });

      // Draw server center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#dc2626";
      ctx.fill();
      
      // Server pulse
      const serverPulse = (Date.now() / 1000) % 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8 + serverPulse * 15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 38, 38, ${0.5 - serverPulse * 0.3})`;
      ctx.fill();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visitors]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Live Visitors</CardTitle>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsLive(!isLive)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isLive ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Map Canvas */}
        <div className="relative h-48 bg-muted/30">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          />
          
          {/* Stats overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="glass px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span className="font-semibold">{onlineCount}</span> online
              </div>
            </div>
            <div className="glass px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span className="font-semibold">{totalVisitors.toLocaleString()}</span> total
              </div>
            </div>
          </div>
        </div>

        {/* Recent visitors list */}
        <div className="p-4 max-h-48 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground mb-3">Recent Visitors</p>
          <div className="space-y-2">
            {visitors.slice(0, 8).map((visitor, index) => (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-lg">{visitor.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{visitor.city}</p>
                  <p className="text-xs text-muted-foreground truncate">{visitor.country}</p>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - visitor.timestamp) / 1000)}s ago
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
