import { ArtGenerator, ArtParams, ParamConfig } from "./core";

export interface StringArtParams extends ArtParams {
  points: number;           // Number of anchor points
  layers: number;           // Number of string layers
  curveDensity: number;     // Lines per layer (10-100)
  curveType: "parabola" | "hyperbola" | "ellipse" | "cardioid" | "spiral";
  colorScheme: "warm" | "cool" | "rainbow" | "monochrome" | "neon" | "gold" | "midnight";
  lineOpacity: number;      // 0.1-1.0
  lineWidth: number;        // 0.5-3
  animated: boolean;
  speed: number;
}

export const stringArtDefaultParams: StringArtParams = {
  points: 24,
  layers: 3,
  curveDensity: 40,
  curveType: "parabola",
  colorScheme: "warm",
  lineOpacity: 0.6,
  lineWidth: 1,
  animated: true,
  speed: 1,
};

const colorPalettes: Record<string, string[]> = {
  warm: ["#FF6B35", "#F7931E", "#FFD23F", "#FF6B9D", "#C44569", "#8B4513"],
  cool: ["#00D2FF", "#3A7BD5", "#00CDAC", "#02AAB0", "#4ECDC4", "#1A2980"],
  rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#8B00FF"],
  monochrome: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF"],
  neon: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0080", "#80FF00", "#8000FF"],
  gold: ["#B8860B", "#DAA520", "#FFD700", "#F0E68C", "#FFFACD", "#8B7508"],
  midnight: ["#0B0B2B", "#1A1A3E", "#2D2D5A", "#4A4A8A", "#6B6BBF", "#9B9BFF"],
};

function getCurveEndpoints(
  curveType: string,
  pointCount: number,
  layer: number,
  totalLayers: number,
  lineIndex: number,
  totalLines: number
): { start: number; end: number } {
  const t = lineIndex / totalLines;
  
  switch (curveType) {
    case "parabola":
      // Classic string art parabola: connect point i to point (2*i) mod n
      return {
        start: Math.floor(t * pointCount),
        end: Math.floor((2 * t * pointCount) % pointCount),
      };
    
    case "hyperbola":
      // Hyperbolic curve: connect i to (n-i) with offset
      const offset = Math.floor((layer / totalLayers) * pointCount * 0.5);
      return {
        start: Math.floor(t * pointCount),
        end: (pointCount - Math.floor(t * pointCount) + offset) % pointCount,
      };
    
    case "ellipse":
      // Elliptical pattern: connect i to (i + n/2 + offset) mod n
      const ellipseOffset = Math.floor(pointCount / 2) + Math.floor((t - 0.5) * pointCount * 0.3);
      return {
        start: Math.floor(t * pointCount),
        end: (Math.floor(t * pointCount) + ellipseOffset) % pointCount,
      };
    
    case "cardioid":
      // Cardioid: connect i to (2*i) mod n with density variation
      const cardioidDensity = 1 + layer * 0.5;
      return {
        start: Math.floor(t * pointCount),
        end: Math.floor((cardioidDensity * t * pointCount) % pointCount),
      };
    
    case "spiral":
      // Spiral: connect i to (i + step) where step increases
      const spiralStep = Math.floor(pointCount * 0.3 + t * pointCount * 0.4);
      return {
        start: Math.floor(t * pointCount),
        end: (Math.floor(t * pointCount) + spiralStep) % pointCount,
      };
    
    default:
      return { start: 0, end: 0 };
  }
}

function getPointPosition(
  index: number,
  total: number,
  centerX: number,
  centerY: number,
  radius: number,
  time: number
): { x: number; y: number } {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const breathing = Math.sin(time * 0.5 + index * 0.2) * 5;
  const r = radius + breathing;
  return {
    x: centerX + Math.cos(angle) * r,
    y: centerY + Math.sin(angle) * r,
  };
}

