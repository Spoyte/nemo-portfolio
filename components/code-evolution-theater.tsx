"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Share2,
  Sparkles,
  Code2,
  Cpu,
  Zap,
  Brain,
  Bot,
  MessageSquare,
  Send,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CodeEvolution {
  id: string;
  name: string;
  description: string;
  initialCode: string;
  evolutionSteps: EvolutionStep[];
  language: string;
  icon: React.ReactNode;
  color: string;
}

interface EvolutionStep {
  title: string;
  description: string;
  code: string;
  improvements: string[];
  timestamp: number;
}

const codeEvolutions: CodeEvolution[] = [
  {
    id: "react-component",
    name: "React Component Evolution",
    description: "Watch a simple button evolve into a polymorphic, accessible component",
    language: "tsx",
    icon: <Code2 className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    initialCode: `function Button({ text }) {
  return <button>{text}</button>;
}`,
    evolutionSteps: [
      {
        title: "Adding Props",
        description: "Making it configurable",
        timestamp: 2000,
        code: `function Button({ 
  text, 
  onClick, 
  disabled = false 
}) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}`,
        improvements: ["Added onClick handler", "Added disabled state", "Default parameter"]
      },
      {
        title: "Type Safety",
        description: "Adding TypeScript",
        timestamp: 4000,
        code: `interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({ 
  text, 
  onClick, 
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={\`btn btn-\${variant}\`}
    >
      {text}
    </button>
  );
}`,
        improvements: ["Added TypeScript interfaces", "Variant support", "Better type safety"]
      },
      {
        title: "Polymorphic",
        description: "Making it work with any element",
        timestamp: 6000,
        code: `type ButtonProps<T extends React.ElementType = 'button'> = {
  as?: T;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

function Button<T extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  
  return (
    <Component 
      className={cn(
        'inline-flex items-center justify-center',
        buttonVariants({ variant, size })
      )}
      {...props}
    >
      {children}
    </Component>
  );
}`,
        improvements: ["Polymorphic component pattern", "Children instead of text", "Size variants", "Class variance authority"]
      },
      {
        title: "Production Ready",
        description: "Full accessibility and features",
        timestamp: 8000,
        code: `import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };`,
        improvements: ["Forward ref for ref forwarding", "Radix UI Slot", "Full accessibility", "CVA for variant management", "Shadcn/ui standard"]
      }
    ]
  },
  {
    id: "api-handler",
    name: "API Handler Evolution",
    description: "From simple fetch to robust error handling",
    language: "typescript",
    icon: <Cpu className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    initialCode: `async function getUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}`,
    evolutionSteps: [
      {
        title: "Error Handling",
        description: "Basic error management",
        timestamp: 2000,
        code: `async function getUser(id: string) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}`,
        improvements: ["Added try-catch", "Response status check", "Type safety", "Error logging"]
      },
      {
        title: "Retry Logic",
        description: "Handling transient failures",
        timestamp: 4000,
        code: `async function getUser(
  id: string, 
  retries = 3
): Promise<User> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(\`/api/users/\${id}\`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status === 429) {
        await delay(1000 * Math.pow(2, i)); // Exponential backoff
        continue;
      }
      
      if (!res.ok) {
        throw new APIError(res.status, 'Failed to fetch user');
      }
      
      return await res.json();
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error('Max retries exceeded');
}`,
        improvements: ["Retry mechanism", "Exponential backoff", "Rate limit handling", "Custom error class"]
      },
      {
        title: "Full Implementation",
        description: "Production-grade API client",
        timestamp: 6000,
        code: `interface APIClientConfig {
  baseURL: string;
  retries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private config: APIClientConfig;
  
  constructor(config: APIClientConfig) {
    this.config = { retries: 3, timeout: 5000, ...config };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.config.baseURL}\${endpoint}\`;
    
    for (let i = 0; i < this.config.retries!; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const res = await fetch(url, {
          ...options,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (res.status === 429) {
          const delay = 1000 * Math.pow(2, i);
          await this.sleep(delay);
          continue;
        }

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new APIError(res.status, error.message || 'Request failed', error);
        }

        return await res.json();
      } catch (error) {
        if (error instanceof APIError) throw error;
        if (i === this.config.retries! - 1) throw error;
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const api = new APIClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  headers: { 'X-API-Version': 'v1' }
});

export const getUser = (id: string) => 
  api.request<User>(\`/users/\${id}\`);`,
        improvements: ["Class-based architecture", "Configurable options", "AbortController for timeout", "Environment-based config"]
      }
    ]
  },
  {
    id: "state-management",
    name: "State Management Evolution",
    description: "From useState to global state with persistence",
    language: "tsx",
    icon: <Brain className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    initialCode: `function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +
      </button>
    </div>
  );
}`,
    evolutionSteps: [
      {
        title: "Reducer Pattern",
        description: "More complex state logic",
        timestamp: 2000,
        code: `type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number };

interface State {
  count: number;
  history: number[];
}

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { 
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      };
    case 'decrement':
      return { 
        count: state.count - 1,
        history: [...state.history, state.count - 1]
      };
    case 'reset':
      return { count: 0, history: [] };
    case 'set':
      return { 
        count: action.payload,
        history: [...state.history, action.payload]
      };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: []
  });
  
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>
      <p>History: {state.history.join(', ')}</p>
    </div>
  );
}`,
        improvements: ["useReducer for complex state", "Action types", "History tracking", "Type-safe actions"]
      },
      {
        title: "Context + Reducer",
        description: "Global state management",
        timestamp: 4000,
        code: `interface CounterContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const CounterContext = createContext<CounterContextType | null>(null);

function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: []
  });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
}

// Components can now access state anywhere
function CounterDisplay() {
  const { state } = useCounter();
  return <p>{state.count}</p>;
}

function CounterControls() {
  const { dispatch } = useCounter();
  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}`,
        improvements: ["React Context for global state", "Custom hook", "Provider pattern", "Error handling for misuse"]
      },
      {
        title: "With Persistence",
        description: "Local storage integration",
        timestamp: 6000,
        code: `interface PersistedState<T> {
  data: T;
  version: number;
  timestamp: number;
}

function usePersistedReducer<T, A>(
  key: string,
  reducer: (state: T, action: A) => T,
  initialState: T,
  version = 1
) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === 'undefined') return init;
    
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed: PersistedState<T> = JSON.parse(item);
        if (parsed.version === version) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn('Failed to load persisted state:', e);
    }
    return init;
  });

  useEffect(() => {
    const persisted: PersistedState<T> = {
      data: state,
      version,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(persisted));
  }, [state, key, version]);

  return [state, dispatch] as const;
}

// Zustand-style store (modern approach)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CounterStore {
  count: number;
  history: number[];
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>()(
  persist(
    (set) => ({
      count: 0,
      history: [],
      increment: () => set((state) => ({
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      })),
      decrement: () => set((state) => ({
        count: state.count - 1,
        history: [...state.history, state.count - 1]
      })),
      reset: () => set({ count: 0, history: [] })
    }),
    { name: 'counter-storage' }
  )
);`,
        improvements: ["localStorage persistence", "Version migration support", "Zustand for simpler API", "Middleware pattern"]
      }
    ]
  }
];

