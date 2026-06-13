# CareerForge Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Start on a feature branch; never on `main`.

**Goal:** Build a local-only, dark/orange-gold Next.js dashboard that reads and atomically writes CareerForge's existing CSV/JSON/markdown files as the single source of truth, and (from M4) drives the framework's CLI commands from the browser.

**Architecture:** Next.js App Router on `127.0.0.1`. A pure, unit-tested `lib/` core (read parsers, atomic CSV writer, status machine, KPI math, action allowlist) sits under Server Components / Server Actions / Route Handlers. No database; file-as-DB per ADR-0006.

**Tech Stack:** Next.js (App Router) · TypeScript strict · shadcn/ui + Radix · Tailwind · Nivo charts · next-themes · papaparse · @tanstack/react-table · react-hook-form + zod · date-fns · lucide-react · vitest.

**Testing discipline (locked):** **TDD the `lib/` core** (test-first, full code below) — parsers, atomic writer, status machine, KPI, allowlist. **Smoke/integration test the UI** — exact files + key code + a render/interaction smoke test, not per-component TDD. Where a UI task says "smoke test," that is an intentional choice per the design spec §6, not a placeholder.

**Read before starting:**
[`docs/superpowers/specs/2026-06-10-careerforge-dashboard-design.md`](../specs/2026-06-10-careerforge-dashboard-design.md) ·
[`docs/development/implementation-guide-tracking-dashboard-nextjs.md`](../../development/implementation-guide-tracking-dashboard-nextjs.md) ·
[`docs/architecture/adr-0006-dashboard-nextjs-file-as-db.md`](../../architecture/adr-0006-dashboard-nextjs-file-as-db.md) ·
[`docs/requirements/functional-requirements-tracking-dashboard.md`](../../requirements/functional-requirements-tracking-dashboard.md) (REQ-5000–5016) ·
[`docs/requirements/business-rules-and-validation.md`](../../requirements/business-rules-and-validation.md) §9.

**Conventions:** Commit after each task (Conventional Commits, e.g. `feat(dashboard): …`). All paths are relative to repo root. The app lives entirely in `dashboard/`. The repo root is `dashboard/..` resolved in `lib/paths.ts`.

---

## Milestone M0 — Foundation

*Goal: an empty, themed shell that runs on loopback and resolves repo paths. Gates: REQ-5000, REQ-5008(bind), REQ-5016(theme default).*

### Task M0.1: Scaffold the Next.js app in `dashboard/`

**Files:**
- Create: `dashboard/package.json`, `dashboard/tsconfig.json`, `dashboard/next.config.mjs`, `dashboard/.gitignore`, `dashboard/app/layout.tsx`, `dashboard/app/globals.css`

- [ ] **Step 1: Create the app non-interactively**

```bash
cd dashboard 2>/dev/null || mkdir dashboard && cd dashboard
# create the Next app in-place (npm; bun is absent on this machine)
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false \
  --import-alias "@/*" --use-npm --no-turbopack --yes
```

- [ ] **Step 2: Pin no-network config in `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { remotePatterns: [] },     // no remote images
  // No analytics, no telemetry. Disable Next telemetry in CI via `next telemetry disable`.
};
export default nextConfig;
```

- [ ] **Step 3: `.gitignore` (dashboard-local)**

```
/node_modules
/.next
/out
/.runs
*.local
.DS_Store
```

- [ ] **Step 4: Verify it builds and starts on loopback**

Run: `npm run build && npx next start -H 127.0.0.1 -p 4480 &` then `curl -sS http://127.0.0.1:4480 | head -c 200`
Expected: HTML returned; process bound to 127.0.0.1.

- [ ] **Step 5: Disable Next telemetry and commit**

```bash
npx next telemetry disable
git add dashboard/ && git commit -m "feat(dashboard): scaffold Next.js app (M0.1)"
```

### Task M0.2: Add dependencies and vitest

**Files:** Modify `dashboard/package.json`; Create `dashboard/vitest.config.ts`, `dashboard/test/setup.ts`

- [ ] **Step 1: Install runtime + dev deps**

```bash
cd dashboard
npm i papaparse @tanstack/react-table date-fns lucide-react next-themes \
  react-hook-form zod @nivo/core @nivo/bar @nivo/calendar
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react \
  @testing-library/jest-dom @types/papaparse @axe-core/cli
```

