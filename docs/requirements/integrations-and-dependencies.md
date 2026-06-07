# Integrations & External Dependencies

> **Purpose:** Documents the external systems, services, and tools that CareerForge depends on, and what each is responsible for.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## 1. AI Orchestration Platform

**What:** A CLI-based AI coding assistant that provides the runtime environment for CareerForge's command and skill system.

**Responsible for:**
- Executing commands defined in the commands directory
- Loading and activating skills based on trigger keywords
- Spawning sub-agents (reviewer agent) with isolated contexts
- Providing web search and web fetch capabilities
- File reading, writing, and editing within the workspace
- User interaction (questions, confirmations, approvals)

**Integration pattern:** CareerForge is structured as a set of command files (Markdown-based prompts) and skill definitions that the platform interprets. The platform provides the tools; CareerForge provides the instructions.

**Configuration:** Settings file controls which tools each skill can access. Example permissions: file operations, Python execution, web access, sub-agent spawning.

---

## 2. LaTeX Distribution

**What:** A typesetting system for producing publication-quality PDF documents.

**Components required:**
- `lualatex` — Compiles CVs (handles fontawesome5 correctly; pdflatex often fails)
- `xelatex` — Compiles cover letters (required by custom class for fontspec/custom fonts)
- `moderncv` package — CV document class (banking style)
- `needspace` package — Prevents page-break orphaning
- Standard LaTeX packages: hyperref, geometry, inputenc, import, fancyhdr, titlesec, textpos, cite, setspace

**Distribution options:** TeX Live (cross-platform), MacTeX (macOS), MiKTeX (Windows)

**Integration pattern:** CareerForge generates .tex files and invokes the compiler via shell commands. The compile-and-inspect loop reads the resulting PDFs for visual verification.

---

## 3. Custom Fonts

**What:** Lato and Raleway font families used by the cover letter template.

**Responsible for:**
- Consistent typography in cover letters
- Professional appearance matching the template design

**Location:** Bundled in `cover_letters/OpenFonts/fonts/` (Lato and Raleway directories)

**Integration pattern:** Referenced via `\fontspec[Path = OpenFonts/fonts/...]` in the LaTeX class file. Fonts must be present at compile time; no system-level installation required.

---

## 4. Web Search API

**What:** The AI platform's web search capability for finding job postings, company information, and learning resources.

**Used by:**
- Job search engine — Finding matching postings across configured portals
- Reviewer agent — Researching target companies
- Drafter agent — Verifying company claims, looking up salary data context
- Upskill — Searching for learning resources
- Expand — Looking up course syllabi and certification content

**Integration pattern:** Invoked via the AI platform's WebSearch tool. Queries are constructed by CareerForge; execution is handled by the platform.

---

## 5. Web Fetch API

**What:** The AI platform's capability to retrieve and parse web page content.

**Used by:**
- Job posting retrieval (URL → structured content)
- Company website and news reading
- GitHub profile and repository scanning
- Course syllabus and certification page reading
- Company claim verification

**Integration pattern:** Invoked via the AI platform's WebFetch tool. URLs are provided by CareerForge; content parsing is handled by the platform.

**Fallback:** When a URL cannot be fetched (some portals block automated access), the user can paste the content directly.

---

## 6. Python Runtime

**What:** Python 3.10+ for running the salary benchmarking tools.

**Components:**
- `salary_lookup.py` — Company salary lookup with fuzzy matching
- `tools/convert_salary_excel.py` — Excel-to-JSON conversion (requires openpyxl)

**Integration pattern:** Invoked via shell commands (`python salary_lookup.py "Company" --json`). Output parsed by the AI agent. The salary tool is optional; absence triggers graceful skip.

**Dependencies:** Standard library only for salary_lookup.py. openpyxl required only for Excel import.

---

## 7. Job Portal CLI Adapters

**What:** TypeScript-based CLI tools that search specific job board websites.

**Runtime:** Bun (JavaScript/TypeScript runtime)

**Architecture:** Each adapter is a self-contained directory with:
- `SKILL.md` — Skill definition for the AI platform
- `cli/` — TypeScript CLI implementation with package.json
- Optional reference documentation

**Integration pattern:** The job search skill invokes adapters as CLI commands. Each adapter accepts search parameters and returns structured results. The pattern is designed for easy extension to new portals.

**Note:** The initial implementation includes adapters for specific job markets. Users in other markets can build equivalent adapters following the same pattern.

---

## 8. Version Control (Git)

**What:** Git for repository management, distribution, and update tracking.

**Responsible for:**
- Repository distribution (fork-and-clone model)
- Framework update propagation (upstream merge)
- Personal data exclusion (.gitignore)
- History tracking for profile evolution

**Integration pattern:** CareerForge is distributed as a git repository. Users fork it, customize their profile, and can pull framework updates from upstream. The .gitignore is carefully tuned to exclude all personal data while tracking framework files.

---

## 9. Tracking Dashboard Runtime

**What:** Bun + Hono + HTMX + Pico.css stack for the localhost-only tracking dashboard (ADR-0005).

**Runtime:** Bun (already required for portal adapters)

**Components:**
- **Hono** — Lightweight web framework; handles routing (list, detail, patch, new-row routes)
- **HTMX** — Inline status update interactions without full-page reload
- **Pico.css** — Minimal semantic CSS for accessible styling (WCAG 2.1 AA target, NFR-0015)
- All assets bundled and served locally (no CDN references per NFR-0017)

**Integration pattern:** Dashboard reads and writes the same `job_search_tracker.csv` that `/apply` appends to. No separate database. Atomic CSV writes per NFR-0016. Dashboard binds to `127.0.0.1` only (NFR-0017).

**Dependencies:** Bun runtime + `hono`, `@hono/node-server`, `htmx.org`, `@picocss/pico` (all bundled, no CDN). See `docs/architecture/adr-0005-tracking-dashboard-stack.md` for full rationale.

---

## Dependency Summary

| Dependency | Required? | Purpose | Fallback |
|------------|-----------|---------|----------|
| AI coding assistant CLI | Yes | Runtime environment | None — core dependency |
| LaTeX (lualatex + xelatex) | Yes | PDF document generation | None — needed for output |
| Python 3.10+ | Optional | Salary tools | Salary step skipped |
| Bun | Optional | Job portal CLI adapters | Web search used directly |
| openpyxl (Python) | Optional | Excel salary import | Manual JSON creation |
| Git | Recommended | Distribution and versioning | Manual file management |
| Internet connectivity | Situational | Web search, fetch, research | Offline for profile/compile |
