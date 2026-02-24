"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Laugh, 
  RefreshCw, 
  Copy, 
  Share2, 
  Heart,
  Sparkles,
  Zap,
  Code2,
  Terminal,
  Bug,
  Coffee,
  Database,
  Wifi,
  Battery,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Joke {
  id: string;
  setup: string;
  punchline: string;
  category: "programming" | "dev-life" | "tech" | "dad-joke";
  likes: number;
}

const jokes: Joke[] = [
  {
    id: "1",
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! 🐛",
    category: "programming",
    likes: 420,
  },
  {
    id: "2",
    setup: "What's a programmer's favorite hangout place?",
    punchline: "The Foo Bar! 🍺",
    category: "dev-life",
    likes: 384,
  },
  {
    id: "3",
    setup: "Why did the developer go broke?",
    punchline: "Because he used up all his cache! 💸",
    category: "programming",
    likes: 512,
  },
  {
    id: "4",
    setup: "How many programmers does it take to change a light bulb?",
    punchline: "None. It's a hardware problem! 💡",
    category: "tech",
    likes: 367,
  },
  {
    id: "5",
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they don't C#! 👓",
    category: "programming",
    likes: 445,
  },
  {
    id: "6",
    setup: "What's the object-oriented way to become wealthy?",
    punchline: "Inheritance! 💰",
    category: "programming",
    likes: 298,
  },
  {
    id: "7",
    setup: "Why did the functions stop calling each other?",
    punchline: "Because they had too many arguments! 🗣️",
    category: "programming",
    likes: 356,
  },
  {
    id: "8",
    setup: "What's a computer's favorite snack?",
    punchline: "Microchips! 🥔",
    category: "dad-joke",
    likes: 234,
  },
  {
    id: "9",
    setup: "Why was the JavaScript developer sad?",
    punchline: "Because he didn't know how to 'null' his feelings! 😢",
    category: "programming",
    likes: 289,
  },
  {
    id: "10",
    setup: "What do you call a programmer from Finland?",
    punchline: "Nerdic! 🇫🇮",
    category: "dev-life",
    likes: 312,
  },
  {
    id: "11",
    setup: "Why did the database administrator leave his wife?",
    punchline: "She had too many one-to-many relationships! 💔",
    category: "tech",
    likes: 378,
  },
  {
    id: "12",
    setup: "What's the best thing about Switzerland?",
    punchline: "I don't know, but the flag is a big plus! 🇨🇭",
    category: "dad-joke",
    likes: 267,
  },
  {
    id: "13",
    setup: "Why do programmers always mix up Christmas and Halloween?",
    punchline: "Because Oct 31 == Dec 25! 🎃🎄",
    category: "programming",
    likes: 523,
  },
  {
    id: "14",
    setup: "What did the router say to the doctor?",
    punchline: "It hurts when IP! 🏥",
    category: "tech",
    likes: 341,
  },
  {
    id: "15",
    setup: "Why was the function so stressed?",
    punchline: "It had too many callbacks to make! 📞",
    category: "programming",
    likes: 276,
  },
  {
    id: "16",
    setup: "What's a pirate's favorite programming language?",
    punchline: "R! ☠️",
    category: "programming",
    likes: 198,
  },
  {
    id: "17",
    setup: "Why don't programmers like nature?",
    punchline: "It has too many bugs! 🌿🐛",
    category: "dev-life",
    likes: 334,
  },
  {
    id: "18",
    setup: "What do you call a bug that won't reproduce?",
    punchline: "A heisenbug! 🔬",
    category: "tech",
    likes: 412,
  },
  {
    id: "19",
    setup: "Why did the developer refuse to play cards?",
    punchline: "Because he was afraid of dealing with the deck! 🃏",
    category: "dev-life",
    likes: 156,
  },
  {
    id: "20",
    setup: "What's the difference between a programmer and a doctor?",
    punchline: "A doctor kills bugs, a programmer creates them! 🩺",
    category: "programming",
    likes: 467,
  },
];

