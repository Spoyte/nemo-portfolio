#!/usr/bin/env python3
"""
Daily Health Report for OpenClaw Workspace
Generates a summary of system and workspace health.
"""

import subprocess
import json
import os
from datetime import datetime
from pathlib import Path

def run_cmd(cmd, shell=True):
    """Run a command and return output or error message."""
    try:
        result = subprocess.run(cmd, shell=shell, capture_output=True, text=True, timeout=30)
        return result.stdout.strip() if result.returncode == 0 else f"Error: {result.stderr.strip()[:100]}"
    except Exception as e:
        return f"Error: {str(e)[:100]}"

def check_disk_space():
    """Check disk usage."""
    output = run_cmd("df -h / | tail -1")
    parts = output.split()
    if len(parts) >= 5:
        return {
            "total": parts[1],
            "used": parts[2],
            "available": parts[3],
            "percent": parts[4]
        }
    return {"error": "Could not parse disk info"}

def check_memory():
    """Check memory usage."""
    output = run_cmd("free -h | grep Mem")
    parts = output.split()
    if len(parts) >= 7:
        return {
            "total": parts[1],
            "used": parts[2],
            "free": parts[3],
            "available": parts[6]
        }
    return {"error": "Could not parse memory info"}

def check_load():
    """Check system load."""
    output = run_cmd("uptime | awk -F'load average:' '{print $2}'")
    return output.strip() if output else "N/A"

def check_openclaw_status():
    """Check OpenClaw gateway status."""
    return run_cmd("openclaw gateway status 2>&1 || echo 'Gateway status unavailable'")

def check_git_status():
    """Check git repository status."""
    workspace = "/root/.openclaw/workspace"
    os.chdir(workspace)
    
    # Check for uncommitted changes
    status = run_cmd("git status --porcelain")
    branch = run_cmd("git branch --show-current")
    
    uncommitted = len([l for l in status.split('\n') if l.strip()]) if status else 0
    
    # Check last commit
    last_commit = run_cmd("git log -1 --format='%h %s (%ar)'")
    
    # Check if behind remote
    fetch_result = run_cmd("git fetch --dry-run 2>&1", shell=True)
    
    return {
        "branch": branch,
        "uncommitted_files": uncommitted,
        "last_commit": last_commit,
        "needs_push": "untracked" in run_cmd("git status -sb").lower() if run_cmd("git status -sb") else False
    }

def check_cron_jobs():
    """List OpenClaw cron jobs."""
    output = run_cmd("openclaw cron list 2>&1 || echo 'Cron list unavailable'")
    return output

def check_recent_backups():
    """Check for recent backups."""
    backup_dir = "/root/.openclaw/workspace/backups"
    if not os.path.exists(backup_dir):
        return "No backup directory found"
    
    backups = sorted(Path(backup_dir).glob("*.zip"), key=lambda x: x.stat().st_mtime, reverse=True)
    if not backups:
        return "No backups found"
    
    latest = backups[0]
    mtime = datetime.fromtimestamp(latest.stat().st_mtime)
    age_hours = (datetime.now() - mtime).total_seconds() / 3600
    
    return {
        "latest": latest.name,
        "date": mtime.strftime("%Y-%m-%d %H:%M"),
        "age_hours": round(age_hours, 1),
        "count": len(backups)
    }

def check_memory_files():
    """Check memory directory for recent entries."""
    memory_dir = "/root/.openclaw/workspace/memory"
    if not os.path.exists(memory_dir):
        return "No memory directory"
    
    files = sorted(Path(memory_dir).glob("*.md"), key=lambda x: x.stat().st_mtime, reverse=True)
    recent = [f for f in files if (datetime.now() - datetime.fromtimestamp(f.stat().st_mtime)).days <= 7]
    
    return {
        "total_files": len(files),
        "recent_7_days": len(recent),
        "latest": files[0].name if files else None
    }

def main():
    report = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "timezone": "Asia/Shanghai",
        "system": {
            "disk": check_disk_space(),
            "memory": check_memory(),
            "load": check_load()
        },
        "openclaw": {
            "gateway_status": check_openclaw_status(),
            "cron_jobs": check_cron_jobs()
        },
        "workspace": {
            "git": check_git_status(),
            "backups": check_recent_backups(),
            "memory_files": check_memory_files()
        }
    }
    
    # Print formatted report
    print("=" * 50)
    print(f"📊 DAILY HEALTH REPORT")
    print(f"🕐 {report['timestamp']} ({report['timezone']})")
    print("=" * 50)
    
    print("\n🖥️  SYSTEM HEALTH")
    print("-" * 30)
    disk = report['system']['disk']
    if 'percent' in disk:
        print(f"   Disk: {disk['used']}/{disk['total']} used ({disk['percent']})")
    else:
        print(f"   Disk: {disk.get('error', 'Unknown')}")
    
    mem = report['system']['memory']
    if 'available' in mem:
        print(f"   Memory: {mem['used']}/{mem['total']} used, {mem['available']} available")
    else:
        print(f"   Memory: {mem.get('error', 'Unknown')}")
    
    print(f"   Load: {report['system']['load']}")
    
    print("\n🤖 OPENCLAW STATUS")
    print("-" * 30)
    print(f"   Gateway: {report['openclaw']['gateway_status'][:60]}...")
    cron = report['openclaw']['cron_jobs']
    cron_lines = [l for l in cron.split('\n') if l.strip() and 'ID' not in l]
    print(f"   Cron jobs: {len(cron_lines)} active")
    
    print("\n📁 WORKSPACE HEALTH")
    print("-" * 30)
    git = report['workspace']['git']
    print(f"   Git branch: {git['branch']}")
    print(f"   Uncommitted files: {git['uncommitted_files']}")
    print(f"   Last commit: {git['last_commit'][:50]}...")
    
    backup = report['workspace']['backups']
    if isinstance(backup, dict):
        print(f"   Latest backup: {backup['latest']} ({backup['age_hours']}h ago)")
    else:
        print(f"   Backups: {backup}")
    
    mem_files = report['workspace']['memory_files']
    print(f"   Memory files: {mem_files['total_files']} total, {mem_files['recent_7_days']} in last 7 days")
    
    print("\n" + "=" * 50)
    
    # Alerts
    alerts = []
    if isinstance(disk, dict) and disk.get('percent', '0%').replace('%', '').isdigit():
        if int(disk['percent'].replace('%', '')) > 80:
            alerts.append("⚠️ Disk usage above 80%")
    
    if git['uncommitted_files'] > 5:
        alerts.append(f"⚠️ {git['uncommitted_files']} uncommitted files")
    
    if isinstance(backup, dict) and backup['age_hours'] > 48:
        alerts.append(f"⚠️ Backup is {backup['age_hours']:.0f} hours old")
    
    if alerts:
        print("\n🚨 ALERTS")
        for alert in alerts:
            print(f"   {alert}")
    else:
        print("\n✅ All systems nominal")
    
    print("=" * 50)
    
    return report

if __name__ == "__main__":
    main()
