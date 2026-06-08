<!--
  Template — /setup (Step 4 / REQ-0015) replaces [UPPER_SNAKE_CASE] tokens with
  your search preferences. Re-run with `/setup --section search` to regenerate.
  Edit this file directly any time. Read by the job-scraper skill on every scrape.
  Schema: data-requirements §9 and §17.
-->

# Search Queries

## Search Sites

<!-- Job portals to search, most-preferred first. /setup fills from your choices. -->
- [SEARCH_SITE_1]
- [SEARCH_SITE_2]
- [SEARCH_SITE_3]

## Date Filter Rule

Only consider postings published in the **last 14 days**, or whose application
deadline has not expired.

---

## Priority 1 — Primary Role Direction

<!-- Strongest match: your main target role + key skill in your ideal location. -->
- "[YOUR_PRIMARY_JOB_TITLE]" [YOUR_CITY]
- "[YOUR_PRIMARY_JOB_TITLE]" "[YOUR_KEY_SKILL]" [YOUR_REGION]

## Priority 2 — Domain Expertise

<!-- Vertical-specific queries combining your role with domain keywords. -->
- "[YOUR_PRIMARY_JOB_TITLE]" "[YOUR_DOMAIN_KEYWORD_1]" [YOUR_REGION]
- "[YOUR_DOMAIN_KEYWORD_2]" "[YOUR_KEY_SKILL]" [YOUR_COUNTRY]

## Priority 3 — Adjacent Role Pivots

<!-- Broader career directions your skills also fit. -->
- "[ADJACENT_ROLE_TITLE_1]" [YOUR_REGION]
- "[ADJACENT_ROLE_TITLE_2]" "[YOUR_KEY_SKILL]" [YOUR_COUNTRY]

## Priority 4 — Wider-Net Broad Queries

<!-- Catch-all queries to surface postings the targeted searches miss. -->
- "[YOUR_KEY_SKILL]" [YOUR_COUNTRY]
- "[YOUR_DOMAIN_KEYWORD_1]" [YOUR_REGION]

---

## Location Filter Tiers

| Tier | Zone | Treatment |
|------|------|-----------|
| Ideal | [LOCATION_TIER_IDEAL] | Prioritize; surface first |
| Acceptable | [LOCATION_TIER_ACCEPTABLE] | Include normally |
| Borderline | [LOCATION_TIER_BORDERLINE] | Include with a commute/relocation note |
| Too far | [LOCATION_TIER_TOO_FAR] | Exclude unless remote |
