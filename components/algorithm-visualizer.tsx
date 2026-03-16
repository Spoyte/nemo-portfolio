"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  BarChart3,
  GitCompare,
  ArrowRightLeft,
  Zap,
  Layers,
  Target,
  Clock,
  Trophy,
  Info,
  ChevronDown,
  ChevronUp,
  Code2,
  Binary,
  GitBranch,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type AlgorithmType = "bubble" | "quick" | "merge" | "heap" | "insertion" | "selection";
type DataType = "random" | "sorted" | "reversed" | "nearly-sorted";

interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  stable: boolean;
}

const ALGORITHMS: Record<AlgorithmType, AlgorithmInfo> = {
  bubble: {
    name: "Bubble Sort",
    description: "Simple comparison-based algorithm that repeatedly steps through the list.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  quick: {
    name: "Quick Sort",
    description: "Efficient divide-and-conquer algorithm using a pivot element.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
  },
  merge: {
    name: "Merge Sort",
    description: "Stable divide-and-conquer algorithm that divides and merges.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
  },
  heap: {
    name: "Heap Sort",
    description: "Comparison-based sorting using a binary heap data structure.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(1)",
    stable: false,
  },
  insertion: {
    name: "Insertion Sort",
    description: "Builds the final sorted array one item at a time.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  selection: {
    name: "Selection Sort",
    description: "Divides the input into sorted and unsorted regions.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
  },
};

