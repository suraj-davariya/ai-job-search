# CareerForge Dashboard

A local-only, dark/orange Next.js dashboard that **reads and atomically writes
your CareerForge files as the single source of truth** — the job tracker CSV,
salary/seen-jobs JSON, generated documents, and upskill reports — and can drive
the framework's CLI commands (`/apply`, `/search`, `/upskill`, salary lookups)
from the browser.

It is an optional companion to the CLI. The tracker CSV stays the source of
truth; deleting this folder leaves your data and the `/apply` pipeline intact
(see **Delete-to-remove** below).

## Quick start

```bash
cd dashboard
npm install
npm run build
npm run serve            # loopback production server (recommended)
```

`npm run serve` wraps `scripts/start.mjs` and prints a copy-friendly URL:

```
  CareerForge dashboard
  ─────────────────────
  Repo:      /path/to/ai-job-search
  Mode:      read/write
  Bound to:  127.0.0.1 (loopback only)

  ▶  http://127.0.0.1:4480/
```

Flags: `--port <n>` (default 4480) · `--read-only` · `--no-open` ·
`--repo <path>` (point at a repo root other than the parent of `dashboard/`).

For development: `npm run dev` (Next dev server, also loopback).

## Prerequisites

- **Node.js 18+** and npm (the dashboard itself).
- **Claude Code CLI**, authenticated — required only for the action layer
  (`/apply`, `/search`, `/upskill`, …). If `claude` isn't on `PATH`, those
  triggers are disabled with a tooltip; viewing/editing still works.
- **Python 3.10+** — required only for salary lookups (`salary_lookup.py`).
  Disabled with a tooltip when absent.
- **LaTeX** (`lualatex`/`xelatex`) — only to *generate* CV/cover PDFs via
  `/apply`; the dashboard previews already-generated PDFs without it.

The view, filter, edit, and analytics features need **none** of the above.

## Security & privacy model

- **Loopback only.** The server binds `127.0.0.1` and asserts it at startup —
  there is no LAN flag. Single-user, no accounts, no auth.
- **No network surface.** No telemetry, no remote images (`remotePatterns: []`),
  no analytics. The only outbound activity is a subprocess **you** explicitly
  trigger. Every in-app `fetch` is same-origin `/api/*`.
- **Allowlisted actions, no shell.** Commands come from a fixed table; arguments
  are validated and passed as an argv **array** with `shell:false`, so user
  input is never interpreted by a shell. PDFs are served only from
  `cv/output/` and `cover_letters/output/`, path-guarded against traversal.
- **Honest by construction.** Real exit codes and stderr are surfaced; KPIs
  below their sample floor render `—`; empty data shows empty-states — never a
  fabricated number or a fake success.
- **No secrets stored.** Settings persist only theme, repo path, port, and the
  read-only flag to a gitignored `.dashboard.local.json`; a stray key/token is
  dropped by the whitelist.
- **Read-only mode** (`--read-only`) disables all edits and actions with a
  visible banner.

## Delete-to-remove guarantee

All product data lives at the **repo root** (`job_search_tracker.csv`,
`salary_data.json`, `documents/`, `upskill/`, the profile skill files). Only
`.runs/` and `.dashboard.local.json` are dashboard-local. **Deleting
`dashboard/` removes the app and nothing else** — your tracker and the `/apply`
pipeline are untouched (ARCH-0005 / NFR-0009).

## Testing

```bash
npm run test        # full unit + integration + smoke suite (vitest)
npm run a11y        # axe-core WCAG audit over the key surfaces
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

Performance baseline (1k rows) is recorded in
[`ARCHITECTURE.md`](./ARCHITECTURE.md).

## How it's built

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the read/write/action layers,
file contracts, and the rationale for file-as-DB and loopback-no-auth.
