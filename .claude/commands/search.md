---
description: Search configured job portals for new postings, deduplicate, quick-rank by fit, and hand off to /apply. Alias: /scrape.
argument-hint: "[focus area | broad]"
allowed-tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
---

# /search — Job Discovery

> **Canonical command:** `/search`  **Alias:** `/scrape`
> **Spec:** REQ-1001–1012, ADR-0004, DEC-011, DEC-012

Activate the **`job-scraper`** skill and run its full workflow:

1. **Load state** — read `job_scraper/seen_jobs.json`, `job_search_tracker.csv`, and `.claude/skills/job-scraper/search-queries.md` (REQ-1002).
2. **Select query scope** — default: top 3 priority categories; optional focus argument narrows/prioritizes; `broad` runs all categories (REQ-1001).
3. **Search** — issue `WebSearch` queries from the user's configured portals, query strings, and geography; last 14 days (REQ-1003).
4. **Fetch & parse** — pre-filter on snippets, `WebFetch` promising results; on failure prompt paste (DEC-011) (REQ-1004).
5. **Quick fit** — assign High / Medium / Low signal per candidate profile (REQ-1005).
6. **Deduplicate** — skip seen URLs and known company+role pairs; record all in `seen_jobs.json` (REQ-1006).
7. **Filter** — apply geo tiers and date rules from `search-queries.md` (REQ-1010, REQ-1011).
8. **Present** — summary header + fit-sorted table; 2–3 why-bullets for High matches; ask for number(s) (REQ-1007).
9. **Hand off** — pass chosen job URL or text to `/apply`; mark status `evaluated` in `seen_jobs.json` (REQ-1008).

All portal targeting, geography, and site selections come from the user's `search-queries.md` — nothing is hardcoded here (DEC-012).
