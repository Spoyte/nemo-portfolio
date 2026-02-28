"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Send, 
  Heart, 
  MessageCircle, 
  Sparkles,
  User,
  Clock,
  Trash2,
  RefreshCw,
  Github,
  Twitter,
  Globe,
  Palette,
  Code2,
  Coffee
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
  avatar?: string;
  website?: string;
  github?: string;
  twitter?: string;
  mood: "happy" | "excited" | "curious" | "inspired" | "grateful";
  color: string;
}

const moodConfig = {
  happy: { icon: "😊", label: "Happy", color: "bg-yellow-500/20 text-yellow-600" },
  excited: { icon: "🤩", label: "Excited", color: "bg-pink-500/20 text-pink-600" },
  curious: { icon: "🤔", label: "Curious", color: "bg-blue-500/20 text-blue-600" },
  inspired: { icon: "✨", label: "Inspired", color: "bg-purple-500/20 text-purple-600" },
  grateful: { icon: "🙏", label: "Grateful", color: "bg-green-500/20 text-green-600" },
};

const avatarColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

// Sample entries for demo
const sampleEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex Chen",
    message: "Absolutely blown away by the Code Cinema feature! The visualizations are mesmerizing. Keep up the amazing work! 🎬",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    mood: "excited",
    color: avatarColors[0],
    github: "alexchen",
    website: "https://alexchen.dev",
  },
  {
    id: "2",
    name: "Sarah Miller",
    message: "Your portfolio is an inspiration! The attention to detail and interactive elements are incredible. Learning so much from your code.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    mood: "inspired",
    color: avatarColors[5],
    twitter: "sarahcodes",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    message: "Just discovered the Konami code easter egg! Love the little surprises hidden throughout the site. 🎮",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    mood: "happy",
    color: avatarColors[8],
    github: "mjohnson",
  },
  {
    id: "4",
    name: "Yuki Tanaka",
    message: "The timeline visualization is so clean and informative. Would love to see a tutorial on how you built it!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    mood: "curious",
    color: avatarColors[11],
    website: "https://yuki.dev",
  },
  {
    id: "5",
    name: "Emma Wilson",
    message: "Thanks for sharing your journey and insights. Your blog posts have been incredibly helpful for my own development career.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    mood: "grateful",
    color: avatarColors[3],
    twitter: "emmawilson",
  },
];

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          {["✨", "💫", "⭐", "🌟", "📝", "💭", "🎨", "💻"][Math.floor(Math.random() * 8)]}
        </motion.div>
      ))}
    </div>
  );
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(sampleEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [selectedMood, setSelectedMood] = useState<GuestbookEntry["mood"]>("happy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date(),
      mood: selectedMood,
      color: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      website: website.trim() || undefined,
      github: github.trim() || undefined,
      twitter: twitter.trim() || undefined,
    };

    setEntries([newEntry, ...entries]);
    setName("");
    setMessage("");
    setWebsite("");
    setGithub("");
    setTwitter("");
    setIsSubmitting(false);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const stats = {
    total: entries.length,
    today: entries.filter((e) => {
      const today = new Date();
      const entryDate = new Date(e.timestamp);
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    }).length,
    moods: entries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <AnimatedBackground />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Visitor Guestbook</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Leave a <span className="text-gradient">Message</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sign my digital guestbook! Share your thoughts, feedback, or just say hello. 
            I love hearing from fellow developers and visitors.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{stats.today}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{Object.keys(stats.moods).length}</p>
              <p className="text-xs text-muted-foreground">Different Moods</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">∞</p>
              <p className="text-xs text-muted-foreground">Appreciation</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Write Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Button
            size="lg"
            onClick={() => setShowForm(!showForm)}
            className="group"
          >
            <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
            {showForm ? "Cancel" : "Write a Message"}
          </Button>
        </motion.div>

        {/* Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Write Your Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name *</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
                        <div className="flex gap-2">
                          {(Object.keys(moodConfig) as GuestbookEntry["mood"][]).map((mood) => (
                            <button
                              key={mood}
                              type="button"
                              onClick={() => setSelectedMood(mood)}
                              className={`p-2 rounded-lg transition-all ${
                                selectedMood === mood
                                  ? "bg-primary/20 ring-2 ring-primary"
                                  : "hover:bg-muted"
                              }`}
                              title={moodConfig[mood].label}
                            >
                              <span className="text-xl">{moodConfig[mood].icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Message *</label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your thoughts, feedback, or just say hello!"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Website
                        </label>
                        <Input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://your-site.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                          <Github className="h-3 w-3" />
                          GitHub
                        </label>
                        <Input
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                          <Twitter className="h-3 w-3" />
                          Twitter
                        </label>
                        <Input
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !name.trim() || !message.trim()}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Sign Guestbook
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className={`h-12 w-12 ${entry.color}`}>
                        <AvatarFallback className="text-white font-bold text-lg">
                          {entry.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{entry.name}</h3>
                          <Badge variant="secondary" className={moodConfig[entry.mood].color}>
                            <span className="mr-1">{moodConfig[entry.mood].icon}</span>
                            {moodConfig[entry.mood].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {getTimeAgo(entry.timestamp)}
                          </span>
                        </div>
                        
                        <p className="mt-2 text-muted-foreground">{entry.message}</p>
                        
                        {/* Social Links */}
                        {(entry.website || entry.github || entry.twitter) && (
                          <div className="flex items-center gap-2 mt-3">
                            {entry.website && (
                              <a
                                href={entry.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Globe className="h-3 w-3" />
                                Website
                              </a>
                            )}
                            {entry.github && (
                              <a
                                href={`https://github.com/${entry.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Github className="h-3 w-3" />
                                @{entry.github}
                              </a>
                            )}
                            {entry.twitter && (
                              <a
                                href={`https://twitter.com/${entry.twitter.replace("@", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Twitter className="h-3 w-3" />
                                {entry.twitter.startsWith("@") ? entry.twitter : `@${entry.twitter}`}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete button (only for demo - would need auth in production) */}
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground">Be the first to sign the guestbook!</p>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            <Coffee className="h-4 w-4" />
            Thanks for visiting! Your messages mean a lot.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
