"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Code2, 
  Eye, 
  MousePointer,
  Keyboard,
  Clock,
  Share2,
  MessageSquare,
  Mail,
  Gamepad2,
  Terminal,
  Sparkles,
  Lock,
  Unlock,
  Crown,
  Medal,
  Award,
  Gem,
  Rocket,
  Flame,
  Ghost,
  Palette,
  Music,
  Coffee,
  Moon,
  Sun,
  Heart,
  Bookmark,
  Download,
  Send,
  Search,
  Command,
  Bell,
  Settings,
  Globe,
  Wifi,
  Battery,
  Volume2,
  Camera,
  Video,
  Mic,
  Phone,
  MapPin,
  Compass,
  Navigation,
  Flag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Info,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Briefcase,
  Folder,
  FileText,
  Image,
  Film,
  Music2,
  Headphones,
  Speaker,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  HardDrive,
  Database,
  Server,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  SunDim,
  MoonStar,
  Sunrise,
  Sunset,
  Calendar,
  Clock2,
  Timer,
  Hourglass,
  Watch,
  AlarmClock,
  BellRing,
  BellOff,
  VolumeX,
  Volume1,
  Volume,
  Mic2,
  MicOff,
  VideoOff,
  CameraOff,
  ImageOff,
  FileMinus,
  FilePlus,
  FileX,
  FolderOpen,
  FolderMinus,
  FolderPlus,
  FolderX,
  FolderClosed,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  HeartOff,
  StarOff,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Annoyed,
  Angry,
  Surprised,
  ZapOff,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  WifiOff,
  WifiLow,
  WifiHigh,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
  Cast,
  Airplay,
  Chromecast,
  Radio,
  Tv,
  RadioReceiver,
  Projector,
  Disc,
  Vinyl,
  CassetteTape,
  Cpu,
  HardDriveDownload,
  HardDriveUpload,
  Usb,
  Hdmi,
  Power,
  PowerOff,
  RefreshCw,
  RefreshCcw,
  RotateCw,
  RotateCcw,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  SquareRound,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  SquareDashed,
  SquareDot,
  SquareEllipsis,
  Minus,
  Plus,
  Divide,
  Percent,
  Equal,
  NotEqual,
  GreaterThan,
  LessThan,
  Hash,
  AtSign,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYen,
  RussianRuble,
  IndianRupee,
  Bitcoin,
  CreditCard,
  Wallet,
  Banknote,
  PiggyBank,
  Receipt,
  ReceiptText,
  ReceiptPoundSterling,
  ReceiptEuro,
  ReceiptJapaneseYen,
  ReceiptIndianRupee,
  ReceiptRussianRuble,
  ShoppingCart,
  ShoppingBag,
  Package,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackageSearch,
  PackagePlus,
  PackageMinus,
  Truck,
  Car,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Footprints,
  Map,
  MapPinned,
  Navigation2,
  Locate,
  LocateFixed,
  LocateOff,
  Radar,
  Target2,
  Crosshair,
  Aperture,
  Focus,
  EyeOff,
  Glasses,
  Sunglasses,
  Contact,
  Contact2,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserX,
  UserCheck,
  UserCog,
  UsersRound,
  UserRound,
  UserRoundPlus,
  UserRoundMinus,
  UserRoundX,
  UserRoundCheck,
  UserRoundCog,
  Crown2,
  Medal2,
  Award2,
  Gem2,
  Rocket2,
  Flame2,
  Ghost2,
  Palette2,
  Music3,
  Coffee2,
  Moon2,
  Sun2,
  Heart2,
  Bookmark2,
  Download2,
  Send2,
  Search2,
  Command2,
  Bell2,
  Settings2,
  Globe2,
  Wifi2,
  Battery2,
  Volume3,
  Camera2,
  Video2,
  Mic3,
  Phone2,
  MapPin2,
  Compass2,
  Navigation3,
  Flag2,
  CheckCircle3,
  XCircle2,
  AlertCircle2,
  HelpCircle2,
  Info2,
  Lightbulb2,
  BookOpen2,
  GraduationCap2,
  Briefcase2,
  Folder2,
  FileText2,
  Image2,
  Film2,
  Music4,
  Headphones2,
  Speaker2,
  Monitor2,
  Smartphone2,
  Tablet2,
  Laptop2,
  Desktop2,
  Printer2,
  Scanner2,
  HardDrive2,
  Database2,
  Server2,
  Cloud2,
  CloudRain2,
  CloudSnow2,
  CloudLightning2,
  Wind2,
  Thermometer2,
  Droplets2,
  SunDim2,
  MoonStar2,
  Sunrise2,
  Sunset2,
  Calendar2,
  Clock3,
  Timer2,
  Hourglass2,
  Watch2,
  AlarmClock2,
  BellRing2,
  BellOff2,
  VolumeX2,
  Volume12,
  Volume22,
  Mic22,
  MicOff2,
  VideoOff2,
  CameraOff2,
  ImageOff2,
  FileMinus2,
  FilePlus2,
  FileX2,
  FolderOpen2,
  FolderMinus2,
  FolderPlus2,
  FolderX2,
  FolderClosed2,
  BookmarkPlus2,
  BookmarkMinus2,
  BookmarkX2,
  HeartOff2,
  StarOff2,
  ThumbsUp2,
  ThumbsDown2,
  Smile2,
  Frown2,
  Meh2,
  Laugh2,
  Annoyed2,
  Angry2,
  Surprised2,
  ZapOff2,
  BatteryCharging2,
  BatteryFull2,
  BatteryLow2,
  BatteryMedium2,
  WifiOff2,
  WifiLow2,
  WifiHigh2,
  Signal2,
  SignalHigh2,
  SignalMedium2,
  SignalLow2,
  SignalZero2,
  Bluetooth2,
  BluetoothConnected2,
  BluetoothOff2,
  BluetoothSearching2,
  Cast2,
  Airplay2,
  Chromecast2,
  Radio2,
  Tv2,
  RadioReceiver2,
  Projector2,
  Disc2,
  Vinyl2,
  CassetteTape2,
  Cpu2,
  HardDriveDownload2,
  HardDriveUpload2,
  Usb2,
  Hdmi2,
  Power2,
  PowerOff2,
  RefreshCw2,
  RefreshCcw2,
  RotateCw2,
  RotateCcw2,
  Repeat2,
  Repeat12,
  Shuffle2,
  SkipBack2,
  SkipForward2,
  Play2,
  Pause2,
  Square2,
  Circle2,
  Triangle2,
  Hexagon2,
  Octagon2,
  Pentagon2,
  SquareRound2,
  CircleDashed2,
  CircleDot2,
  CircleEllipsis2,
  SquareDashed2,
  SquareDot2,
  SquareEllipsis2,
  Minus2,
  Plus2,
  Divide2,
  Percent2,
  Equal2,
  NotEqual2,
  GreaterThan2,
  LessThan2,
  Hash2,
  AtSign2,
  DollarSign2,
  Euro2,
  PoundSterling2,
  JapaneseYen2,
  RussianRuble2,
  IndianRupee2,
  Bitcoin2,
  CreditCard2,
  Wallet2,
  Banknote2,
  PiggyBank2,
  Receipt2,
  ReceiptText2,
  ReceiptPoundSterling2,
  ReceiptEuro2,
  ReceiptJapaneseYen2,
  ReceiptIndianRupee2,
  ReceiptRussianRuble2,
  ShoppingCart2,
  ShoppingBag2,
  Package3,
  PackageOpen2,
  PackageCheck2,
  PackageX2,
  PackageSearch2,
  PackagePlus2,
  PackageMinus2,
  Truck2,
  Car2,
  Bus2,
  Train2,
  Plane2,
  Ship2,
  Bike2,
  Footprints2,
  Map2,
  MapPinned2,
  Navigation4,
  Locate2,
  LocateFixed2,
  LocateOff2,
  Radar2,
  Target3,
  Crosshair2,
  Aperture2,
  Focus2,
  EyeOff2,
  Glasses2,
  Sunglasses2,
  Contact3,
  Contact22,
  Users2,
  User2,
  UserPlus2,
  UserMinus2,
  UserX2,
  UserCheck2,
  UserCog2,
  UsersRound2,
  UserRound2,
  UserRoundPlus2,
  UserRoundMinus2,
  UserRoundX2,
  UserRoundCheck2,
  UserRoundCog2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Achievement definitions
