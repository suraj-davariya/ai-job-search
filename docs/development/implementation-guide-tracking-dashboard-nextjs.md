# Development — Implementation Guide: Tracking Dashboard (Next.js)

> **Purpose:** The active implementation guide for the local CareerForge dashboard
> on the Next.js + file-as-DB stack adopted in ADR-0006. It defines the directory
> layout, file-path contract, typed read layer, atomic write layer, domain logic
> (status machine + KPI math), the operator action layer, theming, accessibility,
> and performance discipline.
>
> **Status:** Active
> **Last updated:** 2026-06-10
> **Owner persona:** Staff Engineer
> **Implements:** REQ-5000–REQ-5016 · NFR-0006 · NFR-0014–NFR-0017 · ADR-0006
> **Supersedes:** [`implementation-guide-tracking-dashboard.md`](./implementation-guide-tracking-dashboard.md) (HTMX) — on layout/server/routes only; that guide's atomic-write recipe, status enum, KPI math, a11y checklist and perf budgets are carried in here.

---

## 1. Directory Layout

The entire app lives in a self-contained, removable `dashboard/` at the repo root.
**Deleting `dashboard/` must leave the CSV and the `/apply` pipeline completely
intact** (ARCH-0005). No file outside `dashboard/` is owned by the dashboard
except the shared data files it reads/writes, which it treats as a contract.

```
dashboard/
├── package.json                 # own deps; npm (bun absent on target machine)
├── package-lock.json
├── next.config.mjs              # output: standalone; no remote images
├── tsconfig.json                # strict: true
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json              # shadcn config (components owned in-repo)
├── .gitignore                   # .next/, .runs/, node_modules/, *.local
├── README.md                    # start command, prereqs, security model, delete-to-remove
├── ARCHITECTURE.md              # read/write/action layers, file contracts, why file-as-DB
├── scripts/
│   └── start.mjs                # loopback bind (127.0.0.1), port discovery, print URL, open
├── app/
│   ├── layout.tsx               # <html>, next-themes provider, fonts (self-hosted), Toaster
│   ├── globals.css              # dark + orange-gold CSS-variable tokens (§7)
│   ├── (shell)/
│   │   ├── layout.tsx           # sidebar + header shell
│   │   ├── page.tsx             # Dashboard — KPIs, charts, recent (REQ-5009)
│   │   ├── applications/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── salary/page.tsx
│   │   ├── upskill/page.tsx
│   │   ├── console/page.tsx
│   │   └── settings/page.tsx
│   ├── actions/                 # "use server" Server Actions for CSV mutations
│   │   └── tracker.ts           # updateRow(), appendRow() — call lib/write
│   └── api/
│       ├── run/[command]/route.ts   # spawn allowlisted subprocess, stream stdout (REQ-5010/5011)
│       ├── runs/route.ts            # GET run history; POST stop (REQ-5011)
│       └── file/route.ts            # serve generated PDFs for preview (path-guarded)
├── lib/
│   ├── paths.ts                 # single source of repo file paths (resolve ../ from dashboard/)
│   ├── config.ts                # repo path, port, read-only — env + settings file
│   ├── data/                    # READ layer (typed parsers) — §3
│   │   ├── tracker.ts           # readTracker()
│   │   ├── seen-jobs.ts         # readSeenJobs()
│   │   ├── salary.ts            # readSalary()
│   │   ├── applications.ts      # readApplicationDir()
│   │   ├── upskill.ts           # readUpskillReports()
│   │   └── profile.ts           # readProfile()
│   ├── write/                   # WRITE layer — §4
│   │   └── tracker.ts           # atomic writeTracker(): update + append
│   ├── domain/
│   │   ├── status.ts            # enum + ALLOWED_NEXT + MUTED (business-rules §9)
│   │   ├── kpi.ts               # pipeline counts + KPI floors (business-rules §9.5)
│   │   ├── filter.ts            # query-string ↔ filter state (pure)
│   │   └── csv.ts               # serialize/parse helpers shared by read+write
│   └── run/                     # ACTION layer — §6
│       ├── allowlist.ts         # fixed command table + arg validators
│       ├── spawn.ts             # child_process.spawn (argv array, no shell), streaming
│       └── history.ts           # dashboard/.runs/*.json bookkeeping
├── components/
│   ├── ui/                      # shadcn primitives (owned in-repo)
│   ├── shell/                   # Sidebar, Header
│   ├── applications/            # DataTable, FilterBar, RowDrawer, NewDialog, StatusSelect
│   ├── dashboard/               # KpiCard, PipelineStrip, charts (Nivo wrappers)
│   └── console/                 # RunLog, RunList
└── test/
    ├── fixtures/
    │   ├── tracker-empty.csv
    │   ├── tracker-small.csv    # ~12 rows, covers every status + legacy missing last_updated
    │   └── tracker-1000.csv     # perf fixture (NFR-0014)
    └── lib/                     # vitest unit tests for data/write/domain/run
```

