// Thumbnail/preview generator for gallery grid view
// Renders small static snapshots of each art piece

import { artGenerators, ArtParams } from "./index";

export interface ThumbnailConfig {
  width: number;
  height: number;
  quality: number; // 0-1, affects rendering detail
}

const DEFAULT_THUMBNAIL_CONFIG: ThumbnailConfig = {
  width: 300,
  height: 225,
  quality: 0.5,
};

// Generate a thumbnail for a specific art piece
export function generateThumbnail(
  generatorKey: string,
  config: Partial<ThumbnailConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_THUMBNAIL_CONFIG, ...config };
  const generator = artGenerators[generatorKey];
  
  if (!generator) {
    throw new Error(`Unknown generator: ${generatorKey}`);
  }

  // Create offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = finalConfig.width;
  canvas.height = finalConfig.height;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Get default params for this generator
  const params: ArtParams = {};
  Object.entries(generator.params).forEach(([key, paramConfig]) => {
    params[key] = paramConfig.default;
  });

  // For animated pieces, we pass a fixed timestamp to get a consistent frame
  const isAnimated = [
    "voronoi-organic",
    "wave-interference", 
    "flow-field",
    "topographic-flow",
    "orbital-mechanics",
    "light-caverns",
    "fluid-smoke",
    "particle-swarm"
  ].includes(generatorKey);

  // Generate the art
  try {
    generator.generate(ctx, params, isAnimated ? 0 : undefined);
  } catch (err) {
    console.error(`Failed to generate thumbnail for ${generatorKey}:`, err);
    // Return a fallback gradient
    return generateFallbackThumbnail(ctx, finalConfig, generatorKey);
  }

  return canvas.toDataURL("image/png", finalConfig.quality);
}

// Generate all thumbnails at once
export function generateAllThumbnails(
  config: Partial<ThumbnailConfig> = {}
): Record<string, string> {
  const thumbnails: Record<string, string> = {};
  
  Object.keys(artGenerators).forEach((key) => {
    try {
      thumbnails[key] = generateThumbnail(key, config);
    } catch (err) {
      console.error(`Failed to generate thumbnail for ${key}:`, err);
      thumbnails[key] = "";
    }
  });
  
  return thumbnails;
}

// Fallback gradient for failed renders
function generateFallbackThumbnail(
  ctx: CanvasRenderingContext2D,
  config: ThumbnailConfig,
  name: string
): string {
  // Create a unique gradient based on the name
  const hue1 = (name.charCodeAt(0) * 15) % 360;
  const hue2 = (name.charCodeAt(name.length - 1) * 20) % 360;
  
  const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
  gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
  gradient.addColorStop(1, `hsl(${hue2}, 70%, 50%)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);
  
  // Add text label
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name.replace(/-/g, " "), config.width / 2, config.height / 2);
  
  return ctx.canvas.toDataURL("image/png", config.quality);
}

// Predefined thumbnail set (for SSR/static generation)
// These are base64-encoded PNGs that can be used immediately
export const PREVIEW_THUMBNAILS: Record<string, string> = {};

// Hook for React components to use thumbnails
export function useThumbnails() {
  // This would be expanded to cache thumbnails in state
  // For now, just return the generator function
  return {
    generateThumbnail,
    generateAllThumbnails,
  };
}
