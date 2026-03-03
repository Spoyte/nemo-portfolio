"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SoundWaveVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };

    resize();
    window.addEventListener("resize", resize);

    const bars = 64;
    const barWidth = canvas.offsetWidth / bars;

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      let dataArray: Uint8Array | null = null;
      
      if (isPlaying && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        dataArray = dataArrayRef.current;
      }

      for (let i = 0; i < bars; i++) {
        let barHeight: number;
        
        if (dataArray) {
          const dataIndex = Math.floor((i / bars) * dataArray.length);
          barHeight = (dataArray[dataIndex] / 255) * height * 0.8;
        } else {
          // Idle animation
          const time = Date.now() / 1000;
          barHeight = Math.sin(time * 2 + i * 0.2) * 20 + 30;
        }

        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#dc2626");
        gradient.addColorStop(0.5, "#ea580c");
        gradient.addColorStop(1, "#dc2626");

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#dc2626";
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!isPlaying) {
      // Initialize audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Create oscillator for demo
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-border p-6">
        <canvas
          ref={canvasRef}
          className="w-full h-32"
          style={{ width: "100%", height: "128px" }}
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-2">
          {isPlaying ? "Visualizing audio..." : "Click play to visualize"}
        </p>
      </div>
    </div>
  );
}
