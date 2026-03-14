"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PolyrhythmSequencer } from "@/lib/art/polyrhythm-sequencer";
import { Play, Pause, RotateCcw, Volume2, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Track {
  name: string;
  steps: boolean[];
  length: number;
  currentStep: number;
  gain: number;
  color: string;
}

export default function PolyrhythmSequencerPage() {
  const sequencerRef = useRef<PolyrhythmSequencer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0);
  const [masterGain, setMasterGain] = useState(0.8);
  const [tracks, setTracks] = useState<Track[]>([
    { name: "Kick", steps: [true, false, false, false, true, false, false, false], length: 8, currentStep: 0, gain: 0.9, color: "#ff6b6b" },
    { name: "Snare", steps: [false, false, true, false, false, false, true, false], length: 8, currentStep: 0, gain: 0.7, color: "#4ecdc4" },
    { name: "Hi-Hat", steps: [true, true, true, true, true, true, true, true, true, true, true, true], length: 12, currentStep: 0, gain: 0.5, color: "#ffe66d" },
    { name: "Tom", steps: [true, false, false, true, false, false, true, false], length: 8, currentStep: 0, gain: 0.6, color: "#a8e6cf" },
    { name: "Clap", steps: [false, false, false, true, false, false], length: 6, currentStep: 0, gain: 0.7, color: "#ff8b94" },
  ]);
  const [activeSteps, setActiveSteps] = useState<{ track: number; step: number } | null>(null);

  useEffect(() => {
    const seq = new PolyrhythmSequencer();
    sequencerRef.current = seq;

    seq.onStep((trackIndex, stepIndex) => {
      setActiveSteps({ track: trackIndex, step: stepIndex });
      setTracks(prev => prev.map((t, i) => 
        i === trackIndex ? { ...t, currentStep: stepIndex } : t
      ));
    });

    return () => {
      seq.stop();
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!sequencerRef.current) return;

    if (isPlaying) {
      sequencerRef.current.stop();
      setIsPlaying(false);
    } else {
      await sequencerRef.current.init();
      sequencerRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleStep = useCallback((trackIndex: number, stepIndex: number) => {
    if (!sequencerRef.current) return;

    sequencerRef.current.toggleStep(trackIndex, stepIndex);
    setTracks(prev => prev.map((t, i) => {
      if (i !== trackIndex) return t;
      const newSteps = [...t.steps];
      while (newSteps.length <= stepIndex) newSteps.push(false);
      newSteps[stepIndex] = !newSteps[stepIndex];
      return { ...t, steps: newSteps };
    }));
  }, []);

  const handleBpmChange = useCallback((value: number[]) => {
    const newBpm = value[0];
    setBpm(newBpm);
    sequencerRef.current?.setBpm(newBpm);
  }, []);

  const handleSwingChange = useCallback((value: number[]) => {
    const newSwing = value[0] / 100;
    setSwing(newSwing);
    sequencerRef.current?.setSwing(newSwing);
  }, []);

  const handleGainChange = useCallback((value: number[]) => {
    const newGain = value[0] / 100;
    setMasterGain(newGain);
    sequencerRef.current?.setMasterGain(newGain);
  }, []);

  const reset = useCallback(() => {
    sequencerRef.current?.stop();
    setIsPlaying(false);
    setTracks([
      { name: "Kick", steps: [true, false, false, false, true, false, false, false], length: 8, currentStep: 0, gain: 0.9, color: "#ff6b6b" },
      { name: "Snare", steps: [false, false, true, false, false, false, true, false], length: 8, currentStep: 0, gain: 0.7, color: "#4ecdc4" },
      { name: "Hi-Hat", steps: [true, true, true, true, true, true, true, true, true, true, true, true], length: 12, currentStep: 0, gain: 0.5, color: "#ffe66d" },
      { name: "Tom", steps: [true, false, false, true, false, false, true, false], length: 8, currentStep: 0, gain: 0.6, color: "#a8e6cf" },
      { name: "Clap", steps: [false, false, false, true, false, false], length: 6, currentStep: 0, gain: 0.7, color: "#ff8b94" },
    ]);
  }, []);

  const maxSteps = Math.max(...tracks.map(t => t.length));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Music className="w-8 h-8 text-purple-400" />
            Polyrhythm Sequencer
          </h1>
          <p className="text-slate-400">
            Multiple rhythms of different lengths create ever-changing patterns. 
            Each track loops independently — the interplay is the music.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-wrap items-center gap-6">
            <Button
              onClick={togglePlay}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? "Stop" : "Play"}
            </Button>

            <Button
              onClick={reset}
              variant="outline"
              className="px-4 py-3 rounded-lg border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <span className="text-sm text-slate-400 w-12">BPM</span>
              <Slider
                value={[bpm]}
                onValueChange={handleBpmChange}
                min={40}
                max={200}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-mono w-12 text-right">{bpm}</span>
            </div>

            <div className="flex items-center gap-4 min-w-[200px]">
              <Volume2 className="w-5 h-5 text-slate-400" />
              <Slider
                value={[Math.round(masterGain * 100)]}
                onValueChange={handleGainChange}
                min={0}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400 w-16">Swing</span>
            <Slider
              value={[Math.round(swing * 100)]}
              onValueChange={handleSwingChange}
              min={0}
              max={50}
              step={1}
              className="flex-1 max-w-xs"
            />
            <span className="text-sm font-mono w-12 text-right">{Math.round(swing * 100)}%</span>
          </div>
        </div>

        {/* Sequencer Grid */}
        <div className="bg-slate-800/30 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="space-y-4">
            {tracks.map((track, trackIndex) => (
              <div key={track.name} className="flex items-center gap-4">
                <div className="w-20 text-right">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: track.color }}
                  >
                    {track.name}
                  </span>
                  <div className="text-xs text-slate-500">
                    {track.length} steps
                  </div>
                </div>

                <div className="flex-1 flex gap-1">
                  {Array.from({ length: maxSteps }).map((_, stepIndex) => {
                    const isActive = track.steps[stepIndex] ?? false;
                    const isCurrent = track.currentStep === stepIndex % track.length;
                    const isInRange = stepIndex < track.length;

                    return (
                      <button
                        key={stepIndex}
                        onClick={() => toggleStep(trackIndex, stepIndex)}
                        disabled={!isInRange}
                        className={`
                          flex-1 h-12 rounded transition-all duration-100
                          ${!isInRange ? "opacity-20 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
                          ${isActive
                            ? "shadow-lg"
                            : "bg-slate-700/50 hover:bg-slate-600/50"
                          }
                          ${isCurrent && isPlaying ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800" : ""}
                        `}
                        style={{
                          backgroundColor: isActive ? track.color : undefined,
                          boxShadow: isActive ? `0 0 12px ${track.color}50` : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-700 flex flex-wrap gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-700/50" />
              <span>Rest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500" />
              <span>Hit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-700/50 ring-2 ring-white" />
              <span>Current step</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-sm text-slate-500">
          <p>
            <strong className="text-slate-400">How it works:</strong> Each row is a rhythm with its own length. 
            When tracks have different lengths (8, 12, 6...), they fall in and out of sync, creating 
            <span className="text-purple-400">polyrhythms</span>. 
            The pattern only repeats when all lengths align — with 8, 12, and 6, that's every 24 beats.
          </p>
        </div>
      </div>
    </div>
  );
}
