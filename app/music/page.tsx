"use client";

import { useState, useEffect } from "react";
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
  Shuffle,
  Repeat,
  ListMusic,
  Mic2,
  Disc,
  Radio,
  Headphones,
  Share2,
  Download,
  MoreHorizontal,
  Search,
  Plus,
  Clock,
  Calendar,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  cover: string;
  genre: string;
  year: number;
  plays: number;
  liked: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: string[];
  cover: string;
  createdAt: string;
}

const defaultTracks: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    durationSeconds: 243,
    cover: "🌃",
    genre: "Electronic",
    year: 2011,
    plays: 1247,
    liked: true,
  },
  {
    id: "2",
    title: "Instant Crush",
    artist: "Daft Punk ft. Julian Casablancas",
    album: "Random Access Memories",
    duration: "5:37",
    durationSeconds: 337,
    cover: "🤖",
    genre: "Electronic",
    year: 2013,
    plays: 982,
    liked: true,
  },
  {
    id: "3",
    title: "The Less I Know The Better",
    artist: "Tame Impala",
    album: "Currents",
    duration: "3:36",
    durationSeconds: 216,
    cover: "🌊",
    genre: "Psychedelic Pop",
    year: 2015,
    plays: 2156,
    liked: false,
  },
  {
    id: "4",
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    duration: "4:18",
    durationSeconds: 258,
    cover: "🚗",
    genre: "Synthwave",
    year: 2010,
    plays: 876,
    liked: true,
  },
  {
    id: "5",
    title: "Get Lucky",
    artist: "Daft Punk ft. Pharrell Williams",
    album: "Random Access Memories",
    duration: "6:09",
    durationSeconds: 369,
    cover: "⭐",
    genre: "Disco",
    year: 2013,
    plays: 3421,
    liked: false,
  },
  {
    id: "6",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    duration: "3:50",
    durationSeconds: 230,
    cover: "✨",
    genre: "R&B",
    year: 2016,
    plays: 1892,
    liked: true,
  },
  {
    id: "7",
    title: "Midnight Train to Georgia",
    artist: "Gladys Knight & The Pips",
    album: "Imagination",
    duration: "4:40",
    durationSeconds: 280,
    cover: "🚂",
    genre: "Soul",
    year: 1973,
    plays: 654,
    liked: false,
  },
  {
    id: "8",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    durationSeconds: 355,
    cover: "👑",
    genre: "Rock",
    year: 1975,
    plays: 4532,
    liked: true,
  },
];

const playlists: Playlist[] = [
  {
    id: "1",
    name: "Coding Focus",
    description: "Deep work music for productive coding sessions",
    tracks: ["1", "2", "4", "6"],
    cover: "💻",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Late Night Vibes",
    description: "Chill tunes for late night coding",
    tracks: ["3", "5", "7"],
    cover: "🌙",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Classics",
    description: "Timeless tracks that never get old",
    tracks: ["7", "8"],
    cover: "🎸",
    createdAt: "2024-02-20",
  },
];

const genres = ["All", "Electronic", "Rock", "Pop", "R&B", "Soul", "Synthwave", "Psychedelic Pop", "Disco"];

