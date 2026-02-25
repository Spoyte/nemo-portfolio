"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const togglePause = () => {
    if (isPlaying && !gameOver) {
      setIsPaused((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (isPaused || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused, gameOver, direction]);

  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => {
            const newScore = prev + 10;
            setHighScore((hs) => Math.max(hs, newScore));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      const speed = Math.max(50, INITIAL_SPEED - score * 2);
      gameLoopRef.current = setTimeout(gameLoop, speed);
    };

    gameLoopRef.current = setTimeout(gameLoop, INITIAL_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, gameOver, direction, food, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#0c0a09";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#292524";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food with glow
    ctx.shadowColor = "#dc2626";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#f87171" : index % 2 === 0 ? "#dc2626" : "#b91c1c";
      
      if (isHead) {
        ctx.shadowColor = "#f87171";
        ctx.shadowBlur = 10;
      }

      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );

      if (isHead) {
        ctx.shadowBlur = 0;
        // Draw eyes
        ctx.fillStyle = "#0c0a09";
        const eyeSize = 3;
        const eyeOffset = 5;
        
        if (direction.x === 1) {
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (direction.x === -1) {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        } else if (direction.y === -1) {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 5, eyeSize, eyeSize);
        } else {
          ctx.fillRect(segment.x * CELL_SIZE + 5, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + 12, segment.y * CELL_SIZE + 12, eyeSize, eyeSize);
        }
      }
    });
  }, [snake, food, direction]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Snake Game
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{highScore}</span>
            </div>
            <div className="font-bold">Score: {score}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="mx-auto rounded-lg border border-border"
          />

          <AnimatePresence>
            {(!isPlaying || isPaused || gameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg"
              >
                <div className="text-center">
                  {gameOver ? (
                    <>
                      <div className="text-4xl mb-2">💀</div>
                      <h3 className="text-xl font-bold text-white mb-1">Game Over!</h3>
                      <p className="text-white/70 mb-4">Final Score: {score}</p>
                    </>
                  ) : isPaused ? (
                    <>
                      <div className="text-4xl mb-2">⏸️</div>
                      <h3 className="text-xl font-bold text-white mb-4">Paused</h3>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">🐍</div>
                      <h3 className="text-xl font-bold text-white mb-4">Snake Game</h3>
                      <p className="text-white/70 text-sm mb-4 max-w-[200px]">
                        Use arrow keys or WASD to move. Eat food to grow!
                      </p>
                    </>
                  )}
                  <Button onClick={resetGame} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    {gameOver ? "Play Again" : isPaused ? "Resume" : "Start Game"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => isPlaying && !isPaused && direction.y === 0 && setDirection({ x: 0, y: -1 })}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => isPlaying && !isPaused && direction.x === 0 && setDirection({ x: -1, y: 0 })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={togglePause}
            >
              {isPaused ? "▶️" : "⏸️"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => isPlaying && !isPaused && direction.x === 0 && setDirection({ x: 1, y: 0 })}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => isPlaying && !isPaused && direction.y === 0 && setDirection({ x: 0, y: 1 })}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <div />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Press SPACE to pause • Arrow keys or WASD to move
        </p>
      </CardContent>
    </Card>
  );
}
