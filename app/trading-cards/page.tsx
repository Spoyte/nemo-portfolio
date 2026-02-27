"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Code2,
  Palette,
  Database,
  Cloud,
  Shield,
  Cpu,
  Globe,
  Smartphone,
  Layers,
  Box,
  GitBranch,
  Terminal,
  Star,
  Trophy,
  Lock,
  Unlock,
  Share2,
  RotateCcw,
  Shuffle,
  Filter,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Award,
  Target,
  Flame,
  Crown,
  Gem,
  Sword,
  ShieldCheck,
  Heart,
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Card rarity types
 type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

// Card interface
interface SkillCard {
  id: string;
  name: string;
  description: string;
  category: "frontend" | "backend" | "design" | "devops" | "tools";
  rarity: Rarity;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  stats: {
    power: number;
    speed: number;
    versatility: number;
  };
  abilities: string[];
  unlocked: boolean;
  unlockDate?: string;
  projectsUsed: number;
}

// Rarity configuration
const rarityConfig: Record<Rarity, {
  label: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  probability: number;
}> = {
  common: {
    label: "Common",
    color: "text-gray-400",
    bgGradient: "from-gray-500/20 to-gray-600/20",
    borderColor: "border-gray-400/50",
    glowColor: "shadow-gray-500/20",
    probability: 50
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-600/20",
    borderColor: "border-blue-400/50",
    glowColor: "shadow-blue-500/30",
    probability: 30
  },
  epic: {
    label: "Epic",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-600/20",
    borderColor: "border-purple-400/50",
    glowColor: "shadow-purple-500/40",
    probability: 15
  },
  legendary: {
    label: "Legendary",
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-600/20",
    borderColor: "border-orange-400/50",
    glowColor: "shadow-orange-500/50",
    probability: 4
  },
  mythic: {
    label: "Mythic",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 via-amber-500/20 to-orange-600/20",
    borderColor: "border-yellow-400/50",
    glowColor: "shadow-yellow-500/60",
    probability: 1
  }
};

