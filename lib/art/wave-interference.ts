import { ArtGenerator, fillCanvas, renderPixels } from "./core";

export const waveInterference: ArtGenerator = {
  name: "Wave Interference",
  description: "Overlapping sine waves creating interference patterns",
  params: {
    waveCount: {
      name: "Wave Count",
      type: "range",
      min: 1,
      max: 8,
      step: 1,
      default: 3,
    },
    frequency: {
      name: "Frequency",
      type: "range",
      min: 0.005,
      max: 0.05,
      step: 0.005,
      default: 0.02,
    },
    amplitude: {
      name: "Amplitude",
      type: "range",
      min: 0.5,
      max: 2,
      step: 0.25,
      default: 1,
    },
    phaseShift: {
      name: "Phase Shift",
      type: "range",
      min: 0,
      max: 360,
      step: 45,
      default: 0,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const { waveCount, frequency, amplitude, phaseShift } = params;

    fillCanvas(ctx, "#000", canvas.width, canvas.height);

    const t = time * 0.001;
    const phase = ((phaseShift as number) * Math.PI) / 180;

    renderPixels(ctx, canvas.width, canvas.height, (x, y) => {
      let value = 0;

      for (let w = 0; w < (waveCount as number); w++) {
        const angle = (w / (waveCount as number)) * Math.PI * 2;
        const sourceX = canvas.width / 2 + Math.cos(angle) * 200;
        const sourceY = canvas.height / 2 + Math.sin(angle) * 200;

        const dist = Math.sqrt((x - sourceX) ** 2 + (y - sourceY) ** 2);
        value += Math.sin(dist * (frequency as number) + phase + w + t) * (amplitude as number);
      }

      const intensity = Math.floor((value / (waveCount as number) + 1) * 127.5);
      return {
        r: intensity,
        g: intensity * 0.5,
        b: 255 - intensity,
      };
    });
  },
};
