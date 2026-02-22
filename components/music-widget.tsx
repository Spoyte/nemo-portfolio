"use client";

import { motion } from "framer-motion";

interface MusicTrack {
  title: string;
  artist: string;
  duration: string;
  coverColor: string;
}

const CURRENT_TRACK: MusicTrack = {
  title: "Midnight City",
  artist: "M83",
  duration: "4:03",
  coverColor: "from-purple-500 to-pink-500",
};

const RECENT_TRACKS: MusicTrack[] = [
  { title: "Nightcall", artist: "Kavinsky", duration: "4:18", coverColor: "from-red-500 to-orange-500" },
  { title: "Instant Crush", artist: "Daft Punk", duration: "5:37", coverColor: "from-blue-500 to-cyan-500" },
  { title: "The Less I Know", artist: "Tame Impala", duration: "3:36", coverColor: "from-green-500 to-teal-500" },
];

export function MusicWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden lg:block"
    >
      <div className="glass-strong rounded-2xl p-4 shadow-xl">
        {/* Now Playing */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${CURRENT_TRACK.coverColor} flex items-center justify-center shadow-lg`}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Now Playing</p>
            <p className="font-semibold truncate">{CURRENT_TRACK.title}</p>
            <p className="text-sm text-muted-foreground truncate">{CURRENT_TRACK.artist}</p>
          </div>
          <div className="text-sm text-muted-foreground">{CURRENT_TRACK.duration}</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>2:38</span>
            <span>{CURRENT_TRACK.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5"/>
            </svg>
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          </motion.button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"/>
              <line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
          </button>
        </div>

        {/* Recent Tracks */}
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recently Played</p>
          <div className="space-y-2">
            {RECENT_TRACKS.map((track, index) => (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className={`w-8 h-8 rounded bg-gradient-to-br ${track.coverColor} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{track.title[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{track.duration}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
