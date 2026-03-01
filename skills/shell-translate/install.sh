#!/usr/bin/env bash
#
# Install shell-translate skill
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="shell-translate"
BIN_DIR="$HOME/.local/bin"

echo "Installing $SKILL_NAME..."

# Create bin directory if needed
mkdir -p "$BIN_DIR"

# Create symlink
ln -sf "$SCRIPT_DIR/$SKILL_NAME" "$BIN_DIR/$SKILL_NAME"

# Check if bin directory is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "⚠️  $BIN_DIR is not in your PATH"
    echo ""
    echo "Add this to your shell profile (~/.bashrc or ~/.zshrc):"
    echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo ""
fi

echo "✓ Installed $SKILL_NAME to $BIN_DIR/$SKILL_NAME"
echo ""
echo "Usage examples:"
echo "  shell-translate \"find all Python files\""
echo "  shell-translate \"show git log as graph\""
echo "  shell-translate \"backup file with timestamp\" -c"
echo ""
echo "See all patterns:"
echo "  shell-translate list"
