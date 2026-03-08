#!/usr/bin/env python3
"""
Nemo Continuous Improvement Cycle Tracker
Automates the 5-class improvement cycle with logging and insights.
"""

import argparse
import json
import os
import random
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Configuration
CI_DIR = Path.home() / ".nemo-ci"
LOG_FILE = CI_DIR / "cycles.json"
TEMPLATES_FILE = CI_DIR / "templates.json"

ACTIVITIES = {
    "research": {
        "name": "Deep Research",
        "desc": "Read multiple sources, synthesize insights",
        "prompts": [
            "What technology or concept have you been curious about?",
            "What's a problem space you don't understand yet?",
            "Find 3 perspectives on a controversial topic."
        ]
    },
    "create": {
        "name": "Generative Creation",
        "desc": "Art, scripts, docs, poems, tools",
        "prompts": [
            "What's a tool you wish you had? Build it.",
            "Create something that explains a concept visually.",
            "Write a poem about your current project."
        ]
    },
    "refactor": {
        "name": "Elegant Refactoring",
        "desc": "Clean code, Rams-like simplicity",
        "prompts": [
            "What code feels awkward? Make it elegant.",
            "Remove 30% of lines while keeping functionality.",
            "Apply a new pattern you learned."
        ]
    },
    "reflect": {
        "name": "Diary Reflection",
        "desc": "Reflect on work, questions, discoveries",
        "prompts": [
            "What did you learn this week?",
            "What friction points keep appearing?",
            "What would you do differently?"
        ]
    },
    "skill": {
        "name": "Skill Building",
        "desc": "Identify patterns, automate them",
        "prompts": [
            "What repetitive task can you automate?",
            "What's a skill gap holding you back?",
            "Teach yourself something backwards."
        ]
    }
}


def init_ci():
    """Initialize CI directory and files."""
    CI_DIR.mkdir(exist_ok=True)
    
    if not LOG_FILE.exists():
        LOG_FILE.write_text(json.dumps([]))
    
    if not TEMPLATES_FILE.exists():
        templates = {k: f"[{k.upper()}] {{timestamp}}\n{{content}}\n" 
                    for k in ACTIVITIES}
        TEMPLATES_FILE.write_text(json.dumps(templates, indent=2))


def get_cycle_log() -> List[Dict]:
    """Load cycle history."""
    if LOG_FILE.exists():
        return json.loads(LOG_FILE.read_text())
    return []


def log_cycle(activity: str, content: str, tags: Optional[List[str]] = None):
    """Log a completed cycle."""
    log = get_cycle_log()
    entry = {
        "timestamp": datetime.now().isoformat(),
        "activity": activity,
        "content_preview": content[:100] + "..." if len(content) > 100 else content,
        "tags": tags or []
    }
    log.append(entry)
    LOG_FILE.write_text(json.dumps(log, indent=2))
    
    # Also append to markdown diary
    diary = CI_DIR / "diary.md"
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry_md = f"\n## [{activity.upper()}] {date_str}\n\n{content}\n\n---\n"
    with open(diary, "a") as f:
        f.write(entry_md)


def suggest_activity() -> str:
    """Suggest an activity based on history (favor underrepresented)."""
    log = get_cycle_log()
    if not log:
        return random.choice(list(ACTIVITIES.keys()))
    
    counts = {k: 0 for k in ACTIVITIES}
    for entry in log:
        counts[entry["activity"]] = counts.get(entry["activity"], 0) + 1
    
    # Weight toward less-used activities
    min_count = min(counts.values())
    candidates = [k for k, v in counts.items() if v == min_count]
    return random.choice(candidates)


def show_stats():
    """Display improvement statistics."""
    log = get_cycle_log()
    if not log:
        print("No cycles logged yet. Start improving!")
        return
    
    print(f"\n📊 NEMO CONTINUOUS IMPROVEMENT STATS")
    print(f"Total cycles completed: {len(log)}")
    print(f"First cycle: {log[0]['timestamp'][:10]}")
    print(f"Latest cycle: {log[-1]['timestamp'][:10]}")
    
    print("\nBy activity:")
    counts = {}
    for entry in log:
        act = entry["activity"]
        counts[act] = counts.get(act, 0) + 1
    
    for key, count in sorted(counts.items(), key=lambda x: -x[1]):
        pct = count / len(log) * 100
        bar = "█" * int(pct / 5)
        print(f"  {ACTIVITIES[key]['name']:<20} {count:>3} ({pct:>5.1f}%) {bar}")
    print()


def show_prompt(activity: Optional[str] = None):
    """Show a prompt for the given or suggested activity."""
    if activity is None:
        activity = suggest_activity()
    
    info = ACTIVITIES[activity]
    prompt = random.choice(info["prompts"])
    
    print(f"\n🎯 Suggested: {info['name']}")
    print(f"   {info['desc']}")
    print(f"\n💡 Prompt: {prompt}")
    print(f"\nRun: ci_cycle.py commit -a {activity} -m 'your content'")


def commit_cycle(activity: str, message: str, tags: Optional[List[str]] = None):
    """Commit a cycle entry."""
    if activity not in ACTIVITIES:
        print(f"Unknown activity: {activity}")
        print(f"Choose from: {', '.join(ACTIVITIES.keys())}")
        sys.exit(1)
    
    log_cycle(activity, message, tags)
    print(f"✅ Committed: [{activity.upper()}] {message[:50]}...")
    print(f"   Logged to: {LOG_FILE}")
    print(f"   Diary: {CI_DIR / 'diary.md'}")


def main():
    parser = argparse.ArgumentParser(
        description="Nemo Continuous Improvement Cycle Tracker"
    )
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # suggest command
    suggest_parser = subparsers.add_parser("suggest", help="Get activity suggestion")
    suggest_parser.add_argument("-a", "--activity", choices=list(ACTIVITIES.keys()))
    
    # commit command
    commit_parser = subparsers.add_parser("commit", help="Commit a cycle")
    commit_parser.add_argument("-a", "--activity", required=True,
                              choices=list(ACTIVITIES.keys()))
    commit_parser.add_argument("-m", "--message", required=True,
                              help="Content or description")
    commit_parser.add_argument("-t", "--tags", nargs="*", help="Tags")
    
    # stats command
    subparsers.add_parser("stats", help="Show statistics")
    
    # init command
    subparsers.add_parser("init", help="Initialize CI system")
    
    args = parser.parse_args()
    
    if args.command == "init" or not CI_DIR.exists():
        init_ci()
        print(f"Initialized CI system in {CI_DIR}")
    
    if args.command == "suggest":
        show_prompt(args.activity)
    elif args.command == "commit":
        commit_cycle(args.activity, args.message, args.tags)
    elif args.command == "stats":
        show_stats()
    else:
        show_prompt()
        parser.print_help()


if __name__ == "__main__":
    main()
