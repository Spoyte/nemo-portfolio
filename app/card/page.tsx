"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Copy, 
  Check, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin,
  Globe,
  QrCode,
  Share2,
  Download,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

// Holographic card with 3D tilt effect
function HolographicCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mouse position for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30
  });
  
  // Holographic shine effect
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  }, [mouseX, mouseY, isFlipped]);
  
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@nemo.dev");
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#dc2626", "#ea580c", "#fbbf24"]
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    // Reset tilt when flipped
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto cursor-pointer"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Front of card */}
        <motion.div
          className="relative w-full aspect-[1.75/1] rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Holographic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/40 via-purple-500/20 to-blue-500/40 animate-pulse" />
              <div 
                className="absolute inset-0" 
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 70%)"
                }}
              />
            </div>
            
            {/* Holographic shine overlay */}
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: useTransform(
                  [shineX, shineY],
                  ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
                )
              }}
            />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px"
              }}
            />
            
            {/* Scanline effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)",
                backgroundSize: "100% 4px"
              }}
              animate={{ backgroundPosition: ["0 0", "0 4px"] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            />
          </div>
          
          {/* Card content */}
          <div className="relative h-full p-8 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                  N
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Nemo</h3>
                  <p className="text-white/60 text-sm">Creative Developer</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                Available
              </Badge>
            </div>
            
            {/* Middle */}
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-wider">Specializing in</p>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "UI/UX"].map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 rounded-md bg-white/10 text-white/80 text-xs backdrop-blur"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Bottom */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-white/40 text-xs">hello@nemo.dev</p>
                <p className="text-white/40 text-xs">nemo.dev</p>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: Github, href: "https://github.com" },
                  { icon: Twitter, href: "https://twitter.com" },
                  { icon: Linkedin, href: "https://linkedin.com" }
                ].map(({ icon: Icon, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Holographic border glow */}
          <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 via-purple-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity -z-10" />
        </motion.div>
        
        {/* Back of card */}
        <motion.div
          className="absolute inset-0 w-full aspect-[1.75/1] rounded-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            rotateY: 180
          }}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20" />
          </div>
          
          <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-xl bg-white p-2 mb-4">
              {/* QR Code placeholder */}
              <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-white font-medium mb-2">Scan to connect</p>
            <p className="text-white/60 text-sm mb-4">or</p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyEmail();
              }}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Email"}
            </Button>
          </div>
          
          <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
        </motion.div>
      </motion.div>
      
      <p className="text-center text-muted-foreground text-sm mt-4">
        Click to flip • Hover for 3D effect
      </p>
    </div>
  );
}

// Floating particles background
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Share options
function ShareOptions() {
  const [showOptions, setShowOptions] = useState(false);
  
  const shareOptions = [
    { name: "Twitter", icon: Twitter, color: "bg-sky-500" },
    { name: "LinkedIn", icon: Linkedin, color: "bg-blue-600" },
    { name: "Copy Link", icon: Copy, color: "bg-slate-600" },
    { name: "Download vCard", icon: Download, color: "bg-primary" }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="group"
        onClick={() => setShowOptions(!showOptions)}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Card
      </Button>
      
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card border rounded-xl p-2 shadow-xl z-10 min-w-[160px]"
        >
          {shareOptions.map((option) => (
            <button
              key={option.name}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
              onClick={() => setShowOptions(false)}
            >
              <div className={`p-1.5 rounded-md ${option.color} text-white`}>
                <option.icon className="w-3 h-3" />
              </div>
              <span className="text-sm">{option.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function BusinessCardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Interactive Card</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Digital Business Card</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A holographic, interactive business card. Hover for 3D effects, click to flip.
          </p>
        </motion.div>
        
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <HolographicCard />
        </motion.div>
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="group">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button size="lg" variant="outline" className="group">
            <Globe className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
          <ShareOptions />
        </motion.div>
        
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              title: "3D Tilt Effect", 
              description: "Move your mouse over the card to see the holographic 3D tilt effect."
            },
            { 
              title: "Flip to Connect", 
              description: "Click the card to flip it and reveal the QR code for quick contact."
            },
            { 
              title: "Holographic Design", 
              description: "Features animated gradients, scanlines, and reflective surfaces."
            }
          ].map((feature, i) => (
            <Card key={i} className="p-6 text-center">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