// Initial card collection
const initialCards: SkillCard[] = [
  {
    id: "react",
    name: "React Master",
    description: "Component-based UI architecture with hooks and modern patterns",
    category: "frontend",
    rarity: "legendary",
    level: 8,
    maxLevel: 10,
    xp: 750,
    xpToNext: 1000,
    icon: <Code2 className="w-6 h-6" />,
    color: "#61DAFB",
    gradient: "from-[#61DAFB]/30 to-[#282c34]/30",
    stats: { power: 95, speed: 90, versatility: 85 },
    abilities: ["Virtual DOM", "Hooks Mastery", "Context API", "Suspense"],
    unlocked: true,
    unlockDate: "2023-01-15",
    projectsUsed: 24
  },
  {
    id: "typescript",
    name: "TypeScript Wizard",
    description: "Type-safe JavaScript with advanced type patterns",
    category: "frontend",
    rarity: "epic",
    level: 7,
    maxLevel: 10,
    xp: 620,
    xpToNext: 800,
    icon: <Terminal className="w-6 h-6" />,
    color: "#3178C6",
    gradient: "from-[#3178C6]/30 to-[#235a97]/30",
    stats: { power: 88, speed: 75, versatility: 95 },
    abilities: ["Generic Types", "Type Guards", "Mapped Types", "Conditional Types"],
    unlocked: true,
    unlockDate: "2023-03-20",
    projectsUsed: 18
  },
  {
    id: "nextjs",
    name: "Next.js Architect",
    description: "Full-stack React framework with SSR and SSG",
    category: "frontend",
    rarity: "legendary",
    level: 6,
    maxLevel: 10,
    xp: 480,
    xpToNext: 700,
    icon: <Globe className="w-6 h-6" />,
    color: "#000000",
    gradient: "from-gray-700/30 to-black/30",
    stats: { power: 92, speed: 88, versatility: 90 },
    abilities: ["App Router", "Server Components", "Edge Runtime", "Image Optimization"],
    unlocked: true,
    unlockDate: "2023-02-10",
    projectsUsed: 15
  },
  {
    id: "tailwind",
    name: "Tailwind Artisan",
    description: "Utility-first CSS with custom design systems",
    category: "design",
    rarity: "epic",
    level: 9,
    maxLevel: 10,
    xp: 890,
    xpToNext: 900,
    icon: <Palette className="w-6 h-6" />,
    color: "#06B6D4",
    gradient: "from-[#06B6D4]/30 to-[#0891B2]/30",
    stats: { power: 85, speed: 98, versatility: 80 },
    abilities: ["Custom Config", "Plugin Development", "Dark Mode", "JIT Engine"],
    unlocked: true,
    unlockDate: "2023-01-20",
    projectsUsed: 28
  },
  {
    id: "nodejs",
    name: "Node.js Veteran",
    description: "Server-side JavaScript runtime environment",
    category: "backend",
    rarity: "legendary",
    level: 7,
    maxLevel: 10,
    xp: 680,
    xpToNext: 800,
    icon: <Zap className="w-6 h-6" />,
    color: "#339933",
    gradient: "from-[#339933]/30 to-[#215732]/30",
    stats: { power: 90, speed: 85, versatility: 88 },
    abilities: ["Event Loop", "Streams", "Clustering", "Native Addons"],
    unlocked: true,
    unlockDate: "2022-11-05",
    projectsUsed: 20
  },
  {
    id: "postgresql",
    name: "PostgreSQL Sage",
    description: "Advanced relational database management",
    category: "backend",
    rarity: "epic",
    level: 6,
    maxLevel: 10,
    xp: 520,
    xpToNext: 700,
    icon: <Database className="w-6 h-6" />,
    color: "#336791",
    gradient: "from-[#336791]/30 to-[#2b5579]/30",
    stats: { power: 88, speed: 70, versatility: 85 },
    abilities: ["Complex Queries", "Indexing", "JSON Operations", "Full-text Search"],
    unlocked: true,
    unlockDate: "2023-04-12",
    projectsUsed: 12
  },
  {
    id: "docker",
    name: "Docker Captain",
    description: "Containerization and orchestration platform",
    category: "devops",
    rarity: "rare",
    level: 5,
    maxLevel: 10,
    xp: 380,
    xpToNext: 600,
    icon: <Box className="w-6 h-6" />,
    color: "#2496ED",
    gradient: "from-[#2496ED]/30 to-[#1a7bc8]/30",
    stats: { power: 82, speed: 75, versatility: 90 },
    abilities: ["Multi-stage Builds", "Compose", "Networking", "Volumes"],
    unlocked: true,
    unlockDate: "2023-05-18",
    projectsUsed: 8
  },
  {
    id: "aws",
    name: "Cloud Navigator",
    description: "Amazon Web Services cloud infrastructure",
    category: "devops",
    rarity: "epic",
    level: 4,
    maxLevel: 10,
    xp: 290,
    xpToNext: 500,
    icon: <Cloud className="w-6 h-6" />,
    color: "#FF9900",
    gradient: "from-[#FF9900]/30 to-[#cc7a00]/30",
    stats: { power: 85, speed: 70, versatility: 92 },
    abilities: ["EC2", "S3", "Lambda", "CloudFormation"],
    unlocked: true,
    unlockDate: "2023-06-22",
    projectsUsed: 6
  },
  {
    id: "graphql",
    name: "GraphQL Engineer",
    description: "Query language for APIs with type system",
    category: "backend",
    rarity: "rare",
    level: 5,
    maxLevel: 10,
    xp: 420,
    xpToNext: 600,
    icon: <GitBranch className="w-6 h-6" />,
    color: "#E10098",
    gradient: "from-[#E10098]/30 to-[#b3007a]/30",
    stats: { power: 80, speed: 85, versatility: 82 },
    abilities: ["Schema Design", "Resolvers", "Subscriptions", "Federation"],
    unlocked: true,
    unlockDate: "2023-03-08",
    projectsUsed: 9
  },
  {
    id: "figma",
    name: "Figma Designer",
    description: "Collaborative interface design tool",
    category: "design",
    rarity: "rare",
    level: 6,
    maxLevel: 10,
    xp: 480,
    xpToNext: 650,
    icon: <Layers className="w-6 h-6" />,
    color: "#F24E1E",
    gradient: "from-[#F24E1E]/30 to-[#c43a12]/30",
    stats: { power: 75, speed: 90, versatility: 80 },
    abilities: ["Auto Layout", "Components", "Prototyping", "Design Systems"],
    unlocked: true,
    unlockDate: "2023-02-28",
    projectsUsed: 14
  },
  {
    id: "rust",
    name: "Rust Warrior",
    description: "Systems programming with memory safety",
    category: "backend",
    rarity: "mythic",
    level: 3,
    maxLevel: 10,
    xp: 180,
    xpToNext: 400,
    icon: <Shield className="w-6 h-6" />,
    color: "#DEA584",
    gradient: "from-[#DEA584]/30 to-[#c48a6a]/30",
    stats: { power: 98, speed: 70, versatility: 75 },
    abilities: ["Ownership", "Borrowing", "Lifetimes", "Unsafe Blocks"],
    unlocked: false,
    projectsUsed: 0
  },
  {
    id: "kubernetes",
    name: "K8s Commander",
    description: "Container orchestration at scale",
    category: "devops",
    rarity: "mythic",
    level: 2,
    maxLevel: 10,
    xp: 120,
    xpToNext: 350,
    icon: <Cpu className="w-6 h-6" />,
    color: "#326CE5",
    gradient: "from-[#326CE5]/30 to-[#2854b8]/30",
    stats: { power: 95, speed: 65, versatility: 90 },
    abilities: ["Pods", "Services", "Deployments", "Ingress"],
    unlocked: false,
    projectsUsed: 0
  },
  {
    id: "react-native",
    name: "Mobile Dev",
    description: "Cross-platform mobile development",
    category: "frontend",
    rarity: "rare",
    level: 4,
    maxLevel: 10,
    xp: 320,
    xpToNext: 500,
    icon: <Smartphone className="w-6 h-6" />,
    color: "#61DAFB",
    gradient: "from-[#61DAFB]/30 to-[#282c34]/30",
    stats: { power: 82, speed: 80, versatility: 88 },
    abilities: ["Native Modules", "Navigation", "Platform APIs", "Hermes"],
    unlocked: false,
    projectsUsed: 0
  },
  {
    id: "threejs",
    name: "3D Artist",
    description: "WebGL-based 3D graphics library",
    category: "frontend",
    rarity: "epic",
    level: 3,
    maxLevel: 10,
    xp: 210,
    xpToNext: 450,
    icon: <Box className="w-6 h-6" />,
    color: "#000000",
    gradient: "from-gray-600/30 to-black/30",
    stats: { power: 88, speed: 65, versatility: 75 },
    abilities: ["Scenes", "Materials", "Lighting", "Animations"],
    unlocked: false,
    projectsUsed: 0
  },
  {
    id: "go",
    name: "Go Conductor",
    description: "Concurrent systems programming",
    category: "backend",
    rarity: "epic",
    level: 3,
    maxLevel: 10,
    xp: 195,
    xpToNext: 400,
    icon: <Zap className="w-6 h-6" />,
    color: "#00ADD8",
    gradient: "from-[#00ADD8]/30 to-[#008cb3]/30",
    stats: { power: 90, speed: 95, versatility: 70 },
    abilities: ["Goroutines", "Channels", "Interfaces", "Modules"],
    unlocked: false,
    projectsUsed: 0
  }
];

