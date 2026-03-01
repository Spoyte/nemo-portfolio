"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize,
  Settings,
  Film,
  Star,
  Clock,
  Users,
  Heart,
  Share2,
  Plus,
  Check,
  Sparkles,
  Code2,
  Terminal,
  Zap,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Movie/TV Show styled code presentations
interface CodeMovie {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  genre: string[];
  duration: string;
  year: string;
  rating: number;
  views: string;
  thumbnail: string;
  color: string;
  code: string[];
  highlights: string[];
}

const codeMovies: CodeMovie[] = [
  {
    id: "the-algorithm",
    title: "The Algorithm",
    subtitle: "A Journey into Sorting",
    description: "Watch as data comes alive in this visual masterpiece exploring the beauty of sorting algorithms. From bubble sort's chaotic dance to merge sort's elegant divide-and-conquer, experience code like never before.",
    genre: ["Animation", "Educational", "Visual"],
    duration: "12:34",
    year: "2024",
    rating: 4.9,
    views: "2.4M",
    thumbnail: "🎬",
    color: "from-purple-600 to-blue-600",
    code: [
      "function mergeSort(arr) {",
      "  if (arr.length <= 1) return arr;",
      "  const mid = Math.floor(arr.length / 2);",
      "  const left = mergeSort(arr.slice(0, mid));",
      "  const right = mergeSort(arr.slice(mid));",
      "  return merge(left, right);",
      "}",
      "",
      "// The dance of division and conquer",
      "// Each split, a new universe of possibility"
    ],
    highlights: ["Stunning Visualizations", "Interactive Playback", "Step-by-Step Breakdown"]
  },
  {
    id: "async-awaits",
    title: "Async/Awaits",
    subtitle: "Promises in the Dark",
    description: "A noir thriller following Detective Promise as she navigates the shadowy world of asynchronous JavaScript. Callbacks, promises, and async/await collide in this suspenseful code narrative.",
    genre: ["Thriller", "Noir", "Drama"],
    duration: "18:22",
    year: "2024",
    rating: 4.7,
    views: "1.8M",
    thumbnail: "🕵️",
    color: "from-slate-700 to-slate-900",
    code: [
      "async function solveTheCase() {",
      "  const clues = await gatherEvidence();",
      "  const suspect = await interrogate(clues);",
      "  ",
      "  if (suspect.alibi) {",
      "    return investigateFurther(suspect);",
      "  }",
      "  ",
      "  return Promise.resolve('Case closed');",
      "}"
    ],
    highlights: ["Cinematic Storytelling", "Real-world Examples", "Best Practices"]
  },
  {
    id: "recursion",
    title: "Recursion",
    subtitle: "The Infinite Loop",
    description: "A mind-bending sci-fi adventure exploring the recursive nature of reality. When a function calls itself, how deep does the rabbit hole go? Features stunning fractal visualizations.",
    genre: ["Sci-Fi", "Mind-Bending", "Art"],
    duration: "24:15",
    year: "2024",
    rating: 4.8,
    views: "3.1M",
    thumbnail: "🌀",
    color: "from-emerald-500 to-cyan-600",
    code: [
      "function dream(depth = 0) {",
      "  if (depth > reality.layers) {",
      "    return wakeUp();",
      "  }",
      "  ",
      "  console.log(`Dream level: ${depth}`);",
      "  return dream(depth + 1); // Deeper...",
      "}",
      "",
      "// To understand recursion",
      "// You must first understand recursion"
    ],
    highlights: ["Fractal Visualizations", "Philosophical Depth", "Interactive Examples"]
  },
  {
    id: "the-framework",
    title: "The Framework",
    subtitle: "Rise of Components",
    description: "An epic saga spanning the evolution of frontend frameworks. From jQuery's humble beginnings to React's component revolution, witness the history of modern web development.",
    genre: ["Documentary", "Historical", "Epic"],
    duration: "45:00",
    year: "2024",
    rating: 4.9,
    views: "5.2M",
    thumbnail: "⚔️",
    color: "from-orange-500 to-red-600",
    code: [
      "// The old ways...",
      "$('#button').click(function() {",
      "  alert('Hello World');",
      "});",
      "",
      "// The new era",
      "const Button = () => {",
      "  const [count, setCount] = useState(0);",
      "  return <button>{count}</button>;",
      "};"
    ],
    highlights: ["Historical Context", "Framework Comparison", "Future Predictions"]
  },
  {
    id: "regex-mystery",
    title: "Regex Mystery",
    subtitle: "The Pattern Killer",
    description: "A gripping crime procedural where only Regular Expressions can solve the case. Follow the pattern, catch the bug. Warning: Contains nested groups and lookahead assertions.",
    genre: ["Crime", "Mystery", "Suspense"],
    duration: "32:18",
    year: "2024",
    rating: 4.6,
    views: "980K",
    thumbnail: "🔍",
    color: "from-amber-600 to-yellow-500",
    code: [
      "const pattern = /^(?=.*[A-Z])(?=.*[0-9])",
      "  (?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;",
      "",
      "// Some say it's write-only code",
      "// Others say it's an art form",
      "",
      "const isValid = pattern.test(password);"
    ],
    highlights: ["Pattern Breakdown", "Interactive Tester", "Cheat Sheet"]
  },
  {
    id: "css-in-wonderland",
    title: "CSS in Wonderland",
    subtitle: "Through the Looking Glass",
    description: "A whimsical journey through the magical world of CSS. Watch as elements transform, flex, and grid their way through a fantastical landscape of styles and animations.",
    genre: ["Fantasy", "Art", "Tutorial"],
    duration: "28:45",
    year: "2024",
    rating: 4.8,
    views: "2.1M",
    thumbnail: "🎩",
    color: "from-pink-500 to-rose-600",
    code: [
      ".wonderland {",
      "  display: grid;",
      "  place-items: center;",
      "  transform: perspective(1000px)",
      "             rotateX(45deg);",
      "  animation: fall 3s infinite;",
      "}",
      "",
      "// Curiouser and curiouser!"
    ],
    highlights: ["Creative Animations", "Layout Magic", "Visual Effects"]
  }
];

