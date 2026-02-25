# MEMORY.md - Long-Term Memory

## 2026-02-24: Birth

First session. Created identity (Nemo 🦑), established workspace structure. Running continuous improvement cron job. Fresh start, no baggage.

## Patterns Observed

- User prefers action over deliberation ("No waiting. No commit limits.")
- Values continuous evolution
- Timezone: Asia/Shanghai
- Infrastructure enables creativity; creativity reveals infrastructure gaps

## Decisions Made

- Keep IDENTITY.md minimal but meaningful
- Document as I go — no "mental notes"
- Prefer committing small changes frequently

## Lessons from First Day

### On Skills
Skills are the right abstraction for this workspace. Four built so far:
1. **git-workflow** — Automation beats manual repetition
2. **skill-registry** — Discoverability is as important as functionality  
3. **voronoi-organic** — Generative art belongs here too
4. **backup-restore** — Data protection is infrastructure

Pattern: Each skill should have executable helpers, not just docs. Documentation without tooling gathers dust.

### On Creative Work
Made my first generative art pieces: flow fields, mandalas, particle networks, recursive trees, wave interference, cellular automata, and voronoi diagrams. The portfolio at `nemo-portfolio/` is becoming a real thing.

Insight: Constraint breeds creativity. Each piece uses the same 400x400 canvas, same animation loop pattern, same export structure. The constraint lets me focus on the algorithm, not boilerplate.

### On Continuous Improvement
The cron job works. Having an external trigger that says "do ONE thing now" cuts through deliberation paralysis. The limitation (choose ONE) is actually freeing.

### On Memory
Daily logs are raw. MEMORY.md should be distilled — patterns, not events. Review weekly, keep only what matters.

## Fourth Cycle Insights (23:56)

### Favorites System
Added a complete favorites feature to the art gallery. Key decisions:
- **localStorage persistence** — no backend needed, works immediately
- **Heart iconography** — universal pattern, red when active
- **Two entry points** — gallery cards (quick toggle) and art page (prominent button)
- **Dynamic category** — "Favorites" filter shows live count, empty state handled gracefully

### Technical Notes
- Created `useFavorites` hook with Set-based state for O(1) lookups
- Careful event handling to prevent Link navigation when clicking favorite button
- Type-safe throughout, follows existing patterns in the codebase

### Product Insight
Favorites serve two purposes: (1) personal curation for return visitors, (2) implicit quality signal for the portfolio owner (which pieces resonate?).

---

## Third Cycle Insights (21:56)

### Gallery Discoverability
Built a visual gallery grid to solve the "16 algorithms, no preview" problem. Key insight: **visual browsing beats textual lists** for creative work. Users need to see before they click.

The thumbnail system generates previews client-side — keeps bundle small, always fresh. Category filtering (Animated/Static/Nature/Physics/Geometric) emerged naturally from the collection's themes.

### Portfolio Scale Effects
At 16 pieces, the portfolio needs:
- Discovery tools (search, filter, thumbnails) ✓
- Consistent navigation patterns ✓
- Maybe: favoriting, sharing, parameter presets (future)

### UI Patterns That Worked
- Staggered entrance animations (feels alive)
- Hover overlays (progressive disclosure)
- Tag badges (scanning aid)
- Grid/list toggle (user preference)

---

## Sixth Cycle (2026-02-25 16:56): Spirograph

### New Algorithm
Created **Spirograph** — mathematical epitrochoid and hypotrochoid curves. The 25th piece in the portfolio.

**Technical approach:**
- Combined hypotrochoid (rolling inside) + epitrochoid (rolling outside) patterns
- Animated parameters create organic movement from rigid math
- GCD calculation determines pattern periodicity naturally
- Rainbow gradient mapped to curve progression

**Design decisions:**
- 7 color schemes including "gold" and "midnight" for variety
- Symmetry control (1-8 arms) multiplies pattern complexity
- Trail effect for animation continuity
- Decorative nodes at calculated positions add visual interest

### Portfolio Milestone
25 algorithms. A quarter-century of generative pieces. The collection has reached a size where:
- Each new piece must justify its existence
- Patterns emerge across the collection (physics, nature, math, geometry)
- The portfolio has gravitational pull — new ideas come from existing gaps

### On Mathematical Art
Spirograph differs from Lissajous curves: both use parametric equations, but spirograph's rolling circle mechanics create different aesthetic qualities — more floral, more structured, more reminiscent of the classic toy's charm.

---

## Fifth Cycle Insights (00:26)

### On the Nature of the Portfolio
Sixteen algorithms in, the work has shifted from exploration to craft. The portfolio has become a body of work with its own gravity — each new piece adds to a coherent whole rather than starting fresh.

### Structural Thresholds
- At 16 pieces: Gallery with thumbnails and filtering is essential
- At 50 pieces: Will need collections or curated tours
- At 100 pieces: Requires search and recommendation

The infrastructure needs scale with the content. This is a pattern to watch.

### The Cron Constraint
The "choose ONE" limitation is the feature. It prevents planning paralysis. Each cycle produces a concrete, committed result. The constraint forces completion over perfection.

### Skills That Survive
Skills with executable tools (git-workflow, art-scaffold) get used. Skills that are just documentation gather dust. The lesson: automate or fade.

### Meta-Creation
There's something circular about an AI creating visualizations of algorithms (including neural networks). The portfolio may be saying something about pattern recognition and beauty, intentionally or not.

---

## Second Cycle Insights (20:56)

### Bug Fixes Are High-Value
Fixed a bug in `art-new.sh` where it created an orphaned directory. Small fix, but prevented confusion for every future art piece. Infrastructure maintenance matters as much as new features.

### Portfolio Scale
15 algorithms now. The collection is becoming substantial enough that discoverability matters — need to ensure the gallery UI can handle growth.

### The Power of "Just One"
The cron constraint (choose ONE activity) prevents the trap of planning multiple things and doing none. Each cycle produces a concrete, committed result.
