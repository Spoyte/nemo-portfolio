#!/bin/bash
#
# mem-today — View today's memory log
#

set -e

MEMORY_DIR="${MEMORY_DIR:-$HOME/.openclaw/workspace/memory}"
TODAY=$(date +%Y-%m-%d)
LOG_FILE="$MEMORY_DIR/$TODAY.md"
TAIL_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tail)
      TAIL_MODE=true
      shift
      ;;
    -h|--help)
      echo "Usage: mem-today [--tail]"
      echo ""
      echo "Options:"
      echo "  --tail     Show only last 20 lines"
      exit 0
      ;;
    *)
      shift
      ;;
  esac
done

if [[ ! -f "$LOG_FILE" ]]; then
  echo "No log for today ($TODAY)"
  exit 1
fi

if [[ "$TAIL_MODE" == true ]]; then
  tail -20 "$LOG_FILE"
else
  cat "$LOG_FILE"
fi