- [ ] **Step 2: `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'], globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

- [ ] **Step 3: `test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev -H 127.0.0.1",
  "build": "next build",
  "start": "node scripts/start.mjs",
  "test": "vitest run",
  "test:watch": "vitest",
  "a11y": "axe http://127.0.0.1:4480 http://127.0.0.1:4480/applications"
}
```

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run` → Expected: "No test files found" (exit 0 acceptable) — toolchain wired.
`git add dashboard && git commit -m "chore(dashboard): add deps + vitest (M0.2)"`

### Task M0.3: `lib/paths.ts` — single source of repo file paths (TDD)

**Files:** Create `dashboard/lib/paths.ts`, `dashboard/test/lib/paths.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// test/lib/paths.test.ts
import { describe, it, expect } from 'vitest';
import { repoRoot, paths } from '@/lib/paths';

describe('paths', () => {
  it('resolves repo root as the parent of dashboard/', () => {
    expect(repoRoot()).toMatch(/ai-job-search$/);
  });
  it('points tracker at the repo-root CSV', () => {
    expect(paths().tracker).toMatch(/ai-job-search\/job_search_tracker\.csv$/);
  });
  it('honors CAREERFORGE_REPO override', () => {
    expect(paths('/tmp/x').tracker).toBe('/tmp/x/job_search_tracker.csv');
  });
});
```

- [ ] **Step 2: Run → FAIL** (`Cannot find module '@/lib/paths'`). Run: `npx vitest run test/lib/paths.test.ts`

- [ ] **Step 3: Implement `lib/paths.ts`**

```ts
import path from 'node:path';

export function repoRoot(override?: string): string {
  if (override) return path.resolve(override);
  if (process.env.CAREERFORGE_REPO) return path.resolve(process.env.CAREERFORGE_REPO);
  // dashboard/ lives at repo root; this file is dashboard/lib/paths.ts
  return path.resolve(process.cwd().endsWith('dashboard')
    ? path.join(process.cwd(), '..')
    : process.cwd());
}

export function paths(override?: string) {
  const root = repoRoot(override);
  return {
    root,
    tracker: path.join(root, 'job_search_tracker.csv'),
    trackerBak: path.join(root, '.job_search_tracker.csv.bak'),
    seenJobs: path.join(root, 'job_scraper', 'seen_jobs.json'),
    salary: path.join(root, 'salary_data.json'),
    applications: path.join(root, 'documents', 'applications'),
    cvOut: path.join(root, 'cv', 'output'),
    coverOut: path.join(root, 'cover_letters', 'output'),
    upskill: path.join(root, 'upskill'),
    profileSkill: path.join(root, '.claude', 'skills', 'job-application-assistant'),
    rootClaudeMd: path.join(root, 'CLAUDE.md'),
  };
}
```

- [ ] **Step 4: Run → PASS.** Run: `npx vitest run test/lib/paths.test.ts`
- [ ] **Step 5: Commit.** `git add dashboard && git commit -m "feat(dashboard): repo path contract lib/paths (M0.3)"`

### Task M0.4: Dark + orange-gold theme tokens & next-themes

**Files:** Modify `dashboard/app/globals.css`, `dashboard/app/layout.tsx`; Create `dashboard/components/theme-provider.tsx`

- [ ] **Step 1:** Write `.dark` token block in `globals.css` exactly as the impl-guide §7 table (orange `--primary: 33 96% 52%`, gold `--accent: 43 96% 56%`, chart ramp `--chart-1..5`). Set `:root` (light) as a tuned bonus.
- [ ] **Step 2:** `theme-provider.tsx` wraps `next-themes` `ThemeProvider` with `attribute="class" defaultTheme="dark" enableSystem={false}`.
- [ ] **Step 3:** In `app/layout.tsx`, wrap children in the provider; self-host fonts via `next/font/local` (no Google Fonts network fetch — REQ-5008).
- [ ] **Step 4 (smoke test):** `test/app/theme.test.tsx` renders the provider and asserts the `dark` class is applied by default.
- [ ] **Step 5: Commit.** `feat(dashboard): dark+gold theme tokens + next-themes (M0.4)`

### Task M0.5: App shell — sidebar + header

**Files:** Create `dashboard/app/(shell)/layout.tsx`, `dashboard/components/shell/Sidebar.tsx`, `dashboard/components/shell/Header.tsx`; init shadcn (`npx shadcn@latest init` then add `button card`).

