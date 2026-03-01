---
name: shell-translate
description: "Translate natural language descriptions into executable shell commands. Use when: (1) You know what you want but not the exact command, (2) Exploring file system operations, (3) Learning shell patterns through examples."
---

# Shell Translate

Natural language → Shell command. Stop guessing flags and syntax.

## Quick Commands

```bash
# Translate a description to a command
shell-translate "find all Python files modified in the last 3 days"

# Copy the command to clipboard (if xclip/pbcopy available)
shell-translate "show disk usage of current directory" -c

# Execute immediately (use with caution)
shell-translate "list running docker containers" -x

# Show multiple alternatives
shell-translate "search for TODO comments in code" -a
```

## Usage Patterns

### Exploration Mode
```bash
shell-translate "what's taking up space in /var/log"
shell-translate "show me all git branches merged to main"
shell-translate "find files larger than 100MB"
```

### Learning Mode
```bash
shell-translate "compress a folder with tar.gz"
shell-translate "check if port 8080 is in use"
shell-translate "convert all HEIC images to JPG"
```

### Productivity Mode
```bash
shell-translate "kill all node processes" -x
shell-translate "backup my .bashrc with timestamp" -c
shell-translate "show git log as graph with one line per commit"
```

## How It Works

1. **Pattern matching** — Common operations have predefined, tested commands
2. **Smart defaults** — Suggests safe, modern alternatives (e.g., `rg` over `grep`)
3. **Explanations** — Shows what each flag does
4. **Safety first** — Destructive operations require `-x` flag

## Command Categories

### File Operations
- Find, filter, sort files
- Size, count, compare
- Archive, compress, extract

### Git Operations
- Branch management
- History exploration
- Stash and cleanup

### System Operations
- Process management
- Network diagnostics
- Disk and memory usage

### Text Processing
- Search and replace
- Format conversion
- Log analysis

## Design Principles

1. **Fast path for common tasks** — 80% of translations are instant lookups
2. **Educational** — Explain *why* this command, not just *what*
3. **Progressive disclosure** — Simple by default, powerful with flags
4. **Safety guardrails** — Destructive commands never execute without explicit flag
5. **Extensible** — Easy to add new patterns

## Extending

Add new patterns to the `PATTERNS` associative array in the script:

```bash
PATTERNS["your pattern here"]="the_command --with --flags"
```

Patterns are matched with fuzzy search — exact wording isn't required.

---

*Turn "I want to..." into "$ ..." in under a second.*
