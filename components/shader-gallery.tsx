"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Copy, 
  Settings,
  Sparkles,
  Palette,
  Maximize2,
  Download,
  Share2,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Vertex shader
const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Collection of fragment shaders
const shaders = [
  {
    name: "Cosmic Nebula",
    description: "Flowing cosmic clouds with noise-based patterns",
    author: "Inigo Quilez",
    category: "Nature",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define NUM_LAYERS 6.0

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n = p.x + p.y * 57.0 + 113.0 * p.z;
  return mix(
    mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
        mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
  );
}

float fbm(vec3 p) {
  float f = 0.0;
  float w = 0.5;
  for (float i = 0.0; i < NUM_LAYERS; i++) {
    f += w * noise(p);
    p *= 2.0;
    w *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  vec3 ro = vec3(0.0, 0.0, time * 0.1);
  vec3 rd = normalize(vec3(p, 1.0));
  
  float col = 0.0;
  for (float i = 0.0; i < NUM_LAYERS; i++) {
    float t = time * (0.5 + i * 0.1) + i * 10.0;
    vec3 pos = ro + rd * (2.0 + i * 0.5);
    float n = fbm(pos + vec3(t * 0.1, t * 0.15, t * 0.05));
    col += n * (1.0 - i / NUM_LAYERS) * 0.3;
  }
  
  vec3 color = vec3(0.1, 0.05, 0.2);
  color += vec3(0.4, 0.2, 0.6) * col;
  color += vec3(0.2, 0.5, 0.8) * pow(col, 2.0);
  color += vec3(0.8, 0.3, 0.4) * pow(col, 4.0);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    name: "Liquid Plasma",
    description: "Organic flowing liquid with interference patterns",
    author: "Nemo",
    category: "Abstract",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  float t = time * 0.5;
  
  float d1 = length(p - vec2(sin(t) * 0.5, cos(t * 0.7) * 0.3));
  float d2 = length(p - vec2(cos(t * 0.8) * 0.4, sin(t * 1.2) * 0.4));
  float d3 = length(p - vec2(sin(t * 1.1) * 0.3, cos(t * 0.9) * 0.5));
  
  float wave1 = sin(d1 * 20.0 - t * 3.0) * 0.5 + 0.5;
  float wave2 = sin(d2 * 15.0 + t * 2.0) * 0.5 + 0.5;
  float wave3 = sin(d3 * 25.0 - t * 4.0) * 0.5 + 0.5;
  
  float interference = wave1 * wave2 * wave3;
  
  vec3 color = vec3(0.0);
  color.r = wave1 * 0.8 + interference * 0.3;
  color.g = wave2 * 0.6 + interference * 0.4;
  color.b = wave3 * 0.9 + interference * 0.2;
  
  color = pow(color, vec3(0.8));
  color += vec3(0.1, 0.05, 0.15) * (1.0 - length(p) * 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    name: "Matrix Rain",
    description: "Digital rain effect inspired by The Matrix",
    author: "Nemo",
    category: "Retro",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  float columns = 40.0;
  vec2 grid = vec2(
    floor(uv.x * columns) / columns,
    fract(uv.y * 10.0 + time * (0.5 + random(vec2(floor(uv.x * columns), 0.0)) * 0.5))
  );
  
  float char = step(0.1, random(vec2(grid.x, floor(uv.y * 20.0 + time))));
  float trail = smoothstep(0.0, 0.3, grid.y) * smoothstep(1.0, 0.7, grid.y);
  
  float head = step(0.95, grid.y) * step(grid.y, 1.0);
  
  vec3 color = vec3(0.0, char * trail * 0.8, 0.0);
  color += vec3(0.8, 1.0, 0.8) * head;
  
  // Scanline effect
  float scanline = sin(uv.y * 800.0) * 0.04;
  color -= scanline;
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  color *= vignette;
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    name: "Fractal Zoom",
    description: "Infinite Mandelbrot zoom with color cycling",
    author: "Nemo",
    category: "Math",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec2 complexSqr(vec2 z) {
  return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
}

vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  float zoom = pow(2.0, time * 0.2);
  vec2 center = vec2(-0.743643887037151, 0.13182590420533);
  
  vec2 c = p / zoom + center;
  vec2 z = vec2(0.0);
  
  float iter = 0.0;
  const float maxIter = 100.0;
  
  for (float i = 0.0; i < maxIter; i++) {
    z = complexSqr(z) + c;
    if (length(z) > 2.0) break;
    iter = i;
  }
  
  float smoothIter = iter + 1.0 - log(log(length(z))) / log(2.0);
  float hue = smoothIter / maxIter + time * 0.05;
  
  vec3 color = palette(hue);
  if (iter >= maxIter - 1.0) color = vec3(0.0);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    name: "Ocean Waves",
    description: "Realistic ocean surface simulation",
    author: "Nemo",
    category: "Nature",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float wave(vec2 p, float freq, float amp, float speed, float dir) {
  float d = p.x * cos(dir) + p.y * sin(dir);
  return sin(d * freq + time * speed) * amp;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv * 4.0;
  p.x *= resolution.x / resolution.y;
  
  float height = 0.0;
  
  // Layer multiple waves
  height += wave(p, 2.0, 0.5, 1.0, 0.0);
  height += wave(p, 3.0, 0.3, 1.5, 0.5);
  height += wave(p, 5.0, 0.2, 2.0, 1.0);
  height += wave(p, 8.0, 0.1, 2.5, 1.5);
  
  // Calculate normals for lighting
  float dx = wave(p + vec2(0.01, 0.0), 2.0, 0.5, 1.0, 0.0) - 
             wave(p - vec2(0.01, 0.0), 2.0, 0.5, 1.0, 0.0);
  float dy = wave(p + vec2(0.0, 0.01), 2.0, 0.5, 1.0, 0.0) - 
             wave(p - vec2(0.0, 0.01), 2.0, 0.5, 1.0, 0.0);
  
  vec3 normal = normalize(vec3(-dx * 10.0, -dy * 10.0, 1.0));
  
  // Lighting
  vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
  float diff = max(dot(normal, lightDir), 0.0);
  float spec = pow(max(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
  
  // Water colors
  vec3 deepColor = vec3(0.0, 0.1, 0.3);
  vec3 shallowColor = vec3(0.0, 0.4, 0.6);
  vec3 foamColor = vec3(1.0, 1.0, 1.0);
  
  float t = height * 0.5 + 0.5;
  vec3 color = mix(deepColor, shallowColor, t);
  color = mix(color, foamColor, smoothstep(0.7, 0.9, t));
  
  color = color * (0.3 + 0.7 * diff) + spec * 0.5;
  
  // Fog
  float fog = 1.0 - exp(-length(uv - 0.5) * 2.0);
  color = mix(color, vec3(0.7, 0.8, 0.9), fog * 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    name: "Cyber Grid",
    description: "Retro-futuristic grid with perspective",
    author: "Nemo",
    category: "Retro",
    code: `precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  // Perspective transform
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  float horizon = 0.3;
  float perspective = 1.0 / (p.y - horizon);
  
  vec2 gridUV = vec2(
    p.x * perspective + time * 2.0,
    perspective * 5.0
  );
  
  vec2 grid = fract(gridUV) - 0.5;
  float line = smoothstep(0.05, 0.0, abs(grid.x)) + smoothstep(0.05, 0.0, abs(grid.y));
  
  // Fade with distance
  float fade = smoothstep(5.0, 0.0, gridUV.y);
  
  // Glow effect
  float glow = line * fade;
  
  // Colors
  vec3 gridColor = vec3(1.0, 0.0, 0.5);
  vec3 skyColor = vec3(0.05, 0.0, 0.1);
  vec3 groundColor = vec3(0.0, 0.0, 0.05);
  
  vec3 color = mix(skyColor, groundColor, smoothstep(horizon - 0.1, horizon + 0.1, uv.y));
  color += gridColor * glow;
  
  // Sun/moon
  vec2 sunPos = vec2(0.0, 0.5);
  float sun = 1.0 - length(p - sunPos);
  sun = smoothstep(0.3, 0.35, sun);
  color += vec3(1.0, 0.8, 0.3) * sun;
  
  // Scanlines
  color *= 0.9 + 0.1 * sin(uv.y * 400.0);
  
  gl_FragColor = vec4(color, 1.0);
}`,
  },
];

export function ShaderGallery() {
  const [currentShader, setCurrentShader] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showCode, setShowCode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext("webgl");
    if (!gl) {
      toast.error("WebGL not supported");
      return;
    }
    
    glRef.current = gl;
    
    // Create shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    
    gl.shaderSource(fs, shaders[currentShader].code);
    gl.compileShader(fs);
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;
    
    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    
    // Set attributes
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    
    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, [currentShader]);
  
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;
    
    const time = (Date.now() - startTimeRef.current) * 0.001 * speed;
    
    const timeLoc = gl.getUniformLocation(program, "time");
    const resolutionLoc = gl.getUniformLocation(program, "resolution");
    const mouseLoc = gl.getUniformLocation(program, "mouse");
    
    gl.uniform1f(timeLoc, time);
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(render);
    }
  }, [isPlaying, speed]);
  
  useEffect(() => {
    initWebGL();
    if (isPlaying) {
      render();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL, render, isPlaying]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    };
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shaders[currentShader].code);
    toast.success("Shader code copied!");
  };
  
  const handleDownload = () => {
    const blob = new Blob([shaders[currentShader].code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shaders[currentShader].name.toLowerCase().replace(/\s+/g, "-")}.glsl`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const nextShader = () => {
    setCurrentShader((prev) => (prev + 1) % shaders.length);
  };
  
  const prevShader = () => {
    setCurrentShader((prev) => (prev - 1 + shaders.length) % shaders.length);
  };
  
  const shader = shaders[currentShader];
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-2 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">WebGL Shader Gallery</CardTitle>
              <CardDescription>
                Interactive GLSL shader experiments
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
              <Code className="h-4 w-4 mr-2" />
              {showCode ? "Hide Code" : "Show Code"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Shader Canvas */}
          <div className="relative rounded-lg overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full aspect-video cursor-crosshair"
              onMouseMove={handleMouseMove}
            />
            
            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-background/80 backdrop-blur"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    startTimeRef.current = Date.now();
                    toast.success("Reset");
                  }}
                  className="bg-background/80 backdrop-blur"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur">
                <span className="text-sm font-medium">Speed:</span>
                <Slider
                  value={[speed]}
                  onValueChange={([v]) => setSpeed(v)}
                  min={0}
                  max={3}
                  step={0.1}
                  className="w-32"
                />
                <span className="text-sm w-12">{speed.toFixed(1)}x</span>
              </div>
            </div>
            
            {/* Shader Info */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-background/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{shader.category}</Badge>
                <span className="font-semibold">{shader.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{shader.description}</p>
            </div>
            
            {/* Navigation */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={prevShader}
                className="bg-background/80 backdrop-blur"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={nextShader}
                className="bg-background/80 backdrop-blur"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Shader Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {shaders.map((s, index) => (
              <Button
                key={s.name}
                variant={currentShader === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentShader(index)}
                className="flex-shrink-0"
              >
                <Palette className="h-3 w-3 mr-1" />
                {s.name}
              </Button>
            ))}
          </div>
          
          {/* Code View */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-muted overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="text-sm font-medium">Fragment Shader</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
                  <code>{shader.code}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Info */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Shader {currentShader + 1} of {shaders.length}</span>
              <span>•</span>
              <span>By {shader.author}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-1" />
                Copy Code
              </Button>
              <Button size="sm" onClick={() => {
                toast.success("Shader shared!");
              }}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing import
import { Code } from "lucide-react";
