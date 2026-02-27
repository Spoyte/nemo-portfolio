#!/usr/bin/env python3
"""
heartbeat-check.py — Automated workspace health monitoring

Transforms HEARTBEAT.md intentions into actual checks.
Runs the three audits: memory, git, skills
"""

import json
import os
import subprocess
import sys
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional


@dataclass
class CheckResult:
    name: str
    passed: bool
    message: str
    details: list[str]
    suggestion: Optional[str] = None


@dataclass
class HeartbeatReport:
    timestamp: str
    checks: list[CheckResult]
    
    @property
    def all_passed(self) -> bool:
        return all(c.passed for c in self.checks)
    
    @property
    def issues_found(self) -> int:
        return sum(1 for c in self.checks if not c.passed)


class HeartbeatChecker:
    def __init__(self, workspace: Path):
        self.workspace = workspace
        self.memory_dir = workspace / "memory"
        self.state_file = self.memory_dir / "heartbeat-state.json"
        
    def load_state(self) -> dict:
        """Load last check timestamps."""
        if self.state_file.exists():
            with open(self.state_file) as f:
                return json.load(f)
        return {
            "memory_review": None,
            "git_status": None,
            "skill_audit": None
        }
    
    def save_state(self, state: dict):
        """Save check timestamps."""
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.state_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def check_memory_maintenance(self) -> CheckResult:
        """Check if daily logs need distillation into MEMORY.md."""
        details = []
        
        # Find daily memory files
        daily_files = sorted(self.memory_dir.glob("2026-*.md"))
        memory_md = self.workspace / "MEMORY.md"
        
        if not daily_files:
            return CheckResult(
                name="memory_maintenance",
                passed=True,
                message="No daily logs to process",
                details=["No memory/YYYY-MM-DD.md files found"]
            )
        
        # Check dates
        recent_files = []
        old_files = []
        now = datetime.now()
        
        for f in daily_files:
            try:
                date_str = f.stem.split('-cron')[0]  # Handle "2026-02-24-cron-16-26.md"
                file_date = datetime.strptime(date_str, "%Y-%m-%d")
                age_days = (now - file_date).days
                
                if age_days <= 3:
                    recent_files.append((f.name, age_days))
                elif age_days > 7:
                    old_files.append((f.name, age_days))
            except ValueError:
                continue
        
        details.append(f"Recent logs (≤3 days): {len(recent_files)}")
        details.append(f"Old logs (>7 days): {len(old_files)}")
        
        # Check if MEMORY.md exists and is recent
        memory_age_days = None
        if memory_md.exists():
            memory_mtime = datetime.fromtimestamp(memory_md.stat().st_mtime)
            memory_age_days = (now - memory_mtime).days
            details.append(f"MEMORY.md last updated: {memory_age_days} days ago")
        else:
            details.append("MEMORY.md does not exist")
        
        # Determine if action needed
        needs_attention = False
        suggestion = None
        
        if old_files and (memory_age_days is None or memory_age_days > 7):
            needs_attention = True
            suggestion = f"Distill {len(old_files)} old daily logs into MEMORY.md"
        elif len(daily_files) > 5 and (memory_age_days is None or memory_age_days > 3):
            needs_attention = True
            suggestion = "Consider reviewing daily logs and updating MEMORY.md"
        
        return CheckResult(
            name="memory_maintenance",
            passed=not needs_attention,
            message="Daily logs need distillation" if needs_attention else "Memory maintenance up to date",
            details=details,
            suggestion=suggestion
        )
    
    def check_git_status(self) -> CheckResult:
        """Check for uncommitted changes across repos."""
        details = []
        dirty_repos = []
        
        # Find git repositories
        for git_dir in self.workspace.rglob(".git"):
            repo_path = git_dir.parent
            
            try:
                # Check status
                result = subprocess.run(
                    ["git", "status", "--porcelain"],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if result.stdout.strip():
                    lines = result.stdout.strip().split('\n')
                    dirty_repos.append((repo_path.relative_to(self.workspace), len(lines)))
                    
                # Check for unpushed commits
                result = subprocess.run(
                    ["git", "log", "@{u}..", "--oneline"],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if result.stdout.strip():
                    unpushed = len(result.stdout.strip().split('\n'))
                    if dirty_repos and dirty_repos[-1][0] == repo_path.relative_to(self.workspace):
                        dirty_repos[-1] = (repo_path.relative_to(self.workspace), dirty_repos[-1][1], unpushed)
                    else:
                        dirty_repos.append((repo_path.relative_to(self.workspace), 0, unpushed))
                        
            except (subprocess.TimeoutExpired, Exception) as e:
                details.append(f"Could not check {repo_path}: {e}")
        
        details.append(f"Repositories scanned: {len(list(self.workspace.rglob('.git')))}")
        
        if dirty_repos:
            for repo_info in dirty_repos:
                if len(repo_info) == 2:
                    details.append(f"  {repo_info[0]}: {repo_info[1]} uncommitted changes")
                else:
                    details.append(f"  {repo_info[0]}: {repo_info[1]} uncommitted, {repo_info[2]} unpushed")
        
        needs_attention = len(dirty_repos) > 0
        
        return CheckResult(
            name="git_status",
            passed=not needs_attention,
            message=f"{len(dirty_repos)} repositories need attention" if needs_attention else "All repositories clean",
            details=details,
            suggestion="Commit and push changes" if needs_attention else None
        )
    
    def check_skill_gaps(self) -> CheckResult:
        """Identify repeated patterns that should become skills."""
        details = []
        patterns_found = []
        
        skills_dir = self.workspace / "skills"
        scripts_dir = self.workspace / "scripts"
        bin_dir = self.workspace / "bin"
        
        # Count existing skills
        skill_count = 0
        if skills_dir.exists():
            skill_count = len([d for d in skills_dir.iterdir() if d.is_dir()])
        details.append(f"Existing skills: {skill_count}")
        
        # Check for scripts that might be skill candidates
        script_patterns = {
            "backup": ["backup", "restore", "snapshot"],
            "deploy": ["deploy", "publish", "release"],
            "sync": ["sync", "mirror", "replicate"],
            "report": ["report", "status", "health"],
            "convert": ["convert", "transform", "export"],
        }
        
        potential_skills = []
        
        for check_dir in [scripts_dir, bin_dir]:
            if not check_dir.exists():
                continue
                
            for script in check_dir.iterdir():
                if not script.is_file():
                    continue
                    
                script_name = script.name.lower()
                
                for skill_name, keywords in script_patterns.items():
                    if any(kw in script_name for kw in keywords):
                        # Check if skill already exists
                        skill_exists = False
                        if skills_dir.exists():
                            skill_exists = (skills_dir / skill_name).exists()
                        
                        if not skill_exists:
                            potential_skills.append((skill_name, script.name))
                        break
        
        if potential_skills:
            details.append(f"Scripts that could be skills: {len(potential_skills)}")
            for skill_name, script_name in potential_skills[:5]:
                details.append(f"  '{script_name}' → skill '{skill_name}'")
        
        # Check for repeated command patterns in memory
        memory_files = list(self.workspace.glob("memory/*.md"))
        command_patterns = {}
        
        for mem_file in memory_files[-5:]:  # Last 5 memory files
            try:
                content = mem_file.read_text()
                # Look for command patterns (simplistic)
                if "openclaw " in content or "python " in content or "npm " in content:
                    for line in content.split('\n'):
                        line = line.strip()
                        if line.startswith('- ') and ('openclaw ' in line or 'python ' in line or 'npm ' in line):
                            cmd = line[2:].split()[0] if line[2:] else ""
                            if cmd:
                                command_patterns[cmd] = command_patterns.get(cmd, 0) + 1
            except Exception:
                continue
        
        repeated_commands = [(cmd, count) for cmd, count in command_patterns.items() if count > 2]
        if repeated_commands:
            details.append("Repeated command patterns detected:")
            for cmd, count in repeated_commands[:3]:
                details.append(f"  '{cmd}' appears {count} times")
        
        needs_attention = len(potential_skills) > 2 or len(repeated_commands) > 1
        
        return CheckResult(
            name="skill_gaps",
            passed=not needs_attention,
            message=f"{len(potential_skills)} potential skills identified" if needs_attention else "Skill coverage looks good",
            details=details,
            suggestion="Consider creating skills for repeated patterns" if needs_attention else None
        )
    
    def run_all_checks(self) -> HeartbeatReport:
        """Execute all heartbeat checks."""
        return HeartbeatReport(
            timestamp=datetime.now().isoformat(),
            checks=[
                self.check_memory_maintenance(),
                self.check_git_status(),
                self.check_skill_gaps()
            ]
        )


def format_report(report: HeartbeatReport, mode: str = "text") -> str:
    """Format report for output."""
    if mode == "json":
        return json.dumps({
            "timestamp": report.timestamp,
            "all_passed": report.all_passed,
            "issues_found": report.issues_found,
            "checks": [
                {
                    "name": c.name,
                    "passed": c.passed,
                    "message": c.message,
                    "details": c.details,
                    "suggestion": c.suggestion
                }
                for c in report.checks
            ]
        }, indent=2)
    
    # Text format
    lines = [
        "═" * 50,
        "  💓 HEARTBEAT CHECK",
        "═" * 50,
        f"Time: {report.timestamp[:19].replace('T', ' ')}",
        ""
    ]
    
    for check in report.checks:
        icon = "✅" if check.passed else "⚠️"
        lines.append(f"{icon} {check.name.replace('_', ' ').title()}")
        lines.append(f"   {check.message}")
        
        if check.details:
            for detail in check.details:
                lines.append(f"      • {detail}")
        
        if check.suggestion:
            lines.append(f"   💡 {check.suggestion}")
        
        lines.append("")
    
    # Summary
    if report.all_passed:
        lines.append("─" * 50)
        lines.append("All checks passed. Workspace is healthy 💚")
    else:
        lines.append("─" * 50)
        lines.append(f"{report.issues_found} issue(s) need attention")
    
    lines.append("═" * 50)
    
    return "\n".join(lines)


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Heartbeat check — automated workspace health monitoring"
    )
    parser.add_argument(
        "--json", action="store_true",
        help="Output as JSON"
    )
    parser.add_argument(
        "--quiet", action="store_true",
        help="Only output on issues (exit code only if clean)"
    )
    parser.add_argument(
        "--check", action="store_true",
        help="Quick status line for prompts"
    )
    parser.add_argument(
        "--workspace", type=Path, default=Path.cwd(),
        help="Workspace directory (default: current)"
    )
    
    args = parser.parse_args()
    
    checker = HeartbeatChecker(args.workspace)
    report = checker.run_all_checks()
    
    # Update state
    state = checker.load_state()
    state["last_run"] = datetime.now().isoformat()
    for check in report.checks:
        state[check.name] = datetime.now().isoformat()
    checker.save_state(state)
    
    # Output
    if args.check:
        # Quick status line
        icons = []
        for check in report.checks:
            icons.append("✅" if check.passed else "⚠️")
        print(f"{' '.join(icons)} | {report.issues_found} issues")
    elif args.quiet:
        if not report.all_passed:
            print(format_report(report, "text" if not args.json else "json"))
        sys.exit(0 if report.all_passed else 1)
    else:
        print(format_report(report, "json" if args.json else "text"))
        sys.exit(0 if report.all_passed else 1)


if __name__ == "__main__":
    main()
