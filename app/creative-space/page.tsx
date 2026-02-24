"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, Archive, Grid3X3 } from "lucide-react";
import { DigitalGarden } from "@/components/digital-garden";
import { TimeCapsuleFeature } from "@/components/time-capsule";
import { MoodBoard } from "@/components/mood-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreativeSpacePage() {
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Creative Space</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ideas & Inspiration
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of thoughts, goals, and visual inspiration. 
            My digital garden where ideas grow over time.
          </p>
        </motion.div>

        {/* Tabs for different creative spaces */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="garden" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="garden" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Digital Garden</span>
                <span className="sm:hidden">Garden</span>
              </TabsTrigger>
              <TabsTrigger value="capsule" className="gap-2">
                <Archive className="h-4 w-4" />
                <span className="hidden sm:inline">Time Capsule</span>
                <span className="sm:hidden">Capsule</span>
              </TabsTrigger>
              <TabsTrigger value="moodboard" className="gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Mood Board</span>
                <span className="sm:hidden">Mood</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="garden" className="mt-8">
              <DigitalGarden />
            </TabsContent>

            <TabsContent value="capsule" className="mt-8">
              <TimeCapsuleFeature />
            </TabsContent>

            <TabsContent value="moodboard" className="mt-8">
              <MoodBoard />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
