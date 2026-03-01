"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Music,
  Mic2,
  Disc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverColor: string;
}

const playlist: Track[] = [
  { id: "1", title: "Midnight Coding", artist: "Lo-Fi Beats", album: "Focus Flow", duration: 184, coverColor: "from-purple-500 to-pink-500" },
  { id: "2", title: "Deep Work", artist: "Chillhop", album: "Productivity", duration: 217, coverColor: "from-blue-500 to-cyan-500" },
  { id: "3", title: "Creative Flow", artist: "Ambient", album: "Inspiration", duration: 245, coverColor: "from-orange-500 to-red-500" },
  { id: "4", title: "Debug Mode", artist: "Synthwave", album: "Night Drive", duration: 198, coverColor: "from-emerald-500 to-teal-500" },
  { id: "5", title: "Ship It", artist: "Electronic", album: "Release Day", duration: 203, coverColor: "from-amber-500 to-yellow-500" },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function FloatingMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const track = playlist[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= track.duration) {
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
  }, [isPlaying, track.duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setProgress(0);
    if (isShuffled) {
      setCurrentTrack(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (progress > 5) {
      setProgress(0);
    } else {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const handleSeek = (value: number[]) => {
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-3 flex items-center gap-3">
            {/* Animated Album Art */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${track.coverColor} flex items-center justify-center`}
            >
              <Disc className="w-6 h-6 text-white" />
            </motion.div>
            
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Mini Visualizer */}
            <div className="flex items-end gap-0.5 h-6 ml-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? {
                    height: [4, 16, 8, 20, 4],
                  } : { height: 4 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  className="w-1 bg-primary rounded-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Card className="w-80 shadow-2xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                <span className="font-semibold">Now Playing</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Minimize
              </Button>
            </div>

            {/* Album Art */}
            <div className="relative p-6">
              <motion.div
                animate={{ 
                  rotate: isPlaying ? 360 : 0,
                  scale: isPlaying ? 1 : 0.95,
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.3 }
                }}
                className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${track.coverColor} flex items-center justify-center shadow-2xl`}
              >
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              </motion.div>

              {/* Floating Notes Animation */}
              {isPlaying && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0, x: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: -50,
                        x: (i - 1) * 30,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut",
                      }}
                      className="absolute top-1/2 left-1/2"
                    >
                      <Music className="w-4 h-4 text-primary" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Track Info */}
            <div className="px-6 text-center">
              <h3 className="font-bold text-lg truncate">{track.title}</h3>
              <p className="text-muted-foreground truncate">{track.artist} • {track.album}</p>
            </div>

            {/* Progress */}
            <div className="px-6 py-4">
              <Slider
                value={[progress]}
                max={track.duration}
                step={1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isShuffled ? "text-primary" : ""}
                  onClick={() => setIsShuffled(!isShuffled)}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon" onClick={handlePrev}>
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>

                <Button variant="ghost" size="icon" onClick={handleNext}>
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={repeatMode > 0 ? "text-primary" : ""}
                  onClick={() => setRepeatMode((prev) => (prev + 1) % 3)}
                >
                  <Repeat className="w-4 h-4" />
                  {repeatMode === 2 && <span className="absolute text-[8px] font-bold">1</span>}
                </Button>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="px-6 pb-6 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={isLiked ? "text-red-500" : ""}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>

              <Button variant="ghost" size="icon">
                <ListMusic className="w-5 h-5" />
              </Button>
            </div>

            {/* Playlist Preview */}
            <div className="border-t px-4 py-3 max-h-32 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">Up Next</p>
              {playlist.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setCurrentTrack(i);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    i === currentTrack ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className={`w-8 h-8 rounded bg-gradient-to-br ${t.coverColor} flex items-center justify-center text-white text-xs font-bold`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${i === currentTrack ? "font-medium text-primary" : ""}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{t.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTime(t.duration)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
