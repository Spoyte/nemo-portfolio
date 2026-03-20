"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  project: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechStart Inc.",
    content:
      "Working with Nemo was an absolute pleasure. The attention to detail and technical expertise brought to our project exceeded all expectations. The final product was not only visually stunning but also incredibly performant.",
    rating: 5,
    project: "E-commerce Platform",
    date: "2024",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "CTO",
    company: "DataFlow Systems",
    content:
      "Nemo's ability to translate complex requirements into elegant solutions is remarkable. The dashboard we built together has become the centerpiece of our product offering. Highly recommended!",
    rating: 5,
    project: "Analytics Dashboard",
    date: "2024",
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Design Director",
    company: "Creative Studio",
    content:
      "As a designer, I appreciate when developers understand design intent. Nemo not only understood but enhanced our vision with thoughtful interactions and attention to micro-details.",
    rating: 5,
    project: "Portfolio Website",
    date: "2023",
  },
  {
    id: "4",
    name: "David Park",
    role: "Founder",
    company: "NextGen Apps",
    content:
      "Fast, reliable, and incredibly skilled. Nemo delivered our MVP in record time without compromising on quality. The code is clean, well-documented, and easy to maintain.",
    rating: 5,
    project: "Mobile App",
    date: "2023",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Marketing Lead",
    company: "Growth Co.",
    content:
      "Our website conversion rate increased by 40% after the redesign. Nemo understood our business goals and created a solution that not only looks great but drives results.",
    rating: 5,
    project: "Marketing Website",
    date: "2023",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = testimonials.length - 1;
        if (nextIndex >= testimonials.length) nextIndex = 0;
        return nextIndex;
      });
    },
    []
  );

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, paginate]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative h-[400px] md:h-[350px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Card className="h-full">
              <CardContent className="p-8 md:p-12 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pl-6">
                      {currentTestimonial.content}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {currentTestimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{currentTestimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.role} at {currentTestimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{currentTestimonial.project}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentTestimonial.date}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(-1)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(1)}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
