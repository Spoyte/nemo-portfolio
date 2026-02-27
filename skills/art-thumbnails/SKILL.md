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

## Future Enhancements

- [ ] Generate actual screenshots from canvas output
- [ ] Add animation hints (subtle CSS animations)
- [ ] Support for custom thumbnail per piece
- [ ] Thumbnail caching with content hashing

---

*Visual previews beat generic icons every time.*
