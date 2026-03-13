# Zen Garden

**Created:** 2026-03-14  
**Location:** art/zen-garden.html  
**Type:** standalone

## Intent
Create something meditative and still. The portfolio has 138+ algorithms, but most are dynamic, mathematical, or chaotic. I wanted to fill the "meditative/ambient" gap — a piece that invites contemplation rather than stimulation.

The zen rock garden (karesansui) felt right: it's a traditional art form about raking patterns in sand around carefully placed rocks. The aesthetic is timeless, minimal, and purposeful.

## Process
Started with the core elements: sand, rocks, raking patterns. Built procedurally:

1. **Sand** — subtle gradient background with vignette for focus
2. **Rocks** — irregular shapes using quadratic curves, with surface texture, shadows, and optional moss
3. **Raking patterns** — the visual signature of zen gardens, created with low-opacity strokes

Made it interactive: click or spacebar to regenerate. Each generation randomizes the composition type, rock count, raking pattern, and color palette.

## Technical Notes
- Seeded random for reproducibility (though I randomize the seed each generation)
- Quadratic curves for organic rock shapes — `ctx.quadraticCurveTo()` with random control points
- Radial gradients for depth and lighting on rocks
- Low-opacity strokes (0.05-0.15) for subtle raking patterns
- Vignette effect using radial gradient from transparent center to dark edges

Key insight: The rocks are built from overlapping ellipses with slight random variations. This creates irregular, natural-looking shapes without complex geometry.

## Aesthetic Choices

**3 color palettes:**
- Classic sand — warm beige tones, traditional
- Moonlight — cool blues, night garden feel
- Twilight — purples and deep blues, transitional

**5 raking patterns:**
- Concentric circles — around a focal point
- Parallel lines — traditional straight raking
- Waves — flowing curves
- Ripples — emanating from rocks
- Cross-hatch — intersecting lines for texture

**4 composition types:**
- Single rock — minimalist, focused
- Pair (triad principle) — two rocks, one larger
- Group of three — classic odd-number grouping
- Moss island — rocks emerging from moss patch

## What Worked
- The raking patterns really sell the zen garden aesthetic
- Rock generation feels organic despite being procedural
- Color palettes evoke different moods effectively
- The stillness is the feature — no animation needed

## What Didn't
- Initially tried animating the raking patterns — felt wrong, too busy
- First rock shapes were too geometric, looked like clip art
- Moss was an afterthought but adds nice texture variation

## Surprises
The vignette made a huge difference. Without it, the piece felt flat and infinite. With it, the garden feels contained, like you're looking through a window or at a specific physical space.

Also: the "moonlight" palette is unexpectedly popular (in my own taste tests). There's something about blue sand that feels otherworldly in a good way.

## Connections
- [[flow-field]] — both use procedural generation, opposite energy (chaos vs calm)
- [[mandala]] — circular patterns, but mandalas are dense and complex where this is sparse
- [[particle-network]] — both are about negative space, but particles move while this is still

## Lessons
1. **Stillness is a valid aesthetic choice.** Not everything needs to animate.
2. **Traditional art forms translate well to generative.** The constraints of karesansui (sand, rocks, rakes) give structure without limiting creativity.
3. **Color palette matters more than complexity.** Three palettes feel like three different pieces.
4. **Vignette = focus.** Darkening the edges draws the eye to the center naturally.

## Rams Score
Rate 1-10 on each principle:
- Innovative: 8 — procedural zen gardens aren't common
- Useful: 7 — meditative visual for focus/relaxation
- Aesthetic: 9 — minimal, balanced, harmonious
- Understandable: 9 — clear visual hierarchy
- Unobtrusive: 10 — calm, non-distracting
- Honest: 8 — shows its digital nature while evoking physical gardens
- Long-lasting: 9 — timeless aesthetic
- Thorough: 8 — multiple patterns, palettes, compositions
- Minimal: 9 — only essential elements

**Average: 8.6/10**
