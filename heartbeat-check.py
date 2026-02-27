#!/usr/bin/env python3
"""
heartbeat-check.py — Workspace health monitoring
Less, but better. — Dieter Rams
"""

import json
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Callable


@dataclass(frozen=True)
class Check:
    """A single health check."""
    name: str
    passed: bool
    message: str
    details: list[str] = field(default_factory=list)
    suggestion: str = ""


@dataclass(frozen=True)
class Report:
    """Collection of check results."""
    checks: list[Check]
    timestamp: datetime = field(default_factory=datetime.now)
    
    @property
    def ok(self) -> bool:
        return all(c.passed for c in self.checks)
    
    @property
    def issues(self) -> int:
        return sum(1 for c in self.checks if not c.passed)


# ─────────────────────────────────────────────────────────────────────────────
# Checks
# ─────────────────────────────────────────────────────────────────────────────

def check_memory(workspace: Path) -> Check:
    """Check if daily logs need distillation."""
    memory_dir = workspace / "memory"
    daily = sorted(memory_dir.glob("2026-*.md")) if memory_dir.exists() else []
    
    if not daily:
        return Check("memory", True, "No daily logs", ["Nothing to process"])
    
    now = datetime.now()
    recent = [f for f in daily if (now - datetime.fromtimestamp(f.stat().st_mtime)).days <= 3]
    old = [f for f in daily if (now - datetime.fromtimestamp(f.stat().st_mtime)).days > 7]
    
    memory_md = workspace / "MEMORY.md"
    memory_age = (now - datetime.fromtimestamp(memory_md.stat().st_mtime)).days if memory_md.exists() else None
    
    details = [
        f"Recent logs (≤3d): {len(recent)}",
        f"Old logs (>7d): {len(old)}",
        f"MEMORY.md: {memory_age}d old" if memory_age else "MEMORY.md: missing"
    ]
    
    needs_work = bool(old and (memory_age is None or memory_age > 7))
    
    return Check(
        name="memory",
        passed=not needs_work,
        message="Needs distillation" if needs_work else "Up to date",
        details=details,
        suggestion=f"Distill {len(old)} old logs" if needs_work else ""
    )


def check_git(workspace: Path) -> Check:
    """Check repository status."""
    repos = list(workspace.rglob(".git"))
    dirty = []
    
    for git_dir in repos:
        repo = git_dir.parent
        try:
            status = subprocess.run(
                ["git", "status", "--porcelain"], cwd=repo, capture_output=True, text=True, timeout=5
            )
            ahead = subprocess.run(
                ["git", "rev-list", "--count", "@{u}..HEAD"], cwd=repo, capture_output=True, text=True, timeout=5
            )
            
            uncommitted = len([l for l in status.stdout.splitlines() if l.strip()])
            unpushed = int(ahead.stdout.strip() or 0) if ahead.returncode == 0 else 0
            
            if uncommitted or unpushed:
                dirty.append((repo.relative_to(workspace), uncommitted, unpushed))
        except Exception:
            continue
    
    details = [f"Scanned: {len(repos)} repos"]
    details += [f"  {r[0]}: +{r[1]} ~{r[2]}" for r in dirty[:5]]
    if len(dirty) > 5:
        details.append(f"  ... and {len(dirty) - 5} more")
    
    return Check(
        name="git",
        passed=len(dirty) == 0,
        message=f"{len(dirty)} repos need attention" if dirty else "All clean",
        details=details,
        suggestion="Commit and push" if dirty else ""
    )


def check_skills(workspace: Path) -> Check:
    """Check for skill gaps."""
    skills_dir = workspace / "skills"
    skill_count = len([d for d in skills_dir.iterdir() if d.is_dir()]) if skills_dir.exists() else 0
    
    # Find scripts that could be skills
    candidates = []
    keywords = {"backup": "backup|restore", "deploy": "deploy|release", "sync": "sync|mirror"}
    
    for folder in [workspace / "bin", workspace / "scripts"]:
        if not folder.exists():
            continue
        for script in folder.iterdir():
            if not script.is_file():
                continue
            name = script.name.lower()
            for skill, pattern in keywords.items():
                if any(p in name for p in pattern.split("|")):
                    skill_path = skills_dir / skill if skills_dir.exists() else None
                    if not skill_path or not skill_path.exists():
                        candidates.append((skill, script.name))
    
    details = [f"Skills: {skill_count}"]
    if candidates:
        details += [f"  {c[1]} → skill '{c[0]}'" for c in candidates[:3]]
    
    return Check(
        name="skills",
        passed=len(candidates) <= 2,
        message=f"{len(candidates)} candidates found" if candidates else "Coverage good",
        details=details,
        suggestion="Create skills" if len(candidates) > 2 else ""
    )


# ─────────────────────────────────────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────────────────────────────────────

def fmt_json(report: Report) -> str:
    return json.dumps({
        "timestamp": report.timestamp.isoformat(),
        "ok": report.ok,
        "issues": report.issues,
        "checks": [{"name": c.name, "passed": c.passed, "message": c.message,
                     "details": c.details, "suggestion": c.suggestion} for c in report.checks]
    }, indent=2)


def fmt_text(report: Report) -> str:
    lines = ["═" * 40, "  💓 HEARTBEAT", "═" * 40, f"  {report.timestamp:%H:%M:%S}", ""]
    
    for c in report.checks:
        icon = "✅" if c.passed else "⚠️"
        lines.append(f"{icon} {c.name.upper()}: {c.message}")
        lines += [f"   • {d}" for d in c.details[:4]]
        if c.suggestion:
            lines.append(f"   → {c.suggestion}")
        lines.append("")
    
    lines.append("─" * 40)
    lines.append("All good 💚" if report.ok else f"{report.issues} issue(s)")
    lines.append("═" * 40)
    
    return "\n".join(lines)


def fmt_compact(report: Report) -> str:
    icons = "".join("✅" if c.passed else "⚠️" for c in report.checks)
    return f"{icons} | {report.issues} issues"


# ─────────────────────────────────────────────────────────────────────────────
# State
# ─────────────────────────────────────────────────────────────────────────────

def load_state(path: Path) -> dict:
    return json.loads(path.read_text()) if path.exists() else {}


def save_state(path: Path, report: Report) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    state = {
        "last_run": report.timestamp.isoformat(),
        **{c.name: report.timestamp.isoformat() for c in report.checks}
    }
    path.write_text(json.dumps(state, indent=2))


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Workspace health check")
    parser.add_argument("--json", action="store_true", help="JSON output")
    parser.add_argument("--compact", action="store_true", help="One-line status")
    parser.add_argument("--quiet", action="store_true", help="Silent on success")
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    args = parser.parse_args()
    
    # Run checks
    checks: list[Callable[[Path], Check]] = [check_memory, check_git, check_skills]
    report = Report(checks=[c(args.workspace) for c in checks])
    
    # Persist state
    save_state(args.workspace / "memory" / "heartbeat-state.json", report)
    
    # Output
    if args.compact:
        print(fmt_compact(report))
    elif args.json:
        print(fmt_json(report))
    elif not args.quiet or not report.ok:
        print(fmt_text(report))
    
    sys.exit(0 if report.ok else 1)


if __name__ == "__main__":
    main()
