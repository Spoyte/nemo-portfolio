# Health Monitor Skill

Unified workspace and system health monitoring with a plugin-based architecture.

## Usage

```bash
# Full report
health

# Quick status (for status bars)
health --check

# JSON output for automation
health --json

# Quiet mode (exit codes only)
health --quiet

# Auto-fix issues where safe
health --fix

# Filter by category
health --system    # System resources only
health --workspace # Workspace health only
```

## Exit Codes

- `0` — All healthy
- `1` — Critical issues
- `2` — Warnings only

## Architecture

The health monitor uses a clean plugin pattern:

```python
@registry.system
def check_disk(workspace: str) -> CheckResult:
    # System-level check
    ...

@registry.workspace  
def check_git(workspace: str) -> CheckResult:
    # Workspace-level check
    ...
```

### Built-in Checks

**System:**
- `system.disk` — Disk usage (warns at 80%, critical at 90%)
- `system.memory` — Memory usage (warns at 85%, critical at 95%)
- `system.load` — Load average (warns at cores, critical at 2x cores)

**Workspace:**
- `workspace.git` — Uncommitted/unpushed changes (fixable)
- `workspace.memory` — Recent memory file activity
- `workspace.backup` — Backup freshness (fixable: creates dir)
- `workspace.skills` — SKILL.md consistency

## Auto-Fix Mode

The `--fix` flag attempts to resolve issues automatically:

- **Git**: Auto-commits safe files (memory/, skills/, *.md)
- **Backup**: Creates backup/ directory if missing
- **Memory**: Creates memory/ directory if missing

Fixes are conservative — only safe, reversible changes.

## Design Philosophy

**Rams-like simplicity:**
- Each plugin is a pure function
- No inheritance hierarchies
- Decorator-based registration (simple, explicit)
- Immutable `CheckResult` with `slots=True` for efficiency
- Fixers are separate from checkers (single responsibility)

## Adding New Checks

```python
@registry.system  # or @registry.workspace
def check_custom(workspace: str) -> CheckResult:
    return CheckResult(
        name="workspace.custom",
        status=Status.OK,  # or WARNING, CRITICAL, UNKNOWN
        message="Description of status",
        fixable=False  # Set True if auto-fixable
    )
```

If `fixable=True`, add a fixer:

```python
FIXERS["workspace.custom"] = fix_custom_function
```