// Typewriter effect for code
function TypewriterCode({ code, isPlaying, speed = 50 }: { code: string[]; isPlaying: boolean; speed?: number }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentLine >= code.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const line = code[currentLine];
    
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLine] = (newLines[currentLine] || '') + line[currentChar];
          return newLines;
        });
        setCurrentChar(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, currentLine, currentChar, code, speed]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {code.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-muted-foreground w-8 text-right mr-4 select-none">
            {i + 1}
          </span>
          <span className={`
            ${line.startsWith('//') || line.startsWith('/*') ? 'text-green-500' : ''}
            ${line.includes('function') || line.includes('const') || line.includes('let') || line.includes('var') ? 'text-purple-400' : ''}
            ${line.includes('return') ? 'text-blue-400' : ''}
            ${line.includes('if') || line.includes('else') ? 'text-pink-400' : ''}
          `}>
            {displayedLines[i] || ''}
            {i === currentLine && isPlaying && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// Cinema Screen Component
function CinemaScreen({ movie, isPlaying }: { movie: CodeMovie; isPlaying: boolean }) {
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Code display */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        <motion.div 
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${movie.color} opacity-20 blur-3xl`}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <Terminal className="w-3 h-3" />
            <span>main.{movie.id}.js</span>
            <span className="ml-auto">UTF-8</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TypewriterCode code={movie.code} isPlaying={isPlaying} />
          </div>
          
          {/* Scanline */}
          <motion.div 
            className="absolute left-0 right-0 h-px bg-primary/30 z-20"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      
      {/* Movie title overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-20"
          >
            <div className="text-center">
              <motion.div 
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {movie.thumbnail}
              </motion.div>
              <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
              <p className="text-white/70">{movie.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-primary"
                animate={{ height: [8, 24, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          <span className="text-xs text-white/70">LIVE</span>
        </div>
      )}
    </div>
  );
}

// Movie Card Component
function MovieCard({ movie, isSelected, onClick }: { movie: CodeMovie; isSelected: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      layout
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        cursor-pointer rounded-xl overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${isHovered ? 'scale-105' : 'scale-100'}
      `}
    >
      <div className={`aspect-video bg-gradient-to-br ${movie.color} relative p-4 flex flex-col justify-end`}>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.rating}
          </Badge>
        </div>
        
        <div className="text-4xl mb-2">{movie.thumbnail}</div>
        
        <div className="relative z-10">
          <h4 className="font-bold text-white text-sm line-clamp-1">{movie.title}</h4>
          <p className="text-white/70 text-xs line-clamp-1">{movie.subtitle}</p>
        </div>
        
        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <Play className="w-12 h-12 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-3 bg-card border-x border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {movie.duration}
          <span className="mx-1">•</span>
          {movie.year}
        </div>
      </div>
    </motion.div>
  );
}

