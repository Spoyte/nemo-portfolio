"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Copy, Check, Sparkles, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
  category: "inspiration" | "tech" | "creativity" | "life";
  likes: number;
}

const QUOTES: Quote[] = [
  {
    id: "1",
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    role: "Computer Scientist",
    category: "tech",
    likes: 342,
  },
  {
    id: "2",
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    role: "Polymath",
    category: "creativity",
    likes: 521,
  },
  {
    id: "3",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    role: "Software Engineer",
    category: "tech",
    likes: 892,
  },
  {
    id: "4",
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    role: "Physicist",
    category: "creativity",
    likes: 445,
  },
  {
    id: "5",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    category: "inspiration",
    likes: 1024,
  },
  {
    id: "6",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    role: "Software Engineer",
    category: "tech",
    likes: 678,
  },
  {
    id: "7",
    text: "Any sufficiently advanced technology is indistinguishable from magic.",
    author: "Arthur C. Clarke",
    role: "Science Fiction Writer",
    category: "tech",
    likes: 556,
  },
  {
    id: "8",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    category: "creativity",
    likes: 789,
  },
  {
    id: "9",
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    role: "Philosopher",
    category: "life",
    likes: 334,
  },
  {
    id: "10",
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    role: "Software Engineer",
    category: "tech",
    likes: 667,
  },
];

const CATEGORIES = [
  { id: "all", label: "All", color: "#dc2626" },
  { id: "inspiration", label: "Inspiration", color: "#f59e0b" },
  { id: "tech", label: "Tech", color: "#3b82f6" },
  { id: "creativity", label: "Creativity", color: "#8b5cf6" },
  { id: "life", label: "Life", color: "#10b981" },
];

export function QuoteWall() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [category, setCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const filteredQuotes = category === "all" 
    ? QUOTES 
    : QUOTES.filter((q) => q.category === category);

  const quote = filteredQuotes[currentQuote % filteredQuotes.length];

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % filteredQuotes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredQuotes.length]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = () => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(quote.id)) {
        newSet.delete(quote.id);
      } else {
        newSet.add(quote.id);
      }
      return newSet;
    });
  };

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % filteredQuotes.length);
  };

  const shareQuote = async () => {
    const text = `"${quote.text}" — ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quote from Nemo's Portfolio",
          text,
        });
      } catch {
        // User cancelled
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Inspiration</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Words of{" "}
            <span className="text-gradient-animated">Wisdom</span>
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setCurrentQuote(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? "text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
              style={{
                backgroundColor: category === cat.id ? cat.color : undefined,
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-orange-500/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative p-8 md:p-12 rounded-2xl bg-card border">
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 text-primary/10">
                  <Quote className="w-16 h-16" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-2xl md:text-3xl font-medium text-center mb-8 leading-relaxed">
                  “{quote.text}”
                </blockquote>

                {/* Author */}
                <div className="text-center mb-8">
                  <p className="font-semibold">{quote.author}</p>
                  <p className="text-sm text-muted-foreground">{quote.role}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLike}
                    className={liked.has(quote.id) ? "text-red-500" : ""}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        liked.has(quote.id) ? "fill-current" : ""
                      }`}
                    />
                    {quote.likes + (liked.has(quote.id) ? 1 : 0)}
                  </Button>

                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button variant="outline" size="sm" onClick={shareQuote}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  <Button variant="outline" size="sm" onClick={nextQuote}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Next
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {filteredQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuote % filteredQuotes.length
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                isAutoPlaying ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                <span className="text-xs">{isAutoPlaying ? "Auto" : "Manual"}</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
