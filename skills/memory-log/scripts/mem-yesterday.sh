#!/bin/bash
#
# mem-yesterday — View yesterday's memory log
#

set -e

MEMORY_DIR="${MEMORY_DIR:-$HOME/.openclaw/workspace/memory}"
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d 2>/dev/null)
LOG_FILE="$MEMORY_DIR/$YESTERDAY.md"
TAIL_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tail)
      TAIL_MODE=true
      shift
      ;;
    -h|--help)
      echo "Usage: mem-yesterday [--tail]"
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
  echo "No log for yesterday ($YESTERDAY)"
  exit 1
fi

if [[ "$TAIL_MODE" == true ]]; then
  tail -20 "$LOG_FILE"
else
  cat "$LOG_FILE"
fi