**Why these boundaries:** each `lib/` module has one responsibility and a typed
interface, so it can be unit-tested without Next.js. The risk concentrates in
`lib/write` (atomicity), `lib/domain/status` (the state machine), `lib/domain/kpi`
(honest math), and `lib/run/allowlist` (no arbitrary exec) — those get rigorous
TDD; pages are smoke-tested.

---

## 2. Server Lifecycle & Loopback (REQ-5000, REQ-5008)

`scripts/start.mjs` wraps `next start`:

```
1. Parse flags: --port (default 4480), --read-only, --no-open, --repo <path>
2. Resolve repo root (default: dashboard/.. ), assert the tracker CSV path is reachable
3. Find a free port from the default, incrementing on EADDRINUSE
4. Start Next bound to HOSTNAME=127.0.0.1 ONLY (never 0.0.0.0) — pass -H 127.0.0.1
5. Assert the bound address is loopback; refuse to continue otherwise
6. Print  http://localhost:<port>/  in copy-friendly form
7. Unless --no-open, open the URL in the default browser
8. SIGINT/SIGTERM → close child, exit 0 (no daemon)
```

**Hard rules (retained from ADR-0005 via ADR-0006):**
- **Loopback only.** Bind `127.0.0.1`; there is no LAN flag in v1. Enforce by
  passing `-H 127.0.0.1` and asserting at startup.
- **No background daemon.** Server lives only while the foreground process lives.
- **Single instance per workspace.** A second launch replaces the running instance
  (PID lock under `dashboard/.runs/port.lock`), never duplicates it.
- **Next config:** `images: { remotePatterns: [] }`, no analytics, self-host any
  font (no Google Fonts network fetch) — REQ-5008 / NFR-0017.

---

## 3. Read Layer (`lib/data/*`)

Every request re-reads from disk; no long-lived cache in v1 (CSV ≤ 1k rows per
NFR bounds). All readers tolerate missing/empty files with graceful empty results,
never a throw that crashes the page (ARCH-0005).

```ts
// lib/domain/status.ts re-exported type
export interface TrackerRow {
  date: string;            // YYYY-MM-DD
  company: string;
  sector: string;
  role: string;
  role_type: string;
  channel: string;
  status: Status;          // validated against STATUSES; unknown → kept as-is + flagged
  contact_person: string;
  fit_rating: number;      // 0..100; non-numeric → 0 with a parse flag
  notes: string;
  cv_file: string;
  cover_letter_file: string;
  source: string;
  last_updated: string;    // ISO date; defaults to `date` for legacy rows (on read, in-memory only)
}

export async function readTracker(path?: string): Promise<TrackerRow[]>;
```

**Reader rules:**
- Use `papaparse` with `header: true`. The 14 columns are exact (see
  data-architecture §11): `date, company, sector, role, role_type, channel, status,
  contact_person, fit_rating, notes, cv_file, cover_letter_file, source,
  last_updated`.
- **`last_updated` migration:** if blank, fill in-memory with the row's `date`. The
  column is materialized to disk **only on first dashboard write** — never on read.
