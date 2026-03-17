"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Bug,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Clock,
  Eye,
  EyeOff,
  StepForward,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface Variable {
  name: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean" | "array" | "object";
  changed?: boolean;
}

interface StackFrame {
  function: string;
  line: number;
  variables: Variable[];
}

interface ExecutionStep {
  line: number;
  code: string;
  description: string;
  variables: Variable[];
  stack: StackFrame[];
  output?: string;
  error?: string;
}

const debugCode = `function calculateTotal(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const price = item.price;
    const quantity = item.quantity;
    
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }
    
    const subtotal = price * quantity;
    total += subtotal;
  }
  
  return total;
}

const cart = [
  { price: 10, quantity: 2 },
  { price: 25, quantity: 1 },
  { price: 5, quantity: 3 }
];

const result = calculateTotal(cart);
console.log("Total:", result);`;

const executionSteps: ExecutionStep[] = [
  {
    line: 1,
    code: "function calculateTotal(items) {",
    description: "Function declaration - creating calculateTotal",
    variables: [],
    stack: [{ function: "Global", line: 1, variables: [] }],
  },
  {
    line: 17,
    code: "const cart = [...]",
    description: "Creating cart array with 3 items",
    variables: [
      { name: "cart", value: "[3 items]", type: "array", changed: true },
    ],
    stack: [{ function: "Global", line: 17, variables: [{ name: "cart", value: "[3 items]", type: "array" }] }],
  },
  {
    line: 23,
    code: "const result = calculateTotal(cart);",
    description: "Calling calculateTotal with cart",
    variables: [
      { name: "cart", value: "[3 items]", type: "array" },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 1, variables: [{ name: "items", value: "[3 items]", type: "array" }] },
    ],
  },
  {
    line: 2,
    code: "let total = 0;",
    description: "Initializing total to 0",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 0, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 2, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 0, type: "number" },
      ]},
    ],
  },
  {
    line: 4,
    code: "for (let i = 0; i < items.length; i++)",
    description: "Starting loop, i = 0",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 0, type: "number" },
      { name: "i", value: 0, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 4, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 0, type: "number" },
        { name: "i", value: 0, type: "number" },
      ]},
    ],
  },
  {
    line: 5,
    code: "const item = items[i];",
    description: "Getting first item: { price: 10, quantity: 2 }",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 0, type: "number" },
      { name: "i", value: 0, type: "number" },
      { name: "item", value: "{ price: 10, quantity: 2 }", type: "object", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 5, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 0, type: "number" },
        { name: "i", value: 0, type: "number" },
        { name: "item", value: "{...}", type: "object" },
      ]},
    ],
  },
  {
    line: 9,
    code: "if (price < 0)",
    description: "Checking if price is negative (10 < 0 = false)",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 0, type: "number" },
      { name: "i", value: 0, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 10, type: "number", changed: true },
      { name: "quantity", value: 2, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 9, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 0, type: "number" },
        { name: "i", value: 0, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 10, type: "number" },
        { name: "quantity", value: 2, type: "number" },
      ]},
    ],
  },
  {
    line: 13,
    code: "const subtotal = price * quantity;",
    description: "Calculating subtotal: 10 * 2 = 20",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 0, type: "number" },
      { name: "i", value: 0, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 10, type: "number" },
      { name: "quantity", value: 2, type: "number" },
      { name: "subtotal", value: 20, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 13, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 0, type: "number" },
        { name: "i", value: 0, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 10, type: "number" },
        { name: "quantity", value: 2, type: "number" },
        { name: "subtotal", value: 20, type: "number" },
      ]},
    ],
  },
  {
    line: 14,
    code: "total += subtotal;",
    description: "Adding to total: 0 + 20 = 20",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 20, type: "number", changed: true },
      { name: "i", value: 0, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 10, type: "number" },
      { name: "quantity", value: 2, type: "number" },
      { name: "subtotal", value: 20, type: "number" },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 14, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 20, type: "number" },
        { name: "i", value: 0, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 10, type: "number" },
        { name: "quantity", value: 2, type: "number" },
        { name: "subtotal", value: 20, type: "number" },
      ]},
    ],
  },
  {
    line: 4,
    code: "for (let i = 0; i < items.length; i++)",
    description: "Loop iteration 2, i = 1",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 20, type: "number" },
      { name: "i", value: 1, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 4, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 20, type: "number" },
        { name: "i", value: 1, type: "number" },
      ]},
    ],
  },
  {
    line: 5,
    code: "const item = items[i];",
    description: "Getting second item: { price: 25, quantity: 1 }",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 20, type: "number" },
      { name: "i", value: 1, type: "number" },
      { name: "item", value: "{ price: 25, quantity: 1 }", type: "object", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 5, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 20, type: "number" },
        { name: "i", value: 1, type: "number" },
        { name: "item", value: "{...}", type: "object" },
      ]},
    ],
  },
  {
    line: 13,
    code: "const subtotal = price * quantity;",
    description: "Calculating subtotal: 25 * 1 = 25",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 20, type: "number" },
      { name: "i", value: 1, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 25, type: "number", changed: true },
      { name: "quantity", value: 1, type: "number", changed: true },
      { name: "subtotal", value: 25, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 13, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 20, type: "number" },
        { name: "i", value: 1, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 25, type: "number" },
        { name: "quantity", value: 1, type: "number" },
        { name: "subtotal", value: 25, type: "number" },
      ]},
    ],
  },
  {
    line: 14,
    code: "total += subtotal;",
    description: "Adding to total: 20 + 25 = 45",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 45, type: "number", changed: true },
      { name: "i", value: 1, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 25, type: "number" },
      { name: "quantity", value: 1, type: "number" },
      { name: "subtotal", value: 25, type: "number" },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 14, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 45, type: "number" },
        { name: "i", value: 1, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 25, type: "number" },
        { name: "quantity", value: 1, type: "number" },
        { name: "subtotal", value: 25, type: "number" },
      ]},
    ],
  },
  {
    line: 4,
    code: "for (let i = 0; i < items.length; i++)",
    description: "Loop iteration 3, i = 2",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 45, type: "number" },
      { name: "i", value: 2, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 4, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 45, type: "number" },
        { name: "i", value: 2, type: "number" },
      ]},
    ],
  },
  {
    line: 5,
    code: "const item = items[i];",
    description: "Getting third item: { price: 5, quantity: 3 }",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 45, type: "number" },
      { name: "i", value: 2, type: "number" },
      { name: "item", value: "{ price: 5, quantity: 3 }", type: "object", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 5, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 45, type: "number" },
        { name: "i", value: 2, type: "number" },
        { name: "item", value: "{...}", type: "object" },
      ]},
    ],
  },
  {
    line: 13,
    code: "const subtotal = price * quantity;",
    description: "Calculating subtotal: 5 * 3 = 15",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 45, type: "number" },
      { name: "i", value: 2, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 5, type: "number", changed: true },
      { name: "quantity", value: 3, type: "number", changed: true },
      { name: "subtotal", value: 15, type: "number", changed: true },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 13, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 45, type: "number" },
        { name: "i", value: 2, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 5, type: "number" },
        { name: "quantity", value: 3, type: "number" },
        { name: "subtotal", value: 15, type: "number" },
      ]},
    ],
  },
  {
    line: 14,
    code: "total += subtotal;",
    description: "Adding to total: 45 + 15 = 60",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 60, type: "number", changed: true },
      { name: "i", value: 2, type: "number" },
      { name: "item", value: "{...}", type: "object" },
      { name: "price", value: 5, type: "number" },
      { name: "quantity", value: 3, type: "number" },
      { name: "subtotal", value: 15, type: "number" },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 14, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 60, type: "number" },
        { name: "i", value: 2, type: "number" },
        { name: "item", value: "{...}", type: "object" },
        { name: "price", value: 5, type: "number" },
        { name: "quantity", value: 3, type: "number" },
        { name: "subtotal", value: 15, type: "number" },
      ]},
    ],
  },
  {
    line: 17,
    code: "return total;",
    description: "Returning final total: 60",
    variables: [
      { name: "items", value: "[3 items]", type: "array" },
      { name: "total", value: 60, type: "number" },
    ],
    stack: [
      { function: "Global", line: 23, variables: [{ name: "cart", value: "[3 items]", type: "array" }] },
      { function: "calculateTotal", line: 17, variables: [
        { name: "items", value: "[3 items]", type: "array" },
        { name: "total", value: 60, type: "number" },
      ]},
    ],
    output: "→ 60",
  },
  {
    line: 23,
    code: "const result = calculateTotal(cart);",
    description: "Function returned, result = 60",
    variables: [
      { name: "cart", value: "[3 items]", type: "array" },
      { name: "result", value: 60, type: "number", changed: true },
    ],
    stack: [{ function: "Global", line: 23, variables: [
      { name: "cart", value: "[3 items]", type: "array" },
      { name: "result", value: 60, type: "number" },
    ]}],
  },
  {
    line: 24,
    code: 'console.log("Total:", result);',
    description: "Outputting result to console",
    variables: [
      { name: "cart", value: "[3 items]", type: "array" },
      { name: "result", value: 60, type: "number" },
    ],
    stack: [{ function: "Global", line: 24, variables: [
      { name: "cart", value: "[3 items]", type: "array" },
      { name: "result", value: 60, type: "number" },
    ]}],
    output: "Total: 60",
  },
];

