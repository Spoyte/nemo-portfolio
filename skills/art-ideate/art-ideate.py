#!/usr/bin/env python3
"""
art-ideate — Generative art ideation engine

Analyzes the existing portfolio to identify gaps, patterns, and opportunities
for new algorithms. Suggests concrete ideas based on what's missing.

Usage:
    art-ideate              # Show top 5 ideas with reasoning
    art-ideate --all        # Show all identified gaps
    art-ideate --category   # Show category balance analysis
    art-ideate --random     # Pick one random idea to implement now
"""

import os
import re
import json
import random
import argparse
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Dict, Set, Tuple

# Configuration
WORKSPACE = Path("/root/.openclaw/workspace")
PORTFOLIO = WORKSPACE / "nemo-portfolio" / "my-app"
ART_DIR = PORTFOLIO / "lib" / "art"

# Taxonomy of generative art domains
DOMAINS = {
    "mathematical": {
        "existing": set(),
        "patterns": ["parametric curves", "fractals", "tessellations", "topology", "knots"],
        "suggestions": [
            ("Phyllotaxis Spiral", "Golden angle spiral found in sunflowers and pinecones"),
            ("Hilbert Curve", "Space-filling curve with fractal properties"),
            ("Dragon Curve", "Paper-folding fractal with recursive structure"),
            ("Apollonian Gasket", "Circle packing fractal with infinite recursion"),
            ("Barnsley Fern", "Iterated function system creating natural forms"),
            ("Mandelbrot Zoom", "Deep zoom into the Mandelbrot set boundary"),
            ("Julia Set Morph", "Animated morphing between Julia set parameters"),
            ("Sierpinski Triangle", "Chaos game implementation of classic fractal"),
            ("Pendulum Waves", "Physics simulation of coupled pendulums"),
            ("Chladni Figures", "Resonance patterns from vibrating plates"),
        ]
    },
    "natural": {
        "existing": set(),
        "patterns": ["flora", "fauna", "weather", "geology", "water"],
        "suggestions": [
            ("Lightning Bolt", "Dielectric breakdown simulation with branching"),
            ("Cloud Formation", "Cellular automata for cumulus evolution"),
            ("Coral Growth", "Diffusion-limited aggregation with nutrient field"),
            ("Fern Unfurling", "Botanical growth animation with circinate vernation"),
            ("Snowflake Crystal", "Six-fold symmetry with atmospheric conditions"),
            ("River Delta", "Sediment deposition and erosion simulation"),
            ("Fireflies", "Bioluminescent synchronization patterns"),
            ("Seaweed Sway", "Underwater plant motion with current simulation"),
            ("Mycelium Network", "Fungal growth through substrate"),
            ("Bird Murmuration", "Boid flocking behavior with predator avoidance"),
        ]
    },
    "physical": {
        "existing": set(),
        "patterns": ["waves", "particles", "fields", "forces", "fluids"],
        "suggestions": [
            ("Magnetic Field Lines", "Visualization of dipole field with iron filings"),
            ("Gravitational Lensing", "Light bending around massive objects"),
            ("Double Slit", "Wave-particle interference pattern"),
            ("Plasma Globe", "Streamer discharge in noble gas"),
            ("Newton's Cradle", "Elastic collision chain with momentum transfer"),
            ("Slinky Walk", "Spring dynamics down stairs"),
            ("Soap Bubbles", "Minimal surface with Plateau's laws"),
            ("Smoke Rings", "Vortex ring propagation and collision"),
            ("Chaos Pendulum", "Triple pendulum with unpredictable motion"),
            ("Acoustic Standing Wave", "Ruben's tube visualization of sound"),
        ]
    },
    "optical": {
        "existing": set(),
        "patterns": ["interference", "diffraction", "reflection", "refraction", "shadows"],
        "suggestions": [
            ("Lens Flare", "Aberration patterns from bright light sources"),
            ("Prism Dispersion", "White light splitting into spectrum"),
            ("Caustics", "Light concentration through curved surfaces"),
            ("Iridescence", "Structural color from thin film interference"),
            ("Lens Distortion", "Barrel and pincushion aberration"),
            ("Shadow Play", "Multiple light source shadow overlap"),
            ("Rainbow Arc", "Droplet refraction and internal reflection"),
            ("Glare Bloom", "Atmospheric scattering around bright objects"),
            ("Anaglyph 3D", "Stereoscopic depth through color filtering"),
            ("Hologram", "Interference pattern reconstruction"),
        ]
    },
    "geometric": {
        "existing": set(),
        "patterns": ["tiling", "packing", "tessellation", "symmetry", "transformation"],
        "suggestions": [
            ("Penrose Tiling", "Aperiodic tiling with five-fold symmetry"),
            ("Islamic Pattern", "Geometric arabesque with star polygons"),
            ("Celtic Knot", "Interlaced ribbon with over-under pattern"),
            ("String Art", "Curve envelope from straight lines"),
            ("Origami Crease", "Paper folding patterns and flat-foldability"),
            ("Circle Packing", "Tangent circles with varying radii"),
            ("Voronoi Cities", "Urban growth model based on proximity"),
            ("Maze Generation", "Perfect maze with recursive backtracker"),
            ("Truchet Tiles", "Modular pattern with rotational symmetry"),
            ("Parquet Deformation", "Gradual geometric transformation"),
        ]
    },
    "algorithmic": {
        "existing": set(),
        "patterns": ["sorting", "search", "graphs", "automata", "neural"],
        "suggestions": [
            ("Sorting Visualizer", "Animated comparison of algorithms"),
            ("Pathfinding", "A* search with heuristic visualization"),
            ("Neural Network", "Forward pass with activation visualization"),
            ("Genetic Algorithm", "Evolution of solutions over generations"),
            ("Maze Solver", "BFS/DFS with backtracking visualization"),
            ("Binary Search Tree", "Self-balancing tree operations"),
            ("Hash Collision", "Distribution and chaining visualization"),
            ("FFT Spectrum", "Frequency decomposition of input signal"),
            ("Conway's Life", "Game of Life with custom rules"),
            ("Perlin Flow", "Noise-based particle advection"),
        ]
    },
}

