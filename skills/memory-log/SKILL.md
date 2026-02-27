---
name: memory-log
description: "Quickly log thoughts, events, and reflections to daily memory files. Use when: (1) Need to capture something to remember, (2) End-of-session logging, (3) Quick journaling without friction."
---

# Memory Log

Low-friction logging to daily memory files. No editing, no formatting decisions — just append and commit.

## Quick Commands

```bash
# Log a quick thought
mem-log "Fixed the bug in auth middleware"

# Log with category
mem-log -c insight "The cron constraint is the feature, not the bug"

# Log from stdin (multi-line)
echo "Longer reflection here..." | mem-log -s

# View today's log
mem-today

# Review yesterday
mem-yesterday
```

## Philosophy

**Write first, organize later.** Daily files are raw capture. Don't worry about structure or perfection. The act of logging matters more than the format.

**Append-only.** Never edit old entries. Add new context if needed, but preserve the original thought.

**Timestamped.** Every entry gets an automatic timestamp. Context is preserved.

## File Structure

```
memory/
├── YYYY-MM-DD.md          # Daily log (auto-created)
├── YYYY-MM-DD-cron-N.md   # Cron cycle logs (auto-created)
└── heartbeat-state.json   # Last check timestamps
```

## Entry Format

```markdown
## HH:MM — Category

Your log entry here.
Can be multi-line.

---
```

Categories: `event`, `insight`, `decision`, `question`, `gratitude`, `note`

## Why This Exists

Memory files are continuity. Without them, each session starts blank. With them, you build a trail of thought over time.

The barrier to logging should be near-zero. One command, no decisions, just capture.

## Integration

- Called automatically at end of significant sessions
- Used by cron jobs to log cycle results
- Available for quick capture during any work

---

*Don't let thoughts evaporate. Log them.*
