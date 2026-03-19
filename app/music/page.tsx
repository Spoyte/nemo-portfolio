"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
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
  Download,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  genre: string;
  year: number;
  liked: boolean;
}

const tracks: Track[] = [
  {
    id: "1",
    title: "Midnight Coding",
    artist: "Lo-Fi Dreams",
    album: "Developer Vibes",
    duration: 184,
    cover: "🌙",
    genre: "Lo-Fi",
    year: 2024,
    liked: true
  },
  {
    id: "2",
    title: "Syntax Error",
    artist: "The Algorithms",
    album: "Debug Mode",
    duration: 226,
    cover: "🐛",
    genre: "Electronic",
    year: 2024,
    liked: false
  },
  {
    id: "3",
    title: "Git Push Origin",
    artist: "Terminal Beats",
    album: "Command Line",
    duration: 198,
    cover: "📤",
    genre: "Techno",
    year: 2023,
    liked: true
  },
  {
    id: "4",
    title: "Refactoring Jazz",
    artist: "Clean Code Trio",
    album: "Legacy",
    duration: 312,
    cover: "🎷",
    genre: "Jazz",
    year: 2023,
    liked: false
  },
  {
    id: "5",
    title: "CSS Grid Groove",
    artist: "Flexbox Collective",
    album: "Layout Sessions",
    duration: 245,
    cover: "📐",
    genre: "Funk",
    year: 2024,
    liked: true
  },
  {
    id: "6",
    title: "Async Await",
    artist: "Promise Keepers",
    album: "Non-Blocking",
    duration: 267,
    cover: "⏳",
    genre: "Ambient",
    year: 2023,
    liked: false
  },
  {
    id: "7",
    title: "Memory Leak",
    artist: "Garbage Collectors",
    album: "Heap Space",
    duration: 189,
    cover: "🗑️",
    genre: "Industrial",
    year: 2024,
    liked: false
  },
  {
    id: "8",
    title: "Hello World",
    artist: "First Commit",
    album: "Initialization",
    duration: 156,
    cover: "👋",
    genre: "Pop",
    year: 2023,
    liked: true
  }
];

const playlists = [
  { id: "1", name: "Deep Focus", tracks: 24, icon: "🎯" },
  { id: "2", name: "Coding Energy", tracks: 18, icon: "⚡" },
  { id: "3", name: "Bug Fixing", tracks: 12, icon: "🔧" },
  { id: "4", name: "Late Night Deploy", tracks: 15, icon: "🌃" },
  { id: "5", name: "Code Review", tracks: 20, icon: "👀" }
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function Visualizer() {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Array(20).fill(0).map(() => Math.random() * 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-center gap-1 h-16">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-primary to-orange-500 rounded-full"
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
}

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set(tracks.filter(t => t.liked).map(t => t.id)));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tracks");

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= currentTrack.duration) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    setCurrentTrack(tracks[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(tracks.map(t => t.genre)));

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Music Player</h1>
              <p className="text-muted-foreground">Curated tracks for coding sessions</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks, artists, albums..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedGenre === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All Genres
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="liked">Liked ({likedTracks.size})</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setCurrentTrack(track);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                    currentTrack.id === track.id
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  } ${index !== filteredTracks.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="w-8 text-center text-sm text-muted-foreground">
                    {currentTrack.id === track.id && isPlaying ? (
                      <div className="flex items-end justify-center gap-0.5 h-4">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-primary" />
                        <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-primary" />
                        <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-primary" />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-2xl">{track.cover}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${currentTrack.id === track.id ? "text-primary" : ""}`}>
                      {track.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {track.artist} • {track.album}
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {track.genre}
                  </Badge>
                  <div className="text-sm text-muted-foreground w-12 text-right">
                    {formatTime(track.duration)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${likedTracks.has(track.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="text-4xl mb-4">{playlist.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.tracks} tracks</p>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="gap-2">
                      <Play className="h-3 w-3" />
                      Play
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            <motion.div className="bg-card rounded-2xl border border-border overflow-hidden">
              {tracks.filter(t => likedTracks.has(t.id)).map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setCurrentTrack(track);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    index !== tracks.filter(t => likedTracks.has(t.id)).length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="text-2xl">{track.cover}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{track.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </motion.div>
              ))}
              {likedTracks.size === 0 && (
                <div className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No liked tracks yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50"
      >
        {/* Visualizer */}
        {isPlaying && <Visualizer />}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 w-1/4 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-2xl">
                {currentTrack.cover}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{currentTrack.title}</div>
                <div className="text-sm text-muted-foreground truncate">{currentTrack.artist}</div>
              </div>
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${likedTracks.has(currentTrack.id) ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-lg transition-colors ${isShuffle ? "text-primary" : "hover:bg-muted"}`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePlay}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button onClick={handleNext} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <SkipForward className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setRepeatMode(prev => prev === "none" ? "all" : prev === "all" ? "one" : "none")}
                  className={`p-2 rounded-lg transition-colors ${repeatMode !== "none" ? "text-primary" : "hover:bg-muted"}`}
                >
                  <Repeat className="h-4 w-4" />
                  {repeatMode === "one" && <span className="text-[10px]">1</span>}
                </button>
              </div>
              <div className="w-full max-w-md flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={currentTrack.duration}
                  onValueChange={(value) => setCurrentTime(value[0])}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                onValueChange={(value) => {
                  setVolume(value[0]);
                  setIsMuted(false);
                }}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
