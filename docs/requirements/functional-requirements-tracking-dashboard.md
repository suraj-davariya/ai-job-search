# Functional Requirements — Tracking Dashboard

> **Purpose:** Defines the local web dashboard for reviewing applied positions, updating status, and getting at-a-glance pipeline visibility.
>
> **Status:** Draft
> **Last updated:** 2026-06-10
> **Owner persona:** Business Analyst
> **Differentiator vs. reference product:** The reference (`MadsLorentzen/ai-job-search`) tracks applications in a CSV only. CareerForge ships a first-class visual surface over the same data. See `.reference/competitive-analysis/madslorentzen-ai-job-search.md`.
>
> **Scope expansion (2026-06-10, per ADR-0006):** The dashboard's vision has grown
> from a read-mostly viewer (REQ-5000–5008) into the **primary operator surface** —
> a place to both *see* every stat and *drive* the framework (apply, search,
> upskill, salary lookup) from the browser. REQ-5009–REQ-5016 below capture that
> added scope. The stack decision moved to Next.js + file-as-DB in ADR-0006, which
> supersedes ADR-0005 on technology only and retains every constraint of REQ-5000–5008.

---

## Scope

The dashboard is a **local web application** that:

- Runs on `localhost` only (no auth, no server deployment, no remote access).
- Reads from the existing append-only `job_search_tracker.csv` (the canonical data source per ARCH-0004 / data-architecture.md §11), plus sibling JSON/markdown files (seen-jobs, salary, application artifacts, upskill reports, profile).
- Writes only the `status`, `notes`, and `last_updated` columns back to existing CSV rows; all other columns remain immutable from the UI (drafted by the `/apply` pipeline). New rows may be appended via the explicit `+ New` form (REQ-5006).
- May trigger a **fixed allowlist** of CareerForge CLI commands as subprocesses (REQ-5010) — this is the only source of outbound activity, and only when the user explicitly initiates it.
- Is launched via a CLI command (`/dashboard` or equivalent) that prints a `http://localhost:<port>` URL and opens the browser.
- Has zero impact on the core `/apply` pipeline if disabled or uninstalled (per ARCH-0005 Graceful degradation).

---

## Requirements

### REQ-5000 — Launch & lifecycle

**Description:** A user can launch the dashboard from the CLI with a single command. The dashboard starts a local HTTP server on a free port (default 4480; configurable), prints the URL, and optionally opens the browser. The server stops on `Ctrl+C` or when the process is killed.

**Priority:** Must

**Acceptance criteria:**
- Running `/dashboard` (or the documented equivalent) starts the server in under 2 seconds on a developer laptop.
- The URL is printed to stdout in copy-friendly form.
- If the default port is in use, the next free port is selected and printed.
- Closing the terminal stops the server (no daemonized state).
- A second launch in the same workspace replaces, never duplicates, the running instance.

---

### REQ-5001 — Application list view

**Description:** The dashboard's home view lists all tracker rows in a sortable, filterable table with the columns: date, company, role, role_type, channel, status, fit_rating, contact_person, cv_file link, cover_letter_file link, source link.

**Priority:** Must

**Acceptance criteria:**
- All rows from `job_search_tracker.csv` render, including rows with empty optional columns.
- Columns are sortable client-side; default sort is `date` descending.
- Each `cv_file` / `cover_letter_file` cell renders as a link that opens the generated PDF in a new tab.
- `source` URL renders as a link to the original posting.
- Rows with `status` in {`Rejected`, `Withdrawn`, `Closed`} are visually de-emphasized (muted color) but not hidden by default.
- Empty state (zero rows) shows guidance: "No applications yet — run `/apply <posting>` to add one."

---

### REQ-5002 — Filtering & search

**Description:** The user can narrow the list by free-text search across `company`, `role`, and `notes`, and by structured filters on `status`, `fit_rating` (range), `role_type`, `channel`, and date range.

**Priority:** Must

**Acceptance criteria:**
- Filter and search update the list in real time (no submit button).
- Filter state is reflected in the URL so a view is shareable/bookmarkable within the session.
- Clearing all filters returns to the default view.
- Filter UI is keyboard-accessible (tab-focusable controls, Enter submits, Esc clears).

---

### REQ-5003 — Pipeline summary

**Description:** Above the list, a strip shows counts per status (`Draft`, `Sent`, `Interview`, `Offer`, `Rejected`, `Withdrawn`, `Closed`) plus three KPIs: total applications, average fit_rating (last 30 days), interviews-per-application rate (last 90 days).

**Priority:** Should

**Acceptance criteria:**
- Counts respect any active filters (i.e., they reflect the visible slice).
- KPI values render as `—` when fewer than 3 data points exist for the window.
- The summary strip is fixed at the top of the view (sticky on scroll).

---

### REQ-5004 — Inline status update

**Description:** The user can change a row's `status` inline via a dropdown, and edit `notes` inline via a single-line text field that expands on focus. Changes are persisted to the CSV on blur or Enter.

**Priority:** Must

