# ADR-0005: Tracking Dashboard Stack

> **Status:** Accepted
> **Date:** 2026-06-05
> **Decision makers:** Architecture team
> **Supersedes:** N/A
> **Related:** REQ-5000–REQ-5008 (functional-requirements-tracking-dashboard.md), ADR-0001 (file-based data), ADR-0004 (pluggable adapters)

---

## Context

REQ-5xxx introduces a local web dashboard over the existing `job_search_tracker.csv`. The dashboard must:

- Run on `localhost` only — no auth, no server deployment, no remote access (per product-overview Out-of-Scope and NFR-data-privacy)
- Read from and write a bounded subset of columns back to the same append-only CSV that `/apply` writes to (per data-architecture §Consistency Rules)
- Start in under 2 seconds and render under 500ms first contentful paint on a 1k-row CSV
- Make zero outbound network calls — every asset bundled
- Be installable and removable independently of the core framework (per ARCH-0005 Graceful Degradation)
- Stay in the existing prompt-as-code / file-as-DB architecture without introducing a server runtime, database, or build pipeline beyond what the framework already uses

The stack choice is the single biggest commitment the dashboard makes. Options considered:

1. **Bun + Hono + server-rendered HTML + HTMX + Pico.css** — Bun is already in the stack for portal adapters. Hono is a minimal router. HTMX gives interactivity (sort, filter, inline edit) without a SPA framework. Pico.css gives accessible defaults with no class soup.
2. **SvelteKit (static adapter) + Bun** — Full SPA/SSR framework; richer client interactivity. Heavier dep tree, build step, more framework decisions to maintain.
3. **Next.js / React** — Industry-default but introduces React, JSX, node toolchain. Far over the simplicity bar.
4. **Python (Flask/FastAPI) + Jinja + HTMX** — Reuses the salary-tool Python runtime; symmetric with the existing Python tools. But splits the dashboard from Bun, the language already chosen for "user-facing CLI/JS" work, and pulls a second web server into the stack.
5. **Static HTML report (no server)** — A `/dashboard` command that re-renders `tracker_report.html` (or `.md`) from the CSV. Lowest dep cost. Cannot do inline edits or live filtering — fails REQ-5004.

## Decision

Adopt **Bun + Hono + server-rendered HTML + HTMX + Pico.css** as the tracking dashboard stack.

| Layer | Choice | Version constraint |
|-------|--------|-------------------|
| Runtime | Bun ≥ 1.1 | Same Bun the portal adapters use; no new runtime |
| HTTP router | Hono | Minimal, zero-dep, server-rendered HTML primitives |
| Templating | Hono JSX (server-only) or `html` tagged-template literals | No client-side React; SSR strings only |
| Interactivity | HTMX (single `<script>` tag, bundled) | Inline edits, filter, sort over `hx-*` attributes |
| Styling | Pico.css (classless, bundled) | Accessible defaults, dark/light auto, no class soup |
| CSV access | Bun's built-in file API + a minimal CSV parser | No DB, no ORM |

## Rationale

| Factor | Bun+Hono+HTMX | SvelteKit | Next.js | Python+Flask | Static HTML |
|--------|---------------|-----------|---------|--------------|-------------|
| Reuses existing runtime | ✅ Bun already present | ✅ via Bun | ⚠️ node | ❌ second runtime | ✅ none |
| No build step | ✅ Bun runs TS directly | ❌ vite build | ❌ build | ✅ | ✅ |
| Server-rendered (no SPA) | ✅ | ⚠️ SPA-default | ❌ | ✅ | ✅ |
| Inline edits + live filter | ✅ HTMX | ✅ | ✅ | ✅ | ❌ |
| Bundled assets, zero outbound | ✅ trivial | ⚠️ | ⚠️ | ✅ | ✅ |
| Startup latency | ✅ <2s | ⚠️ build cache | ❌ | ✅ | N/A |
| Dep count | ✅ ~3 | ❌ many | ❌ many | ⚠️ ~3 | ✅ 0 |
| Accessibility defaults | ✅ Pico.css | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Honors REQ-5004 inline edits | ✅ | ✅ | ✅ | ✅ | ❌ |
| Honors REQ-5008 no telemetry | ✅ trivial | ⚠️ guard required | ⚠️ guard required | ✅ | ✅ |