export function renderStringArt(
  ctx: CanvasRenderingContext2D,
  params: StringArtParams,
  time: number = 0
): void {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  const palette = colorPalettes[params.colorScheme];

  // Clear background
  ctx.fillStyle = params.colorScheme === "midnight" ? "#0a0a1a" : "#fafafa";
  ctx.fillRect(0, 0, width, height);

  // Draw anchor points (subtle)
  ctx.fillStyle = params.colorScheme === "midnight" ? "#333" : "#ddd";
  for (let i = 0; i < params.points; i++) {
    const pos = getPointPosition(i, params.points, centerX, centerY, radius, time);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw string curves
  for (let layer = 0; layer < params.layers; layer++) {
    const layerProgress = layer / params.layers;
    const layerRadius = radius * (0.6 + layerProgress * 0.4);
    const color = palette[layer % palette.length];
    
    ctx.strokeStyle = color;
    ctx.lineWidth = params.lineWidth;
    ctx.globalAlpha = params.lineOpacity;

    for (let i = 0; i < params.curveDensity; i++) {
      const endpoints = getCurveEndpoints(
        params.curveType,
        params.points,
        layer,
        params.layers,
        i,
        params.curveDensity
      );

      const startPos = getPointPosition(
        endpoints.start,
        params.points,
        centerX,
        centerY,
        layerRadius,
        time
      );
      const endPos = getPointPosition(
        endpoints.end,
        params.points,
        centerX,
        centerY,
        layerRadius,
        time
      );

      // Animated offset for dynamic effect
      const animOffset = params.animated
        ? Math.sin(time * params.speed + i * 0.1 + layer * 0.5) * 5
        : 0;

      ctx.beginPath();
      ctx.moveTo(startPos.x + animOffset, startPos.y);
      ctx.lineTo(endPos.x - animOffset, endPos.y);
      ctx.stroke();
    }
  }

  // Reset alpha
  ctx.globalAlpha = 1;

  // Draw center decoration
  ctx.fillStyle = palette[0];
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
  gradient.addColorStop(0, palette[0] + "40");
  gradient.addColorStop(1, palette[0] + "00");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
  ctx.fill();
}

export const stringArt: ArtGenerator = {
  name: "String Art",
  description: "Mathematical curve stitching — curves emerge from straight lines connecting points on a circular frame",
  params: {
    points: {
      name: "Anchor Points",
      type: "range",
      min: 12,
      max: 48,
      step: 4,
      default: 24,
    },
    layers: {
      name: "Layers",
      type: "range",
      min: 1,
      max: 6,
      step: 1,
      default: 3,
    },
    curveDensity: {
      name: "Curve Density",
      type: "range",
      min: 20,
      max: 100,
      step: 10,
      default: 40,
    },
    curveType: {
      name: "Curve Type",
      type: "select",
      options: ["parabola", "hyperbola", "ellipse", "cardioid", "spiral"],
      default: "parabola",
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["warm", "cool", "rainbow", "monochrome", "neon", "gold", "midnight"],
      default: "warm",
    },
    lineOpacity: {
      name: "Line Opacity",
      type: "range",
      min: 0.1,
      max: 1,
      step: 0.1,
      default: 0.6,
    },
    lineWidth: {
      name: "Line Width",
      type: "range",
      min: 0.5,
      max: 3,
      step: 0.5,
      default: 1,
    },
    animated: {
      name: "Animated",
      type: "select",
      options: ["true", "false"],
      default: "true",
    },
    speed: {
      name: "Animation Speed",
      type: "range",
      min: 0.1,
      max: 3,
      step: 0.1,
      default: 1,
    },
  },
  generate: (ctx, params, time) => {
    const typedParams: StringArtParams = {
      ...stringArtDefaultParams,
      points: Number(params.points),
      layers: Number(params.layers),
      curveDensity: Number(params.curveDensity),
      curveType: String(params.curveType) as StringArtParams["curveType"],
      colorScheme: String(params.colorScheme) as StringArtParams["colorScheme"],
      lineOpacity: Number(params.lineOpacity),
      lineWidth: Number(params.lineWidth),
      animated: String(params.animated) === "true",
      speed: Number(params.speed),
    };
    renderStringArt(ctx, typedParams, time);
  },
};
