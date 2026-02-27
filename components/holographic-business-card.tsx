"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Mail, Github, Linkedin, Twitter, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HolographicBusinessCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@nemo.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[380px] h-[220px] cursor-pointer perspective-1000"
      >
        {/* Front of card */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          {/* Holographic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.2),transparent_50%)]" />
              <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(234,88,12,0.2),transparent_50%)]" />
            </div>
          </div>

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Card content */}
          <div className="relative z-10 h-full p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                  N
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Nemo</h3>
                  <p className="text-white/60 text-sm">Creative Developer</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-xs text-white/80 font-medium">Available for work</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4" />
                <span>hello@nemo.dev</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Github className="w-4 h-4" />
                <span>github.com/nemo</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white/80" />
                  </motion.div>
                ))}
              </div>
              <span className="text-white/40 text-xs">Click to flip</span>
            </div>
          </div>

          {/* Holographic shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
            }}
          />
        </motion.div>

        {/* Back of card */}
        <motion.div
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6, type: "spring" }}
          style={{ 
            transformStyle: "preserve-3d", 
            backfaceVisibility: "hidden",
            rotateY: 180
          }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
          </div>

          <div className="relative z-10 h-full p-6 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 mb-4">
              <div className="w-full h-full bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Scan to Connect</h3>
            <p className="text-white/60 text-sm mb-4">Or click to flip back</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  copyEmail();
                }}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Email"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => e.stopPropagation()}
                className="gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
                vCard
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <p className="text-muted-foreground text-sm text-center">
        Hover to see the holographic effect, click to flip
      </p>
    </div>
  );
}
