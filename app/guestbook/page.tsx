"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Send, 
  Sparkles, 
  Heart, 
  MessageCircle,
  User,
  Clock,
  Globe,
  Smile,
  Code2,
  Palette,
  Coffee,
  Music,
  Zap,
  Star,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  emoji: string;
  timestamp: Date;
  location?: string;
  isVisitor?: boolean;
}

const emojis = ["👋", "🔥", "✨", "🚀", "💻", "🎨", "☕", "🎵", "⚡", "⭐", "💖", "🌟"];

const sampleEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex Chen",
    message: "Love the portfolio! The interactive elements are so engaging. Keep up the great work! 🚀",
    emoji: "🚀",
    timestamp: new Date(Date.now() - 86400000 * 2),
    location: "San Francisco, CA"
  },
  {
    id: "2",
    name: "Sarah Miller",
    message: "The Matrix Rain effect is mesmerizing! How did you create that?",
    emoji: "💻",
    timestamp: new Date(Date.now() - 86400000 * 5),
    location: "London, UK"
  },
  {
    id: "3",
    name: "David Kim",
    message: "Your art studio is incredible! The generative pieces are stunning.",
    emoji: "🎨",
    timestamp: new Date(Date.now() - 86400000 * 7),
    location: "Seoul, South Korea"
  },
  {
    id: "4",
    name: "Emma Wilson",
    message: "Just discovered your site through your blog. Amazing content!",
    emoji: "✨",
    timestamp: new Date(Date.now() - 86400000 * 10),
    location: "Toronto, Canada"
  },
  {
    id: "5",
    name: "James Rodriguez",
    message: "The typing race game is addictive! Beat my high score three times already.",
    emoji: "⚡",
    timestamp: new Date(Date.now() - 86400000 * 12),
    location: "Madrid, Spain"
  }
];

const getRandomQuote = () => {
  const quotes = [
    "Leave a message, make my day!",
    "What's on your mind?",
    "Say hello to the world!",
    "Drop some wisdom here...",
    "Share your thoughts!",
    "Leave your mark! 🎨"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(sampleEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      emoji: selectedEmoji,
      timestamp: new Date(),
      location: "Visitor",
      isVisitor: true
    };

    setEntries(prev => [newEntry, ...prev]);
    setName("");
    setMessage("");
    setIsSubmitting(false);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#f97316", "#fbbf24", "#22c55e", "#3b82f6", "#8b5cf6"]
    });
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

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
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Visitor Log</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sign My{" "}
            <span className="text-gradient-animated">Guestbook</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leave a message, share your thoughts, or just say hello! 
            I read every single entry. 💌
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Messages</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{new Set(entries.map(e => e.location).filter(Boolean)).size}</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">∞</p>
              <p className="text-sm text-muted-foreground">Good Vibes</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="p-6 md:p-8 rounded-2xl bg-card border border-border relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Quote className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground italic">{getRandomQuote()}</p>
              </div>

              <div className="space-y-4">
                {/* Name Input */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      maxLength={50}
                    />
                  </div>
                  
                  {/* Emoji Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-12 h-10 rounded-lg border border-input bg-background flex items-center justify-center text-2xl hover:bg-accent transition-colors"
                    >
                      {selectedEmoji}
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute top-full right-0 mt-2 p-3 rounded-xl bg-popover border shadow-lg grid grid-cols-6 gap-2 z-50"
                        >
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setSelectedEmoji(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-xl transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    ref={textareaRef}
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pl-10 min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                    {message.length}/500
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!name.trim() || !message.trim() || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Sign Guestbook
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Messages</h2>
            <Badge variant="outline">{entries.length} entries</Badge>
          </div>

          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 rounded-xl border transition-all ${
                  entry.isVisitor 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-2xl">
                      {entry.emoji}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold">{entry.name}</span>
                      {entry.isVisitor && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          You
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(entry.timestamp)}
                      </span>
                    </div>

                    <p className="text-foreground mb-2">{entry.message}</p>

                    {entry.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {entry.location}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              Thanks for visiting! Come back anytime.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
