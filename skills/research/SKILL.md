---
name: research
description: "Deep research and synthesis. Use when: (1) investigating a topic thoroughly, (2) comparing multiple sources, (3) extracting actionable insights from information."
---

# Research Skill

Systematic deep research with synthesis and insight extraction.

## Quick Actions

```bash
research "quantum computing applications"      # Deep research on topic
research --quick "latest AI developments"        # Fast overview (3 sources)
research --sources 10 "climate tech trends"      # Specify source count
research --output report.md "space exploration"  # Save to file
research --compare "react vs vue vs svelte"      # Comparative research
```

## Commands

### Basic Research

```bash
research "your research query"
```

Performs deep research:
1. Searches for 5-8 relevant sources
2. Fetches and extracts content from each
3. Synthesizes key insights
4. Identifies patterns and contradictions
5. Produces actionable summary

### Quick Mode

```bash
research --quick "topic"
research -q "topic"
```

Fast overview with 3 sources. Good for:
- Initial exploration
- Fact checking
- Getting oriented on a new topic

### Comparative Research

```bash
research --compare "option A vs option B"
research --compare "python asyncio vs threading"
```

Structured comparison:
- Side-by-side feature analysis
- Trade-off matrix
- When to use which

### Output Options

```bash
research --output findings.md "topic"      # Save to markdown file
research --json "topic"                     # JSON output for piping
research --bullet "topic"                   # Bullet-point summary only
```

## Output Format

Standard research output includes:

```
# Research: [Topic]

## Executive Summary
2-3 sentence synthesis of key findings

## Key Insights
1. [Insight with supporting evidence]
2. [Insight with supporting evidence]
3. ...

## Source Analysis
### Source 1: [Title]
- **URL**: [link]
- **Key points**: [extracted information]
- **Credibility**: [assessment]

### Source 2: ...

## Patterns & Trends
- [Pattern observed across sources]
- [Emerging trend]

## Contradictions & Gaps
- [Conflicting information]
- [Areas needing more research]

## Actionable Takeaways
- [Specific action or decision guidance]
- [Further reading suggestions]
```

## Conventions

- **Source diversity**: Mix of official docs, expert blogs, community discussions
- **Date awareness**: Prioritize recent sources for fast-moving topics
- **Quality over quantity**: Better to deeply analyze 5 good sources than skim 20
- **Uncertainty explicit**: Mark speculation vs. established facts
- **Bias awareness**: Note when sources have conflicts of interest

## Design Principles

1. **Synthesis > aggregation**: Don't just list sources — combine them into new understanding
2. **Actionable output**: Every research session should produce usable insights
3. **Source transparency**: Always cite where information came from
4. **Efficient depth**: Go deep enough to be useful, not so deep you never finish
