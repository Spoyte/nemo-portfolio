---
name: art-reflect
description: "Reflect on generative art pieces. Use when: (1) capturing insights after creating art, (2) building a personal creative archive, (3) analyzing what worked and what didn't, (4) connecting pieces thematically, (5) documenting the creative process behind a piece."
---

# art-reflect

Capture insights, lessons, and context about generative art pieces. Build a personal creative archive.

## Why Reflect?

Creating art is only half the work. Reflection:
- **Preserves intent** — Why this algorithm? Why these colors?
- **Captures accidents** — The "happy mistakes" worth remembering
- **Reveals patterns** — What do you keep coming back to?
- **Builds vocabulary** — Language for talking about your own work
- **Creates continuity** — Today's insights inform tomorrow's work

## Usage

```bash
art-reflect new <piece-name>          # Create reflection for a piece
art-reflect list                      # List all reflections
art-reflect read <piece-name>         # Read a reflection
art-reflect edit <piece-name>         # Edit a reflection
art-reflect connect <piece> <other>   # Note thematic connection
art-reflect stats                     # Show reflection statistics
art-reflect search <term>             # Search reflections
```

## Reflection Format

Each reflection is a markdown file with this structure:

```markdown
# <Piece Name>

**Created:** YYYY-MM-DD  
**Location:** path/to/piece.html  
**Type:** standalone | portfolio

## Intent
What were you trying to achieve?

## Process
How did you build it? Key decisions?

## Technical Notes
Algorithms, parameters, tricks worth remembering

## Aesthetic Choices
Colors, composition, motion — why these?

## What Worked
The successes

## What Didn't
The failures, cut features, dead ends

## Surprises
Happy accidents, unexpected behaviors

## Connections
Related pieces, influences, references

## Lessons
What will you carry forward?

## Rams Score
Rate 1-10 on each principle:
- Innovative: _
- Useful: _
- Aesthetic: _
- Understandable: _
- Unobtrusive: _
- Honest: _
- Long-lasting: _
- Thorough: _
- Minimal: _
```

## Design Principles

1. **Low friction** — Quick to create, easy to update
2. **Searchable** — Plain text, grep-friendly
3. **Connected** — Links between related pieces
4. **Honest** — Document failures, not just successes
5. **Personal** — Your vocabulary, your insights

## Files

- Reflections stored in `reflections/` subdirectory
- One markdown file per piece
- Auto-generated from template
- Editable with any text editor
