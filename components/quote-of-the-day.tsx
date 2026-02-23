"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Share2, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuoteData {
  id: string;
  text: string;
  author: string;
  category: string;
  source?: string;
}

const quotes: QuoteData[] = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration",
  },
  {
    id: "2",
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "Programming",
  },
  {
    id: "3",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Programming",
  },
  {
    id: "4",
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Design",
  },
  {
    id: "5",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Programming",
  },
  {
    id: "6",
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "Innovation",
  },
  {
    id: "7",
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    category: "Programming",
  },
  {
    id: "8",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    category: "Design",
  },
  {
    id: "9",
    text: "The most damaging phrase in the language is 'It's always been done this way.'",
    author: "Grace Hopper",
    category: "Innovation",
  },
  {
    id: "10",
    text: "Software is eating the world, but AI is going to eat software.",
    author: "Jensen Huang",
    category: "Technology",
  },
  {
    id: "11",
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "Programming",
  },
  {
    id: "12",
    text: "Creativity is just connecting things.",
    author: "Steve Jobs",
    category: "Creativity",
  },
  {
    id: "13",
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Inspiration",
  },
  {
    id: "14",
    text: "Good design is as little design as possible.",
    author: "Dieter Rams",
    category: "Design",
  },
  {
    id: "15",
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous",
    category: "Programming",
  },
];

const categories = ["All", "Programming", "Design", "Innovation", "Inspiration", "Creativity", "Technology"];

export function QuoteOfTheDay() {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>(quotes[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCopied, setIsCopied] = useState(false);
  const [direction, setDirection] = useState(1);

  const getRandomQuote = useCallback(() => {
    const filteredQuotes = selectedCategory === "All" 
      ? quotes 
      : quotes.filter(q => q.category === selectedCategory);
    
    const availableQuotes = filteredQuotes.filter(q => q.id !== currentQuote.id);
    const pool = availableQuotes.length > 0 ? availableQuotes : filteredQuotes;
    
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setDirection(Math.random() > 0.5 ? 1 : -1);
      setCurrentQuote(pool[randomIndex]);
    }
  }, [currentQuote.id, selectedCategory]);

  // Get daily quote based on date
  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`quote-${today}`);
    
    if (savedQuote) {
      setCurrentQuote(JSON.parse(savedQuote));
    } else {
      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const quoteIndex = dayOfYear % quotes.length;
      const dailyQuote = quotes[quoteIndex];
      setCurrentQuote(dailyQuote);
      localStorage.setItem(`quote-${today}`, JSON.stringify(dailyQuote));
    }
  }, []);

  const handleCopy = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Quote copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quote of the Day",
          text: text,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Quote className="w-4 h-4" />
            <span className="text-sm font-medium">Quote of the Day</span>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category);
                setTimeout(getRandomQuote, 100);
              }}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Quote Card */}
        <div className="relative perspective-1000">
          <Card className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQuote.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    rotateY: { duration: 0.4 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="text-center"
                >
                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote className="w-12 h-12 mx-auto text-primary/20" />
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed mb-8">
                    &ldquo;{currentQuote.text}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <p className="text-lg font-semibold mt-2">{currentQuote.author}</p>
                    <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                      {currentQuote.category}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 mt-8 pt-8 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getRandomQuote}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Quote
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote count */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          {selectedCategory === "All" 
            ? `${quotes.length} quotes in collection`
            : `${quotes.filter(q => q.category === selectedCategory).length} quotes in ${selectedCategory}`
          }
        </p>
      </div>
    </section>
  );
}
