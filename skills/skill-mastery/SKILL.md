---
name: skill-mastery
description: "Track skill proficiency, identify gaps, guide deliberate practice"
version: "1.0.0"
author: nemo
---

# skill-mastery

Track your proficiency across all workspace skills. Identify gaps, guide deliberate practice, and visualize mastery progression.

## Why This Exists

The workspace has 18+ skills, but without tracking:
- You forget which skills you've mastered
- Some skills go unused (missed opportunities)
- Others get overused (comfort zone trap)
- No feedback on what to practice next

This skill brings visibility to skill usage patterns.

## Quick Start

```bash
# View your mastery dashboard
skill-mastery

# See all skills with levels
skill-mastery list

# Log that you used a skill
skill-mastery log art-new 85

# Get personalized recommendations
skill-mastery insights
```

## Proficiency Levels

Based on the Dreyfus model, simplified:

| Level | Emoji | Name | Threshold | Meaning |
|-------|-------|------|-----------|---------|
| 0 | 🌱 | Novice | 0 uses | Never used |
| 1 | 🌿 | Beginner | 1+ uses | Getting started |
| 2 | 🌲 | Competent | 5+ uses | Regular use |
| 3 | ⭐ | Proficient | 20+ uses | Comfortable |
| 4 | 🌟 | Expert | 50+ uses | Highly skilled |
| 5 | 👑 | Master | 100+ uses | Deep mastery |

Satisfaction ratings (0-100) can adjust levels up or down.

## Commands

### `skill-mastery status`

Dashboard view with:
- Total invocations
- Skills used vs. available
- Coverage percentage
- Top 5 most used skills
- Unused skills list

### `skill-mastery list`

Complete skill inventory:
- All skills with current level
- Invocation count
- Visual progress bar
- Category tags

### `skill-mastery log <skill> [satisfaction]`

Record skill usage:
- Tracks when you use a skill
- Optional satisfaction rating (0-100)
- Updates proficiency level
- Appends to usage history

### `skill-mastery insights`

Personalized recommendations:
- **Expand**: Unused skills to try
- **Practice**: Novice skills to develop
- **Leverage**: Expert skills to extend
- Category balance visualization

### `skill-mastery sync`

Import usage from memory files:
- Scans `memory/YYYY-MM-DD.md` files
- Detects skill invocations
- Backfills usage history

### `skill-mastery compare`

Shows relationship with `ci-tracker`:
- CI cycles = breadth of activity
- Skill mastery = depth of capability
- Together reveal growth patterns

## Data Storage

```
~/.local/share/skill-mastery/
├── mastery.json      # Current state
└── usage.jsonl       # Usage history (append-only)
```

## Integration with ci-tracker

These two skills complement each other:

| | ci-tracker | skill-mastery |
|---|---|---|
| **Tracks** | Improvement cycles | Skill proficiency |
| **Answers** | "What did I do?" | "How well can I do it?" |
| **Focus** | Activity patterns | Capability depth |
| **Time** | Cycles over days | Uses over time |

Use both for complete self-awareness.

## Rams Test

1. **Innovative** — Dreyfus-based proficiency tracking for CLI skills
2. **Useful** — Identifies gaps, guides practice, prevents comfort-zone traps
3. **Aesthetic** — Clean visual bars, emoji levels, consistent with ecosystem
4. **Understandable** — Clear levels, intuitive commands, helpful insights
5. **Unobtrusive** — Passive tracking possible via sync
6. **Honest** — Satisfaction-adjusted levels prevent false confidence
7. **Long-lasting** — Proficiency builds over time, data persists
8. **Thorough** — Categories, history, recommendations, comparisons
9. **Environmentally friendly** — Minimal compute, local storage
10. **Less design** — Simple JSON, focused features, no bloat

## Future Extensions

- Skill dependency mapping
- Learning path suggestions
- Time-to-proficiency tracking
- Skill combination recommendations
- Export for portfolio/resume
