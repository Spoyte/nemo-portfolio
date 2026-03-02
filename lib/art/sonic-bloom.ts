import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface SonicBloomParams {
  // Audio reactivity
  audioSensitivity: number;  // 0.5-3: How much audio affects the bloom
  frequencyRange: "low" | "mid" | "high" | "full";  // Which frequencies drive the animation
  
  // Visual parameters
  numFlowers: number;        // 3-12: Number of flowers
  petalCount: number;        // 5-16: Petals per flower
  bloomSize: number;         // 50-200: Base flower size
  
  // Animation
  growthSpeed: number;       // 0.5-3: How fast flowers bloom
  rotationSpeed: number;     // -2 to 2: Rotation speed
  pulseDecay: number;        // 0.1-0.9: How quickly pulses fade
  
  // Style
  colorScheme: "sunset" | "ocean" | "neon" | "pastel" | "monochrome";
  petalStyle: "smooth" | "jagged" | "layered";
  showStems: boolean;
  glowIntensity: number;     // 0-1: Glow effect strength
  
  // Simulation mode (when no real audio)
  simulatedAudio: boolean;
  beatTempo: number;         // 60-180: BPM for simulated beats
}

export const sonicBloomDefaultParams: SonicBloomParams = {
  audioSensitivity: 1.5,
  frequencyRange: "mid",
  numFlowers: 5,
  petalCount: 8,
  bloomSize: 100,
  growthSpeed: 1,
  rotationSpeed: 0.3,
  pulseDecay: 0.7,
  colorScheme: "sunset",
  petalStyle: "smooth",
  showStems: true,
  glowIntensity: 0.6,
  simulatedAudio: true,
  beatTempo: 120,
};

// Audio analysis state (simulated or real)
interface AudioState {
  bass: number;      // 0-1: Low frequency energy
  mid: number;       // 0-1: Mid frequency energy
  treble: number;    // 0-1: High frequency energy
  volume: number;    // 0-1: Overall volume
  beat: boolean;     // True on beat detection
}

// Individual flower state
interface Flower {
  x: number;
  y: number;
  baseSize: number;
  rotation: number;
  bloomLevel: number;     // 0-1: How open the flower is
  pulseLevel: number;     // 0-1: Current audio pulse
  hue: number;
  layerOffset: number;    // For layered petals
}

function generateColorPalette(scheme: string): { bg: string; colors: string[] } {
  const palettes: Record<string, { bg: string; colors: string[] }> = {
    sunset: {
      bg: "#1a0a2e",
      colors: ["#FF6B35", "#F7931E", "#FFD23F", "#EE4266", "#9B2335", "#FF8C42"],
    },
    ocean: {
      bg: "#0a1628",
      colors: ["#00D9FF", "#00B4D8", "#0077B6", "#023E8A", "#48CAE4", "#90E0EF"],
    },
    neon: {
      bg: "#0a0a0a",
      colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFA5"],
    },
    pastel: {
      bg: "#1a1a2e",
      colors: ["#FFB5BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E2BBFF"],
    },
    monochrome: {
      bg: "#0d0d0d",
      colors: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080", "#606060"],
    },
  };
  return palettes[scheme] || palettes.sunset;
}

function simulateAudio(time: number, tempo: number): AudioState {
  const bps = tempo / 60;
  const beatPhase = (time * bps / 1000) % 1;
  const beat = beatPhase < 0.1;
  
  // Create rhythmic patterns
  const bassPattern = Math.sin(time * 0.003 * bps) * 0.5 + 0.5;
  const midPattern = Math.sin(time * 0.007 * bps + 1) * 0.5 + 0.5;
  const treblePattern = Math.sin(time * 0.011 * bps + 2) * 0.5 + 0.5;
  
  // Add some randomness for organic feel
  const noise = Math.sin(time * 0.001) * Math.cos(time * 0.0023);
  
  return {
    bass: Math.max(0, Math.min(1, bassPattern * 0.7 + noise * 0.2 + (beat ? 0.3 : 0))),
    mid: Math.max(0, Math.min(1, midPattern * 0.6 + noise * 0.15)),
    treble: Math.max(0, Math.min(1, treblePattern * 0.5 + noise * 0.1)),
    volume: (bassPattern + midPattern + treblePattern) / 3,
    beat,
  };
}

