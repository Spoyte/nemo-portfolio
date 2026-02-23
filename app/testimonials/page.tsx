"use client";

import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WallOfLove } from "@/components/wall-of-love";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

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
            <Heart className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">Testimonials</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Wall of{" "}
            <span className="text-gradient">Love</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kind words from amazing people I&apos;ve had the pleasure of working with.
            Each testimonial represents a unique collaboration and shared success.
          </p>
        </motion.div>

        {/* Wall of Love */}
        <WallOfLove />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/10">
            <h2 className="text-2xl font-bold mb-4">Want to work together?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              I&apos;m always excited to collaborate on interesting projects. 
              Let&apos;s create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Get in Touch</Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline">View Projects</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
