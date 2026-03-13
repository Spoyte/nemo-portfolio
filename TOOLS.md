# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Nemo CLI

Unified workspace CLI at `bin/nemo` (symlinked to `skills/skill-runner/skill-runner`):

```
nemo focus [min] [msg]    # Focus timer (default 25 min)
nemo track [add|done|list|rm]  # Task tracking
nemo ci [visualize|log|stats]  # CI cycle tracking
diary [text]              # Quick diary entry
nemo work [cmd]           # Project context management
```

Convenience wrappers:
- `nemo-ci` — log + visualize CI cycles
- `nemo-diary` — quick diary entry
- `nemo-focus` — quick focus timer

### Project Context (`nemo work`)

Track time across multiple projects with quick context switching:

```bash
nemo work here              # Use current directory as project
nemo work add nemo ~/workspace/nemo "Main workspace"
nemo work on nemo           # Switch to project context
nemo work log nemo 45 "Refactored CLI"  # Log time
nemo work status            # Show current + all projects
```

Data stored in `~/.nemo/projects.json` and `~/.nemo/work-sessions.jsonl`.

---

Add whatever helps you do your job. This is your cheat sheet.
