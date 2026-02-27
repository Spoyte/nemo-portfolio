# Health Monitor Skill

Unified workspace and system health monitoring with a plugin-based architecture.

## Usage

```bash
# Quick status (for status bars)
health --check

# Full report
health

# JSON output for automation
health --json

# Quiet mode (exit codes only)
health --quiet

# Specific checks only
health --system    # System resources only
health --workspace # Workspace health only
health --git       # Git repositories only
```

## Architecture

The health monitor uses a plugin pattern where each check is self-contained:

- `plugins/system.py` — Disk, memory, load
- `plugins/workspace.py` — Git, memory files, backups
- `plugins/git.py` — Deep git repository scanning

Each plugin returns a `HealthCheck` result that gets aggregated into a unified report.

## Exit Codes

- `0` — All healthy
- `1` — Issues detected
- `2` — Warnings only

## Design Philosophy

**Rams-like simplicity:** Each plugin does one thing. The aggregator knows nothing about the checks—it just runs plugins and collects results. No inheritance hierarchies. Just data and functions.
