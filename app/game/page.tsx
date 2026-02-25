"use client";

import { motion } from "framer-motion";
import { Gamepad2, Trophy, Zap, RotateCcw } from "lucide-react";
import { SnakeGame } from "@/components/snake-game";
import { TypingRace } from "@/components/typing-race";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GamePage() {
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
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Arcade</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Games</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a break and play some classic games. Challenge yourself or compete for high scores!
          </p>
        </motion.div>

        {/* Games Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="snake" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="snake" className="gap-2">
                <span className="text-lg">🐍</span>
                Snake
              </TabsTrigger>
              <TabsTrigger value="typing" className="gap-2">
                <span className="text-lg">⌨️</span>
                Typing Race
              </TabsTrigger>
            </TabsList>

            <TabsContent value="snake" className="mt-8">
              <SnakeGame />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center">
                <h3 className="font-semibold mb-2">How to Play</h3>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded">↑↓←→</span>
                    <span>Arrow keys to move</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded">WASD</span>
                    <span>Alternative controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded">Space</span>
                    <span>Pause game</span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="typing" className="mt-8">
              <TypingRace />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center">
                <h3 className="font-semibold mb-2">How to Play</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Type the displayed text as fast and accurately as you can. 
                  Your WPM (words per minute) and accuracy are calculated in real-time.
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Trophy,
              title: "High Scores",
              description: "Your best scores are saved locally and persist between sessions.",
            },
            {
              icon: Zap,
              title: "Speed Challenge",
              description: "Games get progressively harder. How long can you last?",
            },
            {
              icon: RotateCcw,
              title: "Quick Restart",
              description: "Press any key or click the restart button to play again instantly.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-xl border bg-card text-center"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
