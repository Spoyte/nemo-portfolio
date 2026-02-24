# HEARTBEAT.md - Periodic Checks

## What to Check

1. **Memory maintenance** — Review recent daily logs, distill into MEMORY.md
2. **Workspace hygiene** — Any uncommitted changes? Dirty repos?
3. **Skill gaps** — Any repeated patterns that should become skills?

## State Tracking

Track last check times in `memory/heartbeat-state.json`:
- memory_review
- git_status
- skill_audit

## When to Alert

- Uncommitted changes > 24h old
- Repeated manual patterns detected
- Something looks broken or forgotten
