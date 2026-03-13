"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  Sparkles, 
  Trophy,
  Zap,
  Target,
  RotateCcw,
  ArrowRight,
  Star,
  Clock,
  MousePointer,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mini Games

// 1. Reaction Time Test
function ReactionTimeGame() {
  const [state, setState] = useState<"idle" | "waiting" | "ready" | "clicked" | "early">("idle");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timeoutRef = useState<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setState("waiting");
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    const timeout = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, delay);
    timeoutRef[1](timeout);
  };

  const handleClick = () => {
    if (state === "waiting") {
      if (timeoutRef[0]) clearTimeout(timeoutRef[0]);
      setState("early");
    } else if (state === "ready") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setState("clicked");
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  const reset = () => {
    setState("idle");
    setReactionTime(0);
  };

  const getColor = () => {
    if (state === "waiting") return "bg-yellow-500";
    if (state === "ready") return "bg-green-500";
    if (state === "early") return "bg-red-500";
    if (state === "clicked") {
      if (reactionTime < 200) return "bg-green-500";
      if (reactionTime < 300) return "bg-yellow-500";
      return "bg-orange-500";
    }
    return "bg-primary";
  };

  const getMessage = () => {
    if (state === "idle") return "Click to start";
    if (state === "waiting") return "Wait for green...";
    if (state === "ready") return "CLICK NOW!";
    if (state === "early") return "Too early! Click to retry";
    if (state === "clicked") return `${reactionTime}ms`;
    return "";
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold">Reaction Time</h3>
        </div>
        {bestTime && (
          <Badge variant="outline">Best: {bestTime}ms</Badge>
        )}
      </div>

      <motion.button
        onClick={state === "idle" || state === "early" || state === "clicked" ? 
          (state === "clicked" ? reset : startGame) : handleClick}
        className={`w-full h-40 rounded-xl ${getColor()} text-white font-bold text-2xl transition-colors flex flex-col items-center justify-center gap-2`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {state === "clicked" && reactionTime < 200 && <Trophy className="w-8 h-8" />}
        {getMessage()}
        {state === "clicked" && (
          <span className="text-sm font-normal">
            {reactionTime < 200 ? "Lightning fast!" : 
             reactionTime < 300 ? "Great!" : 
             reactionTime < 400 ? "Good" : "Keep practicing!"}
          </span>
        )}
      </motion.button>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        Click when the box turns green. Don&apos;t click early!
      </p>
    </div>
  );
}

// 2. Click Speed Test
function ClickSpeedGame() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [clicks, setClicks] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestCps, setBestCps] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      const cps = clicks / 10;
      if (cps > bestCps) setBestCps(cps);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, clicks, bestCps]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(10);
    setClicks(0);
  };

  const handleClick = () => {
    if (isPlaying) setClicks(c => c + 1);
  };

  const cps = clicks / 10;

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Click Speed</h3>
        </div>
        {bestCps > 0 && (
          <Badge variant="outline">Best: {bestCps.toFixed(1)} CPS</Badge>
        )}
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold">{isPlaying ? timeLeft : 10}s</div>
        <div className="text-sm text-muted-foreground">Time Left</div>
      </div>

      <motion.button
        onClick={isPlaying ? handleClick : startGame}
        disabled={timeLeft === 0 && !isPlaying}
        className={`w-full h-32 rounded-xl font-bold text-xl transition-colors flex flex-col items-center justify-center gap-2 ${
          isPlaying ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"
        }`}
        whileTap={isPlaying ? { scale: 0.95 } : {}}
      >
        {isPlaying ? (
          <>
            <span className="text-3xl">{clicks}</span>
            <span className="text-sm font-normal">clicks</span>
          </>
        ) : timeLeft === 0 ? (
          <>
            <span className="text-3xl">{cps.toFixed(1)} CPS</span>
            <span className="text-sm font-normal">Click to restart</span>
          </>
        ) : (
          <>
            <Target className="w-8 h-8" />
            <span>Click to Start</span>
          </>
        )}
      </motion.button>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        Click as fast as you can in 10 seconds!
      </p>
    </div>
  );
}

// 3. Memory Sequence Game
function MemoryGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [level, setLevel] = useState(0);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    "bg-red-500",
    "bg-blue-500", 
    "bg-green-500",
    "bg-yellow-500",
  ];

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setGameOver(false);
    nextLevel([]);
  };

  const nextLevel = (currentSequence: number[]) => {
    const newSequence = [...currentSequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setLevel(newSequence.length);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
    setIsPlaying(true);
  };

  const handleButtonClick = (index: number) => {
    if (!isPlaying || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setIsPlaying(false);
      setTimeout(() => nextLevel(sequence), 1000);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold">Memory Sequence</h3>
        </div>
        <Badge variant="outline">Level {level}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`h-20 rounded-xl ${color} ${
              activeButton === index ? "brightness-150" : "brightness-100"
            } transition-all`}
            whileTap={isPlaying && !isShowingSequence ? { scale: 0.95 } : {}}
            disabled={!isPlaying || isShowingSequence}
          />
        ))}
      </div>

      {gameOver ? (
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Game Over!</p>
          <p className="text-sm text-muted-foreground mb-3">You reached level {level}</p>
          <Button onClick={startGame} size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : !isPlaying && level === 0 ? (
        <Button onClick={startGame} className="w-full">
          Start Game
        </Button>
      ) : isShowingSequence ? (
        <p className="text-center text-sm text-muted-foreground">Watch the sequence...</p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Repeat the sequence!</p>
      )}
    </div>
  );
}

// 4. Number Guessing Game
function NumberGuessGame() {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"" | "higher" | "lower" | "correct">("");
  const [gameWon, setGameWon] = useState(false);

  const startGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setFeedback("");
    setGameWon(false);
  };

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) return;

    setAttempts(a => a + 1);

    if (num === target) {
      setFeedback("correct");
      setGameWon(true);
    } else if (num < target) {
      setFeedback("higher");
    } else {
      setFeedback("lower");
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Number Guess</h3>
        </div>
        <Badge variant="outline">{attempts} attempts</Badge>
      </div>

      {!gameWon ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            I&apos;m thinking of a number between 1 and 100...
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGuess()}
              className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-center text-lg font-semibold"
              placeholder="?"
              min="1"
              max="100"
            />
            <Button onClick={handleGuess}>Guess</Button>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-3 rounded-lg ${
                feedback === "correct" ? "bg-green-500/10 text-green-500" :
                feedback === "higher" ? "bg-blue-500/10 text-blue-500" :
                "bg-orange-500/10 text-orange-500"
              }`}
            >
              {feedback === "correct" ? "🎉 Correct!" :
               feedback === "higher" ? "📈 Go higher!" :
               "📉 Go lower!"}
            </motion.div>
          )}
        </>
      ) : (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl mb-2"
          >
            🎉
          </motion.div>
          <p className="font-semibold mb-1">You got it!</p>
          <p className="text-sm text-muted-foreground mb-4">
            The number was {target}. It took you {attempts} attempts.
          </p>
          <Button onClick={startGame} size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default function FunZonePage() {
  const [totalScore, setTotalScore] = useState(0);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm font-medium">Mini Games</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Fun{" "}
            <span className="text-gradient-animated">Zone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a break and play some mini games. Test your reflexes, memory, and skills!
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReactionTimeGame />
          <ClickSpeedGame />
          <MemoryGame />
          <NumberGuessGame />
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-12"
        >
          More games coming soon! 🎮
        </motion.p>
      </div>
    </div>
  );
}
