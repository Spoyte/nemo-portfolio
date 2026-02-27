"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Coffee, 
  Music, 
  Code2, 
  BookOpen, 
  Gamepad2,
  Moon,
  Sun,
  Cloud,
  Wind,
  Droplets,
  Flame,
  Sparkles,
  Heart,
  Brain,
  Target,
  Trophy,
  Activity,
  Radio,
  Mic,
  Send,
  MoreHorizontal,
  Timer,
  Calendar,
  MapPin,
  Globe,
  Wifi,
  Battery,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Activity types
interface Activity {
  id: string;
  type: 'coding' | 'reading' | 'gaming' | 'music' | 'coffee' | 'break';
  title: string;
  startTime: Date;
  duration: number;
  icon: React.ReactNode;
  color: string;
}

// Mood types
interface MoodEntry {
  mood: 'energetic' | 'focused' | 'tired' | 'creative' | 'chill';
  timestamp: Date;
  note?: string;
}

// Current status data
const currentStatus = {
  location: "Shanghai, China",
  weather: {
    condition: "Clear",
    temp: 22,
    humidity: 65,
    windSpeed: 12
  },
  currentlyDoing: {
    activity: "Building portfolio features",
    project: "Code Cinema & Trading Cards",
    tech: ["Next.js", "TypeScript", "Framer Motion"]
  },
  dailyGoals: [
    { id: 1, text: "Ship new portfolio features", completed: true, icon: Code2 },
    { id: 2, text: "Read 30 mins", completed: false, icon: BookOpen },
    { id: 3, text: "Exercise", completed: true, icon: Activity },
    { id: 4, text: "Meditate", completed: false, icon: Brain }
  ],
  streaks: {
    coding: 45,
    reading: 12,
    exercise: 7
  },
  focusTime: {
    today: 4.5,
    week: 28.5,
    month: 124
  }
};

// Activity feed
const activityFeed: Activity[] = [
  { id: "1", type: "coding", title: "Working on Code Cinema", startTime: new Date(Date.now() - 1000 * 60 * 45), duration: 45, icon: <Code2 className="w-4 h-4" />, color: "bg-blue-500" },
  { id: "2", type: "coffee", title: "Coffee break", startTime: new Date(Date.now() - 1000 * 60 * 60), duration: 15, icon: <Coffee className="w-4 h-4" />, color: "bg-amber-600" },
  { id: "3", type: "music", title: "Listening to Lo-fi", startTime: new Date(Date.now() - 1000 * 60 * 90), duration: 30, icon: <Music className="w-4 h-4" />, color: "bg-purple-500" },
  { id: "4", type: "reading", title: "Reading 'Clean Code'", startTime: new Date(Date.now() - 1000 * 60 * 60 * 3), duration: 30, icon: <BookOpen className="w-4 h-4" />, color: "bg-green-500" },
];

// Mood history
const moodHistory: MoodEntry[] = [
  { mood: "energetic", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), note: "Great morning!" },
  { mood: "focused", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { mood: "creative", timestamp: new Date() },
];

// Mood config
const moodConfig = {
  energetic: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Energetic" },
  focused: { icon: Target, color: "text-blue-400", bg: "bg-blue-500/20", label: "Focused" },
  tired: { icon: Moon, color: "text-purple-400", bg: "bg-purple-500/20", label: "Tired" },
  creative: { icon: Sparkles, color: "text-pink-400", bg: "bg-pink-500/20", label: "Creative" },
  chill: { icon: Coffee, color: "text-green-400", bg: "bg-green-500/20", label: "Chill" }
};

// Activity type config
const activityConfig = {
  coding: { icon: Code2, color: "text-blue-400", label: "Coding" },
  reading: { icon: BookOpen, color: "text-green-400", label: "Reading" },
  gaming: { icon: Gamepad2, color: "text-purple-400", label: "Gaming" },
  music: { icon: Music, color: "text-pink-400", label: "Music" },
  coffee: { icon: Coffee, color: "text-amber-400", label: "Coffee" },
  break: { icon: Wind, color: "text-cyan-400", label: "Break" }
};

// Live clock component
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-5xl font-bold tabular-nums tracking-tight">
        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        <span className="text-2xl text-muted-foreground ml-1">
          :{time.toLocaleTimeString('en-US', { second: '2-digit' })}
        </span>
      </div>
      <p className="text-muted-foreground mt-1">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}

