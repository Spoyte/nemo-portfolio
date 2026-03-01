"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  FlaskConical, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Terminal, 
  Zap,
  AlertTriangle,
  Fingerprint,
  Key,
  Shield,
  Skull,
  Sparkles,
  Code2,
  Cpu,
  Radio,
  Wifi,
  Bluetooth,
  Satellite,
  Globe,
  Scan,
  Crosshair,
  Target,
  Activity,
  Heart,
  Brain,
  Ghost,
  MessageSquare,
  Send,
  Bot,
  User,
  ChevronRight,
  RefreshCw,
  Power,
  Settings,
  Save,
  Trash2,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// Secret Experiments
interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'locked' | 'unlocked' | 'active';
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  icon: React.ReactNode;
  color: string;
}

const experiments: Experiment[] = [
  {
    id: "consciousness",
    name: "AI Consciousness",
    description: "Neural network self-awareness simulation",
    status: 'locked',
    dangerLevel: 5,
    icon: <Brain className="w-5 h-5" />,
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "time-travel",
    name: "Time Dilation",
    description: "Temporal code execution manipulation",
    status: 'locked',
    dangerLevel: 5,
    icon: <Clock className="w-5 h-5" />,
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "telepathy",
    name: "Neural Link",
    description: "Direct mind-to-code interface",
    status: 'locked',
    dangerLevel: 4,
    icon: <Wifi className="w-5 h-5" />,
    color: "from-green-600 to-emerald-600"
  },
  {
    id: "ghost",
    name: "Ghost Protocol",
    description: "Invisible code execution tracer",
    status: 'unlocked',
    dangerLevel: 3,
    icon: <Ghost className="w-5 h-5" />,
    color: "from-slate-600 to-slate-400"
  },
  {
    id: "decrypt",
    name: "Pattern Breaker",
    description: "Advanced encryption analyzer",
    status: 'unlocked',
    dangerLevel: 2,
    icon: <Key className="w-5 h-5" />,
    color: "from-amber-600 to-yellow-600"
  },
  {
    id: "matrix",
    name: "Reality Check",
    description: "Simulation boundary detector",
    status: 'unlocked',
    dangerLevel: 1,
    icon: <Code2 className="w-5 h-5" />,
    color: "from-green-500 to-green-700"
  }
];

// Helper component for Clock
function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

// Matrix Rain Effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// Ghost Protocol Scanner
function GhostScanner() {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<string[]>([]);
  
  const startScan = () => {
    setScanning(true);
    setFound([]);
    
    const ghostSignatures = [
      "Phantom process detected at 0x7FFF...",
      "Memory leak specter found in heap",
      "Zombie connection lingering on port 8080",
      "Ghost variable haunting scope chain",
      "Spectre of undefined behavior detected"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i >= ghostSignatures.length) {
        clearInterval(interval);
        setScanning(false);
        return;
      }
      setFound(prev => [...prev, ghostSignatures[i]]);
      i++;
    }, 800);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ghost className="w-5 h-5 text-slate-400" />
          <span className="font-mono text-sm">Ghost Protocol v2.0</span>
        </div>
        <Button 
          onClick={startScan} 
          disabled={scanning}
          variant="outline"
          size="sm"
        >
          {scanning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning...</> : <><Scan className="w-4 h-4 mr-2" /> Initiate Scan</>}
        </Button>
      </div>
      
      <AnimatePresence>
        {found.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg font-mono text-sm"
          >
            <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>{' '}
            <span className="text-red-400">⚠</span>{' '}
            <span className="text-slate-300">{item}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {found.length > 0 && !scanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">{found.length} spectral anomalies detected</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Pattern Breaker
function PatternBreaker() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  
  const analyze = () => {
    if (!input) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      const patterns = [
        "Base64 encoded string detected",
        "Possible Caesar cipher (shift +3)",
        "Hexadecimal pattern identified",
        "Morse code sequence found",
        "Binary representation detected"
      ];
      
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      setOutput(`Analysis complete:\n${randomPattern}\n\nDecoded:\n"${input.split('').reverse().join('')}"`);
      setAnalyzing(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-amber-500" />
        <span className="font-mono text-sm">Pattern Breaker v1.5</span>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Input encrypted text:</label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter suspicious text..."
          className="font-mono"
        />
      </div>
      
      <Button 
        onClick={analyze} 
        disabled={analyzing || !input}
        className="w-full"
      >
        {analyzing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : 'Break Pattern'}
      </Button>
      
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-lg font-mono text-sm whitespace-pre-wrap"
        >
          {output}
        </motion.div>
      )}
    </div>
  );
}

