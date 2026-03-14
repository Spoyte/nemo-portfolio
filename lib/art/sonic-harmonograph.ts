import { ArtGenerator, ArtParams, ParamConfig } from "./core";

// Sonic Harmonograph - Audio-visual harmonograph with FM synthesis
// Each pendulum drives both visual motion and audio frequency
// Creates unified audiovisual experiences from shared physical parameters

export interface SonicHarmonographParams extends ArtParams {
  // Visual parameters
  frequencyX1: number;
  frequencyX2: number;
  frequencyY1: number;
  frequencyY2: number;
  amplitudeX1: number;
  amplitudeX2: number;
  amplitudeY1: number;
  amplitudeY2: number;
  damping: number;
  phaseX1: number;
  phaseX2: number;
  phaseY1: number;
  phaseY2: number;
  lineWidth: number;
  opacity: number;
  iterations: number;
  colorScheme: "monochrome" | "gradient" | "rainbow" | "fire" | "ocean" | "neon" | "gold";
  backgroundStyle: "black" | "dark-blue" | "deep-purple" | "void";
  rainbowSpeed: number;
  rotation: number;
  autoRotate: boolean;
  rotationSpeed: number;
  // Audio parameters
  audioEnabled: boolean;
  baseFrequency: number;
  fmDepth: number;
  harmonicRatio: number;
  audioVolume: number;
  audioVisualSync: number;
}

// Audio state (module-level to persist across renders)
interface AudioState {
  ctx: AudioContext | null;
  carrier: OscillatorNode | null;
  modulator: OscillatorNode | null;
  modGain: GainNode | null;
  masterGain: GainNode | null;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  startTime: number;
}

const audioState: AudioState = {
  ctx: null,
  carrier: null,
  modulator: null,
  modGain: null,
  masterGain: null,
  analyser: null,
  isPlaying: false,
  startTime: 0,
};

// Initialize audio context and FM synthesis
function initAudio(params: SonicHarmonographParams): boolean {
  if (typeof window === "undefined") return false;
  
  if (!audioState.ctx) {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;
    audioState.ctx = new AudioContextClass();
  }
  
  const ctx = audioState.ctx;
  
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  // Create nodes if not exists
  if (!audioState.carrier) {
    // Carrier oscillator (the sound we hear)
    audioState.carrier = ctx.createOscillator();
    audioState.carrier.type = "sine";
    
    // Modulator oscillator (modulates carrier frequency)
    audioState.modulator = ctx.createOscillator();
    audioState.modulator.type = "sine";
    
    // Modulation depth (how much the modulator affects carrier)
    audioState.modGain = ctx.createGain();
    
    // Master volume
    audioState.masterGain = ctx.createGain();
    audioState.masterGain.gain.value = params.audioVolume;
    
    // Analyser for visualization
    audioState.analyser = ctx.createAnalyser();
    audioState.analyser.fftSize = 256;
    audioState.analyser.smoothingTimeConstant = 0.8;
    
    // Connect the FM synthesis graph
    // modulator -> modGain -> carrier.frequency
    // carrier -> masterGain -> analyser -> destination
    audioState.modulator.connect(audioState.modGain);
    audioState.modGain.connect(audioState.carrier.frequency);
    audioState.carrier.connect(audioState.masterGain);
    audioState.masterGain.connect(audioState.analyser);
    audioState.analyser.connect(ctx.destination);
    
    // Start oscillators
    audioState.carrier.start();
    audioState.modulator.start();
    audioState.startTime = ctx.currentTime;
    audioState.isPlaying = true;
  }
  
  return true;
}

// Stop and cleanup audio
function stopAudio(): void {
  if (audioState.carrier) {
    try {
      audioState.carrier.stop();
      audioState.modulator?.stop();
    } catch (e) {
      // Already stopped
    }
    audioState.carrier = null;
    audioState.modulator = null;
    audioState.modGain = null;
    audioState.masterGain = null;
    audioState.analyser = null;
    audioState.isPlaying = false;
  }
}

