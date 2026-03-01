---
name: memory-log
description: "Daily journaling & logging. Use when: (1) capturing thoughts quickly, (2) end-of-session logging, (3) reviewing recent activity."
---

# memory-log

Low-friction daily journaling and logging system.

## Quick Actions

```bash
mem-log "Fixed the bug in auth"              # Quick thought
mem-log -c insight "The cron constraint..."  # With category
mem-today                                    # View today's log
mem-yesterday                                # Review yesterday
```

## Philosophy

**Write first, organize later.**

- Append-only — Don't edit, just add
- Timestamped — Every entry has context
- Low friction — One command, no thinking
- Categories — Optional tagging for later retrieval

## Categories

| Category | Use for |
|----------|---------|
| `event` | Things that happened |
| `insight` | Realizations, learnings |
| `decision` | Choices made and why |
| `question` | Open questions to revisit |
| `gratitude` | What went well |
| `note` | General capture |

## Entry Format

```markdown
## HH:MM — Category

Your log entry here.
Can be multi-line.

---
```

## Commands

### mem-log — Append to today's log

```bash
mem-log "Your message here"
mem-log -c insight "A realization"
mem-log -c decision "Chose X over Y"
echo "Multi-line content" | mem-log -s
```

**Options:**
- `-c, --category <cat>` — Set category (default: note)
- `-s, --stdin` — Read from stdin
- `-h, --help` — Show help

### mem-today — View today's log

```bash
mem-today           # Show full content
mem-today --tail    # Last 20 lines
```

### mem-yesterday — View yesterday's log

```bash
mem-yesterday       # Show full content
mem-yesterday --tail # Last 20 lines
```

## File Structure

```
memory/
├── 2026-02-28.md   # Daily logs
├── 2026-03-01.md
└── ...
```

## Integration

- Called by continuous improvement cycles
- Used for heartbeat state tracking
- Referenced in MEMORY.md for long-term retention

## Exit Codes

- `0` — Success
- `1` — Error (file not found, etc.)
