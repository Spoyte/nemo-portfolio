"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Bug,
  CheckCircle2,
  AlertCircle,
  Terminal,
  RotateCcw,
  History,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: number;
  timestamp: string;
  type: "commit" | "bug" | "fix" | "test" | "deploy";
  message: string;
  code?: string;
  fixed?: boolean;
}

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 1,
    timestamp: "09:00 AM",
    type: "commit",
    message: "Initial feature implementation",
    code: "function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}",
  },
  {
    id: 2,
    timestamp: "09:15 AM",
    type: "bug",
    message: "Null reference error in production",
    code: "TypeError: Cannot read property 'price' of undefined",
    fixed: false,
  },
  {
    id: 3,
    timestamp: "09:30 AM",
    type: "fix",
    message: "Added null check for items array",
    code: "function calculateTotal(items) {\n  if (!items) return 0;\n  return items.reduce((sum, item) => sum + (item?.price || 0), 0);\n}",
    fixed: true,
  },
  {
    id: 4,
    timestamp: "10:00 AM",
    type: "test",
    message: "Added unit tests for edge cases",
    code: "test('handles null items', () => {\n  expect(calculateTotal(null)).toBe(0);\n});",
  },
  {
    id: 5,
    timestamp: "10:30 AM",
    type: "bug",
    message: "Performance issue with large arrays",
    code: "Warning: Long running script detected",
    fixed: false,
  },
  {
    id: 6,
    timestamp: "11:00 AM",
    type: "fix",
    message: "Optimized with early return and memoization",
    code: "const calculateTotal = memoize((items) => {\n  if (!items?.length) return 0;\n  return items.reduce((sum, item) => sum + (item?.price || 0), 0);\n});",
    fixed: true,
  },
  {
    id: 7,
    timestamp: "11:30 AM",
    type: "deploy",
    message: "Successfully deployed to production",
  },
];

const EVENT_ICONS = {
  commit: Terminal,
  bug: Bug,
  fix: CheckCircle2,
  test: Sparkles,
  deploy: History,
};

const EVENT_COLORS = {
  commit: "bg-blue-500",
  bug: "bg-red-500",
  fix: "bg-green-500",
  test: "bg-purple-500",
  deploy: "bg-amber-500",
};

export function TimeTravelDebugger() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAlternate, setShowAlternate] = useState(false);
  const [visitedStates, setVisitedStates] = useState<Set<number>>(new Set([0]));
  
  const currentEvent = MOCK_TIMELINE[currentIndex];
  const Icon = EVENT_ICONS[currentEvent.type];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < MOCK_TIMELINE.length - 1) {
            const next = prev + 1;
            setVisitedStates((s) => new Set([...s, next]));
            return next;
          }
          setIsPlaying(false);
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setVisitedStates(new Set([0]));
    setShowAlternate(false);
  };

  const handleTimeTravel = (index: number) => {
    setCurrentIndex(index);
    setVisitedStates((s) => new Set([...s, index]));
    setShowAlternate(false);
  };

  // Generate "what if" alternate timeline
  const generateAlternateTimeline = () => {
    if (currentEvent.type === "bug" && !currentEvent.fixed) {
      return {
        message: "What if you caught this bug earlier?",
        suggestion: "Add TypeScript strict mode or runtime type checking",
        code: "// With TypeScript\ninterface Item {\n  price: number;\n}\n\nfunction calculateTotal(items: Item[]): number {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}",
      };
    }
    return null;
  };

  const alternate = generateAlternateTimeline();

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time Travel Debugger</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Debug Through{" "}
            <span className="text-gradient-animated">Time</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience a development timeline. Travel back to any moment and explore "what if" scenarios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Event Display */}
            <div className="relative p-8 rounded-3xl bg-card border border-border overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / MOCK_TIMELINE.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex items-start gap-6">
                <motion.div
                  key={currentEvent.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`p-4 rounded-2xl ${EVENT_COLORS[currentEvent.type]} text-white`}
                >
                  <Icon className="h-8 w-8" />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{currentEvent.timestamp}</Badge>
                    <Badge className={EVENT_COLORS[currentEvent.type]} variant="secondary">
                      {currentEvent.type.toUpperCase()}
                    </Badge>
                    {currentEvent.fixed && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Fixed
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-4">{currentEvent.message}</h3>

                  {currentEvent.code && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-black/90 font-mono text-sm overflow-x-auto"
                    >
                      <pre className="text-green-400">
                        <code>{currentEvent.code}</code>
                      </pre>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Alternate Timeline Option */}
              <AnimatePresence>
                {alternate && showAlternate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/20">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-500 mb-2">{alternate.message}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{alternate.suggestion}</p>
                        <div className="p-3 rounded-lg bg-black/50 font-mono text-xs">
                          <pre className="text-purple-300">
                            <code>{alternate.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-card border border-border">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTimeTravel(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant={isPlaying ? "destructive" : "default"}
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-8"
              >
                {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isPlaying ? "Pause" : "Play Timeline"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTimeTravel(Math.min(MOCK_TIMELINE.length - 1, currentIndex + 1))}
                disabled={currentIndex === MOCK_TIMELINE.length - 1}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              {alternate && (
                <Button
                  variant="outline"
                  onClick={() => setShowAlternate(!showAlternate)}
                  className="ml-4"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {showAlternate ? "Hide" : "What If?"}
                </Button>
              )}
            </div>
          </div>

          {/* Timeline Navigation */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Timeline
              </h3>

              <div className="relative space-y-0">
                {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-secondary" />

                {MOCK_TIMELINE.map((event, index) => {
                  const EventIcon = EVENT_ICONS[event.type];
                  const isActive = index === currentIndex;
                  const isVisited = visitedStates.has(index);
                  const isFuture = index > currentIndex;

                  return (
                    <motion.button
                      key={event.id}
                      onClick={() => handleTimeTravel(index)}
                      className={`relative w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                        isActive
                          ? "bg-primary/10 border border-primary/50"
                          : isVisited
                          ? "bg-secondary/50 hover:bg-secondary"
                          : "opacity-50 hover:opacity-75"
                      }`}
                      whileHover={{ x: isFuture ? 0 : 4 }}
                    >
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive
                            ? EVENT_COLORS[event.type]
                            : isVisited
                            ? "bg-secondary border-2 border-primary"
                            : "bg-secondary"
                        }`}
                      >
                        <EventIcon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : ""}`}>
                          {event.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                      </div>

                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 border border-primary/20">
              <h3 className="font-semibold mb-4">Session Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/50 dark:bg-black/50">
                  <p className="text-2xl font-bold text-primary">{visitedStates.size}</p>
                  <p className="text-xs text-muted-foreground">States Visited</p>
                </div>
                
                <div className="p-3 rounded-xl bg-white/50 dark:bg-black/50">
                  <p className="text-2xl font-bold text-green-500">
                    {MOCK_TIMELINE.filter((e, i) => visitedStates.has(i) && e.fixed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Bugs Fixed</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/50 dark:bg-black/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-medium">Time Travel Tip</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click any timeline event to jump to that moment. 
                  Use "What If?" to see alternative solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
