"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { ReadingList } from "@/components/reading-list";

export default function ReadingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Library</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Reading List
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Books that have shaped my thinking as a developer and human. 
            From technical deep-dives to productivity and philosophy.
          </p>
        </motion.div>

        {/* Reading List Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ReadingList />
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
            "Reading is to the mind what exercise is to the body."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">
            — Joseph Addison
          </cite>
        </motion.div>
      </div>
    </div>
  );
}
