#!/usr/bin/env bash
#
# skills-list - List all available skills
#

set -e

SKILLS_DIR="${SKILLS_DIR:-$HOME/.openclaw/workspace/skills}"
QUIET=false
VERBOSE=false

usage() {
    echo "Usage: skills-list [-q|-v]"
    echo ""
    echo "Options:"
    echo "  -q    Quiet mode - names only"
    echo "  -v    Verbose mode - include file paths"
    echo "  -h    Show this help"
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -q|--quiet)
            QUIET=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage
            ;;
    esac
done

# Check if skills directory exists
if [[ ! -d "$SKILLS_DIR" ]]; then
    echo "Error: Skills directory not found: $SKILLS_DIR" >&2
    exit 1
fi

# Find all skills (directories with SKILL.md)
find_skills() {
    find "$SKILLS_DIR" -maxdepth 2 -name "SKILL.md" -type f 2>/dev/null | \
        sort | \
        while read -r skill_file; do
            skill_dir=$(dirname "$skill_file")
            skill_name=$(basename "$skill_dir")
            echo "$skill_name|$skill_file|$skill_dir"
        done
}

# Extract description from SKILL.md frontmatter
get_description() {
    local skill_file="$1"
    # Look for description in frontmatter (handle both quoted and unquoted)
    grep "^description:" "$skill_file" 2>/dev/null | \
        sed 's/^description:[[:space:]]*//' | \
        sed 's/^["'\''"]//' | \
        sed 's/["'\''"]$//' | \
        head -c 60
}

# Main output
main() {
    local count=0
    
    while IFS='|' read -r skill_name skill_file skill_dir; do
        [[ -z "$skill_name" ]] && continue
        
        count=$((count + 1))
        
        if $QUIET; then
            echo "$skill_name"
        elif $VERBOSE; then
            desc=$(get_description "$skill_file")
            printf "%-20s %s\n" "$skill_name" "$skill_file"
            [[ -n "$desc" ]] && printf "                     %s\n" "$desc"
        else
            desc=$(get_description "$skill_file")
            if [[ -n "$desc" ]]; then
                printf "%-20s %s\n" "$skill_name" "$desc"
            else
                echo "$skill_name"
            fi
        fi
    done < <(find_skills)
    
    if [[ $count -eq 0 ]]; then
        echo "No skills found in $SKILLS_DIR" >&2
        exit 1
    fi
    
    if ! $QUIET; then
        echo ""
        echo "Total: $count skill(s)"
    fi
}

main
