import { ArtGenerator } from "./core";
import { renderLissajousCurves, lissajousCurvesDefaultParams, LissajousCurvesParams } from "./lissajous-curves";

export const lissajousCurves: ArtGenerator = {
  name: "Lissajous Curves",
  description: "Harmonic motion patterns from parametric equations with interference visualization",
  params: {
    speed: {
      name: "Speed",
      type: "range",
      min: 5,
      max: 100,
      step: 5,
      default: lissajousCurvesDefaultParams.speed,
    },
    frequencyX: {
      name: "Frequency X",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: lissajousCurvesDefaultParams.frequencyX,
    },
    frequencyY: {
      name: "Frequency Y",
      type: "range",
      min: 1,
      max: 10,
      step: 1,
      default: lissajousCurvesDefaultParams.frequencyY,
    },
    phaseShift: {
      name: "Phase Shift",
      type: "range",
      min: 0,
      max: 100,
      step: 1,
      default: lissajousCurvesDefaultParams.phaseShift,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["ocean", "sunset", "forest", "neon", "gold"],
      default: lissajousCurvesDefaultParams.colorScheme,
    },
  },
  generate: (ctx, params, time = 0) => {
    renderLissajousCurves(ctx, ctx.canvas.width, ctx.canvas.height, time, {
      speed: params.speed as number,
      frequencyX: params.frequencyX as number,
      frequencyY: params.frequencyY as number,
      phaseShift: params.phaseShift as number,
      colorScheme: params.colorScheme as LissajousCurvesParams['colorScheme'],
    });
  },
};
