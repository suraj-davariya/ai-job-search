# Development — Implementation Guide: Tracking Dashboard (HTMX — SUPERSEDED)

> ⚠️ **SUPERSEDED (2026-06-10).** The dashboard stack moved to Next.js + file-as-DB
> in **ADR-0006**. This HTMX/Hono/Pico guide is retained for history. The active
> guide is
> [`implementation-guide-tracking-dashboard-nextjs.md`](./implementation-guide-tracking-dashboard-nextjs.md).
>
> **Still authoritative below (stack-agnostic, carried into the Next.js guide):**
> §3.2 atomic-write recipe, §5.1 status enum + transitions, §5.3 KPI computation,
> §6 accessibility checklist, §7 performance budgets, §8 failure modes. The
> §1 skill layout, §2 Bun/Hono server, and §4 HTMX routes are replaced by the
> Next.js guide.
>
> **Purpose:** Detailed implementation guide for the local tracking dashboard — scaffold, server, CSV layer, HTMX routes, accessibility, and performance discipline.
>
> **Status:** Superseded by ADR-0006 / the Next.js implementation guide
> **Last updated:** 2026-06-05
> **Owner persona:** Staff Engineer
> **Implements:** REQ-5000–REQ-5008 · NFR-0014–NFR-0017 · ADR-0005

---

## 1. Skill Layout

The dashboard lives as a self-contained skill alongside the portal adapters, per the conventions in ADR-0004 and ADR-0005.

```
.agents/skills/tracking-dashboard/
├── SKILL.md                    # Trigger keywords (/dashboard), description
├── cli/
│   ├── package.json            # Bun deps: hono only; HTMX + Pico vendored
│   ├── bun.lockb               # Locked deps
│   ├── index.ts                # Entry: argparse, port discovery, browser open
│   ├── routes/
│   │   ├── index.tsx           # GET / — list + filter + KPI strip
│   │   ├── row.tsx             # PATCH /row/:id — status/notes inline edit
│   │   ├── drawer.tsx          # GET /row/:id — detail drawer fragment
│   │   └── new.tsx             # GET /new + POST /new — manual append
│   ├── csv/
│   │   ├── read.ts             # Streaming CSV read + last_updated migration
│   │   └── write.ts            # Atomic write (tempfile + fsync + rename + .bak)
│   ├── domain/
│   │   ├── status.ts           # Enum + allowed-transitions map (business-rules §9.2)
│   │   ├── filter.ts           # Query string ↔ filter state
│   │   └── kpi.ts              # Pipeline counts + interview-rate KPI
│   └── assets/                 # Bundled, served from same origin
│       ├── htmx.min.js         # Vendored, pinned
│       ├── pico.min.css        # Vendored, pinned
│       └── app.css             # Project-specific overrides
└── url-reference.md            # Localhost URL conventions
```

**Removal discipline:** Deleting this directory must leave the CSV intact and `/apply` unaffected (ARCH-0005). No file outside this skill is owned by the dashboard.

---

## 2. Server (`cli/index.ts`)

### 2.1 Lifecycle

```
1. Parse args:  --port (default 4480)  --read-only  --no-open
2. Discover free port from default, incrementing on EADDRINUSE
3. Construct Hono app, mount routes, mount /assets
4. Bind on 127.0.0.1 ONLY  (REQ-5008 / NFR-0017 — never 0.0.0.0)
5. Print http://localhost:<port>/ to stdout
6. Unless --no-open, open the URL in the default browser
7. SIGINT / SIGTERM → graceful shutdown (close server, exit 0)
```

### 2.2 Hard rules

- **Loopback only.** The server may *only* bind `127.0.0.1` and `::1`. There is no flag to bind a LAN address in v1. Enforced by passing `hostname: "127.0.0.1"` to `Bun.serve` and asserting `server.hostname` at startup.
- **Single instance per workspace.** On launch, check for `.agents/skills/tracking-dashboard/.run/port.lock`. If present and the PID is alive, replace it (kill + restart) rather than running both.
- **No background daemon.** The server lives only while the foreground process lives (REQ-5000 acceptance).

---

## 3. CSV Layer

### 3.1 Reader (`csv/read.ts`)

```ts
// Pseudocode — exact API is the team's call
export interface TrackerRow {
  date: string;            // YYYY-MM-DD
  company: string;
  sector: string;
  role: string;
  role_type: string;
  channel: string;
  status: Status;          // enum from domain/status.ts
  contact_person: string;
  fit_rating: number;      // 0..100
  notes: string;
  cv_file: string;
  cover_letter_file: string;
  source: string;
  last_updated: string;    // ISO 8601 — defaults to `date` for legacy rows
}

export async function readTracker(path: string): Promise<TrackerRow[]>;
```

