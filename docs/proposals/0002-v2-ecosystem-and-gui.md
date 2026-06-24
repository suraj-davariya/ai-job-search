# Proposal 0002 — v2.0 Ecosystem & GUI

> **Status:** 🟡 Draft — specs-first, **implementation not started**. Follows the
> repo rule: *reference → insight → docs spec → implementation*. On approval,
> each pillar flips into the formal `requirements/`, `architecture/`, `plan/`,
> and `testing/` docs, then implementation + the mandatory `docs-site/` and
> README sync.
> **Created:** 2026-06-24 · **Updated:** 2026-06-24
>
> **Milestone:** v2.0 (the next milestone after v1.3 — Global Reach & Trust).
> The README roadmap already lists v2.0 as *“Template marketplace, community
> portal adapters, GUI.”* This proposal turns that one-liner into a spec.
>
> **Authoring personas:** Product Architect (Pillars 1–3), Application/Security
> Analyst (marketplace trust + GUI sandboxing), Business Analyst (requirements).

---

## 0. Why this proposal exists

v1.0–v1.3 built a complete, country-agnostic, AI-native job-search framework:
onboarding, search, the drafter-reviewer apply pipeline, the tracking dashboard,
career development, salary, internationalization, and a trust/safety gate. Every
core capability now exists. What does **not** yet exist is the connective tissue
that lets the *community* extend CareerForge without forking it, and a path for
users who will never open a terminal.

Three gaps define v2.0:

1. **Extensions can't be shared.** Templates (CV/cover-letter LaTeX classes),
   evaluation criteria, and locale packs are all designed to be pluggable
   (ADR-0001..0007 and the CLAUDE.md design principles), but there is no
   discovery, distribution, or trust mechanism. A user who writes a great
   German academic-CV template has no way to publish it; a user who wants one
   has no way to find it.
2. **Portal adapters are pluggable in theory, not in practice.** ADR-0004
   defines the adapter interface and ships one example, but there is no
   registry, no contribution conduit, and no quality/safety bar for
   community-contributed adapters.
3. **The terminal is a hard floor.** The product is Claude Code CLI-first by
   design (ARCH-0001 prompt-as-code). That is correct for the engine, but it
   excludes a large share of the global job seekers Pillar 1 (i18n) just opened
   the door to. A thin GUI that drives the same prompt-as-code workflows — never
   replacing them — widens reach without compromising the architecture.

**Non-negotiable constraints carried forward from v1.x:**
- **Privacy-first / local-by-default.** Nothing here may move user data off the
  machine without explicit, per-action consent (ARCH, CLAUDE.md §3).
- **Prompt-as-code stays the core.** The GUI and marketplace are *clients* of
  the existing Markdown workflows, not a reimplementation (ARCH-0001).
- **No fabrication, human-in-the-loop** (ARCH-0006, ARCH-0007) apply unchanged.
- **Country-agnostic by default** (CLAUDE.md §1) — the marketplace must not
  privilege any locale.

---

## Pillar 1 — Extension marketplace & registry (HEADLINE)

**Insight.** CareerForge already has the *plugin boundaries* (templates,
evaluation criteria, locale packs, skills). It lacks the *registry* that turns
boundaries into an ecosystem. The marketplace is a **decentralized, git-native
catalog** — not a hosted SaaS — consistent with file-as-DB (ADR-0001) and
privacy-first. An “extension” is a versioned, signed bundle a user installs into
their own workspace; install is a local file operation, discovery is a fetch of
a public index.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-9001 | **Extension manifest** — a declarative `extension.json` (id, type, version, author, license, locale(s), CareerForge version range, checksums) describing a template / evaluation-criteria pack / locale pack / portal adapter / skill. | Must |
| REQ-9002 | **`/marketplace` command** — search, preview, install, update, and remove extensions from within Claude Code, writing only into the user's workspace. | Must |
| REQ-9003 | **Decentralized index** — a public, git-hosted registry index (a plain JSON/Markdown catalog, no server) the client fetches; anyone can host a mirror or a private index. | Should |
| REQ-9004 | **Integrity & provenance** — every extension carries a checksum and signed author identity; install verifies before writing. Surfaces an unverified-source warning (ties to the v1.3 Provenance work, ADR-0007/REQ-2xxx provenance). | Must |
| REQ-9005 | **Sandboxed install** — installed extensions cannot execute arbitrary code at install time; portal-adapter code runs only under the existing adapter contract (ADR-0004) and its permission model (REQ-6xxx workspace permissions). | Must |
| REQ-9006 | **Locale-neutral discovery** — search ranks by relevance + locale match, never privileging any country; results are filterable by locale, type, and license. | Must |
| REQ-9007 | **Publish flow** — `/marketplace publish` lints a manifest, runs the relevant parity/quality checks, and emits a PR-ready bundle for the community index. | Should |
| REQ-9008 | **Update & pinning** — versions are pinned per workspace; updates are explicit and diffable; rollback is a git revert. | Should |

