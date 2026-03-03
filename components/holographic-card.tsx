"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

interface HolographicCardProps {
  title: string;
  description: string;
  image: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

const RARITY_COLORS = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-pink-600",
  legendary: "from-yellow-400 via-orange-500 to-red-500",
};

export function HolographicCard({ 
  title, 
  description, 
  image, 
  rarity = "rare" 
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-sm aspect-[3/4] cursor-pointer group"
    >
      {/* Card Container */}
      <div 
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${RARITY_COLORS[rarity]} opacity-20`} />

        {/* Holographic Effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`
              : "none",
          }}
        />

        {/* Image */}
        <div className="relative h-1/2 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${RARITY_COLORS[rarity]} text-white mb-3`}>
            {rarity}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `linear-gradient(${(x.get() + 0.5) * 360}deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`
              : "none",
          }}
        />

        {/* Border Glow */}
        <div 
          className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${RARITY_COLORS[rarity]} opacity-0 group-hover:opacity-100 transition-opacity`}
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "2px",
          }}
        />
      </div>

      {/* Shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-black/20 blur-xl -z-10"
        style={{
          transform: "translateZ(-50px)",
          x: useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]),
        }}
      />
    </motion.div>
  );
}