**Migration discipline:** If a row is missing `last_updated`, the reader fills it with the row's `date` value (as a date-only ISO string). The column is materialized on first dashboard write — never on read.

**Encoding:** UTF-8 only. Reject and surface a clear error if BOM or non-UTF-8 bytes are detected.

### 3.2 Writer (`csv/write.ts`)

Writes are atomic by construction:

```
1. Read entire CSV into memory  (file is small — see NFR-0013 bounds)
2. Mutate only the target row's status / notes / last_updated
3. Serialize to CSV string
4. Write to sibling tempfile:  .job_search_tracker.csv.tmp.<pid>
5. fsync(tempfile)
6. Copy current CSV to .job_search_tracker.csv.bak (overwrite previous .bak)
7. rename(tempfile, original)
8. Release any in-process lock
```

**Concurrency contract (NFR-0016):** A concurrent appender from `/apply` sees either the pre-rename CSV or the post-rename CSV — never a partial. The dashboard never appends; only the `/apply` pipeline and the explicit `+ New` route do.

**Append path (REQ-5006):** Even appends go through the same write routine — read, push new row, write atomically — to keep one write surface.

---

## 4. Routes (HTMX-driven)

### 4.1 List view (`routes/index.tsx`)

- Renders the sticky KPI strip, filter controls, and the table.
- Filter controls use `hx-get="/" hx-trigger="input changed delay:150ms, change"` and `hx-push-url="true"` so the URL reflects state (REQ-5002).
- The server responds with the full page on first load and with the `<main>` fragment on subsequent HTMX requests (use `HX-Request` header to branch).

### 4.2 Inline status / notes edit (`routes/row.tsx`)

```html
<select
  name="status"
  hx-patch="/row/{id}"
  hx-trigger="change"
  hx-target="closest tr"
  hx-swap="outerHTML">
  <!-- options scoped to allowed transitions for the row's current state -->
</select>

<input
  name="notes"
  value="{notes}"
  hx-patch="/row/{id}"
  hx-trigger="blur, keyup[key=='Enter']"
  hx-target="closest tr"
  hx-swap="outerHTML"/>
```

**Server-side validation:** Reject a status change to a non-allowed transition with HTTP 422 and a `HX-Trigger: invalid-transition` header. The client renders a toast and reverts the optimistic UI.

**Toast pattern:** Use `HX-Trigger-After-Swap: row-saved` to fire a custom DOM event the toast listener subscribes to. No global state.

### 4.3 Drawer (`routes/drawer.tsx`)

- Returns a `<dialog>` fragment loaded into `#drawer-root` via `hx-get="/row/{id}" hx-target="#drawer-root"`.
- Esc-dismiss handled by native `<dialog>` semantics + a `hx-on:keydown` listener for portability.
- File-existence check: when rendering links to `cv_file` / `cover_letter_file`, the server calls `Bun.file(path).exists()` and renders a "file not found" badge instead of a broken link.

### 4.4 New row (`routes/new.tsx`)

- GET renders the form (modal).
- POST validates the four required fields (`date, company, role, status`) and appends. Missing optional fields are written as empty strings.

### 4.5 Read-only mode (REQ-5007)

A single guard at the router level rejects all non-GET methods with HTTP 403 and a "Read-only mode" banner. The status dropdown and notes input render with `disabled` and a tooltip explaining why.

---

## 5. Domain Logic

### 5.1 Status enum (`domain/status.ts`)

The canonical enum and transition map come straight from business-rules §9.

```ts
export const STATUSES = [
  "Draft", "Sent", "Interview", "Offer",
  "Rejected", "Withdrawn", "Closed",
] as const;
export type Status = typeof STATUSES[number];

export const ALLOWED_NEXT: Record<Status, Status[]> = {
  Draft:      ["Sent", "Withdrawn"],
  Sent:       ["Interview", "Rejected", "Withdrawn", "Closed"],
  Interview:  ["Offer", "Rejected", "Withdrawn", "Closed"],
  Offer:      [],
  Rejected:   [],
  Withdrawn:  [],
  Closed:     [],
};

export const MUTED: ReadonlySet<Status> =
  new Set(["Rejected", "Withdrawn", "Closed"]);
```

### 5.2 Filter state (`domain/filter.ts`)

Filter state is encoded as URL query params: `q` (free text), `status` (multi), `fit_min`, `fit_max`, `role_type`, `channel`, `from`, `to`. Parser and serializer are pure functions — same code runs on client (via inline `<script>` for URL → form prefill) and server (for SSR).

### 5.3 KPI computation (`domain/kpi.ts`)

