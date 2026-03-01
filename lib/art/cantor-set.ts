import { ArtGenerator, GeneratorContext, ExportOptions } from "./core";

export interface CantorSetParams {
  // Visual parameters
  iterations: number;     // 3-8: Recursion depth (more = more detail)
  gapRatio: number;       // 0.2-0.5: Size of middle section removed (1/3 = 0.333...)
  orientation: "horizontal" | "vertical" | "radial";
  colorScheme: "fire" | "ocean" | "forest" | "monochrome" | "rainbow" | "gold";
  barHeight: number;      // 10-50: Height of each bar as % of available space
  animated: boolean;
  animationSpeed: number; // 0.5-3: Speed of iteration reveal
  showGaps: boolean;      // Highlight the removed sections
  mirror: boolean;        // Mirror the pattern vertically
}

export const cantorSetDefaultParams: CantorSetParams = {
  iterations: 6,
  gapRatio: 0.333,
  orientation: "horizontal",
  colorScheme: "fire",
  barHeight: 20,
  animated: true,
  animationSpeed: 1,
  showGaps: false,
  mirror: true,
};

// Color palettes
const palettes: Record<string, string[]> = {
  fire: ["#FF006E", "#FB5607", "#FFBE0B", "#FF4500", "#DC143C", "#8B0000"],
  ocean: ["#0077BE", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF", "#CAF0F8"],
  forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2", "#B7E4C7"],
  monochrome: ["#F8F9FA", "#DEE2E6", "#ADB5BD", "#6C757D", "#495057", "#212529"],
  rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"],
  gold: ["#FFF8DC", "#FFE4B5", "#FFD700", "#DAA520", "#B8860B", "#8B6914"],
};

// Background colors for each scheme
const bgColors: Record<string, string> = {
  fire: "#1a0505",
  ocean: "#051a2e",
  forest: "#051a0f",
  monochrome: "#0a0a0a",
  rainbow: "#0a0a1a",
  gold: "#1a1505",
};

interface LineSegment {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
}

function generateCantorSegments(
  x: number,
  y: number,
  width: number,
  height: number,
  depth: number,
  maxDepth: number,
  gapRatio: number,
  segments: LineSegment[]
): void {
  if (depth >= maxDepth || width < 2) return;

  // Add current segment
  segments.push({ x, y, width, height, depth });

  // Calculate the two remaining segments after removing middle
  const segmentWidth = width * (1 - gapRatio) / 2;
  const gapWidth = width * gapRatio;

  // Left segment
  generateCantorSegments(
    x, y + height, segmentWidth, height, depth + 1, maxDepth, gapRatio, segments
  );

  // Right segment
  generateCantorSegments(
    x + segmentWidth + gapWidth, y + height, segmentWidth, height, depth + 1, maxDepth, gapRatio, segments
  );
}

function generateRadialCantor(
  centerX: number,
  centerY: number,
  startRadius: number,
  startAngle: number,
  endAngle: number,
  barHeight: number,
  depth: number,
  maxDepth: number,
  gapRatio: number,
  segments: Array<{
    centerX: number;
    centerY: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    depth: number;
  }>
): void {
  if (depth >= maxDepth) return;

  const angleSpan = endAngle - startAngle;
  const gapAngle = angleSpan * gapRatio;
  const segmentAngle = (angleSpan - gapAngle) / 2;

  // Add current arc segment
  segments.push({
    centerX,
    centerY,
    innerRadius: startRadius,
    outerRadius: startRadius + barHeight,
    startAngle,
    endAngle,
    depth,
  });

  const nextRadius = startRadius + barHeight * 1.2;

  // Left arc
  generateRadialCantor(
    centerX, centerY, nextRadius, startAngle, startAngle + segmentAngle,
    barHeight, depth + 1, maxDepth, gapRatio, segments
  );

  // Right arc
  generateRadialCantor(
    centerX, centerY, nextRadius, startAngle + segmentAngle + gapAngle, endAngle,
    barHeight, depth + 1, maxDepth, gapRatio, segments
  );
}

export function renderCantorSet(
  ctx: CanvasRenderingContext2D,
  params: Partial<CantorSetParams> = {},
  time: number = 0
): void {
  const config = { ...cantorSetDefaultParams, ...params };
  const { width, height } = ctx.canvas;
  const colors = palettes[config.colorScheme] || palettes.fire;
  const bgColor = bgColors[config.colorScheme] || "#0a0a0a";

  // Clear background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Animation: gradually reveal iterations
  const t = config.animated ? (time * config.animationSpeed * 0.0005) % (config.iterations + 2) : config.iterations;
  const animatedIterations = config.animated ? Math.floor(t) + 1 : config.iterations;
  const iterationAlpha = config.animated ? t % 1 : 1;

  if (config.orientation === "radial") {
    renderRadialCantor(ctx, width, height, config, colors, animatedIterations, iterationAlpha);
  } else {
    renderLinearCantor(ctx, width, height, config, colors, animatedIterations, iterationAlpha);
  }
}

function renderLinearCantor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: CantorSetParams,
  colors: string[],
  maxIterations: number,
  iterationAlpha: number
): void {
  const isHorizontal = config.orientation === "horizontal";
  const padding = 40;

  // Calculate dimensions
  const availableWidth = isHorizontal ? width - padding * 2 : width - padding * 2;
  const availableHeight = isHorizontal ? height - padding * 2 : height - padding * 2;

  const barHeight = (isHorizontal ? availableHeight : availableWidth) * (config.barHeight / 100) / maxIterations;
  const startWidth = isHorizontal ? availableWidth : availableHeight;
  const startX = padding;
  const startY = padding;

  // Generate all segments
  const segments: LineSegment[] = [];
  generateCantorSegments(
    startX, startY, startWidth, barHeight, 0, maxIterations, config.gapRatio, segments
  );

  // Draw segments by iteration depth
  const segmentsByDepth: LineSegment[][] = [];
  for (let i = 0; i <= maxIterations; i++) {
    segmentsByDepth[i] = segments.filter(s => s.depth === i);
  }

  // Draw each iteration level
  segmentsByDepth.forEach((depthSegments, depth) => {
    if (depthSegments.length === 0) return;

    const color = colors[depth % colors.length];
    const alpha = depth === maxIterations - 1 && config.animated ? iterationAlpha : 1;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8 * alpha;

    depthSegments.forEach(segment => {
      if (isHorizontal) {
        ctx.fillRect(segment.x, segment.y, segment.width, segment.height * 0.9);

        // Mirror if enabled
        if (config.mirror) {
          const mirrorY = height - segment.y - segment.height;
          ctx.fillRect(segment.x, mirrorY, segment.width, segment.height * 0.9);
        }
      } else {
        // Vertical orientation
        ctx.fillRect(segment.y, segment.x, segment.height * 0.9, segment.width);

        if (config.mirror) {
          const mirrorX = width - segment.y - segment.height;
          ctx.fillRect(mirrorX, segment.x, segment.height * 0.9, segment.width);
        }
      }
    });

    // Show gaps if enabled
    if (config.showGaps && depth < maxIterations - 1) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.globalAlpha = 0.3 * alpha;

      depthSegments.forEach(segment => {
        const gapWidth = segment.width * config.gapRatio;
        const segmentWidth = segment.width * (1 - config.gapRatio) / 2;

        if (isHorizontal) {
          ctx.fillRect(segment.x + segmentWidth, segment.y, gapWidth, segment.height * 0.9);

          if (config.mirror) {
            const mirrorY = height - segment.y - segment.height;
            ctx.fillRect(segment.x + segmentWidth, mirrorY, gapWidth, segment.height * 0.9);
          }
        }
      });
    }
  });

  // Draw connecting lines for visual interest
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 0.5;

  for (let depth = 0; depth < Math.min(maxIterations - 1, segmentsByDepth.length - 1); depth++) {
    const current = segmentsByDepth[depth];
    const next = segmentsByDepth[depth + 1];

    if (!current || !next || current.length === 0 || next.length === 0) continue;

    ctx.beginPath();
    current.forEach(parent => {
      // Find children (roughly positioned within parent bounds)
      const children = next.filter(child =>
        isHorizontal
          ? child.x >= parent.x && child.x + child.width <= parent.x + parent.width
          : child.x >= parent.x && child.x + child.width <= parent.x + parent.width
      );

      children.forEach(child => {
        if (isHorizontal) {
          ctx.moveTo(parent.x + parent.width / 2, parent.y + parent.height);
          ctx.lineTo(child.x + child.width / 2, child.y);
        }
      });
    });
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  // Draw title/info
  ctx.fillStyle = colors[0];
  ctx.font = "12px monospace";
  ctx.globalAlpha = 0.5;
  ctx.fillText(`Cantor Set — ${maxIterations} iterations`, 10, height - 10);
  ctx.globalAlpha = 1;
}