---

## Pillar 2 — Community portal adapters at scale

**Insight.** ADR-0004 made portals pluggable and shipped one example adapter.
v2.0 makes the *adapter ecosystem* real: a contribution conduit, a conformance
test kit, and a safety/quality bar so a user in any market can pull in an
adapter for their local job board. Adapters are the single most country-specific
surface; this is where “country-agnostic core, community-driven edges” pays off.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-10001 | **Adapter conformance kit** — a fixture-driven test suite any adapter must pass (interface shape, dedup keys, rate-limit etiquette, no-PII-leak, graceful degradation per ARCH-0005). | Must |
| REQ-10002 | **Adapter registry entry** — portal adapters are a first-class marketplace `type` (Pillar 1), with declared coverage (country/region/board) and maintenance status. | Must |
| REQ-10003 | **Safety bar** — adapters declare network destinations; the permission model (REQ-6xxx) gates outbound calls; no adapter may exfiltrate profile data. | Must |
| REQ-10004 | **Contribution conduit** — `docs/development/` guide + scaffolding command (`/scaffold-adapter`) that generates a conformant adapter skeleton with tests. | Should |
| REQ-10005 | **Health & deprecation** — adapters self-report breakage (ties to v1.3 liveness/resilience, REQ-1xxx); stale adapters are flagged in discovery, never silently broken. | Should |

---

## Pillar 3 — Graphical interface (terminal-optional)

**Insight.** The dashboard (Epic 9, ADR-0005/0006) already proves a local,
loopback-only Next.js app can sit over the file-as-DB without violating
privacy. v2.0 extends that surface from *view/edit tracker* to *drive the core
workflows* — run `/setup`, `/search`, `/apply`, `/upskill` from the browser —
so a non-terminal user can complete the full journey. The GUI is a **client of
the prompt-as-code engine**, not a parallel implementation: it shells the same
commands the CLI runs and renders their outputs.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-11001 | **Workflow runner UI** — launch and monitor `/setup`, `/search`, `/apply`, `/upskill`, `/expand` from the existing dashboard, streaming agent output and surfacing human-in-the-loop approval points (ARCH-0006). | Must |
| REQ-11002 | **Loopback-only, no new network surface** — the GUI keeps the dashboard's `127.0.0.1`-only, no-secrets, no-outbound guarantees (ADR-0005, dashboard README security model). | Must |
| REQ-11003 | **Document preview** — render generated CV/cover-letter PDFs and the reviewer's critique inline, with the no-fabrication Provenance panel (v1.3) reused as-is. | Should |
| REQ-11004 | **First-run / install experience** — a guided, OS-aware setup (prerequisites: Claude Code, LaTeX, Bun) for users who have never used a terminal, including a one-command launcher. | Should |
| REQ-11005 | **Fully localized** — the GUI consumes the same `i18n/ui/` catalogs and language registry the dashboard now uses (released vs beta labelling), so it ships in every shipped language from day one (REQ-7xxx). | Must |
| REQ-11006 | **CLI parity, not CLI replacement** — every GUI action maps to a documented command; nothing the GUI does is impossible from the terminal (ARCH-0001). | Must |

---

## Non-functional additions

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-0023 | **Marketplace supply-chain security** — signed manifests, checksum verification on install, explicit unverified-source consent; no install-time code execution. | Must |
| NFR-0024 | **GUI keeps the privacy envelope** — no telemetry, no outbound calls beyond what the underlying command already makes, loopback-only binding. | Must |
| NFR-0025 | **Accessibility** — the GUI meets the same a11y bar as the dashboard (keyboard nav, screen-reader labels, RTL support for the i18n languages). | Should |
| NFR-0026 | **Extension performance** — installing/listing extensions stays responsive offline against a cached index; discovery degrades gracefully when the index is unreachable (ARCH-0005). | Should |

