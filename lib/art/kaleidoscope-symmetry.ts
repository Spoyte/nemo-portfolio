import {
  ArtGenerator,
  fillCanvas,
  createNoise,
  hslToRgb,
} from "./core";

// Kaleidoscope Symmetry - Recursive mirrored patterns with geometric precision
// Creates mandala-like designs through rotational and reflective symmetry

export const kaleidoscopeSymmetry: ArtGenerator = {
  name: "Kaleidoscope",
  description: "Recursive mirrored patterns with rotational symmetry — like looking through a kaleidoscope",
  params: {
    segments: {
      name: "Symmetry Segments",
      type: "range",
      min: 3,
      max: 16,
      step: 1,
      default: 8,
    },
    layers: {
      name: "Pattern Layers",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 4,
    },
    complexity: {
      name: "Pattern Complexity",
      type: "range",
      min: 10,
      max: 100,
      step: 10,
      default: 40,
    },
    colorShift: {
      name: "Color Shift",
      type: "range",
      min: 0,
      max: 360,
      step: 15,
      default: 0,
    },
    mirrorMode: {
      name: "Mirror Mode",
      type: "select",
      options: ["reflect", "rotate", "both"],
      default: "both",
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const { segments, layers, complexity, colorShift, mirrorMode } = params;

    // Dark background with subtle gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, "#1a0a2e");
    gradient.addColorStop(0.5, "#0a0a1a");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxRadius = Math.min(cx, cy) * 0.9;
    const noise = createNoise();
    const t = time * 0.0003;

    // Draw symmetry segments
    const segmentAngle = (Math.PI * 2) / (segments as number);

    for (let layer = 0; layer < (layers as number); layer++) {
      const layerRadius = (maxRadius * (layer + 1)) / (layers as number);
      const layerOffset = layer * 0.5;

      for (let i = 0; i < (complexity as number); i++) {
        const progress = i / (complexity as number);
        const radius = layerRadius * (0.2 + progress * 0.8);
        
        // Generate organic shape points
        const points: Array<{ x: number; y: number; size: number; alpha: number }> = [];
        
        for (let a = 0; a <= segmentAngle; a += 0.05) {
          // Add noise-based variation
          const noiseVal = noise(
            Math.cos(a) * 2 + layerOffset + t,
            Math.sin(a) * 2 + layer * 0.3
          );
          
          const r = radius * (0.8 + noiseVal * 0.4);
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          
          points.push({
            x,
            y,
            size: 2 + Math.abs(noiseVal) * 4,
            alpha: 0.3 + Math.abs(noiseVal) * 0.5,
          });
        }

        // Draw for each symmetry segment
        for (let seg = 0; seg < (segments as number); seg++) {
          const rotation = seg * segmentAngle + t * (layer % 2 === 0 ? 1 : -1);
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rotation);

          // Color based on segment and layer
          const hue = ((colorShift as number) + seg * (360 / (segments as number)) + layer * 30) % 360;
          const saturation = 60 + (layer / (layers as number)) * 30;
          const lightness = 40 + (i / (complexity as number)) * 30;

          // Draw the shape
          ctx.beginPath();
          ctx.moveTo(points[0]?.x || 0, points[0]?.y || 0);
          
          for (let p = 1; p < points.length; p++) {
            const point = points[p];
            ctx.lineTo(point.x, point.y);
          }

          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Fill with gradient
          const fillGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
          fillGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`);
          fillGradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);
          ctx.fillStyle = fillGradient;
          ctx.fill();

          // Mirror reflection if enabled
          if (mirrorMode === "reflect" || mirrorMode === "both") {
            ctx.save();
            ctx.scale(1, -1);
            
            ctx.beginPath();
            ctx.moveTo(points[0]?.x || 0, points[0]?.y || 0);
            for (let p = 1; p < points.length; p++) {
              const point = points[p];
              ctx.lineTo(point.x, point.y);
            }
            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 10}%, 0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }

          // Draw decorative dots at key points
          for (let p = 0; p < points.length; p += 3) {
            const point = points[p];
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${point.alpha * 0.8})`;
            ctx.fill();
          }

          ctx.restore();
        }
      }
    }

    // Add central glow
    const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 0.3);
    glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    glowGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer decorative ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let r = maxRadius * 0.8; r <= maxRadius; r += 10) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
};
