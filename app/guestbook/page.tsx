"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Heart, 
  Trash2,
  User,
  Clock,
  RefreshCw,
  Smile,
  Zap,
  Globe,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

// Sample guestbook entries
const initialEntries = [
  {
    id: "1",
    name: "Alex Chen",
    message: "Love the portfolio! The animations are so smooth 🔥",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 12,
    location: "San Francisco, CA",
    color: "#3b82f6"
  },
  {
    id: "2",
    name: "Sarah Miller",
    message: "The Code Cinema feature is incredible! Such a creative way to showcase code.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 8,
    location: "London, UK",
    color: "#ec4899"
  },
  {
    id: "3",
    name: "James Wilson",
    message: "Found you through GitHub. Amazing work on the open source projects!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 15,
    location: "Toronto, Canada",
    color: "#22c55e"
  },
  {
    id: "4",
    name: "Emma Davis",
    message: "The holographic business card is genius! ✨",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    likes: 23,
    location: "Sydney, Australia",
    color: "#f59e0b"
  },
  {
    id: "5",
    name: "Michael Park",
    message: "Your journey timeline really inspired me. Keep building amazing things!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    likes: 6,
    location: "Seoul, South Korea",
    color: "#8b5cf6"
  }
];

// Entry type
interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
  likes: number;
  location?: string;
  color: string;
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Get random color for avatar
function getRandomColor(): string {
  const colors = ["#3b82f6", "#ec4899", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Avatar component
function Avatar({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <motion.div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
    >
      {initial}
    </motion.div>
  );
}

// Entry card component
function EntryCard({ 
  entry, 
  onLike, 
  isNew = false 
}: { 
  entry: GuestbookEntry; 
  onLike: (id: string) => void;
  isNew?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  
  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike(entry.id);
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.8 },
        colors: [entry.color]
      });
    }
  };

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.8, y: 20 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className="group"
    >
      <Card className="hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar name={entry.name} color={entry.color} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{entry.name}</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" /
                  {formatRelativeTime(entry.timestamp)}
                </span>
                {entry.location && (
                  <>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                      <Globe className="w-3 h-3" /
                      {entry.location}
                    </span>
                  </>
                )}
              </div>
              
              <p className="text-foreground mb-3">{entry.message}</p>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span>{entry.likes + (liked ? 1 : 0)}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Entry form component
function EntryForm({ onSubmit }: { onSubmit: (name: string, message: string) => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(name.trim(), message.trim());
    
    // Reset form
    setName("");
    setMessage("");
    setIsSubmitting(false);
    
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#ec4899", "#22c55e", "#f59e0b", "#8b5cf6"]
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Sign the Guestbook
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-full"
            />
          </div>
          
          <div className="relative">
            <Input
              placeholder="Leave a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              className="w-full pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {message.length}/280
            </span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!name.trim() || !message.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Sign Guestbook
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Stats component
function GuestbookStats({ entries }: { entries: GuestbookEntry[] }) {
  const totalLikes = entries.reduce((sum, e) => sum + e.likes, 0);
  const uniqueLocations = new Set(entries.map(e => e.location).filter(Boolean)).size;
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: "Entries", value: entries.length, icon: MessageSquare },
        { label: "Likes", value: totalLikes, icon: Heart },
        { label: "Locations", value: uniqueLocations || 1, icon: Globe }
      ].map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Live indicator component
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>Live updates enabled</span>
    </div>
  );
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  
  const handleSubmit = (name: string, message: string) => {
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name,
      message,
      timestamp: new Date(),
      likes: 0,
      location: "Earth 🌍",
      color: getRandomColor()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setNewEntryId(newEntry.id);
    
    // Clear highlight after animation
    setTimeout(() => setNewEntryId(null), 1000);
  };
  
  const handleLike = (id: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, likes: entry.likes + 1 }
          : entry
      )
    );
  };
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update timestamps to keep "relative time" fresh
      setEntries(prev => [...prev]);
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-sm font-medium">Visitor Messages</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Guestbook</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leave a message, share your thoughts, or just say hi! 
            This is a living collection of messages from visitors around the world.
          </p>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GuestbookStats entries={entries} />
        </motion.div>
        
        {/* Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <EntryForm onSubmit={handleSubmit} />
        </motion.div>
        
        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <LiveIndicator />
        </motion.div>
        
        {/* Entries */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <EntryCard 
                key={entry.id} 
                entry={entry} 
                onLike={handleLike}
                isNew={entry.id === newEntryId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No entries yet. Be the first to sign! ✨</p>
          </motion.div>
        )}
        
        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💌 Messages are moderated and stored locally for this demo.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
