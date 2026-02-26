#!/usr/bin/env python3
"""
Daily Health Report for OpenClaw Workspace
Generates a summary of system and workspace health.

Usage:
    python daily-health-report.py              # Full report
    python daily-health-report.py --json       # JSON output for parsing
    python daily-health-report.py --quiet      # Exit code only (0=healthy, 1=issues)
    python daily-health-report.py --check      # Quick health check, minimal output
"""

import subprocess
import json
import os
import sys
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional, Union


@dataclass
class DiskInfo:
    total: str = "N/A"
    used: str = "N/A"
    available: str = "N/A"
    percent: int = 0
    
    @property
    def is_critical(self) -> bool:
        return self.percent > 90
    
    @property
    def is_warning(self) -> bool:
        return self.percent > 80


@dataclass  
class MemoryInfo:
    total: str = "N/A"
    used: str = "N/A"
    available: str = "N/A"
    percent_used: int = 0


@dataclass
class GitInfo:
    branch: str = "unknown"
    uncommitted_files: int = 0
    last_commit: str = "N/A"
    needs_push: bool = False
    
    @property
    def is_clean(self) -> bool:
        return self.uncommitted_files == 0 and not self.needs_push


@dataclass
class BackupInfo:
    latest: Optional[str] = None
    date: Optional[str] = None
    age_hours: float = float('inf')
    count: int = 0
    
    @property
    def is_fresh(self) -> bool:
        return self.age_hours < 24
    
    @property
    def is_stale(self) -> bool:
        return self.age_hours > 48


@dataclass
class HealthReport:
    timestamp: str
    timezone: str
    disk: DiskInfo
    memory: MemoryInfo
    load: str
    git: GitInfo
    backup: BackupInfo
    memory_files_count: int
    memory_files_recent: int
    
    @property
    def has_issues(self) -> bool:
        return (
            self.disk.is_critical or
            self.backup.is_stale or
            not self.git.is_clean
        )
    
    @property
    def has_warnings(self) -> bool:
        return (
            self.disk.is_warning or
            not self.backup.is_fresh
        )


