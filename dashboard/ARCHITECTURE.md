# CareerForge Dashboard — Architecture

> Companion to [`README.md`](./README.md). This document explains how the
> dashboard is built and why. The full layer/contract sections are expanded in
> M6.4; this revision records the M6.2 performance baseline.

## Performance baseline (NFR-0014)

Measured against the 1,000-row fixture (`test/fixtures/tracker-1000.csv`) by
`test/perf/perf.test.ts` (`npm run test`). Numbers are from a local dev machine;
they are CPU/IO proxies, not browser FCP (which needs a live browser we don't
run offline), but they bound every server-side cost on the hot paths.

| Operation | Measured | Budget | Notes |
|-----------|----------|--------|-------|
| `readTracker` parse (1k rows) | ~12 ms | — | papaparse, per request |
| `applyFilter` (1k rows, avg) | ~0.4 ms | — | in-memory, runs on every keystroke |
| KPIs + all chart aggregates (1k) | ~51 ms | — | analytics home, per request |
| `DataTable` SSR render (1k rows) | ~790 ms | < 2 s | `renderToString` proxy; real-browser paint is faster |
| Inline save round-trip (1k rows) | ~42 ms | **< 250 ms** | read → mutate → fsync → `.bak` → atomic rename |

**Conclusions**
- The inline-save round-trip (~42 ms) sits comfortably under the 250 ms NFR
  bound, including the atomic-write fsync.
- All data operations (parse, filter, aggregate) are well under 100 ms, so the
  per-request "re-read from disk" model holds at the 1k-row cap with margin.
- **Table virtualization is not required** at the supported ≤ 1k-row scale: the
  full-table render proxy is ~790 ms server-side and the interactive cost in a
  real browser is lower. If the row cap is ever raised, revisit with
  `@tanstack/react-virtual`.

The perf test asserts the two hard bounds (parse < 500 ms, save < 250 ms) and
generous caps on the rest, so a regression that blows the budget fails CI.
