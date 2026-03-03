---
name: skill-runner
description: "Unified skill interface. Use when: (1) discovering available skills, (2) running skills without remembering exact commands, (3) exploring what you can do."
---

# skill-runner

One command to discover and run all workspace skills.

## Version

2.0.0 — Refactored with better error messages, skill help support, and fish completion.

## Quick Actions

```bash
nemo                          # List all skills (default)
nemo list                     # Same as above
nemo list -q                  # Names only (for scripting)
nemo list -v                  # With descriptions
nemo list -j                  # JSON output
nemo <skill> [args...]        # Run a skill
nemo info <skill>             # Show skill details
nemo docs <skill>             # Read full documentation
nemo help <skill>             # Show skill's built-in help
nemo search <query>           # Find skills by keyword
nemo exec <skill> <script>    # Run specific script from skill
nemo sync                     # Auto-manage bin/ symlinks
nemo version                  # Show version and stats
nemo completion -s bash       # Shell completion (bash/zsh/fish)
```

## Design Principles

1. **Discoverable** — `nemo list` shows everything available
2. **Consistent** — Same interface for all skills
3. **Scriptable** — Exit codes, quiet mode, JSON output
4. **Self-documenting** — Every skill explains itself
5. **Helpful errors** — Clear messages when things go wrong

## Improvements in v2.0

- **New `help` command**: Shows skill's built-in help (--help, -h, or help subcommand)
- **Better error messages**: Contextual hints when skills fail
- **Fish shell completion**: Added alongside bash and zsh
- **Skill caching**: Faster repeated operations
- **Version command**: Shows nemo version, skills dir, and count
- **Cleaner code**: Separated concerns, consistent patterns

## Improvements in v2.1

- **New `sync` command**: Auto-manages symlinks in `bin/` directory
  - Creates symlinks for skills with executables
  - Removes stale symlinks pointing to deleted skills
  - Run after adding new skills to make them available directly

## How It Works

1. Scans `skills/` directory for `SKILL.md` files
2. Parses frontmatter for name and description
3. Looks for executable with same name as skill directory
4. Provides unified interface to run them

## Error Handling

```bash
$ nemo nonexistent
✗ Unknown command or skill: 'nonexistent'

Run 'nemo list' to see available skills.

$ nemo info nonexistent  
✗ Skill 'nonexistent' not found

$ nemo exec skill script
✗ Script 'script' not found in skill 'skill'

$ nemo exec skill script
✗ Script 'script' is not executable (chmod +x?)
```
