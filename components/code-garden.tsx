"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flower2,
  Leaf,
  Sprout,
  TreePine,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Sparkles,
  RotateCcw,
  Pause,
  Play,
  Download,
  Share2,
  Info,
} from "lucide-react";
import { ScrollReveal } from "./scroll-animations";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Plant {
  id: string;
  x: number;
  y: number;
  type: "flower" | "tree" | "bush" | "vine";
  size: number;
  color: string;
  growth: number;
  commits: number;
  project: string;
  lastCommit: Date;
  branches: Branch[];
}

interface Branch {
  angle: number;
  length: number;
  depth: number;
}

interface Weather {
  type: "sunny" | "cloudy" | "rainy" | "windy";
  intensity: number;
}

const COLORS = [
  "#10b981", // emerald
  "#22c55e", // green
  "#84cc16", // lime
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
];

const PROJECTS = [
  "nemo-portfolio",
  "generative-art",
  "design-system",
  "api-gateway",
  "openclaw-tools",
  "react-components",
];

const generateInitialGarden = (): Plant[] = {
  const plants: Plant[] = [];
  
  for (let i = 0; i < 15; i++) {
    const type = ["flower", "tree", "bush", "vine"][Math.floor(Math.random() * 4)] as Plant["type"];
    const branches: Branch[] = [];
    
    if (type === "tree") {
      for (let b = 0; b < 3 + Math.random() * 3; b++) {
        branches.push({
          angle: (Math.random() - 0.5) * Math.PI,
          length: 20 + Math.random() * 30,
          depth: Math.floor(Math.random() * 3) + 1,
        });
      }
    }
    
    plants.push({
      id: `plant-${i}`,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      type,
      size: 0.5 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      growth: 0.3 + Math.random() * 0.7,
      commits: Math.floor(Math.random() * 100) + 10,
      project: PROJECTS[Math.floor(Math.random() * PROJECTS.length)],
      lastCommit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      branches,
    });
  }
  
  return plants;
};

const FlowerSVG = ({ plant, isGrowing }: { plant: Plant; isGrowing: boolean }) => {
  const petals = 5 + Math.floor(plant.size * 5);
  
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: plant.growth }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Stem */}
      <motion.path
        d={`M 0 0 Q ${Math.sin(Date.now() / 1000) * 5} -20 0 -40`}
        stroke={plant.color}
        strokeWidth={2}
        fill="none"
        animate={isGrowing ? { pathLength: [0, 1] } : {}}
      />
      
      {/* Leaves */}
      <motion.ellipse
        cx="-8"
        cy="-15"
        rx="6"
        ry="3"
        fill={plant.color}
        opacity={0.7}
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse
        cx="8"
        cy="-20"
        rx="6"
        ry="3"
        fill={plant.color}
        opacity={0.7}
        animate={{ rotate: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />
      
      {/* Flower center */}
      <circle cy="-40" r={4 + plant.size * 3} fill="#fbbf24" />
      
      {/* Petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        const x = Math.cos(angle) * (8 + plant.size * 8);
        const y = -40 + Math.sin(angle) * (8 + plant.size * 8);
        
        return (
          <motion.ellipse
            key={i}
            cx={x}
            cy={y}
            rx="4"
            ry="8"
            fill={plant.color}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: (angle * 180) / Math.PI + 90 }}
            transition={{ delay: i * 0.05 }}
          />
        );
      })}
    </motion.g>
  );
};

const TreeSVG = ({ plant }: { plant: Plant }) => {
  const renderBranch = (branch: Branch, index: number) => {
    const endX = Math.cos(branch.angle) * branch.length;
    const endY = -Math.sin(branch.angle) * branch.length;
    
    return (
      <g key={index}>
        <motion.line
          x1={0}
          y1={0}
          x2={endX}
          y2={endY}
          stroke={plant.color}
          strokeWidth={Math.max(1, branch.depth)}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
        <{/* Leaves at branch end */}>
        <motion.circle
          cx={endX}
          cy={endY}
          r={3 + Math.random() * 4}
          fill={plant.color}
          opacity={0.8}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        />
      </g>
    );
  };

  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: plant.growth }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Trunk */}
      <motion.path
        d="M 0 0 Q 5 -30 0 -60"
        stroke={plant.color}
        strokeWidth={4}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      
      {/* Branches */}
      <g transform="translate(0, -60)">
        {plant.branches.map((branch, i) => renderBranch(branch, i))}
      </g>
    </motion.g>
  );
};

