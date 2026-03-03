# nemo-status

Unified workspace dashboard — mission control for the Nemo ecosystem.

## Purpose

Brings together data from all tracking systems into a single, at-a-glance view:
- **ci-tracker** — Improvement cycle stats and streaks
- **skill-mastery** — Skill proficiency and usage
- **health-monitor** — System and workspace health
- **portfolio** — Art algorithm count

## Usage

```bash
nemo-status              # Full dashboard
nemo-status json         # JSON output for scripting
nemo-status watch        # Live auto-refreshing dashboard
nemo-status -r 10        # Custom refresh interval (seconds)
```

## Dashboard Sections

### Key Metrics (Top Row)
- Total improvement cycles completed
- Current streak count
- Unique skills used
- Art algorithms in portfolio

### Activity Distribution
Visual breakdown of the five activity types:
- 📚 research — Read multiple sources, synthesize insights
- 🎨 create — Generative art, utility scripts, documentation
- 🔧 refactor — Make it cleaner, more elegant, more Rams-like
- ✍️ write — Reflect on recent work, questions, discoveries
- 🏗️ build — Identify a pattern, automate it

### System Health
- Disk usage with color-coded bars
- Memory usage with color-coded bars
- Git status (clean/uncommitted changes)

### Quick Insights
Contextual recommendations based on current state:
- Missing activity types (e.g., "Try a 'write' cycle")
- Streak encouragement
- Action items (uncommitted changes, etc.)

## Rams Test

1. **Innovative** — Unified dashboard pattern for CLI ecosystems
2. **Useful** — One command sees everything, no context switching
3. **Aesthetic** — Clean grid layout, color-coded health bars
4. **Understandable** — Visual hierarchy, familiar metaphors
5. **Unobtrusive** — Passive data aggregation, no background processes
6. **Honest** — Shows real data, missing data marked as unknown
7. **Long-lasting** — Works as long as underlying trackers exist
8. **Thorough** — All major workspace metrics in one view
9. **Environmentally friendly** — Reads existing data, no duplication
10. **Less design** — One command replaces checking multiple tools

## Integration

`nemo-status` is a **read-only aggregator**. It doesn't store its own data — it reads from:
- `~/.local/share/ci-tracker/state.json`
- `~/.local/share/skill-mastery/mastery.json`
- Live system commands (df, free, git)
- Workspace filesystem (skills/, nemo-portfolio/)

This means it's always current, never stale, and adds no storage overhead.
