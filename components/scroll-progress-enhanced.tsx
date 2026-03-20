"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Rocket, Sparkles } from "lucide-react";

export function ScrollProgressEnhanced() {
  const { scrollYProgress } = useScroll();
  const [showRocket, setShowRocket] = useState(false);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const rocketY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const rocketRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const handleScroll = () => {
      setShowRocket(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-yellow-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2">
        <motion.div
          className="w-1 h-32 bg-muted rounded-full overflow-hidden relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-orange-500 rounded-full"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
        </motion.div>

        {/* Rocket indicator */}
        <motion.div
          style={{ y: rocketY, rotate: rocketRotate }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={showRocket ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <Rocket className="h-4 w-4 text-white" />
          </motion.div>
        </motion.div>

        {/* Percentage */}
        <motion.div
          className="text-xs font-mono text-muted-foreground"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}
        >
          <PercentageDisplay progress={scrollYProgress} />
        </motion.div>
      </div>

      {/* Corner decoration */}
      <motion.div
        className="fixed bottom-4 right-4 z-40"
        style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]) }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>You made it!</span>
        </motion.div>
      </motion.div>
    </>
  );
}

function PercentageDisplay({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      setPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [progress]);

  return <span>{percentage}%</span>;
}
