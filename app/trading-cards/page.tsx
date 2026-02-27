"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Sword, 
  Heart, 
  Star,
  Trophy,
  Code2,
  Palette,
  Terminal,
  Database,
  Globe,
  Cpu,
  GitBranch,
  Layers,
  Box,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Sun,
  Moon,
  Target,
  Brain,
  Rocket,
  Gem,
  Crown,
  Medal,
  Award,
  Scroll,
  Shuffle,
  RotateCcw,
  Share2,
  Download,
  Maximize2,
  Info,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Developer card data structure
interface DeveloperCard {
  id: string;
  name: string;
  title: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  element: 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'neutral';
  stats: {
    coding: number;
    design: number;
    problemSolving: number;
    communication: number;
    learning: number;
  };
  skills: Skill[];
  achievements: string[];
  projects: string[];
  quote: string;
  avatar: string;
  holographic: boolean;
  animated: boolean;
}

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  description: string;
  color: string;
}

// Element configurations
const elementConfig = {
  fire: { 
    name: 'Fire', 
    icon: Flame, 
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-500/20',
    text: 'text-orange-500',
    border: 'border-orange-500/50'
  },
  water: { 
    name: 'Water', 
    icon: Droplets, 
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/20',
    text: 'text-blue-500',
    border: 'border-blue-500/50'
  },
  earth: { 
    name: 'Earth', 
    icon: Mountain, 
    color: 'from-green-600 to-emerald-700',
    bg: 'bg-green-500/20',
    text: 'text-green-500',
    border: 'border-green-500/50'
  },
  air: { 
    name: 'Air', 
    icon: Wind, 
    color: 'from-sky-400 to-indigo-500',
    bg: 'bg-sky-500/20',
    text: 'text-sky-500',
    border: 'border-sky-500/50'
  },
  light: { 
    name: 'Light', 
    icon: Sun, 
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-500',
    border: 'border-yellow-500/50'
  },
  dark: { 
    name: 'Dark', 
    icon: Moon, 
    color: 'from-purple-600 to-violet-800',
    bg: 'bg-purple-500/20',
    text: 'text-purple-500',
    border: 'border-purple-500/50'
  },
  neutral: { 
    name: 'Neutral', 
    icon: Target, 
    color: 'from-gray-500 to-slate-600',
    bg: 'bg-gray-500/20',
    text: 'text-gray-500',
    border: 'border-gray-500/50'
  }
};

// Rarity configurations
const rarityConfig = {
  common: { 
    name: 'Common', 
    color: 'from-gray-400 to-gray-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-400/30',
    glow: 'shadow-gray-500/20'
  },
  rare: { 
    name: 'Rare', 
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    glow: 'shadow-blue-500/20'
  },
  epic: { 
    name: 'Epic', 
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20'
  },
  legendary: { 
    name: 'Legendary', 
    color: 'from-orange-400 to-amber-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/30'
  },
  mythic: { 
    name: 'Mythic', 
    color: 'from-pink-500 via-purple-500 to-cyan-500',
    bg: 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/40'
  }
};

