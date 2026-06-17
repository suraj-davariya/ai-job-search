# Epic 10 — Competency Expansion (`/expand`) — Design

> **Status:** Approved for build
> **Date:** 2026-06-17
> **Milestone:** v1.1 (Career Development) — completes v1.1 together with Epic 11
> **Canonical spec:** REQ-0050–0055 · ARCH-0010 (Profile Manager → Competency Expander) · business-rules §7

---

## Problem

`/expand` is the remaining unshipped v1.1 command. Today `.claude/commands/expand.md`
is a 7-line stub, yet the dashboard console allowlist already routes it
(`dashboard/lib/run/allowlist.ts:69` → `expand: claudeSlash(() => "/expand")`) — so,
exactly like `/upskill` before this engagement, it is a **command the UI offers but that
does not exist**. This design ships the competency-expansion workflow specified in
REQ-0050–0055 against ARCH-0010, which heals that link with no dashboard change.

## Goals

1. `/expand` scans every available source for competency signals the profile is missing
   (REQ-0050), enriches each via web search — direct lookup **and** inference (REQ-0051),
   and presents a deduplicated, source-traced **competency map** by category (REQ-0052).
2. **Nothing is written without confirmation** (REQ-0053), and writes are **additive
   only** — existing content is never modified or removed, each addition carries a source
   annotation that makes re-runs idempotent (REQ-0054).
3. A closing **expansion report** lists additions per file, sources scanned/skipped, and
   items needing manual review (REQ-0055).

## Non-goals

- `/upskill` (Epic 11, already shipped this engagement).
- `/reset` and interview-prep roleplay (Epic 12).
- Any change to `/setup`, the dashboard, or the demo-domain logic.
- Modifying the static framework files `03-writing-style.md` /
  `06-cover-letter-templates.md` (additive expansion never touches framework rules).

## Key design decision — a full command, not a skill

`/upskill` became a thin command + a dedicated `career-development` skill because Career
Development (ARCH-0040) is its own domain with its own inputs (tracker, prior reports).
`/expand` is different: it is a **Profile Manager** operation — ARCH-0010 lists
"Competency Expander" as a sub-component of the same manager that owns `/setup` and
`/reset`. It reads and writes the **same profile files** as `/setup` and obeys the same
merge discipline (business-rules §7).

**Decision:** implement `/expand` as a **full command file** in the style of `setup.md`
(self-contained stages, hard invariants, REQ→step trace) — no new skill. It shares
`/setup`'s read-before-write, no-fabrication, and human-in-the-loop invariants, and
reuses the additive branch of the Merge Engine (business-rules §7.1) but **never** the
conflicting branch — `/expand` only adds.

## Workflow (maps REQ-0050–0055)

1. **Read the profile first** — load the target profile files so everything already
   present (in any form) is excluded up front. This is the idempotency baseline.
2. **Source scan** (REQ-0050), in order: `documents/cv`, `documents/linkedin`,
   `documents/diplomas`, `documents/references`, the candidate's **GitHub** profile (all
   public repos, pinned + unpinned — READMEs, languages, topics), then other profile URLs
   (portfolio, Kaggle, Google Scholar). Flag anything unreadable instead of guessing.
3. **Web enrichment** (REQ-0051) — for each discovered item, apply **both**:
   - *Direct lookup:* course syllabi, certification skill lists, tool docs (named courses
     and certs are prioritized).
   - *Inference:* reason about the problem domain, required methods, standard toolchains.
4. **Competency map** (REQ-0052) — deduplicated, grouped by category (*Technical —
   Primary*, *Technical — Secondary*, *Domain Knowledge*, *Methods & Practices*,
   *Soft/Behavioral*). Each item records name, source item, and discovery method
   (direct / inference / both). Items already in the profile are removed. The map is
   **printed for review before any write**.
5. **Confirmation** (REQ-0053) — offer `all` / `review` (walk each group) / `skip` /
   skip-specific-groups. No write happens without it.
6. **Additive-only writes** (REQ-0054) — append confirmed items to the right file with a
   source annotation, e.g. `*(Coursera — Deep Learning Specialisation)*`. Behavioral
   signals go to the **Inferred Items** section of `02-behavioral-profile.md`, labeled
   inferred (consistent with `/setup` REQ-0010). Never modify or delete existing content;
   the annotation is what makes the next run idempotent.
7. **Expansion report** (REQ-0055) — additions per file with sources; every source
   scanned with its competency count; skipped sources with reasons; flagged
   ambiguous/partially-readable items.

### Target files (additive only)

| File | What `/expand` may add |
|------|------------------------|
| `01-candidate-profile.md` | Technical skills (primary/secondary), domain knowledge, methods/practices, independent projects — each source-annotated |
| `02-behavioral-profile.md` | Inferred behavioral signals → **Inferred Items** section, labeled inferred |
| `04-job-evaluation.md` | New strong/moderate skill signals where clearly supported by a source |

`03-writing-style.md`, `05-cv-templates.md`, `06-cover-letter-templates.md`,
`07-interview-prep.md`, and `search-queries.md` are **not** written by `/expand`.

## Architecture & constraints

- **Prompt-as-code** (ARCH-0001); verification is grep/trace checks (project convention).
- **Additive-only & idempotent** (REQ-0054, business-rules §7.1/§7.3): source annotations
  are the idempotency key — a competency already present with its annotation is never
  re-proposed.
- **No fabrication** (ARCH-0007): every enrichment claim traces to a real source or is
  labeled an inference; web lookups are real searches with the current year.
- **Human-in-the-loop** (ARCH-0006): the map is reviewed and confirmed before writes.

## Doc-sync obligations (CLAUDE.md contract)

New command ⇒ same change: `docs-site/content/docs/commands/expand.mdx` + meta nav;
README `/expand` "Commands in depth" section, removal from the "Planned" table, roadmap
v1.1 row flipped to complete, badges + directory-tree note updated. No dashboard/demo
change ⇒ parity test unaffected.

## Risks

| Risk | Mitigation |
|------|------------|
| Over-claiming skills from thin signals | Each addition is source-annotated and confirmed; inferences are explicitly labeled; no-fabrication rule is a hard invariant. |
| Duplicate entries on re-run | Read-before-write + source-annotation idempotency key (REQ-0054). |
| Accidentally editing existing content | Additive-only invariant: `/expand` uses only the additive merge branch, never conflicting/replace. |
| GitHub/URL fetch failures | Best-effort scan; unreadable sources are flagged in the report, never fabricated. |

## Acceptance

- `expand.md` is a full command covering REQ-0050–0055 (grep-traceable).
- Additive-only and no-fabrication invariants are stated explicitly.
- README, docs-site, and the directory tree reconciled; docs-site `vitest run` green.
- Dashboard `/expand` console link resolves (no dashboard change).
