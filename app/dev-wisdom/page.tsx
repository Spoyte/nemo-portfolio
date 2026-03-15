"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  Quote, 
  Sparkles, 
  Lightbulb, 
  Bug, 
  Users, 
  Zap,
  RefreshCw,
  Search,
  Share2,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import { toast } from "sonner";

interface WisdomQuote {
  id: string;
  text: string;
  author: string;
  role: string;
  category: "architecture" | "debugging" | "teamwork" | "learning" | "simplicity" | "testing";
  likes: number;
}

const wisdomQuotes: WisdomQuote[] = [
  {
    id: "1",
    text: "Simplicity is the ultimate sophistication. Complex code is a liability, not an asset.",
    author: "Leonardo da Vinci",
    role: "Polymath",
    category: "simplicity",
    likes: 342
  },
  {
    id: "2",
    text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    author: "Brian Kernighan",
    role: "Computer Scientist",
    category: "debugging",
    likes: 891
  },
  {
    id: "3",
    text: "The best code is no code at all. Every line you write is a liability.",
    author: "Jeff Atwood",
    role: "Stack Overflow Co-founder",
    category: "simplicity",
    likes: 567
  },
  {
    id: "4",
    text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    role: "Computer Scientist",
    category: "architecture",
    likes: 723
  },
  {
    id: "5",
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    role: "MIT Professor",
    category: "teamwork",
    likes: 445
  },
  {
    id: "6",
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie",
    role: "Creator of C",
    category: "learning",
    likes: 612
  },
  {
    id: "7",
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    role: "Software Engineer",
    category: "teamwork",
    likes: 789
  },
  {
    id: "8",
    text: "Testing shows the presence, not the absence of bugs.",
    author: "Edsger Dijkstra",
    role: "Computer Scientist",
    category: "testing",
    likes: 398
  },
  {
    id: "9",
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    role: "Software Engineer",
    category: "architecture",
    likes: 556
  },
  {
    id: "10",
    text: "The most damaging phrase in the language is 'It's always been done this way'.",
    author: "Grace Hopper",
    role: "Computer Pioneer",
    category: "learning",
    likes: 934
  },
  {
    id: "11",
    text: "A good programmer is someone who always looks both ways before crossing a one-way street.",
    author: "Doug Linder",
    role: "Systems Administrator",
    category: "testing",
    likes: 445
  },
  {
    id: "12",
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous",
    role: "Developer Humor",
    category: "debugging",
    likes: 667
  },
  {
    id: "13",
    text: "The code you write today will be read by someone else tomorrow. Write it with compassion.",
    author: "Sandi Metz",
    role: "Software Engineer",
    category: "teamwork",
    likes: 523
  },
  {
    id: "14",
    text: "Refactoring is like cleaning your room. It seems pointless until you can't find anything.",
    author: "Kent Beck",
    role: "Extreme Programming Pioneer",
    category: "architecture",
    likes: 478
  },
  {
    id: "15",
    text: "The most important skill in programming is knowing how to Google effectively.",
    author: "Modern Developer",
    role: "Truth Speaker",
    category: "learning",
    likes: 1023
  }
];

const categories = [
  { id: "all", label: "All Wisdom", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { id: "architecture", label: "Architecture", icon: Lightbulb, color: "from-blue-500 to-cyan-500" },
  { id: "debugging", label: "Debugging", icon: Bug, color: "from-red-500 to-orange-500" },
  { id: "teamwork", label: "Teamwork", icon: Users, color: "from-green-500 to-emerald-500" },
  { id: "learning", label: "Learning", icon: Zap, color: "from-yellow-500 to-amber-500" },
  { id: "simplicity", label: "Simplicity", icon: Sparkles, color: "from-violet-500 to-purple-500" },
  { id: "testing", label: "Testing", icon: Check, color: "from-teal-500 to-cyan-500" },
];

function QuoteCard({ quote, onCopy }: { quote: WisdomQuote; onCopy: (text: string) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(quote.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
      toast.success("Added to your favorites!");
    }
  };

  const categoryColors: Record<string, string> = {
    architecture: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    debugging: "from-red-500/20 to-orange-500/20 border-red-500/30",
    teamwork: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    learning: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    simplicity: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    testing: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
  };

  return (
    <motion.div
      className="relative h-80 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br ${categoryColors[quote.category]} border p-6 flex flex-col justify-between`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="capitalize">
                {quote.category}
              </Badge>
              <Quote className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium leading-relaxed line-clamp-6">
              "{quote.text}"
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{quote.author}</p>
              <p className="text-sm text-muted-foreground">{quote.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleLike}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${isLiked ? "text-red-500 bg-red-500/10" : "hover:bg-muted"}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </motion.button>
              <span className="text-sm text-muted-foreground">{likes}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br ${categoryColors[quote.category]} border p-6 flex flex-col items-center justify-center text-center`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Quote className="w-12 h-12 mb-4 text-primary/50" />
          <p className="text-lg font-medium mb-6 italic">"{quote.text}"</p>
          <p className="text-sm text-muted-foreground mb-6">— {quote.author}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(`"${quote.text}" — ${quote.author}`);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: "Dev Wisdom",
                    text: `"${quote.text}" — ${quote.author}`,
                  });
                } else {
                  onCopy(`"${quote.text}" — ${quote.author}`);
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DevWisdomPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState(wisdomQuotes);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let filtered = wisdomQuotes;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredQuotes(filtered);
  }, [selectedCategory, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Quote copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRandom = () => {
    const random = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
    handleCopy(`"${random.text}" — ${random.author}`);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Timeless Wisdom</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Dev{" "}
            <span className="text-gradient-animated">Wisdom</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A curated collection of insights from the greatest minds in software development. 
            Click cards to flip and reveal more.
          </p>
        </ScrollReveal>

        {/* Search and Filter */}
        <ScrollReveal delay={0.1} className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleRandom}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Random Quote
            </Button>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={0.2} className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:border-primary/50"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.3} className="mb-12">
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{wisdomQuotes.length}</p>
              <p className="text-sm text-muted-foreground">Quotes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">
                {wisdomQuotes.reduce((acc, q) => acc + q.likes, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Quotes Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredQuotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <QuoteCard quote={quote} onCopy={handleCopy} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredQuotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Quote className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-xl text-muted-foreground">No quotes found matching your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Footer Note */}
        <ScrollReveal delay={0.4} className="mt-16 text-center">
          <p className="text-muted-foreground">
            Wisdom is the reward you get for a lifetime of listening when you'd have preferred to talk."
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">— Doug Larson</p>
        </ScrollReveal>
      </div>
    </div>
  );
}
