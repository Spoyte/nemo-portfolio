#!/bin/bash
# skills-list: List all available skills with descriptions

SKILLS_DIR="/root/.openclaw/workspace/skills"

echo "🔧 Workspace Skills Registry"
echo "============================"
echo ""

for skill_dir in "$SKILLS_DIR"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_name=$(basename "$skill_dir")
        description=$(grep "^description:" "$skill_dir/SKILL.md" 2>/dev/null | sed 's/description: "//;s/"$//' | head -1)
        
        printf "%-20s %s\n" "$skill_name" "$description"
    fi
done

echo ""
echo "Usage: skill-info <skill-name>  # Read full documentation"
