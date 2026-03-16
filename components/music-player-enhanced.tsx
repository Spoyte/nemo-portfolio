"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  ListMusic,
  Disc,
  Mic2,
  Share2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  color: string;
}

const tracks: Track[] = [
  { id: "1", title: "Coding Focus", artist: "Lo-Fi Beats", album: "Dev Vibes", duration: 184, color: "from-purple-500 to-pink-500" },
  { id: "2", title: "Deep Work", artist: "Ambient Sounds", album: "Flow State", duration: 245, color: "from-blue-500 to-cyan-500" },
  { id: "3", title: "Creative Mode", artist: "Synthwave", album: "Neon Dreams", duration: 198, color: "from-orange-500 to-red-500" },
  { id: "4", title: "Bug Hunt", artist: "Electronic", album: "Debug Sessions", duration: 156, color: "from-green-500 to-emerald-500" },
  { id: "5", title: "Deploy Day", artist: "Upbeat", album: "Release Party", duration: 201, color: "from-yellow-500 to-amber-500" },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayerEnhanced() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "all" | "one">("none");
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentTrack = tracks[currentTrackIndex];
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    if (isShuffled) {
      setCurrentTrackIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setCurrentTime(0);
    setIsLiked(false);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
    setIsLiked(false);
  };
  
  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  // Visualizer bars
  const bars = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Disc className="h-4 w-4 animate-spin-slow" />
            <span className="text-sm font-medium">Music Player</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dev{" "}
            <span className="text-gradient-animated">Soundtrack</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated playlists for coding, focusing, and creative flow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-gradient-to-br from-card to-muted/50 overflow-hidden relative">
              {/* Background Glow */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 bg-gradient-to-br",
                  currentTrack.color
                )}
              />

              <div className="relative z-10">
                {/* Album Art */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <motion.div
                    animate={{ 
                      rotate: isPlaying ? 360 : 0,
                      scale: isPlaying ? 1 : 0.95
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 0.3 }
                    }}
                    className={cn(
                      "w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl bg-gradient-to-br flex items-center justify-center",
                      currentTrack.color
                    )}
                  >
                    <Disc className="w-24 h-24 md:w-32 md:h-32 text-white/80" />
                  </motion.div>

                  <div className="flex-1 text-center md:text-left">
                    <motion.h3
                      key={currentTrack.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl md:text-3xl font-bold mb-2"
                    >
                      {currentTrack.title}
                    </motion.h3>
                    <motion.p
                      key={currentTrack.artist}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg text-muted-foreground mb-1"
                    >
                      {currentTrack.artist}
                    </motion.p>
                    <motion.p
                      key={currentTrack.album}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-muted-foreground"
                    >
                      {currentTrack.album}
                    </motion.p>

                    {/* Visualizer */}
                    <div className="flex items-end justify-center md:justify-start gap-1 h-16 mt-6">
                      {bars.map((i) => (
                        <motion.div
                          key={i}
                          animate={
                            isPlaying
                              ? {
                                  height: [10, Math.random() * 40 + 10, 10],
                                }
                              : { height: 4 }
                          }
                          transition={
                            isPlaying
                              ? {
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.05,
                                }
                              : {}
                          }
                          className={cn(
                            "w-2 rounded-full bg-gradient-to-t",
                            currentTrack.color
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={currentTrack.duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={cn(isShuffled && "text-primary")}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={handlePrev}>
                    <SkipBack className="w-6 h-6" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handlePlayPause}
                    className={cn(
                      "w-16 h-16 rounded-full bg-gradient-to-br shadow-lg",
                      currentTrack.color
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>

                  <Button variant="ghost" size="icon" onClick={handleNext}>
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setRepeatMode((prev) =>
                        prev === "none" ? "all" : prev === "all" ? "one" : "none"
                      )
                    }
                    className={cn(repeatMode !== "none" && "text-primary")}
                  >
                    <Repeat className="w-5 h-5" />
                    {repeatMode === "one" && (
                      <span className="absolute text-[8px] font-bold">1</span>
                    )}
                  </Button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={100}
                      step={1}
                      onValueChange={(v) => {
                        setVolume(v[0]);
                        setIsMuted(false);
                      }}
                      className="w-24"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsLiked(!isLiked)}
                      className={cn(isLiked && "text-red-500")}
                    >
                      <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      className={cn(showPlaylist && "text-primary")}
                    >
                      <ListMusic className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Playlist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ListMusic className="w-5 h-5" />
                  Playlist
                </h3>
                <span className="text-sm text-muted-foreground">
                  {tracks.length} tracks
                </span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {tracks.map((track, index) => (
                    <motion.button
                      key={track.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setCurrentTrackIndex(index);
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left",
                        currentTrackIndex === index
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold",
                          track.color
                        )}
                      >
                        {currentTrackIndex === index && isPlaying ? (
                          <div className="flex gap-0.5">
                            <span className="w-1 h-4 bg-white animate-pulse" />
                            <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.1s" }} />
                            <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          currentTrackIndex === index && "text-primary"
                        )}>
                          {track.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {formatTime(track.duration)}
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              {/* Mini Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">{tracks.length}</p>
                    <p className="text-xs text-muted-foreground">Tracks</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">
                      {formatTime(tracks.reduce((acc, t) => acc + t.duration, 0))}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