// Sample developer cards
const developerCards: DeveloperCard[] = [
  {
    id: '1',
    name: 'Nemo',
    title: 'Full Stack Architect',
    rarity: 'legendary',
    level: 42,
    xp: 8750,
    maxXp: 10000,
    hp: 95,
    maxHp: 100,
    mp: 88,
    maxMp: 100,
    element: 'light',
    stats: {
      coding: 95,
      design: 85,
      problemSolving: 92,
      communication: 88,
      learning: 96
    },
    skills: [
      { name: 'React Mastery', icon: <Code2 className="w-4 h-4" />, level: 95, description: 'Can build anything with React', color: 'text-cyan-400' },
      { name: 'TypeScript Wizard', icon: <Terminal className="w-4 h-4" />, level: 90, description: 'Types everything perfectly', color: 'text-blue-400' },
      { name: 'UI/UX Vision', icon: <Palette className="w-4 h-4" />, level: 85, description: 'Creates beautiful interfaces', color: 'text-pink-400' },
      { name: 'System Design', icon: <Layers className="w-4 h-4" />, level: 88, description: 'Architects scalable systems', color: 'text-purple-400' }
    ],
    achievements: ['100 Days of Code', 'Open Source Hero', 'Bug Slayer', 'Performance Optimizer'],
    projects: ['Portfolio OS', 'Code Cinema', 'AI Assistant', 'Design System'],
    quote: "Code is poetry written in logic.",
    avatar: 'N',
    holographic: true,
    animated: true
  },
  {
    id: '2',
    name: 'Shadow Coder',
    title: 'Backend Specialist',
    rarity: 'epic',
    level: 38,
    xp: 6200,
    maxXp: 8000,
    hp: 90,
    maxHp: 100,
    mp: 95,
    maxMp: 100,
    element: 'dark',
    stats: {
      coding: 92,
      design: 65,
      problemSolving: 90,
      communication: 75,
      learning: 88
    },
    skills: [
      { name: 'Database Mastery', icon: <Database className="w-4 h-4" />, level: 92, description: 'SQL and NoSQL expert', color: 'text-green-400' },
      { name: 'API Design', icon: <Globe className="w-4 h-4" />, level: 88, description: 'RESTful and GraphQL APIs', color: 'text-blue-400' },
      { name: 'DevOps', icon: <Cpu className="w-4 h-4" />, level: 85, description: 'CI/CD and cloud infrastructure', color: 'text-orange-400' },
      { name: 'Security', icon: <Shield className="w-4 h-4" />, level: 87, description: 'Application security expert', color: 'text-red-400' }
    ],
    achievements: ['Zero Downtime Deploy', 'Security Champion', 'Database Optimizer'],
    projects: ['API Gateway', 'Auth System', 'Microservices'],
    quote: "The best code is the code that never breaks.",
    avatar: 'S',
    holographic: false,
    animated: true
  },
  {
    id: '3',
    name: 'Pixel Mage',
    title: 'Creative Developer',
    rarity: 'epic',
    level: 35,
    xp: 5400,
    maxXp: 7000,
    hp: 85,
    maxHp: 100,
    mp: 92,
    maxMp: 100,
    element: 'fire',
    stats: {
      coding: 82,
      design: 96,
      problemSolving: 80,
      communication: 85,
      learning: 90
    },
    skills: [
      { name: 'Animation', icon: <Sparkles className="w-4 h-4" />, level: 95, description: 'Brings interfaces to life', color: 'text-yellow-400' },
      { name: '3D Graphics', icon: <Box className="w-4 h-4" />, level: 88, description: 'WebGL and Three.js expert', color: 'text-purple-400' },
      { name: 'Motion Design', icon: <Zap className="w-4 h-4" />, level: 92, description: 'Fluid micro-interactions', color: 'text-cyan-400' },
      { name: 'Visual Effects', icon: <Star className="w-4 h-4" />, level: 90, description: 'Stunning visual effects', color: 'text-pink-400' }
    ],
    achievements: ['Animation Master', 'CSS Wizard', 'Design Award Winner'],
    projects: ['Particle System', '3D Portfolio', 'Interactive Art'],
    quote: "Every pixel tells a story.",
    avatar: 'P',
    holographic: true,
    animated: true
  },
  {
    id: '4',
    name: 'Git Guardian',
    title: 'Version Control Master',
    rarity: 'rare',
    level: 28,
    xp: 3800,
    maxXp: 5000,
    hp: 88,
    maxHp: 100,
    mp: 82,
    maxMp: 100,
    element: 'earth',
    stats: {
      coding: 78,
      design: 60,
      problemSolving: 85,
      communication: 90,
      learning: 82
    },
    skills: [
      { name: 'Git Mastery', icon: <GitBranch className="w-4 h-4" />, level: 95, description: 'Never loses code', color: 'text-orange-500' },
      { name: 'Code Review', icon: <Target className="w-4 h-4" />, level: 88, description: 'Catches every bug', color: 'text-blue-400' },
      { name: 'Documentation', icon: <Scroll className="w-4 h-4" />, level: 90, description: 'Writes perfect docs', color: 'text-green-400' },
      { name: 'Mentoring', icon: <Heart className="w-4 h-4" />, level: 85, description: 'Helps others grow', color: 'text-red-400' }
    ],
    achievements: ['Merge Conflict Resolver', 'Documentation Hero'],
    projects: ['Git Workflow', 'Team Guidelines', 'Code Standards'],
    quote: "Good code is code that others can understand.",
    avatar: 'G',
    holographic: false,
    animated: false
  },
  {
    id: '5',
    name: 'Neural Navigator',
    title: 'AI/ML Engineer',
    rarity: 'mythic',
    level: 45,
    xp: 9500,
    maxXp: 12000,
    hp: 92,
    maxHp: 100,
    mp: 98,
    maxMp: 100,
    element: 'air',
    stats: {
      coding: 94,
      design: 70,
      problemSolving: 96,
      communication: 82,
      learning: 98
    },
    skills: [
      { name: 'Machine Learning', icon: <Brain className="w-4 h-4" />, level: 95, description: 'Trains intelligent models', color: 'text-purple-400' },
      { name: 'Neural Networks', icon: <Cpu className="w-4 h-4" />, level: 93, description: 'Deep learning expert', color: 'text-cyan-400' },
      { name: 'Data Science', icon: <Database className="w-4 h-4" />, level: 90, description: 'Extracts insights from data', color: 'text-green-400' },
      { name: 'AI Integration', icon: <Rocket className="w-4 h-4" />, level: 88, description: 'Deploys AI to production', color: 'text-orange-400' }
    ],
    achievements: ['Model Training Master', 'AI Pioneer', 'Data Wizard', 'Research Published'],
    projects: ['Neural Network Visualizer', 'AI Chatbot', 'Predictive Analytics'],
    quote: "The future belongs to those who teach machines to think.",
    avatar: 'N',
    holographic: true,
    animated: true
  },
  {
    id: '6',
    name: 'Stack Sentinel',
    title: 'DevOps Engineer',
    rarity: 'rare',
    level: 32,
    xp: 4800,
    maxXp: 6000,
    hp: 95,
    maxHp: 100,
    mp: 85,
    maxMp: 100,
    element: 'water',
    stats: {
      coding: 75,
      design: 55,
      problemSolving: 88,
      communication: 82,
      learning: 85
    },
    skills: [
      { name: 'Cloud Architecture', icon: <Cloud className="w-4 h-4" />, level: 90, description: 'AWS/Azure/GCP expert', color: 'text-sky-400' },
      { name: 'Containerization', icon: <Box className="w-4 h-4" />, level: 88, description: 'Docker and Kubernetes', color: 'text-blue-400' },
      { name: 'Monitoring', icon: <Target className="w-4 h-4" />, level: 85, description: 'Observability expert', color: 'text-green-400' },
      { name: 'Automation', icon: <Zap className="w-4 h-4" />, level: 92, description: 'Infrastructure as code', color: 'text-yellow-400' }
    ],
    achievements: ['99.9% Uptime', 'Cost Optimizer', 'Automation Hero'],
    projects: ['CI/CD Pipeline', 'Monitoring Stack', 'Kubernetes Cluster'],
    quote: "Infrastructure should be invisible, like water.",
    avatar: 'D',
    holographic: false,
    animated: true
  }
];

