"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate fetching visitor count
    const stored = localStorage.getItem("visitor-count");
    const baseCount = stored ? parseInt(stored, 10) : 1337;
    const newCount = baseCount + Math.floor(Math.random() * 10);
    localStorage.setItem("visitor-count", newCount.toString());
    setCount(newCount);
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      <span>{count.toLocaleString()} visitors</span>
    </motion.div>
  );
}