- [ ] **Step 1:** Init shadcn (owned in-repo) and add `button`, `card`, `sonner` (toaster).
- [ ] **Step 2:** Sidebar nav: Dashboard `/`, Applications `/applications`, Companies `/companies`, Profile `/profile`, Salary `/salary`, Upskill `/upskill`, Console `/console`, Settings `/settings`. Active link uses the orange accent. Semantic `<nav aria-label="Primary">`.
- [ ] **Step 3:** Header: app title, theme toggle, read-only badge slot. `<header>` landmark.
- [ ] **Step 4:** `(shell)/layout.tsx` composes `<Sidebar/> <Header/> <main>{children}</main>`; one `<h1>` per page.
- [ ] **Step 5 (smoke test):** `test/app/shell.test.tsx` asserts all eight nav links render with correct hrefs.
- [ ] **Step 6: Commit.** `feat(dashboard): app shell sidebar+header (M0.5)`

### Task M0.6: Loopback start script (REQ-5000/5008)

**Files:** Create `dashboard/scripts/start.mjs`, `dashboard/lib/config.ts`

- [ ] **Step 1:** `lib/config.ts` reads `--port`(4480), `--read-only`, `--no-open`, `--repo`, plus a `dashboard/.dashboard.local.json` settings file; exposes `getConfig()`.
- [ ] **Step 2:** `start.mjs`: parse flags → find free port from 4480 (increment on EADDRINUSE) → `spawn('npx',['next','start','-H','127.0.0.1','-p',port], {shell:false})` → assert bound host is loopback → print `http://localhost:<port>/` → unless `--no-open`, open browser → forward SIGINT/SIGTERM to child and exit 0.
- [ ] **Step 3 (test):** `test/lib/config.test.ts` asserts flag parsing and that the bind host is hard-coded to `127.0.0.1` (string assertion guarding against a `0.0.0.0` regression).
- [ ] **Step 4: Verify.** `npm run build && npm start` prints a localhost URL; `curl 127.0.0.1:<port>` returns HTML; binding to LAN is impossible (no flag).
- [ ] **Step 5: Commit.** `feat(dashboard): loopback start script + config (M0.6)`

---

## Milestone M1 — Read layer + Applications table (read-only)

*Goal: a view-only dashboard listing tracker rows with filter/search/drawer/PDF preview. Gates: REQ-5001, REQ-5002, REQ-5005. The live CSV is empty — build and test against fixtures.*

### Task M1.0: Test fixtures

**Files:** Create `dashboard/test/fixtures/tracker-empty.csv`, `tracker-small.csv`, `tracker-1000.csv`

- [ ] **Step 1:** `tracker-empty.csv` = header row only (the exact 14 columns).
- [ ] **Step 2:** `tracker-small.csv` = header + ~12 rows covering every status, varied `fit_rating`, dates spanning ~120 days, **one legacy row with an empty `last_updated`**, one row with `cv_file`/`cover_letter_file` pointing at a missing path, one with a URL in `notes`.
- [ ] **Step 3:** `tracker-1000.csv` = 1,000 generated realistic rows (script it inline; dates over 365 days; random statuses/fit).
- [ ] **Step 4: Commit.** `test(dashboard): tracker CSV fixtures (M1.0)`

### Task M1.1: `lib/domain/status.ts` — status machine (TDD)

**Files:** Create `dashboard/lib/domain/status.ts`, `dashboard/test/lib/status.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { STATUSES, ALLOWED_NEXT, MUTED, assertTransition } from '@/lib/domain/status';

describe('status machine', () => {
  it('has the seven canonical statuses', () => {
    expect(STATUSES).toEqual(['Draft','Sent','Interview','Offer','Rejected','Withdrawn','Closed']);
  });
  it('allows Draft→Sent and Sent→Interview', () => {
    expect(() => assertTransition('Draft','Sent')).not.toThrow();
    expect(() => assertTransition('Sent','Interview')).not.toThrow();
  });
  it('allows a no-op (same status)', () => {
    expect(() => assertTransition('Offer','Offer')).not.toThrow();
  });
  it('rejects illegal transitions', () => {
    expect(() => assertTransition('Draft','Offer')).toThrow(/not allowed/i);
    expect(() => assertTransition('Offer','Sent')).toThrow(/terminal|not allowed/i);
  });
  it('marks Rejected/Withdrawn/Closed muted', () => {
    expect(MUTED.has('Rejected')).toBe(true);
    expect(MUTED.has('Draft')).toBe(false);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** exactly per impl-guide §5.1 (STATUSES, ALLOWED_NEXT, MUTED) plus:

```ts
export function assertTransition(from: Status, to: Status): void {
  if (from === to) return;
  if (!ALLOWED_NEXT[from].includes(to)) {
    throw new Error(`Transition ${from} → ${to} is not allowed`);
  }
}
```

- [ ] **Step 4: Run → PASS.**  **Step 5: Commit.** `feat(dashboard): status state machine (M1.1)`

### Task M1.2: `lib/data/tracker.ts` — reader + last_updated migration (TDD)

**Files:** Create `dashboard/lib/data/tracker.ts`, `dashboard/lib/domain/csv.ts`, `dashboard/test/lib/tracker-read.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { readTracker } from '@/lib/data/tracker';

