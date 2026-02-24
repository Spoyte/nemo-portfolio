#!/bin/bash
# Auto-commit helper — intelligently commits based on file patterns

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Get repo name
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
echo -e "${YELLOW}📦 Repository: $REPO_NAME${NC}"

# Check for changes
if git diff --quiet && git diff --cached --quiet; then
    # Check for untracked files
    UNTRACKED=$(git ls-files --others --exclude-standard)
    if [ -z "$UNTRACKED" ]; then
        echo -e "${GREEN}✓ No changes to commit${NC}"
        exit 0
    fi
fi

# Show current status
echo ""
echo -e "${YELLOW}Current status:${NC}"
git status --short

# Analyze changes and suggest commit type
STAGED=$(git diff --cached --name-only)
MODIFIED=$(git diff --name-only)
UNTRACKED=$(git ls-files --others --exclude-standard)

# Determine commit type based on file patterns
COMMIT_TYPE="chore"
COMMIT_SCOPE=""

# Check for specific file patterns
if echo "$STAGED $MODIFIED $UNTRACKED" | grep -qE "\.(py|js|ts|jsx|tsx|go|rs|java|cpp|c|h)$"; then
    COMMIT_TYPE="feat"
fi

if echo "$STAGED $MODIFIED" | grep -qE "(fix|bug|patch)"; then
    COMMIT_TYPE="fix"
fi

if echo "$STAGED $MODIFIED $UNTRACKED" | grep -qE "(README|\.md|docs|doc)"; then
    COMMIT_TYPE="docs"
fi

if echo "$STAGED $MODIFIED" | grep -qE "(refactor|restructure)"; then
    COMMIT_TYPE="refactor"
fi

# Check for skill-related changes
if echo "$STAGED $MODIFIED $UNTRACKED" | grep -q "skills/"; then
    COMMIT_SCOPE="skills"
fi

# Generate commit message
if [ -n "$COMMIT_SCOPE" ]; then
    DEFAULT_MSG="$COMMIT_TYPE($COMMIT_SCOPE): "
else
    DEFAULT_MSG="$COMMIT_TYPE: "
fi

echo ""
echo -e "${YELLOW}Suggested commit prefix: $DEFAULT_MSG${NC}"

# Stage all changes if nothing staged yet
if [ -z "$STAGED" ]; then
    echo ""
    read -p "Stage all changes? [Y/n]: " STAGE_ALL
    if [[ ! "$STAGE_ALL" =~ ^[Nn]$ ]]; then
        git add -A
        echo -e "${GREEN}✓ Staged all changes${NC}"
    fi
fi

# Prompt for commit message
echo ""
read -p "Enter commit message (or press Enter for '${DEFAULT_MSG}update'): " MSG

if [ -z "$MSG" ]; then
    MSG="${DEFAULT_MSG}update"
else
    # Add prefix if user didn't include it
    if [[ ! "$MSG" =~ ^(feat|fix|docs|refactor|chore|wip)(\([^)]+\))?: ]]; then
        MSG="${DEFAULT_MSG}${MSG}"
    fi
fi

# Commit
echo ""
echo -e "${YELLOW}Committing with message: $MSG${NC}"
git commit -m "$MSG"

# Ask about push
PUSH_DEFAULT="n"
if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
    PUSH_DEFAULT="y"
fi

echo ""
read -p "Push to remote? [Y/n]: " PUSH
if [[ ! "$PUSH" =~ ^[Nn]$ ]]; then
    git push
    echo -e "${GREEN}✓ Pushed to remote${NC}"
fi

echo ""
echo -e "${GREEN}✓ Done!${NC}"
