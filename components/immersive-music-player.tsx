"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  ListMusic,
  Mic2,
  Disc
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

const MOCK_TRACKS: Track[] = [
  { id: "1", title: "Midnight Coding", artist: "Synthwave Boy", duration: 234, cover: "🌙", color: "#6366f1" },
  { id: "2", title: "Neon Dreams", artist: "Cyber Punk", duration: 198, cover: "✨", color: "#ec4899" },
  { id: "3", title: "Focus Flow", artist: "Lo-Fi Beats", duration: 267, cover: "🎵", color: "#10b981" },
  { id: "4", title: "Deep Work", artist: "Ambient Mind", duration: 312, cover: "🧠", color: "#f59e0b" },
  { id: "5", title: "Creative Mode", artist: "Inspiration", duration: 245, cover: "🎨", color: "#8b5cf6" },
];

export function ImmersiveMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const track = MOCK_TRACKS[currentTrack];

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration]);

  // Visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 64;
    const data = new Array(bars).fill(0);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update data
      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          data[i] = Math.max(0, data[i] + (Math.random() - 0.5) * 30);
          data[i] = Math.min(100, Math.max(5, data[i]));
        } else {
          data[i] = data[i] * 0.95;
        }
      }

      // Draw bars
      const barWidth = canvas.width / bars;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, track.color);
      gradient.addColorStop(1, `${track.color}80`);

      for (let i = 0; i < bars; i++) {
        const barHeight = (data[i] / 100) * canvas.height * 0.8;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      setVisualizerData([...data]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, track.color]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % MOCK_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);
    setProgress(0);
  };

  return (
    <section className="py-24 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Disc className="h-4 w-4 animate-spin-slow" />
            <span className="text-sm font-medium">Now Playing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Coding <span className="text-gradient-animated">Soundtrack</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The music that fuels my creative flow. Curated tracks for deep focus and inspiration.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              {/* Visualizer */}
              <div className="relative h-48 bg-gradient-to-b from-muted to-background">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={200}
                  className="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              <div className="p-6">
                {/* Track Info */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                    style={{ backgroundColor: track.color }}
                    animate={{ 
                      scale: isPlaying ? [1, 1.05, 1] : 1,
                      rotate: isPlaying ? [0, 2, -2, 0] : 0
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {track.cover}
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h3 
                      key={track.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xl font-bold"
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
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={showPlaylist ? "text-primary" : ""}
                  >
                    <ListMusic className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <Slider
                    value={[progress]}
                    max={track.duration}
                    step={1}
                    onValueChange={([value]) => setProgress(value)}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(track.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    
                    <Button variant="ghost" size="icon" onClick={handlePrev}>
                      <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                      size="lg"
                      className="rounded-full w-14 h-14"
                      onClick={() => setIsPlaying(!isPlaying)}
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

                    <Button variant="ghost" size="icon">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                    >
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
                      onValueChange={([value]) => {
                        setVolume(value);
                        setIsMuted(value === 0);
                      }}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              {/* Playlist */}
              <AnimatePresence>
                {showPlaylist && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="p-4 space-y-2">
                      {MOCK_TRACKS.map((t, index) => (
                        <motion.button
                          key={t.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setCurrentTrack(index);
                            setProgress(0);
                            setIsPlaying(true);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                            index === currentTrack 
                              ? "bg-primary/10" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: t.color }}
                          >
                            {t.cover}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${index === currentTrack ? "text-primary" : ""}`}>
                              {t.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{t.artist}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(t.duration)}
                          </span>
                          {index === currentTrack && isPlaying && (
                            <div className="flex gap-0.5">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-primary rounded-full"
                                  animate={{ height: [8, 16, 8] }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 0.5, 
                                    delay: i * 0.1 
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
