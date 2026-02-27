---
name: art-ideate
description: "Ideation engine for generative art. Use when: (1) Looking for new algorithm ideas, (2) Understanding portfolio gaps, (3) Wanting inspiration for the next piece."
---

# Art Ideate

Generative art ideation engine that analyzes the portfolio and suggests what to create next based on domain coverage gaps.

## Quick Commands

```bash
# Top 5 ideas for the portfolio
art-ideate

# Show all gaps across all domains
art-ideate --all

# Category balance visualization
art-ideate --category

# Pick one random idea (commitment mode)
art-ideate --random

# JSON output for automation
art-ideate --json
```

## How It Works

The ideation engine maintains a taxonomy of generative art domains:

- **Mathematical** — Curves, fractals, tessellations, topology
- **Natural** — Flora, fauna, weather, geology, organic growth
- **Physical** — Waves, particles, fields, forces, fluids
- **Optical** — Interference, diffraction, reflection, shadows
- **Geometric** — Tiling, packing, symmetry, transformations
- **Algorithmic** — Sorting, graphs, automata, neural nets

Each domain has a pool of suggestions. The tool:

1. **Scans** all existing algorithms in `lib/art/`
2. **Classifies** each by domain using keyword analysis
3. **Calculates** coverage percentage per domain
4. **Ranks** suggestions from underrepresented domains

## Sample Output

```
🎨 Portfolio: 86 algorithms analyzed

💡 Top 5 Ideas
============================================================

1. Phyllotaxis Spiral
   Command: art-new phyllotaxis-spiral "Phyllotaxis Spiral"
   Domain:  mathematical (23% coverage)
   Concept: Golden angle spiral found in sunflowers and pinecones
   Why now: Mathematical domain is only 23% covered

2. Lightning Bolt
   Command: art-new lightning-bolt "Lightning Bolt"
   Domain:  natural (31% coverage)
   Concept: Dielectric breakdown simulation with branching
   Why now: Natural domain is only 31% covered

...
```

## Design Philosophy

**Constraint breeds creativity** — The tool doesn't suggest "anything." It suggests *specific* algorithms that fill *specific* gaps. The constraint of domain balance focuses creativity rather than limiting it.

**Action over deliberation** — Each idea includes the exact `art-new` command to execute immediately. No "maybe I'll think about it." Just run the command and start building.

**Portfolio as ecosystem** — The portfolio has 86+ pieces. New additions should strengthen the whole, not just add volume. Domain balance ensures diversity.

## Adding New Suggestions

Edit `art-ideate.py` and add to the `DOMAINS` dictionary:

```python
"mathematical": {
    "existing": set(),  # Auto-populated
    "patterns": ["curves", "fractals"],
    "suggestions": [
        ("Your Idea Name", "Description of the concept"),
        # ... more suggestions
    ]
}
```

## Integration with Workflow

The cron job's continuous improvement cycle can use this:

```bash
# In improvement cycle, when choosing "create something":
art-ideate --random | art-new $(extract_name) "$(extract_title)"
```

This closes the loop: analyze → suggest → create → commit → repeat.

---

*Ideas are cheap. Executed ideas are priceless.*
