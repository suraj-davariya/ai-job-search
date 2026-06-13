# Assumptions, Decisions & Open Questions

> **Purpose:** Records all assumptions made during requirements analysis, design decisions taken, and open questions requiring user or stakeholder review.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Assumptions

### ASM-001: Single-User Design
**Assumption:** CareerForge is designed for a single user managing a single professional profile. Multi-user or multi-profile scenarios are out of scope.
**Impact:** Data model, file structure, and .gitignore are all designed for one person's data. If multi-profile support were needed, the file-based data model would need significant restructuring.

### ASM-002: CLI Proficiency
**Assumption:** The target user is comfortable with command-line interfaces, text editors, and version control. No general-purpose GUI is required for v1. A scoped tracking dashboard (REQ-5000–REQ-5008) is the single, deliberate GUI exception — it runs only on `127.0.0.1`, covers tracker review only, and is opt-in. Broader GUIs (cloud-hosted web app, mobile, multi-user) remain out of scope per OQ-003.
**Impact:** All primary interactions happen via CLI commands. The dashboard's network surface is constrained by NFR-0017. A web or desktop GUI beyond the local tracking dashboard would be a separate product.

### ASM-003: English CV, Localized Cover Letters
**Assumption:** CVs are always generated in English, while cover letters match the language of the job posting.
**Impact:** CV template is English-only. Cover letter generation must handle multiple languages naturally (not via translation).

### ASM-004: LaTeX for Document Generation
**Assumption:** LaTeX is the appropriate tool for generating publication-quality CVs and cover letters. The user has (or can install) a LaTeX distribution.
**Impact:** LaTeX is a hard dependency for the application pipeline. Users without LaTeX cannot use /apply. An alternative (HTML/CSS → PDF) was considered but rejected due to typography quality.

### ASM-005: File-Based Data Model
**Assumption:** A file-based data model (Markdown, JSON, CSV) is preferable to a database for this use case because it enables version control, transparency, and easy manual editing.
**Impact:** No database setup required. Trade-off: querying and aggregation are less efficient than with a database, but the data volumes are small enough that this doesn't matter.

### ASM-006: AI Platform Provides Tools
**Assumption:** The AI orchestration platform provides web search, web fetch, file operations, and sub-agent spawning as built-in capabilities. CareerForge provides instructions, not tool implementations.
**Impact:** CareerForge is platform-specific to AI coding assistants that support these capabilities. Porting to a different AI platform would require adapting the command and skill file format.

### ASM-007: Honest Application Strategy
**Assumption:** The user wants honest, well-framed applications rather than aggressive keyword-gaming or claim fabrication. The "no fabrication" rule is a core principle, not an optional setting.
**Impact:** The system will sometimes produce honest "gap acknowledged" statements rather than making stretch claims. Users who want more aggressive positioning would need to modify the writing style rules.

### ASM-008: Job Portal Accessibility
**Assumption:** Most job postings can be accessed via public URLs. Some portals may block automated access.
**Impact:** Fallback mechanism: user pastes job posting text when URL fetch fails. Portal adapter CLIs handle site-specific scraping where needed.

---

## Decisions

### DEC-001: Three Convergent Onboarding Paths
**Decision:** Provide three onboarding paths (documents, CV import, interview) that all converge on the same set of profile files.
**Rationale:** Users have different starting materials. Some have a folder of documents; some have just a CV; some are starting from scratch. All paths produce identical output, so the rest of the system doesn't need to know which path was used.
**Trade-off:** More complex onboarding code, but better user experience and flexibility.

### DEC-002: Drafter-Reviewer Agent Architecture
**Decision:** Use two separate AI agents (drafter + reviewer) rather than a single-pass generation.
**Rationale:** A second agent with a fresh context catches issues that a single pass leaves: missed keywords, weak framing, generic language. The reviewer sees the drafts as a hiring manager would, without the drafter's working assumptions.
**Trade-off:** Higher token consumption per application, but materially better output quality.