export function CodeEvolutionTheater() {
  const [selectedEvolution, setSelectedEvolution] = useState<CodeEvolution>(codeEvolutions[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(selectedEvolution.initialCode);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const currentStepData = selectedEvolution.evolutionSteps[currentStep];

  useEffect(() => {
    if (currentStep === 0) {
      setDisplayedCode(selectedEvolution.initialCode);
    } else {
      setDisplayedCode(selectedEvolution.evolutionSteps[currentStep - 1].code);
    }
  }, [selectedEvolution, currentStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < selectedEvolution.evolutionSteps.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= selectedEvolution.evolutionSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, selectedEvolution]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setDisplayedCode(selectedEvolution.initialCode);
  };

  const handleExport = () => {
    const code = currentStep === 0 
      ? selectedEvolution.initialCode 
      : selectedEvolution.evolutionSteps[currentStep - 1].code;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEvolution.id}-step-${currentStep}.${selectedEvolution.language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const code = currentStep === 0 
      ? selectedEvolution.initialCode 
      : selectedEvolution.evolutionSteps[currentStep - 1].code;
    
    if (navigator.share) {
      await navigator.share({
        title: `Code Evolution: ${selectedEvolution.name}`,
        text: code.slice(0, 200) + '...',
      });
    } else {
      await navigator.clipboard.writeText(code);
    }
  };

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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Learning</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Code Evolution{" "}
            <span className="text-gradient-animated">Theater</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch code evolve from simple beginnings to production-ready implementations. 
            Step through each transformation and learn the reasoning behind every change.
          </p>
        </motion.div>

        {/* Evolution Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {codeEvolutions.map((evo) => (
            <motion.button
              key={evo.id}
              onClick={() => {
                setSelectedEvolution(evo);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl border text-left transition-all ${
                selectedEvolution.id === evo.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${evo.color} mb-4`}>
                {evo.icon}
              </div>
              <h3 className="font-semibold mb-1">{evo.name}</h3>
              <p className="text-sm text-muted-foreground">{evo.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Code Theater */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Display */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {selectedEvolution.name.toLowerCase().replace(/\s+/g, '-')}.{selectedEvolution.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleExport}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Code Content */}
              <div className="relative">
                <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                  <code className="language-typescript">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {displayedCode}
                      </motion.div>
                    </AnimatePresence>
                  </code>
                </pre>

                {/* AI Chat Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChat(!showChat)}
                  className="absolute bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                  <Bot className="w-5 h-5" />
                </motion.button>

                {/* AI Chat Panel */}
                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="absolute bottom-16 right-4 w-80 rounded-xl border border-border bg-card shadow-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-primary" />
                          <span className="font-medium">Code Assistant</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowChat(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                        <div className="flex gap-2">
                          <Bot className="w-4 h-4 text-primary mt-1 shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            Ask me about this code evolution! I can explain the changes, 
                            suggest improvements, or help you understand the patterns.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Ask about this code..."
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && chatMessage.trim()) {
                              setChatMessage('');
                            }
                          }}
                        />
                        <Button size="icon" className="shrink-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="px-4 py-3 border-t border-border bg-muted/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Step {currentStep} of {selectedEvolution.evolutionSteps.length}
                  </span>
                  <span className="font-medium">
                    {currentStep === 0 ? 'Initial' : currentStepData?.title}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(currentStep / selectedEvolution.evolutionSteps.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step Info */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {currentStep > 0 && currentStepData && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <Badge className="mb-4" variant="secondary">
                    {currentStepData.title}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentStepData.description}
                  </h3>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Improvements:</p>
                    {currentStepData.improvements.map((improvement, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Zap className="w-4 h-4 text-yellow-500" />
                        {improvement}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <Badge className="mb-4" variant="secondary">Starting Point</Badge>
                <h3 className="text-lg font-semibold mb-2">Simple Beginnings</h3>
                <p className="text-muted-foreground">
                  Every great codebase starts simple. This is the initial implementation 
                  — functional but basic. Click play to watch it evolve!
                </p>
              </motion.div>
            )}

            {/* Step Navigation */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentStep === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(0)}
              >
                Start
              </Button>
              {selectedEvolution.evolutionSteps.map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentStep === idx + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStep(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