// Update audio parameters based on visual pendulum state
function updateAudio(params: SonicHarmonographParams, time: number): void {
  if (!params.audioEnabled || !audioState.isPlaying) {
    if (audioState.isPlaying && !params.audioEnabled) {
      stopAudio();
    }
    return;
  }
  
  if (!initAudio(params)) return;
  
  const ctx = audioState.ctx!;
  const carrier = audioState.carrier!;
  const modulator = audioState.modulator!;
  const modGain = audioState.modGain!;
  const masterGain = audioState.masterGain!;
  
  // Map pendulum frequencies to audio frequencies
  // Visual frequencies are small (0.1-10), audio needs 100-800Hz
  const freqScale = params.baseFrequency / 2; // Scale factor
  
  // Carrier frequency from X1 pendulum (main visual driver)
  const carrierFreq = params.baseFrequency + 
    (params.frequencyX1 * freqScale * 10) + 
    (Math.sin(time * 0.5) * params.fmDepth * 0.3);
  
  // Modulator frequency from Y1 pendulum (creates harmonic richness)
  const modFreq = carrierFreq * params.harmonicRatio + 
    (params.frequencyY1 * freqScale * 5);
  
  // Modulation depth from amplitude (more motion = more modulation)
  const modDepth = params.fmDepth * 
    (1 + (params.amplitudeX1 + params.amplitudeY1) / 600) *
    (0.5 + 0.5 * Math.sin(time * 0.3));
  
  // Apply envelope based on time (slow attack, long sustain)
  const elapsed = ctx.currentTime - audioState.startTime;
  const envelope = Math.min(1, elapsed / 2) * Math.exp(-elapsed / 30); // 2s attack, 30s decay
  
  // Smooth parameter updates
  carrier.frequency.setTargetAtTime(carrierFreq, ctx.currentTime, 0.1);
  modulator.frequency.setTargetAtTime(modFreq, ctx.currentTime, 0.1);
  modGain.gain.setTargetAtTime(modDepth, ctx.currentTime, 0.1);
  masterGain.gain.setTargetAtTime(params.audioVolume * envelope, ctx.currentTime, 0.1);
}

// Get audio frequency data for visualization
function getAudioData(): Uint8Array | null {
  if (!audioState.analyser || !audioState.isPlaying) return null;
  const data = new Uint8Array(audioState.analyser.frequencyBinCount);
  audioState.analyser.getByteFrequencyData(data);
  return data;
}

