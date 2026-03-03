# art-validate

Comprehensive validator for the Nemo art collection. Ensures consistency across registry, metadata, and generator files.

## Installation

```bash
# Link to bin directory
ln -s "$PWD/skills/art-validate/art-validate" bin/art-validate
```

## Usage

```bash
# Full validation suite
art-validate

# Specific validations
art-validate registry      # Check registry consistency
art-validate metadata      # Check metadata completeness  
art-validate files         # Verify generator files exist
art-validate descriptions  # Find missing descriptions

# Auto-fix where possible
art-validate descriptions --fix
```

## What It Checks

### Registry Validation
- Duplicate generator IDs
- TODO descriptions that need filling
- Category distribution
- Entry completeness

### Metadata Validation
- All registry entries have metadata
- No orphaned metadata entries
- Consistent categorization

### File Validation
- Generator TypeScript files exist
- Naming conventions followed

### Description Validation
- Identifies placeholder descriptions
- Suggests context-appropriate descriptions
- Can auto-generate based on category

## Exit Codes

- `0` - All validations passed
- `1` - Errors found (see output)

## Rams Test

1. **Innovative** - Multi-layer validation across registry, metadata, and files
2. **Useful** - Catches inconsistencies before they cause runtime issues
3. **Aesthetic** - Clean color-coded output, clear categorization
4. **Understandable** - Specific error messages with suggestions
5. **Unobtrusive** - Fast, focused, no noise
6. **Honest** - Reports both errors and warnings accurately
7. **Long-lasting** - Validates structure, not content
8. **Thorough** - Covers all consistency dimensions
9. **Environmentally friendly** - Bash-based, minimal dependencies
10. **Less design** - Does one thing well