**Acceptance criteria:**
- The status dropdown options come from a canonical enum (see Business Rules §status-values).
- On save, the CSV is rewritten atomically (write to tempfile, fsync, rename); concurrent writes from `/apply` must not corrupt rows (see NFR-data-integrity).
- A toast confirms each save (`Updated · 2:14pm`); errors show an inline error and keep the prior value.
- The save also stamps `last_updated` (new column added to schema; defaults to `date` for legacy rows).
- No other columns are editable from the UI.

---

### REQ-5005 — Row detail drawer

**Description:** Clicking a row opens a side drawer showing the full record, including columns not in the table (notes, contact_person, fit breakdown if available), plus links to the generated CV, cover letter, and source posting. The drawer also shows the application's evaluation summary if present in the profile data.

**Priority:** Should

**Acceptance criteria:**
- The drawer is keyboard-dismissible (Esc) and does not navigate away from the list (preserves scroll position).
- Long notes wrap; URLs in notes auto-link.
- If `cv_file` or `cover_letter_file` references a missing file, the drawer shows a "file not found" indicator instead of a broken link.

---

### REQ-5006 — Append new application

**Description:** A "+ New" button lets the user add a tracker row manually (for postings applied to outside the `/apply` flow). Required fields: date, company, role, status. Optional: everything else.

**Priority:** Could

**Acceptance criteria:**
- The form validates required fields client-side before allowing save.
- On save, a row is appended to the CSV with empty `cv_file` and `cover_letter_file` (since no PDFs are generated).
- The new row appears in the list immediately.

---

### REQ-5007 — Read-only mode for shared sessions

**Description:** A launch flag (`--read-only`) starts the dashboard with all mutations disabled (no status edits, no new rows). Useful for screenshots, demos, or accidental-write protection.

**Priority:** Could

**Acceptance criteria:**
- In read-only mode, the status dropdown, notes field, and "+ New" button are disabled with a visible indicator.
- The CSV file is opened with read-only file handles (no write permission requested).

---

### REQ-5008 — No telemetry, no network calls

**Description:** The dashboard performs zero outbound network calls. All assets (CSS, fonts, JS) are bundled with the dashboard binary or served from the local filesystem.

**Priority:** Must

**Acceptance criteria:**
- A network inspection during a full session shows zero requests to non-`localhost` origins.
- No CDN-hosted assets, no analytics, no error reporting.

---

### REQ-5009 — Analytics dashboard home

**Description:** A dedicated home view presents at-a-glance analytics over the
tracker data: KPI cards, a pipeline strip, and a set of charts (applications over
time, a yearly activity calendar heatmap, status breakdown, fit-rating
distribution, top companies/sectors), plus a recent-activity panel. This
**supersedes the impl-guide §9 note that "charts are out of scope"** for the
Next.js stack adopted in ADR-0006.

**Priority:** Should

**Acceptance criteria:**
- KPI cards: total applications; applied in last 7d / 30d (toggle); average
  `fit_rating` (last 30d); interview rate (last 90d). KPI windows render `—` when
  fewer than 3 data points exist (consistent with REQ-5003).
- A pipeline strip shows counts for every status; terminal statuses
  (`Rejected`/`Withdrawn`/`Closed`) render muted.
- Charts: weekly applications bar; yearly activity calendar heatmap keyed on
  `date`; status-breakdown donut; fit-rating histogram; top companies and sectors
  by application count.
- A recent panel toggles between recent applications (by `date`) and recent status
  changes (by `last_updated`), each row linking to its detail drawer.
- **No fabrication (ARCH-0007):** every number traces to real CSV data; missing or
  insufficient data renders `—` or an empty-state, never an invented value.
- Charts are keyboard-reachable and expose an accessible text/table equivalent
  (NFR-0015); meaning is never conveyed by color alone.

---

### REQ-5010 — Operator action layer (trigger CLI from the browser)

**Description:** The dashboard can invoke a **fixed allowlist** of CareerForge
commands as local subprocesses, with the repo root as the working directory, so
the user can drive the framework from the browser instead of the terminal.

**Priority:** Should

**Acceptance criteria:**
- Only these commands are runnable: `/apply`, `/search`, `/upskill`, `/expand`,
  `/setup` (via `claude -p "/<command> <args>"`); `salary_lookup.py`;
  `tools/convert_salary_excel.py` (via `python3`). No arbitrary command execution.
- Subprocesses are spawned with an argument **array** (no shell), arguments are
  validated/escaped, and **no user input is interpolated into a shell string**.
- At most one run per command type at a time; a duplicate request is rejected with
  a clear message; a global "stop" can terminate a running process.
- Real exit codes and stderr are surfaced; a fake success is never shown
  (ARCH-0007). If `claude` or `python3` is absent from PATH, the relevant action is
  disabled with an explanatory tooltip and the view/edit features keep working
  (ARCH-0005 graceful degradation).
- All actions are disabled in read-only mode (REQ-5007).
- No outbound network activity occurs except the subprocess the user explicitly
  triggered (REQ-5008 / NFR-0017).

