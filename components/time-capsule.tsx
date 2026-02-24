"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Clock, 
  Calendar,
  Lock,
  Unlock,
  Trash2,
  Archive,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Rocket,
  Quote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TimeCapsule {
  id: string;
  content: string;
  category: "goal" | "reflection" | "prediction" | "message";
  unlockDate: Date;
  createdAt: Date;
  isUnlocked: boolean;
  mood: "excited" | "hopeful" | "curious" | "determined";
}

const CATEGORIES = {
  goal: { label: "Goal", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  reflection: { label: "Reflection", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
  prediction: { label: "Prediction", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
  message: { label: "Message", icon: Quote, color: "text-blue-500", bg: "bg-blue-500/10" },
};

const MOODS = {
  excited: { label: "Excited", emoji: "🚀", color: "bg-orange-500" },
  hopeful: { label: "Hopeful", emoji: "🌱", color: "bg-emerald-500" },
  curious: { label: "Curious", emoji: "🔮", color: "bg-purple-500" },
  determined: { label: "Determined", emoji: "💪", color: "bg-red-500" },
};

// Sample capsules for demo
const SAMPLE_CAPSULES: TimeCapsule[] = [
  {
    id: "1",
    content: "I hope I've shipped at least 3 major features to the portfolio by now. Keep pushing!",
    category: "goal",
    unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    isUnlocked: false,
    mood: "determined",
  },
  {
    id: "2",
    content: "Remember why you started this journey. The late nights, the learning curves - it's all worth it.",
    category: "reflection",
    unlockDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Already unlocked
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    isUnlocked: true,
    mood: "hopeful",
  },
  {
    id: "3",
    content: "AI-assisted development will be the norm. I predict I'll be using AI for 50% of my coding by now.",
    category: "prediction",
    unlockDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isUnlocked: false,
    mood: "curious",
  },
  {
    id: "4",
    content: "Future me: Don't forget to take breaks. Burnout helps no one. Go for a walk!",
    category: "message",
    unlockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    isUnlocked: true,
    mood: "excited",
  },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 justify-center">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-muted rounded-lg p-2 min-w-[50px]">
            <span className="text-xl font-bold tabular-nums">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function CapsuleCard({ capsule, onDelete }: { capsule: TimeCapsule; onDelete: (id: string) => void }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const category = CATEGORIES[capsule.category];
  const mood = MOODS[capsule.mood];
  const CategoryIcon = category.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 ${
        capsule.isUnlocked ? 'border-primary/50' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${category.bg}`}>
                <CategoryIcon className={`h-4 w-4 ${category.color}`} />
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg" title={`Mood: ${mood.label}`}>
                {mood.emoji}
              </span>
              {capsule.isUnlocked ? (
                <Unlock className="h-4 w-4 text-emerald-500" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {capsule.isUnlocked ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-lg leading-relaxed italic">
                "{capsule.content}"
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(capsule.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Unlocked {new Date(capsule.unlockDate).toLocaleDateString()}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={() => onDelete(capsule.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  This capsule is sealed until
                </p>
                <p className="font-semibold">
                  {new Date(capsule.unlockDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Unlocking in:
                </p>
                <CountdownTimer targetDate={new Date(capsule.unlockDate)} />
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Created {new Date(capsule.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TimeCapsuleFeature() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>(SAMPLE_CAPSULES);
  const [newCapsule, setNewCapsule] = useState({
    content: "",
    category: "goal" as const,
    unlockInDays: 30,
    mood: "hopeful" as const,
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateCapsule = () => {
    if (!newCapsule.content.trim()) return;

    const capsule: TimeCapsule = {
      id: Date.now().toString(),
      content: newCapsule.content,
      category: newCapsule.category,
      unlockDate: new Date(Date.now() + newCapsule.unlockInDays * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      isUnlocked: false,
      mood: newCapsule.mood,
    };

    setCapsules([capsule, ...capsules]);
    setNewCapsule({
      content: "",
      category: "goal",
      unlockInDays: 30,
      mood: "hopeful",
    });
    setShowCreateDialog(false);
  };

  const handleDeleteCapsule = (id: string) => {
    setCapsules(capsules.filter(c => c.id !== id));
  };

  const unlockedCapsules = capsules.filter(c => c.isUnlocked);
  const lockedCapsules = capsules.filter(c => !c.isUnlocked);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" />
            Time Capsule
          </h2>
          <p className="text-muted-foreground">
            Send messages to your future self. Goals, reflections, predictions - sealed until their time.
          </p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Send className="h-4 w-4" />
          Create Capsule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{capsules.length}</p>
            <p className="text-sm text-muted-foreground">Total Capsules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">{unlockedCapsules.length}</p>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">{lockedCapsules.length}</p>
            <p className="text-sm text-muted-foreground">Sealed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">
              {Math.max(...capsules.map(c => 
                Math.ceil((new Date(c.unlockDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              ), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Days to Next</p>
          </CardContent>
        </Card>
      </div>

      {/* Capsules */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({capsules.length})
          </TabsTrigger>
          <TabsTrigger value="unlocked">
            <Unlock className="h-4 w-4 mr-1" />
            Unlocked ({unlockedCapsules.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            <Lock className="h-4 w-4 mr-1" />
            Sealed ({lockedCapsules.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {capsules.map(capsule => (
                <CapsuleCard 
                  key={capsule.id} 
                  capsule={capsule} 
                  onDelete={handleDeleteCapsule}
                />
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {unlockedCapsules.map(capsule => (
                <CapsuleCard 
                  key={capsule.id} 
                  capsule={capsule} 
                  onDelete={handleDeleteCapsule}
                />
              ))}
            </AnimatePresence>
          </div>
          {unlockedCapsules.length === 0 && (
            <div className="text-center py-16">
              <Unlock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No unlocked capsules yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {lockedCapsules.map(capsule => (
                <CapsuleCard 
                  key={capsule.id} 
                  capsule={capsule} 
                  onDelete={handleDeleteCapsule}
                />
              ))}
            </AnimatePresence>
          </div>
          {lockedCapsules.length === 0 && (
            <div className="text-center py-16">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sealed capsules.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Create Time Capsule
            </DialogTitle>
            <DialogDescription>
              Write a message to your future self. Choose when it unlocks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={key}
                      variant={newCapsule.category === key ? "default" : "outline"}
                      className="justify-start gap-2"
                      onClick={() => setNewCapsule({ ...newCapsule, category: key as any })}
                    >
                      <Icon className={`h-4 w-4 ${cat.color}`} />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Mood</label>
              <div className="flex gap-2">
                {Object.entries(MOODS).map(([key, mood]) => (
                  <Button
                    key={key}
                    variant={newCapsule.mood === key ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setNewCapsule({ ...newCapsule, mood: key as any })}
                  >
                    <span>{mood.emoji}</span>
                    <span className="hidden sm:inline">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message</label>
              <Textarea
                placeholder="Write something for your future self..."
                value={newCapsule.content}
                onChange={(e) => setNewCapsule({ ...newCapsule, content: e.target.value })}
                rows={4}
              />
            </div>

            {/* Unlock Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unlock In</label>
              <Select
                value={newCapsule.unlockInDays.toString()}
                onValueChange={(v) => setNewCapsule({ ...newCapsule, unlockInDays: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="90">3 months</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleCreateCapsule}
              disabled={!newCapsule.content.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Seal Capsule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