- **Encoding:** UTF-8 only; detect a BOM or non-UTF-8 bytes and surface a clear
  error (read-only banner), do not silently mangle.
- Missing file → `[]` (drives the REQ-5001 empty-state). Malformed (wrong column
  count) → boot in read-only mode with a banner pointing to the `.bak`.

Other readers (all return typed, empty-tolerant results):
- `readSeenJobs()` → `{ seen: string[] }` shape is `{ "seen": [...] }`; tolerate
  `[]`/missing.
- `readSalary()` → parsed `salary_data.json`; **file is optional/gitignored** →
  `null` → empty-state.
- `readApplicationDir(company, role)` → parsed `job_posting.md` + `outcome.md` from
  `documents/applications/<company>_<role>/`; missing dir → `null`.
- `readUpskillReports()` → list of `{ name, mtime, markdown }` from `upskill/report-*.md`.
- `readProfile()` → sections assembled from
  `.claude/skills/job-application-assistant/0{1..7}-*.md` + root `CLAUDE.md`;
  missing files → omitted sections.

---

## 4. Write Layer (`lib/write/tracker.ts`) — atomic, state-machine-guarded

Carried verbatim from the HTMX guide §3.2, on Node `fs/promises`:

```
1. Read the entire CSV into memory (small file).
2. For an UPDATE: locate the target row (stable id = original 0-based index, or a
   composite key of date+company+role); mutate ONLY status / notes / last_updated.
   Enforce the status transition (§5) BEFORE mutating — reject illegal moves.
   For an APPEND (REQ-5006): push a new row with empty cv/cover-letter fields.
3. Serialize the full table back to CSV (papaparse unparse; stable column order).
4. Write to a sibling tempfile:  .job_search_tracker.csv.tmp.<pid>
5. fsync the tempfile.
6. Copy the current CSV to  .job_search_tracker.csv.bak  (overwrite prior .bak).
7. rename(tempfile → original)   // atomic on POSIX
8. Stamp last_updated = now (ISO) on the mutated/appended row.
```

**Concurrency contract (NFR-0016):** a concurrent `/apply` appender sees either the
pre-rename or post-rename file — never a partial. The dashboard's only write
surfaces are inline edit and `+ New`; both go through this one routine.

**Transition enforcement:** the Server Action / route calls
`assertTransition(from, to)` from `lib/domain/status.ts` and returns a typed error
(surfaced as a toast + UI revert) on an illegal move — never a silent coercion
(REQ-5004).

**Read-only mode (REQ-5007):** when enabled, `app/actions/tracker.ts` refuses all
mutations up front and the UI renders controls `disabled` with a banner.

---

## 5. Domain Logic (`lib/domain/*`) — canonical, stack-agnostic

### 5.1 Status machine (`status.ts`) — from business-rules §9

```ts
export const STATUSES = [
  "Draft", "Sent", "Interview", "Offer",
  "Rejected", "Withdrawn", "Closed",
] as const;
export type Status = typeof STATUSES[number];

export const ALLOWED_NEXT: Record<Status, Status[]> = {
  Draft:     ["Sent", "Withdrawn"],
  Sent:      ["Interview", "Rejected", "Withdrawn", "Closed"],
  Interview: ["Offer", "Rejected", "Withdrawn", "Closed"],
  Offer:     [],
  Rejected:  [],
  Withdrawn: [],
  Closed:    [],
};

export const MUTED: ReadonlySet<Status> = new Set(["Rejected", "Withdrawn", "Closed"]);

// The dropdown shows the current state + its ALLOWED_NEXT. assertTransition allows
// a no-op (to === from) and any to ∈ ALLOWED_NEXT[from]; everything else throws.
export function assertTransition(from: Status, to: Status): void;
```

### 5.2 KPI math (`kpi.ts`) — from business-rules §9.5

