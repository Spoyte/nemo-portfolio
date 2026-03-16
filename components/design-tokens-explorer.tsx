"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Layers, 
  Type, 
  Palette, 
  Box, 
  Ruler, 
  Grid3X3,
  Copy,
  Check,
  RefreshCw,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DesignToken {
  name: string;
  value: string;
  description: string;
  category: "color" | "typography" | "spacing" | "radius" | "shadow";
}

const colorTokens: DesignToken[] = [
  { name: "--background", value: "#fafaf9", description: "Page background", category: "color" },
  { name: "--foreground", value: "#1c1917", description: "Primary text", category: "color" },
  { name: "--card", value: "#ffffff", description: "Card background", category: "color" },
  { name: "--card-foreground", value: "#1c1917", description: "Card text", category: "color" },
  { name: "--primary", value: "#dc2626", description: "Primary brand color", category: "color" },
  { name: "--primary-foreground", value: "#fafaf9", description: "Text on primary", category: "color" },
  { name: "--secondary", value: "#f5f5f4", description: "Secondary background", category: "color" },
  { name: "--muted", value: "#f5f5f4", description: "Muted background", category: "color" },
  { name: "--muted-foreground", value: "#78716c", description: "Muted text", category: "color" },
  { name: "--accent", value: "#f5f5f4", description: "Accent background", category: "color" },
  { name: "--border", value: "#e7e5e4", description: "Border color", category: "color" },
  { name: "--ring", value: "#dc2626", description: "Focus ring", category: "color" },
];

const darkColorTokens: DesignToken[] = [
  { name: "--background", value: "#0c0a09", description: "Page background (dark)", category: "color" },
  { name: "--foreground", value: "#fafaf9", description: "Primary text (dark)", category: "color" },
  { name: "--card", value: "#1c1917", description: "Card background (dark)", category: "color" },
  { name: "--primary", value: "#f87171", description: "Primary brand color (dark)", category: "color" },
  { name: "--secondary", value: "#292524", description: "Secondary background (dark)", category: "color" },
  { name: "--muted", value: "#292524", description: "Muted background (dark)", category: "color" },
  { name: "--border", value: "#292524", description: "Border color (dark)", category: "color" },
];

const typographyTokens: DesignToken[] = [
  { name: "font-sans", value: "var(--font-geist-sans)", description: "Primary sans-serif font", category: "typography" },
  { name: "font-mono", value: "var(--font-geist-mono)", description: "Monospace font for code", category: "typography" },
  { name: "text-xs", value: "0.75rem (12px)", description: "Extra small text", category: "typography" },
  { name: "text-sm", value: "0.875rem (14px)", description: "Small text", category: "typography" },
  { name: "text-base", value: "1rem (16px)", description: "Base text size", category: "typography" },
  { name: "text-lg", value: "1.125rem (18px)", description: "Large text", category: "typography" },
  { name: "text-xl", value: "1.25rem (20px)", description: "Extra large text", category: "typography" },
  { name: "text-2xl", value: "1.5rem (24px)", description: "2X large text", category: "typography" },
  { name: "text-3xl", value: "1.875rem (30px)", description: "3X large text", category: "typography" },
  { name: "text-4xl", value: "2.25rem (36px)", description: "4X large text", category: "typography" },
];

const spacingTokens: DesignToken[] = [
  { name: "space-1", value: "0.25rem (4px)", description: "Extra small spacing", category: "spacing" },
  { name: "space-2", value: "0.5rem (8px)", description: "Small spacing", category: "spacing" },
  { name: "space-3", value: "0.75rem (12px)", description: "Medium-small spacing", category: "spacing" },
  { name: "space-4", value: "1rem (16px)", description: "Base spacing", category: "spacing" },
  { name: "space-6", value: "1.5rem (24px)", description: "Medium spacing", category: "spacing" },
  { name: "space-8", value: "2rem (32px)", description: "Large spacing", category: "spacing" },
  { name: "space-12", value: "3rem (48px)", description: "Extra large spacing", category: "spacing" },
  { name: "space-16", value: "4rem (64px)", description: "2X large spacing", category: "spacing" },
  { name: "space-24", value: "6rem (96px)", description: "3X large spacing", category: "spacing" },
];

const radiusTokens: DesignToken[] = [
  { name: "radius-sm", value: "calc(var(--radius) - 4px)", description: "Small radius", category: "radius" },
  { name: "radius-md", value: "calc(var(--radius) - 2px)", description: "Medium radius", category: "radius" },
  { name: "radius-lg", value: "var(--radius)", description: "Large radius", category: "radius" },
  { name: "radius-xl", value: "calc(var(--radius) + 4px)", description: "Extra large radius", category: "radius" },
  { name: "radius-2xl", value: "calc(var(--radius) + 8px)", description: "2X large radius", category: "radius" },
  { name: "radius-3xl", value: "calc(var(--radius) + 12px)", description: "3X large radius", category: "radius" },
  { name: "radius-4xl", value: "calc(var(--radius) + 16px)", description: "4X large radius", category: "radius" },
];

