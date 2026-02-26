"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  Trophy, 
  RotateCcw, 
  ChevronRight,
  Star,
  Zap,
  Target,
  Clock,
  Pause,
  Play,
  Heart,
  Skull,
  Ghost,
  Rocket,
  Gem,
  Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Snake Game
function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gridSize = 20;
  const tileCount = 20;

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 0, y: 0 });

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setNextDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case " ":
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setDirection(nextDirection);

      setSnake((currentSnake) => {
        if (nextDirection.x === 0 && nextDirection.y === 0) return currentSnake;

        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        head.x += nextDirection.x;
        head.y += nextDirection.y;

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          setGameOver(true);
          return currentSnake;
        }

        // Self collision
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood({
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [nextDirection, food, gameOver, isPaused, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Clear canvas
    ctx.fillStyle = "#0c0a09";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#292524";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a";
      ctx.fillRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">High Score</p>
            <p className="text-2xl font-bold text-primary">{highScore}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            disabled={gameOver}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetGame}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-border rounded-lg"
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  {gameOver ? "💀" : "⏸️"}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">
                  {gameOver ? "Game Over!" : "Paused"}
                </h3>
                {gameOver && (
                  <p className="text-muted-foreground mb-4">Final Score: {score}</p>
                )}
                <Button onClick={gameOver ? resetGame : () => setIsPaused(false)}>
                  {gameOver ? "Play Again" : "Resume"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-sm text-muted-foreground">
        Use arrow keys to move • Space to pause
      </p>
    </div>
  );
}

// Memory Game
function MemoryGame() {
  const [cards, setCards] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const emojis = ["🎮", "🎯", "🎨", "🚀", "💎", "🔥", "⭐", "🎵"];

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .map((emoji, index) => ({ emoji, index }))
      .sort(() => Math.random() - 0.5)
      .map((item) => item.index % emojis.length);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, cards[first]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves((m) => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === emojis.length) {
      setGameComplete(true);
    }
  }, [matched]);

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index])) {
      setFlipped((prev) => [...prev, index]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Moves</p>
          <p className="text-2xl font-bold">{moves}</p>
        </div>
        <Button variant="outline" size="icon" onClick={initGame}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((cardIndex, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(cardIndex);
          const isMatched = matched.includes(cardIndex);

          return (
            <motion.button
              key={i}
              onClick={() => handleCardClick(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl flex items-center justify-center transition-all ${
                isFlipped
                  ? isMatched
                    ? "bg-green-500/20 border-green-500"
                    : "bg-primary/10 border-primary"
                  : "bg-muted hover:bg-muted/80"
              } border-2`}
              whileHover={{ scale: isFlipped ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotateY: isFlipped ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                {isFlipped ? emojis[cardIndex] : "?"}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setGameComplete(false)}
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-4">
                You completed the game in {moves} moves!
              </p>
              <Button onClick={initGame}>Play Again</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reaction Time Game
function ReactionGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "clicked" | "result">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);

  const startGame = () => {
    setGameState("waiting");
    setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, Math.random() * 2000 + 1500);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      setGameState("clicked");
    } else if (gameState === "ready") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setGameState("result");
    }
  };

  const getRating = (time: number) => {
    if (time < 200) return { text: "Lightning! ⚡", color: "text-yellow-400" };
    if (time < 250) return { text: "Amazing! 🚀", color: "text-green-400" };
    if (time < 300) return { text: "Great! ⭐", color: "text-blue-400" };
    if (time < 400) return { text: "Good! 👍", color: "text-primary" };
    return { text: "Keep practicing! 💪", color: "text-muted-foreground" };
  };

  const averageTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Best</p>
          <p className="text-2xl font-bold text-primary">
            {bestTime ? `${bestTime}ms` : "--"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="text-2xl font-bold">{averageTime > 0 ? `${averageTime}ms` : "--"}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Attempts</p>
          <p className="text-2xl font-bold">{attempts.length}</p>
        </div>
      </div>

      <motion.button
        onClick={handleClick}
        className={`w-full max-w-md h-64 rounded-2xl text-2xl font-bold transition-colors ${
          gameState === "waiting"
            ? "bg-red-500 hover:bg-red-600"
            : gameState === "ready"
            ? "bg-green-500 hover:bg-green-600"
            : gameState === "clicked"
            ? "bg-yellow-500"
            : "bg-primary hover:bg-primary/90"
        }`}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: gameState === "ready" ? [1, 1.02, 1] : 1,
        }}
        transition={{
          repeat: gameState === "ready" ? Infinity : 0,
          duration: 0.5,
        }}
        disabled={gameState === "clicked"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {gameState === "waiting" && (
              <div className="text-white">
                <Clock className="h-12 w-12 mx-auto mb-2" />
                Wait for green...
              </div>
            )}
            {gameState === "ready" && (
              <div className="text-white">
                <Zap className="h-12 w-12 mx-auto mb-2" />
                CLICK NOW!
              </div>
            )}
            {gameState === "clicked" && (
              <div className="text-white">
                <Target className="h-12 w-12 mx-auto mb-2" />
                Too soon!
              </div>
            )}
            {gameState === "result" && (
              <div className="text-primary-foreground">
                <p className="text-5xl font-bold mb-2">{reactionTime}ms</p>
                <p className={getRating(reactionTime).color}>
                  {getRating(reactionTime).text}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {(gameState === "result" || gameState === "clicked") && (
        <Button onClick={startGame} size="lg">
          Try Again
        </Button>
      )}

      {gameState === "waiting" && (
        <p className="text-sm text-muted-foreground">
          Click as soon as the box turns green!
        </p>
      )}
    </div>
  );
}

export default function GamesPage() {
  const [totalScore, setTotalScore] = useState(0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Arcade</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mini Games</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Take a break and play some classic games. Challenge yourself and beat your high scores!
          </p>
        </motion.div>

        <Tabs defaultValue="snake" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="snake">
              <Ghost className="h-4 w-4 mr-2" />
              Snake
            </TabsTrigger>
            <TabsTrigger value="memory">
              <Gem className="h-4 w-4 mr-2" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="reaction">
              <Zap className="h-4 w-4 mr-2" />
              Reaction
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 max-w-2xl mx-auto">
            <TabsContent value="snake">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ghost className="h-5 w-5 text-green-500" />
                    Snake
                  </CardTitle>
                  <CardDescription>
                    Classic snake game. Eat food, grow longer, don't hit the walls!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SnakeGame />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="memory">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gem className="h-5 w-5 text-purple-500" />
                    Memory Match
                  </CardTitle>
                  <CardDescription>
                    Find matching pairs of cards. Test your memory!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MemoryGame />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reaction">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Reaction Time
                  </CardTitle>
                  <CardDescription>
                    Test your reflexes! Click as fast as you can when the box turns green.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReactionGame />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="text-left">
                  <p className="font-semibold">Challenge Friends</p>
                  <p className="text-sm text-muted-foreground">
                    Share your high scores and compete with friends!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
