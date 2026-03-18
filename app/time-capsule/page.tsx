"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Lock,
  Unlock,
  Calendar,
  Send,
  Trash2,
  Sparkles,
  Hourglass,
  Mail,
  Archive,
  Heart,
  Zap,
  ChevronRight,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TimeCapsule {
  id: string;
  message: string;
  createdAt: string;
  openAt: string;
  isOpened: boolean;
  openedAt?: string;
  mood: "hopeful" | "grateful" | "excited" | "reflective" | "determined";
  category: "goal" | "memory" | "promise" | "dream" | "lesson";
}

const moods = [
  { id: "hopeful", label: "Hopeful", emoji: "🌱", color: "from-green-400 to-emerald-500" },
  { id: "grateful", label: "Grateful", emoji: "🙏", color: "from-yellow-400 to-orange-500" },
  { id: "excited", label: "Excited", emoji: "⚡", color: "from-purple-400 to-pink-500" },
  { id: "reflective", label: "Reflective", emoji: "🌙", color: "from-blue-400 to-indigo-500" },
  { id: "determined", label: "Determined", emoji: "🔥", color: "from-red-400 to-rose-500" },
] as const;

const categories = [
  { id: "goal", label: "Goal", icon: TargetIcon },
  { id: "memory", label: "Memory", icon: Heart },
  { id: "promise", label: "Promise", icon: Lock },
  { id: "dream", label: "Dream", icon: Sparkles },
  { id: "lesson", label: "Lesson", icon: Zap },
] as const;

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

