"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Clock,
  Calendar,
  Lock,
  Unlock,
  MessageSquare,
  Heart,
  Zap,
  Target,
  Award,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import confetti from "canvas-confetti";

interface TimeCapsule {
  id: string;
  message: string;
  category: "goal" | "reflection" | "prediction" | "gratitude" | "challenge";
  unlockDate: Date;
  createdAt: Date;
  isLocked: boolean;
  mood: string;
  tags: string[];
}

const categories = [
  { value: "goal", label: "🎯 Goal", color: "from-blue-500 to-cyan-500" },
  { value: "reflection", label: "🤔 Reflection", color: "from-purple-500 to-pink-500" },
  { value: "prediction", label: "🔮 Prediction", color: "from-amber-500 to-orange-500" },
  { value: "gratitude", label: "🙏 Gratitude", color: "from-green-500 to-emerald-500" },
  { value: "challenge", label: "💪 Challenge", color: "from-red-500 to-rose-500" },
];

const moods = ["🚀 Excited", "😊 Happy", "🤔 Thoughtful", "😤 Determined", "😌 Peaceful", "🤯 Overwhelmed", "🎉 Celebrating"];

const presetDurations = [
  { label: "1 Week", days: 7 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
  { label: "5 Years", days: 1825 },
];

const encouragementMessages = [
  "Your future self will thank you for this!",
  "Time travel for developers: achieved!",
  "Sealed with intention, to be opened with growth.",
  "A message across time from the developer you are today.",
  "This is going to be an amazing journey!",
];

export function DeveloperTimeCapsule() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<TimeCapsule["category"]>("goal");
  const [mood, setMood] = useState(moods[0]);
  const [unlockDays, setUnlockDays] = useState(30);
  const [customDate, setCustomDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load capsules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("developer-time-capsules");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCapsules(parsed.map((c: TimeCapsule) => ({
        ...c,
        unlockDate: new Date(c.unlockDate),
        createdAt: new Date(c.createdAt),
      })));
    }
  }, []);

  // Save capsules to localStorage
  useEffect(() => {
    localStorage.setItem("developer-time-capsules", JSON.stringify(capsules));
  }, [capsules]);

  // Check for unlocked capsules
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCapsules((prev) =>
        prev.map((capsule) => ({
          ...capsule,
          isLocked: new Date(capsule.unlockDate) > now,
        }))
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const createCapsule = () => {
    if (!message.trim()) return;

    const unlockDate = customDate
      ? new Date(customDate)
      : new Date(Date.now() + unlockDays * 24 * 60 * 60 * 1000);

    const newCapsule: TimeCapsule = {
      id: Date.now().toString(),
      message: message.trim(),
      category,
      unlockDate,
      createdAt: new Date(),
      isLocked: true,
      mood,
      tags: [],
    };

    setCapsules([newCapsule, ...capsules]);
    setMessage("");
    setIsCreating(false);

    // Celebrate!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#dc2626", "#ea580c", "#d97706"],
    });
  };

  const deleteCapsule = (id: string) => {
    setCapsules(capsules.filter((c) => c.id !== id));
    setSelectedCapsule(null);
  };

  const getTimeRemaining = (unlockDate: Date) => {
    const now = new Date();
    const diff = new Date(unlockDate).getTime() - now.getTime();
    
    if (diff <= 0) return "Unlocked! 🔓";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getCategoryColor = (cat: string) => {
    return categories.find((c) => c.value === cat)?.color || "from-gray-500 to-gray-600";
  };

  const getCategoryLabel = (cat: string) => {
    return categories.find((c) => c.value === cat)?.label || cat;
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 mb-6">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time Travel</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Developer{" "}
            <span className="text-gradient-animated">Time Capsule</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Send messages to your future self. Set goals, make predictions, capture gratitude, 
            and watch yourself grow over time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Capsule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Create Time Capsule
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value as TimeCapsule["category"])}
                        className={`p-2 rounded-lg border text-sm transition-all ${
                          category === cat.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Mood</label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Message to Future You</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What do you want to tell your future self? A goal? A prediction? Something you're grateful for?"
                    rows={4}
                  />
                </div>

                {/* Unlock Date */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Unlock Date</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {presetDurations.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setUnlockDays(preset.days);
                          setCustomDate("");
                        }}
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          unlockDays === preset.days && !customDate
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="datetime-local"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Preview Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-muted-foreground"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>

                {/* Preview */}
                <AnimatePresence>
                  {showPreview && message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-muted"
                    >
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <p className="text-sm italic">&ldquo;{message}&rdquo;</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        — {mood} {getCategoryLabel(category)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={createCapsule}
                  disabled={!message.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Seal Time Capsule
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Capsules List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Your Time Capsules</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  {capsules.filter((c) => c.isLocked).length} Locked
                </span>
                <span className="flex items-center gap-1">
                  <Unlock className="h-4 w-4" />
                  {capsules.filter((c) => !c.isLocked).length} Unlocked
                </span>
              </div>
            </div>

            {capsules.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No time capsules yet.</p>
                <p className="text-sm text-muted-foreground">Create your first message to the future!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capsules.map((capsule, index) => (
                  <motion.div
                    key={capsule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`group cursor-pointer transition-all hover:shadow-lg ${
                        !capsule.isLocked ? "border-green-500/50 bg-green-500/5" : ""
                      }`}
                      onClick={() => setSelectedCapsule(capsule)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge
                            variant={capsule.isLocked ? "secondary" : "default"}
                            className={!capsule.isLocked ? "bg-green-500" : ""}
                          >
                            {capsule.isLocked ? (
                              <><Lock className="h-3 w-3 mr-1" /> Locked</>
                            ) : (
                              <><Unlock className="h-3 w-3 mr-1" /> Unlocked</>
                            )}
                          </Badge>
                          <span className="text-lg">{capsule.mood.split(" ")[0]}</span>
                        </div>

                        <p className="font-medium mb-2 line-clamp-2">
                          {capsule.isLocked ? (
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Message sealed until unlock
                            </span>
                          ) : (
                            `"${capsule.message.substring(0, 100)}${capsule.message.length > 100 ? "..." : ""}"`
                          )}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getCategoryColor(capsule.category)} text-white`}>
                            {getCategoryLabel(capsule.category)}
                          </span>
                          <span className="text-muted-foreground">
                            {getTimeRemaining(capsule.unlockDate)}
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created {new Date(capsule.createdAt).toLocaleDateString()}</span>
                          <span>Unlocks {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Capsule Detail Modal */}
        <AnimatePresence>
          {selectedCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedCapsule(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-lg w-full bg-card rounded-2xl border border-border p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedCapsule.mood.split(" ")[0]}</span>
                    <div>
                      <Badge className={`bg-gradient-to-r ${getCategoryColor(selectedCapsule.category)} text-white`}>
                        {getCategoryLabel(selectedCapsule.category)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedCapsule.mood}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCapsule(selectedCapsule.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-muted mb-4">
                  {selectedCapsule.isLocked ? (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">This message is sealed</p>
                      <p className="text-sm text-muted-foreground">
                        Unlocks {new Date(selectedCapsule.unlockDate).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-medium mt-2 text-primary">
                        {getTimeRemaining(selectedCapsule.unlockDate)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg italic mb-4">&ldquo;{selectedCapsule.message}&rdquo;</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created: {new Date(selectedCapsule.createdAt).toLocaleDateString()}</span>
                        <span>Unlocked: {new Date(selectedCapsule.unlockDate).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedCapsule(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