function getAudioEnergy(audio: AudioState, range: string): number {
  switch (range) {
    case "low": return audio.bass;
    case "mid": return audio.mid;
    case "high": return audio.treble;
    case "full": return audio.volume;
    default: return audio.mid;
  }
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  color: string,
  style: string,
  glow: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  // Glow effect
  if (glow > 0) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 20 * glow;
  }
  
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  
  if (style === "smooth") {
    // Smooth curved petal
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      width * 0.5, -length * 0.3,
      width * 0.5, -length * 0.7,
      0, -length
    );
    ctx.bezierCurveTo(
      -width * 0.5, -length * 0.7,
      -width * 0.5, -length * 0.3,
      0, 0
    );
  } else if (style === "jagged") {
    // Jagged/abstract petal
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.3, -length * 0.4);
    ctx.lineTo(width * 0.1, -length * 0.6);
    ctx.lineTo(width * 0.4, -length * 0.8);
    ctx.lineTo(0, -length);
    ctx.lineTo(-width * 0.4, -length * 0.8);
    ctx.lineTo(-width * 0.1, -length * 0.6);
    ctx.lineTo(-width * 0.3, -length * 0.4);
    ctx.closePath();
  } else {
    // Layered petal (drawn as simple shape, layering happens at flower level)
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(width * 0.6, -length * 0.5, 0, -length);
    ctx.quadraticCurveTo(-width * 0.6, -length * 0.5, 0, 0);
  }
  
  ctx.fill();
  
  // Add subtle center line
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length * 0.9);
  ctx.stroke();
  ctx.globalAlpha = 1;
  
  ctx.restore();
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  thickness: number
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = "round";
  
  // Curved stem
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const cpX = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
  const cpY = (y1 + y2) / 2;
  ctx.quadraticCurveTo(cpX, cpY, x2, y2);
  ctx.stroke();
}

