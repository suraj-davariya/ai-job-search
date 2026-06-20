---
description: Analyze skill gaps across your tracked jobs (aggregate) or one posting (targeted), then build a prioritized, web-sourced learning plan and save a report.
argument-hint: "[job url | pasted posting | (blank for aggregate)]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
---

# /upskill — Skill Gap Analysis

> **Spec:** REQ-3001–3011, ARCH-0040 (Career Development), ARCH-0008
> **Backed by:** the `career-development` Plane-1 skill
> **Used by:** the dashboard Upskill surface (reads the `upskill/report-*.md` files this produces)

Activate the **`career-development`** skill and run its full workflow:

1. **Pick the mode** (REQ-3001):
   - `/upskill` (no argument) → **aggregate** mode — analyze every job in
     `job_search_tracker.csv`. If the tracker is empty, say so and suggest targeted mode
     instead of writing an empty report.
   - `/upskill <url>` (or pasted posting text) → **targeted** mode — analyze one posting.
     If the URL can't be fetched, ask for a paste (DEC-011); never abort.
2. **Load data** (REQ-3002, REQ-3003) — candidate profile always; tracker + most recent
   previous report in aggregate mode; the fetched/pasted posting in targeted mode.
3. **Pass 1 — hard-skill diff** (REQ-3004) — required/preferred skills vs. profile,
   fit-weighted in aggregate mode; generous matching removes skills already held.
4. **Pass 2 — synthesis** (REQ-3005) — domain / soft / tooling / credential gaps.
5. **Gap heatmap** (REQ-3006, REQ-3011) — Critical/High/Medium/Low table printed first;
   Low gaps listed but not planned.
6. **Learning plan** (REQ-3007) — 2–3 **real, web-searched** resources per Critical/High
   gap (and Medium when <5 gaps total), with study direction and time estimate. Never
   fabricate resources (ARCH-0007).
7. **Study order** (REQ-3008) — dependency-aware numbered sequence with total time.
8. **Save the report** (REQ-3009, REQ-3010) — always write
   `upskill/report-YYYY-MM-DD.md` (aggregate) or
   `upskill/report-YYYY-MM-DD-<company>-<role>.md` (targeted), including the since-last
   delta in aggregate mode.

Full behavior lives in `.claude/skills/career-development/SKILL.md`.