const BushSVG = ({ plant }: { plant: Plant }) => (
  <motion.g
    initial={{ scale: 0 }}
    animate={{ scale: plant.growth }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {Array.from({ length: 5 + Math.floor(plant.size * 5) }).map((_, i) => {
      const angle = (i / 5) * Math.PI;
      const x = Math.cos(angle) * (15 + Math.random() * 10);
      const y = -Math.sin(angle) * (10 + Math.random() * 8);
      
      return (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={8 + Math.random() * 6}
          fill={plant.color}
          opacity={0.7 + Math.random() * 0.3}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      );
    })}
  </motion.g>
);

const VineSVG = ({ plant }: { plant: Plant }) => {
  const points = Array.from({ length: 10 }, (_, i) => ({
    x: Math.sin(i * 0.5) * (10 + plant.size * 10),
    y: -i * 8,
  }));
  
  const pathD = points.reduce((acc, p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
    ""
  );
  
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: plant.growth }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.path
        d={pathD}
        stroke={plant.color}
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2 + Math.random() * 2}
          fill={plant.color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </motion.g>
  );
};

const PlantComponent = ({ plant, weather }: { plant: Plant; weather: Weather }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getSwayAmount = () => {
    switch (weather.type) {
      case "windy": return 15;
      case "rainy": return 8;
      default: return 3;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.g
            transform={`translate(${plant.x}, ${plant.y})`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            animate={{
              rotate: [0, getSwayAmount(), 0, -getSwayAmount(), 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ cursor: "pointer" }}
          >
            {plant.type === "flower" && <FlowerSVG plant={plant} isGrowing={isHovered} />}
            {plant.type === "tree" && <TreeSVG plant={plant} />}
            {plant.type === "bush" && <BushSVG plant={plant} />}
            {plant.type === "vine" && <VineSVG plant={plant} />}
            
            {/* Hover glow effect */}
            <AnimatePresence>
              {isHovered && (
                <motion.circle
                  cx={0}
                  cy={-20}
                  r={30}
                  fill={plant.color}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.2, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.g>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{plant.project}</p>
            <p className="text-xs text-muted-foreground">
              {plant.commits} commits • {plant.type}
            </p>
            <p className="text-xs text-muted-foreground">
              Last commit: {plant.lastCommit.toLocaleDateString()}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const WeatherOverlay = ({ weather }: { weather: Weather }) => {
  if (weather.type === "sunny") {
    return (
      <motion.g>
        <motion.circle
          cx="90"
          cy="10"
          r="8"
          fill="#fbbf24"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <motion.line
              key={i}
              x1={90 + Math.cos(angle) * 10}
              y1={10 + Math.sin(angle) * 10}
              x2={90 + Math.cos(angle) * 14}
              y2={10 + Math.sin(angle) * 14}
              stroke="#fbbf24"
              strokeWidth={2}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          );
        })}
      </motion.g>
    );
  }
  
  if (weather.type === "rainy") {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.line
            key={i}
            x1={Math.random() * 100}
            y1={-10}
            x2={Math.random() * 100 - 5}
            y2={100}
            stroke="#60a5fa"
            strokeWidth={1}
            opacity={0.5}
            animate={{ y: [0, 110] }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </>
    );
  }
  
  if (weather.type === "cloudy") {
    return (
      <>
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.ellipse
            key={i}
            cx={70 + i * 15}
            cy={15 + Math.random() * 5}
            rx={12}
            ry={6}
            fill="#94a3b8"
            opacity={0.5}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          />
        ))}
      </>
    );
  }
  
  return null;
};

