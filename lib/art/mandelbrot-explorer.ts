import { ArtGenerator } from "./core";
import { renderMandelbrot, mandelbrotDefaultParams, MANDELBROT_LOCATIONS } from "./mandelbrot";

export const mandelbrotExplorer: ArtGenerator = {
  name: "Mandelbrot Explorer",
  description: "Interactive fractal exploration with smooth coloring. The Mandelbrot set — infinitely complex patterns emerging from a simple iterative formula: z² + c.",
  params: {
    zoom: {
      name: "Zoom",
      type: "range",
      min: 1,
      max: 1000,
      step: 1,
      default: 1,
    },
    centerX: {
      name: "Center X",
      type: "range",
      min: -2,
      max: 1,
      step: 0.001,
      default: -0.5,
    },
    centerY: {
      name: "Center Y",
      type: "range",
      min: -1.5,
      max: 1.5,
      step: 0.001,
      default: 0,
    },
    maxIterations: {
      name: "Detail Level",
      type: "range",
      min: 50,
      max: 500,
      step: 10,
      default: 100,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["smooth", "fire", "electric", "grayscale", "neon", "ocean"],
      default: "smooth",
    },
    escapeRadius: {
      name: "Escape Radius",
      type: "range",
      min: 1.5,
      max: 4,
      step: 0.1,
      default: 2.0,
    },
  },
  generate: (ctx, params, time) => {
    renderMandelbrot(ctx, {
      zoom: params.zoom as number,
      centerX: params.centerX as number,
      centerY: params.centerY as number,
      maxIterations: params.maxIterations as number,
      colorScheme: params.colorScheme as string,
      escapeRadius: params.escapeRadius as number,
    }, time);
  },
};

export { MANDELBROT_LOCATIONS };
