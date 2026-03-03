"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Developer", "Designer", "Creator", "Innovator", "Dreamer", "Builder"];

export function MorphingText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[1.2em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 text-gradient-animated font-bold"
        >
          {WORDS[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
