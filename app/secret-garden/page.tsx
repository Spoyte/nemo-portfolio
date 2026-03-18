"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Flower2, 
  Wind, 
  Music, 
  Heart,
  Lock,
  Unlock,
  Search,
  Star,
  Gift,
  Key,
  Eye,
  EyeOff,
  MessageCircle,
  Send,
  Leaf,
  Moon,
  Sun,
  Cloud,
  Rainbow
} from "lucide-react";

// Secret discovery types
interface Secret {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  hint: string;
  color: string;
}

const initialSecrets: Secret[] = [
  {
    id: "konami",
    title: "Konami Master",
    description: "You found the legendary Konami code!",
    icon: Key,
    unlocked: false,
    hint: "Try the classic gaming cheat code...",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Visited during the quiet hours of the night.",
    icon: Moon,
    unlocked: false,
    hint: "Some secrets only reveal themselves after dark...",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "explorer",
    title: "Deep Explorer",
    description: "Visited every page on the site.",
    icon: Search,
    unlocked: false,
    hint: "Leave no stone unturned...",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "music-lover",
    title: "Melody Seeker",
    description: "Found and played the hidden music player.",
    icon: Music,
    unlocked: false,
    hint: "Listen closely for hidden tunes...",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "zen-master",
    title: "Zen Master",
    description: "Spent time in the meditation garden.",
    icon: Flower2,
    unlocked: false,
    hint: "Find your center...",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "time-traveler",
    title: "Time Traveler",
    description: "Explored the portfolio's evolution.",
    icon: Sparkles,
    unlocked: false,
    hint: "Journey through the past...",
    color: "from-violet-500 to-purple-500",
  },
];

// Floating particle component
function FloatingParticle({ delay }: { delay: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  useEffect(() => {
    const animate = () => {
      x.set(Math.random() * 100 - 50);
      y.set(Math.random() * 100 - 50);
    };
    const interval = setInterval(animate, 3000 + delay * 500);
    return () => clearInterval(interval);
  }, [x, y, delay]);

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-primary/30"
      style={{ x, y }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        delay: delay * 0.5
      }}
    />
  );
}