**The decisive factor:** Bun is already a load-bearing part of the stack (portal adapters per ADR-0004). Adding the dashboard to the same runtime means zero new prerequisites for users, no second package manager to teach, and no second language for contributors. HTMX delivers the interactivity REQ-5004 requires without dragging in a SPA framework, which would add a build step, hydration logic, and a much larger dep tree — all of which would break NFR-0002 Installation Simplicity.

## Architecture

```
.agents/skills/tracking-dashboard/
├── SKILL.md                    # Skill definition, /dashboard trigger
├── cli/
│   ├── package.json            # Bun deps: hono, htmx (vendored), pico (vendored)
│   ├── index.ts                # Server entry: argparse, port discovery, browser open
│   ├── routes/
│   │   ├── index.tsx           # List view + filter UI (REQ-5001, REQ-5002, REQ-5003)
│   │   ├── row.tsx             # Inline status/notes patch handler (REQ-5004)
│   │   ├── drawer.tsx          # Row detail drawer (REQ-5005)
│   │   └── new.tsx             # Append-new form (REQ-5006)
│   ├── csv/
│   │   ├── read.ts             # Streaming CSV read
│   │   └── write.ts            # Atomic write: tempfile + fsync + rename
│   └── assets/                 # Bundled, served from same origin
│       ├── htmx.min.js
│       ├── pico.min.css
│       └── app.css             # Project-specific overrides
└── url-reference.md            # Localhost URL conventions
```

**Concurrency model:** The dashboard server holds no in-memory state for the tracker; every request re-reads the CSV. Writes go through `csv/write.ts`, which:
1. Reads the current CSV.
2. Mutates only the target row's `status`, `notes`, `last_updated` columns.
3. Writes to a sibling tempfile (`.job_search_tracker.csv.tmp`).
4. `fsync` the tempfile.
5. `rename` over the original (atomic on POSIX; near-atomic on Windows NTFS).

This composes with `/apply`'s append-only writes because rename is atomic — a concurrent appender either reads the pre-rename file or the post-rename file, never a partial one.

## Consequences

- **Positive:**
  - Zero new prerequisites for users (Bun is already required for portal adapters)
  - No build step, no bundler, no hydration — `bun run cli/index.ts` is the entire command
  - Pico.css + semantic HTML give WCAG 2.1 AA defaults essentially for free (covers NFR-0015)
  - HTMX `hx-trigger="blur, keyup[key=='Enter']"` directly maps to the inline-edit acceptance criteria in REQ-5004
  - The dashboard is removable: deleting `.agents/skills/tracking-dashboard/` leaves the CSV intact and `/apply` unaffected (ARCH-0005)
- **Negative:**
  - HTMX has a smaller community than React/Vue/Svelte — contributors must learn the `hx-*` model
  - Server-rendered HTML means no offline-after-load (acceptable; the dashboard isn't a PWA)
  - Bun pinning may diverge across users' machines — call out a version floor in SETUP.md
- **Risks & mitigations:**
  - *Risk:* HTMX's bundled JS goes stale → *Mitigation:* pin the vendored version in `assets/htmx.min.js` and re-vendor on deliberate review only
  - *Risk:* Hono major-version churn → *Mitigation:* lock with `bun.lockb`; Hono is small enough to fork if abandoned
  - *Risk:* Port conflict on default `4480` → *Mitigation:* REQ-5000 already requires next-free-port fallback

## Out of Scope for this ADR

- **Auth, multi-user, LAN bind.** Hard-excluded by product-overview Out-of-Scope and NFR-0017. The server binds `127.0.0.1` only.
- **Persistent server / daemon.** Lifecycle is foreground-only (REQ-5000); a background-daemon variant is a separate decision.
- **Analytics, telemetry, error reporting.** Explicitly prohibited by REQ-5008.
- **Mobile/responsive design.** Desktop-first; basic responsiveness is a Pico.css freebie, but mobile-first is not a goal.