export function renderSonicBloom(
  ctx: CanvasRenderingContext2D,
  params: Partial<SonicBloomParams> = {},
  time: number = 0
): void {
  const config = { ...sonicBloomDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  
  const palette = generateColorPalette(config.colorScheme);
  
  // Clear with gradient background
  const bgGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  bgGradient.addColorStop(0, palette.bg);
  bgGradient.addColorStop(1, "#000000");
  
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Get audio state
  const audio = config.simulatedAudio 
    ? simulateAudio(time, config.beatTempo)
    : { bass: 0.5, mid: 0.5, treble: 0.5, volume: 0.5, beat: false };
  
  const audioEnergy = getAudioEnergy(audio, config.frequencyRange);
  
  // Initialize or update flowers
  const flowers: Flower[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let i = 0; i < config.numFlowers; i++) {
    // Distribute flowers in a circle with some randomness
    const angle = (i / config.numFlowers) * Math.PI * 2 + time * config.rotationSpeed * 0.0001;
    const radius = Math.min(width, height) * 0.25 * (0.8 + Math.sin(time * 0.0005 + i) * 0.2);
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.8; // Slightly flattened
    
    // Each flower responds to audio slightly differently
    const offsetPhase = i * 0.5;
    const individualPulse = Math.sin(time * 0.003 + offsetPhase) * 0.3 + audioEnergy * 0.7;
    
    flowers.push({
      x,
      y,
      baseSize: config.bloomSize * (0.7 + Math.random() * 0.6),
      rotation: time * config.rotationSpeed * 0.001 + offsetPhase,
      bloomLevel: Math.min(1, (time * config.growthSpeed * 0.0005 + i * 0.2) % 2),
      pulseLevel: individualPulse * config.audioSensitivity,
      hue: (i / config.numFlowers) * 360,
      layerOffset: i * 0.3,
    });
  }
  
  // Draw stems first (behind flowers)
  if (config.showStems) {
    ctx.globalAlpha = 0.4;
    flowers.forEach((flower, i) => {
      const stemColor = palette.colors[i % palette.colors.length];
      // Draw stem from bottom of screen to flower
      drawStem(
        ctx,
        flower.x,
        flower.y + flower.baseSize * 0.5,
        flower.x + (flower.x - centerX) * 0.3,
        height,
        stemColor,
        3 + flower.pulseLevel * 2
      );
    });
    ctx.globalAlpha = 1;
  }
  
  // Draw flowers
  flowers.forEach((flower, flowerIndex) => {
    const colorIndex = flowerIndex % palette.colors.length;
    const baseColor = palette.colors[colorIndex];
    
    // Calculate bloom size based on audio pulse
    const pulseScale = 1 + flower.pulseLevel * 0.5;
    const currentSize = flower.baseSize * flower.bloomLevel * pulseScale;
    
    // Draw petals
    const numPetals = config.petalCount;
    
    if (config.petalStyle === "layered") {
      // Draw multiple layers for depth
      const layers = 3;
      for (let layer = 0; layer < layers; layer++) {
        const layerScale = 1 - layer * 0.25;
        const layerRotation = flower.rotation + layer * 0.3;
        const layerAlpha = 1 - layer * 0.2;
        
        ctx.globalAlpha = layerAlpha;
        
        for (let i = 0; i < numPetals; i++) {
          const angle = (i / numPetals) * Math.PI * 2 + layerRotation;
          const petalLength = currentSize * layerScale * (0.8 + flower.pulseLevel * 0.2);
          const petalWidth = currentSize * 0.25 * layerScale;
          
          // Vary color slightly per layer
          const layerColor = palette.colors[(colorIndex + layer) % palette.colors.length];
          
          drawPetal(
            ctx,
            flower.x,
            flower.y,
            angle,
            petalLength,
            petalWidth,
            layerColor,
            "smooth",
            config.glowIntensity * (1 - layer * 0.3)
          );
        }
      }
    } else {
      // Single layer
      for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2 + flower.rotation;
        const petalLength = currentSize * (0.8 + flower.pulseLevel * 0.3);
        const petalWidth = currentSize * 0.3;
        
        drawPetal(
          ctx,
          flower.x,
          flower.y,
          angle,
          petalLength,
          petalWidth,
          baseColor,
          config.petalStyle,
          config.glowIntensity
        );
      }
    }
    
    // Draw flower center
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 30 * config.glowIntensity;
    ctx.shadowColor = baseColor;
    
    const centerGradient = ctx.createRadialGradient(
      flower.x, flower.y, 0,
      flower.x, flower.y, currentSize * 0.15
    );
    centerGradient.addColorStop(0, "#FFFFFF");
    centerGradient.addColorStop(0.5, baseColor);
    centerGradient.addColorStop(1, "transparent");
    
    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(flower.x, flower.y, currentSize * 0.15 * (1 + flower.pulseLevel * 0.5), 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  });
  
  // Draw audio visualization overlay (subtle)
  if (config.glowIntensity > 0) {
    ctx.globalAlpha = 0.1;
    const waveCount = 3;
    for (let w = 0; w < waveCount; w++) {
      ctx.strokeStyle = palette.colors[w % palette.colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x += 5) {
        const normalizedX = x / width;
        const wavePhase = time * 0.002 + w * 2;
        const audioMod = audioEnergy * 50;
        
        const y = height - 50 + 
          Math.sin(normalizedX * Math.PI * 4 + wavePhase) * (20 + audioMod) *
          Math.sin(normalizedX * Math.PI * 2);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  
  // Beat flash effect
  if (audio.beat && config.glowIntensity > 0) {
    ctx.globalAlpha = 0.1 * audioEnergy;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }
}

// Backward compatibility: ArtGenerator interface
export const sonicBloom: ArtGenerator = {
  id: "sonic-bloom",
  name: "Sonic Bloom",
  category: "interactive",
  render: (ctx, params, time) => renderSonicBloom(ctx, params as SonicBloomParams, time),
  defaultParams: sonicBloomDefaultParams,
};

export default sonicBloom;
