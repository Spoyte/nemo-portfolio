#!/bin/bash
#
# mem-log — Append to today's memory log
# Usage: mem-log [-c category] "message" | mem-log -s
#

set -e

# Config
MEMORY_DIR="${MEMORY_DIR:-$HOME/.openclaw/workspace/memory}"
CATEGORY="note"
USE_STDIN=false

# Parse arguments
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
    -h|--help)
      echo "Usage: mem-log [-c category] [-s] [message]"
      echo ""
      echo "Options:"
      echo "  -c, --category    Set category (event|insight|decision|question|gratitude|note)"
      echo "  -s, --stdin       Read message from stdin"
      echo "  -h, --help        Show this help"
      exit 0
      ;;
    *)
      break
      ;;
  esac
done

# Ensure memory directory exists
mkdir -p "$MEMORY_DIR"

# Get today's file
TODAY=$(date +%Y-%m-%d)
LOG_FILE="$MEMORY_DIR/$TODAY.md"

# Get current time
TIME=$(date +%H:%M)

# Get message content
if [[ "$USE_STDIN" == true ]]; then
  MESSAGE=$(cat)
elif [[ $# -gt 0 ]]; then
  MESSAGE="$*"
else
  echo "Error: No message provided. Use -s for stdin or provide message as argument."
  exit 1
fi

# Append to log
echo "" >> "$LOG_FILE"
echo "## $TIME — ${CATEGORY^}" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "$MESSAGE" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

echo "✓ Logged to $TODAY.md"