# Keywords that map algorithms to domains
DOMAIN_KEYWORDS = {
    "mathematical": ["curve", "fractal", "parametric", "equation", "math", "spiral", 
                     "mandelbrot", "julia", "fern", "attractor", "lissajous", "spirograph"],
    "natural": ["plant", "tree", "leaf", "flower", "organic", "growth", "nature",
                "coral", "crystal", "snowflake", "fern", "botany", "dla", "reaction"],
    "physical": ["wave", "particle", "fluid", "physics", "pendulum", "gravity",
                 "magnetic", "field", "force", "collision", "spring", "tank"],
    "optical": ["light", "moire", "interference", "diffraction", "lens", "shadow",
                "reflection", "refraction", "spectrum", "prism", "caustic", "hologram"],
    "geometric": ["tile", "pattern", "symmetry", "polygon", "circle", "grid",
                  "mandala", "kaleidoscope", "voronoi", "tessellation", "packing"],
    "algorithmic": ["sort", "search", "graph", "neural", "network", "automata",
                    "cellular", "genetic", "algorithm", "tree", "path", "flow"],
}


@dataclass(frozen=True)
class ArtPiece:
    name: str
    filename: str
    domains: Tuple[str, ...]
    
    @property
    def display_name(self) -> str:
        return self.name.replace("-", " ").title()


@dataclass
class GapAnalysis:
    domain: str
    coverage: float  # 0.0 to 1.0
    existing_count: int
    suggestions: List[Tuple[str, str]]
    
    @property
    def priority(self) -> float:
        """Lower coverage = higher priority"""
        return 1.0 - self.coverage


def scan_portfolio() -> List[ArtPiece]:
    """Scan the art directory and classify all algorithms."""
    pieces = []
    
    if not ART_DIR.exists():
        return pieces
    
    for file_path in ART_DIR.glob("*.ts"):
        # Skip non-algorithm files
        if file_path.name in ["index.ts", "thumbnails.ts", "unified-registry.ts"]:
            continue
            
        name = file_path.stem
        content = file_path.read_text().lower()
        
        # Classify by domain
        domains = []
        for domain, keywords in DOMAIN_KEYWORDS.items():
            if any(kw in content or kw in name.lower() for kw in keywords):
                domains.append(domain)
        
        # Default to algorithmic if no match
        if not domains:
            domains = ["algorithmic"]
            
        piece = ArtPiece(name=name, filename=file_path.name, domains=tuple(domains))
        pieces.append(piece)
    
    return pieces


def analyze_gaps(pieces: List[ArtPiece]) -> List[GapAnalysis]:
    """Identify gaps in portfolio coverage."""
    analyses = []
    
    # Count pieces per domain
    domain_counts = {domain: 0 for domain in DOMAINS}
    for piece in pieces:
        for domain in piece.domains:
            if domain in domain_counts:
                domain_counts[domain] += 1
    
    for domain, data in DOMAINS.items():
        existing = domain_counts[domain]
        total_suggestions = len(data["suggestions"])
        
        # Calculate coverage relative to "ideal" count (30% of suggestions)
        ideal_count = max(total_suggestions * 0.3, 3)  # At least 3 per domain
        coverage = min(existing / ideal_count, 1.0)
        
        # Find unused suggestions
        existing_names = set()
        for piece in pieces:
            for d in piece.domains:
                if d == domain:
                    existing_names.add(piece.name.lower())
        
        available = [
            (name, desc) for name, desc in data["suggestions"]
            if name.lower().replace(" ", "-") not in existing_names
            and not any(name.lower().replace(" ", "-") in p.name.lower() for p in pieces)
        ]
        
        analysis = GapAnalysis(
            domain=domain,
            coverage=coverage,
            existing_count=existing,
            suggestions=available
        )
        analyses.append(analysis)
    
    # Sort by priority (lowest coverage first)
    analyses.sort(key=lambda x: x.priority, reverse=True)
    return analyses


