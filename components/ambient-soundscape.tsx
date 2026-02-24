"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Wind, Waves, CloudRain, Flame, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SoundSource {
  name: string;
  icon: React.ElementType;
  color: string;
  frequency: number;
  type: "noise" | "oscillator" | "rain" | "wind";
}

const soundSources: SoundSource[] = [
  { name: "Pink Noise", icon: Volume2, color: "#f472b6", frequency: 0, type: "noise" },
  { name: "Brown Noise", icon: Waves, color: "#8b5cf6", frequency: 0, type: "noise" },
  { name: "Wind", icon: Wind, color: "#06b6d4", frequency: 200, type: "wind" },
  { name: "Rain", icon: CloudRain, color: "#3b82f6", frequency: 0, type: "rain" },
  { name: "Fire", icon: Flame, color: "#f97316", frequency: 80, type: "noise" },
  { name: "Drone", icon: Music, color: "#10b981", frequency: 110, type: "oscillator" },
];

export function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>(
    Object.fromEntries(soundSources.map((s) => [s.name, 0]))
  );
  const [masterVolume, setMasterVolume] = useState(50);
  const [activeSounds, setActiveSounds] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, any>>({});
  const animationRef = useRef<number>();
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(64).fill(0));

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Create noise buffer
  const createNoiseBuffer = (type: "pink" | "brown") => {
    if (!audioContextRef.current) return null;
    
    const bufferSize = 2 * audioContextRef.current.sampleRate;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === "pink") {
      // Pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // Brown noise
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    return buffer;
  };

  // Start a sound
  const startSound = (source: SoundSource) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = (volumes[source.name] / 100) * (masterVolume / 100);

    if (source.type === "noise") {
      const buffer = createNoiseBuffer(source.name.includes("Pink") ? "pink" : "brown");
      if (buffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(gainNode);
        noise.start();
        nodesRef.current[source.name] = { source: noise, gain: gainNode };
      }
    } else if (source.type === "oscillator") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = source.frequency;
      osc.connect(gainNode);
      osc.start();
      nodesRef.current[source.name] = { source: osc, gain: gainNode };
    } else if (source.type === "wind") {
      // Wind simulation with modulated noise
      const buffer = createNoiseBuffer("pink");
      if (buffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        // LFO for wind modulation
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.1;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 500;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 400;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        noise.connect(filter);
        filter.connect(gainNode);
        
        noise.start();
        lfo.start();
        nodesRef.current[source.name] = { source: noise, lfo, gain: gainNode };
      }
    } else if (source.type === "rain") {
      // Rain simulation
      const buffer = createNoiseBuffer("pink");
      if (buffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;
        
        noise.connect(filter);
        filter.connect(gainNode);
        noise.start();
        nodesRef.current[source.name] = { source: noise, gain: gainNode };
      }
    }
  };

  // Stop a sound
  const stopSound = (name: string) => {
    const nodes = nodesRef.current[name];
    if (nodes) {
      if (nodes.source) nodes.source.stop();
      if (nodes.lfo) nodes.lfo.stop();
      delete nodesRef.current[name];
    }
  };

  // Toggle play
  const togglePlay = () => {
    if (!isPlaying) {
      initAudio();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      // Stop all sounds
      Object.keys(nodesRef.current).forEach(stopSound);
      setIsPlaying(false);
      setActiveSounds([]);
    }
  };

  // Toggle a sound source
  const toggleSound = (source: SoundSource) => {
    initAudio();
    
    if (activeSounds.includes(source.name)) {
      stopSound(source.name);
      setActiveSounds((prev) => prev.filter((s) => s !== source.name));
    } else {
      setVolumes((prev) => ({ ...prev, [source.name]: prev[source.name] || 50 }));
      startSound(source);
      setActiveSounds((prev) => [...prev, source.name]);
      if (!isPlaying) setIsPlaying(true);
    }
  };

  // Update volume
  const updateVolume = (name: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [name]: value }));
    const nodes = nodesRef.current[name];
    if (nodes?.gain) {
      nodes.gain.gain.value = (value / 100) * (masterVolume / 100);
    }
  };

  // Update master volume
  useEffect(() => {
    Object.entries(nodesRef.current).forEach(([name, nodes]) => {
      if (nodes.gain) {
        nodes.gain.gain.value = (volumes[name] / 100) * (masterVolume / 100);
      }
    });
  }, [masterVolume, volumes]);

  // Visualizer animation
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerData(new Array(64).fill(0));
      return;
    }

    const animate = () => {
      setVisualizerData(
        new Array(64).fill(0).map(() => {
          const base = activeSounds.length > 0 ? 20 : 0;
          return base + Math.random() * 60 * (activeSounds.length / soundSources.length);
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, activeSounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.keys(nodesRef.current).forEach(stopSound);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="w-full">
      {/* Visualizer */}
      <div className="relative h-32 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-4">
          {visualizerData.map((height, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm"
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
        
        {activeSounds.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="text-sm">Select sounds to begin</span>
          </div>
        )}
      </div>

      {/* Sound Sources Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {soundSources.map((source) => {
          const isActive = activeSounds.includes(source.name);
          const Icon = source.icon;
          
          return (
            <motion.button
              key={source.name}
              onClick={() => toggleSound(source)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isActive ? source.color : "transparent",
                    border: `2px solid ${source.color}`,
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: isActive ? "white" : source.color }}
                  />
                </div>
                <span className="font-medium text-sm">{source.name}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Sound Controls */}
      {activeSounds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 mb-6"
        >
          <h4 className="font-medium text-sm text-muted-foreground">Mix Levels</h4>
          {activeSounds.map((soundName) => {
            const source = soundSources.find((s) => s.name === soundName);
            if (!source) return null;
            
            return (
              <div key={soundName} className="flex items-center gap-4">
                <span className="w-24 text-sm truncate">{soundName}</span>
                <Slider
                  value={[volumes[soundName] || 50]}
                  onValueChange={(v) => updateVolume(soundName, v[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-10 text-sm font-mono text-right">
                  {volumes[soundName] || 50}%
                </span>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Master Controls */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="lg"
          onClick={togglePlay}
          className="gap-2"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isPlaying ? "Stop All" : "Play"}
        </Button>

        <div className="flex items-center gap-3 flex-1">
          {masterVolume === 0 ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          )}
          <Slider
            value={[masterVolume]}
            onValueChange={(v) => setMasterVolume(v[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-sm font-mono">{masterVolume}%</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {[
          { name: "Deep Focus", sounds: ["Brown Noise", "Drone"] },
          { name: "Rainy Day", sounds: ["Rain", "Pink Noise"] },
          { name: "Cozy Fire", sounds: ["Fire", "Wind"] },
          { name: "Sleep", sounds: ["Pink Noise", "Brown Noise"] },
        ].map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => {
              // Stop current sounds
              activeSounds.forEach(stopSound);
              // Start preset sounds
              preset.sounds.forEach((soundName) => {
                const source = soundSources.find((s) => s.name === soundName);
                if (source) {
                  setVolumes((prev) => ({ ...prev, [soundName]: 50 }));
                  startSound(source);
                }
              });
              setActiveSounds(preset.sounds);
              setIsPlaying(true);
            }}
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
