"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  Download,
  Sparkles,
  Code2,
  Palette,
  Zap,
  Maximize2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Shader presets
const shaderPresets = [
  {
    id: "plasma",
    name: "Neon Plasma",
    description: "Flowing electric colors",
    code: `// Neon Plasma Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    float t = iTime * 0.5;
    
    // Create plasma effect
    float v1 = sin(uv.x * 10.0 + t);
    float v2 = sin(uv.y * 10.0 + t * 0.8);
    float v3 = sin((uv.x + uv.y) * 10.0 + t * 1.2);
    float v4 = sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 20.0 + t);
    
    float plasma = (v1 + v2 + v3 + v4) / 4.0;
    
    // Color mapping
    vec3 color = vec3(
        sin(plasma * 3.14159 + 0.0) * 0.5 + 0.5,
        sin(plasma * 3.14159 + 2.0) * 0.5 + 0.5,
        sin(plasma * 3.14159 + 4.0) * 0.5 + 0.5
    );
    
    fragColor = vec4(color, 1.0);
}`,
  },
  {
    id: "waves",
    name: "Ocean Waves",
    description: "Calm flowing water",
    code: `// Ocean Waves Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    float t = iTime * 0.3;
    
    // Multiple wave layers
    float wave1 = sin(uv.x * 20.0 + t) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 15.0 + t * 1.2) * 0.5 + 0.5;
    float wave3 = sin((uv.x + uv.y) * 10.0 + t * 0.8) * 0.5 + 0.5;
    
    float combined = (wave1 + wave2 + wave3) / 3.0;
    
    // Ocean colors
    vec3 deepBlue = vec3(0.0, 0.2, 0.4);
    vec3 lightBlue = vec3(0.0, 0.6, 0.8);
    vec3 foam = vec3(0.9, 0.95, 1.0);
    
    vec3 color = mix(deepBlue, lightBlue, combined);
    color = mix(color, foam, smoothstep(0.7, 0.9, combined));
    
    fragColor = vec4(color, 1.0);
}`,
  },
  {
    id: "fractal",
    name: "Fractal Zoom",
    description: "Infinite mathematical beauty",
    code: `// Fractal Zoom Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    float t = iTime * 0.1;
    
    // Zoom effect
    float zoom = 1.0 + sin(t) * 0.5;
    uv *= 3.0 / zoom;
    uv = vec2(
        uv.x * cos(t) - uv.y * sin(t),
        uv.x * sin(t) + uv.y * cos(t)
    );
    
    // Mandelbrot iteration
    vec2 c = uv + vec2(-0.5, 0.0);
    vec2 z = vec2(0.0);
    float iter = 0.0;
    
    for (int i = 0; i < 100; i++) {
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iter++;
    }
    
    // Color based on iteration
    float smoothIter = iter - log2(log2(dot(z, z))) + 4.0;
    vec3 color = 0.5 + 0.5 * cos(3.0 + smoothIter * 0.15 + vec3(0.0, 0.6, 1.0));
    
    fragColor = vec4(color, 1.0);
}`,
  },
  {
    id: "galaxy",
    name: "Spiral Galaxy",
    description: "Cosmic spiral patterns",
    code: `// Spiral Galaxy Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    float t = iTime * 0.2;
    
    // Polar coordinates
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    
    // Spiral arms
    float spiral = sin(a * 3.0 + r * 10.0 - t * 2.0);
    float arms = smoothstep(0.3, 0.7, spiral);
    
    // Core glow
    float core = 1.0 - smoothstep(0.0, 0.3, r);
    
    // Stars
    float stars = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    stars = step(0.98, stars) * (1.0 - r);
    
    // Colors
    vec3 armColor = vec3(0.8, 0.4, 0.9) * arms;
    vec3 coreColor = vec3(1.0, 0.9, 0.7) * core;
    vec3 starColor = vec3(1.0) * stars;
    
    vec3 color = armColor + coreColor + starColor;
    color *= 1.0 - r * 0.5; // Vignette
    
    fragColor = vec4(color, 1.0);
}`,
  },
  {
    id: "matrix",
    name: "Digital Rain",
    description: "Matrix-style code rain",
    code: `// Digital Rain Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    float t = iTime * 2.0;
    
    // Create columns
    float col = floor(uv.x * 40.0);
    float x = fract(uv.x * 40.0);
    
    // Falling characters
    float speed = 1.0 + fract(sin(col * 12.9898) * 43758.5453);
    float y = uv.y * 20.0 + t * speed;
    float row = floor(y);
    float charY = fract(y);
    
    // Random character brightness
    float brightness = fract(sin(col * 12.9898 + row * 78.233) * 43758.5453);
    brightness = step(0.3, brightness);
    
    // Fade at bottom
    float fade = smoothstep(0.0, 0.3, charY) * (1.0 - smoothstep(0.7, 1.0, charY));
    
    // Head glow
    float head = smoothstep(0.9, 1.0, charY);
    
    vec3 color = vec3(0.0, brightness * fade * 0.8 + head, 0.0);
    color += vec3(0.8, 1.0, 0.8) * head; // White head
    
    fragColor = vec4(color, 1.0);
}`,
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    description: "Northern lights dancing",
    code: `// Aurora Borealis Shader
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    float t = iTime * 0.2;
    
    // Create flowing aurora bands
    float band1 = sin(uv.x * 3.0 + t + sin(uv.y * 5.0 + t * 0.5) * 0.5);
    float band2 = sin(uv.x * 4.0 - t * 0.8 + sin(uv.y * 3.0 + t) * 0.3);
    float band3 = sin(uv.x * 2.5 + t * 1.2 + sin(uv.y * 4.0 - t * 0.3) * 0.4);
    
    // Combine bands
    float aurora = (band1 + band2 + band3) / 3.0;
    aurora = smoothstep(0.0, 0.8, aurora);
    
    // Aurora colors
    vec3 green = vec3(0.2, 0.9, 0.4);
    vec3 purple = vec3(0.6, 0.2, 0.9);
    vec3 blue = vec3(0.2, 0.4, 0.9);
    
    vec3 color = mix(green, purple, sin(t + uv.x * 2.0) * 0.5 + 0.5);
    color = mix(color, blue, sin(t * 0.7 + uv.y * 3.0) * 0.5 + 0.5);
    
    color *= aurora * (1.0 - uv.y * 0.3); // Fade at top
    
    // Stars background
    float stars = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    stars = step(0.995, stars);
    color += vec3(stars) * 0.8;
    
    // Night sky gradient
    color += vec3(0.0, 0.02, 0.08) * (1.0 - aurora);
    
    fragColor = vec4(color, 1.0);
}`,
  },
];

