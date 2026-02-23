"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Quote, Star, Heart, Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "Working with Nemo was an absolute pleasure. The attention to detail and technical expertise delivered exceeded all expectations. Our project was completed ahead of schedule!",
    rating: 5,
    avatar: "SC",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "CTO",
    company: "StartupXYZ",
    content: "Exceptional developer with a keen eye for design. Nemo transformed our vague ideas into a polished, performant application that our users love.",
    rating: 5,
    avatar: "MJ",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Design Lead",
    company: "Creative Studio",
    content: "The collaboration was seamless. Nemo understood our design vision perfectly and implemented it with pixel-perfect precision. Highly recommended!",
    rating: 5,
    avatar: "ER",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Founder",
    company: "InnovateLab",
    content: "Nemo's ability to solve complex problems with elegant solutions is remarkable. The code quality and documentation were top-notch.",
    rating: 5,
    avatar: "DK",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Engineering Manager",
    company: "ScaleUp Inc",
    content: "A rare talent who combines technical depth with creative thinking. Nemo brought fresh ideas to our project that significantly improved the end result.",
    rating: 5,
    avatar: "LT",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "6",
    name: "Alex Patel",
    role: "Senior Developer",
    company: "DevTeam Pro",
    content: "I've worked with many developers, but Nemo stands out for the clean, maintainable code and proactive communication. A true professional.",
    rating: 5,
    avatar: "AP",
    color: "from-indigo-500 to-blue-500",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    x.set(mouseX * 0.5);
    y.set(mouseY * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: "-200%" }}
          animate={{ x: isHovered ? "200%" : "-200%" }}
          transition={{ duration: 0.8 }}
        />

        <CardContent className="p-6 relative z-10">
          {/* Quote icon */}
          <div className="absolute top-4 right-4 opacity-10">
            <Quote className="w-16 h-16" />
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
              >
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            &ldquo;{testimonial.content}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold`}>
              {testimonial.avatar}
            </div>
            <div>
              <h4 className="font-semibold">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FloatingHeart({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-red-500/20 pointer-events-none"
      initial={{ y: 100, opacity: 0, scale: 0 }}
      animate={{
        y: -100,
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        x: [0, Math.random() * 50 - 25, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
      style={{
        left: `${Math.random() * 100}%`,
        bottom: 0,
      }}
    >
      <Heart className="w-6 h-6 fill-current" />
    </motion.div>
  );
}

export function WallOfLove() {
  const [shuffled, setShuffled] = useState(testimonials);

  const shuffleTestimonials = () => {
    setShuffled([...testimonials].sort(() => Math.random() - 0.5));
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <FloatingHeart key={i} delay={i * 0.5} />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Wall of Love</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What People Are{" "}
            <span className="text-gradient">Saying</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don&apos;t just take my word for it. Here&apos;s what clients and colleagues have to say about working together.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">5.0</span> average rating
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={shuffleTestimonials}
            className="mt-6 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Shuffle
          </Button>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shuffled.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "100%", label: "Client Satisfaction" },
            { value: "5/5", label: "Average Rating" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-muted/50"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to add your testimonial? I&apos;d love to hear from you!
          </p>
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Share Your Experience
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
