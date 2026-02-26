"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Sparkles,
  Zap,
  Shield,
  Sword,
  Heart,
  Brain,
  Target,
  Clock,
  Star,
  Trophy,
  Lock,
  Unlock,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SkillCard {
  id: string;
  name: string;
  title: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'soft';
  stats: {
    power: number;
    speed: number;
    defense: number;
    intelligence: number;
  };
  abilities: string[];
  description: string;
  experience: number;
  level: number;
  unlocked: boolean;
  unlockRequirement?: string;
}

const skillCards: SkillCard[] = [
  {
    id: "react",
    name: "React",
    title: "Component Master",
    emoji: "⚛️",
    rarity: "legendary",
    category: "frontend",
    stats: { power: 95, speed: 90, defense: 85, intelligence: 92 },
    abilities: ["Virtual DOM", "Hooks Mastery", "State Management", "Component Architecture"],
    description: "Master of component-based architecture and reactive programming.",
    experience: 8750,
    level: 42,
    unlocked: true
  },
  {
    id: "typescript",
    name: "TypeScript",
    title: "Type Guardian",
    emoji: "📘",
    rarity: "epic",
    category: "frontend",
    stats: { power: 88, speed: 75, defense: 98, intelligence: 95 },
    abilities: ["Type Safety", "IntelliSense", "Refactoring", "Compile-time Checks"],
    description: "Brings order to chaos with strict type definitions.",
    experience: 6200,
    level: 35,
    unlocked: true
  },
  {
    id: "nextjs",
    name: "Next.js",
    title: "Full-Stack Visionary",
    emoji: "▲",
    rarity: "legendary",
    category: "frontend",
    stats: { power: 92, speed: 88, defense: 90, intelligence: 89 },
    abilities: ["SSR/SSG", "API Routes", "Image Optimization", "Edge Runtime"],
    description: "The complete React framework for production.",
    experience: 7800,
    level: 39,
    unlocked: true
  },
  {
    id: "nodejs",
    name: "Node.js",
    title: "Async Conjurer",
    emoji: "🟢",
    rarity: "epic",
    category: "backend",
    stats: { power: 85, speed: 90, defense: 80, intelligence: 87 },
    abilities: ["Event Loop", "Stream Processing", "NPM Ecosystem", "Microservices"],
    description: "JavaScript runtime built on Chrome's V8 engine.",
    experience: 7100,
    level: 36,
    unlocked: true
  },
  {
    id: "rust",
    name: "Rust",
    title: "Memory Sentinel",
    emoji: "🦀",
    rarity: "legendary",
    category: "backend",
    stats: { power: 98, speed: 85, defense: 100, intelligence: 96 },
    abilities: ["Memory Safety", "Zero-cost Abstractions", "Concurrency", "Pattern Matching"],
    description: "Systems programming with fearless concurrency.",
    experience: 2400,
    level: 18,
    unlocked: true
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    title: "Data Architect",
    emoji: "🐘",
    rarity: "epic",
    category: "backend",
    stats: { power: 82, speed: 78, defense: 95, intelligence: 90 },
    abilities: ["ACID Compliance", "JSON Support", "Window Functions", "Full-text Search"],
    description: "The world's most advanced open source relational database.",
    experience: 5800,
    level: 32,
    unlocked: true
  },
  {
    id: "docker",
    name: "Docker",
    title: "Container Captain",
    emoji: "🐳",
    rarity: "rare",
    category: "devops",
    stats: { power: 78, speed: 85, defense: 88, intelligence: 82 },
    abilities: ["Containerization", "Image Building", "Compose", "Multi-stage Builds"],
    description: "OS-level virtualization to deliver software in packages called containers.",
    experience: 4200,
    level: 26,
    unlocked: true
  },
  {
    id: "aws",
    name: "AWS",
    title: "Cloud Commander",
    emoji: "☁️",
    rarity: "epic",
    category: "devops",
    stats: { power: 90, speed: 82, defense: 85, intelligence: 88 },
    abilities: ["EC2", "Lambda", "S3", "CloudFormation"],
    description: "Comprehensive cloud computing platform.",
    experience: 5100,
    level: 29,
    unlocked: true
  },
  {
    id: "figma",
    name: "Figma",
    title: "Pixel Perfectionist",
    emoji: "🎨",
    rarity: "rare",
    category: "design",
    stats: { power: 72, speed: 88, defense: 70, intelligence: 85 },
    abilities: ["Vector Networks", "Auto Layout", "Components", "Prototyping"],
    description: "Collaborative interface design tool.",
    experience: 3600,
    level: 22,
    unlocked: true
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    title: "Logic Weaver",
    emoji: "🧩",
    rarity: "legendary",
    category: "soft",
    stats: { power: 95, speed: 88, defense: 85, intelligence: 98 },
    abilities: ["Algorithm Design", "Pattern Recognition", "Debugging", "Optimization"],
    description: "The art of breaking down complex problems into manageable solutions.",
    experience: 9200,
    level: 45,
    unlocked: true
  },
  {
    id: "communication",
    name: "Communication",
    title: "Team Catalyst",
    emoji: "💬",
    rarity: "epic",
    category: "soft",
    stats: { power: 75, speed: 82, defense: 80, intelligence: 92 },
    abilities: ["Technical Writing", "Code Reviews", "Mentoring", "Presentations"],
    description: "Bridging the gap between technical and non-technical stakeholders.",
    experience: 6800,
    level: 34,
    unlocked: true
  },
  {
    id: "go",
    name: "Go",
    title: "Gopher General",
    emoji: "🐹",
    rarity: "rare",
    category: "backend",
    stats: { power: 85, speed: 95, defense: 82, intelligence: 80 },
    abilities: ["Goroutines", "Channels", "Fast Compilation", "Static Typing"],
    description: "Statically typed, compiled language designed at Google.",
    experience: 1800,
    level: 15,
    unlocked: false,
    unlockRequirement: "Complete 5 backend projects"
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    title: "Orchestration Overlord",
    emoji: "☸️",
    rarity: "legendary",
    category: "devops",
    stats: { power: 95, speed: 78, defense: 92, intelligence: 94 },
    abilities: ["Pod Management", "Auto-scaling", "Service Discovery", "Rolling Updates"],
    description: "Automating deployment, scaling, and management of containerized applications.",
    experience: 1200,
    level: 12,
    unlocked: false,
    unlockRequirement: "Master Docker first"
  },
  {
    id: "threejs",
    name: "Three.js",
    title: "3D Wizard",
    emoji: "🎲",
    rarity: "epic",
    category: "frontend",
    stats: { power: 88, speed: 72, defense: 75, intelligence: 90 },
    abilities: ["WebGL", "Shaders", "Animations", "Scene Graph"],
    description: "Cross-browser JavaScript library used to create 3D graphics.",
    experience: 2100,
    level: 14,
    unlocked: false,
    unlockRequirement: "Strong math fundamentals"
  }
];