// Category config
const categoryConfig = {
  frontend: { label: "Frontend", icon: Code2, color: "text-blue-400" },
  backend: { label: "Backend", icon: Database, color: "text-green-400" },
  design: { label: "Design", icon: Palette, color: "text-purple-400" },
  devops: { label: "DevOps", icon: Cloud, color: "text-orange-400" },
  tools: { label: "Tools", icon: Terminal, color: "text-gray-400" }
};

// Card Component
function TradingCard({ 
  card, 
  onClick, 
  isFlipped = false,
  isNew = false
}: { 
  card: SkillCard; 
  onClick?: () => void;
  isFlipped?: boolean;
  isNew?: boolean;
}) {
  const rarity = rarityConfig[card.rarity];
  const CategoryIcon = categoryConfig[card.category].icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
              relative cursor-pointer group
              ${isNew ? "animate-pulse" : ""}
            `}
          >
            {/* Card Glow */}
            <div className={`
              absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity
              bg-gradient-to-r ${card.gradient}
            `} />
            
            {/* Card */}
            <div className={`
              relative rounded-xl overflow-hidden
              bg-gradient-to-br ${rarity.bgGradient}
              border-2 ${rarity.borderColor}
              ${card.unlocked ? "" : "opacity-60 grayscale"}
              transition-all duration-300
              hover:shadow-lg hover:${rarity.glowColor}
            `}>
              {/* Rarity Banner */}
              <div className={`
                absolute top-0 left-0 right-0 h-1
                bg-gradient-to-r ${rarity.bgGradient}
              `} />
              
              {/* Card Header */}
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    bg-gradient-to-br ${card.gradient}
                    ${card.unlocked ? "" : "bg-gray-500"}
                  `}
                  style={{ color: card.unlocked ? card.color : "#666" }}
                  >
                    {card.unlocked ? card.icon : <Lock className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className={`text-xs ${rarity.color} border-current`}>
                      {rarity.label}
                    </Badge>
                    <div className="flex items-center gap-1 mt-1">
                      <CategoryIcon className={`w-3 h-3 ${categoryConfig[card.category].color}`} />
                      <span className="text-[10px] text-muted-foreground">
                        {categoryConfig[card.category].label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold mt-3 text-sm">{card.name}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                  {card.description}
                </p>
              </div>
              
              {/* Stats */}
              {card.unlocked && (
                <div className="px-4 py-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <Sword className="w-3 h-3 mx-auto text-red-400" />
                      <p className="text-[10px] font-bold">{card.stats.power}</p>
                    </div>
                    <div>
                      <Zap className="w-3 h-3 mx-auto text-yellow-400" />
                      <p className="text-[10px] font-bold">{card.stats.speed}</p>
                    </div>
                    <div>
                      <ShieldCheck className="w-3 h-3 mx-auto text-blue-400" />
                      <p className="text-[10px] font-bold">{card.stats.versatility}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Level & XP */}
              {card.unlocked && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-medium">Level {card.level}</span>
                    <span className="text-muted-foreground">{card.xp}/{card.xpToNext} XP</span>
                  </div>
                  <Progress value={(card.xp / card.xpToNext) * 100} className="h-1" />
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                    <Target className="w-3 h-3" />
                    <span>{card.projectsUsed} projects</span>
                  </div>
                </div>
              )}
              
              {/* Locked Overlay */}
              {!card.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-white/50" />
                    <p className="text-xs text-white/70">Locked</p>
                  </div>
                </div>
              )}
              
              {/* New Badge */}
              {isNew && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge className="bg-yellow-500 text-black font-bold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NEW!
                  </Badge>
                </motion.div>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold">{card.name}</p>
          <p className="text-xs text-muted-foreground">{card.description}</p>
          {card.unlocked && (
            <div className="mt-2">
              <p className="text-xs font-medium">Abilities:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {card.abilities.slice(0, 3).map(ability => (
                  <Badge key={ability} variant="secondary" className="text-[10px]">{ability}</Badge>
                ))}
              </div>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Card Detail Modal
function CardDetailModal({ card, isOpen, onClose }: { card: SkillCard | null; isOpen: boolean; onClose: () => void }) {
  if (!card) return null;
  
  const rarity = rarityConfig[card.rarity];
  const CategoryIcon = categoryConfig[card.category].icon;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              bg-gradient-to-br ${card.gradient}
            `}
            style={{ color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{card.name}</h2>
              <div className="flex items-center gap-2">
                <Badge className={`${rarity.color} border-current`}>{rarity.label}</Badge>
                <Badge variant="outline">
                  <CategoryIcon className={`w-3 h-3 mr-1 ${categoryConfig[card.category].color}`} />
                  {categoryConfig[card.category].label}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">{card.description}</p>
          
          {card.unlocked ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Sword className="w-6 h-6 mx-auto mb-2 text-red-400" />
                    <p className="text-3xl font-bold">{card.stats.power}</p>
                    <p className="text-xs text-muted-foreground">Power</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <p className="text-3xl font-bold">{card.stats.speed}</p>
                    <p className="text-xs text-muted-foreground">Speed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-3xl font-bold">{card.stats.versatility}</p>
                    <p className="text-xs text-muted-foreground">Versatility</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Level Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Level {card.level} / {card.maxLevel}</span>
                  <span className="text-sm text-muted-foreground">{card.xp} / {card.xpToNext} XP</span>
                </div>
                <Progress value={(card.xp / card.xpToNext) * 100} className="h-2" />
              </div>
              
              {/* Abilities */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Abilities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {card.abilities.map((ability, i) => (
                    <motion.div
                      key={ability}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{ability}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Usage Stats */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <span>Projects Used</span>
                </div>
                <span className="text-2xl font-bold">{card.projectsUsed}</span>
              </div>
            </>
          ) : (
            <div className="text-center p-8 rounded-lg bg-muted">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Card Locked</p>
              <p className="text-muted-foreground">Complete related projects to unlock this card</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Pack Opening Animation
function PackOpening({ onComplete }: { onComplete: (card: SkillCard) => void }) {
  const [stage, setStage] = useState<"closed" | "opening" | "revealed">("closed");
  const [revealedCard, setRevealedCard] = useState<SkillCard | null>(null);

  useEffect(() => {
    // Determine rarity based on probability
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedRarity: Rarity = "common";
    
    for (const [rarity, config] of Object.entries(rarityConfig)) {
      cumulative += config.probability;
      if (rand <= cumulative) {
        selectedRarity = rarity as Rarity;
        break;
      }
    }
    
    // Get random locked card of that rarity
    const lockedCards = initialCards.filter(c => !c.unlocked && c.rarity === selectedRarity);
    const card = lockedCards.length > 0 
      ? lockedCards[Math.floor(Math.random() * lockedCards.length)]
      : initialCards.find(c => !c.unlocked) || initialCards[0];
    
    setRevealedCard(card);
    
    // Animation sequence
    setTimeout(() => setStage("opening"), 500);
    setTimeout(() => {
      setStage("revealed");
      onComplete(card);
    }, 2000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {stage === "closed" && (
          <motion.div
            key="pack"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="relative"
          >
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-1">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Gem className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-pulse" />
                  <p className="font-bold text-lg">Skill Pack</p>
                  <p className="text-sm text-muted-foreground">Opening...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1,
              rotateY: [0, 180, 360]
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-64 h-80 rounded-2xl bg-gradient-to-br from-yellow-400/50 via-transparent to-yellow-400/50 animate-pulse" />
          </motion.div>
        )}
        
        {stage === "revealed" && revealedCard && (
          <motion.div
            key="revealed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <TradingCard card={revealedCard} isNew={true} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <Button onClick={() => onComplete(revealedCard)} size="lg">
                Claim Card
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TradingCardsPage() {
  const [cards, setCards] = useState<SkillCard[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<SkillCard | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [filter, setFilter] = useState<"all" | SkillCard["category"]>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rarity" | "level" | "name">("rarity");

  // Stats
  const stats = {
    total: cards.length,
    unlocked: cards.filter(c => c.unlocked).length,
    legendary: cards.filter(c => c.rarity === "legendary" && c.unlocked).length,
    mythic: cards.filter(c => c.rarity === "mythic" && c.unlocked).length,
    totalXP: cards.reduce((acc, c) => acc + (c.unlocked ? c.xp : 0), 0),
    avgLevel: cards.filter(c => c.unlocked).reduce((acc, c) => acc + c.level, 0) / cards.filter(c => c.unlocked).length || 0
  };

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => filter === "all" || card.category === filter)
    .filter(card => 
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rarity") {
        const rarityOrder = ["mythic", "legendary", "epic", "rare", "common"];
        return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
      }
      if (sortBy === "level") return b.level - a.level;
      return a.name.localeCompare(b.name);
    });

  const handleOpenPack = () => {
    setIsOpeningPack(true);
  };

  const handlePackComplete = (newCard: SkillCard) => {
    setCards(prev => prev.map(c => 
      c.id === newCard.id ? { ...c, unlocked: true, unlockDate: new Date().toISOString() } : c
    ));
    setIsOpeningPack(false);
    setSelectedCard({ ...newCard, unlocked: true });
    setIsDetailOpen(true);
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Collectible Skills</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Skill <span className="text-gradient">Trading Cards</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Collect, level up, and showcase your developer skills. Each card represents 
            a technology mastered on your journey.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{stats.unlocked}/{stats.total}</p>
              <p className="text-xs text-muted-foreground">Cards Collected</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{stats.legendary}</p>
              <p className="text-xs text-muted-foreground">Legendary</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
            <CardContent className="p-4 text-center">
              <Gem className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold">{stats.mythic}</p>
              <p className="text-xs text-muted-foreground">Mythic</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{stats.avgLevel.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avg Level</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as SkillCard["category"])}
              >
                <config.icon className={`w-3 h-3 mr-1 ${config.color}`} />
                {config.label}
              </Button>
            ))}
          </div>
          
          {/* Sort & View */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleOpenPack}>
              <Sparkles className="h-4 w-4 mr-1" />
              Open Pack
            </Button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`
            ${viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
              : "space-y-2"
            }
          `}
        >
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <TradingCard
                  card={card}
                  onClick={() => {
                    setSelectedCard(card);
                    setIsDetailOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        <{filteredCards.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No cards found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Pack Opening */}
      <{isOpeningPack && (
        <PackOpening onComplete={handlePackComplete} />
      )}
    </div>
  );
}