```ts
// Buckets respect the active filter — i.e., reflect the visible slice.
export function kpis(rows: TrackerRow[], window: 30 | 90): Kpi {
  const total = rows.length;
  const recent = rows.filter(/* within window */);
  const avgFit = recent.length >= 3
    ? recent.reduce((a, r) => a + r.fit_rating, 0) / recent.length
    : null;
  const interviewRate = denominator(recent) >= 3
    ? countOf(recent, "Interview") / denominator(recent)
    : null;
  return { total, byStatus: countByStatus(rows), avgFit, interviewRate };
}
```

KPIs render `—` when the data-point floor (3) is not met — matches REQ-5003 acceptance.

---

## 6. Accessibility Discipline (NFR-0015)

Treat every route as an axe gate. Concrete checklist:

- **Landmarks:** `<header>`, `<nav>` (filter region), `<main>` (table), `<aside>` (drawer). One `<h1>` per page.
- **Labels:** Every form control has an associated `<label>` (even when visually hidden — use `class="visually-hidden"`, never `aria-label` alone).
- **Focus management:** Drawer open → focus the close button; drawer close → restore focus to the opening row. Use `inert` on `<main>` when drawer is open.
- **Keyboard:** All actions reachable via Tab; Enter/Space activate; Esc closes drawer; arrow keys navigate the table (Up/Down rows, Left/Right cells).
- **Color independence:** Status pills use a label + an icon, never color alone. KPI deltas use `▲` / `▼` glyphs.
- **Contrast:** Pico's defaults pass AA. Project-specific overrides in `app.css` must run through axe before merge.
- **Live regions:** The toast container is `aria-live="polite" aria-atomic="true"`.

CI gate: `bunx @axe-core/cli http://localhost:<port>` must report **zero violations** against the three primary routes (list, drawer, new).

---

## 7. Performance Discipline (NFR-0014)

| Target | Technique |
|--------|-----------|
| Cold start < 2s | No JIT warmup needed — Bun runs TS directly. Avoid top-level network calls. |
| FCP < 500ms at 1k rows | Server-render the table; do not stream-then-hydrate. Vendor Pico + HTMX as same-origin static. |
| Filter/sort < 100ms | Server-side filter and re-render; the response is a `<main>` fragment, not a full page. HTMX swap is cheap. |
| Save round-trip < 250ms | Atomic write is O(rows) but rows ≤ 1k. Skip JSON; HTMX swaps the `<tr>` HTML directly. |
| Memory < 150 MB | Hold one parsed CSV in memory per request; release after response. No long-lived caches in v1. |

**Benchmark fixture:** `tests/fixtures/tracker-1000.csv` (1,000 realistic rows). Test plan TC-DBD-040 onward executes this fixture under the budgets above.

---

## 8. Failure Modes & UX

| Failure | Response |
|---------|----------|
| CSV missing | List view shows the empty-state guidance from REQ-5001; "+ New" still works. |
| CSV malformed (column count) | Server boots in read-only mode and shows a top banner pointing to `.job_search_tracker.csv.bak`. |
| Concurrent `/apply` write during a dashboard save | Atomic rename guarantees no corruption (NFR-0016); the dashboard re-reads on next request and the user sees both changes. |
| Port in use | Auto-increment to next free port; print the new URL. |
| File-link target missing | Drawer shows a "file not found" badge; the row stays editable. |
| Disallowed status transition | 422 + toast; UI reverts. |
| Browser without JS (no HTMX) | Forms still POST and full-page reload works — server-rendered HTML is the baseline. |

---

## 9. Boundaries (what this guide does NOT cover)

- **Authentication, sessions, CSRF.** Out of scope — loopback-only means no auth surface in v1 (product-overview Out-of-Scope; NFR-0017).
- **Multi-user state.** Single-user, single-workspace by design.
- **Cloud sync / persistence.** None. The CSV is the source of truth; git is the history mechanism (per ADR-0001).
- **Mobile-first responsive design.** Desktop-first; Pico's responsive defaults are sufficient.
- **Charts / visual analytics beyond KPI counters.** Future scope; the KPI strip is the v1 surface.

---

## 10. Cross-References

- Requirements: [`../requirements/functional-requirements-tracking-dashboard.md`](../requirements/functional-requirements-tracking-dashboard.md), [`../requirements/business-rules-and-validation.md`](../requirements/business-rules-and-validation.md) §9, [`../requirements/data-requirements.md`](../requirements/data-requirements.md) §11, NFR-0014–NFR-0017
- Architecture: [`../architecture/adr-0005-tracking-dashboard-stack.md`](../architecture/adr-0005-tracking-dashboard-stack.md), [`../architecture/data-architecture.md`](../architecture/data-architecture.md) §Consistency Rules
- Plan: [`../plan/work-breakdown-structure.md`](../plan/work-breakdown-structure.md) Epic 9 (T-110…T-118)
- Testing: [`../testing/test-plan-tracking-dashboard.md`](../testing/test-plan-tracking-dashboard.md)
