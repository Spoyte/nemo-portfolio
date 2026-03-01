"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Sword, 
  Brain, 
  Heart, 
  Star,
  Trophy,
  Target,
  Flame,
  Snowflake,
  Wind,
  Mountain,
  Droplets,
  Sun,
  Moon,
  RotateCcw,
  Share2,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Crown,
  Gem,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Trading Card Types
interface SkillCard {
  id: string;
  name: string;
  title: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  element: 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'neutral';
  type: 'language' | 'framework' | 'tool' | 'concept' | 'soft-skill';
  level: number;
  maxLevel: number;
  experience: number;
  stats: {
    power: number;
    defense: number;
    speed: number;
    wisdom: number;
  };
  abilities: string[];
  description: string;
  quote: string;
  yearLearned: number;
  projects: number;
  icon: string;
  color: string;
  gradient: string;
  holographic: boolean;
}

// Card Collection
const skillCards: SkillCard[] = [
  {
    id: "typescript",
    name: "TypeScript",
    title: "The Type Guardian",
    rarity: "legendary",
    element: "light",
    type: "language",
    level: 95,
    maxLevel: 100,
    experience: 9500,
    stats: { power: 92, defense: 98, speed: 85, wisdom: 94 },
    abilities: ["Type Safety", "IntelliSense", "Refactoring", "Compile-time Checks"],
    description: "A superset of JavaScript that adds static typing. The guardian of code quality prevents runtime errors before they happen.",
    quote: "With great types comes great reliability.",
    yearLearned: 2019,
    projects: 47,
    icon: "📘",
    color: "#3178C6",
    gradient: "from-blue-600 to-blue-400",
    holographic: true
  },
  {
    id: "react",
    name: "React",
    title: "The Component Weaver",
    rarity: "legendary",
    element: "air",
    type: "framework",
    level: 96,
    maxLevel: 100,
    experience: 9600,
    stats: { power: 94, defense: 88, speed: 96, wisdom: 90 },
    abilities: ["Virtual DOM", "Hooks", "Context API", "Suspense"],
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces. Master of component composition.",
    quote: "Think in components, build in harmony.",
    yearLearned: 2018,
    projects: 52,
    icon: "⚛️",
    color: "#61DAFB",
    gradient: "from-cyan-500 to-blue-500",
    holographic: true
  },
  {
    id: "nextjs",
    name: "Next.js",
    title: "The Full-Stack Knight",
    rarity: "legendary",
    element: "dark",
    type: "framework",
    level: 92,
    maxLevel: 100,
    experience: 9200,
    stats: { power: 96, defense: 90, speed: 94, wisdom: 88 },
    abilities: ["SSR", "Static Generation", "API Routes", "Edge Runtime"],
    description: "The React Framework for the Web. Combines server-side rendering with static site generation for optimal performance.",
    quote: "Server or client? Why not both?",
    yearLearned: 2020,
    projects: 28,
    icon: "▲",
    color: "#000000",
    gradient: "from-slate-800 to-slate-600",
    holographic: true
  },
  {
    id: "nodejs",
    name: "Node.js",
    title: "The Runtime Emperor",
    rarity: "epic",
    element: "earth",
    type: "tool",
    level: 88,
    maxLevel: 100,
    experience: 8800,
    stats: { power: 90, defense: 85, speed: 88, wisdom: 86 },
    abilities: ["Event Loop", "Streams", "Clustering", "NPM Ecosystem"],
    description: "JavaScript runtime built on Chrome's V8 engine. Brings JavaScript to the server with non-blocking I/O.",
    quote: "JavaScript everywhere, limitations nowhere.",
    yearLearned: 2018,
    projects: 35,
    icon: "🟢",
    color: "#339933",
    gradient: "from-green-600 to-green-400",
    holographic: false
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    title: "The Style Sorcerer",
    rarity: "epic",
    element: "wind",
    type: "tool",
    level: 94,
    maxLevel: 100,
    experience: 9400,
    stats: { power: 85, defense: 92, speed: 98, wisdom: 82 },
    abilities: ["Utility-first", "Responsive", "Dark Mode", "JIT Compiler"],
    description: "A utility-first CSS framework for rapidly building custom designs without leaving your HTML.",
    quote: "Style at the speed of thought.",
    yearLearned: 2020,
    projects: 41,
    icon: "🌊",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-teal-400",
    holographic: false
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    title: "The Data Keeper",
    rarity: "epic",
    element: "water",
    type: "tool",
    level: 82,
    maxLevel: 100,
    experience: 8200,
    stats: { power: 88, defense: 96, speed: 78, wisdom: 92 },
    abilities: ["ACID Compliance", "JSON Support", "Full-text Search", "Extensions"],
    description: "Advanced open-source relational database. The reliable guardian of structured data.",
    quote: "Your data is safe with me.",
    yearLearned: 2019,
    projects: 23,
    icon: "🐘",
    color: "#336791",
    gradient: "from-blue-700 to-blue-500",
    holographic: false
  },
  {
    id: "rust",
    name: "Rust",
    title: "The Memory Guardian",
    rarity: "legendary",
    element: "fire",
    type: "language",
    level: 75,
    maxLevel: 100,
    experience: 7500,
    stats: { power: 98, defense: 96, speed: 94, wisdom: 88 },
    abilities: ["Memory Safety", "Zero-cost Abstractions", "Concurrency", "Pattern Matching"],
    description: "A language empowering everyone to build reliable and efficient software. Fearless concurrency without garbage collection.",
    quote: "Fearless concurrency, guaranteed safety.",
    yearLearned: 2022,
    projects: 8,
    icon: "🦀",
    color: "#DEA584",
    gradient: "from-orange-600 to-red-500",
    holographic: true
  },
  {
    id: "graphql",
    name: "GraphQL",
    title: "The Query Mystic",
    rarity: "rare",
    element: "air",
    type: "concept",
    level: 86,
    maxLevel: 100,
    experience: 8600,
    stats: { power: 88, defense: 80, speed: 92, wisdom: 90 },
    abilities: ["Precise Queries", "Type System", "Introspection", "Subscriptions"],
    description: "A query language for APIs and a runtime for fulfilling those queries with your existing data.",
    quote: "Ask for exactly what you need, nothing more.",
    yearLearned: 2020,
    projects: 15,
    icon: "◈",
    color: "#E10098",
    gradient: "from-pink-600 to-pink-400",
    holographic: false
  },
  {
    id: "docker",
    name: "Docker",
    title: "The Container Captain",
    rarity: "rare",
    element: "water",
    type: "tool",
    level: 84,
    maxLevel: 100,
    experience: 8400,
    stats: { power: 86, defense: 90, speed: 88, wisdom: 84 },
    abilities: ["Containerization", "Image Building", "Compose", "Swarm"],
    description: "Platform for developing, shipping, and running applications in containers.",
    quote: "It works on my machine... and yours too!",
    yearLearned: 2019,
    projects: 31,
    icon: "🐳",
    color: "#2496ED",
    gradient: "from-blue-500 to-cyan-400",
    holographic: false
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    title: "The Logic Master",
    rarity: "mythic",
    element: "neutral",
    type: "soft-skill",
    level: 93,
    maxLevel: 100,
    experience: 9300,
    stats: { power: 90, defense: 88, speed: 86, wisdom: 98 },
    abilities: ["Pattern Recognition", "Algorithm Design", "Debugging", "System Thinking"],
    description: "The ultimate skill that transcends all technologies. The ability to break down complex problems into solvable pieces.",
    quote: "Every problem has a solution. Find it.",
    yearLearned: 2017,
    projects: 100,
    icon: "🧩",
    color: "#FFD700",
    gradient: "from-yellow-500 to-amber-400",
    holographic: true
  },
  {
    id: "communication",
    name: "Communication",
    title: "The Bridge Builder",
    rarity: "epic",
    element: "light",
    type: "soft-skill",
    level: 89,
    maxLevel: 100,
    experience: 8900,
    stats: { power: 82, defense: 86, speed: 84, wisdom: 94 },
    abilities: ["Documentation", "Teaching", "Collaboration", "Presentation"],
    description: "The ability to convey complex technical concepts to any audience. Bridges the gap between code and humans.",
    quote: "Code is read more than it's written. Communicate clearly.",
    yearLearned: 2018,
    projects: 100,
    icon: "💬",
    color: "#10B981",
    gradient: "from-emerald-500 to-green-400",
    holographic: false
  },
  {
    id: "creativity",
    name: "Creativity",
    title: "The Innovation Spark",
    rarity: "legendary",
    element: "fire",
    type: "soft-skill",
    level: 91,
    maxLevel: 100,
    experience: 9100,
    stats: { power: 94, defense: 80, speed: 90, wisdom: 88 },
    abilities: ["UI/UX Design", "Animation", "Game Design", "Creative Coding"],
    description: "The spark that transforms functional code into delightful experiences. Thinking outside the box is the default.",
    quote: "Logic will get you from A to B. Imagination will take you everywhere.",
    yearLearned: 2017,
    projects: 100,
    icon: "✨",
    color: "#F472B6",
    gradient: "from-pink-500 to-rose-400",
    holographic: true
  }
];

