# Epic 11 — Skill Gap Analysis (`/upskill`) — Design

> **Status:** Approved for build
> **Date:** 2026-06-17
> **Milestone:** v1.1 (Career Development)
> **Canonical spec:** REQ-3001–3011 · ARCH-0040 (Career Development) · ARCH-0008 (skill planes) · data-req §14

---

## Problem

`/upskill` is the last unshipped piece of the v1.1 Career Development milestone, and
it is the only feature where **shipped UI already promises a capability that does not
exist**:

- The dashboard ships an **Upskill** surface (`dashboard/app/(shell)/upskill/page.tsx`)
  whose primary action is a "Run /upskill in console" button.
- The console action layer whitelists it: `dashboard/lib/run/allowlist.ts`
  (`upskill: claudeSlash(() => "/upskill")`).
- But there is **no `.claude/commands/upskill.md`** and no career-development skill —
  so a user who clicks the button runs a command that does not resolve.

This design closes that gap by implementing the skill-gap workflow specified in
REQ-3001–3011 against ARCH-0040.

## Goals

1. A user can run `/upskill` (no arg) for an **aggregate** gap analysis across every
   job in their tracker, or `/upskill <url|paste>` for a **targeted** analysis of one
   posting (REQ-3001).
2. The workflow produces a prioritized **gap heatmap** (REQ-3006), a web-searched
   **learning plan** (REQ-3007), a dependency-aware **study order** (REQ-3008), and
   persists a markdown **report** to `upskill/report-*.md` (REQ-3009) — exactly the
   files the dashboard already reads.
3. **Aggregate delta** reporting against the previous report when one exists (REQ-3010).
4. Healing the dashboard link requires **zero dashboard code change** — REQ-3009's
   filenames already match the page's `report-*.md` glob.

## Non-goals

- `/expand` (Epic 10) — separate command, not part of this change.
- Interview prep enrichment (REQ-3050–3054, Epic 12) — the static framework in
  `07-interview-prep.md` already ships; roleplay population is out of scope here.
- Any change to the dashboard, its tests, or the demo domain logic.
- Structured/machine-readable report format — the dashboard renders the report as
  plain markdown text (`page.tsx` `<pre>`), so the report stays human-first markdown.

---

## Key design decision — command **and** skill (reconciling REQ-3001)

REQ-3001 currently reads: *"upskill is a Plane 1 skill (ARCH-0008), not a standalone
command — it is activated by the trigger keyword 'upskill' within the
`job-application-assistant` skill context."*

That wording predates two committed realities:

1. The dashboard invokes it as the **slash command `/upskill`** (allowlist).
2. ARCH-0040 models **Career Development as its own domain component**, distinct from
   the application pipeline (ARCH-0010 / ARCH-0030 — `job-application-assistant`).

**Decision:** implement `/upskill` exactly like the proven `/search` shape —

| Layer | Artifact | Role |
|-------|----------|------|
| Plane-1 skill | `.claude/skills/career-development/SKILL.md` | Holds the full workflow knowledge (REQ-3001–3011, ARCH-0040). Activates on the keyword "upskill". |
| Thin command | `.claude/commands/upskill.md` | Entry point that activates the skill. Satisfies the dashboard slash invocation and the README. |

