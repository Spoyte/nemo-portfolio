#!/usr/bin/env bash
#
# skill-create - Scaffold a new skill from template
#

set -e

SKILLS_DIR="${SKILLS_DIR:-$HOME/.openclaw/workspace/skills}"
BIN_DIR="${BIN_DIR:-$HOME/.openclaw/workspace/bin}"

usage() {
    echo "Usage: skill-create <kebab-name> \"Description\""
    echo ""
    echo "Create a new skill with proper structure and documentation."
    echo ""
    echo "Examples:"
    echo "  skill-create backup \"Backup and restore operations\""
    echo "  skill-create git-sync \"Multi-repo git synchronization\""
    exit 0
}

# Validate kebab-case
validate_name() {
    local name="$1"
    if [[ ! "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
        echo "Error: Skill name must be kebab-case (e.g., my-skill, git-tools)" >&2
        exit 1
    fi
}

# Create skill directory and files
create_skill() {
    local name="$1"
    local description="$2"
    local skill_dir="$SKILLS_DIR/$name"
    
    if [[ -d "$skill_dir" ]]; then
        echo "Error: Skill already exists: $name" >&2
        exit 1
    fi
    
    mkdir -p "$skill_dir"
    
    # Create SKILL.md
    cat > "$skill_dir/SKILL.md" << EOF
---
name: $name
description: "$description"
---

# $(echo "$name" | sed 's/-/ /g' | sed 's/\b\w/\u&/g')

Brief description of what this skill does.

## Quick Actions

\`\`\`bash
$name                    # Default action
$name --help             # Show help
\`\`\`

## Usage

### Basic

\`\`\`bash
$name                    # Run with defaults
\`\`\`

### Advanced

\`\`\`bash
$name --option value     # With options
\`\`\`

## Conventions

- Rule 1
- Rule 2
EOF

    # Create executable stub
    cat > "$skill_dir/$name" << 'EOF'
#!/usr/bin/env bash
#
# SKILL_NAME - Brief description
#

set -e

usage() {
    echo "Usage: SKILL_NAME [options]"
    echo ""
    echo "Options:"
    echo "  -h    Show this help"
    exit 0
}

main() {
    case "${1:-}" in
        -h|--help)
            usage
            ;;
        *)
            # Default behavior
            echo "SKILL_NAME: implement me!"
            ;;
    esac
}

main "$@"
EOF

    chmod +x "$skill_dir/$name"
    
    # Create symlink in bin/
    if [[ -d "$BIN_DIR" ]]; then
        ln -sf "$skill_dir/$name" "$BIN_DIR/$name"
    fi
    
    echo "✓ Created skill: $name"
    echo ""
    echo "Files created:"
    echo "  $skill_dir/SKILL.md"
    echo "  $skill_dir/$name"
    [[ -d "$BIN_DIR" ]] && echo "  $BIN_DIR/$name → $skill_dir/$name"
    echo ""
    echo "Next steps:"
    echo "  1. Edit $skill_dir/SKILL.md with full documentation"
    echo "  2. Implement $skill_dir/$name"
    echo "  3. Test: $name --help"
    echo "  4. Commit: git add . && git commit -m \"feat: add $name skill\""
}

# Main
main() {
    if [[ $# -lt 2 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        usage
    fi
    
    local name="$1"
    local description="$2"
    
    validate_name "$name"
    create_skill "$name" "$description"
}

main "$@"
