"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.2);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    return `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    setBlur(Math.floor(Math.random() * 30) + 5);
    setOpacity(Math.random() * 0.4 + 0.1);
    setSaturation(Math.floor(Math.random() * 150) + 100);
    setBorderOpacity(Math.random() * 0.5 + 0.1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div 
        className="relative h-[400px] rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-8"
            style={{
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
              border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Glass Card</h3>
            <p className="text-white/80">
              This is a glassmorphism effect preview. Adjust the controls to customize the look.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Blur
              <span className="text-muted-foreground">{blur}px</span>
            </label>
            <Slider
              value={[blur]}
              onValueChange={([v]) => setBlur(v)}
              min={0}
              max={50}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Opacity
              <span className="text-muted-foreground">{Math.round(opacity * 100)}%</span>
            </label>
            <Slider
              value={[opacity * 100]}
              onValueChange={([v]) => setOpacity(v / 100)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Saturation
              <span className="text-muted-foreground">{saturation}%</span>
            </label>
            <Slider
              value={[saturation]}
              onValueChange={([v]) => setSaturation(v)}
              min={100}
              max={300}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              Border Opacity
              <span className="text-muted-foreground">{Math.round(borderOpacity * 100)}%</span>
            </label>
            <Slider
              value={[borderOpacity * 100]}
              onValueChange={([v]) => setBorderOpacity(v / 100)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={randomize} variant="outline" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Randomize
          </Button>
          <Button onClick={copyToClipboard} className="flex-1">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy CSS
              </>
            )}
          </Button>
        </div>

        <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
          <code>{generateCSS()}</code>
        </pre>
      </div>
    </div>
  );
}
