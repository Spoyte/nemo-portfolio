"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Gamepad2, Terminal, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SecretPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex p-6 rounded-full bg-primary/10 mb-6"
            >
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎉 You Found the Secret!
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome to the hidden page. You unlocked this by entering the Konami code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Gamepad2 className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Gamer at Heart</h3>
                <p className="text-sm text-muted-foreground">
                  I love indie games and classic RPGs. Currently playing Hades II.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Terminal className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Terminal Lover</h3>
                <p className="text-sm text-muted-foreground">
                  Neovim + Tmux = ❤️ My development environment of choice.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Coffee Addict</h3>
                <p className="text-sm text-muted-foreground">
                  I drink way too much coffee. Pour-over is my method of choice.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Fun Fact</h3>
                <p className="text-sm text-muted-foreground">
                  This portfolio was built in a single day. Time well spent!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Easter egg found! You've earned the "Curious Explorer" achievement. 🏆
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
