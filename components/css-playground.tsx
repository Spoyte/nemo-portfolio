"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Copy, 
  Check,
  Download,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
  Palette,
  Type,
  Layout,
  Grid3X3,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface CSSPlaygroundState {
  css: string;
  html: string;
  isPlaying: boolean;
  animationSpeed: number;
  showGrid: boolean;
  darkMode: boolean;
  device: "desktop" | "tablet" | "mobile";
}

const defaultHTML = `<div class="container">
  <div class="card">
    <div class="card-header">
      <div class="avatar"></div>
      <div class="title">
        <h3>Card Title</h3>
        <p>Subtitle text</p>
      </div>
    </div>
    <div class="card-body">
      <p>This is a sample card component. Edit the CSS to customize its appearance!</p>
    </div>
    <div class="card-footer">
      <button class="btn-primary">Action</button>
      <button class="btn-secondary">Cancel</button>
    </div>
  </div>
</div>`;

const defaultCSS = `/* Try editing these styles! */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255,255,255,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 30px 80px rgba(0,0,0,0.4),
    0 0 0 1px rgba(255,255,255,0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.title h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.title p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.card-body {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}`;

const challenges = [
  {
    name: "Glassmorphism Card",
    description: "Create a frosted glass effect using backdrop-filter",
    hint: "Use backdrop-filter: blur() and rgba() backgrounds",
    starterCSS: `.card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}`,
  },
  {
    name: "Neon Glow Button",
    description: "Create a button with neon glow effect",
    hint: "Use box-shadow with multiple layers and text-shadow",
    starterCSS: `.btn-primary {
  background: #0f0f0f;
  color: #00ff88;
  border: 2px solid #00ff88;
  box-shadow: 
    0 0 10px #00ff88,
    0 0 20px #00ff88,
    inset 0 0 10px rgba(0, 255, 136, 0.2);
}`,
  },
  {
    name: "3D Flip Card",
    description: "Create a card that flips on hover",
    hint: "Use transform-style: preserve-3d and rotateY",
    starterCSS: `.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}`,
  },
];

const presets = [
  { name: "Default", css: defaultCSS },
  { name: "Minimal", css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 2rem;
}

.card {
  background: #fff;
  border: 2px solid #000;
  padding: 2rem;
  max-width: 400px;
}` },
  { name: "Gradient", css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card {
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
}` },
];

export function CSSPlayground() {
  const [css, setCss] = useState(defaultCSS);
  const [html, setHtml] = useState(defaultHTML);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("css");
  const [showGrid, setShowGrid] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;
    
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: system-ui, -apple-system, sans-serif;
              min-height: 100vh;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    
    doc.open();
    doc.write(fullHTML);
    doc.close();
  }, [css, html]);
  
  useEffect(() => {
    updatePreview();
  }, [updatePreview]);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  const handleDownload = () => {
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "styles.css";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSS downloaded!");
  };
  
  const loadChallenge = (index: number) => {
    setCurrentChallenge(index);
    setCss(challenges[index].starterCSS + "\n\n" + defaultCSS);
    toast.info(`Challenge: ${challenges[index].name}`);
  };
  
  const loadPreset = (preset: typeof presets[0]) => {
    setCss(preset.css);
    toast.success(`Loaded ${preset.name} preset`);
  };
  
  const getDeviceWidth = () => {
    switch (device) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      default: return "100%";
    }
  };
  
  return (
    <div className={`w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      <Card className="border-2 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Live CSS Playground</CardTitle>
              <p className="text-sm text-muted-foreground">
                Experiment with CSS in real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={device} onValueChange={(v) => setDevice(v as any)}>
              <SelectTrigger className="w-32">
                <Layout className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowGrid(!showGrid)}
              className={showGrid ? "bg-primary/10" : ""}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium mr-2">Presets:</span>
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
            <div className="w-px h-6 bg-border mx-2" />
            <span className="text-sm font-medium mr-2">Challenges:</span>
            {challenges.map((challenge, index) => (
              <Button
                key={challenge.name}
                variant={currentChallenge === index ? "default" : "outline"}
                size="sm"
                onClick={() => loadChallenge(index)}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {challenge.name}
              </Button>
            ))}
          </div>
          
          {/* Challenge Info */}
          {currentChallenge > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{challenges[currentChallenge].name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {challenges[currentChallenge].description}
                  </p>
                  {showHints && (
                    <p className="text-sm text-primary mt-2">
                      💡 Hint: {challenges[currentChallenge].hint}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
                  {showHints ? "Hide Hint" : "Show Hint"}
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Main Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
            {/* Code Editor */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="css">
                  <Palette className="h-4 w-4 mr-2" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="html">
                  <Type className="h-4 w-4 mr-2" />
                  HTML
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="css" className="h-[calc(100%-40px)] mt-0">
                <div className="relative h-full">
                  <Textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="h-full font-mono text-sm resize-none"
                    spellCheck={false}
                    placeholder="Enter your CSS here..."
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleCopy(css)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="html" className="h-[calc(100%-40px)] mt-0">
                <Textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  spellCheck={false}
                  placeholder="Enter your HTML here..."
                />
              </TabsContent>
            </Tabs>
            
            {/* Preview */}
            <div className="relative h-full rounded-lg border overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]">
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />
              )}
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                style={{ maxWidth: getDeviceWidth(), margin: "0 auto" }}
                sandbox="allow-scripts"
                title="CSS Preview"
              />
              
              {/* Device Label */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background/90 text-xs font-medium">
                {device === "desktop" ? "💻 Desktop" : device === "tablet" ? "📱 Tablet" : "📲 Mobile"} • {getDeviceWidth()}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{css.length}</span> CSS chars • 
                <span className="font-medium">{html.length}</span> HTML chars
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => {
                setCss(defaultCSS);
                setHtml(defaultHTML);
                toast.success("Reset to default");
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => {
                confetti({ particleCount: 50, spread: 60 });
                toast.success("Looking great! 🎨");
              }}>
                <Sparkles className="h-4 w-4 mr-2" />
                Looks Good!
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
