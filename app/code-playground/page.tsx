"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  RefreshCw, 
  Copy, 
  Share2, 
  Download,
  Code2,
  Layout,
  FileJson,
  Sparkles,
  Check,
  Terminal,
  Palette,
  Gamepad2,
  Calculator,
  Clock,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CodeExample {
  id: string;
  name: string;
  icon: React.ReactNode;
  html: string;
  css: string;
  js: string;
}

const examples: CodeExample[] = [
  {
    id: "counter",
    name: "Interactive Counter",
    icon: <Calculator className="w-4 h-4" />,
    html: `<div class="container">
  <h1>Counter</h1>
  <div class="counter" id="count">0</div>
  <div class="buttons">
    <button onclick="decrement()">-</button>
    <button onclick="reset()">Reset</button>
    <button onclick="increment()">+</button>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}

h1 {
  margin: 0 0 1rem 0;
  color: #333;
}

.counter {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  margin: 1rem 0;
  transition: transform 0.2s;
}

.counter.pulse {
  transform: scale(1.1);
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background: #667eea;
  color: white;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

button:active {
  transform: translateY(0);
}`,
    js: `let count = 0;
const counterEl = document.getElementById('count');

function updateDisplay() {
  counterEl.textContent = count;
  counterEl.classList.add('pulse');
  setTimeout(() => counterEl.classList.remove('pulse'), 200);
}

function increment() {
  count++;
  updateDisplay();
}

function decrement() {
  count--;
  updateDisplay();
}

function reset() {
  count = 0;
  updateDisplay();
}`
  },
  {
    id: "clock",
    name: "Digital Clock",
    icon: <Clock className="w-4 h-4" />,
    html: `<div class="clock-container">
  <div class="clock" id="clock">00:00:00</div>
  <div class="date" id="date">Loading...</div>
  <div class="greeting" id="greeting">Hello!</div>
</div>`,
    css: `body {
  font-family: 'Courier New', monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #0a0a0a;
  color: #00ff00;
}

.clock-container {
  text-align: center;
  padding: 3rem;
  border: 2px solid #00ff00;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3),
              inset 0 0 30px rgba(0, 255, 0, 0.1);
  background: rgba(0, 20, 0, 0.9);
}

.clock {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 0 0 10px #00ff00;
  letter-spacing: 5px;
}

.date {
  font-size: 1.2rem;
  margin-top: 1rem;
  opacity: 0.8;
}

.greeting {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  padding: 10px 20px;
  border-top: 1px solid #00ff00;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}`,
    js: `function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const date = now.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('clock').textContent = time;
  document.getElementById('date').textContent = date;
  
  const hour = now.getHours();
  let greeting = 'Good Evening!';
  if (hour < 12) greeting = 'Good Morning!';
  else if (hour < 18) greeting = 'Good Afternoon!';
  
  document.getElementById('greeting').textContent = greeting;
}

setInterval(updateClock, 1000);
updateClock();`
  },
  {
    id: "typing",
    name: "Typewriter Effect",
    icon: <Type className="w-4 h-4" />,
    html: `<div class="typewriter-container">
  <h1 id="typewriter"></h1>
  <span class="cursor">|</span>
  <p class="subtitle">Click anywhere to restart</p>
</div>`,
    css: `body {
  font-family: 'Georgia', serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #1a1a2e;
  color: #eee;
}

.typewriter-container {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  display: inline;
  line-height: 1.4;
}

.cursor {
  font-size: 3rem;
  color: #e94560;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.subtitle {
  margin-top: 2rem;
  opacity: 0.6;
  font-size: 0.9rem;
}`,
    js: `const text = "Hello, World! Welcome to my portfolio.";
const typewriter = document.getElementById('typewriter');
let index = 0;

function type() {
  if (index < text.length) {
    typewriter.textContent += text.charAt(index);
    index++;
    setTimeout(type, 100);
  }
}

function reset() {
  typewriter.textContent = '';
  index = 0;
  type();
}

type();

document.addEventListener('click', reset);`
  },
  {
    id: "game",
    name: "Mini Clicker Game",
    icon: <Gamepad2 className="w-4 h-4" />,
    html: `<div class="game-container">
  <div class="score-board">
    <div>Score: <span id="score">0</span></div>
    <div>Level: <span id="level">1</span></div>
  </div>
  <div class="click-target" id="target">
    <span class="emoji">🎯</span>
  </div>
  <div class="upgrades">
    <button onclick="buyUpgrade('auto')" id="auto-btn">
      Auto Click (Cost: 10)
    </button>
    <button onclick="buyUpgrade('multi')" id="multi-btn">
      Multiplier (Cost: 50)
    </button>
  </div>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
}

.game-container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  text-align: center;
  min-width: 300px;
}

.score-board {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.click-target {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.click-target:active {
  transform: scale(0.95);
}

.click-target:hover {
  transform: scale(1.05);
}

.emoji {
  font-size: 3rem;
}

.upgrades {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upgrades button {
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #48dbfb;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.upgrades button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(72, 219, 251, 0.4);
}

.upgrades button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
    js: `let score = 0;
let level = 1;
let autoClickers = 0;
let multiplier = 1;

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const target = document.getElementById('target');
const autoBtn = document.getElementById('auto-btn');
const multiBtn = document.getElementById('multi-btn');

function updateDisplay() {
  scoreEl.textContent = Math.floor(score);
  levelEl.textContent = level;
  autoBtn.disabled = score < 10;
  multiBtn.disabled = score < 50;
  
  if (score > level * 100) {
    level++;
    target.style.boxShadow = \`0 10px 30px hsl(\${Math.random() * 360}, 70%, 50%)\`;
  }
}

function click() {
  score += multiplier;
  updateDisplay();
  
  // Visual feedback
  target.style.transform = 'scale(0.9)';
  setTimeout(() => target.style.transform = '', 100);
}

function buyUpgrade(type) {
  if (type === 'auto' && score >= 10) {
    score -= 10;
    autoClickers++;
  } else if (type === 'multi' && score >= 50) {
    score -= 50;
    multiplier *= 2;
  }
  updateDisplay();
}

target.addEventListener('click', click);

// Auto clicker
setInterval(() => {
  score += autoClickers * multiplier;
  updateDisplay();
}, 1000);

updateDisplay();`
  }
];

const defaultCode = {
  html: `<div class="container">
  <h1>Hello, World!</h1>
  <p>Start coding to see results...</p>
  <button onclick="alert('It works!')">Click Me</button>
</div>`,
  css: `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

button {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}`,
  js: `// Your JavaScript code here
console.log('Hello from the playground!');`
};

export default function CodePlayground() {
  const [html, setHtml] = useState(defaultCode.html);
  const [css, setCss] = useState(defaultCode.css);
  const [js, setJs] = useState(defaultCode.js);
  const [srcDoc, setSrcDoc] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const updatePreview = useCallback(() => {
    const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;
    setSrcDoc(doc);
  }, [html, css, js]);

  useEffect(() => {
    if (isAutoRefresh) {
      const timeout = setTimeout(updatePreview, 500);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js, isAutoRefresh, updatePreview]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const loadExample = (example: CodeExample) => {
    setHtml(example.html);
    setCss(example.css);
    setJs(example.js);
    setSelectedExample(example.id);
    toast.success(`Loaded: ${example.name}`);
  };

  const resetCode = () => {
    setHtml(defaultCode.html);
    setCss(defaultCode.css);
    setJs(defaultCode.js);
    setSelectedExample(null);
    toast.info("Reset to default");
  };

  const copyCode = () => {
    const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${js}`;
    navigator.clipboard.writeText(fullCode);
    toast.success("Code copied to clipboard!");
  };

  const downloadCode = () => {
    const doc = `<!DOCTYPE html>
<html>
<head>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  <\/script>
</body>
</html>`;
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground-project.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as HTML file!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Code Playground</h1>
                <p className="text-sm text-muted-foreground">
                  Write, test, and share HTML/CSS/JS
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={isAutoRefresh ? "text-green-500" : ""}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAutoRefresh ? "animate-spin" : ""}`} />
                Auto
              </Button>
              <Button variant="outline" size="sm" onClick={updatePreview}>
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCode}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={resetCode}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mr-2">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Examples:
            </span>
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => loadExample(example)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedExample === example.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                }`}
              >
                {example.icon}
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  JavaScript
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full h-[400px] p-4 font-mono text-sm bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="<!-- Write your HTML here -->"
                    spellCheck={false}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                    {html.length} chars
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="css" className="mt-4">
                <div className="relative">
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="w-full h-[400px] p-4 font-mono text-sm bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="/* Write your CSS here */"
                    spellCheck={false}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                    {css.length} chars
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="js" className="mt-4">
                <div className="relative">
                  <textarea
                    value={js}
                    onChange={(e) => setJs(e.target.value)}
                    className="w-full h-[400px] p-4 font-mono text-sm bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="// Write your JavaScript here"
                    spellCheck={false}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                    {js.length} chars
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide" : "Show"}
              </Button>
            </div>
            
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-lg overflow-hidden border border-border bg-white"
                  style={{ height: "500px" }}
                >
                  <iframe
                    srcDoc={srcDoc}
                    title="preview"
                    sandbox="allow-scripts"
                    className="w-full h-full border-0"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
