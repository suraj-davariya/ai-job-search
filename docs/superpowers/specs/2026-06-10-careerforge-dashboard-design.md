# CareerForge Dashboard — Design Spec

> **Status:** Approved for planning (user chose "docs + plan only", 2026-06-10)
> **Author:** Superpowers brainstorming
> **Implements:** REQ-5000–REQ-5016 · ADR-0006 · NFR-0006/0014–0017
> **Plan:** [`../plans/2026-06-10-careerforge-dashboard.md`](../plans/2026-06-10-careerforge-dashboard.md)

---

## 1. Problem & Goal

CareerForge is operated today through Claude Code slash-commands over a
file-as-DB (`job_search_tracker.csv` + sibling JSON/markdown). The goal is a
**local-only, dark, orange-gold Next.js dashboard** that lets a job seeker (a)
*see* every stat about their search and (b) *drive* the framework (apply, search,
upskill, salary lookup) from the browser — while reading/writing the existing
files as the single source of truth. The endgame is a full CLI alternative; v1 is
built so that endgame is natural, not bolted on.

This spec consolidates the binding decisions (ADR-0006, REQ-5000–5016,
business-rules §9, the Next.js implementation guide) into a decomposition and a
set of contracts the implementation plan executes against.

## 2. Non-negotiables (acceptance gates)

Drawn from ADR-0006 + the requirements; every milestone is checked against these:

1. **File-as-DB, no database.** CSV/JSON/markdown are the source of truth. No
   Prisma/SQLite/ORM (ADR-0001/0006).
2. **Local-only, zero telemetry.** Bind `127.0.0.1` only; bundle all assets; the
   only outbound activity is the subprocess the user explicitly triggers
   (REQ-5008/NFR-0017). No NextAuth, no accounts.
3. **Atomic writes.** tempfile → fsync → `.bak` → rename; safe against a concurrent
   `/apply` append (NFR-0016).
4. **State machine enforced server-side** (business-rules §9; REQ-5004).
5. **Graceful degradation.** Deleting `dashboard/` leaves CSV + `/apply` intact;
   missing optional files render empty-states (ARCH-0005).
6. **No fabrication.** Every stat traces to real data; missing → `—`/empty-state
   (ARCH-0007).
7. **Accessibility (WCAG AA)** and **performance** (usable < 2s; 1k-row list)
   (NFR-0014/0015). **i18n-ready** strings (NFR-0006).
8. **Build from the docs, not external code.** `.reference/jobsync` informs look /
   UX / information-architecture only; never a code/copy/brand source (Prime Directive).

## 3. Architecture (from ADR-0006 + the Next.js impl guide)

```
Browser (React, shadcn, dark+gold)
  → Next.js server (127.0.0.1 only)
      ├ lib/data/   read layer   → parse CSV/JSON/md from repo root
      ├ lib/write/  write layer  → ATOMIC tempfile+fsync+rename over the CSV
      ├ lib/domain/ status machine · KPI math · filter state (pure, unit-tested)
      ├ lib/run/    action layer  → spawn allowlisted subprocess, stream stdout
      ├ app/api/file file layer   → serve generated PDFs (path-guarded)
      └ lib/paths.ts single source of repo file paths (../ from dashboard/)
  → Repo files = the one source of truth (shared with the CLI)
```

Full directory layout, reader/writer APIs, theme tokens, a11y and perf budgets
live in
[`implementation-guide-tracking-dashboard-nextjs.md`](../../development/implementation-guide-tracking-dashboard-nextjs.md).

## 4. Decomposition (vertical slices = milestones)

The build is decomposed into **seven sequential sub-projects**, each a working,
testable vertical slice. The plan document orders tasks by these milestones.