// Vertex shader
const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Default fragment shader header
const shaderHeader = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
`;

export function ShaderStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const [selectedPreset, setSelectedPreset] = useState(shaderPresets[0]);
  const [shaderCode, setShaderCode] = useState(shaderPresets[0].code);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setError('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Create shader program
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl.FRAGMENT_SHADER, shaderHeader + shaderCode);
    
    if (!vs || !fs) {
      setError('Shader compilation failed');
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setError('Shader linking failed');
      return;
    }

    programRef.current = program;
    setError(null);

    // Set up geometry (full-screen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }, [shaderCode]);

  // Render loop
  const render = useCallback((time: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    
    if (!gl || !program || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    // Update uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const mouseLocation = gl.getUniformLocation(program, 'iMouse');

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(mouseLocation, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(render);
    }
  }, [isPlaying]);

  // Initialize and render
  useEffect(() => {
    initWebGL();
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(render);
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [initWebGL, render, isPlaying]);

  // Handle preset selection
  const selectPreset = (preset: typeof shaderPresets[0]) => {
    setSelectedPreset(preset);
    setShaderCode(preset.code);
  };

  // Update shader code
  const updateShader = (code: string) => {
    setShaderCode(code);
  };

  // Copy shader code
  const copyShader = () => {
    navigator.clipboard.writeText(shaderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Shader code copied!");
  };

  // Download shader
  const downloadShader = () => {
    const blob = new Blob([shaderCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shader-${selectedPreset.id}.glsl`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Shader downloaded!");
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <section className={`py-24 bg-gradient-to-b from-background via-cyan-950/10 to-background ${fullscreen ? 'fixed inset-0 z-50 py-0' : ''}`}>
      <div className={`${fullscreen ? 'h-full max-w-none' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {/* Header */}
        {!fullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">WebGL Powered</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shader{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Studio
              </span>
            </h2>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time WebGL fragment shader editor. Create stunning visual effects 
              with custom GLSL code. Click any preset to get started.
            </p>
          </motion.div>
        )}

        <div className={`grid gap-6 ${fullscreen ? 'h-full grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Presets Panel */}
          {!fullscreen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-semibold">Shader Presets</h3>
                </div>
                
                <div className="space-y-2">
                  {shaderPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedPreset.id === preset.id
                          ? "bg-cyan-500/20 border-2 border-cyan-500"
                          : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{preset.name}</span>
                        {selectedPreset.id === preset.id && (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">GLSL Code</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyShader}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadShader}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <textarea
                  value={shaderCode}
                  onChange={(e) => updateShader(e.target.value)}
                  className="w-full h-64 p-3 rounded-xl bg-black/50 text-green-400 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  spellCheck={false}
                />
                
                {error && (
                  <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {error}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Canvas Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={fullscreen ? 'h-full' : 'lg:col-span-2'}
          >
            <div className={`relative rounded-2xl overflow-hidden bg-black border border-border ${fullscreen ? 'h-full' : 'h-[500px] lg:h-[700px]'}`}>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full"
              />
              
              {/* Controls overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectPreset(selectedPreset)}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const link = document.createElement('a');
                    link.download = `shader-render-${Date.now()}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    toast.success("Frame saved!");
                  }}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Shader info */}
              <div className="absolute bottom-4 left-4">
                <div className="glass-strong px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">{selectedPreset.name}</span>
                </div>
              </div>

              {/* Performance info */}
              <div className="absolute bottom-4 right-4">
                <div className="text-white/30 text-xs">
                  WebGL 1.0 • 60 FPS
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pause icon component
function Pause({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