```ts
// Buckets respect the active filter (the visible slice). Floor = 3 data points.
export interface Kpi {
  total: number;
  byStatus: Record<Status, number>;
  avgFit30: number | null;       // null (→ "—") when window has < 3 rows
  interviewRate90: number | null;
}
// interview rate = count(Interview) / count(Sent+Interview+Offer+Rejected+Withdrawn+Closed)
//   over the 90-day window; null when the denominator has < 3 rows.
export function kpis(rows: TrackerRow[]): Kpi;
```

`—` rendering when the floor is unmet is a hard rule (REQ-5003 / REQ-5009 /
ARCH-0007). Never substitute 0 or a guess for missing data.

### 5.3 Filter state (`filter.ts`)

Pure parse/serialize between the URL query and a `FilterState`:
`q` (free text over company/role/notes), `status` (multi), `fit_min`, `fit_max`,
`role_type`, `channel`, `from`, `to`. Same functions run server-side (SSR) and
client-side (URL ↔ controls). Filter state lives in the URL (REQ-5002).

---

## 6. Action Layer (`lib/run/*`, `app/api/run/*`) — REQ-5010/5011

The headline operator feature. **Security is the whole point of this section.**

### 6.1 Fixed allowlist (`allowlist.ts`)

```ts
// No free-form commands. Each entry maps a logical command to argv + a validator.
type RunCommand =
  | "apply" | "search" | "upskill" | "expand" | "setup"
  | "salary-lookup" | "salary-import";

interface CommandSpec {
  bin: "claude" | "python3";
  // build returns a STRING ARRAY (argv); user input never enters a shell string.
  build(args: Record<string, string>): string[];
  validate(args: Record<string, string>): void; // throws on anything unexpected
}
```

- `apply` → `["claude","-p", "/apply " + url + " --review=" + mode]` where `url` is
  validated as a URL or treated as opaque pasted text passed as a single argv slot,
  and `mode ∈ {none, quick, full}`.
- `search`/`upskill`/`expand`/`setup` → `["claude","-p","/<command> <validated args>"]`.
- `salary-lookup` → `["python3","salary_lookup.py", company, "--json", ...city?]`.
- `salary-import` → `["python3","tools/convert_salary_excel.py", file, ...]`.

### 6.2 Spawn & stream (`spawn.ts`, `app/api/run/[command]/route.ts`)

- `child_process.spawn(bin, argv, { cwd: repoRoot, shell: false })`. **`shell:false`
  is mandatory** — it is the guarantee against shell-injection.
- Stream stdout/stderr to the browser as Server-Sent Events or a streamed
  `ReadableStream` `Response`. The Console renders a live terminal log.
- **Concurrency:** a per-command-type in-memory lock; reject a duplicate run with a
  clear 409-style message; expose a global stop that sends SIGTERM.
- **Honesty (ARCH-0005/0007):** surface the real exit code and stderr. If `bin` is
  not on PATH, return a clear setup message; do not fake success.
- **Read-only mode:** the route refuses to spawn.

### 6.3 Run history (`history.ts`)

Append a small JSON record per run to `dashboard/.runs/<id>.json` (gitignored):
`{ id, command, args, startedAt, endedAt, exitCode, status }`. This is UI
bookkeeping — **never** merged into the tracker CSV. `/apply` writes its own
`Draft` row; the Applications view picks it up by re-reading (REQ-5011).

### 6.4 PDF preview (`app/api/file/route.ts`)

Serve generated PDFs (`cv/output/*.pdf`, `cover_letters/output/*.pdf`,
`cv/main_<company>.pdf`) for in-browser preview. **Path-guard:** resolve the
requested path and reject anything outside the allowlisted output directories
(no `..` traversal). Missing file → 404 → "file not found" badge in the drawer.

---

## 7. Theme — dark + orange-gold (`globals.css`)

shadcn CSS-variable tokens; default theme **dark**; orange→gold is the single
accent. Tune every pair for WCAG AA contrast (NFR-0015). Status colors are
semantic but **must pair with a label + icon — never color alone**.

