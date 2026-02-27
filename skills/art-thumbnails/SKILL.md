---
name: art-thumbnails
description: "Generate static SVG thumbnail previews for the art gallery"
---

# Art Thumbnails

Generates category-appropriate SVG thumbnails for each art piece in the gallery. Replaces generic icons with visual previews that give users a taste of what each algorithm produces.

## Quick Commands

```bash
# Generate all missing thumbnails
art-thumbnails

# Generate specific thumbnail
art-thumbnails flow-field

# Force regenerate all
art-thumbnails --regenerate

# List status of all pieces
art-thumbnails --list

# Clean all thumbnails
art-thumbnails --clean

# Enhanced version (art-specific thumbnails)
art-thumbnails-enhanced --list
art-thumbnails-enhanced --regenerate
art-thumbnails-enhanced --verify
```

## What It Does

Each art piece gets a category-appropriate SVG thumbnail:

| Category | Visual Style |
|----------|--------------|
| **Mathematical** | Spiral patterns, fractal-like structures |
| **Natural** | Branching trees, organic growth patterns |
| **Physics** | Wave interference, particle systems |
| **Geometric** | Mandala-like symmetry, radial patterns |
| **Traditional** | Cross-hatching, sketch-like textures |
| **Abstract** | Flowing gradients, organic shapes |

Thumbnails are saved to `public/art-thumbnails/{art-id}.svg` and can be referenced by the gallery.

## Two Generators

### `art-thumbnails` (Original)
Category-based templates. Fast, consistent, good for bulk generation.

### `art-thumbnails-enhanced` (New)
Art-specific thumbnails based on each piece's unique characteristics:
- **Flow field** → Flowing curves with particle dots
- **Spirograph** → Elliptical spirograph patterns
- **Mandelbrot** → Cardioid shape with bulb
- **Particle systems** → Network nodes and connections
- **Wave interference** → Overlapping sine waves
- **Trees/Nature** → Recursive branching structures
- **Fractals** → Self-similar branching
- **Cellular automata** → Grid patterns

The enhanced version also includes:
- **Verification mode** (`--verify`) — Check for orphaned/missing thumbnails
- **Better metadata extraction** — Pulls names from metadata.ts
- **Art-specific colors** — Based on tags (colorful vs monochrome)

## Integration with Gallery

To use thumbnails in the gallery, update the `ArtworkCard` component:

```tsx
// In art-gallery/page.tsx, replace the icon preview with:
<Image 
  src={`/art-thumbnails/${generator.id}.svg`}
  alt={generator.name}
  width={400}
  height={300}
  className="object-cover"
/>
```

## Design Principles

1. **Category consistency** — Same category = similar visual language
2. **SVG format** — Scalable, small file size, editable
3. **Dark theme** — Matches the portfolio aesthetic
4. **Gradient accents** — Each category has its color identity
5. **Fast generation** — Pure bash, no dependencies
6. **Art-specific detail** — Unique patterns for recognizable algorithms

## Future Enhancements

- [x] Generate art-specific thumbnails (enhanced version)
- [x] Verification mode for consistency checking
- [ ] Generate actual screenshots from canvas output
- [ ] Add animation hints (subtle CSS animations)
- [ ] Support for custom thumbnail per piece
- [ ] Thumbnail caching with content hashing

---

*Visual previews beat generic icons every time.*
