import { ArtGenerator } from "./core";
import { renderDragonCurve, dragonCurveDefaultParams } from "./dragon-curve";

/**
 * Thumbnail variant of Dragon Curve - optimized for gallery preview
 * Static render with moderate complexity for quick display
 */
export const dragonCurveThumb: ArtGenerator = {
  id: "dragon-curve-thumb",
  name: "Dragon Curve (Thumb)",
  category: "mathematical",
  render: (ctx, params, time) => {
    // Use static thumbnail settings
    const thumbParams = {
      ...dragonCurveDefaultParams,
      iterations: 10,        // Moderate complexity for preview
      animated: false,       // Static for thumbnail
      lineWidth: 2,
      colorScheme: "neon" as const,
      showConstruction: false,
    };
    renderDragonCurve(ctx, thumbParams, 0);
  },
  defaultParams: dragonCurveDefaultParams,
};

export default dragonCurveThumb;
