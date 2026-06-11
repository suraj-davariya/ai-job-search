# ADR-0006: Dashboard Stack — Next.js over File-as-DB

> **Status:** Accepted
> **Date:** 2026-06-10
> **Decision makers:** Architecture team, Product owner
> **Supersedes:** ADR-0005 (stack choice only — see "Scope of supersession")
> **Related:** REQ-5000–REQ-5008 (functional-requirements-tracking-dashboard.md), ADR-0001 (file-based data), ADR-0004 (pluggable adapters), ADR-0005 (prior dashboard stack)

---

## Context

ADR-0005 chose **Bun + Hono + server-rendered HTML + HTMX + Pico.css** for the
tracking dashboard, optimizing for minimum dependencies over the append-only
`job_search_tracker.csv`. That decision scoped the dashboard as a thin,
read-mostly visual surface (REQ-5001–5008): list, filter, inline status/notes
edit, KPI strip.

Since then the product owner has set a larger vision: **the dashboard should
become a full alternative to the Claude Code CLI** — a place where a user not
only *sees* every stat about their search (applications, companies, pipeline,
fit trends, salary benchmarks, skill-gap reports, profile) but also *drives the
whole framework* from the browser: trigger `/apply`, `/search`, `/upskill`,
`/expand`, and `salary_lookup.py`, with live streamed output. The visual target
is a modern, dark, orange-gold dashboard with rich charts, modeled on the look
and information architecture of JobSync (`.reference/jobsync` — studied as
inspiration only, never copied, per the `CLAUDE.md` Prime Directive).

HTMX + Pico.css cannot comfortably reach that target. The richer surface needs:
a component system (cards, drawers, data tables, dialogs), a real charting
library (bar, calendar-heatmap, donut, histogram), a theming system for a
cohesive dark + orange-gold palette, and a streaming action/console subsystem.
Pushing HTMX/Pico to do all of that would re-invent a component framework by
hand and still fall short of the intended polish.

This ADR re-opens **only the stack question** from ADR-0005. Every other
constraint ADR-0005 established remains in force.