---

### REQ-5011 — Run console & history

**Description:** A console surface streams the live output of triggered runs and
retains a short history of past runs, so the dashboard is a usable CLI
replacement.

**Priority:** Should

**Acceptance criteria:**
- Console streams stdout/stderr incrementally as a run progresses (SSE or a
  streamed `Response`), showing status (running / success / failed), exit code, and
  duration.
- Run history persists to dashboard-local `dashboard/.runs/*.json` (gitignored) and
  survives a page refresh. This is **UI bookkeeping, never product data** — it is
  never written into the tracker CSV.
- When a `/apply` run finishes, it has appended its own `Draft` row to the CSV; the
  Applications view reflects it by re-reading the file. The dashboard does **not**
  duplicate that write.

---

### REQ-5012 — Companies view

**Description:** A view derived from the tracker (grouped by `company`), enriched
with salary benchmarks from `salary_data.json` when present.

**Priority:** Could

**Acceptance criteria:**
- Per company: application count, status mix, best `fit_rating`, sector, and the
  salary benchmark if `salary_data.json` exists.
- Zero tracker rows → empty-state. `salary_data.json` absent → the salary portion
  shows an empty-state, never an error (ARCH-0005).

---

### REQ-5013 — Profile view (read-only)

**Description:** A read-only rendering of the candidate profile assembled from the
`job-application-assistant` skill files (`01–07`) and the root `CLAUDE.md`.

**Priority:** Could

**Acceptance criteria:**
- Sections render read-only: identity, skills, experience, behavioral profile, and
  the interview STAR bank (`07-interview-prep.md`).
- Missing source files degrade to an empty-state (ARCH-0005).
- No editing in v1; an edit / `/setup`-trigger flow is deferred to a later phase.

---

### REQ-5014 — Salary view & lookup

**Description:** Browse `salary_data.json` and run a company salary lookup via the
action layer.

**Priority:** Could

**Acceptance criteria:**
- Benchmarks render as a table/cards when `salary_data.json` is present; absent →
  empty-state with import guidance.
- A lookup box runs `python3 salary_lookup.py "<company>" [--city <city>] --json`
  through the action layer (REQ-5010) and renders the parsed JSON result honestly,
  including a "not found" result.

---

### REQ-5015 — Upskill view & trigger

**Description:** List and render `upskill/report-*.md`, and trigger a new
`/upskill` run.

**Priority:** Could

**Acceptance criteria:**
- Existing reports render as formatted markdown; no reports → empty-state.
- A trigger runs `/upskill` through the action layer and streams output to the
  console (REQ-5011); the new report appears in the list once written.

---

### REQ-5016 — Settings

**Description:** A settings view for local, non-secret preferences.

**Priority:** Could

**Acceptance criteria:**
- Theme toggle (next-themes), defaulting to **dark**.
- Repo path, default port, and a read-only toggle (mirroring the `--read-only`
  launch flag) are configurable.
- No secrets and no accounts are ever stored (loopback, single-user).

---

## Non-Functional Constraints (cross-references)

- **Performance:** NFR-0014 — Tracking Dashboard Performance (FCP < 500ms on 1k rows; save round-trip < 250ms).
- **Accessibility:** NFR-0015 — WCAG 2.1 AA (keyboard, contrast, semantic landmarks, screen reader navigation).
- **i18n:** NFR-0006 — Multi-Language Support (cover letter language); dashboard adds an English default with all strings externalized per the same principle.
- **Privacy / network surface:** NFR-0017 — Local-Only Network Surface (loopback bind, bundled assets, zero telemetry); reinforced by NFR-0004 Data Privacy.
- **Data integrity:** NFR-0016 — Concurrent CSV Writes (atomic write-tempfile-rename; `/apply` appends and dashboard edits do not race).
- **Graceful degradation:** NFR-0009 — Removing the dashboard skill must not break the core `/apply` pipeline; the CSV remains the source of truth.

---

## Open Questions — Resolved

1. **Status enum.** ✅ **Resolved.** Ratified in business-rules-and-validation.md §9:
   `Draft, Sent, Interview, Offer, Rejected, Withdrawn, Closed`, with the allowed
   transitions in §9.2, the muted set in §9.4, and the interview-rate buckets in §9.5.
2. **`last_updated` column.** ✅ **Resolved.** Added to the schema (data-requirements
   §11 / data-architecture.md); present in the live `job_search_tracker.csv` header.
   Defaults to the row's `date` for legacy rows and is materialized on first
   dashboard write — never on read.
3. **Auth/bind address.** ✅ **Resolved.** Loopback only (`127.0.0.1`/`::1`); **no**
   LAN-bind flag in v1 (ADR-0006 Scope of supersession; REQ-5008; NFR-0017).
4. **Tech choice.** ✅ **Resolved.** **ADR-0006** adopts Next.js (App Router) +
   TypeScript + shadcn/ui + Tailwind + Nivo + next-themes over file-as-DB,
   superseding ADR-0005's Bun + Hono + HTMX + Pico proposal on technology only.
