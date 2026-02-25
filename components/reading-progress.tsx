"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BookOpen, Clock, ChevronUp } from "lucide-react";

interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
  showTimeEstimate?: boolean;
  showScrollToTop?: boolean;
}

export function ReadingProgress({
  targetRef,
  showTimeEstimate = true,
  showScrollToTop = true,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef || undefined,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest * 100);
      setIsVisible(latest > 0.05);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    // Calculate reading time based on word count
    const calculateReadingTime = () => {
      const content = targetRef?.current || document.body;
      const text = content.innerText || "";
      const words = text.trim().split(/\s+/).length;
      setWordCount(words);
      // Average reading speed: 200 words per minute
      setReadingTime(Math.ceil(words / 200));
    };

    calculateReadingTime();
  }, [targetRef]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Reading Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20,
          pointerEvents: isVisible ? "auto" : "none"
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">{Math.round(progress)}% read</span>
              {showTimeEstimate && (
                <span className="text-[10px] text-muted-foreground">
                  {readingTime} min read • {wordCount} words
                </span>
              )}
            </div>
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible && showScrollToTop ? 1 : 0, 
          scale: isVisible && showScrollToTop ? 1 : 0.8,
          pointerEvents: isVisible && showScrollToTop ? "auto" : "none"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-24 left-4 z-50 p-3 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-lg hover:shadow-xl transition-shadow"
        title="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    </>
  );
}

// Hook for tracking reading progress of any element
export function useReadingProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;
      
      // Calculate how much of the element has been scrolled through
      const scrolled = windowHeight - rect.top;
      const total = elementHeight + windowHeight;
      const newProgress = Math.max(0, Math.min(100, (scrolled / total) * 100));
      
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}
