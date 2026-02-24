"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, Mic, MicOff } from "lucide-react";

interface VisualizerProps {
  className?: string;
}

export function SoundVisualizer({ className }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      sourceRef.current.connect(analyserRef.current);
      
      setHasPermission(true);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

      const hue = i * (360 / bufferLength);
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`;
      
      // Draw mirrored bars
      ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${hue}, 70%, 50%, 0.5)`;

      x += barWidth + 1;
    }

    ctx.shadowBlur = 0;

    // Draw circular visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.3;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(220, 38, 38, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw frequency ring
    ctx.beginPath();
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2;
      const amp = (dataArray[i] / 255) * 50;
      const x = centerX + Math.cos(angle) * (radius + amp);
      const y = centerY + Math.sin(angle) * (radius + amp);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(220, 38, 38, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      draw();
    }
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, draw]);

  // Demo mode - simulate audio data when no microphone
  useEffect(() => {
    if (!isPlaying || hasPermission) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const drawDemo = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 64;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(time + i * 0.2) * 50 + 60 + Math.random() * 30;
        const hue = (i / bars) * 360;
        
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.7)`;
        ctx.fillRect(
          i * barWidth,
          canvas.height / 2 - height / 2,
          barWidth - 2,
          height
        );
      }

      time += 0.05;
      animationRef.current = requestAnimationFrame(drawDemo);
    };

    drawDemo();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, hasPermission]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-48 rounded-xl bg-black/5 dark:bg-white/5"
      />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        {!hasPermission ? (
          <Button
            variant="outline"
            size="sm"
            onClick={startAudio}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Mic className="h-4 w-4 mr-1" />
            Enable Mic
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={stopAudio}
            className="bg-background/80 backdrop-blur-sm"
          >
            <MicOff className="h-4 w-4 mr-1" />
            Disable
          </Button>
        )}
        <Button
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          onClick={() => isPlaying ? stopAudio() : setIsPlaying(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Play Demo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
