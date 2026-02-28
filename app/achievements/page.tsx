"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AchievementSystem } from "@/components/achievement-system-portfolio";

export default function AchievementsPage() {
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
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Achievements</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Unlock <span className="text-gradient-animated">Rewards</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the portfolio and unlock achievements. Each interaction brings 
            you closer to becoming a true explorer.
          </p>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              icon: Target,
              title: "Explore",
              description: "Visit different pages to unlock achievements",
            },
            {
              icon: Zap,
              title: "Interact",
              description: "Try the command palette, themes, and easter eggs",
            },
            {
              icon: Sparkles,
              title: "Discover",
              description: "Find secret codes and hidden features",
            },
          ].map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 rounded-2xl bg-muted/50 text-center"
            >
              <tip.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AchievementSystem />
        </motion.div>

        {/* Secret Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Try typing "matrix", "party", or "unicorn" anywhere on the site
          </p>
        </motion.div>
      </div>
    </div>
  );
}
