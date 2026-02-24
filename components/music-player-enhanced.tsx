"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  ListMusic,
  Shuffle,
  Repeat,
  Disc
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  color: string;
}

const PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 243,
    cover: "🌃",
    color: "from-purple-500 to-blue-500",
  },
  {
    id: "2",
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    duration: 258,
    cover: "🌙",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "3",
    title: "Get Lucky",
    artist: "Daft Punk",
    album: "Random Access Memories",
    duration: 248,
    cover: "⭐",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "4",
    title: "Instant Crush",
    artist: "Daft Punk ft. Julian Casablancas",
    album: "Random Access Memories",
    duration: 337,
    cover: "💫",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "5",
    title: "The Less I Know The Better",
    artist: "Tame Impala",
    album: "Currents",
    duration: 216,
    cover: "🎸",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "6",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    album: "AM",
    duration: 272,
    cover: "🌑",
    color: "from-slate-500 to-gray-500",
  },
  {
    id: "7",
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: 230,
    cover: "✨",
    color: "from-red-600 to-pink-600",
  },
  {
    id: "8",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: 238,
    cover: "🌊",
    color: "from-teal-500 to-emerald-500",
  },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayerEnhanced() {
  const [currentTrack, setCurrentTrack] = useState<Track>(PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "all" | "one">("none");
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
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
    const currentIndex = PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    let nextIndex: number;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * PLAYLIST.length);
    } else {
      nextIndex = (currentIndex + 1) % PLAYLIST.length;
    }
    
    setCurrentTrack(PLAYLIST[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? PLAYLIST.length - 1 : currentIndex - 1;
    setCurrentTrack(PLAYLIST[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
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

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Card className="w-80 shadow-2xl border-primary/20">
          <CardContent className="p-4">
            {/* Now Playing */}
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={`w-16 h-16 rounded-lg bg-gradient-to-br ${currentTrack.color} flex items-center justify-center text-3xl shadow-lg`}
              >
                {currentTrack.cover}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h4 
                  key={currentTrack.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-semibold truncate"
                >
                  {currentTrack.title}
                </motion.h4>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => toggleLike(currentTrack.id)}
              >
                <Heart 
                  className={`h-5 w-5 ${likedTracks.has(currentTrack.id) ? "fill-red-500 text-red-500" : ""}`} 
                />
              </Button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={currentTrack.duration}
                step={1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${isShuffle ? "text-primary" : ""}`}
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handlePrev}>
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleNext}>
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${repeatMode !== "none" ? "text-primary" : ""}`}
                onClick={() => {
                  const modes: ("none" | "all" | "one")[] = ["none", "all", "one"];
                  const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
                  setRepeatMode(modes[nextIndex]);
                }}
              >
                <Repeat className="h-4 w-4" />
                {repeatMode === "one" && <span className="absolute text-[8px] font-bold">1</span>}
              </Button>
            </div>

            {/* Volume & Playlist Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(v) => {
                  setVolume(v[0]);
                  setIsMuted(false);
                }}
                className="flex-1"
              />
              
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${showPlaylist ? "text-primary" : ""}`}
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                <ListMusic className="h-4 w-4" />
              </Button>
            </div>

            {/* Playlist */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ScrollArea className="h-48 mt-4 -mx-4 px-4">
                    <div className="space-y-1">
                      {PLAYLIST.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            currentTrack.id === track.id 
                              ? "bg-primary/10" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="w-8 h-8 rounded bg-gradient-to-br flex items-center justify-center text-sm"
                            style={{ 
                              background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` 
                            }}
                          >
                            {track.cover}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              currentTrack.id === track.id ? "text-primary" : ""
                            }`}>
                              {track.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {track.artist}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(track.duration)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
