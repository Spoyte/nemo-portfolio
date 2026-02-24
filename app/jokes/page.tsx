"use client";

import { motion } from "framer-motion";
import { Laugh, Sparkles } from "lucide-react";
import { DevJokes } from "@/components/dev-jokes";

export default function JokesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Laugh className="h-4 w-4" />
            <span className="text-sm font-medium">Dev Humor</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Dev Jokes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of programmer humor, tech puns, and dad jokes that only developers truly understand.
          </p>
        </motion.div>

        {/* Jokes Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DevJokes />
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Got a joke to share? These are all in good fun — no bugs were harmed in the making of these jokes! 🐛
          </p>
        </motion.div>
      </div>
    </div>
  );
}
