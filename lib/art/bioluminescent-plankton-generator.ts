import type { ArtGenerator } from "./core";
import { bioluminescentPlankton } from "./bioluminescent-plankton";

export const bioluminescentPlanktonGenerator: ArtGenerator = {
  ...bioluminescentPlankton,
  render: (ctx, context, params) => {
    bioluminescentPlankton.render(ctx, context, params);
  },
};

export { bioluminescentPlankton, bioluminescentPlanktonDefaultParams } from "./bioluminescent-plankton";
export type { PlanktonParams } from "./bioluminescent-plankton";
