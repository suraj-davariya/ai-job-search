# Functional Requirements — Tracking Dashboard

> **Purpose:** Defines the local web dashboard for reviewing applied positions, updating status, and getting at-a-glance pipeline visibility.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst
> **Differentiator vs. reference product:** The reference (`MadsLorentzen/ai-job-search`) tracks applications in a CSV only. CareerForge ships a first-class visual surface over the same data. See `.reference/competitive-analysis/madslorentzen-ai-job-search.md`.

---

## Scope

The dashboard is a **local web application** that:

- Runs on `localhost` only (no auth, no server deployment, no remote access).
- Reads from the existing append-only `job_search_tracker.csv` (the canonical data source per ARCH-0004 / data-architecture.md §11).
- Writes only the `status` and `notes` columns back to the CSV; all other columns remain immutable from the UI (drafted by the application pipeline).
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

## Non-Functional Constraints (cross-references)

- **Performance:** NFR-0014 — Tracking Dashboard Performance (FCP < 500ms on 1k rows; save round-trip < 250ms).
- **Accessibility:** NFR-0015 — WCAG 2.1 AA (keyboard, contrast, semantic landmarks, screen reader navigation).
- **i18n:** NFR-0006 — Multi-Language Support (cover letter language); dashboard adds an English default with all strings externalized per the same principle.
- **Privacy / network surface:** NFR-0017 — Local-Only Network Surface (loopback bind, bundled assets, zero telemetry); reinforced by NFR-0004 Data Privacy.
- **Data integrity:** NFR-0016 — Concurrent CSV Writes (atomic write-tempfile-rename; `/apply` appends and dashboard edits do not race).
- **Graceful degradation:** NFR-0009 — Removing the dashboard skill must not break the core `/apply` pipeline; the CSV remains the source of truth.

---

## Open Questions

1. **Status enum.** What is the canonical set? Proposed: `Draft, Sent, Interview, Offer, Rejected, Withdrawn, Closed`. Needs ratification in business-rules-and-validation.md.
2. **`last_updated` column.** Adding it is a schema change to `job_search_tracker.csv` — needs sign-off in data-requirements.md §11 and data-architecture.md.
3. **Auth/bind address.** Default `127.0.0.1` only; do we need a flag to bind `0.0.0.0` for LAN access? (Default no, per Out-of-Scope.)
4. **Tech choice.** The runtime is a /docs/architecture/ decision — proposed: Bun + Hono + server-rendered HTML + HTMX + Pico.css for minimum dependencies. Captured here as a question, not a decision.
