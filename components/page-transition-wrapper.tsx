"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

type TransitionType = "fade" | "slide" | "zoom" | "glitch" | "cube";

export function PageTransitionWrapper({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [transitionType, setTransitionType] = useState<TransitionType>("fade");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cycle through transition types
  useEffect(() => {
    const types: TransitionType[] = ["fade", "slide", "zoom", "glitch", "cube"];
    const random = types[Math.floor(Math.random() * types.length)];
    setTransitionType(random);
  }, [pathname]);

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    glitch: {
      initial: { opacity: 0, skewX: 10 },
      animate: { opacity: 1, skewX: 0 },
      exit: { opacity: 0, skewX: -10 },
    },
    cube: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: 90 },
    },
  };

  const currentVariant = variants[transitionType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        exit={currentVariant.exit}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          perspective: transitionType === "cube" ? 1000 : undefined,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Loading Screen Component
export function CinematicLoader({ 
  isLoading, 
  onComplete 
}: { 
  isLoading: boolean; 
  onComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  const funFacts = [
    "Did you know? The first computer bug was an actual moth.",
    "JavaScript was created in just 10 days.",
    "The term 'responsive design' was coined by Ethan Marcotte in 2010.",
    "The first website is still online at info.cern.ch.",
    "CSS was first proposed by Håkon Wium Lie in 1994.",
    "React was created by Jordan Walke at Facebook.",
    "TypeScript was released by Microsoft in 2012.",
    "The first version of HTML had only 18 tags.",
  ];

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setTimeout(() => {
        setShowLoader(false);
        onComplete?.();
      }, 500);
      return;
    }

    setShowLoader(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, [isLoading, onComplete]);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md px-6">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">N</span>
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Loading Experience
          </motion.h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>

          {/* Fun Fact */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFact}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              <span className="text-primary font-medium">Did you know?{" "}</span>
              {funFacts[currentFact]}
            </motion.div>
          </AnimatePresence>

          {/* Loading Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 text-xs text-muted-foreground font-mono">
          nemo-portfolio-v2.0
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono">
          Initializing...
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransitionWrapper;
