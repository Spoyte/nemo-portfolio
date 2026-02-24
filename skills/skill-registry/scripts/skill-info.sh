#!/bin/bash
# skill-info: Display full documentation for a skill

SKILLS_DIR="/root/.openclaw/workspace/skills"

if [ -z "$1" ]; then
    echo "Usage: skill-info <skill-name>"
    echo ""
    echo "Available skills:"
    ls -1 "$SKILLS_DIR"
    exit 1
fi

SKILL="$1"
SKILL_FILE="$SKILLS_DIR/$SKILL/SKILL.md"

if [ -f "$SKILL_FILE" ]; then
    cat "$SKILL_FILE"
else
    echo "❌ Skill '$SKILL' not found"
    echo ""
    echo "Available skills:"
    ls -1 "$SKILLS_DIR"
    exit 1
fi
