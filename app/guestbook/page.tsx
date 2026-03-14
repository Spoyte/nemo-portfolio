"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Quote, 
  Plus, 
  X,
  Send,
  Heart,
  Calendar,
  User,
  Sparkles,
  Filter,
  Search,
  Trash2,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/scroll-animations";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  likes: number;
  avatar: string;
  tags: string[];
}

const initialEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex Chen",
    message: "Absolutely love the design and animations! The attention to detail is incredible. The dark mode transition is so smooth!",
    date: "2025-03-10",
    likes: 12,
    avatar: "AC",
    tags: ["design", "appreciation"]
  },
  {
    id: "2",
    name: "Sarah Miller",
    message: "The Code Cinema feature is genius! Watching code being typed out is oddly satisfying. Would love to see more programming languages added.",
    date: "2025-03-08",
    likes: 8,
    avatar: "SM",
    tags: ["feature", "feedback"]
  },
  {
    id: "3",
    name: "David Park",
    message: "Your portfolio inspired me to rebuild mine. The skills galaxy visualization is such a creative way to showcase expertise!",
    date: "2025-03-05",
    likes: 15,
    avatar: "DP",
    tags: ["inspiration"]
  },
  {
    id: "4",
    name: "Emma Wilson",
    message: "The mini games section is so fun! I spent way too much time on the typing race. Great work on the UX throughout the site.",
    date: "2025-03-03",
    likes: 6,
    avatar: "EW",
    tags: ["games", "ux"]
  },
  {
    id: "5",
    name: "James Lee",
    message: "Found this through your blog post on Next.js 14. The implementation details you shared were super helpful. Thanks for open sourcing your approach!",
    date: "2025-03-01",
    likes: 10,
    avatar: "JL",
    tags: ["blog", "thanks"]
  }
];

const tagColors: Record<string, string> = {
  design: "bg-pink-500/10 text-pink-500",
  appreciation: "bg-green-500/10 text-green-500",
  feature: "bg-blue-500/10 text-blue-500",
  feedback: "bg-yellow-500/10 text-yellow-500",
  inspiration: "bg-purple-500/10 text-purple-500",
  games: "bg-orange-500/10 text-orange-500",
  ux: "bg-cyan-500/10 text-cyan-500",
  blog: "bg-red-500/10 text-red-500",
  thanks: "bg-emerald-500/10 text-emerald-500"
};

function EntryCard({ 
  entry, 
  onLike, 
  onDelete 
}: { 
  entry: GuestbookEntry; 
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(entry.id);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-6 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-primary-foreground font-bold text-sm">
            {entry.avatar}
          </div>
          <div>
            <p className="font-semibold">{entry.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {entry.date}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(entry.id)}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">{entry.message}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {entry.tags.map(tag => (
            <span 
              key={tag} 
              className={`px-2 py-1 rounded-full text-xs ${tagColors[tag] || "bg-muted"}`}
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition-colors ${
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{entry.likes + (isLiked ? 1 : 0)}</span>
        </button>
      </div>
    </motion.div>
  );
}

function AddEntryModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (entry: Omit<GuestbookEntry, "id" | "date" | "likes">) => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const availableTags = ["design", "appreciation", "feature", "feedback", "inspiration", "games", "ux", "blog", "thanks"];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    onAdd({
      name: name.trim(),
      message: message.trim(),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      tags: selectedTags
    });
    
    setName("");
    setMessage("");
    setSelectedTags([]);
    onClose();
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="w-full max-w-lg mx-4 p-6 rounded-2xl bg-card border border-border shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Sign the Guestbook
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedTags.includes(tag)
                            ? tagColors[tag]
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Send className="w-4 h-4" />
                    Sign
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = 
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.likes - a.likes;
    });
  
  const allTags = Array.from(new Set(entries.flatMap(e => e.tags)));
  
  const handleAddEntry = (newEntry: Omit<GuestbookEntry, "id" | "date" | "likes">) => {
    const entry: GuestbookEntry = {
      ...newEntry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    setEntries(prev => [entry, ...prev]);
  };
  
  const handleLike = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, likes: entry.likes + 1 }
        : entry
    ));
  };
  
  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Visitor Messages</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Guest<span className="text-gradient-animated">book</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leave a message, share your thoughts, or just say hi! 
            This is a living collection of visitor experiences.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Messages</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">
                {entries.reduce((acc, e) => acc + e.likes, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-bold text-primary">{allTags.length}</p>
              <p className="text-sm text-muted-foreground">Tags</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Controls */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("newest")}
              >
                Newest
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                Popular
              </Button>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Sign
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tags Filter */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedTag === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedTag === tag
                    ? tagColors[tag]
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Entries */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No messages found.</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedTag(null); }}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Quote */}
        <ScrollReveal className="mt-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border text-center">
            <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
            <blockquote className="text-lg italic text-muted-foreground mb-4">
              "The best way to predict the future is to create it."
            </blockquote>
            <cite className="text-sm text-muted-foreground">— Peter Drucker</cite>
          </div>
        </ScrollReveal>
      </div>
      
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
}
