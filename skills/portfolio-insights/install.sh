#!/usr/bin/env bash
#
# Install portfolio-insights to shell PATH

set -euo pipefail

SKILL_NAME="portfolio-insights"
SKILL_DIR="/root/.openclaw/workspace/skills/skill-scaffold"

# Detect shell
SHELL_RC=""
if [[ -n "${ZSH_VERSION:-}" ]] || [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_RC="$HOME/.zshrc"
elif [[ -n "${BASH_VERSION:-}" ]] || [[ "$SHELL" == *"bash"* ]]; then
    SHELL_RC="$HOME/.bashrc"
else
    echo "Unknown shell. Please manually add to your shell config:"
    echo "  export PATH=\"$SKILL_DIR:$PATH\""
    exit 1
fi

# Check if already installed
if grep -q "# portfolio-insights skill" "$SHELL_RC" 2>/dev/null; then
    echo "portfolio-insights is already installed in $SHELL_RC"
    exit 0
fi

# Add to PATH
echo "" >> "$SHELL_RC"
echo "# portfolio-insights skill" >> "$SHELL_RC"
echo "export PATH=\"$SKILL_DIR:$PATH\"" >> "$SHELL_RC"

echo "Installed portfolio-insights to $SHELL_RC"
echo "Run: source $SHELL_RC"
