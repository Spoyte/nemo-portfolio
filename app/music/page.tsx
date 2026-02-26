"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  Heart,
  Shuffle,
  Repeat,
  ListMusic,
  Mic2,
  Disc,
  Radio,
  Headphones,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simulated playlist data
const playlists = [
  {
    id: "coding",
    name: "Coding Focus",
    description: "Deep focus music for productive coding sessions",
    cover: "💻",
    color: "from-blue-500 to-cyan-500",
    tracks: [
      { id: 1, title: "Neon Dreams", artist: "Synthwave Boy", duration: 245, genre: "Synthwave" },
      { id: 2, title: "Binary Sunset", artist: "Code Walker", duration: 198, genre: "Ambient" },
      { id: 3, title: "Algorithm", artist: "The Developers", duration: 312, genre: "Electronic" },
      { id: 4, title: "Deep Focus", artist: "Mindful Coding", duration: 420, genre: "Ambient" },
      { id: 5, title: "Terminal Velocity", artist: "Root Access", duration: 267, genre: "Techno" },
    ],
  },
  {
    id: "chill",
    name: "Chill Vibes",
    description: "Relaxing tunes for unwinding after a long day",
    cover: "🌊",
    color: "from-teal-500 to-emerald-500",
    tracks: [
      { id: 6, title: "Ocean Breeze", artist: "Coastal Dreams", duration: 284, genre: "Lo-Fi" },
      { id: 7, title: "Coffee Shop", artist: "Morning Brew", duration: 195, genre: "Jazz" },
      { id: 8, title: "Rainy Day", artist: "Cloudy Skies", duration: 234, genre: "Lo-Fi" },
      { id: 9, title: "Sunset Drive", artist: "Golden Hour", duration: 278, genre: "Chillwave" },
      { id: 10, title: "Stargazing", artist: "Night Owl", duration: 356, genre: "Ambient" },
    ],
  },
  {
    id: "workout",
    name: "Workout Energy",
    description: "High-energy tracks to keep you moving",
    cover: "⚡",
    color: "from-orange-500 to-red-500",
    tracks: [
      { id: 11, title: "Power Up", artist: "Energy Boost", duration: 189, genre: "EDM" },
      { id: 12, title: "Sprint Mode", artist: "Fast Lane", duration: 156, genre: "House" },
      { id: 13, title: "Adrenaline", artist: "Rush Hour", duration: 201, genre: "Drum & Bass" },
      { id: 14, title: "Beast Mode", artist: "Iron Will", duration: 234, genre: "Rock" },
      { id: 15, title: "Finish Line", artist: "Victory Lap", duration: 178, genre: "Pop" },
    ],
  },
  {
    id: "retro",
    name: "Retro Gaming",
    description: "8-bit and 16-bit inspired chiptune music",
    cover: "🎮",
    color: "from-purple-500 to-pink-500",
    tracks: [
      { id: 16, title: "Pixel Adventure", artist: "8-Bit Hero", duration: 145, genre: "Chiptune" },
      { id: 17, title: "Boss Battle", artist: "Game Over", duration: 198, genre: "Chiptune" },
      { id: 18, title: "Level Complete", artist: "High Score", duration: 67, genre: "Chiptune" },
      { id: 19, title: "Secret Level", artist: "Cheat Code", duration: 234, genre: "Chiptune" },
      { id: 20, title: "Continue?", artist: "Insert Coin", duration: 189, genre: "Chiptune" },
    ],
  },
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Visualizer component
function AudioVisualizer({ isPlaying, color }: { isPlaying: boolean; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;

    const bars = 64;
    const barWidth = canvas.width / bars;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        for (let i = 0; i < bars; i++) {
          const height = Math.random() * canvas.height * 0.8;
          const x = i * barWidth;
          const y = (canvas.height - height) / 2;

          const gradient = ctx.createLinearGradient(0, y, 0, y + height);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, height);
        }
      } else {
        // Static line when paused
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="w-full h-24 rounded-lg"
    />
  );
}

