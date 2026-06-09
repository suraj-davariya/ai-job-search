#!/usr/bin/env python3
"""Salary benchmarking lookup — CareerForge Epic 7 (T-060).

Usage:
  python3 salary_lookup.py "Acme Corp"
  python3 salary_lookup.py "Acme Corp" --city "Copenhagen" --json
  python3 salary_lookup.py --list
  python3 salary_lookup.py --list --city "London"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "salary_data.json")

LEGAL_SUFFIXES = {
    "a/s", "aps", "a/p", "i/s", "k/s",  # Nordic
    "inc", "incorporated", "ltd", "limited",
    "llc", "llp", "lp",
    "corp", "corporation",
    "gmbh", "ag", "sa", "sas", "bv", "nv",
    "plc", "pte",
    "as",  # Generic abbreviation — listed last, short common token
}

NOISE_WORDS = {
    "holding", "holdings", "group", "international",
    "global", "regional", "solutions", "services",
}

PRIVACY_THRESHOLD = 5  # Fewer employees than this → show privacy note


# ---------------------------------------------------------------------------
# Normalisation & fuzzy matching
# ---------------------------------------------------------------------------

_NORDIC = str.maketrans(
    "æøåÆØÅüöäÜÖÄ",
    "eoaeoauoauoa",
)


def normalize(name: str) -> str:
    """Return a cleaned, lowercase token string for comparison."""
    # Translate Nordic / special characters
    name = name.translate(_NORDIC)
    # Drop parenthetical sub-entities: "Acme (Denmark)" → "Acme"
    name = re.sub(r"\(.*?\)", "", name)
    # Drop post-comma descriptions: "Acme, Northern Region" → "Acme"
    name = name.split(",")[0]
    # Lowercase
    name = name.lower()
    # Strip punctuation except spaces
    name = re.sub(r"[^a-z0-9\s]", " ", name)
    # Tokenise
    tokens = name.split()
    # Remove legal suffixes, noise words, and single-char artifacts from punct stripping
    tokens = [
        t for t in tokens
        if len(t) > 1 and t not in LEGAL_SUFFIXES and t not in NOISE_WORDS
    ]
    return " ".join(tokens)


def _token_set(s: str) -> set:
    return set(s.split())


def score(query_norm: str, candidate_norm: str) -> int:
    """Return 0–100 token-overlap F1 score (harmonic mean of precision + recall).

    Using F1 rather than pure Jaccard means a query like "Nordea" will score
    well against "Nordea Bank" (the query tokens are fully covered even though
    the candidate has an extra distinguishing word).
    """
    q_tokens = _token_set(query_norm)
    c_tokens = _token_set(candidate_norm)
    if not q_tokens or not c_tokens:
        return 0
    intersection = len(q_tokens & c_tokens)
    if intersection == 0:
        return 0
    precision = intersection / len(q_tokens)
    recall = intersection / len(c_tokens)
    f1 = 2 * precision * recall / (precision + recall)
    return int(f1 * 100)


def find_matches(
    query: str,
    companies: List[dict],
    city: Optional[str],
    threshold: int,
) -> List[Tuple[int, dict]]:
    """Return list of (score, company) sorted by score desc, filtered to >= threshold."""
    query_norm = normalize(query)
    city_norm = city.strip().lower() if city else None

    results = []
    for company in companies:
        c_norm = normalize(company.get("company", ""))
        s = score(query_norm, c_norm)
        if s < threshold:
            continue
        if city_norm:
            c_city = (company.get("city") or "").strip().lower()
            if c_city and c_city != city_norm:
                continue
        results.append((s, company))

    results.sort(key=lambda x: x[0], reverse=True)
    return results


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

def _vs_baseline(index: Optional[float], baseline: int) -> str:
    if index is None:
        return "n/a"
    diff = index - baseline
    sign = "+" if diff >= 0 else ""
    return f"{sign}{diff:.0f}"


def _privacy_note(count: Optional[float]) -> str:
    if count is None or count < PRIVACY_THRESHOLD:
        return "  (privacy — too few employees)"
    return ""


def print_match(match_score: int, company: dict, metadata: dict) -> None:
    baseline = metadata.get("index_baseline", 100)
    source = metadata.get("source", "unknown")
    baseline_desc = metadata.get("baseline_description", f"Baseline = {baseline}")

    name = company.get("company", "?")
    city = company.get("city", "")
    city_str = f" — {city}" if city else ""
    categories = company.get("categories", {})

    print(f"\n{'='*60}")
    print(f"  {name}{city_str}  (match: {match_score}%)")
    print(f"{'='*60}")

    if not categories:
        print("  No category data available.")
    else:
        cat_w = max((len(k) for k in categories), default=8)
        cat_w = max(cat_w, 8)
        header = f"  {'Category':<{cat_w}}  {'Count':>6}  {'Index':>6}  {'vs Baseline':>12}"
        print(header)
        print("  " + "-" * (cat_w + 30))
        for cat_name, vals in categories.items():
            idx = vals.get("index")
            cnt = vals.get("count")
            cnt_str = str(int(cnt)) if cnt is not None else "—"
            idx_str = f"{idx:.0f}" if idx is not None else "—"
            vs_str = _vs_baseline(idx, baseline)
            note = _privacy_note(cnt)
            print(
                f"  {cat_name:<{cat_w}}  {cnt_str:>6}  {idx_str:>6}  {vs_str:>12}{note}"
            )

    print(f"\n  Source: {source}  |  {baseline_desc}")


def print_list(companies: List[dict], city: Optional[str]) -> None:
    filtered = list(companies)
    if city:
        city_lower = city.strip().lower()
        filtered = [
            c for c in filtered
            if (c.get("city") or "").strip().lower() == city_lower
        ]
    filtered.sort(key=lambda c: (c.get("company") or "").lower())

    print(f"{'Company':<40}  {'City'}")
    print("-" * 60)
    for c in filtered:
        print(f"{c.get('company', '?'):<40}  {c.get('city') or '—'}")
    print(f"\n{len(filtered)} companies listed.")


def build_json_output(
    query: str,
    matches: List[Tuple[int, dict]],
    metadata: dict,
) -> dict:
    baseline = metadata.get("index_baseline", 100)
    results = []
    for s, company in matches:
        cats: Dict[str, dict] = {}
        for cat_name, vals in (company.get("categories") or {}).items():
            idx = vals.get("index")
            cats[cat_name] = {
                "count": vals.get("count"),
                "index": idx,
                "vs_baseline": round(idx - baseline, 2) if idx is not None else None,
            }
        results.append(
            {
                "company": company.get("company"),
                "city": company.get("city"),
                "score": s,
                "categories": cats,
            }
        )
    return {"query": query, "matches": results, "metadata": metadata}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Look up company salary benchmarks from salary_data.json.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "company",
        nargs="?",
        help="Company name to look up (omit when using --list).",
    )
    parser.add_argument(
        "--city",
        metavar="CITY",
        help="Narrow results to this city.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_output",
        help="Output results as JSON.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        dest="list_all",
        help="List all companies in the dataset.",
    )
    parser.add_argument(
        "--threshold",
        type=int,
        default=60,
        metavar="N",
        help="Minimum match score 0-100 (default: 60).",
    )
    args = parser.parse_args()

    if not args.list_all and not args.company:
        parser.error("Provide a company name, or use --list to show all companies.")

    # Load data
    if not os.path.exists(DATA_FILE):
        print(
            "Salary data not available (salary_data.json not found).\n"
            "See tools/README_SALARY_TOOL.md to create or import salary data."
        )
        sys.exit(0)

    with open(DATA_FILE, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    metadata = data.get("metadata", {})
    companies = data.get("companies", [])

    # --list mode
    if args.list_all:
        if args.json_output:
            out = [{"company": c.get("company"), "city": c.get("city")} for c in companies]
            if args.city:
                city_lower = args.city.strip().lower()
                out = [o for o in out if (o.get("city") or "").lower() == city_lower]
            out.sort(key=lambda x: (x.get("company") or "").lower())
            print(json.dumps(out, indent=2, ensure_ascii=False))
        else:
            print_list(companies, args.city)
        return

    # Lookup mode
    matches = find_matches(args.company, companies, args.city, args.threshold)

    if not matches:
        print(
            f"No salary data found for '{args.company}'"
            + (f" in '{args.city}'" if args.city else "")
            + f" (threshold: {args.threshold})."
        )
        sys.exit(0)

    if args.json_output:
        print(json.dumps(build_json_output(args.company, matches, metadata), indent=2, ensure_ascii=False))
    else:
        for match_score, company in matches:
            print_match(match_score, company, metadata)
        print()


if __name__ == "__main__":
    main()