// Helper functions
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-400';
    case 'rare': return 'text-blue-400 border-blue-400';
    case 'epic': return 'text-purple-400 border-purple-400';
    case 'legendary': return 'text-orange-400 border-orange-400';
    case 'mythic': return 'text-pink-400 border-pink-400';
    default: return 'text-gray-400';
  }
};

const getRarityBg = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20';
    case 'rare': return 'bg-blue-500/20';
    case 'epic': return 'bg-purple-500/20';
    case 'legendary': return 'bg-orange-500/20';
    case 'mythic': return 'bg-pink-500/20';
    default: return 'bg-gray-500/20';
  }
};

const getElementIcon = (element: string) => {
  switch (element) {
    case 'fire': return Flame;
    case 'water': return Droplets;
    case 'earth': return Mountain;
    case 'air': return Wind;
    case 'light': return Sun;
    case 'dark': return Moon;
    default: return Star;
  }
};

// Holographic Card Effect
function HolographicCard({ card, isFlipped, onFlip }: { card: SkillCard; isFlipped: boolean; onFlip: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const rotateX = isHovered ? (mousePosition.y - 0.5) * -20 : 0;
  const rotateY = isHovered ? (mousePosition.x - 0.5) * 20 : 0;

  return (
    <div 
      className="perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full aspect-[3/4] cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Card background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
          
          {/* Holographic effect */}
          {card.holographic && (
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(${135 + (mousePosition.x * 90)}deg, 
                  rgba(255,0,0,0.3) 0%, 
                  rgba(255,255,0,0.3) 25%, 
                  rgba(0,255,0,0.3) 50%, 
                  rgba(0,255,255,0.3) 75%, 
                  rgba(0,0,255,0.3) 100%)`,
                mixBlendMode: 'overlay'
              }}
            />
          )}
          
          {/* Card pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`
            }}
          />
          
          {/* Card content */}
          <div className="relative h-full p-4 flex flex-col text-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <Badge className={`${getRarityBg(card.rarity)} ${getRarityColor(card.rarity).split(' ')[0]} border capitalize`}>
                {card.rarity}
              </Badge>
              <div className="flex items-center gap-1 text-xs">
                {(() => {
                  const Icon = getElementIcon(card.element);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="capitalize">{card.element}</span>
              </div>
            </div>
            
            {/* Icon */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                className="text-8xl drop-shadow-lg"
                animate={{ 
                  rotateY: isHovered ? [0, 10, -10, 0] : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                {card.icon}
              </motion.div>
            </div>
            
            {/* Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{card.name}</h3>
              <p className="text-sm text-white/80 italic">{card.title}</p>
              
              {/* Level */}
              <div className="flex items-center gap-2">
                <span className="text-xs">Lv.{card.level}</span>
                <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(card.level / card.maxLevel) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-1 text-center text-xs">
                <div className="bg-black/20 rounded p-1">
                  <Sword className="w-3 h-3 mx-auto mb-1" />
                  <span>{card.stats.power}</span>
                </div>
                <div className="bg-black/20 rounded p-1">
                  <Shield className="w-3 h-3 mx-auto mb-1" />
                  <span>{card.stats.defense}</span>
                </div>
                <div className="bg-black/20 rounded p-1">
                  <Zap className="w-3 h-3 mx-auto mb-1" />
                  <span>{card.stats.speed}</span>
                </div>
                <div className="bg-black/20 rounded p-1">
                  <Brain className="w-3 h-3 mx-auto mb-1" />
                  <span>{card.stats.wisdom}</span>
                </div>
              </div>
            </div>
            
            {/* Shine effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`
              }}
            />
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden bg-card border-2 border-border p-4"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full flex flex-col">
            <div className={`h-2 bg-gradient-to-r ${card.gradient} rounded-full mb-4`} />
            
            <h4 className="font-bold mb-2">{card.name}</h4>
            
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              {card.description}
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">Abilities</p>
                <div className="flex flex-wrap gap-1">
                  {card.abilities.map(ability => (
                    <Badge key={ability} variant="secondary" className="text-xs">
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                "{card.quote}"
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Since {card.yearLearned}</span>
                <span>{card.projects} projects</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Collection Stats
function CollectionStats() {
  const totalCards = skillCards.length;
  const holographicCards = skillCards.filter(c => c.holographic).length;
  const legendaryCards = skillCards.filter(c => c.rarity === 'legendary').length;
  const averageLevel = Math.round(skillCards.reduce((acc, c) => acc + c.level, 0) / totalCards);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{totalCards}</p>
          <p className="text-xs text-muted-foreground">Total Cards</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">{holographicCards}</p>
          <p className="text-xs text-muted-foreground">Holographic</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Crown className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold">{legendaryCards}</p>
          <p className="text-xs text-muted-foreground">Legendary</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{averageLevel}</p>
          <p className="text-xs text-muted-foreground">Avg Level</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TradingCardsPage() {
  const [selectedCard, setSelectedCard] = useState<SkillCard | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'language' | 'framework' | 'tool' | 'soft-skill'>('all');
  const [sortBy, setSortBy] = useState<'level' | 'rarity' | 'name'>('level');

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredCards = skillCards
    .filter(card => filter === 'all' || card.type === filter)
    .sort((a, b) => {
      if (sortBy === 'level') return b.level - a.level;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Developer Trading Cards</h1>
              <p className="text-muted-foreground">Collect, trade, and level up your skills</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <CollectionStats />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {(['all', 'language', 'framework', 'tool', 'soft-skill'] as const).map(type => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Cards' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 ml-auto">
            <span className="text-sm text-muted-foreground self-center">Sort by:</span>
            {(['level', 'rarity', 'name'] as const).map(s => (
              <Button
                key={s}
                variant={sortBy === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <HolographicCard
                  card={card}
                  isFlipped={flippedCards.has(card.id)}
                  onFlip={() => toggleFlip(card.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">How to Play</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click on any card to flip it and see details</li>
                  <li>• Hover over holographic cards to see the rainbow effect</li>
                  <li>• Cards are ranked by rarity: Common → Rare → Epic → Legendary → Mythic</li>
                  <li>• Each card has unique stats representing real skill levels</li>
                  <li>• Level up by building more projects with each technology</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
