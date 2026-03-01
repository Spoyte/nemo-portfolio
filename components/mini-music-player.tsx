"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  SkipForward,
  SkipBack,
  Heart,
  ListMusic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  color: string;
}

const SAMPLE_TRACKS: Track[] = [
  { id: "1", title: "Coding Focus", artist: "Deep Work", duration: 180, color: "#dc2626" },
  { id: "2", title: "Creative Flow", artist: "Inspiration", duration: 240, color: "#ea580c" },
  { id: "3", title: "Late Night", artist: "Midnight", duration: 200, color: "#7c3aed" },
  { id: "4", title: "Morning Coffee", artist: "Sunrise", duration: 160, color: "#0891b2" },
];

export function MiniMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const progressRef = useRef<NodeJS.Timeout>();

  const track = SAMPLE_TRACKS[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(progressRef.current);
    }

    return () => clearInterval(progressRef.current);
  }, [isPlaying, track.duration]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % SAMPLE_TRACKS.length);
    setProgress(0);
    setIsLiked(false);
  };
  
  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + SAMPLE_TRACKS.length) % SAMPLE_TRACKS.length);
    setProgress(0);
    setIsLiked(false);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (progress / track.duration) * 100;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-full left-0 mb-2 w-80 glass-strong rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: track.color }}
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ♪
              </motion.div>
              <div className="flex-1">
                <p className="font-semibold truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-4">
              <Slider
                value={[progressPercent]}
                max={100}
                step={1}
                onValueChange={([v]) => setProgress((v / 100) * track.duration)}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                className="h-12 w-12"
                onClick={handlePlayPause}
                style={{ backgroundColor: track.color }}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={([v]) => {
                  setVolume(v);
                  setIsMuted(v === 0);
                }}
                className="flex-1"
              />
            </div>

            {/* Playlist */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <ListMusic className="w-4 h-4" />
                Playlist
              </p>
              <div className="space-y-1">
                {SAMPLE_TRACKS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTrack(i);
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                      i === currentTrack 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {t.title} - {t.artist}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Player */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-strong rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: track.color }}
          animate={{ 
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5, repeat: Infinity }
          }}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium">{track.title}</p>
          <p className="text-xs text-muted-foreground">{track.artist}</p>
        </div>
      </motion.button>
    </motion.div>
  );
}
