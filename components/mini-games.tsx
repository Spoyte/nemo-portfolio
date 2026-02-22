"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { 
  Gamepad2, 
  X, 
  Trophy,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Snake Game
interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, direction]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameInterval = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
          setSpeed(s => Math.max(50, s - 5));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver, direction, food, speed, generateFood]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Snake Game
          </CardTitle>
          <div className="text-lg font-bold">Score: {score}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="relative mx-auto border-2 border-border rounded-lg overflow-hidden"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        >
          {/* Grid */}
          <div className="absolute inset-0 bg-muted/30">
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <div key={y} className="flex">
                {Array.from({ length: GRID_SIZE }).map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="border border-border/30"
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-sm ${
                index === 0 ? "bg-primary" : "bg-primary/60"
              }`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          ))}

          {/* Food */}
          <motion.div
            className="absolute bg-orange-500 rounded-full"
            style={{
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              left: food.x * CELL_SIZE + 2,
              top: food.y * CELL_SIZE + 2
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center"
              >
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <div className="text-2xl font-bold mb-2">Game Over!</div>
                <div className="text-muted-foreground mb-4">Final Score: {score}</div>
                <Button onClick={resetGame} size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
              <div className="text-xl font-bold mb-4">Ready to Play?</div>
              <Button onClick={resetGame} size="lg">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Start Game
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Use arrow keys to move</p>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Memory Game
const EMOJIS = ["🎨", "💻", "🚀", "⭐", "🔥", "💡", "🎯", "🎮"];

export function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map((card, index) => 
          index === first || index === second 
            ? { ...card, matched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setGameComplete(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, flipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Memory Game
          </CardTitle>
          <div className="text-lg font-bold">Moves: {moves}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                card.flipped || card.matched
                  ? "bg-primary/10"
                  : "bg-muted hover:bg-muted/80"
              } ${card.matched ? "opacity-50" : ""}`}
              whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence>
                {(card.flipped || card.matched) && (
                  <motion.span
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                  >
                    {card.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="font-bold mb-2">Congratulations!</div>
            <div className="text-sm text-muted-foreground mb-4">
              Completed in {moves} moves
            </div>
            <Button onClick={initializeGame} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
