"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Music,
  Heart,
  ListMusic,
  Shuffle,
  Repeat,
  Disc
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
  color: string;
}

const PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    duration: 243,
    cover: "🌃",
    color: "#8b5cf6",
  },
  {
    id: "2",
    title: "Nightcall",
    artist: "Kavinsky",
    duration: 258,
    cover: "🌙",
    color: "#3b82f6",
  },
  {
    id: "3",
    title: "Instant Crush",
    artist: "Daft Punk",
    duration: 337,
    cover: "🤖",
    color: "#ef4444",
  },
  {
    id: "4",
    title: "The Less I Know",
    artist: "Tame Impala",
    duration: 216,
    cover: "🌅",
    color: "#f59e0b",
  },
  {
    id: "5",
    title: "Midnight",
    artist: "Coldplay",
    duration: 294,
    cover: "⭐",
    color: "#10b981",
  },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffled) {
      setCurrentTrackIndex(Math.floor(Math.random() * PLAYLIST.length));
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }
    setProgress(0);
  };

  const handlePrev = () => {
    if (progress > 5) {
      setProgress(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
      setProgress(0);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <>
      {/* Floating Mini Player */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-20 z-40 p-3 rounded-full bg-card border shadow-lg hover:shadow-xl transition-shadow"
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: `${currentTrack.color}30` }}
          >
            {currentTrack.cover}
          </div>
        </motion.div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Full Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed bottom-36 right-6 z-50 w-full max-w-md"
            >
              <Card className="overflow-hidden shadow-2xl"
              >
                <CardContent className="p-0">
                  {/* Album Art / Visualizer */}
                  <div 
                    className="relative h-64 flex items-center justify-center"
                    style={{ backgroundColor: `${currentTrack.color}20` }}
                  >
                    <motion.div
                      animate={{ 
                        scale: isPlaying ? [1, 1.05, 1] : 1,
                        rotate: isPlaying ? [0, 2, -2, 0] : 0 
                      }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="text-8xl"
                    >
                      {currentTrack.cover}
                    </motion.div>

                    {/* Visualizer bars */}
                    {isPlaying && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              height: [10, Math.random() * 40 + 10, 10] 
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5 + Math.random() * 0.5,
                              delay: i * 0.05,
                            }}
                            className="w-1 rounded-full"
                            style={{ backgroundColor: currentTrack.color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <motion.h3 
                          key={currentTrack.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xl font-bold"
                        >
                          {currentTrack.title}
                        </motion.h3>
                        <motion.p 
                          key={currentTrack.artist}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-muted-foreground"
                        >
                          {currentTrack.artist}
                        </motion.p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                        className={isLiked ? "text-red-500" : ""}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <Slider
                        value={[progress]}
                        max={currentTrack.duration}
                        step={1}
                        onValueChange={([value]) => setProgress(value)}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(currentTrack.duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsShuffled(!isShuffled)}
                        className={isShuffled ? "text-primary" : ""}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={handlePrev}>
                        <SkipBack className="h-6 w-6" />
                      </Button>

                      <Button 
                        size="icon" 
                        className="h-14 w-14 rounded-full"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>

                      <Button variant="ghost" size="icon" onClick={handleNext}>
                        <SkipForward className="h-6 w-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRepeatMode((prev) => (prev + 1) % 3)}
                        className={repeatMode > 0 ? "text-primary" : ""}
                      >
                        <Repeat className="h-4 w-4" />
                        {repeatMode === 2 && (
                          <span className="absolute text-[8px] font-bold">1</span>
                        )}
                      </Button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={([value]) => setVolume(value)}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground w-8">{volume}%</span>
                    </div>

                    {/* Playlist Toggle */}
                    <Button
                      variant="ghost"
                      className="w-full mt-4"
                      onClick={() => setShowPlaylist(!showPlaylist)}
                    >
                      <ListMusic className="h-4 w-4 mr-2" />
                      {showPlaylist ? "Hide" : "Show"} Playlist
                    </Button>

                    {/* Playlist */}
                    <AnimatePresence>
                      {showPlaylist && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t mt-4 space-y-2">
                            {PLAYLIST.map((track, index) => (
                              <button
                                key={track.id}
                                onClick={() => handleTrackSelect(index)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                  index === currentTrackIndex 
                                    ? "bg-primary/10" 
                                    : "hover:bg-muted"
                                }`}
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                  style={{ backgroundColor: `${track.color}30` }}
                                >
                                  {track.cover}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className={`font-medium ${index === currentTrackIndex ? "text-primary" : ""}`}>
                                    {track.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(track.duration)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