### DEC-003: Mandatory PDF Verification
**Decision:** Make PDF compilation and visual inspection a mandatory, non-skippable step in the application pipeline.
**Rationale:** LaTeX page-break decisions are unpredictable. `.tex` files that look correct often produce broken PDFs (orphaned titles, overflowing pages, font mismatches). Catching these before presentation prevents wasted reviewer cycles and user frustration.
**Trade-off:** Every application takes longer due to the compile-inspect-fix loop, but the output is reliably correct.

### DEC-004: Relevance-Weighted Cutting Over Static Priority
**Decision:** When cutting CV content to fit page limits, score each line by relevance/uniqueness/narrative-load rather than applying a fixed section priority order.
**Rationale:** A fixed priority order ("cut oldest education first, then shorten earliest role") produces worse results when an older, lower-priority item is more relevant to the posting than a newer, higher-priority item. Signal-based cutting preserves the most impactful content regardless of section.
**Trade-off:** More complex cutting logic, but better-targeted CVs.

### DEC-005: Token-Efficient Reviewer Dispatch
**Decision:** Pass draft content inline to the reviewer prompt rather than having the reviewer re-read files.
**Rationale:** Saves file-reading tokens and ensures the reviewer sees exactly what the drafter produced (not a potentially stale file).
**Trade-off:** Larger prompt for the reviewer agent, but fewer total tokens consumed.