const shadowTokens: DesignToken[] = [
  { name: "shadow-sm", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", description: "Small shadow", category: "shadow" },
  { name: "shadow", value: "0 1px 3px 0 rgb(0 0 0 / 0.1)", description: "Base shadow", category: "shadow" },
  { name: "shadow-md", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", description: "Medium shadow", category: "shadow" },
  { name: "shadow-lg", value: "0 10px 15px -3px rgb(0 0 0 / 0.1)", description: "Large shadow", category: "shadow" },
  { name: "shadow-xl", value: "0 20px 25px -5px rgb(0 0 0 / 0.1)", description: "Extra large shadow", category: "shadow" },
  { name: "shadow-2xl", value: "0 25px 50px -12px rgb(0 0 0 / 0.25)", description: "2X large shadow", category: "shadow" },
];

function ColorSwatch({ color, name }: { color: string; name: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group cursor-pointer"
      onClick={handleCopy}
    >
      <div 
        className="w-full aspect-square rounded-xl border border-border shadow-sm transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: color }}
      />
      <div className="mt-2 space-y-0.5">
        <p className="text-xs font-mono truncate">{name}</p>
        <p className="text-xs text-muted-foreground font-mono truncate">
          {copied ? "Copied!" : color}
        </p>
      </div>
    </motion.div>
  );
}

function TokenCard({ token, index }: { token: DesignToken; index: number }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${token.name}: ${token.value}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <code className="text-sm font-semibold">{token.name}</code>
          <span className="text-xs text-muted-foreground">{token.description}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
            {token.value}
          </code>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
}

function SpacingVisualizer() {
  const spacings = [1, 2, 3, 4, 6, 8, 12, 16];
  
  return (
    <div className="space-y-4">
      {spacings.map((space) => (
        <div key={space} className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-20">space-{space}</span>
          <div className="flex-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${space * 6}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: space * 0.05 }}
              className="h-8 bg-gradient-to-r from-primary to-orange-500 rounded-full"
            />
          </div>
          <span className="text-sm font-mono w-24 text-right">{space * 0.25}rem</span>
        </div>
      ))}
    </div>
  );
}

function RadiusVisualizer() {
  const radii = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];
  
  return (
    <div className="grid grid-cols-7 gap-4">
      {radii.map((radius, i) => (
        <motion.div
          key={radius}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <div 
            className="w-full aspect-square bg-gradient-to-br from-primary to-orange-500"
            style={{ borderRadius: `var(--radius-${radius})` }}
          />
          <span className="text-xs text-muted-foreground">{radius}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ShadowVisualizer() {
  const shadows = [
    { name: "shadow-sm", class: "shadow-sm" },
    { name: "shadow", class: "shadow" },
    { name: "shadow-md", class: "shadow-md" },
    { name: "shadow-lg", class: "shadow-lg" },
    { name: "shadow-xl", class: "shadow-xl" },
    { name: "shadow-2xl", class: "shadow-2xl" },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-6">
      {shadows.map((shadow, i) => (
        <motion.div
          key={shadow.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-3"
        >
          <div 
            className={`w-24 h-24 bg-card rounded-xl ${shadow.class} border border-border`}
          />
          <span className="text-xs font-mono">{shadow.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function DesignTokensExplorer() {
  const [activeTab, setActiveTab] = useState("colors");
  const [isDark, setIsDark] = useState(false);

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
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Design System</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Design{" "}
            <span className="text-gradient-animated">Tokens</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the design tokens that power this portfolio. Copy values, visualize scales, and understand the system.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-8">
            <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-2" />Colors</TabsTrigger>
            <TabsTrigger value="typography"><Type className="w-4 h-4 mr-2" />Type</TabsTrigger>
            <TabsTrigger value="spacing"><Ruler className="w-4 h-4 mr-2" />Space</TabsTrigger>
            <TabsTrigger value="radius"><Box className="w-4 h-4 mr-2" />Radius</TabsTrigger>
            <TabsTrigger value="shadows"><Grid3X3 className="w-4 h-4 mr-2" />Shadows</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-0">
            <div className="space-y-8">
              {/* Light Mode */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Light Mode</h3>
                  <Badge variant="outline">Default</Badge>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {colorTokens.map((token, i) => (
                    <motion.div
                      key={token.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ColorSwatch color={token.value} name={token.name} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dark Mode */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Dark Mode</h3>
                  <Badge variant="outline">Auto-switch</Badge>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-6 rounded-2xl bg-[#0c0a09]">
                  {darkColorTokens.map((token, i) => (
                    <motion.div
                      key={token.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ColorSwatch color={token.value} name={token.name} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {typographyTokens.slice(2).map((token, i) => (
                  <TokenCard key={token.name} token={token} index={i} />
                ))}
              </div>
              
              <div className="rounded-2xl bg-card border border-border p-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-6">Preview</h3>
                <div className="space-y-6">
                  <p className="text-xs">The quick brown fox (text-xs)</p>
                  <p className="text-sm">The quick brown fox (text-sm)</p>
                  <p className="text-base">The quick brown fox (text-base)</p>
                  <p className="text-lg">The quick brown fox (text-lg)</p>
                  <p className="text-xl">The quick brown fox (text-xl)</p>
                  <p className="text-2xl">The quick brown fox (text-2xl)</p>
                  <p className="text-3xl">The quick brown fox (text-3xl)</p>
                  <p className="text-4xl">The quick brown fox (text-4xl)</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {spacingTokens.map((token, i) => (
                  <TokenCard key={token.name} token={token} index={i} />
                ))}
              </div>
              
              <div className="rounded-2xl bg-card border border-border p-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-6">Visual Scale</h3>
                <SpacingVisualizer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="radius" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {radiusTokens.map((token, i) => (
                  <TokenCard key={token.name} token={token} index={i} />
                ))}
              </div>
              
              <div className="rounded-2xl bg-card border border-border p-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-6">Visual Scale</h3>
                <RadiusVisualizer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shadows" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {shadowTokens.map((token, i) => (
                  <TokenCard key={token.name} token={token} index={i} />
                ))}
              </div>
              
              <div className="rounded-2xl bg-card border border-border p-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-6">Visual Scale</h3>
                <ShadowVisualizer />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Export Design Tokens</h4>
              <p className="text-sm text-muted-foreground">Download as CSS, JSON, or Tailwind config</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileJson className="w-4 h-4 mr-2" /> JSON
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> CSS
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" /> All
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
