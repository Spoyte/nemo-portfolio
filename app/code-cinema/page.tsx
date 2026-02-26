"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Film,
  Code2,
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Heart,
  MessageSquare,
  Eye,
  Clock,
  ChevronRight,
  Star,
  Zap,
  Terminal,
  Palette,
  Cpu,
  Globe,
  Database,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";

interface CodeScene {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  duration: number;
  views: number;
  likes: number;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnail: string;
}

const codeScenes: CodeScene[] = [
  {
    id: "1",
    title: "React Hooks Magic",
    description: "Watch useEffect and useState come to life",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

function MagicCounter() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="magic-container">
      <h1>✨ Magic Count: {count}</h1>
      <button 
        onClick={() => setCount(c => c + 1)}
        className={isAnimating ? 'animate-pulse' : ''}
      >
        Cast Spell
      </button>
    </div>
  );
}`,
    duration: 45,
    views: 12543,
    likes: 892,
    tags: ["react", "hooks", "animation"],
    difficulty: "Intermediate",
    category: "Frontend",
    thumbnail: "🎭"
  },
  {
    id: "2",
    title: "Async/Await Symphony",
    description: "Beautiful asynchronous code patterns",
    language: "typescript",
    code: `async function fetchUserData(userId: string) {
  try {
    console.log('🚀 Initiating request...');
    
    const response = await fetch(
      \`/api/users/\${userId}\`
    );
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const user = await response.json();
    
    // Parallel data fetching
    const [posts, followers] = await Promise.all([
      fetchPosts(user.id),
      fetchFollowers(user.id)
    ]);
    
    return {
      ...user,
      posts,
      followers,
      lastUpdated: new Date()
    };
    
  } catch (error) {
    console.error('💥 Fetch failed:', error);
    return null;
  }
}`,
    duration: 52,
    views: 8932,
    likes: 654,
    tags: ["async", "fetch", "api"],
    difficulty: "Advanced",
    category: "Backend",
    thumbnail: "🎵"
  },
  {
    id: "3",
    title: "CSS Grid Masterpiece",
    description: "Creating art with CSS Grid",
    language: "css",
    code: `.masonry-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill, 
    minmax(250px, 1fr)
  );
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span var(--row-span, 20);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    z-index: 10;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  }
}

.masonry-item:nth-child(3n) {
  --row-span: 25;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.masonry-item:nth-child(3n+1) {
  --row-span: 15;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}`,
    duration: 38,
    views: 15678,
    likes: 1234,
    tags: ["css", "grid", "design"],
    difficulty: "Beginner",
    category: "Styling",
    thumbnail: "🎨"
  },
  {
    id: "4",
    title: "GraphQL Dance",
    description: "Elegant queries and mutations",
    language: "graphql",
    code: `query GetProjectWithDetails($id: ID!, $limit: Int = 10) {
  project(id: $id) {
    id
    name
    description
    status
    createdAt
    
    owner {
      id
      name
      avatar
      email
    }
    
    collaborators(first: $limit) {
      edges {
        node {
          id
          name
          role
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    
    tasks(
      where: { status: { not: ARCHIVED } }
      orderBy: { priority: DESC }
    ) {
      id
      title
      priority
      dueDate
      assignee {
        name
      }
    }
  }
}`,
    duration: 48,
    views: 6789,
    likes: 445,
    tags: ["graphql", "api", "database"],
    difficulty: "Advanced",
    category: "Backend",
    thumbnail: "🕸️"
  },
  {
    id: "5",
    title: "Three.js Universe",
    description: "3D graphics with Three.js",
    language: "javascript",
    code: `import * as THREE from 'three';

function createParticleUniverse() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 5000;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(posArray, 3)
  );
  
  const material = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(
    particlesGeometry, 
    material
  );
  
  scene.add(particlesMesh);
  camera.position.z = 3;
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }
  
  animate();
  return renderer;
}`,
    duration: 65,
    views: 9876,
    likes: 876,
    tags: ["threejs", "3d", "animation"],
    difficulty: "Advanced",
    category: "Graphics",
    thumbnail: "🌌"
  },
  {
    id: "6",
    title: "Rust Memory Safety",
    description: "Understanding ownership in Rust",
    language: "rust",
    code: `struct DataStore {
    items: Vec<String>,
    cache: HashMap<String, u64>,
}

impl DataStore {
    fn new() -> Self {
        DataStore {
            items: Vec::new(),
            cache: HashMap::new(),
        }
    }
    
    fn add_item(&mut self, item: String) -> Result<(), String> {
        if item.len() > 100 {
            return Err("Item too long".to_string());
        }
        
        let hash = self.calculate_hash(&item);
        self.cache.insert(item.clone(), hash);
        self.items.push(item);
        
        Ok(())
    }
    
    fn get_item(&self, index: usize) -> Option<&String> {
        self.items.get(index)
    }
    
    fn process_items<F>(&self, processor: F) 
    where 
        F: Fn(&String) -> String 
    {
        for item in &self.items {
            let processed = processor(item);
            println!("Processed: {}", processed);
        }
    }
}

fn main() {
    let mut store = DataStore::new();
    
    store.add_item("Hello".to_string()).unwrap();
    store.add_item("World".to_string()).unwrap();
    
    store.process_items(|s| s.to_uppercase());
}`,
    duration: 58,
    views: 5432,
    likes: 678,
    tags: ["rust", "systems", "memory"],
    difficulty: "Advanced",
    category: "Systems",
    thumbnail: "⚙️"
  }
];

function TypewriterEffect({ 
  code, 
  isPlaying, 
  speed = 30,
  onComplete 
}: { 
  code: string; 
  isPlaying: boolean; 
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, code, isPlaying, speed, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    setDisplayedCode("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [code, isPlaying]);

  const highlightSyntax = (text: string) => {
    return text
      .replace(/(import|export|from|const|let|var|function|return|if|else|for|while|async|await|try|catch|class|interface|type|enum)/g, '<span class="text-purple-400">$1</span>')
      .replace(/('.*?')|(".*?")|(`[\s\S]*?`)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
      <code 
        dangerouslySetInnerHTML={{ 
          __html: highlightSyntax(displayedCode) + (isPlaying && !isComplete ? '<span class="animate-pulse">|</span>' : '')
        }}
      />
    </pre>
  );
}

function CinemaPlayer({ scene }: { scene: CodeScene }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ff0000', '#ff6b6b', '#ffd93d']
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-black rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      {/* Video Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-2xl">
            {scene.thumbnail}
          </div>
          <div>
            <h3 className="font-semibold text-white">{scene.title}</h3>
            <p className="text-xs text-zinc-400">{scene.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-zinc-700 text-zinc-300">
            {scene.difficulty}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative bg-zinc-950 p-6 min-h-[400px] max-h-[600px] overflow-auto">
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        
        <TypewriterEffect 
          code={scene.code}
          isPlaying={isPlaying}
          speed={speed}
          onComplete={() => setIsPlaying(false)}
        />

        {!isPlaying && progress === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="h-5 w-5" />
              Start Coding
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="cursor-pointer"
            onValueChange={(value) => setProgress(value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={() => setProgress(0)}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-primary hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>

            <span className="text-sm text-zinc-400 ml-4">
              0:00 / {Math.floor(scene.duration / 60)}:{String(scene.duration % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
              onClick={() => setSpeed(speed === 30 ? 15 : speed === 15 ? 50 : 30)}
            >
              {speed === 30 ? '1x' : speed === 15 ? '2x' : '0.5x'}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Engagement Bar */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? 'text-red-500' : 'text-zinc-400'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            {scene.likes + (isLiked ? 1 : 0)}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-400"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-5 w-5" />
            42
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-400"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {scene.views.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {scene.duration}s
          </span>
        </div>
      </div>
    </div>
  );
}

function SceneCard({ scene, onClick }: { scene: CodeScene; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer overflow-hidden group hover:border-primary/50 transition-all"
        onClick={onClick}
      >
        <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
            {scene.thumbnail}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {Math.floor(scene.duration / 60)}:{String(scene.duration % 60).padStart(2, '0')}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {scene.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {scene.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {scene.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {(scene.views / 1000).toFixed(1)}K
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {scene.likes}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {scene.duration}s
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {scene.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CodeCinemaPage() {
  const [selectedScene, setSelectedScene] = useState<CodeScene>(codeScenes[0]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(codeScenes.map(s => s.category)))];
  
  const filteredScenes = activeCategory === "All" 
    ? codeScenes 
    : codeScenes.filter(s => s.category === activeCategory);

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
            <Film className="h-4 w-4" />
            <span className="text-sm font-medium">Watch Code Come Alive</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Code <span className="text-gradient">Cinema</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience code like never before. Watch beautiful code being typed in real-time 
            with cinematic effects and immersive sound.
          </p>
        </motion.div>

        {/* Featured Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <CinemaPlayer scene={selectedScene} />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Scene Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredScenes.map((scene, index) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <SceneCard 
                  scene={scene} 
                  onClick={() => setSelectedScene(scene)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Film, label: "Scenes", value: "50+" },
            { icon: Code2, label: "Languages", value: "12" },
            { icon: Eye, label: "Total Views", value: "1.2M" },
            { icon: Heart, label: "Likes", value: "89K" },
          ].map((stat, index) => (
            <Card key={stat.label} className="text-center p-6">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
