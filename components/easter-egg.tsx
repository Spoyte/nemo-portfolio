"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEgg() {
  const router = useRouter();
  const [keys, setKeys] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = [...keys, e.key].slice(-KONAMI_CODE.length);
      setKeys(newKeys);

      if (newKeys.join(",") === KONAMI_CODE.join(",")) {
        setShowMessage(true);
        setSecretUnlocked(true);
        setTimeout(() => {
          router.push("/secret");
        }, 2000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, router]);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-card border border-border rounded-2xl p-8 max-w-md text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Secret Unlocked! 🎮</h2>
            <p className="text-muted-foreground">
              Konami code activated! Taking you to the secret page...
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