export function CodeGarden() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [weather, setWeather] = useState<Weather>({ type: "sunny", intensity: 0.5 });
  const [isGrowing, setIsGrowing] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [growthSpeed, setGrowthSpeed] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setPlants(generateInitialGarden());
  }, []);

  // Simulate growth
  useEffect(() => {
    if (!isGrowing) return;
    
    const interval = setInterval(() => {
      setPlants(prev => prev.map(plant => ({
        ...plant,
        growth: Math.min(1, plant.growth + 0.01 * growthSpeed),
        commits: plant.growth >= 1 ? plant.commits + 1 : plant.commits,
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isGrowing, growthSpeed]);

  const handleAddPlant = () => {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      type: ["flower", "tree", "bush", "vine"][Math.floor(Math.random() * 4)] as Plant["type"],
      size: 0.5 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      growth: 0,
      commits: 1,
      project: PROJECTS[Math.floor(Math.random() * PROJECTS.length)],
      lastCommit: new Date(),
      branches: [],
    };
    
    setPlants(prev => [...prev, newPlant]);
  };

  const handleReset = () => {
    setPlants(generateInitialGarden());
  };

  const totalCommits = plants.reduce((sum, p) => sum + p.commits, 0);
  const gardenHealth = Math.round((plants.reduce((sum, p) => sum + p.growth, 0) / plants.length) * 100);

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background to-emerald-50/20 dark:to-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 mb-6"
          >
            <Sprout className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Garden</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code <span className="text-gradient-animated">Garden</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch your code commits bloom into a living digital garden. Each plant represents a project,
            growing with every contribution.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <ScrollReveal delay={0.1}>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <TreePine className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
              <p className="text-2xl font-bold">{plants.length}</p>
              <p className="text-xs text-muted-foreground">Plants</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <Sparkles className="h-5 w-5 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold">{totalCommits}</p>
              <p className="text-xs text-muted-foreground">Total Commits</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <Droplets className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{gardenHealth}%</p>
              <p className="text-xs text-muted-foreground">Garden Health</p>
            </div>
          </ScrollReveal>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2">
            <Button
              variant={isGrowing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsGrowing(!isGrowing)}
            >
              {isGrowing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isGrowing ? "Pause" : "Grow"}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleAddPlant}>
              <Sprout className="h-4 w-4 mr-1" />
              Plant Seed
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider
                value={[growthSpeed]}
                onValueChange={([v]) => setGrowthSpeed(v)}
                max={3}
                min={0.5}
                step={0.5}
                className="w-24"
              />
            </div>

            <div className="flex items-center gap-1">
              {([
                { type: "sunny", icon: Sun },
                { type: "cloudy", icon: Cloud },
                { type: "rainy", icon: CloudRain },
                { type: "windy", icon: Wind },
              ] as const).map(({ type, icon: Icon }) => (
                <Button
                  key={type}
                  variant={weather.type === type ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setWeather({ type, intensity: 0.5 })}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Garden Canvas */}
        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-b from-sky-100/50 to-emerald-100/50 dark:from-sky-950/30 dark:to-emerald-950/30">
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              className="w-full h-[400px] md:h-[500px]"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Ground */}
              <rect
                x="0"
                y="85"
                width="100"
                height="15"
                fill="url(#groundGradient)"
              />
              
              <defs>
                <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Weather */}
              <WeatherOverlay weather={weather} />

              {/* Plants */}
              {plants.map((plant) => (
                <PlantComponent key={plant.id} plant={plant} weather={weather} />
              ))}
            </svg>

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/80 dark:bg-black/80">
                  {weather.type.charAt(0).toUpperCase() + weather.type.slice(1)}
                </Badge>
                <Badge variant="secondary" className="bg-white/80 dark:bg-black/80">
                  {isGrowing ? "Growing" : "Paused"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 dark:bg-black/80">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 dark:bg-black/80">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {[
            { type: "flower", icon: Flower2, label: "Frontend" },
            { type: "tree", icon: TreePine, label: "Backend" },
            { type: "bush", icon: Leaf, label: "Library" },
            { type: "vine", icon: Sprout, label: "Tool" },
          ].map(({ type, icon: Icon, label }) => (
            <div key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
