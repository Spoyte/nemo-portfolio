"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { 
  Flower2, 
  Sparkles, 
  Wind, 
  Music, 
  Heart,
  Star,
  Moon,
  Sun,
  Cloud,
  Butterfly,
  Leaf,
  Droplets
} from "lucide-react";

interface GardenElement {
  id: number;
  type: "flower" | "butterfly" | "firefly" | "leaf" | "sparkle";
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

const colors = [
  "#f472b6", // pink
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // yellow
  "#f87171", // red
  "#22d3ee", // cyan
];

const quotes = [
  "In the garden of code, patience blooms the best features.",
  "Every bug is just a flower waiting to be understood.",
  "Take time to smell the roses between deployments.",
  "Growth happens in the quiet moments.",
  "Nature doesn't hurry, yet everything is accomplished.",
  "Your best ideas will bloom when you give them space.",
];

export default function SecretGardenPage() {
  const [elements, setElements] = useState<GardenElement[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNight, setIsNight] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [bloomCount, setBloomCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Load bloom count
  useEffect(() => {
    const saved = localStorage.getItem("garden-blooms");
    if (saved) setBloomCount(parseInt(saved));
  }, []);

  // Initialize garden elements
  useEffect(() => {
    const initialElements: GardenElement[] = [];
    for (let i = 0; i < 30; i++) {
      initialElements.push(createRandomElement(i));
    }
    setElements(initialElements);
  }, []);

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Hide welcome after delay
  useEffect(() => {
    const timeout = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timeout);
  }, []);

  const createRandomElement = (id: number): GardenElement => {
    const types: GardenElement["type"][] = ["flower", "butterfly", "firefly", "leaf", "sparkle"];
    return {
      id,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newElement: GardenElement = {
      id: Date.now(),
      type: Math.random() > 0.5 ? "flower" : "sparkle",
      x,
      y,
      size: 30 + Math.random() * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    };

    setElements((prev) => [...prev, newElement]);
    setBloomCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem("garden-blooms", newCount.toString());
      return newCount;
    });

    // Remove element after animation
    setTimeout(() => {
      setElements((prev) => prev.filter((el) => el.id !== newElement.id));
    }, 5000);
  };

  const getGradient = () => {
    if (isNight) {
      return "from-slate-950 via-purple-950 to-slate-950";
    }
    return "from-green-900 via-emerald-900 to-teal-900";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={`min-h-screen bg-gradient-to-br ${getGradient()} overflow-hidden cursor-crosshair relative`}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl ${
              isNight ? "bg-purple-500/20" : "bg-green-500/20"
            }`}
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Stars (night mode) */}
        {isNight && [...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Mouse follower glow */}
      <motion.div
        className="pointer-events-none fixed w-64 h-64 rounded-full"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: isNight
            ? "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 p-6"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isNight ? "bg-purple-500/20" : "bg-green-500/20"}`}>
              <Flower2 className={`w-6 h-6 ${isNight ? "text-purple-400" : "text-green-400"}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Secret Garden</h1>
              <p className="text-white/50 text-sm">{bloomCount} flowers bloomed</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsNight(!isNight);
            }}
            className={`p-3 rounded-xl transition-colors ${
              isNight ? "bg-purple-500/20 text-purple-400" : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {isNight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-16 h-16 text-white/50" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Secret Garden</h2>
              <p className="text-white/60">Click anywhere to plant flowers</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Garden Elements */}
      <AnimatePresence>
        {elements.map((element) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0, rotate: element.rotation - 180 }}
            animate={{ opacity: 1, scale: 1, rotate: element.rotation }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute pointer-events-none"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
            }}
          >
            {element.type === "flower" && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="15" fill={element.color} />
                {[...Array(8)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="50"
                    cy="25"
                    rx="8"
                    ry="20"
                    fill={element.color}
                    opacity={0.8}
                    transform={`rotate(${i * 45} 50 50)`}
                  />
                ))}
                <circle cx="50" cy="50" r="8" fill="#fef3c7" />
              </svg>
            )}
            {element.type === "butterfly" && (
              <Butterfly className="w-full h-full" style={{ color: element.color }} />
            )}
            {element.type === "firefly" && (
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full rounded-full"
                style={{ backgroundColor: element.color, boxShadow: `0 0 20px ${element.color}` }}
              />
            )}
            {element.type === "leaf" && (
              <Leaf className="w-full h-full" style={{ color: element.color }} />
            )}
            {element.type === "sparkle" && (
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="w-full h-full" style={{ color: element.color }} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Quote Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-0 right-0 p-8 z-20"
      >
        <div className="max-w-2xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <p className="text-lg text-white/80 italic mb-3">
                &ldquo;{quotes[currentQuote]}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                <Wind className="w-4 h-4" />
                <span>Click to plant more flowers</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: typeof window !== "undefined" ? window.innerHeight + 10 : 800,
            }}
            animate={{
              y: -10,
              x: `+=${Math.sin(i) * 100}`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
