// Polyrhythm Sequencer — Interactive drum machine with emergent patterns
// Multiple rhythms of different lengths create ever-changing beats
// Inspired by: Steve Reich's phasing patterns, West African polyrhythms

interface RhythmTrack {
  name: string;
  steps: boolean[]; // true = hit, false = rest
  length: number;
  currentStep: number;
  audio: AudioBuffer | null;
  gain: number;
  color: string;
}

interface SequencerState {
  tracks: RhythmTrack[];
  bpm: number;
  isPlaying: boolean;
  masterGain: number;
  swing: number; // 0-1, amount of swing feel
}

// Generate drum sounds using Web Audio API synthesis
function createDrumSound(
  ctx: AudioContext,
  type: "kick" | "snare" | "hihat" | "tom" | "clap" | "rim"
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const duration = type === "hihat" ? 0.1 : type === "kick" ? 0.5 : 0.3;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  switch (type) {
    case "kick": {
      // Sine wave with exponential frequency sweep
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const freq = 150 * Math.exp(-t * 15);
        const amp = Math.exp(-t * 5);
        data[i] = Math.sin(2 * Math.PI * freq * t) * amp;
      }
      break;
    }

    case "snare": {
      // Noise + tonal body
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const tone = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 10);
        const amp = Math.exp(-t * 8);
        data[i] = (noise * 0.6 + tone * 0.4) * amp;
      }
      break;
    }

    case "hihat": {
      // High-passed noise with metallic ring
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        // Simple high-pass approximation
        const prev = i > 0 ? data[i - 1] : 0;
        const filtered = noise - prev * 0.5;
        const amp = Math.exp(-t * 30);
        data[i] = filtered * amp * 0.5;
      }
      break;
    }

    case "tom": {
      // Sine sweep lower than kick
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const freq = 100 * Math.exp(-t * 10);
        const amp = Math.exp(-t * 4);
        data[i] = Math.sin(2 * Math.PI * freq * t) * amp;
      }
      break;
    }

    case "clap": {
      // Multiple noise bursts
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        // Clap envelope: multiple short bursts
        const burst1 = t > 0.01 && t < 0.03 ? 1 : 0;
        const burst2 = t > 0.04 && t < 0.06 ? 0.8 : 0;
        const burst3 = t > 0.07 && t < 0.12 ? 0.6 : 0;
        const env = (burst1 + burst2 + burst3) * Math.exp(-t * 10);
        data[i] = noise * env * 0.7;
      }
      break;
    }

    case "rim": {
      // Short metallic click
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const click = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 40);
        data[i] = click * 0.4;
      }
      break;
    }
  }

  return buffer;
}

// Create all drum sounds
function createDrumKit(ctx: AudioContext): Record<string, AudioBuffer> {
  return {
    kick: createDrumSound(ctx, "kick"),
    snare: createDrumSound(ctx, "snare"),
    hihat: createDrumSound(ctx, "hihat"),
    tom: createDrumSound(ctx, "tom"),
    clap: createDrumSound(ctx, "clap"),
    rim: createDrumSound(ctx, "rim"),
  };
}

// Initialize sequencer with default polyrhythmic patterns
function createDefaultTracks(): RhythmTrack[] {
  return [
    {
      name: "Kick",
      steps: [true, false, false, false, true, false, false, false],
      length: 8,
      currentStep: 0,
      audio: null,
      gain: 0.9,
      color: "#ff6b6b",
    },
    {
      name: "Snare",
      steps: [false, false, true, false, false, false, true, false],
      length: 8,
      currentStep: 0,
      audio: null,
      gain: 0.7,
      color: "#4ecdc4",
    },
    {
      name: "Hi-Hat",
      steps: [true, true, true, true, true, true, true, true, true, true, true, true],
      length: 12,
      currentStep: 0,
      audio: null,
      gain: 0.5,
      color: "#ffe66d",
    },
    {
      name: "Tom",
      steps: [true, false, false, true, false, false, true, false],
      length: 8,
      currentStep: 0,
      audio: null,
      gain: 0.6,
      color: "#a8e6cf",
    },
    {
      name: "Clap",
      steps: [false, false, false, true, false, false],
      length: 6,
      currentStep: 0,
      audio: null,
      gain: 0.7,
      color: "#ff8b94",
    },
  ];
}

// Main sequencer class
class PolyrhythmSequencer {
  private ctx: AudioContext | null = null;
  private drumKit: Record<string, AudioBuffer> = {};
  private state: SequencerState;
  private nextNoteTime: number = 0;
  private timerID: number | null = null;
  private stepInterval: number = 0.125; // 1/8 note at 120bpm = 0.25s
  private onStepCallback: ((trackIndex: number, stepIndex: number) => void) | null = null;

  constructor() {
    this.state = {
      tracks: createDefaultTracks(),
      bpm: 120,
      isPlaying: false,
      masterGain: 0.8,
      swing: 0.0,
    };
  }

  async init(): Promise<void> {
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.drumKit = createDrumKit(this.ctx);

    // Assign sounds to tracks
    const soundNames = ["kick", "snare", "hihat", "tom", "clap"];
    this.state.tracks.forEach((track, i) => {
      track.audio = this.drumKit[soundNames[i]] || null;
    });
  }

  private playSound(track: RhythmTrack, time: number): void {
    if (!this.ctx || !track.audio) return;

    const source = this.ctx.createBufferSource();
    source.buffer = track.audio;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = track.gain * this.state.masterGain;

    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    source.start(time);
  }

  private scheduler(): void {
    if (!this.ctx) return;

    // Schedule ahead time: 100ms
    const scheduleAheadTime = 0.1;

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      this.scheduleStep(this.nextNoteTime);
      this.advanceStep();
    }

