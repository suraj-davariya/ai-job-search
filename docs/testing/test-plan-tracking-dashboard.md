# Testing — Test Plan: Tracking Dashboard

> **Purpose:** Test cases and verification steps for the local tracking dashboard — launch, list/filter, inline edits, concurrent writes, accessibility, performance, and network-surface integrity.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead
> **Verifies:** REQ-5000–REQ-5008 · NFR-0014–NFR-0017 · ADR-0005

---

## 1. Feature Under Test: `/dashboard`

The `/dashboard` command starts a local web server over `job_search_tracker.csv` for visual review and bounded in-place edits. It runs on `127.0.0.1` only, serves bundled assets, and writes the CSV atomically.

**Layers under test:**
- Lifecycle (launch, shutdown, port discovery)
- Read & filter (list rendering, search, structured filters, KPI strip)
- Write (inline status/notes edits, "+ New" append, atomicity, backup)
- Modes (read-only)
- Network surface (loopback, no telemetry)
- Accessibility (WCAG 2.1 AA)
- Performance (1k rows budgets)
- Concurrency (interleaving with `/apply` appends)

---

## 2. Test Cases

### Lifecycle (REQ-5000)

- **TC-DBD-001**: Verify that running `/dashboard` on a workspace with a valid `job_search_tracker.csv` starts the server in under 2 seconds and prints a `http://localhost:<port>/` URL to stdout.
- **TC-DBD-002**: Verify that the default port `4480` is used when free; when occupied, the next free port is selected and printed.
- **TC-DBD-003**: Verify that `Ctrl+C` (SIGINT) shuts the server down within 1 second with exit code 0 and leaves no stale lock files.
- **TC-DBD-004**: Verify that closing the terminal hosting the process stops the server (no daemonization).
- **TC-DBD-005**: Verify that a second `/dashboard` invocation in the same workspace replaces, not duplicates, the running instance.
- **TC-DBD-006**: Verify that the `--no-open` flag suppresses the browser auto-open and only prints the URL.

### List View (REQ-5001)

- **TC-DBD-010**: Verify that all rows from `job_search_tracker.csv` render, including rows with empty optional columns.
- **TC-DBD-011**: Verify that the default sort is `date` descending and that clicking a column header toggles sort direction.
- **TC-DBD-012**: Verify that `cv_file` and `cover_letter_file` cells render as `<a target="_blank">` links to the local PDFs.
- **TC-DBD-013**: Verify that rows with status in {`Rejected`, `Withdrawn`, `Closed`} render with the muted visual treatment (per business-rules §9.4) but remain interactive.
- **TC-DBD-014**: Verify that the empty state (zero rows) shows the guidance string: "No applications yet — run `/apply <posting>` to add one."
- **TC-DBD-015**: Verify that a row referencing a missing `cv_file` shows a "file not found" badge in the drawer (TC-DBD-024).

### Filtering & Search (REQ-5002)

- **TC-DBD-020**: Verify that typing in the search input filters the list in real time across `company`, `role`, and `notes`.
- **TC-DBD-021**: Verify that structured filters on `status` (multi-select), `fit_rating` range, `role_type`, `channel`, and date range narrow the list as expected.
- **TC-DBD-022**: Verify that the URL reflects filter state (query params) and that loading that URL reproduces the filtered view.
- **TC-DBD-023**: Verify that the "Clear filters" control returns the view to defaults and clears the URL params.
- **TC-DBD-024**: Verify keyboard accessibility — Tab focuses each filter control, Enter submits, Esc clears the focused control.

### Pipeline Summary (REQ-5003)

- **TC-DBD-030**: Verify that the KPI strip renders counts for each canonical status (per business-rules §9.1).
- **TC-DBD-031**: Verify that the KPI strip respects active filters (i.e., counts reflect the visible slice).
- **TC-DBD-032**: Verify that the "avg fit (last 30d)" KPI renders `—` when fewer than 3 data points exist.
- **TC-DBD-033**: Verify that the "interviews per application (last 90d)" KPI computes per business-rules §9.5 and renders `—` when fewer than 3 data points exist.
- **TC-DBD-034**: Verify that the KPI strip is sticky on scroll.

### Inline Status & Notes Edit (REQ-5004)

- **TC-DBD-040**: Verify that changing a row's status via the dropdown writes the new value back to `job_search_tracker.csv` within 250ms (verified via NFR-0014 timing).
- **TC-DBD-041**: Verify that the status dropdown lists only allowed next states for the current state (per business-rules §9.2) plus the current state.
- **TC-DBD-042**: Verify that a disallowed transition (forced via direct HTTP `PATCH`) returns HTTP 422 with `HX-Trigger: invalid-transition` and does not modify the CSV.
- **TC-DBD-043**: Verify that editing the `notes` cell and pressing Enter or blurring persists the value to the CSV.
- **TC-DBD-044**: Verify that every successful save updates the row's `last_updated` to the current ISO 8601 timestamp.
- **TC-DBD-045**: Verify that a successful save shows a toast with timestamp ("Updated · 2:14pm") within 250ms.
- **TC-DBD-046**: Verify that no column other than `status`, `notes`, `last_updated` can be modified through any UI control or HTTP route.