### DEC-006: Verification Runs Once, Not Twice
**Decision:** The full verification checklist runs once at the end (drafter's Step 6), not during the reviewer step.
**Rationale:** The reviewer focuses on content quality; verification focuses on structural and factual correctness. Running it once avoids duplication and saves tokens.
**Trade-off:** Verification issues are caught later in the pipeline, but since the drafter has final control, this is acceptable.

### DEC-007: Additive-Only Expansion
**Decision:** The /expand command can only add content to profile files, never modify or remove existing content.
**Rationale:** Users should trust that /expand won't break their carefully curated profile. If expansion discovers a conflict with existing data, it's a signal for the user to investigate manually.
**Trade-off:** Some stale data might persist, but user trust is preserved.

### DEC-008: BYO Salary Data
**Decision:** The salary benchmarking system works with user-provided data rather than a built-in salary database.
**Rationale:** Salary data varies by country, profession, union membership, and data source. Providing a built-in database would be either too narrow (one country) or too expensive to maintain. Users bring their best available data.
**Trade-off:** Additional setup step for users who want salary benchmarking. Optional by design.

### DEC-009: Reviewer is opt-out at the application level
**Decision:** The drafter-reviewer split (DEC-002) doubles per-application token cost, which is not always justified — quick drafts for low-stakes applications, follow-up applications to the same employer, or applications under time pressure all benefit from skipping the reviewer or running a lighter mode. The reviewer remains the default, but a per-application flag (`--review=full|quick|none`) allows skipping it.
**Rationale:** Cost-aware operation is a CareerForge differentiator vs. the reference product (per product-overview §Differentiation). Mandatory reviewer doubles tokens; the user should be able to choose.
**Trade-off:** Three modes increase configuration surface and require token estimates per mode. Mitigated by `full` remaining the default.

### DEC-010: Persist learned layout fixes per template
**Decision:** The compile-and-inspect loop (REQ-2053) iterates with LLM-driven fixes for orphans, overflow, and font mismatches. The same fix patterns recur across applications using the same template, so the LLM spends tokens re-deriving them. Persisting `(template-id, issue-signature, fix-snippet)` triples turns later applications into a cache hit on the first attempt.
**Rationale:** Layout-fix memory is a CareerForge differentiator vs. the reference product.
**Trade-off:** Requires a cache file (`.agents/state/layout-fixes.json`) and prune logic; cache may grow over time without prune discipline.

### DEC-011: Manual paste is a first-class input, not a fallback
**Decision:** Reference product framing treats URL-fetch as primary and paste as the failure recovery. In practice, paste is the right choice for any portal that gates access (LinkedIn, internal recruiter forwards, PDFs that the assistant can't fetch), and for any user who wants to feed an already-curated posting without a fetch round-trip. Paste deserves equal billing in REQ language.
**Rationale:** Making paste first-class matches user reality and avoids framing portal blocking as a CareerForge limitation.
**Trade-off:** None — the implementation already supports paste; this is a positioning change in REQ wording.

### DEC-012: Search core is country-agnostic; portals are plugins
**Decision:** The reference product hardcoded Denmark-specific portals (Jobindex, Jobnet, Jobbank, Jobdanmark). CareerForge takes the opposite stance: the search core knows nothing about specific countries or portals; every portal is a plugin implementing a generic provider interface (per ADR-0004). No country-specific code, query construction, or locale assumptions live in the core.
**Rationale:** Country-agnostic core is CareerForge's headline differentiator vs. the reference product.
**Trade-off:** Users get no first-party portal adapters out of the box — they must rely on web-search-via-skill or build their own adapters following the ADR-0004 pattern.

### DEC-013: Two-Plane Skill Architecture
**Decision:** Skills live on two distinct planes. Plane 1 — *Claude Code skills* — are Markdown knowledge files at `.claude/skills/<skill-name>/` that the AI assistant loads into context on trigger keywords. They orchestrate prompts and instructions; they do not run code outside the assistant. Plane 2 — *Sub-agent skills* — are Bun/TypeScript CLI tools at `.agents/skills/<skill-name>/cli/` that the assistant invokes as external commands. Each plane has different permission semantics, different lifecycle, and different testability.
**Rationale:** The reference product collapses both under "skills" in casual language but treats them as separate filesystem trees with separate concerns. Naming them as distinct planes prevents future readers (or the implementer) from putting CLI tools in `.claude/skills/` or putting knowledge files in `.agents/skills/`.
**Trade-off:** Slightly more vocabulary; pays off in implementation clarity.

### DEC-014: SKILL.md as Canonical Skill-Orchestrator Format
**Decision:** Every skill on either plane is anchored by a `SKILL.md` file with mandatory frontmatter (`name`, `description`, `allowed-tools`) and a body that names trigger phrases, lists companion files (if any), and describes the skill's contract. Companion files are numbered (`01-…`, `02-…`) to encode reading order. This is the same convention the reference uses; we adopt it intact so users can move skills between the two products with minimal friction.
**Rationale:** Adopting the reference convention reduces friction for users migrating skills and keeps a stable contract for skill-loading runtimes.
**Trade-off:** Existing skills written without this convention require migration.

### DEC-015: Multi-Model Architecture for Research
**Decision:** CareerForge supports invoking different LLMs for different agent roles. The default drafter and reviewer use Claude. The research agent role MAY be configured to use a different model (e.g., Gemini via headless CLI) when cost, throughput, or breadth-of-context favors it. The configuration lives in the agent's definition file at `.claude/agents/<agent-name>.md` frontmatter (`model:` field).
**Rationale:** Research synthesis is bulkier than drafter/reviewer work. The reference offloads it to Gemini for cost reasons. We adopt the same option without mandating it.
**Trade-off:** Users without a configured alternative LLM CLI fall back to Claude. NFR-0009 handles the missing-CLI case.

### DEC-016: STAR Stubs Are Load-Bearing in Path A
**Decision:** Path A (documents-folder scanning) generates STAR candidate stubs from achievements discovered in CV / LinkedIn / reference letters but does NOT draft full STAR examples (cannot fabricate Situation/Task/Action/Result content without the candidate's first-person memory). Stubs become user homework after onboarding. This pattern lets Path A be both honest (no fabrication) and complete (no missed achievements).
**Rationale:** Bridges the no-fabrication rule with the need for comprehensive interview prep.
**Trade-off:** Users get more "to-do" items post-onboarding. Net result is a richer interview-prep file once the user fleshes out the stubs.

### DEC-017: Reference AI Tooling Explicitly by Name
**Decision:** When generated CVs or cover letters reference the candidate's use of agentic coding or AI tooling, the name of the specific tool used (e.g., **Claude Code**, **Cursor**, **GitHub Copilot**) shall appear by name rather than as a generic "AI assistant" or "agentic tool". This is both a precision rule (clarifies what the candidate actually used) and a hiring-signal rule (interviewers can verify specifics).
**Rationale:** Generic AI mentions are increasingly unhelpful as hiring signal; named tools demonstrate concrete competence.
**Trade-off:** Users using a tool not configured in their profile must update their profile before generation — otherwise the system uses the default ("Claude Code").

### DEC-018: Parity Baseline Plus Differentiators
**Decision:** CareerForge ships ALL of the reference product's four headline differentiators (PDF verification loop, relevance-weighted cutting, drafter-reviewer separation, token-efficient reviewer dispatch) as table-stakes — they are not optional and not subtractive. CareerForge's five named differentiators (country-agnostic core, first-class tracking dashboard, cost-aware reviewer, layout-fix memory, manual-paste as first-class) are deltas *on top of* the parity baseline, not the entire delivery.
**Rationale:** The reference's differentiators are the reason users pick this category of tool over manual workflows. CareerForge cannot win on five deltas alone if it lacks the baseline.
**Trade-off:** Implementation must deliver 4 reference baseline features + 5 deltas = 9 total focus areas. None can be deprioritized.

### DEC-019: Local Tracking Dashboard (retrospective)
**Decision:** CareerForge ships a localhost-only web dashboard over the application tracker CSV in v1 as a deliberate differentiator vs. the reference product. The dashboard is single-user, no-auth, runs only on `127.0.0.1`, and reads/writes the same CSV that `/apply` appends to. Wider GUI scope (cloud, multi-user, mobile, branded site) remains out per OQ-003.
**Rationale:** The reference product tracks applications in CSV alone, leaving users to manage status in spreadsheets. A scoped GUI restricted to localhost and tracker concerns gets visual triage without acquiring a server, auth, or telemetry surface. Decided in the brainstorming round that introduced REQ-5xxx; recorded here for traceability.
**Trade-off:** Introduces Bun + Hono + HTMX + Pico.css as runtime deps for users who use the dashboard. Mitigated by Bun being already required for portal adapters (DEC-012 / ADR-0004) and by graceful degradation (NFR-0009): the dashboard is removable without affecting `/apply`.

---

## Open Questions

### OQ-001: Market-Specific Job Portal Adapters
**Status:** Deferred
**Question:** Which job markets should have first-party portal adapters beyond the generic web search fallback?
**Context:** The initial design includes a pluggable adapter pattern. First-party adapters for specific markets (US: Indeed/Glassdoor, UK: Reed/Totaljobs, etc.) would require per-market development.
**Recommendation:** Ship with the adapter pattern and web search fallback. Let the community build market-specific adapters.

### OQ-002: ATS Optimization
**Status:** Deferred
**Question:** Should CareerForge include any ATS (Applicant Tracking System) optimization features, such as keyword density analysis or formatting for machine parsing?
**Context:** Currently out of scope. The focus is on human-readable, professionally formatted documents. ATS optimization could conflict with quality formatting goals.
**Recommendation:** Keep out of scope for v1. Consider as a separate, optional module in the future.

### OQ-003: GUI Layer
**Status:** Partially Resolved
**Question:** Should a web-based or desktop GUI be provided as an alternative to the CLI?
**Context:** The target user is CLI-comfortable, but a focused GUI for application tracking is a deliberate differentiator vs. the reference product (see DEC-019). Broader GUI scope (general-purpose web app, mobile, multi-user, cloud-hosted) would be a significant development effort and a different product.
**Resolution:**
- **Tracking dashboard — accepted.** Ships in v1 as a localhost-only web UI over the tracker CSV. See REQ-5000–REQ-5008, ADR-0005, and DEC-019.
- **General-purpose / multi-user / cloud-hosted GUI — still deferred.** Any further GUI surface beyond the tracking dashboard is a separate decision.

### OQ-004: Collaborative Features
**Status:** Deferred
**Question:** Should CareerForge support sharing profiles or application materials between users (e.g., for career coaching scenarios)?
**Context:** Currently single-user design. Collaboration would require access control, data sharing protocols, and potentially a server component.
**Recommendation:** Out of scope. The file-based model could support manual sharing via git branches, but no built-in collaboration features are planned.

### OQ-005: Template Marketplace
**Status:** Deferred
**Question:** Should users be able to share and install alternative CV/cover letter templates?
**Context:** Currently ships with one CV template (moderncv/banking) and one cover letter template (custom class). Users can replace these manually.
**Recommendation:** Document how to replace templates. Consider a template directory structure that supports multiple templates in the future.