const rarityColors = {
  common: { bg: "#6b7280", gradient: "from-gray-500 to-gray-600" },
  rare: { bg: "#3b82f6", gradient: "from-blue-500 to-blue-600" },
  epic: { bg: "#a855f7", gradient: "from-purple-500 to-purple-600" },
  legendary: { bg: "#f59e0b", gradient: "from-amber-500 to-orange-500" }
};

const categoryIcons = {
  frontend: Zap,
  backend: Shield,
  devops: Target,
  design: Sparkles,
  soft: Brain
};

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function TradingCardsPage() {
  const [selectedCard, setSelectedCard] = useState<SkillCard | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rarity' | 'level' | 'category'>('rarity');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  
  const filteredCards = skillCards
    .filter(card => !filter || card.category === filter || (filter === 'locked' && !card.unlocked))
    .sort((a, b) => {
      if (sortBy === 'rarity') {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      if (sortBy === 'level') return b.level - a.level;
      return 0;
    });
  
  const unlockedCount = skillCards.filter(c => c.unlocked).length;
  const totalPower = skillCards
    .filter(c => c.unlocked)
    .reduce((acc, c) => acc + c.stats.power + c.stats.speed + c.stats.defense + c.stats.intelligence, 0);
  
  const toggleFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
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
            <span className="text-sm font-medium">Collectible Skills</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Skill <span className="text-gradient">Trading Cards</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Collect, upgrade, and showcase your developer skills.
            Each card represents a unique ability in your arsenal.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Cards Collected", value: `${unlockedCount}/${skillCards.length}`, icon: Star },
            { label: "Total Power", value: totalPower.toLocaleString(), icon: Zap },
            { label: "Legendary", value: skillCards.filter(c => c.rarity === 'legendary' && c.unlocked).length, icon: Trophy },
            { label: "Avg Level", value: Math.round(skillCards.filter(c => c.unlocked).reduce((a, c) => a + c.level, 0) / unlockedCount || 0), icon: Target }
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            {['frontend', 'backend', 'devops', 'design', 'soft'].map(cat => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
            <Button
              variant={filter === 'locked' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('locked')}
            >
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="rarity">Sort by Rarity</option>
              <option value="level">Sort by Level</option>
              <option value="category">Sort by Category</option>
            </select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
            >
              {viewMode === 'grid' ? <Shuffle className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCards.map((card, index) => {
                const isFlipped = flippedCards.has(card.id);
                const rarityColor = rarityColors[card.rarity];
                const CategoryIcon = categoryIcons[card.category];
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => card.unlocked && setSelectedCard(card)}
                    className="cursor-pointer group perspective-1000"
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="relative preserve-3d"
                    >
                      {/* Card Front */}
                      <Card className={`relative overflow-hidden transition-all duration-300 ${
                        card.unlocked 
                          ? 'hover:shadow-xl hover:-translate-y-2' 
                          : 'opacity-60 grayscale'
                      }`}>
                        {/* Rarity Banner */}
                        <div 
                          className={`h-1 bg-gradient-to-r ${rarityColor.gradient}`}
                        />
                        
                        <CardContent className="p-5">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="text-4xl"
                                style={{ filter: card.unlocked ? 'none' : 'grayscale(100%)' }}
                              >
                                {card.unlocked ? card.emoji : "🔒"}
                              </div>
                              <div>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: `${rarityColor.bg}30`,
                                    color: rarityColor.bg 
                                  }}
                                >
                                  {card.rarity}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Lv.{card.level}
                                </p>
                              </div>
                            </div>
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          {/* Name & Title */}
                          <h3 className="font-bold text-lg mb-1">{card.name}</h3>
                          <p className="text-xs text-muted-foreground mb-4">{card.title}</p>
                          
                          {/* Stats Preview */}
                          <div className="space-y-2 mb-4">
                            <StatBar label="PWR" value={card.stats.power} color={rarityColor.bg} />
                            <StatBar label="SPD" value={card.stats.speed} color="#3b82f6" />
                          </div>
                          
                          {/* XP Bar */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">XP</span>
                              <span>{card.experience.toLocaleString()}</span>
                            </div>
                            <Progress value={(card.experience % 1000) / 10} className="h-1" />
                          </div>
                          
                          {/* Locked Overlay */}
                          
                          {!card.unlocked && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <div className="text-center">
                                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground px-4">
                                  {card.unlockRequirement}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <>
              {/* Carousel View */}
              <>
                {/* ... carousel implementation ... */}
              </>
            </>
          )}
        </AnimatePresence>

        {/* Card Detail Dialog */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-2xl">
            {selectedCard && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span className="text-4xl">{selectedCard.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedCard.name}
                        <Badge 
                          style={{ 
                            backgroundColor: rarityColors[selectedCard.rarity].bg,
                            color: 'white'
                          }}
                        >
                          {selectedCard.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedCard.title}</p>
                    </div>
                  </DialogTitle>
                  <DialogDescription>{selectedCard.description}</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Stats
                    </h4>
                    <StatBar label="Power" value={selectedCard.stats.power} color="#ef4444" />
                    <StatBar label="Speed" value={selectedCard.stats.speed} color="#3b82f6" />
                    <StatBar label="Defense" value={selectedCard.stats.defense} color="#22c55e" />
                    <StatBar label="Intelligence" value={selectedCard.stats.intelligence} color="#a855f7" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4" /> Abilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.abilities.map(ability => (
                        <Badge key={ability} variant="secondary">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Level {selectedCard.level}</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedCard.experience.toLocaleString()} XP
                        </span>
                      </div>
                      <Progress value={(selectedCard.experience % 1000) / 10} />
                      <p className="text-xs text-muted-foreground mt-2">
                        {(1000 - (selectedCard.experience % 1000)).toLocaleString()} XP to next level
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Missing import
import { LayoutGrid } from "lucide-react";
