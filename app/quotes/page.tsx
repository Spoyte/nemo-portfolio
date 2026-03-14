"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Quote, 
  RefreshCw, 
  Copy, 
  Check,
  Share2,
  Twitter,
  Sparkles,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: string;
  source?: string;
}

const quotes: QuoteItem[] = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration",
    source: "Stanford Commencement Speech"
  },
  {
    id: "2",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "Programming",
    source: "Twitter"
  },
  {
    id: "3",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Programming"
  },
  {
    id: "4",
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Design"
  },
  {
    id: "5",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Programming",
    source: "Refactoring"
  },
  {
    id: "6",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    category: "Design"
  },
  {
    id: "7",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Wisdom"
  },
  {
    id: "8",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Inspiration"
  },
  {
    id: "9",
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "Programming"
  },
  {
    id: "10",
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    category: "Programming",
    source: "Computer Programming as an Art"
  },
  {
    id: "11",
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity"
  },
  {
    id: "12",
    text: "The user experience is everything. It always has been, but it's still undervalued.",
    author: "Evan Williams",
    category: "Design",
    source: "Twitter Co-founder"
  },
  {
    id: "13",
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    category: "Programming"
  },
  {
    id: "14",
    text: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
    category: "Design"
  },
  {
    id: "15",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Inspiration"
  },
  {
    id: "16",
    text: "Software is eating the world.",
    author: "Marc Andreessen",
    category: "Technology",
    source: "WSJ Essay"
  },
  {
    id: "17",
    text: "The most damaging phrase in the language is: 'It's always been done that way.'",
    author: "Grace Hopper",
    category: "Innovation"
  },
  {
    id: "18",
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    category: "Learning"
  },
  {
    id: "19",
    text: "Debugging is twice as hard as writing the code in the first place.",
    author: "Brian Kernighan",
    category: "Programming"
  },
  {
    id: "20",
    text: "Everything should be made as simple as possible, but not simpler.",
    author: "Albert Einstein",
    category: "Wisdom"
  }
];

const categories = ["All", "Programming", "Design", "Inspiration", "Creativity", "Wisdom", "Technology", "Innovation", "Learning"];

const categoryColors: Record<string, string> = {
  "Programming": "bg-blue-500/10 text-blue-500",
  "Design": "bg-pink-500/10 text-pink-500",
  "Inspiration": "bg-yellow-500/10 text-yellow-500",
  "Creativity": "bg-purple-500/10 text-purple-500",
  "Wisdom": "bg-green-500/10 text-green-500",
  "Technology": "bg-cyan-500/10 text-cyan-500",
  "Innovation": "bg-orange-500/10 text-orange-500",
  "Learning": "bg-indigo-500/10 text-indigo-500"
};

export default function QuotesPage() {
  const [currentQuote, setCurrentQuote] = useState<QuoteItem>(quotes[0]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredQuotes = activeCategory === "All" 
    ? quotes 
    : quotes.filter(q => q.category === activeCategory);

  const getRandomQuote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const availableQuotes = filteredQuotes.filter(q => q.id !== currentQuote.id);
    const nextQuote = availableQuotes.length > 0 
      ? availableQuotes[Math.floor(Math.random() * availableQuotes.length)]
      : filteredQuotes[0];
    
    setTimeout(() => {
      setCurrentQuote(nextQuote);
      setIsAnimating(false);
    }, 300);
  };

  const copyQuote = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    // Get random quote on initial load
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Inspiration</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Words of{" "}
            <span className="text-gradient-animated">Wisdom</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A curated collection of quotes that inspire, motivate, and make me think.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                const availableQuotes = category === "All" 
                  ? quotes 
                  : quotes.filter(q => q.category === category);
                setCurrentQuote(availableQuotes[Math.floor(Math.random() * availableQuotes.length)]);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Main Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-orange-500/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative p-8 md:p-12 rounded-2xl bg-card border border-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-12 w-12 mx-auto text-primary/30" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-6">
                  "{currentQuote.text}"
                </blockquote>

                {/* Author */}
                <div className="mb-6">
                  <p className="text-lg font-semibold">{currentQuote.author}</p>
                  {currentQuote.source && (
                    <p className="text-sm text-muted-foreground">{currentQuote.source}</p>
                  )}
                </div>

                {/* Category Badge */}
                <Badge className={categoryColors[currentQuote.category]}>
                  {currentQuote.category}
                </Badge>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite(currentQuote.id)}
                className={favorites.has(currentQuote.id) ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${favorites.has(currentQuote.id) ? "fill-current" : ""}`} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={copyQuote}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={getRandomQuote}
                disabled={isAnimating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
                New Quote
              </Button>
            </div>
          </div>
        </motion.div>

        {/* All Quotes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">More Quotes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.slice(0, 6).map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => setCurrentQuote(quote)}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 cursor-pointer transition-all group"
              >
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2 group-hover:text-foreground transition-colors">
                  "{quote.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{quote.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {quote.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 border border-border"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{quotes.length}</p>
              <p className="text-xs text-muted-foreground">Total Quotes</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.length - 1}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{favorites.size}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
