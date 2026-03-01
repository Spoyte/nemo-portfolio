"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Heart,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  tags: string[];
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Nemo's attention to detail is unmatched. They transformed our vision into a stunning reality that exceeded all expectations. The codebase is clean, maintainable, and beautifully architected.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TechStart Inc.",
    avatar: "SC",
    rating: 5,
    tags: ["React", "TypeScript", "UI/UX"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    quote: "Working with Nemo was an absolute pleasure. Their technical expertise combined with creative problem-solving made our project a huge success. Highly recommended!",
    author: "Marcus Johnson",
    role: "Product Manager",
    company: "Digital Ventures",
    avatar: "MJ",
    rating: 5,
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    quote: "The best developer I've worked with. Nemo doesn't just write code—they craft experiences. Our conversion rate increased by 40% after the redesign.",
    author: "Emily Rodriguez",
    role: "Founder",
    company: "GrowthLabs",
    avatar: "ER",
    rating: 5,
    tags: ["Performance", "SEO", "Analytics"],
    color: "from-orange-500 to-red-500",
  },
  {
    id: "4",
    quote: "Nemo's ability to understand complex requirements and translate them into elegant solutions is remarkable. They're a true full-stack magician.",
    author: "David Kim",
    role: "Engineering Lead",
    company: "CloudScale",
    avatar: "DK",
    rating: 5,
    tags: ["System Design", "AWS", "DevOps"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "5",
    quote: "Exceptional work on our design system. Nemo created components that are not only beautiful but also accessible and performant. Our team productivity doubled.",
    author: "Lisa Thompson",
    role: "Design Director",
    company: "Creative Agency",
    avatar: "LT",
    rating: 5,
    tags: ["Design System", "Accessibility", "Storybook"],
    color: "from-amber-500 to-yellow-500",
  },
];

export function InteractiveTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTestimonial = testimonials[currentIndex];

  // Auto-advance
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleLike = (id: string) => {
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#ef4444", "#f87171", "#fca5a5"],
        });
      }
      return newSet;
    });
  };

  const handleShare = async (platform: string, testimonial: Testimonial) => {
    const text = `"${testimonial.quote}" - ${testimonial.author}, ${testimonial.role} at ${testimonial.company}`;
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
    } else if (platform === "copy") {
      await navigator.clipboard.writeText(text);
      setCopiedId(testimonial.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12" ref={containerRef}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Quote className="w-4 h-4" />
          <span className="text-sm font-medium">Testimonials</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What People <span className="text-gradient-animated">Say</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Kind words from clients and colleagues I've had the pleasure of working with.
        </p>
      </motion.div>

      {/* Main Card */}
      <div 
        className="relative h-[400px] perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0"
          >
            <Card className="h-full overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating 
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-muted"
                        }`} 
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <div className="flex-1 flex items-center">
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed">
                    "{currentTestimonial.quote}"
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentTestimonial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center text-white font-bold`}>
                      {currentTestimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{currentTestimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.role} at {currentTestimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={likedTestimonials.has(currentTestimonial.id) ? "text-red-500" : ""}
                      onClick={() => handleLike(currentTestimonial.id)}
                    >
                      <Heart className={`w-5 h-5 ${likedTestimonials.has(currentTestimonial.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("copy", currentTestimonial)}
                    >
                      {copiedId === currentTestimonial.id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "w-8 bg-primary" 
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-3 gap-6 mt-12 text-center"
      >
        {[
          { value: "50+", label: "Projects Delivered" },
          { value: "100%", label: "Client Satisfaction" },
          { value: "5★", label: "Average Rating" },
        ].map((stat, index) => (
          <div key={index} className="p-4 rounded-xl bg-muted/50">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