The decisive new requirement: **the dashboard is becoming the primary operator
surface, not an optional viewer.** Optimizing purely for minimum dependencies
(ADR-0005's frame) is no longer the right objective function; the right one is
"richest local operator UI that still honors file-as-DB, local-only, and
graceful degradation."

## Decision

Adopt **Next.js (App Router) + React + TypeScript + shadcn/ui + Tailwind CSS +
Nivo charts + next-themes**, reading and writing the project's existing
**CSV/JSON/markdown files as the single source of truth** (file-as-DB, per
ADR-0001). No database, no ORM, no authentication.

| Layer | Choice | Constraint |
|-------|--------|-----------|
| Framework | Next.js (App Router), latest stable | Server Components, Server Actions, Route Handlers |
| Language | TypeScript (strict) | |
| UI | shadcn/ui on Radix (components generated locally, owned in-repo) | No external component CDN |
| Styling | Tailwind CSS with CSS variables | Dark default; orange-gold accent tokens |
| Theme | next-themes | Dark is default; light optional |
| Charts | Nivo (`@nivo/bar`, `@nivo/calendar`, `@nivo/core`) | Bundled; no remote chart assets |
| Data — read | Typed parsers over CSV/JSON/md (papaparse + own parsers) | Re-read per request; no DB |
| Data — write | Own atomic writer (tempfile → fsync → `.bak` → rename) | CSV `status`/`notes`/`last_updated` + append only |
| Actions | Route Handler spawns an allowlisted subprocess (`claude -p`, `python3`), streams stdout | Fixed command allowlist; loopback only |
| Location | Self-contained, removable `dashboard/` directory at repo root | Deleting it leaves CSV + `/apply` intact |

## Scope of supersession

This ADR supersedes ADR-0005 **on the technology stack only**. The following
ADR-0005 / REQ-5xxx / NFR constraints are **retained verbatim and remain
binding**:

- **Loopback-only bind** — `127.0.0.1`/`::1` only; never `0.0.0.0`; no LAN flag in v1 (REQ-5008, NFR-0017).
- **Zero telemetry, zero unsolicited network** — all assets bundled; the only outbound calls are the subprocess runs the user explicitly triggers (REQ-5008).
- **Atomic CSV writes** — read → mutate target row → tempfile → fsync → `.bak` → rename; safe against concurrent `/apply` appends (NFR-0016).
- **Status state machine** — canonical enum + allowed transitions enforced server-side (REQ-5004, business-rules §9).
- **Graceful degradation** — removing the dashboard leaves the CSV and `/apply` untouched (ARCH-0005); missing optional files degrade to empty-states.
- **No fabrication** — every stat traces to real data; missing data renders `—` (ARCH-0007).
- **Accessibility & performance** — WCAG 2.1 AA (NFR-0015); fast start and 1k-row render (NFR-0014).
- **Single user, local, no auth** — loopback means no auth surface; JobSync's NextAuth concept is explicitly dropped.

## Rationale

| Factor | Next.js + file-as-DB (this ADR) | HTMX + Pico (ADR-0005) |
|--------|----------------------------------|------------------------|
| Rich charts (bar, calendar-heatmap, donut) | ✅ Nivo | ❌ hand-rolled SVG |
| Component system (tables, drawers, dialogs) | ✅ shadcn/Radix | ⚠️ build by hand |
| Cohesive dark + orange-gold theme | ✅ CSS-variable tokens | ⚠️ Pico overrides fight defaults |
| Streaming action/console (replace the CLI) | ✅ Route Handler + SSE/stream | ⚠️ awkward in HTMX |
| File-as-DB (no DB) | ✅ retained | ✅ |
| Local-only, zero telemetry | ✅ retained | ✅ |
| Minimum dependencies | ❌ heavier dep tree | ✅ ~3 deps |
| No build step | ❌ Next build | ✅ Bun runs TS directly |
| Reuses an existing runtime | ⚠️ Node/Next toolchain (new) | ✅ Bun already present |

We consciously trade ADR-0005's headline advantages — minimum dependencies and
no build step — for the component, charting, theming, and streaming capabilities
that the "replace-the-CLI" vision requires. That trade is acceptable precisely
because the objective changed: the dashboard is now a primary operator surface,
not an optional viewer.

## Why file-as-DB, not JobSync's Prisma/SQLite

JobSync persists to SQLite via Prisma and authenticates with NextAuth. Both are
**rejected**:

- **ADR-0001 mandates file-as-DB.** The CSV/JSON/markdown files are the source of
  truth, git-tracked and human-readable. A database would create a CSV-vs-DB sync
  problem and break the contract that the CLI and dashboard read/write the *same*
  files.
- **A DB breaks the shared-source-of-truth invariant.** `/apply` appends to the
  CSV; the dashboard must see that row by simply re-reading the file. Introducing
  a DB would force a sync layer and a second source of truth.
- **No auth surface exists.** Loopback-only, single-user, single-machine means
  NextAuth is dead weight and a privacy liability. It is removed entirely.

The dashboard may keep small **dashboard-local** state (e.g. a run history under
`dashboard/.runs/`, gitignored) — this is UI bookkeeping, never product data, and
must never be mixed into the tracker CSV.

## Architecture

```
dashboard/                         # self-contained, removable Next.js app
├── app/
│   ├── (shell)/                   # sidebar + header layout
│   │   ├── page.tsx               # Dashboard (KPIs, charts, recent)
│   │   ├── applications/          # tracker table, filters, drawer, +New
│   │   ├── companies/  profile/  salary/  upskill/  console/  settings/
│   ├── api/
│   │   ├── run/[command]/route.ts # spawn allowlisted subprocess, stream stdout
│   │   └── file/route.ts          # serve generated PDFs for preview
├── lib/
│   ├── paths.ts                   # single source for repo file paths (../ from dashboard/)
│   ├── data/                      # typed readers: tracker, seen-jobs, salary, applications, upskill, profile
│   └── write/                     # atomic CSV writer + state-machine guard
├── components/ui/                 # shadcn (owned in-repo)
└── README.md / ARCHITECTURE.md
```

**Concurrency model (unchanged from ADR-0005):** the server holds no long-lived
tracker state; every request re-reads the CSV (≤1k rows). Writes go through the
atomic writer. A concurrent `/apply` appender sees either the pre-rename or
post-rename file, never a partial one.

**Action model (new):** `app/api/run/[command]` spawns one of a **fixed
allowlist** of commands (`claude -p "/apply …"`, `/search`, `/upskill`,
`/expand`, `/setup`; `python3 salary_lookup.py`; `python3
tools/convert_salary_excel.py`) with the repo root as `cwd`, validated/escaped
arguments, no shell string interpolation of user input, and stdout/stderr
streamed to the browser. One run per command type at a time; a global stop
control; real exit codes surfaced (no fake success).

## Consequences

- **Positive:**
  - Reaches the intended visual quality (dark + orange-gold, rich charts) and the
    "operate the framework from the browser" vision.
  - Keeps file-as-DB: CLI and dashboard share one source of truth; no sync layer.
  - shadcn components are owned in-repo (no runtime CDN, no external component dep).
  - Still fully removable (`dashboard/`) and still loopback-only / zero-telemetry.
- **Negative:**
  - Heavier dependency tree and a Next.js build step (ADR-0005 had neither).
  - Adds a Node/Next toolchain alongside Bun — a second front-end runtime to learn.
  - React/Next contributors needed; larger surface to maintain.
- **Risks & mitigations:**
  - *Risk:* dependency churn / supply-chain surface grows → *Mitigation:* lockfile,
    pin majors, vendor shadcn components, audit before bumps.
  - *Risk:* subprocess action layer becomes an arbitrary-exec hole → *Mitigation:*
    fixed command allowlist, argument validation, no shell interpolation, loopback-only.
  - *Risk:* `claude`/`python3`/LaTeX absent on PATH → *Mitigation:* graceful
    degradation — view/edit work; action buttons disable with an explanatory tooltip.
  - *Risk:* code/doc drift as scope grows → *Mitigation:* extend REQ-5xxx with the
    new action/console and secondary-view requirements before building them.

## Out of Scope for this ADR

- **Auth, multi-user, LAN bind.** Still hard-excluded (loopback only).
- **Persistent daemon.** Lifecycle is foreground-only (REQ-5000).
- **A database of any kind.** File-as-DB stands (ADR-0001).
- **Detailed action/console requirements.** This ADR records the stack and the
  action *model*; the per-command requirements get REQ IDs in
  functional-requirements-tracking-dashboard.md before implementation.
- **Mobile-first design.** Desktop-first; responsive is a bonus.