    this.timerID = window.setTimeout(() => this.scheduler(), 25);
  }

  private scheduleStep(time: number): void {
    this.state.tracks.forEach((track, trackIndex) => {
      if (track.steps[track.currentStep]) {
        this.playSound(track, time);
      }

      if (this.onStepCallback) {
        // Use setTimeout for visual sync (not audio sync)
        const delay = Math.max(0, (time - (this.ctx?.currentTime || 0)) * 1000);
        setTimeout(() => {
          this.onStepCallback?.(trackIndex, track.currentStep);
        }, delay);
      }
    });
  }

  private advanceStep(): void {
    // Calculate step duration based on BPM
    const secondsPerBeat = 60.0 / this.state.bpm;
    const stepDuration = secondsPerBeat / 4; // 16th notes

    // Apply swing to every other 16th note
    let swingOffset = 0;
    const totalSteps = this.state.tracks.reduce((sum, t) => sum + t.currentStep, 0);
    if (totalSteps % 2 === 1) {
      swingOffset = stepDuration * this.state.swing * 0.5;
    }

    this.nextNoteTime += stepDuration + swingOffset;

    // Advance each track independently (polyrhythm!)
    this.state.tracks.forEach((track) => {
      track.currentStep = (track.currentStep + 1) % track.length;
    });
  }

  play(): void {
    if (this.state.isPlaying) return;
    if (!this.ctx) {
      this.init().then(() => this.play());
      return;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.state.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05; // Small delay to start
    this.scheduler();
  }

  stop(): void {
    this.state.isPlaying = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  toggleStep(trackIndex: number, stepIndex: number): void {
    const track = this.state.tracks[trackIndex];
    if (!track) return;

    // Extend steps array if needed
    while (track.steps.length <= stepIndex) {
      track.steps.push(false);
    }

    track.steps[stepIndex] = !track.steps[stepIndex];
  }

  setBpm(bpm: number): void {
    this.state.bpm = Math.max(40, Math.min(200, bpm));
  }

  setTrackGain(trackIndex: number, gain: number): void {
    if (this.state.tracks[trackIndex]) {
      this.state.tracks[trackIndex].gain = Math.max(0, Math.min(1, gain));
    }
  }

  setSwing(swing: number): void {
    this.state.swing = Math.max(0, Math.min(1, swing));
  }

  setMasterGain(gain: number): void {
    this.state.masterGain = Math.max(0, Math.min(1, gain));
  }

  getState(): SequencerState {
    return { ...this.state, tracks: this.state.tracks.map(t => ({ ...t })) };
  }

  onStep(callback: (trackIndex: number, stepIndex: number) => void): void {
    this.onStepCallback = callback;
  }

  // Preset patterns
  loadPreset(name: "default" | "afro-cuban" | "techno" | "jungle" | "minimal"): void {
    switch (name) {
      case "afro-cuban":
        this.state.tracks[0].steps = [true, false, false, true, false, false, true, false, false, false, true, false];
        this.state.tracks[0].length = 12;
        this.state.tracks[1].steps = [false, false, true, false, false, false, true, false, false, false, true, false];
        this.state.tracks[1].length = 12;
        this.state.tracks[2].steps = [true, false, true, false, true, false, true, false, true, false, true, false];
        this.state.tracks[2].length = 12;
        this.state.tracks[3].steps = [true, false, false, false, true, false, false, false];
        this.state.tracks[3].length = 8;
        this.state.tracks[4].steps = [false, false, false, true, false, false];
        this.state.tracks[4].length = 6;
        break;

      case "techno":
        this.state.tracks[0].steps = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
        this.state.tracks[0].length = 16;
        this.state.tracks[1].steps = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
        this.state.tracks[1].length = 16;
        this.state.tracks[2].steps = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        this.state.tracks[2].length = 16;
        this.state.tracks[3].steps = [false, false, true, false, false, false, true, false];
        this.state.tracks[3].length = 8;
        this.state.tracks[4].steps = [false, false, false, false, true, false, false, false];
        this.state.tracks[4].length = 8;
        break;

      case "jungle":
        this.state.tracks[0].steps = [true, false, false, true, false, false, true, false];
        this.state.tracks[0].length = 8;
        this.state.tracks[1].steps = [false, false, true, false, false, false, true, false];
        this.state.tracks[1].length = 8;
        this.state.tracks[2].steps = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
        this.state.tracks[2].length = 16;
        this.state.tracks[3].steps = [true, true, false, true, true, false, true, true];
        this.state.tracks[3].length = 8;
        this.state.tracks[4].steps = [false, false, false, true, false, false, false, true];
        this.state.tracks[4].length = 8;
        break;

      case "minimal":
        this.state.tracks[0].steps = [true, false, false, false, false, false, false, false];
        this.state.tracks[0].length = 8;
        this.state.tracks[1].steps = [false, false, false, false, true, false, false, false];
        this.state.tracks[1].length = 8;
        this.state.tracks[2].steps = [true, false, false, true, false, false, true, false];
        this.state.tracks[2].length = 8;
        this.state.tracks[3].steps = [false, false, true, false, false, false, false, false];
        this.state.tracks[3].length = 8;
        this.state.tracks[4].steps = [false, false, false, false, false, false, true, false];
        this.state.tracks[4].length = 8;
        break;

      default:
        this.state.tracks = createDefaultTracks();
    }
  }
}

// React component wrapper would go here - this is the core audio engine
export { PolyrhythmSequencer, createDrumKit, createDrumSound };
export type { RhythmTrack, SequencerState };
