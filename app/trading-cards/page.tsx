"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Zap,
  Target,
  Flame,
  Crown,
  Diamond,
  Award,
  Medal,
  Sparkles,
  Lock,
  Unlock,
  Share2,
  Download,
  RotateCcw,
  Filter,
  Grid3X3,
  List,
  Search,
  SortAsc,
  ChevronRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Code2,
  Palette,
  Terminal,
  Cpu,
  Database,
  Layout,
  Smartphone,
  Globe2,
  GitBranch,
  Bug,
  Rocket,
  Lightbulb,
  BookOpen,
  Heart,
  MessageSquare,
  Eye,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";

interface TradingCard {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  category: string;
  icon: typeof Code2;
  stats: {
    power: number;
    speed: number;
    creativity: number;
    learning: number;
  };
  abilities: string[];
  unlocked: boolean;
  unlockedAt?: Date;
  xpBonus: number;
  collectorNumber: number;
  totalCollectors: number;
}

const tradingCards: TradingCard[] = [
  {
    id: "react-mastery",
    name: "React Mastery",
    description: "Master of component architecture and state management",
    rarity: "legendary",
    category: "Frontend",
    icon: Code2,
    stats: { power: 95, speed: 88, creativity: 92, learning: 90 },
    abilities: ["Virtual DOM Manipulation", "Hook Sorcery", "Component Composition"],
    unlocked: true,
    unlockedAt: new Date("2024-01-15"),
    xpBonus: 500,
    collectorNumber: 1,
    totalCollectors: 100
  },
  {
    id: "typescript-wizard",
    name: "TypeScript Wizard",
    description: "Type safety enforcer and generic spellcaster",
    rarity: "epic",
    category: "Language",
    icon: Terminal,
    stats: { power: 88, speed: 82, creativity: 75, learning: 95 },
    abilities: ["Type Inference", "Generic Polymorphism", "Interface Design"],
    unlocked: true,
    unlockedAt: new Date("2024-02-20"),
    xpBonus: 350,
    collectorNumber: 2,
    totalCollectors: 250
  },
  {
    id: "css-artist",
    name: "CSS Artist",
    description: "Creates visual masterpieces with stylesheets",
    rarity: "rare",
    category: "Design",
    icon: Palette,
    stats: { power: 75, speed: 90, creativity: 98, learning: 70 },
    abilities: ["Grid Mastery", "Animation Sorcery", "Responsive Design"],
    unlocked: true,
    unlockedAt: new Date("2024-03-10"),
    xpBonus: 250,
    collectorNumber: 3,
    totalCollectors: 500
  },
  {
    id: "node-ninja",
    name: "Node.js Ninja",
    description: "Server-side JavaScript assassin",
    rarity: "epic",
    category: "Backend",
    icon: Cpu,
    stats: { power: 90, speed: 85, creativity: 70, learning: 88 },
    abilities: ["Event Loop Mastery", "Stream Manipulation", "Async Operations"],
    unlocked: true,
    unlockedAt: new Date("2024-01-28"),
    xpBonus: 400,
    collectorNumber: 4,
    totalCollectors: 300
  },
  {
    id: "database-sage",
    name: "Database Sage",
    description: "Keeper of queries and schema designer",
    rarity: "rare",
    category: "Backend",
    icon: Database,
    stats: { power: 85, speed: 70, creativity: 65, learning: 90 },
    abilities: ["Query Optimization", "Schema Design", "Transaction Control"],
    unlocked: false,
    xpBonus: 300,
    collectorNumber: 5,
    totalCollectors: 400
  },
  {
    id: "ui-architect",
    name: "UI Architect",
    description: "Builder of beautiful user interfaces",
    rarity: "legendary",
    category: "Design",
    icon: Layout,
    stats: { power: 80, speed: 88, creativity: 96, learning: 82 },
    abilities: ["Design System Creation", "Accessibility Expert", "Micro-interactions"],
    unlocked: true,
    unlockedAt: new Date("2024-02-05"),
    xpBonus: 450,
    collectorNumber: 6,
    totalCollectors: 150
  },
  {
    id: "mobile-maestro",
    name: "Mobile Maestro",
    description: "Cross-platform mobile development expert",
    rarity: "epic",
    category: "Mobile",
    icon: Smartphone,
    stats: { power: 82, speed: 90, creativity: 85, learning: 88 },
    abilities: ["React Native", "iOS/Android", "Mobile Optimization"],
    unlocked: false,
    xpBonus: 380,
    collectorNumber: 7,
    totalCollectors: 280
  },
  {
    id: "web-guru",
    name: "Web Guru",
    description: "Full-stack web development master",
    rarity: "mythic",
    category: "Full Stack",
    icon: Globe2,
    stats: { power: 95, speed: 92, creativity: 90, learning: 95 },
    abilities: ["End-to-End Development", "System Architecture", "Performance Optimization"],
    unlocked: true,
    unlockedAt: new Date("2024-03-01"),
    xpBonus: 1000,
    collectorNumber: 8,
    totalCollectors: 50
  },
  {
    id: "git-master",
    name: "Git Master",
    description: "Version control virtuoso",
    rarity: "rare",
    category: "Tools",
    icon: GitBranch,
    stats: { power: 70, speed: 95, creativity: 60, learning: 85 },
    abilities: ["Branch Management", "Conflict Resolution", "Rebase Sorcery"],
    unlocked: true,
    unlockedAt: new Date("2024-01-10"),
    xpBonus: 200,
    collectorNumber: 9,
    totalCollectors: 600
  },
  {
    id: "debug-detective",
    name: "Debug Detective",
    description: "Bug hunter and problem solver",
    rarity: "epic",
    category: "Tools",
    icon: Bug,
    stats: { power: 88, speed: 75, creativity: 92, learning: 85 },
    abilities: ["Console Mastery", "Breakpoint Wizardry", "Stack Trace Reading"],
    unlocked: true,
    unlockedAt: new Date("2024-02-15"),
    xpBonus: 320,
    collectorNumber: 10,
    totalCollectors: 350
  },
  {
    id: "deployment-hero",
    name: "Deployment Hero",
    description: "CI/CD pipeline champion",
    rarity: "legendary",
    category: "DevOps",
    icon: Rocket,
    stats: { power: 92, speed: 95, creativity: 75, learning: 88 },
    abilities: ["Docker Mastery", "Kubernetes", "Cloud Deployment"],
    unlocked: false,
    xpBonus: 480,
    collectorNumber: 11,
    totalCollectors: 120
  },
  {
    id: "innovation-maven",
    name: "Innovation Maven",
    description: "Creative problem solver and idea generator",
    rarity: "epic",
    category: "Soft Skills",
    icon: Lightbulb,
    stats: { power: 75, speed: 80, creativity: 98, learning: 92 },
    abilities: ["Design Thinking", "Rapid Prototyping", "User Empathy"],
    unlocked: true,
    unlockedAt: new Date("2024-03-20"),
    xpBonus: 360,
    collectorNumber: 12,
    totalCollectors: 275
  }
];