export default function MusicPlayerPage() {
  const [tracks] = useState<Track[]>(defaultTracks);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [likedTracks, setLikedTracks] = useState<string[]>(["1", "2", "4", "6", "8"]);
  const [activeTab, setActiveTab] = useState("all");

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setProgress(0);
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setProgress(0);
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const likedTracksList = tracks.filter((t) => likedTracks.includes(t.id));

  const totalListeningTime = tracks.reduce((acc, track) => acc + track.plays * track.durationSeconds, 0);
  const hoursListened = Math.floor(totalListeningTime / 3600);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl">
                🎵
              </div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold"
                >
                  Music{" "}
                  <span className="text-gradient-animated">Player</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  {tracks.length} tracks • {hoursListened}h listened
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm">
                <Radio className="h-4 w-4 mr-2" />
                Radio
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Music
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing Card */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
                <CardContent className="relative p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Album Art */}
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-6xl shadow-2xl shrink-0"
                    >
                      {currentTrack.cover}
                    </motion.div>

                    {/* Track Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <Badge className="w-fit mb-2">{currentTrack.genre}</Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-1">{currentTrack.title}</h2>
                      <p className="text-lg text-muted-foreground mb-2">{currentTrack.artist}</p>
                      <p className="text-sm text-muted-foreground mb-4">{currentTrack.album} • {currentTrack.year}</p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Slider
                          value={[progress]}
                          max={currentTrack.durationSeconds}
                          step={1}
                          onValueChange={(value) => setProgress(value[0])}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatTime(progress)}</span>
                          <span>{currentTrack.duration}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsShuffle(!isShuffle)}
                            className={isShuffle ? "text-primary" : ""}
                          >
                            <Shuffle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handlePrevious}>
                            <SkipBack className="h-5 w-5" />
                          </Button>
                          <Button size="icon" className="h-12 w-12" onClick={handlePlayPause}>
                            {isPlaying ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6 ml-0.5" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleNext}>
                            <SkipForward className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsRepeat(!isRepeat)}
                            className={isRepeat ? "text-primary" : ""}
                          >
                            <Repeat className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLike(currentTrack.id)}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                likedTracks.includes(currentTrack.id)
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsMuted(!isMuted)}
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                            <Slider
                              value={[isMuted ? 0 : volume]}
                              max={100}
                              step={1}
                              onValueChange={(value) => {
                                setVolume(value[0]);
                                setIsMuted(value[0] === 0);
                              }}
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  <ListMusic className="h-4 w-4 mr-2" />
                  All Tracks
                </TabsTrigger>
                <TabsTrigger value="liked">
                  <Heart className="h-4 w-4 mr-2" />
                  Liked
                </TabsTrigger>
                <TabsTrigger value="playlists">
                  <Disc className="h-4 w-4 mr-2" />
                  Playlists
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracks, artists, or albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Track List */}
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      {filteredTracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setCurrentTrack(track);
                            setProgress(0);
                            setIsPlaying(true);
                          }}
                          className={`flex items-center gap-4 p-4 border-b last:border-0 cursor-pointer transition-colors ${
                            currentTrack.id === track.id
                              ? "bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="w-8 text-center text-sm text-muted-foreground">
                            {currentTrack.id === track.id && isPlaying ? (
                              <div className="flex items-end justify-center gap-0.5 h-4">
                                <motion.div
                                  animate={{ height: [4, 12, 4] }}
                                  transition={{ repeat: Infinity, duration: 0.5 }}
                                  className="w-1 bg-primary rounded-full"
                                />
                                <motion.div
                                  animate={{ height: [8, 4, 8] }}
                                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                  className="w-1 bg-primary rounded-full"
                                />
                                <motion.div
                                  animate={{ height: [6, 14, 6] }}
                                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                                  className="w-1 bg-primary rounded-full"
                                />
                              </div>
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                            {track.cover}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${currentTrack.id === track.id ? "text-primary" : ""}`}>
                              {track.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                          </div>

                          <div className="hidden md:block text-sm text-muted-foreground">
                            {track.album}
                          </div>

                          <div className="hidden sm:flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(track.id);
                              }}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  likedTracks.includes(track.id)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }`}
                              />
                            </Button>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {track.duration}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="liked" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      {likedTracksList.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setCurrentTrack(track);
                            setProgress(0);
                            setIsPlaying(true);
                          }}
                          className="flex items-center gap-4 p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                            {track.cover}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track.id);
                            }}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </motion.div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="playlists" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group cursor-pointer hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-4xl">
                              {playlist.cover}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {playlist.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {playlist.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {playlist.tracks.length} tracks
                              </p>
                            </div>
                            <Button size="icon" variant="ghost">
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Listening Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Plays</span>
                  <span className="font-semibold">
                    {tracks.reduce((acc, t) => acc + t.plays, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hours Listened</span>
                  <span className="font-semibold">{hoursListened}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Liked Tracks</span>
                  <span className="font-semibold">{likedTracks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Playlists</span>
                  <span className="font-semibold">{playlists.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Tracks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...tracks]
                    .sort((a, b) => b.plays - a.plays)
                    .slice(0, 5)
                    .map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => {
                          setCurrentTrack(track);
                          setProgress(0);
                          setIsPlaying(true);
                        }}
                      >
                        <span className="text-sm font-bold text-muted-foreground w-4">
                          {index + 1}
                        </span>
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                          {track.cover}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{track.title}</p>
                          <p className="text-xs text-muted-foreground">{track.plays} plays</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recently Played */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recently Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tracks.slice(0, 4).map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() => {
                        setCurrentTrack(track);
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                        {track.cover}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
