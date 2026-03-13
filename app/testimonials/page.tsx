"use client";

import { motion } from "framer-motion";
import { 
  Quote, 
  Star,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonials = [
  {
    id: "1",
    quote: "Nemo transformed our outdated platform into a modern, high-performance application. The attention to detail and focus on user experience was exceptional.",
    author: "Sarah Chen",
    role: "CTO at TechRetail Inc.",
    rating: 5,
    project: "E-Commerce Platform",
  },
  {
    id: "2",
    quote: "Working with Nemo was a game-changer for our startup. The technical expertise combined with creative problem-solving delivered results beyond our expectations.",
    author: "Michael Torres",
    role: "VP of Product at DataFlow",
    rating: 5,
    project: "Analytics Dashboard",
  },
  {
    id: "3",
    quote: "The best developer I've worked with. Nemo doesn't just write code – they architect solutions that scale and deliver real business value.",
    author: "Jennifer Walsh",
    role: "Head of Digital at SecureBank",
    rating: 5,
    project: "Mobile Banking App",
  },
  {
    id: "4",
    quote: "Incredible attention to detail and a genuine passion for creating beautiful, functional interfaces. Our conversion rates improved by 140% after the redesign.",
    author: "David Park",
    role: "Founder at StartupXYZ",
    rating: 5,
    project: "SaaS Platform",
  },
  {
    id: "5",
    quote: "Nemo's ability to understand complex requirements and translate them into elegant solutions is rare. A true professional who delivers on time and exceeds expectations.",
    author: "Emily Rodriguez",
    role: "Product Manager at TechCorp",
    rating: 5,
    project: "Enterprise Dashboard",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all h-full">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 text-primary/10">
          <Quote className="w-12 h-12" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-lg mb-6 leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-semibold text-primary">{testimonial.author[0]}</span>
          </div>
          <div>
            <p className="font-semibold">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>

        {/* Project Badge */}
        <div className="mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground">Project: {testimonial.project}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Client Love</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            What People{" "}
            <span className="text-gradient-animated">Say</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kind words from clients and colleagues I&apos;ve had the pleasure of working with.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "100%", label: "Client Satisfaction" },
            { value: "5★", label: "Average Rating" },
            { value: "7+", label: "Years Experience" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border">
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">
            Want to add your testimonial? Let&apos;s work together!
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/hire">
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