function getColorFromScheme(
  scheme: SonicHarmonographParams["colorScheme"],
  t: number,
  hueOffset: number,
  audioIntensity: number
): string {
  // Blend audio intensity into color for audio-visual sync
  const audioBoost = audioIntensity * params.audioVisualSync;
  
  switch (scheme) {
    case "monochrome":
      const gray = Math.floor(255 * (0.3 + 0.7 * (1 - t)) * (1 + audioBoost * 0.5));
      return `rgb(${Math.min(255, gray)}, ${Math.min(255, gray)}, ${Math.min(255, gray)})`;
    case "gradient":
      const r = Math.floor(255 * (1 - t * 0.5) * (1 + audioBoost));
      const g = Math.floor(200 * (1 - t) * (1 + audioBoost * 0.5));
      const b = Math.floor(100 + 155 * t);
      return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${b})`;
    case "rainbow":
      const hue = (t * 360 + hueOffset + audioBoost * 60) % 360;
      return `hsl(${hue}, 80%, ${60 + audioBoost * 20}%)`;
    case "fire":
      return `rgb(255, ${Math.floor((100 + 155 * (1 - t)) * (1 + audioBoost * 0.3))}, ${Math.floor(50 * (1 - t) * (1 - audioBoost * 0.5))})`;
    case "ocean":
      return `rgb(${Math.floor(50 + 100 * (1 - t))}, ${Math.floor((100 + 155 * (1 - t * 0.5)) * (1 + audioBoost * 0.2))}, ${Math.floor((200 + 55 * t) * (1 + audioBoost * 0.3))})`;
    case "neon":
      const nh = (t * 180 + hueOffset + audioBoost * 90) % 360;
      return `hsl(${nh}, 100%, ${70 + audioBoost * 30}%)`;
    case "gold":
      const goldIntensity = 0.6 + 0.4 * (1 - t) + audioBoost * 0.3;
      return `rgb(255, ${Math.floor(215 * goldIntensity)}, ${Math.floor(100 * goldIntensity)})`;
    default:
      return "white";
  }
}

function getBackgroundColor(style: SonicHarmonographParams["backgroundStyle"]): string {
  const colors: Record<string, string> = {
    black: "#000000",
    "dark-blue": "#0a0a1a",
    "deep-purple": "#1a0a1a",
    void: "#050505",
  };
  return colors[style] || "#000000";
}

// Module-level params for color function access
let params: SonicHarmonographParams;

export function renderSonicHarmonograph(
  ctx: CanvasRenderingContext2D,
  p: SonicHarmonographParams,
  time: number = 0
): void {
  params = p; // Store for color function
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Update audio based on current parameters
  updateAudio(params, time);
  
  // Get audio data for visualization
  const audioData = getAudioData();
  const audioIntensity = audioData 
    ? audioData.reduce((a, b) => a + b, 0) / audioData.length / 255 
    : 0;

  ctx.fillStyle = getBackgroundColor(params.backgroundStyle);
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width, height) / 600;
  const currentRotation = (params.rotation + (params.autoRotate ? time * params.rotationSpeed * 60 : 0)) * Math.PI / 180;
  const hueOffset = params.autoRotate ? time * params.rainbowSpeed * 60 : 0;

  ctx.lineWidth = params.lineWidth * (1 + audioIntensity * 0.5);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const points: { x: number; y: number; t: number; intensity: number }[] = [];
  const dt = 0.01;

  for (let i = 0; i < params.iterations; i++) {
    const t = i * dt;
    const decay = Math.exp(-params.damping * t * 100);
    
    // Add audio-driven modulation to the motion
    const audioMod = params.audioEnabled ? 1 + audioIntensity * Math.sin(t * 10 + time) * 0.1 : 1;

    let x = params.amplitudeX1 * Math.sin(params.frequencyX1 * t * audioMod + params.phaseX1) * decay;
    x += params.amplitudeX2 * Math.sin(params.frequencyX2 * t * audioMod + params.phaseX2) * decay;

    let y = params.amplitudeY1 * Math.sin(params.frequencyY1 * t * audioMod + params.phaseY1) * decay;
    y += params.amplitudeY2 * Math.sin(params.frequencyY2 * t * audioMod + params.phaseY2) * decay;

    const rx = x * Math.cos(currentRotation) - y * Math.sin(currentRotation);
    const ry = x * Math.sin(currentRotation) + y * Math.cos(currentRotation);

    points.push({
      x: centerX + rx * scale,
      y: centerY + ry * scale,
      t: i / params.iterations,
      intensity: decay * (1 + audioIntensity * 0.3),
    });
  }

  if (points.length > 1) {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      const color = getColorFromScheme(params.colorScheme, p1.t, hueOffset, audioIntensity);
      ctx.strokeStyle = color;
      ctx.globalAlpha = params.opacity * (1 - p1.t * 0.5) * p1.intensity;
      ctx.stroke();
    }
  }

  // Draw audio visualization overlay
  if (params.audioEnabled && audioData) {
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = getColorFromScheme(params.colorScheme, 0.5, hueOffset, audioIntensity);
    ctx.lineWidth = 1;
    ctx.beginPath();
    const barWidth = width / audioData.length;
    for (let i = 0; i < audioData.length; i++) {
      const barHeight = (audioData[i] / 255) * height * 0.2;
      const x = i * barWidth;
      const y = height - barHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  
  // Draw audio status indicator
  if (params.audioEnabled) {
    ctx.fillStyle = audioState.isPlaying ? "#00ff00" : "#ff6600";
    ctx.beginPath();
    ctx.arc(width - 20, 20, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(audioState.isPlaying ? "♪ AUDIO ON" : "♪ CLICK TO START", width - 30, 24);
  }
}

export const sonicHarmonographParams: Record<string, ParamConfig> = {
  // Visual parameters
  frequencyX1: { name: "Freq X1", type: "range", min: 0.1, max: 10, step: 0.01, default: 2.01 },
  frequencyX2: { name: "Freq X2", type: "range", min: 0.1, max: 10, step: 0.01, default: 3.02 },
  frequencyY1: { name: "Freq Y1", type: "range", min: 0.1, max: 10, step: 0.01, default: 3.0 },
  frequencyY2: { name: "Freq Y2", type: "range", min: 0.1, max: 10, step: 0.01, default: 2.0 },
  amplitudeX1: { name: "Amp X1", type: "range", min: 0, max: 300, step: 10, default: 200 },
  amplitudeX2: { name: "Amp X2", type: "range", min: 0, max: 200, step: 10, default: 100 },
  amplitudeY1: { name: "Amp Y1", type: "range", min: 0, max: 300, step: 10, default: 200 },
  amplitudeY2: { name: "Amp Y2", type: "range", min: 0, max: 200, step: 10, default: 100 },
  damping: { name: "Damping", type: "range", min: 0.0001, max: 0.02, step: 0.0001, default: 0.002 },
  phaseX1: { name: "Phase X1", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: 0 },
  phaseX2: { name: "Phase X2", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 2 },
  phaseY1: { name: "Phase Y1", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 4 },
  phaseY2: { name: "Phase Y2", type: "range", min: 0, max: Math.PI * 2, step: 0.1, default: Math.PI / 3 },
  lineWidth: { name: "Line Width", type: "range", min: 0.1, max: 3, step: 0.1, default: 0.5 },
  opacity: { name: "Opacity", type: "range", min: 0.1, max: 1, step: 0.05, default: 0.6 },
  iterations: { name: "Iterations", type: "range", min: 1000, max: 20000, step: 500, default: 5000 },
  colorScheme: { name: "Colors", type: "select", options: ["monochrome", "gradient", "rainbow", "fire", "ocean", "neon", "gold"], default: "gradient" },
  backgroundStyle: { name: "Background", type: "select", options: ["black", "dark-blue", "deep-purple", "void"], default: "black" },
  rainbowSpeed: { name: "Rainbow Speed", type: "range", min: 0, max: 5, step: 0.1, default: 0.5 },
  rotation: { name: "Rotation", type: "range", min: 0, max: 360, step: 1, default: 0 },
  autoRotate: { name: "Auto Rotate", type: "select", options: ["true", "false"], default: "false" },
  rotationSpeed: { name: "Rotation Speed", type: "range", min: -2, max: 2, step: 0.1, default: 0.2 },
  // Audio parameters
  audioEnabled: { name: "Audio", type: "select", options: ["true", "false"], default: "false" },
  baseFrequency: { name: "Base Freq", type: "range", min: 50, max: 400, step: 10, default: 220 },
  fmDepth: { name: "FM Depth", type: "range", min: 0, max: 500, step: 10, default: 100 },
  harmonicRatio: { name: "Harmonic Ratio", type: "range", min: 0.5, max: 4, step: 0.1, default: 1.5 },
  audioVolume: { name: "Volume", type: "range", min: 0, max: 0.5, step: 0.01, default: 0.15 },
  audioVisualSync: { name: "A/V Sync", type: "range", min: 0, max: 2, step: 0.1, default: 1 },
};

export const sonicHarmonographDefaultParams: SonicHarmonographParams = {
  frequencyX1: 2.01,
  frequencyX2: 3.02,
  frequencyY1: 3.0,
  frequencyY2: 2.0,
  amplitudeX1: 200,
  amplitudeX2: 100,
  amplitudeY1: 200,
  amplitudeY2: 100,
  damping: 0.002,
  phaseX1: 0,
  phaseX2: Math.PI / 2,
  phaseY1: Math.PI / 4,
  phaseY2: Math.PI / 3,
  lineWidth: 0.5,
  opacity: 0.6,
  iterations: 5000,
  colorScheme: "gradient",
  backgroundStyle: "black",
  rainbowSpeed: 0.5,
  rotation: 0,
  autoRotate: false,
  rotationSpeed: 0.2,
  audioEnabled: false,
  baseFrequency: 220,
  fmDepth: 100,
  harmonicRatio: 1.5,
  audioVolume: 0.15,
  audioVisualSync: 1,
};

export const sonicHarmonograph: ArtGenerator = {
  name: "Sonic Harmonograph",
  description: "Audio-visual harmonograph with FM synthesis — each pendulum drives both visual motion and audio frequency. Enable audio for a unified sensory experience.",
  params: sonicHarmonographParams,
  generate: renderSonicHarmonograph,
};
