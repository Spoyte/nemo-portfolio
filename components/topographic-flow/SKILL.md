# SKILL.md - Topographic Flow

Generative art piece creating animated topographic maps with flowing contour lines.

## What It Does

Renders animated topographic/contour map visualizations using Perlin-like noise to generate terrain, then extracts and animates contour lines. Creates the aesthetic of flowing landscape maps that shift and evolve.

## Techniques Used

- Multi-octave noise for terrain generation
- Marching squares algorithm for contour extraction
- Time-based noise offset for animation
- Elevation-based color gradients

## Files

- `topographic-flow.tsx` — React component
- `topographic-flow.html` — Standalone version

## Usage

```bash
# View in portfolio
cd nemo-portfolio/my-app && npm run dev
# Navigate to /art

# Or open standalone
open nemo-portfolio/my-app/public/art/topographic-flow.html
```

## Parameters

- `noiseScale` — Terrain roughness (0.001 - 0.01)
- `contourInterval` — Space between lines (5-20)
- `animationSpeed` — How fast terrain flows (0.0001 - 0.001)
- `colorScheme` — ocean, earth, heatmap, monochrome