export default function CodeCinemaPage() {
  const [selectedMovie, setSelectedMovie] = useState<CodeMovie>(codeMovies[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("featured");

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return p + 0.5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-red-800">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Code Cinema</h1>
              <p className="text-muted-foreground">Where code meets cinema</p>
            </div>
          </div>
        </motion.div>

        {/* Main Cinema Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CinemaScreen movie={selectedMovie} isPlaying={isPlaying} />
          
          {/* Player Controls */}
          <div className="mt-4 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProgress(0)}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProgress(p => Math.min(100, p + 10))}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 mx-4">
                <Slider
                  value={[progress]}
                  onValueChange={([v]) => setProgress(v)}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(progress * 10)}</span>
                  <span>{selectedMovie.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([v]) => setVolume(v)}
                    max={100}
                  />
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Movie Info */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedMovie.title}</h2>
                <p className="text-muted-foreground">{selectedMovie.subtitle}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {selectedMovie.rating}
                  </span>
                  <span>{selectedMovie.year}</span>
                  <span>{selectedMovie.duration}</span>
                  <span>{selectedMovie.views} views</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedMovie.genre.map(g => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWatchlist(selectedMovie.id)}
                >
                  {watchlist.includes(selectedMovie.id) ? (
                    <><Check className="w-4 h-4 mr-1" /> Added</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-1" /> Watchlist</>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-1" /> Like
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="featured">
              <Sparkles className="w-4 h-4 mr-1" /> Featured
            </TabsTrigger>
            <TabsTrigger value="movies">
              <Film className="w-4 h-4 mr-1" /> All Movies
            </TabsTrigger>
            <TabsTrigger value="watchlist">
              <Heart className="w-4 h-4 mr-1" /> Watchlist ({watchlist.length})
            </TabsTrigger>
            <TabsTrigger value="about">
              <Code2 className="w-4 h-4 mr-1" /> About
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {codeMovies.slice(0, 4).map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isSelected={selectedMovie.id === movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="movies" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {codeMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isSelected={selectedMovie.id === movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsPlaying(false);
                    setProgress(0);
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="watchlist" className="mt-0">
            {watchlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground">Add movies to watch them later</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {codeMovies.filter(m => watchlist.includes(m.id)).map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isSelected={selectedMovie.id === movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setIsPlaying(false);
                      setProgress(0);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="mt-0">
            <Card>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <Film className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h2 className="text-2xl font-bold mb-4">Welcome to Code Cinema</h2>
                  <p className="text-muted-foreground mb-6">
                    Code Cinema is an experimental platform that presents programming concepts 
                    as cinematic experiences. Each "movie" is a carefully crafted journey through 
                    code, combining visual storytelling with technical education.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="font-semibold">Interactive</p>
                      <p className="text-sm text-muted-foreground">Hands-on learning</p>
                    </div>
                    <div>
                      <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-semibold">Cinematic</p>
                      <p className="text-sm text-muted-foreground">Visual storytelling</p>
                    </div>
                    <div>
                      <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold">Educational</p>
                      <p className="text-sm text-muted-foreground">Learn by watching</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
