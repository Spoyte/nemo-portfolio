import {
  ArtGenerator,
  fillCanvas,
  renderPixels,
  hexToRgb,
  COLOR_PALETTES,
} from "./core";

interface Cell {
  x: number;
  y: number;
  color: string;
  growth: number;
  radius: number;
}

export const voronoiOrganic: ArtGenerator = {
  name: "Voronoi Organic",
  description: "Animated Voronoi diagram with organic distortion",
  params: {
    cellCount: {
      name: "Cell Count",
      type: "range",
      min: 10,
      max: 100,
      step: 10,
      default: 40,
    },
    distortion: {
      name: "Distortion",
      type: "range",
      min: 0,
      max: 30,
      step: 5,
      default: 10,
    },
    palette: {
      name: "Color Palette",
      type: "select",
      options: ["ocean", "sunset", "forest", "monochrome", "neon"],
      default: "ocean",
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const { cellCount, distortion, palette } = params;

    const colors = COLOR_PALETTES[palette as string] || COLOR_PALETTES.ocean;
    const t = time * 0.001;

    // Generate cell centers
    const cells: Cell[] = [];
    for (let i = 0; i < (cellCount as number); i++) {
      cells.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        growth: 0.5 + Math.random() * 1.5,
        radius: 30 + Math.random() * 50,
      });
    }

    const getDistance = (x: number, y: number, cell: Cell): number => {
      const dx = x - cell.x;
      const dy = y - cell.y;
      const euclidean = Math.sqrt(dx * dx + dy * dy);
      const wobble =
        Math.sin(x * 0.01 + t * cell.growth) *
        Math.cos(y * 0.01 + t * cell.growth * 0.7) *
        (distortion as number);
      return euclidean + wobble;
    };

    renderPixels(ctx, canvas.width, canvas.height, (x, y) => {
      let minDist = Infinity;
      let nearestCell: Cell | null = null;
      let secondDist = Infinity;

      for (const cell of cells) {
        const dist = getDistance(x, y, cell);
        if (dist < minDist) {
          secondDist = minDist;
          minDist = dist;
          nearestCell = cell;
        } else if (dist < secondDist) {
          secondDist = dist;
        }
      }

      if (!nearestCell) return { r: 0, g: 0, b: 0 };

      const edgeFactor = Math.min(1, (secondDist - minDist) / 30);
      const { r, g, b } = hexToRgb(nearestCell.color);

      const depth = Math.max(0.3, 1 - minDist / nearestCell.radius);
      const edgeHighlight = edgeFactor < 0.3 ? (0.3 - edgeFactor) * 3 : 0;

      return {
        r: Math.min(255, r * depth + edgeHighlight * 100),
        g: Math.min(255, g * depth + edgeHighlight * 100),
        b: Math.min(255, b * depth + edgeHighlight * 100),
      };
    });
  },
};
