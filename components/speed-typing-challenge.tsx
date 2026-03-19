"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  Trophy,
  Clock,
  Keyboard,
  Target,
  Flame,
  Sparkles,
  Award,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TypingStats {
  wpm: number;
  accuracy: number;
  charactersTyped: number;
  errors: number;
  streak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const CODE_SNIPPETS = [
  {
    language: "TypeScript",
    name: "React Component",
    code: `interface Props {
  name: string;
  age: number;
}

const Greeting: React.FC<Props> = ({ name, age }) => {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
};`
  },
  {
    language: "Python",
    name: "Data Processing",
    code: `def process_data(data: list[dict]) -> dict:
    result = {}
    for item in data:
        key = item.get('category')
        value = item.get('value', 0)
        if key in result:
            result[key] += value
        else:
            result[key] = value
    return result`
  },
  {
    language: "Rust",
    name: "Memory Safe",
    code: `fn calculate_sum(numbers: &[i32]) -> i32 {
    let mut sum = 0;
    for &num in numbers {
        sum += num;
    }
    sum
}

fn main() {
    let values = vec![1, 2, 3, 4, 5];
    let total = calculate_sum(&values);
    println!("Sum: {}", total);
}`
  },
  {
    language: "Go",
    name: "Concurrent",
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
}`
  },
  {
    language: "SQL",
    name: "Database Query",
    code: `SELECT 
    u.username,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id
HAVING order_count > 5
ORDER BY total_spent DESC;`
  }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "speed_demon", name: "Speed Demon", description: "Type 80+ WPM", icon: <Zap className="w-4 h-4" />, unlocked: false },
  { id: "perfectionist", name: "Perfectionist", description: "100% accuracy", icon: <Target className="w-4 h-4" />, unlocked: false },
  { id: "marathon", name: "Marathon", description: "Type 500+ characters", icon: <Flame className="w-4 h-4" />, unlocked: false },
  { id: "polyglot", name: "Polyglot", description: "Complete all languages", icon: <Sparkles className="w-4 h-4" />, unlocked: false },
];

export function SpeedTypingChallenge() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    charactersTyped: 0,
    errors: 0,
    streak: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedSnippets, setCompletedSnippets] = useState<number[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSnippet = CODE_SNIPPETS[currentSnippetIndex];
  const targetCode = currentSnippet.code;
  
  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - (startTime || Date.now()));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, startTime]);
  
  // Calculate stats
  useEffect(() => {
    if (isActive && startTime) {
      const minutes = elapsedTime / 60000;
      const words = userInput.length / 5;
      const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
      
      let errors = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== targetCode[i]) errors++;
      }
      
      const accuracy = userInput.length > 0 
        ? Math.round(((userInput.length - errors) / userInput.length) * 100) 
        : 100;
      
      setStats({
        wpm,
        accuracy,
        charactersTyped: userInput.length,
        errors,
        streak: accuracy === 100 ? stats.streak + 1 : 0
      });
    }
  }, [userInput, elapsedTime, isActive, startTime, targetCode]);
  
  // Check achievements
  useEffect(() => {
    const newAchievements = [...achievements];
    let newUnlock = false;
    
    if (stats.wpm >= 80 && !newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      newUnlock = true;
    }
    if (stats.accuracy === 100 && userInput.length > 50 && !newAchievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      newUnlock = true;
    }
    if (stats.charactersTyped >= 500 && !newAchievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      newUnlock = true;
    }
    if (completedSnippets.length === CODE_SNIPPETS.length && !newAchievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      newUnlock = true;
    }
    
    if (newUnlock) {
      setAchievements(newAchievements);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [stats, completedSnippets, achievements, userInput.length]);
  
  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
    inputRef.current?.focus();
  };
  
  const handlePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setUserInput("");
    setElapsedTime(0);
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 100,
      charactersTyped: 0,
      errors: 0,
      streak: 0
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive && !isPaused) {
      handleStart();
    }
    setUserInput(e.target.value);
    
    // Check if completed
    if (e.target.value === targetCode) {
      if (!completedSnippets.includes(currentSnippetIndex)) {
        setCompletedSnippets([...completedSnippets, currentSnippetIndex]);
      }
    }
  };
  
  const handleNextSnippet = () => {
    setCurrentSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
    handleReset();
  };
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCharacterClass = (char: string, index: number) => {
    if (index >= userInput.length) return "text-muted-foreground";
    if (userInput[index] === char) return "text-green-500";
    return "text-red-500 bg-red-500/10";
  };
  
  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Keyboard className="h-4 w-4" />
            <span className="text-sm font-medium">Speed Challenge</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Typing{" "}
            <span className="text-gradient-animated">Race</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your typing speed with real code snippets. How fast can you type?
          </p>
        </motion.div>
        
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 text-center">
            <Zap className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.wpm}</p>
            <p className="text-xs text-muted-foreground">WPM</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </Card>
          <Card className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </Card>
          <Card className="p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{completedSnippets.length}/{CODE_SNIPPETS.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
        </motion.div>
        
        {/* Main Typing Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 md:p-8">
            {/* Language Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="font-medium">{currentSnippet.name}</span>
                <Badge variant="secondary">{currentSnippet.language}</Badge>
                {completedSnippets.includes(currentSnippetIndex) && (
                  <Badge className="bg-green-500/10 text-green-500">
                    <Award className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isActive ? (
                  <Button onClick={handleStart} size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button onClick={handlePause} variant="outline" size="sm">
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
                <Button onClick={handleNextSnippet} variant="secondary" size="sm">
                  Next
                </Button>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round((userInput.length / targetCode.length) * 100)}%</span>
              </div>
              <Progress value={(userInput.length / targetCode.length) * 100} className="h-2" />
            </div>
            
            {/* Code Display */}
            <div className="relative mb-4">
              <div className="p-4 rounded-lg bg-muted font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {targetCode.split('').map((char, index) => (
                  <span key={index} className={getCharacterClass(char, index)}>
                    {char}
                  </span>
                ))}
              </div>
              
              {/* Hidden textarea for input capture */}
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                disabled={!isActive || isPaused}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>
            
            {/* Instructions */}
            {!isActive && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>Click "Start" or begin typing to begin the challenge</span>
              </div>
            )}
            
            {userInput === targetCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Excellent! {stats.wpm} WPM with {stats.accuracy}% accuracy</span>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
        
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 transition-all ${
                  achievement.unlocked 
                    ? "bg-primary/5 border-primary/50" 
                    : "opacity-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {achievement.icon}
                </div>
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">Achievement Unlocked!</p>
                  <p className="text-sm opacity-90">Keep up the great work!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
