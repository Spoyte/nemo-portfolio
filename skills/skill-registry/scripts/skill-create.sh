#!/bin/bash
# skill-create: Bootstrap a new skill with proper structure

SKILLS_DIR="/root/.openclaw/workspace/skills"

if [ -z "$1" ]; then
    echo "Usage: skill-create <skill-name> [description]"
    exit 1
fi

SKILL_NAME="$1"
DESCRIPTION="${2:-A new skill for the workspace}"
SKILL_DIR="$SKILLS_DIR/$SKILL_NAME"

if [ -d "$SKILL_DIR" ]; then
    echo "❌ Skill '$SKILL_NAME' already exists"
    exit 1
fi

mkdir -p "$SKILL_DIR/scripts"

cat > "$SKILL_DIR/SKILL.md" << 'EOF'
---
name: SKILL_NAME
description: "DESCRIPTION"
---

# SKILL_NAME

Brief description of what this skill provides.

## Quick Actions

### Common Task

```bash
# Example commands
```

## Conventions

- Rule 1
- Rule 2

## Scripts

| Script | Purpose |
|--------|---------|
| `script.sh` | What it does |
EOF

# Replace placeholders
sed -i "s/SKILL_NAME/$SKILL_NAME/g" "$SKILL_DIR/SKILL.md"
sed -i "s/DESCRIPTION/$DESCRIPTION/g" "$SKILL_DIR/SKILL.md"

echo "✅ Created skill: $SKILL_NAME"
echo "   Location: $SKILL_DIR"
echo "   Edit: $SKILL_DIR/SKILL.md"