const presetDurations = [
  { label: "1 Week", days: 7 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
];

export default function TimeCapsulePage() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMood, setSelectedMood] = useState<TimeCapsule["mood"]>("hopeful");
  const [selectedCategory, setSelectedCategory] = useState<TimeCapsule["category"]>("goal");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [customDate, setCustomDate] = useState("");
  const [activeTab, setActiveTab] = useState<"sealed" | "opened">("sealed");
  const [openingCapsule, setOpeningCapsule] = useState<string | null>(null);

  // Load capsules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("time-capsules");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if any capsules should be opened
      const now = new Date().toISOString();
      const updated = parsed.map((c: TimeCapsule) => ({
        ...c,
        isOpened: c.isOpened || new Date(c.openAt) <= new Date(now),
      }));
      setCapsules(updated);
    }
  }, []);

  // Save capsules to localStorage
  useEffect(() => {
    localStorage.setItem("time-capsules", JSON.stringify(capsules));
  }, [capsules]);

  // Check for capsules that should be opened
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCapsules((prev) =>
        prev.map((c) => {
          if (!c.isOpened && new Date(c.openAt) <= now) {
            toast.info(`A time capsule is ready to open!`, {
              icon: <Unlock className="w-4 h-4" />,
            });
            return { ...c, isOpened: true };
          }
          return c;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleCreate = () => {
    if (!newMessage.trim()) {
      toast.error("Please write a message");
      return;
    }

    const openAt = customDate
      ? new Date(customDate).toISOString()
      : new Date(Date.now() + selectedDuration * 24 * 60 * 60 * 1000).toISOString();

    const capsule: TimeCapsule = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      openAt,
      isOpened: false,
      mood: selectedMood,
      category: selectedCategory,
    };

    setCapsules((prev) => [capsule, ...prev]);
    setNewMessage("");
    setIsCreating(false);
    toast.success("Time capsule sealed! 🔒");
  };

  const handleOpen = (id: string) => {
    setOpeningCapsule(id);
    setTimeout(() => {
      setCapsules((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, isOpened: true, openedAt: new Date().toISOString() }
            : c
        )
      );
      setOpeningCapsule(null);
      toast.success("Time capsule opened! 📬");
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
    toast.success("Time capsule deleted");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = (openAt: string) => {
    const diff = new Date(openAt).getTime() - Date.now();
    if (diff <= 0) return "Ready to open!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const sealedCapsules = capsules.filter((c) => !c.isOpened);
  const openedCapsules = capsules.filter((c) => c.isOpened);

  const currentMood = moods.find((m) => m.id === selectedMood);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Hourglass className="w-4 h-4" />
            <span className="text-sm font-medium">Messages Through Time</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Time <span className="text-gradient-animated">Capsule</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Write messages to your future self. Seal them with a date. Open them when the time is right.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary">{capsules.length}</p>
              <p className="text-sm text-muted-foreground">Total Capsules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-orange-500">{sealedCapsules.length}</p>
              <p className="text-sm text-muted-foreground">Sealed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-green-500">{openedCapsules.length}</p>
              <p className="text-sm text-muted-foreground">Opened</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <Button size="lg" onClick={() => setIsCreating(true)} className="gap-2">
            <Archive className="w-5 h-5" />
            Create New Capsule
          </Button>
        </motion.div>

        {/* Create Modal */}
        <AnimatePresence>
          {isCreating && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreating(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
              >
                <Card className="w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-primary" />
                      Create Time Capsule
                    </CardTitle>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message to Your Future Self
                      </label>
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Dear future me..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    {/* Mood Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                      <div className="grid grid-cols-5 gap-2">
                        {moods.map((mood) => (
                          <button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood.id)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              selectedMood === mood.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-2xl">{mood.emoji}</span>
                            <p className="text-xs mt-1">{mood.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">What is this about?</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                              selectedCategory === cat.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        When should this open?
                      </label>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {presetDurations.map((duration) => (
                          <button
                            key={duration.label}
                            onClick={() => {
                              setSelectedDuration(duration.days);
                              setCustomDate("");
                            }}
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              selectedDuration === duration.days && !customDate
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {duration.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Or pick a date:</span>
                        <Input
                          type="datetime-local"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${currentMood?.color} bg-opacity-10 border border-white/20`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{currentMood?.emoji}</span>
                        <Badge variant="secondary" className="capitalize">
                          {selectedCategory}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-3">
                        {newMessage || "Your message will appear here..."}
                      </p>
                      <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Opens: {customDate ? formatDate(customDate) : formatDate(new Date(Date.now() + selectedDuration * 24 * 60 * 60 * 1000).toISOString())}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setIsCreating(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1 gap-2" onClick={handleCreate}>
                        <Lock className="w-4 h-4" />
                        Seal Capsule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab("sealed")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === "sealed"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Sealed ({sealedCapsules.length})
          </button>
          <button
            onClick={() => setActiveTab("opened")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === "opened"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Opened ({openedCapsules.length})
          </button>
        </motion.div>

        {/* Capsules Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {(activeTab === "sealed" ? sealedCapsules : openedCapsules).map((capsule) => {
              const mood = moods.find((m) => m.id === capsule.mood);
              const category = categories.find((c) => c.id === capsule.category);
              const isOpening = openingCapsule === capsule.id;

              return (
                <motion.div
                  key={capsule.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card
                    className={`overflow-hidden transition-all ${
                      capsule.isOpened ? "border-green-500/30" : "border-orange-500/30"
                    }`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${mood?.color}`} />
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{mood?.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                <category.icon className="w-3 h-3 mr-1" />
                                {capsule.category}
                              </Badge>
                              {capsule.isOpened ? (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Opened
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Sealed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(capsule.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Message */}
                      <div className="mb-4">
                        {capsule.isOpened ? (
                          <p className="text-foreground whitespace-pre-wrap">{capsule.message}</p>
                        ) : (
                          <div className="flex items-center justify-center py-8 bg-muted/50 rounded-xl">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">This message is sealed</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {formatDate(capsule.createdAt)}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            Opens: {formatDate(capsule.openAt)}
                          </p>
                        </div>

                        {!capsule.isOpened && (
                          <Button
                            size="sm"
                            onClick={() => handleOpen(capsule.id)}
                            disabled={isOpening}
                            className="gap-1"
                          >
                            {isOpening ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Sparkles className="w-4 h-4" />
                                </motion.div>
                                Opening...
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                Open
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Time Remaining */}
                      {!capsule.isOpened && (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium text-center">
                            {getTimeRemaining(capsule.openAt)}
                          </p>
                        </div>
                      )}

                      {/* Opened Info */}
                      {capsule.isOpened && capsule.openedAt && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10">
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Opened on {formatDate(capsule.openedAt)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {(activeTab === "sealed" ? sealedCapsules : openedCapsules).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {activeTab === "sealed"
                ? "No sealed capsules. Create one to get started!"
                : "No opened capsules yet. Come back later!"}
            </p>
          </motion.div>
        )}

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-lg italic text-muted-foreground">
            &ldquo;The best time to plant a tree was 20 years ago. The second best time is now.&rdquo;
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2">— Chinese Proverb</cite>
        </motion.div>
      </div>
    </div>
  );
}
