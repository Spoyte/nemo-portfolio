"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, Terminal } from "lucide-react";
import { CodeSnippetsLibrary } from "@/components/code-snippets";

export default function SnippetsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Developer Resources</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Code Snippets</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of useful code snippets, utilities, and patterns I use regularly. 
            Feel free to copy and use them in your projects.
          </p>
        </motion.div>

        {/* Snippets Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CodeSnippetsLibrary />
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              More snippets coming soon. Have a suggestion?{" "}
              <a href="/contact" className="text-primary hover:underline">Let me know</a>.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
