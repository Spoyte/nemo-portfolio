import { ArtGenerator } from "./core";
import { 
  renderApollonianGasket, 
  apollonianGasketDefaultParams,
  ApollonianGasketParams 
} from "./apollonian-gasket";

// Thumbnail variant with optimized defaults for gallery preview
export const apollonianGasketThumbParams: ApollonianGasketParams = {
  ...apollonianGasketDefaultParams,
  maxDepth: 3,        // Lower depth for faster rendering
  speed: 0.3,         // Slower, calmer animation
  colorScheme: "gold",
  style: "gradient",
  animated: true,
};

export function renderApollonianGasketThumb(
  ctx: CanvasRenderingContext2D,
  params: Partial<ApollonianGasketParams> = {},
  time: number = 0
): void {
  // Merge with thumbnail defaults
  const thumbParams = { ...apollonianGasketThumbParams, ...params };
  renderApollonianGasket(ctx, thumbParams, time);
}

// Backward compatibility
export const apollonianGasketThumb: ArtGenerator = {
  id: "apollonian-gasket-thumb",
  name: "Apollonian Gasket (Thumb)",
  category: "mathematical",
  render: (ctx, params, time) => renderApollonianGasketThumb(ctx, params as ApollonianGasketParams, time),
  defaultParams: apollonianGasketThumbParams,
};

export default apollonianGasketThumb;
