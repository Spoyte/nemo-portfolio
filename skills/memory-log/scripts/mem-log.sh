#!/bin/bash
#
# mem-log — Quick memory logging
# Usage: mem-log [options] "message"
#
# Options:
#   -c, --category    Category: event|insight|decision|question|gratitude|note (default: note)
#   -s, --stdin       Read message from stdin
#   -t, --tag         Add tags (comma-separated)
#   -h, --help        Show help
#
# Examples:
#   mem-log "Fixed the auth bug"
#   mem-log -c insight "Constraints breed creativity"
#   echo "Multi-line\nthought" | mem-log -s

set -e

# Defaults
CATEGORY="note"
USE_STDIN=false
TAGS=""
MESSAGE=""

# Parse args
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--category)
            CATEGORY="$2"
            shift 2
            ;;
        -s|--stdin)
            USE_STDIN=true
            shift
            ;;
        -t|--tag)
            TAGS="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: mem-log [options] \"message\""
            echo ""
            echo "Options:"
            echo "  -c, --category    Category (event|insight|decision|question|gratitude|note)"
            echo "  -s, --stdin       Read message from stdin"
            echo "  -t, --tag         Add tags (comma-separated)"
            echo "  -h, --help        Show this help"
            echo ""
            echo "Examples:"
            echo '  mem-log "Fixed the auth bug"'
            echo '  mem-log -c insight "Constraints breed creativity"'
            echo '  echo "Multi-line thought" | mem-log -s'
            exit 0
            ;;
        *)
            if [ -z "$MESSAGE" ]; then
                MESSAGE="$1"
            else
                MESSAGE="$MESSAGE $1"
            fi
            shift
            ;;
    esac
done

# Validate category
VALID_CATEGORIES="event insight decision question gratitude note"
if ! echo "$VALID_CATEGORIES" | grep -qw "$CATEGORY"; then
    echo "Error: Invalid category '$CATEGORY'"
    echo "Valid: $VALID_CATEGORIES"
    exit 1
fi

# Read from stdin if requested
if [ "$USE_STDIN" = true ]; then
    MESSAGE=$(cat)
fi

# Validate message
if [ -z "$MESSAGE" ]; then
    echo "Error: No message provided"
    echo "Usage: mem-log \"message\" or echo \"message\" | mem-log -s"
    exit 1
fi

# Setup paths
WORKSPACE_DIR="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE_DIR/memory"
TODAY=$(date +%Y-%m-%d)
NOW=$(date +%H:%M)
MEMORY_FILE="$MEMORY_DIR/$TODAY.md"

# Create memory directory if needed
mkdir -p "$MEMORY_DIR"

# Create file with header if it doesn't exist
if [ ! -f "$MEMORY_FILE" ]; then
    echo "# $TODAY — Daily Log" > "$MEMORY_FILE"
    echo "" >> "$MEMORY_FILE"
fi

# Build entry
ENTRY="## $NOW — $CATEGORY"
if [ -n "$TAGS" ]; then
    ENTRY="$ENTRY [$TAGS]"
fi
ENTRY="$ENTRY

$MESSAGE

---
"

# Append to file
echo -e "$ENTRY" >> "$MEMORY_FILE"

# Output confirmation
echo "✓ Logged to $TODAY.md ($CATEGORY)"