function renderRadialCantor(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: CantorSetParams,
  colors: string[],
  maxIterations: number,
  iterationAlpha: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.4;
  const barHeight = maxRadius / maxIterations * 0.8;

  const segments: Array<{
    centerX: number;
    centerY: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    depth: number;
  }> = [];

  generateRadialCantor(
    centerX, centerY, barHeight * 0.5, 0, Math.PI * 2,
    barHeight, 0, maxIterations, config.gapRatio, segments
  );

  // Group by depth
  const segmentsByDepth: typeof segments[] = [];
  for (let i = 0; i <= maxIterations; i++) {
    segmentsByDepth[i] = segments.filter(s => s.depth === i);
  }

  // Draw each iteration
  segmentsByDepth.forEach((depthSegments, depth) => {
    if (depthSegments.length === 0) return;

    const color = colors[depth % colors.length];
    const alpha = depth === maxIterations - 1 && config.animated ? iterationAlpha : 1;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85 * alpha;

    depthSegments.forEach(seg => {
      ctx.beginPath();
      ctx.arc(seg.centerX, seg.centerY, seg.outerRadius, seg.startAngle, seg.endAngle);
      ctx.arc(seg.centerX, seg.centerY, seg.innerRadius, seg.endAngle, seg.startAngle, true);
      ctx.closePath();
      ctx.fill();
    });
  });

  // Center decoration
  ctx.globalAlpha = 1;
  ctx.fillStyle = colors[0];
  ctx.beginPath();
  ctx.arc(centerX, centerY, barHeight * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
}

// Backward compatibility: ArtGenerator interface
export const cantorSet: ArtGenerator = {
  id: "cantor-set",
  name: "Cantor Set",
  category: "mathematical",
  render: (ctx, params, time) => renderCantorSet(ctx, params as CantorSetParams, time),
  defaultParams: cantorSetDefaultParams,
};

export default cantorSet;