export default function MusicPage() {
  const [currentPlaylist, setCurrentPlaylist] = useState(playlists[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState("playlists");

  const currentTrack = currentPlaylist.tracks[currentTrackIndex];
  const progressPercent = (progress / currentTrack.duration) * 100;

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= currentTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) =
        prev >= currentPlaylist.tracks.length - 1 ? 0 : prev + 1
      );
    }
    setProgress(0);
  };

  const handlePrevious = () => {
    if (progress > 5) {
      setProgress(0);
    } else {
      setCurrentTrackIndex((prev) =
        prev <= 0 ? currentPlaylist.tracks.length - 1 : prev - 1
      );
      setProgress(0);
    }
  };

  const handleSeek = (value: number[]) => {
    setProgress(Math.floor((value[0] / 100) * currentTrack.duration));
  };

  const toggleLike = (trackId: number) => {
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

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Music Player</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Music</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A curated collection of playlists for coding, relaxing, and everything in between.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Now Playing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {/* Album Art */}
                <motion.div
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${currentPlaylist.color} flex items-center justify-center text-6xl mb-6 relative overflow-hidden`}
                  animate={{ 
                    scale: isPlaying ? [1, 1.02, 1] : 1,
                    rotate: isPlaying ? [0, 2, -2, 0] : 0
                  }}
                  transition={{ 
                    repeat: isPlaying ? Infinity : 0, 
                    duration: 4 
                  }}
                >
                  <span className="relative z-10">{currentPlaylist.cover}</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ 
                      opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.3 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2 
                    }}
                  />
                </motion.div>

                {/* Track Info */}
                <div className="text-center mb-6">
                  <motion.h3 
                    key={currentTrack.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold mb-1"
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
                  <Badge variant="secondary" className="mt-2">
                    {currentTrack.genre}
                  </Badge>
                </div>

                {/* Visualizer */}
                <div className="mb-6">
                  <AudioVisualizer 
                    isPlaying={isPlaying} 
                    color={currentPlaylist.color.includes("blue") ? "#3b82f6" : 
                           currentPlaylist.color.includes("teal") ? "#14b8a6" :
                           currentPlaylist.color.includes("orange") ? "#f97316" : "#a855f7"} 
                  />
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <Slider
                    value={[progressPercent]}
                    onValueChange={handleSeek}
                    max={100}
                    step={1}
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
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={isShuffle ? "text-primary" : ""}
                  >
                    <Shuffle className="h-5 w-5" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={handlePrevious}>
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button 
                    size="icon" 
                    className="h-14 w-14"
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
                    onClick={() => setRepeatMode(
                      repeatMode === "none" ? "all" : repeatMode === "all" ? "one" : "none"
                    )}
                    className={repeatMode !== "none" ? "text-primary" : ""}
                  >
                    <Repeat className="h-5 w-5" />
                    {repeatMode === "one" && (
                      <span className="absolute text-[10px] font-bold">1</span>
                    )}
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={(v) => {
                      setVolume(v[0]);
                      setIsMuted(v[0] === 0);
                    }}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {isMuted ? 0 : volume}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Playlists & Queue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="playlists">
                  <ListMusic className="h-4 w-4 mr-2" />
                  Playlists
                </TabsTrigger>
                <TabsTrigger value="queue">
                  <Disc className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
                <TabsTrigger value="lyrics">
                  <Mic2 className="h-4 w-4 mr-2" />
                  Lyrics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="playlists" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => {
                        setCurrentPlaylist(playlist);
                        setCurrentTrackIndex(0);
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                    >
                      <Card className={`overflow-hidden transition-all ${
                        currentPlaylist.id === playlist.id ? "ring-2 ring-primary" : ""
                      }`}>
                        <div className={`h-32 bg-gradient-to-br ${playlist.color} flex items-center justify-center text-5xl`}>
                          {playlist.cover}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{playlist.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {playlist.tracks.length} tracks
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(playlist.tracks.reduce((acc, t) => acc + t.duration, 0))}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="queue" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListMusic className="h-5 w-5" />
                      {currentPlaylist.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {currentPlaylist.tracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                            index === currentTrackIndex ? "bg-primary/5" : ""
                          }`}
                          onClick={() => selectTrack(index)}
                        >
                          <div className="w-8 text-center text-sm text-muted-foreground">
                            {index === currentTrackIndex && isPlaying ? (
                              <div className="flex items-end justify-center gap-0.5 h-4">
                                {[1, 2, 3].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 bg-primary rounded-full"
                                    animate={{ height: [4, 16, 4] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 0.5,
                                      delay: i * 0.1,
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              index === currentTrackIndex ? "text-primary" : ""
                            }`}>
                              {track.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {track.artist}
                            </p>
                          </div>

                          <Badge variant="secondary" className="hidden sm:inline-flex">
                            {track.genre}
                          </Badge>

                          <span className="text-sm text-muted-foreground">
                            {formatTime(track.duration)}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track.id);
                            }}
                          >
                            <Heart 
                              className={`h-4 w-4 ${
                                likedTracks.has(track.id) ? "fill-red-500 text-red-500" : ""
                              }`} 
                            />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lyrics" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Headphones className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Lyrics Mode</h3>
                    <p className="text-muted-foreground mb-6">
                      Sing along to your favorite tracks
                    </p>

                    <div className="max-w-md mx-auto space-y-4 text-lg">
                      <motion.p
                        animate={{ 
                          opacity: isPlaying ? [0.5, 1, 0.5] : 0.5,
                          scale: isPlaying ? [0.98, 1, 0.98] : 1
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-muted-foreground"
                      >
                        🎵 Instrumental intro... 🎵
                      </motion.p>

                      <motion.div
                        animate={{ 
                          opacity: isPlaying ? 1 : 0.5 
                        }}
                        className="space-y-2"
                      >
                        <p>{currentTrack.title} 🎶</p>
                        <p className="text-primary font-semibold">By {currentTrack.artist}</p>
                        <p className="text-sm text-muted-foreground">
                          [{currentTrack.genre} | {formatTime(currentTrack.duration)}]
                        </p>
                      </motion.div>

                      <p className="text-sm text-muted-foreground mt-8">
                        * This is a demo player with simulated tracks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Tracks", value: playlists.reduce((acc, p) => acc + p.tracks.length, 0), icon: ListMusic },
            { label: "Playlists", value: playlists.length, icon: Disc },
            { label: "Hours of Music", value: "12+", icon: Radio },
            { label: "Liked Songs", value: likedTracks.size, icon: Heart },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
