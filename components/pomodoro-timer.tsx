"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  X, 
  Timer,
  Coffee,
  Brain,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
};

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultSettings.workDuration * 60);
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);

  const getDuration = useCallback(() => {
    switch (mode) {
      case "work":
        return settings.workDuration * 60;
      case "shortBreak":
        return settings.shortBreak * 60;
      case "longBreak":
        return settings.longBreak * 60;
    }
  }, [mode, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "work") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration());
  };

  const skipSession = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((getDuration() - timeLeft) / getDuration()) * 100;

  const modeConfig = {
    work: { label: "Focus Time", icon: Brain, color: "from-red-500 to-orange-500" },
    shortBreak: { label: "Short Break", icon: Coffee, color: "from-green-500 to-emerald-500" },
    longBreak: { label: "Long Break", icon: Coffee, color: "from-blue-500 to-cyan-500" },
  };

  const currentMode = modeConfig[mode];
  const ModeIcon = currentMode.icon;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-60 right-4 z-50 p-3 rounded-full shadow-lg hover:shadow-xl transition-all ${
          isRunning 
            ? "bg-primary text-primary-foreground animate-pulse" 
            : "bg-background/80 backdrop-blur-sm border border-border"
        }`}
        title="Pomodoro Timer"
      >
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.div
              key="running"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              className="relative"
            >
              <Timer className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="stopped"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
            >
              <Timer className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Timer Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-72 right-4 z-50 w-80"
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              {/* Header */}
              <div className={`bg-gradient-to-br ${currentMode.color} p-6 text-white relative overflow-hidden`}>
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: isRunning ? 360 : 0 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <ModeIcon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <p className="text-white/80 text-sm">{currentMode.label}</p>
                      <h3 className="text-2xl font-bold">{formatTime(timeLeft)}</h3>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <CardContent className="p-4">
                <AnimatePresence mode="wait">
                  {showSettings ? (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <SettingsSlider
                        label="Work Duration"
                        value={settings.workDuration}
                        onChange={(v) => setSettings({ ...settings, workDuration: v })}
                        min={1}
                        max={60}
                        unit="min"
                      />
                      <SettingsSlider
                        label="Short Break"
                        value={settings.shortBreak}
                        onChange={(v) => setSettings({ ...settings, shortBreak: v })}
                        min={1}
                        max={30}
                        unit="min"
                      />
                      <SettingsSlider
                        label="Long Break"
                        value={settings.longBreak}
                        onChange={(v) => setSettings({ ...settings, longBreak: v })}
                        min={1}
                        max={60}
                        unit="min"
                      />
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setShowSettings(false);
                          resetTimer();
                        }}
                      >
                        Save Settings
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="controls"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={resetTimer}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="lg"
                          className={`w-20 ${
                            isRunning 
                              ? "bg-yellow-500 hover:bg-yellow-600" 
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={toggleTimer}
                        >
                          {isRunning ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={skipSession}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Session Counter */}
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < completedSessions % settings.sessionsBeforeLongBreak
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                            initial={false}
                            animate={{
                              scale: i < completedSessions % settings.sessionsBeforeLongBreak ? 1.2 : 1,
                            }}
                          />
                        ))}
                      </div>
                      
                      <p className="text-center text-sm text-muted-foreground">
                        {completedSessions} sessions completed
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SettingsSlider({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
      />
    </div>
  );
}
