"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    quote: "Nemo's attention to detail is unmatched. He transformed our vague ideas into a stunning, functional product that exceeded all expectations.",
    author: "Sarah Chen",
    role: "Product Manager at TechCorp",
    rating: 5,
  },
  {
    id: 2,
    quote: "Working with Nemo was a game-changer for our startup. His technical expertise combined with design sensibility delivered results we didn't think were possible.",
    author: "Marcus Johnson",
    role: "CEO at StartupXYZ",
    rating: 5,
  },
  {
    id: 3,
    quote: "The code quality is exceptional. Clean, well-documented, and scalable. Nemo doesn't just write code—he crafts solutions.",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    rating: 5,
  },
  {
    id: 4,
    quote: "I've worked with many developers, but Nemo stands out for his ability to understand business needs and translate them into technical reality.",
    author: "David Park",
    role: "Founder at DesignStudio",
    rating: 5,
  },
  {
    id: 5,
    quote: "Fast, reliable, and incredibly talented. Nemo delivered our project ahead of schedule and the results speak for themselves.",
    author: "Lisa Thompson",
    role: "Director at MediaGroup",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Quote Icon */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Quote className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-8 leading-relaxed">
              "{testimonials[current].quote}"
            </blockquote>

            {/* Author */}
            <div>
              <p className="font-semibold text-foreground">
                {testimonials[current].author}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonials[current].role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