const rarityColors = {
  common: { bg: "from-gray-500 to-gray-600", text: "text-gray-500", border: "border-gray-400" },
  rare: { bg: "from-blue-500 to-blue-600", text: "text-blue-500", border: "border-blue-400" },
  epic: { bg: "from-purple-500 to-purple-600", text: "text-purple-500", border: "border-purple-400" },
  legendary: { bg: "from-orange-500 to-red-500", text: "text-orange-500", border: "border-orange-400" },
  mythic: { bg: "from-yellow-400 via-orange-500 to-red-500", text: "text-yellow-500", border: "border-yellow-400" }
};

const rarityGlow = {
  common: "",
  rare: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  epic: "shadow-[0_0_30px_rgba(147,51,234,0.4)]",
  legendary: "shadow-[0_0_40px_rgba(249,115,22,0.5)]",
  mythic: "shadow-[0_0_50px_rgba(234,179,8,0.6)]"
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function TradingCardComponent({ 
  card, 
  isFlipped, 
  onFlip 
}: { 
  card: TradingCard; 
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const Icon = card.icon;
  const rarityStyle = rarityColors[card.rarity];
  const glowClass = rarityGlow[card.rarity];

  return (
    <motion.div
      className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
      onClick={onFlip}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 ${rarityStyle.border} ${glowClass} ${!card.unlocked ? 'opacity-60' : ''}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${rarityStyle.bg} opacity-10`} />
          
          <div className="relative h-full p-4 flex flex-col">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${rarityStyle.text} bg-transparent border-current`}>
                {card.rarity.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                #{card.collectorNumber}/{card.totalCollectors}
              </span>
            </div>

            {/* Card Image Area */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${rarityStyle.bg} flex items-center justify-center ${!card.unlocked ? 'grayscale' : ''}`}>
                {card.unlocked ? (
                  <Icon className="h-12 w-12 text-white" />
                ) : (
                  <Lock className="h-12 w-12 text-white/50" />
                )}
              </div>
            </div>

            {/* Card Info */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg mb-1">{card.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {card.unlocked ? card.description : "???"}
              </p>
            </div>

            {/* Category */}
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="text-xs">
                {card.category}
              </Badge>
            </div>

            {/* XP Bonus */}
            <div className="flex items-center justify-center gap-1 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">+{card.xpBonus} XP</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-2 border-primary/30 bg-card"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full p-4 flex flex-col">
            <h4 className="font-bold text-center mb-4">{card.name}</h4>
            
            {card.unlocked ? (
              <>
                <div className="space-y-3 mb-4">
                  <StatBar label="Power" value={card.stats.power} color="bg-red-500" />
                  <StatBar label="Speed" value={card.stats.speed} color="bg-blue-500" />
                  <StatBar label="Creativity" value={card.stats.creativity} color="bg-purple-500" />
                  <StatBar label="Learning" value={card.stats.learning} color="bg-green-500" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">ABILITIES</p>
                  <div className="space-y-1">
                    {card.abilities.map((ability, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {ability}
                      </div>
                    ))}
                  </div>
                </div>

                {card.unlockedAt && (
                  <div className="text-center text-xs text-muted-foreground mt-4">
                    Unlocked {card.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Complete challenges to unlock</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DeveloperTradingCardsPage() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rarity" | "date" | "xp">("rarity");

  const toggleCardFlip = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const filteredCards = tradingCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = filterRarity === "all" || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  }).sort((a, b) => {
    if (sortBy === "rarity") {
      const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    } else if (sortBy === "xp") {
      return b.xpBonus - a.xpBonus;
    }
    return 0;
  });

  const unlockedCount = tradingCards.filter(c => c.unlocked).length;
  const totalXP = tradingCards.filter(c => c.unlocked).reduce((acc, c) => acc + c.xpBonus, 0);
  const completionRate = Math.round((unlockedCount / tradingCards.length) * 100);

  const rarityCounts = {
    common: tradingCards.filter(c => c.rarity === "common" && c.unlocked).length,
    rare: tradingCards.filter(c => c.rarity === "rare" && c.unlocked).length,
    epic: tradingCards.filter(c => c.rarity === "epic" && c.unlocked).length,
    legendary: tradingCards.filter(c => c.rarity === "legendary" && c.unlocked).length,
    mythic: tradingCards.filter(c => c.rarity === "mythic" && c.unlocked).length
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Collect & Trade</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Developer{" "}
            <span className="text-gradient">Trading Cards</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Collectible cards showcasing your skills and achievements. 
            Unlock rare cards by completing challenges and mastering technologies.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{unlockedCount}/{tradingCards.length}</div>
              <div className="text-sm text-muted-foreground">Cards Collected</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{totalXP.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{rarityCounts.mythic + rarityCounts.legendary}</div>
              <div className="text-sm text-muted-foreground">Legendary+</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rarity Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Collection Progress</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(rarityCounts).map(([rarity, count]) => {
                  const totalOfRarity = tradingCards.filter(c => c.rarity === rarity).length;
                  const percentage = Math.round((count / totalOfRarity) * 100);
                  
                  return (
                    <div key={rarity} className="text-center">
                      <div className={`text-lg font-bold capitalize ${rarityColors[rarity as keyof typeof rarityColors].text}`}>
                        {count}/{totalOfRarity}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize mb-2">{rarity}</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${rarityColors[rarity as keyof typeof rarityColors].bg}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythic">Mythic</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="rarity">Sort by Rarity</option>
              <option value="xp">Sort by XP</option>
            </select>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <TradingCardComponent
                  card={card}
                  isFlipped={flippedCards.has(card.id)}
                  onFlip={() => toggleCardFlip(card.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
