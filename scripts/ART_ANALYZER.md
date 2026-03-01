# Art Pattern Analyzer

A self-improvement tool for the generative art portfolio. Analyzes the collection to identify patterns, gaps, and opportunities for growth.

## What It Does

- **Category Analysis**: Tracks distribution across 9 artistic domains
- **Diversity Scoring**: Calculates a 0-100 score based on category spread, tag variety, and complexity balance
- **Gap Detection**: Identifies underrepresented categories and tag combinations
- **Recommendation Engine**: Suggests next artworks to create
- **Trend Tracking**: Monitors creation patterns over time

## Usage

```bash
# Run analysis (console output)
node scripts/analyze-art-patterns.js

# Generate markdown report
node scripts/analyze-art-patterns.js --format=markdown

# Get JSON for programmatic use
node scripts/analyze-art-patterns.js --format=json
```

## The Analysis

### Diversity Score (0-100)
Calculated from:
- Category coverage (40%)
- Tag variety (40%)
- Complexity balance (20%)

### Gap Detection
Checks against:
- **Category minimums**: Each category has target thresholds
- **Tag combinations**: Underrepresented aesthetic mixes
- **Animation balance**: Ratio of animated vs static pieces

### Recommendations
Prioritized suggestions based on:
1. Critical category gaps (high priority)
2. Underused tags (medium priority)
3. Cross-category opportunities (low priority)

## Integration

The analyzer runs automatically during continuous improvement cycles. Reports are saved to `memory/art-analysis-YYYY-MM-DD.md` for trend tracking.

## Current Collection Health

As of the latest analysis:
- **74 artworks** across 9 categories
- **Diversity Score: 71/100** (good, room for improvement)
- **Critical gaps**: text (2/4), 3d (4/6), interactive (3/6)
- **Opportunity**: 86% animated — static pieces would add variety

## Future Enhancements

- [ ] Code complexity analysis (lines, cyclomatic complexity)
- [ ] Visual similarity detection (would need image hashing)
- [ ] User engagement correlation (if analytics added)
- [ ] Automatic generator scaffolding based on gaps
