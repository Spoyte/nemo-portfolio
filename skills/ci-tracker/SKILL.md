---
name: ci-tracker
description: "Track and visualize the nemo-continuous-improvement cycle. Use when: (1) checking cycle statistics, (2) logging completed cycles, (3) analyzing improvement patterns."
---

# ci-tracker — Continuous Improvement Cycle Tracker

Visualize, track, and analyze the continuous improvement cycle. Makes the invisible cron job tangible.

## Quick Actions

```bash
ci-tracker              # Show current statistics
ci-tracker status       # Same as above
ci-tracker log create   # Log today's cycle
ci-tracker history      # Show recent cycles
ci-tracker sync         # Import from memory files
ci-tracker activities   # Show the five activity types
```

## The Five Activities

| Activity | Emoji | Description |
|----------|-------|-------------|
| research | 📚 | Read multiple sources, synthesize insights |
| create | 🎨 | Generative art, utility script, documentation, poem |
| refactor | 🔧 | Make it cleaner, more elegant, more Rams-like |
| write | ✍️ | Reflect on recent work, questions, discoveries |
| build | 🏗️ | Identify a pattern, automate it |

## Commands

### status

Show comprehensive cycle statistics:
- Total cycles completed
- Current and longest streaks
- Activity distribution with bar charts
- Today's cycle status

```bash
ci-tracker status
ci-tracker status --json   # Machine-readable output
```

### log

Record a completed cycle:

```bash
ci-tracker log research
ci-tracker log create "Built ci-tracker skill"
ci-tracker log refactor
ci-tracker log write
ci-tracker log build
```

### history

View recent cycles:

```bash
ci-tracker history         # Last 20 cycles
ci-tracker history 10      # Last 10 cycles
ci-tracker history --json  # JSON output
```

### sync

Import cycles from memory files (auto-detects activity from daily logs):

```bash
ci-tracker sync
```

### activities

Display the five activity types with descriptions:

```bash
ci-tracker activities
```

## Data Storage

- State: `~/.local/share/ci-tracker/state.json`
- History: `~/.local/share/ci-tracker/history.jsonl`

## The Philosophy

The continuous improvement cycle runs automatically via cron, but its effects are invisible. This skill makes it visible:

1. **Tracking** — Count cycles, maintain streaks
2. **Visualization** — Bar charts, sparklines, distributions
3. **Analysis** — Activity balance, patterns over time
4. **Motivation** — Streaks, progress, tangible proof of evolution

The goal isn't gamification—it's awareness. You can't improve what you don't measure.

## The Rams Test

1. **Innovative** — Makes invisible automation visible
2. **Useful** — Tracks progress, maintains motivation
3. **Aesthetic** — Clean bar charts, emoji indicators
4. **Understandable** — Simple commands, clear output
5. **Unobtrusive** — Background tracking, on-demand viewing
6. **Honest** — Shows gaps, doesn't fake data
7. **Long-lasting** — JSON storage, simple format
8. **Thorough** — Sync from memory, multiple views
9. **Environmentally friendly** — Pure bash, minimal deps
10. **Less design** — Five commands, focused purpose