| Milestone | Slice | Primary REQs | Independently shippable? |
|-----------|-------|--------------|--------------------------|
| **M0 Foundation** | `dashboard/` scaffold, Tailwind + shadcn, dark+gold tokens, sidebar/header shell, `lib/paths.ts`, `lib/config.ts`, loopback start script | REQ-5000, REQ-5008, REQ-5016(theme) | Yes — empty shell runs on loopback |
| **M1 Read + Applications table** | `lib/data/*` parsers, Applications table (sort/filter/search), detail drawer, PDF preview, empty-states (read-only first) | REQ-5001, 5002, 5005 | Yes — view-only dashboard |
| **M2 Write** | atomic `lib/write/tracker.ts`, status machine, inline status/notes edit, `+ New`, read-only mode, toasts | REQ-5003(strip), 5004, 5006, 5007 | Yes — full view+edit |
| **M3 Dashboard stats** | KPI cards, pipeline funnel, Nivo bar + calendar heatmap + status/fit charts, recent panel | REQ-5003, 5009 | Yes — analytics home |
| **M4 Action layer** | `lib/run/*` allowlist + spawn + stream, Console page, run history, per-row re-run, salary lookup, upskill trigger | REQ-5010, 5011, 5014(lookup), 5015(trigger) | Yes — operate the CLI from browser |
| **M5 Secondary views** | Companies, Profile, Salary, Upskill pages, Settings | REQ-5012, 5013, 5014, 5015, 5016 | Yes — full IA |
| **M6 Polish & gates** | axe a11y pass, 1k-row perf check, README + ARCHITECTURE, graceful-degradation tests, `.gitignore` | NFR-0014/0015, ARCH-0005 | Yes — release gates green |

**The foundational slice (M0–M3)** is a complete, usable view+edit+analytics
dashboard with no subprocess layer — the natural first execution target. M4
introduces the operator/action layer; M5 the remaining IA; M6 the gates.

Per superpowers, each milestone is its own spec→plan→implementation cycle in
principle; this single plan sequences all seven because they share one contract
set (the `lib/` interfaces) and one stack, and later milestones depend on earlier
modules.

## 5. Key contracts (locked here so milestones don't drift)

- **Status machine:** `STATUSES`, `ALLOWED_NEXT`, `MUTED`, `assertTransition` — exact
  values in the impl-guide §5.1 / business-rules §9.
- **KPI math:** floor = 3 data points → `—`; interview rate denominator excludes
  `Draft` (business-rules §9.5).
- **TrackerRow** 14-field interface; `last_updated` defaults to `date` on read
  (in-memory), materialized on first write.
- **Atomic write recipe:** the 8-step sequence in the impl-guide §4.
- **Action allowlist:** fixed command table; `child_process.spawn(..., {shell:false})`
  with an argv array; no shell-string interpolation of user input.
- **Run history:** `dashboard/.runs/*.json`, gitignored, never merged into the CSV.

## 6. Testing strategy (user decision: TDD-core / smoke-UI)

- **Rigorous TDD** (vitest, test-first) for `lib/data` (parsers incl. `last_updated`
  migration, empty/missing files, malformed CSV), `lib/write` (atomic write,
  `.bak`, concurrency, transition rejection), `lib/domain` (status machine, KPI
  floors, filter round-trip), and `lib/run` (allowlist validation, argv shape,
  read-only refusal, missing-binary handling).
- **Smoke/integration** for pages and the action stream (render, key interactions,
  empty-states). Not full TDD per component.
- **Fixtures:** `tracker-empty.csv`, `tracker-small.csv` (every status + a legacy
  row missing `last_updated`), `tracker-1000.csv` (perf). The live CSV has 0 rows,
  so fixtures are required for meaningful tests/preview.
- **Gates (M6):** `@axe-core/cli` zero violations on primary routes; 1k-row perf
  budgets; a no-network assertion; a "delete `dashboard/` leaves CSV + `/apply`
  intact" check.

## 7. Decisions & rationale

- **Next.js + file-as-DB** over HTMX/Hono (ADR-0006): the operator vision needs a
  component system, real charts, theming, and streaming; the heavier stack is the
  accepted trade.
- **Nivo** for charts (ADR-0006): `@nivo/calendar` gives the signature heatmap;
  bundled, no remote assets.
- **npm** (not bun): bun is absent on the target machine; Node 25 + npm are present.
- **shadcn components owned in-repo:** no runtime CDN/component dependency.
- **No auth:** loopback + single-user makes NextAuth dead weight and a privacy
  liability — removed entirely.

## 8. Out of scope (v1)

Auth/multi-user/LAN bind; a persistent daemon; any database; profile editing /
`/setup` from the UI (read-only profile in v1); mobile-first design (desktop-first,
responsive is a bonus).

## 9. Spec self-review

- **Placeholders:** none — every contract resolves to the impl-guide or business-rules.
- **Consistency:** decomposition REQ mapping matches the requirements doc
  (REQ-5000–5016); KPI denominator matches business-rules §9.5; stack matches ADR-0006.
- **Scope:** seven independently-shippable slices; the user's "docs + plan only"
  decision means this cycle ends at the plan — no scaffolding yet.
- **Open risk:** the live CSV is empty, so all M1–M3 visual work is validated
  against fixtures until the user runs `/apply`; flagged in M1.
