# Epic 8 — Job Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/search` job-discovery workflow — a country-agnostic, web-search-based `job-scraper` Plane-1 skill that finds postings, dedupes, quick-ranks by fit, and hands the chosen one to `/apply`.

**Architecture:** Prompt-as-code (ARCH-0001). Per ARCH-0008, `job-scraper` is a **Plane-1** skill (`.claude/skills/job-scraper/`) using `WebSearch`/`WebFetch`. Country-agnostic (DEC-012, ADR-0004): no portal hardcoded — all `site:` targeting comes from the user's `search-queries.md` (already built). TS portal adapters (Plane 2) are a v1.2 concern, out of scope.

**Tech Stack:** Markdown skill + command files; JSON state (`job_scraper/seen_jobs.json`); CSV (`job_search_tracker.csv`). No build step — "tests" are grep-based requirement/consistency checks.

**Note on TDD adaptation:** This project produces prompt-as-code Markdown, not executable modules. Each task's verification is a `grep`/trace check (the analogue of a unit test) rather than pytest. This follows the existing CareerForge superpowers plans.

---

### Task 1: `job-scraper` Plane-1 skill

**Files:**
- Create: `.claude/skills/job-scraper/SKILL.md`
- Reference (exists): `.claude/skills/job-scraper/search-queries.md`
- Canonical: REQ-1001–1012, data-req §10 (seen-jobs), business-rules §6

- [ ] **Step 1 — Write `SKILL.md` frontmatter** (ARCH-0010): `name: job-scraper`; `description` ending with trigger keywords ("search for jobs", `/search`, `/scrape`); `allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch`.
- [ ] **Step 2 — Body sections, one per REQ:**
  - Invocation (REQ-1001): default = top-3 priority categories; `focus` arg prioritizes matching categories; `broad` = all categories.
  - State loading (REQ-1002): read `job_scraper/seen_jobs.json` (create `{"seen": {}}` if missing), `job_search_tracker.csv`, `search-queries.md`.
  - Multi-portal web search (REQ-1003): `WebSearch` from user portals+queries+geography, last 14 days; **no hardcoded `site:`**.
  - Fetch & parse (REQ-1004): pre-filter on snippets; `WebFetch`; extract {title, company, location, date|"recent", url, brief requirements, deadline}; on failure prompt paste (DEC-011), never abort.
  - Quick fit (REQ-1005): 3-level High/Medium/Low signal — not numeric, not the 5-dim eval.
  - Dedupe + state update (REQ-1006, data-req §10): key `<url_or_company_title_key>`; fields {title, company, url, first_seen, fit (high|medium|low), status (new|skipped|evaluated)}; record new AND skipped.
  - Geo + date filtering (REQ-1010/1011): location tiers (skip "too far", flag "borderline"); skip expired/closed; flag date-unknown.
  - Presentation (REQ-1007): header "Found X new positions (Y high, Z medium, W low match)"; table `#, Fit, Title, Company, Location, Deadline, URL`; 2–3 why-bullets per high; ask for number(s).
  - Handoff (REQ-1008): pass selected job URL/text to `/apply`; tracker write stays in `/apply`.
  - No fabrication (REQ-1012): real URLs only; honest empty result.
- [ ] **Step 3 — Verify country-agnostic:** `grep -niE 'indeed|linkedin|jobindex|site:[a-z]' .claude/skills/job-scraper/SKILL.md` → **no hardcoded portals** (only config-driven examples). Expected: none.
- [ ] **Step 4 — Verify seen-jobs schema match:** `grep -n 'first_seen\|new|skipped|evaluated\|url_or_company' SKILL.md` matches data-req §10. Expected: present.
- [ ] **Step 5 — Commit** `feat(search): add job-scraper Plane-1 skill (Epic 8, T-070, T-073–T-075)`.

### Task 2: `/search` thin entry command

**Files:**
- Create: `.claude/commands/search.md`

- [ ] **Step 1** — Frontmatter: `description`, `argument-hint: "[focus area] [broad]"`, `allowed-tools` mirroring the skill.
- [ ] **Step 2** — Body: activate the `job-scraper` skill and run its workflow; note `/search` canonical, `/scrape` alias.
- [ ] **Step 3 — Verify** the command references the skill: `grep -n 'job-scraper' .claude/commands/search.md`. Expected: present.
- [ ] **Step 4 — Commit** `feat(search): add /search entry command (Epic 8, T-072)`.