def run_cmd(cmd: str, shell: bool = True, timeout: int = 30) -> str:
    """Run a command and return output or error message."""
    try:
        result = subprocess.run(
            cmd, 
            shell=shell, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout.strip() if result.returncode == 0 else ""
    except Exception:
        return ""

def parse_disk_info() -> DiskInfo:
    """Parse disk usage from df command."""
    output = run_cmd("df -h / | tail -1")
    parts = output.split()
    if len(parts) >= 5:
        percent_str = parts[4].replace('%', '')
        try:
            percent = int(percent_str)
        except ValueError:
            percent = 0
        return DiskInfo(
            total=parts[1],
            used=parts[2], 
            available=parts[3],
            percent=percent
        )
    return DiskInfo()


def parse_memory_info() -> MemoryInfo:
    """Parse memory usage from free command."""
    output = run_cmd("free -h | grep Mem")
    parts = output.split()
    if len(parts) >= 7:
        return MemoryInfo(
            total=parts[1],
            used=parts[2],
            available=parts[6]
        )
    return MemoryInfo()


def parse_load() -> str:
    """Get system load average."""
    output = run_cmd("uptime | awk -F'load average:' '{print $2}'")
    return output.strip() if output else "N/A"


def parse_git_info(workspace: str) -> GitInfo:
    """Parse git repository status."""
    original_dir = os.getcwd()
    try:
        os.chdir(workspace)
        
        branch = run_cmd("git branch --show-current") or "unknown"
        status = run_cmd("git status --porcelain")
        uncommitted = len([l for l in status.split('\n') if l.strip()]) if status else 0
        last_commit = run_cmd("git log -1 --format='%h %s (%ar)'") or "N/A"
        
        # Check if ahead of remote
        status_short = run_cmd("git status -sb")
        needs_push = "ahead" in status_short.lower() if status_short else False
        
        return GitInfo(
            branch=branch,
            uncommitted_files=uncommitted,
            last_commit=last_commit,
            needs_push=needs_push
        )
    finally:
        os.chdir(original_dir)


def parse_backup_info(workspace: str) -> BackupInfo:
    """Check for recent backups."""
    backup_dir = Path(workspace) / "backups"
    if not backup_dir.exists():
        return BackupInfo()
    
    backups = sorted(backup_dir.glob("*.zip"), key=lambda x: x.stat().st_mtime, reverse=True)
    if not backups:
        return BackupInfo()
    
    latest = backups[0]
    mtime = datetime.fromtimestamp(latest.stat().st_mtime)
    age_hours = (datetime.now() - mtime).total_seconds() / 3600
    
    return BackupInfo(
        latest=latest.name,
        date=mtime.strftime("%Y-%m-%d %H:%M"),
        age_hours=round(age_hours, 1),
        count=len(backups)
    )


def parse_memory_files(workspace: str) -> tuple[int, int]:
    """Check memory directory for recent entries."""
    memory_dir = Path(workspace) / "memory"
    if not memory_dir.exists():
        return 0, 0
    
    files = sorted(memory_dir.glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True)
    week_ago = datetime.now() - timedelta(days=7)
    recent = [f for f in files if datetime.fromtimestamp(f.stat().st_mtime) > week_ago]
    
    return len(files), len(recent)


def generate_report(workspace: str) -> HealthReport:
    """Generate complete health report."""
    total_mem, recent_mem = parse_memory_files(workspace)
    
    return HealthReport(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        timezone="Asia/Shanghai",
        disk=parse_disk_info(),
        memory=parse_memory_info(),
        load=parse_load(),
        git=parse_git_info(workspace),
        backup=parse_backup_info(workspace),
        memory_files_count=total_mem,
        memory_files_recent=recent_mem
    )

def format_report(report: HealthReport) -> str:
    """Format report as human-readable text."""
    lines = []
    
    # Header
    lines.extend([
        "=" * 50,
        "📊 DAILY HEALTH REPORT",
        f"🕐 {report.timestamp} ({report.timezone})",
        "=" * 50,
    ])
    
    # System section
    lines.extend([
        "\n🖥️  SYSTEM HEALTH",
        "-" * 30,
        f"   Disk: {report.disk.used}/{report.disk.total} used ({report.disk.percent}%)",
        f"   Memory: {report.memory.used}/{report.memory.total} used, {report.memory.available} available",
        f"   Load: {report.load}",
    ])
    
    # Workspace section
    lines.extend([
        "\n📁 WORKSPACE HEALTH",
        "-" * 30,
        f"   Git branch: {report.git.branch}",
        f"   Uncommitted: {report.git.uncommitted_files} files",
        f"   Last commit: {report.git.last_commit[:50]}...",
    ])
    
    if report.git.needs_push:
        lines.append("   ⚠️ Unpushed commits")
    
    if report.backup.latest:
        lines.append(f"   Latest backup: {report.backup.latest} ({report.backup.age_hours}h ago)")
    else:
        lines.append("   Backups: None found")
    
    lines.append(f"   Memory files: {report.memory_files_count} total, {report.memory_files_recent} in last 7 days")
    
    # Status summary
    lines.extend(["\n" + "=" * 50])
    
    if report.has_issues:
        lines.append("🚨 ISSUES DETECTED")
        if report.disk.is_critical:
            lines.append(f"   ⚠️  Disk critical: {report.disk.percent}% full")
        if report.backup.is_stale:
            lines.append(f"   ⚠️  Backup stale: {report.backup.age_hours:.0f}h old")
        if report.git.uncommitted_files > 0:
            lines.append(f"   ⚠️  {report.git.uncommitted_files} uncommitted files")
        if report.git.needs_push:
            lines.append("   ⚠️  Unpushed commits")
    elif report.has_warnings:
        lines.append("⚠️  WARNINGS")
        if report.disk.is_warning:
            lines.append(f"   Disk usage high: {report.disk.percent}%")
        if not report.backup.is_fresh:
            lines.append(f"   Backup aging: {report.backup.age_hours:.0f}h old")
    else:
        lines.append("✅ All systems nominal")
    
    lines.append("=" * 50)
    
    return "\n".join(lines)


def format_check(report: HealthReport) -> str:
    """Format quick health check."""
    parts = []
    
    # Disk status
    if report.disk.is_critical:
        parts.append(f"❌ Disk {report.disk.percent}%")
    elif report.disk.is_warning:
        parts.append(f"⚠️ Disk {report.disk.percent}%")
    else:
        parts.append(f"✅ Disk {report.disk.percent}%")
    
    # Git status
    if report.git.is_clean:
        parts.append("✅ Git clean")
    else:
        issues = []
        if report.git.uncommitted_files:
            issues.append(f"{report.git.uncommitted_files} uncommitted")
        if report.git.needs_push:
            issues.append("unpushed")
        parts.append(f"⚠️ Git: {', '.join(issues)}")
    
    # Backup status
    if report.backup.is_fresh:
        parts.append(f"✅ Backup ({report.backup.age_hours:.0f}h)")
    elif report.backup.is_stale:
        parts.append(f"❌ Backup ({report.backup.age_hours:.0f}h)")
    else:
        parts.append("⚠️ No backup")
    
    return " | ".join(parts)


def main():
    parser = argparse.ArgumentParser(description="Daily health report for OpenClaw workspace")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--quiet", action="store_true", help="Exit code only (0=healthy, 1=issues)")
    parser.add_argument("--check", action="store_true", help="Quick health check")
    parser.add_argument("--workspace", default="/root/.openclaw/workspace", help="Workspace path")
    args = parser.parse_args()
    
    report = generate_report(args.workspace)
    
    if args.quiet:
        sys.exit(1 if report.has_issues else 0)
    
    if args.json:
        # Convert dataclass to dict for JSON serialization
        report_dict = {
            "timestamp": report.timestamp,
            "timezone": report.timezone,
            "system": {
                "disk": asdict(report.disk),
                "memory": asdict(report.memory),
                "load": report.load
            },
            "workspace": {
                "git": asdict(report.git),
                "backup": asdict(report.backup),
                "memory_files": {
                    "total": report.memory_files_count,
                    "recent_7_days": report.memory_files_recent
                }
            },
            "status": {
                "has_issues": report.has_issues,
                "has_warnings": report.has_warnings
            }
        }
        print(json.dumps(report_dict, indent=2))
    elif args.check:
        print(format_check(report))
    else:
        print(format_report(report))
    
    sys.exit(1 if report.has_issues else 0)


if __name__ == "__main__":
    main()
