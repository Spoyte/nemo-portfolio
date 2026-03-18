"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  User,
  Clock,
  Quote,
  Trash2,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  location?: string;
  website?: string;
  likes: number;
  isLiked?: boolean;
}

const initialEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex Chen",
    message: "Love the portfolio! The animations are smooth and the design is clean. Great work! 🎉",
    date: "2025-03-15",
    location: "San Francisco, CA",
    likes: 12,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    message: "Found your portfolio through Twitter. Really impressed with the interactive elements and attention to detail.",
    date: "2025-03-14",
    location: "London, UK",
    likes: 8,
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    message: "The code evolution feature is brilliant! Such a creative way to showcase your work. 👏",
    date: "2025-03-12",
    location: "Madrid, Spain",
    likes: 15,
  },
  {
    id: "4",
    name: "Emily Zhang",
    message: "Your portfolio inspired me to rebuild mine. Thanks for sharing your work with the community!",
    date: "2025-03-10",
    location: "Toronto, Canada",
    likes: 6,
  },
  {
    id: "5",
    name: "David Kim",
    message: "The dark mode implementation is perfect. Love how it respects system preferences too.",
    date: "2025-03-08",
    location: "Seoul, South Korea",
    likes: 9,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    message: "Incredible attention to detail! The micro-interactions make the experience so delightful.",
    date: "2025-03-05",
    location: "Sydney, Australia",
    likes: 11,
  },
];

const quotes = [
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
];

export function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [randomQuote, setRandomQuote] = useState(quotes[0]);

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
      location: location.trim() || undefined,
      likes: 0,
    };

    setEntries([newEntry, ...entries]);
    setName("");
    setMessage("");
    setLocation("");
    setIsSubmitting(false);
    toast.success("Thank you for signing the guestbook! 🎉");
  };

  const handleLike = (id: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const isLiked = !entry.isLiked;
        return {
          ...entry,
          likes: isLiked ? entry.likes + 1 : entry.likes - 1,
          isLiked,
        };
      }
      return entry;
    }));
  };

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(newQuote);
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
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Leave a Message</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Guestbook</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thanks for stopping by! Feel free to leave a message, share your thoughts,
            or just say hello. I'd love to hear from you.
          </p>
        </motion.div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Quote className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-lg font-medium italic">"{randomQuote}""</p>
                  <p className="text-sm text-muted-foreground mt-2">— Programming Wisdom</p>
                </div>
                <Button variant="ghost" size="icon" onClick={refreshQuote}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sign the Guestbook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="City, Country (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea
                    placeholder="Share your thoughts, feedback, or just say hello!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {message.length}/500
                  </p>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
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
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Entries", value: entries.length },
            { label: "Total Likes", value: entries.reduce((acc, e) => acc + e.likes, 0) },
            { label: "Countries", value: new Set(entries.filter(e => e.location).map(e => e.location?.split(",").pop()?.trim())).size },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className="group hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.name}`} />
                        <AvatarFallback>{entry.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{entry.name}</span>
                          {entry.location && (
                            <Badge variant="secondary" className="text-xs">
                              {entry.location}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2">{entry.message}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleLike(entry.id)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-1 transition-colors ${
                                entry.isLiked
                                  ? "fill-red-500 text-red-500"
                                  : "group-hover:text-red-500"
                              }`}
                            />
                            <span className={entry.isLiked ? "text-red-500" : ""}>
                              {entry.likes}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