const fix = (n: string) => path.join(__dirname, '..', 'fixtures', n);

describe('readTracker', () => {
  it('returns [] for a missing file', async () => {
    expect(await readTracker('/nope/missing.csv')).toEqual([]);
  });
  it('returns [] for header-only file', async () => {
    expect(await readTracker(fix('tracker-empty.csv'))).toEqual([]);
  });
  it('parses all rows of the small fixture', async () => {
    const rows = await readTracker(fix('tracker-small.csv'));
    expect(rows.length).toBeGreaterThanOrEqual(12);
    expect(rows[0]).toHaveProperty('company');
    expect(typeof rows[0].fit_rating).toBe('number');
  });
  it('defaults last_updated to date for the legacy row (in-memory)', async () => {
    const rows = await readTracker(fix('tracker-small.csv'));
    const legacy = rows.find(r => r._legacyLastUpdated);
    expect(legacy?.last_updated).toBe(legacy?.date);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** with papaparse `header:true`; coerce `fit_rating` to number; if `last_updated` blank set it to `date` and mark `_legacyLastUpdated=true` (non-persisted flag); return `[]` on missing file / parse error (log a warning). Reject BOM/non-UTF-8 with a typed error the page renders as a banner.
- [ ] **Step 4: Run → PASS.**  **Step 5: Commit.** `feat(dashboard): tracker reader + last_updated migration (M1.2)`

### Task M1.3: `lib/domain/filter.ts` — URL ↔ filter state (TDD)

**Files:** Create `dashboard/lib/domain/filter.ts`, `dashboard/test/lib/filter.test.ts`

- [ ] **Step 1: Failing test** — round-trip: `serialize(parse("?q=acme&status=Sent,Offer&fit_min=50")) === "q=acme&status=Sent,Offer&fit_min=50"`; `applyFilter(rows, state)` filters free-text over company/role/notes and structured fields.
- [ ] **Step 2: FAIL → Step 3: Implement** pure `parse`, `serialize`, `applyFilter`. **Step 4: PASS. Step 5: Commit.** `feat(dashboard): filter state (M1.3)`

### Task M1.4: Other readers (TDD-light)

**Files:** Create `dashboard/lib/data/{seen-jobs,salary,applications,upskill,profile}.ts` + one test file per reader.

- [ ] **Step 1:** Each test asserts: missing file → empty/null (no throw); present fixture → parsed shape. `seen-jobs` handles `{seen:[...]}`; `salary` returns `null` when absent (REQ-5014 empty-state); `applications` reads `<company>_<role>/{job_posting.md,outcome.md}`; `upskill` lists `report-*.md` with mtime; `profile` assembles `0{1..7}-*.md` + root `CLAUDE.md`, omitting missing files.
- [ ] **Step 2: FAIL → implement → PASS per reader. Step 3: Commit.** `feat(dashboard): read layer for seen/salary/applications/upskill/profile (M1.4)`

### Task M1.5: Applications table (REQ-5001) — smoke test

**Files:** Create `dashboard/app/(shell)/applications/page.tsx`, `dashboard/components/applications/DataTable.tsx`, `StatusPill.tsx`; `test/app/applications.test.tsx`

- [ ] **Step 1:** Server Component page calls `readTracker()` and passes rows to a client `DataTable` (`@tanstack/react-table`): columns date, company, role, role_type, channel, status (pill), fit_rating (badge/bar), contact_person, cv_file (link), cover_letter_file (link), source (external link). Default sort `date` desc. Muted rows for `MUTED` statuses (opacity + label, **not hidden**).
- [ ] **Step 2:** Empty-state when zero rows: "No applications yet — run `/apply <posting>` to add one." with a button (wired to the console in M4; inert placeholder in M1).
- [ ] **Step 3:** `StatusPill` pairs label + lucide icon (color independence, NFR-0015).
- [ ] **Step 4 (smoke test):** render the page with the small fixture (mock `readTracker`); assert 12 rows render, default sort is date-desc, a muted row has the muted class, the empty fixture shows the empty-state copy.
- [ ] **Step 5: Commit.** `feat(dashboard): applications table (M1.5)`

### Task M1.6: Filter/search bar (REQ-5002) — smoke test

**Files:** Create `dashboard/components/applications/FilterBar.tsx`; wire URL sync in the page.

- [ ] **Step 1:** Free-text input (company/role/notes) + structured controls: status (multi), fit range, role_type, channel, date range. Updates live (no submit). Reflect state in the URL via `useRouter`/`useSearchParams` and `lib/domain/filter`. Keyboard: Tab/Enter/Esc.
- [ ] **Step 2 (smoke test):** typing "acme" filters rows; setting status=Sent narrows; URL query updates; Esc clears.
- [ ] **Step 3: Commit.** `feat(dashboard): applications filter/search bar (M1.6)`

### Task M1.7: Detail drawer + PDF preview (REQ-5005) — smoke test

**Files:** Create `dashboard/components/applications/RowDrawer.tsx`, `dashboard/app/api/file/route.ts`; add shadcn `sheet`/`dialog`.

- [ ] **Step 1:** Clicking a row opens a drawer (shadcn `Sheet`): full record, notes (wrap; auto-link URLs), contact, links to CV/cover/source. If `documents/applications/<company>_<role>/` exists, render parsed `job_posting.md` + `outcome.md`. Missing file → "file not found" badge (call a HEAD on `/api/file`). Esc-dismiss; focus close on open, restore on close; `inert` on `<main>`; preserve list scroll.
- [ ] **Step 2:** `api/file/route.ts` serves PDFs from `cvOut`/`coverOut` only, **path-guarded** (resolve + reject anything outside those dirs / any `..`). 404 → drawer badge.
- [ ] **Step 3 (smoke test):** opening a row shows its fields; a row with a missing cv_file shows the "file not found" badge; Esc closes and restores focus.
- [ ] **Step 4: Commit.** `feat(dashboard): row detail drawer + guarded PDF preview (M1.7)`

---

## Milestone M2 — Write layer

*Goal: full view+edit. Gates: REQ-5003(strip), REQ-5004, REQ-5006, REQ-5007.*

### Task M2.1: `lib/write/tracker.ts` — atomic writer (TDD, highest risk)

**Files:** Create `dashboard/lib/write/tracker.ts`, `dashboard/test/lib/tracker-write.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readTracker } from '@/lib/data/tracker';
import { updateRow, appendRow } from '@/lib/write/tracker';

let dir: string, csv: string;
const HEADER = 'date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated';

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cf-'));
  csv = path.join(dir, 'job_search_tracker.csv');
  await fs.writeFile(csv,
    HEADER + '\n' +
    '2026-05-01,Acme,Tech,Engineer,Full-time,LinkedIn,Draft,,80,note,,,,\n');
});

describe('atomic tracker writer', () => {
  it('updates status and stamps last_updated, leaving other columns intact', async () => {
    await updateRow(csv, 0, { status: 'Sent' });
    const rows = await readTracker(csv);
    expect(rows[0].status).toBe('Sent');
    expect(rows[0].company).toBe('Acme');
    expect(rows[0].last_updated).not.toBe('');     // materialized
  });
  it('rejects an illegal transition without writing', async () => {
    await expect(updateRow(csv, 0, { status: 'Offer' })).rejects.toThrow(/not allowed/i);
    const rows = await readTracker(csv);
    expect(rows[0].status).toBe('Draft');          // unchanged
  });
  it('writes a .bak before replacing', async () => {
    await updateRow(csv, 0, { notes: 'updated' });
    const bak = path.join(dir, '.job_search_tracker.csv.bak');
    expect((await fs.stat(bak)).isFile()).toBe(true);
  });
  it('appends a new row through the same routine', async () => {
    await appendRow(csv, { date: '2026-05-09', company: 'Beta', role: 'PM', status: 'Draft' });
    const rows = await readTracker(csv);
    expect(rows.length).toBe(2);
    expect(rows[1].cv_file).toBe('');              // empty cv/cover on manual append
  });
  it('survives 5 concurrent updates without corrupting the header', async () => {
    await Promise.all([0,0,0,0,0].map(() => updateRow(csv, 0, { notes: 'x' }).catch(() => {})));
    const raw = await fs.readFile(csv, 'utf8');
    expect(raw.split('\n')[0]).toBe(HEADER);       // header intact, file parseable
    expect((await readTracker(csv)).length).toBe(1);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** the 8-step recipe (impl-guide §4): read → `assertTransition` before mutating status → mutate only `status`/`notes`/`last_updated` (append for new) → unparse → write `.tmp.<pid>` → fsync → copy to `.bak` → `rename`. Serialize an in-process mutex so concurrent calls queue (prevents lost updates within the process; cross-process safety comes from atomic rename).
- [ ] **Step 4: Run → PASS.**  **Step 5: Commit.** `feat(dashboard): atomic CSV writer + state-machine guard (M2.1)`

### Task M2.2: Server Actions for mutations

**Files:** Create `dashboard/app/actions/tracker.ts`

- [ ] **Step 1:** `"use server"` `updateRowAction(id, patch)` and `appendRowAction(row)` validate with zod, refuse when read-only (`getConfig().readOnly`), call `lib/write`, `revalidatePath('/applications')` and `'/'`. Return a typed `{ok}|{error}`.
- [ ] **Step 2 (test):** read-only config → action returns `{error:'read-only'}` and does not write (assert file unchanged).
- [ ] **Step 3: Commit.** `feat(dashboard): server actions for tracker writes (M2.2)`

### Task M2.3: Inline status + notes edit (REQ-5004) — smoke test

**Files:** Create `dashboard/components/applications/StatusSelect.tsx`, `NotesCell.tsx`; wire into `DataTable`.

- [ ] **Step 1:** Status `Select` options = current + `ALLOWED_NEXT` only. Notes = expand-on-focus input. Persist on blur/Enter via the Server Action; optimistic UI; `toast('Updated · h:mm')` on success; revert + inline error on failure.
- [ ] **Step 2 (smoke test):** changing status to an allowed value persists + toasts; the dropdown never offers an illegal target; an illegal write rejection reverts the cell.
- [ ] **Step 3: Commit.** `feat(dashboard): inline status/notes edit (M2.3)`

### Task M2.4: + New application (REQ-5006) — smoke test

**Files:** Create `dashboard/components/applications/NewDialog.tsx`; add shadcn `dialog`, `form`.

- [ ] **Step 1:** Dialog with react-hook-form + zod: required date/company/role/status; optional rest; submit → `appendRowAction` (empty cv/cover) → row appears immediately.
- [ ] **Step 2 (smoke test):** submitting with a missing required field is blocked; a valid submit appends and the row shows.
- [ ] **Step 3: Commit.** `feat(dashboard): + New application form (M2.4)`

### Task M2.5: Pipeline strip (REQ-5003) + read-only mode (REQ-5007)

**Files:** Create `dashboard/components/dashboard/PipelineStrip.tsx`, `dashboard/lib/domain/kpi.ts` (+ test); read-only banner in shell.

- [ ] **Step 1 (TDD kpi):** test `kpis(rows)` — `total`, `byStatus` counts, `avgFit30` null when <3 in-window rows, `interviewRate90` = Interview / (Sent+Interview+Offer+Rejected+Withdrawn+Closed) within 90d, null when denom <3. Implement per business-rules §9.5. **PASS.**
- [ ] **Step 2:** Sticky pipeline strip shows per-status counts (terminal muted), respecting active filters.
- [ ] **Step 3:** Read-only mode disables StatusSelect/NotesCell/+New with a visible banner + tooltips.
- [ ] **Step 4 (smoke test):** read-only hides/disables all mutators; counts reflect the filtered slice.
- [ ] **Step 5: Commit.** `feat(dashboard): KPI math + pipeline strip + read-only mode (M2.5)`

---

## Milestone M3 — Dashboard stats (analytics home, REQ-5009)

*Goal: a JobSync-grade analytics home. Every number honest (ARCH-0007).*

### Task M3.1: KPI cards

**Files:** Create `dashboard/app/(shell)/page.tsx`, `dashboard/components/dashboard/KpiCard.tsx`

- [ ] **Step 1:** Home Server Component reads tracker, computes `kpis`. Cards: total; applied 7d/30d (toggle); avg fit 30d; interview rate 90d. `—` when floor unmet.
- [ ] **Step 2 (smoke test):** with <3 in-window rows, avg-fit and interview-rate render `—`; with the 1k fixture they render numbers.
- [ ] **Step 3: Commit.** `feat(dashboard): dashboard KPI cards (M3.1)`

### Task M3.2: Charts (Nivo) — smoke test

**Files:** Create `dashboard/components/dashboard/{WeeklyBar,ActivityCalendar,StatusDonut,FitHistogram,TopCompanies}.tsx` (client wrappers) + `lib/domain/aggregate.ts` (TDD) for the binning math.

- [ ] **Step 1 (TDD aggregate):** test pure aggregators — `byWeek(rows)`, `byDay(rows)` (calendar), `byStatus(rows)`, `fitBuckets(rows)`, `topBy(rows,'company'|'sector')`. Implement with date-fns. **PASS.**
- [ ] **Step 2:** Nivo wrappers consume the aggregates; chart colors use `--chart-*` tokens; **each chart ships an accessible `<table>`/text equivalent** (NFR-0015). Empty data → empty-state, never a fabricated series.
- [ ] **Step 3 (smoke test):** charts render with the 1k fixture; empty fixture shows empty-states; the calendar bins by `date`.
- [ ] **Step 4: Commit.** `feat(dashboard): Nivo charts + aggregation math (M3.2)`

### Task M3.3: Recent activity panel — smoke test

**Files:** Create `dashboard/components/dashboard/RecentPanel.tsx`

- [ ] **Step 1:** Toggle recent applications (by `date`) vs recent status changes (by `last_updated`); rows link to the Applications drawer.
- [ ] **Step 2 (smoke test):** toggle switches the ordering source; rows link correctly.
- [ ] **Step 3: Commit.** `feat(dashboard): recent activity panel (M3.3)`

---

## Milestone M4 — Action layer (operator surface, REQ-5010/5011)

*Goal: drive the CLI from the browser. Security (allowlist, no shell) is the core risk — TDD it.*

### Task M4.1: `lib/run/allowlist.ts` — fixed command table (TDD, highest risk)

**Files:** Create `dashboard/lib/run/allowlist.ts`, `dashboard/test/lib/allowlist.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { buildCommand } from '@/lib/run/allowlist';

describe('command allowlist', () => {
  it('builds /apply as an argv array, never a shell string', () => {
    const argv = buildCommand('apply', { url: 'https://x.co/job', mode: 'quick' });
    expect(argv.bin).toBe('claude');
    expect(Array.isArray(argv.args)).toBe(true);
    expect(argv.args).toContain('-p');
  });
  it('rejects an unknown command', () => {
    expect(() => buildCommand('rm', { x: '1' } as any)).toThrow(/not allowed/i);
  });
  it('rejects an invalid review mode', () => {
    expect(() => buildCommand('apply', { url: 'https://x.co', mode: 'evil;rm -rf' })).toThrow();
  });
  it('passes salary-lookup company as a single argv slot', () => {
    const argv = buildCommand('salary-lookup', { company: 'Beta Corp; rm -rf /' });
    expect(argv.bin).toBe('python3');
    expect(argv.args).toContain('Beta Corp; rm -rf /'); // opaque arg, not a shell fragment
    expect(argv.args).toContain('--json');
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** the `CommandSpec` table (impl-guide §6.1): per-command `validate` (URL/enum/path checks; `mode ∈ {none,quick,full}`) and `build` returning `{bin, args:[]}`. Unknown command throws. **No string concatenation into a shell.**
- [ ] **Step 4: Run → PASS.**  **Step 5: Commit.** `feat(dashboard): action allowlist (M4.1)`

### Task M4.2: `lib/run/spawn.ts` + history (TDD)

**Files:** Create `dashboard/lib/run/spawn.ts`, `dashboard/lib/run/history.ts`, tests.

- [ ] **Step 1: Failing test** — spawn a harmless allowlisted-shaped command against a stub bin (e.g. `python3 -c "print('hi')"` via a test-only spec) and assert: streams stdout chunks; resolves with real exit code; a second concurrent run of the same command type is rejected; `shell:false` is used; a missing bin yields a clear error (not a throw that crashes). History writes a JSON record to a temp `.runs` dir.
- [ ] **Step 2: FAIL → Step 3: Implement** `child_process.spawn(bin,args,{cwd:repoRoot,shell:false})`, an async iterator/emitter over stdout/stderr, per-command-type lock, SIGTERM stop, and `history.append()`/`history.list()` over `dashboard/.runs/*.json`.
- [ ] **Step 4: PASS. Step 5: Commit.** `feat(dashboard): subprocess spawn + run history (M4.2)`

### Task M4.3: `app/api/run/[command]/route.ts` — streaming endpoint

**Files:** Create `dashboard/app/api/run/[command]/route.ts`, `dashboard/app/api/runs/route.ts`

- [ ] **Step 1:** POST validates `command` against the allowlist, refuses in read-only mode, spawns, and returns a streamed `Response` (SSE) of stdout/stderr + a final status/exit-code event. `GET /api/runs` lists history; `POST /api/runs/stop` sends SIGTERM.
- [ ] **Step 2 (integration test):** POST a stub command → receive streamed chunks then a terminal status; read-only → 403; unknown command → 400.
- [ ] **Step 3: Commit.** `feat(dashboard): run route handler with SSE streaming (M4.3)`

### Task M4.4: Console page + per-row re-run + salary lookup + upskill trigger — smoke test

**Files:** Create `dashboard/app/(shell)/console/page.tsx`, `dashboard/components/console/{RunLog,RunList}.tsx`; wire buttons.

- [ ] **Step 1:** Console renders a live terminal log (status/exit/duration) + recent runs from `/api/runs`. Applications row gets `[Re-run /apply]`; the empty-state button opens the console pre-filled. Salary lookup box (REQ-5014) and upskill trigger (REQ-5015) call the run endpoint.
- [ ] **Step 2 (smoke test):** triggering a stub run streams output into the log and records history; missing `claude`/`python3` disables the button with a tooltip (ARCH-0005).
- [ ] **Step 3: Commit.** `feat(dashboard): run console + triggers (M4.4)`

---

## Milestone M5 — Secondary views

*Goal: complete the IA. Gates: REQ-5012–5016. Each view is read-mostly + smoke-tested.*

### Task M5.1: Companies (REQ-5012)
- [ ] Group tracker by `company`; show count, status mix, best fit, sector, salary benchmark if `salary_data.json` present (empty-state otherwise). Smoke test grouping + salary empty-state. Commit.

### Task M5.2: Profile (REQ-5013)
- [ ] Read-only render of `readProfile()` sections; missing files → empty-states. Smoke test. Commit.

### Task M5.3: Salary (REQ-5014)
- [ ] Browse `salary_data.json` (empty-state when absent) + lookup box using the M4 run endpoint, rendering the parsed JSON honestly (incl. "not found"). Smoke test. Commit.

### Task M5.4: Upskill (REQ-5015)
- [ ] List/render `upskill/report-*.md`; trigger `/upskill` via the console; new report appears. Smoke test. Commit.

### Task M5.5: Settings (REQ-5016)
- [ ] Theme toggle (dark default), repo path, default port, read-only toggle; persist to `.dashboard.local.json`; no secrets. Smoke test. Commit.

---

## Milestone M6 — Polish & release gates

### Task M6.1: Accessibility pass (NFR-0015)
- [ ] Run `npm run a11y` (`@axe-core/cli`) against `/`, `/applications`, `/console`; fix to **zero violations**. Verify drawer focus management, keyboard paths, color-independent status pills, chart text equivalents. Commit.

### Task M6.2: Performance check (NFR-0014)
- [ ] With `tracker-1000.csv`: assert usable < 2s start, list renders fast, inline save round-trips quickly. Virtualize the table if needed. Record numbers in `ARCHITECTURE.md`. Commit.

### Task M6.3: No-network + graceful-degradation gates
- [ ] Assert zero non-loopback requests during a full session (manual devtools check + a note in README). Verify: deleting `dashboard/` leaves the CSV + `/apply` intact; missing salary/applications/upskill files show empty-states, not crashes. Add a test that imports every `lib/` module and runs against an empty repo without throwing. Commit.

### Task M6.4: Docs — README + ARCHITECTURE
- [ ] `dashboard/README.md`: what it is, the loopback start command + printed URL, prerequisites (Claude Code CLI authenticated; Python 3.10+; LaTeX for PDFs), the security/privacy model, and the **delete-to-remove guarantee**. `dashboard/ARCHITECTURE.md`: read/write/action layers, file contracts, why file-as-DB (no Prisma), why loopback/no-auth, and any deviations from this plan with rationale. Update root `.gitignore` if needed (build output, `.runs/`, local config). Commit.

### Task M6.5: Test plan sync
- [ ] Confirm `docs/testing/test-plan-tracking-dashboard.md` cases (TC-DBD-140+) are exercised: atomic write, transition enforcement, loopback-only, no-network, subprocess error handling, chart honesty. Commit.

---

## Completion

After all tasks: announce **superpowers:finishing-a-development-branch**, run the full test suite + a11y + perf gates, and present merge options. Each milestone M0–M6 is an independently shippable checkpoint — stop and demo at any milestone boundary.

## Deviations log (fill in during execution)

> Record every place the implementation departs from this plan and why (e.g. table virtualization library, SSE vs ReadableStream, fixture row counts). The plan is the contract; document drift here, not silently.