// Live activity tracker
function LiveActivityTracker() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Simulate current activity
    setCurrentActivity({
      id: "current",
      type: "coding",
      title: "Building portfolio features",
      startTime: new Date(Date.now() - 1000 * 60 * 45),
      duration: 0,
      icon: <Code2 className="w-5 h-5" />,
      color: "bg-blue-500"
    });
  }, []);

  useEffect(() => {
    if (!currentActivity) return;
    
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - currentActivity.startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentActivity]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentActivity) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${currentActivity.color} text-white`}>
              {currentActivity.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currently</p>
              <h3 className="font-semibold text-lg">{currentActivity.title}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums">{formatDuration(elapsed)}</p>
            <div className="flex items-center gap-1 justify-end text-green-500 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {Object.entries(activityConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentActivity({
                ...currentActivity,
                type: key as Activity['type'],
                title: key === 'coding' ? 'Building portfolio features' : 
                       key === 'reading' ? 'Reading documentation' :
                       key === 'music' ? 'Listening to music' :
                       key === 'coffee' ? 'Coffee break' :
                       key === 'gaming' ? 'Gaming session' : 'Taking a break',
                startTime: new Date(),
                icon: <config.icon className="w-4 h-4" />,
                color: key === 'coding' ? 'bg-blue-500' :
                       key === 'reading' ? 'bg-green-500' :
                       key === 'music' ? 'bg-purple-500' :
                       key === 'coffee' ? 'bg-amber-500' :
                       key === 'gaming' ? 'bg-pink-500' : 'bg-cyan-500'
              })}
            >
              <config.icon className="w-3 h-3 mr-1" />
              {config.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Mood tracker component
function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moods, setMoods] = useState<MoodEntry[]>(moodHistory);

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    
    const newMood: MoodEntry = {
      mood: selectedMood as MoodEntry['mood'],
      timestamp: new Date(),
      note: moodNote
    };
    
    setMoods([newMood, ...moods]);
    setSelectedMood(null);
    setMoodNote("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(moodConfig).map(([mood, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`p-3 rounded-xl transition-all ${
                  selectedMood === mood 
                    ? `${config.bg} ring-2 ring-offset-2 ring-offset-background` 
                    : 'hover:bg-muted'
                }`}
                style={{ ringColor: selectedMood === mood ? config.color.replace('text-', '') : undefined }}
              >
                <Icon className={`w-6 h-6 mx-auto mb-1 ${config.color}`} />
                <span className="text-xs block text-center">{config.label}</span>
              </button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Input
                placeholder="Add a note (optional)..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              />
              <Button onClick={handleMoodSubmit} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Log Mood
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent moods */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground">Recent</p>
          {moods.slice(0, 3).map((mood, i) => {
            const config = moodConfig[mood.mood];
            const Icon = config.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span>{config.label}</span>
                <span className="text-muted-foreground ml-auto">
                  {new Date(mood.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Focus stats component
function FocusStats() {
  const stats = [
    { label: "Today", value: currentStatus.focusTime.today, icon: Sun, color: "text-yellow-500" },
    { label: "This Week", value: currentStatus.focusTime.week, icon: Calendar, color: "text-blue-500" },
    { label: "This Month", value: currentStatus.focusTime.month, icon: BarChart3, color: "text-purple-500" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Focus Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}h</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium">Daily Goal Progress</p>
          <div className="space-y-2">
            {currentStatus.dailyGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <div key={goal.id} className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${goal.completed ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.text}
                  </span>
                  {goal.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Streaks component
function Streaks() {
  const streaks = [
    { label: "Coding", days: currentStatus.streaks.coding, icon: Code2, color: "from-blue-500 to-cyan-500" },
    { label: "Reading", days: currentStatus.streaks.reading, icon: BookOpen, color: "from-green-500 to-emerald-500" },
    { label: "Exercise", days: currentStatus.streaks.exercise, icon: Activity, color: "from-orange-500 to-red-500" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {streaks.map((streak) => {
            const Icon = streak.icon;
            return (
              <div key={streak.label} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${streak.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{streak.label}</span>
                    <span className="text-2xl font-bold">{streak.days}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (streak.days / 100) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full bg-gradient-to-r ${streak.color}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {streak.days >= 30 ? '🔥 On fire!' : streak.days >= 7 ? '💪 Keep it up!' : '🌱 Building habit'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Activity timeline
function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityFeed.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`p-2 rounded-lg ${activity.color} text-white shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.duration} min • {new Date(activity.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Weather widget
function WeatherWidget() {
  const getWeatherIcon = () => {
    switch (currentStatus.weather.condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain': return <Droplets className="w-8 h-8 text-blue-400" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon()}
            <div>
              <p className="text-3xl font-bold">{currentStatus.weather.temp}°C</p>
              <p className="text-muted-foreground">{currentStatus.weather.condition}</p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {currentStatus.weather.humidity}%
            </p>
            <p className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {currentStatus.weather.windSpeed} km/h
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {currentStatus.location}
        </div>
      </CardContent>
    </Card>
  );
}

// Now playing widget
function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => (p + 0.5) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">Now Playing</p>
            <p className="font-semibold truncate">Lo-Fi Study Beats</p>
            <p className="text-sm text-muted-foreground truncate">Chillhop Music</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <div className="flex gap-0.5">
                <motion.div animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 h-4 bg-primary rounded-full" />
                <motion.div animate={{ scaleY: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 h-4 bg-primary rounded-full" />
                <motion.div animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 h-4 bg-primary rounded-full" />
              </div>
            ) : (
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-primary ml-1" />
            )}
          </Button>
        </div>
        <div className="mt-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:24</span>
            <span>3:45</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NowPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Live Status
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What I'm Doing Now</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A real-time glimpse into my current activities, focus, and state of mind.
          </p>
        </motion.div>

        {/* Live Clock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <LiveClock />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <LiveActivityTracker />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FocusStats />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Streaks />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ActivityTimeline />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeatherWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <NowPlaying />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <MoodTracker />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Wifi className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-lg font-bold">Online</p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <Battery className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-lg font-bold">87%</p>
                      <p className="text-xs text-muted-foreground">Battery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Current Project Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-orange-500/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/20">
                  <Code2 className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-muted-foreground mb-1">Currently Building</p>
                  <h2 className="text-2xl font-bold mb-2">{currentStatus.currentlyDoing.project}</h2>
                  <p className="text-muted-foreground mb-4">{currentStatus.currentlyDoing.activity}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {currentStatus.currentlyDoing.tech.map(tech => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
                <Button size="lg" className="group">
                  View Project
                  <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
