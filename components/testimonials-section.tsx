"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Nemo transformed our vision into reality. His technical expertise combined with design sensibility resulted in a product that exceeded our expectations. The attention to detail is remarkable.",
    author: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp Inc.",
    rating: 5,
    avatar: "SC",
  },
  {
    quote: "Working with Nemo was a game-changer for our startup. He delivered a beautiful, performant application that our users love. His ability to understand business needs and translate them into technical solutions is exceptional.",
    author: "Michael Rodriguez",
    role: "Founder & CEO",
    company: "StartupXYZ",
    rating: 5,
    avatar: "MR",
  },
  {
    quote: "His technical skills are matched only by his creativity. Nemo doesn't just write code—he crafts experiences. The animations and micro-interactions he added made our app feel alive.",
    author: "Emily Watson",
    role: "Design Lead",
    company: "Digital Agency",
    rating: 5,
    avatar: "EW",
  },
  {
    quote: "Nemo's ability to lead a team while delivering high-quality code is rare. He mentored junior developers, established best practices, and still shipped features ahead of schedule.",
    author: "David Kim",
    role: "CTO",
    company: "ScaleUp",
    rating: 5,
    avatar: "DK",
  },
  {
    quote: "The e-commerce platform Nemo built for us handles thousands of transactions daily without a hitch. His expertise in performance optimization saved us from major headaches down the road.",
    author: "Lisa Thompson",
    role: "Operations Director",
    company: "RetailMax",
    rating: 5,
    avatar: "LT",
  },
  {
    quote: "I was impressed by Nemo's communication skills. He explained complex technical concepts in ways our non-technical stakeholders could understand. A true bridge between tech and business.",
    author: "James Wilson",
    role: "Project Manager",
    company: "Enterprise Solutions",
    rating: 5,
    avatar: "JW",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <{/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it. Here's what clients and colleagues have to say about working with me.
          </p>
        </motion.div>

        <{/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative max-w-4xl mx-auto">
            <{/* Quote Icon */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Quote className="h-6 w-6 text-primary" />
            </div>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-2xl p-8 md:p-12"
            >
              <{/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: TESTIMONIALS[activeIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <{/* Quote */}
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{TESTIMONIALS[activeIndex].quote}"
              </blockquote>

              <{/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {TESTIMONIALS[activeIndex].avatar}
                </div>
                <div>
                  <p className="font-semibold">{TESTIMONIALS[activeIndex].author}</p>
                  <p className="text-sm text-muted-foreground">
                    {TESTIMONIALS[activeIndex].role} at {TESTIMONIALS[activeIndex].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <{/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <{/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveIndex(index)}
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                index === activeIndex
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