export function AlgorithmVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("quick");
  const [dataType, setDataType] = useState<DataType>("random");
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate array
  const generateArray = useCallback(() => {
    const newArray: number[] = [];
    
    switch (dataType) {
      case "random":
        for (let i = 0; i < arraySize; i++) {
          newArray.push(Math.floor(Math.random() * 100) + 1);
        }
        break;
      case "sorted":
        for (let i = 0; i < arraySize; i++) {
          newArray.push(Math.floor((i / arraySize) * 100) + 1);
        }
        break;
      case "reversed":
        for (let i = 0; i < arraySize; i++) {
          newArray.push(Math.floor(((arraySize - i) / arraySize) * 100) + 1);
        }
        break;
      case "nearly-sorted":
        for (let i = 0; i < arraySize; i++) {
          const base = Math.floor((i / arraySize) * 100) + 1;
          newArray.push(base + Math.floor(Math.random() * 10) - 5);
        }
        break;
    }
    
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    setActiveIndices([]);
    setSortedIndices(new Set());
  }, [arraySize, dataType]);

  // Draw array
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--background") || "#0c0a09";
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (array.length === 0) return;

    const barWidth = rect.width / array.length;
    const maxVal = Math.max(...array);

    array.forEach((value, index) => {
      const barHeight = (value / maxVal) * (rect.height - 40);
      const x = index * barWidth;
      const y = rect.height - barHeight;

      // Color based on state
      let color = "#dc2626";
      if (sortedIndices.has(index)) {
        color = "#22c55e"; // Green for sorted
      } else if (activeIndices.includes(index)) {
        color = "#eab308"; // Yellow for active
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      // Draw value for small arrays
      if (array.length <= 30) {
        ctx.fillStyle = "#fafaf9";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      }
    });
  }, [array, activeIndices, sortedIndices]);

  // Sleep function for animation
  const sleep = useCallback((ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  // Get delay based on speed
  const getDelay = useCallback(() => {
    return Math.max(1, 101 - speed);
  }, [speed]);

  // Check if aborted
  const isAborted = useCallback(() => {
    return abortControllerRef.current?.signal.aborted ?? false;
  }, []);

  // Bubble Sort
  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (isAborted()) return;
        
        setActiveIndices([j, j + 1]);
        setComparisons(c => c + 1);
        await sleep(getDelay());

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setSwaps(s => s + 1);
          await sleep(getDelay());
        }
      }
      setSortedIndices(prev => new Set([...prev, n - i - 1]));
    }
    setSortedIndices(new Set(arr.map((_, i) => i)));
  }, [array, getDelay, isAborted]);

  // Quick Sort
  const quickSort = useCallback(async () => {
    const arr = [...array];
    
    const partition = async (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (isAborted()) return -1;
        
        setActiveIndices([j, high]);
        setComparisons(c => c + 1);
        await sleep(getDelay());

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          setSwaps(s => s + 1);
          await sleep(getDelay());
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      setSwaps(s => s + 1);
      await sleep(getDelay());

      return i + 1;
    };

    const sort = async (low: number, high: number) => {
      if (low < high && !isAborted()) {
        const pi = await partition(low, high);
        if (pi === -1) return;
        
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      }
    };

    await sort(0, arr.length - 1);
    if (!isAborted()) {
      setSortedIndices(new Set(arr.map((_, i) => i)));
    }
  }, [array, getDelay, isAborted]);

  // Merge Sort
  const mergeSort = useCallback(async () => {
    const arr = [...array];
    
    const merge = async (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length && !isAborted()) {
        setActiveIndices([left + i, mid + 1 + j]);
        setComparisons(c => c + 1);
        await sleep(getDelay());

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        setArray([...arr]);
        setSwaps(s => s + 1);
        await sleep(getDelay());
        k++;
      }

      while (i < leftArr.length && !isAborted()) {
        arr[k] = leftArr[i];
        setArray([...arr]);
        i++;
        k++;
        await sleep(getDelay());
      }

      while (j < rightArr.length && !isAborted()) {
        arr[k] = rightArr[j];
        setArray([...arr]);
        j++;
        k++;
        await sleep(getDelay());
      }
    };

    const sort = async (left: number, right: number) => {
      if (left < right && !isAborted()) {
        const mid = Math.floor((left + right) / 2);
        await sort(left, mid);
        await sort(mid + 1, right);
        await merge(left, mid, right);
      }
    };

    await sort(0, arr.length - 1);
    if (!isAborted()) {
      setSortedIndices(new Set(arr.map((_, i) => i)));
    }
  }, [array, getDelay, isAborted]);

  // Start sorting
  const startSort = useCallback(async () => {
    if (sorting) return;
    
    setSorting(true);
    setSortedIndices(new Set());
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    switch (algorithm) {
      case "bubble":
        await bubbleSort();
        break;
      case "quick":
        await quickSort();
        break;
      case "merge":
        await mergeSort();
        break;
      default:
        await quickSort();
    }

    clearInterval(timer);
    setSorting(false);
    setActiveIndices([]);
  }, [sorting, algorithm, bubbleSort, quickSort, mergeSort]);

  // Stop sorting
  const stopSort = useCallback(() => {
    abortControllerRef.current?.abort();
    setSorting(false);
    setActiveIndices([]);
  }, []);

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${seconds}.${millis.toString().padStart(2, "0")}s`;
  };

  // Draw on array change
  useEffect(() => {
    draw();
  }, [draw]);

  // Initialize
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const algoInfo = ALGORITHMS[algorithm];

  return (
    <section className="py-24 border-y border-border/50">
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
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Learning</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Algorithm{" "}
            <span className="text-gradient-animated">Visualizer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch sorting algorithms in action. Compare performance, understand complexity, 
            and see how different approaches solve the same problem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                className="w-full h-[300px] md:h-[400px] bg-background"
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <GitCompare className="h-4 w-4" /> Comparisons
                  </span>
                  <Badge variant="secondary">{comparisons.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4" /> Swaps
                  </span>
                  <Badge variant="secondary">{swaps.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Time
                  </span>
                  <Badge variant="secondary">{formatTime(elapsedTime)}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={sorting ? "destructive" : "default"}
                    onClick={sorting ? stopSort : startSort}
                    className="flex-1"
                    disabled={array.length === 0}
                  >
                    {sorting ? (
                      <><Pause className="h-4 w-4 mr-2" /> Stop</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Sort</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generateArray}
                    disabled={sorting}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Algorithm</label>
                  <Select
                    value={algorithm}
                    onValueChange={(v) => setAlgorithm(v as AlgorithmType)}
                    disabled={sorting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ALGORITHMS).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          {info.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Type</label>
                  <Select
                    value={dataType}
                    onValueChange={(v) => setDataType(v as DataType)}
                    disabled={sorting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="sorted">Sorted</SelectItem>
                      <SelectItem value="reversed">Reversed</SelectItem>
                      <SelectItem value="nearly-sorted">Nearly Sorted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Array Size: {arraySize}</label>
                  <Slider
                    value={[arraySize]}
                    onValueChange={([v]) => setArraySize(v)}
                    min={10}
                    max={100}
                    step={10}
                    disabled={sorting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {speed}%</label>
                  <Slider
                    value={[speed]}
                    onValueChange={([v]) => setSpeed(v)}
                    min={1}
                    max={100}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{algoInfo.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-muted-foreground">{algoInfo.description}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best:</span>
                          <code className="text-green-500">{algoInfo.timeComplexity.best}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Average:</span>
                          <code className="text-yellow-500">{algoInfo.timeComplexity.average}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Worst:</span>
                          <code className="text-red-500">{algoInfo.timeComplexity.worst}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Space:</span>
                          <code>{algoInfo.spaceComplexity}</code>
                        </div>
                      </div>

                      <Badge variant={algoInfo.stable ? "default" : "secondary"}>
                        {algoInfo.stable ? "Stable" : "Unstable"}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="w-full"
            >
              {showInfo ? (
                <><ChevronUp className="h-4 w-4 mr-2" /> Hide Info</>
              ) : (
                <><ChevronDown className="h-4 w-4 mr-2" /> Show Info</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