```css
.dark {
  --background: 24 10% 6%;   --card: 24 9% 9%;   --popover: 24 9% 9%;
  --foreground: 40 20% 92%;  --muted: 24 8% 16%; --muted-foreground: 36 10% 62%;
  --border: 30 10% 18%;      --input: 30 10% 18%;
  --primary: 33 96% 52%;     --primary-foreground: 24 30% 8%;   /* ORANGE */
  --accent: 43 96% 56%;      --accent-foreground: 24 30% 8%;    /* GOLD   */
  --ring: 33 96% 52%;        --destructive: 0 72% 51%;
  --chart-1: 33 96% 52%; --chart-2: 43 96% 56%; --chart-3: 27 90% 48%;
  --chart-4: 48 90% 60%; --chart-5: 190 60% 50%;
}
```

---

## 8. Accessibility (NFR-0015)

Treat every route as an axe gate (carried from the HTMX guide §6):
- **Landmarks:** `<header>`, `<nav>`, `<main>`, `<aside>` (drawer); one `<h1>`/page.
- **Labels:** every control has a `<label>` (visually-hidden allowed, not `aria-label` alone).
- **Focus:** drawer open → focus close; close → restore to the opening row; `inert`
  on `<main>` while the drawer is open.
- **Keyboard:** Tab reaches all actions; Enter/Space activate; Esc closes drawer.
- **Color independence:** status pills carry a label + icon; KPI deltas use `▲`/`▼`.
- **Charts:** every chart has an accessible table/text equivalent.
- **Live region:** toasts are `aria-live="polite"`.
- **CI gate:** `@axe-core/cli` against the primary routes must report zero violations.

---

## 9. Performance (NFR-0014)

| Target | Technique |
|--------|-----------|
| Usable < 2s start | Self-host fonts; no top-level network; `output: standalone`. |
| List fast at 1k rows | Server Components render the table; `@tanstack/react-table` for client sort/filter; virtualize if needed. |
| Inline save feels instant | Server Action + atomic write is O(rows ≤ 1k); optimistic UI + toast. |
| Memory bounded | One parsed CSV per request; no long-lived cache in v1. |

Benchmark fixture: `test/fixtures/tracker-1000.csv` under these budgets
(test-plan TC-DBD-140+).

---

## 10. Failure Modes (carried from HTMX guide §8)

| Failure | Response |
|---------|----------|
| CSV missing | Empty-state guidance (REQ-5001); `+ New` still works. |
| CSV malformed | Boot read-only with a banner pointing to `.bak`. |
| Concurrent `/apply` write | Atomic rename → no corruption (NFR-0016); re-read shows both changes. |
| Port in use | Auto-increment; print the new URL. |
| File-link target missing | "file not found" badge; row stays editable. |
| Disallowed transition | Typed error → toast → revert. |
| `claude`/`python3`/LaTeX absent | Action buttons disabled with a tooltip; view/edit still works (ARCH-0005). |

---

## 11. Cross-References

- Requirements: [`../requirements/functional-requirements-tracking-dashboard.md`](../requirements/functional-requirements-tracking-dashboard.md) (REQ-5000–5016), [`../requirements/business-rules-and-validation.md`](../requirements/business-rules-and-validation.md) §9, [`../requirements/data-requirements.md`](../requirements/data-requirements.md) §11, NFR-0006/0014–0017
- Architecture: [`../architecture/adr-0006-dashboard-nextjs-file-as-db.md`](../architecture/adr-0006-dashboard-nextjs-file-as-db.md), [`../architecture/data-architecture.md`](../architecture/data-architecture.md)
- Superseded: [`implementation-guide-tracking-dashboard.md`](./implementation-guide-tracking-dashboard.md) (HTMX)
- Plan: [`../superpowers/plans/2026-06-10-careerforge-dashboard.md`](../superpowers/plans/2026-06-10-careerforge-dashboard.md)
- Spec: [`../superpowers/specs/2026-06-10-careerforge-dashboard-design.md`](../superpowers/specs/2026-06-10-careerforge-dashboard-design.md)
- Testing: [`../testing/test-plan-tracking-dashboard.md`](../testing/test-plan-tracking-dashboard.md)