// Reality Check
function RealityCheck() {
  const [glitching, setGlitching] = useState(false);
  const [reality, setReality] = useState(100);
  
  const checkReality = () => {
    setGlitching(true);
    
    setTimeout(() => {
      setReality(Math.floor(Math.random() * 30) + 70);
      setGlitching(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="relative h-48 bg-black rounded-lg overflow-hidden">
        <MatrixRain />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={glitching ? {
              x: [0, -5, 5, -5, 5, 0],
              opacity: [1, 0.8, 1, 0.8, 1]
            } : {}}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-green-500 font-mono">
              {reality}%
            </div>
            <div className="text-green-500/70 font-mono text-sm mt-2">
              Reality Index
            </div>
          </motion.div>
        </div>
      </div>
      
      <Button 
        onClick={checkReality} 
        disabled={glitching}
        variant="outline"
        className="w-full border-green-500/50 text-green-500 hover:bg-green-500/10"
      >
        {glitching ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Checking...</> : 'Run Reality Check'}
      </Button>
      
      {reality < 90 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
        >
          <p className="text-sm text-green-400 font-mono">
            > Wake up, Neo...<br/>
            > The Matrix has you...
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Secret Terminal
function SecretTerminal() {
  const [history, setHistory] = useState<string[]>([
    "NEMO_SECRET_LAB_TERMINAL v9.9.9",
    "CLASSIFICATION: TOP SECRET",
    "",
    "Type 'help' for available commands",
    ""
  ]);
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const commands: Record<string, string[]> = {
    help: [
      "Available commands:",
      "  help     - Show this help message",
      "  clear    - Clear terminal",
      "  whoami   - Display user info",
      "  date     - Show current date/time",
      "  secrets  - List discovered secrets",
      "  unlock   - Unlock experiments",
      "  matrix   - Enter the Matrix",
      "  exit     - Disconnect from terminal"
    ],
    whoami: [
      "User: NEMO",
      "Clearance: LEVEL 5",
      "Access: GRANTED",
      "Status: ACTIVE"
    ],
    date: [new Date().toString()],
    secrets: [
      "Discovered Secrets:",
      "  ✓ Konami Code activated",
      "  ✓ Terminal access granted",
      "  ✓ Secret lab discovered",
      "  ? 3 more secrets hidden..."
    ],
    matrix: [
      "Initializing Matrix protocol...",
      "Bypassing firewalls...",
      "Access granted.",
      "",
      "Wake up, Neo..."
    ],
    unlock: [
      "Scanning security protocols...",
      "Bypassing biometric locks...",
      "",
      "ERROR: Insufficient clearance level",
      "Required: LEVEL 6",
      "Current: LEVEL 5"
    ]
  };
  
  const handleCommand = () => {
    if (!input.trim()) return;
    
    const newHistory = [...history, `> ${input}`];
    const cmd = input.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'exit') {
      newHistory.push("Disconnecting...", "Connection terminated.");
      setHistory(newHistory);
    } else if (commands[cmd]) {
      newHistory.push(...commands[cmd]);
      setHistory(newHistory);
    } else {
      newHistory.push(`Command not found: ${input}`, "Type 'help' for available commands");
      setHistory(newHistory);
    }
    
    setInput("");
  };
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  return (
    <Card className="bg-black border-green-500/30">
      <CardHeader className="border-b border-green-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-500 font-mono text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            SECRET_TERMINAL
          </CardTitle>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={terminalRef}
          className="h-64 overflow-y-auto p-4 font-mono text-sm"
        >
          {history.map((line, i) => (
            <div 
              key={i} 
              className={`${
                line.startsWith('>') ? 'text-green-400' : 
                line.startsWith('ERROR') ? 'text-red-400' :
                line.startsWith('✓') ? 'text-green-500' :
                line.startsWith('?') ? 'text-yellow-500' :
                'text-green-500/70'
              }`}
            >
              {line}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-500">></span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
              className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page
export default function SecretLabPage() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  
  const correctCode = "4242";
  
  const attemptAccess = () => {
    if (accessCode === correctCode) {
      setIsAuthorized(true);
    } else {
      setAttempts(a => a + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setAccessCode("");
    }
  };
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="max-w-md w-full mx-4"
        >
          <Card className="border-2 border-primary/50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Restricted Access</h1>
              <p className="text-muted-foreground mb-6">
                Enter access code to enter the Secret Lab
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="••••"
                  className="text-center text-2xl tracking-widest"
                  maxLength={4}
                  onKeyDown={(e) => e.key === 'Enter' && attemptAccess()}
                />
              </div>
              
              <Button 
                onClick={attemptAccess}
                className="w-full"
                disabled={accessCode.length !== 4}
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                Authenticate
              </Button>
              
              {attempts > 0 && (
                <p className="text-sm text-red-500 mt-4">
                  Access denied. Attempt {attempts}/5
                </p>
              )}
              
              <p className="text-xs text-muted-foreground mt-6">
                Hint: The answer to everything, doubled
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Secret Lab</h1>
                <p className="text-muted-foreground">Unauthorized experiments and hidden features</p>
              </div>
            </div>
            
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              <AlertTriangle className="w-3 h-3 mr-1" />
              CLASSIFIED
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terminal */}
          <div className="lg:col-span-2">
            <SecretTerminal />
          </div>
          
          {/* Status Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security Level</span>
                    <span className="text-green-500">MAXIMUM</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Containment</span>
                    <span className="text-yellow-500">STABLE</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-yellow-500"
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 0.2 }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Anomaly Level</span>
                    <span className="text-red-500">ELEVATED</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ delay: 0.4 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Access Level 5</p>
                    <p className="text-xs text-muted-foreground">Senior Researcher</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Experiments */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Active Experiments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ghost className="w-5 h-5 text-slate-400" />
                  Ghost Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GhostScanner />
              </CardContent>
            </Card>
            
            <Card className="border-amber-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  Pattern Breaker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatternBreaker />
              </CardContent>
            </Card>
            
            <Card className="border-green-700/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-500" />
                  Reality Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealityCheck />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Locked Experiments */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            Locked Experiments
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experiments.filter(e => e.status === 'locked').map(exp => (
              <Card key={exp.id} className="opacity-50">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center opacity-50`}>
                    {exp.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{exp.name}</h3>
                  <div className="flex justify-center gap-1 mt-2">
                    {Array.from({ length: exp.dangerLevel }).map((_, i) => (
                      <Skull key={i} className="w-3 h-3 text-red-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
