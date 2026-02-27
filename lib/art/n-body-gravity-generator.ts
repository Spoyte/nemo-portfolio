import { ArtGenerator } from "./core";
import { renderNBodyGravity, nBodyGravityDefaultParams, NBodyGravityParams } from "./n-body-gravity";

export const nBodyGravity: ArtGenerator = {
  id: "n-body-gravity",
  name: "N-Body Gravity",
  description: "Mutual gravitational attraction simulation where every particle attracts every other particle, creating emergent galaxy-like structures and orbital dynamics",
  category: "physics",
  tags: ["physics", "gravity", "simulation", "particles", "emergent"],
  params: {
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 50,
      max: 800,
      step: 50,
      default: nBodyGravityDefaultParams.particleCount,
    },
    gravityStrength: {
      name: "Gravity Strength",
      type: "range",
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: nBodyGravityDefaultParams.gravityStrength,
    },
    timeStep: {
      name: "Time Step",
      type: "range",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      default: nBodyGravityDefaultParams.timeStep,
    },
    softening: {
      name: "Force Softening",
      type: "range",
      min: 1,
      max: 20,
      step: 1,
      default: nBodyGravityDefaultParams.softening,
    },
    trailLength: {
      name: "Trail Length",
      type: "range",
      min: 0,
      max: 100,
      step: 5,
      default: nBodyGravityDefaultParams.trailLength,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["nebula", "galaxy", "inferno", "ocean", "gold"],
      default: nBodyGravityDefaultParams.colorScheme,
    },
    initConfig: {
      name: "Initial Configuration",
      type: "select",
      options: ["random", "disc", "cluster", "binary", "shell"],
      default: nBodyGravityDefaultParams.initConfig,
    },
  },
  render: (ctx, width, height, time, params) => {
    return renderNBodyGravity(ctx, width, height, time, params as NBodyGravityParams);
  },
};
