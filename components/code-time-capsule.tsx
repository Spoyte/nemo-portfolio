"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TimeCapsule,
  Send,
  Clock,
  Users,
  MessageSquare,
  Calendar,
  Lock,
  Unlock,
  Sparkles,
  History,
  Trash2,
  Heart,
  Share2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-animations";
import confetti from "canvas-confetti";

interface CapsuleMessage {
  id: string;
  author: string;
  message: string;
  timestamp: number;
  unlockDate: number;
  isPublic: boolean;
  likes: number;
  tags: string[];
  isUnlocked: boolean;
}

const TAGS = ["Advice", "Prediction", "Memory", "Joke", "Wisdom", "Bug Report", "Feature Request"];

const SAMPLE_MESSAGES: CapsuleMessage[] = [
  {
    id: "1",
    author: "FutureDev_2027",
    message: "Remember when CSS was hard? Now we have AI that writes it for us. Those were the days!",
    timestamp: Date.now() - 86400000 * 30,
    unlockDate: Date.now() - 86400000 * 5,
    isPublic: true,
    likes: 42,
    tags: ["Prediction", "Wisdom"],
    isUnlocked: true
  },
  {
    id: "2",
    author: "CodeExplorer",
    message: "To whoever finds this: Keep learning, keep building. The best code is the code that ships.",
    timestamp: Date.now() - 86400000 * 60,
    unlockDate: Date.now() - 86400000 * 10,
    isPublic: true,
    likes: 128,
    tags: ["Advice", "Wisdom"],
    isUnlocked: true
  },
  {
    id: "3",
    author: "Anonymous",
    message: "The secret to debugging is knowing that the bug is always in the last place you look.",
    timestamp: Date.now() - 86400000 * 15,
    unlockDate: Date.now(),
    isPublic: true,
    likes: 67,
    tags: ["Joke", "Wisdom"],
    isUnlocked: true
  }
];

export function CodeTimeCapsule() {
  const [messages, setMessages] = useState<CapsuleMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [unlockDelay, setUnlockDelay] = useState(7); // days
  const [isPublic, setIsPublic] = useState(true);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    if (!newMessage.trim() || !author.trim()) return;

    const capsule: CapsuleMessage = {
      id: Date.now().toString(),
      author: author.trim(),
      message: newMessage.trim(),
      timestamp: Date.now(),
      unlockDate: Date.now() + unlockDelay * 86400000,
      isPublic,
      likes: 0,
      tags: selectedTags.length > 0 ? selectedTags : ["Memory"],
      isUnlocked: false
    };

    setMessages(prev => [capsule, ...prev]);
    setNewMessage("");
    setAuthor("");
    setSelectedTags([]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#fbbf24"]
    });
  }, [newMessage, author, selectedTags, unlockDelay, isPublic]);

  const handleLike = useCallback((id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === "unlocked") return msg.isUnlocked || msg.unlockDate <= Date.now();
    if (filter === "locked") return !msg.isUnlocked && msg.unlockDate > Date.now();
    return true;
  }).filter(msg => {
    if (!selectedTagFilter) return true;
    return msg.tags.includes(selectedTagFilter);
  });

  const unlockedCount = messages.filter(m => m.isUnlocked || m.unlockDate <= Date.now()).length;
  const lockedCount = messages.filter(m => !m.isUnlocked && m.unlockDate > Date.now()).length;

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <TimeCapsule className="h-4 w-4" />
            <span className="text-sm font-medium">Leave Your Mark</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code{" "}
            <span className="text-gradient-animated">Time Capsule</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leave a message for future visitors. Lock it for days, weeks, or months. 
            Share wisdom, predictions, or just say hello to the future.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Create Capsule Form */}
          <ScrollReveal direction="left">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Create a Capsule</h3>
                  <p className="text-sm text-muted-foreground">Send a message through time</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <Input
                    placeholder="FutureDeveloper_2030"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Message</label>
                  <Textarea
                    placeholder="Share advice, a prediction, a joke, or wisdom for future visitors..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="bg-background resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTags(prev => 
                          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        )}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Unlock After</label>
                  <div className="flex gap-2">
                    {[1, 7, 30, 90, 365].map(days => (
                      <button
                        key={days}
                        onClick={() => setUnlockDelay(days)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          unlockDelay === days
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {days === 1 ? "1 day" : days === 365 ? "1 year" : `${days} days`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className="flex items-center gap-2 text-sm"
                  >
                    {isPublic ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    <span>{isPublic ? "Public - Anyone can read" : "Private - Only you can read"}</span>
                  </button>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!newMessage.trim() || !author.trim()}
                  className="w-full"
                >
                  <TimeCapsule className="mr-2 h-4 w-4" />
                  Seal & Send to the Future
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Stats & Info */}
          <ScrollReveal direction="right">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <History className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-xs text-muted-foreground">Total Capsules</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <Unlock className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{unlockedCount}</p>
                  <p className="text-xs text-muted-foreground">Unlocked</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border text-center">
                  <Lock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{lockedCount}</p>
                  <p className="text-xs text-muted-foreground">Sealed</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-border">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  How It Works
                </h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    Write a message and choose when it unlocks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    Your capsule is sealed and stored securely
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    Future visitors will discover your wisdom
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">4.</span>
                    Earn achievements for popular capsules!
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Messages List */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold">Recent Capsules</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {(["all", "unlocked", "locked"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      filter === f
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <select
                value={selectedTagFilter || ""}
                onChange={(e) => setSelectedTagFilter(e.target.value || null)}
                className="px-3 py-1 rounded-lg bg-muted text-sm border-0"
              >
                <option value="">All Tags</option>
                {TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  {/* Lock Status */}
                  <div className="absolute top-4 right-4">
                    {message.unlockDate > Date.now() ? (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                        <Lock className="w-3 h-3 mr-1" />
                        {Math.ceil((message.unlockDate - Date.now()) / 86400000)}d
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <Unlock className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold">
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{message.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {message.message}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {message.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={() => handleLike(message.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${message.likes > 0 ? "fill-primary text-primary" : ""}`} />
                      {message.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