This keeps Career Development out of the already-large `job-application-assistant`
skill (which is the application pipeline's knowledge anchor), and matches the
`job-scraper` + `/search` precedent one-for-one. REQ-3001's "not a standalone command"
clause is **superseded** and will be updated to describe the command-activates-skill
model — the same reconciliation Epic 8 applied when the dashboard forced decisions on
the older specs (see the Epic 8 plan's doc-reconciliation tasks).

A new skill directory is the right home (vs. a section inside
`job-application-assistant`) because the analysis reads the **tracker** and **previous
reports** — inputs the application pipeline never touches (ARCH-0040 interfaces) — and
because a fresh, focused skill context keeps token cost down per the cost-aware
principle.

---

## Workflow (maps REQ-3001–3011)

```
/upskill            → aggregate mode
/upskill <url>      → targeted mode (paste fallback per DEC-011)
```

1. **Mode + data load** (REQ-3001–3003)
   - Aggregate: read `job_search_tracker.csv` (role, company, fit_rating per row) +
     candidate profile (`01-candidate-profile.md`); scan `upskill/` for the most recent
     `report-YYYY-MM-DD.md` to enable delta.
   - Targeted: fetch the posting (WebFetch; on failure prompt paste, DEC-011); extract
     title/company/required/preferred/responsibilities/domain; read profile; **ignore
     tracker**.
2. **Pass 1 — hard-skill diff** (REQ-3004)
   - Aggregate: skill-frequency map weighted `sum((100 − fit_rating)/100 × occurrence)`.
   - Targeted: required before preferred, equal weight, alphabetical within groups.
   - Remove skills already in the profile (generous matching). 
3. **Pass 2 — LLM synthesis** (REQ-3005): domain / soft / tooling / credential gaps,
   tagged `[domain]`/`[soft]`/`[tooling]`/`[credential]`, no Pass-1 duplication;
   credential gaps flagged when multiple postings prefer them.
4. **Gap heatmap** (REQ-3006): columns `Priority · Skill/Area · Type · Gap Source`;
   priority `Critical/High/Medium/Low`; printed to terminal before the plan.
5. **Learning plan** (REQ-3007): for every Critical + High gap (and Medium if the total
   gap count < 5), 2–3 **web-searched** resources (name, URL, one-line reason) with the
   current year in queries, a background-tailored study direction, and a time estimate;
   grouped by theme. **Never fabricate resources** (ARCH-0007). Low gaps get no plan
   entry by default (REQ-3011).
6. **Study order** (REQ-3008): numbered, dependency-aware (`deps → Critical → High →
   Medium`, quick wins early, domain knowledge last); columns `# · Topic · Type ·
   Est. Time · Note`; total time at the bottom.
7. **Persist** (REQ-3009): always write the report —
   - Aggregate → `upskill/report-YYYY-MM-DD.md`
   - Targeted → `upskill/report-YYYY-MM-DD-<company-slug>-<role-slug>.md`
   Content: delta (aggregate only) + heatmap + learning plan + study order.
8. **Delta** (REQ-3010): aggregate only, when a previous report exists — gaps closed
   (now in profile) and new gaps since last report; section omitted otherwise.

## Architecture & constraints

- **Prompt-as-code** (ARCH-0001): both artifacts are Markdown; "tests" are grep-based
  requirement/consistency checks, as in every prior CareerForge superpowers plan.
- **No fabrication** (ARCH-0007): real web-searched URLs only; honest empty result when
  the tracker is empty or a posting can't be loaded.
- **Read-before-write** and **gitignored output**: reports live in `upskill/` (already
  in the directory tree; report files are personal output and excluded from git via the
  existing `upskill/` ignore — verify in the plan).
- **Date handling**: the report date comes from the system date at run time (the
  assistant has the current date in context); filenames use `YYYY-MM-DD`.

## Doc-sync obligations (CLAUDE.md contract)

New command ⇒ in the **same change**:
- `docs-site/content/docs/commands/upskill.mdx` + add `"upskill"` to that dir's
  `meta.json` pages.
- Root `README.md`: add a `/upskill` "Commands in depth" section and move it out of the
  "Planned commands" table; update the Roadmap row for v1.1.
- Reconcile `REQ-3001` and confirm data-req §14 still matches (it does).
- No dashboard/demo-domain change ⇒ the docs-site parity test is unaffected.

## Risks

| Risk | Mitigation |
|------|------------|
| Fabricated learning resources | REQ-3007 + ARCH-0007 baked into the skill as an explicit rule; web search with current-year queries is mandatory. |
| Aggregate mode with an empty tracker | Skill detects empty/headers-only tracker and returns an honest "no tracked jobs yet — try targeted mode" message rather than an empty report. |
| REQ-3001 reconciliation drift | Update the requirement text in this change so the spec and the shipped artifacts agree. |

## Acceptance

- `.claude/commands/upskill.md` and `.claude/skills/career-development/SKILL.md` exist
  and cover REQ-3001–3011 (grep-traceable).
- Report filenames match data-req §14 / REQ-3009 and the dashboard glob.
- README, docs-site, and REQ-3001 reconciled; docs-site `vitest run` still green.