### Row Detail Drawer (REQ-5005)

- **TC-DBD-050**: Verify that clicking a row opens the drawer with all columns visible.
- **TC-DBD-051**: Verify that Esc closes the drawer and restores focus to the originating row.
- **TC-DBD-052**: Verify that URLs in `notes` auto-link.
- **TC-DBD-053**: Verify that a missing `cv_file` / `cover_letter_file` is shown as a "file not found" indicator, not a broken link.

### Append New Application (REQ-5006)

- **TC-DBD-060**: Verify that the "+ New" form rejects submission with any of {`date`, `company`, `role`, `status`} blank.
- **TC-DBD-061**: Verify that submitting a valid form appends a row with empty `cv_file` and `cover_letter_file`.
- **TC-DBD-062**: Verify that the newly appended row appears in the list immediately and respects active filters.

### Read-Only Mode (REQ-5007)

- **TC-DBD-070**: Verify that `/dashboard --read-only` disables the status dropdown, notes input, and "+ New" button with a visible indicator.
- **TC-DBD-071**: Verify that issuing any `PATCH` or `POST` to a mutation route returns HTTP 403 in read-only mode.
- **TC-DBD-072**: Verify that the underlying CSV file handle is opened without write permission in read-only mode.

### Network Surface (REQ-5008 / NFR-0017)

- **TC-DBD-080**: Verify that the server binds `127.0.0.1` (and `::1`) only — connecting from `0.0.0.0` or a LAN IP fails.
- **TC-DBD-081**: Verify (via `lsof -iTCP -sTCP:LISTEN -P` or platform equivalent) that the dashboard process opens only loopback listening sockets.
- **TC-DBD-082**: Verify (via packet capture on the loopback interface) that no outbound non-loopback request is made during a 5-minute session that includes login, filter, save, drawer-open, and "+ New".
- **TC-DBD-083**: Verify that all static assets (HTMX, Pico, fonts, app CSS) are served from `/assets/...` on the same origin and that no `<script>`, `<link>`, or fetch references a CDN or external origin.

### Concurrent Writes (NFR-0016)

- **TC-DBD-090**: Verify the interleaving fuzz test — 100 `/apply` appends interleaved with 100 dashboard status updates against the same CSV — produces a final CSV with exactly 100 new rows appended and 100 expected status mutations applied; header row count is exactly 1; column count is invariant.
- **TC-DBD-091**: Verify that a reader sampling the CSV during the fuzz never observes a partial line, a header duplication, or a mismatched column count.
- **TC-DBD-092**: Verify that `.job_search_tracker.csv.bak` exists after each dashboard write and contains the pre-write contents (single-step undo).

### Performance (NFR-0014)

- **TC-DBD-100**: Verify cold-start to listening socket under 2,000ms on the reference fixture (`tests/fixtures/tracker-1000.csv`).
- **TC-DBD-101**: Verify list-view FCP under 500ms on the 1k-row fixture (measured via Chrome DevTools Performance trace or Lighthouse).
- **TC-DBD-102**: Verify filter and sort interactions under 100ms perceived latency on the 1k-row fixture.
- **TC-DBD-103**: Verify save round-trip (blur to toast) under 250ms on the 1k-row fixture.
- **TC-DBD-104**: Verify resident memory under 150 MB after 100 interactions on the 1k-row fixture (sampled via `ps` or platform equivalent).

### Accessibility (NFR-0015)

- **TC-DBD-110**: Verify zero `@axe-core/cli` violations on the list view at default filter.
- **TC-DBD-111**: Verify zero `@axe-core/cli` violations with the drawer open.
- **TC-DBD-112**: Verify zero `@axe-core/cli` violations on the "+ New" form.
- **TC-DBD-113**: Verify a keyboard-only walkthrough: Tab through filters, arrow-key navigate the table, Enter opens drawer, Esc closes, Tab to status dropdown, change status, Tab to notes, type and Enter — all without using the pointer.
- **TC-DBD-114**: Verify that every status pill in the rendered HTML has both a text label and an icon/glyph, not color alone.
- **TC-DBD-115**: Verify that the toast container has `role="status"` (or equivalent live region) and is announced by screen readers.

### Graceful Degradation (NFR-0009)

- **TC-DBD-120**: Verify that with `job_search_tracker.csv` missing, the list view renders the empty-state guidance and the "+ New" route still creates the file with the correct header.
- **TC-DBD-121**: Verify that with a malformed CSV (wrong column count on one row), the server starts in read-only mode, surfaces a top banner pointing to `.job_search_tracker.csv.bak`, and does not modify the file.
- **TC-DBD-122**: Verify that deleting the entire `.agents/skills/tracking-dashboard/` directory leaves `/apply` fully functional.

### Migration (data-requirements §11)

- **TC-DBD-130**: Verify that a legacy CSV without a `last_updated` column reads with `last_updated` defaulting to each row's `date`.
- **TC-DBD-131**: Verify that on the first dashboard write to such a CSV, the `last_updated` column is materialized in the file header and all rows.