const achievements = [
  {
    id: "explorer",
    name: "Curious Explorer",
    description: "Visit the portfolio homepage",
    icon: Compass,
    rarity: "common",
    points: 10,
    condition: () => true,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Visit the site between midnight and 5 AM",
    icon: Moon,
    rarity: "uncommon",
    points: 25,
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 5;
    },
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Visit the site between 5 AM and 8 AM",
    icon: Sunrise,
    rarity: "uncommon",
    points: 25,
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 5 && hour < 8;
    },
  },
  {
    id: "konami_master",
    name: "Konami Master",
    description: "Unlock the secret page with the Konami code",
    icon: Gamepad2,
    rarity: "rare",
    points: 100,
    secret: true,
  },
  {
    id: "theme_switcher",
    name: "Theme Switcher",
    description: "Toggle between light and dark mode 5 times",
    icon: Palette,
    rarity: "common",
    points: 15,
    maxProgress: 5,
  },
  {
    id: "page_surfer",
    name: "Page Surfer",
    description: "Visit 5 different pages on the site",
    icon: Globe,
    rarity: "common",
    points: 20,
    maxProgress: 5,
  },
  {
    id: "deep_diver",
    name: "Deep Diver",
    description: "Spend 5 minutes exploring the portfolio",
    icon: Clock,
    rarity: "uncommon",
    points: 30,
    maxProgress: 300, // 5 minutes in seconds
  },
  {
    id: "project_inspector",
    name: "Project Inspector",
    description: "View 3 project case studies",
    icon: FolderOpen,
    rarity: "common",
    points: 20,
    maxProgress: 3,
  },
  {
    id: "blog_reader",
    name: "Blog Reader",
    description: "Read 2 blog posts",
    icon: BookOpen,
    rarity: "common",
    points: 20,
    maxProgress: 2,
  },
  {
    id: "skill_master",
    name: "Skill Master",
    description: "View the skills visualization page",
    icon: Zap,
    rarity: "common",
    points: 15,
  },
  {
    id: "time_traveler",
    name: "Time Traveler",
    description: "View the journey timeline page",
    icon: HistoryIcon,
    rarity: "common",
    points: 15,
  },
  {
    id: "now_watcher",
    name: "Now Watcher",
    description: "Check out the /now page",
    icon: Eye,
    rarity: "common",
    points: 15,
  },
  {
    id: "contact_made",
    name: "Connection Made",
    description: "Visit the contact page",
    icon: Mail,
    rarity: "common",
    points: 10,
  },
  {
    id: "terminal_user",
    name: "Terminal User",
    description: "Open the terminal widget",
    icon: Terminal,
    rarity: "uncommon",
    points: 25,
  },
  {
    id: "command_master",
    name: "Command Master",
    description: "Use the command palette",
    icon: Command,
    rarity: "uncommon",
    points: 25,
  },
  {
    id: "music_lover",
    name: "Music Lover",
    description: "Play a song in the music player",
    icon: Music,
    rarity: "uncommon",
    points: 25,
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Click on a social media link",
    icon: Share2,
    rarity: "common",
    points: 15,
  },
  {
    id: "coffee_break",
    name: "Coffee Break",
    description: "Spend 2 minutes on a single page",
    icon: Coffee,
    rarity: "common",
    points: 15,
    maxProgress: 120, // 2 minutes in seconds
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "View the source code on GitHub",
    icon: Code2,
    rarity: "rare",
    points: 50,
  },
  {
    id: "easter_egg_hunter",
    name: "Easter Egg Hunter",
    description: "Find 3 hidden easter eggs",
    icon: Search,
    rarity: "rare",
    points: 75,
    maxProgress: 3,
    secret: true,
  },
  {
    id: "loyal_visitor",
    name: "Loyal Visitor",
    description: "Visit the site on 3 different days",
    icon: Calendar,
    rarity: "epic",
    points: 100,
    maxProgress: 3,
  },
  {
    id: "completionist",
    name: "The Completionist",
    description: "Unlock all achievements",
    icon: Crown,
    rarity: "legendary",
    points: 500,
  },
];

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
      <path d="M3 3v9h9" />
    </svg>
  );
}

function FolderOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

const rarityColors = {
  common: "bg-slate-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
};

const rarityGradients = {
  common: "from-slate-400 to-slate-600",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 via-orange-400 to-red-400",
};

export default function AchievementsPage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [achievementProgress, setAchievementProgress] = useState<Record<string, number>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-achievements");
    if (saved) {
      const data = JSON.parse(saved);
      setUnlockedAchievements(new Set(data.unlocked || []));
      setAchievementProgress(data.progress || {});
      setTotalPoints(data.points || 0);
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem(
      "portfolio-achievements",
      JSON.stringify({
        unlocked: Array.from(unlockedAchievements),
        progress: achievementProgress,
        points: totalPoints,
      })
    );
  }, [unlockedAchievements, achievementProgress, totalPoints]);

  // Check for time-based achievements
  useEffect(() => {
    achievements.forEach((achievement) => {
      if (achievement.condition && !unlockedAchievements.has(achievement.id)) {
        if (achievement.condition()) {
          unlockAchievement(achievement);
        }
      }
    });
  }, []);

  const unlockAchievement = (achievement: typeof achievements[0]) => {
    if (unlockedAchievements.has(achievement.id)) return;

    setUnlockedAchievements((prev) => new Set([...prev, achievement.id]));
    setTotalPoints((prev) => prev + achievement.points);
    setShowUnlockAnimation(achievement.id);
    
    toast.success(
      <div className="flex items-center gap-2">
        <achievement.icon className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="font-semibold">Achievement Unlocked!</p>
          <p className="text-sm">{achievement.name} (+{achievement.points} pts)</p>
        </div>
      </div>,
      { duration: 5000 }
    );

    setTimeout(() => setShowUnlockAnimation(null), 3000);
  };

  const updateProgress = (achievementId: string, progress: number) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement || !achievement.maxProgress) return;

    const currentProgress = achievementProgress[achievementId] || 0;
    const newProgress = Math.min(currentProgress + progress, achievement.maxProgress);

    setAchievementProgress((prev) => ({
      ...prev,
      [achievementId]: newProgress,
    }));

    if (newProgress >= achievement.maxProgress && !unlockedAchievements.has(achievementId)) {
      unlockAchievement(achievement);
    }
  };

  const resetAchievements = () => {
    setUnlockedAchievements(new Set());
    setAchievementProgress({});
    setTotalPoints(0);
    toast.success("Achievements reset!");
  };

  const unlockedCount = unlockedAchievements.size;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Group achievements by rarity
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.rarity]) acc[achievement.rarity] = [];
    acc[achievement.rarity].push(achievement);
    return acc;
  }, {} as Record<string, typeof achievements>);

  const rarityOrder = ["legendary", "epic", "rare", "uncommon", "common"];

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
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Gamification</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Achievements</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the portfolio to unlock achievements and earn points. 
            Can you collect them all?
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Unlocked</p>
              <p className="text-3xl font-bold">{unlockedCount} / {totalCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-3xl font-bold">{totalPoints}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-3xl font-bold">{completionPercentage}%</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Achievements by Rarity */}
        <div className="space-y-12">
          {rarityOrder.map((rarity, rarityIndex) => {
            const rarityAchievements = groupedAchievements[rarity] || [];
            if (rarityAchievements.length === 0) return null;

            return (
              <motion.section
                key={rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * rarityIndex }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full ${rarityColors[rarity as keyof typeof rarityColors]}`} />
                  <h2 className="text-xl font-bold capitalize">{rarity}</h2>
                  <Badge variant="secondary">
                    {rarityAchievements.filter((a) => unlockedAchievements.has(a.id)).length} / {rarityAchievements.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rarityAchievements.map((achievement, index) => {
                    const isUnlocked = unlockedAchievements.has(achievement.id);
                    const progress = achievementProgress[achievement.id] || 0;
                    const progressPercent = achievement.maxProgress
                      ? Math.round((progress / achievement.maxProgress) * 100)
                      : isUnlocked ? 100 : 0;

                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index + 0.1 * rarityIndex }}
                      >
                        <Card
                          className={`h-full transition-all ${
                            isUnlocked
                              ? "border-primary/50 bg-primary/5"
                              : "opacity-60 grayscale"
                          } ${
                            showUnlockAnimation === achievement.id
                              ? "animate-pulse ring-2 ring-primary"
                              : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  isUnlocked
                                    ? `bg-gradient-to-br ${rarityGradients[achievement.rarity as keyof typeof rarityGradients]}`
                                    : "bg-muted"
                                }`}
                              >
                                <achievement.icon
                                  className={`h-6 w-6 ${
                                    isUnlocked ? "text-white" : "text-muted-foreground"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{achievement.name}</h3>
                                  {achievement.secret && !isUnlocked && (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {achievement.secret && !isUnlocked
                                    ? "???"
                                    : achievement.description}
                                </p>

                                {achievement.maxProgress && (
                                  <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress</span>
                                      <span>
                                        {progress} / {achievement.maxProgress}
                                      </span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          isUnlocked ? "bg-green-500" : "bg-primary"
                                        }`}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    +{achievement.points} pts
                                  </Badge>
                                  {isUnlocked && (
                                    <Badge className="text-xs bg-green-500">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Unlocked
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <Button variant="outline" onClick={resetAchievements}>
            Reset All Achievements
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
