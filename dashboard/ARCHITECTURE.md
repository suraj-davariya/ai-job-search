# CareerForge Dashboard — Architecture

> Companion to [`README.md`](./README.md). Why the dashboard is built the way it
> is. Implements ADR-0006 (Next.js + file-as-DB) and REQ-5000–5016.

## Shape

Next.js (App Router, TypeScript strict) on `127.0.0.1`. A **pure, unit-tested
`lib/` core** (parsers, atomic CSV writer, status machine, KPI/aggregate math,
command allowlist, path guard) sits under Server Components, Server Actions, and
Route Handlers. **No database** — the user's existing files are the source of
truth (file-as-DB). Every request re-reads from disk; there is no long-lived
cache (CSV ≤ 1k rows).

```
app/(shell)/*           Server Components — read files, render views
app/actions/*           Server Actions — validated writes (tracker, settings)
app/api/run/[command]   Route Handler — SSE stream of an allowlisted subprocess
app/api/runs            Route Handler — run history (GET) + stop (POST)
app/api/file            Route Handler — path-guarded PDF serving
lib/data/*              READ layer — typed, empty-tolerant parsers
lib/write/*             WRITE layer — atomic tracker writer
lib/domain/*            PURE core — status machine, csv, filter, kpi, aggregate, companies
lib/run/*               ACTION layer — allowlist, spawn, history, PATH probe
components/*            shell · applications · dashboard · console · salary · settings · ui
```

## The three layers

### Read (`lib/data/*`)
Typed parsers over the repo files: tracker CSV (papaparse, 14-column contract),
seen-jobs/salary JSON, per-application docs, upskill reports, profile skill
files. Every reader tolerates a missing/empty/malformed file with a graceful
empty result (`[]` / `null` / `{}`) — never a page-crashing throw (ARCH-0005).
`last_updated` is back-filled from `date` in memory for legacy rows and
materialized to disk only on first write.

### Write (`lib/write/tracker.ts`)
The only mutator of product data, and the highest-risk module — so it is
test-first. Each write follows an 8-step crash-safe recipe: read → guard
(`assertTransition`) → mutate in memory → serialize → write `.tmp.<pid>` +
`fsync` → copy current file to `.bak` → atomic `rename`. A per-file in-process
mutex serializes concurrent callers; cross-process safety comes from the atomic
rename (NFR-0016). Server Actions (`app/actions/*`) are the validated boundary:
read-only refusal → zod validation → `lib/write` → `revalidatePath`.

### Action (`lib/run/*`)
Drives the CLI from the browser, the other high-risk surface. `allowlist.ts` is
a **fixed command table**; each entry validates inputs and returns an argv
`{bin, args[]}`. `spawn.ts` runs it with `shell:false`, streams stdout/stderr,
and resolves the real exit code; a per-command-type lock prevents concurrent
duplicates and `stop()` sends SIGTERM. `history.ts` records one JSON file per
run under `.runs/`. The route layers guard in order: allowlist → read-only →
arg validation → lock → spawn, then stream Server-Sent Events.

## File contracts (shared with the CLI)

`lib/paths.ts` is the single source of every path. The dashboard **owns none**
of the product data — these are a shared contract with the CLI:

| File | Layer | Access |
|------|-------|--------|
| `job_search_tracker.csv` | tracker | read + atomic write |
| `salary_data.json`, `job_scraper/seen_jobs.json` | search/salary | read-only |
| `documents/applications/<company>_<role>/*.md` | per-app docs | read-only |
| `cv/output/*.pdf`, `cover_letters/output/*.pdf` | generated PDFs | read-only, path-guarded serve |
| `upskill/report-*.md`, profile skill files, `CLAUDE.md` | reports/profile | read-only |
| `.runs/`, `.dashboard.local.json` | dashboard-local | read/write (gitignored) |

Only the last row lives under `dashboard/`. Everything else is at the repo root,
which is what makes the **delete-to-remove** guarantee hold.

## Why these choices

- **File-as-DB, no Prisma/SQLite.** The data is small (≤ 1k rows), human-
  readable, git-tracked, and already the CLI's source of truth. A database would
  duplicate state and break the "delete the dashboard, keep your data" property.
  Cost: we re-read per request — measured cheap (see below).
- **Loopback, no auth.** Single-user, local, deeply personal data (REQ-5008 /
  NFR-0017). Binding `127.0.0.1` with no LAN flag removes the entire auth/
  network-exposure surface instead of mitigating it. Asserted at startup.
- **Allowlist + `shell:false`, not string commands.** The action layer's only
  job is to *not* enable arbitrary execution. A fixed table + argv arrays make
  shell injection structurally impossible, not merely escaped.
- **Pure `lib/` core.** Parsers/writer/state-machine/math/allowlist have no
  Next.js dependency, so the risky logic is unit-tested in isolation; pages are
  smoke-tested.

## Performance baseline (NFR-0014)

Measured against the 1,000-row fixture by `test/perf/perf.test.ts`
(`npm run test`). CPU/IO proxies (not browser FCP, which needs a live browser we
don't run offline), but they bound every server-side hot path.

| Operation | Measured | Budget | Notes |
|-----------|----------|--------|-------|
| `readTracker` parse (1k) | ~12 ms | — | papaparse, per request |
| `applyFilter` (1k, avg) | ~0.4 ms | — | in-memory, every keystroke |
| KPIs + all chart aggregates (1k) | ~51 ms | — | analytics home, per request |
| `DataTable` SSR render (1k) | ~790 ms | < 2 s | `renderToString` proxy; real paint is faster |
| Inline save round-trip (1k) | ~42 ms | **< 250 ms** | read → mutate → fsync → `.bak` → atomic rename |

The save round-trip clears the 250 ms NFR bound including fsync; all data ops
are < 100 ms, so the re-read-per-request model holds at the 1k cap with margin.
**Table virtualization is not required** at the supported scale; revisit with
`@tanstack/react-virtual` only if the row cap is raised. The perf test asserts
the hard bounds (parse < 500 ms, save < 250 ms) so a regression fails CI.

## Deviations from the plan

The build is faithful to `docs/superpowers/plans/2026-06-10-careerforge-dashboard.md`;
notable, deliberate departures:

- **Offline, hand-rolled UI.** shadcn/ui CLI, Radix, and `@nivo/pie` were not
  installable (no network), so dialogs/drawer/toast and the status donut are
  hand-built with the same Tailwind tokens; `@hookform/resolvers` is replaced by
  a small inline zod resolver. Behavior matches the spec.
- **Accessibility gate runs in jsdom.** `@axe-core/cli` + chromedriver aren't
  available offline, so the WCAG audit runs `axe-core` programmatically over the
  rendered surfaces (`test/a11y/`, `npm run a11y`) instead of against a live
  server. color-contrast is verified manually against the token ramps.
- **Markdown as preformatted text.** No markdown renderer is bundled, so profile
  and upskill reports render as wrapped preformatted text rather than styled
  HTML.
- **Recent-activity + re-run links** point at `/applications?q=…` and
  `/console?command=apply&url=…`; the detail drawer is state-driven, not
  URL-addressable (a small future enhancement).
