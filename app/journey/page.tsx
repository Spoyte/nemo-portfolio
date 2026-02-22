"use client";

import { JourneyTimeline, JourneyStats } from "@/components/journey-timeline";
import { motion } from "framer-motion";

export default function JourneyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">My Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every line of code tells a story. Here&apos;s mine — from curious beginner to passionate developer.
          </p>
        </motion.div>

        {/* Stats */}
        <JourneyStats />

        {/* Timeline */}
        <JourneyTimeline />

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <blockquote className="text-xl md:text-2xl font-medium italic text-muted-foreground">
              &quot;The only way to do great work is to love what you do.&quot;
            </blockquote>
            <cite className="text-sm text-muted-foreground mt-2 block">— Steve Jobs</cite>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
