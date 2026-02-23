"use client";

import { motion } from "framer-motion";
import { Sparkles, BarChart3, TrendingUp, Eye, Clock, Globe, Users, Activity } from "lucide-react";
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Live Analytics</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Real-time insights into portfolio performance, visitor behavior, and engagement metrics.
          </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdvancedAnalyticsDashboard />
        </motion.div>
      </div>
    </div>
  );
}
