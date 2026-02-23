"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Play, 
  RotateCcw, 
  Download,
  Share2,
  Settings,
  Check,
  Copy,
  Terminal,
  Sparkles,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const defaultHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, sans-serif;
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      animation: float 3s ease-in-out infinite;
    }
    h1 {
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    p {
      color: #666;
      margin: 0;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>✨ Hello World!</h1>
    <p>Edit the code to see changes live</p>
  </div>
</body>
</html>`;

const templates = {
  "hello-world": {
    name: "Hello World",
    html: defaultHTML,
  },
  "gradient-button": {
    name: "Gradient Button",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #0f0f0f;
    }
    .btn {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 50px;
      background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
      background-size: 300% 300%;
      color: white;
      cursor: pointer;
      animation: gradient 3s ease infinite;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  </style>
</head>
<body>
  <button class="btn">Hover Me!</button>
</body>
</html>`,
  },
  "loading-spinner": {
    name: "Loading Spinner",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #1a1a2e;
    }
    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255,255,255,0.1);
      border-top-color: #00d9ff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .spinner::before {
      content: '';
      position: absolute;
      inset: -10px;
      border: 4px solid transparent;
      border-top-color: #ff006e;
      border-radius: 50%;
      animation: spin 2s linear infinite reverse;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
</body>
</html>`,
  },
  "particle-burst": {
    name: "Particle Burst",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: #000;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      position: relative;
    }
    .particle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      animation: burst 2s ease-out infinite;
    }
    .particle:nth-child(1) { animation-delay: 0s; --angle: 0deg; }
    .particle:nth-child(2) { animation-delay: 0.1s; --angle: 45deg; }
    .particle:nth-child(3) { animation-delay: 0.2s; --angle: 90deg; }
    .particle:nth-child(4) { animation-delay: 0.3s; --angle: 135deg; }
    .particle:nth-child(5) { animation-delay: 0.4s; --angle: 180deg; }
    .particle:nth-child(6) { animation-delay: 0.5s; --angle: 225deg; }
    .particle:nth-child(7) { animation-delay: 0.6s; --angle: 270deg; }
    .particle:nth-child(8) { animation-delay: 0.7s; --angle: 315deg; }
    
    @keyframes burst {
      0% {
        transform: rotate(var(--angle)) translateX(0) scale(1);
        opacity: 1;
      }
      100% {
        transform: rotate(var(--angle)) translateX(100px) scale(0);
        opacity: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
</body>
</html>`,
  },
  "glass-card": {
    name: "Glass Card",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: system-ui, sans-serif;
    }
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      color: white;
      max-width: 300px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .glass h2 {
      margin: 0 0 1rem 0;
    }
    .glass p {
      margin: 0;
      opacity: 0.9;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="glass">
    <h2>🎨 Glassmorphism</h2>
    <p>This card uses backdrop-filter to create a frosted glass effect. Modern and elegant!</p>
  </div>
</body>
</html>`,
  },
};

export default function PlaygroundPage() {
  const [html, setHtml] = useState(defaultHTML);
  const [activeTemplate, setActiveTemplate] = useState("hello-world");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRun = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  };

  const handleReset = () => {
    setHtml(defaultHTML);
    setActiveTemplate("hello-world");
    toast.success("Code reset to default");
  };

  const handleTemplateChange = (templateKey: string) => {
    const template = templates[templateKey as keyof typeof templates];
    if (template) {
      setHtml(template.html);
      setActiveTemplate(templateKey);
      toast.success(`Loaded template: ${template.name}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    toast.success("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  useEffect(() => {
    handleRun();
  }, [html]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Interactive
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Code Playground</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Experiment with HTML and CSS in real-time. Choose a template or write your own code!
          </p>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Quick Templates</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(templates).map(([key, template]) => (
              <Button
                key={key}
                variant={activeTemplate === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleTemplateChange(key)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="h-4 w-4 text-primary" />
                    HTML/CSS Editor
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-[500px] p-4 font-mono text-sm bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Play className="h-4 w-4 text-green-500" />
                    Live Preview
                  </CardTitle>
                  <Button size="sm" onClick={handleRun}>
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[500px] bg-white rounded-lg overflow-hidden border">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full"
                    sandbox="allow-scripts"
                    title="Preview"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Tips & Tricks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">🎨 CSS Animations</h4>
                  <p className="text-sm text-muted-foreground">
                    Use @keyframes to create smooth animations. Try changing animation-duration values!
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">📐 Flexbox & Grid</h4>
                  <p className="text-sm text-muted-foreground">
                    Master layout with display: flex and display: grid for responsive designs.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">✨ Pseudo-elements</h4>
                  <p className="text-sm text-muted-foreground">
                    Use ::before and ::after to add decorative elements without extra HTML.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
