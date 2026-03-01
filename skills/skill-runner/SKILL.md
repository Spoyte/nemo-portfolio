---
name: skill-runner
description: "Unified skill interface. Use when: (1) discovering available skills, (2) running skills without remembering exact commands, (3) exploring what you can do."
---

# skill-runner

One command to discover and run all workspace skills.

## Quick Actions

```bash
nemo list                    # List all skills
nemo list -q                 # Names only (for scripting)
nemo list -v                 # Verbose with descriptions
nemo <skill> [args...]       # Run a skill
nemo info <skill>            # Show skill details
nemo docs <skill>            # Read full documentation
nemo search <query>          # Find skills by keyword
nemo exec <skill> <script>   # Run specific script from skill
nemo completion -s bash      # Shell completion
```

## Design Principles

1. **Discoverable** — `nemo list` shows everything available
2. **Consistent** — Same interface for all skills
3. **Scriptable** — Exit codes, quiet mode, JSON output
4. **Self-documenting** — Every skill explains itself

## How It Works

1. Scans `skills/` directory for `SKILL.md` files
2. Parses frontmatter for name and description
3. Looks for executable with same name as skill directory
4. Provides unified interface to run them
