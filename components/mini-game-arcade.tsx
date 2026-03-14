"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy,
  Timer,
  Star,
  Zap,
  Target,
  Flame,
  Sparkles,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type GameType = "memory" | "reaction" | "sequence" | "focus";

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScores: Record<GameType, number>;
  currentStreak: number;
  longestStreak: number;
}

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ["🎮", "🎯", "🎨", "🚀", "💎", "🔥", "⭐", "🎵"];

export function MiniGameArcade() {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalScore: 0,
    bestScores: { memory: 0, reaction: 0, sequence: 0, focus: 0 },
    currentStreak: 0,
    longestStreak: 0,
  });

  const updateStats = useCallback((game: GameType, score: number) => {
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      bestScores: {
        ...prev.bestScores,
        [game]: Math.max(prev.bestScores[game], score),
      },
      currentStreak: score > 0 ? prev.currentStreak + 1 : 0,
      longestStreak: score > 0 
        ? Math.max(prev.longestStreak, prev.currentStreak + 1)
        : prev.longestStreak,
    }));
  }, []);

  const games = [
    {
      id: "memory" as GameType,
      title: "Memory Match",
      description: "Match pairs of cards to test your memory",
      icon: "🧠",
      color: "from-purple-500 to-pink-500",
      bestScore: stats.bestScores.memory,
    },
    {
      id: "reaction" as GameType,
      title: "Reaction Time",
      description: "Click as fast as you can when the color changes",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
      bestScore: stats.bestScores.reaction,
    },
    {
      id: "sequence" as GameType,
      title: "Color Sequence",
      description: "Remember and repeat the color pattern",
      icon: "🎨",
      color: "from-blue-500 to-cyan-500",
      bestScore: stats.bestScores.sequence,
    },
    {
      id: "focus" as GameType,
      title: "Focus Trainer",
      description: "Keep the ball in the center for as long as possible",
      icon: "🎯",
      color: "from-green-500 to-emerald-500",
      bestScore: stats.bestScores.focus,
    },
  ];

  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm font-medium">Mini Game Arcade</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Take a{" "}
            <span className="text-gradient-animated">Break</span>
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with quick mini-games. Perfect for a mental break between coding sessions.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Games Played", value: stats.gamesPlayed, icon: Gamepad2 },
            { label: "Total Score", value: stats.totalScore.toLocaleString(), icon: Star },
            { label: "Current Streak", value: stats.currentStreak, icon: Flame },
            { label: "Best Streak", value: stats.longestStreak, icon: Trophy },
          ].map((stat, index) => (
            <Card key={stat.label} className="bg-muted/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Game Selection or Active Game */}
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer group overflow-hidden hover:border-primary/50 transition-all"
                    onClick={() => setActiveGame(game.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{game.icon}</div>
                        {game.bestScore > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            Best: {game.bestScore}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {game.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {game.description}
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-medium">
                        Play Now
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveGame(null)}
                    >
                      ← Back
                    </Button>
                    <CardTitle>
                      {games.find(g => g.id === activeGame)?.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveGame(null)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Game
                  </Button>
                </CardHeader>
                
                <CardContent className="p-6">
                  {activeGame === "memory" && (
                    <MemoryGame onScore={(score) => updateStats("memory", score)} />
                  )}
                  {activeGame === "reaction" && (
                    <ReactionGame onScore={(score) => updateStats("reaction", score)} />
                  )}
                  {activeGame === "sequence" && (
                    <SequenceGame onScore={(score) => updateStats("sequence", score)} />
                  )}
                  {activeGame === "focus" && (
                    <FocusGame onScore={(score) => updateStats("focus", score)} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Memory Match Game
function MemoryGame({ onScore }: { onScore: (score: number) => void }) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setStartTime(Date.now());
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setFlippedCards([]);
          
          // Check for game complete
          const allMatched = cards.every(c => 
            c.id === first || c.id === second || c.isMatched
          );
          if (allMatched || cards.filter(c => c.isMatched).length === 14) {
            const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 0;
            const score = Math.max(0, Math.round(1000 - moves * 10 - timeTaken));
            setGameComplete(true);
            onScore(score);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-8 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Moves</p>
          <p className="text-2xl font-bold">{moves}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pairs</p>
          <p className="text-2xl font-bold">
            {cards.filter(c => c.isMatched).length / 2}/8
          </p>
        </div>
      </div>

      {gameComplete ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="py-12"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-muted-foreground">
            You completed the game in {moves} moves!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                card.isFlipped || card.isMatched
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {(card.isFlipped || card.isMatched) ? card.emoji : "?"}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// Reaction Time Game
function ReactionGame({ onScore }: { onScore: (score: number) => void }) {
  const [state, setState] = useState<"waiting" | "ready" | "clicked" | "result">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setState("waiting");
    const delay = 2000 + Math.random() * 3000;
    const id = setTimeout(() => {
      setState("ready");
      setStartTime(Date.now());
    }, delay);
    setTimeoutId(id);
  };

  const handleClick = () => {
    if (state === "waiting") {
      if (timeoutId) clearTimeout(timeoutId);
      setState("clicked");
    } else if (state === "ready") {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setState("result");
      const score = Math.max(0, Math.round(1000 - time));
      onScore(score);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="text-center py-12">
      {state === "waiting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-muted-foreground">Wait for green...</p>
        </motion.div>
      )}
      
      {state === "ready" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-4">🟢</div>
          <p className="text-xl font-bold text-green-500">Click now!</p>
        </motion.div>
      )}
      
      {state === "clicked" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl font-bold text-red-500">Too early!</p>
          <Button onClick={startGame}>Try Again</Button>
        </motion.div>
      )}
      
      {state === "result" && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-4">
            {reactionTime < 200 ? "⚡" : reactionTime < 300 ? "🚀" : "🐢"}
          </div>
          <p className="text-4xl font-bold">{reactionTime}ms</p>
          <p className="text-muted-foreground">
            {reactionTime < 200 ? "Lightning fast!" : 
             reactionTime < 300 ? "Great reflexes!" : 
             "Keep practicing!"}
          </p>
          <Button onClick={startGame}>Play Again</Button>
        </motion.div>
      )}

      {(state === "waiting" || state === "ready") && (
        <button
          onClick={handleClick}
          className={`mt-8 w-full max-w-md h-32 rounded-2xl font-bold text-xl transition-all ${
            state === "ready" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {state === "waiting" ? "Don't click yet!" : "CLICK!"}
        </button>
      )}

      {state === "result" || state === "clicked" ? null : (
        <Button onClick={startGame} className="mt-4" variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      )}
    </div>
  );
}

// Color Sequence Game (Simon Says)
function SequenceGame({ onScore }: { onScore: (score: number) => void }) {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setLevel(1);
    setIsPlaying(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (isPlaying && sequence.length > 0 && playerSequence.length === 0) {
      playSequence();
    }
  }, [sequence, isPlaying]);

  const playSequence = async () => {
    setIsPlaying(false);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    setIsPlaying(true);
  };

  const handleColorClick = (index: number) => {
    if (!isPlaying || gameOver) return;

    setActiveColor(index);
    setTimeout(() => setActiveColor(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      onScore((level - 1) * 100);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setPlayerSequence([]);
      setLevel(l => l + 1);
      setTimeout(() => {
        setSequence(s => [...s, Math.floor(Math.random() * 4)]);
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Level</p>
        <p className="text-4xl font-bold">{level}</p>
      </div>

      {gameOver ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="py-8"
        >
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
          <p className="text-muted-foreground mb-4">You reached level {level}</p>
          <Button onClick={startGame}>Try Again</Button>
        </motion.div>
      ) : sequence.length === 0 ? (
        <div className="py-12">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-muted-foreground mb-4">Watch the pattern and repeat it</p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {colors.map((color, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: isPlaying ? 1.05 : 1 }}
              whileTap={{ scale: isPlaying ? 0.95 : 1 }}
              onClick={() => handleColorClick(index)}
              className={`aspect-square rounded-2xl ${color} ${
                activeColor === index ? "brightness-150" : "brightness-100"
              } transition-all`}
              disabled={!isPlaying}
            />
          ))}
        </div>
      )}

      {!gameOver && sequence.length > 0 && (
        <p className="mt-4 text-muted-foreground">
          {isPlaying ? "Your turn!" : "Watch the pattern..."}
        </p>
      )}
    </div>
  );
}

// Focus Trainer Game
function FocusGame({ onScore }: { onScore: (score: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ballPosition, setBallPosition] = useState(50);
  const [targetPosition, setTargetPosition] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      // Move target randomly
      if (Math.random() > 0.7) {
        setTargetPosition(Math.random() * 100);
      }

      // Ball drifts away from center
      setBallPosition(prev => {
        const drift = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + drift));
      });

      // Check if ball is near target
      const distance = Math.abs(ballPosition - targetPosition);
      if (distance < 10) {
        setScore(s => s + 1);
      }
    }, 100);

    const timerInterval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          onScore(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
    };
  }, [isPlaying, ballPosition, targetPosition, score, onScore]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBallPosition(Math.max(0, Math.min(100, x)));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setBallPosition(50);
    setTargetPosition(50);
  };

  return (
    <div className="text-center">
      <div className="flex justify-center gap-8 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Time</p>
          <p className="text-2xl font-bold">{timeLeft}s</p>
        </div>
      </div>

      {!isPlaying && timeLeft === 0 ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="py-8"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
          <p className="text-muted-foreground mb-4">Final score: {score}</p>
          <Button onClick={startGame}>Play Again</Button>
        </motion.div>
      ) : !isPlaying ? (
        <div className="py-12">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-muted-foreground mb-4">
            Keep the ball in the target zone!
          </p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      ) : (
        <div
          className="relative h-32 bg-muted rounded-2xl overflow-hidden cursor-none"
          onMouseMove={handleMouseMove}
        >
          {/* Target zone */}
          <motion.div
            className="absolute top-0 bottom-0 w-20 bg-green-500/30 border-x-2 border-green-500"
            style={{ left: `${targetPosition}%`, transform: "translateX(-50%)" }}
            animate={{ left: `${targetPosition}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          
          {/* Ball */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary shadow-lg"
            style={{ left: `${ballPosition}%`, transform: "translateX(-50%) translateY(-50%)" }}
            animate={{ left: `${ballPosition}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      )}
    </div>
  );
}

export default MiniGameArcade;