### Task 3: Fix `/apply` tracker write (T-076 + correctness)

**Files:**
- Modify: `.claude/commands/apply.md` (Step 1.5 / Step 6)

- [ ] **Step 1 — Status value bug:** change `status=drafting` → **`Draft`** (canonical enum, business-rules §9.1; `/apply` writes only `Draft`/`Sent`).
- [ ] **Step 2 — Timing:** move the tracker append from post-approval (Step 1.5) to **after successful compilation (Step 6)** so `cv_file`/`cover_letter_file` exist. Update the REQ→Step trace + any Step 1.5 heading.
- [ ] **Step 3 — Header init (TC-SEA-009):** if `job_search_tracker.csv` is missing, create it with the canonical 14-column header before appending.
- [ ] **Step 4 — Verify:** `grep -n 'drafting' .claude/commands/apply.md` → none; `grep -n 'status.*Draft\|14-column\|header' .claude/commands/apply.md` → present.
- [ ] **Step 5 — Commit** `fix(apply): tracker row uses Draft status, written at draft completion (Epic 8, T-076)`.

### Task 4: Reconcile `implementation-guide-job-search.md`

**Files:**
- Modify: `docs/development/implementation-guide-job-search.md` (§1, §2, §3, §4; keep §5)

- [ ] **Step 1** — Rewrite §1–§2: replace abstract `BaseJobAdapter`/`GenericScraperAdapter` + `tools/adapters/generic_scraper.ts` with the Plane-1 web-search model; structured portal adapters = optional Plane-2 pattern at `.agents/skills/<portal>/cli/` (ADR-0004, v1.2).
- [ ] **Step 2** — Fix §3 dedup key: data-req §10 `<url_or_company_title_key>`, not MD5.
- [ ] **Step 3** — Fix §4 quick-fit: 3-level signal (REQ-1005), drop the numeric weighted formula.
- [ ] **Step 4 — Verify:** `grep -n 'BaseJobAdapter\|tools/adapters\|MD5' docs/development/implementation-guide-job-search.md` → none.
- [ ] **Step 5 — Commit** `docs(job-search): reconcile dev guide to Plane-1 web-search model (Epic 8)`.

### Task 5: Reconcile `test-plan-job-search.md`

**Files:**
- Modify: `docs/testing/test-plan-job-search.md` (TC-SEA-001/002/003/006; keep 007–009)

- [ ] **Step 1** — Reframe TC-SEA-001/002 (SPA/DOM hydration, 403 adapter exceptions) → web-search + paste-fallback behavior (DEC-011).
- [ ] **Step 2** — TC-SEA-003 dedup → seen-jobs key (data-req §10), not MD5.
- [ ] **Step 3** — TC-SEA-006 → keyword/fit matching without the numeric formula.
- [ ] **Step 4 — Verify:** `grep -n 'MD5\|hash\|SPA\|DOM' docs/testing/test-plan-job-search.md` → none (or only reframed mentions).
- [ ] **Step 5 — Commit** `docs(testing): reconcile job-search test plan to web-search model (Epic 8)`.

---

## Self-Review

- **Spec coverage:** REQ-1001→T1 invocation · 1002→T1 state · 1003→T1 search · 1004→T1 fetch/paste · 1005→T1 quick-fit · 1006→T1 dedupe · 1007→T1 presentation · 1008→T1 handoff · 1009→T3 tracker · 1010/1011→T1 filtering · 1012→T1 no-fab. All covered.
- **Naming consistency:** seen-jobs key `<url_or_company_title_key>` and fit enum `high|medium|low` used identically in T1 and T4; status `Draft` in T3 matches business-rules §9.1.
- **No placeholders:** each task names exact files + a concrete grep verification.

## Out of scope

TS portal adapters (Plane 2, ADR-0004 — v1.2), tracking dashboard (Epic 9), `/upskill` (Epic 11), changes to `search-queries.md` (already built).
