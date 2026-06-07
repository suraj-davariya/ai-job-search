# Non-Functional Requirements

> **Purpose:** Specifies performance, accessibility, security, internationalization, and other quality attributes for CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## NFR-0001: Portability
**Priority:** Must
**Description:** CareerForge shall run on any OS that supports the prerequisite tools (AI assistant CLI, Python 3.10+, LaTeX distribution).
**Acceptance Criteria:**
- Works on macOS, Linux, and Windows (via WSL or native)
- No OS-specific dependencies in core workflow
- File paths use relative references within the repository

## NFR-0002: Installation Simplicity
**Priority:** Must
**Description:** A new user shall be able to set up CareerForge in under 15 minutes with clear documentation.
**Acceptance Criteria:**
- Prerequisites documented in SETUP.md
- Job portal CLI tools installable via single package manager command per tool
- No build step required for the core framework

## NFR-0003: Offline Capability
**Priority:** Should
**Description:** Profile management, CV/cover letter editing, and LaTeX compilation shall work without internet access. Only web search, job fetching, and company research require connectivity.
**Acceptance Criteria:**
- /setup Path B and C work offline after initial setup
- LaTeX compilation (lualatex, xelatex) works offline
- /search, /apply (web fetch), /expand (web enrichment), and reviewer research require internet
- Salary lookup works offline (reads local JSON file)

## NFR-0004: Data Privacy
**Priority:** Must
**Description:** All personal data shall remain local to the user's repository. No data shall be transmitted to external services beyond what the AI assistant platform requires.
**Acceptance Criteria:**
- Salary data excluded from version control (.gitignore)
- Personal application outputs (CVs, cover letters) excluded from git
- Document folder contents excluded from git
- Seen jobs registry and tracker excluded from git
- Upskill reports excluded from git
- Only framework files, templates, and configuration committed to repository

## NFR-0005: Idempotency
**Priority:** Must
**Description:** Re-running onboarding and expansion commands with the same inputs shall produce no side effects.
**Acceptance Criteria:**
- /setup Path A: re-running with unchanged documents proposes no changes
- /expand: source annotations prevent re-addition of already-expanded competencies
- /reset followed by /setup produces a clean, complete profile

## NFR-0006: Multi-Language Support
**Priority:** Must
**Description:** CareerForge shall support generating cover letters in the language of the job posting.
**Acceptance Criteria:**
- Language detected from posting content
- Cover letter generated in posting language
- CV always generated in English
- Date formats adjusted for local conventions
- Closing phrases adjusted for local conventions
- Cover letter content feels natural in the target language, not translated

## NFR-0007: Extensibility — Job Portal Adapters
**Priority:** Should
**Description:** New job portal integrations shall be addable without modifying core framework code. The search core is country-agnostic by construction (see DEC-012); no specific portal, country, or locale is referenced in the core layer.
**Acceptance Criteria:**
- Each adapter is a self-contained CLI tool in its own directory under `.agents/skills/` (Plane 2 per ARCH-0008)
- Adapters follow a standard interface pattern (search query in, structured results out)
- Adding a new portal requires only: creating the adapter directory, installing dependencies, and adding search queries
- Core search logic is portal-agnostic
- No country-specific or portal-specific identifiers exist in `requirements/functional-requirements-job-search.md`, `architecture/api-design.md`, or the core search component implementation
- CI lint MAY enforce the prior bullet by grepping for forbidden patterns (e.g., `site:indeed.com`, `site:jobindex.dk`) in core files

## NFR-0008: Document Quality
**Priority:** Must
**Description:** Generated CVs and cover letters shall meet professional publication standards.
**Acceptance Criteria:**
- CV: exactly 2 pages, no orphaned entries, consistent formatting
- Cover letter: exactly 1 page, consistent fonts, visible signature
- All LaTeX compiles without errors
- No spelling or grammar errors in generated content
- Professional typography (Lato/Raleway fonts for cover letter, moderncv blue scheme for CV)

## NFR-0009: Error Handling — Graceful Degradation
**Priority:** Should
**Description:** When optional features are unavailable, the system shall skip them gracefully rather than failing.
**Acceptance Criteria:**
- Missing salary data: salary step silently skipped
- Job portal URL cannot be fetched: workflow uses the paste path (REQ-2001, REQ-1004) — paste is a first-class input per DEC-011, not a fallback
- Configured research-agent model CLI unavailable (e.g., `gemini` not installed): falls back to Claude with a one-line warning (REQ-6001)
- GitHub profile not in profile: source skipped during /expand with note
- Previous upskill report missing: delta section omitted
- Empty document subfolders: reported as "(empty)", not treated as errors
- Dashboard skill removed: `/apply` pipeline continues to function (ARCH-0005)

## NFR-0010: Token Efficiency
**Priority:** Should
**Description:** The system shall minimize AI token consumption through deliberate context management.
**Acceptance Criteria:**
- Files read once are not re-read in subsequent steps
- Reviewer receives drafts inline rather than re-reading files
- Verification checklist runs once at the end, not duplicated by reviewer
- Pre-filtering search results by title/snippet before fetching full pages