---

## 3. Test Data

- `tests/fixtures/tracker-empty.csv` — header row only.
- `tests/fixtures/tracker-typical.csv` — ~50 rows mixing all status values.
- `tests/fixtures/tracker-1000.csv` — 1,000 realistic rows for performance budgets.
- `tests/fixtures/tracker-legacy.csv` — pre-migration row shape (no `last_updated`).
- `tests/fixtures/tracker-malformed.csv` — one row with wrong column count.

---

## 4. Automation Targets

| Tier | Coverage |
|------|----------|
| Unit (Bun test) | CSV reader, writer (atomicity simulated), filter parser, KPI math, status transition map |
| Integration (Bun test + ephemeral server) | Each route: GET /, PATCH /row/:id, GET /row/:id, GET/POST /new |
| End-to-end (Playwright against `localhost`) | TC-DBD-010, 020, 040, 060, 070, 113 |
| Accessibility CI gate | TC-DBD-110, 111, 112 via `@axe-core/cli` |
| Performance CI gate | TC-DBD-100…104 via scripted Lighthouse run on the 1k fixture |
| Concurrency fuzz | TC-DBD-090…092 via a Bun script interleaving append+patch workloads |
| Network surface CI gate | TC-DBD-080, 081, 083 via `lsof` + grep on rendered HTML/CSS/JS for external origins |

---

## 5. Manual QA Checklists

Add a "Tracking Dashboard" section to `manual-qa-checklists.md` covering: launch-and-look, sort/filter feel, inline-edit feel, drawer focus management, mobile sanity (Pico responsive defaults), and a five-minute exploratory dive on the 1k-row fixture.

---

## 6. Next.js / Operator-Surface Addendum (ADR-0006, REQ-5009–5016)

> **Stack migration note (2026-06-10):** the dashboard moved to Next.js + file-as-DB
> (ADR-0006). The §1–§5 cases above remain valid as behavior specs, but the
> automation tier names ("Bun test", "HTMX routes") map to: **vitest** for `lib/`
> units, **Server Action / Route Handler** integration tests, and **Playwright**
> e2e. The cases below cover the scope ADR-0006 + REQ-5009–5016 added. See
> [`../development/implementation-guide-tracking-dashboard-nextjs.md`](../development/implementation-guide-tracking-dashboard-nextjs.md).

### Atomic write & state machine (REQ-5004, NFR-0016)
- **TC-DBD-140** — `updateRow` changes only `status`/`notes`/`last_updated`; all other columns byte-identical after write.
- **TC-DBD-141** — an illegal transition (e.g. `Draft→Offer`) is rejected and the file is left unchanged.
- **TC-DBD-142** — a `.job_search_tracker.csv.bak` is written before the rename.
- **TC-DBD-143** — 5 interleaved writes leave the header intact and the file parseable (no corruption).
- **TC-DBD-144** — `+ New` append goes through the same writer with empty `cv_file`/`cover_letter_file`.

### Loopback & no-network (REQ-5008, NFR-0017)
- **TC-DBD-145** — the server binds `127.0.0.1` only; there is no flag to bind a LAN address.
- **TC-DBD-146** — a full session shows zero requests to non-loopback origins (devtools/network capture).
- **TC-DBD-147** — rendered HTML/CSS/JS reference no external (CDN/font/analytics) origins.

### Analytics honesty (REQ-5009, ARCH-0007)
- **TC-DBD-148** — KPI windows with <3 data points render `—`, never 0 or a guess.
- **TC-DBD-149** — interview rate uses the §9.5 denominator (excludes `Draft`).
- **TC-DBD-150** — empty CSV renders chart empty-states, not fabricated series.
- **TC-DBD-151** — the activity calendar bins on `date`; the recent panel's "status changes" view orders by `last_updated`.

### Action layer (REQ-5010, REQ-5011)
- **TC-DBD-152** — only allowlisted commands run; an unknown command is rejected.
- **TC-DBD-153** — subprocesses spawn with `shell:false` and an argv array; a company/URL containing shell metacharacters is passed as one opaque argument and never interpreted.
- **TC-DBD-154** — a second concurrent run of the same command type is rejected; the global stop sends SIGTERM.
- **TC-DBD-155** — real exit codes/stderr are surfaced; a missing `claude`/`python3` disables the action with a tooltip (no fake success).
- **TC-DBD-156** — run history persists to `dashboard/.runs/*.json` and is never written into the tracker CSV.
- **TC-DBD-157** — action endpoints refuse to spawn in read-only mode (REQ-5007).

### Secondary views & degradation (REQ-5012–5016, ARCH-0005)
- **TC-DBD-158** — Companies/Profile/Salary/Upskill render empty-states when their optional source files are absent (no crash).
- **TC-DBD-159** — `/api/file` serves PDFs only from the allowlisted output dirs and rejects `..` traversal.
- **TC-DBD-160** — deleting `dashboard/` leaves `job_search_tracker.csv` and the `/apply` pipeline intact.