export function TimeTravelDebugger() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [showVariables, setShowVariables] = useState(true);
  const [showStack, setShowStack] = useState(true);

  const step = executionSteps[currentStep];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= executionSteps.length - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2000 - speed * 18);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "number": return "text-blue-400";
      case "string": return "text-green-400";
      case "boolean": return "text-purple-400";
      case "array": return "text-orange-400";
      case "object": return "text-cyan-400";
      default: return "text-slate-400";
    }
  };

  return (
    <section className="py-24 border-y border-border/50 bg-gradient-to-b from-background via-amber-950/5 to-background overflow-hidden">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 mb-6"
          >
            <Bug className="h-4 w-4" />
            <span className="text-sm font-medium">Debug Visualization</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Time Travel{" "}
            <span className="text-gradient-animated">Debugger</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Step through code execution in slow motion. Watch variables change, 
            see the call stack grow, and understand exactly how your code runs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-3 text-sm text-slate-400">calculateTotal.js</span>
                </div>
                <Badge variant="outline" className="bg-slate-800">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  No Errors
                </Badge>
              </div>

              {/* Code Content */}
              <div className="p-4 font-mono text-sm overflow-x-auto">
                {debugCode.split("\n").map((line, index) => {
                  const lineNum = index + 1;
                  const isActive = lineNum === step.line;
                  const hasExecuted = executionSteps.findIndex(s => s.line === lineNum) <= currentStep &&
                    executionSteps.findIndex(s => s.line === lineNum) !== -1;

                  return (
                    <motion.div
                      key={index}
                      animate={{
                        backgroundColor: isActive ? "rgba(245, 158, 11, 0.2)" : "transparent",
                      }}
                      className="flex items-start gap-4 py-0.5 px-2 rounded"
                    >
                      <span className={`w-8 text-right select-none text-xs ${
                        isActive ? "text-amber-400 font-bold" : "text-slate-600"
                      }`}>
                        {lineNum}
                      </span>
                      <span className={`${
                        isActive ? "text-amber-200" : hasExecuted ? "text-slate-300" : "text-slate-500"
                      }`}>
                        {line || " "}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Console Output */}
              <div className="border-t border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs">
                  <Terminal className="h-3 w-3" />
                  Console
                </div>
                <div className="font-mono text-sm text-green-400 min-h-[1.5em]">
                  {step.output || " "}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Debug Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentStep(s => Math.min(executionSteps.length - 1, s + 1))}
                    disabled={currentStep >= executionSteps.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Step {currentStep + 1}/{executionSteps.length}
                </Badge>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Playback Speed
                </label>
                <Slider
                  value={[speed]}
                  onValueChange={([v]) => setSpeed(v)}
                  min={10}
                  max={100}
                />
              </div>
            </div>

            {/* Step Description */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <StepForward className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Current Step</h4>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            </div>

            {/* Variables */}
            <AnimatePresence mode="wait">
              {showVariables && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowVariables(!showVariables)}
                  >
                    <h3 className="font-semibold flex items-center gap-2">
                      {showVariables ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      Variables
                    </h3>
                    <Badge variant="outline">{step.variables.length}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {step.variables.map((variable) => (
                      <motion.div
                        key={variable.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          variable.changed ? "bg-amber-500/10 border border-amber-500/30" : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {variable.type}
                          </Badge>
                          <span className="font-mono text-sm">{variable.name}</span>
                        </div>
                        <span className={`font-mono text-sm ${getTypeColor(variable.type)}`}>
                          {String(variable.value)}
                        </span>
                      </motion.div>
                    ))}
                    {step.variables.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No variables in scope
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Call Stack */}
            <AnimatePresence mode="wait">
              {showStack && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => setShowStack(!showStack)}
                  >
                    <h3 className="font-semibold flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Call Stack
                    </h3>
                    <Badge variant="outline">{step.stack.length} frames</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {step.stack.map((frame, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg ${
                          index === step.stack.length - 1 
                            ? "bg-blue-500/10 border border-blue-500/30" 
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm font-semibold">
                            {frame.function}()
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Line {frame.line}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {frame.variables.slice(0, 3).map((v) => (
                            <span 
                              key={v.name}
                              className="text-xs text-muted-foreground font-mono"
                            >
                              {v.name}={String(v.value).slice(0, 15)}
                              {String(v.value).length > 15 && "..."}
                            </span>
                          ))}
                          {frame.variables.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{frame.variables.length - 3} more
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
