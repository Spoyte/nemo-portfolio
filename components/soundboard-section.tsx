"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  Mic2,
  Disc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  color: string;
}

const tracks: Track[] = [
  { id: "1", title: "Coding Flow", artist: "Focus Beats", duration: 184, color: "from-blue-500 to-cyan-500" },
  { id: "2", title: "Deep Work", artist: "Ambient Sounds", duration: 245, color: "from-purple-500 to-pink-500" },
  { id: "3", title: "Creative Mode", artist: "Lo-Fi Studio", duration: 198, color: "from-orange-500 to-yellow-500" },
  { id: "4", title: "Debug Session", artist: "Chill Hop", duration: 212, color: "from-green-500 to-emerald-500" },
  { id: "5", title: "Late Night Code", artist: "Night Owl", duration: 267, color: "from-indigo-500 to-purple-500" },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SoundboardSection() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(false);

  const track = tracks[currentTrack];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            if (isRepeat) {
              return 0;
            }
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, track.duration, isRepeat]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (isShuffle) {
      setCurrentTrack(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }
    setProgress(0);
  }, [isShuffle]);

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handleSeek = (value: number[]) => {
    setProgress(value[0]);
  };

  return (
    <section className="py-24 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Focus Soundboard</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Curated Sounds for{" "}
            <span className="text-gradient-animated">Deep Focus</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hand-picked ambient tracks, lo-fi beats, and focus music to help you get in the zone. 
            Perfect for coding sessions.
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
            <Card className="p-8 relative overflow-hidden">
              {/* Background Animation */}
              <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-5`} />
              <AnimatePresence mode="wait">
                {isPlaying && (
                  <>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${track.color}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.02, 0.08, 0.02] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <{/* Visualizer Bars */}>
                    <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 px-8">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-2 bg-gradient-to-t ${track.color} rounded-t`}
                          animate={{
                            height: ["20%", `${Math.random() * 80 + 20}%`, "20%"],
                          }}
                          transition={{
                            duration: 0.5 + Math.random() * 0.5,
                            repeat: Infinity,
                            delay: i * 0.02,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </AnimatePresence>

              <div className="relative z-10">
                {/* Album Art */}
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-2xl`}
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                  >
                    <Disc className="w-16 h-16 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h3 
                      key={track.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold mb-1"
                    >
                      {track.title}
                    </motion.h3>
                    <motion.p 
                      key={track.artist}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground"
                    >
                      {track.artist}
                    </motion.p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(track.id)}
                        className={likedTracks.has(track.id) ? "text-red-500" : ""}
                      >
                        <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? "fill-current" : ""}`} />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {likedTracks.has(track.id) ? "Liked" : "Like this track"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <Slider
                    value={[progress]}
                    max={track.duration}
                    step={1}
                    onValueChange={handleSeek}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(track.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={isShuffle ? "text-primary" : ""}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={handlePrev}>
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    size="lg"
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${track.color}`}
                    onClick={handlePlayPause}
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
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={isRepeat ? "text-primary" : ""}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mt-6">
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
                      setIsMuted(v[0] === 0);
                    }}
                    className="flex-1"
                  />
                  
                  <span className="text-sm text-muted-foreground w-10">
                    {isMuted ? 0 : volume}%
                  </span>
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
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <ListMusic className="w-5 h-5" />
                  Playlist
                </h3>
                <span className="text-sm text-muted-foreground">
                  {tracks.length} tracks
                </span>
              </div>

              <div className="space-y-2">
                {tracks.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      currentTrack === index
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setCurrentTrack(index);
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                        {currentTrack === index && isPlaying ? (
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1 h-4 bg-white rounded-full"
                                animate={{ height: [4, 16, 4] }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${currentTrack === index ? "text-primary" : ""}`}>
                          {t.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{t.artist}</p>
                      </div>
                      
                      <span className="text-sm text-muted-foreground">
                        {formatTime(t.duration)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{likedTracks.size}</p>
                    <p className="text-sm text-muted-foreground">Liked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {formatTime(tracks.reduce((acc, t) => acc + t.duration, 0))}
                    </p>
                    <p className="text-sm text-muted-foreground">Total</p>
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
