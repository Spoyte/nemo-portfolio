"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Layout,
  Component,
  Copy,
  Check,
  Moon,
  Sun,
  Sparkles,
  Grid3X3,
  Box,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Color Palette
const colors = [
  { name: "Primary", variable: "--primary", value: "#dc2626", usage: "Buttons, links, accents" },
  { name: "Secondary", variable: "--secondary", value: "#f5f5f4", usage: "Backgrounds, subtle elements" },
  { name: "Accent", variable: "--accent", value: "#f5f5f4", usage: "Hover states, highlights" },
  { name: "Muted", variable: "--muted", value: "#f5f5f4", usage: "Subtle backgrounds" },
  { name: "Destructive", variable: "--destructive", value: "#ef4444", usage: "Errors, warnings" },
  { name: "Border", variable: "--border", value: "#e7e5e4", usage: "Dividers, borders" },
];

const chartColors = [
  { name: "Chart 1", value: "#dc2626" },
  { name: "Chart 2", value: "#ea580c" },
  { name: "Chart 3", value: "#d97706" },
  { name: "Chart 4", value: "#65a30d" },
  { name: "Chart 5", value: "#0891b2" },
];

// Typography
const typography = [
  { name: "Heading 1", class: "text-5xl font-bold", sample: "Heading 1" },
  { name: "Heading 2", class: "text-4xl font-bold", sample: "Heading 2" },
  { name: "Heading 3", class: "text-3xl font-semibold", sample: "Heading 3" },
  { name: "Heading 4", class: "text-2xl font-semibold", sample: "Heading 4" },
  { name: "Large Text", class: "text-lg", sample: "Large body text" },
  { name: "Body", class: "text-base", sample: "Regular body text" },
  { name: "Small", class: "text-sm", sample: "Small text" },
  { name: "Muted", class: "text-sm text-muted-foreground", sample: "Muted text" },
];

// Spacing
const spacing = [
  { name: "xs", value: "0.25rem (4px)" },
  { name: "sm", value: "0.5rem (8px)" },
  { name: "md", value: "1rem (16px)" },
  { name: "lg", value: "1.5rem (24px)" },
  { name: "xl", value: "2rem (32px)" },
  { name: "2xl", value: "3rem (48px)" },
  { name: "3xl", value: "4rem (64px)" },
];

// Border Radius
const radii = [
  { name: "sm", value: "0.25rem", class: "rounded-sm" },
  { name: "md", value: "0.375rem", class: "rounded-md" },
  { name: "lg", value: "0.5rem", class: "rounded-lg" },
  { name: "xl", value: "0.75rem", class: "rounded-xl" },
  { name: "2xl", value: "1rem", class: "rounded-2xl" },
  { name: "3xl", value: "1.5rem", class: "rounded-3xl" },
  { name: "full", value: "9999px", class: "rounded-full" },
];

function ColorCard({ color }: { color: typeof colors[0] }) {
  const [copied, setCopied] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(color.value);
    setCopied(true);
    toast.success(`Copied ${color.value}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={copyColor}
    >
      <div
        className="h-24 rounded-xl mb-3 shadow-sm transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: color.value }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{color.name}</p>
          <p className="text-xs text-muted-foreground">{color.value}</p>
        </div>
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{color.usage}</p>
    </motion.div>
  );
}

function ComponentShowcase() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Sparkles className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Inputs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="With icon" className="pl-10" />
          <Input placeholder="Type something..." />
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* Form Controls */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Controls</h3>
        <div className="space-y-6 max-w-md">
          <div className="flex items-center justify-between">
            <Label htmlFor="switch">Toggle Switch</Label>
            <Switch
              id="switch"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
          </div>

          <div className="space-y-2">
            <Label>Slider ({sliderValue}%)</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkbox"
              checked={checkboxChecked}
              onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
            />
            <Label htmlFor="checkbox">Accept terms and conditions</Label>
          </div>

          <div className="space-y-2">
            <Label>Radio Group</Label>
            <RadioGroup defaultValue="option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Progress</h3>
        <div className="space-y-4 max-w-md">
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </div>
      </div>
    </div>
  );
}

export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "spacing" | "components">(
    "colors"
  );

  const tabs = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "spacing", label: "Spacing", icon: Layout },
    { id: "components", label: "Components", icon: Component },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Design System</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Visual Language</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive design system for building consistent, beautiful interfaces.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "colors" && (
            <div className="space-y-12">
              {/* Main Colors */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Core Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {colors.map((color) => (
                    <ColorCard key={color.name} color={color} />
                  ))}
                </div>
              </div>

              {/* Chart Colors */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Chart Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {chartColors.map((color) => (
                    <ColorCard
                      key={color.name}
                      color={{ ...color, variable: "", usage: "Data visualization" }}
                    />
                  ))}
                </div>
              </div>

              {/* Gradients */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Gradients</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-32 bg-gradient-to-r from-primary to-orange-500 rounded-t-lg" />
                      <div className="p-4">
                        <p className="font-medium">Primary Gradient</p>
                        <p className="text-xs text-muted-foreground">Used for CTAs and highlights</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-t-lg" />
                      <div className="p-4">
                        <p className="font-medium">Purple Dream</p>
                        <p className="text-xs text-muted-foreground">Used for special features</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-t-lg" />
                      <div className="p-4">
                        <p className="font-medium">Ocean Breeze</p>
                        <p className="text-xs text-muted-foreground">Used for calm states</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "typography" && (
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {typography.map((type) => (
                    <div key={type.name} className="flex items-baseline gap-8 border-b pb-4 last:border-0"
                    >
                      <div className="w-32 flex-shrink-0">
                        <p className="text-sm font-medium text-muted-foreground">{type.name}</p>
                        <p className="text-xs text-muted-foreground">{type.class}</p>
                      </div>
                      <div className={type.class}>{type.sample}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "spacing" && (
            <div className="space-y-12">
              {/* Spacing Scale */}
              <Card>
                <CardHeader>
                  <CardTitle>Spacing Scale</CardTitle>
                  <CardDescription>
                    Consistent spacing creates visual rhythm and hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {spacing.map((space) => (
                    <div key={space.name} className="flex items-center gap-4">
                      <span className="w-16 font-medium">{space.name}</span>
                      <span className="w-32 text-sm text-muted-foreground">{space.value}</span>
                      <div
                        className="h-8 bg-primary rounded"
                        style={{ width: space.value.split(" ")[0] }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Border Radius */}
              <Card>
                <CardHeader>
                  <CardTitle>Border Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6">
                    {radii.map((radius) => (
                      <div key={radius.name} className="text-center">
                        <div
                          className={`w-16 h-16 bg-primary ${radius.class} mb-2`}
                        />
                        <p className="font-medium">{radius.name}</p>
                        <p className="text-xs text-muted-foreground">{radius.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "components" && <ComponentShowcase />}
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20"
          >
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Use this design system</h3>
                  <p className="text-muted-foreground">
                    Download the full design tokens and component specifications.
                  </p>
                </div>
                <Button size="lg" className="gap-2">
                  Download Tokens
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
