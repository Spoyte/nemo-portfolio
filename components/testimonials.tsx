"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Nemo is one of the most talented developers I've worked with. His attention to detail and ability to translate complex requirements into elegant solutions is remarkable.",
    author: "Sarah Chen",
    role: "Product Manager at TechCorp",
    avatar: "SC",
  },
  {
    quote: "Working with Nemo was a game-changer for our startup. He delivered a beautiful, performant application that our users love.",
    author: "Michael Rodriguez",
    role: "Founder at StartupXYZ",
    avatar: "MR",
  },
  {
    quote: "His technical skills are matched only by his creativity. Nemo doesn't just write code—he crafts experiences.",
    author: "Emily Watson",
    role: "Design Lead at Agency",
    avatar: "EW",
  },
  {
    quote: "Nemo's ability to understand business needs and translate them into technical solutions is exceptional. A true full-stack thinker.",
    author: "David Kim",
    role: "CTO at ScaleUp",
    avatar: "DK",
  },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.author}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative p-6 rounded-2xl bg-card border border-border"
        >
          <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
          
          <p className="text-muted-foreground mb-6 relative z-10">
            "{testimonial.quote}"
          </p>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {testimonial.avatar}
            </div>
            <div>
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