## NFR-0011: Version Control Friendliness
**Priority:** Should
**Description:** The repository shall be well-structured for git-based workflows.
**Acceptance Criteria:**
- .gitignore covers all personal/generated data
- Framework files are tracked; user data is not
- Fork-and-customize model: users fork, fill in profile, keep framework updates via upstream merges
- Commit conventions documented

## NFR-0012: Accessibility — Colorblind-Safe
**Priority:** Could
**Description:** Any visual elements in generated documents or terminal output shall be colorblind-safe.
**Acceptance Criteria:**
- Chart colors (if any) use colorblind-safe palettes
- CV uses moderncv's blue scheme (accessible)
- Terminal output uses text labels, not color-only indicators, for fit levels

## NFR-0013: Scalability of Profile Data
**Priority:** Should
**Description:** The profile system shall handle candidates with extensive professional histories without degradation.
**Acceptance Criteria:**
- Supports 10+ roles in experience
- Supports 50+ tracked job applications
- Supports 20+ publications
- Seen jobs registry handles 500+ entries without performance issues
- Relevance-weighted cutting handles large CVs gracefully

## NFR-0014: Tracking Dashboard Performance
**Priority:** Should
**Description:** The tracking dashboard (REQ-5xxx) shall feel instantaneous for the data volumes a single user accumulates over a job search, on a modest developer laptop.
**Acceptance Criteria:**
- Server cold-start to listening socket: under 2 seconds on a 2020-era laptop
- First contentful paint of the list view: under 500ms on a 1,000-row CSV
- Filter and sort interactions: under 100ms perceived latency on the same dataset
- Inline status/notes save: under 250ms round-trip from blur to toast confirmation
- Memory footprint: under 150 MB resident with a 1,000-row CSV loaded

## NFR-0015: Web Accessibility — WCAG 2.1 AA
**Priority:** Should
**Description:** All interactive surfaces in the tracking dashboard (REQ-5xxx) shall meet WCAG 2.1 Level AA. Extends NFR-0012 from terminal/document outputs to the dashboard's HTML surface.
**Acceptance Criteria:**
- Every interactive element is reachable and operable via keyboard alone (Tab, Enter, Esc, arrow keys for the list)
- Visible focus indicator on all focusable elements
- Color contrast ratio ≥ 4.5:1 for body text and ≥ 3:1 for large text / UI components
- Status, filter, and KPI information is never conveyed by color alone (text labels accompany every color cue)
- All form controls have associated `<label>` elements; all images have meaningful `alt` text or are marked decorative
- Semantic landmarks (`<main>`, `<nav>`, `<header>`) so screen readers can navigate
- Verified by automated audit (axe or equivalent) at zero violations in CI

## NFR-0016: Data Integrity — Concurrent CSV Writes
**Priority:** Must
**Description:** Concurrent writes to `job_search_tracker.csv` by the `/apply` pipeline (append-only) and the dashboard (bounded in-place edits) shall never corrupt the file or lose committed changes.
**Acceptance Criteria:**
- Dashboard writes are atomic: tempfile + fsync + rename over the original (per data-architecture §Consistency Rules)
- A reader observing the CSV during a write sees either the pre-write or post-write contents, never a partial file
- A simulated test that interleaves 100 `/apply` appends with 100 dashboard status updates produces a final CSV with exactly 100 new appended rows and the 100 expected status mutations on the targeted rows
- Header row is never duplicated; column count is invariant across all writes
- Backup: the previous CSV contents are retained as `.job_search_tracker.csv.bak` after each dashboard write, overwritten on the next write (single-step undo)

## NFR-0017: Local-Only Network Surface
**Priority:** Must
**Description:** The tracking dashboard shall bind exclusively to the loopback interface and shall make zero outbound network calls. Extends NFR-0004 Data Privacy to the dashboard's network surface.
**Acceptance Criteria:**
- Server binds `127.0.0.1` (and `::1`) only; no flag exists to bind `0.0.0.0` or a LAN address in v1
- All static assets (CSS, fonts, JS including HTMX) are served from the local filesystem with no CDN references
- No analytics, telemetry, error reporting, or external API calls are made by the server or the rendered page
- A full session inspected with `lsof`/Wireshark shows zero non-loopback sockets opened by the dashboard process
- No environment variable, config flag, or build switch can enable a network surface beyond loopback in v1

## NFR-0018: Skill-Scoped Tool Permissions
**Priority:** Must
**Description:** Every skill shall declare its required tools in `SKILL.md` frontmatter `allowed-tools:` (ARCH-0010). The runtime shall reject any tool invocation not listed. Workspace-level overrides live in `.claude/settings.local.json` (Plane 1) or per-adapter `package.json` permissions (Plane 2). A tool call succeeds iff both the skill's `allowed-tools` and the workspace permissions permit it.
**Acceptance Criteria:**
- Each `SKILL.md` in the framework has a non-empty `allowed-tools:` frontmatter field
- A skill attempting to use a tool not in its list is denied at the runtime layer with a clear error
- `.claude/settings.local.json` is the single workspace-wide permission file for Plane 1; its schema is documented in `architecture/security-architecture.md`
- The composition rule is enforced: a tool call succeeds iff both the skill's `allowed-tools` and the workspace `settings.local.json` permit it
- Plane 2 sub-agent skills declare permissions in their own `cli/package.json` (per ADR-0004); workspace permissions still gate the invocation
