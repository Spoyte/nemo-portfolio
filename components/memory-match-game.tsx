"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  RotateCcw, 
  Timer, 
  Zap,
  Brain,
  Sparkles,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface Card {
  id: number;
  icon: React.ReactNode;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const techIcons = [
  { name: "React", color: "#61DAFB", symbol: "⚛️" },
  { name: "Next.js", color: "#000000", symbol: "▲" },
  { name: "TypeScript", color: "#3178C6", symbol: "📘" },
  { name: "Tailwind", color: "#06B6D4", symbol: "🌊" },
  { name: "Node.js", color: "#339933", symbol: "🟢" },
  { name: "Git", color: "#F05032", symbol: "📦" },
  { name: "Docker", color: "#2496ED", symbol: "🐳" },
  { name: "Figma", color: "#F24E1E", symbol: "🎨" },
];

export function MemoryMatchGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  const initializeGame = useCallback(() => {
    const shuffled = [...techIcons, ...techIcons]
      .sort(() => Math.random() - 0.5)
      .map((tech, index) => ({
        id: index,
        icon: (
          <div 
            className="text-3xl"
            style={{ color: tech.color }}
          >
            {tech.symbol}
          </div>
        ),
        name: tech.name,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && matches < 8) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, matches]);

  useEffect(() => {
    if (matches === 8 && isPlaying) {
      setIsPlaying(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves);
      }
    }
  }, [matches, isPlaying, time, moves, bestTime, bestMoves]);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].name === cards[second].name) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-muted/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-lg">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono">{moves} moves</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            {matches}/8 matches
          </span>
        </div>
      </div>

      {/* Best Stats */}
      {(bestTime || bestMoves) && (
        <div className="flex items-center justify-center gap-6 mb-6">
          {bestTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-yellow-500" />
              Best: {formatTime(bestTime)}
            </div>
          )}
          {bestMoves && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="w-4 h-4 text-purple-500" />
              Best: {bestMoves} moves
            </div>
          )}
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square cursor-pointer"
            >
              <motion.div
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full h-full"
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 flex items-center justify-center backface-hidden hover:border-primary/50 transition-colors"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Sparkles className="w-6 h-6 text-primary/50" />
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-xl border-2 flex items-center justify-center backface-hidden ${
                    card.isMatched
                      ? "bg-green-500/20 border-green-500"
                      : "bg-card border-primary"
                  }`}
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {card.icon}
                </div>
              </motion.div>

              {/* Match Effect */}
              {card.isMatched && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 rounded-xl bg-green-500/30 pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Win Message */}
      {matches === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
        >
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            🎉 Congratulations!
          </h3>
          <p className="text-muted-foreground">
            You completed the game in {formatTime(time)} with {moves} moves!
          </p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex justify-center">
        <Button
          onClick={initializeGame}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Match the tech stack pairs! Click cards to flip them.
      </p>
    </div>
  );
}
