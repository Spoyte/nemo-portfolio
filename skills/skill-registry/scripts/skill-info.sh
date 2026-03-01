#!/usr/bin/env bash
#
# skill-info - Read documentation for a specific skill
#

set -e

SKILLS_DIR="${SKILLS_DIR:-$HOME/.openclaw/workspace/skills}"

usage() {
    echo "Usage: skill-info <skill-name>"
    echo ""
    echo "Show full documentation for a skill."
    echo ""
    echo "Examples:"
    echo "  skill-info art-new"
    echo "  skill-info health        # matches health-monitor"
    exit 0
}

# Find skill by exact or partial match
find_skill() {
    local query="$1"
    
    # First try exact match
    if [[ -f "$SKILLS_DIR/$query/SKILL.md" ]]; then
        echo "$SKILLS_DIR/$query/SKILL.md"
        return 0
    fi
    
    # Try partial match
    local match
    match=$(find "$SKILLS_DIR" -maxdepth 2 -name "SKILL.md" -type f 2>/dev/null | \
        while read -r f; do
            local name
            name=$(basename "$(dirname "$f")")
            if [[ "$name" == *"$query"* ]]; then
                echo "$f"
                break
            fi
        done)
    
    if [[ -n "$match" ]]; then
        echo "$match"
        return 0
    fi
    
    return 1
}

# Main
main() {
    if [[ $# -eq 0 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        usage
    fi
    
    local query="$1"
    local skill_file
    
    if ! skill_file=$(find_skill "$query"); then
        echo "Error: Skill not found: $query" >&2
        echo ""
        echo "Available skills:"
        skills-list -q 2>/dev/null || echo "  (could not list skills)"
        exit 1
    fi
    
    local skill_name
    skill_name=$(basename "$(dirname "$skill_file")")
    
    echo "═══════════════════════════════════════════════════════════════════"
    echo "  Skill: $skill_name"
    echo "═══════════════════════════════════════════════════════════════════"
    echo ""
    cat "$skill_file"
}

main "$@"
