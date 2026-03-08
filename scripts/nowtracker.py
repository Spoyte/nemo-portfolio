#!/usr/bin/env python3
"""
nowtracker.py — Minimal task state capture.

Principles:
- Less but better. One command, one action.
- No configuration. Just append to a file.
- Machine-readable first, human-readable second.

Usage:
    nowtracker "started review"              # log entry
    nowtracker --show                        # tail recent entries
    nowtracker --since "2 hours ago"         # filter by time
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

DATA_FILE = Path.home() / ".nowtracker.jsonl"


def log_entry(activity: str) -> str:
    """Append a single entry to the log."""
    entry = {
        "t": datetime.utcnow().isoformat() + "Z",
        "a": activity.strip()
    }
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "a") as f:
        f.write(json.dumps(entry, separators=(",", ":")) + "\n")
    return entry["t"]


def read_entries(since: Optional[datetime] = None) -> list[dict]:
    """Read all entries, optionally filtered by time."""
    if not DATA_FILE.exists():
        return []
    
    entries = []
    with open(DATA_FILE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                entry_time = datetime.fromisoformat(entry["t"].replace("Z", "+00:00"))
                if since is None or entry_time >= since:
                    entry["_dt"] = entry_time
                    entries.append(entry)
            except (json.JSONDecodeError, KeyError, ValueError):
                continue
    return sorted(entries, lambda e: e["_dt"])


def parse_relative_time(s: str) -> datetime:
    """Parse strings like '2 hours ago', '30 min ago', 'today'."""
    s = s.lower().strip()
    now = datetime.utcnow()
    
    if s == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    if "hour" in s:
        n = int(s.split()[0])
        return now - timedelta(hours=n)
    if "min" in s:
        n = int(s.split()[0])
        return now - timedelta(minutes=n)
    
    return now


def show_entries(entries: list[dict], tail: bool = False, limit: int = 20) -> None:
    """Display entries in human format."""
    if not entries:
        print("No entries.")
        return
    
    if tail:
        entries = entries[-limit:]
    
    for e in entries:
        dt = e.pop("_dt")
        print(f"{dt.strftime('%Y-%m-%d %H:%M')}  {e['a']}")


def main():
    args = sys.argv[1:]
    
    if not args:
        print("Usage: nowtracker \"activity description\" [--show] [--since \"2 hours ago\"]", file=sys.stderr)
        sys.exit(1)
    
    if "--show" in args:
        entries = read_entries()
        show_entries(entries, tail=True)
        return
    
    if "--since" in args:
        idx = args.index("--since")
        time_str = args[idx + 1] if idx + 1 < len(args) else "today"
        since = parse_relative_time(time_str)
        entries = read_entries(since=since)
        show_entries(entries)
        return
    
    # Default: log the activity
    activity = " ".join(a for a in args if not a.startswith("--"))
    timestamp = log_entry(activity)
    print(f"Logged: {activity} at {timestamp}")


if __name__ == "__main__":
    main()
