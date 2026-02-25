"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Calculator, 
  Clock, 
  Code2, 
  Palette, 
  Smartphone, 
  Globe, 
  Database,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Send,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Service {
  id: string;
  name: string;
  icon: React.ElementType;
  basePrice: number;
  description: string;
}

const services: Service[] = [
  { id: "frontend", name: "Frontend Development", icon: Code2, basePrice: 150, description: "React, Next.js, TypeScript" },
  { id: "backend", name: "Backend Development", icon: Database, basePrice: 180, description: "Node.js, APIs, Databases" },
  { id: "design", name: "UI/UX Design", icon: Palette, basePrice: 140, description: "Figma, Prototyping" },
  { id: "mobile", name: "Mobile Development", icon: Smartphone, basePrice: 170, description: "React Native, iOS, Android" },
  { id: "webapp", name: "Full-Stack Web App", icon: Globe, basePrice: 200, description: "End-to-end development" },
];

const complexityMultipliers = [
  { label: "Simple", value: 1, description: "Landing page, basic features" },
  { label: "Standard", value: 1.5, description: "Multi-page, integrations" },
  { label: "Complex", value: 2.5, description: "Custom features, scalability" },
  { label: "Enterprise", value: 4, description: "High-scale, security-critical" },
];

const timelineMultipliers = [
  { label: "Relaxed", value: 1, description: "4+ weeks" },
  { label: "Standard", value: 1.2, description: "2-3 weeks" },
  { label: "Urgent", value: 1.5, description: "1 week" },
  { label: "Emergency", value: 2, description: "Less than 1 week" },
];

export default function HireMePage() {
  const [selectedService, setSelectedService] = useState<string>("frontend");
  const [complexity, setComplexity] = useState(1);
  const [timeline, setTimeline] = useState(1);
  const [hours, setHours] = useState(20);
  const [isRush, setIsRush] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  
  const selectedServiceData = services.find(s => s.id === selectedService)!;
  const complexityData = complexityMultipliers[complexity];
  const timelineData = timelineMultipliers[timeline];
  
  const baseTotal = selectedServiceData.basePrice * hours;
  const complexityCost = baseTotal * (complexityData.value - 1);
  const timelineCost = baseTotal * (timelineData.value - 1);
  const rushCost = isRush ? baseTotal * 0.3 : 0;
  const total = baseTotal + complexityCost + timelineCost + rushCost;
  
  const [animatedTotal, setAnimatedTotal] = useState(total);
  
  useEffect(() => {
    const duration = 500;
    const start = animatedTotal;
    const end = total;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedTotal(start + (end - start) * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [total]);
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-medium">Available for Work</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let&apos;s Work Together
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use the calculator below to estimate your project cost, then reach out to discuss details.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Project Estimator
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Service Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          selectedService === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <service.icon className={`h-5 w-5 ${
                          selectedService === service.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.description}</div>
                        </div>
                        <div className="text-sm font-semibold">${service.basePrice}/hr</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Hours Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Estimated Hours</label>
                    <span className="text-sm font-semibold">{hours} hrs</span>
                  </div>
                  <Slider
                    value={[hours]}
                    onValueChange={([v]) => setHours(v)}
                    min={10}
                    max={200}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10 hrs</span>
                    <span>200 hrs</span>
                  </div>
                </div>
                
                {/* Complexity */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Complexity Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {complexityMultipliers.map((c, i) => (
                      <button
                        key={c.label}
                        onClick={() => setComplexity(i)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          complexity === i
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{c.label}</div>
                        <div className="text-xs text-muted-foreground">{c.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Timeline */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Timeline</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timelineMultipliers.map((t, i) => (
                      <button
                        key={t.label}
                        onClick={() => setTimeline(i)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          timeline === i
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{t.label}</div>
                        <div className="text-xs text-muted-foreground">{t.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Rush Option */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Weekend/Holiday Work</div>
                      <div className="text-xs text-muted-foreground">+30% for off-hours availability</div>
                    </div>
                  </div>
                  <Switch checked={isRush} onCheckedChange={setIsRush} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Quote Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20">
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedServiceData.name} ({hours} hrs x ${selectedServiceData.basePrice})
                    </span>
                    <span>${baseTotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Complexity: {complexityData.label} (x{complexityData.value})
                    </span>
                    <span>+${complexityCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Timeline: {timelineData.label} (x{timelineData.value})
                    </span>
                    <span>+${timelineCost.toLocaleString()}</span>
                  </div>
                  
                  {isRush && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekend/Holiday (+30%)</span>
                      <span>+${rushCost.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Estimated Total</span>
                    <motion.span 
                      className="text-3xl font-bold text-primary"
                      key={animatedTotal}
                    >
                      ${Math.round(animatedTotal).toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * This is an estimate. Final pricing may vary based on project requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Form */}
            <AnimatePresence mode="wait">
              {!showContact ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full group"
                    onClick={() => setShowContact(true)}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Send Inquiry
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          placeholder="Your company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Project Details</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell me about your project..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowContact(false)}
                        >
                          Back
                        </Button>
                        <Button className="flex-1">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm font-medium">Fixed Price</div>
                <div className="text-xs text-muted-foreground">No hidden fees</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm font-medium">Source Code</div>
                <div className="text-xs text-muted-foreground">Full ownership</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-sm font-medium">Support</div>
                <div className="text-xs text-muted-foreground">30 days included</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