// Cloud icon component
function Cloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z" />
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10c-.4 0-.8 0-1.1.1-.6-2.7-3-4.6-5.9-4.6-3.3 0-6 2.5-6.3 5.7-.5-.1-1-.2-1.5-.2-2.5 0-4.5 2-4.5 4.5" />
    </svg>
  );
}

// Trading Card Component
function TradingCard({ card, onClick, isFlipped = false }: { card: DeveloperCard; onClick?: () => void; isFlipped?: boolean }) {
  const [flipped, setFlipped] = useState(isFlipped);
  const [isHovered, setIsHovered] = useState(false);
  
  const element = elementConfig[card.element];
  const rarity = rarityConfig[card.rarity];
  const ElementIcon = element.icon;

  return (
    <motion.div
      className="relative w-[320px] h-[480px] cursor-pointer perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        setFlipped(!flipped);
        onClick?.();
      }}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Front of card */}
      <div 
        className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${rarity.border} ${rarity.bg} ${rarity.glow} shadow-2xl`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Holographic effect */}
        {card.holographic && (
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: isHovered 
                ? 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)'
                : 'none',
              transform: isHovered ? 'translateX(-100%)' : 'translateX(100%)',
              transition: 'transform 0.6s ease'
            }}
          />
        )}
        
        {/* Card header */}
        <div className={`h-24 bg-gradient-to-r ${rarity.color} p-4 relative overflow-hidden`}>
          {/* Animated background pattern */}
          {card.animated && (
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                animation: 'slide 20s linear infinite'
              }}
            />
          )}
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${element.bg}`}>
                <ElementIcon className={`w-5 h-5 ${element.text}`} />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{card.name}</p>
                <p className="text-white/80 text-xs">{card.title}</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              Lv.{card.level}
            </Badge>
          </div>
          
          {/* Rarity badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`bg-gradient-to-r ${rarity.color} text-white border-0 text-xs`}>
              {rarity.name}
            </Badge>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${element.color} flex items-center justify-center text-4xl font-bold text-white shadow-lg`}
              style={{
                boxShadow: isHovered ? `0 0 30px ${element.text.replace('text-', '')}` : 'none',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              {card.avatar}
            </div>
          </div>

          {/* Stats bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <Progress value={(card.hp / card.maxHp) * 100} className="flex-1 h-2" />
              <span className="text-xs font-mono w-12 text-right">{card.hp}/{card.maxHp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <Progress value={(card.mp / card.maxMp) * 100} className="flex-1 h-2" />
              <span className="text-xs font-mono w-12 text-right">{card.mp}/{card.maxMp}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-500" />
              <Progress value={(card.xp / card.maxXp) * 100} className="flex-1 h-2" />
              <span className="text-xs font-mono w-12 text-right">{card.xp}/{card.maxXp}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</p>
            <div className="grid grid-cols-2 gap-1">
              {card.skills.slice(0, 4).map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50">
                  <span className={skill.color}>{skill.icon}</span>
                  <span className="text-xs truncate">{skill.name}</span>
                  <span className="text-xs font-mono ml-auto">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className={`p-2 rounded-lg ${element.bg} border ${element.border}`}>
            <p className="text-xs italic text-center">"{card.quote}"</p>
          </div>
        </div>

        {/* Card footer */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
          <p className="text-[10px] text-center text-white/60">Click to flip • Trading Card #0{card.id}</p>
        </div>
      </div>

      {/* Back of card */}
      <div 
        className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${rarity.border} ${rarity.bg} shadow-2xl`}
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <div className="h-full p-4 space-y-4 overflow-auto">
          <div className="text-center">
            <h3 className="font-bold text-lg">{card.name}</h3>
            <p className="text-sm text-muted-foreground">{card.title}</p>
          </div>

          {/* Detailed stats */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core Stats</p>
            {Object.entries(card.stats).map(([stat, value]) => (
              <div key={stat} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-mono">{value}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${element.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Achievements</p>
            <div className="flex flex-wrap gap-1">
              {card.achievements.map((achievement, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notable Projects</p>
            <div className="space-y-1">
              {card.projects.map((project, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Code2 className="w-3 h-3 text-muted-foreground" />
                  {project}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Card pack opening animation
function CardPackOpening({ onComplete }: { onComplete: (card: DeveloperCard) => void }) {
  const [stage, setStage] = useState(0);
  const [revealedCard, setRevealedCard] = useState<DeveloperCard | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => {
      const randomCard = developerCards[Math.floor(Math.random() * developerCards.length)];
      setRevealedCard(randomCard);
      setStage(3);
      onComplete(randomCard);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <AnimatePresence>
        {stage < 3 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: stage >= 1 ? 1.2 : 1,
              rotateY: stage >= 2 ? 720 : 0,
              opacity: 1
            }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-64 h-96 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl"
          >
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-white font-bold text-xl">Opening Pack...</p>
            </div>
          </motion.div>
        )}
        
        {stage === 3 && revealedCard && (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <TradingCard card={revealedCard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TradingCardsPage() {
  const [selectedCard, setSelectedCard] = useState<DeveloperCard | null>(null);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [collection, setCollection] = useState<DeveloperCard[]>(developerCards);
  const [filter, setFilter] = useState<'all' | DeveloperCard['rarity']>('all');

  const filteredCards = filter === 'all' 
    ? collection 
    : collection.filter(c => c.rarity === filter);

  const handlePackOpen = (newCard: DeveloperCard) => {
    setTimeout(() => {
      setIsOpeningPack(false);
      setSelectedCard(newCard);
    }, 2000);
  };

  const rarityCounts = {
    common: collection.filter(c => c.rarity === 'common').length,
    rare: collection.filter(c => c.rarity === 'rare').length,
    epic: collection.filter(c => c.rarity === 'epic').length,
    legendary: collection.filter(c => c.rarity === 'legendary').length,
    mythic: collection.filter(c => c.rarity === 'mythic').length
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
          <Badge variant="secondary" className="mb-4">
            <Gem className="w-3 h-3 mr-1" />
            Collectible Cards
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Developer Trading Cards</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Collect, trade, and showcase developer cards. Each card represents a unique skill set and personality.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {Object.entries(rarityCounts).map(([rarity, count]) => {
            const config = rarityConfig[rarity as keyof typeof rarityConfig];
            return (
              <Card key={rarity} className={`${config.bg} border-${rarity === 'mythic' ? 'pink' : rarity === 'legendary' ? 'orange' : rarity === 'epic' ? 'purple' : rarity === 'rare' ? 'blue' : 'gray'}-500/20`}>
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                    {count}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{rarity}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Cards
            </Button>
            {(['common', 'rare', 'epic', 'legendary', 'mythic'] as const).map(rarity => (
              <Button
                key={rarity}
                variant={filter === rarity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(rarity)}
                className="capitalize"
              >
                {rarity}
              </Button>
            ))}
          </div>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => setIsOpeningPack(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Open Card Pack
          </Button>
        </motion.div>

        {/* Card Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
          layout
        >
          <AnimatePresence>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div onClick={() => setSelectedCard(card)}>
                  <TradingCard card={card} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Card Detail Modal */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-4xl">
            {selectedCard && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <TradingCard card={selectedCard} />
                </div>
                <div className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedCard.name}</DialogTitle>
                    <DialogDescription>{selectedCard.title}</DialogDescription>                  </DialogHeader>

                  <Tabs defaultValue="stats">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="space-y-4">
                      {Object.entries(selectedCard.stats).map(([stat, value]) => (
                        <div key={stat} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-mono">{value}/100</span>
                          </div>
                          <Progress value={value} />
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-3">
                      {selectedCard.skills.map((skill, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${skill.color} bg-opacity-20`}>
                                {skill.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{skill.name}</p>
                                  <Badge>Lv.{skill.level}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{skill.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="projects">
                      <div className="space-y-2">
                        {selectedCard.projects.map((project, i) => (
                          <Card key={i}>
                            <CardContent className="p-4 flex items-center gap-3">
                              <Code2 className="w-5 h-5 text-muted-foreground" />
                              <span>{project}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pack Opening Overlay */}
        <AnimatePresence>
          {isOpeningPack && (
            <CardPackOpening onComplete={handlePackOpen} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
