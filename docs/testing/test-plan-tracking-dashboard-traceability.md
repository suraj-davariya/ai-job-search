# Tracking Dashboard — Test Traceability (TC-DBD-140+)

Maps the operator-surface test plan (§6 addendum of
[`test-plan-tracking-dashboard.md`](./test-plan-tracking-dashboard.md)) to the
automated tests in `dashboard/test/`. Run with `npm run test` (148 tests),
`npm run a11y`, `npm run typecheck`, `npm run lint`.

## Atomic write & state machine (REQ-5004, NFR-0016)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-140 | `updateRow` changes only status/notes/last_updated; other cols byte-identical | `test/lib/tracker-write.test.ts` — "updates status and stamps last_updated, leaving other columns intact" |
| TC-DBD-141 | Illegal transition rejected, file unchanged | `tracker-write.test.ts` — "rejects an illegal transition without writing"; `test/app/tracker-actions.test.ts` — state-machine error |
| TC-DBD-142 | `.bak` written before rename | `tracker-write.test.ts` — "writes a .bak before replacing" |
| TC-DBD-143 | 5 interleaved writes leave header intact / parseable | `tracker-write.test.ts` — "survives 5 concurrent updates without corrupting the header" |
| TC-DBD-144 | `+ New` append via same writer, empty cv/cover | `tracker-write.test.ts` — "appends a new row…"; `test/app/new-dialog.test.tsx` |

## Loopback & no-network (REQ-5008, NFR-0017)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-145 | Binds 127.0.0.1 only; no LAN flag | **Architectural** — `scripts/start.mjs` (`HOST="127.0.0.1"`, asserted at startup; no bind flag exists) |
| TC-DBD-146 | Zero non-loopback requests in a session | **Static-verified** — `test/lib/degradation.test.ts` + grep: every `fetch()` targets same-origin `/api/*`; manual devtools confirm at release |
| TC-DBD-147 | No external (CDN/font/analytics) origins | **Static-verified** — `next.config.mjs` `remotePatterns:[]`, `poweredByHeader:false`; no external `http(s)://` in runtime source |

## Analytics honesty (REQ-5009, ARCH-0007)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-148 | KPI windows <3 points render `—`, never 0/guess | `test/lib/kpi.test.ts` (null floors); `test/app/kpi-cards.test.tsx` — "renders — …" |
| TC-DBD-149 | Interview rate uses §9.5 denominator (excludes Draft) | `kpi.test.ts` — "computes interview rate over the 90d window" / "…denominator below 3" |
| TC-DBD-150 | Empty CSV → chart empty-states, not fabricated series | `test/app/charts.test.tsx` — "show empty-states instead of fabricating a series" |
| TC-DBD-151 | Calendar bins on `date`; recent panel orders by `last_updated` | `charts.test.tsx` — "calendar table bins by date"; `test/app/recent-panel.test.tsx` — "toggle switches the ordering source" |

## Action layer (REQ-5010, REQ-5011)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-152 | Only allowlisted commands; unknown rejected | `test/lib/allowlist.test.ts` — "rejects an unknown command"; `test/app/run-route.test.ts` — "rejects an unknown command with 400" |
| TC-DBD-153 | shell:false, argv array, metachars opaque | `allowlist.test.ts` — "passes salary-lookup company as a single argv slot"; `test/lib/spawn.test.ts` — "spawns without a shell — metacharacters are literal argv" |
| TC-DBD-154 | 2nd concurrent same-type rejected; stop → SIGTERM | `spawn.test.ts` — "rejects a second concurrent run…" + "stop() terminates… SIGTERM"; `run-route.test.ts` — 409 |
| TC-DBD-155 | Real exit codes/stderr; missing bin disables w/ tooltip | `spawn.test.ts` — non-zero exit + missing-bin error; `test/app/console.test.tsx` — disables when python3/claude missing; `test/lib/bins.test.ts` |
| TC-DBD-156 | History to `.runs/*.json`, never in tracker CSV | `spawn.test.ts` history round-trip; `run-route.test.ts` records history (separate from `lib/write/tracker`) |
| TC-DBD-157 | Action endpoints refuse in read-only | `run-route.test.ts` — "refuses in read-only mode with 403"; `console.test.tsx` — read-only disables triggers |

## Secondary views & degradation (REQ-5012–5016, ARCH-0005)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-158 | Companies/Profile/Salary/Upskill empty-states when sources absent | `test/app/{companies,profile,salary,upskill}.test.tsx` (empty-state cases); `test/lib/degradation.test.ts` |
| TC-DBD-159 | `/api/file` serves only allowlisted dirs; rejects `..` | `test/lib/file-access.test.ts` — path-guard suite (traversal, prefix look-alikes, non-PDF) |
| TC-DBD-160 | Deleting `dashboard/` leaves CSV + `/apply` intact | `degradation.test.ts` (readers resolve repoRoot; only `.runs`/`.dashboard.local.json` are dashboard-local) |

## Accessibility & performance (NFR-0014/0015)

| TC | What | Exercised by |
|----|------|--------------|
| TC-DBD-110/111/112 | Zero axe violations (list, drawer, + New) | `test/a11y/axe.test.tsx` (`npm run a11y`) — list, open drawer, charts/cards, console; color-contrast verified manually vs tokens |
| TC-DBD-114/115 | Color-independent status pills; toast `role="status"` | `axe.test.tsx`; `StatusPill` (text+pill), `components/ui/Toaster` (`role="status" aria-live`) |
| TC-DBD-100/102/103 | Cold-start / interaction / save-round-trip budgets | `test/perf/perf.test.ts` (save <250ms asserted; parse/filter/aggregate proxies) — see `ARCHITECTURE.md` |

## Notes on manual / runtime-only cases

Three §6 cases cannot be asserted in jsdom and are verified architecturally +
at release: **TC-DBD-145** (OS-level LAN bind), **TC-DBD-146** (packet capture),
**TC-DBD-147** (rendered-origin scan). The code paths that make them true are
covered above (loopback const, same-origin fetch, `remotePatterns:[]`). The
lifecycle cases (TC-DBD-001–006) live in `scripts/start.mjs` and are manual QA.