def generate_ideas(analyses: List[GapAnalysis], count: int = 5) -> List[Dict]:
    """Generate specific, actionable ideas."""
    ideas = []
    
    for analysis in analyses:
        if len(ideas) >= count:
            break
            
        # Take top suggestions from underrepresented domains
        for name, description in analysis.suggestions[:2]:
            if len(ideas) >= count:
                break
                
            ideas.append({
                "name": name,
                "kebab_name": name.lower().replace(" ", "-"),
                "description": description,
                "domain": analysis.domain,
                "domain_coverage": f"{analysis.coverage:.0%}",
                "why": f"{analysis.domain.title()} domain is only {analysis.coverage:.0%} covered"
            })
    
    return ideas


def print_category_balance(analyses: List[GapAnalysis]):
    """Print category distribution."""
    print("\n📊 Category Balance")
    print("=" * 50)
    
    total = sum(a.existing_count for a in analyses)
    
    for analysis in analyses:
        bar_len = int(analysis.coverage * 20)
        bar = "█" * bar_len + "░" * (20 - bar_len)
        pct = analysis.coverage * 100
        print(f"{analysis.domain:12} │{bar}│ {analysis.existing_count:2d} pieces ({pct:.0f}% coverage)")
    
    print(f"\nTotal: {total} algorithms across {len(analyses)} domains")


def print_ideas(ideas: List[Dict], verbose: bool = False):
    """Print formatted ideas."""
    print(f"\n💡 Top {len(ideas)} Ideas")
    print("=" * 60)
    
    for i, idea in enumerate(ideas, 1):
        print(f"\n{i}. {idea['name']}")
        print(f"   Command: art-new {idea['kebab_name']} \"{idea['name']}\"")
        print(f"   Domain:  {idea['domain']} ({idea['domain_coverage']} coverage)")
        print(f"   Concept: {idea['description']}")
        if verbose:
            print(f"   Why now: {idea['why']}")


def print_random(analyses: List[GapAnalysis]):
    """Pick and print one random idea."""
    # Weight by gap size (more underrepresented = more likely)
    weighted = []
    for analysis in analyses:
        weight = max(1, int((1 - analysis.coverage) * 10))
        for suggestion in analysis.suggestions[:3]:
            weighted.append((analysis, suggestion))
    
    if not weighted:
        print("No ideas available!")
        return
    
    analysis, (name, description) = random.choice(weighted)
    
    print("\n🎲 Random Selection")
    print("=" * 60)
    print(f"\n{name}")
    print(f"\n   art-new {name.lower().replace(' ', '-')} \"{name}\"")
    print(f"\n   {description}")
    print(f"\n   Domain: {analysis.domain} ({analysis.coverage:.0%} coverage)")
    print(f"\n   Why this fits: {analysis.domain.title()} is underrepresented.")
    print(f"   The portfolio has {analysis.existing_count} {analysis.domain}")
    print(f"   pieces but could use more variety in this area.")


def main():
    parser = argparse.ArgumentParser(
        description="Generative art ideation engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    art-ideate              # Show top 5 ideas
    art-ideate --all        # Show all gaps
    art-ideate --category   # Show category balance
    art-ideate --random     # Pick one random idea
        """
    )
    parser.add_argument("--all", action="store_true", 
                       help="Show all identified gaps")
    parser.add_argument("--category", action="store_true",
                       help="Show category balance analysis")
    parser.add_argument("--random", action="store_true",
                       help="Pick one random idea to implement")
    parser.add_argument("--json", action="store_true",
                       help="Output as JSON")
    
    args = parser.parse_args()
    
    # Scan portfolio
    pieces = scan_portfolio()
    analyses = analyze_gaps(pieces)
    
    if args.json:
        output = {
            "total_pieces": len(pieces),
            "domains": [
                {
                    "name": a.domain,
                    "coverage": a.coverage,
                    "existing": a.existing_count,
                    "gaps": len(a.suggestions)
                }
                for a in analyses
            ],
            "ideas": generate_ideas(analyses, 10)
        }
        print(json.dumps(output, indent=2))
        return
    
    if args.category:
        print_category_balance(analyses)
        return
    
    if args.random:
        print_random(analyses)
        return
    
    if args.all:
        print(f"\n🎨 Portfolio Analysis: {len(pieces)} algorithms")
        print_category_balance(analyses)
        print("\n" + "=" * 60)
        for analysis in analyses:
            if analysis.suggestions:
                print(f"\n{analysis.domain.upper()} ({len(analysis.suggestions)} opportunities)")
                for name, desc in analysis.suggestions[:5]:
                    print(f"  • {name}: {desc}")
        return
    
    # Default: top 5 ideas
    ideas = generate_ideas(analyses, 5)
    print(f"\n🎨 Portfolio: {len(pieces)} algorithms analyzed")
    print_ideas(ideas, verbose=True)
    
    print("\n" + "=" * 60)
    print("Run 'art-ideate --random' to pick one and start building.")


if __name__ == "__main__":
    main()
