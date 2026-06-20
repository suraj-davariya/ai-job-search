# Weblate Setup (managed translation)

CareerForge uses **Weblate** (FOSS, self-hostable, Git round-trip) to manage
translations (ADR-0007). This file documents the repo-side configuration; standing up
the actual Weblate instance is a one-time maintainer/infra step.

## Why Weblate

- Free and open-source; can be self-hosted or run on libre hosting (hosted.weblate.org
  offers free hosting for libre projects). No vendor lock-in — it reads and writes this
  Git repo directly.
- Per-string machine-translation suggestions (the MTPE seeding model, REQ-7005).
- Per-translator contribution stats and credit.

## Components (one per translatable surface)

Configure these components on the Weblate server, all pointing at this repository:

| Component | File mask | Template (source) |
|-----------|-----------|-------------------|
| `careerforge/ui` | `i18n/ui/*/common.json` (and one component per namespace, or a JSON glob) | `i18n/ui/en/common.json` |
| `careerforge/readme` | `i18n/readme/README.*.md` | `README.md` |
| `careerforge/glossary` | `i18n/glossary/*/glossary.md` | `docs-site` glossary source |

- **File format:** *JSON (ICU)* for `ui`; *Markdown* (whole-file) for `readme`/`glossary`.
- **Source language:** `en`. **Languages:** as listed in `_meta/languages.json`.
- **Commit on push back to:** the `i18n/` tree (Weblate opens PRs or commits per project policy).

## Client config

The repo ships a `.weblate` file at the root for the `wlc` CLI. Point its `url` at your
instance and authenticate with `wlc` to pull/push from the command line.

## Staleness

Weblate flags a string "needs editing" when its English source changes, but does not
compute "N commits behind" across files. That gap is covered by our own CI:
`scripts/i18n-parity-check.mjs` (REQ-7006).