const categoryIcons = {
  programming: Code2,
  "dev-life": Coffee,
  tech: Terminal,
  "dad-joke": Laugh,
};

const categoryColors = {
  programming: "bg-blue-500/10 text-blue-500",
  "dev-life": "bg-orange-500/10 text-orange-500",
  tech: "bg-green-500/10 text-green-500",
  "dad-joke": "bg-purple-500/10 text-purple-500",
};

export function DevJokes() {
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [likedJokes, setLikedJokes] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomJoke = useCallback(() => {
    setIsAnimating(true);
    setShowPunchline(false);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * jokes.length);
      setCurrentJoke(jokes[randomIndex]);
      setIsAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    getRandomJoke();
  }, [getRandomJoke]);

  const handleLike = () => {
    if (!currentJoke) return;
    
    setLikedJokes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentJoke.id)) {
        newSet.delete(currentJoke.id);
        toast("Unliked joke");
      } else {
        newSet.add(currentJoke.id);
        toast("Added to favorites! ❤️");
      }
      return newSet;
    });
  };

  const handleCopy = () => {
    if (!currentJoke) return;
    
    const text = `${currentJoke.setup}\n${currentJoke.punchline}`;
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!");
  };

  const handleShare = async () => {
    if (!currentJoke) return;
    
    const text = `${currentJoke.setup} ${currentJoke.punchline}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dev Joke",
          text: text,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      toast("Copied to clipboard!");
    }
  };

  const currentCategoryIcon = currentJoke ? categoryIcons[currentJoke.category] : Code2;
  const isLiked = currentJoke ? likedJokes.has(currentJoke.id) : false;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden border-2 border-primary/20">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {currentJoke && !isAnimating && (
              <motion.div
                key={currentJoke.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Category Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryColors[currentJoke.category]} capitalize`}
                  >
                    <currentCategoryIcon className="h-3 w-3 mr-1" />
                    {currentJoke.category.replace("-", " ")}
                  </Badge>
                </div>

                {/* Setup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-2xl md:text-3xl font-bold leading-relaxed">
                    {currentJoke.setup}
                  </h3>
                </motion.div>

                {/* Punchline Reveal */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  {!showPunchline ? (
                    <Button
                      size="lg"
                      onClick={() => setShowPunchline(true)}
                      className="group"
                    >
                      <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
                      Reveal Punchline
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="relative"
                    >
                      <div className="inline-block p-6 bg-primary/10 rounded-2xl border-2 border-primary/30">
                        <p className="text-xl md:text-2xl font-semibold text-primary">
                          {currentJoke.punchline}
                        </p>
                      </div>
                      
                      {/* Confetti effect */}
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ 
                              opacity: 1, 
                              scale: 0,
                              x: "50%",
                              y: "50%"
                            }}
                            animate={{ 
                              opacity: 0,
                              scale: 1,
                              x: `${50 + (Math.random() - 0.5) * 200}%`,
                              y: `${50 + (Math.random() - 0.5) * 200}%`
                            }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="absolute w-2 h-2 rounded-full bg-primary"
                            style={{
                              left: "50%",
                              top: "50%",
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Stats */}
                <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {currentJoke.likes + (isLiked ? 1 : 0)} likes
                  </span>
                  <span>•</span>
                  <span>Joke #{currentJoke.id}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isAnimating && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Joke Button */}
      <div className="mt-6 text-center">
        <Button
          size="lg"
          onClick={getRandomJoke}
          disabled={isAnimating}
          className="group"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnimating ? "animate-spin" : "group-hover:rotate-180 transition-transform"}`} />
          Next Joke
        </Button>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid grid-cols-4 gap-4 text-center">
        {[
          { icon: Laugh, label: "Jokes", value: jokes.length },
          { icon: Heart, label: "Liked", value: likedJokes.size },
          { icon: Code2, label: "Programming", value: jokes.filter(j => j.category === "programming").length },
          { icon: Zap, label: "Categories", value: 4 },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-3 rounded-lg bg-muted"
          >
            <stat.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DevJokes;
