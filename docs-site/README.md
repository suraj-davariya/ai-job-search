# CareerForge Docs Site

The public documentation website for CareerForge — a Fumadocs (Next.js) app,
themed to match the `dashboard/`, with live demos of the dashboard's KPIs and
charts running on fictional data. Built from
[`docs/docs-site-build-prompt.md`](../docs/docs-site-build-prompt.md).

This app is **self-contained and removable**: it has its own `package.json`
and imports nothing from `dashboard/` at build time (the demos use *copied*
domain logic, guarded by a parity test). Deleting `docs-site/` affects nothing
else in the repo.

## Commands

```bash
npm install        # once
npm run dev        # local preview → http://localhost:4481
npm run build      # static export → ./out
npx serve out      # serve the static export locally
npm test           # parity test (drift guard) — see below
npm run typecheck  # tsc --noEmit
```

## Deploy targets — `DOCS_BASE_PATH`

One build serves two targets:

| Target | Build command | Serves at |
|--------|--------------|-----------|
| Vercel / any root host | `npm run build` | `/` |
| GitHub Pages (project) | `DOCS_BASE_PATH=/ai-job-search npm run build` | `/ai-job-search/` |

The flag drives `basePath`, `assetPrefix`, and the static search index URL.
No deploy workflow is wired yet — the build is export-ready for either.

## How the live demos stay honest

The demo widgets in `components/demo/` compute with **copies** of the
dashboard's pure domain logic (`components/demo/domain/*` ←
`dashboard/lib/domain/*`) over fictional rows in `demo-data.ts`
(`DEMO_NOW` is pinned so charts render the same forever).

`test/domain-parity.test.ts` imports both the copies and the real dashboard
modules and fails if they ever disagree — so the docs cannot silently drift
from the product. If `dashboard/` is absent, the test skips instead of
failing (removability). CI runs this on every PR touching `docs-site/**` or
`dashboard/lib/domain/**` (`.github/workflows/docs-site.yml`).

**If you change dashboard KPI/chart/status logic:** re-copy the changed file
into `components/demo/domain/`, update the affected MDX page, and run
`npm test`. See "Keeping the Docs Site in Sync" in the root `CLAUDE.md`.

## Editing a page (no engineering required)

Pages are Markdown files in `content/docs/` — edit the text, save, done.
`npm run dev` shows changes live. Sidebar order lives in the `meta.json`
files. Components like `<KpiCardsDemo />` inside the Markdown are the live
demos — leave the tags in place, or move them; they need no configuration.

Writing rules: mentor voice, plain language, define terms on first use, and
never use self-congratulatory marketing words (the build prompt bans
*world-class, elite, best-in-class, cutting-edge, revolutionary, seamless,
blazing* — quality is shown by the demos, not announced).

## Chosen versions

next 16.2.9 · react 19.2.4 · fumadocs-ui/core 16.10.x · fumadocs-mdx 15.0.x ·
tailwindcss 4 · motion 12 · @nivo/* 0.99 · next-themes 0.4 · vitest 3.
Aligned with `dashboard/package.json` wherever the two share a dependency.

## Deviations from the build prompt

- **Import paths**: Fumadocs v16 renamed entry points — `fumadocs-ui/provider`
  → `fumadocs-ui/provider/next`, and the generated source is `@/.source/server`
  (fumadocs-mdx v15) rather than `@/.source`. Same architecture, current names.
- **`source.config.ts` + `.source/`**: generated artifacts land in `.source/`
  (gitignored) — the prompt's folder sketch predates this fumadocs-mdx detail.
- **Nivo theme**: demos pass a small `theme` (muted-foreground axis text,
  token-colored tooltips) where the dashboard uses Nivo defaults — axis labels
  must be readable on the docs' dark surface. Series data and shapes are
  identical to the dashboard's.
- **Status-flow explorer**: the applications-table page adds an interactive
  state-machine demo (driven by the copied `ALLOWED_NEXT`) beyond the
  "static table snapshot" minimum the prompt asked for.
- **Glossary**: per the sync rule, the stale `docs/glossary.md` entry for the
  Tracking Dashboard (referencing superseded ADR-0005) was corrected to
  ADR-0006 before mirroring.
