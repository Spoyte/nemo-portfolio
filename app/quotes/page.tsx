"use client";

import { motion } from "framer-motion";
import { Quote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuoteOfTheDay } from "@/components/quote-of-the-day";
import { MatrixRain } from "@/components/matrix-rain";

export default function QuotesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Daily Inspiration</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Quote{" "}
            <span className="text-gradient">Collection</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A curated collection of quotes that inspire, motivate, and make me think. 
            Refresh for a new perspective.
          </p>
        </motion.div>

        {/* Quote of the Day */}
        <QuoteOfTheDay />

        {/* Matrix Rain Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Matrix Rain</h2>
            <p className="text-muted-foreground">
              An interactive code rain visualization. Click the settings icon to customize.
            </p>
          </div>
          
          <MatrixRain />
        </motion.div>

        {/* Featured Quote Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Programming",
                description: "Wisdom from the world of code and software engineering.",
                count: 6,
              },
              {
                title: "Design",
                description: "Insights on aesthetics, usability, and creative thinking.",
                count: 2,
              },
              {
                title: "Innovation",
                description: "Thoughts on progress, technology, and the future.",
                count: 3,
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <span className="text-xs text-muted-foreground">
                  {category.count} quotes
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