// Secret card component
function SecretCard({ secret, onUnlock }: { secret: Secret; onUnlock: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onUnlock}
      className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
        secret.unlocked 
          ? "bg-card border-primary" 
          : "bg-muted/50 border-dashed border-muted-foreground/30"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className={`p-3 rounded-xl ${
            secret.unlocked 
              ? `bg-gradient-to-br ${secret.color}` 
              : "bg-muted"
          }`}
          animate={secret.unlocked ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {secret.unlocked ? (
            <secret.icon className="h-6 w-6 text-white" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </motion.div>

        <div className="flex-1">
          <h3 className={`font-bold ${secret.unlocked ? "" : "text-muted-foreground"}`}>
            {secret.unlocked ? secret.title : "???"}
          </h3>
          
          <AnimatePresence>
            {secret.unlocked ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-muted-foreground mt-1"
              >
                {secret.description}
              </motion.p>
            ) : isHovered ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground mt-1 italic"
              >
                Hint: {secret.hint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div>
          {secret.unlocked ? (
            <Badge variant="default" className="bg-green-500">
              <Unlock className="h-3 w-3 mr-1" /> Unlocked
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Lock className="h-3 w-3 mr-1" /> Locked
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Whisper wall component
function WhisperWall() {
  const [whispers, setWhispers] = useState([
    { id: "1", text: "The garden is beautiful at midnight...", author: "Anonymous", time: "2h ago" },
    { id: "2", text: "Found the secret terminal! 🎉", author: "Explorer", time: "5h ago" },
    { id: "3", text: "This portfolio is a work of art.", author: "Visitor", time: "1d ago" },
  ]);
  const [newWhisper, setNewWhisper] = useState("");

  const submitWhisper = () => {
    if (!newWhisper.trim()) return;
    setWhispers([{
      id: Date.now().toString(),
      text: newWhisper,
      author: "Guest",
      time: "Just now"
    }, ...whispers]);
    setNewWhisper("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Whisper Wall
        </CardTitle>
        <CardDescription>Leave a secret message for future visitors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Share a secret..."
            value={newWhisper}
            onChange={(e) => setNewWhisper(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitWhisper()}
          />
          <Button size="icon" onClick={submitWhisper}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {whispers.map((whisper) => (
              <motion.div
                key={whisper.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-3 rounded-xl bg-muted/50"
              >
                <p className="text-sm">{whisper.text}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{whisper.author}</span>
                  <span>•</span>
                  <span>{whisper.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

// Interactive garden
function InteractiveGarden() {
  const [flowers, setFlowers] = useState<Array<{ id: number; x: number; y: number; color: string }>([]);
  const gardenRef = useRef<HTMLDivElement>(null);

  const plantFlower = (e: React.MouseEvent) => {
    if (!gardenRef.current) return;
    const rect = gardenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const colors = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    setFlowers(prev => [...prev, { id: Date.now(), x, y, color }]);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flower2 className="h-5 w-5" />
          Secret Garden
        </CardTitle>
        <CardDescription>Click anywhere to plant a flower</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={gardenRef}
          onClick={plantFlower}
          className="relative h-64 bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900 dark:to-green-900 cursor-crosshair overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute top-4 right-4">
            <Sun className="h-12 w-12 text-yellow-400" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-200 to-transparent dark:from-green-800" />

          {/* Planted flowers */}
          <AnimatePresence>
            {flowers.map((flower) => (
              <motion.div
                key={flower.id}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                className="absolute"
                style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r="5" fill={flower.color} />
                  {[0, 72, 144, 216, 288].map((rotation) => (
                    <ellipse
                      key={rotation}
                      cx="15"
                      cy="15"
                      rx="3"
                      ry="8"
                      fill={flower.color}
                      opacity="0.7"
                      transform={`rotate(${rotation} 15 15)`}
                    />
                  ))}
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
            {flowers.length} flowers planted
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function SecretGardenPage() {
  const [secrets, setSecrets] = useState(initialSecrets);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check for time-based secrets
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      unlockSecret("night-owl");
    }
  }, []);

  // Listen for Konami code
  useEffect(() => {
    const handleKonami = () => unlockSecret("konami");
    window.addEventListener("konami-code", handleKonami);
    return () => window.removeEventListener("konami-code", handleKonami);
  }, []);

  const unlockSecret = (id: string) => {
    setSecrets(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, unlocked: true } : s);
      const newUnlocked = updated.filter(s => s.unlocked).length;
      if (newUnlocked > unlockedCount) {
        setUnlockedCount(newUnlocked);
        if (newUnlocked === secrets.length) {
          setShowCelebration(true);
        }
      }
      return updated;
    });
  };

  const handleSecretClick = (secret: Secret) => {
    // Simulate unlocking for demo purposes
    if (!secret.unlocked) {
      unlockSecret(secret.id);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <span className="text-sm font-medium">Shhh... Secret Area</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Secret <span className="text-gradient-animated">Garden</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A hidden sanctuary for those who seek. Discover secrets, plant flowers, and leave whispers.
          </p>

          {/* Progress */}
          <div className="mt-8 inline-flex items-center gap-4 px-6 py-3 rounded-full bg-muted">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{unlockedCount}/{secrets.length} Secrets Found</span>
            </div>
            <div className="w-32 h-2 rounded-full bg-muted-foreground/20 overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / secrets.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Secrets Collection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Secret Collection
                </CardTitle>
                <CardDescription>Discover hidden achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {secrets.map((secret) => (
                    <SecretCard
                      key={secret.id}
                      secret={secret}
                      onUnlock={() => handleSecretClick(secret)}
                    />
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
003e
            <InteractiveGarden />
            <WhisperWall />
          </motion.div>
        </div>

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCelebration(false)}
            >
              <motion.div
                className="bg-card p-8 rounded-3xl text-center max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
003e
                  <Sparkles className="h-16 w-16 text-yellow-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">All Secrets Found!</h2>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve unlocked every secret in the garden. You are truly a master explorer!
                </p>
                <Button onClick={() => setShowCelebration(false)}>
                  Continue Exploring
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
