"use client";

import { motion } from "framer-motion";
import { Monitor, Sparkles } from "lucide-react";
import { SetupShowcase } from "@/components/setup-showcase";

export default function SetupPage() {
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
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium">Workspace</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            My Setup
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The tools, software, and configurations that power my workflow. 
            Plus some custom wallpapers and color themes to share.
          </p>
        </motion.div>

        {/* Setup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SetupShowcase />
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-lg bg-muted"
        >
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Pro tip:</strong> Your environment shapes your output. 
            Invest in good tools, ergonomic setup, and a distraction-free workspace. 
            The wallpapers and themes here are free to download and use!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