---

## Architecture decisions to author (ADR stubs)

| ADR | Decision to record |
|-----|--------------------|
| ADR-0008 | **Decentralized, git-native extension distribution** — why a hosted SaaS marketplace is rejected in favor of a git-hosted index + local install, and how it preserves file-as-DB and privacy-first. |
| ADR-0009 | **Marketplace trust model** — signing, checksums, provenance surfacing, sandboxing; the threat model for community-contributed code. |
| ADR-0010 | **GUI as a prompt-as-code client** — the GUI extends the existing dashboard process; it shells documented commands and never reimplements workflow logic. Records the chosen runner/streaming approach. |

---

## Summary — what gets created vs amended

**Created (on approval):**
- `requirements/functional-requirements-marketplace.md` (REQ-9xxx),
  `functional-requirements-portal-ecosystem.md` (REQ-10xxx),
  `functional-requirements-gui.md` (REQ-11xxx).
- `architecture/adr-0008-extension-distribution.md`,
  `adr-0009-marketplace-trust.md`, `adr-0010-gui-prompt-as-code-client.md`.
- `plan/` epics: **E-market-1** (registry + `/marketplace`), **E-adapter-2**
  (conformance kit + conduit), **E-gui-1** (workflow runner UI).
- `testing/` test cases (`TC-####`) tracing to each new `REQ-`.
- `docs-site/` pages: a Marketplace section, an “extend CareerForge” guide, and
  GUI screenshots; demo parity updated if any dashboard domain logic changes.

**Amended:**
- `requirements/00-index.md` — register REQ-9/10/11 groups in the ID scheme.
- `architecture/00-index.md` — link the new ADRs.
- ADR-0004 (pluggable portals) — cross-reference the conformance kit.
- ADR-0005/0006 (dashboard) — extend to the GUI runner surface.
- Root `README.md` roadmap — move v2.0 from 💡 Future to 🚧 In progress on
  go-ahead; `dashboard/README.md` + `ARCHITECTURE.md` for the runner surface.

---

## Suggested sequencing

Pillar 1 (marketplace) is the foundation — Pillars 2 and 3 both consume the
registry (adapters are a marketplace type; the GUI installs extensions). So:

1. **E-market-1** — manifest + `/marketplace` + decentralized index + trust
   (REQ-9001/9002/9004/9005, NFR-0023). The thin, highest-leverage slice first.
2. **E-adapter-2** — conformance kit + scaffolding, riding on the registry
   (REQ-10001/10002/10004).
3. **E-gui-1** — workflow runner UI on the existing dashboard, localized
   (REQ-11001/11002/11005/11006). Larger; can run in parallel once the registry
   contract is stable.

Marketplace publish/health and GUI document-preview/first-run are fast-follows
once the spine exists.

---

## Open questions

1. **Signing identity** — what author-identity scheme for REQ-9004 (GPG keys,
   sigstore-style, GitHub identity)? Affects ADR-0009.
2. **Index hosting** — a single canonical community index repo, or fully
   federated from day one? Bias: start canonical, design for federation.
3. **GUI runner mechanics** — does the dashboard shell the Claude Code CLI
   directly, or talk to a local agent process? Affects ADR-0010 and the
   security envelope (NFR-0024).
4. **Scope of v2.0 vs v2.1** — is the GUI (Pillar 3) in the v2.0 cut, or does
   v2.0 ship the ecosystem (Pillars 1–2) and the GUI lands in v2.1? The roadmap
   currently bundles all three under v2.0.
5. **Monetization / licensing** — extensions declare a license (REQ-9001); do
   we constrain to OSI-approved licenses for the canonical index?

---

## What's authored vs pending

- **Authored here:** this proposal — the v2.0 scope, REQ-9/10/11 + NFR-0023..0026
  outlines, ADR-0008..0010 stubs, sequencing, and open questions.
- **Pending on go-ahead:** thread the above into the formal `requirements/`,
  `architecture/`, `plan/`, and `testing/` docs; resolve the open questions;
  then implement Pillar 1 first, with the mandatory `docs-site/` + README sync.
